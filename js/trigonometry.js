/*
  INTERAKSI TRIGONOMETRI
  Simulasi: Gedung, Tangga, Jalan, Eksplorasi Sudut, Grafik, dan Misi.
*/

// Save referensi fungsi simulator sebelumnya agar tidak tertimpa (Chaining)
window._prevTrigGetModuleSimulator = window.getModuleSimulator;
window._prevTrigBindSimulator = window.bindSimulator;

window.getModuleSimulator = function(id) {
  // 1. Jalankan simulator trigonometri jika id cocok
  if (id === 'trigonometri') {
    return `
    <div class="trig-interactive">
      <div class="content-card trig-hero-card">
        <div class="eyebrow">🔎 EKSPERIMEN TRIGONOMETRI</div>
        <h3>Trigonometri di Dunia Nyata</h3>
        <p>Jangan cuma menghafal rumus. Ubah angka, geser sudut, lalu lihat bagaimana hasilnya berubah.</p>
        <div class="trig-chip-row">
          <span>📐 Sin Cos Tan</span><span>🏙️ Sudut Elevasi</span><span>📈 Grafik</span><span>🎯 Misi</span>
        </div>
      </div>

      <div class="content-card">
        <h3>🏙️ 1. Mengukur Tinggi Gedung</h3>
        <p>Kamu berdiri beberapa meter dari sebuah gedung. Gunakan <b>tangen</b> untuk memperkirakan tinggi gedung.</p>
        <div class="trig-sim-grid">
          <div>
            <div class="control"><label>Jarak dari gedung <output id="trigBuildingDistOut">20 m</output></label><input id="trigBuildingDist" type="range" min="5" max="50" value="20"></div>
            <div class="control"><label>Sudut elevasi <output id="trigBuildingAngleOut">40°</output></label><input id="trigBuildingAngle" type="range" min="5" max="80" value="40"></div>
            <div class="control"><label>Tinggi mata <output id="trigEyeOut">1,5 m</output></label><input id="trigEye" type="range" min="0" max="3" step="0.1" value="1.5"></div>
            <div class="trig-result" id="trigBuildingResult"></div>
          </div>
          <div class="trig-visual building-scene">
            <div class="trig-building" id="trigBuildingVisual"><span></span><span></span><span></span><b>🏢</b></div>
            <div class="trig-ground"></div>
            <div class="trig-person">🧍</div>
            <div class="trig-sightline" id="trigSightline"></div>
          </div>
        </div>
      </div>

      <div class="content-card">
        <h3>🪜 2. Tangga dan Dinding</h3>
        <p>Geser panjang tangga dan sudutnya. Perhatikan bagaimana <b>sin</b> dan <b>cos</b> menentukan tinggi serta jarak.</p>
        <div class="trig-sim-grid">
          <div>
            <div class="control"><label>Panjang tangga <output id="trigLadderLenOut">6 m</output></label><input id="trigLadderLen" type="range" min="2" max="10" step="0.5" value="6"></div>
            <div class="control"><label>Sudut tangga <output id="trigLadderAngleOut">60°</output></label><input id="trigLadderAngle" type="range" min="10" max="85" value="60"></div>
            <div class="trig-stat-row"><div><small>Tinggi</small><b id="trigLadderHeight">5,20 m</b></div><div><small>Jarak</small><b id="trigLadderBase">3,00 m</b></div></div>
            <div class="trig-formula-note" id="trigLadderFormula"></div>
          </div>
          <div class="trig-visual ladder-scene">
            <div class="trig-wall"></div><div class="trig-floor"></div><div class="trig-ladder" id="trigLadderVisual"></div><div class="trig-angle-label" id="trigLadderAngleVisual">60°</div>
          </div>
        </div>
      </div>

      <div class="content-card">
        <h3>🛣️ 3. Kemiringan Jalan</h3>
        <p>Dalam konstruksi, kemiringan dapat dipahami dari kenaikan vertikal dan jarak horizontal. Cari sudut kemiringannya.</p>
        <div class="trig-sim-grid">
          <div>
            <div class="control"><label>Kenaikan jalan <output id="trigRoadRiseOut">8 m</output></label><input id="trigRoadRise" type="range" min="1" max="30" value="8"></div>
            <div class="control"><label>Jarak horizontal <output id="trigRoadRunOut">100 m</output></label><input id="trigRoadRun" type="range" min="10" max="200" value="100"></div>
            <div class="trig-result" id="trigRoadResult"></div>
          </div>
          <div class="trig-visual road-scene"><div class="trig-road-slope" id="trigRoadVisual"></div><span class="road-rise-label" id="trigRoadRiseLabel">8 m</span><span class="road-run-label" id="trigRoadRunLabel">100 m</span></div>
        </div>
      </div>

      <div class="content-card">
        <h3>📐 4. Eksplorasi Sudut: Sin, Cos, Tan</h3>
        <p>Geser sudut dari 5° sampai 85°. Nilai ketiga fungsi berubah secara langsung.</p>
        <div class="control"><label>Sudut θ <output id="trigAngleExploreOut">35°</output></label><input id="trigAngleExplore" type="range" min="5" max="85" value="35"></div>
        <div class="trig-values">
          <div><span>sin θ</span><b id="trigSinValue">0,574</b></div>
          <div><span>cos θ</span><b id="trigCosValue">0,819</b></div>
          <div><span>tan θ</span><b id="trigTanValue">0,700</b></div>
        </div>
        <div class="trig-triangle-wrap"><div class="trig-right-triangle" id="trigExploreTriangle"><span class="trig-theta">θ</span></div><div id="trigExploreExplanation" class="trig-formula-note"></div></div>
      </div>

      <div class="content-card">
        <h3>📈 5. Eksplorasi Grafik</h3>
        <p>Lihat bentuk fungsi trigonometri dan bagaimana periode serta nilai fungsi berubah.</p>
        <div class="trig-graph-controls">
          <button type="button" class="trig-choice active" data-trig-graph="sin">sin x</button>
          <button type="button" class="trig-choice" data-trig-graph="cos">cos x</button>
          <button type="button" class="trig-choice" data-trig-graph="tan">tan x</button>
        </div>
        <div class="trig-canvas-wrap"><canvas id="trigGraphCanvas" width="900" height="330"></canvas></div>
        <div class="trig-graph-info" id="trigGraphInfo"></div>
      </div>

      <div class="content-card">
        <h3>🧩 6. Latihan Identitas</h3>
        <p>Pilih jawaban yang benar untuk mengingat identitas dasar trigonometri.</p>
        <div class="trig-quiz-box">
          <div class="trig-question" id="trigIdentityQuestion">sin² θ + cos² θ = ?</div>
          <div class="trig-options" id="trigIdentityOptions">
            <button type="button" data-answer="1">1</button><button type="button" data-answer="0">0</button><button type="button" data-answer="tan">tan θ</button><button type="button" data-answer="2">2</button>
          </div>
          <div id="trigIdentityFeedback" class="trig-feedback"></div>
        </div>
      </div>

      <div class="content-card">
        <h3>⭐ 7. Sudut Istimewa</h3>
        <p>Klik salah satu sudut untuk melihat nilai sin, cos, dan tan.</p>
        <div class="trig-special-buttons"><button type="button" data-special-angle="30">30°</button><button type="button" data-special-angle="45">45°</button><button type="button" data-special-angle="60">60°</button></div>
        <div id="trigSpecialResult" class="trig-special-result">Pilih sudut di atas.</div>
      </div>

      <div class="content-card">
        <h3>🧮 8. Persamaan Trigonometri</h3>
        <p>Masukkan nilai k untuk persamaan <b>sin x = k</b> pada interval 0° sampai 360°.</p>
        <div class="trig-equation-row"><label>k <input id="trigEqK" type="number" min="-1" max="1" step="0.1" value="0.5"></label><button type="button" id="trigSolveBtn" class="gradient-btn">Cari Solusi</button></div>
        <div id="trigEquationResult" class="trig-result"></div>
      </div>

      <div class="content-card trig-mission-card">
        <div class="eyebrow">🎯 MISSION</div>
        <h3>9. Misi Trigonometri — Pecahkan Kasus Nyata</h3>
        <p>Gunakan konsep yang sudah kamu pelajari. Setiap misi mempunyai situasi yang berbeda.</p>
        <div class="trig-mission" id="trigMissionBox"></div>
        <div class="trig-mission-progress" id="trigMissionProgress">Misi 1 dari 5</div>
        <div class="trig-mission-actions"><button type="button" id="trigMissionCheck" class="gradient-btn">Cek Jawaban</button><button type="button" id="trigMissionNext" class="guest-btn" disabled>Misi Berikutnya →</button></div>
        <div id="trigMissionFeedback" class="trig-feedback"></div>
      </div>

      <div class="content-card">
        <h3>📚 Peta Materi yang Sudah Dicoba</h3>
        <div class="trig-topic-map">
          <span>✓ Sin</span><span>✓ Cos</span><span>✓ Tan</span><span>✓ Sudut istimewa</span><span>✓ Sudut elevasi</span><span>✓ Invers</span><span>✓ Grafik</span><span>✓ Identitas</span><span>✓ Persamaan</span><span>✓ Aplikasi nyata</span>
        </div>
        <p class="muted">Semakin banyak aktivitas yang kamu coba, semakin kuat pemahaman hubungan antara rumus dan situasi nyata.</p>
      </div>
    </div>`;
  }

  // 2. Jika bukan trigonometri, lempar ke fungsi simulator sebelumnya (misal persentase.js)
  if (typeof window._prevTrigGetModuleSimulator === 'function') {
    return window._prevTrigGetModuleSimulator(id);
  }

  return window._moduleSimulatorFallback ? window._moduleSimulatorFallback(id) : '';
};

