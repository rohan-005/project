<?php
header('Content-Type: application/json');
require_once 'auth.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $firstName = sanitizeInput($_POST['firstName'] ?? '');
    $lastName = sanitizeInput($_POST['lastName'] ?? '');
    $email = sanitizeInput($_POST['email'] ?? '');
    $password = sanitizeInput($_POST['password'] ?? '');
    $confirmPassword = sanitizeInput($_POST['confirmPassword'] ?? '');
    $terms = isset($_POST['terms']);

    // Validate inputs
    if (empty($firstName)) {
        echo json_encode(['success' => false, 'message' => 'First name is required', 'field' => 'firstName']);
        exit;
    }

    if (empty($lastName)) {
        echo json_encode(['success' => false, 'message' => 'Last name is required', 'field' => 'lastName']);
        exit;
    }

    if (empty($email)) {
        echo json_encode(['success' => false, 'message' => 'Email is required', 'field' => 'email']);
        exit;
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Invalid email format', 'field' => 'email']);
        exit;
    }

    if (empty($password)) {
        echo json_encode(['success' => false, 'message' => 'Password is required', 'field' => 'password']);
        exit;
    } elseif (strlen($password) < 8) {
        echo json_encode(['success' => false, 'message' => 'Password must be at least 8 characters', 'field' => 'password']);
        exit;
    }

    if ($password !== $confirmPassword) {
        echo json_encode(['success' => false, 'message' => 'Passwords do not match', 'field' => 'confirmPassword']);
        exit;
    }

    if (!$terms) {
        echo json_encode(['success' => false, 'message' => 'You must agree to the terms', 'field' => 'terms']);
        exit;
    }

    $result = registerUser($firstName, $lastName, $email, $password);
    echo json_encode($result);
    exit;
}

echo json_encode(['success' => false, 'message' => 'Invalid request method']);
?>