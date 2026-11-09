/* GEO FUN — lapisan animasi & interaktif untuk modul Geometri */
(function () {
  'use strict';
  const F = window.FunCore; if (!F) return;
  const { $, $$, fmt, ri, say, confettiAt, touch, bump, shake, reduce } = F;
  const V = '#7C3AED', P = '#FF4D8D';

  function materi() {
    const s1 = `
<div class="fx-two"><div class="fx-stage"><svg id="fxRect" viewBox="0 0 420 260" role="img" aria-label="Persegi panjang yang bisa diubah ukurannya"><g id="fxRectG"></g></svg></div>
<div>
  <div class="fx-btnrow" style="margin-top:0"><button type="button" class="fx-btn on" data-gm="luas">🟪 Luas</button><button type="button" class="fx-btn" data-gm="keliling">🐜 Keliling</button></div>
  <div class="fx-ctrl"><label for="fxP">Panjang <output id="fxPo">6 m</output></label><input id="fxP" type="range" min="1" max="10" value="6"></div>
  <div class="fx-ctrl"><label for="fxL">Lebar <output id="fxLo">4 m</output></label><input id="fxL" type="range" min="1" max="7" value="4"></div>
  <p class="fx-note" id="fxRectInfo"></p>
</div></div>`;
    const s2 = `
<div class="fx-stage"><svg id="fxWheel" viewBox="0 0 420 200" role="img" aria-label="Roda menggelinding satu putaran"><g id="fxWheelG"></g></svg></div>
<div class="fx-two" style="margin-top:12px"><div class="fx-ctrl"><label for="fxR">Jari-jari r <output id="fxRo">5 cm</output></label><input id="fxR" type="range" min="1" max="8" value="5"></div>
<div class="fx-btnrow" style="margin:0"><button type="button" class="fx-btn big" id="fxRollBtn">▶ Gelindingkan 1 putaran!</button></div></div>
<p class="fx-note" id="fxWheelInfo"></p>`;
    return F.hero({ color: V, sym: '📐', floats: ['△', '□', '○', 'πr²', 'p×l', 'm²', 'V', '∠'], badge: '📐 PETUALANGAN GEOMETRI', title: 'Halo, aku <span>Geo</span> 👋<br>Yuk desain ruangan impianmu!', chips: [['fxG1', '🟪 Luas & keliling'], ['fxG2', '🛞 Lingkaran']] })
      + F.sec(1, 'fxG1', 'Isi petak, jalani tepinya', '🟪', 'Ubah ukuran lalu pilih <b>Luas</b> (petak yang terisi) atau <b>Keliling</b> (jalan di tepinya, ikuti si semut 🐜).', s1, V, P)
      + F.sec(2, 'fxG2', 'Roda menggelinding = keliling lingkaran', '🛞', 'Satu putaran penuh roda menempuh jarak sepanjang <b>keliling</b>-nya. Ubah r lalu gelindingkan!', s2, P, '#FF9F1C');
  }

  function wireRect(root) {
    const g = $('#fxRectG', root); if (!g) return;
    const sp = $('#fxP', root), sl = $('#fxL', root), info = $('#fxRectInfo', root); let mode = 'luas';
    function draw() {
      const p = +sp.value, l = +sl.value, cs = Math.min(360 / p, 190 / l, 44), w = p * cs, h = l * cs, x0 = (420 - w) / 2, y0 = (260 - h) / 2 + 6;
      $('#fxPo', root).textContent = p + ' m'; $('#fxLo', root).textContent = l + ' m';
      let s = '';
      if (mode === 'luas') { for (let r = 0, i = 0; r < l; r++) for (let c = 0; c < p; c++, i++) s += `<rect class="fx-cell" style="animation-delay:${Math.min(i * 14, 800)}ms" x="${x0 + c * cs}" y="${y0 + r * cs}" width="${cs}" height="${cs}" rx="4"/>`; }
      else {
        s += `<rect class="fx-peri" x="${x0}" y="${y0}" width="${w}" height="${h}" rx="6"/>`;
        if (!reduce) s += `<text font-size="22" text-anchor="middle" dominant-baseline="middle">🐜<animateMotion dur="${Math.max(3, (w + h) / 60)}s" repeatCount="indefinite" path="M${x0} ${y0} h${w} v${h} h${-w} z"/></text>`;
      }
      s += `<text class="fx-dim" x="${x0 + w / 2}" y="${y0 - 8}" text-anchor="middle">${p} m</text><text class="fx-dim" x="${x0 - 8}" y="${y0 + h / 2}" text-anchor="end" dominant-baseline="middle">${l} m</text>`;
      g.innerHTML = s;
      info.innerHTML = mode === 'luas' ? `Luas = p × l = ${p} × ${l} = <b>${p * l} m²</b><br>Artinya ada ${p * l} petak ubin 1 m² 🟪` : `Keliling = 2 × (p + l) = 2 × (${p} + ${l}) = <b>${2 * (p + l)} m</b><br>Itu panjang jalan di tepinya 🐜`;
      info.classList.remove('bump'); void info.offsetWidth; info.classList.add('bump');
    }
    sp.addEventListener('input', () => { draw(); touch(); }); sl.addEventListener('input', () => { draw(); touch(); });
    $$('[data-gm]', root).forEach(b => b.addEventListener('click', () => { mode = b.dataset.gm; $$('[data-gm]', root).forEach(x => x.classList.toggle('on', x === b)); draw(); touch(); }));
    draw();
  }

  function wireWheel(root) {
    const g = $('#fxWheelG', root); if (!g) return;
    const sr = $('#fxR', root), btn = $('#fxRollBtn', root), info = $('#fxWheelInfo', root); let busy = false;
    function frame(t) {
      const r = +sr.value, R = r * 5.5, D = 2 * Math.PI * R, x0 = 30 + R, cx = x0 + D * t, cy = 172 - R;
      g.innerHTML = `<line class="fx-road" x1="10" y1="172" x2="410" y2="172"/><line class="fx-trail" x1="${x0}" y1="176" x2="${cx}" y2="176"/>
        <text x="${x0}" y="196" font-size="16" text-anchor="middle">🚩</text><text x="${x0 + D}" y="196" font-size="16" text-anchor="middle">🏁</text>
        <g transform="translate(${cx} ${cy}) rotate(${360 * t})"><circle r="${R}" fill="#fff" stroke="#241B3A" stroke-width="5"/><line x1="${-R}" y1="0" x2="${R}" y2="0" stroke="#C9BFE0" stroke-width="3"/><line x1="0" y1="${-R}" x2="0" y2="${R}" stroke="#C9BFE0" stroke-width="3"/><circle cx="${R}" cy="0" r="6" fill="#FF4D8D" stroke="#241B3A" stroke-width="3"/></g>`;
    }
    function text(done) {
      const r = +sr.value; $('#fxRo', root).textContent = r + ' cm';
      info.innerHTML = `Keliling = 2 × π × r = 2 × 3,14 × ${r} = <b>${fmt(2 * 3.14 * r, 2)} cm</b> · Luas = π × r² = 3,14 × ${r}² = <b>${fmt(3.14 * r * r, 2)} cm²</b>` + (done ? '<br>✨ Garis merah sepanjang lintasan = keliling lingkaran!' : '');
    }
    function roll() {
      if (busy) return; busy = true; touch();
      if (reduce) { frame(1); text(true); busy = false; return; }
      const t0 = performance.now();
      (function f(now) { const k = Math.min(1, (now - t0) / 2600), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; frame(e); if (k < 1) requestAnimationFrame(f); else { busy = false; text(true); say('Satu putaran = satu keliling! 🛞', 3600); } })(t0);
    }
    sr.addEventListener('input', () => { if (busy) return; frame(0); text(false); });
    btn.addEventListener('click', roll); frame(0); text(false);
  }

  /* ---------- Lab: studio keramik ---------- */
  const PRICE = { 30: 60000, 40: 85000, 60: 150000 };
  function coba() {
    return F.sec(1, 'fxG3', 'Studio keramik kamar', '🏠', 'Atur ukuran kamar dan ukuran keramik. Lihat jumlah keramik, dus, dan biayanya berubah langsung.', `
<div class="fx-two"><div class="fx-stage"><svg id="fxRoom" viewBox="0 0 420 250" role="img" aria-label="Denah lantai kamar berkeramik"></svg></div>
<div>
  <div class="fx-ctrl"><label for="fxRp">Panjang kamar <output id="fxRpo">5 m</output></label><input id="fxRp" type="range" min="3" max="12" value="5"></div>
  <div class="fx-ctrl"><label for="fxRl">Lebar kamar <output id="fxRlo">4 m</output></label><input id="fxRl" type="range" min="3" max="10" value="4"></div>
  <div class="fx-ctrl"><label for="fxTile">Ukuran keramik <select id="fxTile"><option value="30">30 × 30 cm</option><option value="40" selected>40 × 40 cm</option><option value="60">60 × 60 cm</option></select></label></div>
</div></div>
<div class="fx-vals"><div class="fx-val" style="--vc:#7C3AED"><small>LUAS</small><b id="fxRA">-</b></div><div class="fx-val" style="--vc:#FF4D8D"><small>KERAMIK</small><b id="fxRT">-</b></div><div class="fx-val" style="--vc:#FF9F1C"><small>DUS</small><b id="fxRD">-</b></div><div class="fx-val" style="--vc:#17C3B2"><small>BIAYA</small><b id="fxRC">-</b></div></div>
<p class="fx-note">Asumsi: 1 dus = 10 keramik, ditambah cadangan 10% untuk potongan. Harga per dus Rp60.000 / Rp85.000 / Rp150.000 (30 / 40 / 60 cm).</p>
<div class="fx-note" style="margin-top:14px;border-left-color:#FF9F1C"><span id="fxGoal"></span>
  <div class="fx-btnrow" style="margin-bottom:0"><button type="button" class="fx-btn big" id="fxGoalBtn">✅ Cek luas</button><button type="button" class="fx-btn" id="fxGoalNew">🎯 Tantangan baru</button></div></div>`, V, '#FF9F1C');
  }

  function wireRoom(root) {
    const svg = $('#fxRoom', root); if (!svg) return;
    const sp = $('#fxRp', root), sl = $('#fxRl', root), st = $('#fxTile', root); let goal = 0;
    const money = n => 'Rp' + n.toLocaleString('id-ID');
    function draw() {
      const p = +sp.value, l = +sl.value, s = +st.value, k = Math.min(360 / p, 190 / l), w = p * k, h = l * k, x0 = (420 - w) / 2, y0 = (250 - h) / 2 + 8, t = s / 100 * k;
      $('#fxRpo', root).textContent = p + ' m'; $('#fxRlo', root).textContent = l + ' m';
      svg.innerHTML = `<defs><pattern id="fxTilePat" width="${t * 2}" height="${t * 2}" patternUnits="userSpaceOnUse" x="${x0}" y="${y0}"><rect width="${t * 2}" height="${t * 2}" fill="#EDE3FF"/><rect width="${t}" height="${t}" fill="#D8C7FF"/><rect x="${t}" y="${t}" width="${t}" height="${t}" fill="#D8C7FF"/></pattern></defs>
        <rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="url(#fxTilePat)" stroke="#241B3A" stroke-width="5" rx="4"/>
        <text class="fx-dim" x="${x0 + w / 2}" y="${y0 - 8}" text-anchor="middle">${p} m</text><text class="fx-dim" x="${x0 - 8}" y="${y0 + h / 2}" text-anchor="end" dominant-baseline="middle">${l} m</text>`;
      const area = p * l, tiles = Math.ceil(area / Math.pow(s / 100, 2) * 1.1), dus = Math.ceil(tiles / 10);
      bump($('#fxRA', root), area + ' m²'); bump($('#fxRT', root), tiles + ' pcs'); bump($('#fxRD', root), dus + ' dus'); bump($('#fxRC', root), money(dus * PRICE[s]));
    }
    function newGoal() { goal = [12, 15, 18, 20, 24, 30, 35, 42][ri(0, 7)]; $('#fxGoal', root).innerHTML = `🎯 <b>Tantangan:</b> atur panjang × lebar kamar sampai luasnya tepat <b>${goal} m²</b>.`; }
    [sp, sl, st].forEach(e => e.addEventListener('input', () => { draw(); touch(); }));
    $('#fxGoalBtn', root).addEventListener('click', e => {
      const a = +sp.value * +sl.value;
      if (a === goal) { confettiAt(e.currentTarget, 80); say(`Tepat! ${sp.value} × ${sl.value} = ${goal} m² 🎉`, 3800); newGoal(); }
      else { shake(e.currentTarget); say(`Luasmu sekarang ${a} m². ${a < goal ? 'Kurang' : 'Kelebihan'} ${Math.abs(goal - a)} m². Coba lagi! 💡`, 3600); }
    });
    $('#fxGoalNew', root).addEventListener('click', newGoal);
    newGoal(); draw();
  }

  F.install({
    id: 'geometri', emoji: '📐', mascot: { color: V, sym: '△' },
    phrases: ['Geometri itu bukan cuma gambar, tapi cara merancang dunia! 🏗️', 'Dari kamar tidur sampai roda sepeda, semua pakai luas dan keliling 🚲', 'Geser slider-nya dan lihat bentuknya berubah. Aku temani! 📐'],
    facts: ['Volume itu ruang yang bisa diisi. Luas permukaan itu bungkusnya.', 'Kerucut dan limas selalu punya faktor ⅓ pada volumenya.', 'Cek satuan dulu: 1 liter = 1.000 cm³.', 'Gambar bangunnya dan tulis ukuran di dekat sisinya.', 'Kalau dibuka, selimut tabung berbentuk persegi panjang!', 'Luas diukur dalam satuan persegi (m²), keliling dalam satuan panjang (m) 📏', 'Nilai π ≈ 3,14 adalah perbandingan keliling lingkaran dengan diameternya ⭕', 'Pizza ukuran dua kali lebih lebar punya luas empat kali lipat 🍕', 'Tukang keramik selalu menambah cadangan sekitar 10% 🧱'],
    greet: 'Halo! Aku Geo 👋 Yuk main petak dan roda!',
    tabMsg: { materi: 'Isi petaknya dan ikuti si semut 🐜', coba: 'Waktunya jadi arsitek kamar! 🏠', latihan: 'Semangat! Kamu pasti bisa 💪' },
    materi, wireMateri: r => { wireRect(r); wireWheel(r); }, coba, wireCoba: wireRoom
  });
})();
