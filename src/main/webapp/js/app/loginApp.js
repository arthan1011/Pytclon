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

    // todo: extract validators to another module
    var validators = {
        shouldRepeat: function(otherInputGroup) {
            return function() {
                var self = this;
                return utilDeferred.wrapFunc(function() {
                    var fieldValue = domProp.get(self.field, 'value');
                    var repeatFieldValue = domProp.get(otherInputGroup.field, 'value');
                    if (fieldValue !== repeatFieldValue) {
                        return {
                            valid: false,
                            msg: otherInputGroup.title + ' should be repeated'
                        }
                    } else {
                        return { valid: true };
                    }
                });
            }
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
                        return { valid: true }
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
                    return { valid: true }
                }
            });
        },
        pattern: function(regex, message) {
            return function() {
                var self = this;
                return utilDeferred.wrapFunc(function() {
                    if (regex.test(domProp.get(self.field, 'value'))) {
                        return { valid: true }
                    } else {
                        return {
                            valid: false,
                            msg: message
                        }
                    }
                });
            }
        },
        resourceExists: function(store) {
            return function() {
                var self = this;
                var inputValue = domProp.get(self.field, 'value');
                if (inputValue) {
                    return store.get(inputValue)
                        .then(function (data) {
                            if (data) {
                                return {
                                    valid: false,
                                    msg: self.title + ' with id "' + inputValue + '" already exists!'
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
    };

    var userStore = new JsonRest({
        target: 'rest/users'
    });


    function crateSignButtons(form) {
        var signInBtn = domConstruct.create('button', {
            id: 'signInBtn',
            type: 'submit',
            class: ['btn', domClasses.BUTTON_SHOW_IN_MODE_SIGN_IN, domClasses.DEPENDS_ON_FORM_VALIDITY].join(' '),
            innerHTML: 'Sign In',
            disabled: true
        }, domConstruct.create('span', {
            style: {width: '50%'}
        }, form));

        var signUpBtn = domConstruct.create('button', {
            id: 'signUpBtn',
            type: 'button',
            class: 'btn',
            innerHTML: 'Sign Up'
        }, domConstruct.create('span', {
            style: {width: '50%'}
        }, form));


        return {
            signInBtn: signInBtn,
            signUpBtn: signUpBtn,
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


    var ValidationInputForm = declare(null, {

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
                },

                clear: function() {
                    this._valid.errors.length = 0;
                    domClass.replace(this.node, domClasses.INPUT_VALID, domClasses.INPUT_INVALID);
                    domProp.set(this.field, 'value', '');
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
                group.clear();
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
                // form should be in invalid state immediately after user input and stay in that state before all
                // delayed validations are checked.
                form._setFormValidity(false);

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


    var inputForm = new ValidationInputForm('loginScreen');

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
        },
        {
            validator: validators.resourceExists(userStore),
            mode: MODE_SIGN_UP
        },
        {
            validator: validators.pattern(/^\D+/, "Username should start with a letter")
        }
    ]);
    passwordGroup.setConstraints([
        {
            validator: validators.required
        }
    ]);
    passwordRepeatGroup.setConstraints([
        {
            validator: validators.shouldRepeat(passwordGroup),
            mode: MODE_SIGN_UP
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
        domProp.set(loginButtons.signUpBtn, 'disabled', false);
    });
    inputForm.setOnInvalid(MODE_SIGN_UP, function() {
        console.log('User credentials for registration are not specified');
        domProp.set(loginButtons.signUpBtn, 'disabled', true);
    });

    var loginButtons = crateSignButtons(inputForm.form);
    loginButtons.setOnSignUp(function() {

        if (inputForm.mode === MODE_SIGN_IN) {
            inputForm.setMode(MODE_SIGN_UP);
            domProp.set(loginButtons.signUpBtn, 'disabled', true);
        } else {
            userStore.add({
                login: domProp.get(userGroup.field, 'value'),
                password: domProp.get(passwordGroup.field, 'value'),
                roles: ['client']
            }).then(function(data) {
                inputForm.setMode(MODE_SIGN_IN);
            });
        }
    })

});