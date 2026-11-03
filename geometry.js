/*
  INTERAKSI GEOMETRI RUANG
  Simulasi: Kubus & Balok 3D, Tabung, Kerucut, Bola, dan Misi Tangki Air.
*/

// ===== Override materi (tab 📖 Materi): gabungkan rumus + contoh jadi panel interaktif =====
window._prevGeoGetModuleMaterial = window.getModuleMaterial;

const GEO_SHAPES = {
  kubus: { icon:'🧊', name:'Kubus',
    formula:`<div class="formula-stack"><div class="formula">Volume = s³</div><div class="formula">Luas permukaan = 6s²</div></div>`,
    example:`<h4>📦 Contoh: Kotak es batu</h4><p>Kotak es batu berbentuk kubus dengan panjang rusuk 4 cm.</p><ol class="step-list"><li>Volume = s³ = 4³ = <b>64 cm³</b>.</li><li>Luas permukaan = 6s² = 6 × 16 = <b>96 cm²</b>.</li></ol>` },
  balok: { icon:'📦', name:'Balok',
    formula:`<div class="formula-stack"><div class="formula">Volume = p × l × t</div><div class="formula">Luas permukaan = 2(pl + pt + lt)</div></div>`,
    example:`<h4>📦 Contoh: Kardus kemasan</h4><p>Kardus berukuran panjang 30 cm, lebar 20 cm, tinggi 15 cm.</p><ol class="step-list"><li>Volume = p × l × t = 30 × 20 × 15 = <b>9.000 cm³</b> (9 liter).</li><li>Luas permukaan = 2(pl+pt+lt) = 2(600+450+300) = <b>2.700 cm²</b> — inilah luas kardus yang perlu dicetak.</li></ol>` },
  prisma: { icon:'🔺', name:'Prisma',
    formula:`<div class="formula-stack"><div class="formula">Volume = luas alas × tinggi prisma</div><div class="formula">Luas permukaan = (2 × luas alas) + (keliling alas × tinggi prisma)</div></div>`,
    example:`<h4>🍫 Contoh: Cokelat batangan segitiga</h4><p>Prisma segitiga siku-siku dengan alas 6 cm, tinggi segitiga 8 cm, sisi miring 10 cm, dan panjang prisma 15 cm.</p><ol class="step-list"><li>Luas alas segitiga = ½ × 6 × 8 = <b>24 cm²</b>.</li><li>Volume = luas alas × tinggi prisma = 24 × 15 = <b>360 cm³</b>.</li><li>Keliling alas = 6+8+10 = 24 cm.</li><li>Luas permukaan = (2×24) + (24×15) = 48+360 = <b>408 cm²</b>.</li></ol>` },
  limas: { icon:'🏔️', name:'Limas',
    formula:`<div class="formula-stack"><div class="formula">Volume = ⅓ × luas alas × tinggi</div><div class="formula">Luas permukaan = luas alas + jumlah luas sisi tegak</div></div>`,
    example:`<h4>🏠 Contoh: Atap rumah limas</h4><p>Limas segiempat beralas persegi sisi 10 cm dengan tinggi 12 cm.</p><ol class="step-list"><li>Luas alas = 10 × 10 = <b>100 cm²</b>.</li><li>Volume = ⅓ × 100 × 12 = <b>400 cm³</b>.</li><li>Tinggi sisi tegak (apotema) = √(12²+5²) = √169 = <b>13 cm</b>.</li><li>Luas satu sisi tegak = ½×10×13 = 65 cm²; 4 sisi tegak = 260 cm².</li><li>Luas permukaan = 100+260 = <b>360 cm²</b>.</li></ol>` },
  tabung: { icon:'🥫', name:'Tabung',
    formula:`<div class="formula-stack"><div class="formula">Volume = πr²t</div><div class="formula">Luas permukaan = 2πr(r + t)</div></div>`,
    example:`<h4>🥛 Contoh: Kaleng susu</h4><p>Kaleng susu berjari-jari 4 cm dan tinggi 12 cm. Gunakan π ≈ 3,14.</p><ol class="step-list"><li>Volume = πr²t = 3,14 × 16 × 12 = <b>602,88 cm³</b>.</li><li>Luas permukaan = 2πr(r+t) = 2×3,14×4×16 = <b>401,92 cm²</b>.</li></ol>` },
  kerucut: { icon:'🍦', name:'Kerucut',
    formula:`<div class="formula-stack"><div class="formula">Volume = ⅓πr²t</div><div class="formula">Luas permukaan = πr(r + s), dengan s = √(r² + t²)</div></div>`,
    example:`<h4>🎉 Contoh: Topi ulang tahun</h4><p>Topi kerucut punya jari-jari alas 7 cm dan tinggi 24 cm.</p><ol class="step-list"><li>Garis pelukis s = √(7²+24²) = √625 = <b>25 cm</b>.</li><li>Volume = ⅓πr²t = ⅓×(22/7)×49×24 = <b>1.232 cm³</b>.</li><li>Luas selimut = πrs = (22/7)×7×25 = <b>550 cm²</b> (tanpa alas, karena topi terbuka di bawah).</li></ol>` },
  bola: { icon:'⚽', name:'Bola',
    formula:`<div class="formula-stack"><div class="formula">Volume = 4∕3 πr³</div><div class="formula">Luas permukaan = 4πr²</div></div>`,
    example:`<h4>🏀 Contoh: Bola basket</h4><p>Bola basket punya jari-jari 12 cm. Gunakan π ≈ 3,14.</p><ol class="step-list"><li>Volume = 4∕3πr³ = 1,33×3,14×1.728 ≈ <b>7.234 cm³</b>.</li><li>Luas permukaan = 4πr² = 4×3,14×144 = <b>1.808,64 cm²</b>.</li></ol>` }
};

