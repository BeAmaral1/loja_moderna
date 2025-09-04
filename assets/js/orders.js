// ===== SISTEMA DE PEDIDOS =====
class SistemaPedidos {
    constructor() {
        this.pedidos = this.carregarPedidos();
        this.init();
    }

    // Carregar pedidos do localStorage
    carregarPedidos() {
        const pedidos = localStorage.getItem('modaElegante_pedidos');
        return pedidos ? JSON.parse(pedidos) : [];
    }

    // Salvar pedidos no localStorage
    salvarPedidos() {
        localStorage.setItem('modaElegante_pedidos', JSON.stringify(this.pedidos));
    }

    // Adicionar novo pedido
    adicionarPedido(dadosPedido) {
        const pedido = {
            id: dadosPedido.id,
            data: new Date().toISOString(),
            cliente: {
                nome: dadosPedido.cliente.nome,
                email: dadosPedido.cliente.email,
                telefone: dadosPedido.cliente.telefone,
                cpf: dadosPedido.cliente.cpf.replace(/\D/g, ''), // Apenas números
                endereco: dadosPedido.cliente.endereco
            },
            itens: dadosPedido.itens,
            total: dadosPedido.total,
            formaPagamento: dadosPedido.formaPagamento,
            status: 'Processando'
        };

        this.pedidos.push(pedido);
        this.salvarPedidos();
        return pedido;
    }

    // Buscar pedidos por CPF
    buscarPedidosPorCPF(cpf) {
        const cpfLimpo = cpf.replace(/\D/g, '');
        return this.pedidos.filter(pedido => pedido.cliente.cpf === cpfLimpo);
    }

    // Obter status do pedido
    obterStatusPedido(id) {
        const pedido = this.pedidos.find(p => p.id === id);
        return pedido ? pedido.status : null;
    }

    // Atualizar status do pedido
    atualizarStatusPedido(id, novoStatus) {
        const pedido = this.pedidos.find(p => p.id === id);
        if (pedido) {
            pedido.status = novoStatus;
            this.salvarPedidos();
            return true;
        }
        return false;
    }

    // Inicializar sistema
    init() {
        this.configurarFormulario();
        this.aplicarMascaraCPF();
    }

