// js/mesa.js
// ===== MESAS E MODAL DE MESA =====

// Inicializar Mesas
function inicializarMesas() {
    if (mesas.length === 0) {
        for (let i = 1; i <= 10; i++) {
            mesas.push({
                numero: i,
                status: 'livre',
                pedidos: []
            });
        }
        salvarDadosLocalStorage();
    }
}

// Obter pedidos de uma mesa específica
function getPedidosMesa(numeroMesa) {
    return pedidos.filter(p => p.mesa === numeroMesa);
}

// Calcular total de uma mesa
function calcularTotalMesa(numeroMesa) {
    const pedidosMesa = getPedidosMesa(numeroMesa);
    return pedidosMesa.reduce((total, pedido) => total + pedido.total, 0);
}

// Abrir modal com detalhes da mesa
function abrirDetalhesMesa(numeroMesa) {
    const mesa = mesas.find(m => m.numero === numeroMesa);
    if (!mesa) return;
    
    const pedidosMesa = getPedidosMesa(numeroMesa);
    const totalMesa = calcularTotalMesa(numeroMesa);
    
    // Criar modal se não existir
    let modal = document.getElementById('modalMesa');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modalMesa';
        modal.className = 'modal';
        document.body.appendChild(modal);
    }
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Mesa ${numeroMesa}</h2>
                <span class="modal-close" onclick="fecharModalMesa()">&times;</span>
            </div>
            <div class="modal-body">
                <div class="mesa-info">
                    <p><strong>Status:</strong> <span class="badge ${mesa.status}">${mesa.status === 'livre' ? 'Livre' : 'Ocupada'}</span></p>
                    <p><strong>Total de Pedidos:</strong> ${pedidosMesa.length}</p>
                    <p><strong>Valor Total:</strong> <span class="destaque-valor">R$ ${totalMesa.toFixed(2)}</span></p>
                </div>
                
                ${pedidosMesa.length > 0 ? `
                    <h3>Pedidos da Mesa</h3>
                    <div class="pedidos-mesa-lista">
                        ${pedidosMesa.map(pedido => `
                            <div class="pedido-mesa-item">
                                <div class="pedido-mesa-info">
                                    <h4>Pedido #${pedido.id}</h4>
                                    <p><strong>${pedido.item}</strong></p>
                                    <p>Quantidade: ${pedido.quantidade} x R$ ${pedido.precoUnitario.toFixed(2)}</p>
                                    <p>Subtotal: R$ ${pedido.total.toFixed(2)}</p>
                                    <p class="pedido-data">${pedido.data}</p>
                                </div>
                                <button class="btn btn-danger btn-sm" onclick="removerPedidoDaMesa(${pedido.id})">
                                    🗑️ Remover
                                </button>
                            </div>
                        `).join('')}
                    </div>
                ` : '<p class="texto-vazio">Nenhum pedido registrado para esta mesa.</p>'}
                
                <div class="modal-actions">
                    ${pedidosMesa.length > 0 ? `
                        <button class="btn btn-success" onclick="finalizarMesa(${numeroMesa})">
                            ✓ Finalizar Conta (R$ ${totalMesa.toFixed(2)})
                        </button>
                    ` : ''}
                    <button class="btn btn-primary" onclick="adicionarPedidoRapido(${numeroMesa})">
                        + Adicionar Pedido
                    </button>
                    ${mesa.status === 'ocupada' ? `
                        <button class="btn btn-warning" onclick="liberarMesa(${numeroMesa}); fecharModalMesa();">
                            Liberar Mesa
                        </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Fechar modal
function fecharModalMesa() {
    const modal = document.getElementById('modalMesa');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Finalizar conta da mesa
function finalizarMesa(numeroMesa) {
    const pedidosMesa = getPedidosMesa(numeroMesa);
    const totalMesa = calcularTotalMesa(numeroMesa);
    
    if (pedidosMesa.length === 0) {
        alert('Não há pedidos para finalizar nesta mesa.');
        return;
    }
    
    if (!confirm(`Finalizar conta da Mesa ${numeroMesa}?\n\nTotal: R$ ${totalMesa.toFixed(2)}\n\nEsta ação removerá todos os pedidos da mesa.`)) {
        return;
    }
    
    pedidosMesa.forEach(pedido => {
        const index = pedidos.findIndex(p => p.id === pedido.id);
        if (index !== -1) {
            pedidos.splice(index, 1);
        }
    });
    
    const mesa = mesas.find(m => m.numero === numeroMesa);
    if (mesa) {
        mesa.status = 'livre';
    }
    
    renderizarPedidos();
    renderizarMesas();
    atualizarRelatorios();
    salvarDadosLocalStorage();
    fecharModalMesa();
    
    alert(`✓ Conta finalizada!\nMesa ${numeroMesa}: R$ ${totalMesa.toFixed(2)}`);
}

// Adicionar pedido rápido (leva para aba de pedidos)
function adicionarPedidoRapido(numeroMesa) {
    fecharModalMesa();
    showSection('pedidos');
    
    const selectMesa = document.getElementById('mesaPedido');
    if (selectMesa) {
        selectMesa.value = numeroMesa;
        selectMesa.focus();
    }
    
    const formPedido = document.getElementById('formPedido');
    if (formPedido) {
        formPedido.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Renderizar Mesas
function renderizarMesas() {
    const container = document.getElementById('mesasGrid');
    if (!container) return;
    
    container.innerHTML = '';
    
    mesas.forEach(mesa => {
        const pedidosMesa = getPedidosMesa(mesa.numero);
        const totalMesa = calcularTotalMesa(mesa.numero);
        
        const mesaCard = document.createElement('div');
        mesaCard.className = `mesa-card ${mesa.status}`;
        mesaCard.innerHTML = `
            <h3>Mesa ${mesa.numero}</h3>
            <div class="mesa-icon">🪑</div>
            <span class="mesa-status ${mesa.status}">${mesa.status === 'livre' ? 'Livre' : 'Ocupada'}</span>
            ${pedidosMesa.length > 0 ? `
                <div class="mesa-resumo">
                    <p><strong>${pedidosMesa.length}</strong> pedido(s)</p>
                    <p class="mesa-total">R$ ${totalMesa.toFixed(2)}</p>
                </div>
            ` : ''}
            <div style="margin-top: 15px;">
                <button class="btn btn-primary btn-sm" onclick="abrirDetalhesMesa(${mesa.numero})">
                    📋 Ver Detalhes
                </button>
                ${mesa.status === 'livre' 
                    ? `<button class="btn btn-success btn-sm" onclick="ocuparMesa(${mesa.numero})">Ocupar</button>` 
                    : `<button class="btn btn-warning btn-sm" onclick="liberarMesa(${mesa.numero})">Liberar</button>`}
            </div>
        `;
        container.appendChild(mesaCard);
    });
    
    salvarDadosLocalStorage();
}

// Ocupar Mesa
function ocuparMesa(numero) {
    const mesa = mesas.find(m => m.numero === numero);
    if (mesa) {
        mesa.status = 'ocupada';
        renderizarMesas();
        atualizarRelatorios();
    }
}

// Liberar Mesa
function liberarMesa(numero) {
    const pedidosMesa = getPedidosMesa(numero);
    
    if (pedidosMesa.length > 0) {
        if (!confirm(`A Mesa ${numero} possui ${pedidosMesa.length} pedido(s).\n\nLiberar a mesa removerá todos os pedidos. Deseja continuar?`)) {
            return;
        }
        
        pedidosMesa.forEach(pedido => {
            const index = pedidos.findIndex(p => p.id === pedido.id);
            if (index !== -1) {
                vendas -= pedidos[index].total;
                pedidos.splice(index, 1);
            }
        });
    }
    
    const mesa = mesas.find(m => m.numero === numero);
    if (mesa) {
        mesa.status = 'livre';
        mesa.pedidos = [];
        renderizarMesas();
        renderizarPedidos();
        atualizarRelatorios();
    }
}
