/*
  MATERI MODUL PERSAMAAN: SPLDV (Sistem Persamaan Linear Dua Variabel)
  Meng-override tab Materi hanya untuk id 'persamaan'; modul lain diteruskan ke fungsi sebelumnya.
*/

window._prevSxGetModuleMaterial = window.getModuleMaterial;

const SX_METHODS = {
  grafik: {
    label: '📈 Grafik',
    html: `<h4>Ide dasarnya</h4>
<p>Setiap persamaan linear dua variabel kalau digambar menjadi <b>sebuah garis lurus</b>. Titik tempat dua garis bertemu adalah titik yang memenuhi <i>kedua</i> persamaan sekaligus. Itulah penyelesaian SPLDV.</p>
<h4>Contoh: x + y = 5 dan x − y = 1</h4>
<ol class="step-list">
<li>Cari dua titik untuk garis pertama, x + y = 5. Saat x = 0 maka y = 5, jadi titik <b>(0, 5)</b>. Saat y = 0 maka x = 5, jadi titik <b>(5, 0)</b>.</li>
<li>Untuk garis kedua, x − y = 1. Saat y = 0 maka x = 1, jadi titik <b>(1, 0)</b>. Saat x = 0 maka y = −1, jadi titik <b>(0, −1)</b>.</li>
<li>Gambar kedua garis pada bidang koordinat, lalu lihat titik potongnya di <b>(3, 2)</b>.</li>
<li>Cek: 3 + 2 = 5 ✓ dan 3 − 2 = 1 ✓. Jadi <b>x = 3 dan y = 2</b>.</li>
</ol>
<p class="tip">💡 Kelebihan metode grafik: kamu bisa <i>melihat</i> jenis solusinya. Kekurangannya: kurang teliti kalau titik potong tidak berupa bilangan bulat. Coba di tab 🧪 Coba Interaktif.</p>`
  },
  substitusi: {
    label: '🔁 Substitusi',
    html: `<h4>Ide dasarnya</h4>
<p><b>Substitusi</b> artinya mengganti. Ubah salah satu persamaan menjadi bentuk "variabel = ...", lalu masukkan bentuk itu ke persamaan yang lain sehingga tersisa satu variabel.</p>
<h4>Contoh: y = 2x − 1 dan x + y = 8</h4>
<ol class="step-list">
<li>Persamaan pertama sudah berbentuk y = 2x − 1.</li>
<li>Ganti y pada persamaan kedua: x + (2x − 1) = 8.</li>
<li>Sederhanakan: 3x − 1 = 8, lalu 3x = 9, sehingga <b>x = 3</b>.</li>
<li>Masukkan x = 3 ke y = 2x − 1: y = 2(3) − 1 = <b>5</b>.</li>
<li>Cek: 3 + 5 = 8 ✓ dan 2(3) − 1 = 5 ✓. Penyelesaiannya <b>(3, 5)</b>.</li>
</ol>
<p class="tip">💡 Pilih persamaan yang paling mudah diubah, yaitu yang ada variabel berkoefisien 1, supaya tidak berurusan dengan pecahan.</p>`
  },
  eliminasi: {
    label: '✂️ Eliminasi',
    html: `<h4>Ide dasarnya</h4>
<p><b>Eliminasi</b> artinya menghilangkan. Samakan koefisien salah satu variabel, lalu <b>jumlahkan</b> atau <b>kurangkan</b> kedua persamaan supaya variabel itu hilang.</p>
<h4>Contoh: 2x + 3y = 13 dan 4x − y = 5</h4>
<ol class="step-list">
<li>Kita hilangkan y. Koefisien y adalah 3 dan −1, jadi kalikan persamaan kedua dengan 3: 12x − 3y = 15.</li>
<li>Jumlahkan dengan persamaan pertama: (2x + 3y) + (12x − 3y) = 13 + 15, sehingga 14x = 28 dan <b>x = 2</b>.</li>
<li>Untuk mencari y, bisa eliminasi x atau langsung masukkan x = 2 ke 4x − y = 5: 8 − y = 5, sehingga <b>y = 3</b>.</li>
<li>Cek: 2(2) + 3(3) = 13 ✓ dan 4(2) − 3 = 5 ✓. Penyelesaiannya <b>(2, 3)</b>.</li>
</ol>
<p class="tip">💡 Kalau tanda variabel sama (misal +3y dan +3y), <b>kurangkan</b>. Kalau berlawanan (+3y dan −3y), <b>jumlahkan</b>.</p>`
  },
  gabungan: {
    label: '🤝 Gabungan',
    html: `<h4>Ide dasarnya</h4>
<p>Metode <b>gabungan</b> memakai eliminasi dulu untuk menemukan satu variabel, lalu substitusi untuk menemukan variabel yang satunya. Ini cara paling praktis dan paling sering dipakai.</p>
<h4>Contoh: 3x + 2y = 16 dan x − y = 2</h4>
<ol class="step-list">
<li><b>Eliminasi y.</b> Kalikan persamaan kedua dengan 2: 2x − 2y = 4.</li>
<li>Jumlahkan dengan persamaan pertama: 3x + 2x = 16 + 4, sehingga 5x = 20 dan <b>x = 4</b>.</li>
<li><b>Substitusi</b> x = 4 ke x − y = 2: 4 − y = 2, sehingga <b>y = 2</b>.</li>
<li>Cek: 3(4) + 2(2) = 16 ✓ dan 4 − 2 = 2 ✓. Penyelesaiannya <b>(4, 2)</b>.</li>
</ol>`
  }
};

