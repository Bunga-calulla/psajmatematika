/*
  PETUALANGAN SPLDV bersama Nera (timbangan ajaib).
  Bagian 1: karakter, hero, dan kerangka HTML tiap seksi. Interaksi ada di spldv-fun-adv-wire.js
*/
window.NRADV = (function () {
  const wavePath = (w, h, amp, periods, phase) => {
    let d = 'M0 ' + h;
    for (let x = 0; x <= w; x += 20) d += ' L' + x + ' ' + (h / 2 + Math.sin(x / w * periods * Math.PI * 2 + phase) * amp).toFixed(1);
    return d + ' L' + w + ' ' + h + ' Z';
  };

  const neraSvg = () => `
<svg class="nr-nera" viewBox="0 0 200 200" aria-hidden="true" focusable="false">
  <ellipse class="nr-shadow" cx="100" cy="192" rx="62" ry="7" fill="rgba(36,27,58,.14)"/>
  <g class="nr-body">
    <g class="nr-beam">
      <line x1="22" y1="62" x2="178" y2="62" stroke="#241B3A" stroke-width="6" stroke-linecap="round"/>
      <g class="nr-panL">
        <path d="M22 62 L4 106 M22 62 L40 106" stroke="#241B3A" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M0 106 H44 Q44 124 22 124 Q0 124 0 106Z" fill="#FFE08A" stroke="#241B3A" stroke-width="4" stroke-linejoin="round"/>
        <circle cx="22" cy="95" r="10" fill="#3B82F6" stroke="#241B3A" stroke-width="3"/>
        <text x="22" y="99.5" text-anchor="middle" font-family="monospace" font-weight="800" font-size="13" fill="#fff">x</text>
      </g>
      <g class="nr-panR">
        <path d="M178 62 L160 106 M178 62 L196 106" stroke="#241B3A" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M156 106 H200 Q200 124 178 124 Q156 124 156 106Z" fill="#FFE08A" stroke="#241B3A" stroke-width="4" stroke-linejoin="round"/>
        <circle cx="178" cy="95" r="10" fill="#FF4D8D" stroke="#241B3A" stroke-width="3"/>
        <text x="178" y="99.5" text-anchor="middle" font-family="monospace" font-weight="800" font-size="13" fill="#fff">y</text>
      </g>
    </g>
    <rect x="64" y="72" width="72" height="104" rx="30" fill="#17C3B2" stroke="#241B3A" stroke-width="6"/>
    <circle cx="100" cy="62" r="8" fill="#FFE08A" stroke="#241B3A" stroke-width="4"/>
    <ellipse class="nr-eye" cx="85" cy="108" rx="5" ry="7" fill="#241B3A"/>
    <ellipse class="nr-eye" cx="115" cy="108" rx="5" ry="7" fill="#241B3A"/>
    <circle cx="76" cy="124" r="5.5" fill="#FF4D8D" opacity=".5"/><circle cx="124" cy="124" r="5.5" fill="#FF4D8D" opacity=".5"/>
    <path class="nr-mouth" d="M90 124 Q100 136 110 124" fill="none" stroke="#241B3A" stroke-width="4.5" stroke-linecap="round"/>
    <text x="100" y="161" text-anchor="middle" font-family="monospace" font-weight="800" font-size="20" fill="#fff" opacity=".9">=</text>
    <ellipse cx="86" cy="178" rx="15" ry="6.5" fill="#FF4D8D" stroke="#241B3A" stroke-width="4"/>
    <ellipse cx="114" cy="178" rx="15" ry="6.5" fill="#FF4D8D" stroke="#241B3A" stroke-width="4"/>
  </g>
</svg>`;

  const FLOATS = [['x', '6%', '16%', '#3B82F6', '6s', '0s'], ['y', '44%', '8%', '#FF4D8D', '7s', '-2s'], ['=', '28%', '72%', '#17C3B2', '5.5s', '-1s'],
    ['+', '58%', '64%', '#FF9F1C', '6.5s', '-3s'], ['−', '16%', '46%', '#7C3AED', '7.5s', '-4s'], ['⚖️', '50%', '36%', '#F2C94C', '8s', '-5s'], ['÷', '36%', '14%', '#17C3B2', '9s', '-6s']];

  const hero = () => `
<section class="nr-hero nr-reveal" aria-label="Pembuka petualangan SPLDV">
  <div class="nr-float" aria-hidden="true">${FLOATS.map(f => `<span style="left:${f[1]};top:${f[2]};--c:${f[3]};--d:${f[4]};--dl:${f[5]}">${f[0]}</span>`).join('')}</div>
  <div class="nr-hero-copy">
    <span class="nr-badge">⚖️ PETUALANGAN SPLDV</span>
    <h2>Halo, aku <span>Nera</span> 👋<br>Yuk seimbangkan persamaan!</h2>
    <p class="nr-typed" id="nrTyped" aria-live="off"></p>
    <div class="nr-chips">
      <button type="button" data-jump="nrSec1">⚖️ Timbangan</button><button type="button" data-jump="nrSec2">🕵️ Detektif</button>
      <button type="button" data-jump="nrSec3">✂️ Eliminasi</button><button type="button" data-jump="nrSec4">🔁 Substitusi</button>
      <button type="button" data-jump="nrSec5">📈 Grafik</button><button type="button" data-jump="nrSec6">🍜 Soal cerita</button>
      <button type="button" data-jump="nrSec7">🌍 Sekitarmu</button>
    </div>
  </div>
  <div class="nr-hero-art">${neraSvg()}</div>
  <div class="nr-wave" aria-hidden="true">
    <svg viewBox="0 0 2400 80" preserveAspectRatio="none"><path d="${wavePath(2400, 80, 22, 8, 0)}" fill="#BFF1EA"/></svg>
    <svg viewBox="0 0 2400 80" preserveAspectRatio="none"><path d="${wavePath(2400, 80, 16, 8, 1.6)}" fill="#D6E6FF"/></svg>
  </div>
</section>`;

  const blk = (id, x, y, s, fill) => `<rect id="${id}" class="nr-blk" x="${x}" y="${y}" width="${s}" height="${s}" rx="5" fill="${fill}" stroke="#241B3A" stroke-width="3"/>`;

  const sec1 = `
<section class="nr-sec nr-reveal" id="nrSec1" style="--c1:#17C3B2;--c2:#3B82F6">
  <h3><span class="nr-step">1</span>Timbangan ajaib: apa itu persamaan? <em>⚖️</em></h3>
  <p class="nr-sub">Tanda “=” artinya <b>kedua sisi seimbang</b>. Apa pun yang kamu lakukan di satu sisi, harus kamu lakukan juga di sisi lainnya. Coba sendiri!</p>
  <div class="nr-grid2">
    <div class="nr-stage">
      <svg id="nrBal" viewBox="-14 0 388 250" style="overflow:visible" role="img" aria-label="Timbangan: sisi kiri x ditambah 2 balok, sisi kanan 5 balok">
        <rect x="170" y="72" width="20" height="150" rx="6" fill="#C9BFE0" stroke="#241B3A" stroke-width="4"/>
        <path d="M110 224 H250 Q250 240 234 240 H126 Q110 240 110 224Z" fill="#241B3A"/>
        <g id="nrBeam"><line x1="50" y1="70" x2="310" y2="70" stroke="#241B3A" stroke-width="8" stroke-linecap="round"/></g>
        <g id="nrPanL">
          <path d="M50 70 L14 150 M50 70 L86 150" stroke="#241B3A" stroke-width="3" fill="none" stroke-linecap="round"/>
          <path d="M6 150 H94 Q94 178 50 178 Q6 178 6 150Z" fill="#FFE08A" stroke="#241B3A" stroke-width="4" stroke-linejoin="round"/>
          <g id="nrXBox"><rect x="11" y="114" width="32" height="32" rx="8" fill="#3B82F6" stroke="#241B3A" stroke-width="3"/><text id="nrXTxt" x="27" y="137" text-anchor="middle" font-family="monospace" font-weight="800" font-size="20" fill="#fff">x</text></g>
          ${blk('nrL1', 47, 126, 20, '#FF9F1C')}${blk('nrL2', 69, 126, 20, '#FF9F1C')}
        </g>
        <g id="nrPanR">
          <path d="M310 70 L274 150 M310 70 L346 150" stroke="#241B3A" stroke-width="3" fill="none" stroke-linecap="round"/>
          <path d="M266 150 H354 Q354 178 310 178 Q266 178 266 150Z" fill="#FFE08A" stroke="#241B3A" stroke-width="4" stroke-linejoin="round"/>
          ${blk('nrR1', 272, 126, 22, '#FF9F1C')}${blk('nrR2', 296, 126, 22, '#FF9F1C')}${blk('nrR3', 320, 126, 22, '#FF9F1C')}${blk('nrR4', 284, 102, 22, '#FF9F1C')}${blk('nrR5', 308, 102, 22, '#FF9F1C')}
        </g>
        <circle cx="180" cy="70" r="11" fill="#FFE08A" stroke="#241B3A" stroke-width="4"/>
      </svg>
    </div>
    <div>
      <div class="nr-bigeq" id="nrBalEq">x + 2 = 5</div>
      <div class="nr-status ok" id="nrBalStatus">⚖️ Seimbang</div>
      <p class="nr-note" id="nrBalNote">Sisi kiri: kotak <b>x</b> + 2 balok. Sisi kanan: 5 balok. Berapa berat kotak x?</p>
      <div class="nr-ctrl">
        <button type="button" class="nr-btn primary" id="nrBalTake">➖ Ambil 2 balok di KEDUA sisi</button>
        <button type="button" class="nr-btn" id="nrBalCheat">😈 Ambil 2 balok di kiri saja</button>
        <button type="button" class="nr-btn" id="nrBalReset">↩ Ulangi</button>
      </div>
    </div>
  </div>
</section>`;

  const sec2 = `
<section class="nr-sec nr-reveal" id="nrSec2" style="--c1:#FF4D8D;--c2:#FF9F1C">
  <h3><span class="nr-step">2</span>Dua petunjuk, satu pasangan rahasia <em>🕵️</em></h3>
  <p class="nr-sub">Ada dua bilangan rahasia, <b>x</b> dan <b>y</b>. Satu petunjuk saja punya banyak kemungkinan. Ketuk pasangan kandidat di bawah dan lihat mana yang lolos <b>kedua</b> petunjuk!</p>
  <div class="nr-clues"><div class="nr-clue c1"><i>①</i>x + y = 5</div><div class="nr-clue c2"><i>②</i>x − y = 1</div></div>
  <div class="nr-cands" id="nrCands">${[[0, 5], [1, 4], [2, 3], [3, 2], [4, 1], [5, 0]].map(p => `<button type="button" class="nr-cand" data-x="${p[0]}" data-y="${p[1]}">(${p[0]}, ${p[1]})</button>`).join('')}</div>
  <div class="nr-verdict" id="nrVerdict">👆 Pilih satu pasangan untuk diperiksa.</div>
  <p class="nr-note">Perhatikan: <b>semua</b> pasangan di atas lolos petunjuk ①, tetapi hanya <b>satu</b> yang lolos ②. Itulah penyelesaian SPLDV: pasangan yang cocok di kedua persamaan.</p>
</section>`;

  const stepper = (id, given, first) => `
<div class="nr-steps" id="${id}" data-first="${first}">
  <div class="nr-given">${given}</div>
  <div class="nr-out"></div>
  <div class="nr-explain" aria-live="polite"></div>
  <div class="nr-ctrl"><button type="button" class="nr-btn primary" data-act="next">${first}</button><button type="button" class="nr-btn" data-act="reset">↩ Ulangi</button></div>
</div>`;

  const sec3 = `
<section class="nr-sec nr-reveal" id="nrSec3" style="--c1:#7C3AED;--c2:#FF4D8D">
  <h3><span class="nr-step">3</span>Eliminasi: sulap menghilangkan variabel <em>✂️</em></h3>
  <p class="nr-sub">Lihat <b>+y</b> dan <b>−y</b>: mereka kembar berlawanan! Kalau dijumlahkan, mereka saling meniadakan. Tekan tombol untuk menyaksikan sulapnya.</p>
  ${stepper('nrMagic', '<div class="nr-eqline"><i>①</i> x <b class="nr-y">+ y</b> = 5</div><div class="nr-eqline"><i>②</i> x <b class="nr-y">− y</b> = 1</div>', 'Jumlahkan ① + ② ✨')}
</section>`;

  const sec4 = `
<section class="nr-sec nr-reveal" id="nrSec4" style="--c1:#FF9F1C;--c2:#F2C94C">
  <h3><span class="nr-step">4</span>Substitusi: tukar-menukar <em>🔁</em></h3>
  <p class="nr-sub">Persamaan ① sudah memberi tahu <b>y = 2x − 1</b>. Jadi di mana pun ada y, kita boleh <b>menggantinya</b> dengan 2x − 1.</p>
  ${stepper('nrSwap', '<div class="nr-eqline"><i>①</i> <b class="nr-chip">y</b> = 2x − 1</div><div class="nr-eqline"><i>②</i> x + <b class="nr-swap" data-to="(2x − 1)">y</b> = 8</div>', 'Tukar y dengan 2x − 1 🔁')}
</section>`;

  const sec5 = `
<section class="nr-sec nr-reveal" id="nrSec5" style="--c1:#3B82F6;--c2:#17C3B2">
  <h3><span class="nr-step">5</span>Grafik: dua jalan, satu titik temu <em>📈</em></h3>
  <p class="nr-sub">Setiap persamaan adalah sebuah jalan lurus. Dua pelari menyusuri dua jalan itu. Apakah mereka akan bertemu?</p>
  <div class="nr-seg" id="nrGMode" role="group" aria-label="Pilih jenis dua garis">
    <button type="button" class="active" data-m="one">Berpotongan</button><button type="button" data-m="inf">Berimpit</button><button type="button" data-m="none">Sejajar</button>
    <button type="button" class="nr-btn primary" id="nrGReplay">▶ Mulai lagi</button>
  </div>
  <div class="nr-grid2">
    <div class="nr-stage"><svg id="nrGraph" viewBox="0 0 340 280" role="img" aria-label="Dua pelari menyusuri dua garis lurus"></svg></div>
    <div><div class="nr-gcap" id="nrGCap"></div><div class="nr-gres" id="nrGRes"></div></div>
  </div>
</section>`;

  const FLIPS = [
    ['🏷️', 'Misalkan', 'Beri nama pada hal yang dicari.', 'Misal x = harga 1 mie ayam, y = harga 1 es teh. Tulis artinya dengan jelas!'],
    ['📝', 'Buat model', 'Ubah kalimat jadi persamaan.', '2 mie ayam + 3 es teh = Rp36.000 menjadi 2x + 3y = 36.000. Satu kalimat, satu persamaan.'],
    ['🧮', 'Selesaikan', 'Pakai eliminasi atau substitusi.', 'Hasilnya x = 12.000 dan y = 4.000. Cari dua-duanya, jangan berhenti di x!'],
    ['✅', 'Cek & jawab', 'Masukkan ke kedua persamaan.', '2(12.000) + 3(4.000) = 36.000 ✓. Lalu jawab dengan kalimat lengkap, lengkap dengan satuannya.']
  ];
  const sec6 = `
<section class="nr-sec nr-reveal" id="nrSec6" style="--c1:#FF4D8D;--c2:#7C3AED">
  <h3><span class="nr-step">6</span>Soal cerita: 4 langkah jitu <em>🍜</em></h3>
  <p class="nr-sub">“2 mie ayam dan 3 es teh Rp36.000. 3 mie ayam dan 2 es teh Rp44.000. Berapa harga masing-masing?” Ketuk kartu untuk membalik tiap langkahnya.</p>
  <div class="nr-flip-tools"><span class="nr-chipnote">🍜 × 2 + 🥤 × 3 = Rp36.000</span><button type="button" class="nr-mini" id="nrFlipAll">🔄 Balik semua</button></div>
  <div class="nr-flips">${FLIPS.map((f, i) => `
    <div class="nr-flip" tabindex="0" role="button" aria-label="Langkah ${i + 1}: ${f[1]}. Tekan untuk membalik">
      <div class="nr-flip-in">
        <div class="nr-face nr-front"><b class="nr-n">${i + 1}</b><div class="nr-emo">${f[0]}</div><h4>${f[1]}</h4><small>${f[2]}</small></div>
        <div class="nr-face nr-back"><p>${f[3]}</p></div>
      </div>
    </div>`).join('')}</div>
</section>`;

  const AROUND = [
    ['🛒', 'Belanja', 'Harga dua barang dari dua struk berbeda.', '#FFE3CC', 'Dari dua struk belanja, kamu bisa menebak harga tiap barang. Itu SPLDV! 🛒'],
    ['🛵', 'Tarif ojek', 'Biaya awal + biaya per km dari dua aplikasi.', '#D5F6EC', 'Dua aplikasi punya tarif awal dan tarif per km berbeda. Titik potongnya = jarak saat tarifnya sama 🛵'],
    ['🧪', 'Campuran', 'Kadar larutan atau komposisi bahan.', '#E9DEFF', 'Mencampur dua larutan untuk mendapat kadar tertentu bisa diselesaikan dengan SPLDV 🧪'],
    ['🎟️', 'Tiket', 'Jumlah tiket dewasa dan anak.', '#FFE3EE', 'Diketahui jumlah tiket dan total uang, berapa tiket dewasa dan anak? Dua persamaan, dua variabel 🎟️'],
    ['📈', 'Titik impas', 'Saat biaya sama dengan pendapatan.', '#E4F4FF', 'Pengusaha memakai titik potong garis biaya dan garis pendapatan untuk tahu kapan balik modal 📈'],
    ['🚆', 'Kejar-kejaran', 'Dua kendaraan, kapan bertemu?', '#FFF4CF', 'Posisi dua kendaraan sebagai fungsi waktu adalah dua garis. Titik potongnya = saat mereka berpapasan 🚆']
  ];
  const sec7 = `
<section class="nr-sec nr-reveal" id="nrSec7" style="--c1:#17C3B2;--c2:#F2C94C">
  <h3><span class="nr-step">7</span>SPLDV di sekitarmu <em>🌍</em></h3>
  <p class="nr-sub">Ketuk kartu untuk mendengar fakta seru dari Nera!</p>
  <div class="nr-fun-grid">${AROUND.map(a => `<button type="button" class="nr-fun" style="--bg-c:${a[3]}" data-fact="${a[4]}"><span class="nr-fun-e">${a[0]}</span><h4>${a[1]}</h4><p>${a[2]}</p></button>`).join('')}</div>
</section>`;

  const divider = '<div class="nr-divider"><span>📖</span> Catatan lengkap <span>✏️</span></div>';

  return {
    neraSvg,
    html: () => `<div class="nr-adv">${hero()}${sec1}${sec2}${sec3}${sec4}${sec5}${sec6}${sec7}${divider}</div>`
  };
})();
