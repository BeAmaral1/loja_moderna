// ===== SISTEMA DE LOADING PARA LOJA PRINCIPAL =====

class StoreLoading {
    constructor() {
        this.loadingElement = null;
        this.isVisible = false;
        this.init();
    }

    init() {
        console.log('StoreLoading inicializado');
        this.createLoadingElement();
        this.loadingElement = document.getElementById('store-loading');
    }

    createLoadingElement() {
        // Adicionar CSS inline primeiro
        this.addLoadingStyles();
        
        const loadingHTML = `
            <div id="store-loading" class="store-loading">
                <div class="store-loading-content">
                    <div class="store-loading-spinner"></div>
                    <h4 class="store-loading-title" id="store-loading-title">Carregando...</h4>
                    <p class="store-loading-text" id="store-loading-text">Aguarde um momento</p>
                    <div class="store-loading-progress">
                        <div class="store-loading-progress-bar" id="store-loading-progress-bar"></div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', loadingHTML);
        console.log('Elemento de loading da loja criado');
    }

    addLoadingStyles() {
        // Verificar se o CSS já foi adicionado
        if (document.getElementById('store-loading-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'store-loading-styles';
        style.textContent = `
            .store-loading {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: linear-gradient(135deg, rgba(37, 99, 235, 0.95), rgba(29, 78, 216, 0.95));
                backdrop-filter: blur(10px);
                z-index: 99999;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.4s ease, visibility 0.4s ease;
                pointer-events: none;
            }

            .store-loading.show {
                opacity: 1;
                visibility: visible;
                pointer-events: auto;
            }

            .store-loading-content {
                text-align: center;
                padding: 3rem;
                background: rgba(255, 255, 255, 0.95);
                border-radius: 20px;
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
                max-width: 400px;
                width: 90%;
                margin: 0 1rem;
            }

            .store-loading-spinner {
                width: 80px;
                height: 80px;
                margin: 0 auto 2rem;
                border: 6px solid rgba(37, 99, 235, 0.2);
                border-top: 6px solid #2563eb;
                border-radius: 50%;
                animation: storeLoadingSpin 1s linear infinite;
            }

            .store-loading-title {
                color: #1f2937;
                font-weight: 700;
                margin-bottom: 0.5rem;
                font-size: 1.5rem;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            }

            .store-loading-text {
                color: #6b7280;
                margin-bottom: 2rem;
                font-size: 1rem;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            }

            .store-loading-progress {
                width: 100%;
                height: 6px;
                background: rgba(37, 99, 235, 0.2);
                border-radius: 3px;
                overflow: hidden;
            }

            .store-loading-progress-bar {
                height: 100%;
                background: linear-gradient(90deg, #2563eb, #3b82f6);
                border-radius: 3px;
                width: 0%;
                transition: width 0.3s ease;
            }

            @keyframes storeLoadingSpin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            /* Mobile responsiveness */
            @media (max-width: 480px) {
                .store-loading-content {
                    padding: 2rem 1.5rem;
                    margin: 0 1rem;
                }
                
                .store-loading-spinner {
                    width: 60px;
                    height: 60px;
                }
                
                .store-loading-title {
                    font-size: 1.25rem;
                }
            }
        `;
        
        document.head.appendChild(style);
    }

    show(title = 'Carregando...', text = 'Aguarde um momento') {
        console.log('StoreLoading.show() chamado:', title, text);
        
        if (!this.loadingElement) {
            console.log('Loading element não existe, inicializando...');
            this.init();
        }
        
        const titleElement = document.getElementById('store-loading-title');
        const textElement = document.getElementById('store-loading-text');
        
        if (titleElement) titleElement.textContent = title;
        if (textElement) textElement.textContent = text;
        
        console.log('Adicionando classe show ao loading element');
        this.loadingElement.classList.add('show');
        this.isVisible = true;
        
        // Forçar reflow
        this.loadingElement.offsetHeight;
        
        // Prevenir scroll do body
        document.body.style.overflow = 'hidden';
        
        console.log('Loading da loja mostrado com sucesso:', title, text);
    }

    hide() {
        console.log('StoreLoading.hide() chamado');
        if (!this.loadingElement) return;
        
        this.loadingElement.classList.remove('show');
        this.isVisible = false;
        
        // Restaurar scroll do body
        document.body.style.overflow = '';
        
        console.log('Loading da loja escondido');
    }

    updateProgress(percentage) {
        const progressBar = document.getElementById('store-loading-progress-bar');
        if (progressBar) {
            progressBar.style.width = percentage + '%';
        }
    }

    updateMessage(title, text) {
        const titleElement = document.getElementById('store-loading-title');
        const textElement = document.getElementById('store-loading-text');
        
        if (titleElement && title) titleElement.textContent = title;
        if (textElement && text) textElement.textContent = text;
    }
}

// Instância global do loading da loja
const storeLoading = new StoreLoading();

// Funções globais para facilitar o uso
function showStoreLoading(title = 'Carregando...', text = 'Aguarde um momento') {
    console.log('Função global showStoreLoading() chamada:', title, text);
    storeLoading.show(title, text);
}

function hideStoreLoading() {
    console.log('Função global hideStoreLoading() chamada');
    storeLoading.hide();
}

function updateStoreLoadingMessage(title, text) {
    storeLoading.updateMessage(title, text);
}

function updateStoreLoadingProgress(percentage) {
    storeLoading.updateProgress(percentage);
}

// Auto-inicialização quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    console.log('Store Loading system inicializado');
    
    // Garantir que o loading está inicializado
    if (!storeLoading.loadingElement) {
        storeLoading.init();
    }
    
    // Teste automático do loading da loja
    setTimeout(() => {
        console.log('Iniciando teste de loading da loja...');
        showStoreLoading('Loja Carregada', 'Moda Elegante pronta para compras!');
        
        // Simular progresso
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += 20;
            updateStoreLoadingProgress(progress);
            
            if (progress >= 100) {
                clearInterval(progressInterval);
                setTimeout(() => {
                    console.log('Escondendo loading da loja...');
                    hideStoreLoading();
                }, 500);
            }
        }, 200);
    }, 800);
});

// Interceptar navegação para mostrar loading
window.addEventListener('beforeunload', function() {
    showStoreLoading('Carregando página...', 'Redirecionando...');
});

// Loading automático para formulários
document.addEventListener('submit', function(e) {
    const form = e.target;
    if (form.tagName === 'FORM' && !form.hasAttribute('data-no-loading')) {
        showStoreLoading('Processando...', 'Enviando dados...');
        
        // Auto-hide após 5 segundos como fallback
        setTimeout(() => {
            hideStoreLoading();
        }, 5000);
    }
});

// Loading automático para links externos
document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (link && link.href && !link.hasAttribute('data-no-loading')) {
        try {
            const url = new URL(link.href);
            const currentUrl = new URL(window.location.href);
            
            // Se for link externo ou para outra página
            if (url.hostname !== currentUrl.hostname || url.pathname !== currentUrl.pathname) {
                showStoreLoading('Redirecionando...', 'Carregando nova página...');
            }
        } catch (error) {
            // Ignorar erros de URL inválida
            console.log('URL inválida ignorada:', link.href);
        }
    }
});

// Exportar para uso global
window.StoreLoading = StoreLoading;
window.showStoreLoading = showStoreLoading;
window.hideStoreLoading = hideStoreLoading;
window.updateStoreLoadingMessage = updateStoreLoadingMessage;
window.updateStoreLoadingProgress = updateStoreLoadingProgress;

console.log('Store Loading system carregado e pronto para uso');
