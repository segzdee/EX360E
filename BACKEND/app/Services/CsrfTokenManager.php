<?php
namespace App\Services;

class CsrfTokenManager {
    public function generateToken() {
        return bin2hex(random_bytes(32));
    }

    public function validateToken($token) {
        return hash_equals($_SESSION['csrf_token'] ?? '', $token);
    }
}
