<?php
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

// Function to validate password strength
function validatePassword($password) {
    // At least 8 characters, contains uppercase, lowercase, number
    return preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/', $password);
}

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['signUp'])) {
    // Sanitize and validate input
    $firstName = sanitizeInput($_POST['fName']);
    $lastName = sanitizeInput($_POST['lName']);
    $email = sanitizeInput($_POST['email']);
    $password = $_POST['password'];
    
    $errors = [];
    
    // Validation
    if (empty($firstName) || strlen($firstName) < 2) {
        $errors[] = "First name must be at least 2 characters long.";
    }
    
    if (empty($lastName) || strlen($lastName) < 2) {
        $errors[] = "Last name must be at least 2 characters long.";
    }
    
    if (empty($email) || !validateEmail($email)) {
        $errors[] = "Please enter a valid email address.";
    }
    
    if (empty($password) || !validatePassword($password)) {
        $errors[] = "Password must be at least 8 characters long and contain uppercase, lowercase, and number.";
    }
    
    // If no validation errors, proceed with registration
    if (empty($errors)) {
        try {
            // Check if email already exists using prepared statement
            $checkEmailStmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
            $checkEmailStmt->bind_param("s", $email);
            $checkEmailStmt->execute();
            $result = $checkEmailStmt->get_result();
            
            if ($result->num_rows > 0) {
                echo "<script>alert('Email address already exists!'); window.location.href='index.html';</script>";
            } else {
                // Hash password securely
                $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
                
                // Insert new user using prepared statement
                $insertStmt = $conn->prepare("INSERT INTO users (firstname, lastname, email, password) VALUES (?, ?, ?, ?)");
                $insertStmt->bind_param("ssss", $firstName, $lastName, $email, $hashedPassword);
                
                if ($insertStmt->execute()) {
                    // Get the newly created user ID
                    $userId = $conn->insert_id;
                    
                    // Start session and log the user in automatically
                    session_start();
                    $_SESSION['user_id'] = $userId;
                    $_SESSION['email'] = $email;
                    $_SESSION['firstname'] = $firstName;
                    $_SESSION['lastname'] = $lastName;
                    $_SESSION['logged_in'] = true;
                    
                    // Regenerate session ID for security
                    session_regenerate_id(true);
                    
                    // Redirect to homepage
                    header("Location: homepage.php");
                    exit();
                } else {
                    echo "<script>alert('Registration failed. Please try again.'); window.location.href='index.html';</script>";
                }
                
                $insertStmt->close();
            }
            
            $checkEmailStmt->close();
            
        } catch (Exception $e) {
            echo "<script>alert('Database error occurred. Please try again.'); window.location.href='index.html';</script>";
            error_log("Registration error: " . $e->getMessage());
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