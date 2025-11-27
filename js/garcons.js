// js/garcons.js
// ===== GESTÃO DE GARÇONS (SIMPLES) =====

let garcons = [];

// ADICIONAR Garçom
function adicionarGarcom(e) {
    console.log('submit garcom');
    e.preventDefault();
    
    const nome = document.getElementById('nomeGarcom').value.trim();
    
    if (!nome) {
        alert('⚠️ Informe o nome do garçom!');
        return;
    }
    
    const novoGarcom = {
        id: Date.now(),
        nome: nome,
        totalVendas: 0,
        numeroPedidos: 0
    };
    
    garcons.push(novoGarcom);
    renderizarGarcons();
    atualizarSelectGarcons();
    salvarDadosLocalStorage();
    
    e.target.reset();
    alert(`✓ Garçom ${nome} cadastrado com sucesso!`);
}

// Renderizar lista de garçons
function renderizarGarcons() {
    const container = document.getElementById('listaGarcons');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (garcons.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">Nenhum garçom cadastrado</p>';
        return;
    }
    
    garcons.forEach(garcom => {
        const garcomDiv = document.createElement('div');
        garcomDiv.className = 'garcom-item';
        garcomDiv.innerHTML = `
            <div class="garcom-info">
                <div class="garcom-nome">${garcom.nome}</div>
                <div class="garcom-stats">
                    <span class="garcom-stat"><strong>${garcom.numeroPedidos || 0}</strong> pedidos</span>
                    <span class="garcom-stat"><strong>R$ ${(garcom.totalVendas || 0).toFixed(2)}</strong> em vendas</span>
                </div>
            </div>
            <div class="garcom-actions">
                <button class="btn btn-edit btn-sm" onclick="editarGarcom(${garcom.id})">
                    ✏️ Editar
                </button>
                <button class="btn btn-danger btn-sm" onclick="removerGarcom(${garcom.id})">
                    🗑️ Remover
                </button>
            </div>
        `;
        container.appendChild(garcomDiv);
    });
}

// Editar garçom (só nome)
function editarGarcom(id) {
    const garcom = garcons.find(g => g.id === id);
    if (!garcom) return;
    
    const novoNome = prompt('Nome do garçom:', garcom.nome);
    if (novoNome === null) return;
    
    if (novoNome.trim()) garcom.nome = novoNome.trim();
    
    renderizarGarcons();
    atualizarSelectGarcons();
    salvarDadosLocalStorage();
    alert('✓ Garçom atualizado com sucesso!');
}

// Remover garçom
function removerGarcom(id) {
    const garcom = garcons.find(g => g.id === id);
    if (!garcom) return;
    
    if (!confirm(`Remover o garçom ${garcom.nome}?`)) return;
    
    const index = garcons.findIndex(g => g.id === id);
    if (index !== -1) {
        garcons.splice(index, 1);
        renderizarGarcons();
        atualizarSelectGarcons();
        salvarDadosLocalStorage();
        alert('✓ Garçom removido!');
    }
}

// Atualizar select de garçons no formulário de pedidos
function atualizarSelectGarcons() {
    const formPedido = document.getElementById('formPedido');
    if (!formPedido) return;
    
    let selectGarcom = document.getElementById('garcomPedido');
    
    if (!selectGarcom) {
        const labelGarcom = document.createElement('label');
        labelGarcom.textContent = 'Garçom Responsável:';
        
        selectGarcom = document.createElement('select');
        selectGarcom.id = 'garcomPedido';
        selectGarcom.required = false;
        
        const submitBtn = formPedido.querySelector('button[type="submit"]');
        formPedido.insertBefore(labelGarcom, submitBtn);
        formPedido.insertBefore(selectGarcom, submitBtn);
    }
    
    selectGarcom.innerHTML = '<option value="">Selecione (opcional)</option>';
    
    garcons.forEach(garcom => {
        const option = document.createElement('option');
        option.value = garcom.id;
        option.textContent = garcom.nome;
        selectGarcom.appendChild(option);
    });
}
