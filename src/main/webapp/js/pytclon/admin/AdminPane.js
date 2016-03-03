/**
 * Created by ashamsiev on 02.03.2016.
 */

define([
    "dojo/_base/declare",
    "dojo/dom-construct",
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
            this.leftMenu.test();
        }
    })
});