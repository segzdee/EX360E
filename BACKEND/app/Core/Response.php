<?php
namespace App\Core;

class Response {
    protected $status = 200;
    protected $headers = [];
    protected $body = "";

    public function setStatus($status) {
        $this->status = $status;
        return $this;
    }

    public function setBody($body) {
        $this->body = $body;
        return $this;
    }

    public function send() {
        http_response_code($this->status);
        foreach ($this->headers as $name => $value) {
            header("$name: $value");
        }
        echo $this->body;
    }
}
