/*
  GAME GEOMETRI: "Insinyur Bangun Ruang"
  Jawab soal volume & luas permukaan untuk membangun 3 gedung (4 lantai tiap gedung).
  Dipasang di paling bawah Materi Geometri. Style: css/geometry-game.css (+ kelas dasar css/probability-game.css)
*/
(function () {
  const rnd = (n) => Math.floor(Math.random() * n);
  const pick = (a) => a[rnd(a.length)];
  const shuffle = (a) => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1);[a[i], a[j]] = [a[j], a[i]]; } return a; };
  const r2 = (x) => Math.round(x * 100) / 100;
  const num = (n) => r2(n).toLocaleString('id-ID', { maximumFractionDigits: 2 });
  const PI = 22 / 7;

  // ---------- Ilustrasi bangun ruang ----------
  const box = (p, l, t, c1, c2) => {
    const u = 110 / Math.max(p, l, t), W = p * u, D = l * u, H = t * u;
    const f = (w, h, tr, x = 0, y = 0) => `<b style="width:${w}px;height:${h}px;left:${x}px;top:${y}px;transform:${tr}"></b>`;
    return `<div class="ggm-3d"><div class="ggm-box" style="width:${W}px;height:${H}px;--c1:${c1 || '#7C3AED'};--c2:${c2 || '#FF4D8D'}">
      ${f(W, H, `translateZ(${D / 2}px)`)}${f(W, H, `translateZ(${-D / 2}px) rotateY(180deg)`)}
      ${f(D, H, `rotateY(90deg) translateZ(${W / 2}px)`, (W - D) / 2)}${f(D, H, `rotateY(-90deg) translateZ(${W / 2}px)`, (W - D) / 2)}
      ${f(W, D, `rotateX(90deg) translateZ(${H / 2}px)`, 0, (H - D) / 2)}${f(W, D, `rotateX(-90deg) translateZ(${H / 2}px)`, 0, (H - D) / 2)}</div></div>`;
  };
  const defs = '<defs><linearGradient id="ggG" x1="0" x2="1"><stop offset="0" stop-color="#5b21b6"/><stop offset=".45" stop-color="#a78bfa"/><stop offset="1" stop-color="#5b21b6"/></linearGradient><radialGradient id="ggS" cx=".35" cy=".3"><stop offset="0" stop-color="#f3e8ff"/><stop offset=".5" stop-color="#8b5cf6"/><stop offset="1" stop-color="#3b1a80"/></radialGradient></defs>';
  const svg = (inner) => `<svg viewBox="0 0 230 150" class="ggm-svg">${defs}${inner}</svg>`;
  const cyl = (r, t) => svg(`<ellipse cx="100" cy="122" rx="48" ry="13" fill="#4c1d95"/><rect x="52" y="30" width="96" height="92" fill="url(#ggG)"/><ellipse cx="100" cy="30" rx="48" ry="13" fill="#e9d8fd" stroke="#7C3AED" stroke-width="2"/><path class="dash" d="M100 30H148"/><text x="112" y="25">r = ${r}</text><path class="dash" d="M165 30V122"/><text x="171" y="80">t = ${t}</text>`);
  const cone = (r, t, s) => svg(`<path d="M52 122L100 12L148 122A48 13 0 0 1 52 122Z" fill="url(#ggG)"/><ellipse cx="100" cy="122" rx="48" ry="13" fill="#c4b5fd" opacity=".7"/><path class="dash" d="M100 12V122M100 122H148"/><text x="104" y="70">t = ${t}</text><text x="108" y="144">r = ${r}</text>${s ? `<text x="150" y="60">s = ?</text>` : ''}`);
  const sph = (r) => svg(`<circle cx="100" cy="75" r="58" fill="url(#ggS)"/><ellipse cx="100" cy="75" rx="58" ry="14" fill="none" stroke="#fff" stroke-dasharray="4 3" opacity=".7"/><path class="dash" d="M100 75H158"/><text x="164" y="79">r = ${r}</text>`);
  const pyr = (s, t) => svg(`<path d="M40 118L120 118L160 98L80 98Z" fill="#a78bfa"/><path d="M40 118L100 14L120 118Z" fill="url(#ggG)"/><path d="M120 118L100 14L160 98Z" fill="#7C3AED"/><path class="dash" d="M100 14V108"/><text x="106" y="62">t = ${t}</text><text x="62" y="138">s = ${s}</text>`);
  const wrap = (html, show, dim = '') => `<div class="ggm-wrap ${show ? 'solved' : ''}">${html}${dim ? `<div class="ggm-dim">${dim}</div>` : ''}</div>`;

  // ---------- Pilihan jawaban ----------
  function nopts(ans, wr, u) {
    const seen = new Set([r2(ans)]), out = [];
    const add = (w) => { w = r2(w); if (out.length < 3 && w > 0 && !seen.has(w)) { seen.add(w); out.push(w); } };
    shuffle(wr).forEach(add);
    for (let k = 1; out.length < 3 && k < 60; k++) { add(ans + k * Math.max(1, Math.round(ans / 8))); add(ans - k * Math.max(1, Math.round(ans / 10))); }
    const all = shuffle([r2(ans), ...out]); return { opts: all.map((x) => num(x) + ' ' + u), ci: all.indexOf(r2(ans)) };
  }
  const dm = (a) => a.map((x) => `<span>${x}</span>`).join('');

  // ---------- Generator soal ----------
  const G1 = [
    () => { const s = 2 + rnd(8); return { vis: (z) => wrap(box(s, s, s), z, dm([`rusuk s = ${s} cm`])), q: `Kotak es batu berbentuk kubus dengan rusuk ${s} cm. Berapa volumenya?`, hint: 'V = s³', ...nopts(s ** 3, [s * s, 3 * s, 6 * s * s, s ** 3 + s], 'cm³'), why: `V = s³ = ${s}³ = ${s ** 3} cm³.` }; },
    () => { const s = 2 + rnd(8); return { vis: (z) => wrap(box(s, s, s, '#17C3B2', '#3B82F6'), z, dm([`rusuk s = ${s} cm`])), q: `Kardus kubus berusuk ${s} cm dicat seluruh permukaannya. Berapa luas permukaannya?`, hint: 'L = 6s²', ...nopts(6 * s * s, [s ** 3, s * s, 4 * s * s, 12 * s], 'cm²'), why: `L = 6s² = 6 × ${s * s} = ${6 * s * s} cm².` }; },
    () => { const p = 3 + rnd(7), l = 2 + rnd(6), t = 2 + rnd(7); return { vis: (z) => wrap(box(p, l, t, '#FF9F1C', '#FF4D8D'), z, dm([`p = ${p}`, `l = ${l}`, `t = ${t} (cm)`])), q: `Balok berukuran ${p} cm × ${l} cm × ${t} cm. Berapa volumenya?`, hint: 'V = p × l × t', ...nopts(p * l * t, [2 * (p * l + p * t + l * t), p + l + t, p * l * t + p * l, p * l], 'cm³'), why: `V = ${p} × ${l} × ${t} = ${p * l * t} cm³.` }; },
    () => { const p = 3 + rnd(7), l = 2 + rnd(6), t = 2 + rnd(7), a = 2 * (p * l + p * t + l * t); return { vis: (z) => wrap(box(p, l, t, '#3B82F6', '#7C3AED'), z, dm([`p = ${p}`, `l = ${l}`, `t = ${t} (cm)`])), q: `Kardus balok ${p} × ${l} × ${t} cm akan dilapisi kertas kado. Berapa luas permukaannya?`, hint: 'L = 2(pl + pt + lt)', ...nopts(a, [p * l * t, a / 2, p * l + p * t + l * t + p * l, 2 * p * l + 2 * p * t], 'cm²'), why: `L = 2(${p * l} + ${p * t} + ${l * t}) = 2 × ${p * l + p * t + l * t} = ${a} cm².` }; }
  ];
  const G2 = [
    () => { const r = pick([7, 14]), t = 5 + rnd(11), v = PI * r * r * t; return { vis: (z) => wrap(cyl(r, t), z, dm(['π = 22/7'])), q: `Kaleng susu berbentuk tabung, jari-jari ${r} cm dan tinggi ${t} cm (π = 22/7). Berapa volumenya?`, hint: 'V = πr²t', ...nopts(v, [2 * PI * r * t, PI * r * t, v / 3, PI * r * r], 'cm³'), why: `V = πr²t = 22/7 × ${r * r} × ${t} = ${num(v)} cm³.` }; },
    () => { const r = pick([7, 14]), t = 5 + rnd(11), a = 2 * PI * r * (r + t); return { vis: (z) => wrap(cyl(r, t), z, dm(['π = 22/7'])), q: `Label kaleng menutupi seluruh permukaan tabung berjari-jari ${r} cm dan tinggi ${t} cm (π = 22/7). Berapa luas permukaannya?`, hint: 'L = 2πr(r + t)', ...nopts(a, [2 * PI * r * t, PI * r * (r + t), PI * r * r * t, 2 * PI * r * r], 'cm²'), why: `L = 2πr(r + t) = 2 × 22/7 × ${r} × ${r + t} = ${num(a)} cm².` }; },
    () => { const r = pick([7, 14]), t = pick([3, 6, 9, 12, 15]), v = PI * r * r * t / 3; return { vis: (z) => wrap(cone(r, t), z, dm(['π = 22/7'])), q: `Topi ulang tahun berbentuk kerucut, jari-jari ${r} cm dan tinggi ${t} cm (π = 22/7). Berapa volumenya?`, hint: 'V = ⅓πr²t', ...nopts(v, [PI * r * r * t, PI * r * r * t / 2, PI * r * t / 3, 2 * PI * r * r * t / 3], 'cm³'), why: `V = ⅓πr²t = ⅓ × 22/7 × ${r * r} × ${t} = ${num(v)} cm³.` }; },
    () => { const [r, t, s] = pick([[6, 8, 10], [5, 12, 13], [8, 15, 17], [7, 24, 25], [9, 12, 15]]); return { vis: (z) => wrap(cone(r, t, true), z), q: `Kerucut berjari-jari ${r} cm dan tinggi ${t} cm. Berapa panjang garis pelukisnya (s)?`, hint: 's = √(r² + t²)', ...nopts(s, [r + t, r * r + t * t, t - r + 1, s + 2], 'cm'), why: `s = √(${r}² + ${t}²) = √${r * r + t * t} = ${s} cm.` }; }
  ];
  const G3 = [
    () => { const r = pick([7, 14]), a = 4 * PI * r * r; return { vis: (z) => wrap(sph(r), z, dm(['π = 22/7'])), q: `Bola berjari-jari ${r} cm (π = 22/7). Berapa luas permukaannya?`, hint: 'L = 4πr²', ...nopts(a, [PI * r * r, 2 * PI * r * r, 4 * PI * r, 4 * PI * r * r / 3], 'cm²'), why: `L = 4πr² = 4 × 22/7 × ${r * r} = ${num(a)} cm².` }; },
    () => { const r = pick([3, 6, 9]), v = 4 / 3 * 3.14 * r ** 3; return { vis: (z) => wrap(sph(r), z, dm(['π = 3,14'])), q: `Bola basket mini berjari-jari ${r} cm (π = 3,14). Berapa volumenya?`, hint: 'V = 4⁄3 πr³', ...nopts(v, [4 * 3.14 * r * r, 3.14 * r ** 3, 4 / 3 * 3.14 * r * r, 2 / 3 * 3.14 * r ** 3], 'cm³'), why: `V = 4/3 × 3,14 × ${r ** 3} = ${num(v)} cm³.` }; },
    () => { const s = pick([3, 6, 9, 12]), t = 2 + rnd(11), v = s * s * t / 3; return { vis: (z) => wrap(pyr(s, t), z), q: `Atap limas beralas persegi sisi ${s} cm dengan tinggi ${t} cm. Berapa volumenya?`, hint: 'V = ⅓ × luas alas × tinggi', ...nopts(v, [s * s * t, s * s * t / 2, 2 * s * s * t / 3, s * t / 3], 'cm³'), why: `V = ⅓ × ${s * s} × ${t} = ${num(v)} cm³.` }; },
    () => { const p = pick([40, 50, 60, 80]), l = pick([20, 25, 40, 50]), t = pick([20, 30, 40]), v = p * l * t; return { vis: (z) => wrap(box(p, l, t, '#17C3B2', '#3B82F6'), z, dm([`${p} × ${l} × ${t} cm`])), q: `Akuarium berukuran ${p} cm × ${l} cm × ${t} cm. Berapa liter air yang muat saat penuh?`, hint: '1 liter = 1.000 cm³', ...nopts(v / 1000, [v, v / 100, v / 10000, v / 10], 'liter'), why: `V = ${p} × ${l} × ${t} = ${num(v)} cm³. Karena 1 liter = 1.000 cm³, volumenya ${num(v / 1000)} liter.` }; }
  ];
  const LEVELS = [
    { name: 'Gudang Kubus', sub: 'Kubus & balok', icon: '🏠', color: '#f2c94c', bg: 'linear-gradient(160deg,#0b3b5c,#1b6ca8 55%,#7cc4f0)', gens: G1 },
    { name: 'Pabrik Silinder', sub: 'Tabung & kerucut', icon: '🏭', color: '#a78bfa', bg: 'linear-gradient(160deg,#3a1d5c,#6b3fb0 55%,#e07bd0)', gens: G2 },
    { name: 'Istana Bola', sub: 'Bola, limas & liter', icon: '🏰', color: '#fb923c', bg: 'linear-gradient(160deg,#5c2b0b,#c2561d 55%,#ffcf6b)', gens: G3 }
  ];
  const QN = 4, TIME = 40, MAXH = 3;

  // ---------- Bagian interaktif Geometri (gaya modul Trigonometri) ----------
  const GFLIPS = [['🧊', 'Kubus', '#dff3fb', 'V = s³', 'L = 6s²'], ['📦', 'Balok', '#fdf1b8', 'V = p × l × t', 'L = 2(pl + pt + lt)'], ['🥫', 'Tabung', '#fbd5e3', 'V = πr²t', 'L = 2πr(r + t)'], ['🍦', 'Kerucut', '#d5f5e6', 'V = ⅓πr²t', 'L = πr(r + s)'], ['⚽', 'Bola', '#e6dcff', 'V = 4⁄3 πr³', 'L = 4πr²'], ['🔺', 'Limas', '#ffe2cf', 'V = ⅓ × L alas × t', 'L = alas + sisi tegak'], ['🏠', 'Prisma', '#e0f2ff', 'V = L alas × t', 'L = 2·L alas + K alas × t'], ['💧', 'Satuan', '#d9f2ff', '1 liter = 1.000 cm³', '1 m³ = 1.000 liter']];
  const GTIPS = ['Volume itu ruang yang bisa diisi. Luas permukaan itu bungkusnya.', 'Kerucut dan limas selalu punya faktor ⅓ pada volumenya.', 'Cek satuan dulu: 1 liter = 1.000 cm³.', 'Gambar bangunnya dan tulis ukuran di dekat sisinya.', 'Kalau dibuka, selimut tabung berbentuk persegi panjang!'];
  const extra = () => `
  <div class="content-card pl-sec2 ggm-sec">
    <h3><span class="pl-n">1</span>Tuang air: 3 kerucut = 1 tabung 🫗</h3>
    <p class="pl-sub">Kerucut dan tabung punya alas dan tinggi yang sama. Tuang air dari kerucut ke tabung, lalu hitung berapa kali sampai penuh!</p>
    <svg viewBox="0 -50 360 260" class="ggm-pour"><defs><clipPath id="ggCC"><path d="M20 70L120 70L70 180Z"/></clipPath><clipPath id="ggCY"><rect x="232" y="70" width="96" height="110"/></clipPath></defs>
      <g id="ggConeG" style="transform-origin:70px 70px;transition:transform .8s ease"><g clip-path="url(#ggCC)"><rect id="ggCW" x="20" y="70" width="100" height="110" fill="#3b9cff" style="transform-box:fill-box;transform-origin:50% 100%;transition:transform 1.3s ease"/></g><path d="M20 70L120 70L70 180Z" fill="none" stroke="#7C3AED" stroke-width="3" stroke-linejoin="round"/></g>
      <g clip-path="url(#ggCY)"><rect id="ggYW" x="232" y="70" width="96" height="110" fill="#3b9cff" style="transform:scaleY(0);transform-box:fill-box;transform-origin:50% 100%;transition:transform 1.3s ease"/></g>
      <path d="M230 70V176a4 4 0 0 0 4 4H326a4 4 0 0 0 4-4V70" fill="none" stroke="#7C3AED" stroke-width="3"/>
      <path d="M232 143H328M232 107H328" stroke="#7C3AED" stroke-dasharray="3 4" opacity=".6"/><text x="334" y="147">⅓</text><text x="334" y="111">⅔</text><text x="334" y="74">1</text>
      <path id="ggStream" class="stream" d="M184 58Q252 44 276 112"/><text x="40" y="198">kerucut</text><text x="262" y="198">tabung</text></svg>
    <div class="ggm-dots" id="ggDots"><span>1</span><span>2</span><span>3</span></div><div class="ggm-msg" id="ggPMsg">Tekan tombol untuk mulai menuang.</div>
    <div class="pl-neos" style="justify-content:center"><button type="button" class="pl-neo" id="ggPour">🫗 Tuang!</button><button type="button" class="pl-neo" id="ggPourR">↺ Ulang</button></div>
  </div>
  <div class="content-card pl-sec2 ggm-sec">
    <h3><span class="pl-n">2</span>Jaring-jaring kubus: lipat! 🧊</h3>
    <p class="pl-sub">Geser penggeser atau tekan tombol. Enam persegi yang tersambung akan terlipat menjadi sebuah kubus.</p>
    <div class="ggm-netstage"><div class="ggm-netspin"><div class="ggm-net" id="ggNet" style="--a:0deg"><div class="nf nf0">1<div class="nf nn">2</div><div class="nf ns">3<div class="nf ns2">6</div></div><div class="nf nw">4</div><div class="nf ne">5</div></div></div></div></div>
    <div class="ggm-netctl"><button type="button" class="pl-neo" id="ggFold">▶ Lipat jadi kubus</button><button type="button" class="pl-neo" id="ggUnfold">⟲ Buka lagi</button><input type="range" id="ggNetR" min="0" max="100" value="0"></div>
    <div class="ggm-msg" id="ggNMsg"></div>
  </div>
  <div class="content-card pl-sec2 ggm-sec">
    <h3><span class="pl-n">3</span>Kartu rumus bangun ruang ⭐</h3>
    <div class="pl-tools"><span>Ketuk kartu untuk melihat rumus volume dan luas permukaan.</span><button type="button" class="pl-neo" id="ggFlipAll">🔄 Balik semua</button></div>
    <div class="pl-flips ggm-flips">${GFLIPS.map((f) => `<div class="pl-flip"><div class="pl-fi"><div class="pl-ff" style="--fc:${f[2]}"><span class="e">${f[0]}</span><b>${f[1]}</b></div><div class="pl-fk"><b>${f[1]}</b><span class="f">${f[3]}</span><span class="f" style="color:#7C3AED">${f[4]}</span></div></div></div>`).join('')}</div>
  </div>`;

  function bindGeo() {
    // 1) Tuang air
    let k = 0, busy = false; const pt = [], pl = (f, ms) => pt.push(setTimeout(() => live() && f(), ms));
    const cw = $('ggCW'), yw = $('ggYW'), cg = $('ggConeG'), stm = $('ggStream');
    $('ggPour').onclick = () => {
      if (busy || k >= 3) return; busy = true; k++;
      $('ggPMsg').textContent = `Menuang kerucut ke-${k}…`;
      cg.style.transform = 'translate(70px,-45px) rotate(38deg)'; pl(() => stm.classList.add('on'), 700);
      pl(() => { cw.style.transform = 'scaleY(.02)'; yw.style.transform = `scaleY(${k / 3})`; }, 800);
      pl(() => { stm.classList.remove('on'); cg.style.transform = ''; }, 2300);
      pl(() => { cw.style.transform = 'scaleY(1)'; }, 3100);
      pl(() => {
        $('ggDots').children[k - 1].classList.add('on'); busy = false;
        $('ggPMsg').innerHTML = k < 3 ? `Tabung terisi ${k}/3. Tuang lagi!` : '<b>🎉 Penuh! 3 kerucut = 1 tabung, jadi V kerucut = ⅓πr²t</b>';
      }, 4100);
    };
    $('ggPourR').onclick = () => {
      k = 0; busy = false; pt.forEach(clearTimeout); pt.length = 0; yw.style.transform = 'scaleY(0)'; cw.style.transform = 'scaleY(1)'; cg.style.transform = ''; stm.classList.remove('on');
      [...$('ggDots').children].forEach((d) => d.classList.remove('on')); $('ggPMsg').textContent = 'Tekan tombol untuk mulai menuang.';
    };
    // 2) Jaring-jaring kubus
    const net = $('ggNet'), rng = $('ggNetR'); let raf;
    const setA = (v) => { net.style.setProperty('--a', (v * 0.9) + 'deg'); rng.value = v; $('ggNMsg').innerHTML = v >= 100 ? '<b>🎉 Kubus! 6 sisi · 12 rusuk · 8 titik sudut</b>' : ''; };
    const go = (to) => { cancelAnimationFrame(raf); const from = +rng.value, t0 = performance.now(), d = 2200 * Math.abs(to - from) / 100 + 200; (function f(n) { const p = Math.min(1, (n - t0) / d), e = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; setA(from + (to - from) * e); if (p < 1 && live()) raf = requestAnimationFrame(f); })(t0); };
    rng.oninput = () => { cancelAnimationFrame(raf); setA(+rng.value); };
    $('ggFold').onclick = () => go(100); $('ggUnfold').onclick = () => go(0);
    // 3) Kartu balik
    const cards = document.querySelectorAll('.ggm-flips .pl-flip');
    cards.forEach((c) => (c.onclick = () => c.classList.toggle('on')));
    $('ggFlipAll').onclick = () => { const all = [...cards].every((c) => c.classList.contains('on')); cards.forEach((c, i) => setTimeout(() => c.classList.toggle('on', !all), i * 90)); };
    if (window.__plMascot) window.__plMascot.bindMascot('ggMas');
  }

  // ---------- Pasang ke bawah materi Geometri ----------
  const prevMat = window.getModuleMaterial, prevBind = window.bindSimulator;
  window.getModuleMaterial = (id) => {
    const html = prevMat(id);
    if (id !== 'geometri') return html;
    const k = html.lastIndexOf('</div>');
    const mas = window.__plMascot ? window.__plMascot.mascot('ggMas', '📐', GTIPS) : '';
    return html.slice(0, k) + extra() + '<div class="content-card plg ggm" id="ggm"><div class="plg-bg" id="ggBg"></div><div id="ggBox"></div></div>' + mas + html.slice(k);
  };
  window.bindSimulator = (id) => { prevBind(id); if (id === 'geometri') { init(); bindGeo(); } };

  // ---------- Mesin game ----------
  let tms = [], st, muted = false;
  const $ = (id) => document.getElementById(id);
  const live = () => !!$('ggm');
  const later = (f, ms) => { const t = setTimeout(() => live() && f(), ms); tms.push(t); return t; };
  const clearAll = () => { tms.forEach(clearTimeout); tms = []; };
  const sfx = (n) => { if (muted) return; try { const a = new Audio(`assets/sfx/${n}.mp3`); a.volume = .5; a.play().catch(() => {}); } catch (e) {} };
  const best = () => { try { return +localStorage.getItem('mdny_geometri_best') || 0; } catch (e) { return 0; } };
  const saveBest = (v) => { try { localStorage.setItem('mdny_geometri_best', v); } catch (e) {} };

  function init() { clearAll(); startScreen(); }
  function startScreen() {
    $('ggBg').style.setProperty('--bg', 'linear-gradient(160deg,#0b3b5c,#1b6ca8 55%,#7cc4f0)');
    $('ggBox').innerHTML = `<div class="plg-screen plg-start">
      <span class="plg-orbit">📦</span><span class="plg-orbit">🥫</span><span class="plg-orbit">⚽</span>
      <div class="plg-hero-big">👷</div><div class="plg-title">Insinyur Bangun Ruang</div>
      <p style="max-width:480px;margin:0 0 6px">Bangun 3 gedung dengan menjawab soal volume dan luas permukaan. Setiap jawaban benar menambah satu lantai!</p>
      <div class="plg-rules"><span>🏗️ 3 gedung</span><span>🧱 ${QN} lantai tiap gedung</span><span>❤️ ${MAXH} nyawa</span><span>⏱️ ${TIME} detik</span><span>💡 Petunjuk −25 poin</span></div>
      <p style="font-weight:800;position:relative;z-index:1">🏆 Skor terbaik: ${best()}</p>
      <button class="plg-btn pulse" id="ggGo" type="button">Mulai Membangun</button></div>`;
    $('ggGo').onclick = () => { sfx('start'); st = { lv: 0, q: 0, hearts: MAXH, score: 0, combo: 0, floors: 0, right: 0, city: [] }; gameScreen(); banner(); };
  }
  function gameScreen() {
    const L = LEVELS[st.lv];
    $('ggBg').style.setProperty('--bg', L.bg);
    $('ggBox').innerHTML = `<div class="plg-screen">
      <div class="plg-hud"><span>🏗️ ${st.lv + 1}. ${L.name}</span><span class="plg-hearts" id="ggH"></span><span id="ggS"></span><span class="plg-combo" id="ggC"></span><button id="ggM" type="button">${muted ? '🔇' : '🔊'}</button></div>
      <div class="plg-arena ggm-site"><div class="ggm-crane">🏗️</div><div class="ggm-worker" id="ggW">👷</div><div class="ggm-stack" id="ggStack"></div>
        <div class="ggm-city">${st.city.map((c) => `<span>${c}</span>`).join('')}</div><div class="plg-fx" id="ggFx"></div></div>
      <div class="plg-card" id="ggCard"></div></div>`;
    $('ggM').onclick = () => { muted = !muted; $('ggM').textContent = muted ? '🔇' : '🔊'; };
    hud();
  }
  function hud() {
    $('ggH').textContent = '❤️'.repeat(st.hearts) + '🖤'.repeat(MAXH - st.hearts);
    $('ggS').textContent = '⭐ ' + st.score;
    $('ggC').textContent = st.combo > 1 ? `🔥 Kombo ×${st.combo}` : '🔥 Kombo 0';
  }
  function banner() {
    const L = LEVELS[st.lv], b = document.createElement('div');
    b.className = 'plg-banner'; b.innerHTML = `<div><span>${L.icon}</span><b>Gedung ${st.lv + 1}</b><p style="font-size:18px;font-weight:700">${L.name} · ${L.sub}</p></div>`;
    $('ggm').appendChild(b); later(() => { b.remove(); st.floors = 0; st.q = 0; nextQ(); }, 2000);
  }
  function addFloor() {
    const L = LEVELS[st.lv], f = document.createElement('div'); f.className = 'ggm-floor'; f.style.setProperty('--fc', L.color); f.innerHTML = '<i></i><i></i><i></i>';
    $('ggStack').appendChild(f);
    if (st.floors >= QN) { const r = document.createElement('div'); r.className = 'ggm-roof'; r.textContent = L.icon; r.style.animationDelay = '.6s'; $('ggStack').appendChild(r); }
  }
  function nextQ() {
    const g = pick(LEVELS[st.lv].gens)(); st.cur = g; st.locked = false; st.t0 = Date.now(); st.hinted = false;
    $('ggCard').innerHTML = `<div class="plg-vis" id="ggVis">${g.vis(false)}</div><p class="plg-q">${g.q}</p>
      <div style="text-align:center"><button class="ggm-hint" id="ggHint" type="button">💡 Petunjuk (−25)</button><span id="ggHT"></span></div>
      <div class="plg-timer"><i id="ggT"></i></div><div class="plg-opts">${g.opts.map((o, i) => `<button class="plg-opt" style="--i:${i}" data-i="${i}">${o}</button>`).join('')}</div><div id="ggFb"></div>`;
    const t = $('ggT'); t.style.transition = 'none'; t.style.width = '100%'; void t.offsetWidth; t.style.transition = `width ${TIME}s linear`; t.style.width = '0%';
    $('ggHint').onclick = () => { if (st.hinted || st.locked) return; st.hinted = true; st.score = Math.max(0, st.score - 25); hud(); $('ggHT').innerHTML = `<span class="ggm-hinttext">${g.hint}</span>`; $('ggHint').disabled = true; };
    $('ggCard').querySelectorAll('.plg-opt').forEach((b) => (b.onclick = () => answer(+b.dataset.i)));
    st.tmo = later(() => answer(-1), TIME * 1000);
  }
  function popText(t, col) { const p = document.createElement('span'); p.className = 'plg-pop'; p.textContent = t; p.style.right = '30%'; p.style.top = '40px'; if (col) p.style.color = col; $('ggFx').appendChild(p); later(() => p.remove(), 1000); }
  function confetti(n = 50) {
    const box = $('ggm'), cols = ['#ffd166', '#17c3b2', '#3B82F6', '#ff9f1c', '#ff4d8d'];
    for (let i = 0; i < n; i++) { const c = document.createElement('i'); c.className = 'plg-conf'; const a = Math.random() * Math.PI * 2, r = 150 + Math.random() * 260; c.style.cssText = `background:${pick(cols)};--x:${Math.cos(a) * r}px;--y:${Math.sin(a) * r + 120}px;--r:${rnd(900)}deg`; box.appendChild(c); later(() => c.remove(), 1900); }
  }
  function answer(i) {
    if (st.locked) return; st.locked = true; clearTimeout(st.tmo);
    const g = st.cur, ok = i === g.ci, left = Math.max(0, TIME - (Date.now() - st.t0) / 1000);
    const t = $('ggT'); t.style.transition = 'none'; t.style.width = getComputedStyle(t).width;
    const opts = $('ggCard').querySelectorAll('.plg-opt'); opts.forEach((b) => (b.disabled = true)); $('ggHint').disabled = true;
    opts[g.ci].classList.add('ok'); if (i >= 0 && !ok) opts[i].classList.add('no');
    $('ggVis').innerHTML = g.vis(true); st.q++;
    let gain = 0;
    if (ok) {
      st.combo++; st.right++; st.floors++; gain = 100 + Math.ceil(left) * 3 + (st.combo - 1) * 20; st.score += gain; sfx('correct');
      later(() => { addFloor(); popText('+' + gain); hud(); $('ggC').classList.add('up'); confetti(14); }, 350);
    } else {
      st.combo = 0; st.hearts--; sfx('wrong');
      later(() => { const s = $('ggStack'); s.classList.add('shake'); const fl = s.querySelector('.ggm-floor:last-of-type'); if (fl) fl.classList.add('crack'); popText('Retak! 💥', '#ff8a8a'); $('ggH').classList.add('lose'); hud(); }, 350);
      later(() => { $('ggStack') && $('ggStack').classList.remove('shake'); $('ggH') && $('ggH').classList.remove('lose'); }, 1200);
    }
    const dead = st.hearts <= 0, cleared = st.floors >= QN, last = st.lv === LEVELS.length - 1;
    const nextLabel = dead ? 'Lihat hasil' : cleared ? (last ? 'Resmikan gedung 🏁' : 'Gedung berikutnya →') : 'Lanjut →';
    later(() => {
      $('ggFb').innerHTML = `<div class="plg-fb"><b>${i < 0 ? '⏰ Waktu habis!' : ok ? '✅ Tepat! Lantai bertambah, +' + gain + ' poin' : '❌ Belum tepat.'}</b><br>${g.why}<br><button class="plg-btn" id="ggNext" type="button">${nextLabel}</button></div>`;
      $('ggNext').onclick = () => {
        if (dead) return finish(false);
        if (cleared) { if (cleared && last) return finish(true); st.city.push(LEVELS[st.lv].icon); st.lv++; st.hearts = Math.min(MAXH, st.hearts + 1); gameScreen(); return banner(); }
        nextQ();
      };
    }, 900);
  }
  function finish(win) {
    clearAll(); sfx('end');
    if (win) st.city.push(LEVELS[st.lv].icon);
    const stars = win ? Math.max(1, st.hearts) : 0, isBest = st.score > best(); if (isBest) saveBest(st.score);
    $('ggBg').style.setProperty('--bg', win ? 'linear-gradient(160deg,#0b3b5c,#1b6ca8 55%,#ffcf6b)' : 'linear-gradient(160deg,#1b1b2f,#3a3a5c)');
    $('ggBox').innerHTML = `<div class="plg-screen plg-start"><div class="plg-hero-big">${win ? '🏆' : '🚧'}</div>
      <div class="plg-title">${win ? 'Kota Selesai Dibangun!' : 'Proyek Terhenti'}</div>
      <div style="font-size:44px;display:flex;gap:10px;position:relative;z-index:1">${st.city.map((c, n) => `<span style="animation:plgDrop .8s ${n * .3}s both cubic-bezier(.3,1.6,.5,1)">${c}</span>`).join('') || '🏗️'}</div>
      <div class="plg-stars">${[1, 2, 3].map((n) => `<span style="--i:${n}" class="${n <= stars ? '' : 'dim'}">⭐</span>`).join('')}</div>
      <div class="plg-final" id="ggFinal">0</div>
      <p style="font-weight:700">Jawaban benar: ${st.right} soal ${isBest ? '· 🎉 Rekor baru!' : ''}</p>
      <p style="max-width:440px">${win ? 'Hebat! Kamu sudah menguasai volume dan luas permukaan kubus, balok, tabung, kerucut, bola, dan limas.' : 'Pelajari lagi rumusnya di materi dan simulator di atas, lalu bangun ulang dari awal.'}</p>
      <button class="plg-btn pulse" id="ggAgain" type="button">Bangun lagi</button></div>`;
    const el = $('ggFinal'), t0 = performance.now(), end = st.score;
    (function tick(n) { if (!live() || !el.isConnected) return; const p = Math.min(1, (n - t0) / 1400); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(tick); })(t0);
    if (win) { confetti(70); later(() => confetti(50), 700); }
    $('ggAgain').onclick = () => { clearAll(); startScreen(); };
  }
})();
