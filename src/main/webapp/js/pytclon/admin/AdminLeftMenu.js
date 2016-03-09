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
    "dojo/_base/lang",
    "dojo/aspect",
    "dojo/topic",
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
    lang,
    aspect,
    topic,
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

        },

        initMenuItems: function(panels) {
            panels.forEach(lang.hitch(this, function(item) {

                var newMenuItem = new MenuItem({
                    label: item.title,
                    onClick: function() {
                        topic.publish('pytclon/admin/switchPanel', item.title);
                    }
                });

                this.menu.addChild(newMenuItem);
            }));
        }

    })
});