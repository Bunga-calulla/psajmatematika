(function(){
const banks={
persentase:[
["Harga jaket Rp240.000 mendapat diskon 25%. Harga setelah diskon adalah…",["Rp160.000","Rp180.000","Rp200.000","Rp210.000"],1,"25% × 240.000 = 60.000, jadi 240.000 − 60.000 = Rp180.000."],
["Sebuah barang Rp80.000 naik 10%. Harga barunya…",["Rp84.000","Rp86.000","Rp88.000","Rp90.000"],2,"10% × 80.000 = 8.000, jadi Rp88.000."],
["Dari 40 siswa, 30 membawa bekal. Persentasenya…",["65%","70%","75%","80%"],2,"30/40 × 100% = 75%."],
["Diskon 20% dari Rp350.000 adalah…",["Rp50.000","Rp60.000","Rp70.000","Rp80.000"],2,"20% × 350.000 = Rp70.000."],
["Harga Rp150.000 didiskon 10%, lalu menjadi…",["Rp125.000","Rp130.000","Rp135.000","Rp140.000"],2,"90% × 150.000 = Rp135.000."],
["Nilai naik dari 60 menjadi 72. Persentase kenaikannya…",["12%","15%","20%","25%"],2,"Kenaikan 12; 12/60 × 100% = 20%."]],
persamaan:[
["Ongkos ojek Rp5.000 + Rp3.000 tiap km. Untuk 8 km totalnya…",["Rp24.000","Rp27.000","Rp29.000","Rp32.000"],2,"5.000 + 3.000(8) = Rp29.000."],
["Tiket bus Rp10.000 + Rp2.500/km. Jika total Rp25.000, jaraknya…",["4 km","5 km","6 km","8 km"],1,"10.000 + 2.500x = 25.000 → x = 6 km."],
["Sewa sepeda Rp20.000 + Rp5.000/jam. Selama 4 jam…",["Rp35.000","Rp40.000","Rp45.000","Rp50.000"],2,"20.000 + 5.000(4) = Rp40.000."],
["Tabungan awal Rp50.000 ditambah Rp10.000/hari. Setelah 7 hari…",["Rp100.000","Rp110.000","Rp120.000","Rp130.000"],1,"50.000 + 10.000(7) = Rp120.000."],
["Parkir Rp3.000 + Rp2.000/jam. Total Rp13.000 berarti…",["4 jam","5 jam","6 jam","7 jam"],2,"3.000 + 2.000x = 13.000 → x = 5 jam."],
["Rumus y=4x+2. Jika x=6, y=…",["20","22","24","26"],3,"4(6)+2 = 26."]],
geometri:[
["Luas lantai persegi panjang 8 m × 5 m adalah…",["13 m²","26 m²","40 m²","80 m²"],2,"Luas = panjang × lebar = 8 × 5 = 40 m²."],
["Taman persegi sisi 7 m. Kelilingnya…",["14 m","21 m","28 m","49 m"],2,"Keliling = 4 × 7 = 28 m."],
["Segitiga alas 10 cm dan tinggi 8 cm. Luasnya…",["18 cm²","40 cm²","80 cm²","90 cm²"],1,"½ × 10 × 8 = 40 cm²."],
["Kotak 6×4×3 cm. Volumenya…",["24 cm³","48 cm³","72 cm³","96 cm³"],2,"Volume = 6 × 4 × 3 = 72 cm³."],
["Lingkaran berjari-jari 7 cm. Dengan π=22/7, luasnya…",["44 cm²","88 cm²","154 cm²","308 cm²"],2,"πr² = 22/7 × 49 = 154 cm²."],
["Sebuah ruangan 9 m × 4 m. Jika tiap 1 m² butuh 2 ubin, ubin yang diperlukan…",["36","54","72","90"],2,"Luas 36 m² × 2 = 72 ubin."]],
statistik:[
["Data gol pertandingan: 2, 3, 4, 3, 3. Rata-ratanya…",["2","3","3,5","4"],1,"Jumlah 15 dibagi 5 = 3."],
["Data 4, 6, 7, 9, 12. Median adalah…",["6","7","8","9"],1,"Data sudah urut, nilai tengahnya 7."],
["Modus dari 2, 5, 5, 6, 7 adalah…",["2","5","6","7"],1,"Angka yang paling sering muncul adalah 5."],
["Nilai tertinggi 95 dan terendah 62. Range…",["23","27","33","35"],2,"Range = 95 − 62 = 33."],
["Rata-rata 5 pemain adalah 8 poin. Total poin mereka…",["13","30","40","45"],2,"Total = rata-rata × banyak data = 8 × 5 = 40."],
["Data 10, 12, 14, 16. Rata-ratanya…",["12","13","14","15"],1,"(10+12+14+16)/4 = 13."]],
trigonometri:[
["Tangga 5 m bersandar, jarak kaki 3 m dari dinding. Tinggi yang dicapai…",["3 m","4 m","5 m","6 m"],1,"3²+h²=5² → h=4 m."],
["Segitiga siku-siku memiliki sin θ = 3/5. Jika sisi miring 10 cm, sisi depan…",["4 cm","5 cm","6 cm","8 cm"],2,"sin θ = depan/miring → depan = 3/5 × 10 = 6 cm."],
["Jika tan θ = tinggi/jarak = 1, sudut θ adalah…",["30°","45°","60°","90°"],1,"tan 45° = 1."],
["Tiang 8 m memiliki bayangan 8 m. Sudut elevasi matahari…",["30°","45°","60°","90°"],1,"tan θ = 8/8 = 1 → θ = 45°."],
["Sisi depan 6 dan sisi miring 10. cos θ = …",["0,4","0,6","0,8","1"],2,"Sisi samping = 8 (Pythagoras), jadi cos = 8/10 = 0,8."],
["Jarak 12 m, sudut elevasi 45°. Tinggi gedung kira-kira…",["6 m","10 m","12 m","24 m"],2,"tan 45° = tinggi/12 → tinggi = 12 m."]],
peluang:[
["Peluang muncul angka genap pada dadu fair adalah…",["1/6","1/3","1/2","2/3"],2,"Ada 3 angka genap dari 6 sisi → 3/6 = 1/2."],
["Peluang mendapat kepala saat koin fair dilempar…",["0","1/4","1/2","1"],2,"Ada 1 hasil yang diinginkan dari 2 kemungkinan → 1/2."],
["Dalam kantong ada 3 merah dan 2 biru. Peluang mengambil biru…",["1/5","2/5","3/5","1/2"],1,"2 bola biru dari total 5 → 2/5."],
["Dadu dilempar. Peluang muncul angka >4…",["1/6","1/3","1/2","2/3"],1,"Angka 5 dan 6: 2/6 = 1/3."],
["Kotak berisi 4 hijau dan 6 kuning. Peluang hijau…",["2/5","1/2","3/5","2/3"],0,"4/10 = 2/5."],
["Kartu bernomor 1–10. Peluang memilih kelipatan 3…",["1/5","3/10","1/2","3/5"],1,"Kelipatan 3: 3,6,9 → 3/10."]]
};
window.quizBanks=banks;
window.renderQuiz=function(topic){
const el=document.getElementById('tab-latihan');const qs=banks[topic];let i=0,score=0;
function draw(){const q=qs[i];el.innerHTML=`<div class="content-card"><div class="quiz-score">Soal ${i+1}/${qs.length} · Skor ${score}</div><div class="quiz-q">${q[0]}</div><div class="option-grid">${q[1].map((o,j)=>`<button class="option" data-i="${j}">${String.fromCharCode(65+j)}. ${o}</button>`).join('')}</div><div id="explain"></div></div>`;el.querySelectorAll('.option').forEach(b=>b.onclick=()=>answer(+b.dataset.i));}
function answer(choice){const q=qs[i];const buttons=[...el.querySelectorAll('.option')];buttons.forEach(b=>b.disabled=true);buttons[q[2]].classList.add('correct');if(choice!==q[2])buttons[choice].classList.add('wrong');else score++;document.getElementById('explain').innerHTML=`<div class="explanation"><strong>${choice===q[2]?'✅ Benar!':'❌ Belum tepat.'}</strong><br>${q[3]}</div><button class="gradient-btn" id="nextQ" style="margin-top:14px">${i===qs.length-1?'Lihat hasil':'Soal berikutnya →'}</button>`;document.getElementById('nextQ').onclick=()=>{if(i===qs.length-1){el.innerHTML=`<div class="content-card" style="text-align:center"><div class="eyebrow">HASIL LATIHAN</div><h2>${score}/${qs.length}</h2><p>${score>=5?'Mantap! Pemahamanmu sudah kuat.':score>=3?'Bagus, tinggal perkuat beberapa konsep lagi.':'Tidak apa-apa, baca materi lalu coba lagi ya!'}</p><button class="gradient-btn" id="retry">Coba Lagi</button></div>`;Progress.setLatihan(topic,score,qs.length);document.getElementById('retry').onclick=()=>window.renderQuiz(topic)}else{i++;draw()}}}
draw();
};
})();