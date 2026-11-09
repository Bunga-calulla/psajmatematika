/*
  FRACTION (global) — mengubah penulisan pecahan "a/b" menjadi pecahan bersusun
  (pembilang di atas, garis lurus, penyebut di bawah) di SEMUA modul:
  Persentase, Geometri, Trigonometri, Peluang, SPLDV, Statistik, dll.

  File ini menggantikan js/trig-fraction.js yang lama (nama file sama,
  jadi index.html TIDAK perlu diubah).

  Cara kerja:
  - Memindai teks di halaman dan otomatis mengubah pecahan yang muncul
    belakangan (hasil simulator, kuis, pembahasan, dll.).
  - Teks asli "a/b" tetap tersimpan (disembunyikan), jadi skrip lain yang
    membaca textContent tidak terganggu.
  - Tidak mengubah "Soal 1/6", "Skor 4/6", "Pelanggan 1 / 5", "3/10 latihan",
    satuan (m/s, km/jam, Rp2.500/km), pilihan kata (Masuk / Daftar,
    untung/rugi) dan daftar angka seperti "30 / 40 / 60 cm".
  - Untuk melewati suatu elemen, beri atribut data-no-frac.

  Untuk menonaktifkan: hapus baris <script src="js/trig-fraction.js"> di index.html.
*/
(function () {
  'use strict';

  /* ---------- CSS ---------- */
  const css = `
.tfrac{display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;
  margin:0 .06em;line-height:1.2;text-align:center;white-space:nowrap}
.tfrac-n{padding:0 .22em .08em;border-bottom:.095em solid currentColor}
.tfrac-d{padding:.08em .22em 0}
.tfrac-s{display:none}
.tfrac .tfrac{font-size:.85em}
`;
  if (typeof document !== 'undefined' && document.head) {
    const st = document.createElement('style');
    st.setAttribute('data-trig-fraction', '');
    st.textContent = css;
    document.head.appendChild(st);
  }

  /* ---------- aturan pengenalan operand ---------- */
  const FN = '(?:sin|cos|tan|cot|sec|csc)';
  const WORDS = ['depan', 'samping', 'miring', 'tinggi', 'jarak'];
  const RUN = /[0-9A-Za-zθπ√²°|.,]/;
  const RE_FNNAME = new RegExp('^\\d*' + FN + '²?$');
  const RE_FNARG = new RegExp('^\\d*' + FN + '²?(?:\\s[A-Za-zθ]|[A-Za-zθ]|\\s\\d+°?)$');
  const RE_CALLNAME = /^[A-Za-z]$/;                    // n(A), P(B), f(x)

  function validOperand(t) {
    if (!t) return false;
    if (/^\d+(?:[.,]\d+)?°?$/.test(t)) return true;              // 3, 20, 360°
    if (/^\d+(?:\.\d{3})+$/.test(t)) return true;                // 24.000, 160.000
    if (/^\d*(?:√\d+(?:[.,]\d+)?|π)$/.test(t)) return true;      // √3, π, 2π
    if (/^\d*[A-Za-zθ]$/.test(t)) return true;                   // x, h, 2x
    if (/^\|[A-Za-z]\|$/.test(t)) return true;                   // |B|
    if (WORDS.indexOf(t) > -1) return true;                      // depan, miring, ...
    if (RE_FNARG.test(t)) return true;                           // sin x, cos²x, tan a
    return false;
  }

  function leftOperand(s, slash, lowest) {
    let e = slash;
    if (s[e - 1] === ' ') e--;
    if (e <= lowest) return null;

    if (s[e - 1] === ')') {
      let d = 0, p = e - 1;
      for (; p >= lowest; p--) {
        if (s[p] === ')') d++;
        else if (s[p] === '(') { d--; if (d === 0) break; }
      }
      if (p < lowest) return null;
      let q = p;
      while (q > lowest && /[A-Za-z²]/.test(s[q - 1])) q--;
      if (q < p) {                                     // pemanggilan fungsi, mis. sin(x), n(A)
        const name = s.slice(q, p);
        if (!RE_FNNAME.test(name) && !RE_CALLNAME.test(name)) return null;
        return { start: q, text: s.slice(q, e) };
      }
      return { start: p, text: s.slice(p + 1, e - 1) };
    }

    let a = e;
    while (a > lowest && RUN.test(s[a - 1])) a--;
    while (a < e && /[.,]/.test(s[a])) a++;
    let text = s.slice(a, e);

    if (/^(?:[A-Za-zθ]|\d+°?)$/.test(text) && a - 1 >= lowest && s[a - 1] === ' ') {
      let r = a - 1;
      while (r > lowest && /[0-9A-Za-z²]/.test(s[r - 1])) r--;
      if (RE_FNNAME.test(s.slice(r, a - 1))) { a = r; text = s.slice(a, e); }
    }
    if (!validOperand(text)) return null;
    return { start: a, text: text };
  }

  function rightOperand(s, slash) {
    let b = slash + 1;
    if (s[b] === ' ') b++;
    if (b >= s.length) return null;

    if (s[b] === '(') {
      let d = 0, p = b;
      for (; p < s.length; p++) {
        if (s[p] === '(') d++;
        else if (s[p] === ')') { d--; if (d === 0) break; }
      }
      if (p >= s.length) return null;
      return { end: p + 1, text: s.slice(b + 1, p) };
    }

    let e = b;
    while (e < s.length && RUN.test(s[e])) e++;
    while (e > b && /[.,]/.test(s[e - 1])) e--;        // titik/koma penutup kalimat
    let text = s.slice(b, e);

    // pemanggilan fungsi seperti n(S)
    if (RE_CALLNAME.test(text) && s[e] === '(') {
      let d = 0, p = e;
      for (; p < s.length; p++) {
        if (s[p] === '(') d++;
        else if (s[p] === ')') { d--; if (d === 0) break; }
      }
      if (p < s.length) return { end: p + 1, text: s.slice(b, p + 1) };
    }

    if (RE_FNNAME.test(text) && s[e] === ' ') {
      const m = /^ ([A-Za-zθ]|\d+°?)(?![A-Za-zθ0-9²])/.exec(s.slice(e));
      if (m) { e += m[0].length; text = s.slice(b, e); }
    }
    if (!validOperand(text)) return null;
    return { end: e, text: text };
  }

  /* ---------- bangun node ---------- */
  function makeFrac(n, d) {
    const f = document.createElement('span');
    f.className = 'tfrac';
    f.setAttribute('role', 'math');
    f.setAttribute('aria-label', n + ' per ' + d);
    const sn = document.createElement('span'); sn.className = 'tfrac-n'; sn.appendChild(build(n).frag);
    const ss = document.createElement('span'); ss.className = 'tfrac-s'; ss.textContent = '/';
    const sd = document.createElement('span'); sd.className = 'tfrac-d'; sd.appendChild(build(d).frag);
    f.appendChild(sn); f.appendChild(ss); f.appendChild(sd);
    return f;
  }

  // false = penghitung seperti "Soal 2/10" ikut dijadikan pecahan bersusun.
  // true  = penghitung dibiarkan "2/10" (teks biasa).
  const KEEP_COUNTERS = false;

  // label penghitung / nomor yang (jika KEEP_COUNTERS = true) tidak diubah
  const LABEL_BEFORE = /(?:Soal|Skor|Benar|Nilai|Misi|Pelanggan|Level|Langkah|Halaman|Babak|Ronde)\s*$/i;
  const LABEL_AFTER = /^\s*(?:latihan|soal|pelanggan|misi|langkah|halaman|babak|ronde)\b/i;

  function build(str) {
    const frag = document.createDocumentFragment();
    let last = 0, pos = 0, changed = false, i;
    while ((i = str.indexOf('/', pos)) !== -1) {
      pos = i + 1;
      if (str[i - 1] === '/' || str[i + 1] === '/') continue;
      const L = leftOperand(str, i, last);
      if (!L) continue;
      const R = rightOperand(str, i);
      if (!R) continue;
      // jangan ubah penomoran seperti "Soal 1/6", "Skor 4/6", "3/10 latihan"
      if (KEEP_COUNTERS) {
        if (LABEL_BEFORE.test(str.slice(Math.max(0, L.start - 12), L.start))) continue;
        if (LABEL_AFTER.test(str.slice(R.end, R.end + 14))) continue;
      }
      // jangan ubah daftar berantai seperti "30 / 40 / 60 cm"
      if (/^\s*\//.test(str.slice(R.end, R.end + 3))) continue;
      if (/\/\s*$/.test(str.slice(Math.max(0, L.start - 3), L.start))) continue;
      // jangan ubah satuan seperti m/s, km/jam
      if (/^(?:m|km|cm|rad)$/.test(L.text) && /^(?:s|jam|detik)$/.test(R.text)) continue;
      if (L.start > last) frag.appendChild(document.createTextNode(str.slice(last, L.start)));
      frag.appendChild(makeFrac(L.text, R.text));
      last = R.end;
      pos = R.end;
      changed = true;
    }
    if (last < str.length) frag.appendChild(document.createTextNode(str.slice(last)));
    return { frag: frag, changed: changed };
  }

  /* ---------- pemindai DOM ---------- */
  const SKIP = 'script,style,textarea,input,select,option,canvas,svg,code,pre,title,' +
    '.tfrac,.frac,.pf-frac,.fx-frac,[data-no-frac]' +
    (KEEP_COUNTERS ? ',.quiz-score,.tf-qbar,.fx-qbar,.pf-qbar,.progress-meta' : '');
  const CANDIDATE = /[0-9A-Za-zθπ√²°|)]\s?\/\s?[0-9A-Za-zθπ√(|]/;

  function processText(node) {
    const v = node.nodeValue;
    if (!v || v.indexOf('/') === -1 || !CANDIDATE.test(v)) return;
    const p = node.parentElement;
    if (!p || p.closest(SKIP)) return;
    const r = build(v);
    if (r.changed) node.parentNode.replaceChild(r.frag, node);
  }

  function scan(root) {
    if (root.nodeType === 3) { processText(root); return; }
    if (root.nodeType !== 1) return;
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const list = [];
    let n;
    while ((n = w.nextNode())) list.push(n);
    list.forEach(processText);
  }

  /* ---------- pengamat perubahan ---------- */
  function start() {
    const view = document.body;
    if (!view) return;

    const opts = { childList: true, subtree: true, characterData: true };
    const obs = new MutationObserver(function (records) {
      obs.disconnect();
      try {
        records.forEach(function (r) {
          if (r.type === 'characterData') processText(r.target);
          else r.addedNodes.forEach(scan);
        });
      } finally {
        obs.observe(view, opts);
      }
    });
    obs.observe(view, opts);
    scan(view);

    // cadangan: pindai ulang sebentar setelah interaksi (klik, geser slider, dsb.)
    let timer = null;
    function rescanSoon() {
      clearTimeout(timer);
      timer = setTimeout(function () {
        obs.disconnect();
        try { scan(view); } finally { obs.observe(view, opts); }
      }, 80);
    }
    ['click', 'input', 'change', 'keyup'].forEach(function (ev) {
      document.addEventListener(ev, rescanSoon, true);
    });

    window.TrigFraction = window.Fraction = {
      scan: function () { scan(view); },
      build: build
    };
  }

  if (typeof document !== 'undefined') {
    if (document.body) start();
    else document.addEventListener('DOMContentLoaded', start);
  }

  if (typeof module !== 'undefined') module.exports = { build: build };
})();