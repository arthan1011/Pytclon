/**
 * Created by ashamsiev on 14.03.2016.
 */

require([
    'dojo/dom-construct',
    'dojo/dom',
    'dojo/on',
    'dojo/dom-style',
    'dojo/dom-attr',
    'dojo/dom-class',
    'dojo/query',
    'dojo/request',
    'dojo/topic',
    'dojo/store/JsonRest',
    'pytclon/util/deferred',
    'dojo/promise/all',
    'dojo/domReady!'
], function(
    domConstruct,
    dom,
    on,
    domStyle,
    domAttr,
    domClass,
    query,
    request,
    topic,
    JsonRest,
    utilDeferred,
    all
) {
    const MODE_SIGN_IN = 'sign-in';
    const MODE_SIGN_UP = 'sign-up';

    var fieldsValidity = {

    };

    var validationConstraints = {

    };

    var userStore = new JsonRest({
        target: 'rest/users'
    });

    topic.subscribe('pytclon/login/formValidity', function(input) {
        fieldsValidity[input.name] = input.valid;

        if (isSignInMode()) {
            if (fieldsValidity.j_username && fieldsValidity.j_password) {
                domAttr.set('signInBtn', {
                    disabled: false
                })
            } else {
                domAttr.set('signInBtn', {
                    disabled: true
                })
            }
        } else {
            if (fieldsValidity.j_username && fieldsValidity.j_password && fieldsValidity.j_password_repeat) {
                domAttr.set('signUpBtn', {
                    disabled: false
                })
            } else {
                domAttr.set('signUpBtn', {
                    disabled: true
                })
            }
        }
    });

    createLoginForm('loginScreen');

    function createLoginForm(refNode) {
        var loginScreen = dom.byId(refNode);
        var form = domConstruct.create('form', {
            name: 'loginForm',
            method: 'POST',
            action: 'j_security_check',
            class: 'login-form',
            'accept-charset': 'utf-8'
        }, loginScreen);

        //createUserNameGroup(form);
        var userInputGroup = createInputGroup(form, {
            name: "j_username",
            placeHolder: 'login'
        });
        createPasswordGroup(form);
        createRepeatPasswordGroup(form);

        crateSignButtons(form);

        setupValidationConstraints([
            {
                inputGroup: userInputGroup,
                constraints: [
                    {
                        eventType: 'blur',
                        validations: [
                            {
                                mode: undefined,
                                validator: function(targetInputGroup) {
                                    return utilDeferred.wrapFunc(function() {
                                        if (!domAttr.get(targetInputGroup.field, 'value')) {
                                            return {
                                                valid: false,
                                                msg: 'Username should be specified!'
                                            }
                                        } else {
                                            return {
                                                valid: true
                                            }
                                        }
                                    });
                                }
                            }
                        ]
                    },
                    {
                        eventType: 'input',
                        validations: [
                            {
                                mode: MODE_SIGN_UP,
                                validator: function(targetInputGroup) {
                                    return utilDeferred.wrapFunc(function() {
                                        if (domAttr.get(targetInputGroup.field, 'value').length > 20) {
                                            return {
                                                valid: false,
                                                msg: 'Username should be no more than 20 symbols!'
                                            }
                                        } else {
                                            return {
                                                valid: true
                                            }
                                        }
                                    });
                                },
                                otherInputGroups: []
                            },
                            {
                                mode: MODE_SIGN_UP,
                                validator: function(targetInputGroup) {
                                    var username = domAttr.get(targetInputGroup.field, 'value');
                                    if (username) {
                                        return userStore.get(username)
                                            .then(function (data) {
                                                if (data) {
                                                    return {
                                                        valid: false,
                                                        msg: 'User with login "' + username + '" already exists!'
                                                    }
                                                } else {
                                                    return {
                                                        valid: true
                                                    };
                                                }
                                            }
                                        );
                                    } else {
                                        return utilDeferred.wrapVal({valid: true});
                                    }
                                }
                            }
                        ]
                    }
                ]
            }
            //{
            //    inputGroup: passwordInputGroup,
            //    constraints: [
            //        {
            //            event
            //        }
            //    ]
            //}
        ]);

        //createValidationConstraint(
        //    /*mode*/ MODE_SIGN_IN,
        //    /*eventType*/ 'blur',
        //    /*callbackFunction*/ function(targetInputGroup, otherNodes) {},
        //    /*targetInputGroup*/ inputGroup,
        //    /*otherInputGroups...*/ someOtherInputGroup
        //)
    }

    function setupValidationConstraints(allConstraints) {
        allConstraints.forEach(function(groupConstrains) {
            groupConstrains.constraints.forEach(function(typeConstraints) {
                var inputGroup = groupConstrains.inputGroup;
                on(
                    inputGroup.field,
                    typeConstraints.eventType,
                    function() {
                        validateConstraints(inputGroup, typeConstraints.validations, validReportHandler);

                        function validReportHandler(validReport) {
                            if (!validReport.valid) {

                                // show message
                                domStyle.set(inputGroup.message, {
                                    visibility: 'visible'
                                });
                                domAttr.set(inputGroup.message, {
                                    innerHTML: validReport.msg
                                });
                                topic.publish('pytclon/login/formValidity', {
                                    name: domAttr.get(inputGroup.field, 'name'),
                                    valid: false
                                });
                            } else {
                                // hide message
                                domStyle.set(inputGroup.message, {
                                    visibility: 'hidden'
                                });
                                topic.publish('pytclon/login/formValidity', {
                                    name: domAttr.get(inputGroup.field, 'name'),
                                    valid: false
                                });
                            }
                        }
                    }
                );
            });
        });

        function validateConstraints(targetGroup, validations, reportHandler) {
            var promises = [];

            for (var i = 0; i < validations.length; i++) {
                var constraint = validations[i];
                if (!constraint.mode || isInMode(constraint.mode)) {
                    promises.push(
                        constraint.validator.apply(
                            null,
                            [targetGroup].concat(constraint.otherInputGroups)
                        )
                    );
                }
            }

            all(promises).then(function(validReports) {
                var valid = true;

                for (var i = 0; i < validReports.length; i++) {
                    var validReport = validReports[i];
                    if (!validReport.valid) {
                        reportHandler(validReport);
                        valid = false;
                        break;
                    }
                }

                if (valid) {
                    reportHandler({valid: true});
                }
            });
        }
    }

    function isSignInMode() {
        return domClass.contains('loginScreen', 'login-sign-in');
    }

    function isInMode(mode) {
        return domClass.contains('loginScreen', 'login-' + mode);
    }

    function setMode(loginMode) {
        domClass.remove('loginScreen', 'login-sign-in');
        domClass.remove('loginScreen', 'login-sign-up');

        if (loginMode === MODE_SIGN_UP) {
            domClass.add('loginScreen', 'login-sign-up');
            domStyle.set('repeatPasswordGroup', {
                display: 'block'
            });
            domStyle.set('signInBtn', {
                display: 'none'
            });
            domAttr.set('loginMessage', {
                innerHTML: 'Specify your credentials.'
            });
        } else if (loginMode === MODE_SIGN_IN) {
            domClass.add('loginScreen', 'login-sign-in');
            domStyle.set('repeatPasswordGroup', {
                display: 'none'
            });
            domStyle.set('signInBtn', {
                display: 'inline'
            });
            domAttr.set(query('input[name=j_username]')[0], 'value', '');
            domAttr.set(query('input[name=j_password]')[0], 'value', '');
            domAttr.set('loginMessage', {
                innerHTML: 'User created. Sign in please.'
            });
        }

    }

    function addUserRequest() {
        var login = domAttr.get(query('input[name=j_username]')[0], 'value');
        var pass = domAttr.get(query('input[name=j_password]')[0], 'value');
        userStore.add({
            login: login,
            password: pass,
            roles: ['client']
        }).then(function(data) {
            setMode(MODE_SIGN_IN);
        });
    }

    function crateSignButtons(loginScreen) {
        var signInBtn = domConstruct.create('button', {
            id: 'signInBtn',
            type: 'submit',
            class: 'btn',
            innerHTML: 'Sign In',
            disabled: true
        }, domConstruct.create('span', {
            style: {width: '50%'}
        }, loginScreen));

        var signUpBtn = domConstruct.create('button', {
            id: 'signUpBtn',
            type: 'button',
            class: 'btn',
            innerHTML: 'Sign Up'
        }, domConstruct.create('span', {
            style: {width: '50%'}
        }, loginScreen));

        on(signUpBtn, 'click', function() {
            if (isSignInMode()) {
                domAttr.set(signUpBtn, {
                    disabled: true
                });
                setMode(MODE_SIGN_UP);
            } else {
                addUserRequest();
                console.log('new User created.');
            }
        });
    }

    function createInputGroup(rootNode, options) {
        var groupContainer = domConstruct.create('div', {
            class: 'control-group'
        }, rootNode);
        var inputField = domConstruct.create('input', {
            type: 'text',
            class: 'login-field',
            placeHolder: options.placeHolder || 'type here',
            name: options.name || 'inputName'
        }, groupContainer);
        var inputMsg = domConstruct.create('div', {
            style: {visibility: 'hidden'},
            class: 'loginMsg'
        }, groupContainer);

        return {
            field:inputField,
            message: inputMsg
        };
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
            id: 'userMsg',
            innerHTML: 'UserName Message',
            style: {visibility: 'hidden'},
            class: 'loginMsg'
        }, userNameGroup);

        function checkUserNameValidity() {
            isUserNameValid(domAttr.get(userInput, 'value'), userValidationCallback);

            function userValidationCallback(validationReport) {
                if (!validationReport.valid) {
                    domStyle.set(userMsg, {
                        visibility: 'visible'
                    });
                    domAttr.set(userMsg, {
                        innerHTML: validationReport.message
                    });
                    topic.publish('pytclon/login/formValidity', {
                        name: domAttr.get(userInput, 'name'),
                        valid: false
                    });
                } else {
                    domStyle.set(userMsg, {
                        visibility: 'hidden'
                    });
                    topic.publish('pytclon/login/formValidity', {
                        name: domAttr.get(userInput, 'name'),
                        valid: true
                    });
                }
            }
        }

        //on(userInput, 'blur', checkUserNameValidity);
        on(userInput, 'input', checkUserNameValidity);

        function isUserNameValid(username, validationCallback) {

            userStore.get(username)
                .then(function(data) {
                    console.log(data, username);
                    if (!username) {
                        validationCallback({valid: false, message: 'Username should be specified!'});
                    } else if (!isSignInMode() && data) {
                        validationCallback({valid: false, message: 'User with login "' + username + '" already exists'});
                    } else if (!isSignInMode() && username.length > 20) {
                        validationCallback({valid: false, message: 'Username should be no more than 20 symbols!'});
                    } else {
                        validationCallback({valid: true});
                    }
                });
        }
    }

    function isPasswordRepeated() {
        var password = domAttr.get(query('input[name=j_password_repeat]')[0], 'value');
        var repPassword = domAttr.get(query('input[name=j_password]')[0], 'value');
        var isPasswordRepeated = password === repPassword;
        return isPasswordRepeated;
    }

    function createRepeatPasswordGroup(form) {
        var passwordGroup = domConstruct.create('div', {
            id: 'repeatPasswordGroup',
            style: {display: 'none'},
            class: 'control-group'
        }, form);
        var passInput = domConstruct.create('input', {
            type: 'password',
            class: 'login-field',
            placeHolder: 'repeat password',
            name: 'j_password_repeat'
        }, passwordGroup);
        var passMsg = domConstruct.create('div', {
            id: 'passRepMsg',
            innerHTML: 'Password Message',
            style: {visibility: 'hidden'},
            class: 'loginMsg'
        }, passwordGroup);

        on(passInput, 'input', function() {
            if (!isPasswordRepeated()) {
                domStyle.set(passMsg, {
                    visibility: 'visible'
                });
                domAttr.set(passMsg, {
                    innerHTML: 'Password should be repeated!'
                });
                topic.publish('pytclon/login/formValidity', {
                    name: domAttr.get(passInput, 'name'),
                    valid: false
                });
            } else {
                domStyle.set(passMsg, {
                    visibility: 'hidden'
                });
                topic.publish('pytclon/login/formValidity', {
                    name: domAttr.get(passInput, 'name'),
                    valid: true
                });
            }
        });
    }

    function createPasswordGroup(loginScreen) {
        var passwordGroup = domConstruct.create('div', {
            class: 'control-group'
        }, loginScreen);
        var passInput = domConstruct.create('input', {
            type: 'password',
            class: 'login-field',
            placeHolder: 'password',
            name: 'j_password'
        }, passwordGroup);
        var passMsg = domConstruct.create('div', {
            innerHTML: 'Password Message',
            style: {visibility: 'hidden'},
            class: 'loginMsg'
        }, passwordGroup);

        function checkPasswordValidity() {
            var validationReport = isPasswordValid(domAttr.get(passInput, 'value'));

            if (!validationReport.valid) {
                domStyle.set(passMsg, {
                    visibility: 'visible'
                });
                domAttr.set(passMsg, {
                    innerHTML: validationReport.message
                });
                topic.publish('pytclon/login/formValidity', {
                    name: domAttr.get(passInput, 'name'),
                    valid: false
                });
            } else {
                domStyle.set(passMsg, {
                    visibility: 'hidden'
                });
                topic.publish('pytclon/login/formValidity', {
                    name: domAttr.get(passInput, 'name'),
                    valid: true
                });
            }
        }

        //on(passInput, 'blur', checkPasswordValidity);
        on(passInput, 'input', checkPasswordValidity);

        function isPasswordValid(password) {
            if (!password) {
                return {valid: false, message: 'Password should be specified!'};
            }
            if (!isSignInMode() && password.length > 20) {
                return {valid: false, message: 'Password should be no more than 20 symbols!'}
            }
            if (!isSignInMode() && !isPasswordRepeated() && isRepeatPassFieldDirty()) {
                return {valid: false, message: 'Password should be repeated!'}
            }
            return {valid: true}
        }

        function isRepeatPassFieldDirty() {
            var repeatPassInput = query('input[name=j_password_repeat]')[0];
            var currentValue = domAttr.get(repeatPassInput, 'value');
            var defaultValue = repeatPassInput.defaultValue;
            return currentValue !== defaultValue;
        }
    }
});