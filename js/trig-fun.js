/*
  TRIG FUN — lapisan tampilan animasi untuk modul Trigonometri.

  File ini TIDAK mengubah isi materi. Ia hanya "membungkus" openModule():
  setelah modul trigonometri dirender, ia menambahkan bagian visual
  (maskot, segitiga interaktif, lingkaran satuan, kartu flip, dll.),
  mengubah catatan panjang menjadi akordeon, dan menambah efek di tab
  Coba Interaktif & Latihan Soal.

  Untuk menonaktifkan semuanya, cukup hapus 2 baris <link>/<script>
  trig-fun di index.html.
*/
(function () {
  'use strict';

  const TRIG = 'trigonometri';
  const reduce = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* ------------------------------------------------------------------ */
  /* util                                                                */
  /* ------------------------------------------------------------------ */
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const rad = d => d * Math.PI / 180;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const fmt = (n, d) => Number(n).toFixed(d === undefined ? 2 : d).replace('.', ',');
  const signed = (n, d) => {
    if (Math.abs(n) < Math.pow(10, -(d + 1))) n = 0;
    return fmt(n, d).replace('-', '−');
  };
  const setAttrs = (el, o) => { if (!el) return; for (const k in o) el.setAttribute(k, o[k]); };

  /* ------------------------------------------------------------------ */
  /* pelacak visibilitas & reveal saat scroll                            */
  /* ------------------------------------------------------------------ */
  const vis = new WeakMap();
  let visIO = null;
  function watchVisible(el) {
    if (!el) return;
    if (!('IntersectionObserver' in window)) { vis.set(el, true); return; }
    if (!visIO) visIO = new IntersectionObserver(es => es.forEach(e => vis.set(e.target, e.isIntersecting)), { threshold: 0.05 });
    visIO.observe(el);
  }
  const isVis = el => vis.get(el) === true;

  let revIO = null;
  function reveal(root) {
    const els = $$('.tf-reveal', root);
    if (reduce || !('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); return; }
    if (!revIO) {
      revIO = new IntersectionObserver((es, o) => es.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); o.unobserve(e.target); }
      }), { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });
    }
    els.forEach(e => revIO.observe(e));
  }

  /* ------------------------------------------------------------------ */
  /* maskot "Tri" (SVG)                                                  */
  /* ------------------------------------------------------------------ */
  const triSvg = (cls) => `
<svg class="tf-tri ${cls || ''}" viewBox="0 0 200 200" aria-hidden="true" focusable="false">
  <ellipse class="tf-shadow" cx="100" cy="190" rx="68" ry="8" fill="rgba(36,27,58,.14)"/>
  <g class="tf-tri-body">
    <g class="tf-arm">
      <line x1="112" y1="116" x2="150" y2="82" stroke="#241B3A" stroke-width="6" stroke-linecap="round"/>
      <circle cx="153" cy="79" r="9" fill="#FFE08A" stroke="#241B3A" stroke-width="5"/>
    </g>
    <path d="M30 172 V40 L172 172 Z" fill="#F2C94C" stroke="#241B3A" stroke-width="6" stroke-linejoin="round"/>
    <path d="M30 150 H52 V172" fill="none" stroke="#241B3A" stroke-width="4" stroke-linejoin="round" opacity=".55"/>
    <ellipse class="tf-eye" cx="60" cy="128" rx="6" ry="8" fill="#241B3A"/>
    <ellipse class="tf-eye" cx="90" cy="140" rx="6" ry="8" fill="#241B3A"/>
    <circle cx="46" cy="148" r="6" fill="#FF4D8D" opacity=".45"/>
    <circle cx="108" cy="152" r="6" fill="#FF4D8D" opacity=".45"/>
    <path d="M64 152 Q76 165 90 156" fill="none" stroke="#241B3A" stroke-width="5" stroke-linecap="round"/>
    <text x="126" y="166" font-size="17" font-weight="700" font-family="Space Grotesk, sans-serif" fill="#241B3A">θ</text>
    <ellipse cx="60" cy="176" rx="16" ry="7" fill="#FF4D8D" stroke="#241B3A" stroke-width="4"/>
    <ellipse cx="124" cy="176" rx="16" ry="7" fill="#FF4D8D" stroke="#241B3A" stroke-width="4"/>
  </g>
</svg>`;

  let mascotEl = null, bubbleEl = null, bubbleTimer = 0;
  const lastSay = {};
  const FACTS = [
    'Kata “trigonometri” berasal dari bahasa Yunani: trigonon (segitiga) + metron (ukuran) 📐',
    'Nada murni itu gelombang sinus, lho. Jadi musik juga pakai trigonometri 🎵',
    'Konon, Thales mengukur tinggi piramida dari panjang bayangannya 🏜️',
    'Nilai sin dan cos nggak pernah lebih dari 1 atau kurang dari −1. Mereka “terkurung” di lingkaran satuan ⭕',
    'Game 3D memakai sin & cos ribuan kali per detik untuk memutar kamera 🎮',
    'sin 30° = ½. Separuh pas! Gampang diingat 😄',
    'Kalau tan θ = 1, tinggi dan jaraknya sama. Itu sudut 45° ✨'
  ];

  function ensureMascot() {
    if (mascotEl && mascotEl.isConnected) return;
    mascotEl = document.createElement('div');
    mascotEl.className = 'tf-mascot';
    mascotEl.innerHTML =
      '<div class="tf-bubble" role="status" aria-live="polite"></div>' +
      '<button type="button" class="tf-mascot-btn" aria-label="Tri, teman belajarmu. Klik untuk fakta seru">' + triSvg('') + '</button>';
    document.body.appendChild(mascotEl);
    bubbleEl = $('.tf-bubble', mascotEl);
    $('.tf-mascot-btn', mascotEl).addEventListener('click', () => say(pick(FACTS), 5600));
  }

  function say(text, ms) {
    if (!bubbleEl || !document.body.classList.contains('trig-mode')) return;
    bubbleEl.textContent = text;
    bubbleEl.classList.remove('show');
    void bubbleEl.offsetWidth;
    bubbleEl.classList.add('show');
    mascotEl.classList.remove('talk');
    void mascotEl.offsetWidth;
    mascotEl.classList.add('talk');
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(() => { bubbleEl.classList.remove('show'); mascotEl.classList.remove('talk'); }, ms || 3400);
  }
  function sayCool(key, text, cool, ms) {
    const now = Date.now();
    if (lastSay[key] && now - lastSay[key] < (cool || 3500)) return;
    lastSay[key] = now;
    say(text, ms);
  }

  /* ------------------------------------------------------------------ */
  /* confetti                                                            */
  /* ------------------------------------------------------------------ */
  const parts = [];
  let cv = null, cx = null, raf = 0;
  const CONF_COLORS = ['#FF4D8D', '#7C3AED', '#F2C94C', '#17C3B2', '#FF9F1C', '#3B82F6'];
  const CONF_EMOJI = ['⭐', '✨', '🎉', '📐', '💛'];

  function confetti(x, y, n) {
    if (reduce) return;
    if (!cv) {
      cv = document.createElement('canvas');
      cv.className = 'tf-confetti';
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
        e: Math.random() < 0.18 ? CONF_EMOJI[i % CONF_EMOJI.length] : null, life: 0
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
  function wavePath(w, h, amp, cycles, phase) {
    let d = 'M0 ' + h;
    for (let x = 0; x <= w; x += 20) {
      d += ' L' + x + ' ' + (h / 2 - amp * Math.sin(x / w * cycles * 2 * Math.PI + phase)).toFixed(1);
    }
    return d + ' L' + w + ' ' + h + ' Z';
  }

  const FLOATS = [
    ['sin', '#FF4D8D', 58, 8], ['cos', '#17C3B2', 80, 6], ['tan', '#FF9F1C', 94, 24], ['θ', '#7C3AED', 66, 44],
    ['π', '#3B82F6', 86, 52], ['30°', '#FF9F1C', 55, 62], ['45°', '#17C3B2', 74, 74], ['60°', '#FF4D8D', 92, 74],
    ['√3', '#7C3AED', 52, 30], ['∠', '#E5B93A', 96, 44]
  ];
  const floatLayer = () => '<div class="tf-float-layer" aria-hidden="true">' + FLOATS.map((f, i) =>
    `<span style="left:${f[2]}%;top:${f[3]}%;--c:${f[1]};--d:${5 + (i % 4)}s;--dl:${-i}s;--r:${(i % 2 ? 1 : -1) * 8}deg">${f[0]}</span>`).join('') + '</div>';

  const SPECIAL = [
    { d: 0,  e: '😴', cap: 'rebahan',          bg: '#E4F4FF', s: '0',    c: '1',    t: '0' },
    { d: 30, e: '🛝', cap: 'perosotan landai', bg: '#FFF1B8', s: '1/2',  c: '√3/2', t: '√3/3' },
    { d: 45, e: '🪜', cap: 'tangga santai',    bg: '#FFD9E8', s: '√2/2', c: '√2/2', t: '1' },
    { d: 60, e: '⛰️', cap: 'tanjakan curam',   bg: '#D5F6EC', s: '√3/2', c: '1/2',  t: '√3' },
    { d: 90, e: '🗼', cap: 'tegak lurus',      bg: '#E9DEFF', s: '1',    c: '0',    t: 'tak terdef.' }
  ];

  const AROUND = [
    ['🏗️', 'Arsitek & tukang', 'Menghitung kemiringan atap dan panjang rangka.', '#FFF1B8', 'Atap miring 30° itu pakai tan 30° untuk tahu tingginya! 🏠'],
    ['🎮', 'Game 3D', 'Karakter berputar, kamera bergerak, peluru melengkung.', '#FFD9E8', 'Setiap kali karaktermu menoleh, ada sin & cos yang bekerja di belakangnya 🎮'],
    ['🛰️', 'GPS & peta', 'Jarak dan arah dihitung dari sudut antar titik.', '#D5F6EC', 'Navigasi memakai segitiga besar antara kamu dan satelit 🛰️'],
    ['🎵', 'Musik & suara', 'Nada adalah gelombang sinus yang bergetar.', '#E9DEFF', 'Makin cepat gelombangnya bergetar, makin tinggi nadanya 🎶'],
    ['🤖', 'Robot', 'Sudut sendi lengan menentukan posisi tangan robot.', '#E4F4FF', 'Lengan robot punya segitiga tak terlihat di tiap sendinya 🦾'],
    ['🎢', 'Roller coaster', 'Sudut tanjakan menentukan seberapa seru (dan ngeri)!', '#FFE3CC', 'Tanjakan pertama sering sekitar 45° atau lebih, kamu tahu rasanya 😱']
  ];

  function adventureHTML() {
    const wave1 = wavePath(2400, 80, 22, 8, 0), wave2 = wavePath(2400, 80, 16, 8, 1.6);
    const hero = `
<section class="tf-hero tf-reveal" aria-label="Pembuka petualangan trigonometri">
  ${floatLayer()}
  <div class="tf-hero-copy">
    <span class="tf-badge">🎢 PETUALANGAN TRIGONOMETRI</span>
    <h2>Halo, aku <span>Tri</span> 👋<br>Yuk main sama sudut!</h2>
    <p class="tf-typed" id="tfTyped" aria-live="off"></p>
    <div class="tf-hero-chips">
      <button type="button" data-jump="tfSec1">🔺 Segitiga</button>
      <button type="button" data-jump="tfSec2">🎡 Lingkaran</button>
      <button type="button" data-jump="tfSec3">⭐ Sudut istimewa</button>
      <button type="button" data-jump="tfSec4">🌍 Di sekitarmu</button>
    </div>
  </div>
  <div class="tf-hero-art">${triSvg('')}</div>
  <div class="tf-hero-wave" aria-hidden="true">
    <svg viewBox="0 0 2400 80" preserveAspectRatio="none"><path d="${wave1}" fill="#FFD3E5"/></svg>
    <svg viewBox="0 0 2400 80" preserveAspectRatio="none"><path d="${wave2}" fill="#E5D8FF"/></svg>
  </div>
</section>`;

    const sec1 = `
<section class="tf-sec tf-reveal" id="tfSec1" style="--c1:#FF4D8D;--c2:#FF9F1C">
  <h3><span class="tf-step">1</span>Kenalan sama sisi segitiga <em>🔺</em></h3>
  <p class="tf-sub">Geser sudut θ, lalu pilih rumus. Sisi yang dipakai akan berdenyut!</p>
  <div class="tf-tri-grid">
    <div class="tf-stage">
      <svg id="tfTriSvg" viewBox="0 0 360 270" role="img" aria-label="Segitiga siku-siku dengan sisi depan, samping, dan miring">
        <line x1="10" y1="230" x2="350" y2="230" stroke="#C9BFE0" stroke-width="3" stroke-dasharray="2 9" stroke-linecap="round"/>
        <polygon id="tfTriFill" class="tf-tri-fill"/>
        <line id="tfAdj" class="tf-side adj"/>
        <line id="tfOpp" class="tf-side opp"/>
        <line id="tfHyp" class="tf-side hyp"/>
        <path id="tfRight" fill="none" stroke="#241B3A" stroke-width="2.5"/>
        <path id="tfArc" fill="none" stroke="#FF9F1C" stroke-width="4" stroke-linecap="round"/>
        <text id="tfTheta" fill="#E58300" font-size="18" font-weight="800" text-anchor="middle">θ</text>
        <text id="tfLblOpp" class="tf-lbl" fill="#E0306F"></text>
        <text id="tfLblAdj" class="tf-lbl" fill="#0E9C8E" text-anchor="middle"></text>
        <text id="tfLblHyp" class="tf-lbl" fill="#6D28D9" text-anchor="middle"></text>
        <text id="tfAnt" class="tf-ant" text-anchor="middle">🐜</text>
      </svg>
    </div>
    <div>
      <div class="tf-mode-row" role="group" aria-label="Pilih perbandingan">
        <button type="button" class="tf-mode active" data-tri-mode="sin">sin θ</button>
        <button type="button" class="tf-mode" data-tri-mode="cos">cos θ</button>
        <button type="button" class="tf-mode" data-tri-mode="tan">tan θ</button>
      </div>
      <div class="tf-mnemo" aria-label="Jembatan keledai"><span>Sin-De-Mi</span><span>Cos-Sa-Mi</span><span>Tan-De-Sa</span></div>
      <div class="tf-formula-box" id="tfTriInfo"></div>
      <div class="tf-slider-line">
        <label for="tfTriAngle">Sudut θ <output id="tfTriAngleOut">35°</output></label>
        <input id="tfTriAngle" type="range" min="10" max="80" value="35">
      </div>
      <div class="tf-legend"><span><i style="background:#FF4D8D"></i>depan (De)</span><span><i style="background:#17C3B2"></i>samping (Sa)</span><span><i style="background:#7C3AED"></i>miring (Mi)</span></div>
    </div>
  </div>
</section>`;

    const sec2 = `
<section class="tf-sec tf-reveal" id="tfSec2" style="--c1:#7C3AED;--c2:#17C3B2">
  <h3><span class="tf-step">2</span>Lingkaran satuan &amp; gelombang <em>🎡</em></h3>
  <p class="tf-sub">Seret si 🐥 mengelilingi lingkaran! Tingginya adalah <b style="color:#E0306F">sin θ</b>, jarak ke kanannya adalah <b style="color:#0E9C8E">cos θ</b>, dan jejak tingginya menjadi gelombang.</p>
  <div class="tf-uc-grid">
    <svg id="tfUcSvg" viewBox="0 0 280 280" role="img" aria-label="Lingkaran satuan yang bisa diputar">
      <circle class="tf-circle" cx="140" cy="140" r="100" fill="#fff"/>
      <path id="tfQ" class="tf-q"/>
      <line class="tf-axis" x1="14" y1="140" x2="266" y2="140"/>
      <line class="tf-axis" x1="140" y1="14" x2="140" y2="266"/>
      <text class="tf-qlabel" x="238" y="32" text-anchor="middle">I</text><text class="tf-qsign" x="238" y="46" text-anchor="middle">semua</text>
      <text class="tf-qlabel" x="42" y="32" text-anchor="middle">II</text><text class="tf-qsign" x="42" y="46" text-anchor="middle">sin</text>
      <text class="tf-qlabel" x="42" y="250" text-anchor="middle">III</text><text class="tf-qsign" x="42" y="264" text-anchor="middle">tan</text>
      <text class="tf-qlabel" x="238" y="250" text-anchor="middle">IV</text><text class="tf-qsign" x="238" y="264" text-anchor="middle">cos</text>
      <line id="tfGuide" class="tf-guide"/>
      <line id="tfCos" class="tf-cosline"/>
      <line id="tfSin" class="tf-sinline"/>
      <line id="tfRad" class="tf-radius"/>
      <path id="tfUcArc" class="tf-arc"/>
      <circle id="tfPt" class="tf-pt" r="7"/>
      <text id="tfEmoji" class="tf-emoji">🐥</text>
    </svg>
    <svg id="tfWaveSvg" viewBox="0 0 400 280" role="img" aria-label="Grafik gelombang yang digambar mengikuti sudut">
      <line class="tf-axis" x1="0" y1="140" x2="400" y2="140"/>
      <line class="tf-axis" x1="24" y1="30" x2="24" y2="250"/>
      <line class="tf-grid" x1="24" y1="40" x2="376" y2="40"/><line class="tf-grid" x1="24" y1="240" x2="376" y2="240"/>
      <text class="tf-tick" x="30" y="36">1</text><text class="tf-tick" x="30" y="256">−1</text>
      <text class="tf-tick" x="24" y="268" text-anchor="middle">0°</text><text class="tf-tick" x="112" y="268" text-anchor="middle">90°</text>
      <text class="tf-tick" x="200" y="268" text-anchor="middle">180°</text><text class="tf-tick" x="288" y="268" text-anchor="middle">270°</text>
      <text class="tf-tick" x="376" y="268" text-anchor="middle">360°</text>
      <path id="tfWaveBg" class="tf-wave-bg"/>
      <path id="tfWaveFg" class="tf-wave-fg"/>
      <line id="tfWaveGuide" class="tf-guide"/>
      <line id="tfWaveStem" class="tf-guide" style="stroke:#8A82A0"/>
      <circle id="tfWaveDot" class="tf-wave-dot" r="8"/>
    </svg>
  </div>
  <div class="tf-uc-controls">
    <button type="button" class="tf-play" id="tfPlay">✋ Jeda</button>
    <span class="tf-seg" role="group" aria-label="Pilih gelombang"><button type="button" class="active" data-wave="sin">gelombang sin</button><button type="button" data-wave="cos">gelombang cos</button></span>
    <span style="font-weight:800;font-size:13px;color:var(--muted)">Lompat ke:</span>
    ${[0, 30, 45, 60, 90, 180, 270].map(a => `<button type="button" class="tf-jump" data-jump-angle="${a}">${a}°</button>`).join('')}
  </div>
  <div class="tf-vals" aria-live="off">
    <div class="tf-val ang"><small>SUDUT θ</small><b id="tfValAng">0°</b></div>
    <div class="tf-val cos"><small>cos θ (x)</small><b id="tfValCos">1</b></div>
    <div class="tf-val sin"><small>sin θ (y)</small><b id="tfValSin">0</b></div>
    <div class="tf-val tan"><small>tan θ</small><b id="tfValTan">0</b></div>
  </div>
  <div class="tf-astc" id="tfAstc">
    <div><b>I</b>Semua +</div><div><b>II</b>Sin +</div><div><b>III</b>Tan +</div><div><b>IV</b>Cos +</div>
  </div>
  <p class="tf-astc-note" id="tfAstcNote"></p>
  <div class="tf-mnemo" style="margin-top:12px"><span>🧠 Jembatan keledai:</span><span>Semua</span><span>Siswa</span><span>Terlihat</span><span>Ceria</span></div>
</section>`;

    const sec3 = `
<section class="tf-sec tf-reveal" id="tfSec3" style="--c1:#F2C94C;--c2:#FF4D8D">
  <h3><span class="tf-step">3</span>Sudut istimewa: kartu rahasia <em>⭐</em></h3>
  <p class="tf-sub">Ketuk kartunya untuk melihat nilai sin, cos, dan tan. Nilai-nilai ini sering keluar di soal tanpa kalkulator!</p>
  <div class="tf-flip-tools"><span style="font-weight:700;color:var(--ink-soft)">Tips: hafalkan 30°, 45°, 60° dulu 😉</span><button type="button" class="tf-mini-btn" id="tfFlipAll">🔄 Balik semua</button></div>
  <div class="tf-flip-row">
    ${SPECIAL.map(s => `
    <div class="tf-flip" tabindex="0" role="button" aria-label="Sudut ${s.d} derajat. Tekan untuk membalik kartu" style="--bg-c:${s.bg}">
      <div class="tf-flip-in">
        <div class="tf-face tf-front"><div class="tf-deg">${s.d}°</div><div class="tf-emo">${s.e}</div><small>${s.cap}</small></div>
        <div class="tf-face tf-back"><b>${s.d}°</b><div class="s">sin = ${s.s}</div><div class="c">cos = ${s.c}</div><div class="t">tan = ${s.t}</div></div>
      </div>
    </div>`).join('')}
  </div>
</section>`;

    const sec4 = `
<section class="tf-sec tf-reveal" id="tfSec4" style="--c1:#17C3B2;--c2:#3B82F6">
  <h3><span class="tf-step">4</span>Trigonometri di sekitarmu <em>🌍</em></h3>
  <p class="tf-sub">Ketuk kartu untuk fakta seru dari Tri!</p>
  <div class="tf-fun-grid">
    ${AROUND.map(a => `<button type="button" class="tf-fun" style="--bg-c:${a[3]}" data-fact="${a[4]}"><span class="tf-fun-e">${a[0]}</span><h4>${a[1]}</h4><p>${a[2]}</p></button>`).join('')}
  </div>
</section>`;

    const divider = '<div class="tf-divider"><span>📖</span> Catatan lengkap <span>✏️</span></div>';
    return `<div class="tf-adv">${hero}${sec1}${sec2}${sec3}${sec4}${divider}</div>`;
  }

  /* ---------- hero: mengetik + tombol lompat ---------- */
  function wireHero(root) {
    const el = $('#tfTyped', root);
    if (el) {
      const phrases = [
        'Trigonometri itu bukan hafalan, tapi permainan sudut! 🎯',
        'Dari tinggi gedung sampai game 3D, semuanya pakai sin, cos, tan 🚀',
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

  /* ---------- seksi 1: segitiga interaktif ---------- */
  function wireTriangle(root) {
    const svg = $('#tfTriSvg', root), slider = $('#tfTriAngle', root);
    if (!svg || !slider) return { tick() {} };
    const out = $('#tfTriAngleOut', root), info = $('#tfTriInfo', root);
    const adj = $('#tfAdj', svg), opp = $('#tfOpp', svg), hyp = $('#tfHyp', svg);
    const lblO = $('#tfLblOpp', svg), lblA = $('#tfLblAdj', svg), lblH = $('#tfLblHyp', svg);
    const A = { x: 56, y: 230 }, L = 210;
    let mode = 'sin', P = { A, B: A, C: A };
    watchVisible(svg);

    function draw() {
      const a = +slider.value, c = Math.cos(rad(a)), s = Math.sin(rad(a));
      const B = { x: A.x + L * c, y: A.y }, C = { x: B.x, y: A.y - L * s };
      P = { A, B, C };
      out.textContent = a + '°';
      setAttrs($('#tfTriFill', svg), { points: `${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}` });
      setAttrs(adj, { x1: A.x, y1: A.y, x2: B.x, y2: B.y });
      setAttrs(opp, { x1: B.x, y1: B.y, x2: C.x, y2: C.y });
      setAttrs(hyp, { x1: A.x, y1: A.y, x2: C.x, y2: C.y });
      setAttrs($('#tfRight', svg), { d: `M${B.x - 14} ${B.y} V${B.y - 14} H${B.x}` });
      setAttrs($('#tfArc', svg), { d: `M${A.x + 40} ${A.y} A40 40 0 0 0 ${A.x + 40 * c} ${A.y - 40 * s}` });
      setAttrs($('#tfTheta', svg), { x: A.x + 60 * Math.cos(rad(a / 2)), y: A.y - 60 * Math.sin(rad(a / 2)) + 6 });
      const dep = 10 * s, sam = 10 * c;
      lblO.textContent = 'depan ' + fmt(dep, 1); setAttrs(lblO, { x: B.x + 10, y: (B.y + C.y) / 2 + 5 });
      lblA.textContent = 'samping ' + fmt(sam, 1); setAttrs(lblA, { x: (A.x + B.x) / 2, y: A.y + 24 });
      lblH.textContent = 'miring 10';
      const mx = (A.x + C.x) / 2, my = (A.y + C.y) / 2;
      setAttrs(lblH, { x: mx - s * 34, y: my - c * 22 });
      const on = { sin: ['opp', 'hyp'], cos: ['adj', 'hyp'], tan: ['opp', 'adj'] }[mode];
      [['opp', opp, lblO], ['adj', adj, lblA], ['hyp', hyp, lblH]].forEach(([k, line, lab]) => {
        const active = on.indexOf(k) > -1;
        line.classList.toggle('on', active); line.classList.toggle('off', !active);
        lab.classList.toggle('off', !active);
      });
      const f = {
        sin: `sin θ = depan ÷ miring<br>= ${fmt(dep, 2)} ÷ 10 = <span style="color:#E0306F">${fmt(s, 3)}</span>`,
        cos: `cos θ = samping ÷ miring<br>= ${fmt(sam, 2)} ÷ 10 = <span style="color:#0E9C8E">${fmt(c, 3)}</span>`,
        tan: `tan θ = depan ÷ samping<br>= ${fmt(dep, 2)} ÷ ${fmt(sam, 2)} = <span style="color:#E58300">${fmt(s / c, 3)}</span>`
      };
      info.innerHTML = f[mode];
    }
    slider.addEventListener('input', () => {
      draw();
      const a = +slider.value;
      if (a === 45) sayCool('tri45', '45°! Depan dan samping sama panjang, jadi tan 45° = 1 ✨', 4000);
    });
    $$('[data-tri-mode]', root).forEach(b => b.addEventListener('click', () => {
      mode = b.dataset.triMode;
      $$('[data-tri-mode]', root).forEach(x => x.classList.toggle('active', x === b));
      draw();
      say({ sin: 'Sin-De-Mi: depan dibagi miring! 🐟', cos: 'Cos-Sa-Mi: samping dibagi miring! 🍪', tan: 'Tan-De-Sa: depan dibagi samping! 🌳' }[mode], 3000);
    }));
    draw();

    const ant = $('#tfAnt', svg);
    return {
      tick(t) {
        if (!isVis(svg) || !ant) return;
        const k = (Math.sin(t / 1100) + 1) / 2;
        const x = P.A.x + (P.C.x - P.A.x) * k, y = P.A.y + (P.C.y - P.A.y) * k;
        setAttrs(ant, { x: x, y: y - 6 });
      }
    };
  }

  /* ---------- seksi 2: lingkaran satuan ---------- */
  function wireCircle(root) {
    const svg = $('#tfUcSvg', root), wsvg = $('#tfWaveSvg', root);
    if (!svg || !wsvg) return { tick() {} };
    const O = { x: 140, y: 140 }, R = 100, X0 = 24, W = 352, H0 = 140, AMP = 100;
    let ang = 30, playing = !reduce, dragging = false, wave = 'sin', tween = 0;
    watchVisible(svg);

    const el = id => document.getElementById(id);
    const qPaths = [
      `M${O.x} ${O.y} L${O.x + R} ${O.y} A${R} ${R} 0 0 0 ${O.x} ${O.y - R} Z`,
      `M${O.x} ${O.y} L${O.x} ${O.y - R} A${R} ${R} 0 0 0 ${O.x - R} ${O.y} Z`,
      `M${O.x} ${O.y} L${O.x - R} ${O.y} A${R} ${R} 0 0 0 ${O.x} ${O.y + R} Z`,
      `M${O.x} ${O.y} L${O.x} ${O.y + R} A${R} ${R} 0 0 0 ${O.x + R} ${O.y} Z`
    ];
    const NOTES = [
      'Kuadran I: sin, cos, dan tan semuanya positif 🎉',
      'Kuadran II: hanya sin yang positif; cos dan tan negatif.',
      'Kuadran III: hanya tan yang positif.',
      'Kuadran IV: hanya cos yang positif.'
    ];
    const fn = () => (wave === 'sin' ? Math.sin : Math.cos);
    function buildBg() {
      let d = '';
      for (let a = 0; a <= 360; a += 4) {
        d += (a ? ' L' : 'M') + (X0 + a / 360 * W).toFixed(1) + ' ' + (H0 - AMP * fn()(rad(a))).toFixed(1);
      }
      setAttrs(el('tfWaveBg'), { d });
    }

    function update() {
      const r = rad(ang), c = Math.cos(r), s = Math.sin(r);
      const Px = O.x + R * c, Py = O.y - R * s;
      setAttrs(el('tfRad'), { x1: O.x, y1: O.y, x2: Px, y2: Py });
      setAttrs(el('tfCos'), { x1: O.x, y1: O.y, x2: Px, y2: O.y });
      setAttrs(el('tfSin'), { x1: Px, y1: O.y, x2: Px, y2: Py });
      setAttrs(el('tfPt'), { cx: Px, cy: Py });
      setAttrs(el('tfEmoji'), { x: Px, y: Py });
      setAttrs(el('tfUcArc'), { d: ang < 1 ? '' : `M${O.x + 26} ${O.y} A26 26 0 ${ang > 180 ? 1 : 0} 0 ${O.x + 26 * c} ${O.y - 26 * s}` });
      const q = Math.min(3, Math.floor(ang / 90));
      setAttrs(el('tfQ'), { d: qPaths[q] });

      // gelombang
      let d = '';
      for (let a = 0; a <= ang; a += 3) d += (a ? ' L' : 'M') + (X0 + a / 360 * W).toFixed(1) + ' ' + (H0 - AMP * fn()(rad(a))).toFixed(1);
      const wx = X0 + ang / 360 * W, wy = H0 - AMP * fn()(r);
      d += ' L' + wx.toFixed(1) + ' ' + wy.toFixed(1);
      setAttrs(el('tfWaveFg'), { d });
      setAttrs(el('tfWaveDot'), { cx: wx, cy: wy });
      setAttrs(el('tfWaveStem'), { x1: wx, y1: H0, x2: wx, y2: wy });
      // garis bantu sejajar antar dua gambar
      setAttrs(el('tfGuide'), { x1: Px, y1: Py, x2: wave === 'sin' ? 280 : Px, y2: Py });
      setAttrs(el('tfWaveGuide'), { x1: 0, y1: wy, x2: wave === 'sin' ? wx : 0, y2: wy });

      // angka
      el('tfValAng').textContent = Math.round(ang) + '°';
      const vc = el('tfValCos'), vs = el('tfValSin'), vt = el('tfValTan');
      vc.textContent = signed(c, 3); vs.textContent = signed(s, 3);
      vc.classList.toggle('neg', c < -0.0005); vs.classList.toggle('neg', s < -0.0005);
      if (Math.abs(c) < 0.0005) { vt.textContent = 'tak terdef.'; vt.style.fontSize = '14px'; vt.classList.remove('neg'); }
      else { const t = s / c; vt.textContent = signed(t, 3); vt.style.fontSize = ''; vt.classList.toggle('neg', t < -0.0005); }

      $$('#tfAstc div', root).forEach((d2, i) => d2.classList.toggle('on', i === q));
      const onAxis = Math.abs(ang % 90) < 0.6 || Math.abs(ang % 90) > 89.4;
      el('tfAstcNote').textContent = onAxis ? 'Tepat di sumbu: ini sudut kuadran (0°, 90°, 180°, 270°) 🎯' : NOTES[q];
    }
    function setAng(a) { ang = ((a % 360) + 360) % 360; update(); }

    function angFromEvent(e) {
      const rc = svg.getBoundingClientRect();
      const x = (e.clientX - rc.left) / rc.width * 280, y = (e.clientY - rc.top) / rc.height * 280;
      let a = Math.atan2(O.y - y, x - O.x) * 180 / Math.PI;
      if (a < 0) a += 360;
      return a;
    }
    function syncPlay() { el('tfPlay').textContent = playing ? '✋ Jeda' : '▶️ Putar'; }
    svg.addEventListener('pointerdown', e => {
      dragging = true; playing = false; cancelAnimationFrame(tween); syncPlay();
      try { svg.setPointerCapture(e.pointerId); } catch (err) { /* abaikan */ }
      setAng(angFromEvent(e));
      e.preventDefault();
    });
    svg.addEventListener('pointermove', e => { if (dragging) setAng(angFromEvent(e)); });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(t => svg.addEventListener(t, () => { dragging = false; }));

    el('tfPlay').addEventListener('click', () => { cancelAnimationFrame(tween); playing = !playing; syncPlay(); });
    $$('[data-wave]', root).forEach(b => b.addEventListener('click', () => {
      wave = b.dataset.wave;
      $$('[data-wave]', root).forEach(x => x.classList.toggle('active', x === b));
      wsvg.querySelector('#tfWaveFg').style.stroke = wave === 'sin' ? '' : '#17C3B2';
      wsvg.querySelector('#tfWaveDot').style.fill = wave === 'sin' ? '' : '#17C3B2';
      buildBg(); update();
      say(wave === 'sin' ? 'Gelombang sin mulai dari 0 lalu naik 📈' : 'Gelombang cos mulai dari puncak (1) lalu turun 📉', 3200);
    }));
    $$('[data-jump-angle]', root).forEach(b => b.addEventListener('click', () => {
      playing = false; syncPlay();
      const target = +b.dataset.jumpAngle;
      const from = ang;
      let diff = ((target - from + 540) % 360) - 180;
      if (reduce) { setAng(target); return; }
      const t0 = performance.now(), dur = 550;
      cancelAnimationFrame(tween);
      (function step(now) {
        const k = clamp((now - t0) / dur, 0, 1), e = 1 - Math.pow(1 - k, 3);
        setAng(from + diff * e);
        if (k < 1) tween = requestAnimationFrame(step);
      })(t0);
      sayCool('jump', 'Lompat ke ' + target + '°! Lihat nilai sin dan cos-nya berubah 👀', 4500);
    }));

    buildBg(); update(); syncPlay();
    let last = 0;
    return {
      tick(t) {
        const dt = Math.min(50, t - last) || 16; last = t;
        if (playing && !dragging && isVis(svg)) setAng(ang + dt * 0.04);
      }
    };
  }

  /* ---------- seksi 3 & 4 ---------- */
  function wireFlip(root) {
    const cards = $$('.tf-flip', root);
    const toggle = c => {
      c.classList.toggle('flipped');
      if (c.classList.contains('flipped')) sayCool('flip', 'Kartu terbuka! Coba tebak dulu sebelum membalik, lebih seru 😄', 7000);
    };
    cards.forEach(c => {
      c.addEventListener('click', () => toggle(c));
      c.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(c); } });
    });
    const all = $('#tfFlipAll', root);
    if (all) all.addEventListener('click', () => {
      const anyUp = cards.some(c => !c.classList.contains('flipped'));
      cards.forEach((c, i) => setTimeout(() => c.classList.toggle('flipped', anyUp), reduce ? 0 : i * 110));
    });
  }
  function wireFun(root) {
    $$('.tf-fun', root).forEach(b => b.addEventListener('click', () => say(b.dataset.fact, 5200)));
  }

  /* ---------- catatan panjang → akordeon ---------- */
  const ACC_COLORS = ['#FF4D8D', '#7C3AED', '#17C3B2', '#FF9F1C', '#3B82F6', '#E33E57'];
  const ACC_SAY = ['Nah, ini catatan pentingnya! 📝', 'Baca pelan-pelan ya, aku tunggu 🐢', 'Coba bandingkan dengan simulasi di atas 😉', 'Mantap, rajin banget! 🌟'];
  function accordionize(lessons) {
    const host = $$(':scope > .content-card', lessons).find(c => c.querySelector('.content-card'));
    if (!host) return;
    // perbaikan kecil: kotak tips kosong yang terbaca "undefined"
    $$(':scope > .tip', host).forEach(t => { if (!t.textContent.trim() || t.textContent.trim() === 'undefined') t.remove(); });
    const items = $$(':scope > .real-life, :scope > .content-card', host);
    if (!items.length) return;
    host.classList.add('tf-plain');
    const tools = document.createElement('div');
    tools.className = 'tf-acc-tools';
    tools.innerHTML = '<p>📚 Ketuk judul untuk membuka catatan</p><button type="button" class="tf-mini-btn" id="tfAccAll">📂 Buka semua</button>';
    host.insertBefore(tools, items[0]);

    const accs = items.map((it, i) => {
      const h = $('h3', it);
      const title = h ? h.innerHTML : 'Catatan ' + (i + 1);
      if (h) h.remove();
      const acc = document.createElement('div');
      acc.className = 'tf-acc tf-reveal';
      acc.style.setProperty('--c', ACC_COLORS[i % ACC_COLORS.length]);
      acc.innerHTML =
        '<button type="button" class="tf-acc-head" aria-expanded="false"><span class="tf-acc-title">' + title + '</span><span class="tf-acc-chev" aria-hidden="true">▾</span></button>' +
        '<div class="tf-acc-body"><div class="tf-acc-inner"></div></div>';
      const inner = $('.tf-acc-inner', acc);
      while (it.firstChild) inner.appendChild(it.firstChild);
      it.replaceWith(acc);
      $('.tf-acc-head', acc).addEventListener('click', () => {
        const open = acc.classList.toggle('open');
        $('.tf-acc-head', acc).setAttribute('aria-expanded', String(open));
        if (open) sayCool('acc', pick(ACC_SAY), 6000);
      });
      return acc;
    });
    const btn = $('#tfAccAll', host);
    btn.addEventListener('click', () => {
      const anyClosed = accs.some(a => !a.classList.contains('open'));
      accs.forEach(a => { a.classList.toggle('open', anyClosed); $('.tf-acc-head', a).setAttribute('aria-expanded', String(anyClosed)); });
      btn.textContent = anyClosed ? '📁 Tutup semua' : '📂 Buka semua';
    });
  }

  function buildMateri() {
    const lessons = $('#tab-materi .lesson-sections');
    if (!lessons || $('.tf-adv', lessons)) return;
    lessons.insertAdjacentHTML('afterbegin', adventureHTML());
    const adv = $('.tf-adv', lessons);
    wireHero(adv);
    const tri = wireTriangle(adv), circ = wireCircle(adv);
    wireFlip(adv); wireFun(adv);
    accordionize(lessons);
    $$(':scope > .content-card', lessons).forEach(c => c.classList.add('tf-reveal'));
    reveal(lessons);

    if (!reduce) {
      (function frame(t) {
        if (!adv.isConnected) return;
        tri.tick(t); circ.tick(t);
        requestAnimationFrame(frame);
      })(performance.now());
    }
  }

  /* ------------------------------------------------------------------ */
  /* TAB COBA INTERAKTIF                                                 */
  /* ------------------------------------------------------------------ */
  const BUMP_SEL = '.trig-values b,.trig-stat-row b,.trig-special-result,.trig-graph-info';
  function decorateCoba() {
    const root = $('#tab-coba .trig-interactive');
    if (!root) return;
    const hero = $('.trig-hero-card', root);
    if (hero) hero.insertAdjacentHTML('afterbegin', floatLayer());
    $$('.building-scene', root).forEach(s => s.insertAdjacentHTML('beforeend', '<i class="tf-sun">☀️</i><i class="tf-cloud">☁️</i><i class="tf-cloud c2">☁️</i>'));
    $$('.road-scene', root).forEach(s => s.insertAdjacentHTML('beforeend', '<i class="tf-cloud c2">☁️</i>'));
    const slope = $('#trigRoadVisual', root); if (slope) slope.insertAdjacentHTML('beforeend', '<span class="tf-car">🚗</span>');
    const lad = $('#trigLadderVisual', root); if (lad) lad.insertAdjacentHTML('beforeend', '<span class="tf-climber">🐱</span>');
    $$(':scope > .content-card', root).forEach(c => c.classList.add('tf-reveal'));
    reveal(root);
  }

  function bumpEl(t) {
    const now = Date.now();
    if (t._bt && now - t._bt < 320) return;
    t._bt = now;
    t.classList.remove('tf-bump'); void t.offsetWidth; t.classList.add('tf-bump');
  }

  function bindCobaOnce() {
    const tab = $('#tab-coba');
    if (!tab || tab.dataset.tfBound) return;
    tab.dataset.tfBound = '1';

    // angka "melompat" saat berubah
    new MutationObserver(ms => {
      if (!document.body.classList.contains('trig-mode')) return;
      ms.forEach(m => {
        const n = m.target.nodeType === 3 ? m.target.parentElement : m.target;
        const t = n && n.closest ? n.closest(BUMP_SEL) : null;
        if (t) bumpEl(t);
      });
    }).observe(tab, { childList: true, characterData: true, subtree: true });

    tab.addEventListener('click', e => {
      if (!document.body.classList.contains('trig-mode')) return;
      const t = e.target;
      const idOpt = t.closest && t.closest('#trigIdentityOptions button');
      if (idOpt) {
        const fb = $('#trigIdentityFeedback');
        if (fb && fb.textContent.indexOf('Benar') > -1) { confettiAt(idOpt); say('Yes! sin² + cos² = 1 itu identitas paling terkenal 🌟', 4200); }
        else { shake(idOpt); say('Hampir! Ingat: sin² + cos² = 1 💡', 3600); }
        return;
      }
      const chk = t.closest && t.closest('#trigMissionCheck');
      if (chk) {
        const fb = $('#trigMissionFeedback');
        if (fb && fb.textContent.indexOf('Benar') > -1) { confettiAt(chk); say(pick(['Keren! Misi berhasil 🎯', 'Jawabanmu tepat! 🌟', 'Mantap, lanjut misi berikutnya! 🚀']), 3600); }
        else if (fb && fb.textContent.indexOf('Belum tepat') > -1) { shake($('#trigMissionBox')); say('Belum pas. Baca petunjuknya lalu coba lagi, kamu pasti bisa 💪', 4200); }
        return;
      }
      if (t.closest && t.closest('#trigMissionNext')) {
        if ($('.mission-finished')) { confetti(undefined, undefined, 130); say('Semua misi selesai! Kamu hebat banget 🏆', 5000); }
        return;
      }
      const sp = t.closest && t.closest('[data-special-angle]');
      if (sp) { say('Sudut ' + sp.dataset.specialAngle + '° itu istimewa, nilainya bisa dihafal ⭐', 3200); return; }
      const gr = t.closest && t.closest('[data-trig-graph]');
      if (gr) {
        const wrap = $('.trig-canvas-wrap');
        if (wrap) { wrap.classList.remove('tf-draw'); void wrap.offsetWidth; wrap.classList.add('tf-draw'); }
        return;
      }
      if (t.closest && t.closest('#trigSolveBtn')) { say('Ingat: sin positif di kuadran I dan II, jadi biasanya ada dua solusi ✌️', 4200); }
    });

    tab.addEventListener('input', e => {
      if (!document.body.classList.contains('trig-mode')) return;
      const t = e.target, v = +t.value;
      if (t.id === 'trigBuildingAngle') {
        if (v === 45) sayCool('b45', '45°! tan 45° = 1, jadi tinggi sama dengan jarak ✨', 4000);
        else if (v >= 75) sayCool('bhigh', 'Sudutnya curam banget. Gedungnya jadi tinggi sekali! 🏙️', 4000);
      } else if (t.id === 'trigLadderAngle') {
        if (v <= 20) sayCool('lowl', 'Tangga terlalu landai, bisa tergelincir! 🙀', 4500);
        else if (v >= 80) sayCool('highl', 'Terlalu tegak, tangganya bisa terguling! 😱', 4500);
        else if (v === 60) sayCool('l60', 'Di sudut 60°, tinggi = panjang × sin 60° 🪜', 4500);
      } else if (t.id === 'trigRoadRise' || t.id === 'trigRoadRun') {
        const rise = +($('#trigRoadRise') || {}).value, run = +($('#trigRoadRun') || {}).value;
        if (rise / run > 0.15) sayCool('road', 'Wah, tanjakan curam! Mesin mobilnya kerja keras 🚗💨', 4500);
      } else if (t.id === 'trigAngleExplore') {
        if ([30, 45, 60].indexOf(v) > -1) sayCool('ex' + v, v + '° adalah sudut istimewa. Nilainya bisa dihafal! ⭐', 4000);
      }
    });
  }
  function shake(el) {
    if (!el) return;
    el.classList.remove('tf-shake'); void el.offsetWidth; el.classList.add('tf-shake');
    setTimeout(() => el.classList.remove('tf-shake'), 600);
  }

  /* ------------------------------------------------------------------ */
  /* TAB LATIHAN                                                         */
  /* ------------------------------------------------------------------ */
  function bindQuizOnce() {
    const el = $('#tab-latihan');
    if (!el || el.dataset.tfBound) return;
    el.dataset.tfBound = '1';

    const apply = () => {
      if (!document.body.classList.contains('trig-mode')) return;
      const sc = $('.quiz-score', el);
      if (sc && !$('.tf-qbar', el)) {
        const m = sc.textContent.match(/Soal\s+(\d+)\s*\/\s*(\d+)/);
        if (m) {
          const i = +m[1], n = +m[2];
          sc.insertAdjacentHTML('afterend', `<div class="tf-qbar" data-i="${i}" data-n="${n}" style="--p:${((i - 1) / n * 100).toFixed(1)}"><span></span><i aria-hidden="true">🐥</i></div>`);
        }
      }
      if ($('#retry', el) && !$('.tf-trophy', el)) {
        const h = $('h2', el), m = h && h.textContent.match(/(\d+)\s*\/\s*(\d+)/);
        const score = m ? +m[1] : 0, total = m ? +m[2] : 6;
        h.insertAdjacentHTML('beforebegin', `<span class="tf-trophy" aria-hidden="true">${score / total >= 0.8 ? '🏆' : score / total >= 0.5 ? '🌟' : '💪'}</span>`);
        if (score / total >= 0.8) { setTimeout(() => confetti(undefined, undefined, 140), 250); say('Luar biasa! Kamu jagoan trigonometri 🏆', 5000); }
        else if (score / total >= 0.5) say('Bagus! Sedikit lagi sempurna 🌟', 4200);
        else say('Tidak apa-apa, baca materinya lalu coba lagi ya. Aku temani! 💪', 4800);
      }
    };
    new MutationObserver(apply).observe(el, { childList: true, subtree: true });

    el.addEventListener('click', e => {
      if (!document.body.classList.contains('trig-mode')) return;
      const b = e.target.closest && e.target.closest('.option');
      if (!b) return;
      const bar = $('.tf-qbar', el);
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
    if (window.__tfBound) return;
    window.__tfBound = true;
    const tabs = $('.tabs');
    if (tabs) tabs.addEventListener('click', e => {
      const b = e.target.closest && e.target.closest('.tab');
      if (!b || !document.body.classList.contains('trig-mode')) return;
      const msg = {
        materi: 'Baca pelan-pelan. Aku di sini kalau bingung 📖',
        coba: 'Waktunya main! Geser-geser slider-nya ya 🎛️',
        latihan: 'Semangat! Kamu pasti bisa 💪'
      }[b.dataset.tab];
      if (msg) say(msg, 3200);
    });
  }

  function enhance() {
    document.body.classList.toggle('tf-reduce', reduce);
    ensureMascot();
    buildMateri();
    decorateCoba();
    bindCobaOnce();
    bindQuizOnce();
    bindGlobalOnce();
    setTimeout(() => say('Halo! Aku Tri 👋 Ayo kenalan sama sudut dan segitiga!', 4200), 900);
  }

  function install() {
    const prevOpen = window.openModule;
    if (typeof prevOpen === 'function') {
      window.openModule = function (id) {
        const result = prevOpen.apply(this, arguments);
        const view = document.getElementById('moduleView');
        const active = id === TRIG && view && view.classList.contains('active');
        document.body.classList.toggle('trig-mode', !!active);
        if (active) {
          try { enhance(); } catch (err) { console.error('[trig-fun]', err); }
        }
        return result;
      };
    }
    const prevShow = window.showPanel;
    if (typeof prevShow === 'function') {
      window.showPanel = function (id) {
        const result = prevShow.apply(this, arguments);
        if (id !== 'moduleView') document.body.classList.remove('trig-mode');
        return result;
      };
    }
    // pita kecil di kartu modul trigonometri
    const mark = () => {
      const btn = $('#moduleCards [data-open="' + TRIG + '"]');
      const card = btn && btn.closest('.module-card');
      if (card && !card.classList.contains('tf-card-fun')) {
        card.classList.add('tf-card-fun');
        card.insertAdjacentHTML('afterbegin', '<span class="tf-ribbon">✨ SERU!</span>');
      }
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(mark, 0));
    else mark();
  }

  window.TrigFun = { confetti, say, enhance };
  install();
})();
