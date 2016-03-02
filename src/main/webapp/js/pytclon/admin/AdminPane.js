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
    "dijit/layout/StackContainer",
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
    StackContainer,
    template
) {
    return declare("admin/AdminPane", [LayoutContainer, _TemplatedMixin, _WidgetsInTemplateMixin], {
        widgetsInTemplate: true,
        templateString: template,

        _index: 0,

        toggle: function() {
            var children = this.mainStackPanel.getChildren();

            this._index = (this._index + 1) % children.length;

            this.mainStackPanel.selectChild(children[this._index]);
            console.debug(this._index);
        }
    })
});