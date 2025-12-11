// ===== DADOS GLOBAIS E BOOTSTRAP =====

// Dados do sistema
let mesas = [];
let pedidos = [];
let cardapio = [];
let estoque = [];
let vendas = 0;
let contadorPedidos = 0;
let filtroAtual = 'todos';

// Inicializar sistema
document.addEventListener('DOMContentLoaded', function () {
    // Carregar do localStorage
    carregarDadosLocalStorage();

    // Inicializar estruturas básicas
    inicializarMesas();
    inicializarCardapioPadrao();

    // Atualizar selects
    atualizarSelectMesas();
    atualizarSelectCardapio();

    // Renderizar telas
    renderizarMesas();
    renderizarPedidos();
    renderizarCardapio();
    renderizarEstoque();
    renderizarGarcons();

    // Descobrir role do usuário logado (admin ou user)
    let role = 'user';
    const rawUser = localStorage.getItem('currentUser');
    if (rawUser) {
        try {
            const u = JSON.parse(rawUser);
            if (u && u.role) role = u.role;
        } catch (e) {
            console.error('Erro ao ler currentUser do localStorage:', e);
        }
    }

    // Se não for admin, esconder tudo que é de administração:
    if (role !== 'admin') {
        // botão e seção de usuários
        const btnUsuarios = document.querySelector('.nav-btn[onclick*="usuarios"]');
        if (btnUsuarios) btnUsuarios.style.display = 'none';
        const secUsuarios = document.getElementById('usuarios');
        if (secUsuarios) secUsuarios.style.display = 'none';

        // CARD "➕ Cadastrar Garçom" (primeiro glass-card dentro de #garcons)
        const cardsGarcons = document.querySelectorAll('#garcons .glass-card');
        if (cardsGarcons.length > 0) {
            cardsGarcons[0].style.display = 'none';
        }

        // CARD "Adicionar Item ao Cardápio" (primeiro glass-card dentro de #cardapio)
        const cardsCardapio = document.querySelectorAll('#cardapio .glass-card');
        if (cardsCardapio.length > 0) {
            cardsCardapio[0].style.display = 'none';
        }

        // CARD "Adicionar Item ao Estoque" (primeiro glass-card dentro de #estoque)
        const cardsEstoque = document.querySelectorAll('#estoque .glass-card');
        if (cardsEstoque.length > 0) {
            cardsEstoque[0].style.display = 'none';
        }

        // qualquer botão de edição/exclusão em listas (se existirem)
        document
            .querySelectorAll('.btn-editar, .btn-excluir, .btn-admin-only')
            .forEach(btn => btn.style.display = 'none');
    }

    // Event listeners de formulários (apenas o que for permitido):

    // Pedidos: tanto admin quanto user podem usar
    const formPedido = document.getElementById('formPedido');
    if (formPedido) {
        formPedido.addEventListener('submit', function (e) {
            e.preventDefault();
            if (typeof adicionarPedido === 'function') {
                adicionarPedido(e);
            } else {
                console.error('Função adicionarPedido não encontrada');
            }
        });
    }

    // Cardápio: só cria prato se for admin
    const formCardapio = document.getElementById('formCardapio');
    if (formCardapio && role === 'admin') {
        formCardapio.addEventListener('submit', adicionarItemCardapio);
    }

    // Estoque: só altera se for admin
    const formEstoque = document.getElementById('formEstoque');
    if (formEstoque && role === 'admin') {
        formEstoque.addEventListener('submit', adicionarEstoque);
    }

    // Garçom: só cadastra se for admin
    const formGarcom = document.getElementById('formGarcom');
    if (formGarcom && role === 'admin') {
        formGarcom.addEventListener('submit', function (e) {
            e.preventDefault();
            if (typeof adicionarGarcom === 'function') {
                adicionarGarcom(e);
            } else {
                console.error('Função adicionarGarcom não encontrada');
            }
        });
    }

    // Formulário de usuário (admin)
    const formUsuario = document.getElementById('formUsuario');
    if (formUsuario && role === 'admin') {
        formUsuario.addEventListener('submit', async function (e) {
            e.preventDefault();

            const msg = document.getElementById('usuarioMsg');
            if (msg) {
                msg.style.display = 'none';
                msg.style.color = 'red';
                msg.textContent = '';
            }

            const name = document.getElementById('nomeUsuario').value.trim();
            const email = document.getElementById('emailUsuario').value.trim();
            const password = document.getElementById('senhaUsuario').value;
            const roleUsuario = document.getElementById('roleUsuario').value;

            if (!name || !email || !password) {
                if (msg) {
                    msg.style.display = 'block';
                    msg.textContent = 'Preencha nome, email e senha.';
                }
                return;
            }

            try {
                const resp = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ name, email, password, role: roleUsuario })
                });

                const data = await resp.json();
                if (!resp.ok) {
                    if (msg) {
                        msg.style.display = 'block';
                        msg.textContent = data.error || 'Erro ao criar usuário';
                    }
                    console.error('Erro ao criar usuário:', resp.status, data);
                    return;
                }

                if (msg) {
                    msg.style.display = 'block';
                    msg.style.color = 'green';
                    msg.textContent = 'Usuário criado com sucesso!';
                }

                formUsuario.reset();
            } catch (err) {
                console.error('Falha na requisição de cadastro de usuário:', err);
                if (msg) {
                    msg.style.display = 'block';
                    msg.textContent = 'Falha na comunicação com o servidor';
                }
            }
        });
    }

    // Fechar modal ao clicar fora
    window.onclick = function (event) {
        const modal = document.getElementById('modalMesa');
        if (event.target === modal) {
            fecharModalMesa();
        }
    };
});
