// ===== FUNÇÕES DE RELATÓRIOS AVANÇADOS =====

// Função principal de atualização de relatórios (SUBSTITUI a simples)
function atualizarRelatorios() {
    const totalVendasEl = document.getElementById('totalVendas');
    const totalPedidosEl = document.getElementById('totalPedidos');
    const mesasOcupadasEl = document.getElementById('mesasOcupadas');
    const ticketMedioEl = document.getElementById('ticketMedio');
    
    if (totalVendasEl) totalVendasEl.textContent = vendas.toFixed(2);
    if (totalPedidosEl) totalPedidosEl.textContent = pedidos.length;
    
    const mesasOcupadas = mesas.filter(m => m.status === 'ocupada').length;
    if (mesasOcupadasEl) mesasOcupadasEl.textContent = mesasOcupadas;
    
    const ticketMedio = pedidos.length > 0 ? vendas / pedidos.length : 0;
    if (ticketMedioEl) ticketMedioEl.textContent = ticketMedio.toFixed(2);
    
    // Atualizar relatórios detalhados
    atualizarItensMaisVendidos();
    atualizarVendasPorCategoria();
    atualizarDesempenhoMesas();
    atualizarPedidosPorHorario();
    atualizarResumoFinanceiro();
}

// Itens Mais Vendidos
function atualizarItensMaisVendidos() {
    const ranking = {};
    pedidos.forEach(pedido => {
        if (ranking[pedido.item]) {
            ranking[pedido.item] += pedido.quantidade;
        } else {
            ranking[pedido.item] = pedido.quantidade;
        }
    });
    
    const rankingArray = Object.entries(ranking).sort((a, b) => b[1] - a[1]);
    const container = document.getElementById('itensMaisVendidos');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (rankingArray.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999;">Nenhum item vendido ainda</p>';
    } else {
        rankingArray.slice(0, 5).forEach(([item, qtd], index) => {
            const rankingDiv = document.createElement('div');
            rankingDiv.className = 'ranking-item';
            const medalhas = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
            rankingDiv.innerHTML = `
                <span class="nome">${medalhas[index]} ${item}</span>
                <span class="quantidade">${qtd} vendidos</span>
            `;
            container.appendChild(rankingDiv);
        });
    }
}

// Vendas por Categoria
function atualizarVendasPorCategoria() {
    const container = document.getElementById('vendasPorCategoria');
    if (!container) return;
    
    const vendasCategoria = {};
    const quantidadeCategoria = {};
    
    pedidos.forEach(pedido => {
        const itemCardapio = cardapio.find(c => c.nome === pedido.item);
        const categoria = itemCardapio ? itemCardapio.categoria : 'Outros';
        
        if (!vendasCategoria[categoria]) {
            vendasCategoria[categoria] = 0;
            quantidadeCategoria[categoria] = 0;
        }
        vendasCategoria[categoria] += pedido.total;
        quantidadeCategoria[categoria] += pedido.quantidade;
    });
    
    const categorias = Object.keys(vendasCategoria)
        .sort((a, b) => vendasCategoria[b] - vendasCategoria[a]);
    
    container.innerHTML = '';
    
    if (categorias.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999;">Nenhuma venda registrada</p>';
        return;
    }
    
    const iconesCategoria = {
        'Pizzas': '🍕',
        'Pratos Principais': '🍽️',
        'Massas': '🍝',
        'Saladas': '🥗',
        'Bebidas': '🥤',
        'Sobremesas': '🍰',
        'Outros': '📦'
    };
    
    categorias.forEach(categoria => {
        const catDiv = document.createElement('div');
        catDiv.className = 'categoria-item';
        catDiv.innerHTML = `
            <div class="categoria-info">
                <div class="categoria-icone">${iconesCategoria[categoria] || '📦'}</div>
                <div class="categoria-detalhes">
                    <div class="categoria-nome">${categoria}</div>
                    <div class="categoria-stats">${quantidadeCategoria[categoria]} itens vendidos</div>
                </div>
            </div>
            <div class="categoria-valor">R$ ${vendasCategoria[categoria].toFixed(2)}</div>
        `;
        container.appendChild(catDiv);
    });
}

