// Barcode scanner for the admin product editor. Built as its own bundle (assets/scanner.js)
// and loaded only when the admin taps SCAN. Opens the phone's back camera, reads a UPC/EAN
// barcode, closes itself and hands back the digits.
import { BrowserMultiFormatReader } from '@zxing/browser';
import { BarcodeFormat, DecodeHintType } from '@zxing/library';

const FORMATS = [BarcodeFormat.UPC_A, BarcodeFormat.UPC_E, BarcodeFormat.EAN_13, BarcodeFormat.EAN_8, BarcodeFormat.CODE_128];

function open({ onResult, onError } = {}) {
  const wrap = document.createElement('div');
  wrap.className = 'scan-overlay';
  wrap.innerHTML = `<video playsinline muted autoplay></video><div class="scan-frame"></div>
    <p class="scan-hint">Point your camera at a barcode</p>
    <button class="scan-btn scan-close" type="button" aria-label="Close scanner"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>
    <button class="scan-btn scan-flash" type="button" aria-label="Turn on flash" aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2 4 14h7l-1 8 9-12h-7z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M3 3l18 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" data-slash/></svg></button>`;
  document.body.appendChild(wrap);
  const video = wrap.querySelector('video');
  let controls = null, stream = null, done = false, raf = 0;

  const close = () => {
    done = true;
    cancelAnimationFrame(raf);
    try { controls && controls.stop(); } catch {}
    try { stream && stream.getTracks().forEach((t) => t.stop()); } catch {}
    wrap.remove();
  };
  const found = (text) => {
    if (done) return;
    const digits = String(text || '').replace(/\D/g, '');
    if (digits.length < 6) return;
    if (navigator.vibrate) navigator.vibrate(60);
    close();
    onResult && onResult(digits);
  };
  wrap.querySelector('.scan-close').onclick = close;
  // Flash / torch: works where the phone's browser allows it (most Android phones, newer iPhones).
  let torch = false;
  wrap.querySelector('.scan-flash').onclick = async (e) => {
    const b = e.currentTarget;
    const track = (video.srcObject && video.srcObject.getVideoTracks && video.srcObject.getVideoTracks()[0]) || null;
    const caps = track && track.getCapabilities ? track.getCapabilities() : {};
    if (!track || !caps.torch) { hint('Flash isn’t available on this phone’s browser'); return; }
    try {
      torch = !torch;
      await track.applyConstraints({ advanced: [{ torch }] });
      b.classList.toggle('on', torch); b.setAttribute('aria-pressed', torch); b.setAttribute('aria-label', torch ? 'Turn off flash' : 'Turn on flash');
    } catch { torch = !torch; hint('Flash couldn’t be turned on'); }
  };
  const hintEl = wrap.querySelector('.scan-hint');
  const hint = (msg) => { hintEl.textContent = msg; clearTimeout(hint.t); hint.t = setTimeout(() => { hintEl.textContent = 'Point your camera at a barcode'; }, 2500); };

  (async () => {
    try {
      // Native detector where the browser has one (Android Chrome); otherwise ZXing (iPhone Safari).
      if ('BarcodeDetector' in window) {
        const kinds = await window.BarcodeDetector.getSupportedFormats().catch(() => []);
        const want = ['upc_a', 'upc_e', 'ean_13', 'ean_8', 'code_128'].filter((k) => kinds.includes(k));
        if (want.length) {
          stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false });
          video.srcObject = stream; await video.play();
          const det = new window.BarcodeDetector({ formats: want });
          const tick = async () => {
            if (done) return;
            try { const r = await det.detect(video); if (r && r[0]) return found(r[0].rawValue); } catch {}
            raf = requestAnimationFrame(tick);
          };
          tick();
          return;
        }
      }
      const hints = new Map([[DecodeHintType.POSSIBLE_FORMATS, FORMATS], [DecodeHintType.TRY_HARDER, true]]);
      const reader = new BrowserMultiFormatReader(hints, { delayBetweenScanAttempts: 80 });
      controls = await reader.decodeFromConstraints({ video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false }, video, (res) => { if (res) found(res.getText()); });
      if (done) controls.stop();
    } catch (e) {
      close();
      const msg = e && e.name === 'NotAllowedError' ? 'Camera access was blocked. Allow camera access for this site in your phone settings, then try again.' : 'The camera could not be opened on this device.';
      onError && onError(msg);
    }
  })();
  return close;
}

window.MLScanner = { open };
