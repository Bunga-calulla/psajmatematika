
(function(){
const banks={
persentase:[
["Harga jaket Rp240.000 mendapat diskon 25%. Harga setelah diskon adalah…",["Rp160.000","Rp180.000","Rp200.000","Rp210.000"],1,"25% × 240.000 = 60.000, jadi 240.000 − 60.000 = Rp180.000."],
["Sebuah barang Rp80.000 naik 10%. Harga barunya…",["Rp84.000","Rp86.000","Rp88.000","Rp90.000"],2,"10% × 80.000 = 8.000, jadi Rp88.000."],
["Dari 40 siswa, 30 membawa bekal. Persentasenya…",["65%","70%","75%","80%"],2,"30/40 × 100% = 75%."],
["Diskon 20% dari Rp350.000 adalah…",["Rp50.000","Rp60.000","Rp70.000","Rp80.000"],2,"20% × 350.000 = Rp70.000."],
["Harga Rp150.000 didiskon 10%, lalu menjadi…",["Rp125.000","Rp130.000","Rp135.000","Rp140.000"],2,"90% × 150.000 = Rp135.000."],
["Nilai naik dari 60 menjadi 72. Persentase kenaikannya…",["12%","15%","20%","25%"],2,"Kenaikan 12; 12/60 × 100% = 20%."],
["Di kelas terdapat 18 siswa perempuan dari 30 siswa. Persentase siswa perempuan adalah…",["40%","50%","60%","70%"],2,"18/30 × 100% = 60%."],
["Sebuah tas seharga Rp200.000 mendapat diskon 15%. Besar diskonnya adalah…",["Rp15.000","Rp20.000","Rp25.000","Rp30.000"],3,"15% × Rp200.000 = Rp30.000."],
["Harga sepatu Rp160.000 naik menjadi Rp184.000. Persentase kenaikannya adalah…",["10%","12%","15%","20%"],2,"Kenaikan = Rp24.000. Persentase kenaikan = 24.000/160.000 × 100% = 15%."],
["Setelah diskon 20%, harga sebuah baju menjadi Rp120.000. Harga sebelum diskon adalah…",["Rp140.000","Rp150.000","Rp160.000","Rp180.000"],1,"Harga setelah diskon adalah 80% dari harga awal. Harga awal = Rp120.000 ÷ 0,8 = Rp150.000."]
],

persamaan:[
["Ongkos ojek Rp5.000 + Rp3.000 tiap km. Untuk 8 km totalnya…",["Rp24.000","Rp27.000","Rp29.000","Rp32.000"],2,"5.000 + 3.000(8) = Rp29.000."],
["Tiket bus Rp10.000 + Rp2.500/km. Jika total Rp25.000, jaraknya…",["4 km","5 km","6 km","8 km"],2,"10.000 + 2.500x = 25.000 → x = 6 km."],
["Sewa sepeda Rp20.000 + Rp5.000/jam. Selama 4 jam…",["Rp35.000","Rp40.000","Rp45.000","Rp50.000"],1,"20.000 + 5.000(4) = Rp40.000."],
["Tabungan awal Rp50.000 ditambah Rp10.000/hari. Setelah 7 hari…",["Rp100.000","Rp110.000","Rp120.000","Rp130.000"],2,"50.000 + 10.000(7) = Rp120.000."],
["Parkir Rp3.000 + Rp2.000/jam. Total Rp13.000 berarti…",["4 jam","5 jam","6 jam","7 jam"],1,"3.000 + 2.000x = 13.000 → x = 5 jam."],
["Rumus y=4x+2. Jika x=6, y=…",["20","22","24","26"],3,"4(6)+2 = 26."]
],

geometri:[
["Luas lantai persegi panjang 8 m × 5 m adalah…",["13 m²","26 m²","40 m²","80 m²"],2,"Luas = panjang × lebar = 8 × 5 = 40 m²."],
["Taman persegi sisi 7 m. Kelilingnya…",["14 m","21 m","28 m","49 m"],2,"Keliling = 4 × 7 = 28 m."],
["Segitiga alas 10 cm dan tinggi 8 cm. Luasnya…",["18 cm²","40 cm²","80 cm²","90 cm²"],1,"½ × 10 × 8 = 40 cm²."],
["Kotak 6×4×3 cm. Volumenya…",["24 cm³","48 cm³","72 cm³","96 cm³"],2,"Volume = 6 × 4 × 3 = 72 cm³."],
["Lingkaran berjari-jari 7 cm. Dengan π=22/7, luasnya…",["44 cm²","88 cm²","154 cm²","308 cm²"],2,"πr² = 22/7 × 49 = 154 cm²."],
["Sebuah ruangan 9 m × 4 m. Jika tiap 1 m² butuh 2 ubin, ubin yang diperlukan…",["36","54","72","90"],2,"Luas 36 m² × 2 = 72 ubin."]
],

statistik:[
["Data gol pertandingan: 2, 3, 4, 3, 3. Rata-ratanya…",["2","3","3,5","4"],1,"Jumlah 15 dibagi 5 = 3."],
["Data 4, 6, 7, 9, 12. Median adalah…",["6","7","8","9"],1,"Data sudah urut, nilai tengahnya 7."],
["Modus dari 2, 5, 5, 6, 7 adalah…",["2","5","6","7"],1,"Angka yang paling sering muncul adalah 5."],
["Nilai tertinggi 95 dan terendah 62. Range…",["23","27","33","35"],2,"Range = 95 − 62 = 33."],
["Rata-rata 5 pemain adalah 8 poin. Total poin mereka…",["13","30","40","45"],2,"Total = rata-rata × banyak data = 8 × 5 = 40."],
["Data 10, 12, 14, 16. Rata-ratanya…",["12","13","14","15"],1,"(10+12+14+16)/4 = 13."],
["Data nilai: 6, 7, 7, 8, 9, 10. Median dari data tersebut adalah…",["7","7,5","8","8,5"],1,"Median = (7 + 8)/2 = 7,5."],
["Data 4, 5, 5, 5, 6, 7, 8. Modusnya adalah…",["4","5","6","8"],1,"Modus adalah nilai yang paling sering muncul. Angka 5 muncul tiga kali."],
["Rata-rata dari 5 data adalah 12. Jika empat data pertama berjumlah 42, data kelima adalah…",["12","15","18","20"],2,"Jumlah seluruh data = 5 × 12 = 60. Data kelima = 60 − 42 = 18."],
["Data jumlah buku yang dibaca: 2, 4, 4, 6, 9. Jangkauan (range) data tersebut adalah…",["5","6","7","9"],2,"Jangkauan = nilai terbesar − nilai terkecil = 9 − 2 = 7."]
],

trigonometri:[
["Pada segitiga siku-siku, sisi depan sudut θ = 5 dan sisi samping = 12. Nilai sin θ adalah…",["12/13","5/13","5/12","13/5"],1,"Sisi miring = 13. Sin θ = depan/miring = 5/13."],
["Sudut 150° jika dinyatakan dalam radian sama dengan…",["2π/3","3π/4","5π/6","7π/6"],2,"150° × π/180 = 5π/6 rad."],
["Nilai cos 120° adalah…",["−1/2","1/2","√3/2","−√3/2"],0,"Cos 120° = −cos 60° = −1/2."],
["Jika sin x = 8/17 dan x berada di kuadran I, nilai cos x adalah…",["9/17","8/15","17/15","15/17"],3,"Gunakan identitas sin²x + cos²x = 1, sehingga cos x = 15/17."],
["Rumus yang benar untuk cos(a + b) adalah…",["cos a cos b + sin a sin b","cos a cos b − sin a sin b","sin a cos b + cos a sin b","sin a sin b − cos a cos b"],1,"cos(a + b) = cos a cos b − sin a sin b."],
["Jika sin x = 1/2, nilai cos 2x adalah…",["0","1/2","√3/2","1"],1,"cos 2x = 1 − 2sin²x = 1/2."],
["Pada segitiga ABC diketahui b = 5, c = 8, dan ∠A = 60°. Panjang sisi a adalah…",["5","6","7","9"],2,"Aturan cosinus menghasilkan a² = 49, jadi a = 7."],
["Fungsi y = 3 sin 2x memiliki amplitudo dan periode berturut-turut…",["2 dan 360°","3 dan 720°","2 dan 180°","3 dan 180°"],3,"Amplitudo = 3 dan periode = 360°/2 = 180°."],
["Himpunan penyelesaian cos x = 1/2 pada 0° ≤ x ≤ 360° adalah…",["{60°, 300°}","{30°, 150°}","{60°, 120°}","{120°, 240°}"],0,"Cos positif di kuadran I dan IV, yaitu 60° dan 300°."],
["Seseorang berdiri 10 m dari kaki gedung dan mengukur sudut elevasi puncak gedung 60° (tinggi mata diabaikan). Tinggi gedung adalah…",["5√3 m","10 m","10√3 m","20 m"],2,"tan 60° = h/10, sehingga h = 10√3 m."]
],

peluang:[
["Peluang muncul angka genap pada dadu fair adalah…",["1/6","1/3","1/2","2/3"],2,"Ada 3 angka genap dari 6 sisi → 3/6 = 1/2."],
["Peluang mendapat kepala saat koin fair dilempar…",["0","1/4","1/2","1"],2,"Ada 1 hasil yang diinginkan dari 2 kemungkinan → 1/2."],
["Dalam kantong ada 3 merah dan 2 biru. Peluang mengambil biru…",["1/5","2/5","3/5","1/2"],1,"2 bola biru dari total 5 → 2/5."],
["Dadu dilempar. Peluang muncul angka >4…",["1/6","1/3","1/2","2/3"],1,"Angka 5 dan 6: 2/6 = 1/3."],
["Kotak berisi 4 hijau dan 6 kuning. Peluang hijau…",["2/5","1/2","3/5","2/3"],0,"4/10 = 2/5."],
["Kartu bernomor 1–10. Peluang memilih kelipatan 3…",["1/5","3/10","1/2","3/5"],1,"Kelipatan 3: 3, 6, 9 → 3/10."]
]
};

window.quizBanks=banks;

window.renderQuiz=function(topic){
const el=document.getElementById('tab-latihan');
const qs=banks[topic];
let i=0,score=0;

function draw(){
const q=qs[i];
el.innerHTML=`<div class="content-card">
<div class="quiz-score">Soal ${i+1}/${qs.length} · Skor ${score}</div>
<div class="quiz-q">${q[0]}</div>
<div class="option-grid">
${q[1].map((o,j)=>`<button class="option" data-i="${j}">${String.fromCharCode(65+j)}. ${o}</button>`).join('')}
</div>
<div id="explain"></div>
</div>`;

el.querySelectorAll('.option').forEach(b=>{
b.onclick=()=>answer(+b.dataset.i);
});
}

function answer(choice){
const q=qs[i];
const buttons=[...el.querySelectorAll('.option')];

buttons.forEach(b=>b.disabled=true);

buttons[q[2]].classList.add('correct');

if(choice!==q[2]){
buttons[choice].classList.add('wrong');
}else{
score++;
}

document.getElementById('explain').innerHTML=`
<div class="explanation">
<strong>${choice===q[2]?'✅ Benar!':'❌ Belum tepat.'}</strong>
<br>${q[3]}
</div>
<button class="gradient-btn" id="nextQ" style="margin-top:14px">
${i===qs.length-1?'Lihat hasil':'Soal berikutnya →'}
</button>`;

document.getElementById('nextQ').onclick=()=>{
if(i===qs.length-1){
el.innerHTML=`
<div class="content-card" style="text-align:center">
<div class="eyebrow">HASIL LATIHAN</div>
<h2>${score}/${qs.length}</h2>
<p>
${score/qs.length>=0.8
?'Mantap! Pemahamanmu sudah kuat.'
:score/qs.length>=0.5
?'Bagus, tinggal perkuat beberapa konsep lagi.'
:'Tidak apa-apa, baca materi lalu coba lagi ya!'}
</p>
<button class="gradient-btn" id="retry">Coba Lagi</button>
</div>`;

Progress.setLatihan(topic,score,qs.length);

document.getElementById('retry').onclick=()=>{
window.renderQuiz(topic);
};
}else{
i++;
draw();
}
};
}

draw();
};
})();
