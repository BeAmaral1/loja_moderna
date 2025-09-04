// ===== GESTOS MOBILE E FUNCIONALIDADES APP =====

class MobileGestures {
    constructor() {
        this.startX = 0;
        this.startY = 0;
        this.endX = 0;
        this.endY = 0;
        this.minSwipeDistance = 50;
        this.isCartOpen = false;
        this.init();
    }

    // ===== SWIPE/DRAG NO CARROSSEL =====
    setupCarouselSwipe() {
        const carouselEl = document.getElementById('heroCarousel');
        if (!carouselEl || typeof bootstrap === 'undefined' || !bootstrap.Carousel) return;

        const carousel = bootstrap.Carousel.getOrCreateInstance(carouselEl, {
            interval: 4000,
            ride: false, // controlaremos pausa/ciclo manualmente no gesto
            touch: false // desativa touch interno do BS para evitar conflito
        });

        let startX = 0;
        let startY = 0;
        let dragging = false;
        const threshold = 40; // pixels para considerar swipe

        const onStart = (x, y) => {
            dragging = true;
            startX = x;
            startY = y;
            try { carousel.pause(); } catch (_) {}
        };

        const onMove = (x, y) => {
            if (!dragging) return;
            const dx = x - startX;
            const dy = y - startY;
            if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > threshold) {
                if (dx > 0) {
                    carousel.prev();
                } else {
                    carousel.next();
                }
                dragging = false;
            }
        };

        const onEnd = () => {
            dragging = false;
            try { carousel.cycle(); } catch (_) {}
        };

