/* STAT FUN — lapisan animasi & interaktif untuk modul Statistika */
(function () {
  'use strict';
  const F = window.FunCore; if (!F) return;
  const { $, $$, fmt, ri, say, sayCool, confetti, confettiAt, touch, bump, shake, reduce } = F;
  const A = '#17C3B2', B = '#7C3AED';
  const EMO = ['⚽', '🏀', '🏐', '🎾', '🏸', '🏓', '🥎'], BASE = [5, 7, 6, 8, 6, 7, 6];

  function stats(a) {
    const s = a.slice().sort((x, y) => x - y), n = s.length, sum = s.reduce((p, q) => p + q, 0);
    const med = n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2, c = {};
    a.forEach(v => c[v] = (c[v] || 0) + 1);
    const mx = Math.max.apply(null, Object.values(c));
    return { n, sum, mean: sum / n, med, range: s[n - 1] - s[0], mod: mx > 1 ? Object.keys(c).filter(k => c[k] === mx).map(Number) : [] };
  }

  const CARDS = [
    ['⚖️', 'Mean', 'titik seimbang', 'Σx ÷ n', '70, 75, 80, 80, 90 → 395 ÷ 5 = 79', '#D5F6EC'],
    ['🚏', 'Median', 'data paling tengah', 'urutkan, ambil tengah', '70, 75, 80, 80, 90 → tengahnya 80', '#E9DEFF'],
    ['👑', 'Modus', 'paling sering muncul', 'cari yang paling banyak', '80 muncul 2×, jadi modus = 80', '#FFF1B8'],
    ['📏', 'Range', 'jarak terjauh', 'maks − min', '90 − 70 = 20', '#FFD9E8']
  ];

  function materi() {
    const s1 = `
<div class="fx-stage"><svg id="fxBars" viewBox="0 0 500 245" role="img" aria-label="Diagram batang skor yang bisa diseret">
  <line class="fx-axis" x1="30" y1="210" x2="414" y2="210"/>
  <g id="fxBarsG"></g></svg></div>
<div class="fx-btnrow">
  <button type="button" class="fx-btn" data-act="rand">🎲 Acak skor</button>
  <button type="button" class="fx-btn" data-act="sort">🔢 Urutkan</button>
  <button type="button" class="fx-btn" data-act="vip" id="fxVip">🚀 Bintang tamu</button>
  <button type="button" class="fx-btn" data-act="reset">↩️ Reset</button>
</div>
<div class="fx-vals">
  <div class="fx-val" style="--vc:#FF4D8D"><small>MEAN</small><b id="fxVMean">-</b></div>
  <div class="fx-val" style="--vc:#7C3AED"><small>MEDIAN</small><b id="fxVMed">-</b></div>
  <div class="fx-val" style="--vc:#E5B93A"><small>MODUS 👑</small><b id="fxVMod">-</b></div>
  <div class="fx-val" style="--vc:#17C3B2"><small>RANGE</small><b id="fxVRange">-</b></div>
</div>
<p class="fx-note" id="fxStatMsg"></p>`;
    const s2 = `<div class="fx-flip-row">${CARDS.map(c => `
  <div class="fx-flip" tabindex="0" role="button" aria-label="Kartu ${c[1]}. Tekan untuk membalik" style="--bg-c:${c[5]}"><div class="fx-flip-in">
    <div class="fx-face"><div class="emo">${c[0]}</div><h4>${c[1]}</h4><small>${c[2]}</small></div>
    <div class="fx-face back"><b>${c[3]}</b><small>${c[4]}</small></div></div></div>`).join('')}</div>`;
    return F.hero({ color: A, sym: 'Σ', floats: ['x̄', 'Σ', 'n', 'Me', 'Mo', 'R', '70', '85'], badge: '📊 PETUALANGAN STATISTIKA', title: 'Halo, aku <span>Stat</span> 👋<br>Yuk bongkar data pertandingan!', chips: [['fxS1', '📊 Papan skor'], ['fxS2', '🃏 Kartu ukuran'], ['fxS4', '🚏 Median'], ['fxS5', '👑 Modus'], ['fxS6', '🌍 Sekitarmu']] })
      + F.sec(1, 'fxS1', 'Papan skor yang bisa diseret', '📊', 'Tarik batang naik-turun. Garis <b style="color:#E0306F">mean</b>, garis <b style="color:#6D28D9">median</b>, dan mahkota 👑 <b>modus</b> ikut bergerak. Coba tekan 🚀!', s1, A, B)
      + F.sec(2, 'fxS2', 'Empat kartu ukuran data', '🃏', 'Ketuk kartu untuk membaliknya dan lihat rumus serta contohnya.', s2, B, '#FF4D8D')
      + F.sec(3, 'fxS4', 'Median: cari yang paling tengah', '🚏', 'Urutkan kartu, lalu <b>coret satu dari kiri dan satu dari kanan</b> sampai tersisa yang di tengah. Coba juga data genap!', SEC_MEDIAN, B, A)
      + F.sec(4, 'fxS5', 'Modus: survei jajan kelas', '👑', 'Ketuk makanan favorit untuk menambah suara. Batang yang <b>paling tinggi</b> jadi modus. Bisa juga ada dua modus!', SEC_VOTE, '#E5B93A', '#FF9F1C')
      + F.sec(5, 'fxS6', 'Statistika di sekitarmu', '🌍', 'Mean, median, modus, dan range ada di rapor, gaji, toko sepatu, sampai ramalan cuaca. Ketuk kartunya!', SEC_AROUND, '#FF4D8D', B);
  }

  function wireBars(root) {
    const svg = $('#fxBars', root), g = $('#fxBarsG', root); if (!svg) return;
    let a = BASE.slice(), vip = false, drag = -1;
    const set = (id, t) => bump($(id, root), t);
    function draw() {
      const st = stats(a); let h = '', top = '';
      for (let v = 5; v <= 20; v += 5) h += `<line class="fx-grid" x1="30" y1="${210 - v * 9}" x2="414" y2="${210 - v * 9}"/><text class="fx-tick" x="2" y="${214 - v * 9}">${v}</text>`;
      a.forEach((v, i) => {
        const x = 44 + i * 52, y = 210 - v * 9, hot = st.mod.includes(v);
        h += `<g class="fx-bar${hot ? ' hot' : ''}" data-i="${i}"><rect x="${x}" y="${y}" width="40" height="${Math.max(v * 9, 3)}" rx="8"/><rect x="${x - 6}" y="20" width="52" height="190" fill="transparent"/><text x="${x + 20}" y="232" text-anchor="middle">${EMO[i]}</text></g>`;
        top += `<text class="fx-val-t${v >= 3 ? ' in' : ''}" x="${x + 20}" y="${v >= 3 ? 210 - 10 : y - 6}" text-anchor="middle">${v}</text>${hot ? `<text class="fx-crown" x="${x + 20}" y="${y - 21}" text-anchor="middle">👑</text>` : ''}`;
      });
      const ym = 210 - st.mean * 9, yd = 210 - st.med * 9;
      let lm = ym, ld = yd;
      if (Math.abs(ym - yd) < 20) { const mid = (ym + yd) / 2, up = ym <= yd; lm = mid + (up ? -11 : 11); ld = mid + (up ? 11 : -11); }
      const tag = (cls, y, t) => `<g class="${cls}"><rect x="418" y="${y - 10}" width="${t.length * 7.4 + 14}" height="20" rx="10"/><text x="425" y="${y + 4}">${t}</text></g>`;
      h += `<line class="fx-mean" x1="30" x2="414" y1="${ym}" y2="${ym}"/><line class="fx-med" x1="30" x2="414" y1="${yd}" y2="${yd}"/>`;
      h += top + tag('fx-tag fx-tag-mean', lm, 'mean ' + fmt(st.mean, 1)) + tag('fx-tag fx-tag-med', ld, 'median ' + fmt(st.med, 1));
      g.innerHTML = h;
      set('#fxVMean', fmt(st.mean, 1)); set('#fxVMed', fmt(st.med, 1));
      set('#fxVMod', st.mod.length ? st.mod.join(', ') : 'tidak ada'); set('#fxVRange', String(st.range));
      const d = st.mean - st.med;
      $('#fxStatMsg', root).textContent = Math.abs(d) >= 1.2
        ? `🚀 Ada nilai ekstrem! Mean ${d > 0 ? 'ketarik naik' : 'ketarik turun'} ke ${fmt(st.mean, 1)}, sedangkan median tetap ${fmt(st.med, 1)}. Median lebih mewakili kebanyakan pemain.`
        : st.mod.length ? '👍 Mean dan median berdekatan, artinya datanya cukup seimbang.' : 'Semua skor berbeda, jadi tidak ada modus. Coba samakan dua batang!';
      if (Math.abs(d) >= 1.2) sayCool('out', 'Lihat? Satu nilai ekstrem menarik mean, tapi median bergeming 😎', 5000);
    }
    function go(to) {
      touch();
      if (reduce) { a = to; draw(); return; }
      const from = a.slice(), t0 = performance.now();
      (function f(t) { const k = Math.min(1, (t - t0) / 350), e = 1 - Math.pow(1 - k, 3); a = from.map((v, i) => Math.round(v + (to[i] - v) * e)); draw(); if (k < 1) requestAnimationFrame(f); })(t0);
    }
    function move(e) {
      if (drag < 0) return;
      const r = svg.getBoundingClientRect(), y = (e.clientY - r.top) * 245 / r.height, v = Math.max(0, Math.min(20, Math.round((210 - y) / 9)));
      if (v !== a[drag]) { a[drag] = v; draw(); touch(); }
    }
    svg.addEventListener('pointerdown', e => { const b = e.target.closest('.fx-bar'); if (!b) return; drag = +b.dataset.i; svg.setPointerCapture(e.pointerId); e.preventDefault(); move(e); });
    svg.addEventListener('pointermove', move);
    ['pointerup', 'pointercancel'].forEach(t => svg.addEventListener(t, () => { drag = -1; }));
    $$('[data-act]', root).forEach(b => b.addEventListener('click', () => {
      const k = b.dataset.act;
      if (k === 'rand') { vip = false; go(a.map(() => ri(2, 16))); }
      if (k === 'sort') go(a.slice().sort((x, y) => x - y));
      if (k === 'vip') { vip = !vip; const t = a.slice(); t[6] = vip ? 20 : 6; go(t); }
      if (k === 'reset') { vip = false; go(BASE.slice()); }
      $('#fxVip', root).textContent = vip ? '🙅 Usir bintang tamu' : '🚀 Bintang tamu';
    }));
    draw();
  }

  /* ---------- Lab: jungkat-jungkit mean ---------- */
  function cobaSeesaw() {
    return F.sec(1, 'fxS3', 'Jungkat-jungkit titik seimbang', '⚖️', 'Setiap bulat adalah satu data. Geser titik tumpu sampai jungkat-jungkitnya <b>seimbang</b>. Di titik itulah <b>mean</b> berada!', `
<div class="fx-stage"><svg id="fxSee" viewBox="0 0 420 200" role="img" aria-label="Jungkat-jungkit dengan data di garis bilangan">
  <g class="fx-beam" id="fxBeam"></g><polygon id="fxFul" fill="#17C3B2" stroke="#241B3A" stroke-width="4" stroke-linejoin="round"/></svg></div>
<div class="fx-ctrl"><label for="fxFulcrum">Titik tumpu <output id="fxFulOut">3</output></label><input id="fxFulcrum" type="range" min="0" max="16" step="0.1" value="3"></div>
<div class="fx-btnrow"><button type="button" class="fx-btn big" id="fxSeeNew">🎲 Data baru</button></div>
<p class="fx-note" id="fxSeeMsg"></p>`, A, B);
  }

  function coba() {
    return cobaSeesaw()
      + F.sec(2, 'fxS7', 'Cepat Tepat: jawab beruntun', '⚡', 'Soal acak tentang mean, median, modus, dan range. Jawab benar berturut-turut untuk menaikkan <b>streak</b> 🔥!', SEC_QUICK, '#FF9F1C', '#E0306F')
      + F.sec(3, 'fxS8', 'Misi Detektif Data: 5 soal', '🕵️', 'Selesaikan 5 kasus data. Setiap jenis ukuran muncul minimal sekali. Kumpulkan skor setinggi mungkin!', SEC_MISSION, B, A);
  }

  function wireSee(root) {
    const svg = $('#fxSee', root); if (!svg) return;
    const beam = $('#fxBeam', root), ful = $('#fxFul', root), sl = $('#fxFulcrum', root), msg = $('#fxSeeMsg', root), out = $('#fxFulOut', root);
    let d = [], won = false;
    const X = v => 30 + v * 22.5;
    function newData() {
      d = Array.from({ length: 6 }, () => ri(2, 14)); won = false; sl.value = 1; build(); upd();
    }
    function build() {
      const cnt = {}; let h = '<rect x="20" y="146" width="380" height="8" rx="4" fill="#241B3A"/>';
      for (let v = 0; v <= 16; v += 2) h += `<text class="fx-tick" x="${X(v)}" y="172" text-anchor="middle">${v}</text>`;
      d.forEach(v => { const k = cnt[v] = (cnt[v] || 0) + 1; h += `<circle class="fx-dot" cx="${X(v)}" cy="${137 - (k - 1) * 20}" r="9"/><text class="fx-dtxt" x="${X(v)}" y="${141 - (k - 1) * 20}" text-anchor="middle">${v}</text>`; });
      beam.innerHTML = h;
    }
    function upd() {
      const f = +sl.value, st = stats(d), diff = st.mean - f, ang = Math.max(-16, Math.min(16, d.length * diff * 2.2));
      out.textContent = fmt(f, 1);
      beam.style.transformOrigin = X(f) + 'px 150px'; beam.style.transform = 'rotate(' + ang.toFixed(1) + 'deg)';
      ful.setAttribute('points', `${X(f) - 16},192 ${X(f) + 16},192 ${X(f)},156`);
      if (Math.abs(diff) < 0.2) {
        msg.innerHTML = `⚖️ <b>SEIMBANG!</b> Σx = ${st.sum}, n = ${st.n} → mean = ${st.sum} ÷ ${st.n} = <b>${fmt(st.mean, 2)}</b>`;
        if (!won) { won = true; confettiAt(svg, 70); say('Tuh kan, titik seimbang itu mean! 🎉', 4000); touch(); }
      } else msg.textContent = diff > 0 ? '👉 Sisi kanan lebih berat. Geser titik tumpu ke kanan.' : '👈 Sisi kiri lebih berat. Geser titik tumpu ke kiri.';
    }
    sl.addEventListener('input', upd);
    $('#fxSeeNew', root).addEventListener('click', newData);
    newData();
  }

  /* =====================================================================
     TAMBAHAN: lebih banyak bagian interaktif + mini-game
     ===================================================================== */
  const pick = F.pick;
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  /* ---------- Materi 3: median, antrean tengah ---------- */
  const SEC_MEDIAN = `
<div class="fx-stage sf-stage"><div class="sf-deck" id="sfDeck" role="group" aria-label="Kartu data untuk mencari median"></div></div>
<div class="fx-btnrow">
  <button type="button" class="fx-btn" data-sf="m-sort">🔢 Urutkan</button>
  <button type="button" class="fx-btn" data-sf="m-cut">✂️ Coret kiri-kanan</button>
  <button type="button" class="fx-btn" data-sf="m-n" id="sfMedN">🔀 Ganti jadi data genap</button>
  <button type="button" class="fx-btn" data-sf="m-new">🎲 Data baru</button>
</div>
<p class="fx-note" id="sfMedMsg"></p>`;

  function wireMedian(root) {
    const deck = $('#sfDeck', root); if (!deck) return;
    const msg = $('#sfMedMsg', root), nBtn = $('#sfMedN', root);
    let n = 5, cards = [], sorted = false, step = 0, done = false;
    const say2 = t => { msg.innerHTML = t; };
    function pos() {
      const order = sorted ? cards.slice().sort((a, b) => a.v - b.v || a.id - b.id) : cards;
      order.forEach((c, i) => { c.el.style.setProperty('--i', i); c.pos = i; });
      cards.forEach(c => {
        const gone = sorted && (c.pos < step || c.pos > n - 1 - step) && !(done && c.mid);
        c.el.classList.toggle('cut', gone && !c.mid);
        c.el.classList.toggle('mid', !!c.mid);
      });
    }
    function fresh() {
      sorted = false; step = 0; done = false;
      deck.style.setProperty('--n', n); deck.innerHTML = '';
      cards = Array.from({ length: n }, (_, id) => {
        const v = ri(2, 19), el = document.createElement('div');
        el.className = 'sf-card'; el.textContent = v; deck.appendChild(el);
        return { id, v, el, pos: id, mid: false };
      });
      nBtn.textContent = n === 5 ? '🔀 Ganti jadi data genap' : '🔀 Ganti jadi data ganjil';
      pos();
      say2(`Ada <b>${n}</b> data yang masih acak. Tekan <b>🔢 Urutkan</b> dulu!`);
    }
    function finish() {
      done = true;
      const s = cards.slice().sort((a, b) => a.v - b.v || a.id - b.id);
      if (n % 2) {
        s[(n - 1) / 2].mid = true; pos();
        say2(`👑 Sisa satu kartu. <b>Median = ${s[(n - 1) / 2].v}</b>. Dia persis di tengah.`);
      } else {
        const a = s[n / 2 - 1], b = s[n / 2]; a.mid = b.mid = true; pos();
        say2(`👑 Sisa dua kartu: ${a.v} dan ${b.v}. Median = (${a.v} + ${b.v}) ÷ 2 = <b>${fmt((a.v + b.v) / 2, 1)}</b>`);
      }
      confettiAt(deck, 40); say('Median ketemu! Data genap berarti rata-rata dua kartu tengah 🎯', 4200); touch();
    }
    $$('[data-sf^="m-"]', root).forEach(b => b.addEventListener('click', () => {
      const k = b.dataset.sf; touch();
      if (k === 'm-new') return fresh();
      if (k === 'm-n') { n = n === 5 ? 6 : 5; return fresh(); }
      if (k === 'm-sort') {
        if (sorted) return say2('Sudah urut. Sekarang tekan <b>✂️ Coret kiri-kanan</b>.');
        sorted = true; pos();
        return say2('Sudah urut dari kecil ke besar. Sekarang coret satu kartu paling kiri dan satu paling kanan, berulang.');
      }
      if (k === 'm-cut') {
        if (!sorted) { shake(deck); say('Urutkan dulu ya, baru dicoret 😉', 2600); return say2('⚠️ Median hanya bisa dicari dari data yang <b>sudah urut</b>.'); }
        if (done) return say2('Sudah selesai. Coba <b>🎲 Data baru</b>!');
        step++; pos();
        const left = n - 2 * step;
        if (left <= (n % 2 ? 1 : 2)) finish(); else say2(`Dicoret ${step} dari kiri dan ${step} dari kanan. Sisa ${left} kartu.`);
      }
    }));
    fresh();
  }

  /* ---------- Materi 4: modus, survei jajan ---------- */
  const SNACK = [['🍜', 'Mie ayam'], ['🧋', 'Es teh'], ['🍗', 'Geprek'], ['🍟', 'Kentang'], ['🍩', 'Donat']];
  const SEC_VOTE = `
<div class="fx-stage sf-stage"><div class="sf-vote" id="sfVote"></div></div>
<div class="fx-btnrow">
  <button type="button" class="fx-btn big" data-sf="v-auto">🤖 Voting otomatis</button>
  <button type="button" class="fx-btn" data-sf="v-tie">🤝 Buat seri</button>
  <button type="button" class="fx-btn" data-sf="v-reset">↩️ Reset</button>
</div>
<p class="fx-note" id="sfVoteMsg"></p>`;

  function wireVote(root) {
    const box = $('#sfVote', root); if (!box) return;
    const msg = $('#sfVoteMsg', root), INIT = [2, 4, 3, 1, 2];
    let c = INIT.slice(), timer = 0;
    box.innerHTML = SNACK.map((s, i) => `
<div class="sf-vcol" data-i="${i}">
  <div class="sf-vtrack"><span class="sf-vcrown" aria-hidden="true">👑</span><div class="sf-vbar"><b>0</b></div></div>
  <button type="button" class="sf-vbtn" data-vote="${i}" aria-label="Pilih ${s[1]}"><span>${s[0]}</span><small>${s[1]}</small></button>
</div>`).join('');
    function draw(hit) {
      const mx = Math.max.apply(null, c), top = Math.max(mx, 8), tot = c.reduce((a, b) => a + b, 0);
      const ws = c.map((v, i) => v === mx ? i : -1).filter(i => i >= 0);
      const modus = mx > 0 && ws.length < c.length ? ws : [];
      $$('.sf-vcol', box).forEach((col, i) => {
        col.classList.toggle('hot', modus.includes(i));
        const bar = $('.sf-vbar', col); bar.style.setProperty('--h', (c[i] / top * 100).toFixed(1) + '%');
        const b = $('b', bar); bump(b, String(c[i]));
        if (hit === i) { bar.classList.remove('hit'); void bar.offsetWidth; bar.classList.add('hit'); }
      });
      if (!tot) msg.textContent = 'Belum ada suara. Ketuk makanan favoritmu!';
      else if (!modus.length) msg.innerHTML = `Semua pilihan sama banyak (${mx}×), jadi <b>tidak ada modus</b>. Tambah satu suara untuk memecah seri!`;
      else if (modus.length === 1) msg.innerHTML = `👑 <b>Modus = ${SNACK[modus[0]][0]} ${SNACK[modus[0]][1]}</b>, dipilih ${mx}× dari ${tot} suara. Modus itu yang paling sering muncul.`;
      else msg.innerHTML = `👑👑 Ada <b>${modus.length} modus</b> (${modus.map(i => SNACK[i][0]).join(' ')}), masing-masing ${mx}×. Datanya disebut <b>bimodal</b>.`;
      return modus.length;
    }
    function stop() { clearInterval(timer); timer = 0; }
    box.addEventListener('click', e => {
      const b = e.target.closest('[data-vote]'); if (!b) return;
      stop(); const i = +b.dataset.vote; c[i]++; touch(); const m = draw(i);
      if (c[i] === Math.max.apply(null, c) && m === 1 && c[i] >= 6) sayCool('vote', 'Pilihan ini makin jauh di depan. Itu yang disebut modus 👑', 6000);
    });
    $$('[data-sf^="v-"]', root).forEach(b => b.addEventListener('click', () => {
      const k = b.dataset.sf; touch(); stop();
      if (k === 'v-reset') { c = INIT.slice(); draw(); }
      if (k === 'v-tie') { const t = Math.max(3, Math.max.apply(null, c)); c = c.map((v, i) => i < 2 ? t : Math.max(0, Math.min(v, t - 1))); draw(); say('Seri! Modusnya jadi dua. Itu namanya bimodal 👑👑', 4200); }
      if (k === 'v-auto') {
        let k2 = 0; timer = setInterval(() => { const i = ri(0, 4); c[i]++; draw(i); if (++k2 >= 12) stop(); }, reduce ? 10 : 160);
      }
    }));
    draw();
  }

  /* ---------- Materi 5: statistika di sekitarmu ---------- */
  const AROUND = [
    ['🎓', 'Nilai rapor', 'pakai mean', 'Σ nilai ÷ jumlah mapel', '85, 90, 80, 85 → 340 ÷ 4 = 85', '#D5F6EC'],
    ['💰', 'Gaji sekota', 'pakai median', 'satu angka ekstrem tidak menggeser tengah', '4, 5, 5, 6, 500 juta → median 5 juta', '#E9DEFF'],
    ['👟', 'Ukuran sepatu', 'pakai modus', 'toko menyetok yang paling laris', 'Ukuran 41 paling banyak → stok 41', '#FFF1B8'],
    ['🌡️', 'Suhu harian', 'pakai range', 'terpanas − terdingin', '34° − 26° = 8°', '#FFD9E8']
  ];
  const SEC_AROUND = `<div class="fx-flip-row">${AROUND.map(c => `
  <div class="fx-flip" tabindex="0" role="button" aria-label="Kartu ${c[1]}. Tekan untuk membalik" style="--bg-c:${c[5]}"><div class="fx-flip-in">
    <div class="fx-face"><div class="emo">${c[0]}</div><h4>${c[1]}</h4><small>${c[2]}</small></div>
    <div class="fx-face back"><b>${c[3]}</b><small>${c[4]}</small></div></div></div>`).join('')}</div>`;

  /* ---------- Mesin soal untuk mini-game ---------- */
  const KIND = {
    mean: { emo: '⚖️', label: 'Mean', ask: 'Berapa <b>mean</b> (rata-rata) datanya?', hint: 'Jumlahkan semua data, lalu bagi dengan banyaknya data.', color: '#17C3B2' },
    median: { emo: '🚏', label: 'Median', ask: 'Berapa <b>median</b> datanya?', hint: 'Urutkan dari kecil ke besar dulu, lalu ambil yang di tengah.', color: '#7C3AED' },
    modus: { emo: '👑', label: 'Modus', ask: 'Berapa <b>modus</b> datanya?', hint: 'Cari angka yang paling sering muncul.', color: '#E5B93A' },
    range: { emo: '📏', label: 'Range', ask: 'Berapa <b>range</b> datanya?', hint: 'Nilai terbesar dikurangi nilai terkecil.', color: '#E0306F' }
  };
  function genQ(kind) {
    let d, ans, exp;
    if (kind === 'mean') {
      do { d = Array.from({ length: 5 }, () => ri(3, 15)); } while (d.reduce((p, q) => p + q, 0) % 5);
      const sum = d.reduce((p, q) => p + q, 0); ans = sum / 5; exp = `${d.join(' + ')} = ${sum}, lalu ${sum} ÷ 5 = ${ans}.`;
    } else if (kind === 'median') {
      const n = pick([5, 7]); d = Array.from({ length: n }, () => ri(2, 18));
      const s = d.slice().sort((a, b) => a - b); ans = s[(n - 1) / 2]; exp = `Setelah diurutkan: ${s.join(', ')}. Yang di tengah adalah ${ans}.`;
    } else if (kind === 'modus') {
      ans = ri(3, 15); const pool = shuffle(Array.from({ length: 17 }, (_, i) => i + 2).filter(v => v !== ans)).slice(0, 4);
      d = shuffle(Array(pick([2, 3])).fill(ans).concat(pool)); exp = `${ans} muncul paling sering, jadi modus = ${ans}.`;
    } else {
      d = Array.from({ length: 5 }, () => ri(2, 19)); const mx = Math.max.apply(null, d), mn = Math.min.apply(null, d);
      ans = mx - mn; exp = `Terbesar ${mx}, terkecil ${mn}. Range = ${mx} − ${mn} = ${ans}.`;
    }
    const st = stats(d), set = new Set([ans]);
    shuffle([st.mean, st.med, st.range, st.mod[0], Math.max.apply(null, d), Math.min.apply(null, d)]).forEach(x => {
      if (set.size >= 4 || x == null || !isFinite(x)) return; x = Math.round(x * 10) / 10; if (x >= 0) set.add(x);
    });
    [1, -1, 2, -2, 3, -3, 4].forEach(dl => { if (set.size < 4 && ans + dl >= 0) set.add(ans + dl); });
    return Object.assign({ kind, d, ans, exp, opts: Array.from(set).sort((a, b) => a - b) }, KIND[kind]);
  }
  const gameHTML = (id, mode) => `
<div class="sf-game" id="${id}" data-mode="${mode}">
  <div class="sf-gbar">${mode === 'streak'
    ? '<span>🔥 Beruntun <b data-k="streak">0</b></span><span>🏅 Terbaik <b data-k="best">0</b></span><span>✅ Benar <b data-k="ok">0</b>/<b data-k="n">0</b></span>'
    : '<span>🧾 Soal <b data-k="i">1</b>/5</span><span>⭐ Skor <b data-k="score">0</b></span>'}</div>
  ${mode === 'mission' ? '<div class="sf-dots" data-k="dots" aria-hidden="true"></div>' : ''}
  <div class="sf-qbox" data-k="box"></div>
</div>`;

  function wireGame(root, id) {
    const g = $('#' + id, root); if (!g) return;
    const mode = g.dataset.mode, box = $('[data-k="box"]', g);
    const set = (k, v) => { const e = $('[data-k="' + k + '"]', g); if (e) bump(e, String(v)); };
    let q = null, locked = false, streak = 0, best = 0, ok = 0, n = 0, qs = [], i = 0, score = 0, res = [];
    function dots() {
      const d = $('[data-k="dots"]', g); if (!d) return;
      d.innerHTML = qs.map((_, j) => `<span class="${res[j] === 1 ? 'ok' : res[j] === 0 ? 'bad' : j === i ? 'now' : ''}"></span>`).join('');
    }
    function draw() {
      q = mode === 'streak' ? genQ(pick(Object.keys(KIND))) : qs[i]; locked = false;
      box.innerHTML = `
<span class="sf-kind" style="--kc:${q.color}">${q.emo} ${q.label}</span>
<div class="sf-nums" aria-label="Data: ${q.d.join(', ')}">${q.d.map((v, j) => `<span class="sf-num" style="--j:${j}">${v}</span>`).join('')}</div>
<p class="sf-ask">${q.ask}</p>
<div class="sf-opts">${q.opts.map(v => `<button type="button" class="sf-opt" data-v="${v}">${fmt(v, 1)}</button>`).join('')}</div>
<div class="fx-btnrow"><button type="button" class="fx-btn" data-sf="hint">💡 Petunjuk</button></div>
<p class="fx-note sf-fb" aria-live="polite">Pilih jawabanmu!</p>`;
      if (mode === 'mission') { set('i', i + 1); dots(); }
    }
    function start() {
      streak = 0; ok = 0; n = 0; score = 0; i = 0; res = [];
      if (mode === 'mission') { const ks = Object.keys(KIND); qs = shuffle(ks).concat([pick(ks)]).map(genQ); set('score', 0); }
      else { set('streak', 0); set('ok', 0); set('n', 0); }
      draw();
    }
    function answer(btn) {
      locked = true; const val = +btn.dataset.v, right = val === q.ans, fb = $('.sf-fb', g);
      $$('.sf-opt', g).forEach(o => { o.disabled = true; if (+o.dataset.v === q.ans) o.classList.add('ok'); else if (o !== btn) o.classList.add('dim'); });
      touch(); n++;
      if (right) { ok++; streak++; best = Math.max(best, streak); score++; confettiAt(btn, 34); fb.innerHTML = `🎉 <b>Benar!</b> ${q.exp}`; }
      else { streak = 0; btn.classList.add('bad'); shake(btn); fb.innerHTML = `💡 Belum tepat. ${q.exp}`; }
      if (mode === 'streak') {
        set('streak', streak); set('best', best); set('ok', ok); set('n', n);
        if (right && streak === 3) say('3 beruntun! Kamu mulai jago membaca data 🔥', 4200);
        if (right && streak === 5) { confetti(undefined, undefined, 120); say('5 beruntun! Detektif data sejati 🏆', 5000); }
        if (!right) say(pick(['Tidak apa-apa, lihat pembahasannya ya 📖', 'Hampir! Coba soal berikutnya 💪']), 3600);
        fb.insertAdjacentHTML('afterend', '<div class="fx-btnrow"><button type="button" class="fx-btn big" data-sf="next">Soal berikutnya →</button></div>');
      } else {
        res[i] = right ? 1 : 0; set('score', score); dots();
        fb.insertAdjacentHTML('afterend', `<div class="fx-btnrow"><button type="button" class="fx-btn big" data-sf="next">${i + 1 >= qs.length ? '🏁 Lihat hasil' : 'Soal berikutnya →'}</button></div>`);
      }
    }
    function result() {
      const t = qs.length, pct = score / t, ic = pct >= .8 ? '🏆' : pct >= .5 ? '🌟' : '💪';
      box.innerHTML = `<div class="sf-result"><span class="sf-trophy" aria-hidden="true">${ic}</span><h4>Skor kamu ${score}/${t}</h4>
<p>${pct >= .8 ? 'Luar biasa! Kamu detektif data sejati.' : pct >= .5 ? 'Bagus! Sedikit lagi sempurna.' : 'Tidak apa-apa. Buka lagi materinya, lalu coba misi baru.'}</p>
<button type="button" class="fx-btn big" data-sf="again">🔁 Main lagi</button></div>`;
      if (pct >= .8) { setTimeout(() => confetti(null, null, 140), 200); say('Luar biasa! Kamu jagoan statistika 🏆', 5000); } else say(pct >= .5 ? 'Bagus! Sedikit lagi sempurna 🌟' : 'Ayo coba lagi, aku temani! 💪', 4200);
    }
    g.addEventListener('click', e => {
      const o = e.target.closest('.sf-opt'); if (o && !locked) return answer(o);
      const b = e.target.closest('[data-sf]'); if (!b) return;
      const k = b.dataset.sf;
      if (k === 'hint' && q) { const fb = $('.sf-fb', g); if (!locked) fb.innerHTML = '💡 ' + q.hint; }
      if (k === 'next') { if (mode === 'mission') { i++; if (i >= qs.length) return result(); } draw(); }
      if (k === 'again') start();
    });
    start();
  }

  const SEC_QUICK = gameHTML('sfQuick', 'streak');
  const SEC_MISSION = gameHTML('sfMission', 'mission');

  /* ---------- Catatan lengkap: akordeon, ikon, langkah yang bisa dicentang ---------- */
  const NOTE_TITLES = ['📌 Apa itu statistika data tunggal?', '🧩 Enam istilah penting', '📐 Rumus penting', '🧾 Contoh langkah demi langkah', '🌍 Contoh nyata & poin penting'];
  const NOTE_COLORS = ['#17C3B2', '#7C3AED', '#FF4D8D', '#FF9F1C', '#3B82F6'];
  const NOTE_SAY = ['Nah, ini catatan pentingnya! 📝', 'Baca pelan-pelan ya, aku tunggu 🐢', 'Coba cocokkan dengan papan skor di atas 😉', 'Mantap, rajin banget! 🌟'];
  const CONCEPT_EMO = ['⚖️', '🚏', '🚏', '👑', '📏', '🚀'];
  const CONCEPT_SAY = ['Mean itu titik seimbang. Coba lagi jungkat-jungkitnya di tab Coba! ⚖️', 'Data ganjil? Ambil satu kartu yang paling tengah 🚏', 'Data genap? Rata-ratakan dua kartu tengah 🚏', 'Modus bisa lebih dari satu. Itu namanya bimodal 👑👑', 'Range = terbesar dikurangi terkecil. Cepat, kan? 📏', 'Satu nilai ekstrem bisa menarik mean. Median tetap tenang 😎'];
  function revealEls(els) {
    if (reduce || !('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); return; }
    const io = new IntersectionObserver((l, o) => l.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); o.unobserve(e.target); } }), { threshold: 0.08 });
    els.forEach(e => io.observe(e));
  }
  function polishNotes(adv) {
    const tab = adv.closest('#tab-materi'), lessons = tab && $('.lesson-sections', tab);
    if (!lessons || $('.sf-notes', lessons)) return;
    const kids = Array.from(lessons.children).filter(c => c.classList.contains('content-card'));
    const cards = kids.filter(c => !$('#completeMateriBtn', c)); if (!cards.length) return;
    const host = document.createElement('div'); host.className = 'sf-notes';
    host.innerHTML = '<div class="sf-acc-tools"><p>📚 Ketuk judul untuk membuka catatan</p><button type="button" class="fx-btn" id="sfAccAll">📂 Buka semua</button></div>';
    cards[0].before(host);
    const accs = cards.map((it, i) => {
      if (i === 0 || i === 2) { const h = $('h3', it); if (h && h.parentNode === it) h.remove(); }
      Array.from(it.querySelectorAll('.tip')).forEach(t => { if (!t.textContent.trim() || t.textContent.trim() === 'undefined') t.remove(); });
      const acc = document.createElement('div'); acc.className = 'sf-acc fx-reveal'; acc.style.setProperty('--c', NOTE_COLORS[i % NOTE_COLORS.length]);
      acc.innerHTML = '<button type="button" class="sf-acc-head" aria-expanded="false"><span>' + (NOTE_TITLES[i] || 'Catatan ' + (i + 1)) + '</span><span class="sf-acc-chev" aria-hidden="true">▾</span></button><div class="sf-acc-body"><div class="sf-acc-inner"></div></div>';
      const inner = $('.sf-acc-inner', acc); while (it.firstChild) inner.appendChild(it.firstChild); it.remove(); host.appendChild(acc);
      const head = $('.sf-acc-head', acc);
      head.addEventListener('click', () => {
        const open = acc.classList.toggle('open'); head.setAttribute('aria-expanded', String(open));
        if (open) { touch(); sayCool('acc', pick(NOTE_SAY), 6000, 3200); }
      });
      return acc;
    });
    accs[0].classList.add('open'); $('.sf-acc-head', accs[0]).setAttribute('aria-expanded', 'true');
    const all = $('#sfAccAll', host);
    all.addEventListener('click', () => {
      const anyClosed = accs.some(a => !a.classList.contains('open'));
      accs.forEach(a => { a.classList.toggle('open', anyClosed); $('.sf-acc-head', a).setAttribute('aria-expanded', String(anyClosed)); });
      all.textContent = anyClosed ? '📁 Tutup semua' : '📂 Buka semua';
    });
    /* istilah: ikon, warna, dan komentar maskot */
    $$('.concept-box', host).forEach((b, i) => {
      b.style.setProperty('--bc', NOTE_COLORS[i % NOTE_COLORS.length]); b.setAttribute('tabindex', '0'); b.setAttribute('role', 'button');
      const h = $('h4', b); if (h && CONCEPT_EMO[i]) h.insertAdjacentHTML('afterbegin', '<span class="sf-cemo" aria-hidden="true">' + CONCEPT_EMO[i] + '</span>');
      const go = () => { shake(b); if (CONCEPT_SAY[i]) say(CONCEPT_SAY[i], 4600); touch(); };
      b.addEventListener('click', go); b.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
    });
    /* rumus: ketuk untuk menyorot */
    $$('.formula', host).forEach(f => f.addEventListener('click', () => {
      f.classList.remove('pulse'); void f.offsetWidth; f.classList.add('pulse'); sayCool('fml', 'Tinggal masukkan angkanya ke rumus ini ✨', 4000, 3000); touch();
    }));
    /* langkah contoh: ketuk untuk mencentang */
    const exCard = accs[3] && $('.sf-acc-inner', accs[3]);
    if (exCard) exCard.insertAdjacentHTML('afterbegin', '<p class="sf-hint">👆 Ketuk tiap langkah untuk mencentangnya. Selesaikan satu contoh untuk kejutan!</p>');
    $$('.step-list', host).forEach(ol => {
      const lis = $$('li', ol);
      lis.forEach(li => {
        li.setAttribute('tabindex', '0'); li.setAttribute('role', 'checkbox'); li.setAttribute('aria-checked', 'false');
        const tg = () => {
          const on = li.classList.toggle('done'); li.setAttribute('aria-checked', String(on)); touch();
          if (on && lis.every(x => x.classList.contains('done'))) { confettiAt(ol, 46); say(pick(['Contoh selesai! Kamu paham alurnya 🎉', 'Mantap, semua langkah beres ✅', 'Keren! Coba contoh berikutnya 🚀']), 4200); }
        };
        li.addEventListener('click', tg); li.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tg(); } });
      });
    });
    revealEls(accs.concat(kids.filter(c => $('#completeMateriBtn', c))).map(e => { e.classList.add('fx-reveal'); return e; }));
  }

  /* ---------- Penanda: apakah modul yang sedang dibuka adalah Statistika ---------- */
  let inStat = false;
  (function () {
    const prev = window.openModule;
    if (typeof prev === 'function') window.openModule = function (id) { inStat = id === 'statistik'; return prev.apply(this, arguments); };
  })();

  /* ---------- Simulasi bawaan "Data Pertandingan": grafik batang langsung ---------- */
  function polishSim(root) {
    const tab = root.closest('#tab-coba') || $('#tab-coba'), res = tab && $('#statResult', tab);
    const card = res && res.closest('.content-card'); if (!card || card.classList.contains('sf-sim')) return;
    const sel = $('#statCount', card); if (!sel) return;
    card.classList.add('sf-sim');
    const lead = $('p', card);
    (lead || $('h3', card)).insertAdjacentHTML('afterend', '<div class="fx-btnrow sf-simbtns"><button type="button" class="fx-btn" data-sim="rand">🎲 Acak skor</button><button type="button" class="fx-btn" data-sim="out">🚀 Tambah outlier</button><button type="button" class="fx-btn" data-sim="eq">⚖️ Samakan semua</button></div>');
    res.insertAdjacentHTML('beforebegin', '<div class="sf-simchart" id="sfSimChart" role="img" aria-label="Diagram batang skor"></div><div class="fx-vals sf-simvals"><div class="fx-val" style="--vc:#FF4D8D"><small>MEAN</small><b id="sfSMean">-</b></div><div class="fx-val" style="--vc:#7C3AED"><small>MEDIAN</small><b id="sfSMed">-</b></div><div class="fx-val" style="--vc:#E5B93A"><small>MODUS 👑</small><b id="sfSMod">-</b></div><div class="fx-val" style="--vc:#17C3B2"><small>RANGE</small><b id="sfSRange">-</b></div></div>');
    const chart = $('#sfSimChart', card);
    const group = () => $$(+sel.value === 5 ? '.scoreRange.g5' : '.scoreRange.g6', card);
    function draw() {
      const ins = group(), vals = ins.map(i => +i.value), st = stats(vals), top = 20;
      if (chart.dataset.n !== String(vals.length)) {
        chart.dataset.n = String(vals.length);
        chart.innerHTML = '<div class="sf-splot">' + vals.map((_, i) => '<div class="sf-scol"><div class="sf-sbar"><b>0</b></div><span class="sf-sx">' + (i + 1) + '</span></div>').join('') + '<i class="sf-sline mean"><em>mean</em></i><i class="sf-sline med"><em>median</em></i></div>';
      }
      $$('.sf-scol', chart).forEach((c, i) => {
        c.style.setProperty('--h', (vals[i] / top * 100).toFixed(1) + '%');
        c.classList.toggle('hot', st.mod.includes(vals[i]));
        bump($('b', c), String(vals[i]));
      });
      $('.sf-sline.mean', chart).style.bottom = (st.mean / top * 100).toFixed(1) + '%';
      $('.sf-sline.med', chart).style.bottom = (st.med / top * 100).toFixed(1) + '%';
      bump($('#sfSMean', card), fmt(st.mean, 1)); bump($('#sfSMed', card), fmt(st.med, 1));
      bump($('#sfSMod', card), st.mod.length ? st.mod.join(', ') : 'tidak ada'); bump($('#sfSRange', card), String(st.range));
    }
    card.addEventListener('input', () => { draw(); touch(); });
    card.addEventListener('change', () => { draw(); touch(); });
    $$('[data-sim]', card).forEach(b => b.addEventListener('click', () => {
      const ins = group(), k = b.dataset.sim, base = ri(6, 14);
      const idx = ri(0, ins.length - 1);
      ins.forEach((inp, i) => {
        inp.value = k === 'rand' ? ri(2, 18) : k === 'eq' ? base : (i === idx ? 20 : ri(5, 10));
        inp.dispatchEvent(new w2.Event('input', { bubbles: true }));
      });
      if (k === 'out') say('Lihat garis mean naik, tapi median tetap tenang 😎', 4200);
      if (k === 'eq') say('Semua sama? Mean, median, dan modus jadi kembar! 👯', 4200);
    }));
    draw();
  }
  const w2 = window;

  /* ---------- Tab Latihan: banner pembuka yang tetap ada di setiap soal ---------- */
  function polishLatihan() {
    const el = $('#tab-latihan'); if (!el || el.dataset.sfBound) return; el.dataset.sfBound = '1';
    const n = (window.quizBanks && window.quizBanks.statistik && window.quizBanks.statistik.length) || 6;
    const html = '<div class="sf-lat"><div class="sf-lat-head"><span class="sf-lat-emo" aria-hidden="true">📝</span><div><b>Latihan Statistika</b><small>' + n + ' soal · mean, median, modus, range</small></div></div>'
      + '<div class="sf-lat-chips"><span style="--k:#17C3B2">⚖️ Mean = Σx ÷ n</span><span style="--k:#7C3AED">🚏 Median: urutkan dulu</span><span style="--k:#E5B93A">👑 Modus: paling sering</span><span style="--k:#E0306F">📏 Range = maks − min</span></div>'
      + '<p class="sf-lat-tip">💡 Bocoran: tulis datanya, urutkan, baru hitung. Salah itu bagian dari belajar!</p></div>';
    const put = () => { if (inStat && !$('.sf-lat', el)) el.insertAdjacentHTML('afterbegin', html); };
    new MutationObserver(put).observe(el, { childList: true });
    put();
  }

  function wireMateriAll(root) { wireBars(root); wireMedian(root); wireVote(root); polishNotes(root); }
  function wireCobaAll(root) { wireSee(root); wireGame(root, 'sfQuick'); wireGame(root, 'sfMission'); polishSim(root); polishLatihan(); }

  F.install({
    id: 'statistik', emoji: '📊', mascot: { color: A, sym: 'Σ' },
    phrases: ['Statistika itu bukan hitungan membosankan, tapi detektif data! 🔍', 'Dari skor bola sampai nilai rapor, semuanya pakai mean, median, modus 🚀', 'Seret batangnya dan lihat angkanya berubah. Aku temani! 📊'],
    facts: ['Median tidak terpengaruh nilai ekstrem, makanya dipakai untuk data gaji 💰', 'Modus bisa lebih dari satu. Datanya disebut bimodal kalau ada dua 👑👑', 'Mean itu titik seimbang data, seperti jungkat-jungkit ⚖️', 'Range yang besar artinya data menyebar jauh 📏', 'Data genap? Median-nya rata-rata dua angka tengah 🚏', 'Kalau dua pilihan sama banyak, modusnya ada dua (bimodal) 👑👑'],
    greet: 'Halo! Aku Stat 👋 Yuk seret batang skornya!',
    tabMsg: { materi: 'Seret batangnya, lihat mean dan median bergerak 📊', coba: 'Waktunya main jungkat-jungkit! ⚖️', latihan: 'Semangat! Kamu pasti bisa 💪' },
    materi, wireMateri: wireMateriAll, coba, wireCoba: wireCobaAll
  });
})();