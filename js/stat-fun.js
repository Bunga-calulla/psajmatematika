/* STAT FUN — lapisan animasi & interaktif untuk modul Statistik */
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
    return F.hero({ color: A, sym: 'Σ', floats: ['x̄', 'Σ', 'n', 'Me', 'Mo', 'R', '70', '85'], badge: '📊 PETUALANGAN STATISTIK', title: 'Halo, aku <span>Stat</span> 👋<br>Yuk bongkar data pertandingan!', chips: [['fxS1', '📊 Papan skor'], ['fxS2', '🃏 Kartu ukuran']] })
      + F.sec(1, 'fxS1', 'Papan skor yang bisa diseret', '📊', 'Tarik batang naik-turun. Garis <b style="color:#E0306F">mean</b>, garis <b style="color:#6D28D9">median</b>, dan mahkota 👑 <b>modus</b> ikut bergerak. Coba tekan 🚀!', s1, A, B)
      + F.sec(2, 'fxS2', 'Empat kartu ukuran data', '🃏', 'Ketuk kartu untuk membaliknya dan lihat rumus serta contohnya.', s2, B, '#FF4D8D');
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
  function coba() {
    return F.sec(1, 'fxS3', 'Jungkat-jungkit titik seimbang', '⚖️', 'Setiap bulat adalah satu data. Geser titik tumpu sampai jungkat-jungkitnya <b>seimbang</b>. Di titik itulah <b>mean</b> berada!', `
<div class="fx-stage"><svg id="fxSee" viewBox="0 0 420 200" role="img" aria-label="Jungkat-jungkit dengan data di garis bilangan">
  <g class="fx-beam" id="fxBeam"></g><polygon id="fxFul" fill="#17C3B2" stroke="#241B3A" stroke-width="4" stroke-linejoin="round"/></svg></div>
<div class="fx-ctrl"><label for="fxFulcrum">Titik tumpu <output id="fxFulOut">3</output></label><input id="fxFulcrum" type="range" min="0" max="16" step="0.1" value="3"></div>
<div class="fx-btnrow"><button type="button" class="fx-btn big" id="fxSeeNew">🎲 Data baru</button></div>
<p class="fx-note" id="fxSeeMsg"></p>`, A, B);
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

  F.install({
    id: 'statistik', emoji: '📊', mascot: { color: A, sym: 'Σ' },
    phrases: ['Statistika itu bukan hitungan membosankan, tapi detektif data! 🔍', 'Dari skor bola sampai nilai rapor, semuanya pakai mean, median, modus 🚀', 'Seret batangnya dan lihat angkanya berubah. Aku temani! 📊'],
    facts: ['Median tidak terpengaruh nilai ekstrem, makanya dipakai untuk data gaji 💰', 'Modus bisa lebih dari satu. Datanya disebut bimodal kalau ada dua 👑👑', 'Mean itu titik seimbang data, seperti jungkat-jungkit ⚖️', 'Range yang besar artinya data menyebar jauh 📏'],
    greet: 'Halo! Aku Stat 👋 Yuk seret batang skornya!',
    tabMsg: { materi: 'Seret batangnya, lihat mean dan median bergerak 📊', coba: 'Waktunya main jungkat-jungkit! ⚖️', latihan: 'Semangat! Kamu pasti bisa 💪' },
    materi, wireMateri: wireBars, coba, wireCoba: wireSee
  });
})();
