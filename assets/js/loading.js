// ===== SISTEMA DE LOADING UNIFICADO =====

class UnifiedLoading {
    constructor() {
        this.loadingElement = null;
        this.isVisible = false;
        this.init();
    }

    init() {
        // Criar elemento de loading se não existir
        if (!document.getElementById('unified-loading')) {
            this.createLoadingElement();
        }
        this.loadingElement = document.getElementById('unified-loading');
    }

    createLoadingElement() {
        console.log('Criando elemento de loading...');
        
        // Adicionar CSS inline primeiro
        this.addLoadingStyles();
        
        const loadingHTML = `
            <div id="unified-loading" class="unified-loading">
                <div class="loading-content">
                    <div class="loading-spinner"></div>
                    <h4 class="loading-title" id="loading-title">Carregando...</h4>
                    <p class="loading-text" id="loading-text">Aguarde um momento</p>
                    <div class="loading-progress">
                        <div class="loading-progress-bar" id="loading-progress-bar"></div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', loadingHTML);
        console.log('Elemento de loading criado e adicionado ao DOM');
    }

    addLoadingStyles() {
        // Verificar se o CSS já foi adicionado
        if (document.getElementById('unified-loading-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'unified-loading-styles';
        style.textContent = `
            .unified-loading {
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

            .unified-loading.show {
                opacity: 1;
                visibility: visible;
                pointer-events: auto;
            }

            .loading-content {
                text-align: center;
                padding: 3rem;
                background: rgba(255, 255, 255, 0.95);
                border-radius: 20px;
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
                max-width: 400px;
                width: 90%;
                margin: 0 1rem;
            }

            .loading-spinner {
                width: 80px;
                height: 80px;
                margin: 0 auto 2rem;
                border: 6px solid rgba(37, 99, 235, 0.2);
                border-top: 6px solid #2563eb;
                border-radius: 50%;
                animation: loadingSpin 1s linear infinite;
            }

            .loading-title {
                color: #1f2937;
                font-weight: 700;
                margin-bottom: 0.5rem;
                font-size: 1.5rem;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            }

            .loading-text {
                color: #6b7280;
                margin-bottom: 2rem;
                font-size: 1rem;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            }

            .loading-progress {
                width: 100%;
                height: 6px;
                background: rgba(37, 99, 235, 0.2);
                border-radius: 3px;
                overflow: hidden;
            }

            .loading-progress-bar {
                height: 100%;
                background: linear-gradient(90deg, #2563eb, #3b82f6);
                border-radius: 3px;
                width: 0%;
                transition: width 0.3s ease;
            }

            @keyframes loadingSpin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            /* Mobile responsiveness */
            @media (max-width: 480px) {
                .loading-content {
                    padding: 2rem 1.5rem;
                    margin: 0 1rem;
                }
                
                .loading-spinner {
                    width: 60px;
                    height: 60px;
                }
                
                .loading-title {
                    font-size: 1.25rem;
                }
            }
        `;
        
        document.head.appendChild(style);
    }

    show(title = 'Carregando...', text = 'Aguarde um momento') {
        console.log('UnifiedLoading.show() chamado:', title, text);
        
        if (!this.loadingElement) {
            console.log('Loading element não existe, inicializando...');
            this.init();
        }
        
        const titleElement = document.getElementById('loading-title');
        const textElement = document.getElementById('loading-text');
        
        if (titleElement) titleElement.textContent = title;
        if (textElement) textElement.textContent = text;
        
        console.log('Adicionando classe show ao loading element');
        this.loadingElement.classList.add('show');
        this.isVisible = true;
        
        // Forçar reflow
        this.loadingElement.offsetHeight;
        
        // Prevenir scroll do body
        document.body.style.overflow = 'hidden';
        
        console.log('Loading mostrado com sucesso:', title, text);
    }

    hide() {
        if (!this.loadingElement) return;
        
        this.loadingElement.classList.remove('show');
        this.isVisible = false;
        
        // Restaurar scroll do body
        document.body.style.overflow = '';
        
        console.log('Loading escondido');
    }

    updateProgress(percentage) {
        const progressBar = document.getElementById('loading-progress-bar');
        if (progressBar) {
            progressBar.style.width = percentage + '%';
        }
    }

    updateMessage(title, text) {
        const titleElement = document.getElementById('loading-title');
        const textElement = document.getElementById('loading-text');
        
        if (titleElement && title) titleElement.textContent = title;
        if (textElement && text) textElement.textContent = text;
    }
}

// Instância global do loading
const unifiedLoading = new UnifiedLoading();

// Funções globais para facilitar o uso
function showLoading(title = 'Carregando...', text = 'Aguarde um momento') {
    console.log('Função global showLoading() chamada:', title, text);
    unifiedLoading.show(title, text);
}

function hideLoading() {
    unifiedLoading.hide();
}

function updateLoadingMessage(title, text) {
    unifiedLoading.updateMessage(title, text);
}

function updateLoadingProgress(percentage) {
    unifiedLoading.updateProgress(percentage);
}

// Auto-inicialização quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    console.log('Loading system inicializado');
    
    // Garantir que o loading está inicializado
    if (!unifiedLoading.loadingElement) {
        unifiedLoading.init();
    }
    
    // Teste automático do loading (apenas para demonstração)
    setTimeout(() => {
        console.log('Iniciando teste de loading da loja...');
        showLoading('Sistema Carregado', 'Loja Moderna pronta para uso!');
        console.log('Loading deveria estar visível agora');
        setTimeout(() => {
            console.log('Escondendo loading da loja...');
            hideLoading();
        }, 2000);
    }, 500);
});

// Interceptar navegação para mostrar loading
window.addEventListener('beforeunload', function() {
    showLoading('Carregando página...', 'Redirecionando...');
});

// Loading automático para formulários
document.addEventListener('submit', function(e) {
    const form = e.target;
    if (form.tagName === 'FORM' && !form.hasAttribute('data-no-loading')) {
        showLoading('Processando...', 'Enviando dados...');
        
        // Auto-hide após 5 segundos como fallback
        setTimeout(() => {
            hideLoading();
        }, 5000);
    }
});

// Loading automático para links externos
document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (link && link.href && !link.hasAttribute('data-no-loading')) {
        const url = new URL(link.href);
        const currentUrl = new URL(window.location.href);
        
        // Se for link externo ou para outra página
        if (url.hostname !== currentUrl.hostname || url.pathname !== currentUrl.pathname) {
            showLoading('Redirecionando...', 'Carregando nova página...');
        }
    }
});

// Exportar para uso global
window.UnifiedLoading = UnifiedLoading;
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.updateLoadingMessage = updateLoadingMessage;
window.updateLoadingProgress = updateLoadingProgress;
