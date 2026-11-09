/* =========================================================
   KASIR KILAT — game hitung cepat
   Matematika di Dunia Nyata
   Materi yang dilatih: kembalian, diskon, diskon berturut-turut,
   pajak, harga awal (reverse), untung/rugi, dan perhitungan gabungan.
========================================================= */
(() => {
'use strict';

/* ---------------------------------------------------------
   UTIL
--------------------------------------------------------- */
const $ = (id) => document.getElementById(id);
const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const fmt = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const rp = (n) => 'Rp' + fmt(n);
const dec = (n) => String(n).replace('.', ',');
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const safeParse = (s, fb) => { try { const v = JSON.parse(s); return v == null ? fb : v; } catch (e) { return fb; } };

const USER = localStorage.getItem('mdny_current_user') || 'Tamu';
const NAME = USER.includes('@') ? USER.split('@')[0] : USER;
const SAVE_KEY = 'mdny_kasir_v1:' + USER;
const LB_KEY = 'mdny_kasir_lb_v1';

/* ---------------------------------------------------------
   DATA TETAP: PANGKAT, MODIFIER HARI, UPGRADE, ACHIEVEMENT
--------------------------------------------------------- */
const RANKS = [
  { at: 0,         icon: '🛒', name: 'Pedagang Kaki Lima' },
  { at: 500000,    icon: '🏪', name: 'Penjaga Warung' },
  { at: 2000000,   icon: '🧾', name: 'Kasir Minimarket' },
  { at: 5000000,   icon: '📋', name: 'Supervisor Toko' },
  { at: 12000000,  icon: '💼', name: 'Manajer Toko' },
  { at: 30000000,  icon: '🏬', name: 'Pemilik Waralaba' },
  { at: 70000000,  icon: '👑', name: 'Juragan Retail' },
  { at: 150000000, icon: '💎', name: 'Konglomerat' }
];
const rankOf = (total) => { let r = 0; RANKS.forEach((x, i) => { if (total >= x.at) r = i; }); return r; };

const MODS = {
  normal:  { id: 'normal',  icon: '🌤️', name: 'Hari Biasa',   desc: 'Pesanan campuran seperti biasa.', spawn: 1, w: {} },
  gajian:  { id: 'gajian',  icon: '💸', name: 'Hari Gajian',  desc: 'Toko ramai! Pelanggan datang lebih cepat dan banyak belanja.', spawn: 0.8, w: { basket: 3, basket_change: 3, change: 2 } },
  sale:    { id: 'sale',    icon: '🏷️', name: 'Cuci Gudang',  desc: 'Diskon di mana-mana. Awas diskon berturut-turut!', spawn: 1, w: { discount: 3, double: 3, reverse: 2 } },
  bulanan: { id: 'bulanan', icon: '📈', name: 'Akhir Bulan',  desc: 'Waktunya hitung pajak dan margin untung.', spawn: 1, w: { tax: 3, margin: 3, mix: 3 } },
  boss:    { id: 'boss',    icon: '🧐', name: 'Inspeksi Bos', desc: 'Bos datang menginspeksi! Target lebih tinggi dan banyak pelanggan VIP. Lolos = bonus + 1 reputasi.', spawn: 0.85, w: {} }
};

const UPGRADES = [
  { id: 'patience', icon: '☕', name: 'Kopi Gratis',        desc: 'Kesabaran pelanggan +15% per level.',               max: 3, base: 150000 },
  { id: 'time',     icon: '⏱️', name: 'Jam Buka Lebih Lama', desc: 'Durasi tiap hari +8 detik per level.',               max: 3, base: 200000 },
  { id: 'tip',      icon: '💳', name: 'Mesin EDC',           desc: 'Bonus kecepatan (tip) +10% per level.',              max: 3, base: 180000 },
  { id: 'hint',     icon: '🧮', name: 'Kalkulator Saku',     desc: '+1 Bantuan per hari. Pakai bantuan = pendapatan −30%.', max: 3, base: 220000 },
  { id: 'combo',    icon: '🔥', name: 'Buku Catatan Combo',  desc: 'Bonus combo +1,5% lebih besar per level.',           max: 3, base: 250000 },
  { id: 'heart',    icon: '❤️', name: 'Pulihkan Reputasi',   desc: '+1 reputasi (maksimal 5).',                          max: 99, base: 250000, special: true }
];

const ACH = [
  { id: 'first',     icon: '🧾', name: 'Shift Pertama',       desc: 'Selesaikan hari pertama.' },
  { id: 'serve50',   icon: '🙋', name: 'Ramah Pelanggan',     desc: 'Layani total 50 pelanggan.',                       test: () => S.served >= 50 },
  { id: 'lightning', icon: '⚡', name: 'Tangan Kilat',        desc: 'Jawab benar kurang dari 3 detik.' },
  { id: 'combo10',   icon: '🔥', name: 'Combo ×10',           desc: 'Raih combo 10 tanpa salah.',                       test: () => S.combo >= 10 },
  { id: 'day5',      icon: '🧐', name: 'Lolos Inspeksi',      desc: 'Selesaikan hari ke-5 (Inspeksi Bos).' },
  { id: 'perfect',   icon: '💎', name: 'Hari Sempurna',       desc: 'Selesaikan hari tanpa salah dan tanpa pelanggan kabur.' },
  { id: 'double15',  icon: '🏷️', name: 'Raja Diskon',         desc: 'Jawab 15 soal diskon berturut-turut dengan benar.', test: () => S.doubleOk >= 15 },
  { id: 'margin10',  icon: '📈', name: 'Ahli Margin',         desc: 'Jawab 10 soal untung/rugi dengan benar.',          test: () => S.marginOk >= 10 },
  { id: 'vip5',      icon: '👑', name: 'Pelanggan Prioritas', desc: 'Layani 5 pelanggan VIP.',                          test: () => S.vipOk >= 5 },
  { id: 'day10',     icon: '🏆', name: 'Pemilik Toko',        desc: 'Selesaikan hari ke-10.' },
  { id: 'rich',      icon: '💰', name: 'Sultan Omzet',        desc: 'Kumpulkan omzet Rp15.000.000 dalam satu permainan.', test: () => !!run && run.total >= 15000000 }
];

const NAMES = ['Bu Sari', 'Pak Budi', 'Mbak Rina', 'Mas Dimas', 'Bu Tini', 'Pak Haji', 'Kak Dewi', 'Om Anto', 'Tante Linda', 'Dek Fajar', 'Bu Ratna', 'Pak Joko', 'Mbak Putri', 'Mas Reza', 'Nenek Ijah', 'Kak Bagas'];
const AVATARS = ['🧑‍🦱', '👩‍🦰', '🧔', '👵', '👨‍🦳', '👩‍🦱', '🧑‍🎓', '👨‍🍳', '👩‍💼', '🧑‍🔧', '👴', '👩‍🦳', '🧕'];
const ITEMS = [
  ['Mie instan', 3500], ['Telur 1 kg', 28000], ['Minyak goreng 1 L', 18000], ['Beras 5 kg', 72000], ['Gula 1 kg', 16000],
  ['Kopi sachet', 2500], ['Teh botol', 5000], ['Roti tawar', 16000], ['Susu UHT', 7000], ['Sabun mandi', 4500],
  ['Pasta gigi', 12000], ['Sampo sachet', 1500], ['Air mineral', 4000], ['Biskuit', 9500], ['Kecap manis', 14000]
];
const NOTES = [20000, 50000, 100000, 200000, 500000];
const nextNote = (v) => NOTES.find((n) => n > v) || Math.ceil((v + 1) / 100000) * 100000;

/* ---------------------------------------------------------
   GENERATOR PESANAN (semua jawaban dijamin bilangan bulat)
--------------------------------------------------------- */
function genChange() {
  const A = rand(15, 190) * 500, B = nextNote(A);
  return {
    rows: [['Total belanja', rp(A)], ['Uang diterima', rp(B)]],
    q: 'Berapa uang kembaliannya?', answer: B - A, unit: 'rp', bill: A,
    hint: 'Kembalian = uang diterima − total belanja',
    steps: [`Kembalian = ${rp(B)} − ${rp(A)} = ${rp(B - A)}`]
  };
}
function genDiscount() {
  const P = 5000 * rand(4, 40), d = pick([10, 15, 20, 25, 30, 40, 50]);
  const disc = P * d / 100, pay = P - disc;
  return {
    rows: [['Harga barang', rp(P)], ['Diskon', d + '%']],
    q: 'Berapa harga yang harus dibayar?', answer: pay, unit: 'rp', bill: pay,
    hint: `Besar diskon = ${d}% × ${rp(P)} = ${rp(disc)}`,
    steps: [`Diskon = ${d}% × ${rp(P)} = ${rp(disc)}`, `Bayar = ${rp(P)} − ${rp(disc)} = ${rp(pay)}`]
  };
}
function pickBasket(maxItems, maxQty) {
  const n = rand(2, maxItems), used = new Set(), list = [];
  while (list.length < n) {
    const it = pick(ITEMS);
    if (used.has(it[0])) continue;
    used.add(it[0]);
    list.push({ name: it[0], price: it[1], qty: rand(1, maxQty) });
  }
  return list;
}
function genBasket() {
  const list = pickBasket(3, 4);
  const total = list.reduce((s, x) => s + x.price * x.qty, 0);
  const f = list[0];
  return {
    rows: list.map((x) => [`${x.name} ×${x.qty}`, '@' + rp(x.price)]),
    q: 'Berapa total belanjanya?', answer: total, unit: 'rp', bill: total,
    hint: `${f.name}: ${f.qty} × ${rp(f.price)} = ${rp(f.qty * f.price)} (lalu jumlahkan semuanya)`,
    steps: list.map((x) => `${x.name}: ${x.qty} × ${rp(x.price)} = ${rp(x.qty * x.price)}`).concat([`Total = ${rp(total)}`])
  };
}
function genBasketChange() {
  const list = pickBasket(3, 3);
  const total = list.reduce((s, x) => s + x.price * x.qty, 0), B = nextNote(total);
  const f = list[0];
  return {
    rows: list.map((x) => [`${x.name} ×${x.qty}`, '@' + rp(x.price)]).concat([['Uang diterima', rp(B)]]),
    q: 'Berapa uang kembaliannya?', answer: B - total, unit: 'rp', bill: total,
    hint: `${f.name}: ${f.qty} × ${rp(f.price)} = ${rp(f.qty * f.price)} (jumlahkan semua dulu, baru cari kembalian)`,
    steps: list.map((x) => `${x.name}: ${x.qty} × ${rp(x.price)} = ${rp(x.qty * x.price)}`)
      .concat([`Total = ${rp(total)}`, `Kembalian = ${rp(B)} − ${rp(total)} = ${rp(B - total)}`])
  };
}
function genTax() {
  const P = 5000 * rand(4, 40), tax = P / 10, tot = P + tax;
  return {
    rows: [['Harga barang', rp(P)], ['Pajak', '10%']],
    q: 'Berapa total yang harus dibayar?', answer: tot, unit: 'rp', bill: tot,
    hint: `Pajak = 10% × ${rp(P)} = ${rp(tax)}`,
    steps: [`Pajak = 10% × ${rp(P)} = ${rp(tax)}`, `Total = ${rp(P)} + ${rp(tax)} = ${rp(tot)}`]
  };
}
function genDouble() {
  const P = 10000 * rand(3, 20), ds = [10, 20, 25, 30, 40, 50], d1 = pick(ds), d2 = pick(ds);
  const a1 = P * (100 - d1) / 100, a2 = a1 * (100 - d2) / 100;
  return {
    rows: [['Harga barang', rp(P)], ['Diskon pertama', d1 + '%'], ['Diskon kedua', d2 + '%']],
    q: 'Berapa harga akhir yang dibayar?', answer: a2, unit: 'rp', bill: a2,
    hint: `Setelah diskon ${d1}% harganya ${rp(a1)}. Diskon kedua dihitung dari harga ini.`,
    steps: [`Setelah diskon ${d1}%: ${rp(P)} × ${dec((100 - d1) / 100)} = ${rp(a1)}`, `Setelah diskon ${d2}%: ${rp(a1)} × ${dec((100 - d2) / 100)} = ${rp(a2)}`]
  };
}
function genReverse() {
  const P = 10000 * rand(3, 20), d = pick([10, 20, 25, 40, 50]);
  const F = P * (100 - d) / 100;
  return {
    rows: [['Diskon', d + '%'], ['Harga setelah diskon', rp(F)]],
    q: 'Berapa harga awal sebelum diskon?', answer: P, unit: 'rp', bill: F,
    hint: `Harga bayar = ${100 - d}% dari harga awal, jadi harga awal = ${rp(F)} ÷ ${dec((100 - d) / 100)}`,
    steps: [`Harga bayar = ${100 - d}% dari harga awal`, `Harga awal = ${rp(F)} ÷ ${dec((100 - d) / 100)} = ${rp(P)}`]
  };
}
function genMargin() {
  const B = 10000 * rand(2, 15), p = pick([10, 20, 25, 30, 40, 50]), gain = Math.random() < 0.7;
  const S_ = gain ? B * (100 + p) / 100 : B * (100 - p) / 100;
  const diff = Math.abs(S_ - B), w = gain ? 'Untung' : 'Rugi';
  return {
    rows: [['Harga beli', rp(B)], ['Harga jual', rp(S_)]],
    q: `${w} berapa persen? (jawab angkanya saja)`, answer: p, unit: '%', bill: S_,
    hint: `${w} = selisih harga jual dan harga beli = ${rp(diff)}`,
    steps: [`${w} = ${rp(Math.max(S_, B))} − ${rp(Math.min(S_, B))} = ${rp(diff)}`, `Persentase = ${rp(diff)} ÷ ${rp(B)} × 100% = ${p}%`]
  };
}
function genMix() {
  const P = 10000 * rand(3, 15), d = pick([10, 20, 25, 30, 40, 50]);
  const after = P * (100 - d) / 100, tot = after + after / 10, B = nextNote(tot);
  return {
    rows: [['Harga barang', rp(P)], ['Diskon', d + '%'], ['Pajak (setelah diskon)', '10%'], ['Uang diterima', rp(B)]],
    q: 'Berapa uang kembaliannya?', answer: B - tot, unit: 'rp', bill: tot,
    hint: `Setelah diskon ${d}%: ${rp(P)} × ${dec((100 - d) / 100)} = ${rp(after)}`,
    steps: [`Setelah diskon ${d}%: ${rp(after)}`, `Setelah pajak 10%: ${rp(after)} × 1,1 = ${rp(tot)}`, `Kembalian = ${rp(B)} − ${rp(tot)} = ${rp(B - tot)}`]
  };
}

const KINDS = {
  change:        { gen: genChange,       min: 1, w: 4, diff: 1, label: '💱 Kembalian' },
  discount:      { gen: genDiscount,     min: 1, w: 4, diff: 1, label: '🏷️ Diskon' },
  basket:        { gen: genBasket,       min: 2, w: 3, diff: 2, label: '🧺 Belanja' },
  basket_change: { gen: genBasketChange, min: 2, w: 3, diff: 2, label: '🧺 Belanja + kembalian' },
  tax:           { gen: genTax,          min: 3, w: 3, diff: 2, label: '🧾 Pajak' },
  double:        { gen: genDouble,       min: 3, w: 3, diff: 3, label: '🏷️ Diskon berturut-turut' },
  reverse:       { gen: genReverse,      min: 4, w: 3, diff: 3, label: '🔄 Harga awal' },
  margin:        { gen: genMargin,       min: 5, w: 3, diff: 3, label: '📈 Untung / Rugi' },
  mix:           { gen: genMix,          min: 6, w: 3, diff: 3, label: '🧮 Gabungan' }
};

function genOrder(day, mod) {
  const pool = [];
  Object.keys(KINDS).forEach((k) => {
    const K = KINDS[k];
    if (K.min > day) return;
    let w = K.w * ((mod.w && mod.w[k]) || 1);
    w *= Math.max(0.3, 1 - 0.07 * Math.max(0, day - K.min - 1));
    pool.push([k, w]);
  });
  let r = Math.random() * pool.reduce((s, p) => s + p[1], 0), kind = pool[0][0];
  for (const p of pool) { r -= p[1]; if (r <= 0) { kind = p[0]; break; } }
  const o = KINDS[kind].gen();
  o.kind = kind; o.diff = KINDS[kind].diff; o.label = KINDS[kind].label;
  return o;
}

/* ---------------------------------------------------------
   KESEIMBANGAN
--------------------------------------------------------- */
const MAXQ = 3;
const BASE_TIME = 60;
const targetOf = (day) => {
  // Disetel lewat simulasi: awal ramah, naik cepat di tengah, lalu landai.
  const base = day <= 8 ? 400000 + 190000 * (day - 1) - 6000 * (day - 1) * (day - 1)
                        : 1436000 + 90000 * (day - 8);
  return Math.round(base * (day % 5 === 0 ? 1.15 : 1) / 10000) * 10000;
};
const upgCost = (u, lvl) => {
  if (u.special) return u.base + 100000 * run.heartsBought;
  return Math.round(u.base * (1 + 0.6 * lvl) / 5000) * 5000;
};

/* ---------------------------------------------------------
   STATE
--------------------------------------------------------- */
const defaultSave = () => ({ career: 0, bestScore: 0, bestDay: 0, runs: 0, served: 0, combo: 0, perfect: 0, doubleOk: 0, marginOk: 0, vipOk: 0, ach: {}, muted: false, seen: false });
let S = Object.assign(defaultSave(), safeParse(localStorage.getItem(SAVE_KEY), {}));
if (typeof S.ach !== 'object' || S.ach === null) S.ach = {};
let run = null, D = null, raf = 0, lastTs = 0;

function persist() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(S)); } catch (e) { /* abaikan */ } }
function getLB() { const v = safeParse(localStorage.getItem(LB_KEY), []); return Array.isArray(v) ? v : []; }
function addLB(entry) {
  const lb = getLB(); lb.push(entry); lb.sort((a, b) => b.score - a.score);
  try { localStorage.setItem(LB_KEY, JSON.stringify(lb.slice(0, 50))); } catch (e) { /* abaikan */ }
}

