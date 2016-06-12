/**
 * Created by ashamsiev on 16.05.2016.
 */

define([
    "dojo/_base/declare",
    "dojo/dom-construct",
    "dojo/on",
    "dojo/keys",
    "dojo/store/JsonRest",
    "dijit/form/TextBox",
    "dijit/_WidgetBase",
    "pytclon/dialog/widgets/PlayerImagePicker",
    "pytclon/dialog/widgets/PField"
], function(
    declare,
    domConstruct,
    on,
    keys,
    JsonRest,
    TextBox,
    _WidgetBase,
    PlayerImagePicker,
    PField
) {
    return declare([_WidgetBase], {

        ENTER_KEY_CODE: 13,
        _restStore: new JsonRest({
            target: 'rest/player'
        }),

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

            var playerProps = domConstruct.create('div', {
                class: 'player-description'
            }, this.domNode);

            (new PField({
                changeCallback: this.funcUpdatePlayer(),
                player: this.player
            })).placeAt(playerProps);
        },

        funcUpdatePlayer: function() {
            var restStore = this._restStore;
            return function(newPlayer) {
                restStore.put(newPlayer);
            };

        }
    });
});