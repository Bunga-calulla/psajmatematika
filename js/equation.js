window._moduleSimulatorFallback=(id)=>{const x={persamaan:`<div class="content-card" style="--accent:#3B82F6"><h3>🚌 Biaya Perjalanan</h3><p>Atur jarak perjalanan untuk melihat total ongkos.</p><div class="sim-grid"><div><div class="control"><label>Jarak <output id="distOut">8 km</output></label><input id="dist" type="range" min="1" max="30" value="8"></div><div class="control"><label>Tarif/km <output id="rateOut">3000</output></label><input id="rate" type="range" min="1000" max="10000" step="500" value="3000"></div><div class="result-big" id="travelCost">Rp29.000</div></div><div class="sim-visual"><div class="road"></div></div></div></div>`,geometri:`<div class="content-card" style="--accent:#7C3AED"><h3>🏠 Studio Desain Rumah</h3><p>Ubah ukuran lantai dan lihat luasnya.</p><div class="sim-grid"><div><div class="control"><label>Panjang <output id="lenOut">8 m</output></label><input id="len" type="range" min="2" max="15" value="8"></div><div class="control"><label>Lebar <output id="widOut">5 m</output></label><input id="wid" type="range" min="2" max="10" value="5"></div><div class="result-big" id="area">40 m²</div></div><div class="sim-visual"><div class="house"></div></div></div></div>`,statistik:`<div class="content-card" style="--accent:#17C3B2"><h3>📊 Data Pertandingan</h3><p>Pilih jumlah data, atur skornya, lihat mean & median berubah langsung.</p><div class="control"><label>Jumlah data <select id="statCount"><option value="5">5 (ganjil)</option><option value="6">6 (genap)</option></select></label></div><div id="statGroup5"><div class="control"><label>Skor 1 <output id="s1o">8</output></label><input class="scoreRange g5" id="s1" type="range" min="0" max="20" value="8"></div><div class="control"><label>Skor 2 <output id="s2o">12</output></label><input class="scoreRange g5" id="s2" type="range" min="0" max="20" value="12"></div><div class="control"><label>Skor 3 <output id="s3o">10</output></label><input class="scoreRange g5" id="s3" type="range" min="0" max="20" value="10"></div><div class="control"><label>Skor 4 <output id="s4o">6</output></label><input class="scoreRange g5" id="s4" type="range" min="0" max="20" value="6"></div><div class="control"><label>Skor 5 <output id="s5o">14</output></label><input class="scoreRange g5" id="s5" type="range" min="0" max="20" value="14"></div></div><div id="statGroup6" class="hidden"><div class="control"><label>Skor 1 <output id="t1o">7</output></label><input class="scoreRange g6" id="t1" type="range" min="0" max="20" value="7"></div><div class="control"><label>Skor 2 <output id="t2o">9</output></label><input class="scoreRange g6" id="t2" type="range" min="0" max="20" value="9"></div><div class="control"><label>Skor 3 <output id="t3o">10</output></label><input class="scoreRange g6" id="t3" type="range" min="0" max="20" value="10"></div><div class="control"><label>Skor 4 <output id="t4o">12</output></label><input class="scoreRange g6" id="t4" type="range" min="0" max="20" value="12"></div><div class="control"><label>Skor 5 <output id="t5o">13</output></label><input class="scoreRange g6" id="t5" type="range" min="0" max="20" value="13"></div><div class="control"><label>Skor 6 <output id="t6o">15</output></label><input class="scoreRange g6" id="t6" type="range" min="0" max="20" value="15"></div></div><div class="result-big" id="statResult">Mean 10 · Median 10</div><p id="statNote" class="tip" style="margin-top:10px"></p></div>`,trigonometri:`<div class="content-card" style="--accent:#F2C94C"><h3>🏙️ Tinggi Gedung</h3><p>Masukkan jarak dan sudut elevasi untuk memperkirakan tinggi.</p><div class="sim-grid"><div><div class="control"><label>Jarak <output id="tdOut">12 m</output></label><input id="td" type="range" min="3" max="40" value="12"></div><div class="control"><label>Sudut <output id="angOut">45°</output></label><input id="ang" type="range" min="10" max="80" value="45"></div><div class="result-big" id="height">12,00 m</div></div><div class="sim-visual"><div class="building" id="building" style="height:120px"><span></span><span></span><span></span></div></div></div></div>`,peluang:`<div class="content-card" style="--accent:#E33E57"><h3>🎲 Simulator Peluang</h3><p>Atur jumlah sisi dadu dan pilih berapa hasil yang kamu inginkan.</p><div class="sim-grid"><div><div class="control"><label>Sisi dadu <output id="sidesOut">6</output></label><input id="sides" type="range" min="4" max="12" value="6"></div><div class="control"><label>Hasil yang diinginkan <output id="favOut">3</output></label><input id="fav" type="range" min="1" max="3" value="3"></div><div class="result-big" id="probResult">50%</div></div><div class="sim-visual"><div class="pie" id="pie"></div></div></div></div>`};return x[id]||''};

