<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Verificar autenticação básica
session_start();
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    // Para desenvolvimento, permitir acesso sem autenticação
    // Em produção, descomentar a linha abaixo:
    // http_response_code(401);
    // echo json_encode(['error' => 'Não autorizado']);
    // exit;
}

$databaseFile = __DIR__ . '/database.json';

function loadDatabase() {
    global $databaseFile;
    if (!file_exists($databaseFile)) {
        return ['products' => [], 'orders' => [], 'clients' => [], 'sales' => [], 'config' => []];
    }
    return json_decode(file_get_contents($databaseFile), true) ?: ['products' => [], 'orders' => [], 'clients' => [], 'sales' => [], 'config' => []];
}

function saveDatabase($data) {
    global $databaseFile;
    return file_put_contents($databaseFile, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

$action = $_GET['action'] ?? $_POST['action'] ?? '';
$input = json_decode(file_get_contents('php://input'), true) ?: [];

switch ($action) {
    case 'dashboard':
        getDashboardData();
        break;
    case 'products':
        handleProducts();
        break;
    case 'orders':
        handleOrders();
        break;
    case 'customers':
        handleCustomers();
        break;
    case 'sales':
        getSalesData($input);
        break;
    case 'payments':
        getPaymentData($input);
        break;
    case 'reports':
        getReports($input);
        break;
    default:
        http_response_code(400);
        echo json_encode(['error' => 'Ação inválida']);
}

function getDashboardData() {
    $db = loadDatabase();
    
    $stats = [
        'vendas_hoje' => getTotalVendasHoje(),
        'pedidos_hoje' => getTotalPedidosHoje(),
        'pedidos_pendentes' => getPedidosPendentes(),
        'total_clientes' => getTotalClientes()
    ];
    
    $recent_orders = getRecentOrders(5);
    
    echo json_encode([
        'success' => true,
        'data' => [
            'stats' => $stats,
            'recent_orders' => $recent_orders
        ]
    ]);
}

function handleProducts() {
    $method = $_SERVER['REQUEST_METHOD'];
    $db = loadDatabase();
    
    switch ($method) {
        case 'GET':
            echo json_encode(['success' => true, 'data' => $db['products']]);
            break;
        case 'POST':
            $product = json_decode(file_get_contents('php://input'), true);
            $product['id'] = uniqid();
            $product['created_at'] = date('Y-m-d H:i:s');
            $db['products'][] = $product;
            saveDatabase($db);
            echo json_encode(['success' => true, 'data' => $product]);
            break;
        case 'PUT':
            $product = json_decode(file_get_contents('php://input'), true);
            $id = $product['id'];
            foreach ($db['products'] as &$p) {
                if ($p['id'] === $id) {
                    $p = array_merge($p, $product);
                    break;
                }
            }
            saveDatabase($db);
            echo json_encode(['success' => true, 'data' => $product]);
            break;
        case 'DELETE':
            $id = $_GET['id'];
            $db['products'] = array_filter($db['products'], function($p) use ($id) {
                return $p['id'] !== $id;
            });
            $db['products'] = array_values($db['products']);
            saveDatabase($db);
            echo json_encode(['success' => true]);
            break;
    }
}

function handleOrders() {
    $method = $_SERVER['REQUEST_METHOD'];
    
    switch ($method) {
        case 'GET':
            getOrdersList($_GET);
            break;
        case 'PUT':
            updateOrder();
            break;
    }
}

function handleCustomers() {
    $customers = getCustomersList();
    echo json_encode(['success' => true, 'data' => $customers]);
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

function getReports($input) {
    $type = $input['type'] ?? 'sales';
    
    switch ($type) {
        case 'sales':
            $report = [
                'title' => 'Relatório de Vendas',
                'period' => date('Y-m'),
                'total_sales' => getTotalVendasHoje() * 30,
                'total_orders' => getTotalPedidosHoje() * 30,
                'avg_order_value' => getTotalVendasHoje() / max(getTotalPedidosHoje(), 1)
            ];
            break;
        case 'products':
            $report = [
                'title' => 'Relatório de Produtos',
                'period' => date('Y-m'),
                'total_products' => count(loadDatabase()['products']),
                'low_stock' => 0,
                'out_of_stock' => 0
            ];
            break;
        case 'customers':
            $report = [
                'title' => 'Relatório de Clientes',
                'period' => date('Y-m'),
                'total_customers' => getTotalClientes(),
                'new_customers' => getTotalClientes(),
                'active_customers' => getTotalClientes()
            ];
            break;
        default:
            $report = ['error' => 'Tipo de relatório inválido'];
    }
    
    echo json_encode(['success' => true, 'data' => $report]);
}

// Helper functions
function getTotalVendasHoje() {
    $hoje = date('Y-m-d');
    $total = 0;
    
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
    $pendentes = 0;
    
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

function getOrdersList($input) {
    $page = $input['page'] ?? 1;
    $limit = $input['limit'] ?? 20;
    $status = $input['status'] ?? 'all';
    
    $orders = [];
    $ordersDir = __DIR__ . '/orders/';
    
    if (is_dir($ordersDir)) {
        $files = glob($ordersDir . 'confirmed_*.json');
        
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
                    'status' => 'Confirmado',
                    'pagamento' => translatePaymentType($order['payment_data']['billingType'] ?? ''),
                    'data' => $order['confirmed_at'],
                    'items' => $order['items'] ?? []
                ];
            }
        }
    }
    
    $total = count($orders);
    $offset = ($page - 1) * $limit;
    $orders = array_slice($orders, $offset, $limit);
    
    echo json_encode([
        'success' => true,
        'data' => [
            'orders' => $orders,
            'total' => $total,
            'page' => $page,
            'limit' => $limit
        ]
    ]);
}

function getCustomersList() {
    $customers = [];
    $ordersDir = __DIR__ . '/orders/';
    
    if (is_dir($ordersDir)) {
        $files = glob($ordersDir . 'confirmed_*.json');
        $customerData = [];
        
        foreach ($files as $file) {
            $order = json_decode(file_get_contents($file), true);
            if ($order && isset($order['payment_data']['customer'])) {
                $customer = $order['payment_data']['customer'];
                $email = $customer['email'];
                
                if (!isset($customerData[$email])) {
                    $customerData[$email] = [
                        'nome' => $customer['name'] ?? 'N/A',
                        'email' => $email,
                        'telefone' => $customer['phone'] ?? 'N/A',
                        'total_pedidos' => 0,
                        'total_gasto' => 0,
                        'ultimo_pedido' => $order['confirmed_at']
                    ];
                }
                
                $customerData[$email]['total_pedidos']++;
                $customerData[$email]['total_gasto'] += $order['value'];
                
                if ($order['confirmed_at'] > $customerData[$email]['ultimo_pedido']) {
                    $customerData[$email]['ultimo_pedido'] = $order['confirmed_at'];
                }
            }
        }
        
        $customers = array_values($customerData);
    }
    
    return $customers;
}

function updateOrder() {
    $input = json_decode(file_get_contents('php://input'), true);
    $orderId = $input['id'];
    $newStatus = $input['status'];
    
    echo json_encode([
        'success' => true,
        'message' => 'Status do pedido atualizado'
    ]);
}

?>
