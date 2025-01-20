cat << 'EOF' > app/Models/User.php
<?php
namespace App\Models;

use PDO;
use PDOException;
use Psr\Log\LoggerInterface;
use App\Core\Exceptions\HTTPException;

/**
 * User Model
 *
 * Handles all user-related database operations.
 */
class User
{
    /**
     * @var PDO Database connection instance
     */
    protected $db;

    /**
     * @var LoggerInterface Logger instance
     */
    protected $logger;

    /**
     * Constructor
     *
     * @param PDO $db
     * @param LoggerInterface $logger
     */
    public function __construct(PDO $db, LoggerInterface $logger)
    {
        $this->db = $db;
        $this->logger = $logger;
    }

    /**
     * Create a new user
     *
     * @param array $data ['name' => string, 'email' => string, 'password' => string, 'role' => string]
     * @return int The ID of the newly created user
     * @throws HTTPException
     */
    public function create(array $data): int
    {
        $sql = "INSERT INTO users (name, email, password, role, created_at, updated_at)
                VALUES (:name, :email, :password, :role, :created_at, :updated_at)";
        $stmt = $this->db->prepare($sql);

        // Hash the password before storing
        $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);

        $params = [
            ':name'       => $data['name'],
            ':email'      => $data['email'],
            ':password'   => $hashedPassword,
            ':role'       => $data['role'] ?? 'staff',
            ':created_at' => date('Y-m-d H:i:s'),
            ':updated_at' => date('Y-m-d H:i:s'),
        ];

        try {
            $stmt->execute($params);
            $userId = (int)$this->db->lastInsertId();
            $this->logger->info("User created successfully", ['user_id' => $userId]);
            return $userId;
        } catch (PDOException $e) {
            $this->logger->error("Failed to create user", ['error' => $e->getMessage()]);
            throw new HTTPException("Internal Server Error", 500, $e);
        }
    }

    /**
     * Retrieve a user by ID
     *
     * @param int $id
     * @return array|null
     * @throws HTTPException
     */
    public function getById(int $id): ?array
    {
        $sql = "SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = :id";
        $stmt = $this->db->prepare($sql);

        try {
            $stmt->execute([':id' => $id]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            return $user ?: null;
        } catch (PDOException $e) {
            $this->logger->error("Failed to retrieve user by ID", ['error' => $e->getMessage()]);
            throw new HTTPException("Internal Server Error", 500, $e);
        }
    }

    /**
     * Retrieve a user by email
     *
     * @param string $email
     * @return array|null
     * @throws HTTPException
     */
    public function getByEmail(string $email): ?array
    {
        $sql = "SELECT id, name, email, password, role, created_at, updated_at FROM users WHERE email = :email";
        $stmt = $this->db->prepare($sql);

        try {
            $stmt->execute([':email' => $email]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            return $user ?: null;
        } catch (PDOException $e) {
            $this->logger->error("Failed to retrieve user by email", ['error' => $e->getMessage()]);
            throw new HTTPException("Internal Server Error", 500, $e);
        }
    }

    /**
     * Update a user's information
     *
     * @param int $id
     * @param array $data ['name' => string, 'email' => string, 'password' => string, 'role' => string]
     * @return bool
     * @throws HTTPException
     */
    public function update(int $id, array $data): bool
    {
        $fields = [];
        $params = [':id' => $id];

        if (isset($data['name'])) {
            $fields[] = 'name = :name';
            $params[':name'] = $data['name'];
        }

        if (isset($data['email'])) {
            $fields[] = 'email = :email';
            $params[':email'] = $data['email'];
        }

        if (isset($data['password'])) {
            $fields[] = 'password = :password';
            $params[':password'] = password_hash($data['password'], PASSWORD_DEFAULT);
        }

        if (isset($data['role'])) {
            $fields[] = 'role = :role';
            $params[':role'] = $data['role'];
        }

        if (empty($fields)) {
            // Nothing to update
            return false;
        }

        $fields[] = 'updated_at = :updated_at';
        $params[':updated_at'] = date('Y-m-d H:i:s');

        $sql = "UPDATE users SET " . implode(', ', $fields) . " WHERE id = :id";
        $stmt = $this->db->prepare($sql);

        try {
            $result = $stmt->execute($params);
            if ($result) {
                $this->logger->info("User updated successfully", ['user_id' => $id]);
            }
            return $result;
        } catch (PDOException $e) {
            $this->logger->error("Failed to update user", ['error' => $e->getMessage()]);
            throw new HTTPException("Internal Server Error", 500, $e);
        }
    }

    /**
     * Delete a user by ID
     *
     * @param int $id
     * @return bool
     * @throws HTTPException
     */
    public function delete(int $id): bool
    {
        $sql = "DELETE FROM users WHERE id = :id";
        $stmt = $this->db->prepare($sql);

        try {
            $result = $stmt->execute([':id' => $id]);
            if ($result) {
                $this->logger->info("User deleted successfully", ['user_id' => $id]);
            }
            return $result;
        } catch (PDOException $e) {
            $this->logger->error("Failed to delete user", ['error' => $e->getMessage()]);
            throw new HTTPException("Internal Server Error", 500, $e);
        }
    }

    /**
     * Retrieve all users
     *
     * @return array
     * @throws HTTPException
     */
    public function getAll(): array
    {
        $sql = "SELECT id, name, email, role, created_at, updated_at FROM users";
        $stmt = $this->db->prepare($sql);

        try {
            $stmt->execute();
            $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $users;
        } catch (PDOException $e) {
            $this->logger->error("Failed to retrieve all users", ['error' => $e->getMessage()]);
            throw new HTTPException("Internal Server Error", 500, $e);
        }
    }
}
?>
EOF

echo "User model created at app/Models/User.php"

