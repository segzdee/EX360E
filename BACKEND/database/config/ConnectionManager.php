<?php

namespace Database\Config;

use PDO;
use PDOException;

class ConnectionManager {
    private static $instance = null;
    private $connections = [];
    private $config;

    private function __construct() {
        $this->config = require(__DIR__ . '/database.php');
    }

    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function getConnection($name = 'default') {
        if (!isset($this->connections[$name])) {
            $this->connections[$name] = $this->createConnection($name);
        }
        return $this->connections[$name];
    }

    private function createConnection($name) {
        $config = $this->config['connections']['mysql'];
        
        try {
            $dsn = "mysql:host={$config['host']};dbname={$config['database']};charset={$config['charset']}";
            if (!empty($config['unix_socket'])) {
                $dsn .= ";unix_socket={$config['unix_socket']}";
            }
            
            $pdo = new PDO($dsn, $config['username'], $config['password'], $config['options']);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            
            return $pdo;
        } catch (PDOException $e) {
            throw new \Exception("Database connection failed: " . $e->getMessage());
        }
    }
}
