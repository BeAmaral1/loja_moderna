<?php
// ===== WHATSAPP SENDER BACKEND =====
// Este arquivo processa pedidos e envia via WhatsApp Business API

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Configurações do WhatsApp Business API
$WHATSAPP_TOKEN = getenv('WHATSAPP_BUSINESS_TOKEN') ?: 'YOUR_WHATSAPP_BUSINESS_TOKEN';
$WHATSAPP_PHONE_ID = getenv('WHATSAPP_PHONE_ID') ?: 'YOUR_PHONE_NUMBER_ID';
$WEBHOOK_VERIFY_TOKEN = getenv('WEBHOOK_VERIFY_TOKEN') ?: 'YOUR_WEBHOOK_VERIFY_TOKEN';

// Modo de desenvolvimento - simula envio bem-sucedido
$MODO_DESENVOLVIMENTO = true;

// Função para enviar mensagem via WhatsApp Business API
function enviarMensagemWhatsApp($numero, $mensagem) {
    global $WHATSAPP_TOKEN, $WHATSAPP_PHONE_ID, $MODO_DESENVOLVIMENTO;
    
    // Em modo de desenvolvimento, simular sucesso
    if ($MODO_DESENVOLVIMENTO) {
        error_log("[MODO DEV] Simulando envio WhatsApp para: $numero");
        error_log("[MODO DEV] Mensagem: " . substr($mensagem, 0, 100) . "...");
        
        return [
            'success' => true,
            'response' => [
                'messages' => [[
                    'id' => 'dev_' . uniqid(),
                    'message_status' => 'sent'
                ]]
            ],
            'http_code' => 200
        ];
    }
    
    $url = "https://graph.facebook.com/v18.0/{$WHATSAPP_PHONE_ID}/messages";
    
    $data = [
        'messaging_product' => 'whatsapp',
        'to' => $numero,
        'type' => 'text',
        'text' => [
            'body' => $mensagem
        ]
    ];
    
    $headers = [
        'Authorization: Bearer ' . $WHATSAPP_TOKEN,
        'Content-Type: application/json'
    ];
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    if ($error) {
        error_log("Erro cURL WhatsApp: $error");
    }
    
    return [
        'success' => $httpCode === 200,
        'response' => json_decode($response, true),
        'http_code' => $httpCode,
        'curl_error' => $error
    ];
}

// Função para salvar pedido no banco de dados
function salvarPedido($dadosPedido) {
    // Em modo de desenvolvimento, salvar em arquivo
    global $MODO_DESENVOLVIMENTO;
    
    if ($MODO_DESENVOLVIMENTO) {
        $arquivo = 'pedidos_dev.json';
        $pedidos = [];
        
        if (file_exists($arquivo)) {
            $pedidos = json_decode(file_get_contents($arquivo), true) ?: [];
        }
        
        $pedidos[] = [
            'timestamp' => date('Y-m-d H:i:s'),
            'dados' => $dadosPedido
        ];
        
        file_put_contents($arquivo, json_encode($pedidos, JSON_PRETTY_PRINT));
        error_log("[MODO DEV] Pedido salvo em arquivo: $arquivo");
        
        return true;
    }
    
    // Conectar ao banco de dados (MySQL/PostgreSQL)
    try {
        $pdo = new PDO('mysql:host=localhost;dbname=moda_elegante', 'username', 'password');
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        $sql = "INSERT INTO pedidos (pedido_id, cliente_dados, itens, total, forma_pagamento, status, data_criacao) 
                VALUES (?, ?, ?, ?, ?, 'pendente', NOW())";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $dadosPedido['pedido_id'],
            json_encode($dadosPedido['cliente']),
            json_encode($dadosPedido['itens']),
            $dadosPedido['total'],
            $dadosPedido['forma_pagamento']
        ]);
        
        return true;
    } catch (PDOException $e) {
        error_log("Erro ao salvar pedido: " . $e->getMessage());
        return false;
    }
}

