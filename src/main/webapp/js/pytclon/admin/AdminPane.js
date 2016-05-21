/**
 * Created by ashamsiev on 02.03.2016.
 */

define([
    "dojo/_base/declare",
    "dojo/dom-construct",
    "dojo/dom",
    "dijit/layout/LayoutContainer",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dijit/layout/ContentPane",
    "dijit/layout/BorderContainer",
    "dijit/form/Button",
    "dijit/form/TextBox",
    "dijit/form/ValidationTextBox",
    "pytclon/admin/AdminLeftMenu",
    "pytclon/admin/AdminStackPanel",
    "pytclon/admin/panels/Settings",
    "pytclon/admin/panels/Players",
    "pytclon/admin/panels/Users",
    "dojo/text!./templates/AdminPane.html"
], function(
    declare,
    domConstruct,
    dom,
    LayoutContainer,
    _TemplatedMixin,
    _WidgetsInTemplateMixin,
    ContentPane,
    BorderContainer,
    Button,
    TextBox,
    ValidationTextBox,
    AdminLeftMenu,
    AdminStackPanel,
    Settings,
    Players,
    Users,
    template
) {
    return declare("admin/AdminPane", [LayoutContainer, _TemplatedMixin, _WidgetsInTemplateMixin], {
        widgetsInTemplate: true,
        templateString: template,

        _panels: [
            {
                title: 'Users',
                widget: new Users
            },
            {
                title: 'Players',
                widget: new Players
            },
            {
                title: 'Settings',
                widget: new Settings
            }
        ],

        postCreate: function() {
            this.stackPanel.initChildPanels(this._panels);
            this.leftMenu.initMenuItems(this._panels);
            this.initPanels();
        },

        initPanels: function() {
            for (var i = 0; i < this._panels.length; i++) {
                var panel = this._panels[i];
                panel.widget.initLayout();
            }
        },

        btnClicked: function() {
            console.debug('Button clicked!');
        }
    })
});