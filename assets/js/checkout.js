// ===== CHECKOUT FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== ELEMENTOS DO DOM =====
    const checkoutForm = document.getElementById('checkoutForm');
    const orderItems = document.getElementById('orderItems');
    const subtotalElement = document.getElementById('subtotal');
    const freteElement = document.getElementById('frete');
    const totalElement = document.getElementById('total');
    const cepInput = document.getElementById('cep');
    const cartaoFields = document.getElementById('cartaoFields');
    const paymentRadios = document.querySelectorAll('input[name="pagamento"]');

    // Sair se não for a página de checkout (elementos essenciais ausentes)
    if (!checkoutForm || !orderItems || !subtotalElement || !freteElement || !totalElement) {
        return;
    }

    // ===== VERIFICAR SE HÁ ITENS NO CARRINHO =====
    // Comentado para modo teste - permitir checkout mesmo com carrinho vazio
    /*
    if (!carrinho || carrinho.carrinho.length === 0) {
        // Mostrar alerta e redirecionar após 3 segundos
        mostrarAlerta('Seu carrinho está vazio! Redirecionando para o catálogo...', 'warning');
        setTimeout(() => {
            window.location.href = 'catalogo.html';
        }, 3000);
        return;
    }
    */

    // ===== RENDERIZAR RESUMO DO PEDIDO =====
    function renderizarResumo() {
        const itens = carrinho && carrinho.carrinho ? carrinho.carrinho : [];
        
        if (itens.length === 0) {
            orderItems.innerHTML = `
                <div class="text-center py-4 text-muted">
                    <i class="fas fa-info-circle fa-2x mb-2"></i>
                    <p>Modo teste - Carrinho simulado</p>
                </div>
            `;
            
            // Valores simulados para teste
            if (subtotalElement) subtotalElement.textContent = 'R$ 150,00';
            if (freteElement) freteElement.textContent = 'R$ 15,90';
            if (totalElement) totalElement.textContent = 'R$ 165,90';
            return;
        }
        
        orderItems.innerHTML = itens.map(item => `
            <div class="order-item d-flex align-items-center mb-3">
                <img src="${item.imagem}" alt="${item.nome}" class="rounded me-3" style="width: 60px; height: 60px; object-fit: cover;">
                <div class="flex-grow-1">
                    <h6 class="mb-1">${item.nome}</h6>
                    <small class="text-muted">
                        ${item.tamanho ? `Tamanho: ${item.tamanho}` : ''}
                        ${item.cor ? ` | Cor: ${item.cor}` : ''}
                    </small>
                    <div class="fw-bold text-primary">${formatarPreco(item.preco)} x ${item.quantidade}</div>
                </div>
            </div>
        `).join('');

        const subtotal = carrinho.obterTotal();
        const frete = subtotal >= 200 ? 0 : 15.90;
        const total = subtotal + frete;

        subtotalElement.textContent = formatarPreco(subtotal);
        freteElement.textContent = frete === 0 ? 'Grátis' : formatarPreco(frete);
        freteElement.className = frete === 0 ? 'text-success' : '';
        totalElement.textContent = formatarPreco(total);
    }

    // ===== BUSCAR CEP =====
    function buscarCEP(cep) {
        const cepLimpo = cep.replace(/\D/g, '');
        
        if (cepLimpo.length === 8) {
            fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
                .then(response => response.json())
                .then(data => {
                    if (!data.erro) {
                        document.getElementById('endereco').value = data.logradouro;
                        document.getElementById('bairro').value = data.bairro;
                        document.getElementById('cidade').value = data.localidade;
                        document.getElementById('estado').value = data.uf;
                        document.getElementById('numero').focus();
                    }
                })
                .catch(error => {
                    console.error('Erro ao buscar CEP:', error);
                });
        }
    }

    // ===== MÁSCARAS DE INPUT =====
    function aplicarMascaras() {
        // Máscara CPF
        const cpfInput = document.getElementById('cpf');
        if (cpfInput) {
            cpfInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                e.target.value = value;
            });
        }

        // Máscara Telefone
        const telefoneInput = document.getElementById('telefone');
        if (telefoneInput) {
            telefoneInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                value = value.replace(/(\d{2})(\d)/, '($1) $2');
                value = value.replace(/(\d)(\d{4})$/, '$1-$2');
                e.target.value = value;
            });
        }

        // Máscara CEP
        if (cepInput) {
            cepInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                value = value.replace(/(\d{5})(\d)/, '$1-$2');
                e.target.value = value;
                
                if (value.length === 9) {
                    buscarCEP(value);
                }
            });
        }

        // Máscara Cartão de Crédito
        const numeroCartaoInput = document.getElementById('numeroCartao');
        if (numeroCartaoInput) {
            numeroCartaoInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                value = value.replace(/(\d{4})(\d)/, '$1 $2');
                value = value.replace(/(\d{4})(\d)/, '$1 $2');
                value = value.replace(/(\d{4})(\d)/, '$1 $2');
                e.target.value = value;
            });
        }

        // Máscara CVV
        const cvvInput = document.getElementById('cvv');
        if (cvvInput) {
            cvvInput.addEventListener('input', function(e) {
                e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
            });
        }
    }

    // ===== CONTROLE DE FORMA DE PAGAMENTO =====
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const numeroCartao = document.getElementById('numeroCartao');
            const cvv = document.getElementById('cvv');
            const nomeCartao = document.getElementById('nomeCartao');
            const mesVencimento = document.getElementById('mesVencimento');
            const anoVencimento = document.getElementById('anoVencimento');
            if (this.value === 'cartao') {
                if (cartaoFields) cartaoFields.style.display = 'block';
                // Tornar campos obrigatórios
                if (numeroCartao) numeroCartao.required = true;
                if (cvv) cvv.required = true;
                if (nomeCartao) nomeCartao.required = true;
                if (mesVencimento) mesVencimento.required = true;
                if (anoVencimento) anoVencimento.required = true;
            } else {
                if (cartaoFields) cartaoFields.style.display = 'none';
                // Remover obrigatoriedade
                if (numeroCartao) numeroCartao.required = false;
                if (cvv) cvv.required = false;
                if (nomeCartao) nomeCartao.required = false;
                if (mesVencimento) mesVencimento.required = false;
                if (anoVencimento) anoVencimento.required = false;
            }
        });
    });

    // ===== VALIDAÇÃO DO FORMULÁRIO =====
    function validarFormulario() {
        const requiredFields = checkoutForm.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('is-invalid');
                isValid = false;
            } else {
                field.classList.remove('is-invalid');
            }
        });

        // Validar CPF
        const cpf = document.getElementById('cpf').value.replace(/\D/g, '');
        if (cpf.length !== 11) {
            document.getElementById('cpf').classList.add('is-invalid');
            isValid = false;
        }

        // Validar CEP
        const cep = document.getElementById('cep').value.replace(/\D/g, '');
        if (cep.length !== 8) {
            document.getElementById('cep').classList.add('is-invalid');
            isValid = false;
        }

        return isValid;
    }

    // ===== SUBMISSÃO DO FORMULÁRIO =====
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();

        if (!validarFormulario()) {
            mostrarAlerta('Por favor, preencha todos os campos obrigatórios.', 'danger');
            return;
        }

        // Simular processamento
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Processando...';
        submitBtn.disabled = true;

        setTimeout(() => {
            // Simular sucesso
            const pedidoId = Math.floor(Math.random() * 100000);
            const formaPagamento = document.querySelector('input[name="pagamento"]:checked').value;
            
            // Salvar pedido no sistema
            salvarPedido(pedidoId, formaPagamento);
            
            // Enviar pedido para WhatsApp do dono ANTES de redirecionar
            enviarPedidoWhatsApp(pedidoId, formaPagamento);
            
            // Aguardar um momento para garantir que o WhatsApp abra
            setTimeout(() => {
                // Limpar carrinho
                carrinho.limparCarrinho();
                
                // Redirecionar para página de sucesso
                window.location.href = `sucesso.html?pedido=${pedidoId}&pagamento=${formaPagamento}`;
            }, 1500);
        }, 3000);
    });

    // ===== SALVAR PEDIDO NO SISTEMA =====
    function salvarPedido(pedidoId, formaPagamento) {
        // Obter dados do formulário
        const dadosCliente = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            telefone: document.getElementById('telefone').value,
            cpf: document.getElementById('cpf').value,
            endereco: {
                cep: document.getElementById('cep').value,
                rua: document.getElementById('endereco').value,
                numero: document.getElementById('numero').value,
                complemento: document.getElementById('complemento').value,
                bairro: document.getElementById('bairro').value,
                cidade: document.getElementById('cidade').value,
                estado: document.getElementById('estado').value
            }
        };

        // Obter itens do carrinho
        const itensCarrinho = carrinho.carrinho || [];
        const subtotal = carrinho.obterTotal();
        const frete = subtotal >= 200 ? 0 : 15.90;
        const total = subtotal + frete;

        // Criar objeto do pedido
        const dadosPedido = {
            id: pedidoId,
            cliente: dadosCliente,
            itens: itensCarrinho,
            subtotal: subtotal,
            frete: frete,
            total: total,
            formaPagamento: formaPagamento
        };

        // Salvar no localStorage
        let pedidos = JSON.parse(localStorage.getItem('modaElegante_pedidos') || '[]');
        pedidos.push({
            id: pedidoId,
            data: new Date().toISOString(),
            cliente: {
                nome: dadosCliente.nome,
                email: dadosCliente.email,
                telefone: dadosCliente.telefone,
                cpf: dadosCliente.cpf.replace(/\D/g, ''),
                endereco: dadosCliente.endereco
            },
            itens: itensCarrinho,
            total: total,
            formaPagamento: formaPagamento,
            status: 'Processando'
        });
        
        localStorage.setItem('modaElegante_pedidos', JSON.stringify(pedidos));
    }

    // ===== ENVIAR PEDIDO PARA WHATSAPP =====
    function enviarPedidoWhatsApp(pedidoId, formaPagamento) {
        // Obter dados do formulário
        const dadosCliente = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            telefone: document.getElementById('telefone').value,
            cpf: document.getElementById('cpf').value,
            endereco: {
                cep: document.getElementById('cep').value,
                rua: document.getElementById('endereco').value,
                numero: document.getElementById('numero').value,
                complemento: document.getElementById('complemento').value,
                bairro: document.getElementById('bairro').value,
                cidade: document.getElementById('cidade').value,
                estado: document.getElementById('estado').value
            }
        };

        // Obter itens do carrinho
        const itensCarrinho = carrinho.carrinho || [];
        const subtotal = carrinho.obterTotal();
        const frete = subtotal >= 200 ? 0 : 15.90;
        const total = subtotal + frete;

        // Montar mensagem do WhatsApp
        let mensagem = `🛍️ *NOVO PEDIDO - MODA ELEGANTE*\n\n`;
        mensagem += `📋 *Pedido:* #${pedidoId}\n`;
        mensagem += `📅 *Data:* ${new Date().toLocaleString('pt-BR')}\n\n`;
        
        mensagem += `👤 *DADOS DO CLIENTE:*\n`;
        mensagem += `• *Nome:* ${dadosCliente.nome}\n`;
        mensagem += `• *Email:* ${dadosCliente.email}\n`;
        mensagem += `• *Telefone:* ${dadosCliente.telefone}\n`;
        mensagem += `• *CPF:* ${dadosCliente.cpf}\n\n`;
        
        mensagem += `📍 *ENDEREÇO DE ENTREGA:*\n`;
        mensagem += `• ${dadosCliente.endereco.rua}, ${dadosCliente.endereco.numero}\n`;
        if (dadosCliente.endereco.complemento) {
            mensagem += `• *Complemento:* ${dadosCliente.endereco.complemento}\n`;
        }
        mensagem += `• ${dadosCliente.endereco.bairro} - ${dadosCliente.endereco.cidade}/${dadosCliente.endereco.estado}\n`;
        mensagem += `• *CEP:* ${dadosCliente.endereco.cep}\n\n`;
        
        mensagem += `🛒 *PRODUTOS:*\n`;
        itensCarrinho.forEach(item => {
            mensagem += `• *${item.nome}*\n`;
            if (item.tamanho) mensagem += `  Tamanho: ${item.tamanho}\n`;
            if (item.cor) mensagem += `  Cor: ${item.cor}\n`;
            mensagem += `  Qtd: ${item.quantidade} x ${formatarPreco(item.preco)}\n`;
            mensagem += `  Subtotal: ${formatarPreco(item.preco * item.quantidade)}\n\n`;
        });
        
        mensagem += `💰 *RESUMO FINANCEIRO:*\n`;
        mensagem += `• *Subtotal:* ${formatarPreco(subtotal)}\n`;
        mensagem += `• *Frete:* ${frete === 0 ? 'GRÁTIS' : formatarPreco(frete)}\n`;
        mensagem += `• *TOTAL:* ${formatarPreco(total)}\n\n`;
        
        const formasPagamento = {
            'pix': '💳 PIX',
            'boleto': '🧾 Boleto Bancário',
            'cartao': '💳 Cartão de Crédito'
        };
        mensagem += `💳 *FORMA DE PAGAMENTO:* ${formasPagamento[formaPagamento] || formaPagamento}\n\n`;
        
        mensagem += `📱 Pedido gerado automaticamente pelo site da Moda Elegante`;

        // Número do WhatsApp do dono (pode ser configurado)
        const numeroWhatsApp = '5551997002031';
        
        // Tentar enviar via backend primeiro
        enviarViaBackend(mensagem, numeroWhatsApp, pedidoId)
            .then(success => {
                if (success) {
                    console.log('✅ Pedido enviado via backend');
                } else {
                    // Fallback: abrir WhatsApp Web
                    abrirWhatsAppWeb(numeroWhatsApp, mensagem);
                }
            })
            .catch(() => {
                // Fallback: abrir WhatsApp Web
                abrirWhatsAppWeb(numeroWhatsApp, mensagem);
            });
    }

    // ===== ABRIR WHATSAPP WEB (FALLBACK) =====
    function abrirWhatsAppWeb(numeroWhatsApp, mensagem) {
        const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
        
        // Abrir em nova aba
        const novaAba = window.open(url, '_blank');
        
        if (!novaAba) {
            // Se popup foi bloqueado, mostrar link
            mostrarAlerta(`
                <div class="text-center">
                    <p>Para finalizar o pedido, clique no link abaixo:</p>
                    <a href="${url}" target="_blank" class="btn btn-success">
                        <i class="fab fa-whatsapp me-2"></i>Enviar Pedido via WhatsApp
                    </a>
                </div>
            `, 'info');
        }
        
        console.log('📱 WhatsApp Web aberto como fallback');
    }

    // ===== ENVIAR VIA BACKEND =====
    function enviarViaBackend(mensagem, numeroWhatsApp, pedidoId) {
        return new Promise((resolve, reject) => {
            // Obter dados completos do pedido
            const dadosCompletos = {
                pedido_id: pedidoId,
                cliente: {
                    nome: document.getElementById('nome').value,
                    email: document.getElementById('email').value,
                    telefone: document.getElementById('telefone').value,
                    cpf: document.getElementById('cpf').value,
                    endereco: {
                        cep: document.getElementById('cep').value,
                        rua: document.getElementById('endereco').value,
                        numero: document.getElementById('numero').value,
                        complemento: document.getElementById('complemento').value,
                        bairro: document.getElementById('bairro').value,
                        cidade: document.getElementById('cidade').value,
                        estado: document.getElementById('estado').value
                    }
                },
                itens: carrinho.carrinho || [],
                total: carrinho.obterTotal(),
                forma_pagamento: document.querySelector('input[name="pagamento"]:checked').value
            };

            // Enviar para backend via fetch
            fetch('backend/whatsapp-sender.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    acao: 'enviar_pedido',
                    numero: numeroWhatsApp,
                    mensagem: mensagem,
                    dados_pedido: dadosCompletos
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    console.log('✅ Pedido enviado via backend');
                    resolve(true);
                } else {
                    console.log('⚠️ Backend falhou, usando fallback');
                    resolve(false);
                }
            })
            .catch(error => {
                console.log('❌ Erro no backend, usando fallback:', error);
                resolve(false);
            });
        });
    }

    // ===== SALVAR PEDIDO LOCAL (FALLBACK) =====
    function salvarPedidoLocal(dadosPedido, mensagem, numeroWhatsApp) {
        const pedidosLocal = JSON.parse(localStorage.getItem('pedidos_pendentes_envio') || '[]');
        
        pedidosLocal.push({
            id: Date.now(),
            dados_pedido: dadosPedido,
            mensagem: mensagem,
            numero_whatsapp: numeroWhatsApp,
            timestamp: new Date().toISOString(),
            status: 'pendente_backend',
            tentativas: 0
        });
        
        localStorage.setItem('pedidos_pendentes_envio', JSON.stringify(pedidosLocal));
        
        // Tentar reenviar periodicamente
        setTimeout(() => {
            tentarReenviarPendentes();
        }, 30000); // Tentar novamente em 30 segundos
    }

    // ===== TENTAR REENVIAR PENDENTES =====
    function tentarReenviarPendentes() {
        const pedidosPendentes = JSON.parse(localStorage.getItem('pedidos_pendentes_envio') || '[]');
        const pendentes = pedidosPendentes.filter(p => p.status === 'pendente_backend' && p.tentativas < 5);
        
        pendentes.forEach(pedido => {
            fetch('backend/whatsapp-sender.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    acao: 'enviar_pedido',
                    numero: pedido.numero_whatsapp,
                    mensagem: pedido.mensagem,
                    dados_pedido: pedido.dados_pedido
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    pedido.status = 'enviado';
                    pedido.data_envio = new Date().toISOString();
                    console.log('✅ Pedido pendente enviado com sucesso');
                } else {
                    pedido.tentativas++;
                }
                localStorage.setItem('pedidos_pendentes_envio', JSON.stringify(pedidosPendentes));
            })
            .catch(() => {
                pedido.tentativas++;
                localStorage.setItem('pedidos_pendentes_envio', JSON.stringify(pedidosPendentes));
            });
        });
    }

    // ===== ENVIAR NOTIFICAÇÃO POR EMAIL =====
    function enviarNotificacaoEmail(mensagem, numeroWhatsApp) {
        const emailData = {
            to: 'dono@modaelegante.com.br',
            subject: '🛍️ Novo Pedido Recebido - Moda Elegante',
            body: mensagem.replace(/\n/g, '<br>') + `<br><br><strong>WhatsApp:</strong> ${numeroWhatsApp}`,
            timestamp: new Date().toISOString(),
            priority: 'high'
        };
        
        // Salvar email para envio
        const emailsParaEnviar = JSON.parse(localStorage.getItem('emailsParaEnviar') || '[]');
        emailsParaEnviar.push(emailData);
        localStorage.setItem('emailsParaEnviar', JSON.stringify(emailsParaEnviar));
        
        // Simular envio via EmailJS ou similar
        fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                service_id: 'default_service',
                template_id: 'template_pedido',
                user_id: 'user_id',
                template_params: {
                    to_email: emailData.to,
                    subject: emailData.subject,
                    message: emailData.body,
                    whatsapp: numeroWhatsApp
                }
            })
        }).catch(() => {
            console.log('📧 Email salvo para envio posterior');
        });
    }

    // ===== ENVIAR VIA WEBHOOK =====
    function enviarViaWebhook(mensagem, numeroWhatsApp) {
        const webhookData = {
            type: 'novo_pedido',
            whatsapp_number: numeroWhatsApp,
            message: mensagem,
            timestamp: new Date().toISOString(),
            source: 'moda_elegante_website'
        };

        // Tentar enviar para webhook (Zapier, Make.com, etc)
        fetch('https://hooks.zapier.com/hooks/catch/YOUR_WEBHOOK_ID/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(webhookData)
        }).catch(() => {
            // Salvar para tentativa posterior
            const webhooksParaEnviar = JSON.parse(localStorage.getItem('webhooksParaEnviar') || '[]');
            webhooksParaEnviar.push(webhookData);
            localStorage.setItem('webhooksParaEnviar', JSON.stringify(webhooksParaEnviar));
            console.log('🔗 Webhook salvo para envio posterior');
        });
    }

    // ===== SALVAR NA FILA DE ENVIO =====
    function salvarNaFilaEnvio(mensagem, numeroWhatsApp) {
        const filaEnvio = JSON.parse(localStorage.getItem('filaEnvioWhatsApp') || '[]');
        
        const novoItem = {
            id: Date.now(),
            numero: numeroWhatsApp,
            mensagem: mensagem,
            timestamp: new Date().toISOString(),
            status: 'pendente',
            tentativas: 0,
            metodo_preferido: 'whatsapp_business_api'
        };
        
        filaEnvio.push(novoItem);
        localStorage.setItem('filaEnvioWhatsApp', JSON.stringify(filaEnvio));
        
        // Tentar processar a fila
        processarFilaEnvio();
    }

    // ===== PROCESSAR FILA DE ENVIO =====
    function processarFilaEnvio() {
        const fila = JSON.parse(localStorage.getItem('filaEnvioWhatsApp') || '[]');
        const itensPendentes = fila.filter(item => item.status === 'pendente' && item.tentativas < 3);
        
        itensPendentes.forEach(item => {
            // Simular envio via WhatsApp Business API
            enviarViaWhatsAppBusinessAPI(item)
                .then(() => {
                    item.status = 'enviado';
                    item.data_envio = new Date().toISOString();
                })
                .catch(() => {
                    item.tentativas++;
                    if (item.tentativas >= 3) {
                        item.status = 'falhou';
                        // Fallback: salvar para envio manual
                        salvarParaEnvioManual(item);
                    }
                });
        });
        
        localStorage.setItem('filaEnvioWhatsApp', JSON.stringify(fila));
    }

    // ===== WHATSAPP BUSINESS API (SIMULADO) =====
    async function enviarViaWhatsAppBusinessAPI(item) {
        // Esta função simularia o envio via WhatsApp Business API
        // Em produção, seria necessário um backend com credenciais válidas
        
        const apiData = {
            messaging_product: 'whatsapp',
            to: item.numero,
            type: 'text',
            text: {
                body: item.mensagem
            }
        };

        // Simular chamada para API do WhatsApp Business
        return new Promise((resolve, reject) => {
            // Simular delay de rede
            setTimeout(() => {
                // Simular falha ocasional para demonstrar retry
                if (Math.random() > 0.7) {
                    reject(new Error('API temporariamente indisponível'));
                } else {
                    console.log('📱 Mensagem enviada via WhatsApp Business API (simulado)');
                    resolve();
                }
            }, 1000);
        });
    }

    // ===== SALVAR PARA ENVIO MANUAL =====
    function salvarParaEnvioManual(item) {
        const enviosManual = JSON.parse(localStorage.getItem('enviosManualWhatsApp') || '[]');
        enviosManual.push({
            ...item,
            requer_envio_manual: true,
            url_whatsapp: `https://wa.me/${item.numero}?text=${encodeURIComponent(item.mensagem)}`
        });
        localStorage.setItem('enviosManualWhatsApp', JSON.stringify(enviosManual));
        
        console.log('📋 Item salvo para envio manual posterior');
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
            max-width: 400px;
        `;
        alerta.innerHTML = `
            ${mensagem}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        document.body.appendChild(alerta);

        // Auto-remover após 8 segundos para alertas importantes
        const timeout = tipo === 'info' ? 8000 : 5000;
        setTimeout(() => {
            if (alerta.parentNode) {
                alerta.remove();
            }
        }, timeout);
    }
    
    // ===== ADICIONAR MÉTODO OBTER ITENS AO CARRINHO =====
    if (carrinho && !carrinho.obterItens) {
        carrinho.obterItens = function() {
            return this.carrinho || [];
        };
    }

    // ===== INICIALIZAÇÃO =====
    renderizarResumo();
    aplicarMascaras();

    console.log('💳 Checkout carregado!');
});
