// js/storage.js
// ===== PERSISTÊNCIA EM LOCALSTORAGE =====

// Salvar no LocalStorage
function salvarDadosLocalStorage() {
    try {
        localStorage.setItem('mesas', JSON.stringify(mesas));
        localStorage.setItem('pedidos', JSON.stringify(pedidos));
        localStorage.setItem('cardapio', JSON.stringify(cardapio));
        localStorage.setItem('estoque', JSON.stringify(estoque));
        localStorage.setItem('garcons', JSON.stringify(garcons));
        localStorage.setItem('vendas', vendas);
        localStorage.setItem('contadorPedidos', contadorPedidos);
    } catch (error) {
        console.error('Erro ao salvar dados:', error);
    }
}

// Carregar do LocalStorage
function carregarDadosLocalStorage() {
    try {
        const mesasSalvas = localStorage.getItem('mesas');
        const pedidosSalvos = localStorage.getItem('pedidos');
        const cardapioSalvo = localStorage.getItem('cardapio');
        const estoqueSalvo = localStorage.getItem('estoque');
        const garconsSalvos = localStorage.getItem('garcons');
        const vendasSalvas = localStorage.getItem('vendas');
        const contadorSalvo = localStorage.getItem('contadorPedidos');

        if (mesasSalvas) mesas = JSON.parse(mesasSalvas);
        if (pedidosSalvos) pedidos = JSON.parse(pedidosSalvos);
        if (cardapioSalvo) cardapio = JSON.parse(cardapioSalvo);
        if (estoqueSalvo) estoque = JSON.parse(estoqueSalvo);
        if (garconsSalvos) {
            const parsedGarcons = JSON.parse(garconsSalvos);
            garcons = Array.isArray(parsedGarcons) ? parsedGarcons : [];
        } else {
            garcons = [];
        }


        if (vendasSalvas) vendas = parseFloat(vendasSalvas) || 0;
        if (contadorSalvo) contadorPedidos = parseInt(contadorSalvo) || 0;
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
    }
}
