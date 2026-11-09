/*
  PERCENTAGE FUN — lapisan tampilan animasi untuk modul Persentase.

  File ini TIDAK mengubah isi materi. Ia "membungkus" openModule():
  setelah modul persentase dirender, ia menambahkan bagian visual
  (maskot Persi, kotak 100 persen, tag diskon, diskon berturut, reverse
  discount, kartu flip), mengubah catatan panjang menjadi akordeon,
  mengganti tab Coba Interaktif dengan lab + mini-game, dan menambah efek
  di tab Latihan Soal.

  Untuk menonaktifkan semuanya, cukup hapus <link>/<script> percentage-fun
  di index.html.
*/
(function () {
  'use strict';

  const PCT = 'persentase';
  const reduce = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* ------------------------------------------------------------------ */
  /* util                                                                */
  /* ------------------------------------------------------------------ */
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const nf = new Intl.NumberFormat('id-ID');
  const rp = n => 'Rp' + nf.format(Math.round(n));
  const dec = n => String(n).replace('.', ',');
  const num = n => nf.format(Math.round(n));
  const pctTxt = n => dec(Math.round(n * 10) / 10) + '%';

  function countTo(el, to, fmt) {
    if (!el) return;
    const from = el._v === undefined ? to : el._v;
    el._v = to;
    cancelAnimationFrame(el._r);
    if (reduce || from === to) { el.textContent = fmt(to); return; }
    const t0 = performance.now(), d = 420;
    (function f(t) {
      const k = Math.min(1, (t - t0) / d), e = 1 - Math.pow(1 - k, 3);
      el.textContent = fmt(from + (to - from) * e);
      if (k < 1) el._r = requestAnimationFrame(f); else el.textContent = fmt(to);
    })(t0);
  }
  function retrigger(el, cls) {
    if (!el) return;
    el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls);
  }
  function shake(el) {
    if (!el) return;
    retrigger(el, 'pf-shake');
    setTimeout(() => el.classList.remove('pf-shake'), 600);
  }
  function markCoba() {
    if (markCoba.done) return;
    markCoba.done = true;
    try { if (window.Progress && Progress.setCoba) Progress.setCoba(PCT); } catch (e) { /* abaikan */ }
  }

  /* ------------------------------------------------------------------ */
  /* scroll reveal                                                       */
  /* ------------------------------------------------------------------ */
  let revIO = null;
  function reveal(root) {
    const els = $$('.pf-reveal', root);
    if (reduce || !('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); return; }
    if (!revIO) {
      revIO = new IntersectionObserver((es, o) => es.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); o.unobserve(e.target); }
      }), { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });
    }
    els.forEach(e => revIO.observe(e));
  }

  /* ------------------------------------------------------------------ */
  /* maskot "Persi" (label harga)                                        */
  /* ------------------------------------------------------------------ */
  const persiSvg = (cls) => `
<svg class="pf-persi ${cls || ''}" viewBox="0 0 200 200" aria-hidden="true" focusable="false">
  <ellipse class="pf-shadow" cx="100" cy="190" rx="62" ry="8" fill="rgba(36,27,58,.14)"/>
  <g class="pf-persi-body">
    <path d="M100 44 C96 8 142 4 138 30" fill="none" stroke="#241B3A" stroke-width="5" stroke-linecap="round"/>
    <g class="pf-arm">
      <line x1="158" y1="118" x2="188" y2="86" stroke="#241B3A" stroke-width="6" stroke-linecap="round"/>
      <circle cx="190" cy="83" r="9" fill="#FFE08A" stroke="#241B3A" stroke-width="5"/>
    </g>
    <path d="M30 76 L62 44 H138 L170 76 V166 Q170 182 154 182 H46 Q30 182 30 166 Z" fill="#FF9F1C" stroke="#241B3A" stroke-width="6" stroke-linejoin="round"/>
    <circle cx="100" cy="64" r="8" fill="#FFF6E0" stroke="#241B3A" stroke-width="4"/>
    <ellipse class="pf-eye" cx="74" cy="108" rx="6" ry="8" fill="#241B3A"/>
    <ellipse class="pf-eye" cx="126" cy="108" rx="6" ry="8" fill="#241B3A"/>
    <circle cx="58" cy="128" r="7" fill="#FF4D8D" opacity=".5"/>
    <circle cx="142" cy="128" r="7" fill="#FF4D8D" opacity=".5"/>
    <path d="M84 128 Q100 148 116 128" fill="none" stroke="#241B3A" stroke-width="5" stroke-linecap="round"/>
    <text x="100" y="168" font-size="17" font-weight="800" text-anchor="middle" font-family="Space Grotesk, sans-serif" fill="#241B3A">% OFF</text>
    <ellipse cx="68" cy="184" rx="16" ry="7" fill="#FF4D8D" stroke="#241B3A" stroke-width="4"/>
    <ellipse cx="132" cy="184" rx="16" ry="7" fill="#FF4D8D" stroke="#241B3A" stroke-width="4"/>
  </g>
</svg>`;

  let mascotEl = null, bubbleEl = null, bubbleTimer = 0;
  const lastSay = {};
  const FACTS = [
    'Kata “persen” berasal dari bahasa Latin per centum, artinya “per seratus” 💯',
    '50% sama dengan ½, 25% sama dengan ¼. Pecahan dan persen itu saudara kembar 👯',
    'Diskon 20% + 10% itu BUKAN 30%. Yang benar 28%! Aku pernah kecele 😅',
    'Harga naik 10% lalu turun 10% ternyata tidak kembali ke harga awal, lho 🤯',
    'Promo “Beli 1 Gratis 1” sebenarnya diskon 50% 🎁',
    'Tanda % mungkin berasal dari tulisan “per 100” yang disingkat pedagang Italia kuno 📜',
    'Baterai ponsel 20% itu artinya tinggal seperlima. Segera cari charger! 🔋'
  ];

  function ensureMascot() {
    if (mascotEl && mascotEl.isConnected) return;
    mascotEl = document.createElement('div');
    mascotEl.className = 'pf-mascot';
    mascotEl.innerHTML =
      '<div class="pf-bubble" role="status" aria-live="polite"></div>' +
      '<button type="button" class="pf-mascot-btn" aria-label="Persi, teman belajarmu. Klik untuk fakta seru">' + persiSvg('') + '</button>';
    document.body.appendChild(mascotEl);
    bubbleEl = $('.pf-bubble', mascotEl);
    $('.pf-mascot-btn', mascotEl).addEventListener('click', () => say(pick(FACTS), 5600));
  }
  function say(text, ms) {
    if (!bubbleEl || !document.body.classList.contains('pct-mode')) return;
    bubbleEl.textContent = text;
    retrigger(bubbleEl, 'show');
    retrigger(mascotEl, 'talk');
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(() => { bubbleEl.classList.remove('show'); mascotEl.classList.remove('talk'); }, ms || 3400);
  }
  function sayCool(key, text, cool, ms) {
    const now = Date.now();
    if (lastSay[key] && now - lastSay[key] < (cool || 9000)) return;
    lastSay[key] = now;
    say(text, ms);
  }

  /* ------------------------------------------------------------------ */
  /* confetti                                                            */
  /* ------------------------------------------------------------------ */
  const parts = [];
  let cv = null, cx = null, raf = 0;
  const CONF_COLORS = ['#FF9F1C', '#FF4D8D', '#7C3AED', '#17C3B2', '#F2C94C', '#3B82F6'];
  const CONF_EMOJI = ['🏷️', '💰', '✨', '🎉', '%'];
  function confetti(x, y, n) {
    if (reduce) return;
    if (!cv) {
      cv = document.createElement('canvas');
      cv.className = 'pf-confetti';
      cv.setAttribute('aria-hidden', 'true');
      document.body.appendChild(cv);
      cx = cv.getContext('2d');
    }
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    if (cv.width !== Math.round(innerWidth * dpr) || cv.height !== Math.round(innerHeight * dpr)) {
      cv.width = Math.round(innerWidth * dpr); cv.height = Math.round(innerHeight * dpr);
    }
    x = x === undefined ? innerWidth / 2 : x;
    y = y === undefined ? innerHeight / 3 : y;
    n = n || 46;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, s = 4 + Math.random() * 8;
      parts.push({
        x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 6, g: 0.28,
        r: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.4,
        size: 7 + Math.random() * 7, c: CONF_COLORS[i % CONF_COLORS.length],
        e: Math.random() < 0.2 ? CONF_EMOJI[i % CONF_EMOJI.length] : null, life: 0
      });
    }
    if (!raf) raf = requestAnimationFrame(confettiLoop);
  }
  function confettiLoop() {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cx.clearRect(0, 0, innerWidth, innerHeight);
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.life++; p.vy += p.g; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.r += p.vr;
      if (p.y > innerHeight + 30 || p.life > 130) { parts.splice(i, 1); continue; }
      cx.save();
      cx.translate(p.x, p.y); cx.rotate(p.r);
      cx.globalAlpha = Math.max(0, 1 - p.life / 130);
      if (p.e) { cx.font = (p.size * 2) + 'px serif'; cx.fillText(p.e, 0, 0); }
      else { cx.fillStyle = p.c; cx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2); }
      cx.restore();
    }
    if (parts.length) raf = requestAnimationFrame(confettiLoop);
    else { raf = 0; cx.clearRect(0, 0, innerWidth, innerHeight); }
  }
  function confettiAt(el, n) {
    if (!el) return confetti(undefined, undefined, n);
    const r = el.getBoundingClientRect();
    confetti(r.left + r.width / 2, r.top + r.height / 2, n);
  }

  /* ------------------------------------------------------------------ */
  /* BAGIAN VISUAL DI TAB MATERI                                         */
  /* ------------------------------------------------------------------ */
  const FLOATS = [
    ['%', '#FF9F1C', 58, 8], ['20%', '#FF4D8D', 82, 6], ['Rp', '#17C3B2', 94, 26], ['½', '#7C3AED', 66, 44],
    ['50%', '#3B82F6', 88, 54], ['−10%', '#FF9F1C', 55, 64], ['25%', '#17C3B2', 74, 76], ['÷100', '#FF4D8D', 93, 78],
    ['🏷️', '#7C3AED', 52, 28], ['💰', '#E5B93A', 97, 46]
  ];
  const floatLayer = () => '<div class="pf-float-layer" aria-hidden="true">' + FLOATS.map((f, i) =>
    `<span style="left:${f[2]}%;top:${f[3]}%;--c:${f[1]};--d:${5 + (i % 4)}s;--dl:${-i}s;--r:${(i % 2 ? 1 : -1) * 8}deg">${f[0]}</span>`).join('') + '</div>';

  const ITEMS = [['👟', 'Sepatu', 450000], ['🎒', 'Tas', 300000], ['🎧', 'Headphone', 600000], ['👕', 'Kaos', 120000]];

  const AROUND = [
    ['🏷️', 'Diskon', 'Harga turun sekian persen dari harga awal.', '#FFF1B8', 'Harga akhir = harga awal × (1 − d)', 'Rp200.000 diskon 25% → 200.000 × 0,75 = Rp150.000'],
    ['🧾', 'Pajak (PPN)', 'Kebalikan diskon: harga ditambah persentase tertentu.', '#FFD9E8', 'Harga akhir = harga × (1 + pajak)', 'Rp100.000 + PPN 11% → 100.000 × 1,11 = Rp111.000'],
    ['💸', 'Cashback', 'Uang kembali dalam bentuk saldo, sering ada batas maksimal.', '#D5F6EC', 'Cashback = persen × belanja (≤ batas)', 'Belanja Rp80.000, cashback 10% maks. Rp5.000 → dapat Rp5.000'],
    ['📈', 'Untung & rugi', 'Bandingkan selisih jual-beli dengan harga beli.', '#E9DEFF', 'Untung % = untung ÷ harga beli × 100%', 'Beli 80.000, jual 100.000 → untung 20.000 ÷ 80.000 = 25%'],
    ['🏦', 'Bunga tabungan', 'Saldo bertambah sekian persen per periode.', '#E4F4FF', 'Bunga = saldo × persen × waktu', 'Rp1.000.000, bunga 6%/tahun → Rp60.000 per tahun'],
    ['🔋', 'Baterai & kuota', 'Sisa dibanding keseluruhan, ditulis dalam persen.', '#FFE3CC', 'Persen = bagian ÷ keseluruhan × 100%', 'Sisa kuota 3 GB dari 12 GB → 3 ÷ 12 = 25%']
  ];

  function adventureHTML() {
    const hero = `
<section class="pf-hero pf-reveal" aria-label="Pembuka petualangan persentase">
  ${floatLayer()}
  <div class="pf-hero-copy">
    <span class="pf-badge">🏷️ PETUALANGAN DISKON</span>
    <h2>Halo, aku <span>Persi</span> 👋<br>Yuk jago hitung diskon!</h2>
    <p class="pf-typed" id="pfTyped" aria-live="off"></p>
    <div class="pf-hero-chips">
      <button type="button" data-jump="pfSec1">💯 Per seratus</button>
      <button type="button" data-jump="pfSec2">🛍️ Diskon</button>
      <button type="button" data-jump="pfSec3">🔥 Diskon ganda</button>
      <button type="button" data-jump="pfSec4">🔄 Cari harga awal</button>
      <button type="button" data-jump="pfSec5">🌍 Di sekitarmu</button>
    </div>
  </div>
  <div class="pf-hero-art">${persiSvg('')}</div>
  <div class="pf-hero-wave" aria-hidden="true">
    <svg viewBox="0 0 2400 80" preserveAspectRatio="none"><path d="${wavePath(2400, 80, 20, 8, 0)}" fill="#FFE2B8"/></svg>
    <svg viewBox="0 0 2400 80" preserveAspectRatio="none"><path d="${wavePath(2400, 80, 15, 8, 1.6)}" fill="#FFD3E5"/></svg>
  </div>
</section>`;

    const sec1 = `
<section class="pf-sec pf-reveal" id="pfSec1" style="--c1:#FF9F1C;--c2:#FF4D8D">
  <h3><span class="pf-step">1</span>Persen itu “per 100” <em>💯</em></h3>
  <p class="pf-sub">Bayangkan 100 kotak. Geser slider, lalu lihat berapa kotak yang menyala.</p>
  <div class="pf-two">
    <div class="pf-stage pf-stage-grid">
      <div class="pf-hundred" id="pfHundred" role="img" aria-label="Seratus kotak, sebagian menyala sesuai persentase"></div>
    </div>
    <div class="pf-panel">
      <div class="pf-bigpct"><b id="pfBigPct">35%</b><small id="pfHundredNote"></small></div>
      <label class="pf-ctl">Persentase <output id="pfPctOut">35%</output>
        <input id="pfPctRange" type="range" min="0" max="100" value="35">
      </label>
      <div class="pf-quick" id="pfQuick">
        <button type="button" data-p="10">10%</button><button type="button" data-p="25">25%</button><button type="button" data-p="50">50%</button><button type="button" data-p="75">75%</button><button type="button" data-p="100">100%</button>
      </div>
      <div class="pf-eqrow">
        <div><small>pecahan</small><b id="pfFrac">35/100</b></div>
        <div><small>desimal</small><b id="pfDec">0,35</b></div>
      </div>
      <label class="pf-ctl">Jumlah awal <output id="pfBaseOut">Rp200.000</output>
        <input id="pfBase" type="range" min="10000" max="1000000" step="10000" value="200000">
      </label>
      <div class="pf-result-line"><span id="pfOfTxt">35% dari Rp200.000</span> = <b id="pfOfVal">Rp70.000</b></div>
    </div>
  </div>
</section>`;

    const sec2 = `
<section class="pf-sec pf-reveal" id="pfSec2" style="--c1:#FF4D8D;--c2:#FF9F1C">
  <h3><span class="pf-step">2</span>Diskon tunggal <em>🛍️</em></h3>
  <p class="pf-sub">Pilih barang, geser harga dan diskonnya. Label harga akan berubah langsung.</p>
  <div class="pf-pickers" id="pfItems">${ITEMS.map((it, i) => `<button type="button" class="pf-chip${i === 0 ? ' active' : ''}" data-i="${i}">${it[0]} ${it[1]}</button>`).join('')}</div>
  <div class="pf-two">
    <div class="pf-stage pf-stage-tag">
      <div class="pf-hang"><span class="pf-string"></span>
        <div class="pf-pricetag" id="pfTag">
          <i class="pf-hole"></i>
          <div class="pf-tag-emoji" id="pfTagEmoji">👟</div>
          <div class="pf-tag-old" id="pfOld">Rp450.000</div>
          <div class="pf-tag-new" id="pfNew">Rp360.000</div>
          <div class="pf-starburst" id="pfStar">−20%</div>
        </div>
      </div>
    </div>
    <div class="pf-panel">
      <label class="pf-ctl">Harga awal <output id="pfPriceOut">Rp450.000</output>
        <input id="pfPrice" type="range" min="50000" max="1000000" step="10000" value="450000">
      </label>
      <label class="pf-ctl">Diskon <output id="pfDiscOut">20%</output>
        <input id="pfDisc" type="range" min="0" max="90" value="20">
      </label>
      <div class="pf-bar" id="pfBar"><span class="pf-pay" id="pfBarPay"><em>Bayar 80%</em></span><span class="pf-save" id="pfBarSave"><em>Hemat 20%</em></span></div>
      <div class="pf-formula-chip" id="pfCalc">Rp450.000 × 0,8 = Rp360.000</div>
      <div class="pf-save-line">Kamu hemat <b id="pfSaveVal">Rp90.000</b> 🎉</div>
    </div>
  </div>
</section>`;

    const sec3 = `
<section class="pf-sec pf-reveal" id="pfSec3" style="--c1:#7C3AED;--c2:#FF4D8D">
  <h3><span class="pf-step">3</span>Diskon ganda: jangan dijumlah! <em>🔥</em></h3>
  <p class="pf-sub">Diskon kedua dihitung dari harga <i>yang sudah turun</i>. Lihat batang harganya menyusut bertahap.</p>
  <div class="pf-pickers" id="pfChainPresets">
    <button type="button" class="pf-chip" data-a="20" data-b="10">20% + 10%</button>
    <button type="button" class="pf-chip active" data-a="50" data-b="20">50% + 20%</button>
    <button type="button" class="pf-chip" data-a="30" data-b="30">30% + 30%</button>
    <button type="button" class="pf-chip" data-a="10" data-b="10">10% + 10%</button>
  </div>
  <div class="pf-two pf-two-wide">
    <div class="pf-stage pf-stage-bars">
      <div class="pf-brow"><span class="pf-blabel">Harga awal</span><div class="pf-track"><i class="pf-fill f0" id="pfC0"></i><b id="pfC0t">Rp1.000.000</b></div></div>
      <div class="pf-brow"><span class="pf-blabel" id="pfC1l">Setelah diskon 50%</span><div class="pf-track"><i class="pf-fill f1" id="pfC1"></i><b id="pfC1t">Rp500.000</b></div></div>
      <div class="pf-brow"><span class="pf-blabel" id="pfC2l">Setelah diskon 20% lagi</span><div class="pf-track"><i class="pf-fill f2" id="pfC2"></i><i class="pf-wrongmark" id="pfWrong"><u>jika dijumlah</u></i><b id="pfC2t">Rp400.000</b></div></div>
      <button type="button" class="pf-mini-btn" id="pfChainReplay">▶ Putar ulang animasi</button>
    </div>
    <div class="pf-panel">
      <label class="pf-ctl">Diskon pertama <output id="pfAOut">50%</output>
        <input id="pfA" type="range" min="0" max="70" step="5" value="50">
      </label>
      <label class="pf-ctl">Diskon kedua <output id="pfBOut">20%</output>
        <input id="pfB" type="range" min="0" max="70" step="5" value="20">
      </label>
      <div class="pf-verdict" id="pfVerdict"></div>
      <div class="pf-formula-chip" id="pfChainCalc">1.000.000 × 0,5 × 0,8 = Rp400.000</div>
    </div>
  </div>
</section>`;

    const sec4 = `
<section class="pf-sec pf-reveal" id="pfSec4" style="--c1:#17C3B2;--c2:#3B82F6">
  <h3><span class="pf-step">4</span>Cari harga awal (reverse) <em>🔄</em></h3>
  <p class="pf-sub">Kamu tahu harga setelah diskon. Berapa harga sebelum diskon? Putar langkah demi langkah.</p>
  <div class="pf-two pf-two-wide">
    <div class="pf-stage pf-stage-rev">
      <div class="pf-revbar">
        <div class="pf-revghost" id="pfRevGhost"><em id="pfRevGhostT">harga awal = ?</em></div>
        <div class="pf-revpay" id="pfRevPay"><em id="pfRevPayT">Rp400.000</em></div>
      </div>
      <ol class="pf-revsteps" id="pfRevSteps">
        <li id="pfRs1"></li><li id="pfRs2"></li><li id="pfRs3"></li>
      </ol>
      <button type="button" class="pf-mini-btn" id="pfRevReplay">▶ Putar langkah</button>
    </div>
    <div class="pf-panel">
      <label class="pf-ctl">Diskon <output id="pfRdOut">20%</output>
        <input id="pfRd" type="range" min="5" max="70" step="5" value="20">
      </label>
      <label class="pf-ctl">Harga setelah diskon <output id="pfRfOut">Rp400.000</output>
        <input id="pfRf" type="range" min="50000" max="1000000" step="10000" value="400000">
      </label>
      <div class="pf-bigans">Harga awal <b id="pfRevAns">Rp500.000</b></div>
      <div class="pf-formula-chip" id="pfRevCalc">Rp400.000 ÷ 0,8 = Rp500.000</div>
    </div>
  </div>
</section>`;

    const sec5 = `
<section class="pf-sec pf-reveal" id="pfSec5" style="--c1:#3B82F6;--c2:#17C3B2">
  <h3><span class="pf-step">5</span>Persen di sekitarmu <em>🌍</em></h3>
  <div class="pf-flip-tools"><p class="pf-sub" style="margin:0">Ketuk kartu untuk melihat rumus & contohnya.</p><button type="button" class="pf-mini-btn" id="pfFlipAll">🔄 Balik semua</button></div>
  <div class="pf-flip-grid">${AROUND.map(a => `
    <div class="pf-flip" role="button" tabindex="0" aria-label="${a[1]}: ketuk untuk membalik">
      <div class="pf-flip-in">
        <div class="pf-face front" style="background:${a[3]}"><span class="pf-ficon">${a[0]}</span><h4>${a[1]}</h4><p>${a[2]}</p></div>
        <div class="pf-face back"><b>${a[4]}</b><p>${a[5]}</p></div>
      </div>
    </div>`).join('')}</div>
</section>`;

    const divider = '<div class="pf-divider"><span>📖</span> Catatan lengkap <span>✏️</span></div>';
    return `<div class="pf-adv">${hero}${sec1}${sec2}${sec3}${sec4}${sec5}${divider}</div>`;
  }

  function wavePath(w, h, amp, cycles, phase) {
    let d = 'M0 ' + h;
    for (let x = 0; x <= w; x += 20) {
      d += ' L' + x + ' ' + (h / 2 - amp * Math.sin(x / w * cycles * 2 * Math.PI + phase)).toFixed(1);
    }
    return d + ' L' + w + ' ' + h + ' Z';
  }

  /* ---------- hero ---------- */
  function wireHero(root) {
    const el = $('#pfTyped', root);
    if (el) {
      const phrases = [
        'Persen itu bukan hafalan, tapi cara melihat “bagian dari 100” 🎯',
        'Dari diskon belanja sampai baterai ponsel, semuanya pakai persen 🛒',
        'Geser, klik, dan mainkan. Aku temani ya! 🐣'
      ];
      if (reduce) el.textContent = phrases[0];
      else {
        let pi = 0, ci = 0, del = false;
        (function tick() {
          if (!el.isConnected) return;
          const chars = Array.from(phrases[pi]);
          if (!del) {
            ci++;
            el.textContent = chars.slice(0, ci).join('');
            if (ci >= chars.length) { del = true; setTimeout(tick, 2400); return; }
            setTimeout(tick, 38);
          } else {
            ci = Math.max(0, ci - 2);
            el.textContent = chars.slice(0, ci).join('');
            if (ci === 0) { del = false; pi = (pi + 1) % phrases.length; setTimeout(tick, 350); return; }
            setTimeout(tick, 16);
          }
        })();
      }
    }
    $$('[data-jump]', root).forEach(b => b.addEventListener('click', () => {
      const t = document.getElementById(b.dataset.jump);
      if (t) t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    }));
  }

  /* ---------- seksi 1: kotak 100 ---------- */
  function wireHundred(root) {
    const grid = $('#pfHundred', root);
    grid.innerHTML = Array.from({ length: 100 }, (_, i) => `<i style="--i:${i}"></i>`).join('');
    const cells = $$('i', grid), r = $('#pfPctRange', root), base = $('#pfBase', root);
    const notes = { 0: 'Kosong, tidak ada bagian', 10: 'Sepersepuluh', 25: 'Seperempat (¼)', 50: 'Setengah (½)', 75: 'Tiga perempat (¾)', 100: 'Penuh, semuanya!' };
    function upd(fromUser) {
      const p = +r.value, b = +base.value;
      cells.forEach((c, i) => c.classList.toggle('on', i < p));
      countTo($('#pfBigPct', root), p, v => Math.round(v) + '%');
      $('#pfPctOut', root).textContent = p + '%';
      $('#pfHundredNote', root).textContent = notes[p] || (p + ' dari 100 kotak menyala');
      $('#pfFrac', root).textContent = p + '/100';
      $('#pfDec', root).textContent = dec(p / 100);
      $('#pfBaseOut', root).textContent = rp(b);
      $('#pfOfTxt', root).textContent = p + '% dari ' + rp(b);
      countTo($('#pfOfVal', root), b * p / 100, rp);
      $$('#pfQuick button', root).forEach(x => x.classList.toggle('active', +x.dataset.p === p));
      if (fromUser) {
        if (p === 50) sayCool('p50', '50% itu setengah. Sama dengan ½ dan 0,5 ✨', 6000, 3600);
        else if (p === 100) sayCool('p100', '100% itu utuh. Semua kotak menyala! 💡', 6000, 3600);
        else if (p === 25) sayCool('p25', '25% = ¼. Seperempat dari 100 kotak = 25 kotak 🍕', 6000, 3600);
      }
    }
    r.addEventListener('input', () => upd(true));
    base.addEventListener('input', () => upd(false));
    $$('#pfQuick button', root).forEach(b => b.addEventListener('click', () => { r.value = b.dataset.p; upd(true); }));
    upd(false);
  }

  /* ---------- seksi 2: diskon tunggal ---------- */
  function wireSingle(root) {
    const price = $('#pfPrice', root), disc = $('#pfDisc', root);
    const emoji = $('#pfTagEmoji', root), tag = $('#pfTag', root);
    let cur = 0;
    function upd(bump) {
      const p = +price.value, d = +disc.value;
      const fin = p * (1 - d / 100), save = p - fin;
      $('#pfPriceOut', root).textContent = rp(p);
      $('#pfDiscOut', root).textContent = d + '%';
      $('#pfOld', root).textContent = rp(p);
      $('#pfOld', root).classList.toggle('none', d === 0);
      countTo($('#pfNew', root), fin, rp);
      $('#pfStar', root).textContent = d === 0 ? '0%' : '−' + d + '%';
      $('#pfStar', root).classList.toggle('hide', d === 0);
      $('#pfBarPay', root).style.width = (100 - d) + '%';
      $('#pfBarSave', root).style.width = d + '%';
      $('#pfBarPay em', root).textContent = 'Bayar ' + (100 - d) + '%';
      $('#pfBarSave em', root).textContent = d >= 8 ? 'Hemat ' + d + '%' : '';
      $('#pfCalc', root).textContent = rp(p) + ' × ' + dec((100 - d) / 100) + ' = ' + rp(fin);
      countTo($('#pfSaveVal', root), save, rp);
      if (bump) { retrigger(tag, 'pf-swing'); }
    }
    price.addEventListener('input', () => upd(true));
    disc.addEventListener('input', () => {
      upd(true);
      const d = +disc.value;
      if (d >= 70) sayCool('d70', 'Diskon segede itu? Cek dulu, jangan-jangan ada syarat tersembunyi 🕵️', 8000, 4200);
      else if (d === 50) sayCool('d50', 'Diskon 50% = bayar separuh harga. Bayar ½ × harga awal 😎', 8000, 4200);
    });
    $$('#pfItems .pf-chip', root).forEach(b => b.addEventListener('click', () => {
      cur = +b.dataset.i;
      $$('#pfItems .pf-chip', root).forEach(x => x.classList.toggle('active', x === b));
      emoji.textContent = ITEMS[cur][0];
      price.value = ITEMS[cur][2];
      retrigger(emoji, 'pf-pop');
      upd(true);
    }));
    upd(false);
  }

  /* ---------- seksi 3: diskon berturut ---------- */
  function wireChain(root) {
    const A = $('#pfA', root), B = $('#pfB', root), BASE = 1000000;
    function paint(animate) {
      const a = +A.value, b = +B.value;
      const s1 = BASE * (1 - a / 100), s2 = s1 * (1 - b / 100);
      const eff = (BASE - s2) / BASE * 100, naive = a + b;
      $('#pfAOut', root).textContent = a + '%';
      $('#pfBOut', root).textContent = b + '%';
      $('#pfC1l', root).textContent = 'Setelah diskon ' + a + '%';
      $('#pfC2l', root).textContent = 'Setelah diskon ' + b + '% lagi';
      const fills = [$('#pfC0', root), $('#pfC1', root), $('#pfC2', root)];
      const targets = [100, 100 - a, (100 - a) * (100 - b) / 100];
      const texts = [rp(BASE), rp(s1), rp(s2)];
      ['#pfC0t', '#pfC1t', '#pfC2t'].forEach((id, i) => { $(id, root).textContent = texts[i]; });
      const wrong = $('#pfWrong', root);
      wrong.style.left = clamp(100 - naive, 0, 100) + '%';
      wrong.classList.toggle('hide', b === 0 || a === 0);
      const set = () => fills.forEach((f, i) => { f.style.width = targets[i] + '%'; });
      if (animate && !reduce) {
        fills.forEach(f => { f.style.transition = 'none'; f.style.width = '0%'; });
        void fills[0].offsetWidth;
        fills.forEach((f, i) => { f.style.transition = 'width .9s cubic-bezier(.2,.9,.3,1) ' + (i * .45) + 's'; });
        requestAnimationFrame(set);
      } else {
        fills.forEach(f => { f.style.transition = ''; });
        set();
      }
      const v = $('#pfVerdict', root);
      if (a === 0 || b === 0) {
        v.innerHTML = '<span>Hanya satu diskon</span><b>' + pctTxt(eff) + '</b><small>Tidak ada efek “berturut”, jadi sama dengan diskonnya.</small>';
      } else {
        v.innerHTML = '<span>Diskon efektif</span><b>' + pctTxt(eff) + '</b><small>Bukan ' + naive + '%! Selisih ' + dec(Math.round((naive - eff) * 10) / 10) + ' poin lebih kecil.</small>';
      }
      retrigger(v, 'pf-bump');
      $('#pfChainCalc', root).textContent = num(BASE) + ' × ' + dec((100 - a) / 100) + ' × ' + dec((100 - b) / 100) + ' = ' + rp(s2);
    }
    A.addEventListener('input', () => paint(false));
    B.addEventListener('input', () => {
      paint(false);
      if (+A.value === 50 && +B.value === 20) sayCool('c5020', '50% + 20% = 60%, bukan 70%. Kena jebakan promo, kan? 😏', 8000, 4600);
    });
    $$('#pfChainPresets .pf-chip', root).forEach(b => b.addEventListener('click', () => {
      A.value = b.dataset.a; B.value = b.dataset.b;
      $$('#pfChainPresets .pf-chip', root).forEach(x => x.classList.toggle('active', x === b));
      paint(true);
      sayCool('cpre', 'Lihat batang ketiga. Ia tidak sependek yang dijumlah! 👀', 7000, 3800);
    }));
    $('#pfChainReplay', root).addEventListener('click', () => paint(true));
    paint(false);
  }

  /* ---------- seksi 4: reverse ---------- */
  function wireReverse(root) {
    const D = $('#pfRd', root), F = $('#pfRf', root);
    function paint(play) {
      const d = +D.value, f = +F.value;
      const o = f / (1 - d / 100), one = f / (100 - d);
      $('#pfRdOut', root).textContent = d + '%';
      $('#pfRfOut', root).textContent = rp(f);
      countTo($('#pfRevAns', root), o, rp);
      $('#pfRevCalc', root).textContent = rp(f) + ' ÷ ' + dec((100 - d) / 100) + ' = ' + rp(o);
      $('#pfRevPay', root).style.width = (100 - d) + '%';
      $('#pfRevPayT', root).textContent = rp(f) + ' (' + (100 - d) + '%)';
      $('#pfRevGhostT', root).textContent = 'harga awal = ' + rp(o) + ' (100%)';
      $('#pfRs1', root).innerHTML = 'Diskon ' + d + '% berarti kamu membayar <b>' + (100 - d) + '%</b> dari harga awal.';
      $('#pfRs2', root).innerHTML = (100 - d) + '% = ' + rp(f) + ', maka <b>1% = ' + rp(one) + '</b>.';
      $('#pfRs3', root).innerHTML = 'Harga awal = 100% = 100 × ' + rp(one) + ' = <b>' + rp(o) + '</b>.';
      if (play) { const ol = $('#pfRevSteps', root); const bar = $('.pf-revbar', root); retrigger(ol, 'play'); retrigger(bar, 'play'); }
    }
    D.addEventListener('input', () => paint(false));
    F.addEventListener('input', () => paint(false));
    $('#pfRevReplay', root).addEventListener('click', () => { paint(true); sayCool('rev', 'Kuncinya: dari “bayar berapa persen” dulu, baru ke 100% 🔑', 7000, 4200); });
    paint(false);
    $('#pfRevSteps', root).classList.add('play');
  }

  /* ---------- seksi 5: kartu flip ---------- */
  function wireFlip(root) {
    const cards = $$('.pf-flip', root);
    const toggle = c => {
      c.classList.toggle('flipped');
      if (c.classList.contains('flipped')) sayCool('flip', 'Kartu terbuka! Coba tebak dulu sebelum membalik, lebih seru 😄', 7000);
    };
    cards.forEach(c => {
      c.addEventListener('click', () => toggle(c));
      c.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(c); } });
    });
    const all = $('#pfFlipAll', root);
    if (all) all.addEventListener('click', () => {
      const anyUp = cards.some(c => !c.classList.contains('flipped'));
      cards.forEach((c, i) => setTimeout(() => c.classList.toggle('flipped', anyUp), reduce ? 0 : i * 110));
    });
  }

  /* ---------- catatan panjang → akordeon ---------- */
  const ACC_COLORS = ['#FF9F1C', '#7C3AED', '#17C3B2', '#FF4D8D', '#3B82F6'];
  const ACC_TITLES = ['🏷️ Apa itu persentase?', '🧩 Tiga ide utama', '📐 Rumus penting', '🧾 Contoh langkah demi langkah', '⚠️ Kenapa promo ganda menyesatkan?'];
  const ACC_SAY = ['Nah, ini catatan pentingnya! 📝', 'Baca pelan-pelan ya, aku tunggu 🐢', 'Coba bandingkan dengan simulasi di atas 😉', 'Mantap, rajin banget! 🌟'];
  function accordionize(lessons) {
    const cards = $$(':scope > .content-card', lessons).filter(c => !$('#completeMateriBtn', c));
    if (!cards.length) return;
    const host = document.createElement('div');
    host.className = 'pf-notes';
    host.innerHTML = '<div class="pf-acc-tools"><p>📚 Ketuk judul untuk membuka catatan</p><button type="button" class="pf-mini-btn" id="pfAccAll">📂 Buka semua</button></div>';
    cards[0].before(host);
    const accs = cards.map((it, i) => {
      $$(':scope > .tip', it).forEach(t => { if (!t.textContent.trim() || t.textContent.trim() === 'undefined') t.remove(); });
      if (i === 0 || i === 2) { const h = $(':scope > h3', it); if (h) h.remove(); }
      const acc = document.createElement('div');
      acc.className = 'pf-acc pf-reveal';
      acc.style.setProperty('--c', ACC_COLORS[i % ACC_COLORS.length]);
      acc.innerHTML =
        '<button type="button" class="pf-acc-head" aria-expanded="false"><span class="pf-acc-title">' + (ACC_TITLES[i] || 'Catatan ' + (i + 1)) + '</span><span class="pf-acc-chev" aria-hidden="true">▾</span></button>' +
        '<div class="pf-acc-body"><div class="pf-acc-inner"></div></div>';
      const inner = $('.pf-acc-inner', acc);
      while (it.firstChild) inner.appendChild(it.firstChild);
      it.remove();
      host.appendChild(acc);
      $('.pf-acc-head', acc).addEventListener('click', () => {
        const open = acc.classList.toggle('open');
        $('.pf-acc-head', acc).setAttribute('aria-expanded', String(open));
        if (open) sayCool('acc', pick(ACC_SAY), 6000, 3200);
      });
      return acc;
    });
    const btn = $('#pfAccAll', host);
    btn.addEventListener('click', () => {
      const anyClosed = accs.some(a => !a.classList.contains('open'));
      accs.forEach(a => { a.classList.toggle('open', anyClosed); $('.pf-acc-head', a).setAttribute('aria-expanded', String(anyClosed)); });
      btn.textContent = anyClosed ? '📁 Tutup semua' : '📂 Buka semua';
    });
  }

  function buildMateri() {
    const lessons = $('#tab-materi .lesson-sections');
    if (!lessons || $('.pf-adv', lessons)) return;
    lessons.insertAdjacentHTML('afterbegin', adventureHTML());
    const adv = $('.pf-adv', lessons);
    wireHero(adv); wireHundred(adv); wireSingle(adv); wireChain(adv); wireReverse(adv); wireFlip(adv);
    accordionize(lessons);
    $$(':scope > .content-card', lessons).forEach(c => c.classList.add('pf-reveal'));
    reveal(lessons);
  }

  /* ------------------------------------------------------------------ */
  /* TAB COBA INTERAKTIF (lab + mini-game)                               */
  /* ------------------------------------------------------------------ */
  function labHTML() {
    return `
<div class="pf-lab">
  <div class="content-card pf-lab-hero pf-reveal">
    ${floatLayer()}
    <span class="pf-badge">🧪 LAB DISKON KILAT</span>
    <h3>Ayo main sama diskon! 🛒</h3>
    <p>Tiga permainan: <b>simulasi diskon</b>, <b>tebak toko mana yang lebih hemat</b>, dan <b>misi kasir</b> berisi 5 soal acak.</p>
  </div>

  <div class="content-card pf-reveal" id="pfLabSim">
    <h3>🛍️ Diskon Kilat</h3>
    <p>Geser harga dan dua diskon berturut-turut. Hasil dan diskon efektifnya berubah langsung.</p>
    <div class="pf-pickers" id="pfLabPresets">
      <button type="button" class="pf-chip" data-a="20" data-b="0">20%</button>
      <button type="button" class="pf-chip" data-a="20" data-b="10">20% + 10%</button>
      <button type="button" class="pf-chip" data-a="50" data-b="20">50% + 20%</button>
      <button type="button" class="pf-chip" data-a="30" data-b="30">30% + 30%</button>
    </div>
    <div class="pf-two">
      <div class="pf-stage pf-stage-tag">
        <div class="pf-hang"><span class="pf-string"></span>
          <div class="pf-pricetag" id="pfLTag">
            <i class="pf-hole"></i>
            <div class="pf-tag-emoji">🛍️</div>
            <div class="pf-tag-old" id="pfLOld">Rp300.000</div>
            <div class="pf-tag-new" id="pfLNew">Rp240.000</div>
            <div class="pf-starburst" id="pfLStar">−20%</div>
          </div>
        </div>
      </div>
      <div class="pf-panel">
        <label class="pf-ctl">Harga <output id="pfLPriceOut">Rp300.000</output><input id="pfLPrice" type="range" min="50000" max="1000000" step="10000" value="300000"></label>
        <label class="pf-ctl">Diskon 1 <output id="pfLD1Out">20%</output><input id="pfLD1" type="range" min="0" max="70" value="20"></label>
        <label class="pf-ctl">Diskon 2 (berturut) <output id="pfLD2Out">0%</output><input id="pfLD2" type="range" min="0" max="70" value="0"></label>
        <div class="pf-bar"><span class="pf-pay" id="pfLPay"><em></em></span><span class="pf-save" id="pfLSave"><em></em></span></div>
        <div class="pf-result-line" id="pfLSaveText">Hemat Rp60.000 · Diskon efektif 20%</div>
        <div class="pf-warn" id="pfLWarn"></div>
      </div>
    </div>
  </div>

  <div class="content-card pf-reveal pf-game" id="pfGuess">
    <h3>⚖️ Tebak Hemat: toko mana yang lebih murah?</h3>
    <p>Dua toko menjual barang yang sama. Pilih yang akhirnya lebih murah, lalu cek hitungannya.</p>
    <div class="pf-streakbar"><span>🔥 Beruntun <b id="pfGStreak">0</b></span><span>🏅 Terbaik <b id="pfGBest">0</b></span><span>✅ Benar <b id="pfGOk">0</b>/<b id="pfGN">0</b></span></div>
    <div class="pf-duel" id="pfDuel"></div>
    <div class="pf-fb" id="pfGFb"></div>
    <button type="button" class="gradient-btn pf-next hidden" id="pfGNext">Ronde berikutnya →</button>
  </div>

  <div class="content-card pf-reveal pf-game" id="pfMission">
    <h3>🧾 Misi Kasir: 5 soal acak</h3>
    <div id="pfMBody"></div>
  </div>
</div>`;
  }

  function wireLabSim(root) {
    const P = $('#pfLPrice', root), D1 = $('#pfLD1', root), D2 = $('#pfLD2', root), tag = $('#pfLTag', root);
    function upd(bump) {
      const p = +P.value, d1 = +D1.value, d2 = +D2.value;
      const fin = p * (1 - d1 / 100) * (1 - d2 / 100), save = p - fin;
      const eff = p > 0 ? save / p * 100 : 0;
      $('#pfLPriceOut', root).textContent = rp(p);
      $('#pfLD1Out', root).textContent = d1 + '%';
      $('#pfLD2Out', root).textContent = d2 + '%';
      $('#pfLOld', root).textContent = rp(p);
      $('#pfLOld', root).classList.toggle('none', save === 0);
      countTo($('#pfLNew', root), fin, rp);
      const star = $('#pfLStar', root);
      star.textContent = d2 > 0 ? d1 + '%+' + d2 + '%' : '−' + d1 + '%';
      star.classList.toggle('hide', d1 === 0 && d2 === 0);
      $('#pfLPay', root).style.width = (100 - eff) + '%';
      $('#pfLSave', root).style.width = eff + '%';
      $('#pfLPay em', root).textContent = 'Bayar ' + pctTxt(100 - eff);
      $('#pfLSave em', root).textContent = eff >= 10 ? 'Hemat ' + pctTxt(eff) : '';
      $('#pfLSaveText', root).textContent = 'Hemat ' + rp(save) + ' · Diskon efektif ' + pctTxt(eff);
      const w = $('#pfLWarn', root);
      if (d2 > 0 && d1 > 0) { w.textContent = '⚠️ Bukan ' + (d1 + d2) + '%! Diskon kedua dihitung dari harga yang sudah turun.'; w.classList.add('on'); }
      else { w.textContent = ''; w.classList.remove('on'); }
      if (bump) retrigger(tag, 'pf-swing');
      markCoba();
    }
    [P, D1, D2].forEach(el => el.addEventListener('input', () => upd(true)));
    D2.addEventListener('input', () => { if (+D1.value + +D2.value >= 60 && +D2.value > 0) sayCool('lab60', 'Diskon ganda besar! Tapi hitung efektifnya, jangan langsung dijumlah 🤓', 8000, 4200); });
    $$('#pfLabPresets .pf-chip', root).forEach(b => b.addEventListener('click', () => {
      D1.value = b.dataset.a; D2.value = b.dataset.b;
      $$('#pfLabPresets .pf-chip', root).forEach(x => x.classList.toggle('active', x === b));
      upd(true);
    }));
    upd(false);
  }

  /* ---------- Tebak Hemat ---------- */
  function wireGuess(root) {
    const duel = $('#pfDuel', root), fb = $('#pfGFb', root), nextBtn = $('#pfGNext', root);
    let streak = 0, best = 0, ok = 0, n = 0, cur = null, locked = false;
    const stat = () => {
      $('#pfGStreak', root).textContent = streak; $('#pfGBest', root).textContent = best;
      $('#pfGOk', root).textContent = ok; $('#pfGN', root).textContent = n;
    };
    function round() {
      locked = false;
      const price = pick([200, 300, 400, 500, 600, 800, 1000]) * 1000;
      let a, b, eff, c;
      do {
        a = pick([10, 20, 30, 40, 50]); b = pick([10, 20, 30, 40, 50]);
        eff = 100 - (100 - a) * (100 - b) / 100;
        c = Math.round(eff) + pick([-4, -3, -2, 2, 3, 4]);
      } while (c < 5 || c > 90);
      const payA = price * (100 - a) * (100 - b) / 10000, payB = price * (100 - c) / 100;
      const flip = Math.random() < 0.5;
      cur = { price, a, b, c, payA, payB, flip, eff };
      const A = `<button type="button" class="pf-store" data-k="A"><span class="pf-store-ic">🏬</span><b>Toko ${flip ? 'B' : 'A'}</b><span class="pf-promo">Diskon ${a}% + ${b}%</span></button>`;
      const B = `<button type="button" class="pf-store" data-k="B"><span class="pf-store-ic">🏪</span><b>Toko ${flip ? 'A' : 'B'}</b><span class="pf-promo">Diskon ${c}%</span></button>`;
      duel.innerHTML = `<div class="pf-duel-price">Harga awal <b>${rp(price)}</b></div><div class="pf-duel-row">${flip ? B + '<i>VS</i>' + A : A + '<i>VS</i>' + B}</div>`;
      fb.innerHTML = ''; fb.className = 'pf-fb';
      nextBtn.classList.add('hidden');
      retrigger(duel, 'pf-pop');
    }
    duel.addEventListener('click', e => {
      const btn = e.target.closest('.pf-store');
      if (!btn || locked) return;
      locked = true; markCoba();
      const k = btn.dataset.k;           // 'A' = promo ganda, 'B' = diskon tunggal
      const chainCheaper = cur.payA < cur.payB;
      const right = (k === 'A') === chainCheaper;
      n++;
      $$('.pf-store', duel).forEach(s => {
        const pay = s.dataset.k === 'A' ? cur.payA : cur.payB;
        s.disabled = true;
        s.classList.add((s.dataset.k === 'A') === chainCheaper ? 'win' : 'lose');
        s.insertAdjacentHTML('beforeend', '<em class="pf-pay-line">Bayar ' + rp(pay) + '</em>');
      });
      const winnerName = (chainCheaper ? !cur.flip : cur.flip) ? 'A' : 'B';
      const sol = `Toko dengan ${cur.a}% + ${cur.b}%: ${cur.a}% + ${cur.b}% berturut ≈ diskon efektif <b>${pctTxt(cur.eff)}</b> → bayar ${rp(cur.payA)}. Toko dengan ${cur.c}%: bayar ${rp(cur.payB)}.`;
      if (right) {
        ok++; streak++; best = Math.max(best, streak);
        fb.className = 'pf-fb good';
        fb.innerHTML = '<strong>✅ Tepat! Toko ' + winnerName + ' lebih murah.</strong><br>' + sol;
        confettiAt(btn, 34);
        say(pick(['Jeli banget! 🎉', 'Betul! Kamu tidak tertipu promo 🕵️', 'Mantap, lanjut! 🚀']), 2800);
        if (streak === 3) say('3 beruntun! Kamu mulai jago membaca promo 🔥', 4200);
        if (streak === 5) { confetti(undefined, undefined, 120); say('5 beruntun! Detektif diskon sejati 🏆', 5000); }
      } else {
        streak = 0;
        fb.className = 'pf-fb bad';
        fb.innerHTML = '<strong>❌ Belum tepat. Toko ' + winnerName + ' yang lebih murah.</strong><br>' + sol;
        shake(duel);
        say(pick(['Tidak apa-apa, ingat: diskon ganda tidak dijumlah 💡', 'Hampir! Hitung efektifnya dulu ya 📝']), 3800);
      }
      stat();
      nextBtn.classList.remove('hidden');
    });
    nextBtn.addEventListener('click', round);
    stat(); round();
  }

  /* ---------- Misi Kasir ---------- */
  function makeMissions() {
    const make = {
      single() {
        const p = pick([150, 200, 250, 300, 350, 400, 500, 600]) * 1000, d = pick([10, 15, 20, 25, 30, 40, 50]);
        const disc = p * d / 100, ans = p - disc;
        return { q: `Sepatu seharga <b>${rp(p)}</b> mendapat diskon <b>${d}%</b>. Berapa yang harus kamu bayar?`, ans, unit: 'rp', icon: '👟',
          hint: `Bayar = harga × (1 − ${d}/100) = ${rp(p)} × ${dec((100 - d) / 100)}.`,
          sol: [`Diskon = ${d}% × ${rp(p)} = ${rp(disc)}`, `Bayar = ${rp(p)} − ${rp(disc)} = <b>${rp(ans)}</b>`] };
      },
      chain() {
        const p = pick([200, 300, 400, 500, 800, 1000]) * 1000, a = pick([10, 20, 30, 40, 50]), b = pick([10, 20, 30, 40, 50]);
        const s1 = p * (100 - a) / 100, ans = s1 * (100 - b) / 100;
        return { q: `Jaket <b>${rp(p)}</b> kena promo diskon <b>${a}% + ${b}%</b>. Berapa harga akhirnya?`, ans, unit: 'rp', icon: '🧥',
          hint: `Hitung bertahap: diskon ${a}% dulu, lalu diskon ${b}% dari harga yang baru.`,
          sol: [`Setelah ${a}%: ${rp(p)} × ${dec((100 - a) / 100)} = ${rp(s1)}`, `Setelah ${b}%: ${rp(s1)} × ${dec((100 - b) / 100)} = <b>${rp(ans)}</b>`] };
      },
      reverse() {
        const o = pick([200, 300, 400, 500, 600, 800, 1000]) * 1000, d = pick([10, 20, 25, 40, 50]);
        const f = o * (100 - d) / 100;
        return { q: `Setelah diskon <b>${d}%</b>, sebuah tas dibayar <b>${rp(f)}</b>. Berapa harga awal tas itu?`, ans: o, unit: 'rp', icon: '🎒',
          hint: `Kamu membayar ${100 - d}% dari harga awal. Harga awal = ${rp(f)} ÷ ${dec((100 - d) / 100)}.`,
          sol: [`Bayar ${100 - d}% dari harga awal, jadi ${100 - d}% = ${rp(f)}`, `Harga awal = ${rp(f)} ÷ ${dec((100 - d) / 100)} = <b>${rp(o)}</b>`] };
      },
      up() {
        const o = pick([100, 200, 300, 400, 500]) * 1000, x = pick([10, 15, 20, 25, 50]);
        const ans = o * (100 + x) / 100;
        return { q: `Harga sepeda <b>${rp(o)}</b> naik <b>${x}%</b>. Berapa harga barunya?`, ans, unit: 'rp', icon: '🚲',
          hint: `Kenaikan = tambah. Harga baru = harga lama × (1 + ${x}/100) = ${rp(o)} × ${dec((100 + x) / 100)}.`,
          sol: [`Kenaikan = ${x}% × ${rp(o)} = ${rp(o * x / 100)}`, `Harga baru = ${rp(o)} + ${rp(o * x / 100)} = <b>${rp(ans)}</b>`] };
      },
      eff() {
        const a = pick([10, 20, 30, 40, 50]), b = pick([10, 20, 30, 40, 50]);
        const left = (100 - a) * (100 - b) / 100, ans = 100 - left;
        return { q: `Promo “diskon <b>${a}% + ${b}%</b>”. Berapa persen diskon efektifnya? (ketik angkanya saja)`, ans, unit: 'pct', icon: '🏷️',
          hint: `Misalkan harga 100. Setelah ${a}% jadi ${100 - a}. Lalu kurangi ${b}% dari ${100 - a}.`,
          sol: [`Misalkan harga awal 100 → setelah ${a}%: ${100 - a}`, `Setelah ${b}% lagi: ${100 - a} × ${dec((100 - b) / 100)} = ${dec(left)}`, `Diskon efektif = 100 − ${dec(left)} = <b>${ans}%</b>`] };
      }
    };
    return shuffle(Object.keys(make)).map(k => make[k]());
  }

  function wireMission(root) {
    const body = $('#pfMBody', root);
    let qs = [], i = 0, score = 0, locked = false, hinted = false;
    const parse = s => { const d = String(s).replace(/[^0-9]/g, ''); return d === '' ? NaN : +d; };

    function start() {
      qs = makeMissions(); i = 0; score = 0; draw();
    }
    function dots() {
      return '<div class="pf-dots">' + qs.map((q, k) => `<i class="${q.res || (k === i ? 'now' : '')}"></i>`).join('') + '</div>';
    }
    function draw() {
      locked = false; hinted = false;
      const q = qs[i];
      body.innerHTML = `
        ${dots()}
        <div class="pf-till">
          <div class="pf-till-top"><span>Pelanggan ${i + 1} / ${qs.length}</span><span>⭐ Skor ${score}</span></div>
          <div class="pf-till-q"><span class="pf-till-ic">${q.icon}</span><p>${q.q}</p></div>
          <div class="pf-answer">
            <span class="pf-prefix">${q.unit === 'rp' ? 'Rp' : '%'}</span>
            <input id="pfMIn" type="text" inputmode="numeric" autocomplete="off" placeholder="${q.unit === 'rp' ? 'mis. 240000' : 'mis. 44'}" aria-label="Jawabanmu">
            <button type="button" class="gradient-btn" id="pfMCheck">Periksa</button>
          </div>
          <div class="pf-hint-row"><button type="button" class="pf-mini-btn" id="pfMHint">💡 Petunjuk</button><span id="pfMHintTxt"></span></div>
          <div class="pf-fb" id="pfMFb"></div>
        </div>`;
      const input = $('#pfMIn', body);
      input.focus({ preventScroll: true });
      input.addEventListener('keydown', e => { if (e.key === 'Enter') check(); });
      $('#pfMCheck', body).addEventListener('click', check);
      $('#pfMHint', body).addEventListener('click', () => {
        hinted = true; $('#pfMHintTxt', body).textContent = q.hint; retrigger($('#pfMHintTxt', body), 'pf-pop');
      });
    }
    function check() {
      if (locked) return;
      const q = qs[i], val = parse($('#pfMIn', body).value);
      if (isNaN(val)) { shake($('.pf-answer', body)); say('Ketik angkanya dulu ya ✍️', 2400); return; }
      locked = true; markCoba();
      const right = Math.abs(val - q.ans) < 1;
      const fb = $('#pfMFb', body);
      q.res = right ? 'ok' : 'no';
      if (right) {
        score += 1;
        fb.className = 'pf-fb good';
        fb.innerHTML = '<strong>✅ Benar!</strong><ol class="pf-sol">' + q.sol.map(s => '<li>' + s + '</li>').join('') + '</ol>';
        confettiAt($('#pfMCheck', body), 36);
        say(pick(['Kasir andalan! 🎉', 'Tepat sekali! ⭐', 'Mantap, lanjut! 🚀']), 2800);
      } else {
        fb.className = 'pf-fb bad';
        fb.innerHTML = '<strong>❌ Belum tepat.</strong> Jawaban yang benar <b>' + (q.unit === 'rp' ? rp(q.ans) : q.ans + '%') + '</b>.<ol class="pf-sol">' + q.sol.map(s => '<li>' + s + '</li>').join('') + '</ol>';
        shake($('.pf-till', body));
        say(pick(['Tidak apa-apa, lihat langkahnya ya 📖', 'Hampir! Pelajari langkahnya 💡']), 3600);
      }
      $('#pfMCheck', body).disabled = true; $('#pfMIn', body).disabled = true;
      const next = document.createElement('button');
      next.type = 'button'; next.className = 'gradient-btn pf-next';
      next.textContent = i === qs.length - 1 ? 'Lihat hasil 🏁' : 'Pelanggan berikutnya →';
      next.addEventListener('click', () => { if (i === qs.length - 1) finish(); else { i++; draw(); } });
      fb.after(next);
      $('.pf-dots', body).outerHTML = dots();
    }
    function finish() {
      const r = score / qs.length;
      body.innerHTML = `
        <div class="pf-final">
          <div class="pf-trophy" aria-hidden="true">${r >= 0.8 ? '🏆' : r >= 0.5 ? '🌟' : '💪'}</div>
          <h2>${score}/${qs.length}</h2>
          <p>${r >= 0.8 ? 'Luar biasa! Kamu kasir paling teliti se-toko.' : r >= 0.5 ? 'Bagus! Sedikit lagi sempurna. Coba lagi untuk soal baru.' : 'Tidak apa-apa. Baca catatan di tab Materi lalu coba lagi ya!'}</p>
          <button type="button" class="gradient-btn" id="pfMAgain">🔁 Main lagi (soal baru)</button>
        </div>`;
      if (r >= 0.8) { confetti(undefined, undefined, 140); say('Hebat! Kamu jagoan persentase 🏆', 5000); }
      else if (r >= 0.5) say('Bagus! Sedikit lagi sempurna 🌟', 4200);
      else say('Semangat! Coba lagi, aku temani 💪', 4800);
      $('#pfMAgain', body).addEventListener('click', start);
    }
    start();
  }

  function buildCoba() {
    const tab = $('#tab-coba');
    if (!tab || $('.pf-lab', tab)) return;
    markCoba.done = false;
    try { if (window.Progress && Progress.data && Progress.data[PCT] && Progress.data[PCT].coba) markCoba.done = true; } catch (e) { /* abaikan */ }
    tab.innerHTML = labHTML();
    const lab = $('.pf-lab', tab);
    wireLabSim(lab); wireGuess(lab); wireMission(lab);
    reveal(lab);
  }

  /* ------------------------------------------------------------------ */
  /* TAB LATIHAN                                                         */
  /* ------------------------------------------------------------------ */
  function bindQuizOnce() {
    const el = $('#tab-latihan');
    if (!el || el.dataset.pfBound) return;
    el.dataset.pfBound = '1';

    const apply = () => {
      if (!document.body.classList.contains('pct-mode')) return;
      const sc = $('.quiz-score', el);
      if (sc && !$('.pf-qbar', el)) {
        const m = sc.textContent.match(/Soal\s+(\d+)\s*\/\s*(\d+)/);
        if (m) {
          const i = +m[1], n = +m[2];
          sc.insertAdjacentHTML('afterend', `<div class="pf-qbar" data-i="${i}" data-n="${n}" style="--p:${((i - 1) / n * 100).toFixed(1)}"><span></span><i aria-hidden="true">🏷️</i></div>`);
        }
      }
      if ($('#retry', el) && !$('.pf-trophy', el)) {
        const h = $('h2', el), m = h && h.textContent.match(/(\d+)\s*\/\s*(\d+)/);
        const score = m ? +m[1] : 0, total = m ? +m[2] : 6;
        h.insertAdjacentHTML('beforebegin', `<span class="pf-trophy" aria-hidden="true">${score / total >= 0.8 ? '🏆' : score / total >= 0.5 ? '🌟' : '💪'}</span>`);
        if (score / total >= 0.8) { setTimeout(() => confetti(undefined, undefined, 140), 250); say('Luar biasa! Kamu jagoan persentase 🏆', 5000); }
        else if (score / total >= 0.5) say('Bagus! Sedikit lagi sempurna 🌟', 4200);
        else say('Tidak apa-apa, baca materinya lalu coba lagi ya. Aku temani! 💪', 4800);
      }
    };
    new MutationObserver(apply).observe(el, { childList: true, subtree: true });

    el.addEventListener('click', e => {
      if (!document.body.classList.contains('pct-mode')) return;
      const b = e.target.closest && e.target.closest('.option');
      if (!b) return;
      const bar = $('.pf-qbar', el);
      if (bar) bar.style.setProperty('--p', (+bar.dataset.i / +bar.dataset.n * 100).toFixed(1));
      if (b.classList.contains('correct')) {
        confettiAt(b, 36);
        say(pick(['Benar! 🎉', 'Tepat sekali! ⭐', 'Mantap, lanjut! 🚀', 'Keren banget! 🌟']), 2800);
      } else if (b.classList.contains('wrong')) {
        say(pick(['Tidak apa-apa, baca penjelasannya ya 📖', 'Hampir! Pelajari dulu pembahasannya 💡', 'Salah itu bagian dari belajar 🌱']), 3800);
      }
    });
    apply();
  }

  /* ------------------------------------------------------------------ */
  /* pasang ke aplikasi                                                  */
  /* ------------------------------------------------------------------ */
  function bindGlobalOnce() {
    if (window.__pfBound) return;
    window.__pfBound = true;
    const tabs = $('.tabs');
    if (tabs) tabs.addEventListener('click', e => {
      const b = e.target.closest && e.target.closest('.tab');
      if (!b || !document.body.classList.contains('pct-mode')) return;
      const msg = {
        materi: 'Baca pelan-pelan. Aku di sini kalau bingung 📖',
        coba: 'Waktunya main! Coba tebak toko mana yang lebih hemat 🛒',
        latihan: 'Semangat! Kamu pasti bisa 💪'
      }[b.dataset.tab];
      if (msg) say(msg, 3200);
    });
  }

  function enhance() {
    document.body.classList.toggle('pf-reduce', reduce);
    ensureMascot();
    buildMateri();
    buildCoba();
    bindQuizOnce();
    bindGlobalOnce();
    setTimeout(() => say('Halo! Aku Persi 👋 Ayo kita jinakkan diskon bersama!', 4200), 900);
  }

  function install() {
    const prevOpen = window.openModule;
    if (typeof prevOpen === 'function') {
      window.openModule = function (id) {
        const result = prevOpen.apply(this, arguments);
        const view = document.getElementById('moduleView');
        const active = id === PCT && view && view.classList.contains('active');
        document.body.classList.toggle('pct-mode', !!active);
        if (active) {
          try { enhance(); } catch (err) { console.error('[percentage-fun]', err); }
        }
        return result;
      };
    }
    const prevShow = window.showPanel;
    if (typeof prevShow === 'function') {
      window.showPanel = function (id) {
        const result = prevShow.apply(this, arguments);
        if (id !== 'moduleView') document.body.classList.remove('pct-mode');
        return result;
      };
    }
    const mark = () => {
      const btn = $('#moduleCards [data-open="' + PCT + '"]');
      const card = btn && btn.closest('.module-card');
      if (card && !card.classList.contains('pf-card-fun')) {
        card.classList.add('pf-card-fun');
        card.insertAdjacentHTML('afterbegin', '<span class="pf-ribbon">✨ SERU!</span>');
      }
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(mark, 0));
    else mark();
  }

  window.PercentFun = { confetti, say, enhance };
  install();
})();
