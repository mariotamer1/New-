// PayPal checkout for ML Group. The browser never sends a price: the amount always comes
// from the order row that place_order() priced on the server.
//   { action: 'create',  orderId }  -> creates a PayPal order for that store order
//   { action: 'capture', orderId }  -> captures it and marks the store order paid
//   { action: 'cancel',  orderId }  -> buyer closed PayPal: restock and cancel if still unpaid
//   { action: 'refund',  orderId, amount? } -> admin only: refunds the amount given, or all that is left
//   { action: 'customer_cancel', orderId } -> customer cancel: only if not shipped / no tracking; full refund if paid
//   { action: 'ping' }              -> checks the PayPal credentials
const SB_URL = Deno.env.get('SUPABASE_URL')!;
const SB_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const SB_ANON = Deno.env.get('SUPABASE_ANON_KEY')!;
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });

async function db(path: string, init: RequestInit = {}) {
  const r = await fetch(`${SB_URL}/rest/v1/${path}`, { ...init, headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=representation', ...(init.headers || {}) } });
  const t = await r.text();
  if (!r.ok) throw new Error(`db ${r.status}: ${t}`);
  return t ? JSON.parse(t) : null;
}

let creds: { id: string; secret: string; base: string } | null = null;
async function paypalCreds() {
  if (creds) return creds;
  const rows: { name: string; value: string }[] = await db('app_secrets?select=name,value&name=like.paypal_*');
  const v = Object.fromEntries(rows.map((r) => [r.name, r.value]));
  creds = { id: v.paypal_client_id, secret: v.paypal_secret, base: v.paypal_env === 'sandbox' ? 'https://api-m.sandbox.paypal.com' : 'https://api-m.paypal.com' };
  return creds;
}
async function token() {
  const c = await paypalCreds();
  const r = await fetch(`${c.base}/v1/oauth2/token`, { method: 'POST', headers: { Authorization: 'Basic ' + btoa(`${c.id}:${c.secret}`), 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'grant_type=client_credentials' });
  const j = await r.json();
  if (!r.ok) throw new Error('PayPal login failed: ' + (j.error_description || r.status));
  return j.access_token as string;
}
async function pp(path: string, method = 'GET', body?: unknown, extra: Record<string, string> = {}) {
  const c = await paypalCreds();
  const r = await fetch(`${c.base}${path}`, { method, headers: { Authorization: `Bearer ${await token()}`, 'Content-Type': 'application/json', Prefer: 'return=representation', ...extra }, body: body ? JSON.stringify(body) : undefined });
  const j = await r.json().catch(() => ({}));
  return { ok: r.ok, status: r.status, j };
}
async function getOrder(id: string) {
  if (!/^[0-9a-f-]{36}$/i.test(id || '')) throw new Error('Bad order');
  const rows = await db(`orders?id=eq.${id}&select=*`);
  if (!rows.length) throw new Error('Order not found');
  return rows[0];
}

async function isAdmin(req: Request) {
  const auth = req.headers.get('authorization') || '';
  const r = await fetch(`${SB_URL}/rest/v1/rpc/is_admin`, { method: 'POST', headers: { apikey: SB_ANON, Authorization: auth, 'Content-Type': 'application/json' }, body: '{}' });
  return r.ok && (await r.json()) === true;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  try {
    const { action, orderId, amount } = await req.json();
    if (action === 'ping') { await token(); return json({ ok: true, env: (await paypalCreds()).base }); }
    let o = await getOrder(orderId);

    if (action === 'customer_cancel') {
      // The shipped / tracking check and the cancel happen together inside the database (row lock),
      // so a refund can never run for an order that is shipped or has a tracking number.
      const result = await db('rpc/customer_cancel_guarded', { method: 'POST', body: JSON.stringify({ p_id: o.id }) });
      if (result === 'shipped') return json({ status: 'shipped' });
      o = await getOrder(orderId);
      let refunded = 0;
      if (result === 'cancelled' && o.payment === 'paypal' && o.paid_at && o.paypal?.captureId) {
        const refunds: { id: string; status: string; amount: string; at: string }[] = o.paypal.refunds || (o.paypal.refund ? [o.paypal.refund] : []);
        const cents = (v: unknown) => Math.round(Number(v) * 100);
        const done = refunds.filter((r) => !['FAILED', 'CANCELLED'].includes(r.status)).reduce((t, r) => t + cents(r.amount), 0);
        const left = cents(o.paypal.amount || o.total) - done;
        if (left > 0) {
          const value = (left / 100).toFixed(2);
          const r = await pp(`/v2/payments/captures/${o.paypal.captureId}/refund`, 'POST',
            { amount: { currency_code: 'USD', value }, note_to_payer: `Refund for cancelled ML Group order #${o.number}` },
            { 'PayPal-Request-Id': `cust-cancel-${o.id}` });
          if (!r.ok) {
            await db(`orders?id=eq.${o.id}`, { method: 'PATCH', body: JSON.stringify({ notes: `${o.notes || ''}\nCUSTOMER CANCELLED — AUTOMATIC REFUND FAILED, refund manually.`.trim() }) });
            return json({ status: 'cancelled', refundError: true, total: Number(o.total).toFixed(2) });
          }
          const refund = { id: r.j.id, status: r.j.status, amount: r.j.amount?.value || value, at: new Date().toISOString() };
          const { refund: _old, ...rest } = o.paypal;
          await db(`orders?id=eq.${o.id}`, { method: 'PATCH', body: JSON.stringify({ paypal: { ...rest, refunds: [...refunds, refund] } }) });
          refunded = left / 100;
        }
      }
      return json({ status: result === 'already' ? 'already' : 'cancelled', paid: !!o.paid_at, refunded: refunded.toFixed(2), total: Number(o.total).toFixed(2) });
    }

    if (o.payment !== 'paypal') throw new Error('This order is not a PayPal order.');

    if (action === 'create') {
      if (o.paid_at) throw new Error('This order is already paid.');
      if (o.status === 'cancelled') throw new Error('This order was cancelled. Please check out again.');
      const r = await pp('/v2/checkout/orders', 'POST', {
        intent: 'CAPTURE',
        purchase_units: [{
          reference_id: String(o.number), custom_id: o.id, invoice_id: `MLG-${o.number}-${Date.now()}`,
          description: `ML Group order #${o.number}`,
          amount: { currency_code: 'USD', value: Number(o.total).toFixed(2) },
        }],
        application_context: { brand_name: 'ML Group', shipping_preference: 'NO_SHIPPING', user_action: 'PAY_NOW' },
      });
      if (!r.ok) throw new Error('PayPal could not start the payment. ' + (r.j.message || r.status));
      await db(`orders?id=eq.${o.id}`, { method: 'PATCH', body: JSON.stringify({ paypal: { orderId: r.j.id } }) });
      return json({ id: r.j.id });
    }

    if (action === 'capture') {
      if (o.paid_at) return json({ ok: true, already: true });
      const ppId = o.paypal?.orderId;
      if (!ppId) throw new Error('No PayPal payment was started for this order.');
      let r = await pp(`/v2/checkout/orders/${ppId}/capture`, 'POST', {});
      if (!r.ok && r.j?.details?.[0]?.issue === 'ORDER_ALREADY_CAPTURED') r = await pp(`/v2/checkout/orders/${ppId}`);
      if (!r.ok) throw new Error(r.j?.details?.[0]?.description || r.j.message || 'PayPal could not complete the payment.');
      const cap = r.j.purchase_units?.[0]?.payments?.captures?.[0];
      const paidOk = r.j.status === 'COMPLETED' && cap && cap.status === 'COMPLETED' && cap.amount?.currency_code === 'USD' && Math.abs(Number(cap.amount.value) - Number(o.total)) < 0.005;
      if (!paidOk) throw new Error('The PayPal payment did not complete. You have not been charged.');
      await db(`orders?id=eq.${o.id}`, { method: 'PATCH', body: JSON.stringify({ paid_at: new Date().toISOString(), paypal: { orderId: ppId, captureId: cap.id, amount: cap.amount.value, payer: r.j.payer?.email_address || null } }) });
      return json({ ok: true });
    }

    if (action === 'refund') {
      if (!(await isAdmin(req))) return json({ error: 'Not allowed' }, 403);
      if (!o.paid_at || !o.paypal?.captureId) throw new Error('This order was not paid through PayPal, so there is nothing to refund automatically.');
      // Full or partial refunds; several partial refunds can add up to the amount paid.
      const refunds: { id: string; status: string; amount: string; at: string }[] = o.paypal.refunds || (o.paypal.refund ? [o.paypal.refund] : []);
      const cents = (v: unknown) => Math.round(Number(v) * 100);
      const paidCents = cents(o.paypal.amount || o.total);
      const doneCents = refunds.filter((r) => !['FAILED', 'CANCELLED'].includes(r.status)).reduce((t, r) => t + cents(r.amount), 0);
      const leftCents = paidCents - doneCents;
      const wantCents = amount == null || amount === '' ? leftCents : cents(amount);
      if (leftCents <= 0) throw new Error('This order has already been fully refunded.');
      if (!Number.isFinite(wantCents) || wantCents <= 0) throw new Error('Enter a refund amount greater than $0.');
      if (wantCents > leftCents) throw new Error(`You can refund at most $${(leftCents / 100).toFixed(2)} on this order.`);
      const value = (wantCents / 100).toFixed(2);
      // Same request id on a double tap, so the same refund can never be sent twice.
      const r = await pp(`/v2/payments/captures/${o.paypal.captureId}/refund`, 'POST',
        { amount: { currency_code: 'USD', value }, note_to_payer: `Refund for ML Group order #${o.number}` },
        { 'PayPal-Request-Id': `refund-${o.id}-${refunds.length}-${wantCents}` });
      if (!r.ok) throw new Error(r.j?.details?.[0]?.description || r.j.message || 'PayPal could not refund this payment.');
      const refund = { id: r.j.id, status: r.j.status, amount: r.j.amount?.value || value, at: new Date().toISOString() };
      const list = refunds.some((x) => x.id === refund.id) ? refunds : [...refunds, refund];
      const { refund: _old, ...rest } = o.paypal;
      await db(`orders?id=eq.${o.id}`, { method: 'PATCH', body: JSON.stringify({ paypal: { ...rest, refunds: list } }) });
      return json({ ok: true, refund, refundedTotal: ((doneCents + wantCents) / 100).toFixed(2) });
    }

    if (action === 'cancel') {
      if (!o.paid_at) await db('rpc/paypal_release', { method: 'POST', body: JSON.stringify({ p_id: o.id }) });
      return json({ ok: true });
    }
    throw new Error('Unknown action');
  } catch (e) {
    return json({ error: (e as Error).message }, 400);
  }
});
