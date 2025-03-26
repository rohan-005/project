<?php
function sanitizeInput($data) {
    return htmlspecialchars(strip_tags(trim($data)));
}

function jsonResponse($success, $message = '', $field = null, $additionalData = []) {
    $response = ['success' => $success];
    if ($message) $response['message'] = $message;
    if ($field) $response['field'] = $field;
    return array_merge($response, $additionalData);
}

function startSession() {
    if (session_status() === PHP_SESSION_NONE) {
        session_start([
            'cookie_secure' => isset($_SERVER['HTTPS']),
            'cookie_httponly' => true
        ]);
    }
}
?>