// Processar requisição POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        http_response_code(400);
        echo json_encode(['error' => 'Dados inválidos']);
        exit;
    }
    
    $acao = $input['acao'] ?? '';
    
    switch ($acao) {
        case 'enviar_pedido':
            $numero = $input['numero'] ?? '';
            $mensagem = $input['mensagem'] ?? '';
            $dadosPedido = $input['dados_pedido'] ?? [];
            
            if (empty($numero) || empty($mensagem)) {
                http_response_code(400);
                echo json_encode(['error' => 'Número e mensagem são obrigatórios']);
                exit;
            }
            
            // Salvar pedido no banco
            $pedidoSalvo = salvarPedido($dadosPedido);
            
            // Enviar via WhatsApp
            $resultado = enviarMensagemWhatsApp($numero, $mensagem);
            
            if ($resultado['success']) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Pedido enviado com sucesso',
                    'whatsapp_id' => $resultado['response']['messages'][0]['id'] ?? null,
                    'pedido_salvo' => $pedidoSalvo,
                    'modo_dev' => $MODO_DESENVOLVIMENTO
                ]);
            } else {
                // Salvar na fila para retry
                salvarNaFilaRetry($numero, $mensagem, $dadosPedido);
                
                // Em modo dev, não retornar erro para permitir fallback
                if ($MODO_DESENVOLVIMENTO) {
                    echo json_encode([
                        'success' => false,
                        'message' => 'Modo desenvolvimento - usando fallback',
                        'pedido_salvo' => $pedidoSalvo,
                        'modo_dev' => true
                    ]);
                } else {
                    http_response_code(500);
                    echo json_encode([
                        'success' => false,
                        'error' => 'Erro ao enviar mensagem',
                        'details' => $resultado['response'],
                        'salvo_para_retry' => true
                    ]);
                }
            }
            break;
            
        case 'processar_fila':
            $filaProcessada = processarFilaRetry();
            echo json_encode([
                'success' => true,
                'processados' => $filaProcessada
            ]);
            break;
            
        default:
            http_response_code(400);
            echo json_encode(['error' => 'Ação não reconhecida']);
    }
}

// Função para salvar na fila de retry
function salvarNaFilaRetry($numero, $mensagem, $dadosPedido) {
    global $MODO_DESENVOLVIMENTO;
    
    if ($MODO_DESENVOLVIMENTO) {
        $arquivo = 'fila_retry_dev.json';
        $fila = [];
        
        if (file_exists($arquivo)) {
            $fila = json_decode(file_get_contents($arquivo), true) ?: [];
        }
        
        $fila[] = [
            'timestamp' => date('Y-m-d H:i:s'),
            'numero' => $numero,
            'mensagem' => $mensagem,
            'dados_pedido' => $dadosPedido,
            'tentativas' => 0,
            'status' => 'pendente'
        ];
        
        file_put_contents($arquivo, json_encode($fila, JSON_PRETTY_PRINT));
        error_log("[MODO DEV] Item salvo na fila de retry: $arquivo");
        
        return true;
    }
    
    try {
        $pdo = new PDO('mysql:host=localhost;dbname=moda_elegante', 'username', 'password');
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        $sql = "INSERT INTO fila_whatsapp (numero, mensagem, dados_pedido, tentativas, status, data_criacao) 
                VALUES (?, ?, ?, 0, 'pendente', NOW())";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $numero,
            $mensagem,
            json_encode($dadosPedido)
        ]);
        
        return true;
    } catch (PDOException $e) {
        error_log("Erro ao salvar na fila: " . $e->getMessage());
        return false;
    }
}

// Função para processar fila de retry
function processarFilaRetry() {
    try {
        $pdo = new PDO('mysql:host=localhost;dbname=moda_elegante', 'username', 'password');
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        // Buscar itens pendentes com menos de 3 tentativas
        $sql = "SELECT * FROM fila_whatsapp WHERE status = 'pendente' AND tentativas < 3 LIMIT 10";
        $stmt = $pdo->query($sql);
        $itens = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $processados = 0;
        
        foreach ($itens as $item) {
            $resultado = enviarMensagemWhatsApp($item['numero'], $item['mensagem']);
            
            if ($resultado['success']) {
                // Marcar como enviado
                $updateSql = "UPDATE fila_whatsapp SET status = 'enviado', data_envio = NOW() WHERE id = ?";
                $updateStmt = $pdo->prepare($updateSql);
                $updateStmt->execute([$item['id']]);
                $processados++;
            } else {
                // Incrementar tentativas
                $updateSql = "UPDATE fila_whatsapp SET tentativas = tentativas + 1, ultima_tentativa = NOW() WHERE id = ?";
                $updateStmt = $pdo->prepare($updateSql);
                $updateStmt->execute([$item['id']]);
                
                // Se chegou a 3 tentativas, marcar como falhou
                if ($item['tentativas'] + 1 >= 3) {
                    $failSql = "UPDATE fila_whatsapp SET status = 'falhou' WHERE id = ?";
                    $failStmt = $pdo->prepare($failSql);
                    $failStmt->execute([$item['id']]);
                }
            }
        }
        
        return $processados;
    } catch (PDOException $e) {
        error_log("Erro ao processar fila: " . $e->getMessage());
        return 0;
    }
}

// Webhook para receber status de mensagens
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['hub_verify_token'])) {
    if ($_GET['hub_verify_token'] === $WEBHOOK_VERIFY_TOKEN) {
        echo $_GET['hub_challenge'];
    } else {
        http_response_code(403);
        echo 'Token inválido';
    }
}
?>
