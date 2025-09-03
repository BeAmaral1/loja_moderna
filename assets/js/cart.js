// ===== GERENCIAMENTO DO CARRINHO =====
class CarrinhoManager {
    constructor() {
        this.carrinho = this.carregarCarrinho();
        this.inicializar();
    }

    // Carregar carrinho do localStorage
    carregarCarrinho() {
        const carrinhoSalvo = localStorage.getItem('carrinho');
        return carrinhoSalvo ? JSON.parse(carrinhoSalvo) : [];
    }

    // Salvar carrinho no localStorage
    salvarCarrinho() {
        localStorage.setItem('carrinho', JSON.stringify(this.carrinho));
        this.atualizarInterface();
    }

    // Adicionar produto ao carrinho
    adicionarProduto(produtoId, quantidade = 1, tamanho = null, cor = null) {
        const produto = obterProdutoPorId(produtoId);
        if (!produto) return false;

        const itemExistente = this.carrinho.find(item => 
            item.id === produtoId && 
            item.tamanho === tamanho && 
            item.cor === cor
        );

        if (itemExistente) {
            itemExistente.quantidade += quantidade;
        } else {
            this.carrinho.push({
                id: produtoId,
                nome: produto.nome,
                preco: produto.preco,
                imagem: produto.imagem,
                quantidade: quantidade,
                tamanho: tamanho,
                cor: cor
            });
        }

        this.salvarCarrinho();
        this.mostrarNotificacao('Produto adicionado ao carrinho!');
        return true;
    }

    // Remover produto do carrinho
    removerProduto(produtoId, tamanho = null, cor = null) {
        console.log('Removendo produto:', produtoId, tamanho, cor);
        console.log('Carrinho antes:', this.carrinho);
        
        this.carrinho = this.carrinho.filter(item => {
            const match = item.id == produtoId && item.tamanho === tamanho && item.cor === cor;
            console.log('Item:', item, 'Match:', match);
            return !match;
        });
        
        console.log('Carrinho depois:', this.carrinho);
        this.salvarCarrinho();
        this.atualizarInterface();
        this.mostrarNotificacao('Produto removido do carrinho!');
    }

    // Atualizar quantidade
    atualizarQuantidade(produtoId, novaQuantidade, tamanho = null, cor = null) {
        console.log('Atualizando quantidade:', produtoId, novaQuantidade, tamanho, cor);
        
        const item = this.carrinho.find(item => 
            item.id == produtoId && 
            item.tamanho === tamanho && 
            item.cor === cor
        );

        console.log('Item encontrado:', item);

        if (item) {
            if (novaQuantidade <= 0) {
                this.removerProduto(produtoId, tamanho, cor);
            } else {
                item.quantidade = novaQuantidade;
                this.salvarCarrinho();
                this.atualizarInterface();
            }
        }
    }

    // Limpar carrinho
    limparCarrinho() {
        this.carrinho = [];
        this.salvarCarrinho();
    }

    // Obter total do carrinho
    obterTotal() {
        return this.carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
    }

    // Obter quantidade total de itens
    obterQuantidadeTotal() {
        return this.carrinho.reduce((total, item) => total + item.quantidade, 0);
    }

    // Atualizar interface
    atualizarInterface() {
        this.atualizarContador();
        this.renderizarCarrinho();
    }

    // Atualizar contador do carrinho
    atualizarContador() {
        const quantidade = this.obterQuantidadeTotal();
        
        // Atualizar todos os contadores
        const contadores = [
            'cartCount',
            'cartCountMobile'
        ];
        
        contadores.forEach(id => {
            const contador = document.getElementById(id);
            if (contador) {
                contador.textContent = quantidade;
                contador.style.display = quantidade > 0 ? 'flex' : 'none';
            }
        });
    }

    // Renderizar itens do carrinho
    renderizarCarrinho() {
        const container = document.getElementById('cartItems');
        if (!container) return;

        if (this.carrinho.length === 0) {
            container.innerHTML = `
                <div class="text-center py-4">
                    <i class="fas fa-shopping-bag fa-3x text-muted mb-3"></i>
                    <p class="text-muted">Seu carrinho está vazio</p>
                    <a href="catalogo.html" class="btn btn-primary">Continuar Comprando</a>
                </div>
            `;
        } else {
            container.innerHTML = this.carrinho.map(item => this.renderizarItemCarrinho(item)).join('');
        }

        // Atualizar total
        const totalElement = document.getElementById('cartTotal');
        if (totalElement) {
            totalElement.textContent = formatarPreco(this.obterTotal());
        }
    }