/* ---------------------------------------------------------
   SUARA (WebAudio sederhana)
--------------------------------------------------------- */
let AC = null;
function beep(freq, dur, type, vol, when) {
  if (S.muted) return;
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    const o = AC.createOscillator(), g = AC.createGain(), t = AC.currentTime + (when || 0);
    o.type = type || 'sine'; o.frequency.value = freq;
    g.gain.setValueAtTime(vol || 0.05, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t + dur + 0.03);
  } catch (e) { /* abaikan */ }
}
const sfx = {
  ok:   () => { beep(880, 0.12, 'triangle', 0.06); beep(1320, 0.2, 'triangle', 0.06, 0.08); },
  bad:  () => { beep(170, 0.28, 'sawtooth', 0.05); },
  lost: () => { beep(300, 0.18, 'square', 0.04); beep(180, 0.3, 'square', 0.04, 0.15); },
  rush: () => { beep(660, 0.12, 'square', 0.04); beep(880, 0.12, 'square', 0.04, 0.14); beep(660, 0.12, 'square', 0.04, 0.28); },
  win:  () => { [523, 659, 784, 1047].forEach((f, i) => beep(f, 0.22, 'triangle', 0.06, i * 0.12)); },
  unlock: () => { beep(988, 0.1, 'sine', 0.06); beep(1319, 0.3, 'sine', 0.06, 0.1); },
  click: () => { beep(520, 0.04, 'sine', 0.03); }
};

