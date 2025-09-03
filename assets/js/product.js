// ===== PÁGINA DE PRODUTO =====
document.addEventListener('DOMContentLoaded', function() {
    
    let produtoAtual = null;
    let tamanhoSelecionado = null;
    let corSelecionada = null;

    // ===== ELEMENTOS DO DOM =====
    const mainImage = document.getElementById('mainImage');
    const thumbnails = document.getElementById('thumbnails');
    const productName = document.getElementById('productName');
    const productPrice = document.getElementById('productPrice');
    const productOriginalPrice = document.getElementById('productOriginalPrice');
    const productDescription = document.getElementById('productDescription');
    const productStars = document.getElementById('productStars');
    const productReviews = document.getElementById('productReviews');
    const productBadge = document.getElementById('productBadge');
    const breadcrumbCategory = document.getElementById('breadcrumbCategory');
    const colorSection = document.getElementById('colorSection');
    const colorOptions = document.getElementById('colorOptions');
    const sizeSection = document.getElementById('sizeSection');
    const sizeOptions = document.getElementById('sizeOptions');
    const quantityInput = document.getElementById('quantity');
    const decreaseQty = document.getElementById('decreaseQty');
    const increaseQty = document.getElementById('increaseQty');
    const addToCartBtn = document.getElementById('addToCartBtn');
    const buyNowBtn = document.getElementById('buyNowBtn');
    const relatedProducts = document.getElementById('relatedProducts');

    // ===== OBTER ID DO PRODUTO DA URL =====
    const urlParams = new URLSearchParams(window.location.search);
    const produtoId = parseInt(urlParams.get('id'));

    if (!produtoId) {
        window.location.href = 'catalogo.html';
        return;
    }

    // ===== ATUALIZAR BREADCRUMB =====
    function atualizarBreadcrumb() {
        if (breadcrumbCategory && produtoAtual) {
            breadcrumbCategory.textContent = produtoAtual.nome;
        }
    }

    // ===== CARREGAR PRODUTO =====
    function carregarProduto() {
        produtoAtual = obterProdutoPorId(produtoId);
        
        if (!produtoAtual) {
            window.location.href = 'catalogo.html';
            return;
        }

        atualizarBreadcrumb();
        renderizarProduto();
        carregarProdutosRelacionados();
    }

    // ===== RENDERIZAR PRODUTO =====
    function renderizarProduto() {
        // Atualizar título da página
        document.title = `${produtoAtual.nome} | Moda Elegante`;
        
        // Breadcrumb - removido pois é atualizado pela função atualizarBreadcrumb()

        // Badge
        if (produtoAtual.badge) {
            productBadge.style.display = 'block';
            productBadge.querySelector('span').textContent = produtoAtual.badge;
        }

        // Informações básicas
        productName.textContent = produtoAtual.nome;
        productPrice.textContent = formatarPreco(produtoAtual.preco);
        productDescription.textContent = produtoAtual.descricao;

        // Preço original
        if (produtoAtual.precoOriginal) {
            productOriginalPrice.textContent = formatarPreco(produtoAtual.precoOriginal);
            productOriginalPrice.style.display = 'inline';
        }

        // Avaliações
        if (produtoAtual.rating) {
            productStars.innerHTML = gerarEstrelas(produtoAtual.rating);
            productReviews.textContent = `(${produtoAtual.reviews} avaliações)`;
        }

        // Galeria de imagens
        renderizarGaleria();

        // Cores
        if (produtoAtual.cores && produtoAtual.cores.length > 0) {
            renderizarCores();
        }

        // Tamanhos
        if (produtoAtual.tamanhos && produtoAtual.tamanhos.length > 0) {
            renderizarTamanhos();
        }
    }

    // ===== RENDERIZAR GALERIA =====
    function renderizarGaleria() {
        const imagens = produtoAtual.imagens || [produtoAtual.imagem];
        
        // Imagem principal
        mainImage.src = imagens[0];
        mainImage.alt = produtoAtual.nome;

        // Thumbnails
        if (imagens.length > 1) {
            thumbnails.innerHTML = imagens.map((img, index) => `
                <div class="product-thumbnail ${index === 0 ? 'active' : ''}" data-index="${index}">
                    <img src="${img}" alt="${produtoAtual.nome}">
                </div>
            `).join('');

            // Event listeners para thumbnails
            document.querySelectorAll('.product-thumbnail').forEach(thumb => {
                thumb.addEventListener('click', function() {
                    const index = parseInt(this.dataset.index);
                    trocarImagemPrincipal(index);
                });
            });
        }
    }

    // ===== TROCAR IMAGEM PRINCIPAL =====
    function trocarImagemPrincipal(index) {
        const imagens = produtoAtual.imagens || [produtoAtual.imagem];
        mainImage.src = imagens[index];

        // Atualizar thumbnail ativo
        document.querySelectorAll('.product-thumbnail').forEach(thumb => {
            thumb.classList.remove('active');
        });
        document.querySelector(`[data-index="${index}"]`).classList.add('active');
    }

    // ===== RENDERIZAR CORES =====
    function renderizarCores() {
        colorSection.style.display = 'block';
        colorOptions.innerHTML = produtoAtual.cores.map(cor => `
            <button class="btn btn-outline-secondary me-2 mb-2 color-btn" data-cor="${cor}">
                ${cor}
            </button>
        `).join('');

        // Event listeners para cores
        document.querySelectorAll('.color-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                corSelecionada = this.dataset.cor;
            });
        });

        // Selecionar primeira cor por padrão
        if (produtoAtual.cores.length > 0) {
            const firstColorBtn = document.querySelector('.color-btn');
            firstColorBtn.classList.add('active');
            corSelecionada = firstColorBtn.dataset.cor;
        }
    }

    // ===== RENDERIZAR TAMANHOS =====
    function renderizarTamanhos() {
        sizeSection.style.display = 'block';
        sizeOptions.innerHTML = produtoAtual.tamanhos.map(tamanho => `
            <div class="size-option" data-tamanho="${tamanho}">
                ${tamanho}
            </div>
        `).join('');

        // Event listeners para tamanhos
        document.querySelectorAll('.size-option').forEach(option => {
            option.addEventListener('click', function() {
                document.querySelectorAll('.size-option').forEach(o => o.classList.remove('active'));
                this.classList.add('active');
                tamanhoSelecionado = this.dataset.tamanho;
            });
        });
    }

    // ===== CONTROLES DE QUANTIDADE =====
    decreaseQty.addEventListener('click', function() {
        const currentQty = parseInt(quantityInput.value);
        if (currentQty > 1) {
            quantityInput.value = currentQty - 1;
        }
    });

    increaseQty.addEventListener('click', function() {
        const currentQty = parseInt(quantityInput.value);
        if (currentQty < 10) {
            quantityInput.value = currentQty + 1;
        }
    });

    quantityInput.addEventListener('change', function() {
        const value = parseInt(this.value);
        if (value < 1) this.value = 1;
        if (value > 10) this.value = 10;
    });

    // ===== ADICIONAR AO CARRINHO =====
    addToCartBtn.addEventListener('click', function() {
        const quantidade = parseInt(quantityInput.value);
        
        // Validar seleções obrigatórias
        if (produtoAtual.tamanhos && produtoAtual.tamanhos.length > 0 && !tamanhoSelecionado) {
            mostrarAlerta('Por favor, selecione um tamanho.', 'warning');
            return;
        }

        if (produtoAtual.cores && produtoAtual.cores.length > 0 && !corSelecionada) {
            mostrarAlerta('Por favor, selecione uma cor.', 'warning');
            return;
        }

        // Adicionar ao carrinho
        const sucesso = carrinho.adicionarProduto(produtoId, quantidade, tamanhoSelecionado, corSelecionada);
        
        if (sucesso) {
            // Animação do botão
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check me-2"></i>Adicionado!';
            this.classList.remove('btn-primary');
            this.classList.add('btn-success');
            this.disabled = true;

            setTimeout(() => {
                this.innerHTML = originalText;
                this.classList.remove('btn-success');
                this.classList.add('btn-primary');
                this.disabled = false;
            }, 2000);

            // Abrir carrinho
            setTimeout(() => {
                carrinho.toggleCarrinho();
            }, 500);
        }
    });

    // ===== COMPRAR AGORA =====
    buyNowBtn.addEventListener('click', function() {
        const quantidade = parseInt(quantityInput.value);
        
        // Validar seleções obrigatórias
        if (produtoAtual.tamanhos && produtoAtual.tamanhos.length > 0 && !tamanhoSelecionado) {
            mostrarAlerta('Por favor, selecione um tamanho.', 'warning');
            return;
        }

        if (produtoAtual.cores && produtoAtual.cores.length > 0 && !corSelecionada) {
            mostrarAlerta('Por favor, selecione uma cor.', 'warning');
            return;
        }

        // Adicionar ao carrinho e ir para checkout
        const sucesso = carrinho.adicionarProduto(produtoId, quantidade, tamanhoSelecionado, corSelecionada);
        
        if (sucesso) {
            window.location.href = 'checkout.html';
        }
    });

    // ===== PRODUTOS RELACIONADOS =====
    function carregarProdutosRelacionados() {
        const relacionados = produtos
            .filter(p => p.id !== produtoId && p.categoria === produtoAtual.categoria)
            .slice(0, 4);

        if (relacionados.length > 0) {
            relatedProducts.innerHTML = relacionados.map(produto => renderizarProduto(produto)).join('');
        } else {
            // Se não há produtos da mesma categoria, mostrar produtos aleatórios
            const aleatorios = produtos
                .filter(p => p.id !== produtoId)
                .sort(() => Math.random() - 0.5)
                .slice(0, 4);
            
            relatedProducts.innerHTML = aleatorios.map(produto => renderizarProduto(produto)).join('');
        }
    }

    // ===== FUNÇÃO PARA MOSTRAR ALERTAS =====
    function mostrarAlerta(mensagem, tipo = 'info') {
        const alerta = document.createElement('div');
        alerta.className = `alert alert-${tipo} alert-dismissible fade show position-fixed`;
        alerta.style.cssText = `
            top: 100px;
            right: 20px;
            z-index: 1060;
            min-width: 300px;
        `;
        alerta.innerHTML = `
            ${mensagem}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        document.body.appendChild(alerta);

        // Remover após 5 segundos
        setTimeout(() => {
            if (alerta.parentNode) {
                alerta.remove();
            }
        }, 5000);
    }

    // ===== ZOOM NA IMAGEM PRINCIPAL =====
    mainImage.addEventListener('click', function() {
        const modal = document.createElement('div');
        modal.className = 'image-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            z-index: 2000;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
        `;

        const img = document.createElement('img');
        img.src = this.src;
        img.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            object-fit: contain;
        `;

        modal.appendChild(img);
        document.body.appendChild(modal);

        // Fechar ao clicar
        modal.addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        // Fechar com ESC
        const closeOnEsc = (e) => {
            if (e.key === 'Escape') {
                document.body.removeChild(modal);
                document.removeEventListener('keydown', closeOnEsc);
            }
        };
        document.addEventListener('keydown', closeOnEsc);
    });

    // ===== INICIALIZAR =====
    carregarProduto();

    console.log('🛍️ Página de produto carregada!');
});
