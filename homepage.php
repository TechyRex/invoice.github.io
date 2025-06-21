<?php
session_start();

// Check if user is logged in
if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    // Redirect to login page if not logged in
    header("Location: index.html");
    exit();
}

// Get user information from session
$firstName = isset($_SESSION['firstname']) ? $_SESSION['firstname'] : 'User';
$lastName = isset($_SESSION['lastname']) ? $_SESSION['lastname'] : '';
$email = isset($_SESSION['email']) ? $_SESSION['email'] : '';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Homepage - Welcome</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .welcome-message {
            background: #e8f5e8;
            padding: 20px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        .user-info {
            background: #f0f8ff;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        .logout-btn {
            background: #dc3545;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
        }
        .logout-btn:hover {
            background: #c82333;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to Your Dashboard</h1>
        </div>
        
        <div class="welcome-message">
            <h2>Hello, <?php echo htmlspecialchars($firstName . ' ' . $lastName); ?>!</h2>
            <p>You have successfully logged into your account.</p>
        </div>
        
        <div class="user-info">
            <h3>Your Account Information:</h3>
            <p><strong>Name:</strong> <?php echo htmlspecialchars($firstName . ' ' . $lastName); ?></p>
            <p><strong>Email:</strong> <?php echo htmlspecialchars($email); ?></p>
            <p><strong>Login Time:</strong> <?php echo date('Y-m-d H:i:s'); ?></p>
        </div>
        
        <div style="text-align: center;">
            <a href="homepage1.php" style="background: #28a745; color: white; padding: 12px 30px; border: none; border-radius: 5px; cursor: pointer; text-decoration: none; display: inline-block; margin-right: 10px; font-size: 16px;">Continue</a>
            <a href="logout.php" class="logout-btn">Logout</a>
        </div>
    </div>
</body>
</html>