/* ---------------------------------------------------------
   SCREEN, MODAL, TOAST, FX
--------------------------------------------------------- */
function show(id) {
  document.querySelectorAll('.screen').forEach((s) => s.classList.remove('active'));
  $('screen-' + id).classList.add('active');
  window.scrollTo(0, 0);
}
function openModal(html) { $('modalCard').innerHTML = html; $('modal').classList.remove('hidden'); }
function closeModal() { $('modal').classList.add('hidden'); }
function toast(icon, title, sub) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = `<span class="i">${icon}</span><div><b>${esc(title)}</b><small>${esc(sub)}</small></div>`;
  $('toasts').appendChild(t);
  setTimeout(() => t.remove(), 4200);
}
function floatText(text, cls, el) {
  const f = document.createElement('div');
  f.className = 'float ' + (cls || '');
  f.textContent = text;
  const r = (el || $('desk')).getBoundingClientRect();
  f.style.left = (r.left + r.width * (0.25 + Math.random() * 0.5)) + 'px';
  f.style.top = (r.top + r.height * 0.35) + 'px';
  $('fx').appendChild(f);
  setTimeout(() => f.remove(), 1250);
}
function banner(text, ms) {
  const b = $('banner'); b.textContent = text; b.classList.remove('hidden');
  clearTimeout(banner.t); banner.t = setTimeout(() => b.classList.add('hidden'), ms || 3000);
}
function unlock(id) {
  if (S.ach[id]) return;
  S.ach[id] = Date.now();
  const a = ACH.find((x) => x.id === id);
  if (a) { toast(a.icon, 'Achievement terbuka!', a.name); sfx.unlock(); }
  persist();
}
function checkStats() { ACH.forEach((a) => { if (a.test && !S.ach[a.id] && a.test()) unlock(a.id); }); }

