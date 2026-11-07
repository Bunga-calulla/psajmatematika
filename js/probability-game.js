/*
  GAME PELUANG: "Misi Peluang"
  Penyihir melawan 3 monster. Soal diacak dari 3 materi: sederhana, komplemen, majemuk.
  Dipasang di bagian paling bawah Materi Peluang. Style: css/probability-game.css
*/
(function () {
  const rnd = (n) => Math.floor(Math.random() * n);
  const pick = (a) => a[rnd(a.length)];
  const shuffle = (a) => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1);[a[i], a[j]] = [a[j], a[i]]; } return a; };
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  const fr = (n, d) => { if (n === 0) return '0'; const g = gcd(n, d); return d / g === 1 ? '1' : `${n / g}/${d / g}`; };

  // ---------- Visual soal ----------
  const PIPS = { 1: [[50, 50]], 2: [[28, 28], [72, 72]], 3: [[28, 28], [50, 50], [72, 72]], 4: [[28, 28], [72, 28], [28, 72], [72, 72]], 5: [[28, 28], [72, 28], [50, 50], [28, 72], [72, 72]], 6: [[28, 28], [72, 28], [28, 50], [72, 50], [28, 72], [72, 72]] };
  const die = (n) => `<svg viewBox="0 0 100 100" class="pl-die"><rect x="4" y="4" width="92" height="92" rx="20" fill="#fff" stroke="#241B3A" stroke-width="5"/>${PIPS[n].map((p) => `<circle cx="${p[0]}" cy="${p[1]}" r="8.5" fill="#241B3A"/>`).join('')}</svg>`;
  const dice = (on, show) => [1, 2, 3, 4, 5, 6].map((i) => `<span class="plg-dice-i ${show ? (on.includes(i) ? 'on' : 'off') : ''}" style="--i:${i}">${die(i)}</span>`).join('');
  const COL = { merah: '#E33E57', biru: '#3B82F6', hijau: '#17C3B2' };
  const jar = (c, t, show) => `<div class="pl-jar">${Object.keys(c).flatMap((k) => Array(c[k]).fill(k)).map((k, i) => `<span class="pl-ball ${show && k !== t ? 'dim' : ''}" style="--c:${COL[k]};--i:${i}"></span>`).join('')}</div>`;

  // ---------- Pembuat pilihan jawaban ----------
  function fopts(n, d, extra = []) {
    const ans = fr(n, d), seen = new Set([ans]), out = [];
    const base = shuffle([[n + 1, d], [n - 1, d], [d - n, d], [n, d + 1], [n, d - 1], [1, d], [n + 2, d], [n * 2, d], [n, d * 2]]);
    [...extra, ...base].forEach(([a, b]) => { if (out.length < 3 && b > 0 && a >= 0 && a <= b) { const s = fr(a, b); if (!seen.has(s)) { seen.add(s); out.push(s); } } });
    for (let k = 2; out.length < 3 && k < 40; k++) { const b = d + k, a = 1 + rnd(b - 1), s = fr(a, b); if (!seen.has(s)) { seen.add(s); out.push(s); } }
    const opts = shuffle([ans, ...out]); return { opts, ci: opts.indexOf(ans) };
  }
  const DS = [['genap', [2, 4, 6]], ['ganjil', [1, 3, 5]], ['prima', [2, 3, 5]], ['kurang dari 3', [1, 2]], ['lebih dari 4', [5, 6]], ['kelipatan 3', [3, 6]], ['kurang dari 5', [1, 2, 3, 4]]];

  // ---------- Generator soal per level ----------
  const G1 = [
    () => { // kelereng
      const c = { merah: 2 + rnd(5), biru: 1 + rnd(5), hijau: 1 + rnd(4) }, t = pick(Object.keys(c)), tot = c.merah + c.biru + c.hijau;
      return { vis: (s) => jar(c, t, s), q: `Toples berisi ${c.merah} kelereng merah, ${c.biru} biru, dan ${c.hijau} hijau. Satu kelereng diambil acak. Peluang terambil kelereng ${t}?`, ...fopts(c[t], tot), why: `n(${t}) = ${c[t]} dan n(S) = ${tot}, jadi P = ${c[t]}/${tot} = ${fr(c[t], tot)}.` };
    },
    () => { // dadu
      const [nm, s] = pick(DS);
      return { vis: (sh) => dice(s, sh), q: `Sebuah dadu dilempar sekali. Peluang muncul angka ${nm}?`, ...fopts(s.length, 6), why: `Hasil ${nm}: ${s.join(', ')} → ${s.length}/6 = ${fr(s.length, 6)}.` };
    }
  ];
  const G2 = [
    () => { // hujan
      const p = pick([15, 20, 25, 30, 35, 40, 45, 60, 65, 70, 75, 80]), ans = (100 - p) + '%', o = [ans];
      [p + '%', (110 - p) + '%', (90 - p) + '%', (105 - p) + '%', (p + 10) + '%'].forEach((x) => { const v = parseInt(x, 10); if (o.length < 4 && !o.includes(x) && v > 0 && v < 100) o.push(x); });
      const opts = shuffle(o);
      return { vis: (s) => `<div style="display:flex;gap:18px;font-size:54px"><span class="pl-cloud">🌧️</span>${s ? `<span class="pl-sun">☀️</span>` : '<span>❓</span>'}</div>`, q: `Prakiraan cuaca: peluang hujan besok ${p}%. Berapa peluang tidak hujan?`, opts, ci: opts.indexOf(ans), why: `P(tidak hujan) = 100% − ${p}% = ${100 - p}%.` };
    },
    () => { // dadu komplemen
      const [nm, s] = pick(DS), n = 6 - s.length, rest = [1, 2, 3, 4, 5, 6].filter((x) => !s.includes(x));
      return { vis: (sh) => dice(rest, sh), q: `Dadu dilempar sekali. Peluang tidak muncul angka ${nm}?`, ...fopts(n, 6, [[s.length, 6]]), why: `P(${nm}) = ${fr(s.length, 6)}, jadi komplemennya 1 − ${fr(s.length, 6)} = ${fr(n, 6)}.` };
    },
    () => { // minimal satu gambar
      const n = 2 + rnd(3), d = 2 ** n;
      return { vis: () => `<div style="display:flex;gap:14px">${Array.from({ length: n }, (_, i) => `<span class="plg-coin" style="animation-delay:${-i * .4}s">🪙</span>`).join('')}</div>`, q: `${n} koin dilempar bersamaan. Peluang muncul minimal satu gambar?`, ...fopts(d - 1, d, [[1, d]]), why: `Lawannya: semua angka = (1/2)^${n} = 1/${d}. Jadi P = 1 − 1/${d} = ${d - 1}/${d}.` };
    }
  ];
  const G3 = [
    () => { // dadu: A atau B
      let A, B, i, u;
      do { A = pick(DS); B = pick(DS); i = A[1].filter((x) => B[1].includes(x)); u = new Set([...A[1], ...B[1]]); } while (A === B || u.size >= 6 || u.size < 2);
      const a = A[1].length, b = B[1].length;
      return { vis: (s) => dice([...u], s), q: `Dadu dilempar sekali. Peluang muncul angka ${A[0]} atau ${B[0]}?`, ...fopts(u.size, 6, i.length ? [[a + b, 6]] : []), why: i.length ? `Ada irisan {${i.join(', ')}} (tidak saling lepas): ${a}/6 + ${b}/6 − ${i.length}/6 = ${u.size}/6 = ${fr(u.size, 6)}.` : `Tidak ada irisan (saling lepas): ${a}/6 + ${b}/6 = ${u.size}/6 = ${fr(u.size, 6)}.` };
    },
    () => { // kartu 1-20
      const ms = [2, 3, 4, 5], a = pick(ms); let b; do b = pick(ms); while (b === a);
      let na = 0, nb = 0, ni = 0; for (let x = 1; x <= 20; x++) { const ia = x % a === 0, ib = x % b === 0; na += ia; nb += ib; ni += ia && ib; }
      const u = na + nb - ni;
      return { vis: (s) => `<div class="plg-num">${Array.from({ length: 20 }, (_, k) => { const x = k + 1, ia = x % a === 0, ib = x % b === 0; return `<span style="--i:${k}" class="${s ? (ia && ib ? 'ab' : ia ? 'a' : ib ? 'b' : '') : ''}">${x}</span>`; }).join('')}</div>`, q: `Kartu bernomor 1–20 diacak, satu diambil. Peluang terambil kelipatan ${a} atau kelipatan ${b}?`, ...fopts(u, 20, [[na + nb, 20]]), why: `n(A) = ${na}, n(B) = ${nb}, irisan = ${ni} → (${na} + ${nb} − ${ni})/20 = ${u}/20 = ${fr(u, 20)}.` };
    },
    () => { // saling bebas koin & dadu
      const E = [['gambar', 'G'], ['angka', 'A']], D = [['genap', [2, 4, 6]], ['prima', [2, 3, 5]], ['lebih dari 4', [5, 6]], ['kurang dari 3', [1, 2]], ['kelipatan 3', [3, 6]]];
      const e = pick(E), d = pick(D), n = d[1].length;
      return { vis: (s) => `<span class="plg-coin">🪙</span>${dice(d[1], s)}`, q: `Sebuah koin dan sebuah dadu dilempar bersamaan. Peluang koin ${e[0]} dan dadu ${d[0]}?`, ...fopts(n, 12, [[n, 6]]), why: `Saling bebas, jadi dikalikan: 1/2 × ${n}/6 = ${n}/12 = ${fr(n, 12)}.` };
    }
  ];
  const LEVELS = [
    { name: 'Hutan Dadu', sub: 'Peluang sederhana', enemy: '🐸', en: 'Kodok Kacau', bg: 'linear-gradient(160deg,#0f5132,#1f7a4d 55%,#7bc67b)', gens: G1 },
    { name: 'Gua Komplemen', sub: 'Peluang komplemen', enemy: '🦇', en: 'Kelelawar Lawan', bg: 'linear-gradient(160deg,#1b1340,#3b2a7a 55%,#7a4fb8)', gens: G2 },
    { name: 'Menara Majemuk', sub: 'Kejadian majemuk', enemy: '🐉', en: 'Naga Gabungan', bg: 'linear-gradient(160deg,#4a0d2b,#9b1d4d 55%,#ff8a3d)', gens: G3 }
  ];
  const QN = 4, TIME = 25, MAXH = 3;

  // ---------- Markup yang disisipkan ke bawah materi ----------
  const markup = () => `<div class="content-card plg pl" id="plg"><div class="plg-bg" id="plgBg"></div><div id="plgBox"></div></div>`;
  const prevMat = window.getModuleMaterial, prevBind = window.bindSimulator;
  window.getModuleMaterial = (id) => {
    const html = prevMat(id);
    if (id !== 'peluang') return html;
    const k = html.lastIndexOf('</div>');
    return html.slice(0, k) + markup() + html.slice(k);
  };
  window.bindSimulator = (id) => { prevBind(id); if (id === 'peluang') init(); };

  // ---------- Game ----------
  let tms = [], st, muted = false;
  const $ = (id) => document.getElementById(id);
  const live = () => !!$('plg');
  const later = (f, ms) => { const t = setTimeout(() => live() && f(), ms); tms.push(t); return t; };
  const clearAll = () => { tms.forEach(clearTimeout); tms = []; };
  const sfx = (n) => { if (muted) return; try { const a = new Audio(`assets/sfx/${n}.mp3`); a.volume = .5; a.play().catch(() => {}); } catch (e) {} };
  const best = () => { try { return +localStorage.getItem('mdny_peluang_best') || 0; } catch (e) { return 0; } };
  const saveBest = (v) => { try { localStorage.setItem('mdny_peluang_best', v); } catch (e) {} };

  function init() { clearAll(); startScreen(); }

  function startScreen() {
    $('plgBg').style.setProperty('--bg', 'linear-gradient(160deg,#2b1a5e,#5b2a86 55%,#c2417d)');
    $('plgBox').innerHTML = `<div class="plg-screen plg-start">
      <span class="plg-orbit">🎲</span><span class="plg-orbit">🪙</span><span class="plg-orbit">🔴</span>
      <div class="plg-hero-big">🧙</div><div class="plg-title">Misi Peluang</div>
      <p style="max-width:460px;margin:0 0 6px">Kamu penyihir peluang. Kalahkan 3 monster dengan menjawab soal yang diacak dari 3 materi tadi!</p>
      <div class="plg-rules"><span>🗺️ 3 level</span><span>⚔️ ${QN} jawaban benar per monster</span><span>❤️ ${MAXH} nyawa</span><span>⏱️ ${TIME} detik</span></div>
      <p style="font-weight:800;position:relative;z-index:1">🏆 Skor terbaik: ${best()}</p>
      <button class="plg-btn pulse" id="plgGo">Mulai Petualangan</button></div>`;
    $('plgGo').onclick = () => { sfx('start'); st = { lv: 0, q: 0, hearts: MAXH, score: 0, combo: 0, hp: QN, right: 0 }; gameScreen(); banner(); };
  }

  function gameScreen() {
    const L = LEVELS[st.lv];
    $('plgBg').style.setProperty('--bg', L.bg);
    $('plgBox').innerHTML = `<div class="plg-screen">
      <div class="plg-hud"><span>🗺️ Level ${st.lv + 1}: ${L.name}</span><span class="plg-hearts" id="plgH"></span><span id="plgS"></span><span class="plg-combo" id="plgC"></span><button id="plgM" type="button">${muted ? '🔇' : '🔊'}</button></div>
      <div class="plg-arena"><div class="plg-hero" id="plgHero">🧙</div>
        <div class="plg-enemy" id="plgEn"><div class="plg-hp" id="plgHp">${'<b></b>'.repeat(QN)}</div>${L.enemy}<small>${L.en}</small></div><div class="plg-fx" id="plgFx"></div></div>
      <div class="plg-card" id="plgCard"></div></div>`;
    $('plgM').onclick = () => { muted = !muted; $('plgM').textContent = muted ? '🔇' : '🔊'; };
    hud();
  }
  function hud() {
    $('plgH').textContent = '❤️'.repeat(st.hearts) + '🖤'.repeat(MAXH - st.hearts);
    $('plgS').textContent = '⭐ ' + st.score;
    $('plgC').textContent = st.combo > 1 ? `🔥 Kombo ×${st.combo}` : '🔥 Kombo 0';
    [...$('plgHp').children].forEach((b, i) => b.classList.toggle('off', i >= st.hp));
  }
  function banner() {
    const L = LEVELS[st.lv], b = document.createElement('div');
    b.className = 'plg-banner'; b.innerHTML = `<div><span>${L.enemy}</span><b>Level ${st.lv + 1}</b><p style="font-size:18px;font-weight:700">${L.name} · ${L.sub}</p></div>`;
    $('plg').appendChild(b); later(() => { b.remove(); st.q = 0; st.hp = QN; hud(); nextQ(); }, 2000);
  }

  function nextQ() {
    const L = LEVELS[st.lv], g = pick(L.gens)(); st.cur = g; st.locked = false; st.t0 = Date.now();
    $('plgCard').innerHTML = `<div class="plg-vis" id="plgVis">${g.vis(false)}</div><p class="plg-q">${g.q}</p>
      <div class="plg-timer"><i id="plgT"></i></div><div class="plg-opts">${g.opts.map((o, i) => `<button class="plg-opt" style="--i:${i}" data-i="${i}">${o}</button>`).join('')}</div><div id="plgFb"></div>`;
    const t = $('plgT'); t.style.transition = 'none'; t.style.width = '100%'; void t.offsetWidth; t.style.transition = `width ${TIME}s linear`; t.style.width = '0%';
    $('plgCard').querySelectorAll('.plg-opt').forEach((b) => (b.onclick = () => answer(+b.dataset.i)));
    st.tmo = later(() => answer(-1), TIME * 1000);
  }

  function shot(back) { const s = document.createElement('span'); s.className = 'plg-shot' + (back ? ' back' : ''); s.textContent = back ? '💥' : '✨'; $('plgFx').appendChild(s); later(() => s.remove(), 700); }
  function popText(t) { const p = document.createElement('span'); p.className = 'plg-pop'; p.textContent = t; $('plgFx').appendChild(p); later(() => p.remove(), 1000); }
  function confetti(n = 50) {
    const box = $('plg'), cols = ['#ff4d8d', '#ffd166', '#17c3b2', '#9d7bff', '#ff9f1c'];
    for (let i = 0; i < n; i++) { const c = document.createElement('i'); c.className = 'plg-conf'; const a = Math.random() * Math.PI * 2, r = 150 + Math.random() * 260; c.style.cssText = `background:${pick(cols)};--x:${Math.cos(a) * r}px;--y:${Math.sin(a) * r + 120}px;--r:${rnd(900)}deg`; box.appendChild(c); later(() => c.remove(), 1900); }
  }

  function answer(i) {
    if (st.locked) return; st.locked = true; clearTimeout(st.tmo);
    const g = st.cur, ok = i === g.ci, left = Math.max(0, TIME - (Date.now() - st.t0) / 1000);
    const t = $('plgT'); t.style.transition = 'none'; t.style.width = getComputedStyle(t).width;
    const opts = $('plgCard').querySelectorAll('.plg-opt'); opts.forEach((b) => (b.disabled = true));
    opts[g.ci].classList.add('ok'); if (i >= 0 && !ok) opts[i].classList.add('no');
    $('plgVis').innerHTML = g.vis(true); st.q++;
    let gain = 0;
    if (ok) {
      st.combo++; st.right++; gain = 100 + Math.ceil(left) * 5 + (st.combo - 1) * 20; st.score += gain; st.hp--;
      sfx('correct'); shot(false); later(() => { $('plgEn').classList.add('hit'); popText('+' + gain); hud(); $('plgC').classList.add('up'); confetti(14); if (st.hp <= 0) $('plgEn').classList.add('die'); }, 500);
      later(() => $('plgEn') && $('plgEn').classList.remove('hit'), 1200);
    } else {
      st.combo = 0; st.hearts--; sfx('wrong'); shot(true);
      later(() => { $('plgHero').classList.add('hurt'); $('plgH').classList.add('lose'); hud(); }, 500);
      later(() => { $('plgHero') && $('plgHero').classList.remove('hurt'); $('plgH') && $('plgH').classList.remove('lose'); }, 1200);
    }
    const dead = st.hearts <= 0, cleared = st.hp <= 0, last = st.lv === LEVELS.length - 1;
    const nextLabel = dead ? 'Lihat hasil' : cleared ? (last ? 'Hadapi akhir 🏁' : 'Level berikutnya →') : 'Lanjut →';
    later(() => {
      $('plgFb').innerHTML = `<div class="plg-fb"><b>${i < 0 ? '⏰ Waktu habis!' : ok ? '✅ Tepat! +' + gain + ' poin' : '❌ Belum tepat.'}</b><br>${g.why}<br><button class="plg-btn" id="plgNext" type="button">${nextLabel}</button></div>`;
      $('plgNext').onclick = () => {
        if (dead) return finish(false);
        if (cleared) { if (last) return finish(true); st.lv++; st.hearts = Math.min(MAXH, st.hearts + 1); gameScreen(); return banner(); }
        if (st.q >= QN * 3) return finish(false); // pengaman
        nextQ();
      };
    }, 900);
  }

  function finish(win) {
    clearAll(); sfx('end');
    const stars = win ? Math.max(1, st.hearts) : 0, isBest = st.score > best(); if (isBest) saveBest(st.score);
    $('plgBg').style.setProperty('--bg', win ? 'linear-gradient(160deg,#2b1a5e,#7c3aed 55%,#ff4d8d)' : 'linear-gradient(160deg,#1b1b2f,#3a3a5c)');
    $('plgBox').innerHTML = `<div class="plg-screen plg-start"><div class="plg-hero-big">${win ? '🏆' : '💀'}</div>
      <div class="plg-title">${win ? 'Misi Selesai!' : 'Game Over'}</div>
      <div class="plg-stars">${[1, 2, 3].map((n) => `<span style="--i:${n}" class="${n <= stars ? '' : 'dim'}">⭐</span>`).join('')}</div>
      <div class="plg-final" id="plgFinal">0</div>
      <p style="font-weight:700">Jawaban benar: ${st.right} soal ${isBest ? '· 🎉 Rekor baru!' : ''}</p>
      <p style="max-width:420px">${win ? 'Mantap! Kamu sudah menguasai peluang sederhana, komplemen, dan kejadian majemuk.' : 'Jangan menyerah. Buka lagi tab materi, lalu coba misi ini sekali lagi.'}</p>
      <button class="plg-btn pulse" id="plgAgain" type="button">Main lagi</button></div>`;
    const el = $('plgFinal'), t0 = performance.now(), end = st.score;
    (function tick(n) { if (!live() || !el.isConnected) return; const p = Math.min(1, (n - t0) / 1400); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(tick); })(t0);
    if (win) { confetti(70); later(() => confetti(50), 700); }
    $('plgAgain').onclick = () => { clearAll(); startScreen(); };
  }
})();
