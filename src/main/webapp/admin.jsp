<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Dojo Practice</title>
    <link rel="stylesheet" href="webjars/dojo/1.10.4/dijit/themes/claro/claro.css">
    <link rel="stylesheet" href="webjars/gridx/1.3.3/resources/claro/Gridx.css">
    <link rel="stylesheet" href="css/admin.css">
    <link rel="shortcut icon" type="image/x-icon" href="images/favicon.ico">
</head>
<body class="claro">
<script type="text/javascript" src="js/app/dojoConfig.js"></script>
<script data-dojo-config="async: true, parseOnLoad: true" src="webjars/dojo/1.10.4/dojo/dojo.js.uncompressed.js"></script>
<script type="text/javascript" src="js/app/adminApp.js"></script>
<div class="loadingOverlay"><h1>Loading...</h1></div>
<a href="logout">Log Out</a>
<div class="outerContainer" id="mainAdmin" data-dojo-type="pytclon/admin/AdminPane"></div>
</body>
</html>