/* ---------------------------------------------------------
   MENU
--------------------------------------------------------- */
function refreshMenu() {
  const ri = rankOf(S.career), r = RANKS[ri], nx = RANKS[ri + 1];
  $('menuName').textContent = NAME;
  $('rankIcon').textContent = r.icon;
  $('rankName').textContent = r.name;
  if (nx) {
    $('rankBar').style.width = clamp((S.career - r.at) / (nx.at - r.at) * 100, 0, 100) + '%';
    $('rankSub').textContent = 'Total omzet ' + rp(S.career);
    $('rankNext').textContent = `Berikutnya: ${nx.icon} ${nx.name} (${rp(nx.at)})`;
  } else {
    $('rankBar').style.width = '100%';
    $('rankSub').textContent = 'Total omzet ' + rp(S.career);
    $('rankNext').textContent = 'Pangkat tertinggi! 💎';
  }
  $('stBestScore').textContent = rp(S.bestScore);
  $('stBestDay').textContent = S.bestDay;
  $('stServed').textContent = fmt(S.served);
  $('achCount').textContent = Object.keys(S.ach).length + '/' + ACH.length;
  $('btnMute').textContent = S.muted ? '🔇' : '🔊';
}

function openHow() {
  openModal(`<h3>❓ Cara Main</h3>
  <ul class="how">
    <li>Pelanggan datang dengan <b>pesanan</b>. <b>Klik pelanggan</b> (atau tekan <kbd>←</kbd> <kbd>→</kbd>) untuk melayaninya.</li>
    <li>Hitung jawabannya, <b>ketik angka</b> (keyboard atau tombol di layar), lalu tekan <kbd>Enter</kbd> / <b>BAYAR</b>.</li>
    <li>Makin <b>cepat</b> dan makin panjang <b>combo</b>, makin besar pendapatanmu.</li>
    <li><b>Salah</b> = kesabaran pelanggan −20% dan combo putus. Kesabaran habis = pelanggan <b>kabur</b> dan reputasi −1 ❤️. Reputasi 0 = toko ditutup.</li>
    <li>Capai <b>target omzet</b> sebelum waktu habis, lalu belanja upgrade di antara hari.</li>
    <li><b>VIP 👑</b> membayar 2× tapi tidak sabaran. Tiap hari kelipatan 5 ada <b>Inspeksi Bos</b> 🧐.</li>
    <li>Pintasan: <kbd>H</kbd> bantuan, <kbd>P</kbd> jeda, <kbd>Esc</kbd> hapus ketikan.</li>
  </ul>
  <div class="modal-actions"><button class="btn primary" id="mClose">Mengerti</button></div>`);
  $('mClose').onclick = closeModal;
}
function openAch() {
  const n = Object.keys(S.ach).length;
  openModal(`<h3>🏅 Achievement <small style="font-size:14px;color:var(--muted)">${n}/${ACH.length}</small></h3>
  <div class="ach-grid">${ACH.map((a) => `
    <div class="ach ${S.ach[a.id] ? 'done' : 'locked'}"><span class="i">${a.icon}</span><div><b>${a.name}</b><small>${a.desc}</small></div></div>`).join('')}
  </div>
  <div class="modal-actions"><button class="btn" id="mClose">Tutup</button></div>`);
  $('mClose').onclick = closeModal;
}
function openLB() {
  const lb = getLB().slice(0, 10);
  const medal = (i) => ['🥇', '🥈', '🥉'][i] || (i + 1);
  openModal(`<h3>👑 Leaderboard</h3>
  ${lb.length ? `<table class="lb"><thead><tr><th>#</th><th>NAMA</th><th>HARI</th><th>OMZET</th></tr></thead><tbody>
    ${lb.map((e, i) => `<tr class="${e.name === NAME ? 'me' : ''}"><td>${medal(i)}</td><td>${esc(e.name)}</td><td>${e.day}</td><td class="num">${rp(e.score)}</td></tr>`).join('')}
  </tbody></table>` : '<p class="note">Belum ada skor. Jadilah yang pertama membuka toko! 🛒</p>'}
  <p class="note">Papan skor tersimpan di perangkat/browser ini.</p>
  <div class="modal-actions"><button class="btn" id="mClose">Tutup</button></div>`);
  $('mClose').onclick = closeModal;
}

/* ---------------------------------------------------------
   ALUR RUN: INTRO HARI -> MAIN -> TOKO -> ... -> GAME OVER
--------------------------------------------------------- */
function newRun() {
  run = {
    day: 1, cash: 0, total: 0, hearts: 3, heartsBought: 0, cleared: 0,
    upg: { patience: 0, time: 0, tip: 0, hint: 0, combo: 0 },
    missed: [], rankBefore: rankOf(S.career), plan: null
  };
  S.seen = true; persist();
  showIntro();
}

