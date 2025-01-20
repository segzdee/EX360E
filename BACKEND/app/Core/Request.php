<?php
namespace App\Core;

class Request {
    protected $method;
    protected $path;
    protected $headers;

    public function __construct() {
        $this->method = $_SERVER["REQUEST_METHOD"];
        $this->path = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);
        $this->headers = getallheaders();
    }

    public function getMethod() {
        return $this->method;
    }

    public function getPath() {
        return $this->path;
    }
}