    // Renderizar item individual do carrinho
    renderizarItemCarrinho(item) {
        const subtotal = item.preco * item.quantidade;
        const tamanhoParam = item.tamanho ? `'${item.tamanho}'` : 'null';
        const corParam = item.cor ? `'${item.cor}'` : 'null';
        
        return `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.imagem}" alt="${item.nome}">
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.nome}</div>
                    ${item.tamanho ? `<small class="text-muted">Tamanho: ${item.tamanho}</small><br>` : ''}
                    ${item.cor ? `<small class="text-muted">Cor: ${item.cor}</small><br>` : ''}
                    <div class="cart-item-price">${formatarPreco(item.preco)} x ${item.quantidade}</div>
                    <div class="d-flex align-items-center gap-2 mt-2">
                        <button class="btn btn-sm btn-outline-secondary" onclick="carrinho.atualizarQuantidade(${item.id}, ${item.quantidade - 1}, ${tamanhoParam}, ${corParam})">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="fw-bold">${item.quantidade}</span>
                        <button class="btn btn-sm btn-outline-secondary" onclick="carrinho.atualizarQuantidade(${item.id}, ${item.quantidade + 1}, ${tamanhoParam}, ${corParam})">
                            <i class="fas fa-plus"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger ms-auto" onclick="carrinho.removerProduto(${item.id}, ${tamanhoParam}, ${corParam})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Mostrar/ocultar carrinho
    toggleCarrinho() {
        const sidebar = document.getElementById('cartSidebar');
        const overlay = document.getElementById('cartOverlay');
        
        if (sidebar && overlay) {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
            
            if (sidebar.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
        }
    }

    // Fechar carrinho
    fecharCarrinho() {
        const sidebar = document.getElementById('cartSidebar');
        const overlay = document.getElementById('cartOverlay');
        
        if (sidebar && overlay) {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    // Mostrar notificação
    mostrarNotificacao(mensagem, tipo = 'success') {
        // Criar elemento de notificação
        const notificacao = document.createElement('div');
        notificacao.className = `alert alert-${tipo} position-fixed`;
        notificacao.style.cssText = `
            top: 100px;
            right: 20px;
            z-index: 1060;
            min-width: 300px;
            animation: slideInRight 0.3s ease-out;
        `;
        notificacao.innerHTML = `
            <i class="fas fa-check-circle me-2"></i>
            ${mensagem}
        `;

        document.body.appendChild(notificacao);

        // Remover após 3 segundos
        setTimeout(() => {
            notificacao.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                document.body.removeChild(notificacao);
            }, 300);
        }, 3000);
    }

    // Inicializar eventos
    inicializar() {
        // Botões toggle do carrinho (desktop e mobile)
        const cartToggle = document.getElementById('cartToggle');
        const cartToggleMobile = document.getElementById('cartToggleMobile');
        
        if (cartToggle) {
            cartToggle.addEventListener('click', () => this.toggleCarrinho());
        }
        if (cartToggleMobile) {
            cartToggleMobile.addEventListener('click', () => this.toggleCarrinho());
        }

        // Botões de fechar carrinho
        const cartClose = document.getElementById('cartClose');
        const cartClose2 = document.getElementById('cartClose2');
        const cartOverlay = document.getElementById('cartOverlay');

        if (cartClose) {
            cartClose.addEventListener('click', () => this.fecharCarrinho());
        }
        if (cartClose2) {
            cartClose2.addEventListener('click', () => this.fecharCarrinho());
        }
        if (cartOverlay) {
            cartOverlay.addEventListener('click', () => this.fecharCarrinho());
        }

        // Botão de checkout
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                if (this.carrinho.length === 0) {
                    this.mostrarNotificacao('Seu carrinho está vazio!', 'warning');
                    return;
                }
                window.location.href = 'checkout.html';
            });
        }

        // Atualizar interface inicial
        this.atualizarInterface();
    }
}

// Instanciar gerenciador do carrinho
const carrinho = new CarrinhoManager();

// Função global para adicionar ao carrinho (compatibilidade)
function adicionarAoCarrinho(produtoId, quantidade = 1, tamanho = null, cor = null) {
    return carrinho.adicionarProduto(produtoId, quantidade, tamanho, cor);
}

// Adicionar estilos para animações
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
