<?php
// ===== BACKEND ASAAS PAYMENT INTEGRATION =====
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Configurações do Asaas
define('ASAAS_API_URL', 'https://sandbox.asaas.com/api/v3');
define('ASAAS_API_KEY', '$aact_YTU5YTE0M2M2N2I4MTliNzk0YTI5N2U5MzdjNWZmNDQ6OjAwMDAwMDAwMDAwMDAwNDI2NzI6OiRhYWNoXzRlZGI4OGM4LTBmN2QtNGI4Zi1hZmNiLTVhMzgyMzRhMGZhZQ==');

// Tratar requisições OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Verificar método POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método não permitido']);
    exit();
}

// Obter dados da requisição
$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['action'])) {
    echo json_encode(['success' => false, 'message' => 'Dados inválidos']);
    exit();
}

$action = $input['action'];

switch ($action) {
    case 'create_payment':
        createPayment($input['data']);
        break;
    case 'check_payment':
        checkPayment($input['paymentId']);
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Ação inválida']);
        break;
}

function createPayment($data) {
    // Validar dados obrigatórios
    if (!isset($data['customer']) || !isset($data['value']) || !isset($data['billingType'])) {
        echo json_encode(['success' => false, 'message' => 'Dados obrigatórios ausentes']);
        return;
    }

    // Preparar payload para o Asaas
    $payload = [
        'customer' => $data['customer']['cpfCnpj'] ? 
            findOrCreateCustomer($data['customer']) : 
            $data['customer'],
        'billingType' => $data['billingType'],
        'value' => (float)$data['value'],
        'dueDate' => $data['dueDate'],
        'description' => $data['description'] ?? 'Pagamento Moda Elegante',
        'externalReference' => $data['externalReference'] ?? null,
        'postalService' => false
    ];

    // Configurações específicas por tipo de pagamento
    if ($data['billingType'] === 'PIX') {
        $payload['pixAddressKey'] = null; // Será gerado automaticamente
    }

    // Fazer requisição para o Asaas
    $response = makeAsaasRequest('POST', '/payments', $payload);

    if ($response['success']) {
        // Se for PIX, buscar QR Code
        if ($data['billingType'] === 'PIX') {
            $pixData = getPixData($response['data']['id']);
            if ($pixData['success']) {
                $response['data']['encodedImage'] = $pixData['data']['encodedImage'];
                $response['data']['payload'] = $pixData['data']['payload'];
            }
        }
        
        // Log do pagamento (opcional)
        logPayment($response['data']);
    }

    echo json_encode($response);
}

function checkPayment($paymentId) {
    if (!$paymentId) {
        echo json_encode(['success' => false, 'message' => 'ID do pagamento não fornecido']);
        return;
    }

    $response = makeAsaasRequest('GET', "/payments/{$paymentId}");
    echo json_encode($response);
}

function findOrCreateCustomer($customerData) {
    // Primeiro, tentar encontrar cliente existente
    $response = makeAsaasRequest('GET', '/customers?cpfCnpj=' . $customerData['cpfCnpj']);
    
    if ($response['success'] && !empty($response['data']['data'])) {
        // Cliente já existe
        return $response['data']['data'][0]['id'];
    }

    // Criar novo cliente
    $newCustomer = makeAsaasRequest('POST', '/customers', $customerData);
    
    if ($newCustomer['success']) {
        return $newCustomer['data']['id'];
    }

    // Se falhar, retornar dados originais
    return $customerData;
}

function getPixData($paymentId) {
    return makeAsaasRequest('GET', "/payments/{$paymentId}/pixQrCode");
}

function makeAsaasRequest($method, $endpoint, $data = null) {
    $url = ASAAS_API_URL . $endpoint;
    
    $ch = curl_init();
    
    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'access_token: ' . ASAAS_API_KEY
        ],
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_TIMEOUT => 30
    ]);

    if ($data && in_array($method, ['POST', 'PUT'])) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    }

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    
    curl_close($ch);

    if ($error) {
        return [
            'success' => false,
            'message' => 'Erro de conexão: ' . $error
        ];
    }

    $decodedResponse = json_decode($response, true);

    if ($httpCode >= 200 && $httpCode < 300) {
        return [
            'success' => true,
            'data' => $decodedResponse
        ];
    } else {
        return [
            'success' => false,
            'message' => $decodedResponse['errors'][0]['description'] ?? 'Erro na API',
            'code' => $httpCode
        ];
    }
}

function logPayment($paymentData) {
    $logFile = __DIR__ . '/logs/payments.log';
    $logDir = dirname($logFile);
    
    if (!is_dir($logDir)) {
        mkdir($logDir, 0755, true);
    }
    
    $logEntry = [
        'timestamp' => date('Y-m-d H:i:s'),
        'payment_id' => $paymentData['id'],
        'value' => $paymentData['value'],
        'billing_type' => $paymentData['billingType'],
        'status' => $paymentData['status']
    ];
    
    file_put_contents($logFile, json_encode($logEntry) . "\n", FILE_APPEND | LOCK_EX);
}

// Função para validar CPF (opcional)
function isValidCPF($cpf) {
    $cpf = preg_replace('/[^0-9]/', '', $cpf);
    
    if (strlen($cpf) != 11 || preg_match('/(\d)\1{10}/', $cpf)) {
        return false;
    }
    
    for ($t = 9; $t < 11; $t++) {
        for ($d = 0, $c = 0; $c < $t; $c++) {
            $d += $cpf[$c] * (($t + 1) - $c);
        }
        $d = ((10 * $d) % 11) % 10;
        if ($cpf[$c] != $d) {
            return false;
        }
    }
    
    return true;
}
?>
