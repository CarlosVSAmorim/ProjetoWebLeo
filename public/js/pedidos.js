// ===== PEDIDOS =====

// Criar novo pedido
function adicionarPedido(e) {
    const mesaNumero = parseInt(document.getElementById('mesaPedido').value);
    const itemMenu = document.getElementById('itemMenu').value;
    const quantidade = parseInt(document.getElementById('quantidade').value);

    if (!mesaNumero || !itemMenu || !quantidade || quantidade <= 0) {
        alert('⚠️ Por favor, preencha todos os campos corretamente!');
        return;
    }

    const [nome, preco] = itemMenu.split('|');
    const precoFloat = parseFloat(preco);

    if (isNaN(precoFloat)) {
        alert('⚠️ Erro ao processar o preço do item!');
        return;
    }

    const total = precoFloat * quantidade;

    const pedido = {
        id: ++contadorPedidos,
        mesa: mesaNumero,
        item: nome,
        quantidade: quantidade,
        precoUnitario: precoFloat,
        total: total,
        data: new Date().toLocaleString('pt-BR')
    };

    pedidos.push(pedido);
    vendas += total;

    const mesa = mesas.find(m => m.numero === mesaNumero);
    if (mesa && mesa.status === 'livre') {
        mesa.status = 'ocupada';
    }

    renderizarPedidos();
    renderizarMesas();
    atualizarSelectMesas();
    atualizarRelatorios();
    salvarDadosLocalStorage();

    if (e && e.target && e.target.reset) {
        e.target.reset();
    }

    alert(`✓ Pedido adicionado à Mesa ${mesaNumero}!`);
}

// Renderizar lista de pedidos (agrupado por mesa)
function renderizarPedidos() {
    const container = document.getElementById('listaPedidos');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (pedidos.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">Nenhum pedido ativo</p>';
        return;
    }
    
    const pedidosPorMesa = {};
    pedidos.forEach(pedido => {
        if (!pedidosPorMesa[pedido.mesa]) {
            pedidosPorMesa[pedido.mesa] = [];
        }
        pedidosPorMesa[pedido.mesa].push(pedido);
    });
    
    Object.keys(pedidosPorMesa).sort((a, b) => a - b).forEach(numeroMesa => {
        const pedidosMesa = pedidosPorMesa[numeroMesa];
        const totalMesa = pedidosMesa.reduce((sum, p) => sum + p.total, 0);
        
        const mesaDiv = document.createElement('div');
        mesaDiv.className = 'pedidos-mesa-grupo';
        mesaDiv.innerHTML = `
            <div class="pedidos-mesa-header">
                <h4>Mesa ${numeroMesa} (${pedidosMesa.length} pedido(s))</h4>
                <span class="mesa-total-badge">R$ ${totalMesa.toFixed(2)}</span>
            </div>
            <div class="pedidos-mesa-itens">
                ${pedidosMesa.map(pedido => `
                    <div class="pedido-item">
                        <div>
                            <p><strong>Pedido #${pedido.id}:</strong> ${pedido.item}</p>
                            <p><strong>Quantidade:</strong> ${pedido.quantidade} x R$ ${pedido.precoUnitario.toFixed(2)}</p>
                            <p><strong>Total:</strong> R$ ${pedido.total.toFixed(2)}</p>
                            <p style="font-size: 12px; color: #999;">${pedido.data}</p>
                        </div>
                        <button class="btn btn-danger btn-sm" onclick="removerPedido(${pedido.id})">
                            🗑️ Remover
                        </button>
                    </div>
                `).join('')}
            </div>
            <button class="btn btn-primary" onclick="abrirDetalhesMesa(${numeroMesa})" style="margin-top: 10px;">
                📋 Ver Todos os Detalhes da Mesa
            </button>
        `;
        container.appendChild(mesaDiv);
    });
}

// Remover pedido (atalho para removerPedidoDaMesa)
function removerPedido(id) {
    removerPedidoDaMesa(id);
    renderizarPedidos();
}

// Remover pedido específico de uma mesa
function removerPedidoDaMesa(pedidoId) {
    if (!confirm('Deseja remover este pedido?')) return;
    
    const pedido = pedidos.find(p => p.id === pedidoId);
    if (!pedido) return;
    
    const numeroMesa = pedido.mesa;
    
    const index = pedidos.findIndex(p => p.id === pedidoId);
    if (index !== -1) {
        vendas -= pedidos[index].total;
        pedidos.splice(index, 1);
        
        const pedidosRestantes = getPedidosMesa(numeroMesa);
        if (pedidosRestantes.length === 0) {
            const mesa = mesas.find(m => m.numero === numeroMesa);
            if (mesa) {
                mesa.status = 'livre';
            }
        }
        
        renderizarPedidos();
        renderizarMesas();
        atualizarRelatorios();
        salvarDadosLocalStorage();
        abrirDetalhesMesa(numeroMesa);
    }
}