// Desempenho das Mesas
function atualizarDesempenhoMesas() {
    const container = document.getElementById('desempenhoMesas');
    if (!container) return;
    
    const desempenhoMesas = {};
    
    mesas.forEach(mesa => {
        desempenhoMesas[mesa.numero] = {
            totalVendas: 0,
            quantidadePedidos: 0
        };
    });
    
    pedidos.forEach(pedido => {
        if (desempenhoMesas[pedido.mesa]) {
            desempenhoMesas[pedido.mesa].totalVendas += pedido.total;
            desempenhoMesas[pedido.mesa].quantidadePedidos++;
        }
    });
    
    const mesasArray = Object.entries(desempenhoMesas)
        .map(([numero, dados]) => ({
            numero: parseInt(numero),
            ...dados
        }))
        .sort((a, b) => b.totalVendas - a.totalVendas);
    
    container.innerHTML = '';
    
    const mesaMaisLucrativa = mesasArray[0];
    
    mesasArray.forEach((mesa, index) => {
        const mesaCard = document.createElement('div');
        mesaCard.className = 'mesa-desempenho-card';
        if (index === 0 && mesa.totalVendas > 0) {
            mesaCard.classList.add('destaque');
        }
        
        mesaCard.innerHTML = `
            <div class="mesa-numero">Mesa ${mesa.numero}</div>
            <div class="mesa-vendas">R$ ${mesa.totalVendas.toFixed(2)}</div>
            <div class="mesa-pedidos-count">${mesa.quantidadePedidos} pedido(s)</div>
        `;
        container.appendChild(mesaCard);
    });
}

// Pedidos por Horário
function atualizarPedidosPorHorario() {
    const container = document.getElementById('pedidosPorHorario');
    if (!container) return;
    
    const horarios = {
        'Manhã (06h-12h)': 0,
        'Tarde (12h-18h)': 0,
        'Noite (18h-00h)': 0,
        'Madrugada (00h-06h)': 0
    };
    
    pedidos.forEach(pedido => {
        const data = new Date(pedido.data.split(',')[0].split('/').reverse().join('-'));
        const hora = data.getHours();
        
        if (hora >= 6 && hora < 12) {
            horarios['Manhã (06h-12h)']++;
        } else if (hora >= 12 && hora < 18) {
            horarios['Tarde (12h-18h)']++;
        } else if (hora >= 18 || hora < 0) {
            horarios['Noite (18h-00h)']++;
        } else {
            horarios['Madrugada (00h-06h)']++;
        }
    });
    
    const maxPedidos = Math.max(...Object.values(horarios), 1);
    
    container.innerHTML = '';
    
    Object.entries(horarios).forEach(([periodo, quantidade]) => {
        const porcentagem = (quantidade / maxPedidos) * 100;
        
        const horarioDiv = document.createElement('div');
        horarioDiv.className = 'horario-item';
        horarioDiv.innerHTML = `
            <div class="horario-label">${periodo}</div>
            <div class="horario-bar-container">
                <div class="horario-bar" style="width: ${porcentagem}%">
                    ${quantidade > 0 ? quantidade : ''}
                </div>
            </div>
            <div class="horario-count">${quantidade} pedido(s)</div>
        `;
        container.appendChild(horarioDiv);
    });
}

// Resumo Financeiro Detalhado
function atualizarResumoFinanceiro() {
    // Total Bruto
    const totalBruto = document.getElementById('totalBruto');
    if (totalBruto) totalBruto.textContent = `R$ ${vendas.toFixed(2)}`;
    
    // Número de Transações
    const numTransacoes = document.getElementById('numTransacoes');
    if (numTransacoes) numTransacoes.textContent = pedidos.length;
    
    // Valor Médio por Mesa
    const mesasComVendas = new Set(pedidos.map(p => p.mesa));
    const mediaPorMesa = mesasComVendas.size > 0 ? vendas / mesasComVendas.size : 0;
    const mediaPorMesaEl = document.getElementById('mediaPorMesa');
    if (mediaPorMesaEl) mediaPorMesaEl.textContent = `R$ ${mediaPorMesa.toFixed(2)}`;
    
    // Item Mais Lucrativo
    const lucrosPorItem = {};
    pedidos.forEach(pedido => {
        if (!lucrosPorItem[pedido.item]) {
            lucrosPorItem[pedido.item] = 0;
        }
        lucrosPorItem[pedido.item] += pedido.total;
    });
    
    const itemMaisLucrativo = Object.entries(lucrosPorItem)
        .sort((a, b) => b[1] - a[1])[0];
    
    const itemLucrativoEl = document.getElementById('itemLucrativo');
    if (itemLucrativoEl) {
        itemLucrativoEl.textContent = itemMaisLucrativo 
            ? `${itemMaisLucrativo[0]} (R$ ${itemMaisLucrativo[1].toFixed(2)})`
            : '-';
    }
    
    // Categoria Mais Vendida
    const vendasCategoria = {};
    pedidos.forEach(pedido => {
        const itemCardapio = cardapio.find(c => c.nome === pedido.item);
        const categoria = itemCardapio ? itemCardapio.categoria : 'Outros';
        
        if (!vendasCategoria[categoria]) {
            vendasCategoria[categoria] = 0;
        }
        vendasCategoria[categoria] += pedido.quantidade;
    });
    
    const categoriaMaisVendida = Object.entries(vendasCategoria)
        .sort((a, b) => b[1] - a[1])[0];
    
    const categoriaMaisVendidaEl = document.getElementById('categoriaMaisVendida');
    if (categoriaMaisVendidaEl) {
        categoriaMaisVendidaEl.textContent = categoriaMaisVendida 
            ? `${categoriaMaisVendida[0]} (${categoriaMaisVendida[1]} itens)`
            : '-';
    }
    
    // Mesa Mais Lucrativa
    const vendasPorMesa = {};
    pedidos.forEach(pedido => {
        if (!vendasPorMesa[pedido.mesa]) {
            vendasPorMesa[pedido.mesa] = 0;
        }
        vendasPorMesa[pedido.mesa] += pedido.total;
    });
    
    const mesaMaisLucrativa = Object.entries(vendasPorMesa)
        .sort((a, b) => b[1] - a[1])[0];
    
    const mesaMaisLucrativaEl = document.getElementById('mesaMaisLucrativa');
    if (mesaMaisLucrativaEl) {
        mesaMaisLucrativaEl.textContent = mesaMaisLucrativa 
            ? `Mesa ${mesaMaisLucrativa[0]} (R$ ${mesaMaisLucrativa[1].toFixed(2)})`
            : '-';
    }
}

