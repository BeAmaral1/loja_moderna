// ===== SISTEMA DE CHECKOUT PARA TESTES =====
// Este sistema é totalmente não-funcional e serve apenas para demonstração

console.log('🧪 MODO TESTE: Sistema de checkout carregado (não processará pagamentos reais)');

class TestCheckoutSystem {
    constructor() {
        this.isTestMode = true;
        this.init();
    }

    init() {
        this.addTestWarnings();
        this.setupEventListeners();
        this.loadCartData();
    }

    addTestWarnings() {
        // Adicionar avisos visuais de que é modo teste
        const testBanner = document.createElement('div');
        testBanner.className = 'alert alert-warning alert-dismissible fade show position-fixed';
        testBanner.style.cssText = 'top: 80px; left: 50%; transform: translateX(-50%); z-index: 1050; max-width: 90%;';
        testBanner.innerHTML = `
            <i class="fas fa-flask me-2"></i>
            <strong>MODO TESTE:</strong> Este checkout é apenas para demonstração. Nenhum pagamento será processado.
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.body.appendChild(testBanner);

        // Modificar títulos para indicar teste
        const pageTitle = document.querySelector('h1, .checkout-title');
        if (pageTitle) {
            pageTitle.innerHTML = `<i class="fas fa-flask text-warning me-2"></i>${pageTitle.textContent} (TESTE)`;
        }

        // Adicionar badges de teste nos botões de pagamento
        document.querySelectorAll('.payment-method').forEach(method => {
            const badge = document.createElement('span');
            badge.className = 'badge bg-warning text-dark ms-2';
            badge.textContent = 'TESTE';
            method.appendChild(badge);
        });
    }

    setupEventListeners() {
        // Interceptar submissão do formulário
        const checkoutForm = document.getElementById('checkoutForm');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', (e) => this.handleTestSubmit(e));
        }

        // Interceptar apenas botão específico de finalizar compra
        const finalizarBtn = document.querySelector('button[type="submit"]');
        if (finalizarBtn) {
            finalizarBtn.addEventListener('click', (e) => this.handleTestCheckout(e));
        }

        // Validação em tempo real dos campos
        this.setupFieldValidation();
    }

    setupFieldValidation() {
        // Desabilitado para evitar processamento automático
        console.log('🧪 MODO TESTE: Validação de campos desabilitada');
    }

    validateField(field) {
        const isValid = field.checkValidity();
        const feedback = field.parentNode.querySelector('.invalid-feedback') || this.createFeedbackElement(field);
        
        if (!isValid) {
            field.classList.add('is-invalid');
            feedback.textContent = this.getFieldErrorMessage(field);
        } else {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
        }
    }

    clearFieldError(field) {
        field.classList.remove('is-invalid');
        if (field.value.trim()) {
            field.classList.add('is-valid');
        } else {
            field.classList.remove('is-valid');
        }
    }

    createFeedbackElement(field) {
        const feedback = document.createElement('div');
        feedback.className = 'invalid-feedback';
        field.parentNode.appendChild(feedback);
        return feedback;
    }

    getFieldErrorMessage(field) {
        if (field.type === 'email') return 'Por favor, insira um email válido';
        if (field.type === 'tel') return 'Por favor, insira um telefone válido';
        if (field.name.includes('cep')) return 'Por favor, insira um CEP válido';
        if (field.name.includes('cpf')) return 'Por favor, insira um CPF válido';
        return 'Este campo é obrigatório';
    }

    loadCartData() {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        this.updateOrderSummary(cart);
    }

    updateOrderSummary(cart) {
        const summaryContainer = document.getElementById('orderSummary');
        if (!summaryContainer) return;

        let total = 0;
        const itemsHTML = cart.map(item => {
            const itemTotal = item.preco * item.quantidade;
            total += itemTotal;
            return `
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <div>
                        <strong>${item.nome}</strong>
                        <small class="text-muted d-block">Qtd: ${item.quantidade}</small>
                    </div>
                    <span>R$ ${itemTotal.toFixed(2).replace('.', ',')}</span>
                </div>
            `;
        }).join('');

        summaryContainer.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <h5 class="mb-0">
                        <i class="fas fa-flask text-warning me-2"></i>Resumo do Pedido (TESTE)
                    </h5>
                </div>
                <div class="card-body">
                    ${itemsHTML}
                    <hr>
                    <div class="d-flex justify-content-between">
                        <strong>Total:</strong>
                        <strong class="text-primary">R$ ${total.toFixed(2).replace('.', ',')}</strong>
                    </div>
                    <div class="alert alert-info mt-3">
                        <i class="fas fa-info-circle me-2"></i>
                        <small>Este é um pedido de teste. Nenhuma cobrança será realizada.</small>
                    </div>
                </div>
            </div>
        `;
    }

