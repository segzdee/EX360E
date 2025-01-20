cat << 'EOF' > app/Controllers/Api/AuthController.php
<?php
namespace App\Controllers\Api;

use App\Core\Request;
use App\Core\Response;
use App\Models\User;
use App\Core\Exceptions\HTTPException;

/**
 * Auth Controller
 *
 * Handles authentication-related actions such as registration and login.
 */
class AuthController
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
     * User Registration Handler
     *
     * @param Request $request
     * @return Response
     * @throws HTTPException
     */
    public function register(Request $request): Response
    {
        $data = $request->getBody();

        // Validate input data (basic example)
        if (empty($data['name']) || empty($data['email']) || empty($data['password'])) {
            throw new HTTPException("Invalid input data", 400);
        }

        // Check if the email already exists
        if ($this->userModel->getByEmail($data['email'])) {
            throw new HTTPException("Email already in use", 409);
        }

        // Create the user
        $userId = $this->userModel->create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => $data['password'],
            'role'     => $data['role'] ?? 'staff',
        ]);

        // Prepare response data
        $responseData = [
            'id'    => $userId,
            'name'  => $data['name'],
            'email' => $data['email'],
            'role'  => $data['role'] ?? 'staff',
        ];

        return new Response($responseData, 201);
    }

    /**
     * User Login Handler
     *
     * @param Request $request
     * @return Response
     * @throws HTTPException
     */
    public function login(Request $request): Response
    {
        $data = $request->getBody();

        // Validate input data (basic example)
        if (empty($data['email']) || empty($data['password'])) {
            throw new HTTPException("Invalid input data", 400);
        }

        // Retrieve user by email
        $user = $this->userModel->getByEmail($data['email']);

        if (!$user) {
            throw new HTTPException("Invalid credentials", 401);
        }

        // Verify password
        if (!password_verify($data['password'], $user['password'])) {
            throw new HTTPException("Invalid credentials", 401);
        }

        // Generate authentication token (e.g., JWT) - Placeholder
        $token = bin2hex(random_bytes(16)); // Replace with actual token generation

        // Prepare response data
        $responseData = [
            'token' => $token,
            'user'  => [
                'id'    => $user['id'],
                'name'  => $user['name'],
                'email' => $user['email'],
                'role'  => $user['role'],
            ],
        ];

        return new Response($responseData, 200);
    }
}
?>
EOF

echo "Auth API controller created at app/Controllers/Api/AuthController.php"

