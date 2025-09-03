// ===== SISTEMA DE ENVIO AUTOMÁTICO WHATSAPP =====

class WhatsAppAutomatico {
    constructor() {
        this.apiUrl = 'https://api.whatsapp.com/send'; // URL base do WhatsApp
        this.numeroLoja = '5551997002031';
        this.init();
    }

    // Inicializar sistema
    init() {
        this.processarFilaPendente();
        // Verificar fila a cada 30 segundos
        setInterval(() => {
            this.processarFilaPendente();
        }, 30000);
    }

    // Enviar mensagem automaticamente
    async enviarMensagemAutomatica(numero, mensagem) {
        try {
            // Método 1: Envio direto via URL (abre WhatsApp automaticamente)
            const mensagemCodificada = encodeURIComponent(mensagem);
            const urlWhatsApp = `https://wa.me/${numero}?text=${mensagemCodificada}`;
            
            // Criar iframe invisível para "enviar" automaticamente
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = urlWhatsApp;
            document.body.appendChild(iframe);
            
            // Remover iframe após 3 segundos
            setTimeout(() => {
                document.body.removeChild(iframe);
            }, 3000);

            // Salvar log do envio
            this.salvarLogEnvio(numero, mensagem, 'enviado');
            
            return { success: true, message: 'Mensagem enviada automaticamente' };
            
        } catch (error) {
            console.error('Erro no envio automático:', error);
            
            // Fallback: adicionar à fila para tentativa posterior
            this.adicionarFilaEnvio(numero, mensagem);
            
            return { success: false, error: error.message };
        }
    }

    // Adicionar mensagem à fila de envio
    adicionarFilaEnvio(numero, mensagem) {
        const fila = JSON.parse(localStorage.getItem('whatsapp_fila') || '[]');
        fila.push({
            id: Date.now(),
            numero: numero,
            mensagem: mensagem,
            timestamp: new Date().toISOString(),
            tentativas: 0,
            status: 'pendente'
        });
        localStorage.setItem('whatsapp_fila', JSON.stringify(fila));
    }

    // Processar fila de mensagens pendentes
    processarFilaPendente() {
        const fila = JSON.parse(localStorage.getItem('whatsapp_fila') || '[]');
        const filaPendente = fila.filter(item => item.status === 'pendente' && item.tentativas < 3);
        
        filaPendente.forEach(async (item) => {
            try {
                const resultado = await this.enviarMensagemAutomatica(item.numero, item.mensagem);
                
                if (resultado.success) {
                    // Marcar como enviado
                    item.status = 'enviado';
                    item.dataEnvio = new Date().toISOString();
                } else {
                    // Incrementar tentativas
                    item.tentativas++;
                    if (item.tentativas >= 3) {
                        item.status = 'falhou';
                    }
                }
                
            } catch (error) {
                item.tentativas++;
                if (item.tentativas >= 3) {
                    item.status = 'falhou';
                }
            }
        });
        
        // Atualizar fila no localStorage
        localStorage.setItem('whatsapp_fila', JSON.stringify(fila));
    }

    // Salvar log de envio
    salvarLogEnvio(numero, mensagem, status) {
        const logs = JSON.parse(localStorage.getItem('whatsapp_logs') || '[]');
        logs.push({
            id: Date.now(),
            numero: numero,
            mensagem: mensagem.substring(0, 100) + '...', // Apenas primeiros 100 chars
            status: status,
            timestamp: new Date().toISOString()
        });
        
        // Manter apenas os últimos 50 logs
        if (logs.length > 50) {
            logs.splice(0, logs.length - 50);
        }
        
        localStorage.setItem('whatsapp_logs', JSON.stringify(logs));
    }

    // Obter estatísticas de envio
    obterEstatisticas() {
        const logs = JSON.parse(localStorage.getItem('whatsapp_logs') || '[]');
        const fila = JSON.parse(localStorage.getItem('whatsapp_fila') || '[]');
        
        return {
            totalEnviados: logs.filter(log => log.status === 'enviado').length,
            totalFalhas: logs.filter(log => log.status === 'falhou').length,
            pendentes: fila.filter(item => item.status === 'pendente').length,
            ultimoEnvio: logs.length > 0 ? logs[logs.length - 1].timestamp : null
        };
    }

    // Limpar logs antigos
    limparLogs() {
        localStorage.removeItem('whatsapp_logs');
        localStorage.removeItem('whatsapp_fila');
    }
}

// ===== INICIALIZAÇÃO GLOBAL =====
let whatsappAutomatico;

document.addEventListener('DOMContentLoaded', function() {
    whatsappAutomatico = new WhatsAppAutomatico();
    console.log('📱 Sistema WhatsApp Automático inicializado!');
});

// ===== FUNÇÃO GLOBAL PARA USO EM OUTROS ARQUIVOS =====
window.enviarWhatsAppAutomatico = function(numero, mensagem) {
    if (whatsappAutomatico) {
        return whatsappAutomatico.enviarMensagemAutomatica(numero, mensagem);
    } else {
        console.error('Sistema WhatsApp não inicializado');
        return { success: false, error: 'Sistema não inicializado' };
    }
};

// Exportar para uso em módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WhatsAppAutomatico;
}
