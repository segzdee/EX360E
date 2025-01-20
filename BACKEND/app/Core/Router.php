<?php
namespace App\Core;

use DI\Container;
use App\Controllers\HomeController;
use App\Controllers\Api\AuthController as ApiAuthController;
use App\Controllers\DashboardController;
use App\Middleware\AuthMiddleware;
use App\Middleware\CsrfMiddleware;
use App\Core\Request;
use App\Core\Response;
use Psr\Log\LoggerInterface;

class Router
{
    protected $routes = [];
    protected $container;
    protected $logger;

    public function __construct(Container $container)
    {
        $this->container = $container;
        $this->logger = $container->get(LoggerInterface::class);
    }

    public function get($path, $handler, $middlewares = [])
    {
        $this->routes["GET"][$path] = ["handler" => $handler, "middlewares" => $middlewares];
    }

    public function post($path, $handler, $middlewares = [])
    {
        $this->routes["POST"][$path] = ["handler" => $handler, "middlewares" => $middlewares];
    }

    public function defineRoutes()
    {
        // Define your routes here
        $this->get("/", [$this->container->get(HomeController::class), "index"]);
        $this->post("/api/auth/login", [$this->container->get(ApiAuthController::class), "login"], [CsrfMiddleware::class]);
        $this->get("/dashboard/company", [$this->container->get(DashboardController::class), "company"], [AuthMiddleware::class]);
        $this->get("/dashboard/agency", [$this->container->get(DashboardController::class), "agency"], [AuthMiddleware::class]);
        $this->get("/dashboard/staff", [$this->container->get(DashboardController::class), "staff"], [AuthMiddleware::class]);
        // Add more routes as needed
    }

    public function dispatch($method, $path)
    {
        $this->logger->info("Dispatching request", ['method' => $method, 'path' => $path]);

        if (isset($this->routes[$method][$path])) {
            $route = $this->routes[$method][$path];
            $handler = $route["handler"];
            $middlewares = $route["middlewares"];

            // Create Request and Response objects
            $request = new Request();
            $response = new Response();

            // Apply middlewares
            foreach ($middlewares as $middlewareClass) {
                $middleware = $this->container->get($middlewareClass);
                $this->logger->info("Applying middleware", ['middleware' => $middlewareClass]);
                $result = $middleware->handle($request, $response);
                if ($result instanceof Response) {
                    $this->logger->warning("Middleware returned a response, halting dispatch", ['middleware' => $middlewareClass]);
                    return $result;
                }
            }

            // Call the controller action
            $this->logger->info("Calling controller action", ['handler' => get_class($handler[0]) . '::' . $handler[1]]);
            return call_user_func([$handler], $request);
        }

        // Handle 404 Not Found
        $this->logger->warning("Route not found", ['method' => $method, 'path' => $path]);
        $response = new Response();
        $response->setStatus(404);
        $response->setBody("404 Not Found");
        return $response;
    }
}
?>
