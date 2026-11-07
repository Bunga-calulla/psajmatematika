/*
  SPLDV LAB (bagian B): misi soal cerita, tebak jenis solusi, serta pemasangan
  simulator & binding untuk modul 'persamaan'. Modul lain diteruskan ke fungsi sebelumnya.
*/
window._prevSxGetModuleSimulator = window.getModuleSimulator;
window._prevSxBindSimulator = window.bindSimulator;

(function () {
  const L = window.SXLAB;
  const $ = L.$;
  const rp = n => 'Rp' + new Intl.NumberFormat('id-ID').format(n);
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = arr => arr[rnd(0, arr.length - 1)];
  const shake = el => { el.classList.remove('sx-shake'); void el.offsetWidth; el.classList.add('sx-shake'); };

  // ================= MISI SOAL CERITA =================
  const ITEMS = [
    ['buku tulis', 'pulpen', 'di toko alat tulis'],
    ['mie ayam', 'es teh', 'di kantin'],
    ['tiket dewasa', 'tiket anak', 'di loket wisata'],
    ['kaos', 'topi', 'di toko merchandise']
  ];

  function initMission(mark) {
    const box = $('sxMission');
    if (!box) return;
    let m = null;

    function newMission() {
      const it = pick(ITEMS);
      let x, y, a1, b1, a2, b2;
      do {
        x = rnd(1, 15) * 1000; y = rnd(1, 15) * 1000;
        a1 = rnd(1, 4); b1 = rnd(1, 4); a2 = rnd(1, 4); b2 = rnd(1, 4);
      } while (x === y || a1 * b2 === a2 * b1);
      m = { it, x, y, a1, b1, a2, b2, c1: a1 * x + b1 * y, c2: a2 * x + b2 * y };
      $('sxMStory').innerHTML =
        `Rina ${it[2]} membeli <b>${a1} ${it[0]}</b> dan <b>${b1} ${it[1]}</b> dengan total <b>${rp(m.c1)}</b>. ` +
        `Dito membeli <b>${a2} ${it[0]}</b> dan <b>${b2} ${it[1]}</b> dengan total <b>${rp(m.c2)}</b>.`;
      $('sxMPhase1Q').innerHTML = `Misalkan <b>x = harga 1 ${it[0]}</b> dan <b>y = harga 1 ${it[1]}</b>. Isi model matematikanya (isi c dalam rupiah penuh, tanpa titik):`;
      ['sxMa1', 'sxMb1', 'sxMc1', 'sxMa2', 'sxMb2', 'sxMc2', 'sxMx', 'sxMy'].forEach(id => { $(id).value = ''; });
      $('sxMFb1').textContent = ''; $('sxMFb2').textContent = '';
      $('sxMPhase2').classList.add('hidden');
      $('sxMCheck1').disabled = false;
    }

    $('sxMCheck1').onclick = () => {
      const v = ['sxMa1', 'sxMb1', 'sxMc1', 'sxMa2', 'sxMb2', 'sxMc2'].map(id => Number($(id).value));
      const want = [m.a1, m.b1, m.c1, m.a2, m.b2, m.c2];
      const fb = $('sxMFb1');
      if ($('sxMa1').value === '' || $('sxMc2').value === '') { fb.className = 'sx-feedback bad'; fb.textContent = 'Isi semua kotak dulu ya.'; return; }
      const wrong = [];
      if (v[0] !== want[0] || v[1] !== want[1] || v[2] !== want[2]) wrong.push('persamaan ① (cerita Rina)');
      if (v[3] !== want[3] || v[4] !== want[4] || v[5] !== want[5]) wrong.push('persamaan ② (cerita Dito)');
      if (!wrong.length) {
        fb.className = 'sx-feedback good';
        fb.innerHTML = `✅ Model tepat: ${L.fmtEq(m.a1, m.b1, m.c1)} dan ${L.fmtEq(m.a2, m.b2, m.c2)}. Sekarang selesaikan!`;
        $('sxMPhase2').classList.remove('hidden');
        $('sxMPhase2').classList.add('sx-bounce');
        $('sxMCheck1').disabled = true;
      } else {
        fb.className = 'sx-feedback bad';
        fb.textContent = 'Belum tepat di ' + wrong.join(' dan ') + '. Ingat: koefisien x = banyak ' + m.it[0] + ', koefisien y = banyak ' + m.it[1] + ', konstanta = total harga.';
        shake(fb);
      }
    };

    $('sxMCheck2').onclick = () => {
      const fb = $('sxMFb2');
      const gx = Number($('sxMx').value), gy = Number($('sxMy').value);
      if ($('sxMx').value === '' || $('sxMy').value === '') { fb.className = 'sx-feedback bad'; fb.textContent = 'Isi harga kedua barang ya.'; return; }
      if (gx === m.x && gy === m.y) {
        fb.className = 'sx-feedback good';
        fb.innerHTML = `🎉 Benar! 1 ${m.it[0]} = <b>${rp(m.x)}</b> dan 1 ${m.it[1]} = <b>${rp(m.y)}</b>.<br>Cek ①: ${m.a1}(${m.x}) + ${m.b1}(${m.y}) = ${m.c1} ✓ · Cek ②: ${m.a2}(${m.x}) + ${m.b2}(${m.y}) = ${m.c2} ✓`;
        L.confetti(); mark();
      } else {
        fb.className = 'sx-feedback bad';
        fb.innerHTML = 'Belum pas. Cek jawabanmu dengan memasukkannya ke kedua persamaan. Petunjuk: samakan koefisien salah satu variabel lalu jumlahkan atau kurangkan.';
        shake(fb);
      }
    };

    $('sxMNew').onclick = newMission;
    newMission();
  }

  // ================= TEBAK JENIS SOLUSI =================
  function initClassify(mark) {
    const q = $('sxCQ');
    if (!q) return;
    let cur = null, streak = 0;

    function gen() {
      const kind = pick(['one', 'inf', 'none']);
      let a1, b1, c1, a2, b2, c2;
      if (kind === 'one') {
        do {
          a1 = pick([-4, -3, -2, -1, 1, 2, 3, 4]); b1 = pick([-4, -3, -2, -1, 1, 2, 3, 4]);
          a2 = pick([-4, -3, -2, -1, 1, 2, 3, 4]); b2 = pick([-4, -3, -2, -1, 1, 2, 3, 4]);
        } while (a1 * b2 === a2 * b1);
        c1 = rnd(-9, 9); c2 = rnd(-9, 9);
      } else {
        a1 = pick([1, 2, 3, 4]); b1 = pick([-4, -3, -2, -1, 1, 2, 3, 4]); c1 = rnd(1, 9);
        const k = pick([2, 3, -1, -2]);
        a2 = a1 * k; b2 = b1 * k;
        c2 = kind === 'inf' ? c1 * k : c1 * k + pick([1, 2, 3]);
      }
      cur = { kind, a1, b1, c1, a2, b2, c2 };
      $('sxCEq').innerHTML = `<div class="sx-eq-row l1"><span class="tag">①</span> ${L.fmtEq(a1, b1, c1)}</div><div class="sx-eq-row l2"><span class="tag">②</span> ${L.fmtEq(a2, b2, c2)}</div>`;
      $('sxCFb').textContent = '';
      document.querySelectorAll('#sxCBtns button').forEach(b => { b.disabled = false; });
    }

    document.querySelectorAll('#sxCBtns button').forEach(b => {
      b.onclick = () => {
        const fb = $('sxCFb');
        const r = L.solve(cur.a1, cur.b1, cur.c1, cur.a2, cur.b2, cur.c2);
        const { a1, b1, c1, a2, b2, c2 } = cur;
        const ratio = `${L.neg(a1)}/${L.neg(a2)} dan ${L.neg(b1)}/${L.neg(b2)}`;
        let why;
        if (r.type === 'one') why = `Rasio koefisien berbeda (${L.neg(a1)}/${L.neg(a2)} ≠ ${L.neg(b1)}/${L.neg(b2)}), jadi garis berpotongan di (${L.fmt(r.x)}, ${L.fmt(r.y)}).`;
        else if (r.type === 'inf') why = `Rasio x, y, dan konstanta sama (${L.neg(a1)}/${L.neg(a2)} = ${L.neg(b1)}/${L.neg(b2)} = ${L.neg(c1)}/${L.neg(c2)}), jadi garis berimpit.`;
        else why = `Rasio x dan y sama (${ratio}) tetapi konstanta berbeda (${L.neg(c1)}/${L.neg(c2)}), jadi garis sejajar.`;
        if (b.dataset.t === r.type) {
          streak++;
          fb.className = 'sx-feedback good';
          fb.innerHTML = `✅ Tepat! ${why} <b>(beruntun: ${streak})</b>`;
          document.querySelectorAll('#sxCBtns button').forEach(x => { x.disabled = true; });
          if (streak >= 3) L.confetti();
          mark();
        } else {
          streak = 0;
          fb.className = 'sx-feedback bad';
          fb.innerHTML = `❌ Belum tepat. ${why}`;
          shake(fb);
          document.querySelectorAll('#sxCBtns button').forEach(x => { x.disabled = true; });
        }
      };
    });
    $('sxCNext').onclick = gen;
    gen();
  }

  // ================= HTML TAB COBA =================
  window.getModuleSimulator = function (id) {
    if (id !== 'persamaan') return window._prevSxGetModuleSimulator(id);
    return `<div class="sx-interactive">

${window.SXLAB.heroHTML({
  badge: '🧪 LAB SPLDV',
  title: 'Mainkan, <span>jangan cuma baca!</span>',
  typed: 'Empat eksperimen sesuai urutan materi: lihat grafiknya, ikuti langkah penyelesaiannya, ubah cerita jadi persamaan, lalu tebak jenis solusinya.',
  chips: [['📈 Grafik', 0], ['🪜 Langkah', 1], ['🍜 Misi cerita', 2], ['🔀 Tebak solusi', 3]]
})}

<div class="content-card sx-reveal">
  <h3>📈 1. Dua garis, satu titik temu</h3>
  <p>Ubah koefisien dan konstanta. Tiap persamaan menjadi garis, dan titik temunya adalah penyelesaian. Temukan <b>ketiga jenis solusi</b> untuk membuka bintangnya.</p>
  <div class="sx-lab">
    <div>
      <div class="sx-eq-row l1"><span class="tag">①</span>
        <input type="number" id="sxA1" min="-9" max="9" step="1">x +
        <input type="number" id="sxB1" min="-9" max="9" step="1">y =
        <input type="number" id="sxC1" min="-30" max="30" step="1"></div>
      <div class="sx-eq-row l2"><span class="tag">②</span>
        <input type="number" id="sxA2" min="-9" max="9" step="1">x +
        <input type="number" id="sxB2" min="-9" max="9" step="1">y =
        <input type="number" id="sxC2" min="-30" max="30" step="1"></div>
      <div class="sx-presets" id="sxPresets">
        <button type="button" data-p="p1">Berpotongan 1</button>
        <button type="button" data-p="p2">Berpotongan 2</button>
        <button type="button" data-p="inf">Berimpit</button>
        <button type="button" data-p="par">Sejajar</button>
      </div>
      <div id="sxBadge" class="sx-badge one"></div>
      <div class="sx-readout" id="sxReadout"></div>
      <div class="sx-seen" id="sxSeen">
        <span data-k="one">⭐ Berpotongan</span><span data-k="inf">⭐ Berimpit</span><span data-k="none">⭐ Sejajar</span>
      </div>
      <p class="tip" style="margin-top:12px">💡 Tanda <b>+</b> sudah tertulis. Untuk koefisien negatif, isi angka negatif (misal −1).</p>
    </div>
    <div class="sx-canvas-wrap"><canvas id="sxCanvas" width="480" height="480"></canvas></div>
  </div>
</div>

<div class="content-card sx-reveal">
  <h3>🪜 2. Ikuti langkah penyelesaiannya</h3>
  <p>Pilih sistem dan metode, lalu klik langkah demi langkah. Perhatikan bagian yang disorot dan baca penjelasannya.</p>
  <div class="sx-presets">
    <label>Sistem: <select id="sxStepSys">
      <option value="0">2x + 3y = 13 dan 4x − y = 5</option>
      <option value="1">x + y = 8 dan x − y = 2</option>
      <option value="2">3x + 2y = 16 dan x − y = 2</option>
    </select></label>
    <label>Metode: <select id="sxStepMethod">
      <option value="elim">✂️ Eliminasi</option>
      <option value="subs">🔁 Substitusi</option>
    </select></label>
  </div>
  <div class="sx-step-stage" id="sxStepStage"></div>
  <div class="sx-dots" id="sxStepDots"></div>
  <div class="sx-step-explain" id="sxStepExplain"></div>
  <div class="sx-presets" style="margin-top:14px">
    <button type="button" class="sx-btn" id="sxStepPrev">← Sebelumnya</button>
    <button type="button" class="sx-btn primary" id="sxStepNext">Langkah berikutnya →</button>
  </div>
</div>

<div class="content-card sx-reveal">
  <h3>🍜 3. Misi: dari cerita ke persamaan</h3>
  <p>Soal dibuat acak. Tahap 1: susun model matematikanya. Tahap 2: cari harga masing-masing.</p>
  <div class="sx-mission" id="sxMission">
    <div id="sxMStory"></div>
    <p id="sxMPhase1Q" style="margin-top:12px"></p>
    <div class="sx-eq-row l1"><span class="tag">①</span>
      <input type="number" id="sxMa1">x + <input type="number" id="sxMb1">y = <input type="number" id="sxMc1" style="width:110px"></div>
    <div class="sx-eq-row l2"><span class="tag">②</span>
      <input type="number" id="sxMa2">x + <input type="number" id="sxMb2">y = <input type="number" id="sxMc2" style="width:110px"></div>
    <div class="sx-presets"><button type="button" class="sx-btn primary" id="sxMCheck1">Cek model</button></div>
    <div class="sx-feedback" id="sxMFb1"></div>
    <div id="sxMPhase2" class="hidden">
      <div class="sx-input-row">
        <label>x = Rp <input type="number" id="sxMx"></label>
        <label>y = Rp <input type="number" id="sxMy"></label>
        <button type="button" class="sx-btn primary" id="sxMCheck2">Cek jawaban</button>
      </div>
      <div class="sx-feedback" id="sxMFb2"></div>
    </div>
    <div class="sx-presets" style="margin-top:14px"><button type="button" class="sx-btn" id="sxMNew">🎲 Soal baru</button></div>
  </div>
</div>

<div class="content-card sx-reveal">
  <h3>🔀 4. Tebak jenis solusinya</h3>
  <p>Tanpa menggambar dan tanpa menyelesaikan: lihat rasio koefisiennya, lalu tebak jenis solusi sistem ini.</p>
  <div id="sxCQ">
    <div id="sxCEq"></div>
    <div class="sx-presets" id="sxCBtns">
      <button type="button" data-t="one">Tepat satu solusi</button>
      <button type="button" data-t="inf">Tak hingga solusi</button>
      <button type="button" data-t="none">Tidak ada solusi</button>
    </div>
    <div class="sx-feedback" id="sxCFb"></div>
    <div class="sx-presets"><button type="button" class="sx-btn" id="sxCNext">Soal berikutnya →</button></div>
  </div>
</div>

</div>`;
  };

  // ================= BINDING =================
  window.bindSimulator = function (id) {
    if (id !== 'persamaan') return window._prevSxBindSimulator(id);
    const mark = () => { if (window.Progress && typeof Progress.setCoba === 'function') Progress.setCoba(id); };
    L.reveal();
    L.decorate();
    L.initGraph(mark);
    L.initStepper(mark);
    initMission(mark);
    initClassify(mark);
  };
})();