function prepareDay() {
  const day = run.day, boss = day % 5 === 0;
  let mod = MODS.normal;
  if (boss) mod = MODS.boss;
  else if (day > 1) {
    const pool = ['normal', 'gajian'];
    if (day >= 3) pool.push('sale');
    if (day >= 5) pool.push('bulanan');
    mod = MODS[pick(pool)];
  }
  run.plan = { day, boss, mod, target: targetOf(day), total: BASE_TIME + 8 * run.upg.time };
}

function showIntro() {
  prepareDay();
  const p = run.plan;
  const fresh = Object.keys(KINDS).filter((k) => KINDS[k].min === p.day).map((k) => KINDS[k].label);
  $('screen-intro').innerHTML = `
    <div class="intro">
      <div class="big-ico">${p.mod.icon}</div>
      <div class="eyebrow">${p.boss ? 'HARI BOSS' : 'SHIFT BARU'}</div>
      <h2>Hari ${p.day}</h2>
      <p><b>${p.mod.name}</b> — ${p.mod.desc}</p>
      <div class="goal-pill"><small>TARGET OMZET HARI INI</small><b>${rp(p.target)}</b></div>
      <div class="newtags">
        <span class="tag gold">⏱ ${p.total} detik</span>
        <span class="tag gold">❤️ Reputasi ${run.hearts}</span>
        ${fresh.map((l) => `<span class="tag">✨ Pesanan baru: ${l}</span>`).join('')}
      </div>
      <button class="btn primary big" id="btnOpen">🛒 Buka Toko!</button>
    </div>`;
  show('intro');
  $('btnOpen').onclick = beginDay;
}

function beginDay() {
  const p = run.plan;
  D = {
    state: 'play', paused: false, clock: 0, t: p.total, total: p.total, earned: 0,
    target: p.target, mod: p.mod, boss: p.boss, day: p.day,
    customers: [], sel: null, spawnIn: 0.25, first: true, nextId: 1,
    served: 0, wrong: 0, lost: 0, combo: 0, maxCombo: 0, hints: 1 + run.upg.hint,
    rushAt: p.day >= 3 ? p.total * (0.35 + Math.random() * 0.3) : Infinity, rushing: false, rushDone: false, rushEnd: 0,
    missed: []
  };
  $('hudDay').textContent = 'Hari ' + p.day;
  $('hudMod').textContent = p.mod.icon + ' ' + p.mod.name;
  $('hudTarget').textContent = '/ ' + rp(p.target);
  $('banner').classList.add('hidden');
  $('hintBox').classList.add('hidden');
  renderQueue(); renderReceipt(); updateDisplay(); updateHud(true);
  show('play');
  if (p.boss) banner('🧐 INSPEKSI BOS! Banyak VIP hari ini — buktikan kemampuanmu!', 3500);
  lastTs = performance.now();
  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(loop);
}

function loop(ts) {
  if (!D || D.state !== 'play') return;
  const dt = Math.min(0.1, (ts - lastTs) / 1000); lastTs = ts;
  if (!D.paused) step(dt);
  if (D && D.state === 'play') raf = requestAnimationFrame(loop);
}

/* ---------------------------------------------------------
   PELANGGAN
--------------------------------------------------------- */
function nextGap() {
  const base = Math.max(2.6, 6.2 - 0.3 * (D.day - 1)) * D.mod.spawn * (D.rushing ? 0.5 : 1);
  return base * (0.8 + Math.random() * 0.4);
}
function makeCustomer() {
  const vipChance = D.boss ? 0.35 : D.day >= 3 ? Math.min(0.2, 0.04 + 0.02 * (D.day - 2)) : 0;
  const vip = Math.random() < vipChance;
  const order = genOrder(D.day, D.mod);
  const dayF = Math.max(0.62, 1 - 0.035 * (D.day - 1));
  let pat = (15 + order.diff * 5) * dayF * (1 + 0.15 * run.upg.patience);
  if (vip) pat *= 0.75;
  return { id: D.nextId++, name: pick(NAMES), av: pick(AVATARS), vip, order, patMax: pat, pat, typed: '', wrong: 0, hinted: false, focus: D.clock };
}
function addCustomer() {
  const c = makeCustomer();
  D.customers.push(c);
  if (D.sel == null) select(c.id, true);
  renderQueue();
}
const selected = () => (D ? D.customers.find((c) => c.id === D.sel) : null);
function select(id, silent) {
  if (!D) return;
  D.sel = id;
  const c = selected();
  if (c) c.focus = D.clock;
  renderReceipt(); updateDisplay(); renderQueueSel();
  if (!silent) sfx.click();
}
function pickUrgent() {
  if (!D.customers.length) { D.sel = null; return; }
  D.sel = D.customers.slice().sort((a, b) => a.pat - b.pat)[0].id;
  const c = selected(); if (c) c.focus = D.clock;
}
function cycle(dir) {
  if (!D || !D.customers.length) return;
  const i = D.customers.findIndex((c) => c.id === D.sel);
  const n = D.customers[(i + dir + D.customers.length) % D.customers.length];
  select(n.id);
}

function removeCustomer(c, how) {
  const idx = D.customers.indexOf(c);
  if (idx < 0) return;
  D.customers.splice(idx, 1);
  const wasSel = D.sel === c.id;
  const el = document.querySelector(`.cust[data-id="${c.id}"]`);
  if (el && how === 'lost') { el.classList.add('leaving'); }
  if (wasSel) pickUrgent();
  setTimeout(() => { renderQueue(); renderReceipt(); updateDisplay(); }, how === 'lost' ? 260 : 0);
  if (!wasSel) { renderQueueSel(); }
}

function loseCustomer(c, why) {
  D.lost++; D.combo = 0; run.hearts--;
  const m = { label: c.order.label, rows: c.order.rows, q: c.order.q, answer: c.order.answer, unit: c.order.unit, steps: c.order.steps, why };
  D.missed.push(m); run.missed.push(m);
  sfx.lost();
  floatText('😡 Pelanggan kabur  −❤️', 'bad');
  $('hudHearts').classList.add('hit'); setTimeout(() => $('hudHearts').classList.remove('hit'), 450);
  removeCustomer(c, 'lost');
  updateHud(true);
  if (run.hearts <= 0) endRun('hearts');
}

