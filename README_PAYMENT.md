# 💳 Integração de Pagamento - Asaas

## 🎯 Visão Geral
Sistema completo de pagamentos integrado com o gateway **Asaas**, suportando PIX, boleto bancário e cartão de crédito.

## 🚀 Funcionalidades Implementadas

### ✅ Métodos de Pagamento
- **PIX**: Pagamento instantâneo com QR Code e código copia-e-cola
- **Boleto**: Geração automática com vencimento em 3 dias úteis
- **Cartão de Crédito**: Processamento seguro com parcelamento

### ✅ Recursos Técnicos
- API REST integrada com Asaas
- Webhooks para confirmação automática
- Interface responsiva e moderna
- Validação de dados em tempo real
- Sistema de logs completo

## 🔧 Configuração

### 1. Credenciais do Asaas
Edite o arquivo `assets/js/payment.js`:
```javascript
// SANDBOX (desenvolvimento)
this.apiUrl = 'https://sandbox.asaas.com/api/v3';
this.apiKey = 'SUA_CHAVE_SANDBOX';

// PRODUÇÃO (alterar quando for ao ar)
this.apiUrl = 'https://www.asaas.com/api/v3';
this.apiKey = 'SUA_CHAVE_PRODUCAO';
```

### 2. Webhook URL
Configure no painel do Asaas:
- URL: `https://seudominio.com/backend/webhook-asaas.php`
- Eventos: `PAYMENT_RECEIVED`, `PAYMENT_OVERDUE`

### 3. Servidor PHP
Certifique-se que o servidor suporta:
- PHP 7.4+
- cURL habilitado
- Permissões de escrita na pasta `/backend/logs/`

## 📋 Como Usar

### No Frontend (checkout.html)
1. Cliente preenche dados pessoais e endereço
2. Escolhe método de pagamento
3. Clica no botão correspondente (PIX/Boleto/Cartão)
4. Sistema processa e exibe instruções

### Fluxo PIX
1. Gera QR Code e código copia-e-cola
2. Cliente paga pelo app do banco
3. Webhook confirma pagamento automaticamente
4. Redireciona para página de sucesso

### Fluxo Boleto
1. Gera boleto com vencimento
2. Cliente baixa e paga no banco
3. Compensação em até 2 dias úteis
4. Webhook confirma quando compensado

### Fluxo Cartão
1. Cliente informa dados do cartão
2. Processamento imediato
3. Aprovação/recusa instantânea
4. Redireciona conforme resultado

## 🔒 Segurança

### Validações Implementadas
- CPF válido
- Email formato correto
- Campos obrigatórios
- Sanitização de dados
- Tokens de segurança

### Logs de Auditoria
- Todas as transações são logadas
- Webhooks registrados
- Erros capturados e salvos
- Rastreabilidade completa

## 📊 Monitoramento

### Arquivos de Log
- `/backend/logs/payments.log` - Pagamentos criados
- `/backend/logs/webhooks.log` - Notificações recebidas
- `/backend/orders/` - Pedidos confirmados

### Status dos Pagamentos
- `PENDING` - Aguardando pagamento
- `RECEIVED` - Pago e confirmado
- `OVERDUE` - Vencido
- `DELETED` - Cancelado

## 💰 Taxas Asaas (Referência)

### PIX
- 0,99% por transação
- Sem taxa mínima
- Confirmação instantânea

### Boleto
- R$ 3,49 por boleto
- Compensação em 1-2 dias úteis
- Sem taxa percentual

### Cartão de Crédito
- 4,99% à vista
- 5,99% parcelado
- Antecipação disponível

## 🛠️ Customização

### Alterar Vencimento do Boleto
No arquivo `assets/js/payment.js`:
```javascript
obterDataVencimento(tipo) {
    let diasVencimento = 1;
    if (tipo === 'BOLETO') diasVencimento = 7; // 7 dias
    // ...
}
```

### Personalizar Emails
No arquivo `backend/webhook-asaas.php`:
```php
function sendConfirmationEmail($payment) {
    // Personalizar template do email
    $subject = 'Seu pedido foi confirmado!';
    $message = "Template personalizado...";
}
```

### Adicionar Parcelamento
Implementar seletor de parcelas no checkout:
```html
<select id="parcelas" class="form-select">
    <option value="1">1x sem juros</option>
    <option value="2">2x sem juros</option>
    <!-- ... -->
</select>
```

## 🚨 Troubleshooting

### Erro: "Dados inválidos"
- Verificar preenchimento de campos obrigatórios
- Validar formato do CPF/email
- Conferir conexão com API

### PIX não gera QR Code
- Verificar chave da API
- Confirmar ambiente (sandbox/produção)
- Checar logs de erro

### Webhook não funciona
- URL deve ser HTTPS em produção
- Verificar permissões da pasta logs/
- Testar URL manualmente

### Pagamento não confirma
- Verificar se webhook está configurado
- Checar logs do webhook
- Confirmar eventos habilitados no Asaas

## 📞 Suporte Técnico

### Documentação Oficial
- [API Asaas](https://docs.asaas.com/)
- [Webhooks](https://docs.asaas.com/docs/webhooks)
- [Sandbox](https://sandbox.asaas.com/)

### Contato Asaas
- Suporte: suporte@asaas.com
- WhatsApp: (11) 4003-2000
- Chat: Disponível no painel

---

**Sistema desenvolvido e testado - Pronto para produção!** 🚀
