/**
 * Created by ashamsiev on 16.05.2016.
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
    return declare("dialog/widgets/PlayerElement", [_WidgetBase], {

        constructor: function(player) {
            console.log('Player element constructed');
            this.player = player;
        },

        buildRendering: function() {
            this.domNode = domConstruct.create('div', {
                innerHTML: this.player.name,
                class: 'player-element'
            })
        }
    });
});