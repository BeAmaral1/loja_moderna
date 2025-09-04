<?php
// ===== WEBHOOK ASAAS - NOTIFICAÇÕES DE PAGAMENTO =====
header('Content-Type: application/json');

// Log de webhooks recebidos
$logFile = __DIR__ . '/logs/webhooks.log';
$logDir = dirname($logFile);

if (!is_dir($logDir)) {
    mkdir($logDir, 0755, true);
}

// Obter dados do webhook
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Log da requisição
$logEntry = [
    'timestamp' => date('Y-m-d H:i:s'),
    'data' => $data,
    'headers' => getallheaders()
];

file_put_contents($logFile, json_encode($logEntry) . "\n", FILE_APPEND | LOCK_EX);

// Verificar se é uma notificação válida
if (!$data || !isset($data['event'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Dados inválidos']);
    exit();
}

$event = $data['event'];
$payment = $data['payment'] ?? null;

// Processar eventos de pagamento
switch ($event) {
    case 'PAYMENT_RECEIVED':
        handlePaymentReceived($payment);
        break;
    case 'PAYMENT_OVERDUE':
        handlePaymentOverdue($payment);
        break;
    case 'PAYMENT_DELETED':
        handlePaymentDeleted($payment);
        break;
    case 'PAYMENT_RESTORED':
        handlePaymentRestored($payment);
        break;
    default:
        // Log de evento não tratado
        error_log("Evento não tratado: " . $event);
        break;
}

// Responder com sucesso
http_response_code(200);
echo json_encode(['success' => true]);

function handlePaymentReceived($payment) {
    if (!$payment) return;
    
    // Aqui você pode:
    // 1. Atualizar status do pedido no banco de dados
    // 2. Enviar email de confirmação
    // 3. Disparar notificações
    // 4. Atualizar estoque
    
    $orderId = $payment['externalReference'];
    $paymentId = $payment['id'];
    $value = $payment['value'];
    
    // Exemplo: salvar em arquivo (substitua por banco de dados)
    $orderFile = __DIR__ . '/orders/confirmed_' . $orderId . '.json';
    $orderDir = dirname($orderFile);
    
    if (!is_dir($orderDir)) {
        mkdir($orderDir, 0755, true);
    }
    
    $orderData = [
        'order_id' => $orderId,
        'payment_id' => $paymentId,
        'value' => $value,
        'status' => 'PAID',
        'confirmed_at' => date('Y-m-d H:i:s'),
        'payment_data' => $payment
    ];
    
    file_put_contents($orderFile, json_encode($orderData, JSON_PRETTY_PRINT));
    
    // Enviar email de confirmação (opcional)
    sendConfirmationEmail($payment);
}

function handlePaymentOverdue($payment) {
    // Pagamento vencido
    $orderId = $payment['externalReference'];
    
    // Aqui você pode:
    // 1. Marcar pedido como vencido
    // 2. Enviar lembrete por email
    // 3. Cancelar reserva de estoque
    
    error_log("Pagamento vencido: " . $orderId);
}

function handlePaymentDeleted($payment) {
    // Pagamento deletado/cancelado
    $orderId = $payment['externalReference'];
    
    // Aqui você pode:
    // 1. Cancelar pedido
    // 2. Liberar estoque
    // 3. Notificar cliente
    
    error_log("Pagamento cancelado: " . $orderId);
}

function handlePaymentRestored($payment) {
    // Pagamento restaurado
    $orderId = $payment['externalReference'];
    
    error_log("Pagamento restaurado: " . $orderId);
}

function sendConfirmationEmail($payment) {
    // Implementar envio de email
    // Pode usar PHPMailer, SendGrid, etc.
    
    $to = $payment['customer']['email'] ?? '';
    $subject = 'Pagamento Confirmado - Moda Elegante';
    $message = "
        <h2>Pagamento Confirmado!</h2>
        <p>Seu pagamento de R$ " . number_format($payment['value'], 2, ',', '.') . " foi confirmado.</p>
        <p>Número do pedido: " . $payment['externalReference'] . "</p>
        <p>Em breve você receberá informações sobre o envio.</p>
        <br>
        <p>Obrigado por escolher a Moda Elegante!</p>
    ";
    
    // Headers para HTML
    $headers = [
        'MIME-Version: 1.0',
        'Content-type: text/html; charset=UTF-8',
        'From: noreply@modaelegante.com',
        'Reply-To: contato@modaelegante.com'
    ];
    
    if ($to) {
        mail($to, $subject, $message, implode("\r\n", $headers));
    }
}
?>
