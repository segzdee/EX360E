<?php
namespace App\Controllers;

use App\Core\Request;
use App\Core\Response;
use App\Models\User;

class HomeController
{
    /**
     * @var User
     */
    protected $userModel;

    /**
     * Constructor
     *
     * @param User $userModel
     */
    public function __construct(User $userModel)
    {
        $this->userModel = $userModel;
    }

    /**
     * Home Page Handler
     *
     * @param Request $request
     * @return Response
     */
    public function index(Request $request): Response
    {
        // Example: Retrieve all users (for demonstration purposes)
        $users = $this->userModel->getAll();

        // Pass data to the view
        $view = new \App\Core\View('home', ['users' => $users]);

        return new Response($view->render(), 200);
    }
}
?>
