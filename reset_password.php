<?php
include 'connect.php';

// Function to sanitize input
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Function to validate password strength
function validatePassword($password) {
    // At least 8 characters, contains uppercase, lowercase, number
    return preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/', $password);
}

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['resetPassword'])) {
    $email = sanitizeInput($_POST['email']);
    $resetCode = sanitizeInput($_POST['reset_code']);
    $newPassword = $_POST['new_password'];
    $confirmPassword = $_POST['confirm_password'];
    
    $errors = [];
    
    // Validate inputs
    if (empty($email) || empty($resetCode) || empty($newPassword) || empty($confirmPassword)) {
        $errors[] = "Please fill in all fields.";
    }
    
    // Check if passwords match
    if ($newPassword !== $confirmPassword) {
        $errors[] = "Passwords do not match.";
    }
    
    // Validate password strength
    if (!validatePassword($newPassword)) {
        $errors[] = "Password must be at least 8 characters long and contain uppercase, lowercase, and number.";
    }
    
    // If validation errors exist, show them
    if (!empty($errors)) {
        $errorMessage = implode("\\n", $errors);
        echo "<script>alert('$errorMessage'); window.location.href='forgot_password.html?code_verified=1&email=" . urlencode($email) . "&code=" . urlencode($resetCode) . "';</script>";
        exit();
    }
    
    try {
        // Verify reset code is still valid
        $stmt = $conn->prepare("SELECT id, reset_code, reset_code_expiry FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 1) {
            $user = $result->fetch_assoc();
            $currentTime = date('Y-m-d H:i:s');
            
            // Check if code is still valid
            if ($user['reset_code'] === $resetCode && $user['reset_code_expiry'] > $currentTime) {
                // Hash the new password
                $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
                
                // Update password and clear reset code
                $updateStmt = $conn->prepare("UPDATE users SET password = ?, reset_code = NULL, reset_code_expiry = NULL WHERE email = ?");
                $updateStmt->bind_param("ss", $hashedPassword, $email);
                
                if ($updateStmt->execute()) {
                    echo "<script>alert('Password has been reset successfully! You can now login with your new password.'); window.location.href='index.html';</script>";
                } else {
                    echo "<script>alert('Failed to reset password. Please try again.'); window.location.href='forgot_password.html';</script>";
                }
                
                $updateStmt->close();
            } else if ($user['reset_code_expiry'] <= $currentTime) {
                // Code has expired
                echo "<script>alert('Reset code has expired. Please request a new one.'); window.location.href='forgot_password.html';</script>";
            } else {
                // Invalid code
                echo "<script>alert('Invalid reset code. Please start over.'); window.location.href='forgot_password.html';</script>";
            }
        } else {
            // Email not found
            echo "<script>alert('Invalid request. Please start over.'); window.location.href='forgot_password.html';</script>";
        }
        
        $stmt->close();
        
    } catch (Exception $e) {
        echo "<script>alert('Error occurred. Please try again.'); window.location.href='forgot_password.html';</script>";
        error_log("Password reset error: " . $e->getMessage());
    }
} else {
    // Redirect if accessed directly
    header("Location: forgot_password.html");
    exit();
}

$conn->close();
?>