/**
 * Created by ashamsiev on 16.05.2016.
 */

define([
    "dojo/_base/declare",
    "dojo/dom-construct",
    "dijit/_WidgetBase",
    'pytclon/dialog/widgets/PlayerImagePicker'
], function(
    declare,
    domConstruct,
    _WidgetBase,
    PlayerImagePicker
) {
    return declare("dialog/widgets/PlayerElement", [_WidgetBase], {

        constructor: function(player) {
            console.log('Player element constructed');
            this.player = player;
        },

        buildRendering: function() {
            this.domNode = domConstruct.create('div', {
                class: 'player-element'
            });

            (new PlayerImagePicker({
                playerId: '3'
            })).placeAt(this.domNode);

            domConstruct.create('div', {
                class: 'player-description',
                innerHTML: 'Name: ' + this.player.name
            }, this.domNode);
        }
    });
});