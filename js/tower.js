"use strict";

/* =========================================================
   MATH BREAK — THE INFINITE TOWER
   GAME ENGINE
   ========================================================= */

const STORAGE_KEY = "mathBreakTower_v4";

const MAX_FLOORS = 100;
const MAX_LIVES = 3;
const MAX_BOSS_HP = 100;
const TOTAL_CHALLENGES = 3;

/* =========================================================
   DATA SOAL
   ========================================================= */

const FLOOR_DATA = {
    1: {
        area: "AREA 01 • THE BEGINNING",
        title: "The First Step",
        description: "Aktifkan kristal pertama dan buka gerbang menuju lantai berikutnya.",
        boss: "The First Gate",
        questions: [
            {
                category: "TRIGONOMETRI",
                text: "Sebuah segitiga siku-siku memiliki sisi depan 6 cm dan sisi miring 10 cm. Berapakah nilai sin θ?",
                answers: ["3/5", "2/5", "4/5", "5/6"],
                correct: 0
            },
            {
                category: "GEOMETRI",
                text: "Sebuah lingkaran memiliki diameter 14 cm. Jika π = 22/7, berapakah luas lingkaran?",
                answers: ["44 cm²", "154 cm²", "308 cm²", "616 cm²"],
                correct: 1
            },
            {
                category: "STATISTIKA",
                text: "Data: 6, 8, 7, 9, 10. Berapakah nilai rata-ratanya?",
                answers: ["7", "7,5", "8", "8,5"],
                correct: 2
            }
        ]
    },

    2: {
        area: "AREA 01 • THE BEGINNING",
        title: "The Rising Path",
        description: "Jalur mulai menanjak. Tunjukkan kemampuanmu untuk membuka gerbang berikutnya.",
        boss: "The Rising Gate",
        questions: [
            {
                category: "ALJABAR",
                text: "Jika 2x + 7 = 19, berapakah nilai x?",
                answers: ["5", "6", "7", "8"],
                correct: 1
            },
            {
                category: "FUNGSI",
                text: "Diketahui f(x) = 3x - 2. Berapakah nilai f(5)?",
                answers: ["10", "11", "13", "15"],
                correct: 2
            },
            {
                category: "PELUANG",
                text: "Sebuah dadu dilempar sekali. Peluang muncul angka genap adalah ...",
                answers: ["1/6", "1/3", "1/2", "2/3"],
                correct: 2
            }
        ]
    },

    3: {
        area: "AREA 01 • THE BEGINNING",
        title: "Crystal Chamber",
        description: "Kristal penjaga mulai aktif. Pecahkan tantangan untuk mendapatkan energi.",
        boss: "Crystal Keeper",
        questions: [
            {
                category: "ALJABAR",
                text: "Jika 5x - 10 = 20, maka nilai x adalah ...",
                answers: ["4", "5", "6", "7"],
                correct: 2
            },
            {
                category: "GEOMETRI",
                text: "Keliling persegi dengan panjang sisi 12 cm adalah ...",
                answers: ["24 cm", "36 cm", "48 cm", "144 cm"],
                correct: 2
            },
            {
                category: "STATISTIKA",
                text: "Median dari data 3, 5, 7, 8, 10 adalah ...",
                answers: ["5", "7", "8", "10"],
                correct: 1
            }
        ]
    },

    4: {
        area: "AREA 01 • THE BEGINNING",
        title: "The Broken Bridge",
        description: "Jembatan menuju gerbang berikutnya runtuh. Gunakan logikamu.",
        boss: "Bridge Guardian",
        questions: [
            {
                category: "TRIGONOMETRI",
                text: "Nilai cos 60° adalah ...",
                answers: ["0", "1/2", "√2/2", "1"],
                correct: 1
            },
            {
                category: "PELUANG",
                text: "Sebuah koin dilempar sekali. Peluang muncul sisi gambar adalah ...",
                answers: ["0", "1/4", "1/2", "1"],
                correct: 2
            },
            {
                category: "ALJABAR",
                text: "Jika 3x = 27, maka x = ...",
                answers: ["6", "7", "8", "9"],
                correct: 3
            }
        ]
    },

    5: {
        area: "AREA 01 • THE BEGINNING",
        title: "First Guardian",
        description: "Penjaga pertama menunggumu. Kalahkan dia sebelum masuk ke area baru.",
        boss: "First Guardian",
        questions: [
            {
                category: "FUNGSI",
                text: "Jika f(x) = 2x + 1, maka f(4) adalah ...",
                answers: ["7", "8", "9", "10"],
                correct: 2
            },
            {
                category: "GEOMETRI",
                text: "Luas persegi panjang dengan panjang 15 cm dan lebar 8 cm adalah ...",
                answers: ["100 cm²", "120 cm²", "130 cm²", "150 cm²"],
                correct: 1
            },
            {
                category: "STATISTIKA",
                text: "Modus dari data 2, 3, 3, 4, 5, 3, 6 adalah ...",
                answers: ["2", "3", "4", "5"],
                correct: 1
            }
        ]
    }
};

