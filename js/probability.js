/*
  MODUL PELUANG
  1) Peluang sederhana  2) Peluang komplemen  3) Peluang kejadian majemuk
  Style: css/probability.css (prefix .pl-)
*/
(function () {
  const $ = (id) => document.getElementById(id);
  const mark = () => window.Progress && Progress.setCoba && Progress.setCoba('peluang');
  const rnd = (n) => 1 + Math.floor(Math.random() * n);
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  const frac = (a, b) => { if (!a) return '0'; const g = gcd(a, b); return b / g === 1 ? '1' : `${a / g}/${b / g}`; };
  const pct = (a, b) => (a / b * 100).toFixed(1).replace('.', ',') + '%';

  // ---------- Ilustrasi ----------
  const PIPS = { 1: [[50, 50]], 2: [[28, 28], [72, 72]], 3: [[28, 28], [50, 50], [72, 72]], 4: [[28, 28], [72, 28], [28, 72], [72, 72]], 5: [[28, 28], [72, 28], [50, 50], [28, 72], [72, 72]], 6: [[28, 28], [72, 28], [28, 50], [72, 50], [28, 72], [72, 72]] };
  const dieSvg = (n) => `<svg viewBox="0 0 100 100" class="pl-die"><rect x="4" y="4" width="92" height="92" rx="20" fill="#fff" stroke="#241B3A" stroke-width="5"/>${PIPS[n].map((p) => `<circle cx="${p[0]}" cy="${p[1]}" r="8.5" fill="#241B3A"/>`).join('')}</svg>`;
  const COL = { merah: '#E33E57', biru: '#3B82F6', hijau: '#17C3B2' };
  const ball = (c, i = 0, size = '') => `<span class="pl-ball" style="--c:${c};--i:${i}${size ? ';width:' + size + 'px;height:' + size + 'px' : ''}"></span>`;
  const coinSvg = '<svg viewBox="0 0 60 60" class="pl-float f2"><circle cx="30" cy="30" r="26" fill="#f2c94c" stroke="#b8860b" stroke-width="4"/><text x="30" y="39" text-anchor="middle" font-size="26" font-weight="800" fill="#7a4b00">G</text></svg>';

  // ---------- Materi ----------
  const materi = () => `
<div class="lesson-sections pl">
  <div class="content-card pl-hero pl-rv">
    <div class="pl-float f1">${dieSvg(5)}</div>${coinSvg}<div class="pl-float f3">${ball(COL.merah)}${ball(COL.biru)}</div>
    <h3>🎲 Peluang: seberapa mungkin sesuatu terjadi</h3>
    <p style="max-width:560px">Peluang dipakai saat hasil belum pasti: lempar dadu, undian, atau cuaca besok. Nilainya selalu antara <b>0 sampai 1</b> (0% sampai 100%).</p>
    <div class="pl-meter"><i>P</i></div>
    <div class="pl-meter-l"><span>0 · mustahil</span><span>½ · sama mungkin</span><span>1 · pasti</span></div>
  </div>

  <div class="content-card pl-materi">
    <div class="pl-tabs">
      <button class="pl-tab on" data-p="s">🎯 Peluang sederhana</button>
      <button class="pl-tab" data-p="k">🔄 Peluang komplemen</button>
      <button class="pl-tab" data-p="m">🔗 Kejadian majemuk</button>
    </div>

    <div class="pl-panel on" data-p="s">
      <div class="formula-stack"><div class="formula">P(A) = n(A) ÷ n(S)</div><div class="formula">n(A) = hasil yang diinginkan · n(S) = semua hasil yang mungkin</div></div>
      <div class="pl-rv">
        <h4>🎲 Dadu: kejadian A = muncul angka genap</h4>
        <div class="pl-row pl-faces pl-pop">${[1, 2, 3, 4, 5, 6].map((i) => `<div class="${i % 2 ? '' : 'on'}">${dieSvg(i)}</div>`).join('')}</div>
        <p class="pl-cap">n(A) = 3 (2, 4, 6) · n(S) = 6 → P(A) = <span style="color:var(--pl)">3/6 = ½</span></p>
      </div>
      <div class="pl-rv">
        <h4>🧺 Contoh: bola dalam kantong</h4>
        <p>Kantong berisi 3 bola merah dan 2 bola biru. Satu bola diambil acak. Berapa peluang terambil bola biru?</p>
        <div class="pl-row pl-pop">${[COL.merah, COL.merah, COL.merah, COL.biru, COL.biru].map((c) => ball(c, 0, 46)).join('')}</div>
        <ol class="step-list"><li>Semua hasil: 3 + 2 = <b>5</b> bola → n(S) = 5.</li><li>Hasil yang diinginkan (biru): n(A) = <b>2</b>.</li><li>P(biru) = 2/5 = <b>0,4 = 40%</b>.</li></ol>
      </div>
      <div class="tip">💡 Rumus ini hanya berlaku jika semua hasil <b>sama mungkin</b> (dadu dan koin yang adil). Tulis ruang sampel dulu sebelum menghitung.</div>
    </div>

    <div class="pl-panel" data-p="k">
      <div class="formula-stack"><div class="formula">P(A′) = 1 − P(A)</div><div class="formula">P(A) + P(A′) = 1</div></div>
      <p>Komplemen A (ditulis A′) adalah kejadian <b>A tidak terjadi</b>. Kalau menghitung A susah, hitung lawannya lalu kurangkan dari 1.</p>
      <div class="pl-rv">
        <h4>🌦️ Contoh: peluang hujan</h4>
        <div class="pl-split" style="--w:30%"><div class="a"><span class="pl-cloud">🌧️</span> hujan 0,3</div><div class="c"><span class="pl-sun">☀️</span> tidak hujan 0,7</div></div>
        <ol class="step-list"><li>Peluang hujan P(A) = 0,3.</li><li>P(tidak hujan) = 1 − 0,3 = <b>0,7 = 70%</b>.</li></ol>
      </div>
      <div class="pl-rv">
        <h4>🎲 Contoh: dadu tidak muncul angka 6</h4>
        <div class="pl-row pl-faces pl-pop">${[1, 2, 3, 4, 5].map((i) => `<div class="on">${dieSvg(i)}</div>`).join('')}<div>${dieSvg(6)}</div></div>
        <p class="pl-cap">P(6) = 1/6 → P(bukan 6) = 1 − 1/6 = <span style="color:var(--pl)">5/6</span></p>
      </div>
      <div class="pl-rv real-life" style="--accent:#E33E57"><b>Trik “minimal satu”</b><p>Tiga koin dilempar. Peluang muncul <b>minimal satu gambar</b>? Lawannya adalah “semuanya angka”: (½)³ = 1/8. Jadi P = 1 − 1/8 = <b>7/8</b>. Jauh lebih cepat daripada mendata satu per satu.</p></div>
    </div>

    <div class="pl-panel" data-p="m">
      <p>Kejadian majemuk adalah gabungan dua kejadian: <b>A atau B</b> (gabungan, ∪) dan <b>A dan B</b> (irisan, ∩).</p>
      <div class="pl-rule pl-rv">
        <svg class="pl-venn" viewBox="0 0 280 140"><circle cx="85" cy="70" r="48" fill="#E33E57"/><circle cx="195" cy="70" r="48" fill="#17C3B2"/><text x="85" y="75" text-anchor="middle">A</text><text x="195" y="75" text-anchor="middle">B</text></svg>
        <div><span class="pl-badge">Saling lepas</span><h4>Tidak punya anggota bersama</h4><div class="formula">P(A ∪ B) = P(A) + P(B)</div><p>Dadu: A = muncul 2, B = muncul 5. P = 1/6 + 1/6 = <b>1/3</b>.</p></div>
      </div>
      <div class="pl-rule pl-rv">
        <svg class="pl-venn" viewBox="0 0 280 140"><circle cx="110" cy="70" r="52" fill="#E33E57"/><circle cx="170" cy="70" r="52" fill="#17C3B2"/><text x="85" y="75" text-anchor="middle">A</text><text x="195" y="75" text-anchor="middle">B</text><text x="140" y="75" text-anchor="middle">6</text></svg>
        <div><span class="pl-badge">Tidak saling lepas</span><h4>Ada irisan, jangan dihitung dua kali</h4><div class="formula">P(A ∪ B) = P(A) + P(B) − P(A ∩ B)</div><p>Kartu 1–10: A = genap {2,4,6,8,10}, B = kelipatan 3 {3,6,9}. Irisan {6}. P = 5/10 + 3/10 − 1/10 = <b>7/10</b>.</p></div>
      </div>
      <div class="pl-rule pl-rv">
        <svg class="pl-venn pl-tree" viewBox="0 0 360 180"><g fill="none"><path class="pl-line" pathLength="1" style="--i:0" d="M30 90 C80 90 90 40 140 40"/><path class="pl-line" pathLength="1" style="--i:0" d="M30 90 C80 90 90 140 140 140"/><path class="pl-line" pathLength="1" style="--i:1" d="M170 40 C210 40 220 18 260 18"/><path class="pl-line" pathLength="1" style="--i:1" d="M170 40 C210 40 220 66 260 66"/><path class="pl-line" pathLength="1" style="--i:1" d="M170 140 C210 140 220 118 260 118"/><path class="pl-line" pathLength="1" style="--i:1" d="M170 140 C210 140 220 166 260 166"/></g><circle r="6" fill="#E33E57" style="transform:none;opacity:1;animation:none"><animateMotion dur="3.2s" begin="1.6s" repeatCount="indefinite" path="M30 90 C80 90 90 40 140 40 L170 40 C210 40 220 18 260 18"/></circle><text style="--i:0" x="4" y="94">Koin</text><text style="--i:0" x="145" y="44">G</text><text style="--i:0" x="145" y="144">A</text><text style="--i:1" x="265" y="22">5 (1/6)</text><text style="--i:1" x="265" y="70">bukan 5</text><text style="--i:1" x="265" y="122">5</text><text style="--i:1" x="265" y="170">bukan 5</text></svg>
        <div><span class="pl-badge">Saling bebas</span><h4>Hasil yang satu tidak memengaruhi yang lain</h4><div class="formula">P(A ∩ B) = P(A) × P(B)</div><p>Koin dan dadu dilempar bersamaan. P(gambar dan angka 5) = 1/2 × 1/6 = <b>1/12</b>.</p></div>
      </div>
      <div class="tip">💡 Kata “<b>atau</b>” → jumlahkan (kurangi irisan). Kata “<b>dan</b>” pada kejadian saling bebas → kalikan.</div>
    </div>
  </div>

  ${materi2()}

  <div class="content-card" style="text-align:center">
    <h3>🎯 Materi Peluang</h3>
    <p>Apakah kamu sudah selesai membaca dan memahami seluruh materi ini?</p>
    <button type="button" id="completeMateriBtn" class="gradient-btn">Tandai Sudah Membaca dan Paham</button>
    <p style="margin-top:12px;font-size:13px;color:#888">Progres akan tersimpan setelah tombol diklik.</p>
  </div>
</div>`;

  // ---------- Materi lanjutan ----------
  const materi2 = () => {
    const pairs = []; for (let i = 1; i <= 6; i++) for (let j = 1; j <= 6; j++) pairs.push([i, j]);
    const g36 = (hl, txt) => `<div class="pl-g36 pl-pop">${pairs.map(([i, j]) => `<div class="pl-cell ${hl(i, j) ? 'hl' : 'dm'}">${txt(i, j)}</div>`).join('')}</div>`;
    const suits = ['♠', '♥', '♦', '♣'];
    const deck = suits.flatMap((st, si) => Array.from({ length: 13 }, (_, r) => {
      const isA = r === 0, isH = st === '♥';
      return `<div class="pl-cell ${si === 1 || si === 2 ? 'r' : ''} ${isA && isH ? 'ab' : isA ? 'a' : isH ? 'b' : ''}">${['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K'][r]}${st}</div>`;
    })).join('');
    return `
  <div class="content-card pl-sec">
    <h3><span class="pl-ic">🧮</span>Ruang sampel: daftar semua kemungkinan</h3>
    <p>Sebelum menghitung peluang, tulis dulu semua hasil yang mungkin. Untuk dua percobaan sekaligus, pakai <b>tabel</b> atau <b>pasangan hasil</b> supaya tidak ada yang terlewat.</p>
    <div class="pl-rv">
      <h4>🪙 Dua koin dilempar</h4>
      <div class="pl-chips pl-pop"><span>GG</span><span class="hl">GA</span><span class="hl">AG</span><span>AA</span></div>
      <p class="pl-cap">n(S) = 4 · tepat satu gambar = {GA, AG} → P = 2/4 = <span style="color:var(--pl)">½</span></p>
    </div>
    <div class="pl-rv">
      <h4>🎲🎲 Dua dadu: jumlah mata = 7</h4>
      ${g36((i, j) => i + j === 7, (i, j) => i + '+' + j)}
      <p class="pl-cap">n(S) = 6 × 6 = 36 · jumlah 7 ada 6 pasangan → P = 6/36 = <span style="color:var(--pl)">1/6</span></p>
    </div>
    <div class="tip">💡 Banyak hasil dua percobaan = hasil percobaan 1 × hasil percobaan 2. Dua dadu → 36, tiga koin → 2×2×2 = 8.</div>
  </div>

  <div class="content-card pl-sec">
    <h3><span class="pl-ic">📈</span>Frekuensi harapan</h3>
    <p>Frekuensi harapan adalah perkiraan berapa kali kejadian muncul jika percobaan diulang n kali.</p>
    <div class="formula">Fh(A) = P(A) × n</div>
    <div class="pl-rv">
      <h4>🎲 Dadu dilempar 60 kali</h4>
      <div class="pl-fhb">${[1, 2, 3, 4, 5, 6].map((i) => `<div style="--i:${i}"><i style="--h:10;--i:${i}"></i><span>${i}</span></div>`).join('')}</div>
      <p class="pl-cap">Setiap sisi diharapkan muncul 1/6 × 60 = <span style="color:var(--pl)">10 kali</span></p>
    </div>
    <div class="pl-rv">
      <h4>🌧️ Peluang hujan 0,3 selama 30 hari</h4>
      <div class="pl-days pl-pop">${Array.from({ length: 30 }, (_, i) => `<div class="pl-cell ${i < 9 ? 'hl' : ''}">${i < 9 ? '🌧️' : '☀️'}</div>`).join('')}</div>
      <p class="pl-cap">Fh = 0,3 × 30 = <span style="color:var(--pl)">9 hari hujan</span></p>
    </div>
    <div class="real-life" style="--accent:#E33E57"><b>Harapan bukan jaminan</b><p>Hasil nyata bisa meleset. Semakin banyak percobaan, hasilnya semakin dekat ke harapan. Coba buktikan sendiri di tab Coba Interaktif.</p></div>
  </div>

  <div class="content-card pl-sec">
    <h3><span class="pl-ic">🔄</span>Komplemen pada dua percobaan</h3>
    <p>Dua dadu dilempar. Berapa peluang muncul <b>minimal satu angka 6</b>? Mendata langsung itu ribet, jadi pakai komplemen: hitung peluang <b>tidak ada 6 sama sekali</b>.</p>
    <div class="pl-rv">
      ${g36((i, j) => i === 6 || j === 6, (i, j) => i + ',' + j)}
      <div class="pl-legend"><span><i style="background:var(--pl)"></i>minimal satu 6 (11 pasangan)</span><span><i style="background:#ddd"></i>tanpa 6 (25 pasangan)</span></div>
      <ol class="step-list"><li>Tanpa 6 pada satu dadu: 5/6. Dua dadu: 5/6 × 5/6 = <b>25/36</b>.</li><li>Minimal satu 6 = 1 − 25/36 = <b>11/36</b>.</li></ol>
    </div>
  </div>

  <div class="content-card pl-sec">
    <h3><span class="pl-ic">🃏</span>Kejadian majemuk: kartu remi</h3>
    <p>Satu kartu diambil dari 52 kartu remi. A = kartu As, B = kartu Hati (♥). Kartu <b>As Hati</b> termasuk A <i>dan</i> B, jadi hanya boleh dihitung sekali.</p>
    <div class="pl-rv">
      <div class="pl-deck pl-pop">${deck}</div>
      <div class="pl-legend"><span><i style="background:var(--pl)"></i>As (4)</span><span><i style="background:var(--pl-b)"></i>Hati (13)</span><span><i style="background:linear-gradient(135deg,var(--pl) 50%,var(--pl-b) 50%)"></i>As Hati (1)</span></div>
      <ol class="step-list"><li>P(A) = 4/52, P(B) = 13/52, P(A ∩ B) = 1/52.</li><li>P(A ∪ B) = 4/52 + 13/52 − 1/52 = 16/52 = <b>4/13</b>.</li></ol>
    </div>
    <div class="pl-rv"><h4>🎲🎲 Contoh saling bebas: dua dadu</h4><p>Peluang dadu pertama genap <b>dan</b> dadu kedua lebih dari 4: P = 3/6 × 2/6 = 6/36 = <b>1/6</b>.</p>
      <div class="pl-row pl-faces pl-pop"><div class="on">${dieSvg(4)}</div><div class="on">${dieSvg(6)}</div><span style="font-size:28px">×</span><div class="on">${dieSvg(5)}</div><div class="on">${dieSvg(6)}</div></div></div>
  </div>

  <div class="content-card pl-sec">
    <h3><span class="pl-ic">🧭</span>Cara memilih rumus yang tepat</h3>
    <p>Baca kata kunci pada soal, lalu pilih jalurnya.</p>
    <div class="pl-flow pl-rv pl-pop">
      <div class="pl-step" style="--c:#E33E57"><span class="pl-ic">🔄</span><b>“tidak”, “minimal satu”</b><small>Pakai komplemen: 1 − P(A)</small></div>
      <div class="pl-step" style="--c:#17C3B2"><span class="pl-ic">➕</span><b>“atau”</b><small>Jumlahkan. Ada irisan? Kurangi P(A ∩ B).</small></div>
      <div class="pl-step" style="--c:#7C3AED"><span class="pl-ic">✖️</span><b>“dan”, saling bebas</b><small>Kalikan: P(A) × P(B)</small></div>
    </div>
    <div class="pl-oops pl-rv"><b>⚠️ Kesalahan yang sering terjadi</b><ul><li>Lupa mengurangi irisan pada kejadian yang tidak saling lepas.</li><li>Menjumlahkan padahal soal berkata “dan” (seharusnya dikalikan).</li><li>Menghitung n(S) tidak lengkap, misalnya dua dadu dikira 12 hasil padahal 36.</li><li>Hasil peluang lebih dari 1 atau negatif. Itu pasti salah, cek ulang.</li></ul></div>
  </div>

  <div class="content-card pl-sec">
    <h3><span class="pl-ic">🌍</span>Peluang di kehidupan nyata</h3>
    <div class="pl-apps pl-rv pl-pop">
      <div class="pl-app"><div class="pl-ic">⛅</div><b>Prakiraan cuaca</b><p>“Peluang hujan 70%” berarti P(hujan) = 0,7 dan P(tidak hujan) = 0,3.</p></div>
      <div class="pl-app"><div class="pl-ic">🎟️</div><b>Undian</b><p>Dari 500 kupon, peluang satu kupon menang hadiah utama adalah 1/500.</p></div>
      <div class="pl-app"><div class="pl-ic">🏭</div><b>Kontrol kualitas</b><p>Pabrik memperkirakan jumlah produk cacat memakai frekuensi harapan.</p></div>
      <div class="pl-app"><div class="pl-ic">🎮</div><b>Game</b><p>Peluang drop item langka dan serangan kritis dihitung dengan rumus yang sama.</p></div>
    </div>
  </div>

  <div class="content-card pl-sec">
    <h3><span class="pl-ic">📝</span>Ringkasan rumus</h3>
    <table class="mini-table"><tr><th>Materi</th><th>Rumus</th><th>Kata kunci</th></tr>
    <tr><td>Peluang sederhana</td><td>P(A) = n(A) ÷ n(S)</td><td>peluang muncul…</td></tr>
    <tr><td>Komplemen</td><td>P(A′) = 1 − P(A)</td><td>tidak, minimal satu</td></tr>
    <tr><td>Frekuensi harapan</td><td>Fh = P(A) × n</td><td>diperkirakan berapa kali</td></tr>
    <tr><td>Saling lepas</td><td>P(A ∪ B) = P(A) + P(B)</td><td>atau, tidak mungkin bersamaan</td></tr>
    <tr><td>Tidak saling lepas</td><td>P(A) + P(B) − P(A ∩ B)</td><td>atau, ada irisan</td></tr>
    <tr><td>Saling bebas</td><td>P(A ∩ B) = P(A) × P(B)</td><td>dan, tidak memengaruhi</td></tr></table>
  </div>`;
  };

  // ---------- Simulator (markup) ----------
  const sim = () => `
<div class="pl">
  <div class="content-card pl-hero"><h3>🎲 Simulator Peluang</h3><p>Lempar, ambil, dan pilih sendiri kejadiannya. Hasil percobaan akan mendekati nilai teori kalau kamu mengulang cukup banyak.</p>
    <div class="pl-tabs" id="plSimTabs"><button class="pl-tab on" data-p="s">🎯 Sederhana</button><button class="pl-tab" data-p="k">🔄 Komplemen</button><button class="pl-tab" data-p="m">🔗 Majemuk</button></div></div>

  <div class="pl-panel on" data-p="s"><div class="content-card"><div class="pl-sim">
    <div><h3>Lempar dadu</h3><p>Pilih sisi dadu yang kamu inginkan (kejadian A):</p><div class="pl-pick" id="plFaces"></div>
      <div class="pl-btns"><button id="plRoll1">Lempar 1×</button><button id="plRoll50">Lempar 50×</button><button class="alt" id="plRollReset">Reset</button></div>
      <div class="pl-readout" id="plSRead"></div></div>
    <div class="pl-stage"><div id="plBigDie"></div><b>Frekuensi tiap sisi</b><div class="pl-bars" id="plBars"></div></div></div></div></div>

  <div class="pl-panel" data-p="k"><div class="content-card"><div class="pl-sim">
    <div><h3>Toples kelereng</h3><p>Atur isi toples, pilih warna target (A), lalu lihat komplemennya.</p>
      <div class="control"><label>Merah <output id="plRo">4</output></label><input type="range" id="plR" min="1" max="8" value="4" style="accent-color:#E33E57"></div>
      <div class="control"><label>Biru <output id="plBo">3</output></label><input type="range" id="plB" min="1" max="8" value="3" style="accent-color:#3B82F6"></div>
      <div class="control"><label>Hijau <output id="plHo">2</output></label><input type="range" id="plH" min="0" max="8" value="2" style="accent-color:#17C3B2"></div>
      <div class="pl-pick" id="plTarget"></div>
      <div class="pl-btns"><button id="plComp" class="alt">Tampilkan komplemen A′</button><button id="plDraw">Ambil 1 kelereng</button></div></div>
    <div class="pl-stage"><div class="pl-jar" id="plJar"></div><div class="pl-drawn" id="plDrawn"></div>
      <div class="pl-split" id="plKSplit" style="margin-top:6px"><div class="a" id="plKa"></div><div class="c" id="plKc"></div></div>
      <div class="pl-readout" id="plKRead" style="text-align:left"></div></div></div></div></div>

  <div class="pl-panel" data-p="m"><div class="content-card">
    <h3>Gabungan dua kejadian</h3><p>Angka 1–20. Pilih kejadian A dan B, lalu lihat apakah saling lepas.</p>
    <div class="pl-sel"><label>Kejadian A<select id="plA"></select></label><label>Kejadian B<select id="plBb"></select></label></div>
    <div class="pl-grid" id="plGrid"></div><div class="pl-readout" id="plMRead"></div></div>
  <div class="content-card"><h3>Koin dan dadu (saling bebas)</h3>
    <div class="pl-sim"><div><div class="pl-sel"><label>Koin<select id="plCoinT"><option value="G">Gambar</option><option value="A">Angka</option></select></label><label>Dadu<select id="plDieT">${[1, 2, 3, 4, 5, 6].map((i) => `<option>${i}</option>`).join('')}</select></label></div>
      <div class="pl-btns"><button id="plBothRoll">Lempar keduanya</button><button class="alt" id="plBothReset">Reset</button></div><div class="pl-readout" id="plBRead"></div></div>
    <div class="pl-stage"><div class="pl-duo"><div class="pl-coin" id="plCoin">G</div><div id="plDie2"></div></div></div></div></div></div>
</div>`;

  // ---------- Util UI ----------
  const io = 'IntersectionObserver' in window ? new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('pl-in'); io.unobserve(e.target); } }), { threshold: 0.15 }) : null;
  function reveal(root) {
    root.querySelectorAll('.pl-pop').forEach((p) => [...p.children].forEach((c, i) => c.style.setProperty('--i', i)));
    root.querySelectorAll('.pl-rv').forEach((e) => { if (!io) return e.classList.add('pl-in'); e.classList.remove('pl-in'); io.unobserve(e); void e.offsetWidth; io.observe(e); });
  }
  function materiTabs(root) {
    const box = root.querySelector('.pl-materi');
    box.querySelectorAll(':scope > .pl-tabs .pl-tab').forEach((b) => (b.onclick = () => {
      box.querySelectorAll(':scope > .pl-tabs .pl-tab').forEach((x) => x.classList.toggle('on', x === b));
      box.querySelectorAll(':scope > .pl-panel').forEach((p) => p.classList.toggle('on', p.dataset.p === b.dataset.p));
      reveal(root);
    }));
  }
  const setDie = (el, n) => { el.innerHTML = dieSvg(n); const s = el.firstElementChild; s.classList.add('pl-big'); return s; };

  // ---------- Simulator (logika) ----------
  function bindSim() {
    const root = document.getElementById('tab-coba');
    root.querySelectorAll('#plSimTabs .pl-tab').forEach((b) => (b.onclick = () => {
      root.querySelectorAll('#plSimTabs .pl-tab').forEach((x) => x.classList.toggle('on', x === b));
      root.querySelectorAll('.pl > .pl-panel').forEach((p) => p.classList.toggle('on', p.dataset.p === b.dataset.p));
    }));

    // 1) Sederhana
    const T = new Set([2, 4, 6]); let cnt = Array(7).fill(0), n = 0, busy = false;
    const faces = $('plFaces'), bars = $('plBars'), big = $('plBigDie');
    faces.innerHTML = [1, 2, 3, 4, 5, 6].map((i) => `<button class="pl-face" data-f="${i}">${dieSvg(i)}</button>`).join('');
    bars.innerHTML = [1, 2, 3, 4, 5, 6].map((i) => `<div class="pl-bar"><i style="height:0"></i><span>${i}</span></div>`).join('');
    setDie(big, 1);
    const drawS = () => {
      faces.querySelectorAll('.pl-face').forEach((b) => b.classList.toggle('on', T.has(+b.dataset.f)));
      const mx = Math.max(1, ...cnt);
      bars.querySelectorAll('.pl-bar').forEach((bar, k) => { bar.classList.toggle('t', T.has(k + 1)); bar.firstElementChild.style.height = (cnt[k + 1] / mx * 100) + '%'; });
      const hit = [...T].reduce((s, f) => s + cnt[f], 0);
      $('plSRead').innerHTML = T.size ? `Teori: P(A) = <b>${T.size}/6 = ${pct(T.size, 6)}</b><br>Percobaan: <b>${hit}/${n}</b> ${n ? '= ' + pct(hit, n) : ''}` : 'Pilih minimal satu sisi dadu.';
    };
    faces.querySelectorAll('.pl-face').forEach((b) => (b.onclick = () => { const f = +b.dataset.f; T.has(f) ? T.delete(f) : T.add(f); drawS(); mark(); }));
    $('plRoll1').onclick = () => {
      if (busy) return; busy = true; mark();
      let t = 0; setDie(big, rnd(6)).classList.add('roll');
      const iv = setInterval(() => { setDie(big, rnd(6)).classList.add('roll'); if (++t > 6) clearInterval(iv); }, 80);
      setTimeout(() => { const f = rnd(6); setDie(big, f); cnt[f]++; n++; drawS(); busy = false; }, 620);
    };
    $('plRoll50').onclick = () => { for (let i = 0; i < 50; i++) { cnt[rnd(6)]++; n++; } drawS(); mark(); };
    $('plRollReset').onclick = () => { cnt = Array(7).fill(0); n = 0; drawS(); };
    drawS();

    // 2) Komplemen
    let tgt = 'merah', comp = false, drawsN = 0, drawsHit = 0;
    const K = { merah: $('plR'), biru: $('plB'), hijau: $('plH') };
    $('plTarget').innerHTML = Object.keys(COL).map((k) => `<button class="pl-chip${k === tgt ? ' on' : ''}" data-c="${k}" style="--c:${COL[k]}">${ball(COL[k], 0, 18)}${k}</button>`).join('');
    const drawK = () => {
      const cn = {}; let tot = 0;
      for (const k in K) { cn[k] = +K[k].value; tot += cn[k]; }
      $('plRo').textContent = cn.merah; $('plBo').textContent = cn.biru; $('plHo').textContent = cn.hijau;
      $('plJar').innerHTML = Object.keys(COL).flatMap((k) => Array(cn[k]).fill(k)).map((k, i) => `<span class="pl-ball ${(comp ? k === tgt : k !== tgt) ? 'dim' : ''}" style="--c:${COL[k]};--i:${i}"></span>`).join('');
      const a = cn[tgt];
      $('plKa').style.flexBasis = (a / tot * 100) + '%'; $('plKc').style.flexBasis = ((tot - a) / tot * 100) + '%';
      $('plKa').textContent = a ? `A: ${frac(a, tot)}` : ''; $('plKc').textContent = tot - a ? `A′: ${frac(tot - a, tot)}` : '';
      $('plKRead').innerHTML = `Total kelereng: <b>${tot}</b><br>P(A) = <b>${frac(a, tot)}</b> (${pct(a, tot)})<br>P(A′) = 1 − ${frac(a, tot)} = <b>${frac(tot - a, tot)}</b> (${pct(tot - a, tot)})` + (drawsN ? `<br>Terambil target: <b>${drawsHit}/${drawsN}</b> kali` : '');
      $('plComp').textContent = comp ? 'Tampilkan A (target)' : 'Tampilkan komplemen A′';
    };
    Object.values(K).forEach((el) => (el.oninput = () => { drawsN = drawsHit = 0; drawK(); mark(); }));
    $('plTarget').querySelectorAll('.pl-chip').forEach((b) => (b.onclick = () => { tgt = b.dataset.c; $('plTarget').querySelectorAll('.pl-chip').forEach((x) => x.classList.toggle('on', x === b)); drawsN = drawsHit = 0; drawK(); mark(); }));
    $('plComp').onclick = () => { comp = !comp; drawK(); mark(); };
    $('plDraw').onclick = () => {
      const pool = Object.keys(COL).flatMap((k) => Array(+K[k].value).fill(k)); const pick = pool[Math.floor(Math.random() * pool.length)];
      drawsN++; if (pick === tgt) drawsHit++;
      drawK(); $('plDrawn').innerHTML = ball(COL[pick]); mark();
    };
    drawK();

    // 3a) Gabungan dua kejadian
    const SETS = { 'Genap': (x) => x % 2 === 0, 'Ganjil': (x) => x % 2 === 1, 'Kelipatan 3': (x) => x % 3 === 0, 'Kelipatan 4': (x) => x % 4 === 0, 'Kelipatan 5': (x) => x % 5 === 0, 'Prima': (x) => [2, 3, 5, 7, 11, 13, 17, 19].includes(x), 'Kurang dari 6': (x) => x < 6, 'Lebih dari 15': (x) => x > 15 };
    const names = Object.keys(SETS), opt = (s) => names.map((k, i) => `<option${i === s ? ' selected' : ''}>${k}</option>`).join('');
    $('plA').innerHTML = opt(0); $('plBb').innerHTML = opt(2);
    $('plGrid').innerHTML = Array.from({ length: 20 }, (_, i) => `<div class="pl-cell">${i + 1}</div>`).join('');
    const drawM = () => {
      const fa = SETS[$('plA').value], fb = SETS[$('plBb').value]; let a = 0, b = 0, ab = 0;
      $('plGrid').querySelectorAll('.pl-cell').forEach((c, i) => {
        const x = i + 1, ia = fa(x), ib = fb(x); a += ia ? 1 : 0; b += ib ? 1 : 0; ab += ia && ib ? 1 : 0;
        c.className = 'pl-cell' + (ia && ib ? ' ab' : ia ? ' a' : ib ? ' b' : '');
      });
      const u = a + b - ab;
      $('plMRead').innerHTML = `n(A) = ${a}, n(B) = ${b}, n(A ∩ B) = ${ab}<br><span class="pl-badge">${ab ? 'Tidak saling lepas' : 'Saling lepas'}</span><br>` +
        (ab ? `P(A ∪ B) = ${a}/20 + ${b}/20 − ${ab}/20 = <b>${frac(u, 20)}</b>` : `P(A ∪ B) = ${a}/20 + ${b}/20 = <b>${frac(u, 20)}</b>`) + ` (${pct(u, 20)})`;
    };
    $('plA').onchange = $('plBb').onchange = () => { drawM(); mark(); };
    drawM();

    // 3b) Koin & dadu (saling bebas)
    let bn = 0, bhit = 0, bbusy = false;
    const bRead = () => { $('plBRead').innerHTML = `Teori: P = 1/2 × 1/6 = <b>1/12 = ${pct(1, 12)}</b><br>Percobaan: <b>${bhit}/${bn}</b> ${bn ? '= ' + pct(bhit, bn) : ''}`; };
    $('plCoinT').onchange = $('plDieT').onchange = () => { bn = bhit = 0; bRead(); };
    $('plBothRoll').onclick = () => {
      if (bbusy) return; bbusy = true; mark();
      const coin = $('plCoin'), d2 = $('plDie2'); coin.classList.remove('flip'); void coin.offsetWidth; coin.classList.add('flip'); setDie(d2, rnd(6)).classList.add('roll');
      setTimeout(() => {
        const c = Math.random() < 0.5 ? 'G' : 'A', f = rnd(6); coin.textContent = c; setDie(d2, f);
        bn++;
        if (c === $('plCoinT').value && f === +$('plDieT').value) { bhit++; $('plBRead').classList.add('pl-hit'); setTimeout(() => $('plBRead').classList.remove('pl-hit'), 800); }
        bRead(); bbusy = false;
      }, 760);
    };
    $('plBothReset').onclick = () => { bn = bhit = 0; bRead(); };
    bRead(); setDie($('plDie2'), 1);
  }

  // ---------- Hook ke sistem modul (chaining, sama seperti geometry.js) ----------
  const prevMat = window.getModuleMaterial, prevSim = window.getModuleSimulator, prevBind = window.bindSimulator;
  window.getModuleMaterial = (id) => (id === 'peluang' ? materi() : prevMat(id));
  window.getModuleSimulator = (id) => (id === 'peluang' ? sim() : prevSim(id));
  window.bindSimulator = (id) => {
    if (id !== 'peluang') return prevBind(id);
    const m = document.getElementById('tab-materi'); materiTabs(m); reveal(m);
    // Klik dadu / bola pada materi untuk animasi guling
    m.addEventListener('click', (e) => {
      const el = e.target.closest('.pl-faces .pl-die, .pl-row .pl-ball, .pl-chips span');
      if (!el) return;
      el.classList.remove('roll'); void el.getBoundingClientRect(); el.classList.add('roll');
      el.addEventListener('animationend', () => el.classList.remove('roll'), { once: true });
    });
    bindSim();
  };

  // ---------- Bank soal (3 materi) ----------
  if (window.quizBanks) window.quizBanks.peluang = [
    ['Dadu dilempar sekali. Peluang muncul bilangan prima adalah…', ['1/6', '1/3', '1/2', '2/3'], 2, 'Prima: 2, 3, 5 → 3 hasil dari 6 → 3/6 = 1/2.'],
    ['Kantong berisi 4 bola merah dan 6 bola putih. Peluang terambil bola merah…', ['1/4', '2/5', '3/5', '2/3'], 1, 'n(A) = 4, n(S) = 10 → 4/10 = 2/5.'],
    ['Peluang hujan besok 0,35. Peluang tidak hujan…', ['0,35', '0,55', '0,65', '0,75'], 2, 'P(A′) = 1 − P(A) = 1 − 0,35 = 0,65.'],
    ['Dadu dilempar. Peluang tidak muncul mata 6…', ['1/6', '1/2', '2/3', '5/6'], 3, 'P(6) = 1/6, komplemennya 1 − 1/6 = 5/6.'],
    ['Tiga koin dilempar. Peluang muncul minimal satu gambar…', ['1/8', '3/8', '1/2', '7/8'], 3, 'Komplemen: semua angka = 1/8. Jadi 1 − 1/8 = 7/8.'],
    ['Dadu dilempar. Peluang muncul genap atau 5 (saling lepas)…', ['1/2', '3/5', '2/3', '5/6'], 2, 'Genap {2,4,6} + {5} = 4 hasil → 4/6 = 2/3.'],
    ['Kartu 1–10. Peluang terambil genap atau kelipatan 3…', ['8/10', '7/10', '6/10', '5/10'], 1, '5/10 + 3/10 − 1/10 (angka 6) = 7/10.'],
    ['Koin dan dadu dilempar bersamaan. Peluang gambar dan angka 5…', ['1/12', '1/8', '1/6', '1/2'], 0, 'Saling bebas: 1/2 × 1/6 = 1/12.']
  ];
})();
