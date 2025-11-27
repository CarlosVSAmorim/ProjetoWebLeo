// ===== CARDÁPIO =====

// Inicializar Cardápio Padrão
function inicializarCardapioPadrao() {
    if (cardapio.length === 0) {
        cardapio = [
            { id: 1, nome: 'Pizza Margherita', preco: 35.00, categoria: 'Pizzas', 'descricao': 'Molho de tomate, mussarela e manjericão' },
            { id: 2, nome: 'Hambúrguer Artesanal', preco: 28.00, categoria: 'Pratos Principais', descricao: 'Pão brioche, 180g de carne, queijo e molho especial' },
            { id: 3, nome: 'Spaghetti Carbonara', preco: 32.00, categoria: 'Massas', descricao: 'Massa fresca com bacon e molho carbonara' },
            { id: 4, nome: 'Salada Caesar', preco: 22.00, categoria: 'Saladas', descricao: 'Alface romana, croutons e molho caesar' },
            { id: 5, nome: 'Refrigerante', preco: 8.00, categoria: 'Bebidas', descricao: 'Lata 350ml' },
            { id: 6, nome: 'Suco Natural', preco: 12.00, categoria: 'Bebidas', descricao: 'Laranja, limão ou morango' }
        ];
        salvarDadosLocalStorage();
    }
}

// Adicionar Item ao Cardápio
function adicionarItemCardapio(e) {
    e.preventDefault();
    
    const nome = document.getElementById('nomePrato').value.trim();
    const preco = parseFloat(document.getElementById('precoPrato').value);
    const categoria = document.getElementById('categoriaPrato').value;
    const descricao = document.getElementById('descricaoPrato').value.trim();
    
    if (!nome || isNaN(preco) || preco <= 0) {
        alert('⚠️ Por favor, preencha todos os campos corretamente!');
        return;
    }
    
    const novoItem = {
        id: Date.now(),
        nome,
        preco,
        categoria,
        descricao
    };
    
    cardapio.push(novoItem);
    renderizarCardapio();
    atualizarSelectCardapio();
    salvarDadosLocalStorage();
    
    e.target.reset();
    alert('✓ Item adicionado ao cardápio com sucesso!');
}

// Renderizar Cardápio
function renderizarCardapio() {
    const container = document.getElementById('listaCardapio');
    if (!container) return;
    
    container.innerHTML = '';
    
    const itensFiltrados = filtroAtual === 'todos'
        ? cardapio
        : cardapio.filter(item => item.categoria === filtroAtual);
    
    if (itensFiltrados.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">Nenhum item no cardápio</p>';
        return;
    }
    
    itensFiltrados.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cardapio-item';
        itemDiv.innerHTML = `
            <div class="cardapio-info">
                <h4>${item.nome}</h4>
                <span class="categoria">${item.categoria}</span>
                ${item.descricao ? `<p class="descricao">${item.descricao}</p>` : ''}
                <p class="preco">R$ ${item.preco.toFixed(2)}</p>
            </div>
            <div class="cardapio-actions">
                <button class="btn btn-edit" onclick="editarItemCardapio(${item.id})">
                    ✏️ Editar
                </button>
                <button class="btn btn-danger" onclick="removerItemCardapio(${item.id})">
                    🗑️ Remover
                </button>
            </div>
        `;
        container.appendChild(itemDiv);
    });
}

// Filtrar Cardápio
function filtrarCardapio(categoria) {
    filtroAtual = categoria;
    
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    buttons.forEach(btn => {
        if (btn.getAttribute('onclick').includes(`'${categoria}'`)) {
            btn.classList.add('active');
        }
    });
    
    renderizarCardapio();
}

// Editar Item do Cardápio
function editarItemCardapio(id) {
    const item = cardapio.find(i => i.id === id);
    if (!item) return;
    
    const novoNome = prompt('Nome do prato:', item.nome);
    if (novoNome === null) return;
    
    const novoPreco = prompt('Preço (R$):', item.preco);
    if (novoPreco === null) return;
    
    const novaDescricao = prompt('Descrição:', item.descricao || '');
    if (novaDescricao === null) return;
    
    if (novoNome.trim()) item.nome = novoNome.trim();
    if (novoPreco && !isNaN(parseFloat(novoPreco))) item.preco = parseFloat(novoPreco);
    item.descricao = novaDescricao.trim();
    
    renderizarCardapio();
    atualizarSelectCardapio();
    salvarDadosLocalStorage();
    alert('✓ Item atualizado com sucesso!');
}

// Remover Item do Cardápio
function removerItemCardapio(id) {
    if (!confirm('Tem certeza que deseja remover este item do cardápio?')) return;
    
    const index = cardapio.findIndex(i => i.id === id);
    if (index !== -1) {
        cardapio.splice(index, 1);
        renderizarCardapio();
        atualizarSelectCardapio();
        salvarDadosLocalStorage();
        alert('✓ Item removido do cardápio!');
    }
}

// Atualizar select de mesas (já usado em core/mesas)
function atualizarSelectMesas() {
    const select = document.getElementById('mesaPedido');
    if (!select) return;
    
    select.innerHTML = '<option value="">Selecione</option>';
    
    mesas.forEach(mesa => {
        const option = document.createElement('option');
        option.value = mesa.numero;
        const pedidosMesa = getPedidosMesa(mesa.numero);
        option.textContent = `Mesa ${mesa.numero}${pedidosMesa.length > 0 ? ` (${pedidosMesa.length} pedidos)` : ''}`;
        select.appendChild(option);
    });
}

// Atualizar select de itens do cardápio
function atualizarSelectCardapio() {
    const select = document.getElementById('itemMenu');
    if (!select) return;
    
    select.innerHTML = '<option value="">Selecione</option>';
    
    cardapio.forEach(item => {
        const option = document.createElement('option');
        option.value = `${item.nome}|${item.preco}`;
        option.textContent = `${item.nome} - R$ ${item.preco.toFixed(2)}`;
        select.appendChild(option);
    });
}