/* =========================================================
   STATE
   ========================================================= */

let game = {
    floor: 1,
    lives: 3,
    combo: 0,
    bestCombo: 0,
    score: 0,
    totalScore: 0,
    stars: 0,
    coins: 0,
    xp: 0,
    question: 0,
    bossHP: 100,
    timer: 12,
    mistakes: 0,
    achievements: [],
    playing: false,
    paused: false,
    answered: false
};

let timerInterval = null;

/* =========================================================
   HELPER
   ========================================================= */

function $(id) {
    return document.getElementById(id);
}

function setText(id, value) {
    const element = $(id);

    if (element) {
        element.textContent = value;
    }
}

function show(id) {
    const element = $(id);

    if (element) {
        element.classList.remove("hidden");
    }
}

function hide(id) {
    const element = $(id);

    if (element) {
        element.classList.add("hidden");
    }
}

/* =========================================================
   SAVE / LOAD
   ========================================================= */

function saveProgress() {
    const data = {
        floor: game.floor,
        bestCombo: game.bestCombo,
        totalScore: game.totalScore,
        stars: game.stars,
        coins: game.coins,
        xp: game.xp,
        achievements: game.achievements
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadProgress() {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
        updateStartScreen();
        return;
    }

    try {
        const data = JSON.parse(saved);

        game.floor = data.floor || 1;
        game.bestCombo = data.bestCombo || 0;
        game.totalScore = data.totalScore || 0;
        game.stars = data.stars || 0;
        game.coins = data.coins || 0;
        game.xp = data.xp || 0;
        game.achievements = data.achievements || [];
    } catch (error) {
        console.error("Data game rusak:", error);
    }

    updateStartScreen();
}

/* =========================================================
   START SCREEN
   ========================================================= */

function updateStartScreen() {
    setText("startHighestFloor", game.floor);
    setText("startTotalStars", game.stars);
    setText("startAchievementCount", game.achievements.length);

    const progress = $("startProgressBar");

    if (progress) {
        progress.style.width =
            Math.max(1, (game.floor / MAX_FLOORS) * 100) + "%";
    }
}

function startGame() {
    hide("startScreen");
    show("gameScreen");

    startFloor(game.floor);
}

/* =========================================================
   FLOOR
   ========================================================= */

function startFloor(floor) {
    clearInterval(timerInterval);

    game.floor = floor;
    game.lives = MAX_LIVES;
    game.combo = 0;
    game.score = 0;
    game.question = 0;
    game.bossHP = MAX_BOSS_HP;
    game.timer = 12;
    game.mistakes = 0;
    game.playing = true;
    game.paused = false;
    game.answered = false;

    updateGameUI();
    loadQuestion();
}

/* =========================================================
   GET FLOOR DATA
   ========================================================= */

function getFloorData() {
    if (FLOOR_DATA[game.floor]) {
        return FLOOR_DATA[game.floor];
    }

    return {
        area: "AREA " + Math.ceil(game.floor / 15),
        title: "The Infinite Path",
        description:
            "Tantangan baru menunggu. Selesaikan soal untuk terus menaiki menara.",
        boss: "Tower Guardian",
        questions: [
            {
                category: "MATEMATIKA",
                text: "Berapakah hasil dari 8 × 7?",
                answers: ["54", "56", "58", "64"],
                correct: 1
            },
            {
                category: "ALJABAR",
                text: "Jika x + 5 = 12, maka nilai x adalah ...",
                answers: ["5", "6", "7", "8"],
                correct: 2
            },
            {
                category: "GEOMETRI",
                text: "Sebuah persegi memiliki sisi 10 cm. Berapakah luasnya?",
                answers: ["20 cm²", "50 cm²", "100 cm²", "200 cm²"],
                correct: 2
            }
        ]
    };
}

/* =========================================================
   LOAD QUESTION
   ========================================================= */

function loadQuestion() {
    const data = getFloorData();
    const question = data.questions[game.question];

    if (!question) {
        completeFloor();
        return;
    }

    game.timer = 12;
    game.answered = false;

    setText("floorNumber", game.floor);
    setText("sideFloor", game.floor);

    setText("missionArea", data.area);
    setText("missionTitle", data.title);
    setText("missionDescription", data.description);

    setText("bossName", data.boss);
    setText("bossHpText", game.bossHP + "/100");

    setText("questionCategory", question.category);
    setText("questionText", question.text);
    setText("questionNumber", "Tantangan " + (game.question + 1));

    setText("challengeNumber", game.question + 1);
    setText("challengeTotal", TOTAL_CHALLENGES);

    renderAnswers(question);

    updateGameUI();
    updateObjectives();

    startTimer();
}

/* =========================================================
   ANSWERS
   ========================================================= */

function renderAnswers(question) {
    const container = $("answerContainer");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    question.answers.forEach(function (answer, index) {
        const button = document.createElement("button");

        button.className = "answer-btn";
        button.type = "button";

        button.innerHTML =
            '<span class="answer-letter">' +
            String.fromCharCode(65 + index) +
            "</span>" +
            '<span class="answer-text">' +
            answer +
            "</span>";

        button.addEventListener("click", function () {
            answerQuestion(index);
        });

        container.appendChild(button);
    });

    hideFeedback();
}

/* =========================================================
   ANSWER CHECK
   ========================================================= */

function answerQuestion(index) {
    if (!game.playing || game.paused || game.answered) {
        return;
    }

    const data = getFloorData();
    const question = data.questions[game.question];

    game.answered = true;

    clearInterval(timerInterval);

    const buttons = document.querySelectorAll(
        "#answerContainer .answer-btn"
    );

    buttons.forEach(function (button, buttonIndex) {
        button.disabled = true;

        if (buttonIndex === question.correct) {
            button.classList.add("correct");
        }

        if (
            buttonIndex === index &&
            buttonIndex !== question.correct
        ) {
            button.classList.add("wrong");
        }
    });

    if (index === question.correct) {
        correctAnswer();
    } else {
        wrongAnswer(question.answers[question.correct]);
    }
}

/* =========================================================
   CORRECT
   ========================================================= */

function correctAnswer() {
    game.combo++;

    if (game.combo > game.bestCombo) {
        game.bestCombo = game.combo;
    }

    const damage = game.question === TOTAL_CHALLENGES - 1
        ? game.bossHP
        : 34;

    game.bossHP = Math.max(0, game.bossHP - damage);

    const earnedScore =
        100 +
        game.timer * 10 +
        game.combo * 25;

    game.score += earnedScore;
    game.totalScore += earnedScore;

    game.coins += 20;
    game.xp += 30;

    showFeedback(
        true,
        "Jawaban Benar!",
        "Serangan berhasil! Boss kehilangan " + damage + " HP."
    );

    showCanvasMessage("⚡", "CRITICAL HIT!");

    checkAchievements();
    updateGameUI();

    setTimeout(function () {
        if (game.question >= TOTAL_CHALLENGES - 1) {
            completeFloor();
        } else {
            game.question++;
            loadQuestion();
        }
    }, 900);
}

/* =========================================================
   WRONG
   ========================================================= */

function wrongAnswer(correctAnswer) {
    game.combo = 0;
    game.mistakes++;
    game.lives--;

    showFeedback(
        false,
        "Jawaban Salah!",
        "Jawaban yang benar adalah " + correctAnswer + "."
    );

    showCanvasMessage("💥", "SERANGAN GAGAL!");

    updateGameUI();

    if (game.lives <= 0) {
        setTimeout(gameOver, 900);
        return;
    }

    setTimeout(function () {
        if (game.question >= TOTAL_CHALLENGES - 1) {
            completeFloor();
        } else {
            game.question++;
            loadQuestion();
        }
    }, 1000);
}

/* =========================================================
   TIMER
   ========================================================= */

function startTimer() {
    clearInterval(timerInterval);

    setText("timerValue", game.timer);

    timerInterval = setInterval(function () {
        if (!game.playing || game.paused || game.answered) {
            return;
        }

        game.timer--;

        setText("timerValue", game.timer);

        const timer = $("timerValue");

        if (timer) {
            timer.classList.toggle("danger", game.timer <= 4);
            timer.classList.toggle(
                "warning",
                game.timer > 4 && game.timer <= 7
            );
        }

        if (game.timer <= 0) {
            timeOut();
        }
    }, 1000);
}

function timeOut() {
    if (game.answered) {
        return;
    }

    game.answered = true;

    clearInterval(timerInterval);

    const data = getFloorData();
    const question = data.questions[game.question];

    game.lives--;
    game.combo = 0;
    game.mistakes++;

    disableAnswers();

    showFeedback(
        false,
        "Waktu Habis!",
        "Jawaban yang benar adalah " +
        question.answers[question.correct] +
        "."
    );

    updateGameUI();

    if (game.lives <= 0) {
        setTimeout(gameOver, 900);
        return;
    }

    setTimeout(function () {
        game.question++;

        if (game.question >= TOTAL_CHALLENGES) {
            completeFloor();
        } else {
            loadQuestion();
        }
    }, 1000);
}

function disableAnswers() {
    document
        .querySelectorAll("#answerContainer .answer-btn")
        .forEach(function (button) {
            button.disabled = true;
        });
}

/* =========================================================
   FEEDBACK
   ========================================================= */

function showFeedback(correct, title, text) {
    const feedback = $("answerFeedback");

    if (!feedback) {
        return;
    }

    feedback.classList.remove("hidden", "correct", "wrong");
    feedback.classList.add(correct ? "correct" : "wrong");

    setText("feedbackIcon", correct ? "✓" : "✕");
    setText("feedbackTitle", title);
    setText("feedbackText", text);
}

function hideFeedback() {
    const feedback = $("answerFeedback");

    if (feedback) {
        feedback.classList.add("hidden");
    }
}

/* =========================================================
   UI
   ========================================================= */

function updateGameUI() {
    setText("sideFloor", game.floor);
    setText("floorNumber", game.floor);

    setText("sideStars", game.stars);
    setText("sideBestCombo", game.bestCombo);

    setText("comboValue", game.combo);
    setText("scoreValue", game.score);
    setText("timerValue", game.timer);

    setText("bossHpText", game.bossHP + "/100");

    const hpBar = $("bossHpBar");

    if (hpBar) {
        hpBar.style.width = game.bossHP + "%";
    }

    updateLives();
    updateProgress();
    updateRewards();
}

function updateLives() {
    const lives = document.querySelectorAll(".life");

    lives.forEach(function (life, index) {
        life.classList.toggle("active", index < game.lives);
    });
}

function updateProgress() {
    const percentage =
        Math.max(1, (game.floor / MAX_FLOORS) * 100);

    const bar = $("towerProgressBar");

    if (bar) {
        bar.style.width = percentage + "%";
    }

    setText(
        "towerProgressText",
        game.floor + " / " + MAX_FLOORS
    );

    setText("dailyProgress", game.floor + "%");
}

function updateRewards() {
    setText("rewardStars", "3");
    setText("rewardCoins", "60");
    setText("rewardXp", "90");

    setText("nextUnlockTitle", "Lantai " + (game.floor + 1));

    setText(
        "nextUnlockDescription",
        "Selesaikan lantai " +
        game.floor +
        " untuk membuka lantai berikutnya."
    );
}

function updateObjectives() {
    for (let i = 1; i <= TOTAL_CHALLENGES; i++) {
        const item = $("objectiveChallenge" + i);

        if (!item) {
            continue;
        }

        item.classList.remove("completed", "current");

        if (i <= game.question) {
            item.classList.add("completed");
        }

        if (i === game.question + 1) {
            item.classList.add("current");
        }
    }
}

/* =========================================================
   CANVAS MESSAGE
   ========================================================= */

function showCanvasMessage(icon, text) {
    setText("canvasMessageIcon", icon);
    setText("canvasMessageText", text);

    const message = $("canvasMessage");

    if (message) {
        message.classList.remove("hidden");

        setTimeout(function () {
            message.classList.add("hidden");
        }, 700);
    }
}

/* =========================================================
   FLOOR COMPLETE
   ========================================================= */

function completeFloor() {
    if (!game.playing) {
        return;
    }

    game.playing = false;

    clearInterval(timerInterval);

    const perfect = game.mistakes === 0;

    const earnedStars = perfect
        ? 3
        : game.lives === 3
            ? 2
            : 1;

    game.stars += earnedStars;
    game.coins += 40;
    game.xp += 60;

    checkAchievements();

    if (game.floor >= MAX_FLOORS) {
        showTowerComplete();
        saveProgress();
        return;
    }

    game.floor++;

    setText(
        "completeMessage",
        perfect
            ? "Lantai berhasil diselesaikan tanpa kesalahan!"
            : "Gerbang berhasil dibuka. Bersiap menuju lantai berikutnya!"
    );

    setText("completeStars", earnedStars);
    setText("completeCoins", 40);
    setText("completeXp", 60);
    setText("unlockedFloor", game.floor);

    show("floorCompleteModal");

    updateStartScreen();
    updateGameUI();

    saveProgress();
}

/* =========================================================
   GAME OVER
   ========================================================= */

function gameOver() {
    game.playing = false;

    clearInterval(timerInterval);

    setText("gameOverFloor", game.floor);
    setText("gameOverCombo", game.bestCombo);
    setText("gameOverScore", game.score);

    show("gameOverModal");

    saveProgress();
}

function retryFloor() {
    hide("gameOverModal");
    startFloor(game.floor);
}

/* =========================================================
   NEXT FLOOR
   ========================================================= */

function nextFloor() {
    hide("floorCompleteModal");
    startFloor(game.floor);
}

/* =========================================================
   ACHIEVEMENT
   ========================================================= */

function checkAchievements() {
    if (
        game.bestCombo >= 5 &&
        !game.achievements.includes("Combo Master")
    ) {
        game.achievements.push("Combo Master");
        showNotification(
            "🏆",
            "Achievement Unlocked!",
            "Combo Master"
        );
    }

    if (
        game.mistakes === 0 &&
        game.question >= 2 &&
        !game.achievements.includes("Perfect Floor")
    ) {
        game.achievements.push("Perfect Floor");
        showNotification(
            "⭐",
            "Achievement Unlocked!",
            "Perfect Floor"
        );
    }

    if (
        game.floor >= 10 &&
        !game.achievements.includes("Tower Explorer")
    ) {
        game.achievements.push("Tower Explorer");
        showNotification(
            "🏰",
            "Achievement Unlocked!",
            "Tower Explorer"
        );
    }

    saveProgress();
}

function openAchievements() {
    const list = $("achievementModalList");

    if (!list) {
        return;
    }

    list.innerHTML = "";

    if (game.achievements.length === 0) {
        list.innerHTML =
            "<p>Belum ada achievement.</p>";
    } else {
        game.achievements.forEach(function (achievement) {
            const item = document.createElement("div");

            item.className = "modal-achievement";
            item.innerHTML =
                "🏆 <strong>" +
                achievement +
                "</strong>";

            list.appendChild(item);
        });
    }

    show("achievementModal");
}

/* =========================================================
   HIGH SCORE
   ========================================================= */

function openHighScore() {
    setText("modalHighestFloor", game.floor);
    setText("modalTotalStars", game.stars);
    setText("modalBestCombo", game.bestCombo);
    setText("modalTotalScore", game.totalScore);

    const history = $("scoreHistoryList");

    if (history) {
        history.innerHTML =
            "<div class='history-row'>" +
            "<span>Total Score</span>" +
            "<strong>" +
            game.totalScore +
            "</strong>" +
            "</div>";
    }

    show("highScoreModal");
}

/* =========================================================
   NOTIFICATION
   ========================================================= */

function showNotification(icon, title, text) {
    setText("notificationIcon", icon);
    setText("notificationTitle", title);
    setText("notificationText", text);

    show("gameNotification");

    setTimeout(function () {
        hide("gameNotification");
    }, 2500);
}

/* =========================================================
   PAUSE
   ========================================================= */

function pauseGame() {
    if (!game.playing) {
        return;
    }

    game.paused = true;

    clearInterval(timerInterval);

    show("pauseModal");
}

function resumeGame() {
    hide("pauseModal");

    game.paused = false;

    if (game.playing && !game.answered) {
        startTimer();
    }
}

function backToMenu() {
    clearInterval(timerInterval);

    game.playing = false;
    game.paused = false;

    hide("pauseModal");
    hide("gameScreen");
    show("startScreen");

    updateStartScreen();
}

/* =========================================================
   TOWER COMPLETE
   ========================================================= */

function showTowerComplete() {
    setText("finalStars", game.stars);
    setText(
        "finalAchievements",
        game.achievements.length
    );

    show("towerClearedModal");
}

/* =========================================================
   MODAL CLOSE
   ========================================================= */

function closeModals() {
    document.querySelectorAll(".modal").forEach(function (modal) {
        modal.classList.add("hidden");
    });
}

/* =========================================================
   EVENTS
   ========================================================= */

function setupEvents() {

    if ($("startGameBtn")) {
        $("startGameBtn").addEventListener(
            "click",
            startGame
        );
    }

    if ($("achievementBtn")) {
        $("achievementBtn").addEventListener(
            "click",
            openAchievements
        );
    }

    if ($("highScoreBtn")) {
        $("highScoreBtn").addEventListener(
            "click",
            openHighScore
        );
    }

    if ($("pauseBtn")) {
        $("pauseBtn").addEventListener(
            "click",
            pauseGame
        );
    }

    if ($("resumeBtn")) {
        $("resumeBtn").addEventListener(
            "click",
            resumeGame
        );
    }

    if ($("pauseMenuBtn")) {
        $("pauseMenuBtn").addEventListener(
            "click",
            backToMenu
        );
    }

    if ($("nextFloorBtn")) {
        $("nextFloorBtn").addEventListener(
            "click",
            nextFloor
        );
    }

    if ($("retryBtn")) {
        $("retryBtn").addEventListener(
            "click",
            retryFloor
        );
    }

    if ($("towerCompleteBtn")) {
        $("towerCompleteBtn").addEventListener(
            "click",
            backToMenu
        );
    }

    document
        .querySelectorAll("[data-close-modal]")
        .forEach(function (button) {

            button.addEventListener("click", function () {

                const target =
                    button.getAttribute(
                        "data-close-modal"
                    );

                if (target) {
                    hide(target);
                } else {
                    closeModals();
                }

            });

        });
}

/* =========================================================
   INIT
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    setupEvents();
    loadProgress();

    hide("gameScreen");
    hide("floorCompleteModal");
    hide("gameOverModal");
    hide("towerClearedModal");
    hide("achievementModal");
    hide("highScoreModal");
    hide("pauseModal");
    hide("gameNotification");

    show("startScreen");

});