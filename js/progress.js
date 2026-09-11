(function(){
const defaults=()=>({persentase:{materi:false,coba:false,latihan:{score:0,total:6}},persamaan:{materi:false,coba:false,latihan:{score:0,total:6}},geometri:{materi:false,coba:false,latihan:{score:0,total:6}},statistik:{materi:false,coba:false,latihan:{score:0,total:6}},trigonometri:{materi:false,coba:false,latihan:{score:0,total:6}},peluang:{materi:false,coba:false,latihan:{score:0,total:6}}});
let data=JSON.parse(localStorage.getItem('mdny_progress')||'null')||defaults();
function merge(base,src){if(!src)return base;Object.keys(base).forEach(k=>{if(src[k]){base[k].materi=!!src[k].materi;base[k].coba=!!src[k].coba;if(src[k].latihan)base[k].latihan=src[k].latihan}});return base}
window.Progress={
data,
defaults,
replace(newData){data=merge(defaults(),newData);window.Progress.data=data;save();render()},
setMateri(k){data[k].materi=true;save();render();sync()},
setCoba(k){data[k].coba=true;save();render();sync()},
setLatihan(k,score,total){data[k].latihan={score,total};save();render();sync()},
export(){return JSON.parse(JSON.stringify(data))},
importAndSave(d){data=merge(defaults(),d);save();render()},
overall(){let n=0;Object.values(data).forEach(x=>{n+=(x.materi?1:0)+(x.coba?1:0)+(x.latihan.score>0?1:0)});return n/18},
render
};
function save(){localStorage.setItem('mdny_progress',JSON.stringify(data))}
function render(){
const names={persentase:'Persentase',persamaan:'Persamaan',geometri:'Geometri',statistik:'Statistik',trigonometri:'Trigonometri',peluang:'Peluang'};
const colors={persentase:'#FF9F1C',persamaan:'#3B82F6',geometri:'#7C3AED',statistik:'#17C3B2',trigonometri:'#F2C94C',peluang:'#E33E57'};
const grid=document.getElementById('progressGrid'); if(!grid)return;
grid.innerHTML=Object.entries(data).map(([k,v])=>{let p=Math.round(((v.materi?1:0)+(v.coba?1:0)+(v.latihan.score>0?1:0))/3*100);return `<div class="progress-card"><div class="title">${names[k]}</div><div class="progress-meta"><span>${p}% selesai</span><span>${v.latihan.score}/${v.latihan.total} latihan</span></div><div class="bar"><span style="width:${p}%;background:${colors[k]}"></span></div></div>`}).join('');
const total=Object.values(data).reduce((s,v)=>s+v.latihan.score,0),max=Object.values(data).reduce((s,v)=>s+v.latihan.total,0);
let rank=window.Progress.overall()===1?'🏆 Master Matematika':window.Progress.overall()>=.72?'🔥 Rajin Belajar':window.Progress.overall()>=.38?'🚀 Explorer':'🌱 Pemula';
document.getElementById('rankBadge').textContent=rank;
}
async function sync(){if(window.saveProgressToCloud) await window.saveProgressToCloud(data)}
document.addEventListener('DOMContentLoaded',render);
})();