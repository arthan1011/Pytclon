/**
 * Created by ashamsiev on 02.03.2016.
 */

define([
    "dojo/_base/declare",
    "dojo/dom-construct",
    "dojo/dom",
    "dojo/store/JsonRest",
    "dojo/store/Memory",
    "gridx/Grid",
    "gridx/core/model/cache/Sync",
    "gridx/modules/SingleSort",
    "dijit/layout/LayoutContainer",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dijit/layout/ContentPane",
    "dijit/layout/BorderContainer",
    "dijit/form/Button",
    "pytclon/admin/AdminLeftMenu",
    "pytclon/admin/AdminStackPanel",
    "dojo/text!./templates/AdminPane.html"
], function(
    declare,
    domConstruct,
    dom,
    JsonRest,
    Store,
    Grid,
    Cache,
    SingleSort,
    LayoutContainer,
    _TemplatedMixin,
    _WidgetsInTemplateMixin,
    ContentPane,
    BorderContainer,
    Button,
    AdminLeftMenu,
    AdminStackPanel,
    template
) {
    return declare("admin/AdminPane", [LayoutContainer, _TemplatedMixin, _WidgetsInTemplateMixin], {
        widgetsInTemplate: true,
        templateString: template,

        _panelNames: ['Users', 'Not Users', 'Settings', 'New Panel'],

        _panels: [
            {
                title: 'Users',
                widget: new ContentPane({
                    content:
                    '<div><button type="button" id="addUserBtn">Add</button></div>' +
                    '<div id="gridNode" style="width: 400px; height: 200px;"></div>',
                    title: 'Users',
                    postCreate: function() {
                        var restStore = new JsonRest({
                            target: '/pytclon/rest/users'
                        });

                        restStore.get().then(function(data) {
                            console.debug(JSON.stringify(data));

                            var button = new Button({
                                label: 'Add User',
                                onClick: function () {
                                    restStore.add({login: 'new', password: 'password', roles: ['client']});
                                    console.debug('User Added!');
                                }
                            }, 'addUserBtn');
                            button.startup();

                            var userData = data.map(function(item, $index) {
                                return {
                                    id: $index + 1,
                                    login: item.login,
                                    roles: item.roles.join()
                                };
                            });

                            console.debug(JSON.stringify(userData));

                            var store = new Store({
                                data: userData
                            });
                            var columns = [
                                {field: 'id', name: 'ID'},
                                {field: 'login', name: 'Login'},
                                {field: 'roles', name: 'Roles'}
                            ];
                            var grid = new Grid({
                                cacheClass: Cache,
                                store: store,
                                structure: columns,
                                modules: [
                                    SingleSort
                                ]
                            }, 'gridNode'); //Assume we have a node with id 'gridNode'
                            grid.startup();
                        });
                    }
                })
            },
            {
                title: 'Not Users',
                widget: new ContentPane({
                    content: 'Not Users',
                    title: 'Not Users'
                })
            },
            {
                title: 'Settings',
                widget: new ContentPane({
                    content: 'Settings',
                    title: 'Settings'
                })
            }
        ],

        postCreate: function() {
            this.stackPanel.initChildPanels(this._panels);
            this.leftMenu.initMenuItems(this._panels);
        },

        btnClicked: function() {
            console.debug('Button clicked!');
        }
    })
});