window.bindSimulator = function(id) {
  if (id === 'trigonometri') {
    const $ = elId => document.getElementById(elId);
    const fmt = n => Number(n).toFixed(2).replace('.', ',');
    const fmt3 = n => Number(n).toFixed(3).replace('.', ',');
    const rad = deg => deg * Math.PI / 180;
    const mark = () => { if (window.Progress && typeof Progress.setCoba === 'function') Progress.setCoba(id); };

    // 1. Gedung
    const bDist = $('trigBuildingDist'), bAngle = $('trigBuildingAngle'), eye = $('trigEye');
    function calcBuilding() {
      if (!bDist || !bAngle || !eye) return;
      const d = +bDist.value, a = +bAngle.value, e = +eye.value, h = d * Math.tan(rad(a)), total = h + e;
      if ($('trigBuildingDistOut')) $('trigBuildingDistOut').textContent = d + ' m';
      if ($('trigBuildingAngleOut')) $('trigBuildingAngleOut').textContent = a + '°';
      if ($('trigEyeOut')) $('trigEyeOut').textContent = fmt(e) + ' m';
      if ($('trigBuildingResult')) $('trigBuildingResult').innerHTML = `<b>Tinggi bagian yang diukur:</b> ${fmt(h)} m<br><b>Tinggi gedung:</b> ${fmt(total)} m<br><small>Rumus: tan(${a}°) = tinggi ÷ ${d}</small>`;
      if ($('trigBuildingVisual')) $('trigBuildingVisual').style.height = Math.min(245, 70 + h * 6) + 'px';
      if ($('trigSightline')) $('trigSightline').style.transform = `rotate(${-Math.min(55, a)}deg)`;
    }
    if (bDist && bAngle && eye) {
      bDist.oninput = bAngle.oninput = eye.oninput = () => { calcBuilding(); mark(); };
      calcBuilding();
    }

    // 2. Tangga
    const ll = $('trigLadderLen'), la = $('trigLadderAngle');
    function calcLadder() {
      if (!ll || !la) return;
      const l = +ll.value, a = +la.value, h = l * Math.sin(rad(a)), base = l * Math.cos(rad(a));
      if ($('trigLadderLenOut')) $('trigLadderLenOut').textContent = l + ' m';
      if ($('trigLadderAngleOut')) $('trigLadderAngleOut').textContent = a + '°';
      if ($('trigLadderHeight')) $('trigLadderHeight').textContent = fmt(h) + ' m';
      if ($('trigLadderBase')) $('trigLadderBase').textContent = fmt(base) + ' m';
      if ($('trigLadderFormula')) $('trigLadderFormula').innerHTML = `<b>sin ${a}° = tinggi / ${l}</b> → tinggi = ${fmt(h)} m<br><b>cos ${a}° = jarak / ${l}</b> → jarak = ${fmt(base)} m`;
      if ($('trigLadderVisual')) $('trigLadderVisual').style.transform = `rotate(${-a}deg)`;
      if ($('trigLadderAngleVisual')) $('trigLadderAngleVisual').textContent = a + '°';
    }
    if (ll && la) {
      ll.oninput = la.oninput = () => { calcLadder(); mark(); };
      calcLadder();
    }

    // 3. Jalan
    const rr = $('trigRoadRise'), run = $('trigRoadRun');
    function calcRoad() {
      if (!rr || !run) return;
      const rise = +rr.value, horizontal = +run.value, a = Math.atan(rise / horizontal) * 180 / Math.PI, percent = rise / horizontal * 100;
      if ($('trigRoadRiseOut')) $('trigRoadRiseOut').textContent = rise + ' m';
      if ($('trigRoadRunOut')) $('trigRoadRunOut').textContent = horizontal + ' m';
      if ($('trigRoadRiseLabel')) $('trigRoadRiseLabel').textContent = rise + ' m';
      if ($('trigRoadRunLabel')) $('trigRoadRunLabel').textContent = horizontal + ' m';
      if ($('trigRoadResult')) $('trigRoadResult').innerHTML = `<b>Sudut kemiringan:</b> ${fmt(a)}°<br><b>Grade:</b> ${fmt(percent)}%<br><small>tan θ = ${rise} ÷ ${horizontal}</small>`;
      if ($('trigRoadVisual')) $('trigRoadVisual').style.transform = `rotate(${-Math.max(2, Math.min(18, a))}deg)`;
    }
    if (rr && run) {
      rr.oninput = run.oninput = () => { calcRoad(); mark(); };
      calcRoad();
    }

    // 4. Eksplorasi sudut
    const ae = $('trigAngleExplore');
    function calcExplore() {
      if (!ae) return;
      const a = +ae.value, s = Math.sin(rad(a)), c = Math.cos(rad(a)), t = Math.tan(rad(a));
      if ($('trigAngleExploreOut')) $('trigAngleExploreOut').textContent = a + '°';
      if ($('trigSinValue')) $('trigSinValue').textContent = fmt3(s);
      if ($('trigCosValue')) $('trigCosValue').textContent = fmt3(c);
      if ($('trigTanValue')) $('trigTanValue').textContent = fmt3(t);
      if ($('trigExploreExplanation')) $('trigExploreExplanation').innerHTML = `Untuk sudut <b>${a}°</b>: <b>sin θ = depan/miring</b>, <b>cos θ = samping/miring</b>, dan <b>tan θ = depan/samping</b>.`;
      if ($('trigExploreTriangle')) $('trigExploreTriangle').style.transform = `rotate(${a - 35}deg)`;
    }
    if (ae) {
      ae.oninput = () => { calcExplore(); mark(); };
      calcExplore();
    }

    // 5. Graph
    const canvas = $('trigGraphCanvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      let graph = 'sin';
      function drawGraph() {
        const w = canvas.width, h = canvas.height;
        ctx.clearRect(0, 0, w, h);
        ctx.font = '16px Arial';
        ctx.strokeStyle = '#d9d9d9';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 8; i++) { let x = i * w / 8; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
        for (let j = 0; j <= 4; j++) { let y = j * h / 4; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
        ctx.strokeStyle = '#777'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, h); ctx.stroke();
        ctx.strokeStyle = '#F2C94C'; ctx.lineWidth = 4; let drawing = false;
        for (let i = 0; i <= w; i++) {
          const deg = i / w * 360, r = rad(deg);
          let yv = graph === 'sin' ? Math.sin(r) : graph === 'cos' ? Math.cos(r) : Math.tan(r);
          if (graph === 'tan' && Math.abs(yv) > 4) { drawing = false; continue; }
          const y = h / 2 - yv * (h / 2.5);
          if (!drawing) { ctx.beginPath(); ctx.moveTo(i, y); drawing = true; } else ctx.lineTo(i, y);
        }
        ctx.stroke();
        ctx.fillStyle = '#555';
        ctx.fillText('0°', 8, h - 10); ctx.fillText('90°', w * .25 - 15, h - 10); ctx.fillText('180°', w * .5 - 20, h - 10); ctx.fillText('270°', w * .75 - 20, h - 10); ctx.fillText('360°', w - 42, h - 10);
        if ($('trigGraphInfo')) $('trigGraphInfo').innerHTML = graph === 'tan' ? '<b>tan x</b> → periode 180° dan tidak terdefinisi saat 90°, 270°, dan seterusnya.' : '<b>' + graph + ' x</b> → periode 360°, nilai berada antara −1 dan 1.';
      }
      document.querySelectorAll('[data-trig-graph]').forEach(btn => btn.onclick = () => {
        document.querySelectorAll('[data-trig-graph]').forEach(x => x.classList.remove('active'));
        btn.classList.add('active');
        graph = btn.dataset.trigGraph;
        drawGraph();
        mark();
      });
      drawGraph();
    }

    // 6. Identity
    document.querySelectorAll('#trigIdentityOptions button').forEach(btn => btn.onclick = () => {
      const ok = btn.dataset.answer === '1';
      if ($('trigIdentityFeedback')) $('trigIdentityFeedback').innerHTML = ok ? '🎉 <b>Benar!</b> Identitas dasarnya adalah sin² θ + cos² θ = 1.' : 'Belum tepat. Ingat identitas dasar: <b>sin² θ + cos² θ = 1</b>.';
      mark();
    });

    // 7. Special angles
    const special = { 30: { sin: '1/2', cos: '√3/2', tan: '√3/3' }, 45: { sin: '√2/2', cos: '√2/2', tan: '1' }, 60: { sin: '√3/2', cos: '1/2', tan: '√3' } };
    document.querySelectorAll('[data-special-angle]').forEach(btn => btn.onclick = () => {
      const a = btn.dataset.specialAngle, v = special[a];
      if ($('trigSpecialResult')) $('trigSpecialResult').innerHTML = `<b>${a}°</b> → sin = ${v.sin} · cos = ${v.cos} · tan = ${v.tan}`;
      mark();
    });

    // 8. Equation sin x = k
    if ($('trigSolveBtn')) {
      $('trigSolveBtn').onclick = () => {
        let k = Number($('trigEqK').value);
        if (!Number.isFinite(k)) k = 0.5;
        k = Math.max(-1, Math.min(1, k));
        $('trigEqK').value = k;
        const a = Math.asin(k) * 180 / Math.PI;
        let sol = [];
        if (Math.abs(k - 1) < 1e-9) sol = [90];
        else if (Math.abs(k + 1) < 1e-9) sol = [270];
        else if (Math.abs(k) < 1e-9) sol = [0, 180, 360];
        else {
          let x = a < 0 ? 360 + a : a;
          let y = 180 - x;
          sol = [x, y].filter(v => v >= 0 && v <= 360).sort((p, q) => p - q);
        }
        if ($('trigEquationResult')) $('trigEquationResult').innerHTML = `Untuk <b>sin x = ${k}</b> pada 0° ≤ x ≤ 360°, solusi: <b>${sol.map(v => fmt(v) + '°').join(' dan ')}</b>.`;
        mark();
      };
    }

    // 9. Missions
    const missions = [
      { q: 'Kamu berdiri 20 m dari gedung. Sudut elevasi ke puncak adalah 45°. Abaikan tinggi mata. Berapa tinggi gedung?', unit: 'm', answer: 20, tip: 'Gunakan tan 45° = tinggi/20.' },
      { q: 'Sebuah tangga panjangnya 10 m membentuk sudut 30° terhadap tanah. Berapa tinggi dinding yang dicapai?', unit: 'm', answer: 5, tip: 'Gunakan sin 30° = tinggi/10.' },
      { q: 'Sebuah jalan naik 10 m dalam jarak horizontal 100 m. Berapa sudut kemiringannya? Bulatkan 2 angka di belakang koma.', unit: '°', answer: Math.atan(0.1) * 180 / Math.PI, tip: 'Gunakan tan θ = 10/100 lalu θ = tan⁻¹(0,1).' },
      { q: 'Sebuah drone bergerak 100 m dengan sudut 30° terhadap arah horizontal. Berapa perpindahan vertikalnya?', unit: 'm', answer: 50, tip: 'Gunakan sin 30° = tinggi/100.' },
      { q: 'Jika cos θ = 1/2 dan θ adalah sudut lancip, berapakah θ?', unit: '°', answer: 60, tip: 'Gunakan sudut istimewa.' }
    ];
    let mi = 0, checked = false;
    function renderMission() {
      const m = missions[mi];
      if ($('trigMissionBox')) $('trigMissionBox').innerHTML = `<p>${m.q}</p><div class="trig-mission-input"><input id="trigMissionAnswer" type="number" step="0.01" placeholder="Masukkan jawaban"><span>${m.unit}</span></div>`;
      if ($('trigMissionProgress')) $('trigMissionProgress').textContent = `Misi ${mi + 1} dari ${missions.length}`;
      if ($('trigMissionFeedback')) $('trigMissionFeedback').textContent = '';
      if ($('trigMissionNext')) $('trigMissionNext').disabled = true;
      checked = false;
    }
    if ($('trigMissionCheck')) {
      $('trigMissionCheck').onclick = () => {
        const m = missions[mi], input = $('trigMissionAnswer'), val = Number(input.value);
        if (!Number.isFinite(val)) { if ($('trigMissionFeedback')) $('trigMissionFeedback').textContent = 'Masukkan jawaban terlebih dahulu.'; return; }
        const correct = Math.abs(val - m.answer) <= Math.max(.15, Math.abs(m.answer) * .03);
        if ($('trigMissionFeedback')) $('trigMissionFeedback').innerHTML = correct ? `🎉 <b>Benar!</b> ${m.tip}` : `Belum tepat. ${m.tip}`;
        if (correct) { if ($('trigMissionNext')) $('trigMissionNext').disabled = false; checked = true; }
        mark();
      };
    }
    if ($('trigMissionNext')) {
      $('trigMissionNext').onclick = () => {
        if (!checked) return;
        mi++;
        if (mi >= missions.length) {
          if ($('trigMissionBox')) $('trigMissionBox').innerHTML = '<div class="mission-finished">🏆 <b>Semua misi selesai!</b><br>Kamu sudah mencoba beberapa penerapan trigonometri di kehidupan nyata.</div>';
          if ($('trigMissionProgress')) $('trigMissionProgress').textContent = '5 dari 5 selesai';
          if ($('trigMissionNext')) $('trigMissionNext').disabled = true;
          if ($('trigMissionCheck')) $('trigMissionCheck').disabled = true;
        } else renderMission();
        mark();
      };
    }
    renderMission();
    return;
  }

  // Jika modul lain, jalankan fallback atau modul sebelumnya
  if (typeof window._prevTrigBindSimulator === 'function') {
    return window._prevTrigBindSimulator(id);
  }

  if (window._bindSimulatorFallback) window._bindSimulatorFallback(id);
};