/* ---------------------------------------------------------
   LOOP PERMAINAN
--------------------------------------------------------- */
function step(dt) {
  D.clock += dt; D.t -= dt;

  if (!D.rushDone && D.clock >= D.rushAt) {
    D.rushDone = true; D.rushing = true; D.rushEnd = D.clock + 10;
    banner('🚨 JAM SIBUK! Pelanggan datang lebih cepat • pendapatan +25%', 3800); sfx.rush();
  }
  if (D.rushing && D.clock >= D.rushEnd) D.rushing = false;

  D.spawnIn -= dt;
  if (D.spawnIn <= 0) {
    if (D.customers.length < MAXQ) { addCustomer(); D.spawnIn = D.first ? 1.6 : nextGap(); D.first = false; }
    else D.spawnIn = 0.4;
  }

  for (const c of D.customers.slice()) {
    c.pat -= dt;
    if (c.pat <= 0) { loseCustomer(c, 'kabur'); if (!D || D.state !== 'play') return; }
  }

  updateHud(false);
  updateBars();
  if (D.t <= 0) endDay();
}

/* ---------------------------------------------------------
   INPUT JAWABAN
--------------------------------------------------------- */
function typeKey(k) {
  const c = selected();
  if (!D || D.state !== 'play' || D.paused || !c) return;
  if (k === 'back') c.typed = c.typed.slice(0, -1);
  else if (k === 'clear') c.typed = '';
  else if (k === 'pay') { submit(); return; }
  else if (/^\d+$/.test(k)) {
    if (k === '000' && c.typed === '') return;
    if ((c.typed + k).length > 9) return;
    c.typed = (c.typed === '0' ? '' : c.typed) + k;
  }
  updateDisplay();
}

function submit() {
  const c = selected();
  if (!D || D.state !== 'play' || D.paused || !c || c.typed === '') return;
  if (parseInt(c.typed, 10) === c.order.answer) correct(c); else wrong(c);
}

function correct(c) {
  const o = c.order, elapsed = D.clock - c.focus;
  const frac = clamp(c.pat / c.patMax, 0, 1);
  const speedMul = 1 + (0.25 + 0.10 * run.upg.tip) * frac;
  const comboMul = 1 + Math.min(D.combo, 15) * (0.03 + 0.015 * run.upg.combo);
  const mul = speedMul * comboMul * (c.vip ? 2 : 1) * (D.rushing ? 1.25 : 1) * (c.hinted ? 0.7 : 1);
  const earn = Math.max(500, Math.round(o.bill * mul / 500) * 500);

  D.earned += earn; run.cash += earn; run.total += earn; S.career += earn;
  D.served++; S.served++; D.combo++; D.maxCombo = Math.max(D.maxCombo, D.combo); S.combo = Math.max(S.combo, D.combo);
  if (o.kind === 'double') S.doubleOk++;
  if (o.kind === 'margin') S.marginOk++;
  if (c.vip) S.vipOk++;
  if (elapsed < 3) unlock('lightning');

  sfx.ok();
  floatText('+' + rp(earn), 'ok');
  if (c.vip) floatText('👑 VIP ×2', 'gold');
  if (D.combo >= 3) floatText('🔥 Combo ×' + D.combo, 'gold');
  $('desk').classList.remove('flash-ok'); void $('desk').offsetWidth; $('desk').classList.add('flash-ok');
  $('hudCombo').classList.remove('pop'); void $('hudCombo').offsetWidth; $('hudCombo').classList.add('pop');

  removeCustomer(c, 'served');
  checkStats();
  updateHud(true);
  $('hintBox').classList.add('hidden');
}

function wrong(c) {
  c.wrong++; D.wrong++; D.combo = 0;
  c.pat -= c.patMax * 0.2;
  c.typed = '';
  sfx.bad();
  $('desk').classList.remove('shake'); void $('desk').offsetWidth; $('desk').classList.add('shake');
  if (c.wrong >= 3) {
    floatText('Salah 3×! Pelanggan pergi', 'bad');
    loseCustomer(c, 'salah 3×');
    return;
  }
  floatText('Salah! −20% kesabaran', 'bad');
  if (c.pat <= 0) { loseCustomer(c, 'kabur'); return; }
  updateDisplay(); updateHud(true);
}

function useHint() {
  const c = selected();
  if (!D || D.state !== 'play' || D.paused || !c) return;
  if (!c.hinted) {
    if (D.hints <= 0) { floatText('Bantuan habis', 'bad'); return; }
    D.hints--; c.hinted = true;
  }
  const hb = $('hintBox');
  hb.innerHTML = '💡 ' + esc(c.order.hint) + (c.hinted ? ' <small>(pendapatan −30%)</small>' : '');
  hb.classList.remove('hidden');
  updateHud(true);
}