// Imprimir Relatório
function imprimirRelatorio() {
    window.print();
}

// Exportar Relatório para CSV
function exportarRelatorioCSV() {
    const user = getCurrentUser();
    const dataHora = new Date().toLocaleString('pt-BR').replace(/[/:]/g, '-');
    
    let csv = 'RELATÓRIO DE VENDAS\n';
    csv += `Gerado por: ${user ? user.name : 'Sistema'}\n`;
    csv += `Data/Hora: ${new Date().toLocaleString('pt-BR')}\n\n`;
    
    csv += 'RESUMO GERAL\n';
    csv += `Total de Vendas,R$ ${vendas.toFixed(2)}\n`;
    csv += `Total de Pedidos,${pedidos.length}\n`;
    csv += `Ticket Médio,R$ ${(pedidos.length > 0 ? vendas / pedidos.length : 0).toFixed(2)}\n\n`;
    
    csv += 'PEDIDOS DETALHADOS\n';
    csv += 'ID,Mesa,Item,Quantidade,Valor Unitário,Total,Data\n';
    pedidos.forEach(pedido => {
        csv += `${pedido.id},${pedido.mesa},"${pedido.item}",${pedido.quantidade},${pedido.precoUnitario.toFixed(2)},${pedido.total.toFixed(2)},"${pedido.data}"\n`;
    });
    
    csv += '\nVENDAS POR CATEGORIA\n';
    csv += 'Categoria,Quantidade,Valor Total\n';
    const vendasCategoria = {};
    const quantidadeCategoria = {};
    
    pedidos.forEach(pedido => {
        const itemCardapio = cardapio.find(c => c.nome === pedido.item);
        const categoria = itemCardapio ? itemCardapio.categoria : 'Outros';
        
        if (!vendasCategoria[categoria]) {
            vendasCategoria[categoria] = 0;
            quantidadeCategoria[categoria] = 0;
        }
        vendasCategoria[categoria] += pedido.total;
        quantidadeCategoria[categoria] += pedido.quantidade;
    });
    
    Object.keys(vendasCategoria).forEach(categoria => {
        csv += `"${categoria}",${quantidadeCategoria[categoria]},${vendasCategoria[categoria].toFixed(2)}\n`;
    });
    
    csv += '\nDESEMPENHO DAS MESAS\n';
    csv += 'Mesa,Total de Vendas,Quantidade de Pedidos\n';
    
    const desempenhoMesas = {};
    mesas.forEach(mesa => {
        desempenhoMesas[mesa.numero] = { totalVendas: 0, quantidadePedidos: 0 };
    });
    
    pedidos.forEach(pedido => {
        if (desempenhoMesas[pedido.mesa]) {
            desempenhoMesas[pedido.mesa].totalVendas += pedido.total;
            desempenhoMesas[pedido.mesa].quantidadePedidos++;
        }
    });
    
    Object.entries(desempenhoMesas)
        .sort((a, b) => b[1].totalVendas - a[1].totalVendas)
        .forEach(([mesa, dados]) => {
            csv += `${mesa},${dados.totalVendas.toFixed(2)},${dados.quantidadePedidos}\n`;
        });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio_vendas_${dataHora}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert('✓ Relatório exportado com sucesso!');
}

// Limpar Relatórios (resetar dados)
function limparRelatorios() {
    if (!confirm('⚠️ ATENÇÃO!\n\nEsta ação irá limpar TODOS os dados de vendas, pedidos e relatórios.\n\nDeseja continuar?')) {
        return;
    }
    
    if (!confirm('Tem certeza absoluta? Esta ação não pode ser desfeita!')) {
        return;
    }
    
    pedidos = [];
    vendas = 0;
    contadorPedidos = 0;
    
    mesas.forEach(mesa => {
        mesa.status = 'livre';
        mesa.pedidos = [];
    });
    
    renderizarPedidos();
    renderizarMesas();
    atualizarSelectMesas();
    atualizarRelatorios();
    salvarDadosLocalStorage();
    
    alert('✓ Todos os dados foram limpos com sucesso!');
}
