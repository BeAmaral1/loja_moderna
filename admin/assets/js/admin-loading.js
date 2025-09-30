// ===== SISTEMA DE LOADING UNIFICADO PARA PAINEL ADMINISTRATIVO =====

class AdminLoading {
    constructor() {
        this.loadingElement = null;
        this.isVisible = false;
        this.init();
    }

    init() {
        this.createLoadingElement();
        this.loadingElement = document.getElementById('admin-loading');
    }

    createLoadingElement() {
        const loadingHTML = `
            <div id="admin-loading" class="admin-loading">
                <div class="admin-loading-content">
                    <div class="admin-loading-spinner"></div>
                    <h4 class="admin-loading-title" id="admin-loading-title">Carregando...</h4>
                    <p class="admin-loading-text" id="admin-loading-text">Aguarde um momento</p>
                    <div class="admin-loading-progress">
                        <div class="admin-loading-progress-bar" id="admin-progress-bar"></div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', loadingHTML);
    }

    show(title = 'Carregando...', text = 'Aguarde um momento', showProgress = false) {
        if (!this.loadingElement) this.init();
        
        const titleElement = document.getElementById('admin-loading-title');
        const textElement = document.getElementById('admin-loading-text');
        const progressBar = document.getElementById('admin-progress-bar');
        
        if (titleElement) titleElement.textContent = title;
        if (textElement) textElement.textContent = text;
        
        if (showProgress) {
            progressBar.style.display = 'block';
            this.animateProgress();
        } else {
            progressBar.style.display = 'none';
        }
        
        this.loadingElement.classList.add('show');
        this.isVisible = true;
        
        // Prevenir scroll do body
        document.body.style.overflow = 'hidden';
    }

    hide() {
        if (!this.loadingElement) return;
        
        this.loadingElement.classList.remove('show');
        this.isVisible = false;
        
        // Restaurar scroll do body
        document.body.style.overflow = '';
    }

    updateTitle(title) {
        const titleElement = document.getElementById('admin-loading-title');
        if (titleElement) titleElement.textContent = title;
    }

    updateText(text) {
        const textElement = document.getElementById('admin-loading-text');
        if (textElement) textElement.textContent = text;
    }

    setProgress(percentage) {
        const progressBar = document.getElementById('admin-progress-bar');
        if (progressBar) {
            progressBar.style.width = percentage + '%';
        }
    }

    animateProgress() {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 90) {
                progress = 90;
                clearInterval(interval);
            }
            this.setProgress(progress);
        }, 200);
    }

    // Método para simular carregamento com etapas
    async simulateLoading(steps = []) {
        if (steps.length === 0) {
            steps = [
                { title: 'Iniciando...', text: 'Preparando sistema', duration: 800 },
                { title: 'Carregando dados...', text: 'Buscando informações', duration: 1200 },
                { title: 'Finalizando...', text: 'Quase pronto', duration: 600 }
            ];
        }

        this.show(steps[0].title, steps[0].text, true);

        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            this.updateTitle(step.title);
            this.updateText(step.text);
            this.setProgress((i + 1) / steps.length * 100);
            
            await new Promise(resolve => setTimeout(resolve, step.duration));
        }

        this.hide();
    }
}

// CSS Styles para o loading administrativo
const adminLoadingStyles = `
<style>
.admin-loading {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(37, 99, 235, 0.95), rgba(29, 78, 216, 0.95));
    backdrop-filter: blur(10px);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    visibility: hidden;
    transition: all 0.4s ease;
}

.admin-loading.show {
    opacity: 1;
    visibility: visible;
}

.admin-loading-content {
    text-align: center;
    padding: 3rem;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 20px;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
    max-width: 400px;
    width: 90%;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
}

.admin-loading-spinner {
    width: 80px;
    height: 80px;
    margin: 0 auto 2rem;
    border: 6px solid rgba(37, 99, 235, 0.2);
    border-top: 6px solid #2563eb;
    border-radius: 50%;
    animation: adminSpin 1s linear infinite;
    position: relative;
}

.admin-loading-spinner::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 40px;
    height: 40px;
    border: 3px solid rgba(37, 99, 235, 0.3);
    border-top: 3px solid #2563eb;
    border-radius: 50%;
    animation: adminSpin 0.8s linear infinite reverse;
}