window._bindSimulatorFallback = (id) => {

    // Mengambil elemen HTML berdasarkan ID
    const $ = (elementId) => document.getElementById(elementId);

    // Mencatat progres setelah pengguna berinteraksi
    const mark = () => {
        if (
            window.Progress &&
            typeof window.Progress.setCoba === 'function'
        ) {
            window.Progress.setCoba(id);
        }
    };

    // ==========================================
    // 1. PERSAMAAN — BIAYA PERJALANAN
    // ==========================================
    if (id === 'persamaan') {

        const dist = $('dist');
        const rate = $('rate');
        const distOut = $('distOut');
        const rateOut = $('rateOut');
        const travelCost = $('travelCost');

        if (!dist || !rate || !distOut || !rateOut || !travelCost) return;

        // Menghitung biaya perjalanan
        const f = () => {
            distOut.textContent = dist.value + ' km';
            rateOut.textContent = rate.value;

            const total = (+rate.value * +dist.value) + 5000;

            travelCost.textContent =
                'Rp' + new Intl.NumberFormat('id-ID').format(total);
        };

        // Catat progres hanya ketika slider digerakkan
        dist.oninput = () => {
            f();
            mark();
        };

        rate.oninput = () => {
            f();
            mark();
        };

        // Menampilkan hasil awal tanpa mencatat progres
        f();
    }


    // ==========================================
    // 2. GEOMETRI — STUDIO DESAIN RUMAH
    // ==========================================
    else if (id === 'geometri') {

        const len = $('len');
        const wid = $('wid');
        const lenOut = $('lenOut');
        const widOut = $('widOut');
        const area = $('area');

        if (!len || !wid || !lenOut || !widOut || !area) return;

        // Menghitung luas lantai
        const f = () => {
            lenOut.textContent = len.value + ' m';
            widOut.textContent = wid.value + ' m';

            area.textContent =
                (Number(len.value) * Number(wid.value)) + ' m²';
        };

        // Catat progres ketika ukuran diubah
        len.oninput = () => {
            f();
            mark();
        };

        wid.oninput = () => {
            f();
            mark();
        };

        // Menampilkan hasil awal tanpa mencatat progres
        f();
    }


    // ==========================================
    // 3. STATISTIK — DATA PERTANDINGAN
    // ==========================================
    else if (id === 'statistik') {

        const g5 = $('statGroup5');
        const g6 = $('statGroup6');
        const sel = $('statCount');

        const statResult = $('statResult');
        const statNote = $('statNote');

        if (!g5 || !g6 || !sel || !statResult || !statNote) return;

        // Menghitung mean, median, dan kemungkinan outlier
        const f = () => {

            const n = Number(sel.value);

            const ids = n === 5
                ? ['s1', 's2', 's3', 's4', 's5']
                : ['t1', 't2', 't3', 't4', 't5', 't6'];

            const vals = ids.map(x => Number($(x).value));

            // Memperbarui angka pada setiap slider
            ids.forEach((x, i) => {
                const output = $(x + 'o');

                if (output) {
                    output.textContent = vals[i];
                }
            });

            // Mengurutkan data
            const sorted = [...vals].sort((a, b) => a - b);

            // Menghitung mean
            const mean =
                vals.reduce((a, b) => a + b, 0) / n;

            // Menghitung median
            const median = n % 2 === 1
                ? sorted[(n - 1) / 2]
                : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;

            // Menampilkan mean dan median
            statResult.textContent =
                'Mean ' + mean.toFixed(1) +
                ' · Median ' +
                (Number.isInteger(median)
                    ? median
                    : median.toFixed(1)) +
                ' (' + (n % 2 === 1 ? 'ganjil' : 'genap') + ')';

            // Mendeteksi kemungkinan nilai ekstrem
            const range = sorted[n - 1] - sorted[0];
            const gap = Math.abs(mean - median);

            statNote.textContent =
                (range > 0 && gap / range > 0.15)
                    ? '⚠️ Mean dan median beda cukup jauh — kemungkinan ada nilai ekstrem (outlier) yang menarik mean.'
                    : '';
        };

        // Mengganti jumlah data
        sel.onchange = () => {

            g5.classList.toggle('hidden', sel.value !== '5');
            g6.classList.toggle('hidden', sel.value !== '6');

            f();
            mark();
        };

        // Mengubah skor
        document.querySelectorAll('.scoreRange').forEach(input => {

            input.oninput = () => {
                f();
                mark();
            };

        });

        // Menampilkan hasil awal tanpa mencatat progres
        f();
    }


    // ==========================================
    // 4. TRIGONOMETRI — FALLBACK TINGGI GEDUNG
    // ==========================================
    else if (id === 'trigonometri') {

        const td = $('td');
        const ang = $('ang');

        const tdOut = $('tdOut');
        const angOut = $('angOut');
        const height = $('height');
        const building = $('building');

        if (!td || !ang || !tdOut || !angOut || !height || !building) return;

        // Menghitung tinggi gedung
        const f = () => {

            const h =
                Number(td.value) *
                Math.tan(Number(ang.value) * Math.PI / 180);

            tdOut.textContent = td.value + ' m';
            angOut.textContent = ang.value + '°';

            height.textContent =
                h.toFixed(2).replace('.', ',') + ' m';

            building.style.height =
                Math.min(240, 50 + h * 7) + 'px';
        };

        // Catat progres ketika slider diubah
        td.oninput = () => {
            f();
            mark();
        };

        ang.oninput = () => {
            f();
            mark();
        };

        // Menampilkan hasil awal tanpa mencatat progres
        f();
    }


    // ==========================================
    // 5. PELUANG — SIMULATOR DADU
    // ==========================================
    else if (id === 'peluang') {

        const sides = $('sides');
        const fav = $('fav');

        const sidesOut = $('sidesOut');
        const favOut = $('favOut');
        const probResult = $('probResult');
        const pie = $('pie');

        if (
            !sides ||
            !fav ||
            !sidesOut ||
            !favOut ||
            !probResult ||
            !pie
        ) return;

        // Menghitung peluang
        const f = () => {

            const s = Number(sides.value);

            const fa = Math.min(Number(fav.value), s);

            sidesOut.textContent = s;

            // Menyesuaikan batas jumlah hasil yang diinginkan
            fav.max = s;
            fav.value = fa;

            favOut.textContent = fa;

            // Menghitung peluang dalam persen
            const p = (fa / s) * 100;

            probResult.textContent = p.toFixed(1) + '%';

            // Memperbarui diagram lingkaran
            pie.style.background =
                `conic-gradient(#E33E57 0 ${p}%, #fff ${p}% 100%)`;
        };

        // Catat progres ketika jumlah sisi diubah
        sides.oninput = () => {
            f();
            mark();
        };

        // Catat progres ketika hasil yang diinginkan diubah
        fav.oninput = () => {
            f();
            mark();
        };

        // Menampilkan hasil awal tanpa mencatat progres
        f();
    }

};
