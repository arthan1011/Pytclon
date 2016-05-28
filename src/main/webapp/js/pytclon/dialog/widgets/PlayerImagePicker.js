/**
 * Created by arthan on 28.05.2016.
 */

define([
    "dojo/_base/declare",
    "dojo/on",
    "dojo/dom-construct",
    "dijit/_WidgetBase"
], function(
    declare,
    on,
    domConstruct,
    _WidgetBase
) {
    return declare("dialog/widgets/PlayerImagePicker", [_WidgetBase], {

        constructor: function(config) {
            
            if (!config.playerId) {
                throw new Error('Player ID for player image picker is not defined!')
            }
            this.playeId = config.playerId;
            console.log('Player image picker constructed');
        },

        buildRendering: function() {
            this.domNode = domConstruct.create('div', {
                class: 'player-thumbnail'
            });
            on(this.domNode, "click", function () {
                console.log('Showing available player images');
            })
        }
    });
});