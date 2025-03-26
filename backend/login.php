<?php
header('Content-Type: application/json');
require_once 'auth.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = [
        'email' => sanitizeInput($_POST['email']),
        'password' => sanitizeInput($_POST['password']),
        'remember' => isset($_POST['remember'])
    ];
    
    if (empty($data['email']) || empty($data['password'])) {
        echo json_encode(jsonResponse(false, 'Email and password are required'));
        exit;
    }

    echo json_encode(loginUser($data['email'], $data['password'], $data['remember']));
    exit;
}

echo json_encode(jsonResponse(false, 'Invalid request'));
?>