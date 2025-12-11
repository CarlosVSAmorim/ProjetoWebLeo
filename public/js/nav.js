// Navegação entre seções
function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    const buttons = document.querySelectorAll('.nav-btn');
    
    // Esconde todas as seções
    sections.forEach(section => section.classList.remove('active'));
    // Remove estado ativo dos botões
    buttons.forEach(button => button.classList.remove('active'));
    
    // Mostra a seção escolhida
    const target = document.getElementById(sectionId);
    if (target) {
        target.classList.add('active');
    }
    
    // Marca o botão correspondente como ativo
    buttons.forEach(button => {
        const onClick = button.getAttribute('onclick') || '';
        if (onClick.includes(`'${sectionId}'`) || onClick.includes(`("${sectionId}")`)) {
            button.classList.add('active');
        }
    });
}
