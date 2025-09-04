// ===== MAIN JAVASCRIPT =====
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== SMOOTH SCROLLING =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ===== NAVBAR SCROLL EFFECT =====
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;

    if (navbar) {
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Adicionar sombra quando rolar
            if (scrollTop > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            lastScrollTop = scrollTop;
        });
    }

    // ===== NEWSLETTER FORM =====
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            // Simular envio
            const button = this.querySelector('button');
            const originalText = button.textContent;
            
            button.textContent = 'Enviando...';
            button.disabled = true;
            
            setTimeout(() => {
                button.textContent = 'Cadastrado!';
                button.classList.remove('btn-light');
                button.classList.add('btn-success');
                
                setTimeout(() => {
                    button.textContent = originalText;
                    button.classList.remove('btn-success');
                    button.classList.add('btn-light');
                    button.disabled = false;
                    this.reset();
                }, 2000);
            }, 1500);
        });
    }

    // ===== LAZY LOADING PARA IMAGENS =====
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    // ===== ANIMAÇÕES AO SCROLL =====
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('animated');
            }
        });
    };

    window.addEventListener('scroll', animateOnScroll);

    // ===== FILTROS URL PARAMETERS =====
    const urlParams = new URLSearchParams(window.location.search);
    const categoria = urlParams.get('categoria');
    
    if (categoria && document.querySelector(`[data-categoria="${categoria}"]`)) {
        // Aplicar filtro baseado na URL
        setTimeout(() => {
            aplicarFiltro(categoria);
        }, 100);
    }

    // ===== BUSCA EM TEMPO REAL =====
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const query = this.value.trim();
            
            searchTimeout = setTimeout(() => {
                if (query.length >= 2) {
                    const resultados = buscarProdutos(query);
                    renderizarProdutos(resultados);
                    
                    // Mostrar quantidade de resultados
                    const resultCount = document.getElementById('resultCount');
                    if (resultCount) {
                        resultCount.textContent = `${resultados.length} produto(s) encontrado(s)`;
                    }
                } else if (query.length === 0) {
                    renderizarProdutos();
                    const resultCount = document.getElementById('resultCount');
                    if (resultCount) {
                        resultCount.textContent = '';
                    }
                }
            }, 300);
        });
    }

    // ===== BACK TO TOP BUTTON =====
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopBtn.className = 'back-to-top';

    document.body.appendChild(backToTopBtn);

    // Mostrar/ocultar botão baseado no scroll com responsividade
    const updateBackToTopButton = () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    };
    
    window.addEventListener('scroll', updateBackToTopButton);
    window.addEventListener('resize', updateBackToTopButton);

    // Ação do botão
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ===== LOADING OVERLAY =====
    const showLoading = () => {
        const loading = document.createElement('div');
        loading.id = 'loadingOverlay';
        loading.innerHTML = `
            <div class="d-flex justify-content-center align-items-center h-100">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Carregando...</span>
                </div>
            </div>
        `;
        loading.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.9);
            z-index: 9999;
            backdrop-filter: blur(5px);
        `;
        document.body.appendChild(loading);
    };

    const hideLoading = () => {
        const loading = document.getElementById('loadingOverlay');
        if (loading) {
            loading.remove();
        }
    };

    // Expor funções globalmente se necessário
    window.showLoading = showLoading;
    window.hideLoading = hideLoading;

    // ===== PERFORMANCE OPTIMIZATION =====
    // Debounce function
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    // Throttle function
    const throttle = (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    };

    // Aplicar throttle ao scroll para melhor performance
    window.addEventListener('scroll', throttle(function() {
        // Scroll events já otimizados acima
    }, 100));

    // ===== ERROR HANDLING =====
    window.addEventListener('error', function(e) {
        console.error('Erro capturado:', e.error);
        // Aqui você pode implementar um sistema de log de erros
    });

    // ===== ACCESSIBILITY IMPROVEMENTS =====
    // Melhorar navegação por teclado
    document.addEventListener('keydown', function(e) {
        // ESC para fechar modais/sidebars
        if (e.key === 'Escape') {
            const cartSidebar = document.getElementById('cartSidebar');
            if (cartSidebar && cartSidebar.classList.contains('active')) {
                carrinho.fecharCarrinho();
            }
        }
    });

    // Focus trap para sidebar do carrinho
    const trapFocus = (element) => {
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        element.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    };

    const cartSidebar = document.getElementById('cartSidebar');
    if (cartSidebar) {
        trapFocus(cartSidebar);
    }

    console.log('🛍️ Loja Moderna carregada com sucesso!');
});
