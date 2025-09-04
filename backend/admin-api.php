<?php
// ===== API ADMINISTRATIVA - DASHBOARD E RELATÓRIOS =====
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

require_once 'admin-auth.php';

// Tratar requisições OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Verificar autenticação
$user = requireAuth();

// Obter dados da requisição
$input = json_decode(file_get_contents('php://input'), true);
$action = $input['action'] ?? '';

switch ($action) {
    case 'dashboard_stats':
        getDashboardStats();
        break;
    case 'sales_data':
        getSalesData($input);
        break;
    case 'payment_data':
        getPaymentData($input);
        break;
    case 'orders_list':
        getOrdersList($input);
        break;
    case 'customers_list':
        getCustomersList($input);
        break;
    case 'products_stats':
        getProductsStats();
        break;
    case 'financial_report':
        getFinancialReport($input);
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Ação inválida']);
        break;
}

function getDashboardStats() {
    $stats = [
        'total_vendas_hoje' => getTotalVendasHoje(),
        'total_pedidos_hoje' => getTotalPedidosHoje(),
        'pedidos_pendentes' => getPedidosPendentes(),
        'total_clientes' => getTotalClientes(),
        'vendas_semana' => getVendasSemana(),
        'metodos_pagamento' => getMetodosPagamento(),
        'recent_orders' => getRecentOrders(10)
    ];

    echo json_encode([
        'success' => true,
        'data' => $stats
    ]);
}

function getTotalVendasHoje() {
    $hoje = date('Y-m-d');
    $total = 0;
    
    // Buscar em pedidos confirmados
    $ordersDir = __DIR__ . '/orders/';
    if (is_dir($ordersDir)) {
        $files = glob($ordersDir . 'confirmed_*.json');
        foreach ($files as $file) {
            $order = json_decode(file_get_contents($file), true);
            if ($order && strpos($order['confirmed_at'], $hoje) === 0) {
                $total += $order['value'];
            }
        }
    }
    
    return $total;
}

function getTotalPedidosHoje() {
    $hoje = date('Y-m-d');
    $count = 0;
    
    $ordersDir = __DIR__ . '/orders/';
    if (is_dir($ordersDir)) {
        $files = glob($ordersDir . 'confirmed_*.json');
        foreach ($files as $file) {
            $order = json_decode(file_get_contents($file), true);
            if ($order && strpos($order['confirmed_at'], $hoje) === 0) {
                $count++;
            }
        }
    }
    
    return $count;
}

function getPedidosPendentes() {
    // Buscar pagamentos pendentes via API Asaas
    $pendentes = 0;
    
    // Simulação - em produção, consultar API do Asaas
    $logFile = __DIR__ . '/logs/payments.log';
    if (file_exists($logFile)) {
        $lines = file($logFile, FILE_IGNORE_NEW_LINES);
        foreach ($lines as $line) {
            $payment = json_decode($line, true);
            if ($payment && $payment['status'] === 'PENDING') {
                $pendentes++;
            }
        }
    }
    
    return $pendentes;
}

function getTotalClientes() {
    // Contar clientes únicos dos pedidos
    $clientes = [];
    
    $ordersDir = __DIR__ . '/orders/';
    if (is_dir($ordersDir)) {
        $files = glob($ordersDir . 'confirmed_*.json');
        foreach ($files as $file) {
            $order = json_decode(file_get_contents($file), true);
            if ($order && isset($order['payment_data']['customer']['email'])) {
                $clientes[$order['payment_data']['customer']['email']] = true;
            }
        }
    }
    
    return count($clientes);
}

function getVendasSemana() {
    $vendas = [];
    $hoje = new DateTime();
    
    for ($i = 6; $i >= 0; $i--) {
        $data = clone $hoje;
        $data->sub(new DateInterval("P{$i}D"));
        $dataStr = $data->format('Y-m-d');
        
        $total = 0;
        $ordersDir = __DIR__ . '/orders/';
        if (is_dir($ordersDir)) {
            $files = glob($ordersDir . 'confirmed_*.json');
            foreach ($files as $file) {
                $order = json_decode(file_get_contents($file), true);
                if ($order && strpos($order['confirmed_at'], $dataStr) === 0) {
                    $total += $order['value'];
                }
            }
        }
        
        $vendas[] = $total;
    }
    
    return $vendas;
}

function getMetodosPagamento() {
    $metodos = ['PIX' => 0, 'BOLETO' => 0, 'CREDIT_CARD' => 0];
    
    $ordersDir = __DIR__ . '/orders/';
    if (is_dir($ordersDir)) {
        $files = glob($ordersDir . 'confirmed_*.json');
        foreach ($files as $file) {
            $order = json_decode(file_get_contents($file), true);
            if ($order && isset($order['payment_data']['billingType'])) {
                $tipo = $order['payment_data']['billingType'];
                if (isset($metodos[$tipo])) {
                    $metodos[$tipo]++;
                }
            }
        }
    }
    
    return $metodos;
}

