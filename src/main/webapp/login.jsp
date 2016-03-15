<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Login Page</title>
    <link rel="stylesheet" href="css/style.css" type="text/css">
</head>
<body>
<script type="text/javascript" src="js/app/dojoConfig.js"></script>
<script data-dojo-config="async: true, parseOnLoad: true" src="webjars/dojo/1.10.4/dojo/dojo.js.uncompressed.js"></script>
<script type="text/javascript" src="js/app/loginApp.js"></script>

<div class="login">
    <!--<div class="login-screen">
        <div class="app-title">
            <h1>Welcome</h1>
        </div>

        <form name="loginForm" method="POST" action="j_security_check" class="login-form">
            <div class="control-group">
                <input type="text" class="login-field" name="j_username" value="" placeholder="username" id="username">
                <label class="login-field-icon fui-user" for="username"></label>
            </div>

            <div class="control-group">
                <input type="password" class="login-field" name="j_password" value="" placeholder="password" id="password">
                <label class="login-field-icon fui-lock" for="password"></label>
            </div>

            <span style="width: 50%">
                <button class="btn" type="submit">Sign In</button>
            </span>
            <span style="width: 50%">
                <button class="btn" type="submit">Sign Up</button>
            </span>
        </form>
    </div>-->
    <div class="login-screen login-sign-in" id="loginScreen">
        <div class="app-title">
            <h1>Welcome</h1>
            <h2 id="loginMessage">Enter your login and password.</h2>
        </div>

    </div>
</div>

</body>
</html>