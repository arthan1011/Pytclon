/**
 * Created by ashamsiev on 14.03.2016.
 */

require([
    'dojo/dom-construct',
    'dojo/dom',
    'dojo/on',
    'dojo/dom-style',
    'dojo/dom-prop',
    'dojo/dom-class',
    'dojo/query',
    'dojo/request',
    'dojo/topic',
    'dojo/store/JsonRest',
    'pytclon/util/deferred',
    'pytclon/common/domClasses',
    'dojo/_base/declare',
    'dojo/promise/all',
    'dojo/domReady!'
], function(
    domConstruct,
    dom,
    on,
    domStyle,
    domProp,
    domClass,
    query,
    request,
    topic,
    JsonRest,
    utilDeferred,
    domClasses,
    declare,
    all
) {
    const MODE_SIGN_IN = 'sign-in';
    const MODE_SIGN_UP = 'sign-up';

    var fieldsValidity = {

    };

    var validationConstraints = {

    };

    var validators = {
        max20Symbols: function(targetInputGroup) {
            return utilDeferred.wrapFunc(function() {
                var self = this;
                if (domProp.get(targetInputGroup.field, 'value').length > 20) {
                    return {
                        valid: false,
                        msg: targetInputGroup.title + ' should be no more than 20 symbols!'
                    }
                } else {
                    return {
                        valid: true
                    }
                }
            });
        },
        maxLength: function(limit) {
            return function() {
                var self = this;
                return utilDeferred.wrapFunc(function() {
                    if (domProp.get(self.field, 'value').length > limit) {
                        return {
                            valid: false,
                            msg: self.title + ' should be no more than ' + limit + ' symbols!'
                        }
                    } else {
                        return {
                            valid: true
                        }
                    }
                });
            }
        },
        required: function() {
            var self = this;
            return utilDeferred.wrapFunc(function() {
                if (!domProp.get(self.field, 'value')) {
                    return {
                        valid: false,
                        msg: self.title + ' should be specified!'
                    }
                } else {
                    return {
                        valid: true
                    }
                }
            });
        },
        userExists: function(targetInputGroup) {
            var username = domProp.get(targetInputGroup.field, 'value');
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
    };

    var userStore = new JsonRest({
        target: 'rest/users'
    });

    topic.subscribe('pytclon/login/formValidity', function(input) {
        fieldsValidity[input.name] = input.valid;

        if (isSignInMode()) {
            if (fieldsValidity.j_username && fieldsValidity.j_password) {
                domProp.set('signInBtn', {
                    disabled: false
                })
            } else {
                domProp.set('signInBtn', {
                    disabled: true
                })
            }
        } else {
            if (fieldsValidity.j_username && fieldsValidity.j_password && fieldsValidity.j_password_repeat) {
                domProp.set('signUpBtn', {
                    disabled: false
                })
            } else {
                domProp.set('signUpBtn', {
                    disabled: true
                })
            }
        }
    });

    //createLoginForm('loginScreen');

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
            placeHolder: 'login',
            title: 'Username'
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
                                validator: validators.required
                            },
                            {
                                mode: MODE_SIGN_UP,
                                validator: validators.max20Symbols,
                                otherInputGroups: []
                            },
                            {
                                mode: MODE_SIGN_UP,
                                validator: validators.userExists
                            }
                        ]
                    },
                    {
                        eventType: 'input',
                        validations: [
                            {
                                mode: MODE_SIGN_UP,
                                validator: validators.max20Symbols,
                                otherInputGroups: []
                            },
                            {
                                mode: MODE_SIGN_UP,
                                validator: validators.userExists
                            }
                        ]
                    }
                ]
            }

        ]);
    }

    function setupValidationConstraints(allConstraints) {
        allConstraints.forEach(function(groupConstrains) {
            groupConstrains.constraints.forEach(function(typeConstraints) {
                var inputGroup = groupConstrains.inputGroup;
                var validReportHandler = function(validReport) {
                    if (!validReport.valid) {

                        // show message
                        domStyle.set(inputGroup.message, {
                            visibility: 'visible'
                        });
                        domProp.set(inputGroup.message, {
                            innerHTML: validReport.msg
                        });
                        topic.publish('pytclon/login/formValidity', {
                            name: domProp.get(inputGroup.field, 'name'),
                            valid: false
                        });
                    } else {
                        // hide message
                        domStyle.set(inputGroup.message, {
                            visibility: 'hidden'
                        });
                        topic.publish('pytclon/login/formValidity', {
                            name: domProp.get(inputGroup.field, 'name'),
                            valid: false
                        });
                    }
                };
                on(
                    inputGroup.field,
                    typeConstraints.eventType,
                    function() {
                        validateConstraints(inputGroup, typeConstraints.validations, validReportHandler);
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
            domProp.set('loginMessage', {
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
            domProp.set(query('input[name=j_username]')[0], 'value', '');
            domProp.set(query('input[name=j_password]')[0], 'value', '');
            domProp.set('loginMessage', {
                innerHTML: 'User created. Sign in please.'
            });
        }

    }

    function addUserRequest() {
        var login = domProp.get(query('input[name=j_username]')[0], 'value');
        var pass = domProp.get(query('input[name=j_password]')[0], 'value');
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
            class: ['btn', domClasses.BUTTON_SHOW_IN_MODE_SIGN_IN, domClasses.DEPENDS_ON_FORM_VALIDITY].join(' '),
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


        return {
            signInBtn: signInBtn,
            setOnSignUp: function(callback) {
                on(signUpBtn, 'click', callback);
            }
        };

        /*on(signUpBtn, 'click', function() {
            if (isSignInMode()) {
                domProp.set(signUpBtn, {
                    disabled: true
                });
                setMode(MODE_SIGN_UP);
            } else {
                addUserRequest();
                console.log('new User created.');
            }
        });*/
    }

    function createInputGroup(rootNode, options) {
        var groupContainer = domConstruct.create('div', {
            class: domClasses.INPUT_GROUP
        }, rootNode);
        var inputField = domConstruct.create('input', {
            type: 'text',
            class: domClasses.INPUT_FIELD,
            placeHolder: options.placeHolder || 'type here',
            name: options.name || 'inputName'
        }, groupContainer);
        var inputMsg = domConstruct.create('div', {
            style: {visibility: 'hidden'},
            class: domClasses.INPUT_VALIDATION_MSG
        }, groupContainer);

        return {
            title: options.title,
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
            isUserNameValid(domProp.get(userInput, 'value'), userValidationCallback);

            function userValidationCallback(validationReport) {
                if (!validationReport.valid) {
                    domStyle.set(userMsg, {
                        visibility: 'visible'
                    });
                    domProp.set(userMsg, {
                        innerHTML: validationReport.message
                    });
                    topic.publish('pytclon/login/formValidity', {
                        name: domProp.get(userInput, 'name'),
                        valid: false
                    });
                } else {
                    domStyle.set(userMsg, {
                        visibility: 'hidden'
                    });
                    topic.publish('pytclon/login/formValidity', {
                        name: domProp.get(userInput, 'name'),
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
        var password = domProp.get(query('input[name=j_password_repeat]')[0], 'value');
        var repPassword = domProp.get(query('input[name=j_password]')[0], 'value');
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
                domProp.set(passMsg, {
                    innerHTML: 'Password should be repeated!'
                });
                topic.publish('pytclon/login/formValidity', {
                    name: domProp.get(passInput, 'name'),
                    valid: false
                });
            } else {
                domStyle.set(passMsg, {
                    visibility: 'hidden'
                });
                topic.publish('pytclon/login/formValidity', {
                    name: domProp.get(passInput, 'name'),
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
            var validationReport = isPasswordValid(domProp.get(passInput, 'value'));

            if (!validationReport.valid) {
                domStyle.set(passMsg, {
                    visibility: 'visible'
                });
                domProp.set(passMsg, {
                    innerHTML: validationReport.message
                });
                topic.publish('pytclon/login/formValidity', {
                    name: domProp.get(passInput, 'name'),
                    valid: false
                });
            } else {
                domStyle.set(passMsg, {
                    visibility: 'hidden'
                });
                topic.publish('pytclon/login/formValidity', {
                    name: domProp.get(passInput, 'name'),
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
            var currentValue = domProp.get(repeatPassInput, 'value');
            var defaultValue = repeatPassInput.defaultValue;
            return currentValue !== defaultValue;
        }
    }

    var InputForm = declare(null, {

        inputGroups: [],
        validCallbacks: {},
        invalidCallbacks: {},
        mode: 'sign-in',

        constructor: function(domFormContainer) {
            this.form = this._createLoginForm(); // create dom form
            domConstruct.place(this.form, domFormContainer);
        },

        createInputGroup: function(options) {
            var self = this;
            var inputGroupClasses = [domClasses.INPUT_GROUP, domClasses.INPUT_VALID];
            if (options.showInMode === MODE_SIGN_IN) {
                inputGroupClasses.push(domClasses.INPUT_SHOW_IN_MODE_SIGN_IN);
            } else if (options.showInMode === MODE_SIGN_UP) {
                inputGroupClasses.push(domClasses.INPUT_SHOW_IN_MODE_SIGN_UP);
            }

            var groupContainer = domConstruct.create('div', {
                class: inputGroupClasses.join(' ')
            }, this.form);
            var inputField = domConstruct.create('input', {
                type: options.type || 'text',
                class: domClasses.INPUT_FIELD,
                value: '',
                placeHolder: options.placeHolder || 'type here',
                name: options.name || 'inputName'
            }, groupContainer);
            var inputMsg = domConstruct.create('div', {
                class: domClasses.INPUT_VALIDATION_MSG
            }, groupContainer);

            on(inputField, 'input', this._validateForm(self));

            var inputGroupInstance = {
                _valid: {
                    errors: [],
                    constraints: []
                },

                title: options.title,
                field: inputField,
                node: groupContainer,
                message: inputMsg,

                setConstraints: function(constrainsArray) {
                    var self = this;
                    constrainsArray.forEach(function(constraint) {
                        self._valid.constraints.push(constraint)
                    });
                },

                isDirty: function() {
                    return this.field.value !== this.field.defaultValue;
                },

                showValidationMessage: function() {
                    var validErrors = this._valid.errors;
                    var groupInvalid = validErrors.length > 0;
                    if (groupInvalid) {
                        domProp.set(this.message, {
                            innerHTML: validErrors.shift().msg
                        });
                        domClass.replace(this.node, domClasses.INPUT_INVALID, domClasses.INPUT_VALID);
                    } else {
                        domClass.replace(this.node, domClasses.INPUT_VALID, domClasses.INPUT_INVALID);
                    }
                }
            };
            this.inputGroups.push(inputGroupInstance);
            return inputGroupInstance;
        },

        printGroups: function() {
            console.log(this.inputGroups);
        },

        setMode: function(mode) {
            this.mode = mode;
            if (mode === MODE_SIGN_UP) {
                domClass.replace(this.form, domClasses.FORM_MODE_SIGN_UP, domClasses.FORM_MODE_SIGN_IN);
            } else {
                domClass.replace(this.form, domClasses.FORM_MODE_SIGN_IN, domClasses.FORM_MODE_SIGN_UP);
            }
            this.clear();
        },

        setOnValid: function(mode, callback) {
            this.validCallbacks[mode] = callback;
        },

        setOnInvalid: function(mode, callback) {
            this.invalidCallbacks[mode] = callback;
        },

        clear: function() {
            this.inputGroups.forEach(function(group) {
                domProp.set(group.field, 'value', '');
            })
        },

        _setFormValidity: function (valid) {
            if (valid) {
                domClass.replace(this.form, domClasses.FORM_VALID, domClasses.FORM_INVALID);
                var validCallback = this.validCallbacks[this.mode];
                if (validCallback) {
                    validCallback();
                }
            } else {
                domClass.replace(this.form, domClasses.FORM_INVALID, domClasses.FORM_VALID);
                var invalidCallback = this.invalidCallbacks[this.mode];
                if (invalidCallback) {
                    invalidCallback();
                }
            }
        },

        _validateForm: function(form) {
            function allReportsValid(reports) {
                return reports.every(function(report) {
                    return report.valid;
                });
            }

            return function() {
                all(form._checkGroupsConstraints()).then(function(reports) {
                    if (allReportsValid(reports)) {
                        form._setFormValidity(true)
                    } else {
                        form._setFormValidity(false);
                    }
                    form._showValidationMessages();
                });
            };
        },

        _showValidationMessages: function () {
            this.inputGroups.forEach(function(inputGroup) {
                inputGroup.showValidationMessage();
            });
        },

        // return a Promise indicating all validation constraints are checked
        _checkGroupsConstraints: function() {
            var promises = [];

            var self = this;

            this.inputGroups.forEach(function(inputGroup) {
                // clear errors array
                inputGroup._valid.errors.length = 0;

                var constraints = inputGroup._valid.constraints;
                var deferredReports = [];
                for (var i = 0; i < constraints.length; i++) {
                    var mode = constraints[i].mode;
                    var validator = constraints[i].validator;

                    if (!mode || self.mode === mode) {
                        var deferredReport = validator.apply(inputGroup).then(function(report) {
                            if (!report.valid) {
                                inputGroup._valid.errors.push(report);
                            }
                            return report;
                        });
                        deferredReports.push(deferredReport);
                    }
                }
                for (var j = 0; j < deferredReports.length; j++) {
                    promises.push(deferredReports[j]);
                }
            });

            return promises;
        },

        _createLoginForm: function() {
            return domConstruct.create('form', {
                name: 'loginForm',
                method: 'POST',
                action: 'j_security_check',
                class: ['login-form', domClasses.FORM_VALID, domClasses.FORM_MODE_SIGN_IN].join(' '),
                'accept-charset': 'utf-8'
            });
        }
    });


    var inputForm = new InputForm('loginScreen');

    var userGroup = inputForm.createInputGroup({
        title: 'Username',
        name: 'j_username',
        placeHolder: 'login'
    });
    var passwordGroup = inputForm.createInputGroup({
        title: 'Password',
        name: 'j_password',
        type: 'password',
        placeHolder: 'password'
    });
    var passwordRepeatGroup = inputForm.createInputGroup({
        title: 'Repeat password',
        name: 'j_password_repeat',
        type: 'password',
        placeHolder: 'repeat password',
        showInMode: MODE_SIGN_UP
    });
    userGroup.setConstraints([
        {
            validator: validators.required
        },
        {
            validator: validators.maxLength(15),
            mode: MODE_SIGN_UP
        }
    ]);
    passwordGroup.setConstraints([
        {
            validator: validators.required
        }
    ]);

    inputForm.printGroups();
    inputForm.setOnValid(MODE_SIGN_IN, function() {
        console.log('form is valid');
        domProp.set(loginButtons.signInBtn, 'disabled', false);
    });
    inputForm.setOnInvalid(MODE_SIGN_IN, function() {
        console.log('form is still invalid');
        domProp.set(loginButtons.signInBtn, 'disabled', true);
    });
    inputForm.setOnValid(MODE_SIGN_UP, function() {
        console.log('New user is ready for registration');
    });
    inputForm.setOnInvalid(MODE_SIGN_UP, function() {
        console.log('User credentials for registration are not specified');
    });

    var loginButtons = crateSignButtons(inputForm.form);
    loginButtons.setOnSignUp(function() {

        if (inputForm.mode === MODE_SIGN_IN) {
            inputForm.setMode(MODE_SIGN_UP);
        } else {
            inputForm.setMode(MODE_SIGN_IN);
        }
    })

});