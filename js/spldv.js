/* Modul SPLDV — materi, visualisasi, simulator, dan latihan */
(function(){
  const $ = (id) => document.getElementById(id);
  const previousMaterial = window.getModuleMaterial;
  const previousSimulator = window.getModuleSimulator;
  const previousBinder = window.bindSimulator;
  const previousQuizRenderer = window.renderQuiz;
  const accent = '#3B82F6';

  const material = () => `
  <div class="lesson-sections spldv-lesson">
    <section class="content-card sp-hero sp-reveal">
      <div class="sp-hero-inner">
        <div>
          <span class="sp-kicker">🧩 MODUL BARU · SISTEM PERSAMAAN LINEAR DUA VARIABEL</span>
          <h3>Jadi detektif angka, temukan nilai x dan y!</h3>
          <p>Pernah membeli dua jenis barang dengan total harga berbeda, lalu ingin mengetahui harga masing-masing? Di situlah SPLDV membantu. Kita akan mengubah petunjuk menjadi dua persamaan, lalu mencari dua nilai yang belum diketahui.</p>
          <div class="sp-visual-equations"><span class="sp-equation-chip">2x + y = 11</span><span class="sp-equation-chip">x + 2y = 10</span></div>
        </div>
        <div class="sp-mascot" aria-label="Ilustrasi detektif matematika">
          <span class="sp-spark s1">✦</span><div class="sp-character">🕵️</div><span class="bubble">Kasus x dan y!</span><span class="sp-spark s2">✨</span>
        </div>
      </div>
    </section>

    <section class="sp-section sp-reveal">
      <div class="sp-section-title"><span class="sp-number">01</span><div><h3>Apa itu SPLDV?</h3><p>Kenali konsep dasarnya sebelum mulai memecahkan soal.</p></div></div>
      <div class="content-card">
        <p><b>Sistem Persamaan Linear Dua Variabel (SPLDV)</b> adalah kumpulan dua persamaan linear yang memiliki dua variabel sama, biasanya <b>x</b> dan <b>y</b>. Penyelesaiannya adalah pasangan nilai x dan y yang membuat <i>kedua persamaan benar secara bersamaan</i>.</p>
        <div class="sp-equation">a₁x + b₁y = c₁<br>a₂x + b₂y = c₂<small>Bentuk umum SPLDV</small></div>
        <div class="sp-grid">
          <div class="sp-card"><span class="sp-pill">Persamaan 1</span><div class="sp-equation">2x + y = 11</div><p>Persamaan pertama memberi satu hubungan antara x dan y.</p></div>
          <div class="sp-card"><span class="sp-pill">Persamaan 2</span><div class="sp-equation">x + 2y = 10</div><p>Persamaan kedua memberi petunjuk tambahan agar x dan y dapat ditemukan.</p></div>
        </div>
      </div>
    </section>

    <section class="sp-section sp-reveal">
      <div class="sp-section-title"><span class="sp-number">02</span><div><h3>Unsur-unsur dalam SPLDV</h3><p>Setiap bagian persamaan punya peran masing-masing.</p></div></div>
      <div class="content-card sp-grid">
        <div class="sp-card"><h4>🔤 Variabel</h4><p>Huruf yang mewakili nilai yang belum diketahui.</p><b>Contoh: x dan y</b></div>
        <div class="sp-card"><h4>🔢 Koefisien</h4><p>Angka yang mengalikan variabel.</p><b>Contoh: 3 pada 3x</b></div>
        <div class="sp-card"><h4>🧱 Konstanta</h4><p>Bilangan tetap yang tidak memiliki variabel.</p><b>Contoh: 12 pada 2x + y = 12</b></div>
        <div class="sp-card"><h4>🧩 Suku</h4><p>Bagian persamaan yang dipisahkan oleh tanda tambah atau kurang.</p><b>Contoh: 2x, 3y, dan 8</b></div>
      </div>
    </section>

    <section class="sp-section sp-reveal">
      <div class="sp-section-title"><span class="sp-number">03</span><div><h3>Ciri-ciri dan syarat SPLDV</h3><p>Pastikan bentuk matematikanya sesuai.</p></div></div>
      <div class="content-card">
        <ul class="step-list">
          <li>Memiliki <b>dua variabel</b>, misalnya x dan y.</li>
          <li>Memiliki <b>dua persamaan linear</b> yang saling berhubungan.</li>
          <li>Pangkat tertinggi setiap variabel adalah <b>satu</b>.</li>
          <li>Tidak memuat perkalian antara variabel seperti xy atau x².</li>
          <li>Penyelesaiannya berupa pasangan berurutan <b>(x, y)</b> yang memenuhi kedua persamaan.</li>
        </ul>
        <div class="sp-note"><strong>Ingat!</strong> Persamaan 2x + 3y = 12 termasuk linear dua variabel. Sementara x² + y = 8 bukan persamaan linear karena x memiliki pangkat dua.</div>
      </div>
    </section>

    <section class="sp-section sp-reveal">
      <div class="sp-section-title"><span class="sp-number">04</span><div><h3>Empat metode menyelesaikan SPLDV</h3><p>Hasilnya sama, tetapi langkah pengerjaannya berbeda.</p></div></div>
      <div class="sp-methods">
        <article class="sp-method"><div class="sp-icon">📈</div><h4>1. Metode Grafik</h4><p>Gambarkan kedua persamaan sebagai garis pada bidang koordinat. Titik potong kedua garis merupakan solusi (x, y).</p><div class="sp-equation">Titik potong = (x, y)</div><small>Cocok untuk melihat hubungan dua persamaan secara visual.</small></article>
        <article class="sp-method"><div class="sp-icon">🔁</div><h4>2. Metode Substitusi</h4><p>Ubah salah satu persamaan menjadi x = ... atau y = ..., lalu masukkan bentuk tersebut ke persamaan lainnya.</p><div class="sp-equation">y = 11 − 2x</div><small>Cocok jika salah satu variabel mudah diisolasi.</small></article>
        <article class="sp-method"><div class="sp-icon">⚖️</div><h4>3. Metode Eliminasi</h4><p>Samakan koefisien salah satu variabel, kemudian jumlahkan atau kurangkan kedua persamaan untuk menghilangkan variabel itu.</p><div class="sp-equation">2x + y = 11<br>x + 2y = 10</div><small>Cocok jika koefisien mudah disamakan.</small></article>
        <article class="sp-method"><div class="sp-icon">🧠</div><h4>4. Metode Gabungan</h4><p>Gunakan eliminasi untuk memperoleh satu variabel, lalu substitusi hasilnya untuk mencari variabel yang lain.</p><div class="sp-equation">Eliminasi → Substitusi</div><small>Sering menjadi cara yang praktis untuk soal hitungan.</small></article>
      </div>
    </section>

    <section class="sp-section sp-reveal">
      <div class="sp-section-title"><span class="sp-number">05</span><div><h3>Contoh penyelesaian langkah demi langkah</h3><p>Gunakan dua persamaan yang sama agar perbedaan metodenya mudah terlihat.</p></div></div>
      <div class="content-card">
        <p>Diketahui sistem persamaan berikut:</p><div class="sp-equation">2x + y = 11 &nbsp; ...(1)<br>x + 2y = 10 &nbsp; ...(2)</div>
        <div class="sp-card"><h4>⚖️ A. Metode eliminasi</h4>
          <ol class="sp-steps"><li>Hilangkan y. Kalikan persamaan (1) dengan 2: <b>4x + 2y = 22</b>.</li><li>Kurangkan dengan persamaan (2):<br>(4x + 2y) − (x + 2y) = 22 − 10.</li><li>Diperoleh 3x = 12, sehingga <b>x = 4</b>.</li><li>Substitusikan x = 4 ke persamaan (1): 2(4) + y = 11.</li><li>8 + y = 11, sehingga <b>y = 3</b>.</li></ol>
          <div class="sp-note"><strong>Hasil:</strong> HP = {(4, 3)}.</div>
        </div>
        <div class="sp-card" style="margin-top:12px"><h4>🔁 B. Metode substitusi</h4>
          <ol class="sp-steps"><li>Dari persamaan (1), nyatakan y: <b>y = 11 − 2x</b>.</li><li>Masukkan ke persamaan (2): x + 2(11 − 2x) = 10.</li><li>Uraikan: x + 22 − 4x = 10, sehingga −3x = −12.</li><li>Diperoleh <b>x = 4</b>.</li><li>Masukkan x = 4 ke y = 11 − 2x, maka <b>y = 3</b>.</li></ol>
          <div class="sp-note"><strong>Hasil:</strong> HP = {(4, 3)}.</div>
        </div>
        <div class="sp-card" style="margin-top:12px"><h4>📈 C. Metode grafik</h4><p>Ubah masing-masing persamaan menjadi bentuk y:</p><div class="sp-equation">y = 11 − 2x<br>y = (10 − x) / 2</div><p>Gambarkan kedua garis. Keduanya berpotongan di titik <b>(4, 3)</b>. Titik potong inilah penyelesaian SPLDV.</p>
          <svg class="sp-graph" viewBox="0 0 300 220" role="img" aria-label="Grafik dua garis berpotongan di titik empat koma tiga">
            ${Array.from({length:11},(_,i)=>`<line x1="${25+i*25}" y1="12" x2="${25+i*25}" y2="195"/>`).join('')}
            ${Array.from({length:8},(_,i)=>`<line x1="25" y1="${20+i*25}" x2="275" y2="${20+i*25}"/>`).join('')}
            <line class="axis" x1="25" y1="145" x2="280" y2="145"/><line class="axis" x1="150" y1="12" x2="150" y2="195"/>
            <line class="line-a" x1="25" y1="20" x2="250" y2="170"/><line class="line-b" x1="25" y1="70" x2="250" y2="145"/>
            <circle class="cross" cx="200" cy="70" r="6"/><text x="208" y="61" font-size="10" fill="#6d42b5" font-weight="bold">(4, 3)</text>
            <text x="282" y="159" font-size="10" fill="#64748b">x</text><text x="158" y="12" font-size="10" fill="#64748b">y</text>
          </svg>
          <small>Ilustrasi konsep titik potong. Grafik interaktif dengan angka yang dapat diubah tersedia pada tab Coba Interaktif.</small>
        </div>
        <div class="sp-card" style="margin-top:12px"><h4>🧠 D. Metode gabungan</h4><p>Eliminasi menghasilkan x = 4. Kemudian substitusi ke persamaan (1): 2(4) + y = 11, sehingga y = 3. Jadi, penyelesaiannya tetap <b>(4, 3)</b>.</p></div>
      </div>
    </section>

    <section class="sp-section sp-reveal">
      <div class="sp-section-title"><span class="sp-number">06</span><div><h3>Kemungkinan jumlah penyelesaian</h3><p>Dua garis tidak selalu berpotongan di satu titik.</p></div></div>
      <div class="content-card sp-grid">
        <div class="sp-card"><h4>🟢 Satu solusi</h4><p>Dua garis berpotongan tepat di satu titik. Sistem konsisten dan independen.</p></div>
        <div class="sp-card"><h4>🟡 Tidak ada solusi</h4><p>Dua garis sejajar dan berbeda, sehingga tidak memiliki titik potong. Sistem tidak konsisten.</p></div>
        <div class="sp-card"><h4>🔵 Tak hingga solusi</h4><p>Kedua garis berhimpit. Setiap titik pada garis memenuhi kedua persamaan.</p></div>
        <div class="sp-card"><h4>📌 Cara mengenali</h4><p>Bandingkan perbandingan koefisien x, y, dan konstanta pada kedua persamaan.</p></div>
      </div>
    </section>

    <section class="sp-section sp-reveal">
      <div class="sp-section-title"><span class="sp-number">07</span><div><h3>Menerjemahkan soal cerita menjadi SPLDV</h3><p>Ambil informasi penting, tentukan variabel, lalu bentuk persamaannya.</p></div></div>
      <div class="content-card">
        <div class="sp-real-life"><div class="emoji">🛍️</div><div><b>Misi di toko alat tulis</b><p>Rani membeli 2 buku dan 1 pensil seharga Rp11.000. Dito membeli 1 buku dan 2 pensil seharga Rp10.000. Berapa harga satu buku dan satu pensil?</p></div></div>
        <ol class="sp-steps"><li><b>Tentukan variabel:</b> x = harga buku (ribuan rupiah), y = harga pensil (ribuan rupiah).</li><li><b>Bentuk persamaan pertama:</b> 2x + y = 11.</li><li><b>Bentuk persamaan kedua:</b> x + 2y = 10.</li><li><b>Selesaikan:</b> diperoleh x = 4 dan y = 3.</li><li><b>Tafsirkan:</b> harga satu buku Rp4.000 dan satu pensil Rp3.000.</li></ol>
        <div class="sp-note"><strong>Jangan lupa satuan!</strong> Karena x dan y dinyatakan dalam ribuan rupiah, hasil x = 4 berarti Rp4.000, bukan Rp4.</div>
      </div>
    </section>

    <section class="sp-section sp-reveal">
      <div class="sp-section-title"><span class="sp-number">08</span><div><h3>Tips, kesalahan umum, dan ringkasan</h3><p>Periksa proses supaya tidak terjebak kesalahan tanda atau hitungan.</p></div></div>
      <div class="content-card">
        <div class="sp-grid">
          <div class="sp-card"><h4>✅ Yang perlu dilakukan</h4><ul><li>Tentukan arti x dan y.</li><li>Tulis dua persamaan dengan teliti.</li><li>Samakan koefisien sebelum eliminasi.</li><li>Substitusikan hasil ke persamaan awal.</li></ul></div>
          <div class="sp-card"><h4>⚠️ Hindari kesalahan ini</h4><ul><li>Salah menerjemahkan informasi soal.</li><li>Lupa mengalikan semua suku.</li><li>Keliru saat memindahkan tanda negatif.</li><li>Tidak menuliskan satuan jawaban.</li></ul></div>
        </div>
        <h4 style="margin-top:18px">📚 Ringkasan penting</h4>
        <div class="sp-equation">a₁x + b₁y = c₁<br>a₂x + b₂y = c₂</div>
        <table class="mini-table"><tr><th>Metode</th><th>Ide utama</th></tr><tr><td>Grafik</td><td>Mencari titik potong dua garis.</td></tr><tr><td>Substitusi</td><td>Mengganti satu variabel dengan bentuk yang setara.</td></tr><tr><td>Eliminasi</td><td>Menghilangkan salah satu variabel.</td></tr><tr><td>Gabungan</td><td>Eliminasi satu variabel, lalu substitusi.</td></tr></table>
        <p><b>Kesimpulan:</b> SPLDV membantu menemukan dua nilai yang belum diketahui dari dua hubungan linear. Kunci utamanya adalah memahami cerita, menyusun persamaan, memilih metode, dan memeriksa kembali hasil.</p>
      </div>
    </section>

    <div class="content-card" style="text-align:center">
      <div style="font-size:32px">🏆✨</div><h3>Misi materi selesai?</h3><p>Kalau kamu sudah memahami konsep dan contoh di atas, tandai materi ini sebagai selesai.</p>
      <button type="button" id="completeMateriBtn" class="gradient-btn">Tandai Sudah Membaca dan Paham</button>
      <p style="margin-top:12px;font-size:13px;color:#888">Progres belajarmu akan tersimpan setelah tombol diklik.</p>
    </div>
  </div>`;

  window.getModuleMaterial = function(id){
    if(id === 'persamaan') return material();
    return previousMaterial(id);
  };

  window.getModuleSimulator = function(id){
    if(id !== 'persamaan') return previousSimulator(id);
    return `
      <div class="lesson-sections spldv-lesson">
        <div class="content-card sp-hero">
          <div class="sp-hero-inner"><div><span class="sp-kicker">🧪 LAB SPLDV INTERAKTIF</span><h3>Ubah angka, temukan titik temu!</h3><p>Masukkan koefisien dan konstanta untuk dua persamaan. Simulator akan menghitung nilai x dan y serta menampilkan titik penyelesaiannya.</p></div><div class="sp-mascot"><span class="sp-spark s1">✦</span><div class="sp-character">🧮</div><span class="bubble">Ayo eksperimen!</span><span class="sp-spark s2">✨</span></div></div>
        </div>
        <div class="content-card sp-sim">
          <h3>🎛️ Atur sistem persamaanmu</h3><p>Bentuk persamaan: ax + by = c dan dx + ey = f.</p>
          <div class="sp-sim-grid">
            <div>
              <div class="sp-field-grid">
                <div class="sp-field"><label>a (x)</label><input id="spA" type="number" value="2"></div>
                <div class="sp-field"><label>b (y)</label><input id="spB" type="number" value="1"></div>
                <div class="sp-field"><label>c</label><input id="spC" type="number" value="11"></div>
                <div class="sp-field"><label>d (x)</label><input id="spD" type="number" value="1"></div>
                <div class="sp-field"><label>e (y)</label><input id="spE" type="number" value="2"></div>
                <div class="sp-field"><label>f</label><input id="spF" type="number" value="10"></div>
              </div>
              <div class="sp-visual-equations"><span class="sp-equation-chip" id="spEq1">2x + y = 11</span><span class="sp-equation-chip" id="spEq2">x + 2y = 10</span></div>
              <button class="sp-btn" id="spSolve">🔍 Temukan nilai x dan y</button>
              <button class="sp-btn" id="spReset" style="background:#64748b;margin-left:6px">↺ Atur ulang</button>
              <div class="sp-sim-result" id="spResult" aria-live="polite"><strong>Hasil akan muncul di sini.</strong><p>Tekan tombol untuk menyelesaikan sistem persamaan.</p></div>
            </div>
            <div><h4 style="text-align:center">📈 Peta titik potong</h4><svg id="spDynamicGraph" class="sp-graph" viewBox="0 0 300 240" role="img" aria-label="Grafik interaktif SPLDV"></svg><p class="sp-feedback" id="spGraphCaption">Grafik akan diperbarui setelah kamu menekan tombol.</p></div>
          </div>
        </div>
        <div class="content-card"><h3>💡 Tantangan kecil</h3><p>Coba ubah konstanta c dan f. Apakah titik potong berpindah? Coba juga ubah koefisiennya sampai kedua garis sejajar atau berhimpit.</p><div class="sp-note"><b>Petunjuk:</b> jika determinan a × e − b × d = 0, sistem tidak memiliki satu solusi tunggal. Perhatikan apakah kedua persamaan sebenarnya sebanding atau sejajar.</div></div>
      </div>`;
  };

  function equationText(a,b,c){
    const term=(n,v)=>`${n<0?'−':(v?' + ':'')}${Math.abs(n)}${v}`;
    return `${a===1?'':a===-1?'−':a}x${term(b,'y')} = ${c}`;
  }
  function graphMarkup(a,b,c,d,e,f,x,y){
    const X=v=>25+(v+5)*16.6667, Y=v=>205-(v+5)*13.3333;
    const gridX=Array.from({length:16},(_,i)=>`<line x1="${X(i-5)}" y1="5" x2="${X(i-5)}" y2="205"/>`).join('');
    const gridY=Array.from({length:16},(_,i)=>`<line x1="25" y1="${Y(i-5)}" x2="275" y2="${Y(i-5)}"/>`).join('');
    const y1=v=>b!==0?(c-a*v)/b:null, y2=v=>e!==0?(f-d*v)/e:null;
    const line=(fn,coef,constant,cls)=>{
      if(coef===0) return `<line class="${cls}" x1="${X(-5)}" y1="${Y(constant)}" x2="${X(10)}" y2="${Y(constant)}"/>`;
      const yy1=fn(-5), yy2=fn(10);
      return `<line class="${cls}" x1="${X(-5)}" y1="${Y(yy1)}" x2="${X(10)}" y2="${Y(yy2)}"/>`;
    };
    return `${gridX}${gridY}<line class="axis" x1="25" y1="${Y(0)}" x2="278" y2="${Y(0)}"/><line class="axis" x1="${X(0)}" y1="5" x2="${X(0)}" y2="205"/>${b!==0?line(y1,b,c,'line-a'):(a!==0?`<line class="line-a" x1="${X(c/a)}" y1="5" x2="${X(c/a)}" y2="205"/>`: '')}${e!==0?line(y2,e,f,'line-b'):(d!==0?`<line class="line-b" x1="${X(f/d)}" y1="5" x2="${X(f/d)}" y2="205"/>`:'')}${Number.isFinite(x)&&Number.isFinite(y)&&x>=-5&&x<=10&&y>=-5&&y<=10?`<circle class="cross" cx="${X(x)}" cy="${Y(y)}" r="6"/><text x="${X(x)+9}" y="${Y(y)-9}" fill="#7045b5" font-size="10" font-weight="bold">(${x.toFixed(1)}, ${y.toFixed(1)})</text>`:''}<text x="281" y="${Y(0)+13}" font-size="10" fill="#64748b">x</text><text x="${X(0)+5}" y="12" font-size="10" fill="#64748b">y</text>`;
  }

  window.bindSimulator = function(id){
    if(id !== 'persamaan') return previousBinder(id);
    const ids=['spA','spB','spC','spD','spE','spF'];
    const fields=ids.map($);
    const result=$('spResult'), graph=$('spDynamicGraph');
    if(fields.some(v=>!v)||!result||!graph) return;
    const get=()=>fields.map(v=>Number(v.value));
    const reset=()=>{[2,1,11,1,2,10].forEach((v,i)=>fields[i].value=v);solve();};
    const solve=()=>{
      const [a,b,c,d,e,f]=get();
      if(get().some(v=>!Number.isFinite(v))){result.innerHTML='<strong>Periksa input.</strong><p>Semua kolom harus berisi angka.</p>';return;}
      $('spEq1').textContent=equationText(a,b,c);$('spEq2').textContent=equationText(d,e,f);
      const det=a*e-b*d, detX=c*e-b*f, detY=a*f-c*d;
      if(Math.abs(det)>1e-9){
        const x=detX/det,y=detY/det;
        result.innerHTML=`<strong>🎉 Solusi ditemukan!</strong><p>x = <b>${Number(x.toFixed(3))}</b> dan y = <b>${Number(y.toFixed(3))}</b>.</p><p>Himpunan penyelesaian: <b>{(${Number(x.toFixed(3))}, ${Number(y.toFixed(3))})}</b>.</p><small>Cek: ${a}(${Number(x.toFixed(2))}) + ${b}(${Number(y.toFixed(2))}) ≈ ${c} dan ${d}(${Number(x.toFixed(2))}) + ${e}(${Number(y.toFixed(2))}) ≈ ${f}.</small>`;
        graph.innerHTML=graphMarkup(a,b,c,d,e,f,x,y);
        $('spGraphCaption').textContent='Titik ungu menunjukkan perpotongan kedua garis.';
        if(window.Progress&&Progress.setCoba) Progress.setCoba('persamaan');
      } else {
        const same=Math.abs(detX)<1e-9&&Math.abs(detY)<1e-9;
        result.innerHTML=same?'<strong>♾️ Tak hingga solusi.</strong><p>Kedua persamaan mewakili garis yang berhimpit.</p>':'<strong>🟡 Tidak ada solusi tunggal.</strong><p>Kedua garis sejajar dan berbeda, sehingga tidak berpotongan.</p>';
        graph.innerHTML=graphMarkup(a,b,c,d,e,f,NaN,NaN);
        $('spGraphCaption').textContent=same?'Kedua garis berhimpit.':'Kedua garis sejajar atau tidak memiliki titik potong.';
      }
      graph.classList.remove('sp-reveal');void graph.getBoundingClientRect();graph.classList.add('sp-reveal');
    };
    $('spSolve').onclick=solve;$('spReset').onclick=reset;
    fields.forEach(v=>v.addEventListener('keydown',e=>{if(e.key==='Enter')solve();}));
    solve();
  };

    // Bank soal latihan SPLDV. Urutan dan label mengikuti bagian pada tab Materi.
  // Format: [pertanyaan, pilihan, indeks jawaban benar, pembahasan, label materi]
  const bank=[
    ['Manakah pasangan persamaan berikut yang merupakan SPLDV?',['x² + y = 5 dan x − y = 1','2x + y = 7 dan x − y = 2','xy = 6 dan x + y = 5','x + y + z = 9 dan x − y = 1'],1,'SPLDV harus memiliki dua variabel (x dan y), berpangkat satu, dan tanpa perkalian antarvariabel. Pasangan dengan x² memuat pangkat 2, pasangan dengan xy memuat perkalian variabel, dan pasangan dengan z memuat tiga variabel. Hanya 2x + y = 7 dan x − y = 2 yang memenuhi.','1. Apa itu SPLDV?'],
    ['Pada persamaan 5x − 4y = 20, koefisien y dan konstantanya berturut-turut adalah ...',['4 dan 20','−4 dan 20','5 dan 20','−4 dan 5'],1,'Koefisien adalah angka yang menempel pada variabel beserta tandanya, sehingga koefisien y adalah −4. Konstanta adalah bilangan tanpa variabel, yaitu 20.','2. Unsur-unsur SPLDV'],
    ['Manakah pasangan (x, y) yang merupakan penyelesaian dari x + y = 7 dan x − y = 3?',['(4, 3)','(5, 2)','(6, 1)','(2, 5)'],1,'Cek ke kedua persamaan: 5 + 2 = 7 ✓ dan 5 − 2 = 3 ✓. Pilihan lain hanya benar pada persamaan pertama: (4, 3) → 4 − 3 = 1, (6, 1) → 6 − 1 = 5, (2, 5) → 2 − 5 = −3.','3. Penyelesaian SPLDV'],
    ['Penyelesaian dari y = x + 3 dan 2x + y = 12 dengan metode substitusi adalah ...',['(6, 3)','(3, 6)','(4, 7)','(2, 5)'],1,'Substitusikan y = x + 3 ke 2x + y = 12: 2x + (x + 3) = 12, sehingga 3x = 9 dan x = 3. Maka y = 3 + 3 = 6. Cek: 2(3) + 6 = 12 ✓. Penyelesaiannya (3, 6).','4. Metode substitusi'],
    ['Penyelesaian 2x + y = 10 dan x + 3y = 15 dengan metode gabungan adalah ...',['(4, 3)','(3, 4)','(5, 0)','(2, 6)'],1,'Eliminasi y: kalikan persamaan pertama dengan 3 (seluruh suku, termasuk konstanta) menjadi 6x + 3y = 30. Kurangkan dengan x + 3y = 15, diperoleh 5x = 15, sehingga x = 3. Substitusi ke 2x + y = 10: 6 + y = 10, sehingga y = 4. Penyelesaiannya (3, 4).','4. Metode gabungan'],
    ['Pada metode grafik, garis x + y = 6 memotong sumbu x dan sumbu y berturut-turut di titik ...',['(0, 6) dan (6, 0)','(6, 0) dan (0, 6)','(3, 3) dan (6, 6)','(6, 6) dan (0, 0)'],1,'Memotong sumbu x berarti y = 0, sehingga x = 6, yaitu titik (6, 0). Memotong sumbu y berarti x = 0, sehingga y = 6, yaitu titik (0, 6). Titik potong dua garis nantinya menjadi penyelesaian SPLDV.','4. Metode grafik'],
    ['Saat dieliminasi, sebuah SPLDV menghasilkan 0 = 0. Artinya sistem tersebut memiliki ...',['Tepat satu solusi','Tidak ada solusi','Tak hingga solusi','Dua solusi'],2,'Hasil 0 = 0 selalu benar. Kedua persamaan sebenarnya sama, hanya ditulis berbeda, sehingga garisnya berimpit dan solusinya tak hingga banyak. Jika hasilnya mustahil seperti 0 = 2, maka tidak ada solusi.','5. Banyak penyelesaian'],
    ['SPLDV x + 2y = 3 dan 2x + ky = 6 memiliki tak hingga solusi jika k = ...',['2','3','4','6'],2,'Syarat tak hingga solusi: a₁/a₂ = b₁/b₂ = c₁/c₂. Di sini <span class="sx-frac"><span>1</span><span>2</span></span> = <span class="sx-frac"><span>2</span><span>k</span></span> = <span class="sx-frac"><span>3</span><span>6</span></span>. Karena <span class="sx-frac"><span>1</span><span>2</span></span> = <span class="sx-frac"><span>3</span><span>6</span></span>, maka <span class="sx-frac"><span>2</span><span>k</span></span> = <span class="sx-frac"><span>1</span><span>2</span></span>, sehingga k = 4.','5. Banyak penyelesaian'],
    ['Di sebuah kandang ada bebek dan sapi, jumlahnya 30 ekor dan jumlah kakinya 84. Jika x = banyak bebek dan y = banyak sapi, model matematikanya adalah ...',['x + y = 30 dan 2x + 4y = 84','x + y = 84 dan 2x + 4y = 30','x + y = 30 dan 4x + 2y = 84','x + y = 30 dan 2x + 2y = 84'],0,'Jumlah kepala: x + y = 30. Jumlah kaki: bebek berkaki 2 dan sapi berkaki 4, sehingga 2x + 4y = 84. Selesaikan: 2x + 2y = 60, lalu 2y = 24, y = 12 sapi dan x = 18 bebek.','6. Soal cerita'],
    ['Harga 3 pensil dan 2 buku Rp13.000, sedangkan harga 1 pensil dan 3 buku Rp9.000. Harga satu buku adalah ...',['Rp1.000','Rp2.000','Rp3.000','Rp4.000'],1,'Misalkan pensil = x dan buku = y (ribuan rupiah): 3x + 2y = 13 dan x + 3y = 9. Kalikan persamaan kedua dengan 3: 3x + 9y = 27. Kurangkan dengan persamaan pertama: 7y = 14, sehingga y = 2. Jadi satu buku Rp2.000 (dan satu pensil Rp3.000).','6. Soal cerita']
  ];
    const passMark=Math.ceil(bank.length*0.6);
  // Acak urutan pilihan jawaban setiap latihan dimulai agar jawaban benar tidak selalu di posisi yang sama.
    const shuffled=()=>bank.map(q=>{const order=q[1].map((_,k)=>k).sort(()=>Math.random()-.5);return [q[0],order.map(k=>q[1][k]),order.indexOf(q[2]),q[3],q[4]];});
  window.renderQuiz=function(topic){
    if(topic!=='persamaan') return previousQuizRenderer(topic);
    const el=$('tab-latihan');let i=0,score=0,answered=false;let questions=shuffled();
    function draw(){
      const q=questions[i];answered=false;
      el.innerHTML=`<div class="content-card spldv-lesson"><div class="quiz-score">🧩 Soal ${i+1}/${questions.length} · Skor ${score}</div><div class="sp-quiz-topic"><span class="sp-kicker">📖 Materi ${q[4]}</span></div><div class="quiz-q">${q[0]}</div><div class="option-grid">${q[1].map((o,j)=>`<button class="option" data-i="${j}">${String.fromCharCode(65+j)}. ${o}</button>`).join('')}</div><div id="spQuizExplain"></div></div>`;
      el.querySelectorAll('.option').forEach(b=>b.onclick=()=>answer(Number(b.dataset.i)));
    }
    function answer(choice){
      if(answered)return;answered=true;const q=questions[i],buttons=[...el.querySelectorAll('.option')];
      buttons.forEach(b=>b.disabled=true);buttons[q[2]].classList.add('correct');
      if(choice===q[2])score++;else buttons[choice].classList.add('wrong');
      $('spQuizExplain').innerHTML=`<div class="explanation"><strong>${choice===q[2]?'✅ Benar!':'❌ Belum tepat.'}</strong><br>${q[3]}</div><button class="gradient-btn" id="spNext" style="margin-top:14px">${i===questions.length-1?'Lihat hasil':'Soal berikutnya →'}</button>`;
      $('spNext').onclick=()=>{if(i<questions.length-1){i++;draw();}else{el.innerHTML=`<div class="content-card" style="text-align:center"><div style="font-size:42px">🏆</div><h3>Latihan selesai!</h3><p>Skor kamu: <b>${score} dari ${questions.length}</b>.</p><p>${score===questions.length?'Sempurna! Kamu sudah menguasai SPLDV.':score>=passMark?'Bagus! Ulangi bagian materi yang masih membingungkan.':'Yuk, baca kembali materi dan coba lagi.'}</p><button class="gradient-btn" id="spRetry">Ulangi latihan</button></div>`;$('spRetry').onclick=()=>{i=0;score=0;questions=shuffled();draw();};if(window.Progress&&Progress.setLatihan&&score>=passMark)Progress.setLatihan('persamaan',score,questions.length);}};
    }
    draw();
  };
})();