window.sxMethod = function (key) {
  const d = SX_METHODS[key];
  if (!d) return;
  const panel = document.getElementById('sxMethodPanel');
  if (panel) {
    panel.classList.remove('sx-fade');
    void panel.offsetWidth;
    panel.innerHTML = d.html;
    panel.classList.add('sx-fade');
  }
  document.querySelectorAll('.sx-method-btn').forEach(b => b.classList.toggle('active', b.dataset.m === key));
};

const SX_ANATOMY_NOTES = {
  coef: '<b>Koefisien</b> adalah angka yang menempel di depan variabel. Pada 3x, koefisien x adalah 3; pada 2y, koefisien y adalah 2.',
  vari: '<b>Variabel</b> adalah huruf pengganti nilai yang belum diketahui, di sini x dan y.',
  const: '<b>Konstanta</b> adalah bilangan tanpa variabel, di sini 12. Letaknya biasanya di ruas kanan.'
};

window.sxAnatomy = function (kind) {
  const note = document.getElementById('sxAnatomyNote');
  if (note) note.innerHTML = SX_ANATOMY_NOTES[kind] || '';
  document.querySelectorAll('.sx-part').forEach(p => p.classList.toggle('on', p.dataset.k === kind));
};

window.getModuleMaterial = function (id) {
  if (id !== 'persamaan') return window._prevSxGetModuleMaterial(id);

  const methodButtons = Object.entries(SX_METHODS).map(([k, d], i) =>
    `<button class="sx-method-btn${i === 0 ? ' active' : ''}" data-m="${k}" onclick="window.sxMethod('${k}')">${d.label}</button>`
  ).join('');

  return `<div class="lesson-sections sx-materi">

${window.NRADV ? window.NRADV.html() : ''}

</div>

<div class="content-card sx-reveal">
  <h3>📌 1. Apa itu SPLDV?</h3>
  <p><b>Persamaan linear dua variabel (PLDV)</b> adalah persamaan yang punya dua variabel berpangkat satu, misalnya <b>x + y = 5</b>. Persamaan ini punya banyak pasangan penyelesaian: (1, 4), (2, 3), (0, 5), dan seterusnya.</p>
  <p>Kalau ada <b>dua PLDV</b> yang harus dipenuhi bersama oleh pasangan (x, y) yang sama, keduanya membentuk <b>sistem</b>, yaitu SPLDV. Yang kita cari adalah pasangan (x, y) yang cocok di kedua persamaan.</p>
  <div class="formula-stack">
    <div class="formula">a₁x + b₁y = c₁</div>
    <div class="formula">a₂x + b₂y = c₂</div>
  </div>
  <p>Syaratnya: variabelnya sama (x dan y), pangkat tertingginya 1, dan tidak ada perkalian antarvariabel seperti xy.</p>
  <div class="concept-grid">
    <div class="concept-box"><h4>✅ Bukan masalah</h4><p>2x + 3y = 12, x − y = 4, y = 2x + 1. Semuanya linear.</p></div>
    <div class="concept-box"><h4>❌ Bukan SPLDV</h4><p>x² + y = 5 (ada pangkat 2), xy = 6 (ada perkalian variabel), x + y + z = 9 (tiga variabel).</p></div>
  </div>
</div>

<div class="content-card sx-reveal">
  <h3>🧩 2. Unsur-unsur SPLDV</h3>
  <p>Klik bagian-bagian persamaan <b>3x + 2y = 12</b> di bawah untuk mengenal namanya.</p>
  <div class="sx-anatomy">
    <span class="sx-part coef" data-k="coef" onclick="window.sxAnatomy('coef')">3</span><span class="sx-part vari" data-k="vari" onclick="window.sxAnatomy('vari')">x</span>
    <span>+</span>
    <span class="sx-part coef" data-k="coef" onclick="window.sxAnatomy('coef')">2</span><span class="sx-part vari" data-k="vari" onclick="window.sxAnatomy('vari')">y</span>
    <span>=</span>
    <span class="sx-part const" data-k="const" onclick="window.sxAnatomy('const')">12</span>
  </div>
  <div class="sx-anatomy-note" id="sxAnatomyNote">👆 Klik angka atau huruf di atas.</div>
</div>

<div class="content-card sx-reveal">
  <h3>🎯 3. Apa yang disebut penyelesaian?</h3>
  <p><b>Penyelesaian SPLDV</b> adalah pasangan nilai (x, y) yang membuat <b>kedua persamaan benar sekaligus</b>.</p>
  <p>Contoh: apakah (3, 2) penyelesaian dari x + y = 5 dan x − y = 1?</p>
  <ol class="step-list">
    <li>Persamaan 1: 3 + 2 = 5 ✓ (benar).</li>
    <li>Persamaan 2: 3 − 2 = 1 ✓ (benar).</li>
    <li>Keduanya benar, jadi <b>(3, 2) adalah penyelesaiannya</b>.</li>
  </ol>
  <p>Bandingkan dengan (4, 1): persamaan 1 benar (4 + 1 = 5), tetapi persamaan 2 salah (4 − 1 = 3, bukan 1). Satu persamaan saja tidak cukup, keduanya harus benar.</p>
</div>

<div class="content-card sx-reveal">
  <h3>🛠️ 4. Empat metode menyelesaikan SPLDV</h3>
  <p>Hasilnya sama saja, pilih cara yang paling nyaman untuk soalnya. Klik tiap metode untuk melihat contoh langkahnya.</p>
  <div class="sx-method-tabs">${methodButtons}</div>
  <div class="sx-method-panel sx-fade" id="sxMethodPanel">${SX_METHODS.grafik.html}</div>
</div>

<div class="content-card sx-reveal">
  <h3>🔀 5. Berapa banyak penyelesaiannya?</h3>
  <p>Karena setiap persamaan adalah garis, ada tiga kemungkinan posisi dua garis:</p>
  <div class="sx-type-grid">
    <div class="sx-type">
      <svg viewBox="0 0 120 100"><line x1="10" y1="90" x2="10" y2="8" stroke="#bbb"/><line x1="10" y1="90" x2="112" y2="90" stroke="#bbb"/><line x1="14" y1="80" x2="110" y2="22" stroke="#3B82F6" stroke-width="3" stroke-linecap="round"/><line x1="14" y1="24" x2="110" y2="80" stroke="#FF4D8D" stroke-width="3" stroke-linecap="round"/><circle cx="62" cy="51" r="6" fill="#17C3B2" stroke="#fff" stroke-width="2"/></svg>
      <h4>Tepat satu solusi</h4><p>Garis <b>berpotongan</b>.</p><p>Kemiringan berbeda.</p>
    </div>
    <div class="sx-type">
      <svg viewBox="0 0 120 100"><line x1="10" y1="90" x2="10" y2="8" stroke="#bbb"/><line x1="10" y1="90" x2="112" y2="90" stroke="#bbb"/><line x1="14" y1="76" x2="110" y2="26" stroke="#3B82F6" stroke-width="6" stroke-linecap="round" opacity=".6"/><line x1="14" y1="76" x2="110" y2="26" stroke="#FF4D8D" stroke-width="2.5" stroke-dasharray="6 5" stroke-linecap="round"/></svg>
      <h4>Tak hingga solusi</h4><p>Garis <b>berimpit</b>.</p><p>Persamaan yang sama, hanya ditulis berbeda.</p>
    </div>
    <div class="sx-type">
      <svg viewBox="0 0 120 100"><line x1="10" y1="90" x2="10" y2="8" stroke="#bbb"/><line x1="10" y1="90" x2="112" y2="90" stroke="#bbb"/><line x1="14" y1="64" x2="110" y2="20" stroke="#3B82F6" stroke-width="3" stroke-linecap="round"/><line x1="14" y1="84" x2="110" y2="40" stroke="#FF4D8D" stroke-width="3" stroke-linecap="round"/></svg>
      <h4>Tidak ada solusi</h4><p>Garis <b>sejajar</b>.</p><p>Tidak pernah bertemu.</p>
    </div>
  </div>
  <p style="margin-top:16px">Cara cepat mengecek tanpa menggambar, untuk a₁x + b₁y = c₁ dan a₂x + b₂y = c₂:</p>
  <table class="mini-table">
    <tr><th>Kondisi</th><th>Hasil</th></tr>
    <tr>
  <td>
    <span class="sx-frac"><span>a₁</span><span>a₂</span></span>
    ≠
    <span class="sx-frac"><span>b₁</span><span>b₂</span></span>
  </td>
  <td>Tepat satu solusi</td>
</tr>
<tr>
  <td>
    <span class="sx-frac"><span>a₁</span><span>a₂</span></span>
    =
    <span class="sx-frac"><span>b₁</span><span>b₂</span></span>
    =
    <span class="sx-frac"><span>c₁</span><span>c₂</span></span>
  </td>
  <td>Tak hingga solusi</td>
</tr>
<tr>
  <td>
    <span class="sx-frac"><span>a₁</span><span>a₂</span></span>
    =
    <span class="sx-frac"><span>b₁</span><span>b₂</span></span>
    ≠
    <span class="sx-frac"><span>c₁</span><span>c₂</span></span>
  </td>
  <td>Tidak ada solusi</td>
</tr>
  </table>
  <h4 style="margin-top:18px">Contoh</h4>
  <ol class="step-list">
    <li><b>x + y = 4</b> dan <b>2x + 2y = 8</b>: <span class="sx-frac"><span>1</span><span>2</span></span>
=
<span class="sx-frac"><span>1</span><span>2</span></span>
=
<span class="sx-frac"><span>4</span><span>8</span></span>, jadi garis berimpit dan solusinya <b>tak hingga</b>. Saat dieliminasi (kalikan persamaan pertama dengan 2, lalu kurangkan) hasilnya 0 = 0.</li>
    <li><b>x + y = 4</b> dan <b>x + y = 6</b>: <span class="sx-frac"><span>1</span><span>1</span></span>
=
<span class="sx-frac"><span>1</span><span>1</span></span>
tetapi
<span class="sx-frac"><span>4</span><span>6</span></span>
≠ 1, jadi garis sejajar dan <b>tidak ada solusi</b>. Saat dieliminasi hasilnya 0 = 2, yang jelas mustahil.</li>
  </ol>
</div>

<div class="content-card sx-reveal">
  <h3>🍜 6. Soal cerita: dari kalimat ke persamaan</h3>
  <p>Ini bagian yang paling sering muncul di ujian. Ikuti 4 langkah: <b>pemisalan → model matematika → selesaikan → jawab dan cek</b>.</p>
  <h4>Contoh 1: Belanja di kantin</h4>
  <p>Dua mie ayam dan tiga es teh harganya Rp36.000. Tiga mie ayam dan dua es teh harganya Rp44.000. Berapa harga satu mie ayam dan satu es teh?</p>
  <ol class="step-list">
    <li><b>Pemisalan:</b> harga satu mie ayam = x, harga satu es teh = y.</li>
    <li><b>Model:</b> 2x + 3y = 36.000 dan 3x + 2y = 44.000.</li>
    <li>Jumlahkan keduanya: 5x + 5y = 80.000, sehingga x + y = 16.000. Kurangkan (persamaan kedua dikurangi pertama): x − y = 8.000.</li>
    <li>Dari x + y = 16.000 dan x − y = 8.000 didapat 2x = 24.000, sehingga <b>x = 12.000</b> dan y = 16.000 − 12.000 = <b>4.000</b>.</li>
    <li><b>Cek:</b> 2(12.000) + 3(4.000) = 24.000 + 12.000 = 36.000 ✓ dan 3(12.000) + 2(4.000) = 36.000 + 8.000 = 44.000 ✓.</li>
    <li><b>Jawab:</b> mie ayam Rp12.000 dan es teh Rp4.000.</li>
  </ol>
  <h4>Contoh 2: Ayam dan kambing</h4>
  <p>Di sebuah kandang ada ayam dan kambing, jumlahnya 20 ekor. Jumlah kakinya 56. Berapa ekor masing-masing?</p>
  <ol class="step-list">
    <li><b>Pemisalan:</b> banyak ayam = x, banyak kambing = y.</li>
    <li><b>Model:</b> x + y = 20 (jumlah kepala) dan 2x + 4y = 56 (jumlah kaki).</li>
    <li>Kalikan persamaan pertama dengan 2: 2x + 2y = 40. Kurangkan dari persamaan kedua: 2y = 16, sehingga <b>y = 8</b>.</li>
    <li>Substitusi: x = 20 − 8 = <b>12</b>.</li>
    <li><b>Cek:</b> 12 + 8 = 20 ✓ dan 2(12) + 4(8) = 24 + 32 = 56 ✓.</li>
    <li><b>Jawab:</b> 12 ayam dan 8 kambing.</li>
  </ol>
</div>

<div class="content-card sx-reveal">
  <h3>🌍 SPLDV di dunia nyata</h3>
  <ul>
    <li><b>Belanja dan harga satuan:</b> mencari harga dua barang dari dua struk belanja.</li>
    <li><b>Tarif transportasi:</b> membandingkan dua paket tarif (biaya awal dan biaya per km) untuk tahu di jarak berapa tarifnya sama.</li>
    <li><b>Campuran:</b> kadar larutan atau komposisi bahan makanan.</li>
    <li><b>Bisnis:</b> titik impas, yaitu saat biaya sama dengan pendapatan.</li>
    <li><b>Tiket dan kapasitas:</b> jumlah penonton dewasa dan anak dari total tiket dan total uang.</li>
  </ul>
</div>

<div class="content-card sx-reveal">
  <h3>⚠️ Kesalahan yang sering terjadi</h3>
  <table class="mini-table">
    <tr><th>Kesalahan</th><th>Yang benar</th></tr>
    <tr><td>Berhenti setelah dapat x saja</td><td>Cari juga y, lalu tulis pasangan (x, y)</td></tr>
    <tr><td>Mengalikan hanya satu suku saat menyamakan koefisien</td><td>Kalikan <b>seluruh</b> persamaan, termasuk konstanta</td></tr>
    <tr><td>Salah tanda saat mengurangkan, misalnya 3y − (−y)</td><td>Kurangi dengan hati-hati: 3y − (−y) = 4y</td></tr>
    <tr><td>Tidak mengecek jawaban</td><td>Masukkan (x, y) ke <b>kedua</b> persamaan awal</td></tr>
    <tr><td>Pemisalan tidak jelas</td><td>Tulis "x = ..., y = ..." beserta artinya sebelum membuat model</td></tr>
  </table>
</div>

<div class="content-card sx-reveal">
  <h3>📝 Ringkasan</h3>
  <table class="mini-table">
    <tr><th>Topik</th><th>Intinya</th></tr>
    <tr><td>Bentuk umum</td><td>a₁x + b₁y = c₁ dan a₂x + b₂y = c₂</td></tr>
    <tr><td>Penyelesaian</td><td>Pasangan (x, y) yang benar di kedua persamaan</td></tr>
    <tr><td>Grafik</td><td>Titik potong dua garis</td></tr>
    <tr><td>Substitusi</td><td>Ganti satu variabel dengan bentuk dari persamaan lain</td></tr>
    <tr><td>Eliminasi</td><td>Samakan koefisien, lalu jumlahkan atau kurangkan</td></tr>
    <tr><td>Jenis solusi</td><td>Satu (berpotongan), tak hingga (berimpit), nol (sejajar)</td></tr>
    <tr><td>Soal cerita</td><td>Misalkan → model → selesaikan → cek → jawab</td></tr>
  </table>
  <div class="tip" style="margin-top:14px">💡 <b>Tips:</b> jangan takut dengan x dan y. Anggap keduanya "kotak kosong" yang harus kita temukan, dan selalu cek jawaban ke kedua persamaan.</div>
</div>

<div class="content-card" style="text-align:center">
  <h3>🎯 Materi Persamaan</h3>
  <p>Apakah kamu sudah selesai membaca dan memahami seluruh materi ini?</p>
  <button type="button" id="completeMateriBtn" class="gradient-btn">Tandai Sudah Membaca dan Paham</button>
  <p style="margin-top:12px;font-size:13px;color:#888">Progres akan tersimpan setelah tombol diklik.</p>
</div>

</div>`;
};
