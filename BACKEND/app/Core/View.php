<?php
namespace App\Core;

class View {
    public function render($template, array $data = []) {
        extract($data);
        ob_start();
        include __DIR__ . "/../../views/{$template}.php";
        $content = ob_get_clean();
        include __DIR__ . "/../../views/layouts/app.php";
        return $content;
    }
}
