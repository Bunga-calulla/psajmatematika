/*
  FUN CORE — kerangka animasi bersama untuk modul Statistik, Geometri, dan Peluang.
  Polanya sama dengan trig-fun.js: membungkus openModule() dan MENAMBAHKAN bagian visual
  di atas materi/simulasi lama (isi lama tetap ada di bawahnya).
  Untuk menonaktifkan: hapus <link>/<script> fun-core, stat-fun, geo-fun, prob-fun di index.html.
*/
(function () {
  'use strict';
  const MODES = ['statistik', 'geometri', 'peluang'];
  const reduce = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const fmt = (n, d) => String(+(+n).toFixed(d == null ? 2 : d)).replace('.', ',');
  let cur = null;

  /* ---------- reveal saat scroll ---------- */
  let io = null;
  function reveal(root) {
    const es = $$('.fx-reveal', root);
    if (reduce || !('IntersectionObserver' in window)) { es.forEach(e => e.classList.add('in')); return; }
    io = io || new IntersectionObserver((l, o) => l.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); o.unobserve(e.target); }
    }), { threshold: 0.08 });
    es.forEach(e => io.observe(e));
  }

  /* ---------- konfeti ---------- */
  let cv, cx, parts = [], raf = 0;
  const COL = ['#FF4D8D', '#7C3AED', '#F2C94C', '#17C3B2', '#FF9F1C', '#3B82F6'];
  function confetti(x, y, n) {
    if (reduce) return;
    if (!cv) { cv = document.createElement('canvas'); cv.className = 'fx-confetti'; document.body.appendChild(cv); cx = cv.getContext('2d'); }
    if (cv.width !== innerWidth || cv.height !== innerHeight) { cv.width = innerWidth; cv.height = innerHeight; }
    x = x == null ? innerWidth / 2 : x; y = y == null ? innerHeight / 3 : y; n = n || 46;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * 6.28, s = 4 + Math.random() * 8;
      parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 6, r: Math.random() * 6, vr: (Math.random() - .5) * .4, z: 7 + Math.random() * 7, c: COL[i % 6], e: Math.random() < .18 ? pick(['⭐', '✨', '🎉']) : null, l: 0 });
    }
    if (!raf) raf = requestAnimationFrame(loop);
  }
  function loop() {
    cx.clearRect(0, 0, cv.width, cv.height);
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i]; p.l++; p.vy += .28; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.r += p.vr;
      if (p.y > innerHeight + 30 || p.l > 130) { parts.splice(i, 1); continue; }
      cx.save(); cx.translate(p.x, p.y); cx.rotate(p.r); cx.globalAlpha = Math.max(0, 1 - p.l / 130);
      if (p.e) { cx.font = (p.z * 2) + 'px serif'; cx.fillText(p.e, 0, 0); } else { cx.fillStyle = p.c; cx.fillRect(-p.z / 2, -p.z / 4, p.z, p.z / 2); }
      cx.restore();
    }
    raf = parts.length ? requestAnimationFrame(loop) : 0;
  }
  function confettiAt(el, n) {
    if (!el) return confetti(null, null, n);
    const r = el.getBoundingClientRect(); confetti(r.left + r.width / 2, r.top + r.height / 2, n);
  }

  /* ---------- maskot ---------- */
  const mSvg = c => `<svg class="fx-m" viewBox="0 0 200 200" aria-hidden="true" focusable="false"><ellipse class="fx-sh" cx="100" cy="188" rx="58" ry="8" fill="rgba(36,27,58,.14)"/><g class="fx-mb"><rect x="38" y="30" width="124" height="140" rx="46" fill="${c.color}" stroke="#241B3A" stroke-width="6"/><ellipse class="fx-eye" cx="78" cy="96" rx="7" ry="10" fill="#241B3A"/><ellipse class="fx-eye" cx="122" cy="96" rx="7" ry="10" fill="#241B3A"/><circle cx="60" cy="120" r="7" fill="#FF4D8D" opacity=".45"/><circle cx="140" cy="120" r="7" fill="#FF4D8D" opacity=".45"/><path d="M82 124 Q100 144 118 124" fill="none" stroke="#241B3A" stroke-width="6" stroke-linecap="round"/><text x="100" y="68" text-anchor="middle" font-size="26" font-weight="800" font-family="Space Grotesk,sans-serif" fill="#241B3A">${c.sym}</text><g class="fx-arm"><line x1="160" y1="110" x2="188" y2="78" stroke="#241B3A" stroke-width="6" stroke-linecap="round"/><circle cx="190" cy="75" r="9" fill="#FFE08A" stroke="#241B3A" stroke-width="5"/></g></g></svg>`;
  let mEl, bEl, bT;
  function ensureMascot() {
    if (!mEl || !mEl.isConnected) {
      mEl = document.createElement('div'); mEl.className = 'fx-mascot';
      mEl.innerHTML = '<div class="fx-bubble" role="status" aria-live="polite"></div><button type="button" class="fx-mascot-btn" aria-label="Teman belajarmu. Klik untuk fakta seru"></button>';
      document.body.appendChild(mEl); bEl = $('.fx-bubble', mEl);
      $('.fx-mascot-btn', mEl).addEventListener('click', () => cur && say(pick(cur.facts), 5600));
    }
    $('.fx-mascot-btn', mEl).innerHTML = mSvg(cur.mascot);
  }
  function say(t, ms) {
    if (!bEl || !document.body.classList.contains('fx-mode')) return;
    bEl.textContent = t; bEl.classList.remove('show'); void bEl.offsetWidth; bEl.classList.add('show');
    clearTimeout(bT); bT = setTimeout(() => bEl.classList.remove('show'), ms || 3400);
  }
  const lastSay = {};
  function sayCool(k, t, cool, ms) { const n = Date.now(); if (lastSay[k] && n - lastSay[k] < (cool || 3500)) return; lastSay[k] = n; say(t, ms); }
  let lastTouch = 0;
  function touch() {
    const n = Date.now(); if (n - lastTouch < 2000 || !cur) return; lastTouch = n;
    try { window.Progress && Progress.setCoba && Progress.setCoba(cur.id); } catch (e) { /* abaikan */ }
  }
  function bump(el, txt) {
    if (!el || el.textContent === txt) return;
    el.textContent = txt; el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump');
  }
  function shake(el) { if (!el) return; el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); }

  /* ---------- pembangun HTML ---------- */
  const hero = h => `<section class="fx-hero fx-reveal" style="--a:${h.color}"><div class="fx-float" aria-hidden="true">${h.floats.map((f, i) => `<span style="left:${[56, 80, 92, 64, 86, 52, 74, 94][i % 8]}%;top:${[8, 6, 26, 46, 54, 64, 76, 40][i % 8]}%;--d:${5 + i % 4}s;--dl:${-i}s">${f}</span>`).join('')}</div><div class="fx-hero-copy"><span class="fx-badge">${h.badge}</span><h2>${h.title}</h2><p class="fx-typed"></p><div class="fx-chips">${h.chips.map(c => `<button type="button" data-jump="${c[0]}">${c[1]}</button>`).join('')}</div></div><div class="fx-hero-art">${mSvg(h)}</div></section>`;
  const sec = (n, id, t, e, sub, body, c1, c2) => `<section class="fx-sec fx-reveal" id="${id}" style="--c1:${c1};--c2:${c2}"><h3><span class="fx-step">${n}</span>${t} <em>${e}</em></h3><p class="fx-sub">${sub}</p>${body}</section>`;

  function wireHero(root, cfg) {
    const el = $('.fx-typed', root);
    if (el) {
      const ph = cfg.phrases;
      if (reduce) el.textContent = ph[0];
      else {
        let pi = 0, ci = 0, del = false;
        (function tick() {
          if (!el.isConnected) return;
          const ch = Array.from(ph[pi]);
          if (!del) { ci++; el.textContent = ch.slice(0, ci).join(''); if (ci >= ch.length) { del = true; setTimeout(tick, 2400); return; } setTimeout(tick, 38); }
          else { ci = Math.max(0, ci - 2); el.textContent = ch.slice(0, ci).join(''); if (!ci) { del = false; pi = (pi + 1) % ph.length; setTimeout(tick, 350); return; } setTimeout(tick, 16); }
        })();
      }
    }
    $$('[data-jump]', root).forEach(b => b.addEventListener('click', () => {
      const t = document.getElementById(b.dataset.jump); if (t) t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    }));
  }
  function wireGeneric(root) {
    $$('.fx-flip', root).forEach(f => {
      const t = () => f.classList.toggle('flipped');
      f.addEventListener('click', t);
      f.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); t(); } });
    });
    $$('[data-fact]', root).forEach(b => b.addEventListener('click', () => say(b.dataset.fact, 5200)));
  }

  /* ---------- tab latihan: progress bar, konfeti, piala ---------- */
  function bindQuiz() {
    const el = $('#tab-latihan'); if (!el || el.dataset.fxBound) return; el.dataset.fxBound = '1';
    const on = () => document.body.classList.contains('fx-mode');
    const apply = () => {
      if (!on()) return;
      const sc = $('.quiz-score', el);
      if (sc && !$('.fx-qbar', el)) {
        const m = sc.textContent.match(/Soal\s+(\d+)\s*\/\s*(\d+)/);
        if (m) sc.insertAdjacentHTML('afterend', `<div class="fx-qbar" data-i="${m[1]}" data-n="${m[2]}" style="--p:${((m[1] - 1) / m[2] * 100).toFixed(1)}"><span></span><i aria-hidden="true">${cur.emoji}</i></div>`);
      }
      if ($('#retry', el) && !$('.fx-trophy', el)) {
        const h = $('h2', el), m = h && h.textContent.match(/(\d+)\s*\/\s*(\d+)/), s = m ? +m[1] : 0, t = m ? +m[2] : 6;
        if (h) h.insertAdjacentHTML('beforebegin', `<span class="fx-trophy" aria-hidden="true">${s / t >= .8 ? '🏆' : s / t >= .5 ? '🌟' : '💪'}</span>`);
        if (s / t >= .8) { setTimeout(() => confetti(null, null, 140), 250); say('Luar biasa! Kamu jagoan banget 🏆', 5000); }
        else if (s / t >= .5) say('Bagus! Sedikit lagi sempurna 🌟', 4200);
        else say('Tidak apa-apa, baca materinya lalu coba lagi ya. Aku temani! 💪', 4800);
      }
    };
    new MutationObserver(apply).observe(el, { childList: true, subtree: true });
    el.addEventListener('click', e => {
      if (!on()) return;
      const b = e.target.closest && e.target.closest('.option'); if (!b) return;
      const bar = $('.fx-qbar', el); if (bar) bar.style.setProperty('--p', (+bar.dataset.i / +bar.dataset.n * 100).toFixed(1));
      if (b.classList.contains('correct')) { confettiAt(b, 36); say(pick(['Benar! 🎉', 'Tepat sekali! ⭐', 'Mantap, lanjut! 🚀']), 2800); }
      else if (b.classList.contains('wrong')) say(pick(['Tidak apa-apa, baca penjelasannya ya 📖', 'Hampir! Pelajari pembahasannya 💡', 'Salah itu bagian dari belajar 🌱']), 3800);
    });
    apply();
  }
  function bindTabs() {
    const tabs = $('.tabs'); if (!tabs || tabs.dataset.fxBound) return; tabs.dataset.fxBound = '1';
    tabs.addEventListener('click', e => {
      const b = e.target.closest && e.target.closest('.tab');
      if (!b || !document.body.classList.contains('fx-mode') || !cur) return;
      const m = cur.tabMsg[b.dataset.tab]; if (m) say(m, 3200);
    });
  }

  /* ---------- pasang ke aplikasi ---------- */
  function enhance(cfg) {
    cur = cfg; document.body.classList.toggle('fx-reduce', reduce); ensureMascot();
    const m = $('#tab-materi'), c = $('#tab-coba');
    if (m && !$('.fx-adv', m)) {
      m.insertAdjacentHTML('afterbegin', '<div class="fx-adv">' + cfg.materi() + '</div><div class="fx-divider"><span>📖</span> Catatan lengkap <span>✏️</span></div>');
      const r = $('.fx-adv', m); wireHero(r, cfg); wireGeneric(r); cfg.wireMateri(r); reveal(r);
    }
    if (c && !$('.fx-adv', c)) {
      c.insertAdjacentHTML('afterbegin', '<div class="fx-adv">' + cfg.coba() + '</div><div class="fx-divider"><span>🧪</span> Simulasi bawaan <span>🎛️</span></div>');
      const r = $('.fx-adv', c); wireGeneric(r); cfg.wireCoba(r); reveal(r);
    }
    bindQuiz(); bindTabs(); setTimeout(() => say(cfg.greet, 4200), 900);
  }
  function install(cfg) {
    const prevOpen = window.openModule;
    if (typeof prevOpen === 'function') {
      window.openModule = function (id) {
        const r = prevOpen.apply(this, arguments);
        const v = document.getElementById('moduleView'), on = id === cfg.id && v && v.classList.contains('active');
        document.body.classList.toggle('fx-' + cfg.id, !!on);
        document.body.classList.toggle('fx-mode', MODES.some(m => document.body.classList.contains('fx-' + m)));
        if (on) { try { enhance(cfg); } catch (e) { console.error('[fun-' + cfg.id + ']', e); } }
        return r;
      };
    }
    const prevShow = window.showPanel;
    if (typeof prevShow === 'function') {
      window.showPanel = function (id) {
        const r = prevShow.apply(this, arguments);
        if (id !== 'moduleView') { MODES.forEach(m => document.body.classList.remove('fx-' + m)); document.body.classList.remove('fx-mode'); }
        return r;
      };
    }
    const mark = () => {
      const b = $('#moduleCards [data-open="' + cfg.id + '"]'), card = b && b.closest('.module-card');
      if (card && !card.classList.contains('fx-card')) { card.classList.add('fx-card'); card.insertAdjacentHTML('afterbegin', '<span class="fx-ribbon">✨ SERU!</span>'); }
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(mark, 0)); else setTimeout(mark, 0);
  }

  window.FunCore = { $, $$, pick, ri, fmt, reduce, hero, sec, say, sayCool, confetti, confettiAt, touch, bump, shake, install };
})();
