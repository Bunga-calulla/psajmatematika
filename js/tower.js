(() => {
  'use strict';

  /* =========================================================
     CONFIG
  ========================================================= */
  const TOTAL_FLOORS = 100;
  const HITS_TO_CLEAR = 5;
  const DAMAGE_PER_HIT = 100 / HITS_TO_CLEAR;
  const MAX_LIVES = 3;
  const STORAGE_KEY = 'mathBreakTower_v2';
  const SPEED_DEMON_THRESHOLD = 3;

  const COSMETICS = [
    { id: 'default',  name: 'Api Biru',      requiredFloor: 1,   color: '#34e6ff' },
    { id: 'gold',     name: 'Rune Emas',     requiredFloor: 10,  color: '#ffcf5c' },
    { id: 'crimson',  name: 'Api Merah',     requiredFloor: 25,  color: '#ff4d6d' },
    { id: 'void',     name: 'Void Ungu',     requiredFloor: 50,  color: '#a05bff' },
    { id: 'toxic',    name: 'Racun Hijau',   requiredFloor: 75,  color: '#3be08e' },
    { id: 'prism',    name: 'Prisma Legenda',requiredFloor: 100, color: '#ffffff' }
  ];

  const BADGES = [
    { floor: 10,  icon: '🥉' },
    { floor: 25,  icon: '🥈' },
    { floor: 50,  icon: '🥇' },
    { floor: 100, icon: '👑' }
  ];

  const MATH_RUNES = ['π', '∑', '√', '∞', '÷', '×', 'sin', '∆'];

  /* =========================================================
     UTILITIES
  ========================================================= */
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function niceNumber(n) {
    const rounded = Math.round(n * 100) / 100;
    return Number.isInteger(rounded) ? rounded : rounded.toFixed(2).replace(/0+$/, '').replace(/\.$/, '');
  }
  function todayStr() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  /* =========================================================
     PROGRESS (localStorage)
  ========================================================= */
  function defaultProgress() {
    return {
      highestFloor: 1,
      totalStars: 0,
      floorStars: {},
      achievements: { speedDemon: false, flawless: false, perfectionist: false },
      flawlessStreak: 0,
      bestCombo: 0,
      selectedCosmetic: 'default',
      dailyLog: {}
    };
  }

  function loadProgress() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultProgress();
      return Object.assign(defaultProgress(), JSON.parse(raw));
    } catch (e) {
      return defaultProgress();
    }
  }

  function saveProgress() { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); }

  let progress = loadProgress();

  function getCosmeticColor() {
    const c = COSMETICS.find(c => c.id === progress.selectedCosmetic) || COSMETICS[0];
    return c.color;
  }

  /* =========================================================
     QUESTION GENERATORS
  ========================================================= */
  const SPECIAL_ANGLES = [0, 30, 45, 60, 90];
  const TRIG_VALUES = {
    sin: { 0: '0', 30: '1/2', 45: '√2/2', 60: '√3/2', 90: '1' },
    cos: { 0: '1', 30: '√3/2', 45: '√2/2', 60: '1/2', 90: '0' },
    tan: { 0: '0', 30: '√3/3', 45: '1', 60: '√3', 90: 'Tak terdefinisi' }
  };

  function generateTrig() {
    const func = pick(['sin', 'cos', 'tan']);
    const angle = pick(SPECIAL_ANGLES);
    const correct = TRIG_VALUES[func][angle];
    const pool = new Set();
    ['sin', 'cos', 'tan'].forEach(f => Object.values(TRIG_VALUES[f]).forEach(v => pool.add(v)));
    pool.delete(correct);
    const distractors = shuffle([...pool]).slice(0, 3);
    const options = shuffle([correct, ...distractors]);
    return { category: 'Trigonometri', text: `Berapa nilai ${func}(${angle}°)?`, options, correctIndex: options.indexOf(correct) };
  }

  function generateGeometri() {
    const shape = pick(['persegi', 'persegi_panjang', 'lingkaran', 'segitiga']);
    const mode = pick(['luas', 'keliling']);
    let text = '', correct = 0;

    if (shape === 'persegi') {
      const s = randInt(3, 15);
      if (mode === 'luas') { correct = s * s; text = `Berapa luas persegi dengan sisi ${s} cm?`; }
      else { correct = 4 * s; text = `Berapa keliling persegi dengan sisi ${s} cm?`; }
    } else if (shape === 'persegi_panjang') {
      const p = randInt(6, 20);
      const l = randInt(2, p - 2);
      if (mode === 'luas') { correct = p * l; text = `Berapa luas persegi panjang dengan panjang ${p} cm dan lebar ${l} cm?`; }
      else { correct = 2 * (p + l); text = `Berapa keliling persegi panjang dengan panjang ${p} cm dan lebar ${l} cm?`; }
    } else if (shape === 'lingkaran') {
      const r = pick([7, 14, 21, 28]);
      if (mode === 'luas') { correct = Math.round((22 / 7) * r * r); text = `Berapa luas lingkaran dengan jari-jari ${r} cm? (π ≈ 22/7)`; }
      else { correct = Math.round(2 * (22 / 7) * r); text = `Berapa keliling lingkaran dengan jari-jari ${r} cm? (π ≈ 22/7)`; }
    } else {
      if (mode === 'luas') {
        const base = randInt(4, 20), tinggi = randInt(3, 15);
        correct = (base * tinggi) / 2;
        text = `Berapa luas segitiga dengan alas ${base} cm dan tinggi ${tinggi} cm?`;
      } else {
        const a = randInt(3, 15), b = randInt(3, 15), c = randInt(3, 15);
        correct = a + b + c;
        text = `Berapa keliling segitiga dengan sisi ${a} cm, ${b} cm, dan ${c} cm?`;
      }
    }

    const unit = mode === 'luas' ? 'cm²' : 'cm';
    const correctStr = `${niceNumber(correct)} ${unit}`;
    const distractors = new Set();
    let guard = 0;
    while (distractors.size < 3 && guard < 30) {
      guard++;
      const spread = Math.max(2, Math.round(correct * 0.25));
      const val = correct + randInt(-spread, spread);
      if (val > 0 && val !== correct) distractors.add(`${niceNumber(val)} ${unit}`);
    }
    const options = shuffle([correctStr, ...distractors]);
    return { category: 'Geometri', text, options, correctIndex: options.indexOf(correctStr) };
  }

  function generateProbability() {
    const templates = [
      () => ({ text: `Sebuah dadu dilempar sekali. Berapa peluang muncul angka ${randInt(1, 6)}?`, correct: '1/6' }),
      () => ({ text: `Sebuah dadu dilempar sekali. Berapa peluang muncul angka genap?`, correct: '1/2' }),
      () => ({ text: `Sebuah dadu dilempar sekali. Berapa peluang muncul angka ganjil?`, correct: '1/2' }),
      () => ({ text: `Sebuah dadu dilempar sekali. Berapa peluang muncul angka lebih dari 4?`, correct: '1/3' }),
      () => ({ text: `Sebuah koin dilempar sekali. Berapa peluang muncul sisi angka?`, correct: '1/2' }),
      () => ({ text: `Sebuah kartu diambil acak dari 52 kartu bridge. Berapa peluang terambil kartu merah?`, correct: '1/2' }),
      () => ({ text: `Dalam kantong ada 4 bola merah dan 6 bola biru. Berapa peluang terambil bola merah?`, correct: '2/5' }),
      () => ({ text: `Dalam kantong ada 3 bola kuning dan 9 bola hijau. Berapa peluang terambil bola kuning?`, correct: '1/4' })
    ];
    const t = pick(templates)();
    const pool = ['1/6', '1/2', '1/3', '2/3', '1/4', '3/4', '2/5', '3/5', '5/6', '1/12'];
    const distractors = shuffle(pool.filter(v => v !== t.correct)).slice(0, 3);
    const options = shuffle([t.correct, ...distractors]);
    return { category: 'Peluang', text: t.text, options, correctIndex: options.indexOf(t.correct) };
  }

  function generatePercentageStats() {
    const mode = pick(['persentase', 'rata2', 'median']);
    let text = '', correct = 0;

    if (mode === 'persentase') {
      const percent = pick([5, 10, 20, 25, 40, 50, 75]);
      const base = randInt(2, 20) * 10;
      correct = (percent / 100) * base;
      text = `Berapa ${percent}% dari ${base}?`;
    } else if (mode === 'rata2') {
      const nums = Array.from({ length: 5 }, () => randInt(2, 20));
      correct = nums.reduce((a, b) => a + b, 0) / nums.length;
      text = `Berapa rata-rata (mean) dari data: ${nums.join(', ')}?`;
    } else {
      const nums = Array.from({ length: 5 }, () => randInt(2, 20)).sort((a, b) => a - b);
      correct = nums[2];
      text = `Data: ${nums.join(', ')}. Setelah diurutkan, berapa median dari data tersebut?`;
    }

    const correctStr = `${niceNumber(correct)}`;
    const distractors = new Set();
    let guard = 0;
    while (distractors.size < 3 && guard < 30) {
      guard++;
      const spread = Math.max(1, Math.round(correct * 0.3) || 2);
      const val = correct + randInt(-spread, spread);
      if (val >= 0 && val !== correct) distractors.add(`${niceNumber(val)}`);
    }
    const options = shuffle([correctStr, ...distractors]);
    return { category: 'Persentase & Statistik', text, options, correctIndex: options.indexOf(correctStr) };
  }

  function generateQuestion() {
    return pick([generateTrig, generateGeometri, generateProbability, generatePercentageStats])();
  }

  /* =========================================================
     GAME STATE
  ========================================================= */
  const state = {
    floor: 1, bossHp: 100, lives: MAX_LIVES, combo: 0, hitsLanded: 0,
    mistakesThisFloor: 0, currentQuestion: null, timeTotal: 10, timeLeft: 10,
    timerHandle: null, questionStartMs: 0, speedDemonHitThisFloor: false, locked: false
  };

  function timeForFloor(floor) { return Math.max(5, 12 - Math.floor(floor / 12)); }
  function bossNameForFloor(floor) {
    return floor % 10 === 0 ? `👑 Penjaga Menara — Lantai ${floor}` : `Pintu Bersegel #${floor}`;
  }

  /* =========================================================
     DOM REFERENCES
  ========================================================= */
  const screenStart = document.getElementById('screenStart');
  const screenGame = document.getElementById('screenGame');

  const statHighestFloor = document.getElementById('statHighestFloor');
  const statTotalStars = document.getElementById('statTotalStars');
  const statAchCount = document.getElementById('statAchCount');

  const floorNumEl = document.getElementById('floorNum');
  const comboIndicator = document.getElementById('comboIndicator');
  const bossNameEl = document.getElementById('bossName');
  const bossHpFill = document.getElementById('bossHpFill');
  const bossHpText = document.getElementById('bossHpText');
  const livesRow = document.getElementById('livesRow');
  const timerBarFill = document.getElementById('timerBarFill');
  const questionCategory = document.getElementById('questionCategory');
  const questionText = document.getElementById('questionText');
  const answerGrid = document.getElementById('answerGrid');

  const sbFloor = document.getElementById('sbFloor');
  const sbStars = document.getElementById('sbStars');
  const sbBestCombo = document.getElementById('sbBestCombo');
  const sbAchList = document.getElementById('sbAchList');
  const sbLeaderboard = document.getElementById('sbLeaderboard');
  const goalText = document.getElementById('goalText');
  const goalProgressFill = document.getElementById('goalProgressFill');
  const cosmeticGrid = document.getElementById('cosmeticGrid');
  const badgeGrid = document.getElementById('badgeGrid');

  const modalFloorComplete = document.getElementById('modalFloorComplete');
  const starsEarnedEl = document.getElementById('starsEarned');
  const floorCompleteText = document.getElementById('floorCompleteText');
  const achievementPopup = document.getElementById('achievementPopup');
  const modalGameOver = document.getElementById('modalGameOver');
  const gameOverText = document.getElementById('gameOverText');
  const modalTowerCleared = document.getElementById('modalTowerCleared');
  const modalAchievements = document.getElementById('modalAchievements');
  const achievementListEl = document.getElementById('achievementList');
  const modalHighscore = document.getElementById('modalHighscore');
  const highscoreListEl = document.getElementById('highscoreList');
  const modalPause = document.getElementById('modalPause');

  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  const ACHIEVEMENT_META = {
    speedDemon: { icon: '⚡', name: 'Speed Demon', desc: 'Menjawab benar dalam waktu kurang dari 3 detik.' },
    flawless: { icon: '🛡️', name: 'Flawless', desc: 'Menang 5 lantai berturut-turut tanpa jawaban salah.' },
    perfectionist: { icon: '💎', name: 'Perfectionist', desc: 'Meraih 3 bintang penuh di satu lantai.' }
  };

  /* =========================================================
     STONE TEXTURE (pre-rendered offscreen for performance)
  ========================================================= */
  let stoneTexture = null;
  function buildStoneTexture() {
    const tex = document.createElement('canvas');
    tex.width = canvas.width;
    tex.height = canvas.height;
    const tctx = tex.getContext('2d');

    const g = tctx.createLinearGradient(0, 0, 0, tex.height);
    g.addColorStop(0, '#1c1a28');
    g.addColorStop(0.6, '#100e18');
    g.addColorStop(1, '#08070d');
    tctx.fillStyle = g;
    tctx.fillRect(0, 0, tex.width, tex.height);

    const brickW = 54, brickH = 30;
    let row = 0;
    for (let y = -brickH; y < tex.height + brickH; y += brickH) {
      const offset = (row % 2 === 0) ? 0 : brickW / 2;
      for (let x = -brickW; x < tex.width + brickW; x += brickW) {
        const shade = 12 + Math.floor(Math.random() * 14);
        tctx.fillStyle = `rgba(${shade + 30},${shade + 26},${shade + 40},0.9)`;
        tctx.fillRect(x + offset + 2, y + 2, brickW - 4, brickH - 4);
        tctx.strokeStyle = 'rgba(0,0,0,0.5)';
        tctx.lineWidth = 1;
        tctx.strokeRect(x + offset + 2, y + 2, brickW - 4, brickH - 4);
        if (Math.random() < 0.15) {
          tctx.strokeStyle = 'rgba(0,0,0,0.35)';
          tctx.beginPath();
          tctx.moveTo(x + offset + 6, y + brickH - 6);
          tctx.lineTo(x + offset + brickW - 10, y + 8);
          tctx.stroke();
        }
      }
      row++;
    }

    // vignette
    const vg = tctx.createRadialGradient(tex.width / 2, tex.height / 2, tex.height * 0.2, tex.width / 2, tex.height / 2, tex.height * 0.85);
    vg.addColorStop(0, 'rgba(0,0,0,0)');
    vg.addColorStop(1, 'rgba(0,0,0,0.65)');
    tctx.fillStyle = vg;
    tctx.fillRect(0, 0, tex.width, tex.height);

    stoneTexture = tex;
  }

  /* =========================================================
     CANVAS SCENE STATE
  ========================================================= */
  const scene = {
    shake: 0, doorCracks: [], particles: [], doorFlash: 0, idleT: 0,
    bolt: null // { points, progress, hit, targetX, targetY }
  };

  function resetSceneForFloor() {
    scene.doorCracks = [];
    scene.bolt = null;
    scene.particles = [];
    scene.doorFlash = 0;
    scene.shake = 0;
  }

  function addCrack() {
    const cx = canvas.width / 2 + randInt(-55, 55);
    const cy = 145 + randInt(-25, 25);
    const points = [[cx, cy]];
    let x = cx, y = cy;
    for (let i = 0; i < 4; i++) {
      x += randInt(-22, 22);
      y += randInt(-14, 22);
      points.push([x, y]);
    }
    scene.doorCracks.push(points);
  }

  function spawnParticles(x, y, color) {
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 3.5;
      scene.particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 1, color });
    }
  }

  function buildLightningPath(x1, y1, x2, y2) {
    const points = [[x1, y1]];
    const segments = 7;
    for (let i = 1; i < segments; i++) {
      const t = i / segments;
      const bx = x1 + (x2 - x1) * t;
      const by = y1 + (y2 - y1) * t;
      const perp = (Math.random() - 0.5) * 26 * (1 - Math.abs(t - 0.5) * 1.4);
      points.push([bx + perp, by]);
    }
    points.push([x2, y2]);
    return points;
  }

  /* =========================================================
     CANVAS DRAWING
  ========================================================= */
  function drawBackground() {
    if (stoneTexture) ctx.drawImage(stoneTexture, 0, 0);

    const t = scene.idleT;
    for (let i = 0; i < 3; i++) {
      const ox = 90 + i * 230 + Math.sin(t / 60 + i) * 10;
      const oy = 50 + Math.cos(t / 70 + i) * 8;
      const grd = ctx.createRadialGradient(ox, oy, 0, ox, oy, 55);
      grd.addColorStop(0, 'rgba(208,91,255,0.16)');
      grd.addColorStop(1, 'rgba(208,91,255,0)');
      ctx.fillStyle = grd;
      ctx.fillRect(ox - 55, oy - 55, 110, 110);
    }

    // floor line
    ctx.strokeStyle = 'rgba(160,140,255,0.12)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - 66);
    ctx.lineTo(canvas.width, canvas.height - 66);
    ctx.stroke();
  }

  function drawDoor(hpPercent) {
    const cx = canvas.width / 2 + (scene.shake ? randInt(-scene.shake, scene.shake) : 0);
    const cy = 150;
    const w = 150, h = 210;
    const hue = hpPercent > 50 ? '52,230,255' : hpPercent > 20 ? '255,207,92' : '255,61,110';

    ctx.save();
    ctx.translate(cx, cy);

    // ambient glow
    const glow = ctx.createRadialGradient(0, 0, 10, 0, 0, 130);
    glow.addColorStop(0, `rgba(${hue},0.25)`);
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(-140, -140, 280, 280);

    // outer stone frame (thick blocky arch)
    ctx.fillStyle = '#20202c';
    ctx.strokeStyle = 'rgba(90,80,110,0.9)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-w / 2 - 14, h / 2);
    ctx.lineTo(-w / 2 - 14, -h / 2 + 20);
    ctx.quadraticCurveTo(-w / 2 - 14, -h / 2 - 26, 0, -h / 2 - 26);
    ctx.quadraticCurveTo(w / 2 + 14, -h / 2 - 26, w / 2 + 14, -h / 2 + 20);
    ctx.lineTo(w / 2 + 14, h / 2);
    ctx.lineTo(-w / 2 - 14, h / 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // stone brick segments along the frame
    ctx.strokeStyle = 'rgba(0,0,0,0.4)';
    ctx.lineWidth = 1;
    for (let i = -h / 2; i < h / 2; i += 18) {
      ctx.beginPath(); ctx.moveTo(-w / 2 - 14, i); ctx.lineTo(-w / 2 + 2, i); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(w / 2 - 2, i); ctx.lineTo(w / 2 + 14, i); ctx.stroke();
    }

    // inner door slab
    ctx.fillStyle = 'rgba(8,10,20,0.95)';
    ctx.strokeStyle = `rgba(${hue},0.85)`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-w / 2, h / 2);
    ctx.lineTo(-w / 2, -h / 2 + 18);
    ctx.quadraticCurveTo(-w / 2, -h / 2, 0, -h / 2);
    ctx.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + 18);
    ctx.lineTo(w / 2, h / 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // carved rune circle
    ctx.strokeStyle = `rgba(${hue},0.6)`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, -5, 46 + Math.sin(scene.idleT / 20) * 3, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, -5, 30, scene.idleT / 40, scene.idleT / 40 + Math.PI * 1.4);
    ctx.stroke();

    // glowing math runes around the circle
    ctx.font = '13px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = `rgba(${hue},1)`;
    ctx.shadowBlur = 8;
    ctx.fillStyle = `rgba(${hue},0.95)`;
    for (let i = 0; i < MATH_RUNES.length; i++) {
      const a = (Math.PI * 2 * i) / MATH_RUNES.length + scene.idleT / 60;
      const rx = Math.cos(a) * 46, ry = -5 + Math.sin(a) * 46;
      ctx.fillText(MATH_RUNES[i], rx, ry);
    }
    ctx.shadowBlur = 0;

    // door lower panel runes
    ctx.font = '11px Georgia, serif';
    ctx.fillStyle = `rgba(${hue},0.7)`;
    ctx.fillText('÷ = × ∑', 0, h / 2 - 22);

    ctx.restore();

    // cracks in world space
    ctx.strokeStyle = 'rgba(255,255,255,0.6)';
    ctx.lineWidth = 1.5;
    scene.doorCracks.forEach(points => {
      ctx.beginPath();
      ctx.moveTo(points[0][0], points[0][1]);
      for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
      ctx.stroke();
    });

    if (scene.doorFlash > 0) {
      ctx.fillStyle = `rgba(255,255,255,${scene.doorFlash})`;
      ctx.beginPath();
      ctx.arc(cx, cy - 5, 100, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawCharacter() {
    const x = canvas.width / 2;
    const y = canvas.height - 46;
    const bob = Math.sin(scene.idleT / 15) * 3;
    const color = getCosmeticColor();

    ctx.save();
    ctx.translate(x, y + bob);

    // robe (bell shape with fold lines)
    ctx.fillStyle = '#1a1826';
    ctx.beginPath();
    ctx.moveTo(-30, 34);
    ctx.quadraticCurveTo(-34, -6, -14, -22);
    ctx.lineTo(14, -22);
    ctx.quadraticCurveTo(34, -6, 30, 34);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = `${color}99`;
    ctx.lineWidth = 2;
    ctx.stroke();

    // robe folds
    ctx.strokeStyle = 'rgba(0,0,0,0.4)';
    ctx.lineWidth = 1.5;
    [-14, -4, 8, 18].forEach(fx => {
      ctx.beginPath();
      ctx.moveTo(fx * 0.9, -14);
      ctx.lineTo(fx * 1.5, 30);
      ctx.stroke();
    });

    // hood (pointed cone)
    ctx.fillStyle = '#211f30';
    ctx.beginPath();
    ctx.moveTo(-16, -18);
    ctx.quadraticCurveTo(-14, -42, 0, -52);
    ctx.quadraticCurveTo(14, -42, 16, -18);
    ctx.quadraticCurveTo(0, -10, -16, -18);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = `${color}99`;
    ctx.lineWidth = 2;
    ctx.stroke();

    // face shadow void
    ctx.fillStyle = '#05050a';
    ctx.beginPath();
    ctx.ellipse(0, -22, 8, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    // glowing eyes
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 6;
    ctx.beginPath(); ctx.arc(-3, -22, 1.6, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(3, -22, 1.6, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;

    // extended arm
    ctx.strokeStyle = '#1a1826';
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(16, -6);
    ctx.lineTo(30, -30);
    ctx.stroke();

    // glowing orb in hand (casting energy)
    const orbGlow = ctx.createRadialGradient(30, -34, 0, 30, -34, 16);
    orbGlow.addColorStop(0, `${color}ee`);
    orbGlow.addColorStop(1, `${color}00`);
    ctx.fillStyle = orbGlow;
    ctx.beginPath();
    ctx.arc(30, -34, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(30, -34, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  function drawLightning() {
    const b = scene.bolt;
    if (!b) return;
    const pts = b.points;
    const totalSegs = pts.length - 1;
    const visibleSegs = b.progress * totalSegs;

    ctx.save();
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    for (let pass = 0; pass < 2; pass++) {
      ctx.strokeStyle = pass === 0 ? 'rgba(52,230,255,0.35)' : '#eafcff';
      ctx.lineWidth = pass === 0 ? 9 : 3;
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i <= totalSegs; i++) {
        if (i <= visibleSegs) {
          ctx.lineTo(pts[i][0], pts[i][1]);
        } else if (i - 1 < visibleSegs) {
          const frac = visibleSegs - (i - 1);
          const px = pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * frac;
          const py = pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * frac;
          ctx.lineTo(px, py);
        }
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawParticles() {
    scene.particles.forEach(p => {
      ctx.globalAlpha = Math.max(p.life, 0);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  function updateScene() {
    scene.idleT++;
    if (scene.shake > 0) scene.shake = Math.max(0, scene.shake - 0.6);
    if (scene.doorFlash > 0) scene.doorFlash = Math.max(0, scene.doorFlash - 0.05);

    if (scene.bolt) {
      scene.bolt.progress += 0.14;
      if (scene.bolt.progress >= 1) {
        scene.bolt.progress = 1;
        if (!scene.bolt.hit) {
          scene.bolt.hit = true;
          scene.shake = 8;
          scene.doorFlash = 0.9;
          spawnParticles(scene.bolt.targetX, scene.bolt.targetY, getCosmeticColor());
          addCrack();
          if (typeof scene.onImpact === 'function') {
            const cb = scene.onImpact;
            scene.onImpact = null;
            cb();
          }
        }
      }
    }

    scene.particles.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += 0.08; p.life -= 0.03; });
    scene.particles = scene.particles.filter(p => p.life > 0);
  }

  function renderCanvas() {
    const hpPercent = Math.max(0, state.bossHp);
    drawBackground();
    drawDoor(hpPercent);
    drawCharacter();
    drawLightning();
    drawParticles();
  }

  function canvasLoop() { updateScene(); renderCanvas(); requestAnimationFrame(canvasLoop); }

  function fireLightning(onImpact) {
    const startX = canvas.width / 2 + 30, startY = canvas.height - 46 - 34;
    const targetX = canvas.width / 2, targetY = 145;
    scene.bolt = { points: buildLightningPath(startX, startY, targetX, targetY), progress: 0, hit: false, targetX, targetY };
    scene.onImpact = onImpact;
  }

  /* =========================================================
     GAME FLOW
  ========================================================= */
  function showScreen(id) {
    screenStart.style.display = id === 'start' ? '' : 'none';
    screenGame.style.display = id === 'game' ? '' : 'none';
  }

  function refreshStartStats() {
    statHighestFloor.textContent = progress.highestFloor;
    statTotalStars.textContent = `⭐ ${progress.totalStars}`;
    statAchCount.textContent = `${Object.values(progress.achievements).filter(Boolean).length} / 3`;
  }

  function startGame() {
    state.floor = progress.highestFloor || 1;
    loadFloor(state.floor);
    showScreen('game');
  }

  function loadFloor(floorNum) {
    state.floor = floorNum;
    state.bossHp = 100;
    state.lives = MAX_LIVES;
    state.combo = 0;
    state.hitsLanded = 0;
    state.mistakesThisFloor = 0;
    state.speedDemonHitThisFloor = false;
    state.locked = false;

    resetSceneForFloor();

    floorNumEl.textContent = floorNum;
    bossNameEl.textContent = bossNameForFloor(floorNum);
    updateBossHpUI();
    updateLivesUI();
    updateComboUI();
    refreshSidebars();
    askNewQuestion();
  }

  function updateBossHpUI() {
    const pct = Math.max(0, state.bossHp);
    bossHpFill.style.width = pct + '%';
    bossHpText.textContent = `${Math.round(pct)} / 100`;
  }

  function updateLivesUI() {
    let html = '';
    for (let i = 0; i < MAX_LIVES; i++) html += `<span class="life-star${i < state.lives ? '' : ' lost'}">⭐</span>`;
    livesRow.innerHTML = html;
  }

  function updateComboUI() {
    comboIndicator.textContent = `🔥 x${Math.max(1, state.combo)}`;
    comboIndicator.classList.remove('pulse');
    void comboIndicator.offsetWidth;
    comboIndicator.classList.add('pulse');
  }

  function askNewQuestion() {
    state.locked = false;
    state.currentQuestion = generateQuestion();
    state.timeTotal = timeForFloor(state.floor);
    state.timeLeft = state.timeTotal;
    state.questionStartMs = performance.now();

    questionCategory.textContent = state.currentQuestion.category;
    questionText.textContent = state.currentQuestion.text;
    answerGrid.innerHTML = '';
    state.currentQuestion.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'answer-btn';
      btn.textContent = opt;
      btn.addEventListener('click', () => selectAnswer(idx, btn));
      answerGrid.appendChild(btn);
    });

    timerBarFill.style.width = '100%';
    timerBarFill.classList.remove('urgent');
    startTimer();
  }

  function startTimer() {
    clearInterval(state.timerHandle);
    const tickMs = 100;
    state.timerHandle = setInterval(() => {
      state.timeLeft -= tickMs / 1000;
      const pct = Math.max(0, (state.timeLeft / state.timeTotal) * 100);
      timerBarFill.style.width = pct + '%';
      if (pct < 25) timerBarFill.classList.add('urgent');
      if (state.timeLeft <= 0) {
        clearInterval(state.timerHandle);
        if (!state.locked) onTimeExpired();
      }
    }, tickMs);
  }

  function onTimeExpired() {
    state.locked = true;
    const correctIdx = state.currentQuestion.correctIndex;
    const btns = answerGrid.querySelectorAll('.answer-btn');
    btns.forEach((b, i) => { b.disabled = true; if (i === correctIdx) b.classList.add('correct'); });
    handleWrong();
  }

  function selectAnswer(idx, btnEl) {
    if (state.locked) return;
    state.locked = true;
    clearInterval(state.timerHandle);

    const elapsed = (performance.now() - state.questionStartMs) / 1000;
    const correctIdx = state.currentQuestion.correctIndex;
    const btns = answerGrid.querySelectorAll('.answer-btn');
    btns.forEach(b => b.disabled = true);

    if (idx === correctIdx) {
      btnEl.classList.add('correct');
      handleCorrect(elapsed);
    } else {
      btnEl.classList.add('wrong');
      btns[correctIdx].classList.add('correct');
      handleWrong();
    }
  }

  function handleCorrect(elapsed) {
    state.combo++;
    state.hitsLanded++;
    if (elapsed < SPEED_DEMON_THRESHOLD) {
      state.speedDemonHitThisFloor = true;
      unlockAchievement('speedDemon');
    }
    updateComboUI();

    const comboMultiplier = 1 + Math.min(state.combo - 1, 5) * 0.1;
    const damage = DAMAGE_PER_HIT * comboMultiplier;

    fireLightning(() => {
      state.bossHp = Math.max(0, state.bossHp - damage);
      updateBossHpUI();
      if (state.bossHp <= 0 || state.hitsLanded >= HITS_TO_CLEAR) setTimeout(() => onFloorWon(), 400);
      else setTimeout(() => askNewQuestion(), 500);
    });
  }

  function handleWrong() {
    state.combo = 0;
    state.mistakesThisFloor++;
    state.lives--;
    updateComboUI();
    updateLivesUI();
    if (state.lives <= 0) setTimeout(() => onFloorFailed(), 700);
    else setTimeout(() => askNewQuestion(), 900);
  }

  function starsForFloor() {
    if (state.mistakesThisFloor === 0) return 3;
    if (state.mistakesThisFloor === 1) return 2;
    return 1;
  }

  function logDailyProgress() {
    const key = todayStr();
    const reached = state.floor + 1;
    if (!progress.dailyLog[key] || reached > progress.dailyLog[key]) progress.dailyLog[key] = reached;
    const days = Object.keys(progress.dailyLog).sort();
    if (days.length > 14) delete progress.dailyLog[days[0]];
  }

  function onFloorWon() {
    const stars = starsForFloor();
    const prevStars = progress.floorStars[state.floor] || 0;
    if (stars > prevStars) {
      progress.totalStars += (stars - prevStars);
      progress.floorStars[state.floor] = stars;
    }
    if (state.floor + 1 > progress.highestFloor) progress.highestFloor = state.floor + 1;
    if (state.combo > progress.bestCombo) progress.bestCombo = state.combo;

    let unlockedNow = null;
    if (stars === 3) {
      if (!progress.achievements.perfectionist) unlockedNow = 'perfectionist';
      unlockAchievement('perfectionist');
    }
    if (state.mistakesThisFloor === 0) {
      progress.flawlessStreak = (progress.flawlessStreak || 0) + 1;
      if (progress.flawlessStreak >= 5) {
        if (!progress.achievements.flawless) unlockedNow = unlockedNow || 'flawless';
        unlockAchievement('flawless');
      }
    } else {
      progress.flawlessStreak = 0;
    }

    logDailyProgress();
    saveProgress();
    refreshSidebars();

    if (state.floor >= TOTAL_FLOORS) { showModal(modalTowerCleared); return; }

    starsEarnedEl.textContent = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
    floorCompleteText.textContent = `Lantai ${state.floor} berhasil diselesaikan!`;

    if (unlockedNow) {
      achievementPopup.style.display = 'block';
      achievementPopup.textContent = `🏆 Achievement baru: ${ACHIEVEMENT_META[unlockedNow].name}!`;
    } else {
      achievementPopup.style.display = 'none';
    }
    showModal(modalFloorComplete);
  }

  function onFloorFailed() {
    progress.flawlessStreak = 0;
    saveProgress();
    gameOverText.textContent = `Bintangmu habis di lantai ${state.floor}. Coba lagi untuk menembus pintu ini!`;
    showModal(modalGameOver);
  }

  function unlockAchievement(key) {
    if (!progress.achievements[key]) { progress.achievements[key] = true; saveProgress(); }
  }

  /* =========================================================
     SIDEBAR RENDERING
  ========================================================= */
  function refreshSidebars() {
    sbFloor.textContent = state.floor;
    sbStars.textContent = `⭐ ${progress.totalStars}`;
    sbBestCombo.textContent = `x${progress.bestCombo || 0}`;

    sbAchList.innerHTML = Object.keys(ACHIEVEMENT_META).map(key => {
      const meta = ACHIEVEMENT_META[key];
      const unlocked = !!progress.achievements[key];
      return `<div class="mini-ach ${unlocked ? 'unlocked' : ''}"><span class="ico">${meta.icon}</span><span>${meta.name}</span></div>`;
    }).join('');

    const days = Object.keys(progress.dailyLog).sort().reverse().slice(0, 5);
    const today = todayStr();
    sbLeaderboard.innerHTML = days.length
      ? days.map(d => `<div class="lb-row ${d === today ? 'today' : ''}"><span class="lb-date">${d === today ? 'Hari ini' : d}</span><span class="lb-floor">Lt. ${progress.dailyLog[d]}</span></div>`).join('')
      : `<div class="lb-empty">Belum ada rekor hari ini.</div>`;

    const nextCosmetic = COSMETICS.find(c => c.requiredFloor > progress.highestFloor);
    if (nextCosmetic) {
      goalText.textContent = `Capai Lantai ${nextCosmetic.requiredFloor} untuk membuka kosmetik "${nextCosmetic.name}".`;
      const prevReq = [...COSMETICS].reverse().find(c => c.requiredFloor <= progress.highestFloor)?.requiredFloor || 1;
      const pct = Math.min(100, ((progress.highestFloor - prevReq) / (nextCosmetic.requiredFloor - prevReq)) * 100);
      goalProgressFill.style.width = `${pct}%`;
    } else {
      goalText.textContent = `Semua kosmetik telah terbuka. Kamu Sang Penakluk Menara!`;
      goalProgressFill.style.width = '100%';
    }

    cosmeticGrid.innerHTML = COSMETICS.map(c => {
      const unlocked = progress.highestFloor >= c.requiredFloor;
      const selected = progress.selectedCosmetic === c.id;
      return `<div class="cosmetic-item ${unlocked ? '' : 'locked'} ${selected ? 'selected' : ''}" data-id="${c.id}" title="${c.name}${unlocked ? '' : ` (Lantai ${c.requiredFloor})`}">
        <div class="swatch" style="background:${c.color};box-shadow:0 0 10px ${c.color}"></div>
        ${unlocked ? '' : '<span class="lock-ico">🔒</span>'}
      </div>`;
    }).join('');
    cosmeticGrid.querySelectorAll('.cosmetic-item').forEach(el => {
      el.addEventListener('click', () => {
        const id = el.dataset.id;
        const cosmetic = COSMETICS.find(c => c.id === id);
        if (!cosmetic || progress.highestFloor < cosmetic.requiredFloor) return;
        progress.selectedCosmetic = id;
        saveProgress();
        refreshSidebars();
      });
    });

    badgeGrid.innerHTML = BADGES.map(b => {
      const unlocked = progress.highestFloor >= b.floor;
      return `<div class="badge-item ${unlocked ? 'unlocked' : 'locked'}" title="Lantai ${b.floor}">${b.icon}</div>`;
    }).join('');
  }

  /* =========================================================
     MODALS
  ========================================================= */
  function showModal(modalEl) { modalEl.style.display = 'flex'; }
  function hideModal(modalEl) { modalEl.style.display = 'none'; }

  function renderAchievementsModal() {
    achievementListEl.innerHTML = Object.keys(ACHIEVEMENT_META).map(key => {
      const meta = ACHIEVEMENT_META[key];
      const unlocked = !!progress.achievements[key];
      return `<div class="ach-item ${unlocked ? 'unlocked' : ''}">
        <div class="ach-icon ${unlocked ? '' : 'locked'}">${meta.icon}</div>
        <div class="ach-text"><strong>${meta.name}</strong><span>${meta.desc}</span></div>
      </div>`;
    }).join('');
  }

  function renderHighscoreModal() {
    const floorsCleared = Object.keys(progress.floorStars).length;
    highscoreListEl.innerHTML = `
      <div class="hs-item"><span class="hs-label">Lantai Tertinggi</span><span class="hs-value">${progress.highestFloor}</span></div>
      <div class="hs-item"><span class="hs-label">Total Bintang</span><span class="hs-value">⭐ ${progress.totalStars}</span></div>
      <div class="hs-item"><span class="hs-label">Lantai Diselesaikan</span><span class="hs-value">${floorsCleared}</span></div>
      <div class="hs-item"><span class="hs-label">Combo Terbaik</span><span class="hs-value">x${progress.bestCombo || 0}</span></div>
      <div class="hs-item"><span class="hs-label">Achievement</span><span class="hs-value">${Object.values(progress.achievements).filter(Boolean).length} / 3</span></div>
    `;
  }

  /* =========================================================
     EVENT WIRING
  ========================================================= */
  document.getElementById('btnStartGame').addEventListener('click', () => startGame());
  document.getElementById('btnOpenAchievements').addEventListener('click', () => { renderAchievementsModal(); showModal(modalAchievements); });
  document.getElementById('btnOpenHighscore').addEventListener('click', () => { renderHighscoreModal(); showModal(modalHighscore); });
  document.querySelectorAll('.btn-close-modal').forEach(btn => btn.addEventListener('click', () => hideModal(document.getElementById(btn.dataset.close))));
  document.getElementById('btnNextFloor').addEventListener('click', () => { hideModal(modalFloorComplete); loadFloor(state.floor + 1); });
  document.getElementById('btnRetryFloor').addEventListener('click', () => { hideModal(modalGameOver); loadFloor(state.floor); });
  document.getElementById('btnBackToMenuFromOver').addEventListener('click', () => { hideModal(modalGameOver); clearInterval(state.timerHandle); refreshStartStats(); showScreen('start'); });
  document.getElementById('btnBackToMenuFromClear').addEventListener('click', () => { hideModal(modalTowerCleared); refreshStartStats(); showScreen('start'); });
  document.getElementById('btnMenu').addEventListener('click', () => { clearInterval(state.timerHandle); showModal(modalPause); });
  document.getElementById('btnResumeGame').addEventListener('click', () => { hideModal(modalPause); startTimer(); });
  document.getElementById('btnQuitToMenu').addEventListener('click', () => { hideModal(modalPause); clearInterval(state.timerHandle); refreshStartStats(); showScreen('start'); });

  /* =========================================================
     INIT
  ========================================================= */
  buildStoneTexture();
  refreshStartStats();
  showScreen('start');
  requestAnimationFrame(canvasLoop);
})();