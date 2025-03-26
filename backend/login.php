<?php
header('Content-Type: application/json');
require_once 'auth.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = sanitizeInput($_POST['email'] ?? '');
    $password = sanitizeInput($_POST['password'] ?? '');
    $remember = isset($_POST['remember']);

    if (empty($email) ){
        echo json_encode(['success' => false, 'message' => 'Email is required', 'field' => 'email']);
        exit;
    }

    if (empty($password)) {
        echo json_encode(['success' => false, 'message' => 'Password is required', 'field' => 'password']);
        exit;
    }

    $result = loginUser($email, $password, $remember);
    echo json_encode($result);
    exit;
}

echo json_encode(['success' => false, 'message' => 'Invalid request method']);
?>