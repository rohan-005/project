<?php
require_once 'functions.php';
require_once 'db.php';

function registerUser($data) {
    global $pdo;
    
    try {
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$data['email']]);
        if ($stmt->fetch()) {
            return jsonResponse(false, 'Email already exists', 'email');
        }

        $hashedPassword = password_hash($data['password'], PASSWORD_BCRYPT);
        
        $stmt = $pdo->prepare("INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)");
        if ($stmt->execute([$data['firstName'], $data['lastName'], $data['email'], $hashedPassword])) {
            startSession();
            $_SESSION['user'] = [
                'id' => $pdo->lastInsertId(),
                'email' => $data['email'],
                'name' => $data['firstName'].' '.$data['lastName']
            ];
            return jsonResponse(true, 'Registration successful', null, ['redirect' => '../index.html']);
        }
    } catch (PDOException $e) {
        error_log("Registration error: ".$e->getMessage());
    }
    return jsonResponse(false, 'Registration failed');
}

function loginUser($email, $password, $remember = false) {
    global $pdo;
    
    try {
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($password, $user['password'])) {
            return jsonResponse(false, 'Invalid credentials');
        }

        startSession();
        $_SESSION['user'] = [
            'id' => $user['id'],
            'email' => $user['email'],
            'name' => $user['first_name'].' '.$user['last_name']
        ];

        if ($remember) {
            $token = bin2hex(random_bytes(32));
            $expires = date('Y-m-d H:i:s', time() + 86400 * 30);
            
            $stmt = $pdo->prepare("INSERT INTO auth_tokens (user_id, token, expires_at) VALUES (?, ?, ?)");
            $stmt->execute([$user['id'], $token, $expires]);
            
            setcookie('remember_token', $token, time() + 86400 * 30, '/', '', true, true);
        }

        return jsonResponse(true, 'Login successful', null, ['redirect' => '../index.html']);
    } catch (PDOException $e) {
        error_log("Login error: ".$e->getMessage());
        return jsonResponse(false, 'Login failed');
    }
}
?>