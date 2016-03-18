/**
 * Created by ashamsiev on 26.02.2016.
 */

define([
    "dojo/_base/declare",
    "dojo/dom-construct",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/text!./templates/ContentHolder.html"
], function(
    declare,
    domConstruct,
    _WidgetBase,
    _TemplatedMixin,
    template
) {
    return declare("common/ContentHolder", [_WidgetBase, _TemplatedMixin], {
        templateString: template,

        add: function(node) {
            domConstruct.place(node, this.content);
        }
    });
});