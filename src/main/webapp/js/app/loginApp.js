/**
 * Created by ashamsiev on 14.03.2016.
 */

require([
    'dojo/dom-construct',
    'dojo/dom',
    'dojo/on',
    'dojo/dom-style',
    'dojo/dom-attr',
    'dojo/query',
    'dojo/request',
    'dojo/domReady!'
], function(
    domConstruct,
    dom,
    on,
    domStyle,
    domAttr,
    query,
    request
) {
    createLoginForm();

    function createLoginForm() {
        var loginScreen = dom.byId('loginScreen');
        var form = domConstruct.create('form', {
            name: 'loginForm',
            method: 'POST',
            action: 'j_security_check',
            class: 'login-form'
        }, loginScreen);

        createUserNameGroup(form);
        createPasswordGroup(form);

        crateSignButtons(form);
    }

    function crateSignButtons(loginScreen) {
        var signInBtn = domConstruct.create('button', {
            type: 'submit',
            class: 'btn',
            onclick: function() {
                var username = domAttr.get(query('input[name=j_username]')[0], 'value');
                var password = domAttr.get(query('input[name=j_password]')[0], 'value');
                console.log(username, password);
            },
            innerHTML: 'Sign In'
        }, domConstruct.create('span', {
            style: {width: '50%'}
        }, loginScreen));

        var signUpBtn = domConstruct.create('button', {
            type: 'password',
            class: 'btn',
            onclick: function() {console.log('Signing up..')},
            innerHTML: 'Sign Up'
        }, domConstruct.create('span', {
            style: {width: '50%'}
        }, loginScreen));
    }

    function createUserNameGroup(loginScreen) {
        var userNameGroup = domConstruct.create('div', {
            class: 'control-group'
        }, loginScreen);
        var userInput = domConstruct.create('input', {
            type: 'text',
            class: 'login-field',
            placeHolder: 'login',
            name: 'j_username'
        }, userNameGroup);
        var userMsg = domConstruct.create('div', {
            innerHTML: 'UserName Message',
            style: {visibility: 'hidden'},
            class: 'loginMsg'
        }, userNameGroup);

        on(userInput, 'blur', function() {
            var validationReport = isUserNameValid(domAttr.get(userInput, 'value'));

            if (!validationReport.valid) {
                domStyle.set(userMsg, {
                    visibility: 'visible'
                });
                domAttr.set(userMsg, {
                    innerHTML: validationReport.message
                })
            } else {
                domStyle.set(userMsg, {
                    visibility: 'hidden'
                });
            }
        });

        function isUserNameValid(username) {
            if (!username) {
                return {valid: false, message: 'Username should be specified!'};
            }
            if (username.length > 20) {
                return {valid: false, message: 'Username should be no more than 20 symbols!'}
            }
            return {valid: true}
        }
    }

    function createPasswordGroup(loginScreen) {
        var passwordGroup = domConstruct.create('div', {
            class: 'control-group'
        }, loginScreen);
        var passInput = domConstruct.create('input', {
            type: 'text',
            class: 'login-field',
            placeHolder: 'password',
            name: 'j_password'
        }, passwordGroup);
        var passMsg = domConstruct.create('div', {
            innerHTML: 'Password Message',
            style: {visibility: 'hidden'},
            class: 'loginMsg'
        }, passwordGroup);

        on(passInput, 'blur', function() {
            var validationReport = isPasswordValid(domAttr.get(passInput, 'value'));

            if (!validationReport.valid) {
                domStyle.set(passMsg, {
                    visibility: 'visible'
                });
                domAttr.set(passMsg, {
                    innerHTML: validationReport.message
                })
            } else {
                domStyle.set(passMsg, {
                    visibility: 'hidden'
                });
            }
        });

        function isPasswordValid(password) {
            if (!password) {
                return {valid: false, message: 'Password should be specified!'};
            }
            if (password.length > 20) {
                return {valid: false, message: 'Password should be no more than 20 symbols!'}
            }
            return {valid: true}
        }
    }
});