// ===== DADOS DOS PRODUTOS =====
const produtos = [
    {
        id: 1,
        nome: "Vestido Floral Elegante",
        categoria: "feminino",
        preco: 149.90,
        precoOriginal: 199.90,
        imagem: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        imagens: [
            "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
        ],
        descricao: "Vestido floral elegante perfeito para ocasiões especiais. Tecido leve e confortável com estampa exclusiva.",
        tamanhos: ["P", "M", "G", "GG"],
        cores: ["Azul", "Rosa"],
        badge: "Novidade",
        destaque: true,
        rating: 4.8,
        reviews: 24
    },
    {
        id: 2,
        nome: "Camisa Social Premium",
        categoria: "masculino",
        preco: 129.90,
        precoOriginal: 159.90,
        imagem: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        imagens: [
            "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
        ],
        descricao: "Camisa social de alta qualidade, ideal para o ambiente corporativo. Tecido premium com corte moderno.",
        tamanhos: ["P", "M", "G", "GG", "XG"],
        cores: ["Branco", "Azul"],
        badge: "Oferta",
        destaque: true,
        rating: 4.9,
        reviews: 31
    },
    {
        id: 3,
        nome: "Bolsa de Couro Artesanal",
        categoria: "acessorios",
        preco: 199.90,
        precoOriginal: 249.90,
        imagem: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        imagens: [
            "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
        ],
        descricao: "Bolsa de couro genuíno feita artesanalmente. Design atemporal com acabamento premium.",
        tamanhos: ["Único"],
        cores: ["Marrom", "Preto"],
        badge: "Mais Vendido",
        destaque: true,
        rating: 5.0,
        reviews: 18
    },
    {
        id: 4,
        nome: "Blusa de Tricô Confortável",
        categoria: "feminino",
        preco: 89.90,
        precoOriginal: 119.90,
        imagem: "https://images.unsplash.com/photo-1551232864-3f0890e580d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        imagens: [
            "https://images.unsplash.com/photo-1551232864-3f0890e580d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
        ],
        descricao: "Blusa de tricô super confortável para os dias mais frios. Material macio e quentinho.",
        tamanhos: ["P", "M", "G"],
        cores: ["Bege", "Cinza"],
        destaque: false,
        rating: 4.6,
        reviews: 12
    },
    {
        id: 5,
        nome: "Calça Jeans Premium",
        categoria: "masculino",
        preco: 159.90,
        precoOriginal: 189.90,
        imagem: "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        imagens: [
            "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
        ],
        descricao: "Calça jeans de corte moderno com lavagem especial. Conforto e estilo em uma peça única.",
        tamanhos: ["38", "40", "42", "44", "46"],
        cores: ["Azul Escuro", "Azul Claro"],
        badge: "Novidade",
        destaque: false,
        rating: 4.7,
        reviews: 28
    },
    {
        id: 6,
        nome: "Óculos de Sol Clássico",
        categoria: "acessorios",
        preco: 129.90,
        precoOriginal: 159.90,
        imagem: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        imagens: [
            "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
        ],
        descricao: "Óculos de sol com design clássico e proteção UV400. Armação resistente e lentes de qualidade.",
        tamanhos: ["Único"],
        cores: ["Preto", "Marrom"],
        destaque: false,
        rating: 4.5,
        reviews: 15
    },
    {
        id: 7,
        nome: "Saia Midi Elegante",
        categoria: "feminino",
        preco: 119.90,
        precoOriginal: 149.90,
        imagem: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        imagens: [
            "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            "https://images.unsplash.com/photo-1583496661160-fb5886a13d27?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
        ],
        descricao: "Saia midi com corte elegante, perfeita para looks sofisticados. Tecido fluido e confortável.",
        tamanhos: ["P", "M", "G", "GG"],
        cores: ["Preto", "Azul Marinho"],
        destaque: false,
        rating: 4.4,
        reviews: 9
    },
    {
        id: 8,
        nome: "Blazer Masculino Slim",
        categoria: "masculino",
        preco: 249.90,
        precoOriginal: 299.90,
        imagem: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        imagens: [
            "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
        ],
        descricao: "Blazer slim fit de alta qualidade. Corte moderno e tecido premium para ocasiões especiais.",
        tamanhos: ["P", "M", "G", "GG", "XG"],
        cores: ["Azul Marinho", "Cinza"],
        badge: "Premium",
        destaque: false,
        rating: 4.9,
        reviews: 22
    }
];

// ===== FUNÇÕES UTILITÁRIAS =====
function formatarPreco(preco) {
    return `R$ ${preco.toFixed(2).replace('.', ',')}`;
}

