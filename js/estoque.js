// ===== ESTOQUE =====

// Adicionar item ao estoque
function adicionarEstoque(e) {
    e.preventDefault();
    
    const nome = document.getElementById('nomeProduto').value.trim();
    const quantidade = parseFloat(document.getElementById('qtdProduto').value);
    const unidade = document.getElementById('unidadeProduto').value;
    
    if (!nome || isNaN(quantidade) || quantidade < 0) {
        alert('⚠️ Por favor, preencha todos os campos corretamente!');
        return;
    }
    
    const produto = {
        id: Date.now(),
        nome,
        quantidade,
        unidade
    };
    
    estoque.push(produto);
    renderizarEstoque();
    salvarDadosLocalStorage();
    
    e.target.reset();
    alert('✓ Produto adicionado ao estoque!');
}

// Renderizar estoque
function renderizarEstoque() {
    const container = document.getElementById('listaEstoque');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (estoque.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">Nenhum item no estoque</p>';
        return;
    }
    
    estoque.forEach(produto => {
        const produtoDiv = document.createElement('div');
        const classe = produto.quantidade < 10 ? 'baixo' : 'normal';
        produtoDiv.className = `estoque-item ${classe}`;
        produtoDiv.innerHTML = `
            <div>
                <strong>${produto.nome}</strong><br>
                <span style="color: #666; font-size: 14px;">${produto.quantidade} ${produto.unidade}</span>
                ${produto.quantidade < 10 ? '<br><span style="color: #ef4444; font-size: 12px;">⚠️ Estoque baixo</span>' : ''}
            </div>
            <button class="btn btn-danger" onclick="removerEstoque(${produto.id})">
                🗑️ Remover
            </button>
        `;
        container.appendChild(produtoDiv);
    });
}

// Remover item do estoque
function removerEstoque(id) {
    if (!confirm('Tem certeza que deseja remover este item do estoque?')) return;
    
    const index = estoque.findIndex(p => p.id === id);
    if (index !== -1) {
        estoque.splice(index, 1);
        renderizarEstoque();
        salvarDadosLocalStorage();
    }
}