function getRecentOrders($limit = 10) {
    $orders = [];
    
    $ordersDir = __DIR__ . '/orders/';
    if (is_dir($ordersDir)) {
        $files = glob($ordersDir . 'confirmed_*.json');
        
        // Ordenar por data de modificação (mais recente primeiro)
        usort($files, function($a, $b) {
            return filemtime($b) - filemtime($a);
        });
        
        $count = 0;
        foreach ($files as $file) {
            if ($count >= $limit) break;
            
            $order = json_decode(file_get_contents($file), true);
            if ($order) {
                $orders[] = [
                    'id' => $order['order_id'],
                    'cliente' => $order['payment_data']['customer']['name'] ?? 'N/A',
                    'valor' => $order['value'],
                    'status' => 'Pago',
                    'pagamento' => translatePaymentType($order['payment_data']['billingType'] ?? ''),
                    'data' => $order['confirmed_at']
                ];
                $count++;
            }
        }
    }
    
    return $orders;
}

function translatePaymentType($type) {
    $types = [
        'PIX' => 'PIX',
        'BOLETO' => 'Boleto',
        'CREDIT_CARD' => 'Cartão'
    ];
    return $types[$type] ?? $type;
}

function getSalesData($input) {
    $periodo = $input['periodo'] ?? '7d';
    $vendas = [];
    
    switch ($periodo) {
        case '7d':
            $vendas = getVendasSemana();
            break;
        case '30d':
            $vendas = getVendasMes();
            break;
        case '12m':
            $vendas = getVendasAno();
            break;
    }
    
    echo json_encode([
        'success' => true,
        'data' => $vendas
    ]);
}

function getVendasMes() {
    $vendas = [];
    $hoje = new DateTime();
    
    for ($i = 29; $i >= 0; $i--) {
        $data = clone $hoje;
        $data->sub(new DateInterval("P{$i}D"));
        $dataStr = $data->format('Y-m-d');
        
        $total = 0;
        $ordersDir = __DIR__ . '/orders/';
        if (is_dir($ordersDir)) {
            $files = glob($ordersDir . 'confirmed_*.json');
            foreach ($files as $file) {
                $order = json_decode(file_get_contents($file), true);
                if ($order && strpos($order['confirmed_at'], $dataStr) === 0) {
                    $total += $order['value'];
                }
            }
        }
        
        $vendas[] = $total;
    }
    
    return $vendas;
}

function getVendasAno() {
    $vendas = [];
    $hoje = new DateTime();
    
    for ($i = 11; $i >= 0; $i--) {
        $data = clone $hoje;
        $data->sub(new DateInterval("P{$i}M"));
        $mesAno = $data->format('Y-m');
        
        $total = 0;
        $ordersDir = __DIR__ . '/orders/';
        if (is_dir($ordersDir)) {
            $files = glob($ordersDir . 'confirmed_*.json');
            foreach ($files as $file) {
                $order = json_decode(file_get_contents($file), true);
                if ($order && strpos($order['confirmed_at'], $mesAno) === 0) {
                    $total += $order['value'];
                }
            }
        }
        
        $vendas[] = $total;
    }
    
    return $vendas;
}

function getPaymentData($input) {
    $metodos = getMetodosPagamento();
    
    echo json_encode([
        'success' => true,
        'data' => [
            'labels' => array_keys($metodos),
            'values' => array_values($metodos)
        ]
    ]);
}

function getOrdersList($input) {
    $page = $input['page'] ?? 1;
    $limit = $input['limit'] ?? 20;
    $status = $input['status'] ?? 'all';
    
    $orders = [];
    $ordersDir = __DIR__ . '/orders/';
    
    if (is_dir($ordersDir)) {
        $files = glob($ordersDir . 'confirmed_*.json');
        
        // Ordenar por data
        usort($files, function($a, $b) {
            return filemtime($b) - filemtime($a);
        });
        
        foreach ($files as $file) {
            $order = json_decode(file_get_contents($file), true);
            if ($order) {
                $orders[] = [
                    'id' => $order['order_id'],
                    'cliente' => $order['payment_data']['customer']['name'] ?? 'N/A',
                    'email' => $order['payment_data']['customer']['email'] ?? 'N/A',
                    'valor' => $order['value'],
                    'status' => 'Pago',
                    'pagamento' => translatePaymentType($order['payment_data']['billingType'] ?? ''),
                    'data' => $order['confirmed_at'],
                    'payment_id' => $order['payment_id']
                ];
            }
        }
    }
    
    // Paginação
    $total = count($orders);
    $offset = ($page - 1) * $limit;
    $orders = array_slice($orders, $offset, $limit);
    
    echo json_encode([
        'success' => true,
        'data' => [
            'orders' => $orders,
            'total' => $total,
            'page' => $page,
            'pages' => ceil($total / $limit)
        ]
    ]);
}

