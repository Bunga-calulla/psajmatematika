let authMode = 'login';

document.addEventListener('DOMContentLoaded', () => {

    // =========================
    // MODE LOGIN / DAFTAR
    // =========================
    function pageMode(m) {
        authMode = m;

        const title = document.getElementById('pageAuthTitle');
        const subtitle = document.getElementById('pageAuthSubtitle');
        const submit = document.getElementById('pageAuthSubmit');

        const loginTab = document.getElementById('pageLoginTab');
        const registerTab = document.getElementById('pageRegisterTab');
        const error = document.getElementById('pageAuthError');

        if (!title || !subtitle || !submit) return;

        title.textContent =
            m === 'login'
                ? 'Selamat datang 👋'
                : 'Buat akun baru ✨';

        subtitle.textContent =
            m === 'login'
                ? 'Masuk untuk melanjutkan progres belajarmu.'
                : 'Daftar agar progresmu tersimpan di akun.';

        submit.textContent =
            m === 'login'
                ? 'Masuk ke Akun'
                : 'Buat Akun';

        if (loginTab) {
            loginTab.classList.toggle('active', m === 'login');
        }

        if (registerTab) {
            registerTab.classList.toggle('active', m === 'register');
        }

        if (error) {
            error.textContent = '';
        }
    }


    // =========================
    // TOMBOL NAVBAR MASUK / DAFTAR
    // =========================
    const openLogin = document.getElementById('openLogin');

    if (openLogin) {
        openLogin.onclick = () => {
            showPanel('loginPage');
            pageMode('login');
        };
    }


    // =========================
    // TAB MASUK
    // =========================
    const pageLoginTab = document.getElementById('pageLoginTab');

    if (pageLoginTab) {
        pageLoginTab.onclick = () => {
            pageMode('login');
        };
    }


    // =========================
    // TAB DAFTAR
    // =========================
    const pageRegisterTab = document.getElementById('pageRegisterTab');

    if (pageRegisterTab) {
        pageRegisterTab.onclick = () => {
            pageMode('register');
        };
    }


    // =========================
    // LOGIN SEBAGAI TAMU
    // =========================
    const pageGuestLogin = document.getElementById('pageGuestLogin');

    if (pageGuestLogin) {
        pageGuestLogin.onclick = () => {
            localStorage.setItem('mdny_current_user', 'Tamu');

            showPanel('home');

            updateAuthArea();
        };
    }


    // =========================
    // FORM LOGIN / DAFTAR
    // =========================
    const pageAuthForm = document.getElementById('pageAuthForm');

    if (pageAuthForm) {
        pageAuthForm.onsubmit = doPageAuth;
    }


    // =========================
    // UPDATE TAMPILAN NAVBAR
    // =========================
    updateAuthArea();
});


// =========================
// LOGIN / DAFTAR DUMMY
// =========================
function doPageAuth(e) {

    e.preventDefault();

    const username = document
        .getElementById('pageAuthEmail')
        .value
        .trim();

    const password = document
        .getElementById('pageAuthPassword')
        .value
        .trim();

    const error = document.getElementById('pageAuthError');

    error.textContent = '';


    // Username wajib diisi
    if (!username) {
        error.textContent = 'Username wajib diisi.';
        return;
    }


    // Password wajib diisi
    if (!password) {
        error.textContent = 'Password wajib diisi.';
        return;
    }


    // Simpan username ke browser
    localStorage.setItem(
        'mdny_current_user',
        username
    );


    // Masuk ke halaman utama
    showPanel('home');


    // Update navbar
    updateAuthArea();
}


// =========================
// UPDATE NAVBAR AKUN
// =========================
function updateAuthArea() {

    const authArea = document.getElementById('authArea');

    if (!authArea) return;

    const username = localStorage.getItem('mdny_current_user');


    // =========================
    // KALAU SUDAH LOGIN
    // =========================
    if (username) {

        authArea.innerHTML = `
            <div class="user-menu">

                <span class="avatar">
                    ${username.charAt(0).toUpperCase()}
                </span>

                <span>${username}</span>

                <button
                    class="logout-btn"
                    id="logoutBtn"
                    type="button">
                    Keluar
                </button>

            </div>
        `;


        const logoutBtn =
            document.getElementById('logoutBtn');


        if (logoutBtn) {

            logoutBtn.onclick = () => {

                // Hapus user
                localStorage.removeItem(
                    'mdny_current_user'
                );


                // Update navbar
                updateAuthArea();


                // Kembali ke login
                showPanel('loginPage');

                pageMode('login');
            };
        }


    // =========================
    // KALAU BELUM LOGIN
    // =========================
    } else {

        authArea.innerHTML = `
            <button
                class="pill-btn"
                id="openLogin2"
                type="button">
                Masuk / Daftar
            </button>
        `;


        const openLogin2 =
            document.getElementById('openLogin2');


        if (openLogin2) {

            openLogin2.onclick = () => {

                showPanel('loginPage');

                pageMode('login');
            };
        }
    }
}