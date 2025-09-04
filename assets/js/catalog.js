// ===== FUNCIONALIDADES ESPECÍFICAS DO CATÁLOGO =====
document.addEventListener('DOMContentLoaded', function() {
    
    let produtosFiltrados = [...produtos];
    let filtrosAtivos = {
        categoria: 'todos',
        preco: '',
        ordem: '',
        tamanho: '',
        busca: ''
    };

    // ===== ELEMENTOS DO DOM =====
    const produtosGrid = document.getElementById('produtosGrid');
    const resultCount = document.getElementById('resultCount');
    const loadingProducts = document.getElementById('loadingProducts');
    const noResults = document.getElementById('noResults');
    const searchInput = document.getElementById('searchInput');
    const filtroPreco = document.getElementById('filtroPreco');
    const filtroOrdem = document.getElementById('filtroOrdem');
    const filtroTamanho = document.getElementById('filtroTamanho');
    const limparFiltros = document.getElementById('limparFiltros');
    const limparFiltros2 = document.getElementById('limparFiltros2');

    // Se não houver grid de produtos, não é a página de catálogo
    if (!produtosGrid || !loadingProducts || !noResults) {
        return;
    }

    // ===== APLICAR FILTROS =====
    function aplicarTodosFiltros() {
        showLoading();
        
        setTimeout(() => {
            let resultado = [...produtos];

            // Filtro por categoria
            if (filtrosAtivos.categoria !== 'todos') {
                resultado = resultado.filter(produto => produto.categoria === filtrosAtivos.categoria);
            }

            // Filtro por busca
            if (filtrosAtivos.busca) {
                const termo = filtrosAtivos.busca.toLowerCase();
                resultado = resultado.filter(produto => 
                    produto.nome.toLowerCase().includes(termo) ||
                    produto.descricao.toLowerCase().includes(termo) ||
                    produto.categoria.toLowerCase().includes(termo)
                );
            }

            // Filtro por preço
            if (filtrosAtivos.preco) {
                const [min, max] = filtrosAtivos.preco.split('-').map(p => p === '+' ? Infinity : parseFloat(p));
                resultado = resultado.filter(produto => {
                    if (max === undefined) {
                        return produto.preco >= min;
                    }
                    return produto.preco >= min && produto.preco <= max;
                });
            }

            // Filtro por tamanho
            if (filtrosAtivos.tamanho) {
                resultado = resultado.filter(produto => 
                    produto.tamanhos && produto.tamanhos.includes(filtrosAtivos.tamanho)
                );
            }

            // Ordenação
            if (filtrosAtivos.ordem) {
                switch (filtrosAtivos.ordem) {
                    case 'nome-asc':
                        resultado.sort((a, b) => a.nome.localeCompare(b.nome));
                        break;
                    case 'nome-desc':
                        resultado.sort((a, b) => b.nome.localeCompare(a.nome));
                        break;
                    case 'preco-asc':
                        resultado.sort((a, b) => a.preco - b.preco);
                        break;
                    case 'preco-desc':
                        resultado.sort((a, b) => b.preco - a.preco);
                        break;
                    case 'rating-desc':
                        resultado.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                        break;
                }
            }

            produtosFiltrados = resultado;
            renderizarResultados();
            hideLoading();
        }, 300);
    }

    // ===== RENDERIZAR RESULTADOS =====
    function renderizarResultados() {
        if (!produtosGrid || !noResults) return;
        if (produtosFiltrados.length === 0) {
            produtosGrid.style.display = 'none';
            noResults.style.display = 'block';
            if (resultCount) resultCount.textContent = '';
        } else {
            produtosGrid.style.display = 'flex';
            noResults.style.display = 'none';
            if (typeof renderizarProdutos === 'function') {
                renderizarProdutos(produtosFiltrados, 'produtosGrid');
            }
            
            // Atualizar contador de resultados
            const total = produtosFiltrados.length;
            if (resultCount) {
                resultCount.textContent = `${total} produto${total !== 1 ? 's' : ''} encontrado${total !== 1 ? 's' : ''}`;
            }
        }
    }

    // ===== LOADING FUNCTIONS =====
    function showLoading() {
        if (loadingProducts) loadingProducts.style.display = 'block';
        if (produtosGrid) produtosGrid.style.display = 'none';
        if (noResults) noResults.style.display = 'none';
    }

    function hideLoading() {
        if (loadingProducts) loadingProducts.style.display = 'none';
    }

    // ===== EVENT LISTENERS =====

    // Filtros de categoria
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Atualizar botões ativos
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Aplicar filtro
            filtrosAtivos.categoria = this.dataset.categoria;
            atualizarBreadcrumb();
            aplicarTodosFiltros();
        });
    });

    // Busca
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                filtrosAtivos.busca = this.value.trim();
                aplicarTodosFiltros();
            }, 300);
        });
    }

    // Filtro de preço
    if (filtroPreco) {
        filtroPreco.addEventListener('change', function() {
            filtrosAtivos.preco = this.value;
            aplicarTodosFiltros();
        });
    }

    // Filtro de ordenação
    if (filtroOrdem) {
        filtroOrdem.addEventListener('change', function() {
            filtrosAtivos.ordem = this.value;
            aplicarTodosFiltros();
        });
    }

    // Filtro de tamanho
    if (filtroTamanho) {
        filtroTamanho.addEventListener('change', function() {
            filtrosAtivos.tamanho = this.value;
            aplicarTodosFiltros();
        });
    }

    // Limpar filtros
    function limparTodosFiltros() {
        filtrosAtivos = {
            categoria: 'todos',
            preco: '',
            ordem: '',
            tamanho: '',
            busca: ''
        };

        // Resetar interface
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        const btnTodos = document.querySelector('[data-categoria="todos"]');
        if (btnTodos) btnTodos.classList.add('active');
        
        if (searchInput) searchInput.value = '';
        if (filtroPreco) filtroPreco.value = '';
        if (filtroOrdem) filtroOrdem.value = '';
        if (filtroTamanho) filtroTamanho.value = '';

        atualizarBreadcrumb();
        aplicarTodosFiltros();
    }

    if (limparFiltros) {
        limparFiltros.addEventListener('click', limparTodosFiltros);
    }
    if (limparFiltros2) {
        limparFiltros2.addEventListener('click', limparTodosFiltros);
    }

    // ===== ATUALIZAR BREADCRUMB =====
    function atualizarBreadcrumb() {
        const breadcrumbCategory = document.getElementById('breadcrumbCategory');
        if (breadcrumbCategory) {
            if (filtrosAtivos.categoria === 'todos') {
                breadcrumbCategory.textContent = 'Catálogo';
            } else {
                const categorias = {
                    'feminino': 'Feminino',
                    'masculino': 'Masculino', 
                    'acessorios': 'Acessórios'
                };
                breadcrumbCategory.textContent = categorias[filtrosAtivos.categoria] || 'Catálogo';
            }
        }
    }

    // ===== INICIALIZAÇÃO COM URL PARAMS =====
    const urlParams = new URLSearchParams(window.location.search);
    const categoriaUrl = urlParams.get('categoria');
    
    if (categoriaUrl && ['feminino', 'masculino', 'acessorios'].includes(categoriaUrl)) {
        // Aguardar um pouco para garantir que os elementos estejam carregados
        setTimeout(() => {
            const botaoCategoria = document.querySelector(`[data-categoria="${categoriaUrl}"]`);
            if (botaoCategoria) {
                // Atualizar botões ativos
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                botaoCategoria.classList.add('active');
                
                // Aplicar filtro
                filtrosAtivos.categoria = categoriaUrl;
                atualizarBreadcrumb();
                aplicarTodosFiltros();
            }
        }, 100);
    } else {
        // Carregar todos os produtos inicialmente
        atualizarBreadcrumb();
        aplicarTodosFiltros();
    }

    // ===== ANIMAÇÕES AO CARREGAR PRODUTOS =====
    function animarProdutos() {
        const cards = document.querySelectorAll('.product-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.3s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 50);
        });
    }

    // Observar mudanças no grid para animar novos produtos
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                setTimeout(animarProdutos, 100);
            }
        });
    });

    if (produtosGrid) {
        observer.observe(produtosGrid, { childList: true });
    }

    // ===== LAZY LOADING PARA IMAGENS =====
    function setupLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.classList.add('fade-in');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        }
    }

    // Executar lazy loading após renderizar produtos
    const originalRenderizarProdutos = window.renderizarProdutos;
    window.renderizarProdutos = function(...args) {
        originalRenderizarProdutos.apply(this, args);
        setTimeout(setupLazyLoading, 100);
    };

    console.log('📦 Catálogo carregado com sucesso!');
});
