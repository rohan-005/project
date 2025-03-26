<?php
header('Content-Type: application/json');
require_once 'auth.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = [
        'firstName' => sanitizeInput($_POST['firstName']),
        'lastName' => sanitizeInput($_POST['lastName']),
        'email' => sanitizeInput($_POST['email']),
        'password' => sanitizeInput($_POST['password']),
        'confirmPassword' => sanitizeInput($_POST['confirmPassword'])
    ];
    
    // Validation
    $errors = [];
    foreach ($data as $key => $value) {
        if (empty($value)) $errors[] = ucfirst($key).' is required';
    }
    
    if ($data['password'] !== $data['confirmPassword']) {
        $errors[] = 'Passwords do not match';
    }
    
    if (strlen($data['password']) < 8) {
        $errors[] = 'Password must be at least 8 characters';
    }
    
    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Invalid email format';
    }
    
    if (!empty($errors)) {
        echo json_encode(jsonResponse(false, implode(', ', $errors)));
        exit;
    }

    echo json_encode(registerUser($data));
    exit;
}

echo json_encode(jsonResponse(false, 'Invalid request'));
?>