    handleTestSubmit(e) {
        e.preventDefault();
        
        // Confirmar antes de processar
        const confirmacao = confirm('🧪 MODO TESTE: Deseja processar este pedido de teste?');
        if (!confirmacao) {
            console.log('🧪 Processamento cancelado pelo usuário');
            return;
        }

        if (!this.validateForm(e.target)) {
            return;
        }

        this.processTestOrder(e.target);
    }

    handleTestCheckout(e) {
        e.preventDefault();
        
        // Confirmar antes de processar
        const confirmacao = confirm('🧪 MODO TESTE: Deseja processar este pedido de teste?');
        if (!confirmacao) {
            console.log('🧪 Processamento cancelado pelo usuário');
            return;
        }
        
        const form = document.getElementById('checkoutForm');
        if (form && this.validateForm(form)) {
            this.processTestOrder(form);
        }
    }

    validateForm(form) {
        // Para modo teste, sempre retornar true para permitir processamento
        console.log('🧪 MODO TESTE: Validação de formulário ignorada');
        return true;
    }

    processTestOrder(form) {
        // Usar o loading da loja com tempo limitado
        if (typeof showStoreLoading === 'function') {
            showStoreLoading('Processando pedido de teste...');
        }

        // Processar rapidamente sem loading infinito
        setTimeout(() => {
            this.completeTestOrder(form);
        }, 2000); // Apenas 2 segundos
    }

    completeTestOrder(form) {
        // Coletar dados do formulário
        const formData = new FormData(form);
        const orderData = {
            id: Date.now(),
            data: new Date().toLocaleString('pt-BR'),
            status: 'TESTE - Simulado',
            ambiente: 'TESTE',
            cliente: {
                nome: formData.get('nome') || 'Cliente Teste',
                email: formData.get('email') || 'teste@exemplo.com',
                telefone: formData.get('telefone') || '(11) 99999-9999'
            },
            endereco: {
                cep: formData.get('cep') || '00000-000',
                rua: formData.get('endereco') || 'Endereço de Teste',
                numero: formData.get('numero') || '123',
                cidade: formData.get('cidade') || 'Cidade Teste',
                estado: formData.get('estado') || 'SP'
            },
            pagamento: {
                metodo: formData.get('pagamento') || 'teste',
                status: 'SIMULADO'
            },
            itens: JSON.parse(localStorage.getItem('cart') || '[]'),
            observacoes: 'PEDIDO DE TESTE - Não processar pagamento real'
        };

        // Salvar no localStorage para demonstração
        const pedidosTeste = JSON.parse(localStorage.getItem('pedidos_teste') || '[]');
        pedidosTeste.unshift(orderData);
        localStorage.setItem('pedidos_teste', JSON.stringify(pedidosTeste));
        localStorage.setItem('ultimoPedidoTeste', JSON.stringify(orderData));

        // Esconder loading da loja
        if (typeof hideStoreLoading === 'function') {
            hideStoreLoading();
        }

        // Mostrar modal de sucesso
        this.showSuccessModal(orderData);
    }

    showSuccessModal(orderData) {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header bg-success text-white">
                        <h5 class="modal-title">
                            <i class="fas fa-check-circle me-2"></i>Pedido Simulado com Sucesso!
                        </h5>
                    </div>
                    <div class="modal-body text-center">
                        <div class="alert alert-warning">
                            <i class="fas fa-flask me-2"></i>
                            <strong>MODO TESTE:</strong> Este pedido foi apenas simulado
                        </div>
                        <h4 class="text-success mb-3">Pedido #${orderData.id}</h4>
                        <p>Seu pedido de teste foi processado com sucesso!</p>
                        <p><strong>Status:</strong> ${orderData.status}</p>
                        <p><strong>Data:</strong> ${orderData.data}</p>
                        <div class="alert alert-info">
                            <small>
                                <i class="fas fa-info-circle me-2"></i>
                                Em um ambiente real, você receberia um email de confirmação
                            </small>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="window.location.href='index.html'">
                            Voltar à Loja
                        </button>
                        <button type="button" class="btn btn-primary" onclick="window.location.href='pedidos.html'">
                            Ver Meus Pedidos
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();

        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });
    }
}

// Inicializar sistema de teste quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    console.log('🧪 Inicializando sistema de checkout de teste...');
    new TestCheckoutSystem();
});

// Funções globais para compatibilidade
window.TestCheckoutSystem = TestCheckoutSystem;