function gerarEstrelas(rating) {
    const estrelasCompletas = Math.floor(rating);
    const temMeiaEstrela = rating % 1 !== 0;
    let html = '';
    
    for (let i = 0; i < estrelasCompletas; i++) {
        html += '<i class="fas fa-star"></i>';
    }
    
    if (temMeiaEstrela) {
        html += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const estrelasVazias = 5 - Math.ceil(rating);
    for (let i = 0; i < estrelasVazias; i++) {
        html += '<i class="far fa-star"></i>';
    }
    
    return html;
}

// ===== RENDERIZAÇÃO DE PRODUTOS =====
function renderizarProduto(produto) {
    const desconto = produto.precoOriginal ? Math.round(((produto.precoOriginal - produto.preco) / produto.precoOriginal) * 100) : 0;
    
    return `
        <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
            <div class="product-card enhanced-card" data-product-id="${produto.id}">
                ${produto.badge ? `<div class="product-badge">${produto.badge}</div>` : ''}
                ${desconto > 0 ? `<div class="discount-badge">-${desconto}%</div>` : ''}
                
                <div class="product-image-container">
                    <div class="product-image">
                        <img src="${produto.imagem}" alt="${produto.nome}" loading="lazy" class="main-image">
                        ${produto.imagens && produto.imagens.length > 1 ? `<img src="${produto.imagens[1]}" alt="${produto.nome}" loading="lazy" class="hover-image">` : ''}
                    </div>
                    <div class="product-overlay">
                        <div class="overlay-actions">
                            <button class="overlay-btn" onclick="visualizarRapido(${produto.id})" title="Visualização Rápida">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="overlay-btn" onclick="adicionarFavoritos(${produto.id})" title="Adicionar aos Favoritos">
                                <i class="far fa-heart"></i>
                            </button>
                            <button class="overlay-btn" onclick="compartilhar(${produto.id})" title="Compartilhar">
                                <i class="fas fa-share-alt"></i>
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="product-info">
                    <div class="product-content">
                        <div class="product-category">${produto.categoria.toUpperCase()}</div>
                        <h3 class="product-title">${produto.nome}</h3>
                        <p class="product-description">${produto.descricao.substring(0, 80)}...</p>
                        
                        <div class="product-features">
                            <div class="feature-item">
                                <i class="fas fa-palette"></i>
                                <span>${produto.cores.length} cores</span>
                            </div>
                            <div class="feature-item">
                                <i class="fas fa-ruler"></i>
                                <span>${produto.tamanhos.length} tamanhos</span>
                            </div>
                        </div>
                        
                        <div class="product-rating">
                            <div class="stars text-warning">
                                ${gerarEstrelas(produto.rating)}
                            </div>
                            <span class="rating-text">${produto.rating} (${produto.reviews} avaliações)</span>
                        </div>
                        
                        <div class="product-price">
                            <span class="current-price">${formatarPreco(produto.preco)}</span>
                            ${produto.precoOriginal ? `<span class="original-price">${formatarPreco(produto.precoOriginal)}</span>` : ''}
                        </div>
                    </div>
                    
                    <div class="product-actions">
                        <div class="size-selector mb-2">
                            <select class="form-select form-select-sm" id="size-${produto.id}">
                                <option value="">Selecione o tamanho</option>
                                ${produto.tamanhos.map(tamanho => `<option value="${tamanho}">${tamanho}</option>`).join('')}
                            </select>
                        </div>
                        
                        <div class="d-grid gap-2">
                            <button class="btn-add-cart enhanced" onclick="adicionarAoCarrinhoComTamanho(${produto.id})">
                                <i class="fas fa-shopping-bag me-2"></i>Adicionar ao Carrinho
                            </button>
                            <div class="d-flex gap-2">
                                <button class="btn btn-outline-primary btn-sm flex-fill" onclick="verDetalhes(${produto.id})">
                                    <i class="fas fa-info-circle me-1"></i>Ver Detalhes
                                </button>
                                <button class="btn btn-outline-success btn-sm" onclick="comprarAgora(${produto.id})">
                                    <i class="fas fa-bolt"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderizarProdutos(produtosFiltrados = produtos, containerId = 'produtosGrid') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = produtosFiltrados.map(produto => renderizarProduto(produto)).join('');
}

function renderizarProdutosDestaque() {
    const produtosDestaque = produtos.filter(produto => produto.destaque);
    renderizarProdutos(produtosDestaque, 'produtosDestaque');
}

// ===== FILTROS =====
function filtrarProdutos(categoria) {
    if (categoria === 'todos') {
        return produtos;
    }
    return produtos.filter(produto => produto.categoria === categoria);
}

function aplicarFiltro(categoria) {
    const produtosFiltrados = filtrarProdutos(categoria);
    renderizarProdutos(produtosFiltrados);
    
    // Atualizar botões ativos
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-categoria="${categoria}"]`).classList.add('active');
}

// ===== BUSCA =====
function buscarProdutos(termo) {
    const termoLower = termo.toLowerCase();
    return produtos.filter(produto => 
        produto.nome.toLowerCase().includes(termoLower) ||
        produto.descricao.toLowerCase().includes(termoLower) ||
        produto.categoria.toLowerCase().includes(termoLower)
    );
}

