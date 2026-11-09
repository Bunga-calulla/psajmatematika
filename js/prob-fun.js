/* PROB FUN — lapisan animasi & interaktif untuk modul Peluang */
(function () {
  'use strict';
  const F = window.FunCore; if (!F) return;
  const { $, $$, fmt, ri, pick, say, sayCool, confettiAt, touch, bump, reduce } = F;
  const R = '#E33E57', O = '#FF9F1C';
  const PIPS = { 1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8] };
  const die = n => `<svg class="fx-die" viewBox="0 0 100 100" aria-label="Dadu menunjukkan ${n}"><rect x="5" y="5" width="90" height="90" rx="20" fill="#fff" stroke="#241B3A" stroke-width="5"/>${PIPS[n].map(i => `<circle cx="${25 + (i % 3) * 25}" cy="${25 + Math.floor(i / 3) * 25}" r="8" fill="${n === 1 ? '#E33E57' : '#241B3A'}"/>`).join('')}</svg>`;
  const EV = { genap: ['Genap', [2, 4, 6]], ganjil: ['Ganjil', [1, 3, 5]], besar: ['≥ 5', [5, 6]], enam: ['Angka 6', [6]] };
  const SCALE = [['🕳️ Dadu muncul angka 7', 0], ['🎲 Dadu muncul angka 6', 1 / 6], ['🎲 Dadu muncul ≥ 5', 1 / 3], ['🪙 Koin muncul angka', 1 / 2], ['🎲 Dadu muncul ≤ 4', 2 / 3], ['🎲 Dadu muncul ≤ 6', 1]];
  const frac = (k, n) => { const g = (a, b) => b ? g(b, a % b) : a, d = g(k, n) || 1; return (k / d) + '/' + (n / d); };

  function materi() {
    const s1 = `
<div class="fx-two"><div style="text-align:center"><div id="fxDie">${die(3)}</div>
  <div class="fx-btnrow" style="justify-content:center"><button type="button" class="fx-btn big" data-roll="1">🎲 Lempar 1×</button><button type="button" class="fx-btn" data-roll="10">10×</button><button type="button" class="fx-btn" data-roll="100">100×</button><button type="button" class="fx-btn" data-roll="0">↩️ Ulang</button></div></div>
<div><b>Pilih kejadian:</b><div class="fx-btnrow">${Object.keys(EV).map((k, i) => `<button type="button" class="fx-btn${i ? '' : ' on'}" data-ev="${k}">${EV[k][0]}</button>`).join('')}</div>
  <div class="fx-vals v3"><div class="fx-val" style="--vc:#7C3AED"><small>TEORI</small><b id="fxPT">-</b></div><div class="fx-val" style="--vc:#E33E57"><small>PERCOBAAN</small><b id="fxPE">-</b></div><div class="fx-val" style="--vc:#17C3B2"><small>LEMPARAN</small><b id="fxPN">0</b></div></div></div></div>
<div class="fx-stage" style="margin-top:14px"><svg id="fxPSvg" viewBox="0 0 420 200" role="img" aria-label="Diagram frekuensi relatif tiap sisi dadu"></svg></div>
<p class="fx-note" id="fxPMsg">Lempar dadunya! Batang merah muda adalah sisi yang termasuk kejadian.</p>`;
    const s2 = `<div class="fx-scale" id="fxScale"><span class="fx-needle" id="fxNeedle" style="left:0%">📍</span></div>
<div class="fx-scale-lbl"><span>0 · mustahil</span><span>½</span><span>1 · pasti</span></div>
<div class="fx-btnrow">${SCALE.map((s, i) => `<button type="button" class="fx-btn" data-sc="${i}">${s[0]}</button>`).join('')}</div>
<p class="fx-note" id="fxScMsg">Ketuk salah satu kejadian untuk melihat posisi peluangnya.</p>`;
    return F.hero({ color: R, sym: '🎲', floats: ['P(A)', '½', '⅙', '🎲', '🪙', '0', '1', '%'], badge: '🎲 PETUALANGAN PELUANG', title: 'Halo, aku <span>Luang</span> 👋<br>Yuk main tebak peluang!', chips: [['fxP1', '🎲 Lempar dadu'], ['fxP2', '📏 Skala peluang']] })
      + F.sec(1, 'fxP1', 'Dadu virtual', '🎲', 'Lempar dadu berkali-kali. Makin banyak lemparan, hasil <b style="color:#E0306F">percobaan</b> makin mendekati hasil <b style="color:#6D28D9">teori</b>!', s1, R, O)
      + F.sec(2, 'fxP2', 'Dari mustahil sampai pasti', '📏', 'Peluang selalu ada di antara 0 dan 1. Lihat di mana kejadian-kejadian ini berada.', s2, O, '#17C3B2');
  }

  function wireDice(root) {
    const svg = $('#fxPSvg', root); if (!svg) return;
    let cnt = [0, 0, 0, 0, 0, 0], n = 0, ev = 'genap', busy = false;
    function draw() {
      const faces = EV[ev][1], hits = faces.reduce((s, f) => s + cnt[f - 1], 0), th = faces.length / 6;
      let h = '<line class="fx-axis" x1="8" y1="170" x2="412" y2="170"/>';
      for (let i = 0; i < 6; i++) {
        const f = n ? cnt[i] / n : 0, bh = Math.min(f * 100 * 3.25, 135), x = 26 + i * 62;
        h += `<rect class="fx-pbar${faces.includes(i + 1) ? ' on' : ''}" x="${x}" y="${170 - bh}" width="44" height="${Math.max(bh, 0)}" rx="8"/><text class="fx-dim" x="${x + 22}" y="190" text-anchor="middle">${i + 1}</text><text class="fx-tick" x="${x + 22}" y="${164 - bh}" text-anchor="middle">${cnt[i] || ''}</text>`;
      }
      h += `<line class="fx-mean" style="stroke:#7C3AED" x1="8" x2="412" y1="${170 - 100 / 6 * 3.25}" y2="${170 - 100 / 6 * 3.25}"/><text class="fx-medl" x="410" y="${170 - 100 / 6 * 3.25 - 5}" text-anchor="end">teori ⅙</text>`;
      svg.innerHTML = h;
      bump($('#fxPT', root), `${frac(faces.length, 6)} = ${fmt(th * 100, 1)}%`);
      bump($('#fxPE', root), n ? `${hits}/${n} = ${fmt(hits / n * 100, 1)}%` : '-'); bump($('#fxPN', root), String(n));
      if (n >= 100) $('#fxPMsg', root).textContent = `🎯 Setelah ${n} lemparan, percobaan (${fmt(hits / n * 100, 1)}%) makin dekat ke teori (${fmt(th * 100, 1)}%). Inilah hukum bilangan besar!`;
    }
    function roll(k) {
      if (busy) return; if (!k) { cnt = [0, 0, 0, 0, 0, 0]; n = 0; $('#fxPMsg', root).textContent = 'Data direset. Lempar lagi!'; draw(); return; }
      busy = true; touch();
      let last = 1; for (let i = 0; i < k; i++) { last = ri(1, 6); cnt[last - 1]++; n++; }
      const holder = $('#fxDie', root);
      if (reduce) { holder.innerHTML = die(last); busy = false; draw(); return; }
      let t = 0; const iv = setInterval(() => { holder.innerHTML = die(t < 6 ? ri(1, 6) : last); holder.firstChild.classList.add('rolling'); if (++t > 6) { clearInterval(iv); busy = false; draw(); if (k === 1 && EV[ev][1].includes(last)) sayCool('hit', 'Masuk kejadian! 🎯', 2500, 1800); } }, 70);
    }
    $$('[data-roll]', root).forEach(b => b.addEventListener('click', () => roll(+b.dataset.roll)));
    $$('[data-ev]', root).forEach(b => b.addEventListener('click', () => { ev = b.dataset.ev; $$('[data-ev]', root).forEach(x => x.classList.toggle('on', x === b)); draw(); }));
    draw();

    const nd = $('#fxNeedle', root), sm = $('#fxScMsg', root);
    $$('[data-sc]', root).forEach(b => b.addEventListener('click', () => {
      const s = SCALE[+b.dataset.sc], p = s[1];
      nd.style.left = (p * 100) + '%';
      const k = p === 0 ? 'mustahil' : p === 1 ? 'pasti terjadi' : p < .34 ? 'kecil kemungkinannya' : p < .67 ? 'cukup mungkin' : 'besar kemungkinannya';
      sm.innerHTML = `${s[0]} → P = ${p === 0 ? '0' : p === 1 ? '1' : frac(Math.round(p * 6), 6)} = <b>${fmt(p * 100, 1)}%</b> (${k})`; touch();
    }));
  }

  /* ---------- Lab: kantong kelereng ---------- */
  const COLS = [['Merah', '#E33E57'], ['Biru', '#3B82F6'], ['Hijau', '#17C3B2']];
  function coba() {
    return F.sec(1, 'fxP3', 'Kantong kelereng ajaib', '🎒', 'Atur isi kantong, pilih warna incaran, lalu ambil kelereng (dikembalikan lagi setelah diambil). Bandingkan teori dengan percobaan!', `
<div class="fx-two"><div class="fx-stage"><svg id="fxBag" viewBox="0 0 420 220" role="img" aria-label="Kantong berisi kelereng berwarna"></svg></div>
<div>${COLS.map((c, i) => `<div class="fx-ctrl"><label for="fxM${i}">Kelereng ${c[0]} <output id="fxMo${i}">${[3, 2, 1][i]}</output></label><input id="fxM${i}" type="range" min="0" max="8" value="${[3, 2, 1][i]}"></div>`).join('')}
  <b>Warna incaran:</b><div class="fx-btnrow">${COLS.map((c, i) => `<button type="button" class="fx-btn${i ? '' : ' on'}" data-tg="${i}">${c[0]}</button>`).join('')}</div></div></div>
<div class="fx-btnrow"><button type="button" class="fx-btn big" data-take="1">🤏 Ambil 1</button><button type="button" class="fx-btn" data-take="20">Ambil 20×</button><button type="button" class="fx-btn" data-take="0">↩️ Ulang</button></div>
<div class="fx-vals v3"><div class="fx-val" style="--vc:#7C3AED"><small>TEORI</small><b id="fxBT">-</b></div><div class="fx-val" style="--vc:#E33E57"><small>PERCOBAAN</small><b id="fxBE">-</b></div><div class="fx-val" style="--vc:#17C3B2"><small>PENGAMBILAN</small><b id="fxBN">0</b></div></div>
<p class="fx-note" id="fxBMsg"></p>`, R, '#3B82F6');
  }

  function wireBag(root) {
    const svg = $('#fxBag', root); if (!svg) return;
    let tg = 0, n = 0, hit = 0, marbles = [];
    const cnt = () => COLS.map((c, i) => +$('#fxM' + i, root).value);
    function build() {
      const c = cnt(); marbles = []; c.forEach((k, i) => { for (let j = 0; j < k; j++) marbles.push(i); });
      let h = '<path d="M110 70 Q90 90 80 140 Q75 200 130 205 L290 205 Q345 200 340 140 Q330 90 310 70 Z" fill="#FFE9C7" stroke="#241B3A" stroke-width="5"/><path d="M110 70 Q210 40 310 70" fill="none" stroke="#241B3A" stroke-width="5"/>';
      marbles.forEach((ci, i) => { h += `<circle class="fx-marble${ci === tg ? ' pick' : ''}" data-i="${i}" cx="${120 + (i % 6) * 36 + (Math.floor(i / 6) % 2) * 18}" cy="${185 - Math.floor(i / 6) * 32}" r="14" fill="${COLS[ci][1]}"/>`; });
      svg.innerHTML = h; stat();
      COLS.forEach((x, i) => $('#fxMo' + i, root).textContent = c[i]);
    }
    function stat() {
      const N = marbles.length, k = marbles.filter(m => m === tg).length;
      bump($('#fxBT', root), N ? `${frac(k, N)} = ${fmt(k / N * 100, 1)}%` : '-');
      bump($('#fxBE', root), n ? `${hit}/${n} = ${fmt(hit / n * 100, 1)}%` : '-'); bump($('#fxBN', root), String(n));
      $('#fxBMsg', root).textContent = N ? `Ruang sampel: ${N} kelereng, semuanya sama-sama mungkin terambil. Peluang ${COLS[tg][0].toLowerCase()} = ${k}/${N}.` : 'Kantong kosong! Tambahkan kelereng dulu.';
    }
    function take(k) {
      if (!marbles.length) { shake0(); return; }
      if (!k) { n = hit = 0; stat(); return; }
      touch(); let last = 0;
      for (let i = 0; i < k; i++) { last = ri(0, marbles.length - 1); n++; if (marbles[last] === tg) hit++; }
      const m = $('.fx-marble[data-i="' + last + '"]', svg);
      if (m && !reduce) { m.classList.remove('pop'); void m.getBoundingClientRect(); m.classList.add('pop'); }
      stat(); sayCool('take', `Terambil: kelereng ${COLS[marbles[last]][0].toLowerCase()}! ${marbles[last] === tg ? '🎯' : ''}`, 1500, 1800);
      if (n >= 100) sayCool('lln', 'Makin banyak pengambilan, percobaan makin dekat ke teori! 📈', 6000, 4200);
    }
    const shake0 = () => F.shake($('#fxBMsg', root));
    $$('input[id^=fxM]', root).forEach(e => e.addEventListener('input', () => { n = hit = 0; build(); touch(); }));
    $$('[data-tg]', root).forEach(b => b.addEventListener('click', () => { tg = +b.dataset.tg; n = hit = 0; $$('[data-tg]', root).forEach(x => x.classList.toggle('on', x === b)); build(); }));
    $$('[data-take]', root).forEach(b => b.addEventListener('click', () => take(+b.dataset.take)));
    build();
  }

  F.install({
    id: 'peluang', emoji: '🎲', mascot: { color: R, sym: 'P' },
    phrases: ['Peluang itu bukan menebak, tapi menghitung kemungkinan! 🎯', 'Dari dadu sampai undian, semuanya punya peluang yang bisa dihitung 🎲', 'Lempar, ambil, dan bandingkan hasilnya. Aku temani! 🪙'],
    facts: ['Peluang selalu di antara 0 dan 1. Kalau hasilmu 1,5, pasti ada yang salah!', 'Ada kata “tidak” atau “minimal”? Coba komplemen dulu.', 'Kata “atau” berarti tambah. Jangan lupa kurangi irisannya.', 'Kata “dan” pada kejadian saling bebas berarti kali.', 'Tulis dulu ruang sampelnya supaya tidak ada yang terlewat.', 'Klik dadu atau bola di materi, mereka bisa berguling!', 'Peluang 0 berarti mustahil, peluang 1 berarti pasti terjadi 📏', 'Koin yang dilempar 1000 kali hampir selalu mendekati 50% angka 🪙', 'Peluang dua dadu berjumlah 7 adalah yang paling besar: 6 dari 36 🎲', 'Ruang sampel adalah daftar semua hasil yang mungkin 📝'],
    greet: 'Halo! Aku Luang 👋 Yuk lempar dadunya!',
    tabMsg: { materi: 'Lempar dadunya berkali-kali 🎲', coba: 'Waktunya ambil kelereng! 🎒', latihan: 'Semangat! Kamu pasti bisa 💪' },
    materi, wireMateri: wireDice, coba, wireCoba: wireBag
  });
})();
