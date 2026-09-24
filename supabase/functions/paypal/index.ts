// PayPal checkout for ML Group. The browser never sends a price: the amount always comes
// from the order row that place_order() priced on the server.
//   { action: 'create',  orderId }  -> creates a PayPal order for that store order
//   { action: 'capture', orderId }  -> captures it and marks the store order paid
//   { action: 'cancel',  orderId }  -> buyer closed PayPal: restock and cancel if still unpaid
//   { action: 'ping' }              -> checks the PayPal credentials
const SB_URL = Deno.env.get('SUPABASE_URL')!;
const SB_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
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
async function pp(path: string, method = 'GET', body?: unknown) {
  const c = await paypalCreds();
  const r = await fetch(`${c.base}${path}`, { method, headers: { Authorization: `Bearer ${await token()}`, 'Content-Type': 'application/json', Prefer: 'return=representation' }, body: body ? JSON.stringify(body) : undefined });
  const j = await r.json().catch(() => ({}));
  return { ok: r.ok, status: r.status, j };
}
async function getOrder(id: string) {
  if (!/^[0-9a-f-]{36}$/i.test(id || '')) throw new Error('Bad order');
  const rows = await db(`orders?id=eq.${id}&select=*`);
  if (!rows.length) throw new Error('Order not found');
  return rows[0];
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  try {
    const { action, orderId } = await req.json();
    if (action === 'ping') { await token(); return json({ ok: true, env: (await paypalCreds()).base }); }
    const o = await getOrder(orderId);
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

    if (action === 'cancel') {
      if (!o.paid_at) await db('rpc/paypal_release', { method: 'POST', body: JSON.stringify({ p_id: o.id }) });
      return json({ ok: true });
    }
    throw new Error('Unknown action');
  } catch (e) {
    return json({ error: (e as Error).message }, 400);
  }
});