window.selectGeoShape = function(shape) {
  const data = GEO_SHAPES[shape];
  if (!data) return;
  const panel = document.getElementById('geoShapePanel');
  if (panel) {
    panel.classList.remove('geo-fade-in');
    void panel.offsetWidth; // reflow, biar animasinya bisa diulang tiap klik
    panel.innerHTML = data.formula + data.example;
    panel.classList.add('geo-fade-in');
  }
  document.querySelectorAll('.geo-shape-btn').forEach(b => b.classList.toggle('active', b.dataset.shape === shape));
};

window.getModuleMaterial = function(id) {
  if (id === 'geometri') {
    const accent = '#7C3AED';
    const shapeButtons = Object.entries(GEO_SHAPES).map(([key, d], i) =>
      `<button class="geo-shape-btn${i===0?' active':''}" data-shape="${key}" onclick="window.selectGeoShape('${key}')">${d.icon} ${d.name}</button>`
    ).join('');
    const firstShape = Object.values(GEO_SHAPES)[0];
    return `<div class="lesson-sections">
<div class="content-card"><h3>📦 Geometri Ruang: dunia yang punya isi</h3><p><b>Geometri ruang</b> (bangun ruang) mempelajari bentuk-bentuk <b>tiga dimensi</b> — punya panjang, lebar, <i>dan</i> tinggi — berbeda dengan geometri datar yang hanya punya dua dimensi. Setiap kali kamu mengisi air ke dalam botol, membeli kaleng susu, membungkus kado, mengecat tandon air, atau merancang kemasan produk, kamu sedang berurusan dengan geometri ruang.</p><p>Dua besaran utama yang dicari pada bangun ruang: <b>volume</b> (seberapa banyak ruang/isi yang bisa ditampung) dan <b>luas permukaan</b> (total luas seluruh sisi yang membungkus bangun tersebut, penting untuk menghitung bahan seperti kertas kado, cat, atau seng).</p></div>
<div class="content-card"><div class="concept-grid"><div class="concept-box"><h4>📦 Bangun sisi datar</h4><p>Semua sisinya berbentuk bidang datar (segi banyak): kubus, balok, prisma, limas.</p></div><div class="concept-box"><h4>🥫 Bangun sisi lengkung</h4><p>Punya sisi yang melengkung: tabung, kerucut, dan bola.</p></div></div>
<h4 style="margin-top:22px">🖼️ Galeri 7 Bangun Ruang</h4>
<div class="geo-app-grid geo-gallery-grid geo-reveal">
<div class="geo-app-card"><div class="geo-gallery-icon"><svg viewBox="0 0 120 110" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="giDieTop" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#ffffff"/><stop offset="100%" stop-color="#eef0f5"/></linearGradient><linearGradient id="giDieLeft" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#d7dbe4"/><stop offset="100%" stop-color="#b7bdcc"/></linearGradient><linearGradient id="giDieRight" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#9aa0b3"/><stop offset="100%" stop-color="#7d8399"/></linearGradient></defs><polygon points="60,8 100,28 60,48 20,28" fill="url(#giDieTop)" stroke="#c9cddb" stroke-width="1"/><polygon points="20,28 60,48 60,98 20,78" fill="url(#giDieLeft)"/><polygon points="60,48 100,28 100,78 60,98" fill="url(#giDieRight)"/><circle cx="60" cy="18" r="3" fill="#2b2b2b"/><circle cx="46" cy="26" r="3" fill="#2b2b2b"/><circle cx="74" cy="26" r="3" fill="#2b2b2b"/><circle cx="46" cy="34" r="3" fill="#2b2b2b"/><circle cx="74" cy="34" r="3" fill="#2b2b2b"/></svg></div><h4>Kubus</h4><p><b>Ciri:</b> 6 sisi persegi sama besar</p><p><b>Contoh:</b> Dadu, kotak es</p></div>
<div class="geo-app-card"><div class="geo-gallery-icon"><svg viewBox="0 0 120 110" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="giBoxTop" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#e3c393"/><stop offset="100%" stop-color="#cf9f5f"/></linearGradient><linearGradient id="giBoxLeft" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#b9884b"/><stop offset="100%" stop-color="#9c6f39"/></linearGradient><linearGradient id="giBoxRight" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#8c6234"/><stop offset="100%" stop-color="#71502a"/></linearGradient></defs><polygon points="60,10 106,28 60,46 14,28" fill="url(#giBoxTop)"/><polygon points="14,28 60,46 60,94 14,76" fill="url(#giBoxLeft)"/><polygon points="60,46 106,28 106,76 60,94" fill="url(#giBoxRight)"/><line x1="60" y1="10" x2="60" y2="46" stroke="#7d5a30" stroke-width="1.5"/><line x1="14" y1="28" x2="60" y2="46" stroke="#7d5a30" stroke-width="1"/><line x1="106" y1="28" x2="60" y2="46" stroke="#7d5a30" stroke-width="1"/></svg></div><h4>Balok</h4><p><b>Ciri:</b> 6 sisi persegi panjang berpasangan</p><p><b>Contoh:</b> Kardus, kulkas</p></div>
<div class="geo-app-card"><div class="geo-gallery-icon"><svg viewBox="0 0 120 110" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="giPrismFront" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#8a5a35"/><stop offset="100%" stop-color="#6b4423"/></linearGradient><linearGradient id="giPrismSide" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#c8946a"/><stop offset="100%" stop-color="#a06b41"/></linearGradient></defs><polygon points="20,94 80,94 50,34" fill="url(#giPrismFront)"/><polygon points="80,94 50,34 78,20 108,80" fill="url(#giPrismSide)"/><line x1="65" y1="64" x2="93" y2="50" stroke="#8a5a35" stroke-width="1.5"/><line x1="72.5" y1="79" x2="100.5" y2="65" stroke="#8a5a35" stroke-width="1.5"/></svg></div><h4>Prisma Segitiga</h4><p><b>Ciri:</b> 2 alas segitiga + 3 sisi tegak</p><p><b>Contoh:</b> Atap tenda, cokelat Toblerone</p></div>
<div class="geo-app-card"><div class="geo-gallery-icon"><svg viewBox="0 0 120 110" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="giPyraLeft" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#d9a441"/><stop offset="100%" stop-color="#b57e24"/></linearGradient><linearGradient id="giPyraRight" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#f0c876"/><stop offset="100%" stop-color="#d9a441"/></linearGradient></defs><polygon points="60,10 15,70 60,95" fill="url(#giPyraLeft)"/><polygon points="60,10 60,95 105,70" fill="url(#giPyraRight)"/><line x1="60" y1="10" x2="60" y2="95" stroke="#8f631c" stroke-width="1.2"/></svg></div><h4>Limas Segiempat</h4><p><b>Ciri:</b> Alas segiempat, sisi tegak bertemu di puncak</p><p><b>Contoh:</b> Piramida, atap rumah</p></div>
<div class="geo-app-card"><div class="geo-gallery-icon"><svg viewBox="0 0 110 110" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="giCanBody" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#cbd5e1"/><stop offset="35%" stop-color="#f1f5f9"/><stop offset="60%" stop-color="#94a3b8"/><stop offset="100%" stop-color="#cbd5e1"/></linearGradient></defs><ellipse cx="55" cy="24" rx="34" ry="12" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1"/><rect x="21" y="24" width="68" height="62" fill="url(#giCanBody)"/><rect x="21" y="46" width="68" height="18" fill="#E33E57"/><ellipse cx="55" cy="86" rx="34" ry="12" fill="#94a3b8"/><ellipse cx="55" cy="24" rx="34" ry="12" fill="none" stroke="#7d8698" stroke-width="1.5"/></svg></div><h4>Tabung</h4><p><b>Ciri:</b> 2 alas lingkaran + selimut lengkung</p><p><b>Contoh:</b> Kaleng, pipa, drum</p></div>
<div class="geo-app-card"><div class="geo-gallery-icon"><svg viewBox="0 0 110 110" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="giConeBody" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#e3ab5c"/><stop offset="100%" stop-color="#c07f2e"/></linearGradient><radialGradient id="giScoop" cx="35%" cy="30%" r="70%"><stop offset="0%" stop-color="#ffe3ee"/><stop offset="100%" stop-color="#ff8fb8"/></radialGradient></defs><polygon points="55,50 30,100 80,100" fill="url(#giConeBody)"/><line x1="38" y1="63" x2="72" y2="74" stroke="#a5691f" stroke-width="1"/><line x1="34" y1="78" x2="76" y2="89" stroke="#a5691f" stroke-width="1"/><line x1="55" y1="50" x2="34" y2="78" stroke="#a5691f" stroke-width="1"/><line x1="55" y1="50" x2="76" y2="89" stroke="#a5691f" stroke-width="1"/><ellipse cx="55" cy="46" rx="26" ry="14" fill="url(#giScoop)"/><circle cx="55" cy="22" r="15" fill="url(#giScoop)"/></svg></div><h4>Kerucut</h4><p><b>Ciri:</b> Alas lingkaran, selimut meruncing</p><p><b>Contoh:</b> Topi ultah, es krim cone</p></div>
<div class="geo-app-card"><div class="geo-gallery-icon"><svg viewBox="0 0 110 110" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="giBallShade" cx="35%" cy="30%" r="70%"><stop offset="0%" stop-color="#ffb066"/><stop offset="55%" stop-color="#f07d1e"/><stop offset="100%" stop-color="#b5540a"/></radialGradient></defs><circle cx="55" cy="55" r="45" fill="url(#giBallShade)"/><path d="M55,10 Q35,55 55,100" fill="none" stroke="#2b1608" stroke-width="2.2"/><path d="M55,10 Q75,55 55,100" fill="none" stroke="#2b1608" stroke-width="2.2"/><path d="M10,55 Q55,40 100,55" fill="none" stroke="#2b1608" stroke-width="2.2"/><path d="M10,55 Q55,70 100,55" fill="none" stroke="#2b1608" stroke-width="2.2"/></svg></div><h4>Bola</h4><p><b>Ciri:</b> Seluruh sisi lengkung, jarak ke pusat sama</p><p><b>Contoh:</b> Bola basket, globe</p></div>
</div>
</div>
<div class="content-card">
<h3>📐 Rumus &amp; Contoh per Bangun Ruang</h3>
<p>Klik salah satu bangun ruang di bawah untuk melihat rumus dan contoh soalnya.</p>
<div class="geo-shape-picker">${shapeButtons}</div>
<div class="geo-shape-panel geo-fade-in" id="geoShapePanel">${firstShape.formula}${firstShape.example}</div>
</div>
<div class="content-card"><h3>🧩 Jaring-jaring bangun ruang</h3><p>Jika sisi-sisi sebuah bangun ruang "dibuka" dan direbahkan menjadi bidang datar, hasilnya disebut <b>jaring-jaring</b>. Konsep ini sangat berguna untuk menghitung luas permukaan karena setiap potongan pada jaring-jaring bisa dihitung luasnya satu per satu lalu dijumlahkan.</p><div class="concept-grid"><div class="concept-box"><h4>Jaring-jaring kubus</h4><p>Terdiri dari 6 buah persegi identik yang tersusun dalam berbagai pola (misalnya bentuk salib).</p></div><div class="concept-box"><h4>Jaring-jaring tabung</h4><p>Terdiri dari 2 lingkaran (alas & tutup) dan 1 persegi panjang (selimut) dengan panjang = keliling lingkaran = 2πr.</p></div><div class="concept-box"><h4>Jaring-jaring kerucut</h4><p>Terdiri dari 1 lingkaran (alas) dan 1 juring lingkaran (selimut) dengan jari-jari juring = garis pelukis s.</p></div><div class="concept-box"><h4>Jaring-jaring limas</h4><p>Terdiri dari 1 alas segi banyak dan beberapa segitiga sisi tegak yang bertemu di satu titik puncak.</p></div></div></div>
<div class="content-card"><h3>🏗️ Gabungan bangun ruang</h3><p>Banyak benda nyata sebenarnya gabungan dari dua bangun ruang atau lebih. Volumenya dihitung dengan <b>menjumlahkan</b> (jika digabung) atau <b>mengurangkan</b> (jika salah satunya berupa lubang/rongga).</p>
<div class="geo-combo-grid geo-reveal">
<div class="geo-combo-visual">
<svg viewBox="0 0 160 210" xmlns="http://www.w3.org/2000/svg">
<defs><linearGradient id="geoSiloBody" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#5b21b6"/><stop offset="45%" stop-color="#8b5cf6"/><stop offset="100%" stop-color="#5b21b6"/></linearGradient><linearGradient id="geoSiloRoof" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#4c1d95"/><stop offset="50%" stop-color="#a78bfa"/><stop offset="100%" stop-color="#4c1d95"/></linearGradient></defs>
<polygon class="geo-draw" points="80,15 25,72 135,72" fill="url(#geoSiloRoof)"/>
<rect class="geo-draw" x="25" y="72" width="110" height="105" fill="url(#geoSiloBody)"/>
<ellipse cx="80" cy="72" rx="55" ry="13" fill="#c4b5fd"/>
<ellipse class="geo-draw" cx="80" cy="177" rx="55" ry="13" fill="#4c1d95"/>
<line x1="15" y1="72" x2="15" y2="177" stroke="#241B3A" stroke-width="1.5"/><line x1="10" y1="72" x2="20" y2="72" stroke="#241B3A" stroke-width="1.5"/><line x1="10" y1="177" x2="20" y2="177" stroke="#241B3A" stroke-width="1.5"/>
<text x="2" y="128" font-size="11" fill="#241B3A" font-family="monospace">8 m</text>
<line x1="150" y1="15" x2="150" y2="72" stroke="#241B3A" stroke-width="1.5"/><line x1="145" y1="15" x2="155" y2="15" stroke="#241B3A" stroke-width="1.5"/><line x1="145" y1="72" x2="155" y2="72" stroke="#241B3A" stroke-width="1.5"/>
<text x="152" y="47" font-size="11" fill="#241B3A" font-family="monospace">2 m</text>
<text x="60" y="130" font-size="11" fill="#fff" font-family="monospace">r = 3 m</text>
</svg>
</div>
<div>
<h4>Contoh: Silo penyimpanan gandum</h4><p>Sebuah silo berbentuk tabung dengan atap kerucut. Jari-jari 3 m, tinggi tabung 8 m, tinggi kerucut 2 m. Gunakan π ≈ 3,14.</p><ol class="step-list"><li>Volume tabung = πr²t = 3,14 × 9 × 8 = <b>226,08 m³</b>.</li><li>Volume kerucut = ⅓πr²t = ⅓ × 3,14 × 9 × 2 = <b>18,84 m³</b>.</li><li>Volume total silo = 226,08 + 18,84 = <b>244,92 m³</b>.</li></ol>
</div>
</div>
<div class="geo-combo-grid geo-reveal">
<div class="geo-combo-visual">
<svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
<defs><radialGradient id="geoPipeGrad" cx="35%" cy="35%" r="70%"><stop offset="0%" stop-color="#c4b5fd"/><stop offset="55%" stop-color="#8b5cf6"/><stop offset="100%" stop-color="#4c1d95"/></radialGradient><pattern id="geoPipeHatch" width="7" height="7" patternTransform="rotate(45)" patternUnits="userSpaceOnUse"><line x1="0" y1="0" x2="0" y2="7" stroke="#c4b5fd" stroke-width="2"/></pattern></defs>
<circle class="geo-draw" cx="80" cy="80" r="65" fill="url(#geoPipeGrad)"/>
<circle class="geo-draw" cx="80" cy="80" r="65" fill="url(#geoPipeHatch)" opacity=".35"/>
<circle class="geo-draw" cx="80" cy="80" r="38" fill="#FBF7FF"/>
<line x1="80" y1="80" x2="80" y2="15" stroke="#241B3A" stroke-width="1.5" stroke-dasharray="3,3"/>
<text x="86" y="45" font-size="11" fill="#241B3A" font-family="monospace">R = 5 cm</text>
<line x1="80" y1="80" x2="80" y2="42" stroke="#241B3A" stroke-width="1.5"/>
<text x="86" y="65" font-size="11" fill="#241B3A" font-family="monospace">r = 3 cm</text>
</svg>
</div>
<div>
<h4>Contoh: Pipa besi berongga</h4><p>Pipa berbentuk tabung besar (r = 5 cm) dengan lubang tabung kecil di tengahnya (r = 3 cm), panjang pipa 20 cm.</p><ol class="step-list"><li>Volume tabung luar = π × 5² × 20 = 500π cm³.</li><li>Volume tabung dalam (rongga) = π × 3² × 20 = 180π cm³.</li><li>Volume besi pipa = 500π − 180π = 320π ≈ <b>1.004,8 cm³</b>.</li></ol>
</div>
</div>
</div>
<div class="content-card"><h3>🌍 Penerapan di dunia nyata</h3><p>Geometri ruang dipakai di banyak bidang pekerjaan — bukan cuma di buku pelajaran.</p>
<div class="geo-app-grid geo-reveal">
<div class="geo-app-card"><div class="geo-app-icon" style="background:linear-gradient(135deg,#7C3AED,#c4b5fd)">🏗️</div><h4>Arsitektur & Konstruksi</h4><p>Menghitung volume beton, kapasitas tandon air, atap limas/prisma.</p></div>
<div class="geo-app-card"><div class="geo-app-icon" style="background:linear-gradient(135deg,#FF9F1C,#ffd699)">📦</div><h4>Kemasan & Industri</h4><p>Merancang kardus, kaleng, botol agar hemat bahan tapi muat banyak.</p></div>
<div class="geo-app-card"><div class="geo-app-icon" style="background:linear-gradient(135deg,#17C3B2,#9ce8dd)">🚚</div><h4>Logistik</h4><p>Menghitung kapasitas kontainer, truk box, dan gudang penyimpanan.</p></div>
<div class="geo-app-card"><div class="geo-app-icon" style="background:linear-gradient(135deg,#FF4D8D,#ffbdd6)">🍰</div><h4>Kuliner</h4><p>Menentukan ukuran cetakan kue, cup es krim, dan kaleng makanan.</p></div>
<div class="geo-app-card"><div class="geo-app-icon" style="background:linear-gradient(135deg,#3B82F6,#bfdbfe)">🔬</div><h4>Sains & Teknik</h4><p>Menghitung volume tangki, pipa, komponen mesin silinder/bola.</p></div>
</div>
<p class="tip" style="margin-top:18px">💡 Produsen kemasan sering memilih bentuk <b>tabung</b> dibanding <b>balok</b> untuk kaleng karena pada volume yang sama, tabung cenderung memakai luas permukaan (bahan) yang lebih hemat.</p></div>
<div class="content-card"><div class="real-life" style="--accent:${accent}"><b>Perhatikan satuan volume!</b><p>1 liter = 1.000 cm³ = 1 dm³. Saat soal memberi ukuran dalam meter tapi bertanya liter, ubah dulu ke desimeter (dm) sebelum menghitung volume, karena 1 m³ = 1.000 liter.</p></div><div class="tip" style="margin-top:14px">💡 <b>Tips:</b> selalu tentukan dulu jenis bangunnya, gambar sketsanya, dan tandai ukuran yang diketahui (rusuk, panjang, lebar, tinggi, jari-jari). Untuk luas permukaan, bayangkan jaring-jaringnya — ini membantu memastikan tidak ada sisi yang terlewat atau malah terhitung dua kali.</div></div>
</div>`;
  }
  return window._prevGeoGetModuleMaterial(id);
};