function getCustomersList($input) {
    $clientes = [];
    $emails = [];
    
    $ordersDir = __DIR__ . '/orders/';
    if (is_dir($ordersDir)) {
        $files = glob($ordersDir . 'confirmed_*.json');
        
        foreach ($files as $file) {
            $order = json_decode(file_get_contents($file), true);
            if ($order && isset($order['payment_data']['customer'])) {
                $customer = $order['payment_data']['customer'];
                $email = $customer['email'];
                
                if (!isset($emails[$email])) {
                    $emails[$email] = true;
                    $clientes[] = [
                        'nome' => $customer['name'] ?? 'N/A',
                        'email' => $email,
                        'telefone' => $customer['phone'] ?? 'N/A',
                        'total_pedidos' => 1,
                        'total_gasto' => $order['value'],
                        'ultimo_pedido' => $order['confirmed_at']
                    ];
                } else {
                    // Atualizar dados do cliente existente
                    foreach ($clientes as &$cliente) {
                        if ($cliente['email'] === $email) {
                            $cliente['total_pedidos']++;
                            $cliente['total_gasto'] += $order['value'];
                            if ($order['confirmed_at'] > $cliente['ultimo_pedido']) {
                                $cliente['ultimo_pedido'] = $order['confirmed_at'];
                            }
                            break;
                        }
                    }
                }
            }
        }
    }
    
    echo json_encode([
        'success' => true,
        'data' => $clientes
    ]);
}

function getProductsStats() {
    // Análise de produtos mais vendidos (simulação)
    $produtos = [
        ['nome' => 'Vestido Floral', 'vendas' => 25, 'receita' => 2500],
        ['nome' => 'Blusa Elegante', 'vendas' => 18, 'receita' => 1800],
        ['nome' => 'Calça Jeans', 'vendas' => 15, 'receita' => 2250],
        ['nome' => 'Tênis Casual', 'vendas' => 12, 'receita' => 1440],
        ['nome' => 'Bolsa Couro', 'vendas' => 8, 'receita' => 1200]
    ];
    
    echo json_encode([
        'success' => true,
        'data' => $produtos
    ]);
}

function getFinancialReport($input) {
    $periodo = $input['periodo'] ?? 'mes';
    
    $relatorio = [
        'receita_bruta' => getTotalVendasPeriodo($periodo),
        'total_pedidos' => getTotalPedidosPeriodo($periodo),
        'ticket_medio' => 0,
        'taxa_conversao' => 85.5, // Simulação
        'crescimento' => 12.3 // Simulação
    ];
    
    if ($relatorio['total_pedidos'] > 0) {
        $relatorio['ticket_medio'] = $relatorio['receita_bruta'] / $relatorio['total_pedidos'];
    }
    
    echo json_encode([
        'success' => true,
        'data' => $relatorio
    ]);
}

function getTotalVendasPeriodo($periodo) {
    $total = 0;
    $dataInicio = '';
    
    switch ($periodo) {
        case 'hoje':
            $dataInicio = date('Y-m-d');
            break;
        case 'semana':
            $dataInicio = date('Y-m-d', strtotime('-7 days'));
            break;
        case 'mes':
            $dataInicio = date('Y-m-d', strtotime('-30 days'));
            break;
        case 'ano':
            $dataInicio = date('Y-m-d', strtotime('-365 days'));
            break;
    }
    
    $ordersDir = __DIR__ . '/orders/';
    if (is_dir($ordersDir)) {
        $files = glob($ordersDir . 'confirmed_*.json');
        foreach ($files as $file) {
            $order = json_decode(file_get_contents($file), true);
            if ($order && $order['confirmed_at'] >= $dataInicio) {
                $total += $order['value'];
            }
        }
    }
    
    return $total;
}

function getTotalPedidosPeriodo($periodo) {
    $count = 0;
    $dataInicio = '';
    
    switch ($periodo) {
        case 'hoje':
            $dataInicio = date('Y-m-d');
            break;
        case 'semana':
            $dataInicio = date('Y-m-d', strtotime('-7 days'));
            break;
        case 'mes':
            $dataInicio = date('Y-m-d', strtotime('-30 days'));
            break;
        case 'ano':
            $dataInicio = date('Y-m-d', strtotime('-365 days'));
            break;
    }
    
    $ordersDir = __DIR__ . '/orders/';
    if (is_dir($ordersDir)) {
        $files = glob($ordersDir . 'confirmed_*.json');
        foreach ($files as $file) {
            $order = json_decode(file_get_contents($file), true);
            if ($order && $order['confirmed_at'] >= $dataInicio) {
                $count++;
            }
        }
    }
    
    return $count;
}
?>
