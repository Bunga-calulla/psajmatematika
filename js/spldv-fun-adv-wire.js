/*
  PETUALANGAN SPLDV bersama Nera, bagian 2: interaksi, animasi, dan pemasangan ke aplikasi.
*/
(function () {
  const MOD = 'persamaan';
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const neg = n => String(n).replace('-', '−');
  const reduce = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  const confetti = () => { try { window.SXLAB && window.SXLAB.confetti(); } catch (e) { /* abaikan */ } };
  const restart = (el, cls) => { if (!el) return; el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); };

  /* ---------------- maskot melayang ---------------- */
  let mascot = null, bubble = null, bubbleTimer = 0;
  const FACTS = [
    'Kata “aljabar” berasal dari bahasa Arab: al-jabr, artinya menyatukan bagian yang terpisah ⚖️',
    'Orang Tiongkok kuno sudah menyelesaikan sistem persamaan 2000 tahun lalu, pakai batang bambu! 🎋',
    'Kalau dua garis sejajar, mereka tidak pernah bertemu. Mirip rel kereta 🚆',
    'Satu persamaan dua variabel punya tak hingga jawaban. Dua persamaan menyempitkannya jadi satu! 🎯',
    'Eliminasi itu seperti sulap: satu variabel menghilang, yang lain muncul ✨',
    'Aplikasi navigasi memakai sistem persamaan untuk menentukan posisimu 🛰️',
    'Selalu cek jawaban ke KEDUA persamaan ya. Satu saja tidak cukup! ✅'
  ];
  function ensureMascot() {
    if (mascot && mascot.isConnected) return;
    mascot = document.createElement('div');
    mascot.className = 'nr-mascot';
    mascot.innerHTML = '<div class="nr-bubble" role="status" aria-live="polite"></div>' +
      '<button type="button" class="nr-mascot-btn" aria-label="Nera, teman belajarmu. Klik untuk fakta seru">' + window.NRADV.neraSvg() + '</button>';
    document.body.appendChild(mascot);
    bubble = $('.nr-bubble', mascot);
    $('.nr-mascot-btn', mascot).addEventListener('click', () => say(pick(FACTS), 5600));
  }
  function say(text, ms) {
    if (!bubble || !document.body.classList.contains('nr-mode')) return;
    bubble.textContent = text;
    restart(bubble, 'show');
    restart(mascot, 'talk');
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(() => { bubble.classList.remove('show'); mascot.classList.remove('talk'); }, ms || 3600);
  }
  const lastSay = {};
  function sayCool(k, t, cool, ms) { const n = Date.now(); if (lastSay[k] && n - lastSay[k] < (cool || 3500)) return; lastSay[k] = n; say(t, ms); }

  /* ---------------- hero: mengetik, lompat, muncul ---------------- */
  function wireHero(root) {
    const el = $('#nrTyped', root);
    if (el) {
      const ph = ['SPLDV itu bukan hafalan, tapi permainan keseimbangan! ⚖️', 'Dua petunjuk cukup untuk menemukan dua bilangan rahasia 🕵️', 'Klik, tekan tombol, dan saksikan sulapnya. Aku temani ya! 🧙'];
      if (reduce) el.textContent = ph[0];
      else {
        let pi = 0, ci = 0, del = false;
        (function tick() {
          if (!el.isConnected) return;
          const ch = Array.from(ph[pi]);
          if (!del) { ci++; el.textContent = ch.slice(0, ci).join(''); if (ci >= ch.length) { del = true; setTimeout(tick, 2400); return; } setTimeout(tick, 36); }
          else { ci = Math.max(0, ci - 2); el.textContent = ch.slice(0, ci).join(''); if (!ci) { del = false; pi = (pi + 1) % ph.length; setTimeout(tick, 350); return; } setTimeout(tick, 16); }
        })();
      }
    }
    $$('[data-jump]', root).forEach(b => b.addEventListener('click', () => {
      const t = document.getElementById(b.dataset.jump);
      if (t) { t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); restart(t, 'nr-flash'); }
    }));
    const art = $('.nr-hero-art', root);
    if (art) art.addEventListener('click', () => { restart(art, 'nr-hop'); say(pick(FACTS), 5200); });
  }
  function wireReveal(root) {
    const els = $$('.nr-reveal', root);
    if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); return; }
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: .1 });
    els.forEach(e => io.observe(e));
    setTimeout(() => els.forEach(e => e.classList.add('in')), 4000);
  }

  /* ---------------- 1. timbangan ---------------- */
  function wireBalance(root) {
    const st = { L: 2, R: 5, x: false };
    const beam = $('#nrBeam', root), pL = $('#nrPanL', root), pR = $('#nrPanR', root);
    const eq = $('#nrBalEq', root), status = $('#nrBalStatus', root), note = $('#nrBalNote', root), xt = $('#nrXTxt', root);
    const take = $('#nrBalTake', root), cheat = $('#nrBalCheat', root);
    function render(msg) {
      const a = Math.max(-15, Math.min(15, (st.R - (3 + st.L)) * 5));
      beam.style.transform = 'rotate(' + a + 'deg)';
      pL.style.transform = 'rotate(' + (-a) + 'deg)';
      pR.style.transform = 'rotate(' + (-a) + 'deg)';
      ['nrL1', 'nrL2'].forEach((id, i) => $('#' + id, root).classList.toggle('gone', i >= st.L));
      for (let i = 1; i <= 5; i++) $('#nrR' + i, root).classList.toggle('gone', i > st.R);
      xt.textContent = st.x ? '3' : 'x';
      $('#nrXBox rect', root).setAttribute('fill', st.x ? '#17C3B2' : '#3B82F6');
      const bal = a === 0;
      status.className = 'nr-status ' + (bal ? 'ok' : 'bad');
      status.textContent = bal ? '⚖️ Seimbang' : '❌ Miring! Tidak seimbang';
      if (msg) { eq.textContent = msg.eq; note.innerHTML = msg.note; restart(eq, 'nr-pop'); }
      take.disabled = cheat.disabled = st.L !== 2;
    }
    take.onclick = () => {
      st.L = 0; st.R = 3; render({ eq: 'x = 3', note: 'Kita mengambil <b>2 balok dari kiri dan 2 dari kanan</b>. Karena sama-sama dikurangi, timbangan tetap seimbang dan kotak x terbukti seberat <b>3</b> 🎉' });
      setTimeout(() => { st.x = true; render(); }, 650);
      confetti(); say('Itu dia prinsip eliminasi: lakukan hal yang sama di kedua sisi! ⚖️', 4600);
    };
    cheat.onclick = () => {
      st.L = 0; st.R = 5; render({ eq: 'x = 5 ???', note: 'Oops! Kita hanya mengambil dari <b>satu sisi</b>, jadi timbangannya miring. Hasil “x = 5” itu <b>salah</b>. Aturannya: kedua sisi harus diperlakukan sama.' });
      say('Awas! Kalau cuma satu sisi yang diubah, persamaannya rusak 😱', 4200);
    };
    $('#nrBalReset', root).onclick = () => {
      st.L = 2; st.R = 5; st.x = false;
      render({ eq: 'x + 2 = 5', note: 'Sisi kiri: kotak <b>x</b> + 2 balok. Sisi kanan: 5 balok. Berapa berat kotak x?' });
    };
    render();
  }

  /* ---------------- 2. detektif pasangan ---------------- */
  function wireDetective(root) {
    const v = $('#nrVerdict', root);
    $$('.nr-cand', root).forEach(b => b.addEventListener('click', () => {
      const x = +b.dataset.x, y = +b.dataset.y, o1 = x + y === 5, o2 = x - y === 1;
      b.classList.remove('ok', 'bad'); b.classList.add(o1 && o2 ? 'ok' : 'bad'); restart(b, 'nr-pop');
      v.className = 'nr-verdict ' + (o1 && o2 ? 'good' : 'wrong');
      v.innerHTML = '① ' + x + ' + ' + y + ' = ' + (x + y) + ' ' + (o1 ? '✓' : '✗') + '<br>② ' + x + ' − ' + y + ' = ' + neg(x - y) + ' ' + (o2 ? '✓' : '✗ (harus 1)') +
        '<br><b>' + (o1 && o2 ? '🎉 Pasangan rahasia ketemu: x = ' + x + ', y = ' + y + '!' : 'Belum cocok di kedua petunjuk. Coba pasangan lain!') + '</b>';
      if (o1 && o2) { confetti(); say('Detektif hebat! Hanya (3, 2) yang lolos kedua petunjuk 🕵️', 4800); }
      else sayCool('det', pick(['Lolos ①, tapi gagal di ② 🤔', 'Hampir! Periksa petunjuk kedua 🔎', 'Bukan yang ini. Terus cari! 🕵️']), 2500, 2800);
    }));
  }

  /* ---------------- 3 & 4. stepper sulap ---------------- */
  const MAGIC = [
    { btn: 'Jumlahkan ① + ② ✨', fx: 'poof', lines: ['(x + y) + (x − y) = 5 + 1', '2x = 6'], say: 'Lihat! +y dan −y saling meniadakan. Puff, y menghilang 💨', talk: 'Puff! Variabel y lenyap 💨' },
    { btn: 'Bagi kedua sisi dengan 2 ➗', lines: ['x = 6 ÷ 2 = 3'], say: 'Kedua sisi dibagi 2, jadi x = 3. Timbangan tetap seimbang ⚖️' },
    { btn: 'Masukkan x = 3 ke ① 🔁', lines: ['3 + y = 5', 'y = 5 − 3 = 2'], say: 'Setelah x ketemu, masukkan ke persamaan mana pun untuk mendapat y.' },
    { btn: 'Cek ke ② ✅', lines: ['3 − 2 = 1 ✓', 'Penyelesaian: (x, y) = (3, 2) 🎉'], say: 'Selalu cek. Kalau kedua persamaan benar, jawabanmu aman.', win: true }
  ];
  const SWAP = [
    { btn: 'Tukar y dengan 2x − 1 🔁', fx: 'swap', lines: ['x + (2x − 1) = 8'], say: 'y di ② diganti dengan isi dari ①. Sekarang tinggal satu variabel!', talk: 'Tuker-tuker! y berganti baju 🔁' },
    { btn: 'Rapikan ✨', lines: ['3x − 1 = 8', '3x = 9', 'x = 3'], say: 'Gabungkan suku sejenis, pindahkan −1 ke kanan, lalu bagi 3.' },
    { btn: 'Cari y 🔎', lines: ['y = 2x − 1', 'y = 2(3) − 1 = 5'], say: 'Masukkan x = 3 ke bentuk y = 2x − 1.' },
    { btn: 'Cek ke ② ✅', lines: ['3 + 5 = 8 ✓', 'Penyelesaian: (x, y) = (3, 5) 🎉'], say: 'Kedua persamaan benar, selesai!', win: true }
  ];
  function wireStepper(root, id, steps) {
    const box = $('#' + id, root); if (!box) return;
    const given = $('.nr-given', box), out = $('.nr-out', box), ex = $('.nr-explain', box), nx = $('[data-act=next]', box);
    const orig = given.innerHTML; let i = 0;
    function applyFx(kind) {
      if (kind === 'poof') $$('.nr-y', given).forEach(e => { e.classList.add('poof'); e.insertAdjacentHTML('afterend', '<span class="nr-puff" aria-hidden="true">💨</span>'); });
      if (kind === 'swap') $$('.nr-swap', given).forEach(e => { e.textContent = e.dataset.to; restart(e, 'swapped'); });
    }
    function reset() {
      i = 0; given.innerHTML = orig; out.innerHTML = '';
      ex.textContent = 'Perhatikan persamaannya dulu, lalu tekan tombol untuk lanjut 👇';
      nx.disabled = false; nx.textContent = box.dataset.first;
    }
    nx.onclick = () => {
      const s = steps[i]; if (!s) return;
      if (s.fx) applyFx(s.fx);
      out.insertAdjacentHTML('beforeend', s.lines.map((l, k) => '<div class="nr-eqline nr-in" style="animation-delay:' + (k * 0.18) + 's">' + l + '</div>').join(''));
      ex.innerHTML = '💬 ' + s.say; restart(ex, 'nr-pop');
      if (s.talk) say(s.talk, 3000);
      i++;
      if (s.win) { confetti(); say('Yeay! Selesai tanpa ribet 🎉', 3600); }
      if (i >= steps.length) { nx.disabled = true; nx.textContent = 'Selesai 🎉'; } else nx.textContent = steps[i].btn;
    };
    $('[data-act=reset]', box).onclick = reset;
    reset();
  }

  window.NRWIRE = { $, $$, say, sayCool, pick, neg, reduce, confetti, restart, ensureMascot, wireHero, wireReveal, wireBalance, wireDetective, wireStepper, MAGIC, SWAP };
})();