    // Configurar formulário de consulta
    configurarFormulario() {
        const form = document.getElementById('lookupForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.consultarPedidos();
            });
        }
    }

    // Aplicar máscara no CPF
    aplicarMascaraCPF() {
        const cpfInput = document.getElementById('cpfLookup');
        if (cpfInput) {
            cpfInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                e.target.value = value;
            });
        }
    }

    // Consultar pedidos
    consultarPedidos() {
        const cpfInputEl = document.getElementById('cpfLookup');
        if (!cpfInputEl) return;
        const cpf = cpfInputEl.value;
        const pedidos = this.buscarPedidosPorCPF(cpf);

        if (pedidos.length > 0) {
            this.exibirPedidos(pedidos);
        } else {
            this.exibirMensagemSemPedidos();
        }
    }

    // Exibir lista de pedidos
    exibirPedidos(pedidos) {
        const lookupCard = document.getElementById('lookupCard');
        const ordersSection = document.getElementById('ordersSection');
        const ordersList = document.getElementById('ordersList');
        const noOrdersMessage = document.getElementById('noOrdersMessage');

        if (!ordersSection || !ordersList) return;

        // Ocultar formulário e mostrar pedidos
        if (lookupCard) lookupCard.style.display = 'none';
        ordersSection.style.display = 'block';
        if (noOrdersMessage) noOrdersMessage.style.display = 'none';

        // Ordenar pedidos por data (mais recente primeiro)
        pedidos.sort((a, b) => new Date(b.data) - new Date(a.data));

        // Renderizar pedidos
        ordersList.innerHTML = pedidos.map(pedido => this.renderizarPedido(pedido)).join('');
    }

    // Exibir mensagem quando não há pedidos
    exibirMensagemSemPedidos() {
        const lookupCard = document.getElementById('lookupCard');
        const ordersSection = document.getElementById('ordersSection');
        const ordersList = document.getElementById('ordersList');
        const noOrdersMessage = document.getElementById('noOrdersMessage');

        if (!ordersSection || !ordersList || !noOrdersMessage) return;

        if (lookupCard) lookupCard.style.display = 'none';
        ordersSection.style.display = 'block';
        ordersList.innerHTML = '';
        noOrdersMessage.style.display = 'block';
    }

    // Renderizar pedido individual
    renderizarPedido(pedido) {
        const data = new Date(pedido.data).toLocaleString('pt-BR');
        const statusClass = this.obterClasseStatus(pedido.status);
        const statusIcon = this.obterIconeStatus(pedido.status);

        return `
            <div class="card mb-4 shadow-sm">
                <div class="card-header bg-light">
                    <div class="row align-items-center">
                        <div class="col-md-6">
                            <h5 class="mb-0">
                                <i class="fas fa-shopping-bag text-primary me-2"></i>
                                Pedido #${pedido.id}
                            </h5>
                            <small class="text-muted">
                                <i class="fas fa-calendar me-1"></i>${data}
                            </small>
                        </div>
                        <div class="col-md-6 text-md-end">
                            <span class="badge ${statusClass} fs-6">
                                <i class="${statusIcon} me-1"></i>${pedido.status}
                            </span>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-8">
                            <h6 class="fw-bold mb-3">Produtos:</h6>
                            ${pedido.itens.map(item => `
                                <div class="d-flex align-items-center mb-2">
                                    <img src="${item.imagem}" alt="${item.nome}" 
                                         class="rounded me-3" style="width: 50px; height: 50px; object-fit: cover;">
                                    <div class="flex-grow-1">
                                        <div class="fw-medium">${item.nome}</div>
                                        <small class="text-muted">
                                            ${item.tamanho ? `Tamanho: ${item.tamanho} | ` : ''}
                                            ${item.cor ? `Cor: ${item.cor} | ` : ''}
                                            Qtd: ${item.quantidade}
                                        </small>
                                    </div>
                                    <div class="text-end">
                                        <div class="fw-bold">${formatarPreco(item.preco * item.quantidade)}</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        <div class="col-md-4">
                            <div class="bg-light p-3 rounded">
                                <h6 class="fw-bold mb-3">Resumo do Pedido</h6>
                                <div class="d-flex justify-content-between mb-2">
                                    <span>Subtotal:</span>
                                    <span>${formatarPreco(pedido.total)}</span>
                                </div>
                                <div class="d-flex justify-content-between mb-2">
                                    <span>Frete:</span>
                                    <span class="text-success">Grátis</span>
                                </div>
                                <hr>
                                <div class="d-flex justify-content-between fw-bold">
                                    <span>Total:</span>
                                    <span class="text-primary">${formatarPreco(pedido.total)}</span>
                                </div>
                                <div class="mt-3">
                                    <small class="text-muted">
                                        <i class="fas fa-credit-card me-1"></i>
                                        ${this.obterNomeFormaPagamento(pedido.formaPagamento)}
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="row mt-4">
                        <div class="col-md-6">
                            <h6 class="fw-bold mb-2">Endereço de Entrega:</h6>
                            <address class="text-muted mb-0">
                                ${pedido.cliente.endereco.rua}, ${pedido.cliente.endereco.numero}<br>
                                ${pedido.cliente.endereco.complemento ? pedido.cliente.endereco.complemento + '<br>' : ''}
                                ${pedido.cliente.endereco.bairro} - ${pedido.cliente.endereco.cidade}/${pedido.cliente.endereco.estado}<br>
                                CEP: ${pedido.cliente.endereco.cep}
                            </address>
                        </div>
                        <div class="col-md-6">
                            <div class="d-grid gap-2">
                                <button class="btn btn-outline-primary" onclick="rastrearPedido('${pedido.id}')">
                                    <i class="fas fa-truck me-2"></i>Rastrear Pedido
                                </button>
                                <a href="https://wa.me/5551997002031?text=Olá,%20gostaria%20de%20informações%20sobre%20o%20pedido%20%23${pedido.id}" 
                                   class="btn btn-outline-success" target="_blank">
                                    <i class="fab fa-whatsapp me-2"></i>Falar no WhatsApp
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Obter classe CSS do status
    obterClasseStatus(status) {
        const classes = {
            'Processando': 'bg-warning text-dark',
            'Confirmado': 'bg-info text-white',
            'Enviado': 'bg-primary text-white',
            'Entregue': 'bg-success text-white',
            'Cancelado': 'bg-danger text-white'
        };
        return classes[status] || 'bg-secondary text-white';
    }

    // Obter ícone do status
    obterIconeStatus(status) {
        const icones = {
            'Processando': 'fas fa-clock',
            'Confirmado': 'fas fa-check',
            'Enviado': 'fas fa-truck',
            'Entregue': 'fas fa-check-circle',
            'Cancelado': 'fas fa-times-circle'
        };
        return icones[status] || 'fas fa-info-circle';
    }

    // Obter nome da forma de pagamento
    obterNomeFormaPagamento(forma) {
        const formas = {
            'pix': 'PIX',
            'boleto': 'Boleto Bancário',
            'cartao': 'Cartão de Crédito'
        };
        return formas[forma] || forma;
    }
}

// ===== FUNÇÕES GLOBAIS =====

// Voltar para consulta
function voltarConsulta() {
    const lookupCard = document.getElementById('lookupCard');
    const ordersSection = document.getElementById('ordersSection');
    
    if (lookupCard) lookupCard.style.display = 'block';
    if (ordersSection) ordersSection.style.display = 'none';
    
    // Limpar campo CPF
    const cpfLookup = document.getElementById('cpfLookup');
    if (cpfLookup) cpfLookup.value = '';
}

// Rastrear pedido (simulação)
function rastrearPedido(pedidoId) {
    alert(`Funcionalidade de rastreamento em desenvolvimento.\n\nPedido: #${pedidoId}\n\nEm breve você poderá acompanhar seu pedido em tempo real!`);
}

// ===== INICIALIZAÇÃO =====
let sistemaPedidos;

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar apenas se elementos-chave da página de pedidos existirem
    const hasOrdersUI = document.getElementById('lookupForm') || document.getElementById('ordersSection') || document.getElementById('ordersList');
    if (!hasOrdersUI) {
        return;
    }
    sistemaPedidos = new SistemaPedidos();
    // Exportar após inicialização
    if (typeof window !== 'undefined') {
        window.sistemaPedidos = sistemaPedidos;
    }
    console.log('📦 Sistema de Pedidos carregado!');
});