.admin-loading-title {
    color: #1f2937;
    font-weight: 700;
    margin-bottom: 0.5rem;
    font-size: 1.5rem;
}

.admin-loading-text {
    color: #6b7280;
    margin-bottom: 2rem;
    font-size: 1rem;
}

.admin-loading-progress {
    width: 100%;
    height: 6px;
    background: rgba(37, 99, 235, 0.2);
    border-radius: 3px;
    overflow: hidden;
    display: none;
}

.admin-loading-progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #2563eb, #3b82f6);
    border-radius: 3px;
    width: 0%;
    transition: width 0.3s ease;
    position: relative;
}

.admin-loading-progress-bar::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
    animation: adminShimmer 2s infinite;
}

@keyframes adminSpin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

@keyframes adminShimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
}

/* Responsividade */
@media (max-width: 768px) {
    .admin-loading-content {
        padding: 2rem;
        border-radius: 16px;
    }
    
    .admin-loading-spinner {
        width: 60px;
        height: 60px;
        margin-bottom: 1.5rem;
    }
    
    .admin-loading-title {
        font-size: 1.25rem;
    }
    
    .admin-loading-text {
        font-size: 0.9rem;
    }
}

@media (max-width: 375px) {
    .admin-loading-content {
        padding: 1.5rem;
        border-radius: 12px;
    }
    
    .admin-loading-spinner {
        width: 50px;
        height: 50px;
    }
    
    .admin-loading-title {
        font-size: 1.1rem;
    }
}
</style>
`;

// Injetar estilos no head
document.head.insertAdjacentHTML('beforeend', adminLoadingStyles);

// Instância global do loading administrativo
const adminLoading = new AdminLoading();

// Funções globais para facilitar o uso
function showAdminLoading(title = 'Carregando...', text = 'Aguarde um momento', showProgress = false) {
    adminLoading.show(title, text, showProgress);
}

function hideAdminLoading() {
    adminLoading.hide();
}

function updateAdminLoadingTitle(title) {
    adminLoading.updateTitle(title);
}

function updateAdminLoadingText(text) {
    adminLoading.updateText(text);
}

function setAdminProgress(percentage) {
    adminLoading.setProgress(percentage);
}

function simulateAdminLoading(steps) {
    return adminLoading.simulateLoading(steps);
}

// Auto-inicialização quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Admin Loading System initialized');
});

// Loading automático para formulários administrativos
document.addEventListener('submit', function(e) {
    const form = e.target;
    if (form.tagName === 'FORM' && form.closest('.admin-panel, .admin-content, [class*="admin"]')) {
        showAdminLoading('Processando...', 'Salvando alterações', true);
        
        // Auto-hide após 5 segundos como fallback
        setTimeout(() => {
            hideAdminLoading();
        }, 5000);
    }
});

// Loading automático para navegação administrativa
document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (link && link.href && link.closest('.admin-panel, .admin-sidebar, [class*="admin"]')) {
        const url = new URL(link.href);
        const currentUrl = new URL(window.location.href);
        
        // Se for navegação interna do admin
        if (url.hostname === currentUrl.hostname && url.pathname !== currentUrl.pathname) {
            showAdminLoading('Carregando página...', 'Redirecionando', false);
        }
    }
});

// Exportar para uso global
window.AdminLoading = AdminLoading;
window.adminLoading = adminLoading;
window.showAdminLoading = showAdminLoading;
window.hideAdminLoading = hideAdminLoading;
window.updateAdminLoadingTitle = updateAdminLoadingTitle;
window.updateAdminLoadingText = updateAdminLoadingText;
window.setAdminProgress = setAdminProgress;
window.simulateAdminLoading = simulateAdminLoading;