/* ---------------------------------------------------------
   RENDER PERMAINAN
--------------------------------------------------------- */
function renderQueue() {
  const q = $('queue');
  if (!D) return;
  let html = '<div class="queue-title">ANTREAN</div>';
  D.customers.forEach((c) => {
    html += `<button class="cust ${c.vip ? 'vip' : ''} ${c.id === D.sel ? 'sel' : ''}" data-id="${c.id}">
      <span class="av">${c.av}</span>
      <span class="meta"><b>${esc(c.name)}</b><small>${c.order.label}</small></span>
      <span class="pbar"><i></i></span></button>`;
  });
  for (let i = D.customers.length; i < MAXQ; i++) html += '<div class="queue-empty">menunggu pelanggan…</div>';
  q.innerHTML = html;
  q.querySelectorAll('.cust').forEach((el) => { el.onclick = () => select(+el.dataset.id); });
  updateBars();
}
function renderQueueSel() {
  document.querySelectorAll('#queue .cust').forEach((el) => el.classList.toggle('sel', +el.dataset.id === D.sel));
}
function updateBars() {
  if (!D) return;
  D.customers.forEach((c) => {
    const el = document.querySelector(`.cust[data-id="${c.id}"]`);
    if (!el) return;
    const frac = clamp(c.pat / c.patMax, 0, 1), bar = el.querySelector('.pbar i');
    bar.style.width = (frac * 100) + '%';
    bar.className = frac < 0.25 ? 'low' : frac < 0.55 ? 'mid' : '';
    el.classList.toggle('urgent', frac < 0.25);
  });
}
function renderReceipt() {
  const r = $('receipt'), c = selected();
  if (!c) {
    r.className = 'receipt idle';
    r.innerHTML = '<div>🧾<br><b>Menunggu pelanggan…</b><br><small>Pesanan akan muncul di sini</small></div>';
    $('hintBox').classList.add('hidden');
    return;
  }
  const o = c.order;
  r.className = 'receipt';
  r.innerHTML = `<div class="rh">— STRUK PESANAN —<small>${esc(c.name)} ${c.vip ? '· 👑 VIP (bayar 2×)' : ''}</small></div>
    ${o.rows.map((x) => `<div class="ln"><span>${esc(x[0])}</span><span>${esc(x[1])}</span></div>`).join('')}
    <div class="q">${esc(o.q)}</div>
    <span class="tagline ${c.vip ? 'vipt' : ''}">${o.label}</span>`;
  if (c.hinted) { $('hintBox').innerHTML = '💡 ' + esc(o.hint) + ' <small>(pendapatan −30%)</small>'; $('hintBox').classList.remove('hidden'); }
  else $('hintBox').classList.add('hidden');
}
function updateDisplay() {
  const c = selected(), v = $('dispVal');
  if (!c) { v.textContent = '0'; $('dispUnit').textContent = 'JAWABAN'; return; }
  const unit = c.order.unit;
  $('dispUnit').textContent = unit === '%' ? 'JAWABAN (%)' : 'JAWABAN (Rp)';
  const t = c.typed === '' ? '0' : fmt(parseInt(c.typed, 10));
  v.textContent = unit === '%' ? t + ' %' : 'Rp ' + t;
}
function updateHud(force) {
  if (!D) return;
  const sec = Math.max(0, Math.ceil(D.t));
  const te = $('hudTime');
  if (te.textContent !== String(sec)) te.textContent = sec;
  te.parentElement.classList.toggle('low', sec <= 10);
  const pct = clamp(D.earned / D.target * 100, 0, 100);
  $('goalBar').style.width = pct + '%';
  $('goalBar').parentElement.classList.toggle('done', D.earned >= D.target);
  if (force) {
    $('hudEarned').textContent = rp(D.earned);
    const n = Math.max(3, run.hearts);
    let h = ''; for (let i = 0; i < n; i++) h += `<i class="${i < run.hearts ? '' : 'off'}">❤️</i>`;
    $('hudHearts').innerHTML = `<div class="hearts" id="heartsRow">${h}</div><small>reputasi</small>`;
    $('hudCombo').innerHTML = D.combo >= 2 ? `<b>🔥×${D.combo}</b><small>combo</small>` : '<b style="opacity:.35">—</b><small>combo</small>';
    const hl = $('hintLeft'); hl.textContent = D.hints; $('btnHint').disabled = D.hints <= 0 && !(selected() && selected().hinted);
  }
}

/* ---------------------------------------------------------
   AKHIR HARI / RINGKASAN + TOKO UPGRADE
--------------------------------------------------------- */
function stopLoop() { cancelAnimationFrame(raf); }

function endDay() {
  if (!D || D.state !== 'play') return;
  D.state = 'done'; stopLoop();
  const ok = D.earned >= D.target;
  if (!ok) { endRun('target'); return; }

  const perfect = D.wrong === 0 && D.lost === 0 && D.served >= 5;
  let bonus = 0, healed = false;
  if (D.boss) {
    bonus = Math.round(D.target * 0.15 / 10000) * 10000;
    run.cash += bonus; run.total += bonus; S.career += bonus;
    if (run.hearts < 5) { run.hearts++; healed = true; }
  }
  run.cleared = run.day;
  S.bestDay = Math.max(S.bestDay, run.cleared);
  unlock('first');
  if (run.day >= 5) unlock('day5');
  if (run.day >= 10) unlock('day10');
  if (perfect) { S.perfect++; unlock('perfect'); }
  checkStats(); persist(); sfx.win();
  showShop({ perfect, bonus, healed });
}

function missHtml(list) {
  if (!list.length) return '';
  return list.slice(-4).map((m) => `<div class="miss"><b>${m.label}</b> — ${esc(m.rows.map((r) => r[0] + ' ' + r[1]).join(' · '))}<br>
    <b>${esc(m.q)}</b> Jawaban: <b>${m.unit === '%' ? m.answer + '%' : rp(m.answer)}</b><br><small>${m.steps.map(esc).join(' → ')}</small></div>`).join('');
}

function showShop(info) {
  const d = D;
  const over = d.earned - d.target;
  const upHtml = UPGRADES.map((u) => {
    const lvl = u.special ? 0 : run.upg[u.id];
    const cost = upgCost(u, lvl);
    const maxed = u.special ? run.hearts >= 5 : lvl >= u.max;
    const can = !maxed && run.cash >= cost;
    const pips = u.special ? '' : `<div class="pips">${Array.from({ length: u.max }, (_, i) => `<i class="${i < lvl ? 'on' : ''}"></i>`).join('')}</div>`;
    return `<div class="up"><span class="ico">${u.icon}</span><b>${u.name}</b><p>${u.desc}</p>${pips}
      <button data-up="${u.id}" ${can ? '' : 'disabled'}>${maxed ? (u.special ? 'Reputasi penuh' : 'MAKS') : rp(cost)}</button></div>`;
  }).join('');

  $('screen-shop').innerHTML = `
  <div class="center-wrap">
    <div class="card">
      <div class="result-head">
        <div class="big-ico">${d.boss ? '🧐' : '✅'}</div>
        <h2>${d.boss ? 'Lolos Inspeksi Bos!' : 'Hari ' + d.day + ' selesai!'}</h2>
        <p>Target ${rp(d.target)} tercapai ${over > 0 ? '(<span class="good">+' + rp(over) + '</span>)' : ''}${info.perfect ? ' • 💎 Hari Sempurna!' : ''}</p>
      </div>
      <div class="sum-grid">
        <div><b class="gold">${rp(d.earned)}</b><small>Omzet hari ini</small></div>
        <div><b>${d.served}</b><small>Pelanggan dilayani</small></div>
        <div><b class="${d.lost ? 'bad' : 'good'}">${d.lost}</b><small>Pelanggan kabur</small></div>
        <div><b>🔥 ${d.maxCombo}</b><small>Combo terbaik</small></div>
      </div>
      ${info.bonus ? `<p class="gold" style="text-align:center;font-weight:800">🎁 Bonus Bos ${rp(info.bonus)}${info.healed ? ' + 1 reputasi ❤️' : ''}</p>` : ''}
      ${d.missed.length ? `<div class="section-t">Pembahasan <small>soal yang terlewat hari ini</small></div>${missHtml(d.missed)}` : ''}
      <div class="section-t">Toko Upgrade <small>Kas: <span class="cash" id="cashNow">${rp(run.cash)}</span></small></div>
      <div class="shop-grid">${upHtml}</div>
      <div class="row-btns"><button class="btn primary big" id="btnNextDay">Lanjut ke Hari ${d.day + 1} →</button></div>
    </div>
  </div>`;
  show('shop');
  document.querySelectorAll('[data-up]').forEach((b) => { b.onclick = () => buy(b.dataset.up, info); });
  $('btnNextDay').onclick = () => { run.day++; showIntro(); };
}

