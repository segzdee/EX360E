<?php
declare(strict_types=1);

/**
 * File: bootstrap/app.php
 * Application Bootstrapping: Dependency Injection Container and Service Registration
 */

use App\Core\Container;
use App\Core\Config;
use App\Core\Database;
use App\Core\Session;
use App\Core\Security\SecurityManager;
use App\Core\Logger\LogManager;
use Monolog\Logger;
use Monolog\Handler\StreamHandler;
use App\Middleware\AuthMiddleware;
use App\Middleware\RoleMiddleware;
use App\Middleware\GeoTrackingMiddleware;
use App\Middleware\CsrfMiddleware;
use App\Middleware\RateLimitMiddleware;
use App\Services\AuthService;
use App\Services\ShiftService;
use App\Services\ProfileService;
use App\Services\AgencyStaffService;
use App\Services\AgencyShiftService;
use App\Services\JobPostService;
use App\Services\PaymentService;
use App\Services\GeolocationService;
use App\Core\Router;

/**
 * Ensure BASE_PATH is defined
 */
if (!defined('BASE_PATH')) {
    define('BASE_PATH', dirname(__DIR__));
}

/**
 * Initialize Dependency Injection Container
 */
$container = new Container();

/**
 * Register Configuration Service
 */
$container->singleton(Config::class, function(Container $container) {
    return new Config(BASE_PATH . '/app/Config');
});

/**
 * Register Logger Service using Monolog
 */
$container->singleton(Logger::class, function(Container $container) {
    $config = $container->get(Config::class);
    $logger = new Logger('Extrastaff360');
    $logPath = $config->get('app.log_path', BASE_PATH . '/logs/app.log');
    $logger->pushHandler(new StreamHandler($logPath, Logger::DEBUG));
    return $logger;
});

/**
 * Register LogManager Service
 */
$container->singleton(LogManager::class, function(Container $container) {
    return new LogManager($container->get(Logger::class));
});

/**
 * Register Database Service
 */
$container->singleton(Database::class, function(Container $container) {
    $config = $container->get(Config::class);
    return new Database(
        $config->get('database.host'),
        $config->get('database.name'),
        $config->get('database.user'),
        $config->get('database.pass'),
        $container->get(LogManager::class)
    );
});

/**
 * Register SecurityManager Service
 */
$container->singleton(SecurityManager::class, function(Container $container) {
    return new SecurityManager($container);
});

/**
 * Register Session Service with Secure Parameters
 */
$container->singleton(Session::class, function(Container $container) {
    $config = $container->get(Config::class);
    session_set_cookie_params([
        'lifetime' => 0, // Session cookie expires on browser close
        'path' => '/',
        'domain' => $config->get('session.domain', ''),
        'secure' => $config->get('session.secure', true), // HTTPS only in production
        'httponly' => true,
        'samesite' => 'Lax' // Can be 'Strict' or 'None' based on requirements
    ]);
    $session = new Session();
    $session->start();
    return $session;
});

/**
 * Register Services
 */
$container->singleton(AuthService::class, function(Container $container) {
    return new AuthService($container->get(Database::class));
});

$container->singleton(ShiftService::class, function(Container $container) {
    return new ShiftService($container->get(Database::class), $container->get(LogManager::class));
});

$container->singleton(ProfileService::class, function(Container $container) {
    return new ProfileService($container->get(Database::class), $container->get(LogManager::class));
});

$container->singleton(AgencyStaffService::class, function(Container $container) {
    return new AgencyStaffService($container->get(Database::class), $container->get(LogManager::class));
});

$container->singleton(AgencyShiftService::class, function(Container $container) {
    return new AgencyShiftService($container->get(Database::class), $container->get(LogManager::class));
});

$container->singleton(JobPostService::class, function(Container $container) {
    return new JobPostService($container->get(Database::class), $container->get(LogManager::class));
});

$container->singleton(PaymentService::class, function(Container $container) {
    return new PaymentService($container->get(Database::class), $container->get(LogManager::class));
});

$container->singleton(GeolocationService::class, function(Container $container) {
    return new GeolocationService($container->get(LogManager::class));
});

/**
 * Register Middleware
 */
$container->singleton(AuthMiddleware::class, function(Container $container) {
    return new AuthMiddleware($container->get(AuthService::class));
});

$container->singleton(RoleMiddleware::class, function(Container $container) {
    // Example: Roles can be passed as parameters or configured elsewhere
    return new RoleMiddleware($container->get(AuthService::class), ['admin', 'agency']);
});

$container->singleton(GeoTrackingMiddleware::class, function(Container $container) {
    return new GeoTrackingMiddleware($container->get(GeolocationService::class));
});

$container->singleton(CsrfMiddleware::class, function(Container $container) {
    return new CsrfMiddleware($container->get(Session::class));
});

$container->singleton(RateLimitMiddleware::class, function(Container $container) {
    return new RateLimitMiddleware(100, 60); // 100 requests per 60 seconds
});

/**
 * Register ValidationService
 */
$container->singleton(App\Services\ValidationService::class, function(Container $container) {
    return new App\Services\ValidationService();
});

/**
 * Initialize Router and Register Routes
 */
$container->singleton(Router::class, function(Container $container) {
    $router = new Router($container);
    
    // Load Web Routes
    $router->loadRoutes(BASE_PATH . '/routes/web.php');
    
    // Load API Routes
    $router->loadRoutes(BASE_PATH . '/routes/api.php');
    
    return $router;
});

/**
 * Register Global Middleware
 */
$router = $container->get(Router::class);
$router->addGlobalMiddleware(CsrfMiddleware::class);
$router->addGlobalMiddleware(RateLimitMiddleware::class);

/**
 * Optionally, add more global middleware as needed
 */

// Return the configured container
return $container;
