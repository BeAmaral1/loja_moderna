<?php
// ===== SISTEMA DE AUTENTICAÇÃO ADMINISTRATIVA =====
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Configurações - Credenciais de acesso
define('ADMIN_USER', 'admin');
define('ADMIN_PASS', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'); // password

// Usuários administrativos (usuário: admin, senha: 123456 | usuário: usuario, senha: 123456)
$adminUsers = [
    'admin' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // 123456
    'usuario' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' // 123456
];
define('JWT_SECRET', 'moda_elegante_secret_key_2024');
define('SESSION_DURATION', 24 * 60 * 60); // 24 horas

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
    case 'login':
        handleLogin($input);
        break;
    case 'verify':
        verifyToken($input);
        break;
    case 'logout':
        handleLogout();
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Ação inválida']);
        break;
}

function handleLogin($data) {
    global $adminUsers;
    
    $usuario = $data['usuario'] ?? '';
    $senha = $data['senha'] ?? '';
    $lembrarMe = $data['lembrarMe'] ?? false;

    if (!$usuario || !$senha) {
        echo json_encode([
            'success' => false,
            'message' => 'Usuário e senha são obrigatórios'
        ]);
        return;
    }

    // Verificar credenciais usando array de usuários
    if (!isset($adminUsers[$usuario]) || !password_verify($senha, $adminUsers[$usuario])) {
        // Log da tentativa de login falhada
        logLoginAttempt($usuario, false);
        
        echo json_encode([
            'success' => false,
            'message' => 'Usuário ou senha incorretos'
        ]);
        return;
    }

    // Gerar token JWT
    $token = generateJWT($usuario, $lembrarMe);
    
    // Log do login bem-sucedido
    logLoginAttempt($usuario, true);

    echo json_encode([
        'success' => true,
        'token' => $token,
        'usuario' => $usuario,
        'message' => 'Login realizado com sucesso'
    ]);
}

function verifyToken($data) {
    $token = $data['token'] ?? '';
    
    if (!$token) {
        echo json_encode(['success' => false, 'message' => 'Token não fornecido']);
        return;
    }

    $payload = verifyJWT($token);
    
    if ($payload) {
        echo json_encode([
            'success' => true,
            'usuario' => $payload['usuario'],
            'expires' => $payload['exp']
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Token inválido']);
    }
}

function handleLogout() {
    // Em um sistema mais complexo, aqui invalidaríamos o token
    echo json_encode(['success' => true, 'message' => 'Logout realizado']);
}

function generateJWT($usuario, $lembrarMe = false) {
    $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
    
    $duration = $lembrarMe ? 7 * 24 * 60 * 60 : SESSION_DURATION; // 7 dias ou 24h
    
    $payload = json_encode([
        'usuario' => $usuario,
        'iat' => time(),
        'exp' => time() + $duration
    ]);

    $base64Header = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
    $base64Payload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));

    $signature = hash_hmac('sha256', $base64Header . "." . $base64Payload, JWT_SECRET, true);
    $base64Signature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));

    return $base64Header . "." . $base64Payload . "." . $base64Signature;
}

function verifyJWT($token) {
    $parts = explode('.', $token);
    
    if (count($parts) !== 3) {
        return false;
    }

    $header = base64_decode(str_replace(['-', '_'], ['+', '/'], $parts[0]));
    $payload = base64_decode(str_replace(['-', '_'], ['+', '/'], $parts[1]));
    $signature = base64_decode(str_replace(['-', '_'], ['+', '/'], $parts[2]));

    $expectedSignature = hash_hmac('sha256', $parts[0] . "." . $parts[1], JWT_SECRET, true);

    if (!hash_equals($signature, $expectedSignature)) {
        return false;
    }

    $payloadData = json_decode($payload, true);
    
    // Verificar expiração
    if ($payloadData['exp'] < time()) {
        return false;
    }

    return $payloadData;
}

function logLoginAttempt($usuario, $success) {
    $logFile = __DIR__ . '/logs/admin_access.log';
    $logDir = dirname($logFile);
    
    if (!is_dir($logDir)) {
        mkdir($logDir, 0755, true);
    }
    
    $logEntry = [
        'timestamp' => date('Y-m-d H:i:s'),
        'usuario' => $usuario,
        'success' => $success,
        'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
        'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown'
    ];
    
    file_put_contents($logFile, json_encode($logEntry) . "\n", FILE_APPEND | LOCK_EX);
}

// Função para verificar se o usuário está autenticado (para outras APIs)
function requireAuth() {
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? '';
    
    if (!$authHeader || !preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Token de autorização necessário']);
        exit();
    }
    
    $token = $matches[1];
    $payload = verifyJWT($token);
    
    if (!$payload) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Token inválido']);
        exit();
    }
    
    return $payload;
}

// Função para alterar senha (para uso futuro)
function changePassword($currentPassword, $newPassword) {
    // Função para alterar senha não implementada nesta versão
    return false;
    
    $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
    
    // Aqui você salvaria a nova senha em um arquivo de configuração ou banco
    // Por simplicidade, retornamos o hash para atualização manual
    
    return $hashedPassword;
}
?>
