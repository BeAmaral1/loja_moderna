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
    return `
        <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
            <div class="product-card">
                ${produto.badge ? `<div class="product-badge">${produto.badge}</div>` : ''}
                <div class="product-image">
                    <img src="${produto.imagem}" alt="${produto.nome}" loading="lazy">
                </div>
                <div class="product-info">
                    <div class="product-content">
                        <h3 class="product-title">${produto.nome}</h3>
                        <div class="product-price">
                            ${formatarPreco(produto.preco)}
                            ${produto.precoOriginal ? `<span class="product-price-original">${formatarPreco(produto.precoOriginal)}</span>` : ''}
                        </div>
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <div class="stars text-warning">
                                ${gerarEstrelas(produto.rating)}
                            </div>
                            <small class="text-muted">(${produto.reviews})</small>
                        </div>
                    </div>
                    <div class="product-actions">
                        <div class="d-grid gap-2">
                            <button class="btn-add-cart" onclick="adicionarAoCarrinho(${produto.id})">
                                <i class="fas fa-shopping-bag me-2"></i>Adicionar
                            </button>
                            <a href="produto.html?id=${produto.id}" class="btn btn-outline-primary btn-sm">
                                Ver Detalhes
                            </a>
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
