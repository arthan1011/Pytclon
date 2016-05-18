/**
    * Created by ashamsiev on 18.05.2016
    */

define([
    "dojo/_base/declare",
    "dojo/dom-construct",
    "dijit/_WidgetBase"
], function(
    declare,
    domConstruct,
    _WidgetBase
) {
    return declare("admin/widgets/PlayerImageUpload", [_WidgetBase], {

        buildRendering: function() {
            this.domNode = domConstruct.create('div');
            var uploadInput = domConstruct.create('input', {
                type: 'file',
                multiple: ''
            }, this.domNode);


        }
    });
});