// ===== OBTER PRODUTO POR ID =====
function obterProdutoPorId(id) {
    return produtos.find(produto => produto.id === parseInt(id));
}

// ===== FUNCIONALIDADES AVANÇADAS DOS CARDS =====
function visualizarRapido(produtoId) {
    const produto = obterProdutoPorId(produtoId);
    if (!produto) return;
    
    showLoading('Carregando visualização...');
    
    setTimeout(() => {
        hideLoading();
        const modal = criarModalVisualizacao(produto);
        document.body.appendChild(modal);
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
        
        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });
    }, 800);
}

function criarModalVisualizacao(produto) {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Visualização Rápida</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="product-gallery">
                                <img src="${produto.imagem}" alt="${produto.nome}" class="img-fluid rounded">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <h4>${produto.nome}</h4>
                            <p class="text-muted">${produto.descricao}</p>
                            <div class="mb-3">
                                <div class="stars text-warning mb-2">
                                    ${gerarEstrelas(produto.rating)}
                                </div>
                                <span class="text-muted">${produto.rating} (${produto.reviews} avaliações)</span>
                            </div>
                            <div class="mb-3">
                                <h5 class="text-primary">${formatarPreco(produto.preco)}</h5>
                                ${produto.precoOriginal ? `<small class="text-muted text-decoration-line-through">${formatarPreco(produto.precoOriginal)}</small>` : ''}
                            </div>
                            <div class="mb-3">
                                <strong>Tamanhos disponíveis:</strong><br>
                                ${produto.tamanhos.map(t => `<span class="badge bg-light text-dark me-1">${t}</span>`).join('')}
                            </div>
                            <div class="mb-3">
                                <strong>Cores disponíveis:</strong><br>
                                ${produto.cores.map(c => `<span class="badge bg-secondary me-1">${c}</span>`).join('')}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Fechar</button>
                    <button type="button" class="btn btn-primary" onclick="adicionarAoCarrinho(${produto.id}); bootstrap.Modal.getInstance(this.closest('.modal')).hide();">
                        <i class="fas fa-shopping-bag me-2"></i>Adicionar ao Carrinho
                    </button>
                </div>
            </div>
        </div>
    `;
    return modal;
}

function adicionarFavoritos(produtoId) {
    showLoading('Adicionando aos favoritos...');
    setTimeout(() => {
        hideLoading();
        // Simulação - em produção seria salvo no localStorage ou backend
        alert('Produto adicionado aos favoritos! (Funcionalidade de teste)');
    }, 500);
}

function compartilhar(produtoId) {
    const produto = obterProdutoPorId(produtoId);
    if (navigator.share) {
        navigator.share({
            title: produto.nome,
            text: produto.descricao,
            url: `${window.location.origin}/produto.html?id=${produtoId}`
        });
    } else {
        // Fallback para navegadores sem suporte
        const url = `${window.location.origin}/produto.html?id=${produtoId}`;
        navigator.clipboard.writeText(url).then(() => {
            alert('Link copiado para a área de transferência!');
        });
    }
}

function adicionarAoCarrinhoComTamanho(produtoId) {
    const sizeSelect = document.getElementById(`size-${produtoId}`);
    if (!sizeSelect.value) {
        alert('Por favor, selecione um tamanho antes de adicionar ao carrinho.');
        sizeSelect.focus();
        return;
    }
    
    showLoading('Adicionando ao carrinho...');
    setTimeout(() => {
        hideLoading();
        adicionarAoCarrinho(produtoId, sizeSelect.value);
    }, 600);
}

function verDetalhes(produtoId) {
    showLoading('Carregando detalhes...');
    setTimeout(() => {
        hideLoading();
        // Em um ambiente real, redirecionaria para a página de detalhes
        alert(`Redirecionando para detalhes do produto ${produtoId}... (Funcionalidade de teste)`);
    }, 800);
}

function comprarAgora(produtoId) {
    showLoading('Processando compra rápida...');
    setTimeout(() => {
        hideLoading();
        alert(`Compra rápida do produto ${produtoId}! (Funcionalidade de teste)`);
    }, 1000);
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    // Renderizar produtos em destaque na homepage
    if (document.getElementById('produtosDestaque')) {
        renderizarProdutosDestaque();
    }
    
    // Renderizar todos os produtos na página de catálogo
    if (document.getElementById('produtosGrid')) {
        renderizarProdutos();
    }
    
    // Configurar filtros
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const categoria = this.dataset.categoria;
            aplicarFiltro(categoria);
        });
    });
    
    // Configurar busca
    const campoBusca = document.getElementById('campoBusca');
    if (campoBusca) {
        campoBusca.addEventListener('input', function() {
            const termo = this.value;
            if (termo.length >= 2) {
                const resultados = buscarProdutos(termo);
                renderizarProdutos(resultados);
            } else if (termo.length === 0) {
                renderizarProdutos();
            }
        });
    }
});
