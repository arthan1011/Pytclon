/**
 * Created by ashamsiev on 02.03.2016.
 */

define([
    "dojo/_base/declare",
    "dojo/dom-construct",
    "dojo/store/JsonRest",
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
    JsonRest,
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

        postCreate: function() {
            this.stackPanel.initChildPanels(this._panelNames);
            this.leftMenu.initMenuItems(this._panelNames);
        },

        btnClicked: function() {
            console.debug('Button clicked!');

            var userStore = new JsonRest({
                target: '/pytclon/rest/users'
            });
            userStore.get()
                .then(function(result) {
                result.forEach(function(item) {
                    console.debug(JSON.stringify(item));
                });
            })
        }
    })
});