<?php
include 'connect.php';

// Function to sanitize input
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['verifyCode'])) {
    $email = sanitizeInput($_POST['email']);
    $resetCode = sanitizeInput($_POST['reset_code']);
    
    // Validate inputs
    if (empty($email) || empty($resetCode)) {
        echo "<script>alert('Please fill in all fields.'); window.location.href='forgot_password.html';</script>";
        exit();
    }
    
    // Validate reset code format (6 digits)
    if (!preg_match('/^\d{6}$/', $resetCode)) {
        echo "<script>alert('Invalid reset code format.'); window.location.href='forgot_password.html?code_sent=1&email=" . urlencode($email) . "';</script>";
        exit();
    }
    
    try {
        // Check if reset code is valid and not expired
        $stmt = $conn->prepare("SELECT id, reset_code, reset_code_expiry FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 1) {
            $user = $result->fetch_assoc();
            $currentTime = date('Y-m-d H:i:s');
            
            // Check if code matches and hasn't expired
            if ($user['reset_code'] === $resetCode && $user['reset_code_expiry'] > $currentTime) {
                // Code is valid, redirect to new password form
                header("Location: forgot_password.html?code_verified=1&email=" . urlencode($email) . "&code=" . urlencode($resetCode));
                exit();
            } else if ($user['reset_code_expiry'] <= $currentTime) {
                // Code has expired
                echo "<script>alert('Reset code has expired. Please request a new one.'); window.location.href='forgot_password.html';</script>";
            } else {
                // Invalid code
                echo "<script>alert('Invalid reset code. Please check and try again.'); window.location.href='forgot_password.html?code_sent=1&email=" . urlencode($email) . "';</script>";
            }
        } else {
            // Email not found
            echo "<script>alert('Invalid request. Please start over.'); window.location.href='forgot_password.html';</script>";
        }
        
        $stmt->close();
        
    } catch (Exception $e) {
        echo "<script>alert('Error occurred. Please try again.'); window.location.href='forgot_password.html';</script>";
        error_log("Reset code verification error: " . $e->getMessage());
    }
} else {
    // Redirect if accessed directly
    header("Location: forgot_password.html");
    exit();
}

$conn->close();
?>