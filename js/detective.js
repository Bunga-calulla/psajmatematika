(function(){
"use strict";

/* ---------------- DATA ---------------- */
const cases = [
  {id:1,num:'01',title:'Kasus #001',sub:'Barang Hilang',diff:'Mudah',diffClass:'diff-mudah',photo:'🌃',status:'playable'},
  {id:2,num:'03',title:'Kasus #002',sub:'Koleksi Perpustakaan',diff:'Sedang',diffClass:'diff-sedang',photo:'🏛️',status:'soon'},
  {id:3,num:'04',title:'Kasus #003',sub:'Jejak di Pantai',diff:'Sulit',diffClass:'diff-sulit',photo:'🏖️',status:'soon'},
  {id:4,num:'04',title:'Kasus #004',sub:'Rencana Pencurian',diff:'Sangat Sulit',diffClass:'diff-sangatsulit',photo:'🔒',status:'locked'},
  {id:5,num:'06',title:'Kasus #005',sub:'Siapa Pelakunya?',diff:'???',diffClass:'diff-misteri',photo:'🔒',status:'locked'}
];

const suspects = [
  {id:'andi',name:'Andi',role:'Karyawan',
    alibi:'Andi mengatakan dia berada 12 km dari lokasi pada pukul 14.00. Dia mengaku sampai lokasi pukul 14.10. Kecepatan maksimal kendaraannya adalah 50 km/jam.',
    calc:['Jarak = 12 km','Waktu = 10 menit (1/6 jam)','Kecepatan = 12 ÷ (1/6) = 72 km/jam'],
    conclusion:{ok:false,title:'Tidak mungkin.',desc:'Karena kecepatan Andi melebihi batas maksimal kendaraannya (50 km/jam).'}
  },
  {id:'budi',name:'Budi',role:'Sekuriti',alibi:null},
  {id:'citra',name:'Citra',role:'Tamu',alibi:null},
  {id:'dika',name:'Dika',role:'Teknisi',alibi:null}
];

const questionData = {
  story:'Sebuah barang berharga hilang dari ruang penyimpanan. Ada 4 orang tersangka dengan alibi masing-masing. Dari data yang ada, siapa yang kemungkinan besar berbohong?',
  question:'Andi mengatakan dia berada 12 km dari lokasi pada pukul 14.00. Dia mengaku sampai lokasi pukul 14.10. Kecepatan maksimal kendaraannya adalah 50 km/jam. Apakah alibinya mungkin?',
  options:['Iya, sangat mungkin.','Mungkin, tapi tidak pasti.','Tidak mungkin.','Tidak dapat ditentukan.'],
  correct:2,
  hint:'Hitung dulu kecepatan yang dibutuhkan Andi (jarak ÷ waktu), lalu bandingkan dengan batas maksimal kendaraannya.'
};

const achievements = [
  {icon:'🏅',color:'#4caf7d',bg:'rgba(76,175,125,.15)',title:'Pemecah Kasus',desc:'Selesaikan 5 kasus',n:3,total:5},
  {icon:'%',color:'#c77bd6',bg:'rgba(199,123,214,.15)',title:'Ahli Persentase',desc:'Jawab 20 soal persentase',n:12,total:20},
  {icon:'📐',color:'#4f8fe0',bg:'rgba(79,143,224,.15)',title:'Raja Geometri',desc:'Jawab 15 soal geometri',n:7,total:10},
  {icon:'🧠',color:'#4cd3af',bg:'rgba(76,211,175,.15)',title:'Master Logika',desc:'Selesaikan 10 teka-teki logika',n:4,total:10},
  {icon:'🎖️',color:'#9aa5bd',bg:'rgba(154,165,189,.15)',title:'Detektif Sejati',desc:'Dapatkan semua achievement',n:1,total:10},
  {icon:'👑',color:'#e3b567',bg:'rgba(227,181,103,.15)',title:'Legenda Matematika',desc:'Capai level 10',n:2,total:10}
];

/* ---------------- STATE ---------------- */
const state = {lives:3,timer:525,timerHandle:null,answered:false,selected:null,activeSuspect:'andi'};

/* ---------------- HELPERS ---------------- */
const $ = id => document.getElementById(id);
function fmtTime(s){const m=Math.floor(s/60),r=s%60;return String(m).padStart(2,'0')+':'+String(r).padStart(2,'0')}

/* ---------------- NAVIGATION ---------------- */
const HUB_SCREENS = ['home','achievements'];
const SCREEN_IDS = {home:'screenHome',cases:'screenCases',play:'screenPlay',evidence:'screenEvidence',result:'screenResult',achievements:'screenAchievements'};

function goto(screen){
  Object.values(SCREEN_IDS).forEach(id=>$(id).classList.remove('active'));
  $(SCREEN_IDS[screen]).classList.add('active');
  document.getElementById('appShell').classList.toggle('has-sidebar', HUB_SCREENS.includes(screen));
  document.querySelectorAll('.sidebar-item').forEach(b=>b.classList.remove('active'));
  if(screen==='home') $('navHome').classList.add('active');
  if(screen==='achievements') $('navPrestasi').classList.add('active');
  window.scrollTo({top:0,behavior:'smooth'});
  if(screen==='play') startPlay();
  if(screen==='evidence') renderEvidence();
  if(screen==='achievements') renderAchievements();
}

document.addEventListener('click',e=>{
  const g = e.target.closest('[data-goto]');
  if(g){ e.preventDefault(); goto(g.dataset.goto); }
});

/* ---------------- PROFILE CHIP ---------------- */
function initProfile(){
  const name = localStorage.getItem('mdny_current_user') || 'Fairuz Hidayat';
  ['profName1','profName2'].forEach(id=>{ if($(id)) $(id).textContent = name; });
}

/* ---------------- SCREEN: PILIH KASUS ---------------- */
function renderCases(){
  const row = $('caseRow');
  row.innerHTML = cases.map(c=>{
    const locked = c.status==='locked';
    return `<article class="case-card ${locked?'locked':'available'}" data-case="${c.id}">
      <div class="pin"></div>
      <div class="case-num">${c.num}</div>
      <div class="case-photo">${locked?'🔒':c.photo}</div>
      <p class="case-title">${c.title}</p>
      <p class="case-sub">${c.sub}</p>
      <span class="diff-pill ${c.diffClass}">${c.diff}</span>
    </article>`;
  }).join('');
  row.querySelectorAll('.case-card.available').forEach(card=>{
    card.onclick = () => {
      const id = +card.dataset.case;
      if(id===1){ goto('play'); }
      else { flashToast('Konten kasus ini segera hadir 🔧'); }
    };
  });
  row.querySelectorAll('.case-card.locked').forEach(card=>{
    card.onclick = () => flashToast('🔒 Selesaikan kasus sebelumnya untuk membuka ini.');
  });
}

function flashToast(msg){
  let t = document.querySelector('.dt-toast');
  if(!t){ t=document.createElement('div'); t.className='dt-toast';
    t.style.cssText='position:fixed;left:50%;bottom:30px;transform:translateX(-50%);background:#141d2e;color:#eef1f8;padding:12px 20px;border-radius:999px;border:1px solid rgba(255,255,255,.12);font-size:13px;font-weight:700;z-index:999;box-shadow:0 12px 30px rgba(0,0,0,.4);transition:opacity .3s';
    document.body.appendChild(t);
  }
  t.textContent = msg; t.style.opacity='1';
  clearTimeout(t._h); t._h=setTimeout(()=>t.style.opacity='0',2200);
}

/* ---------------- SCREEN: GAMEPLAY ---------------- */
function renderSteps(current){
  const track = $('stepTrack');
  let html='';
  for(let i=1;i<=5;i++){
    html += `<div class="step-dot ${i===current?'current':i<current?'done':''}">${i}</div>`;
    if(i<5) html += `<div class="step-line"></div>`;
  }
  track.innerHTML = html;
}

function startPlay(){
  state.lives=3; state.answered=false; state.selected=null; state.timer=525;
  renderSteps(1);
  $('storyText').textContent = questionData.story;
  $('questionText').textContent = questionData.question;
  $('answerList').innerHTML = questionData.options.map((opt,i)=>
    `<button class="answer-option" data-i="${i}">${String.fromCharCode(65+i)}. ${opt}</button>`
  ).join('');
  $('feedbackText').textContent='';
  $('feedbackText').className='feedback-line';
  updateLives();
  $('playTimer').textContent = fmtTime(state.timer);
  clearInterval(state.timerHandle);
  state.timerHandle = setInterval(()=>{
    state.timer = Math.max(0,state.timer-1);
    $('playTimer').textContent = fmtTime(state.timer);
    if(state.timer===0) clearInterval(state.timerHandle);
  },1000);

  $('answerList').querySelectorAll('.answer-option').forEach(btn=>{
    btn.onclick = () => {
      if(state.answered) return;
      $('answerList').querySelectorAll('.answer-option').forEach(b=>b.classList.remove('selected'));
      btn.classList.add('selected');
      state.selected = +btn.dataset.i;
    };
  });
  $('hintBtn').onclick = () => flashToast('💡 '+questionData.hint);
  $('skipBtn').onclick = () => goto('cases');
}

function updateLives(){
  $('livesRow').innerHTML = Array.from({length:3},(_,i)=>`<span class="${i<state.lives?'':'dead'}">❤️</span>`).join('');
}

$('submitBtn') && ($('submitBtn').onclick = () => {
  if(state.answered || state.selected===null) { if(state.selected===null) flashToast('Pilih salah satu jawaban dulu.'); return; }
  state.answered = true;
  clearInterval(state.timerHandle);
  const opts = $('answerList').querySelectorAll('.answer-option');
  const good = state.selected === questionData.correct;
  opts.forEach((b,i)=>{
    b.disabled = true;
    if(i===questionData.correct) b.classList.add('correct');
    else if(i===state.selected) b.classList.add('wrong');
  });
  if(good){
    $('feedbackText').textContent = '✅ Benar! Kecepatan Andi melebihi batas maksimal — alibinya tidak mungkin.';
    $('feedbackText').className = 'feedback-line good';
    setTimeout(()=>goto('evidence'), 1100);
  }else{
    state.lives = Math.max(0,state.lives-1);
    updateLives();
    $('feedbackText').textContent = '❌ Belum tepat. Coba periksa lagi perhitungan kecepatannya.';
    $('feedbackText').className = 'feedback-line bad';
    setTimeout(()=>{
      state.answered=false; state.selected=null;
      opts.forEach(b=>{b.disabled=false;b.classList.remove('correct','wrong','selected')});
    },1300);
  }
});

/* ---------------- SCREEN: BUKTI & ANALISIS ---------------- */
function renderEvidence(){
  state.activeSuspect = 'andi';
  const list = $('suspectList');
  list.innerHTML = suspects.map(s=>`<button class="suspect-row ${s.id===state.activeSuspect?'active':''}" data-s="${s.id}">
      <div class="suspect-avatar">🙂</div>
      <div><span class="suspect-name">${s.name}</span><span class="suspect-role">(${s.role})</span></div>
    </button>`).join('');
  list.querySelectorAll('.suspect-row').forEach(btn=>{
    btn.onclick = () => {
      list.querySelectorAll('.suspect-row').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      state.activeSuspect = btn.dataset.s;
      renderAlibi();
    };
  });
  renderAlibi();
}

function renderAlibi(){
  const s = suspects.find(x=>x.id===state.activeSuspect);
  const panel = $('alibiPanel');
  if(!s.alibi){
    panel.innerHTML = `<h3>Alibi ${s.name}</h3><p>Alibi tersangka ini belum diperiksa lebih lanjut pada kasus demo ini.</p>`;
    return;
  }
  panel.innerHTML = `
    <h3>Alibi ${s.name}</h3>
    <p>${s.alibi}</p>
    <div class="calc-block"><b>Perhitungan:</b><br>${s.calc.join('<br>')}</div>
    <div class="conclusion-box ${s.conclusion.ok?'ok':''}">
      <div class="c-title">${s.conclusion.ok?'✅':'❌'} Kesimpulan: ${s.conclusion.title}</div>
      <div class="c-desc">${s.conclusion.desc}</div>
    </div>
    <button class="btn-gold" style="margin-top:18px" data-goto="result">Simpulkan Kasus →</button>
  `;
}

/* ---------------- SCREEN: PRESTASI ---------------- */
function renderAchievements(){
  $('achGrid').innerHTML = achievements.map(a=>`
    <div class="ach-card">
      <div class="ach-icon" style="background:${a.bg};color:${a.color}">${a.icon}</div>
      <p class="ach-title">${a.title}</p>
      <p class="ach-desc">${a.desc}</p>
      <div class="ach-progress-row">${a.n} / ${a.total}</div>
      <div class="ach-bar"><span style="width:${Math.min(100,a.n/a.total*100)}%;background:${a.color}"></span></div>
    </div>
  `).join('');
}

/* ---------------- INIT ---------------- */
document.addEventListener('DOMContentLoaded', () => {
  initProfile();
  renderCases();
  goto('home');
});
})();