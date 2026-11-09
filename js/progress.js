(function () {

    // ==========================================
    // 1. DATA DEFAULT SETIAP MODUL
    // ==========================================

    const defaults = () => ({
        persentase: {
            materi: false,
            coba: false,
            latihan: { score: 0, total: 6, completed: false }
        },
        persamaan: {
            materi: false,
            coba: false,
            latihan: { score: 0, total: 10, completed: false }
        },
        geometri: {
            materi: false,
            coba: false,
            latihan: { score: 0, total: 6, completed: false }
        },
        statistik: {
            materi: false,
            coba: false,
            latihan: { score: 0, total: 6, completed: false }
        },
        trigonometri: {
            materi: false,
            coba: false,
            latihan: { score: 0, total: 10, completed: false }
        },
        peluang: {
            materi: false,
            coba: false,
            latihan: { score: 0, total: 6, completed: false }
        }
    });


    // ==========================================
    // 2. IDENTITAS AKUN DAN KUNCI PENYIMPANAN
    // ==========================================

    const LEGACY_KEY = 'mdny_progress';
    const MIGRATION_KEY = 'mdny_progress_migrated';

    let activeUser = (
        localStorage.getItem('mdny_current_user') || ''
    ).trim().toLowerCase();

    function getUserProgressKey(userEmail) {
        if (!userEmail) return null;

        return 'mdny_progress_' + encodeURIComponent(
            userEmail.trim().toLowerCase()
        );
    }


    // ==========================================
    // 3. MENGGABUNGKAN DATA LAMA DAN BARU
    // ==========================================

    function merge(base, src) {

        if (!src || typeof src !== 'object') {
            return base;
        }

        Object.keys(base).forEach(k => {

            if (!src[k] || typeof src[k] !== 'object') {
                return;
            }

            base[k].materi = !!src[k].materi;
            base[k].coba = !!src[k].coba;

            if (src[k].latihan) {

                const old = src[k].latihan;

                const total = Math.max(
                    1,
                    Number(old.total) || 6
                );

                const score = Math.min(
                    total,
                    Math.max(0, Number(old.score) || 0)
                );

                base[k].latihan = {
                    score,
                    total,
                    completed: typeof old.completed === 'boolean'
                        ? old.completed
                        : score > 0
                };
            }

        });

        return base;
    }


    // ==========================================
    // 4. MEMUAT PROGRES BERDASARKAN AKUN
    // ==========================================

    function loadDataForUser(userEmail) {

        activeUser = (userEmail || '').trim().toLowerCase();

        // Jika tidak ada akun yang login,
        // tampilkan progres kosong.
        if (!activeUser) {
            return defaults();
        }

        const userKey = getUserProgressKey(activeUser);

        try {

            let saved = localStorage.getItem(userKey);

            // --------------------------------------
            // MIGRASI PROGRES LAMA
            // --------------------------------------
            // Progres lama masih berada di mdny_progress.
            // Pindahkan hanya satu kali ke akun pertama
            // yang login setelah pembaruan ini.

            if (
                saved === null &&
                localStorage.getItem(MIGRATION_KEY) !== 'true'
            ) {

                const oldProgress = localStorage.getItem(LEGACY_KEY);

                if (oldProgress !== null) {

                    localStorage.setItem(userKey, oldProgress);

                    // Tandai bahwa migrasi sudah dilakukan.
                    localStorage.setItem(MIGRATION_KEY, 'true');

                    saved = oldProgress;
                }
            }

            if (saved === null) {
                return defaults();
            }

            return merge(defaults(), JSON.parse(saved));

        } catch (error) {

            console.warn(
                'Data progres akun tidak dapat dibaca:',
                error
            );

            return defaults();
        }
    }


    let data = loadDataForUser(activeUser);


    // ==========================================
    // 5. MENYIMPAN PROGRES SESUAI AKUN
    // ==========================================

    function save() {

        // Jangan menyimpan progres jika tidak ada akun login.
        if (!activeUser) return;

        const userKey = getUserProgressKey(activeUser);

        try {

            localStorage.setItem(
                userKey,
                JSON.stringify(data)
            );

        } catch (error) {

            console.error('Gagal menyimpan progres:', error);
        }
    }


    // ==========================================
    // 6. SINKRONISASI CLOUD
    // ==========================================

    async function sync() {

        if (!activeUser) return;

        if (typeof window.saveProgressToCloud !== 'function') {
            return;
        }

        try {

            await window.saveProgressToCloud(data);

        } catch (error) {

            console.warn('Sinkronisasi progres gagal:', error);
        }
    }


    // ==========================================
    // 7. MENGHITUNG TOTAL PROGRES
    // ==========================================

    function overall() {

        let completed = 0;
        const total = 18;

        Object.values(data).forEach(item => {

            if (item.materi) completed++;
            if (item.coba) completed++;
            if (item.latihan.completed) completed++;

        });

        return completed / total;
    }


    // ==========================================
    // 8. MEMPERBARUI DASHBOARD
    // ==========================================

    function render() {

        const names = {
            persentase: 'Persentase',
            persamaan: 'SPLDV (Sistem Persamaan Linear Dua Variabel)',
            geometri: 'Geometri',
            statistik: 'Statistik',
            trigonometri: 'Trigonometri',
            peluang: 'Peluang'
        };

        const colors = {
            persentase: '#FF9F1C',
            persamaan: '#3B82F6',
            geometri: '#7C3AED',
            statistik: '#17C3B2',
            trigonometri: '#F2C94C',
            peluang: '#E33E57'
        };

        const grid = document.getElementById('progressGrid');

        if (grid) {

            grid.innerHTML = Object.entries(data).map(([k, v]) => {

                const completed =
                    (v.materi ? 1 : 0) +
                    (v.coba ? 1 : 0) +
                    (v.latihan.completed ? 1 : 0);

                const percentage = Math.round(
                    (completed / 3) * 100
                );

                return `
                    <div class="progress-card">

                        <div class="title">
                            ${names[k]}
                        </div>

                        <div class="progress-meta">
                            <span>${percentage}% selesai</span>

                            <span>
                                ${v.latihan.score}/${v.latihan.total} latihan
                            </span>
                        </div>

                        <div class="bar">
                            <span
                                style="
                                    width:${percentage}%;
                                    background:${colors[k]}
                                ">
                            </span>
                        </div>

                    </div>
                `;

            }).join('');
        }


        const rankBadge = document.getElementById('rankBadge');

        if (rankBadge) {

            const progress = overall();

            let rank = '🌱 Pemula';

            if (progress === 1) {
                rank = '🏆 Master Matematika';
            } else if (progress >= 0.72) {
                rank = '🔥 Rajin Belajar';
            } else if (progress >= 0.38) {
                rank = '🚀 Explorer';
            }

            rankBadge.textContent = rank;
        }

    }


    // ==========================================
    // 9. OBJEK PROGRESS
    // ==========================================

    window.Progress = {

        data,

        defaults,


        // Memuat progres berdasarkan email akun.
        loadForUser(userEmail) {

            data = loadDataForUser(userEmail);

            window.Progress.data = data;

            render();
        },


        // Mengetahui akun yang sedang aktif.
        getActiveUser() {
            return activeUser;
        },


        // Memperbarui data progres.
        replace(newData) {

            data = merge(defaults(), newData);

            window.Progress.data = data;

            save();
            render();
            sync();
        },


        // Menandai materi selesai.
        setMateri(k) {

            if (!activeUser || !data[k]) return;

            if (data[k].materi) return;

            data[k].materi = true;

            save();
            render();
            sync();
        },


        // Menandai simulasi selesai.
        setCoba(k) {

            if (!activeUser || !data[k]) return;

            if (data[k].coba) return;

            data[k].coba = true;

            save();
            render();
            sync();
        },


        // Menyimpan hasil latihan.
        setLatihan(k, score, total) {

            if (!activeUser || !data[k]) return;

            score = Number(score);
            total = Number(total);

            if (
                !Number.isFinite(score) ||
                !Number.isFinite(total) ||
                total <= 0 ||
                score < 0 ||
                score > total
            ) {
                return;
            }

            data[k].latihan = {
                score,
                total,
                completed: true
            };

            save();
            render();
            sync();
        },


        // Mengambil salinan data progres.
        export() {
            return JSON.parse(JSON.stringify(data));
        },


        // Memasukkan data progres dari sumber lain.
        importAndSave(newData) {

            data = merge(defaults(), newData);

            window.Progress.data = data;

            save();
            render();
            sync();
        },


        // Menghitung keseluruhan progres.
        overall,


        // Memperbarui tampilan dashboard.
        render

    };


    // ==========================================
    // 10. MENAMPILKAN PROGRES SAAT HALAMAN DIBUKA
    // ==========================================

    if (document.readyState === 'loading') {

        document.addEventListener('DOMContentLoaded', render);

    } else {

        render();

    }

})();