/**
 * Created by ashamsiev on 10.03.2016.
 */

define([
    "dojo/_base/declare",
    "dojo/store/JsonRest",
    "dijit/registry",
    "dijit/form/Button",
    "dijit/form/ValidationTextBox",
    "dijit/layout/ContentPane",
    "gridx/Grid",
    "gridx/core/model/cache/Async",
    "gridx/modules/SingleSort",
    "pytclon/admin/panels/_AdminPanelMixin"
], function(
    declare,
    JsonRest,
    registry,
    Button,
    ValidationTextBox,
    ContentPane,
    Grid,
    AsyncCache,
    SingleSort,
    _AdminPanelMixin
) {
    return declare("admin/panels/Users", [ContentPane, _AdminPanelMixin], {

        content:
        '<div><button type="button" id="addUserBtn">Add</button>' +
        '<label for="loginInput">Login: </label><input id="loginInput" />' +
        '<label for="passInput">Password: </label><input id="passInput" /> ' +
        ' </div>' +
        '<div id="gridNode" style="width: 400px; height: 200px;"></div>',
        title: 'Users',

        constructor: function() {
            console.debug('Users panel constructed');
        },

        initLayout: function() {
            var restStore = new JsonRest({
                target: '/pytclon/rest/users'
            });

            var button = new Button({
                label: 'Add User',
                onClick: function () {
                    var passInput = registry.byId('passInput');
                    var loginInput = registry.byId('loginInput');
                    restStore.add({
                        login: loginInput.get('value'),
                        password: passInput.get('value'),
                        roles: ['client']
                    });
                    console.debug('User Added!');
                }
            }, 'addUserBtn');
            button.startup();
            var loginInput = new ValidationTextBox({
                required: true,
                promptMessage: 'Enter login',
                missingMessage: 'You should specify login!'
            }, "loginInput");
            loginInput.startup();
            var passInput = new ValidationTextBox({
                required: true,
                promptMessage: 'Enter password',
                missingMessage: 'You should specify password!',
                type: 'password'
            }, "passInput");
            passInput.startup();
            var columns = [
                {field: 'id', name: 'ID'},
                {field: 'login', name: 'Login'},
                {field: 'roles', name: 'Roles'}
            ];
            var grid = new Grid({
                cacheClass: AsyncCache,
                store: restStore,
                pageSize: 10,
                structure: columns,
                modules: [
                    SingleSort
                ]
            }, 'gridNode'); //Assume we have a node with id 'gridNode'
            grid.startup();
        }
    });
});