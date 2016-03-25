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
    'pytclon/util/inputValidators',
    'pytclon/common/domClasses',
    'pytclon/common/ValidationInputForm',
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
    validators,
    domClasses,
    ValidationInputForm
) {
    const MODE_SIGN_IN = 'sign-in';
    const MODE_SIGN_UP = 'sign-up';

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

    }


    var inputForm = new ValidationInputForm('loginScreen');

    var userGroup = inputForm.createInputGroup({
        title: 'Username',
        name: 'j_username',
        placeHolder: 'login',
        msgId: 'userMsg'
    });
    var passwordGroup = inputForm.createInputGroup({
        title: 'Password',
        name: 'j_password',
        type: 'password',
        placeHolder: 'password',
        msgId: 'passMsg'
    });
    var passwordRepeatGroup = inputForm.createInputGroup({
        title: 'Repeat password',
        name: 'j_password_repeat',
        type: 'password',
        placeHolder: 'repeat password',
        msgId: 'passRepMsg',
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
            validator: validators.pattern(/^\D+/, "Username should not start with a digit")
        }
    ]);
    passwordGroup.setConstraints([
        {
            validator: validators.required
        },
        {
            validator: validators.shouldNotBeEqual(userGroup),
            mode: MODE_SIGN_UP
        }
    ]);
    passwordRepeatGroup.setConstraints([
        {
            validator: validators.shouldBeEqual(passwordGroup),
            mode: MODE_SIGN_UP
        }
    ]);

    inputForm.setOnValid(MODE_SIGN_IN, function() {
        domProp.set(loginButtons.signInBtn, 'disabled', false);
    });
    inputForm.setOnInvalid(MODE_SIGN_IN, function() {
        domProp.set(loginButtons.signInBtn, 'disabled', true);
    });
    inputForm.setOnValid(MODE_SIGN_UP, function() {
        domProp.set(loginButtons.signUpBtn, 'disabled', false);
    });
    inputForm.setOnInvalid(MODE_SIGN_UP, function() {
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
            }).then(function() {
                inputForm.setMode(MODE_SIGN_IN);
            }, function(error) {
                alert(error.responseText);
                inputForm.clear();
                domProp.set(loginButtons.signUpBtn, 'disabled', true);
            });
        }
    })

});