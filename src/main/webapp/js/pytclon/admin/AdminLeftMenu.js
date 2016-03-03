/**
 * Created by ashamsiev on 03.03.2016.
 */

/**
 * Created by ashamsiev on 02.03.2016.
 */

define([
    "dojo/_base/declare",
    "dojo/dom-construct",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dijit/Menu",
    "dijit/MenuItem",
    "dojo/text!./templates/AdminLeftMenu.html"
], function(
    declare,
    domConstruct,
    _WidgetBase,
    _TemplatedMixin,
    _WidgetsInTemplateMixin,
    Menu,
    MenuItem,
    template
) {
    return declare("admin/AdminLeftMenu", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        widgetsInTemplate: true,
        templateString: template



    })
});