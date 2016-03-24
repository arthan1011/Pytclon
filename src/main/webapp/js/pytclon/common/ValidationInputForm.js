/**
    * Created by ashamsiev on 24.03.2016.
    */

define([
    'dojo/dom-construct',
    'dojo/dom',
    'dojo/on',
    'dojo/_base/declare',
    'pytclon/common/domClasses',
    'dojo/dom-prop',
    'dojo/dom-class',
    'dojo/promise/all'
], function(
    domConstruct,
    dom,
    on,
    declare,
    domClasses,
    domProp,
    domClass,
    all
) {
    return declare(null, {
        MODE_SIGN_IN : 'sign-in',
        MODE_SIGN_UP : 'sign-up',

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
            if (options.showInMode === this.MODE_SIGN_IN) {
                inputGroupClasses.push(domClasses.INPUT_SHOW_IN_MODE_SIGN_IN);
            } else if (options.showInMode === this.MODE_SIGN_UP) {
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

        setMode: function(mode) {
            this.mode = mode;
            if (mode === this.MODE_SIGN_UP) {
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
});