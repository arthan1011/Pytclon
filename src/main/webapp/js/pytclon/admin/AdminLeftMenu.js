/**
 * Created by ashamsiev on 03.03.2016.
 */

/**
 * Created by ashamsiev on 02.03.2016.
 */

define([
    "dojo/_base/declare",
    "dojo/dom-construct",
    "dojo/on",
    "dojo/aspect",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dijit/Menu",
    "dijit/MenuItem",
    "dojo/text!./templates/AdminLeftMenu.html"
], function(
    declare,
    domConstruct,
    on,
    aspect,
    _WidgetBase,
    _TemplatedMixin,
    _WidgetsInTemplateMixin,
    Menu,
    MenuItem,
    template
) {
    return declare("admin/AdminLeftMenu", [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        widgetsInTemplate: true,
        templateString: template,

        postCreate: function() {
            var menuItems =  this.menu.getChildren();
            for (var i = 0; i < menuItems.length; i++) {
                var menuItem = menuItems[i];
                this.own(aspect.after(menuItem, "onClick", function() {
                    var itemLabel = menuItem.label;
                    return function() {
                        console.debug(itemLabel);
                    }
                }(), true))
            }
            this.own(
                aspect.after(this.menu, "onClick", function(e) {
                    console.debug('Menu clicked');
                }, true)
            );
        },

        test: function() {
            console.debug(this.menu.getChildren());
        }

    })
});