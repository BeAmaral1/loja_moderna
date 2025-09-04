// ===== INTEGRAÇÃO ASAAS PAYMENT =====
class AsaasPayment {
    constructor() {
        // Configurações do Asaas (SANDBOX - alterar para produção)
        this.apiUrl = 'https://sandbox.asaas.com/api/v3';
        this.apiKey = '$aact_YTU5YTE0M2M2N2I4MTliNzk0YTI5N2U5MzdjNWZmNDQ6OjAwMDAwMDAwMDAwMDAwNDI2NzI6OiRhYWNoXzRlZGI4OGM4LTBmN2QtNGI4Zi1hZmNiLTVhMzgyMzRhMGZhZQ==';
        this.webhookUrl = window.location.origin + '/backend/webhook-asaas.php';
        
        this.inicializar();
    }

    inicializar() {
        // Event listeners para os botões de pagamento
        const btnPix = document.getElementById('payWithPix');
        const btnBoleto = document.getElementById('payWithBoleto');
        const btnCartao = document.getElementById('payWithCard');

        if (btnPix) btnPix.addEventListener('click', () => this.processarPagamento('PIX'));
        if (btnBoleto) btnBoleto.addEventListener('click', () => this.processarPagamento('BOLETO'));
        if (btnCartao) btnCartao.addEventListener('click', () => this.processarPagamento('CREDIT_CARD'));

        // Listener para formulário de cartão
        const cardForm = document.getElementById('cardForm');
        if (cardForm) {
            cardForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.processarPagamentoCartao();
            });
        }
    }

    async processarPagamento(tipo) {
        try {
            // Mostrar loading
            this.mostrarLoading(true);

            // Obter dados do pedido
            const dadosPedido = this.obterDadosPedido();
            
            if (!dadosPedido) {
                throw new Error('Dados do pedido não encontrados');
            }

            // Criar cobrança no Asaas
            const cobranca = await this.criarCobranca(dadosPedido, tipo);
            
            if (cobranca.success) {
                // Redirecionar ou mostrar dados de pagamento
                this.processarResposta(cobranca.data, tipo);
            } else {
                throw new Error(cobranca.message || 'Erro ao processar pagamento');
            }

        } catch (error) {
            console.error('Erro no pagamento:', error);
            this.mostrarErro(error.message);
        } finally {
            this.mostrarLoading(false);
        }
    }

    obterDadosPedido() {
        // Obter dados do carrinho
        const carrinho = JSON.parse(localStorage.getItem('carrinho') || '[]');
        if (carrinho.length === 0) return null;

        // Obter dados do cliente do formulário
        const nome = document.getElementById('nome')?.value;
        const email = document.getElementById('email')?.value;
        const telefone = document.getElementById('telefone')?.value;
        const cpf = document.getElementById('cpf')?.value;

        if (!nome || !email || !telefone) {
            throw new Error('Preencha todos os campos obrigatórios');
        }

        // Calcular total
        const total = carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);

        return {
            cliente: { nome, email, telefone, cpf },
            itens: carrinho,
            total: total,
            pedidoId: 'PED-' + Date.now()
        };
    }

    async criarCobranca(dados, tipoPagamento) {
        const payload = {
            customer: {
                name: dados.cliente.nome,
                email: dados.cliente.email,
                phone: dados.cliente.telefone,
                cpfCnpj: dados.cliente.cpf
            },
            billingType: tipoPagamento,
            value: dados.total,
            dueDate: this.obterDataVencimento(tipoPagamento),
            description: `Pedido ${dados.pedidoId} - Moda Elegante`,
            externalReference: dados.pedidoId,
            postalService: false
        };

        // Configurações específicas por tipo de pagamento
        if (tipoPagamento === 'PIX') {
            payload.pixAddressKey = null; // Será gerado automaticamente
        }

        try {
            const response = await fetch('/backend/asaas-payment.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'create_payment',
                    data: payload
                })
            });

            return await response.json();
        } catch (error) {
            console.error('Erro na requisição:', error);
            return { success: false, message: 'Erro de conexão' };
        }
    }

    obterDataVencimento(tipo) {
        const hoje = new Date();
        let diasVencimento = 1; // PIX: 1 dia

        if (tipo === 'BOLETO') diasVencimento = 3;
        if (tipo === 'CREDIT_CARD') diasVencimento = 1;

        hoje.setDate(hoje.getDate() + diasVencimento);
        return hoje.toISOString().split('T')[0];
    }

    processarResposta(cobranca, tipo) {
        // Salvar dados do pagamento
        localStorage.setItem('ultimoPagamento', JSON.stringify({
            id: cobranca.id,
            tipo: tipo,
            valor: cobranca.value,
            status: cobranca.status,
            data: new Date().toISOString()
        }));

        switch (tipo) {
            case 'PIX':
                this.mostrarPix(cobranca);
                break;
            case 'BOLETO':
                this.mostrarBoleto(cobranca);
                break;
            case 'CREDIT_CARD':
                // Redirecionar para sucesso
                window.location.href = 'sucesso.html';
                break;
        }
    }

    mostrarPix(cobranca) {
        const modal = document.getElementById('pixModal') || this.criarModalPix();
        
        // Atualizar conteúdo do modal
        document.getElementById('pixQrCode').src = cobranca.encodedImage || '';
        document.getElementById('pixCode').textContent = cobranca.payload || '';
        document.getElementById('pixValue').textContent = formatarPreco(cobranca.value);
        
        // Mostrar modal
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();

        // Verificar status do pagamento
        this.verificarStatusPagamento(cobranca.id);
    }

    mostrarBoleto(cobranca) {
        const modal = document.getElementById('boletoModal') || this.criarModalBoleto();
        
        // Atualizar conteúdo
        document.getElementById('boletoLink').href = cobranca.bankSlipUrl || '';
        document.getElementById('boletoValue').textContent = formatarPreco(cobranca.value);
        document.getElementById('boletoDueDate').textContent = new Date(cobranca.dueDate).toLocaleDateString('pt-BR');
        
        // Mostrar modal
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
    }

    async verificarStatusPagamento(paymentId, tentativas = 0) {
        if (tentativas > 60) return; // Parar após 5 minutos

        try {
            const response = await fetch('/backend/asaas-payment.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'check_payment',
                    paymentId: paymentId
                })
            });

            const result = await response.json();
            
            if (result.success && result.data.status === 'RECEIVED') {
                // Pagamento confirmado
                this.pagarmentoConfirmado();
                return;
            }

            // Verificar novamente em 5 segundos
            setTimeout(() => {
                this.verificarStatusPagamento(paymentId, tentativas + 1);
            }, 5000);

        } catch (error) {
            console.error('Erro ao verificar status:', error);
        }
    }

    pagarmentoConfirmado() {
        // Limpar carrinho
        localStorage.removeItem('carrinho');
        
        // Mostrar sucesso
        alert('Pagamento confirmado! Redirecionando...');
        window.location.href = 'sucesso.html';
    }

    criarModalPix() {
        const modal = document.createElement('div');
        modal.id = 'pixModal';
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-qrcode text-primary me-2"></i>
                            Pagamento via PIX
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body text-center">
                        <div class="mb-4">
                            <img id="pixQrCode" src="" alt="QR Code PIX" class="img-fluid" style="max-width: 200px;">
                        </div>
                        <div class="mb-3">
                            <strong>Valor: R$ <span id="pixValue">0,00</span></strong>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Código PIX Copia e Cola:</label>
                            <div class="input-group">
                                <input type="text" id="pixCode" class="form-control" readonly>
                                <button class="btn btn-outline-primary" onclick="navigator.clipboard.writeText(document.getElementById('pixCode').value)">
                                    <i class="fas fa-copy"></i>
                                </button>
                            </div>
                        </div>
                        <div class="alert alert-info">
                            <i class="fas fa-info-circle me-2"></i>
                            Após o pagamento, você será redirecionado automaticamente.
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        return modal;
    }

    criarModalBoleto() {
        const modal = document.createElement('div');
        modal.id = 'boletoModal';
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-barcode text-primary me-2"></i>
                            Pagamento via Boleto
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body text-center">
                        <div class="mb-4">
                            <i class="fas fa-file-invoice fa-4x text-primary"></i>
                        </div>
                        <div class="mb-3">
                            <strong>Valor: R$ <span id="boletoValue">0,00</span></strong>
                        </div>
                        <div class="mb-3">
                            <strong>Vencimento: <span id="boletoDueDate">--/--/----</span></strong>
                        </div>
                        <div class="mb-4">
                            <a id="boletoLink" href="#" target="_blank" class="btn btn-primary btn-lg">
                                <i class="fas fa-download me-2"></i>
                                Baixar Boleto
                            </a>
                        </div>
                        <div class="alert alert-warning">
                            <i class="fas fa-exclamation-triangle me-2"></i>
                            O boleto pode levar até 2 dias úteis para ser compensado.
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        return modal;
    }

    mostrarLoading(mostrar) {
        const loading = document.getElementById('paymentLoading');
        if (loading) {
            loading.style.display = mostrar ? 'flex' : 'none';
        }
    }

    mostrarErro(mensagem) {
        const alert = document.createElement('div');
        alert.className = 'alert alert-danger alert-dismissible fade show position-fixed';
        alert.style.cssText = 'top: 100px; right: 20px; z-index: 1060; min-width: 300px;';
        alert.innerHTML = `
            <i class="fas fa-exclamation-circle me-2"></i>
            ${mensagem}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.body.appendChild(alert);

        // Remover após 5 segundos
        setTimeout(() => {
            if (alert.parentNode) {
                alert.parentNode.removeChild(alert);
            }
        }, 5000);
    }
}

// Função auxiliar para formatar preço
function formatarPreco(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    window.asaasPayment = new AsaasPayment();
});
