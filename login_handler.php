<?php
session_start();
include 'connect.php';

// Function to sanitize input
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Function to validate email
function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['signIn'])) {
    // Sanitize input
    $email = sanitizeInput($_POST['email']);
    $password = $_POST['password'];
    
    $errors = [];
    
    // Basic validation
    if (empty($email) || !validateEmail($email)) {
        $errors[] = "Please enter a valid email address.";
    }
    
    if (empty($password)) {
        $errors[] = "Please enter your password.";
    }
    
    // If no validation errors, proceed with login
    if (empty($errors)) {
        try {
            // Use prepared statement to prevent SQL injection
            $stmt = $conn->prepare("SELECT id, firstname, lastname, email, password FROM users WHERE email = ?");
            $stmt->bind_param("s", $email);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($result->num_rows === 1) {
                $user = $result->fetch_assoc();
                
                // Debug: Log the attempt (remove this in production)
                error_log("Login attempt for email: " . $email);
                error_log("Password from form: " . $password);
                error_log("Stored hash: " . $user['password']);
                
                // Verify password using password_verify()
                if (password_verify($password, $user['password'])) {
                    // Login successful - set session variables
                    $_SESSION['user_id'] = $user['id'];
                    $_SESSION['email'] = $user['email'];
                    $_SESSION['firstname'] = $user['firstname'];
                    $_SESSION['lastname'] = $user['lastname'];
                    $_SESSION['logged_in'] = true;
                    
                    // Regenerate session ID for security
                    session_regenerate_id(true);
                    
                    // Redirect to homepage
                    header("Location: homepage.php");
                    exit();
                } else {
                    error_log("Password verification failed for email: " . $email);
                    echo "<script>alert('Invalid email or password.'); window.location.href='index.html';</script>";
                }
            } else {
                error_log("No user found with email: " . $email);
                echo "<script>alert('Invalid email or password.'); window.location.href='index.html';</script>";
            }
            
            $stmt->close();
            
        } catch (Exception $e) {
            echo "<script>alert('Login error occurred. Please try again.'); window.location.href='index.html';</script>";
            error_log("Login error: " . $e->getMessage());
        }
    } else {
        // Display validation errors
        $errorMessage = implode("\\n", $errors);
        echo "<script>alert('$errorMessage'); window.location.href='index.html';</script>";
    }
} else {
    // Redirect if accessed directly
    header("Location: index.html");
    exit();
}

$conn->close();
?>