<?php
use DI\ContainerBuilder;
use App\Core\Router;
use Monolog\Logger;
use Monolog\Handler\StreamHandler;
use Psr\Log\LoggerInterface;
use App\Models\User;
use Dotenv\Dotenv;

// Load environment variables
$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

// Initialize the ContainerBuilder
$containerBuilder = new ContainerBuilder();

// Add definitions
$containerBuilder->addDefinitions([

    // Logger Interface
    LoggerInterface::class => function() {
        $logger = new Logger("app");
        $logger->pushHandler(new StreamHandler(__DIR__ . "/../storage/logs/app.log", Logger::DEBUG));
        return $logger;
    },

    // Database Connection (PDO)
    PDO::class => function() {
        $host = $_ENV['DB_HOST'] ?? '127.0.0.1';
        $db   = $_ENV['DB_NAME'] ?? 'extrastaff360';
        $user = $_ENV['DB_USER'] ?? 'your_db_user';
        $pass = $_ENV['DB_PASS'] ?? 'your_db_password';
        $charset = 'utf8mb4';

        $dsn = "mysql:host=$host;dbname=$db;charset=$charset";
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];

        try {
            return new PDO($dsn, $user, $pass, $options);
        } catch (\PDOException $e) {
            throw new \App\Core\Exceptions\HTTPException("Database Connection Failed", 500, $e);
        }
    },

    // Router
    Router::class => function($c) {
        return new Router($c);
    },

    // User Model
    User::class => DI\autowire(),

    // Controllers
    App\Controllers\HomeController::class => DI\autowire(),
    App\Controllers\Api\AuthController::class => DI\autowire(),
    App\Controllers\DashboardController::class => DI\autowire(),

    // Middleware
    App\Middleware\AuthMiddleware::class => DI\autowire(),
    App\Middleware\CsrfMiddleware::class => DI\autowire(),

    // Other services
    App\Core\View::class => DI\create(App\Core\View::class),
    App\Services\StatisticsService::class => DI\create(App\Services\StatisticsService::class),
    App\Services\CsrfTokenManager::class => DI\create(App\Services\CsrfTokenManager::class),

]);

// Build and return the container
return $containerBuilder->build();
?>
