<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="device-width">
  <title>Register & Login</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css">
  <link rel="stylesheet" href="css/login.css">
</head>
<body>
  <div class="container" id="signup" style="display:none;">
    <h1 class="form-title">Register</h1>
    <form method="post" action="register.php">
      <div class="input-group">
        <i class="fas fa-user"></i>
        <input type="text" name="fName" id="signUpFName" placeholder="First Name" required>
        <label for="signUpFName">First Name</label>
      </div>
      <div class="input-group">
        <i class="fas fa-user"></i>
        <input type="text" name="lName" id="signUpLName" placeholder="Last Name" required>
        <label for="signUpLName">Last Name</label>
      </div>
      <div class="input-group">
        <i class="fas fa-envelope"></i>
        <input type="email" name="email" id="signUpEmail" placeholder="Email" required>
        <label for="signUpEmail">Email</label>
      </div>
      <div class="input-group">
        <i class="fas fa-lock"></i>
        <input type="password" name="password" id="signUpPassword" placeholder="Password" required>
        <label for="signUpPassword">Password</label>
      </div>
      <input type="submit" class="btn" value="Sign Up" name="signUp">
    </form>
    <p class="or">
      ----------or--------
    </p>
    <div class="icons">
      <i class="fab fa-google"></i>
      <i class="fab fa-facebook"></i>
    </div>
    <div class="links">
      <p>Already Have Account ?</p>
      <button id="signInButton">Sign In</button>
    </div>
  </div>
  <div class="container" id="signIn">
    <h1 class="form-title">Sign In</h1>
    <form method="post" action="login_handler.php">
      <div class="input-group">
        <i class="fas fa-envelope"></i>
        <input type="email" name="email" id="signInEmail" placeholder="Email" required>
        <label for="signInEmail">Email</label>
      </div>
      <div class="input-group">
        <i class="fas fa-lock"></i>
        <input type="password" name="password" id="signInPassword" placeholder="Password" required>
        <label for="signInPassword">Password</label>
      </div>
      <p class="recover">
        <a href="forgot_password.html">Recover Password</a>
      </p>
      <input type="submit" class="btn" value="Sign In" name="signIn">
    </form>
    <p class="or">
      ----------or--------
    </p>
    <div class="icons">
      <i class="fab fa-google"></i>
      <i class="fab fa-facebook"></i>
    </div>
    <div class="links">
      <p>Don't have account yet ?</p>
      <button id="signUpButton">Sign Up</button>
    </div>
  </div>
  <script src="js/login.js"></script>
</body>
</html>