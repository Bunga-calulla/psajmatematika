/*
  PETUALANGAN SPLDV bersama Nera, bagian 3: grafik pelari, kartu balik, reaksi Nera, dan pemasangan.
*/
(function () {
  const W = window.NRWIRE;
  const { $, $$, say, sayCool, pick, reduce, confetti, restart } = W;
  const MOD = 'persamaan';

  /* ---------------- 5. grafik dengan pelari ---------------- */
  const X = x => 36 + 44 * x, Y = y => 244 - 40 * y;
  const MODES = {
    one: {
      lines: [[0, 5, 5, 0, '#3B82F6'], [1, 0, 6, 5, '#FF4D8D']],
      runs: [['🏃', 0, 5, 3, 2], ['🚴', 1, 0, 3, 2]],
      cap: '<b style="color:#3B82F6">① x + y = 5</b> dan <b style="color:#E0306F">② x − y = 1</b>. Kemiringan kedua garis berbeda.',
      res: '🎉 Bertemu di <b>(3, 2)</b>!<br>Cek ①: 3 + 2 = 5 ✓<br>Cek ②: 3 − 2 = 1 ✓<br><b>Tepat satu solusi.</b>',
      end: 'meet', talk: 'Mereka bertemu di (3, 2)! Itu penyelesaiannya 🎯'
    },
    inf: {
      lines: [[0, 5, 5, 0, '#3B82F6'], [0, 5, 5, 0, '#FF4D8D', true]],
      runs: [['🏃', 0, 5, 5, 0], ['🚴', 5, 0, 0, 5]],
      cap: '<b style="color:#3B82F6">① x + y = 5</b> dan <b style="color:#E0306F">② 2x + 2y = 10</b>. Persamaan ② hanya ① × 2.',
      res: '♾️ Dua garis <b>berimpit</b>: setiap titik pada garis adalah titik temu.<br><b>Tak hingga solusi.</b>',
      end: 'glow', talk: 'Garisnya menempel, jadi mereka bertemu di mana-mana! ♾️'
    },
    none: {
      lines: [[0, 5, 5, 0, '#3B82F6'], [0, 3, 3, 0, '#FF4D8D']],
      runs: [['🏃', 0, 5, 5, 0], ['🚴', 0, 3, 3, 0]],
      cap: '<b style="color:#3B82F6">① x + y = 5</b> dan <b style="color:#E0306F">② x + y = 3</b>. Sisi kiri sama, hasil berbeda: mustahil!',
      res: '🚫 Dua garis <b>sejajar</b> dan tak pernah bertemu.<br><b>Tidak ada solusi.</b>',
      end: 'sad', talk: 'Sejajar seperti rel kereta, tidak pernah bertemu 😢'
    }
  };
  function wireGraph(root) {
    const svg = $('#nrGraph', root); if (!svg) return;
    let mode = 'one', tok = 0;
    const grid = (() => {
      let g = '';
      for (let x = 0; x <= 6; x++) g += '<line class="nr-g" x1="' + X(x) + '" y1="' + Y(0) + '" x2="' + X(x) + '" y2="' + Y(5.5) + '"/><text class="nr-tk" x="' + X(x) + '" y="262" text-anchor="middle">' + x + '</text>';
      for (let y = 0; y <= 5; y++) g += '<line class="nr-g" x1="' + X(0) + '" y1="' + Y(y) + '" x2="' + X(6.5) + '" y2="' + Y(y) + '"/>' + (y ? '<text class="nr-tk" x="26" y="' + (Y(y) + 4) + '" text-anchor="end">' + y + '</text>' : '');
      return g + '<line class="nr-ax" x1="' + X(0) + '" y1="' + Y(0) + '" x2="' + X(6.6) + '" y2="' + Y(0) + '"/><line class="nr-ax" x1="' + X(0) + '" y1="' + Y(0) + '" x2="' + X(0) + '" y2="' + Y(5.7) + '"/>';
    })();
    function play() {
      const my = ++tok, m = MODES[mode];
      svg.innerHTML = grid + m.lines.map((l, i) => '<path class="nr-line' + (l[5] ? ' dash' : '') + '" id="nrLn' + i + '" d="M' + X(l[0]) + ' ' + Y(l[1]) + ' L' + X(l[2]) + ' ' + Y(l[3]) + '" stroke="' + l[4] + '"/>').join('') + '<g id="nrRunners"></g><g id="nrEnd"></g>';
      $('#nrGCap', root).innerHTML = m.cap; $('#nrGRes', root).innerHTML = ''; $('#nrGRes', root).className = 'nr-gres';
      $$('.nr-line', svg).forEach(p => { const L = p.getTotalLength ? p.getTotalLength() : 400; p.style.strokeDasharray = p.classList.contains('dash') ? '8 7' : L; p.style.strokeDashoffset = p.classList.contains('dash') ? 0 : L; p.style.opacity = p.classList.contains('dash') ? 0 : 1; });
      requestAnimationFrame(() => requestAnimationFrame(() => $$('.nr-line', svg).forEach(p => { p.style.transition = 'stroke-dashoffset 1.1s ease, opacity .6s ease'; p.style.strokeDashoffset = 0; p.style.opacity = 1; })));
      const dur = reduce ? 1 : 2200, delay = reduce ? 0 : 1200;
      const run = $('#nrRunners', svg);
      run.innerHTML = m.runs.map(r => '<text class="nr-run" font-size="24" text-anchor="middle" x="' + X(r[1]) + '" y="' + Y(r[2]) + '">' + r[0] + '</text>').join('');
      const els = $$('.nr-run', svg); let t0 = 0;
      function step(now) {
        if (my !== tok || !svg.isConnected) return;
        if (!t0) t0 = now;
        const k = Math.min(1, (now - t0) / dur), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        m.runs.forEach((r, i) => { els[i].setAttribute('x', X(r[1] + (r[3] - r[1]) * e)); els[i].setAttribute('y', Y(r[2] + (r[4] - r[2]) * e) - 6); });
        if (k < 1) requestAnimationFrame(step); else finish();
      }
      function finish() {
        const end = $('#nrEnd', svg), res = $('#nrGRes', root);
        if (m.end === 'meet') end.innerHTML = '<circle class="nr-burst" cx="' + X(3) + '" cy="' + Y(2) + '" r="8"/><circle class="nr-dot" cx="' + X(3) + '" cy="' + Y(2) + '" r="7"/><text x="' + X(3) + '" y="' + (Y(2) - 18) + '" text-anchor="middle" font-size="20" class="nr-pop2">🎉</text><text class="nr-pt" x="' + (X(3) + 12) + '" y="' + (Y(2) + 20) + '">(3, 2)</text>';
        if (m.end === 'glow') $$('.nr-line', svg).forEach(p => p.classList.add('glow'));
        if (m.end === 'sad') end.innerHTML = '<text x="' + X(3.4) + '" y="' + Y(3.6) + '" font-size="26" class="nr-pop2" text-anchor="middle">😢</text>';
        res.innerHTML = m.res; res.className = 'nr-gres show'; if (m.end === 'meet') confetti(); say(m.talk, 4200);
      }
      setTimeout(() => { if (my === tok) requestAnimationFrame(step); }, delay);
    }
    $$('#nrGMode [data-m]', root).forEach(b => b.addEventListener('click', () => {
      mode = b.dataset.m; $$('#nrGMode [data-m]', root).forEach(x => x.classList.toggle('active', x === b)); play();
    }));
    $('#nrGReplay', root).addEventListener('click', play);
    let started = false;
    const go = () => { if (!started) { started = true; play(); } };
    if ('IntersectionObserver' in window) { const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { go(); io.disconnect(); } }), { threshold: .3 }); io.observe(svg); setTimeout(go, 6000); }
    else go();
  }

  /* ---------------- 6 & 7. kartu balik & kartu fakta ---------------- */
  function wireCards(root) {
    $$('.nr-flip', root).forEach(c => {
      const flip = () => { c.classList.toggle('flipped'); if (c.classList.contains('flipped')) say(pick(['Langkah ini sering terlupa, hati-hati ya 📌', 'Catat baik-baik 📝', 'Nah, begitu caranya ✨']), 2600); };
      c.addEventListener('click', flip);
      c.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); } });
    });
    const all = $('#nrFlipAll', root);
    if (all) all.addEventListener('click', () => { const cs = $$('.nr-flip', root), on = cs.some(c => !c.classList.contains('flipped')); cs.forEach((c, i) => setTimeout(() => c.classList.toggle('flipped', on), reduce ? 0 : i * 120)); });
    $$('.nr-fun', root).forEach(b => b.addEventListener('click', () => { restart(b, 'nr-pop'); say(b.dataset.fact, 5200); }));
  }

  /* ---------------- reaksi Nera di tab lain ---------------- */
  function bindOthers() {
    if (window.__nrBound) return; window.__nrBound = true;
    const tabs = $('.tabs');
    if (tabs) tabs.addEventListener('click', e => {
      const b = e.target.closest && e.target.closest('.tab');
      if (!b || !document.body.classList.contains('nr-mode')) return;
      const m = { materi: 'Baca pelan-pelan, lalu mainkan bagian-bagiannya 📖', coba: 'Waktunya bereksperimen! Ubah angkanya dan lihat apa yang terjadi 🧪', latihan: 'Semangat! Ingat selalu cek ke kedua persamaan 💪' }[b.dataset.tab];
      if (m) say(m, 3400);
    });
    document.addEventListener('click', e => {
      if (!document.body.classList.contains('nr-mode')) return;
      const t = e.target; if (!t.closest) return;
      if (t.closest('#sxMCheck2')) { const f = $('#sxMFb2'); say(f && f.textContent.indexOf('Benar') > -1 ? pick(['Harga ketemu! Keren 🎉', 'Tepat sekali! ⭐']) : 'Belum pas. Samakan koefisien dulu, lalu jumlahkan atau kurangkan 💡', 3600); }
      else if (t.closest('#sxMCheck1')) { const f = $('#sxMFb1'); if (f && f.textContent.indexOf('tepat') > -1) say('Modelnya benar! Sekarang selesaikan ya 🧮', 3400); }
      else if (t.closest('#sxCBtns button')) { const f = $('#sxCFb'); say(f && f.textContent.indexOf('Tepat') > -1 ? 'Tepat! Rasio koefisien memang kuncinya 🔑' : 'Bandingkan rasio a₁/a₂, b₁/b₂, dan c₁/c₂ 🔍', 3600); }
      else if (t.closest('#sxPresets [data-p]')) say(({ p1: 'Dua garis berpotongan: satu solusi 🎯', p2: 'Berpotongan lagi, titiknya berbeda 📍', inf: 'Berimpit: tak hingga solusi ♾️', par: 'Sejajar: tidak ada solusi 🚫' })[t.closest('[data-p]').dataset.p], 3400);
      else { const o = t.closest('#tab-latihan .option'); if (o) setTimeout(() => { if (o.classList.contains('correct')) { say(pick(['Benar! 🎉', 'Mantap! ⭐', 'Keren banget! 🌟']), 2600); } else if (o.classList.contains('wrong')) say(pick(['Tidak apa-apa, baca pembahasannya ya 📖', 'Hampir! Coba cek lagi 💡']), 3400); }, 0); }
    });
    document.addEventListener('input', e => {
      if (!document.body.classList.contains('nr-mode')) return;
      if (e.target.closest && e.target.closest('#sxA1, #sxB1, #sxC1, #sxA2, #sxB2, #sxC2')) sayCool('g', 'Perhatikan titik temu garisnya bergerak! 👀', 5000, 3000);
    });
  }

  /* ---------------- 6. tab latihan: bar progres bermaskot, konfeti, piala ---------------- */
  function bindQuiz() {
    const el = $('#tab-latihan');
    if (!el || el.dataset.nrQuiz) return;
    el.dataset.nrQuiz = '1';
    const on = () => document.body.classList.contains('nr-mode');
    const apply = () => {
      if (!on()) return;
      const sc = $('.quiz-score', el);
      if (sc && !$('.nr-qbar', el)) {
        const m = sc.textContent.match(/Soal\s+(\d+)\s*\/\s*(\d+)/);
        if (m) sc.insertAdjacentHTML('afterend', '<div class="nr-qbar" data-i="' + m[1] + '" data-n="' + m[2] + '" style="--p:' + ((m[1] - 1) / m[2] * 100).toFixed(1) + '"><span></span><i aria-hidden="true">⚖️</i></div>');
      }
      const done = $('#spRetry', el);
      if (done && !done.dataset.nrDone) {
        done.dataset.nrDone = '1';
        const card = done.closest('.content-card'), b = card && $('b', card);
        const m = b && b.textContent.match(/(\d+)\s*dari\s*(\d+)/);
        const r = m ? +m[1] / +m[2] : 0;
        const ic = card && card.firstElementChild;
        if (ic) { ic.textContent = r >= 0.8 ? '🏆' : r >= 0.5 ? '🌟' : '💪'; ic.classList.add('nr-trophy'); }
        if (r >= 0.8) { setTimeout(confetti, 250); say('Luar biasa! Kamu jagoan SPLDV 🏆', 5000); }
        else if (r >= 0.5) say('Bagus! Sedikit lagi sempurna 🌟', 4200);
        else say('Tidak apa-apa, baca materinya lalu coba lagi ya. Aku temani! 💪', 4800);
      }
    };
    new MutationObserver(apply).observe(el, { childList: true, subtree: true });
    el.addEventListener('click', e => {
      if (!on()) return;
      const o = e.target.closest && e.target.closest('.option');
      if (!o) return;
      const bar = $('.nr-qbar', el);
      if (bar) bar.style.setProperty('--p', (+bar.dataset.i / +bar.dataset.n * 100).toFixed(1));
    });
    apply();
  }

  /* ---------------- pemasangan ---------------- */
  function enhance() {
    document.body.classList.toggle('nr-reduce', reduce);
    W.ensureMascot();
    const root = $('#tab-materi .nr-adv');
    if (root && !root.dataset.nrWired) {
      root.dataset.nrWired = '1';
      const wrap = $('#tab-materi');
      W.wireHero(wrap); W.wireReveal(wrap); W.wireBalance(wrap); W.wireDetective(wrap);
      W.wireStepper(wrap, 'nrMagic', W.MAGIC); W.wireStepper(wrap, 'nrSwap', W.SWAP);
      wireGraph(wrap); wireCards(wrap);
    }
    bindQuiz();
    bindOthers();
    setTimeout(() => say('Halo! Aku Nera ⚖️ Yuk seimbangkan persamaan bersama!', 4200), 900);
  }
  function install() {
    const prevOpen = window.openModule;
    if (typeof prevOpen === 'function') window.openModule = function (id) {
      const r = prevOpen.apply(this, arguments);
      const view = document.getElementById('moduleView');
      const active = id === MOD && view && view.classList.contains('active');
      document.body.classList.toggle('nr-mode', !!active);
      if (active) { try { enhance(); } catch (err) { console.error('[spldv-adv]', err); } }
      return r;
    };
    const prevShow = window.showPanel;
    if (typeof prevShow === 'function') window.showPanel = function (id) {
      const r = prevShow.apply(this, arguments);
      if (id !== 'moduleView') document.body.classList.remove('nr-mode');
      return r;
    };
  }
    /* pita "SERU!" di kartu modul SPLDV pada beranda */
  const mark = () => {
    const btn = $('#moduleCards [data-open="' + MOD + '"]');
    const card = btn && btn.closest('.module-card');
    if (card && !card.classList.contains('nr-card-fun')) {
      card.classList.add('nr-card-fun');
      card.insertAdjacentHTML('afterbegin', '<span class="nr-ribbon">✨ SERU!</span>');
    }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(mark, 0));
  else mark();
  window.NRADV_RUN = { enhance };
  install();
})();