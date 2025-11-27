// js/core.js
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

    // Event listeners de formulários
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


    const formCardapio = document.getElementById('formCardapio');
    if (formCardapio) formCardapio.addEventListener('submit', adicionarItemCardapio);

    const formEstoque = document.getElementById('formEstoque');
    if (formEstoque) formEstoque.addEventListener('submit', adicionarEstoque);

    const formGarcom = document.getElementById('formGarcom');
    if (formGarcom) {
        formGarcom.addEventListener('submit', function (e) {
            e.preventDefault();
            if (typeof adicionarGarcom === 'function') {
                adicionarGarcom(e);
            } else {
                console.error('Função adicionarGarcom não encontrada');
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