        // Touch
        carouselEl.addEventListener('touchstart', (e) => onStart(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
        carouselEl.addEventListener('touchmove', (e) => onMove(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
        carouselEl.addEventListener('touchend', onEnd, { passive: true });

        // Pointer/mouse (desktop)
        carouselEl.addEventListener('pointerdown', (e) => onStart(e.clientX, e.clientY));
        carouselEl.addEventListener('pointermove', (e) => onMove(e.clientX, e.clientY));
        carouselEl.addEventListener('pointerup', onEnd);
        carouselEl.addEventListener('pointerleave', onEnd);
    }

    init() {
        this.setupSwipeGestures();
        this.setupPullToRefresh();
        this.setupTouchFeedback();
        this.setupKeyboardHandling();
        this.setupInstallPrompt();
        this.setupCarouselSwipe();
    }

    // ===== GESTOS DE SWIPE =====
    setupSwipeGestures() {
        document.addEventListener('touchstart', (e) => {
            this.startX = e.touches[0].clientX;
            this.startY = e.touches[0].clientY;
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            this.endX = e.changedTouches[0].clientX;
            this.endY = e.changedTouches[0].clientY;
            this.handleSwipe();
        }, { passive: true });
    }

    handleSwipe() {
        const deltaX = this.endX - this.startX;
        const deltaY = this.endY - this.startY;
        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);

        // Swipe horizontal (esquerda/direita)
        if (absDeltaX > this.minSwipeDistance && absDeltaX > absDeltaY) {
            if (deltaX > 0) {
                this.handleSwipeRight();
            } else {
                this.handleSwipeLeft();
            }
        }

        // Swipe vertical (cima/baixo)
        if (absDeltaY > this.minSwipeDistance && absDeltaY > absDeltaX) {
            if (deltaY > 0) {
                this.handleSwipeDown();
            } else {
                this.handleSwipeUp();
            }
        }
    }

    handleSwipeRight() {
        // Swipe direita: abrir carrinho
        if (!this.isCartOpen) {
            const cartBtn = document.getElementById('cartBtn');
            if (cartBtn) {
                cartBtn.click();
                this.showSwipeFeedback('Carrinho aberto');
            }
        }
    }

    handleSwipeLeft() {
        // Swipe esquerda: fechar carrinho
        if (this.isCartOpen) {
            const cartClose = document.getElementById('cartClose');
            if (cartClose) {
                cartClose.click();
                this.showSwipeFeedback('Carrinho fechado');
            }
        }
    }

    handleSwipeDown() {
        // Swipe para baixo: refresh (se no topo da página)
        if (window.scrollY === 0) {
            this.triggerRefresh();
        }
    }

    handleSwipeUp() {
        // Swipe para cima: scroll suave para o topo
        if (window.scrollY > 200) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            this.showSwipeFeedback('Voltando ao topo');
        }
    }

    // ===== PULL TO REFRESH =====
    setupPullToRefresh() {
        let startY = 0;
        let pullDistance = 0;
        const maxPullDistance = 100;
        let isPulling = false;

        document.addEventListener('touchstart', (e) => {
            if (window.scrollY === 0) {
                startY = e.touches[0].clientY;
                isPulling = true;
            }
        }, { passive: true });

        document.addEventListener('touchmove', (e) => {
            if (isPulling && window.scrollY === 0) {
                pullDistance = e.touches[0].clientY - startY;
                
                if (pullDistance > 0 && pullDistance < maxPullDistance) {
                    e.preventDefault();
                    this.showPullIndicator(pullDistance / maxPullDistance);
                }
            }
        }, { passive: false });

        document.addEventListener('touchend', () => {
            if (isPulling && pullDistance > 50) {
                this.triggerRefresh();
            }
            isPulling = false;
            pullDistance = 0;
            this.hidePullIndicator();
        }, { passive: true });
    }

    showPullIndicator(progress) {
        let indicator = document.getElementById('pullIndicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'pullIndicator';
            indicator.innerHTML = '<i class="fas fa-sync-alt"></i>';
            indicator.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: var(--primary-color);
                color: white;
                padding: 10px;
                border-radius: 50%;
                z-index: 9999;
                transition: all 0.3s ease;
                opacity: 0;
            `;
            document.body.appendChild(indicator);
        }
        
        indicator.style.opacity = progress;
        indicator.style.transform = `translateX(-50%) rotate(${progress * 360}deg)`;
    }

    hidePullIndicator() {
        const indicator = document.getElementById('pullIndicator');
        if (indicator) {
            indicator.style.opacity = '0';
            setTimeout(() => {
                if (indicator.parentNode) {
                    indicator.parentNode.removeChild(indicator);
                }
            }, 300);
        }
    }

    triggerRefresh() {
        this.showSwipeFeedback('Atualizando...');
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }

    // ===== FEEDBACK VISUAL =====
    showSwipeFeedback(message) {
        const feedback = document.createElement('div');
        feedback.className = 'swipe-feedback';
        feedback.textContent = message;
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px 20px;
            border-radius: 25px;
            font-size: 14px;
            z-index: 9999;
            animation: fadeInOut 2s ease;
        `;

        document.body.appendChild(feedback);

        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.parentNode.removeChild(feedback);
            }
        }, 2000);
    }

    // ===== FEEDBACK TÁTIL =====
    setupTouchFeedback() {
        // Vibração para botões importantes
        document.addEventListener('click', (e) => {
            const button = e.target.closest('.btn-primary, .btn-success, .btn-danger');
            if (button && 'vibrate' in navigator) {
                navigator.vibrate(50);
            }
        });

        // Feedback visual para toques
        document.addEventListener('touchstart', (e) => {
            const element = e.target;
            if (element.classList.contains('btn') || element.classList.contains('product-card')) {
                element.style.transform = 'scale(0.98)';
                element.style.transition = 'transform 0.1s ease';
            }
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            const element = e.target;
            if (element.classList.contains('btn') || element.classList.contains('product-card')) {
                setTimeout(() => {
                    element.style.transform = '';
                }, 100);
            }
        }, { passive: true });
    }

    // ===== TECLADO VIRTUAL =====
    setupKeyboardHandling() {
        let initialViewportHeight = window.innerHeight;

        window.addEventListener('resize', () => {
            const currentHeight = window.innerHeight;
            const heightDifference = initialViewportHeight - currentHeight;

            // Teclado aberto (altura diminuiu significativamente)
            if (heightDifference > 150) {
                document.body.classList.add('keyboard-open');
                this.adjustForKeyboard(true);
            } else {
                document.body.classList.remove('keyboard-open');
                this.adjustForKeyboard(false);
            }
        });
    }

    adjustForKeyboard(isOpen) {
        const whatsappFloat = document.querySelector('.whatsapp-float');
        const footer = document.querySelector('footer');

        if (isOpen) {
            if (whatsappFloat) whatsappFloat.style.display = 'none';
            if (footer) footer.style.display = 'none';
        } else {
            if (whatsappFloat) whatsappFloat.style.display = 'flex';
            if (footer) footer.style.display = 'block';
        }
    }

    // ===== PWA INSTALL PROMPT =====
    setupInstallPrompt() {
        let deferredPrompt;

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            this.showInstallButton();
        });

        window.addEventListener('appinstalled', () => {
            this.hideInstallButton();
            this.showSwipeFeedback('App instalado com sucesso!');
        });
    }

    showInstallButton() {
        const installBtn = document.createElement('button');
        installBtn.id = 'installBtn';
        installBtn.innerHTML = '<i class="fas fa-download"></i> Instalar App';
        installBtn.className = 'btn btn-primary install-btn';
        installBtn.style.cssText = `
            position: fixed;
            bottom: 80px;
            right: 20px;
            z-index: 1000;
            border-radius: 25px;
            padding: 10px 15px;
            font-size: 12px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        `;

        installBtn.addEventListener('click', () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('PWA instalado');
                    }
                    deferredPrompt = null;
                    this.hideInstallButton();
                });
            }
        });

        document.body.appendChild(installBtn);
    }

    hideInstallButton() {
        const installBtn = document.getElementById('installBtn');
        if (installBtn) {
            installBtn.remove();
        }
    }

    // ===== MONITORAR ESTADO DO CARRINHO =====
    monitorCartState() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const cartSidebar = document.querySelector('.cart-sidebar');
                    this.isCartOpen = cartSidebar && cartSidebar.classList.contains('active');
                }
            });
        });

        const cartSidebar = document.querySelector('.cart-sidebar');
        if (cartSidebar) {
            observer.observe(cartSidebar, { attributes: true });
        }
    }
}

// ===== CSS ANIMATIONS =====
const mobileGesturesStyle = document.createElement('style');
mobileGesturesStyle.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    }

    .keyboard-open .whatsapp-float {
        display: none !important;
    }

    .keyboard-open footer {
        display: none !important;
    }

    .install-btn {
        animation: pulse 2s infinite;
    }

    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(mobileGesturesStyle);

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
    const mobileGestures = new MobileGestures();
    mobileGestures.monitorCartState();
    console.log('📱 Gestos mobile inicializados!');
});

// Exportar para uso global
window.MobileGestures = MobileGestures;
