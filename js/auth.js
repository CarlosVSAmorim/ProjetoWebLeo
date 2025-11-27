// js/auth.js – frontend usando API de autenticação

// ========= FUNÇÕES BÁSICAS =========

async function handleLogin(e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');

    try {
        const res = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email: username, password })
        });

        if (!res.ok) {
            errorMessage.style.display = 'block';
            setTimeout(() => (errorMessage.style.display = 'none'), 3000);
            return;
        }

        const userData = await res.json(); // { id, name, email, role }
        sessionStorage.setItem('userSession', JSON.stringify(userData));
        window.location.href = 'index.html';
    } catch (err) {
        console.error(err);
        errorMessage.style.display = 'block';
        setTimeout(() => (errorMessage.style.display = 'none'), 3000);
    }
}

function isAuthenticated() {
    return sessionStorage.getItem('userSession') !== null;
}

function getCurrentUser() {
    const s = sessionStorage.getItem('userSession');
    return s ? JSON.parse(s) : null;
}

function logout() {
    fetch('http://localhost:3000/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
    }).finally(() => {
        sessionStorage.removeItem('userSession');
        window.location.href = 'login.html';
    });
}

function protectPage() {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
    }
}

// ========= INICIALIZAÇÃO =========

// liga eventos assim que o script for carregado
(function () {
    const path = window.location.pathname;

    if (path.includes('login.html')) {
        const form = document.getElementById('loginForm');
        if (form) {
            form.addEventListener('submit', handleLogin);
        }
    } else {
        // página interna
        setTimeout(initUserInfo, 100);

        const formUsuario = document.getElementById('formUsuario');
        if (formUsuario) {
            formUsuario.addEventListener('submit', handleCreateUser);
        }
    }
})();

// ========= UI DE USUÁRIO / ADMIN =========

function initUserInfo() {
    const user = getCurrentUser();
    if (!user) return;
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    if (!document.getElementById('userInfoContainer')) {
        const userInfo = document.createElement('div');
        userInfo.id = 'userInfoContainer';
        userInfo.className = 'user-info';
        userInfo.innerHTML = `
            <span class="user-name">👤 ${user.name} (${user.role})</span>
            <button onclick="logout()" class="btn-logout" id="logoutBtn">
                🚪 Sair
            </button>
        `;
        navbar.appendChild(userInfo);
    }
    initAdminSection();
}

// Mostrar/ocultar seção de usuários conforme role
function initAdminSection() {
    const user = getCurrentUser();
    const usuariosSection = document.getElementById('usuarios');
    const usuariosBtn = Array.from(document.querySelectorAll('.nav-btn'))
        .find(btn => (btn.getAttribute('onclick') || '').includes('usuarios'));

    if (!user || user.role !== 'admin') {
        if (usuariosSection) usuariosSection.style.display = 'none';
        if (usuariosBtn) usuariosBtn.style.display = 'none';
        return;
    }

    // admin
    if (usuariosSection) usuariosSection.style.display = '';
    if (usuariosBtn) usuariosBtn.style.display = '';

    carregarUsuarios();
}

// ========= CRUD DE USUÁRIOS (ADMIN) =========

async function handleCreateUser(e) {
    e.preventDefault();
    const nome = document.getElementById('nomeUsuario').value.trim();
    const email = document.getElementById('emailUsuario').value.trim();
    const senha = document.getElementById('senhaUsuario').value;
    const role = document.getElementById('roleUsuario').value;
    const msgEl = document.getElementById('usuarioMsg');

    msgEl.style.display = 'none';
    msgEl.textContent = '';

    if (!nome || !email || !senha) {
        msgEl.textContent = 'Preencha todos os campos.';
        msgEl.style.display = 'block';
        return;
    }

    try {
        const res = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ name: nome, email, password: senha, role })
        });

        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            msgEl.textContent = data.error || 'Erro ao criar usuário.';
            msgEl.style.display = 'block';
            return;
        }

        e.target.reset();
        msgEl.textContent = '✅ Usuário criado com sucesso.';
        msgEl.style.display = 'block';
        carregarUsuarios();
    } catch (err) {
        console.error(err);
        msgEl.textContent = 'Erro de comunicação com o servidor.';
        msgEl.style.display = 'block';
    }
}

async function carregarUsuarios() {
    const lista = document.getElementById('listaUsuarios');
    if (!lista) return;

    lista.innerHTML = '<p style="color:#999;">Carregando usuários...</p>';

    try {
        const res = await fetch('http://localhost:3000/api/auth/users', {
            method: 'GET',
            credentials: 'include'
        });

        if (res.status === 401 || res.status === 403) {
            lista.innerHTML = '<p style="color:#999;">Apenas administradores podem ver os usuários.</p>';
            return;
        }

        if (!res.ok) {
            lista.innerHTML = '<p style="color:#f00;">Erro ao carregar usuários.</p>';
            return;
        }

        const users = await res.json();

        if (!users.length) {
            lista.innerHTML = '<p style="color:#999;">Nenhum usuário cadastrado.</p>';
            return;
        }

        lista.innerHTML = '';
        users.forEach(u => {
            const div = document.createElement('div');
            div.className = 'usuario-item';
            div.innerHTML = `
                <div>
                    <strong>${u.name}</strong><br>
                    <span style="font-size: 13px; color:#666;">${u.email}</span><br>
                    <span style="font-size: 12px; color:#999;">Role: ${u.role}</span>
                </div>
            `;
            lista.appendChild(div);
        });
    } catch (err) {
        console.error(err);
        lista.innerHTML = '<p style="color:#f00;">Erro ao carregar usuários.</p>';
    }
}
