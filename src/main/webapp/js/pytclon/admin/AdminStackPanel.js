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
    "dojo/_base/lang",
    "dijit/layout/LayoutContainer",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dijit/layout/StackContainer",
    "dijit/layout/ContentPane",
    "dojo/text!./templates/AdminStackPanel.html"
], function(
    declare,
    domConstruct,
    topic,
    lang,
    LayoutContainer,
    _TemplatedMixin,
    _WidgetsInTemplateMixin,
    StackContainer,
    ContentPane,
    template
) {
    return declare("admin/AdminPane", [LayoutContainer, _TemplatedMixin, _WidgetsInTemplateMixin], {
        widgetsInTemplate: true,
        templateString: template,

        postCreate: function() {
            this.own(
                topic.subscribe('pytclon/admin/switchPanel', lang.hitch(this, this.switchPanel))
            );
        },

        switchPanel: function(panelTitle) {
            console.debug('Switching: ' + panelTitle);
            var childPanels = this.mainStackPanel.getChildren();
            var foundPanels = childPanels.filter(
                function(item) {return item.title == panelTitle}
            );
            if (foundPanels.length == 1) {
                this.mainStackPanel.selectChild(foundPanels[0]);
            } else {
                throw new Error('There should be only one panel with title ' + panelTitle);
            }
        },

        initChildPanels: function(labels) {
            for (var i = 0; i < labels.length; i++) {
                var label = labels[i];
                this.mainStackPanel.addChild(new ContentPane({
                    content: label,
                    title: label
                }));
            }
        }
    })
});