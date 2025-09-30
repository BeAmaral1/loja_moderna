// ===== ENHANCED CHECKOUT FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== PROGRESS MANAGEMENT =====
    class CheckoutProgress {
        constructor() {
            this.currentStep = 1;
            this.steps = document.querySelectorAll('.progress-step');
            this.sections = document.querySelectorAll('.checkout-section');
        }

        updateProgress(step) {
            this.currentStep = step;
            
            this.steps.forEach((stepEl, index) => {
                stepEl.classList.remove('active', 'completed');
                
                if (index + 1 < step) {
                    stepEl.classList.add('completed');
                } else if (index + 1 === step) {
                    stepEl.classList.add('active');
                }
            });

            // Update progress lines
            const lines = document.querySelectorAll('.progress-line');
            lines.forEach((line, index) => {
                line.classList.toggle('completed', index + 1 < step);
            });
        }

        nextStep() {
            if (this.currentStep < 4) {
                this.updateProgress(this.currentStep + 1);
            }
        }
    }

    const progress = new CheckoutProgress();

    // ===== FORM VALIDATION ENHANCEMENT =====
    class FormValidator {
        constructor() {
            this.setupValidation();
        }

        setupValidation() {
            // Simplified validation for test mode
            const inputs = document.querySelectorAll('input, select');
            inputs.forEach(input => {
                input.addEventListener('input', () => this.clearErrors(input));
            });

            // Section validation
            this.setupSectionValidation();
        }

        validateField(field) {
            const isValid = this.checkFieldValidity(field);
            
            field.classList.remove('is-valid', 'is-invalid');
            field.classList.add(isValid ? 'is-valid' : 'is-invalid');

            this.updateFieldFeedback(field, isValid);
            return isValid;
        }

        checkFieldValidity(field) {
            if (!field.value.trim()) return false;

            switch (field.type) {
                case 'email':
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);
                case 'tel':
                    return /^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(field.value);
                default:
                    if (field.id === 'cpf') {
                        return this.validateCPF(field.value);
                    }
                    if (field.id === 'cep') {
                        return /^\d{5}-?\d{3}$/.test(field.value);
                    }
                    return field.checkValidity();
            }
        }

        validateCPF(cpf) {
            cpf = cpf.replace(/[^\d]/g, '');
            if (cpf.length !== 11) return false;
            
            // Basic CPF validation
            let sum = 0;
            for (let i = 0; i < 9; i++) {
                sum += parseInt(cpf.charAt(i)) * (10 - i);
            }
            let remainder = (sum * 10) % 11;
            if (remainder === 10 || remainder === 11) remainder = 0;
            if (remainder !== parseInt(cpf.charAt(9))) return false;

            sum = 0;
            for (let i = 0; i < 10; i++) {
                sum += parseInt(cpf.charAt(i)) * (11 - i);
            }
            remainder = (sum * 10) % 11;
            if (remainder === 10 || remainder === 11) remainder = 0;
            return remainder === parseInt(cpf.charAt(10));
        }

        updateFieldFeedback(field, isValid) {
            let feedback = field.parentNode.querySelector('.invalid-feedback');
            
            if (!isValid && !feedback) {
                feedback = document.createElement('div');
                feedback.className = 'invalid-feedback';
                field.parentNode.appendChild(feedback);
            }

            if (feedback) {
                feedback.textContent = isValid ? '' : this.getErrorMessage(field);
            }
        }

        getErrorMessage(field) {
            if (!field.value.trim()) return 'Este campo é obrigatório';
            
            switch (field.type) {
                case 'email': return 'Digite um email válido';
                case 'tel': return 'Digite um telefone válido no formato (11) 99999-9999';
                default:
                    if (field.id === 'cpf') return 'Digite um CPF válido';
                    if (field.id === 'cep') return 'Digite um CEP válido';
                    return 'Campo inválido';
            }
        }

        clearErrors(field) {
            field.classList.remove('is-invalid');
            if (field.value.trim()) {
                field.classList.add('is-valid');
            } else {
                field.classList.remove('is-valid');
            }
        }

        setupSectionValidation() {
            // Disable strict validation for test mode - just update progress
            const personalFields = ['nome', 'email', 'telefone', 'cpf'];
            personalFields.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (field) {
                    field.addEventListener('input', () => {
                        if (field.value.trim() && typeof window.checkoutProgress !== 'undefined') {
                            window.checkoutProgress.updateProgress(2);
                        }
                    });
                }
            });

            // Address section - less strict validation
            const addressFields = ['cep', 'endereco', 'numero', 'cidade'];
            addressFields.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (field) {
                    field.addEventListener('input', () => {
                        const hasBasicInfo = addressFields.some(id => {
                            const f = document.getElementById(id);
                            return f && f.value.trim();
                        });
                        
                        if (hasBasicInfo && typeof window.checkoutProgress !== 'undefined') {
                            window.checkoutProgress.updateProgress(3);
                        }
                    });
                }
            });
        }
    }

    // ===== CEP LOOKUP =====
    class CEPLookup {
        constructor() {
            this.setupCEPLookup();
        }

        setupCEPLookup() {
            const cepInput = document.getElementById('cep');
            const buscarBtn = document.getElementById('buscarCep');

            if (cepInput) {
                cepInput.addEventListener('blur', () => this.lookupCEP(cepInput.value));
                cepInput.addEventListener('input', (e) => {
                    // Format CEP as user types
                    let value = e.target.value.replace(/\D/g, '');
                    if (value.length > 5) {
                        value = value.replace(/^(\d{5})(\d{3})$/, '$1-$2');
                    }
                    e.target.value = value;
                });
            }

            if (buscarBtn) {
                buscarBtn.addEventListener('click', () => {
                    const cep = cepInput ? cepInput.value : '';
                    this.lookupCEP(cep);
                });
            }
        }

        async lookupCEP(cep) {
            cep = cep.replace(/\D/g, '');
            
            if (cep.length !== 8) return;

            const fields = ['endereco', 'bairro', 'cidade', 'estado'];
            
            // Show loading state
            fields.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (field) {
                    field.classList.add('loading');
                    field.disabled = true;
                }
            });

            try {
                const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                const data = await response.json();

                if (!data.erro) {
                    document.getElementById('endereco').value = data.logradouro || '';
                    document.getElementById('bairro').value = data.bairro || '';
                    document.getElementById('cidade').value = data.localidade || '';
                    document.getElementById('estado').value = data.uf || '';

                    // Focus on number field
                    document.getElementById('numero').focus();

                    this.showSuccess('CEP encontrado! Endereço preenchido automaticamente.');
                } else {
                    this.showError('CEP não encontrado. Preencha manualmente.');
                }
            } catch (error) {
                this.showError('Erro ao buscar CEP. Verifique sua conexão.');
            } finally {
                // Remove loading state
                fields.forEach(fieldId => {
                    const field = document.getElementById(fieldId);
                    if (field) {
                        field.classList.remove('loading');
                        field.disabled = false;
                    }
                });
            }
        }

        showSuccess(message) {
            this.showNotification(message, 'success');
        }

        showError(message) {
            this.showNotification(message, 'danger');
        }

        showNotification(message, type) {
            const notification = document.createElement('div');
            notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
            notification.style.cssText = 'top: 100px; right: 20px; z-index: 1060; min-width: 300px;';
            notification.innerHTML = `
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2"></i>
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            `;

            document.body.appendChild(notification);

            setTimeout(() => {
                notification.remove();
            }, 5000);
        }
    }

    // ===== PAYMENT METHOD HANDLING =====
    class PaymentHandler {
        constructor() {
            this.setupPaymentMethods();
        }

        setupPaymentMethods() {
            const paymentRadios = document.querySelectorAll('input[name="pagamento"]');
            const cartaoFields = document.getElementById('cartaoFields');

            paymentRadios.forEach(radio => {
                radio.addEventListener('change', () => {
                    try {
                        if (cartaoFields) {
                            cartaoFields.style.display = radio.value === 'cartao' ? 'block' : 'none';
                        }
                        
                        // Safely update progress only if progress object exists
                        if (typeof window.checkoutProgress !== 'undefined' && window.checkoutProgress.updateProgress) {
                            window.checkoutProgress.updateProgress(4);
                        }
                        
                        console.log('Payment method changed to:', radio.value);
                    } catch (error) {
                        console.error('Error in payment method change:', error);
                    }
                });
            });

            // Format credit card number
            const numeroCartao = document.getElementById('numeroCartao');
            if (numeroCartao) {
                numeroCartao.addEventListener('input', (e) => {
                    let value = e.target.value.replace(/\D/g, '');
                    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
                    e.target.value = value;
                });
            }

            // Format CVV
            const cvv = document.getElementById('cvv');
            if (cvv) {
                cvv.addEventListener('input', (e) => {
                    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
                });
            }
        }
    }

    // ===== ORDER SUMMARY ENHANCEMENT =====
    class OrderSummary {
        constructor() {
            this.updateSummary();
        }

        updateSummary() {
            if (typeof carrinho !== 'undefined' && carrinho.carrinho) {
                const items = carrinho.carrinho;
                const itemCount = items.reduce((total, item) => total + item.quantidade, 0);
                
                // Update item count badge
                const itemCountEl = document.getElementById('itemCount');
                if (itemCountEl) {
                    itemCountEl.textContent = `${itemCount} ${itemCount === 1 ? 'item' : 'itens'}`;
                }

                // Update order items display
                this.renderOrderItems(items);
            }
        }

        renderOrderItems(items) {
            const container = document.getElementById('orderItems');
            if (!container) return;

            if (items.length === 0) {
                container.innerHTML = `
                    <div class="text-center py-4 text-muted">
                        <i class="fas fa-shopping-cart fa-2x mb-2"></i>
                        <p>Nenhum item no carrinho</p>
                    </div>
                `;
                return;
            }

            container.innerHTML = items.map(item => `
                <div class="order-item d-flex align-items-center">
                    <img src="${item.imagem}" alt="${item.nome}" class="rounded me-3" style="width: 50px; height: 50px; object-fit: cover;">
                    <div class="flex-grow-1">
                        <h6 class="mb-1">${item.nome}</h6>
                        <small class="text-muted">
                            ${item.tamanho ? `Tamanho: ${item.tamanho}` : ''}
                            ${item.cor ? ` | Cor: ${item.cor}` : ''}
                        </small>
                        <div class="d-flex justify-content-between align-items-center mt-1">
                            <span class="text-primary fw-medium">${this.formatPrice(item.preco)}</span>
                            <span class="badge bg-light text-dark">x${item.quantidade}</span>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        formatPrice(price) {
            return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(price);
        }
    }

    // ===== INITIALIZE ALL COMPONENTS =====
    try {
        const validator = new FormValidator();
        const cepLookup = new CEPLookup();
        const paymentHandler = new PaymentHandler();
        const orderSummary = new OrderSummary();
        
        // Make progress available globally for payment handler
        window.checkoutProgress = progress;
        
        console.log('✅ Enhanced checkout initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing enhanced checkout:', error);
        // Continue execution even if there are errors
    }

    // ===== INPUT FORMATTING =====
    // Phone formatting
    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 11) {
                value = value.replace(/^(\d{2})(\d{4,5})(\d{4})$/, '($1) $2-$3');
            }
            e.target.value = value;
        });
    }

    // CPF formatting
    const cpfInput = document.getElementById('cpf');
    if (cpfInput) {
        cpfInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
            e.target.value = value;
        });
    }
});