function buy(id, info) {
  const u = UPGRADES.find((x) => x.id === id);
  const lvl = u.special ? 0 : run.upg[id], cost = upgCost(u, lvl);
  if (run.cash < cost) return;
  if (u.special) { if (run.hearts >= 5) return; run.hearts++; run.heartsBought++; }
  else { if (lvl >= u.max) return; run.upg[id]++; }
  run.cash -= cost; sfx.ok();
  const y = window.scrollY; showShop(info); window.scrollTo(0, y);
}

/* ---------------------------------------------------------
   GAME OVER
--------------------------------------------------------- */
function endRun(reason) {
  if (D) { D.state = 'over'; }
  stopLoop();
  const prevBest = S.bestScore;
  S.runs++;
  const record = run.total > prevBest;
  S.bestScore = Math.max(S.bestScore, run.total);
  S.bestDay = Math.max(S.bestDay, run.cleared);
  if (run.total > 0) addLB({ name: NAME, score: run.total, day: run.cleared, ts: Date.now() });
  checkStats(); persist();

  const ri = rankOf(S.career), rankUp = ri > run.rankBefore, r = RANKS[ri];
  const title = reason === 'hearts' ? 'Reputasi habis — toko ditutup!' : 'Target tidak tercapai';
  const sub = reason === 'hearts' ? 'Terlalu banyak pelanggan yang kecewa.' : `Omzet hari ke-${run.day}: ${rp(D ? D.earned : 0)} dari target ${rp(D ? D.target : 0)}.`;
  const lb = getLB(), place = lb.findIndex((e) => e.name === NAME && e.score === run.total) + 1;

  $('screen-over').innerHTML = `
  <div class="center-wrap">
    <div class="card">
      <div class="result-head">
        <div class="big-ico">${reason === 'hearts' ? '🔒' : '📉'}</div>
        <h2>${title}</h2>
        <p>${sub}</p>
      </div>
      <div class="sum-grid">
        <div><b class="gold">${rp(run.total)}</b><small>Total omzet</small></div>
        <div><b>${run.cleared}</b><small>Hari diselesaikan</small></div>
        <div><b>${place ? '#' + place : '—'}</b><small>Peringkat leaderboard</small></div>
        <div><b>${r.icon}</b><small>${r.name}</small></div>
      </div>
      <div style="text-align:center">
        ${record ? '<span class="tag gold">🎉 Rekor omzet baru!</span> ' : ''}
        ${rankUp ? `<span class="tag">⬆️ Naik pangkat: ${r.icon} ${r.name}</span>` : ''}
      </div>
      ${run.missed.length ? `<div class="section-t">Pembahasan <small>soal yang terlewat</small></div>${missHtml(run.missed)}` : ''}
      <div class="row-btns">
        <button class="btn primary big" id="btnAgain">🔁 Main Lagi</button>
        <button class="btn" id="btnOverLB">👑 Leaderboard</button>
        <button class="btn ghost" id="btnOverMenu">Menu</button>
      </div>
    </div>
  </div>`;
  show('over');
  $('btnAgain').onclick = newRun;
  $('btnOverLB').onclick = openLB;
  $('btnOverMenu').onclick = () => { refreshMenu(); show('menu'); };
}

/* ---------------------------------------------------------
   JEDA
--------------------------------------------------------- */
function pause(on) {
  if (!D || D.state !== 'play') return;
  D.paused = on;
  if (on) {
    openModal(`<h3>⏸ Dijeda</h3><p class="note">Waktu berhenti. Siap lanjut?</p>
      <div class="modal-actions"><button class="btn ghost" id="pQuit">Keluar ke menu</button><button class="btn primary" id="pGo">▶ Lanjut</button></div>`);
    $('pGo').onclick = () => pause(false);
    $('pQuit').onclick = () => { closeModal(); D.state = 'over'; stopLoop(); persist(); refreshMenu(); show('menu'); };
  } else { closeModal(); lastTs = performance.now(); }
}

/* ---------------------------------------------------------
   EVENT
--------------------------------------------------------- */
$('btnStart').onclick = () => { newRun(); if (!S.seenHow) { S.seenHow = true; persist(); } };
$('btnAch').onclick = openAch;
$('btnLB').onclick = openLB;
$('btnHow').onclick = openHow;
$('btnPause').onclick = () => pause(true);
$('btnHint').onclick = useHint;
$('btnMute').onclick = () => { S.muted = !S.muted; $('btnMute').textContent = S.muted ? '🔇' : '🔊'; persist(); };
$('modal').onclick = (e) => { if (e.target.id === 'modal' && !(D && D.paused)) closeModal(); };
$('numpad').addEventListener('click', (e) => {
  const b = e.target.closest('button'); if (!b) return;
  typeKey(b.dataset.k); b.blur();
});

document.addEventListener('keydown', (e) => {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  if (!$('modal').classList.contains('hidden')) { if (e.key === 'Escape' && !(D && D.paused)) closeModal(); return; }
  if (!D || D.state !== 'play' || !$('screen-play').classList.contains('active')) return;
  const k = e.key;
  if (/^[0-9]$/.test(k)) { typeKey(k); e.preventDefault(); }
  else if (k === 'Backspace') { typeKey('back'); e.preventDefault(); }
  else if (k === 'Enter') { submit(); e.preventDefault(); }
  else if (k === 'Escape') { typeKey('clear'); }
  else if (k === 'ArrowRight' || k === 'ArrowDown' || k === 'Tab') { cycle(e.shiftKey ? -1 : 1); e.preventDefault(); }
  else if (k === 'ArrowLeft' || k === 'ArrowUp') { cycle(-1); e.preventDefault(); }
  else if (k === 'h' || k === 'H') { useHint(); }
  else if (k === 'p' || k === 'P') { pause(!D.paused); }
});
document.addEventListener('visibilitychange', () => { if (document.hidden && D && D.state === 'play' && !D.paused) pause(true); });
window.addEventListener('pagehide', persist);

/* ---------------------------------------------------------
   MULAI
--------------------------------------------------------- */
refreshMenu();
if (!S.seen) setTimeout(openHow, 350);

/* Hook khusus pengujian (tidak aktif di penggunaan normal) */
if (window.__KASIR_TEST__) {
  window.__kasir = {
    get D() { return D; }, get run() { return run; }, get S() { return S; },
    newRun, beginDay, step, submit, typeKey, select, endDay, genOrder, KINDS, RANKS, targetOf, ACH, MODS, buy, showIntro, pickUrgent
  };
}
})();