// Simpan referensi fungsi simulator sebelumnya agar tidak tertimpa (Chaining)
window._prevGeoGetModuleSimulator = window.getModuleSimulator;
window._prevGeoBindSimulator = window.bindSimulator;

window.getModuleSimulator = function(id) {
  if (id === 'geometri') {
    return `
    <div class="geo-interactive">
      <div class="content-card geo-hero-card">
        <div class="eyebrow">🔎 EKSPERIMEN GEOMETRI RUANG</div>
        <h3>Bangun Ruang di Ujung Jarimu</h3>
        <p>Geser ukurannya, lihat bentuknya berubah secara langsung, dan pantau volume serta luas permukaannya berubah seketika.</p>
        <div class="geo-chip-row">
          <span>📦 Balok 3D</span><span>🥫 Tabung</span><span>🍦 Kerucut</span><span>⚽ Bola</span><span>🎯 Misi</span>
        </div>
      </div>

      <div class="content-card">
        <h3>📦 1. Kubus &amp; Balok — Kotak 3D Putar</h3>
        <p>Atur panjang, lebar, dan tinggi. Kotaknya berputar pelan supaya kamu bisa lihat semua sisinya.</p>
        <div class="geo-sim-grid">
          <div>
            <div class="control"><label>Panjang <output id="geoBoxLenOut">6 cm</output></label><input id="geoBoxLen" type="range" min="2" max="10" value="6"></div>
            <div class="control"><label>Lebar <output id="geoBoxWidOut">4 cm</output></label><input id="geoBoxWid" type="range" min="2" max="10" value="4"></div>
            <div class="control"><label>Tinggi <output id="geoBoxHgtOut">5 cm</output></label><input id="geoBoxHgt" type="range" min="2" max="10" value="5"></div>
            <div class="geo-stat-row">
              <div><small>Volume</small><b id="geoBoxVolume">120 cm³</b></div>
              <div><small>Luas permukaan</small><b id="geoBoxSurface">148 cm²</b></div>
            </div>
            <p class="geo-note" id="geoBoxShapeNote">Panjang, lebar, dan tinggi berbeda → ini <b>balok</b>.</p>
          </div>
          <div class="geo-visual geo-box-visual">
            <div class="geo-box-stage">
              <div class="geo-cube" id="geoCube">
                <div class="geo-face geo-front"></div>
                <div class="geo-face geo-back"></div>
                <div class="geo-face geo-right"></div>
                <div class="geo-face geo-left"></div>
                <div class="geo-face geo-top"></div>
                <div class="geo-face geo-bottom"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="content-card">
        <h3>🥫 2. Tabung — Kaleng Minuman</h3>
        <p>Ubah jari-jari alas dan tinggi tabung. Perhatikan bagaimana volume naik jauh lebih cepat saat jari-jari membesar dibanding saat tinggi membesar.</p>
        <div class="geo-sim-grid">
          <div>
            <div class="control"><label>Jari-jari <output id="geoCylRadOut">4 cm</output></label><input id="geoCylRad" type="range" min="1" max="10" value="4"></div>
            <div class="control"><label>Tinggi <output id="geoCylHgtOut">10 cm</output></label><input id="geoCylHgt" type="range" min="2" max="20" value="10"></div>
            <div class="geo-stat-row">
              <div><small>Volume</small><b id="geoCylVolume">502,4 cm³</b></div>
              <div><small>Luas permukaan</small><b id="geoCylSurface">351,7 cm²</b></div>
            </div>
          </div>
          <div class="geo-visual">
            <div class="geo-cylinder" id="geoCylinder">
              <div class="geo-cyl-top"></div>
              <div class="geo-cyl-body"></div>
              <div class="geo-cyl-bottom"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="content-card">
        <h3>🍦 3. Kerucut — Topi &amp; Es Krim</h3>
        <p>Atur jari-jari dan tinggi kerucut. Garis pelukis (sisi miring selimut) dihitung otomatis dengan Pythagoras.</p>
        <div class="geo-sim-grid">
          <div>
            <div class="control"><label>Jari-jari <output id="geoConeRadOut">5 cm</output></label><input id="geoConeRad" type="range" min="1" max="10" value="5"></div>
            <div class="control"><label>Tinggi <output id="geoConeHgtOut">12 cm</output></label><input id="geoConeHgt" type="range" min="2" max="20" value="12"></div>
            <div class="geo-stat-row">
              <div><small>Garis pelukis (s)</small><b id="geoConeSlant">13,00 cm</b></div>
              <div><small>Volume</small><b id="geoConeVolume">314,0 cm³</b></div>
            </div>
            <div class="geo-stat-row">
              <div><small>Luas permukaan</small><b id="geoConeSurface">282,6 cm²</b></div>
            </div>
          </div>
          <div class="geo-visual">
            <div class="geo-cone-wrap"><div class="geo-cone" id="geoCone"></div><div class="geo-cone-base"></div></div>
          </div>
        </div>
      </div>

      <div class="content-card">
        <h3>⚽ 4. Bola — Ukuran Sebenarnya</h3>
        <p>Untuk bangun sisi lengkung ini hanya ada satu ukuran yang menentukan segalanya: <b>jari-jari</b>.</p>
        <div class="geo-sim-grid">
          <div>
            <div class="control"><label>Jari-jari <output id="geoSphereRadOut">10 cm</output></label><input id="geoSphereRad" type="range" min="2" max="20" value="10"></div>
            <div class="geo-stat-row">
              <div><small>Volume</small><b id="geoSphereVolume">4.186,7 cm³</b></div>
              <div><small>Luas permukaan</small><b id="geoSphereSurface">1.256,0 cm²</b></div>
            </div>
          </div>
          <div class="geo-visual">
            <div class="geo-sphere" id="geoSphere"></div>
          </div>
        </div>
      </div>

      <div class="content-card geo-mission-card">
        <h3>🎯 5. Misi: Rancang Tangki Air</h3>
        <p>Sebuah tangki air berbentuk <b>tabung</b> dengan tutup atas <b>kerucut</b> (seperti silo). Hitung <b>total volumenya</b>, lalu masukkan tebakanmu.</p>
        <div class="geo-mission" id="geoMissionText">Memuat misi...</div>
        <div class="geo-mission-input">
          <input id="geoMissionAnswer" type="number" step="any" placeholder="Volume total (m³)">
          <button class="gradient-btn" id="geoMissionCheck">Cek Jawaban</button>
          <button class="soft-btn" id="geoMissionNew">Misi Baru</button>
        </div>
        <div class="geo-mission-feedback" id="geoMissionFeedback"></div>
      </div>
    </div>`;
  }
  return window._prevGeoGetModuleSimulator(id);
};

