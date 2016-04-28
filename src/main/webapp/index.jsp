<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Main Page</title>
    <link rel="stylesheet" href="webjars/dojo/1.10.4/dijit/themes/claro/claro.css">
    <link rel="shortcut icon" type="image/x-icon" href="images/favicon.ico">
    <link rel="stylesheet" href="css/main.css">
</head>
<body class="claro">
    <script type="text/javascript" src="js/app/dojoConfig.js"></script>
    <script data-dojo-config="async: true, parseOnLoad: true" src="webjars/dojo/1.10.4/dojo/dojo.js.uncompressed.js"></script>
    <script type="text/javascript" src="js/app/mainApp.js"></script>
    <div class="loadingOverlay"><h1>Loading...</h1></div>
    <a id="logoutBtn" href="logout">Log Out</a>
    <div
            id="appLayout" class="demoLayout"
            data-dojo-type="dijit/layout/BorderContainer"
            data-dojo-props="design: 'headline'">
        <div
                class="centerPanel"
                data-dojo-type="dijit/layout/ContentPane"
                data-dojo-props="region: 'center'">
            <div>
                <h4>Group 1 Content</h4>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            </div>
            <div>
                <h4>Group 2 Content</h4>
            </div>
            <div>
                <h4>Group 3 Content</h4>
            </div>
            <button id="addBtn" type="button">Add User</button>
        </div>
        <div
                class="edgePanel"
                data-dojo-type="dijit/layout/ContentPane"
                data-dojo-props="region: 'top'">
            <span id="welcome"></span>
        </div>
        <div
                id="leftCol" class="edgePanel"
                data-dojo-type="dijit/layout/ContentPane"
                data-dojo-props="region: 'left', splitter: true">
            Sidebar content (left)
            <div id="leftContent" data-dojo-type="pytclon/common/ContentHolder"></div>
        </div>
    </div>
</body>
</html>