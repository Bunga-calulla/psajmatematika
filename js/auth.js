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
    const passwordInput = document.getElementById('pageAuthPassword');
    const error = document.getElementById('pageAuthError');

    if (!title || !subtitle || !submit) return;

    title.textContent =
        m === 'login'
            ? 'Selamat datang 👋'
            : 'Buat akun baru ✨';

    subtitle.textContent =
        m === 'login'
            ? 'Masuk menggunakan email dan password yang sudah didaftarkan.'
            : 'Daftarkan email dan password untuk membuat akun baru.';

    submit.textContent =
        m === 'login'
            ? 'Masuk ke Akun'
            : 'Daftar Akun';

    if (loginTab) {
        loginTab.classList.toggle('active', m === 'login');
    }

    if (registerTab) {
        registerTab.classList.toggle('active', m === 'register');
    }

    if (passwordInput) {
        passwordInput.autocomplete =
            m === 'login' ? 'current-password' : 'new-password';
    }

    if (error) {
        error.textContent = '';
        error.style.color = '';
    }
}


    // =========================
    // TOMBOL NAVBAR MASUK / DAFTAR
    // =========================
    const openLogin = document.getElementById('openLogin');

    if (openLogin) {
        openLogin.onclick = () => {
            pageMode('login');
            showPanel('loginPage');
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
    // FORM LOGIN / DAFTAR
    // =========================
   const pageAuthForm = document.getElementById('pageAuthForm');

   if (pageAuthForm) {
    pageAuthForm.onsubmit = doPageAuth;
}

// Tampilkan halaman berdasarkan status login.
const currentUser = localStorage.getItem('mdny_current_user');

if (currentUser) {

    // Muat progres sesuai akun yang masih login.
    if (window.Progress) {
        window.Progress.loadForUser(currentUser);
    }

    showPanel('home');

} else {

    // Tidak ada akun login, gunakan progres kosong.
    if (window.Progress) {
        window.Progress.loadForUser(null);
    }

    showPanel('loginPage');
    pageMode('login');
}


    // =========================
    // UPDATE TAMPILAN NAVBAR
    // =========================
    updateAuthArea();
});


// =========================
// LOGIN / DAFTAR DUMMY
// =========================
// =========================
// MENGAMBIL DATA AKUN
// =========================

function getRegisteredUsers() {
    try {
        return JSON.parse(localStorage.getItem('mdny_users')) || [];
    } catch (error) {
        return [];
    }
}


// =========================
// HASH PASSWORD
// =========================

async function hashPassword(password, salt) {
    if (!window.crypto || !window.crypto.subtle) {
        throw new Error(
            'Browser tidak mendukung keamanan password. Gunakan Live Server.'
        );
    }

    const data = new TextEncoder().encode(salt + password);

    const hash = await crypto.subtle.digest('SHA-256', data);

    return Array.from(new Uint8Array(hash))
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');
}


// =========================
// PROSES LOGIN / DAFTAR
// =========================

async function doPageAuth(e) {
    e.preventDefault();

    const email = document
        .getElementById('pageAuthEmail')
        .value
        .trim()
        .toLowerCase();

    const password = document
        .getElementById('pageAuthPassword')
        .value;

    const error = document.getElementById('pageAuthError');

    error.textContent = '';
    error.style.color = '';

    if (!email || !password) {
        error.textContent = 'Email dan password wajib diisi.';
        return;
    }

    if (password.length < 6) {
        error.textContent = 'Password minimal 6 karakter.';
        return;
    }

    const users = getRegisteredUsers();

    try {

        // =========================
        // MODE DAFTAR
        // =========================

        if (authMode === 'register') {

            const existingUser = users.find(
                user => user.email === email
            );

            if (existingUser) {
                error.textContent =
                    'Email sudah terdaftar. Silakan masuk.';
                return;
            }

            const saltArray = crypto.getRandomValues(
                new Uint8Array(16)
            );

            const salt = Array.from(saltArray)
                .map(byte => byte.toString(16).padStart(2, '0'))
                .join('');

            const passwordHash = await hashPassword(password, salt);

            users.push({
                email: email,
                salt: salt,
                passwordHash: passwordHash
            });

            localStorage.setItem(
                'mdny_users',
                JSON.stringify(users)
            );

            document.getElementById('pageAuthPassword').value = '';

            pageMode('login');

            error.style.color = 'green';
            error.textContent =
                'Pendaftaran berhasil! Silakan login menggunakan akun kamu.';

            return;
        }


        // =========================
        // MODE LOGIN
        // =========================

        const registeredUser = users.find(
            user => user.email === email
        );

        if (!registeredUser) {
            error.textContent =
                'Email belum terdaftar. Silakan daftar terlebih dahulu.';
            return;
        }

        const enteredPasswordHash = await hashPassword(
            password,
            registeredUser.salt
        );

        if (enteredPasswordHash !== registeredUser.passwordHash) {
            error.textContent =
                'Password salah. Silakan periksa kembali.';
            return;
        }

       // Login berhasil
localStorage.setItem(
    'mdny_current_user',
    registeredUser.email
);

// Muat progres khusus akun yang berhasil login.
if (window.Progress) {
    window.Progress.loadForUser(registeredUser.email);
}

document.getElementById('pageAuthPassword').value = '';

updateAuthArea();

showPanel('home');

    } catch (err) {
        error.textContent =
            err.message || 'Terjadi kesalahan. Silakan coba kembali.';
    }
}


// =========================
// UPDATE NAVBAR AKUN
// =========================
// =========================
// UPDATE NAVBAR AKUN
// =========================

function updateAuthArea() {

    const authArea = document.getElementById('authArea');

    if (!authArea) return;

    const username = localStorage.getItem('mdny_current_user');

    authArea.innerHTML = '';

    if (username) {

        const userMenu = document.createElement('div');
        userMenu.className = 'user-menu';

        const avatar = document.createElement('span');
        avatar.className = 'avatar';
        avatar.textContent = username.charAt(0).toUpperCase();

        const userText = document.createElement('span');
        userText.textContent = username;

        const logoutBtn = document.createElement('button');
        logoutBtn.className = 'logout-btn';
        logoutBtn.id = 'logoutBtn';
        logoutBtn.type = 'button';
        logoutBtn.textContent = 'Keluar';

        logoutBtn.onclick = () => {

    // Hapus status akun yang sedang login.
    localStorage.removeItem('mdny_current_user');

    // Kosongkan progres dari tampilan akun sebelumnya.
    if (window.Progress) {
        window.Progress.loadForUser(null);
    }

    updateAuthArea();

    showPanel('loginPage');

    pageMode('login');
};

        userMenu.append(avatar, userText, logoutBtn);

        authArea.appendChild(userMenu);

    } else {

        const loginBtn = document.createElement('button');

        loginBtn.className = 'pill-btn';
        loginBtn.id = 'openLogin2';
        loginBtn.type = 'button';
        loginBtn.textContent = 'Masuk / Daftar';

        loginBtn.onclick = () => {

            showPanel('loginPage');

            pageMode('login');
        };

        authArea.appendChild(loginBtn);
    }
}