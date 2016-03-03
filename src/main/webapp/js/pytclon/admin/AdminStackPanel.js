/**
 * Created by ashamsiev on 03.03.2016.
 */

/**
 * Created by ashamsiev on 02.03.2016.
 */

define([
    "dojo/_base/declare",
    "dojo/dom-construct",
    "dojo/topic",
    "dijit/layout/LayoutContainer",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dijit/layout/StackContainer",
    "dojo/text!./templates/AdminStackPanel.html"
], function(
    declare,
    domConstruct,
    topic,
    LayoutContainer,
    _TemplatedMixin,
    _WidgetsInTemplateMixin,
    StackContainer,
    template
) {
    return declare("admin/AdminPane", [LayoutContainer, _TemplatedMixin, _WidgetsInTemplateMixin], {
        widgetsInTemplate: true,
        templateString: template,

        postCreate: function() {
            topic.subscribe('pytclon/admin/switchPanel', this.switchPanel)
        },

        switchPanel: function(panel) {
            console.debug('Switching: ' + panel);
        }
    })
});