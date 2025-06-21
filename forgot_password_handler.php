<?php
include 'connect.php';

// Function to sanitize input
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Function to generate random 6-digit code
function generateResetCode() {
    return sprintf("%06d", mt_rand(1, 999999));
}

// Function to send email using Brevo SMTP
function sendResetEmail($email, $resetCode, $firstName) {
    // Brevo SMTP configuration
    $brevoHost = 'smtp-relay.brevo.com';
    $brevoPort = 587;
    $brevoUsername = 'zawadiinvoice@gmail.com'; // Replace with your Brevo login email
    $brevoPassword = '0JdIjhfr1sg8nvAD'; // Replace with your Brevo SMTP key
    $fromEmail = 'zawadiinvoice@gmail.com'; // Your sender email
    $fromName = 'Zawadi Invoice';
    
    $subject = "Password Reset Code";
    $htmlMessage = "
    <html>
    <head>
        <title>Password Reset</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #007bff; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f8f9fa; }
            .code-box { background: #fff; border: 2px solid #007bff; border-radius: 5px; padding: 20px; text-align: center; margin: 20px 0; }
            .code { font-size: 24px; font-weight: bold; color: #007bff; letter-spacing: 3px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h2>Password Reset Request</h2>
            </div>
            <div class='content'>
                <p>Hello $firstName,</p>
                <p>You requested a password reset for your account. Please use the code below to reset your password:</p>
                <div class='code-box'>
                    <div class='code'>$resetCode</div>
                </div>
                <p><strong>Important:</strong> This code will expire in 15 minutes for security reasons.</p>
                <p>If you didn't request this password reset, please ignore this email and your password will remain unchanged.</p>
            </div>
            <div class='footer'>
                <p>Best regards,<br>Zawadi Invoice, Marketing Team</p>
                <p>This is an automated message, please do not reply to this email.</p>
            </div>
        </div>
    </body>
    </html>
    ";
    
    // Create plain text version
    $textMessage = "Hello $firstName,\n\n";
    $textMessage .= "You requested a password reset for your account.\n";
    $textMessage .= "Your reset code is: $resetCode\n\n";
    $textMessage .= "This code will expire in 15 minutes.\n\n";
    $textMessage .= "If you didn't request this reset, please ignore this email.\n\n";
    $textMessage .= "Best regards,\nZawadi Invoice, Marketing Team";
    
    // Email headers
    $boundary = md5(time());
    $headers = "From: $fromName <$fromEmail>\r\n";
    $headers .= "Reply-To: $fromEmail\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: multipart/alternative; boundary=\"$boundary\"\r\n";
    
    // Email body
    $body = "--$boundary\r\n";
    $body .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $body .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
    $body .= $textMessage . "\r\n";
    $body .= "--$boundary\r\n";
    $body .= "Content-Type: text/html; charset=UTF-8\r\n";
    $body .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
    $body .= $htmlMessage . "\r\n";
    $body .= "--$boundary--";
    
    // Create socket connection
    $socket = fsockopen($brevoHost, $brevoPort, $errno, $errstr, 30);
    if (!$socket) {
        error_log("SMTP connection failed: $errstr ($errno)");
        return false;
    }
    
    // Function to send SMTP command and get response
    function sendSMTPCommand($socket, $command, $expectedCode = 250) {
        fwrite($socket, $command . "\r\n");
        $response = fgets($socket, 512);
        $code = intval(substr($response, 0, 3));
        return $code == $expectedCode;
    }
    
    try {
        // Read initial response
        fgets($socket, 512);
        
        // Send SMTP commands
        if (!sendSMTPCommand($socket, "EHLO " . $_SERVER['SERVER_NAME'], 250)) {
            throw new Exception("EHLO failed");
        }
        
        if (!sendSMTPCommand($socket, "STARTTLS", 220)) {
            throw new Exception("STARTTLS failed");
        }
        
        // Enable crypto
        if (!stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
            throw new Exception("TLS encryption failed");
        }
        
        // Send EHLO again after TLS
        if (!sendSMTPCommand($socket, "EHLO " . $_SERVER['SERVER_NAME'], 250)) {
            throw new Exception("EHLO after TLS failed");
        }
        
        if (!sendSMTPCommand($socket, "AUTH LOGIN", 334)) {
            throw new Exception("AUTH LOGIN failed");
        }
        
        if (!sendSMTPCommand($socket, base64_encode($brevoUsername), 334)) {
            throw new Exception("Username authentication failed");
        }
        
        if (!sendSMTPCommand($socket, base64_encode($brevoPassword), 235)) {
            throw new Exception("Password authentication failed");
        }
        
        if (!sendSMTPCommand($socket, "MAIL FROM: <$fromEmail>", 250)) {
            throw new Exception("MAIL FROM failed");
        }
        
        if (!sendSMTPCommand($socket, "RCPT TO: <$email>", 250)) {
            throw new Exception("RCPT TO failed");
        }
        
        if (!sendSMTPCommand($socket, "DATA", 354)) {
            throw new Exception("DATA command failed");
        }
        
        // Send the email content
        fwrite($socket, "Subject: $subject\r\n");
        fwrite($socket, $headers . "\r\n");
        fwrite($socket, $body . "\r\n");
        fwrite($socket, ".\r\n");
        
        // Check if email was sent successfully
        $response = fgets($socket, 512);
        $code = intval(substr($response, 0, 3));
        
        if ($code != 250) {
            throw new Exception("Email sending failed: $response");
        }
        
        sendSMTPCommand($socket, "QUIT", 221);
        fclose($socket);
        
        return true;
        
    } catch (Exception $e) {
        error_log("SMTP Error: " . $e->getMessage());
        fclose($socket);
        return false;
    }
}

// Alternative function using PHPMailer (recommended for production)
function sendResetEmailWithPHPMailer($email, $resetCode, $firstName) {
    // This requires PHPMailer library
    // You can install it via Composer: composer require phpmailer/phpmailer
    
    /*
    require 'vendor/autoload.php';
    
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\SMTP;
    use PHPMailer\PHPMailer\Exception;
    
    $mail = new PHPMailer(true);
    
    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host       = 'smtp-relay.brevo.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'YOUR_BREVO_EMAIL';
        $mail->Password   = 'YOUR_BREVO_SMTP_KEY';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = 587;
        
        // Recipients
        $mail->setFrom('cloudclaxxafrica@gmail.com', 'CloudClaxx Africa');
        $mail->addAddress($email, $firstName);
        
        // Content
        $mail->isHTML(true);
        $mail->Subject = 'Password Reset Code';
        $mail->Body    = "HTML content here...";
        $mail->AltBody = "Plain text content here...";
        
        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("PHPMailer Error: {$mail->ErrorInfo}");
        return false;
    }
    */
}

// Handle resend request
if (isset($_GET['resend']) && isset($_GET['email'])) {
    $email = sanitizeInput($_GET['email']);
    
    try {
        // Get user info
        $stmt = $conn->prepare("SELECT firstname FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 1) {
            $user = $result->fetch_assoc();
            $resetCode = generateResetCode();
            $expiryTime = date('Y-m-d H:i:s', strtotime('+15 minutes'));
            
            // Update reset code in database
            $updateStmt = $conn->prepare("UPDATE users SET reset_code = ?, reset_code_expiry = ? WHERE email = ?");
            $updateStmt->bind_param("sss", $resetCode, $expiryTime, $email);
            $updateStmt->execute();
            
            // Send email using Brevo
            if (sendResetEmail($email, $resetCode, $user['firstname'])) {
                echo "<script>alert('Reset code has been resent to your email.'); window.location.href='forgot_password.html?code_sent=1&email=" . urlencode($email) . "';</script>";
            } else {
                echo "<script>alert('Failed to send email. Please check your email configuration.'); window.location.href='forgot_password.html';</script>";
            }
            
            $updateStmt->close();
        }
        $stmt->close();
    } catch (Exception $e) {
        error_log("Resend error: " . $e->getMessage());
        echo "<script>alert('Error occurred. Please try again.'); window.location.href='forgot_password.html';</script>";
    }
    exit();
}

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['sendCode'])) {
    $email = sanitizeInput($_POST['email']);
    
    // Validate email
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "<script>alert('Please enter a valid email address.'); window.location.href='forgot_password.html';</script>";
        exit();
    }
    
    try {
        // Check if email exists in database
        $stmt = $conn->prepare("SELECT id, firstname FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 1) {
            $user = $result->fetch_assoc();
            $resetCode = generateResetCode();
            $expiryTime = date('Y-m-d H:i:s', strtotime('+15 minutes'));
            
            // Store reset code in database
            $updateStmt = $conn->prepare("UPDATE users SET reset_code = ?, reset_code_expiry = ? WHERE email = ?");
            $updateStmt->bind_param("sss", $resetCode, $expiryTime, $email);
            
            if ($updateStmt->execute()) {
                // Send reset code via Brevo SMTP
                if (sendResetEmail($email, $resetCode, $user['firstname'])) {
                    // Redirect to code verification form
                    header("Location: forgot_password.html?code_sent=1&email=" . urlencode($email));
                    exit();
                } else {
                    echo "<script>alert('Failed to send reset email. Please check your email configuration and try again.'); window.location.href='forgot_password.html';</script>";
                }
            } else {
                echo "<script>alert('Error occurred. Please try again.'); window.location.href='forgot_password.html';</script>";
            }
            
            $updateStmt->close();
        } else {
            // Email not found - but don't reveal this for security
            echo "<script>alert('If this email exists in our system, you will receive a reset code shortly.'); window.location.href='forgot_password.html';</script>";
        }
        
        $stmt->close();
        
    } catch (Exception $e) {
        error_log("Password reset error: " . $e->getMessage());
        echo "<script>alert('Error occurred. Please try again.'); window.location.href='forgot_password.html';</script>";
    }
} else {
    // Redirect if accessed directly
    header("Location: forgot_password.html");
    exit();
}

$conn->close();
?>