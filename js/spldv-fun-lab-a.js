/*
  SPLDV LAB (bagian A): helper, grafik dua garis, dan stepper langkah eliminasi/substitusi.
  Semua diekspor lewat window.SXLAB dan dipakai oleh spldv-lab-b.js.
*/
window.SXLAB = (function () {
  const $ = id => document.getElementById(id);
  const neg = n => String(n).replace('-', '−');
  const fmt = n => {
    let r = Math.round(n * 100) / 100;
    if (Object.is(r, -0)) r = 0;
    return neg(r.toLocaleString('id-ID', { maximumFractionDigits: 2 }));
  };
  const coefStr = c => (c === 1 ? '' : c === -1 ? '−' : neg(c));
  const absStr = c => (Math.abs(c) === 1 ? '' : String(Math.abs(c)));
  // koefisien × nilai, tanpa "1(5)" yang janggal
  const mulStr = (c, v) => (c === 1 ? fmt(v) : c === -1 ? '−' + fmt(v) : `${neg(c)}(${fmt(v)})`);

  // a x + b y = c  → teks
  function fmtEq(a, b, c) {
    let s = '';
    if (a !== 0) s += coefStr(a) + 'x';
    if (b !== 0) s += s ? (b > 0 ? ' + ' : ' − ') + absStr(b) + 'y' : coefStr(b) + 'y';
    if (!s) s = '0';
    return s + ' = ' + neg(c);
  }
  // k x + m → teks
  function fmtLin(k, m) {
    let s = '';
    if (k !== 0) s += coefStr(k) + 'x';
    if (m !== 0) s += s ? (m > 0 ? ' + ' : ' − ') + Math.abs(m) : neg(m);
    return s || '0';
  }

  // Selesaikan SPLDV dengan determinan
  function solve(a1, b1, c1, a2, b2, c2) {
    if ((a1 === 0 && b1 === 0) || (a2 === 0 && b2 === 0)) return { type: 'invalid' };
    const D = a1 * b2 - a2 * b1;
    if (D !== 0) return { type: 'one', x: (c1 * b2 - c2 * b1) / D, y: (a1 * c2 - a2 * c1) / D };
    const same = (a1 * c2 - a2 * c1 === 0) && (b1 * c2 - b2 * c1 === 0);
    return { type: same ? 'inf' : 'none' };
  }

  function confetti() {
    const box = document.createElement('div');
    box.className = 'sx-confetti';
    const colors = ['#3B82F6', '#FF4D8D', '#FF9F1C', '#17C3B2', '#7C3AED'];
    for (let i = 0; i < 40; i++) {
      const p = document.createElement('i');
      p.style.left = Math.random() * 100 + '%';
      p.style.background = colors[i % colors.length];
      p.style.animationDelay = Math.random() * 0.4 + 's';
      p.style.animationDuration = 1 + Math.random() * 0.8 + 's';
      box.appendChild(p);
    }
    document.body.appendChild(box);
    setTimeout(() => box.remove(), 2400);
  }

  function reveal() {
    const els = document.querySelectorAll('#tab-materi .sx-reveal, #tab-coba .sx-reveal');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('sx-in')); return; }
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add('sx-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(e => { e.classList.remove('sx-in'); io.observe(e); });
    // jaga-jaga bila observer tidak jalan
    setTimeout(() => els.forEach(e => e.classList.add('sx-in')), 4000);
  }

  // ================= GRAFIK =================
  const PRESETS = {
    p1: [1, 1, 5, 1, -1, 1],
    p2: [2, 1, 8, 1, -1, -2],
    inf: [1, 1, 4, 2, 2, 8],
    par: [1, 1, 4, 1, 1, 6]
  };

  function initGraph(mark) {
    const cv = $('sxCanvas');
    if (!cv) return;
    const ctx = cv.getContext('2d');
    const W = cv.width, H = cv.height, S = 24, cx = W / 2, cy = H / 2;
    const ids = ['sxA1', 'sxB1', 'sxC1', 'sxA2', 'sxB2', 'sxC2'];
    const inputs = ids.map($);
    let cur = PRESETS.p1.slice();
    let from = cur.slice(), target = cur.slice(), t0 = 0, animating = false;
    const seen = new Set();
    const X = x => cx + x * S, Y = y => cy - y * S;

    function drawLine(a, b, c, color) {
      ctx.strokeStyle = color; ctx.lineWidth = 3.5; ctx.lineCap = 'round';
      ctx.beginPath();
      if (Math.abs(b) > 1e-9) {
        ctx.moveTo(X(-11), Y((c + a * 11) / b));
        ctx.lineTo(X(11), Y((c - a * 11) / b));
      } else if (Math.abs(a) > 1e-9) {
        ctx.moveTo(X(c / a), Y(-11)); ctx.lineTo(X(c / a), Y(11));
      } else return;
      ctx.stroke();
    }

    function draw(now) {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);
      ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(36,27,58,.07)';
      for (let i = -10; i <= 10; i++) {
        ctx.beginPath(); ctx.moveTo(X(i), 0); ctx.lineTo(X(i), H); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, Y(i)); ctx.lineTo(W, Y(i)); ctx.stroke();
      }
      ctx.strokeStyle = 'rgba(36,27,58,.45)'; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();
      ctx.fillStyle = '#8A82A0'; ctx.font = '11px monospace'; ctx.textAlign = 'center';
      for (let i = -10; i <= 10; i += 2) {
        if (i === 0) continue;
        ctx.fillText(i, X(i), cy + 14); ctx.textAlign = 'right'; ctx.fillText(i, cx - 5, Y(i) + 4); ctx.textAlign = 'center';
      }
      ctx.fillStyle = '#241B3A'; ctx.font = 'bold 13px monospace'; ctx.fillText('x', W - 10, cy - 8); ctx.fillText('y', cx + 12, 14);

      ctx.save();
      ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.clip();
      drawLine(cur[0], cur[1], cur[2], '#3B82F6');
      drawLine(cur[3], cur[4], cur[5], '#FF4D8D');
      ctx.restore();

      const r = solve(...cur);
      if (r.type === 'one' && Math.abs(r.x) <= 11 && Math.abs(r.y) <= 11) {
        const ph = ((now || 0) % 1400) / 1400;
        ctx.strokeStyle = 'rgba(23,195,178,' + (1 - ph) + ')'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(X(r.x), Y(r.y), 8 + ph * 16, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = '#17C3B2'; ctx.strokeStyle = '#fff'; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.arc(X(r.x), Y(r.y), 7, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      }
    }

    function loop(now) {
      if (!document.body.contains(cv)) return;
      if (animating) {
        const k = Math.min(1, (now - t0) / 450), e = 1 - Math.pow(1 - k, 3);
        cur = from.map((v, i) => v + (target[i] - v) * e);
        if (k >= 1) { animating = false; cur = target.slice(); syncInputs(); }
      }
      if (cv.offsetParent !== null) draw(now);
      requestAnimationFrame(loop);
    }

    function syncInputs() { inputs.forEach((el, i) => { el.value = target[i]; }); }

    function readout() {
      const [a1, b1, c1, a2, b2, c2] = target;
      const r = solve(...target);
      const badge = $('sxBadge'), out = $('sxReadout');
      let key = null;
      if (r.type === 'invalid') {
        badge.className = 'sx-badge none'; badge.textContent = '⚠️ Persamaan belum valid';
        out.innerHTML = 'Setiap persamaan harus punya minimal satu variabel (koefisien x atau y tidak boleh keduanya 0).';
      } else if (r.type === 'one') {
        key = 'one';
        badge.className = 'sx-badge one'; badge.textContent = '✅ Tepat satu solusi: garis berpotongan';
        out.innerHTML = `Titik potong: <b>(x, y) = (${fmt(r.x)}, ${fmt(r.y)})</b><br>Cek ①: ${fmtEq(a1, b1, c1)} → ${neg(a1)}(${fmt(r.x)}) ${b1 < 0 ? '−' : '+'} ${Math.abs(b1)}(${fmt(r.y)}) = <b>${fmt(a1 * r.x + b1 * r.y)}</b><br>Cek ②: ${fmtEq(a2, b2, c2)} → ${neg(a2)}(${fmt(r.x)}) ${b2 < 0 ? '−' : '+'} ${Math.abs(b2)}(${fmt(r.y)}) = <b>${fmt(a2 * r.x + b2 * r.y)}</b>`;
      } else if (r.type === 'inf') {
        key = 'inf';
        badge.className = 'sx-badge inf'; badge.textContent = '♾️ Tak hingga solusi: garis berimpit';
        out.innerHTML = 'Kedua persamaan ternyata <b>sama</b> (satu merupakan kelipatan dari yang lain), jadi setiap titik pada garis itu adalah penyelesaian.';
      } else {
        key = 'none';
        badge.className = 'sx-badge none'; badge.textContent = '🚫 Tidak ada solusi: garis sejajar';
        out.innerHTML = 'Koefisien x dan y sebanding tetapi konstantanya tidak, jadi garis <b>sejajar</b> dan tidak pernah bertemu.';
      }
      if (key && !seen.has(key)) {
        seen.add(key);
        const chip = document.querySelector(`#sxSeen [data-k="${key}"]`);
        if (chip) chip.classList.add('on');
        if (seen.size === 3) { confetti(); mark(); }
      }
    }

    function setTarget(vals, animate) {
      target = vals.slice();
      if (animate) { from = cur.slice(); t0 = performance.now(); animating = true; } else { cur = target.slice(); }
      readout();
    }

    inputs.forEach(el => {
      el.oninput = () => {
        animating = false;
        const v = inputs.map(i => { const n = Number(i.value); return Number.isFinite(n) ? n : 0; });
        setTarget(v, false);
      };
    });
    document.querySelectorAll('#sxPresets [data-p]').forEach(b => {
      b.onclick = () => { setTarget(PRESETS[b.dataset.p], true); };
    });

    syncInputs();
    readout();
    requestAnimationFrame(loop);
  }

  // ================= STEPPER =================
  const SYSTEMS = [
    { a1: 2, b1: 3, c1: 13, a2: 4, b2: -1, c2: 5 },
    { a1: 1, b1: 1, c1: 8, a2: 1, b2: -1, c2: 2 },
    { a1: 3, b1: 2, c1: 16, a2: 1, b2: -1, c2: 2 }
  ];

  function buildElim(s) {
    const { a1, b1, c1, a2, b2, c2 } = s;
    const m1 = Math.abs(b2), m2 = Math.abs(b1);
    const A1 = a1 * m1, B1 = b1 * m1, C1 = c1 * m1, A2 = a2 * m2, B2 = b2 * m2, C2 = c2 * m2;
    const add = B1 + B2 === 0;
    const A = add ? A1 + A2 : A1 - A2, C = add ? C1 + C2 : C1 - C2;
    const x = C / A, y = (c1 - a1 * x) / b1;
    const yTerm = `${b1 < 0 ? '−' : '+'} ${absStr(b1)}y`;
    return [
      { lines: [`① ${fmtEq(a1, b1, c1)}`, `② ${fmtEq(a2, b2, c2)}`], explain: 'Mulai dengan menulis kedua persamaan dan memberi nomor ① dan ②. Kita akan <b>menghilangkan y</b>.' },
      { lines: [`① × ${m1} → <span class="hl">${fmtEq(A1, B1, C1)}</span>`, `② × ${m2} → <span class="hl">${fmtEq(A2, B2, C2)}</span>`], explain: `Supaya koefisien y sama besar, kalikan ① dengan <b>${m1}</b> dan ② dengan <b>${m2}</b>. Kalikan <b>seluruh</b> persamaan, termasuk konstanta.` },
      { lines: [`${add ? '①′ + ②′' : '①′ − ②′'} → <span class="hl">${fmtEq(A, 0, C)}</span>`], explain: add ? 'Tanda y berlawanan, jadi kedua persamaan <b>dijumlahkan</b>. Suku y saling meniadakan.' : 'Tanda y sama, jadi kedua persamaan <b>dikurangkan</b>. Suku y saling meniadakan.' },
      { lines: [`x = ${fmt(C)} ÷ ${fmt(A)} = <span class="hl">${fmt(x)}</span>`], explain: 'Sekarang tinggal satu variabel, jadi x langsung ketemu.' },
      { lines: [`Masukkan x = ${fmt(x)} ke ①:`, `${mulStr(a1, x)} ${yTerm} = ${neg(c1)}`, `${coefStr(b1)}y = ${fmt(c1 - a1 * x)} → y = <span class="hl">${fmt(y)}</span>`], explain: 'Substitusikan nilai x yang sudah diketahui ke salah satu persamaan awal untuk mendapat y.' },
      { lines: [`Cek ①: ${fmt(a1 * x + b1 * y)} = ${neg(c1)} <span class="ok">✓</span>`, `Cek ②: ${fmt(a2 * x + b2 * y)} = ${neg(c2)} <span class="ok">✓</span>`, `Penyelesaian: <span class="hl">(${fmt(x)}, ${fmt(y)})</span>`], explain: 'Selalu cek ke <b>kedua</b> persamaan awal. Kalau keduanya benar, jawabanmu aman.' }
    ];
  }

  function buildSubs(s) {
    const { a1, b1, c1, a2, b2, c2 } = s;
    // pilih persamaan dengan koefisien y = ±1
    const useFirst = Math.abs(b1) === 1;
    const [sa, sb, sc] = useFirst ? [a1, b1, c1] : [a2, b2, c2];
    const [ta, tb, tc] = useFirst ? [a2, b2, c2] : [a1, b1, c1];
    const srcNo = useFirst ? '①' : '②', tgtNo = useFirst ? '②' : '①';
    // y = (sc - sa x)/sb
    const k = -sa / sb, m = sc / sb;
    const coefX = ta + tb * k, constC = tc - tb * m;
    const x = constC / coefX, y = k * x + m;
    const wrap = `(${fmtLin(k, m)})`;
    return [
      { lines: [`① ${fmtEq(a1, b1, c1)}`, `② ${fmtEq(a2, b2, c2)}`], explain: 'Tulis kedua persamaan. Kita akan mengubah satu persamaan menjadi bentuk <b>y = ...</b>' },
      { lines: [`${srcNo} ${fmtEq(sa, sb, sc)}`, `→ <span class="hl">y = ${fmtLin(k, m)}</span>`], explain: `Pilih persamaan ${srcNo} karena koefisien y-nya hanya ±1, jadi tidak muncul pecahan.` },
      { lines: [`Ganti y di ${tgtNo}:`, `${fmtEq(ta, 0, 0).replace(' = 0', '')} ${tb < 0 ? '−' : '+'} ${absStr(tb)}${wrap} = ${neg(tc)}`], explain: `Inilah <b>substitusi</b>: y pada persamaan ${tgtNo} diganti dengan ${wrap}. Sekarang hanya ada variabel x.` },
      { lines: [`<span class="hl">${fmtEq(coefX, 0, constC)}</span>`], explain: 'Kalikan masuk ke dalam kurung, kumpulkan suku x di kiri, dan pindahkan konstanta ke kanan.' },
      { lines: [`x = ${fmt(constC)} ÷ ${fmt(coefX)} = <span class="hl">${fmt(x)}</span>`], explain: 'Bagi kedua ruas dengan koefisien x.' },
      { lines: [`y = ${fmtLin(k, m)} → y = ${mulStr(k, x)} ${m < 0 ? '−' : '+'} ${Math.abs(m)} = <span class="hl">${fmt(y)}</span>`], explain: `Masukkan x = ${fmt(x)} ke bentuk y = ${fmtLin(k, m)} untuk mendapat y.` },
      { lines: [`Cek ①: ${fmt(a1 * x + b1 * y)} = ${neg(c1)} <span class="ok">✓</span>`, `Cek ②: ${fmt(a2 * x + b2 * y)} = ${neg(c2)} <span class="ok">✓</span>`, `Penyelesaian: <span class="hl">(${fmt(x)}, ${fmt(y)})</span>`], explain: 'Cek ke kedua persamaan awal untuk memastikan.' }
    ];
  }

  function initStepper(mark) {
    const sysSel = $('sxStepSys'), methSel = $('sxStepMethod');
    const stage = $('sxStepStage'), explain = $('sxStepExplain'), dots = $('sxStepDots');
    const prev = $('sxStepPrev'), next = $('sxStepNext');
    if (!sysSel || !methSel || !stage) return;
    let steps = [], i = 0;

    function build() {
      const s = SYSTEMS[+sysSel.value];
      steps = methSel.value === 'elim' ? buildElim(s) : buildSubs(s);
      i = 0; render();
    }
    function render() {
      let html = '';
      steps.slice(0, i + 1).forEach((st, j) => {
        st.lines.forEach(l => { html += `<span class="line${j < i ? ' old' : ''}">${l}</span>`; });
      });
      stage.innerHTML = html;
      explain.innerHTML = '💬 ' + steps[i].explain;
      dots.innerHTML = steps.map((_, j) => `<i class="${j <= i ? 'on' : ''}"></i>`).join('');
      prev.disabled = i === 0;
      next.disabled = i === steps.length - 1;
      next.textContent = i === steps.length - 1 ? 'Selesai ✓' : 'Langkah berikutnya →';
      if (i === steps.length - 1) mark();
    }
    sysSel.onchange = methSel.onchange = build;
    prev.onclick = () => { if (i > 0) { i--; render(); } };
    next.onclick = () => { if (i < steps.length - 1) { i++; render(); } };
    build();
  }

  // ================= MASKOT & HERO =================
  const mascot = () => `
<svg class="sx-mascot" viewBox="0 0 230 190" aria-hidden="true" focusable="false">
  <ellipse class="sx-shadow" cx="115" cy="178" rx="86" ry="8" fill="rgba(36,27,58,.14)"/>
  <g class="sx-bob1">
    <circle cx="78" cy="104" r="46" fill="#3B82F6" stroke="#241B3A" stroke-width="5"/>
    <circle cx="64" cy="98" r="7" fill="#fff"/><circle class="sx-eye" cx="66" cy="99" r="3.5" fill="#241B3A"/>
    <circle cx="92" cy="98" r="7" fill="#fff"/><circle class="sx-eye" cx="94" cy="99" r="3.5" fill="#241B3A"/>
    <path d="M63 118 Q78 133 93 118" fill="none" stroke="#241B3A" stroke-width="4" stroke-linecap="round"/>
    <text x="78" y="76" text-anchor="middle" font-family="monospace" font-weight="800" font-size="22" fill="#fff">x</text>
    <g class="sx-arm"><line x1="118" y1="92" x2="142" y2="68" stroke="#241B3A" stroke-width="5" stroke-linecap="round"/><circle cx="145" cy="65" r="8" fill="#FFE08A" stroke="#241B3A" stroke-width="4"/></g>
  </g>
  <g class="sx-bob2">
    <circle cx="160" cy="126" r="36" fill="#FF4D8D" stroke="#241B3A" stroke-width="5"/>
    <circle cx="149" cy="121" r="6" fill="#fff"/><circle class="sx-eye" cx="151" cy="122" r="3" fill="#241B3A"/>
    <circle cx="171" cy="121" r="6" fill="#fff"/><circle class="sx-eye" cx="173" cy="122" r="3" fill="#241B3A"/>
    <ellipse cx="160" cy="138" rx="8" ry="6" fill="#241B3A"/>
    <text x="160" y="104" text-anchor="middle" font-family="monospace" font-weight="800" font-size="19" fill="#fff">y</text>
  </g>
</svg>`;

  const FLOATS = [['x', '8%', '14%', '#3B82F6', '6s', '0s'], ['y', '46%', '8%', '#FF4D8D', '7s', '-2s'], ['=', '30%', '70%', '#7C3AED', '5.5s', '-1s'],
    ['+', '60%', '62%', '#FF9F1C', '6.5s', '-3s'], ['−', '18%', '44%', '#17C3B2', '7.5s', '-4s'], ['÷', '52%', '34%', '#F2C94C', '8s', '-5s']];

  // o: { badge, title (html), typed, chips: [[label, indexKartu]] }
  function heroHTML(o) {
    return `<div class="sx-hero2">
  <div class="sx-float-layer" aria-hidden="true">${FLOATS.map(f => `<span style="left:${f[1]};top:${f[2]};--c:${f[3]};--d:${f[4]};--dl:${f[5]}">${f[0]}</span>`).join('')}</div>
  <div class="sx-hero-text">
    <span class="sx-badge">${o.badge}</span>
    <h2>${o.title}</h2>
    <p class="sx-typed" data-text="${o.typed}"></p>
    <div class="sx-hero-chips">${o.chips.map(c => `<button type="button" data-go="${c[1]}">${c[0]}</button>`).join('')}</div>
  </div>
  <div class="sx-hero-art" title="Klik aku!">${o.art || mascot()}<div class="sx-say"></div></div>
</div>`;
  }

  const LINES = ['Halo! Aku x. Dia y. Kami lagi ngumpet, cari kami ya! 🔎', 'Dua petunjuk cukup buat nemuin dua misteri! 🕵️', 'Kalau cuma satu persamaan, kami masih bisa kabur. 😜',
    'Titik potong garis = tempat kami ketemu! 🎯', 'Jangan lupa cek jawaban ke KEDUA persamaan ya! ✅', 'Eliminasi itu kayak main petak umpet: satu ngilang, satu ketemu! ✂️'];
  let lineIdx = 0, sayTimer = null;

  function decorate() {
    const reduce = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
    document.querySelectorAll('.sx-typed').forEach(p => {
      if (p.dataset.done) return;
      p.dataset.done = '1';
      const t = p.dataset.text || '';
      if (reduce) { p.textContent = t; return; }
      let i = 0;
      const id = setInterval(() => {
        if (!document.body.contains(p)) { clearInterval(id); return; }
        p.textContent = t.slice(0, ++i);
        if (i >= t.length) clearInterval(id);
      }, 24);
    });
    document.querySelectorAll('.sx-hero-art').forEach(art => {
      art.onclick = () => {
        const bub = art.querySelector('.sx-say');
        bub.textContent = LINES[lineIdx++ % LINES.length];
        bub.classList.remove('show'); void bub.offsetWidth; bub.classList.add('show');
        art.classList.remove('sx-bounce'); void art.offsetWidth; art.classList.add('sx-bounce');
        clearTimeout(sayTimer); sayTimer = setTimeout(() => bub.classList.remove('show'), 3800);
      };
    });
    document.querySelectorAll('.sx-hero-chips button').forEach(b => {
      b.onclick = () => {
        const panel = b.closest('.tab-panel') || document;
        const cards = panel.querySelectorAll('.content-card');
        const target = isNaN(Number(b.dataset.go)) ? document.getElementById(b.dataset.go) : cards[Number(b.dataset.go)];
        if (target) { target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); target.classList.remove('sx-flash'); void target.offsetWidth; target.classList.add('sx-flash'); }
      };
    });
  }

  return { $, neg, fmt, fmtEq, solve, confetti, reveal, initGraph, initStepper, heroHTML, decorate };
})();