window.bindSimulator = function(id) {
  if (id === 'geometri') {
    const PI = Math.PI;

    // ===== 0. Animasi reveal untuk ilustrasi "Gabungan bangun ruang" =====
    const geoRevealEls = document.querySelectorAll('#tab-materi .geo-reveal');
    if (geoRevealEls.length) {
      const geoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('geo-in');
            geoObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });
      geoRevealEls.forEach(el => { el.classList.remove('geo-in'); geoObserver.observe(el); });
    }

    // ===== 1. Kubus & Balok =====
    const bLen = document.getElementById('geoBoxLen');
    const bWid = document.getElementById('geoBoxWid');
    const bHgt = document.getElementById('geoBoxHgt');
    const cube = document.getElementById('geoCube');

    function updateBox() {
      const p = +bLen.value, l = +bWid.value, t = +bHgt.value;
      document.getElementById('geoBoxLenOut').textContent = p + ' cm';
      document.getElementById('geoBoxWidOut').textContent = l + ' cm';
      document.getElementById('geoBoxHgtOut').textContent = t + ' cm';

      const vol = p * l * t;
      const surf = 2 * (p * l + p * t + l * t);
      document.getElementById('geoBoxVolume').textContent = fmtNum(vol) + ' cm³';
      document.getElementById('geoBoxSurface').textContent = fmtNum(surf) + ' cm²';

      const isCube = (p === l && l === t);
      document.getElementById('geoBoxShapeNote').innerHTML = isCube
        ? 'Panjang, lebar, dan tinggi sama besar → ini <b>kubus</b>.'
        : 'Panjang, lebar, dan tinggi berbeda → ini <b>balok</b>.';

      // Skala visual (px per cm)
      const scale = 9;
      const w = p * scale, h = t * scale, d = l * scale;
      cube.style.width = w + 'px';
      cube.style.height = h + 'px';

      const front = cube.querySelector('.geo-front');
      const back = cube.querySelector('.geo-back');
      const right = cube.querySelector('.geo-right');
      const left = cube.querySelector('.geo-left');
      const top = cube.querySelector('.geo-top');
      const bottom = cube.querySelector('.geo-bottom');

      front.style.width = back.style.width = w + 'px';
      front.style.height = back.style.height = h + 'px';
      front.style.transform = `translateZ(${d/2}px)`;
      back.style.transform = `translateZ(${-d/2}px) rotateY(180deg)`;

      right.style.width = left.style.width = d + 'px';
      right.style.height = left.style.height = h + 'px';
      right.style.transform = `rotateY(90deg) translateZ(${w/2}px)`;
      left.style.transform = `rotateY(-90deg) translateZ(${w/2}px)`;

      top.style.width = bottom.style.width = w + 'px';
      top.style.height = bottom.style.height = d + 'px';
      top.style.transform = `rotateX(90deg) translateZ(${h/2}px)`;
      bottom.style.transform = `rotateX(-90deg) translateZ(${h/2}px)`;

      Progress.setCoba(id);
    }
    bLen.oninput = bWid.oninput = bHgt.oninput = updateBox;
    updateBox();

    // ===== 2. Tabung =====
    const cRad = document.getElementById('geoCylRad');
    const cHgt = document.getElementById('geoCylHgt');
    const cylinder = document.getElementById('geoCylinder');

    function updateCylinder() {
      const r = +cRad.value, t = +cHgt.value;
      document.getElementById('geoCylRadOut').textContent = r + ' cm';
      document.getElementById('geoCylHgtOut').textContent = t + ' cm';

      const vol = PI * r * r * t;
      const surf = 2 * PI * r * (r + t);
      document.getElementById('geoCylVolume').textContent = fmtNum(vol) + ' cm³';
      document.getElementById('geoCylSurface').textContent = fmtNum(surf) + ' cm²';

      const scale = 8;
      cylinder.style.width = (r * 2 * scale) + 'px';
      cylinder.style.height = (t * scale) + 'px';
      const ellipseH = Math.max(10, r * scale * 0.45);
      cylinder.querySelectorAll('.geo-cyl-top, .geo-cyl-bottom').forEach(el => el.style.height = ellipseH + 'px');

      Progress.setCoba(id);
    }
    cRad.oninput = cHgt.oninput = updateCylinder;
    updateCylinder();

    // ===== 3. Kerucut =====
    const knRad = document.getElementById('geoConeRad');
    const knHgt = document.getElementById('geoConeHgt');
    const cone = document.getElementById('geoCone');

    function updateCone() {
      const r = +knRad.value, t = +knHgt.value;
      document.getElementById('geoConeRadOut').textContent = r + ' cm';
      document.getElementById('geoConeHgtOut').textContent = t + ' cm';

      const s = Math.sqrt(r * r + t * t);
      const vol = (1/3) * PI * r * r * t;
      const surf = PI * r * (r + s);
      document.getElementById('geoConeSlant').textContent = s.toFixed(2).replace('.', ',') + ' cm';
      document.getElementById('geoConeVolume').textContent = fmtNum(vol) + ' cm³';
      document.getElementById('geoConeSurface').textContent = fmtNum(surf) + ' cm²';

      const scale = 9;
      const baseW = r * 2 * scale;
      const heightPx = t * scale;
      cone.style.borderLeftWidth = (baseW / 2) + 'px';
      cone.style.borderRightWidth = (baseW / 2) + 'px';
      cone.style.borderBottomWidth = heightPx + 'px';
      document.querySelector('.geo-cone-base').style.width = baseW + 'px';

      Progress.setCoba(id);
    }
    knRad.oninput = knHgt.oninput = updateCone;
    updateCone();

    // ===== 4. Bola =====
    const spRad = document.getElementById('geoSphereRad');
    const sphere = document.getElementById('geoSphere');

    function updateSphere() {
      const r = +spRad.value;
      document.getElementById('geoSphereRadOut').textContent = r + ' cm';

      const vol = (4/3) * PI * r * r * r;
      const surf = 4 * PI * r * r;
      document.getElementById('geoSphereVolume').textContent = fmtNum(vol) + ' cm³';
      document.getElementById('geoSphereSurface').textContent = fmtNum(surf) + ' cm²';

      const scale = 9;
      const size = Math.min(220, r * 2 * scale);
      sphere.style.width = size + 'px';
      sphere.style.height = size + 'px';

      Progress.setCoba(id);
    }
    spRad.oninput = updateSphere;
    updateSphere();

    // ===== 5. Misi Tangki Air =====
    let mission = {};
    function newMission() {
      const r = rndInt(2, 5);
      const cylH = rndInt(4, 9);
      const coneH = rndInt(2, 4);
      const cylVol = PI * r * r * cylH;
      const coneVol = (1/3) * PI * r * r * coneH;
      const total = cylVol + coneVol;
      mission = { r, cylH, coneH, total };
      document.getElementById('geoMissionText').innerHTML =
        `Tangki berbentuk tabung dengan jari-jari <b>${r} m</b> dan tinggi tabung <b>${cylH} m</b>, ditutup kerucut setinggi <b>${coneH} m</b> dengan jari-jari alas yang sama. Gunakan π ≈ 3,14. Berapa <b>total volume</b> tangki (m³)?`;
      document.getElementById('geoMissionAnswer').value = '';
      document.getElementById('geoMissionFeedback').textContent = '';
    }
    newMission();

    document.getElementById('geoMissionCheck').onclick = () => {
      const guess = parseFloat(document.getElementById('geoMissionAnswer').value);
      const fb = document.getElementById('geoMissionFeedback');
      if (isNaN(guess)) { fb.textContent = 'Isi dulu jawabanmu ya.'; return; }
      const tolerance = mission.total * 0.03;
      const correctText = fmtNum(mission.total) + ' m³';
      if (Math.abs(guess - mission.total) <= tolerance) {
        fb.innerHTML = `✅ <b>Tepat!</b> Volume tabung + volume kerucut = ${correctText}.`;
        Progress.setCoba(id);
      } else {
        fb.innerHTML = `❌ Belum pas. Jawaban sebenarnya sekitar <b>${correctText}</b> (V tabung + V kerucut, hitung terpisah lalu jumlahkan).`;
      }
    };
    document.getElementById('geoMissionNew').onclick = newMission;

    function rndInt(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
    function fmtNum(n) {
      return n.toLocaleString('id-ID', { minimumFractionDigits: n % 1 === 0 ? 0 : 1, maximumFractionDigits: 1 });
    }
    return;
  }
  return window._prevGeoBindSimulator(id);
};