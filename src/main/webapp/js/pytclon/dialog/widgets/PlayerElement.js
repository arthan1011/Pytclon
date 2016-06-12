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
    "dijit/_TemplatedMixin",
    "pytclon/dialog/widgets/PlayerImagePicker",
    "pytclon/dialog/widgets/PField",
    "dojo/text!./PlayerElement.html"
], function(
    declare,
    domConstruct,
    on,
    keys,
    JsonRest,
    TextBox,
    _WidgetBase,
    _TemplatedMixin,
    PlayerImagePicker,
    PField,
    template
) {
    return declare([_WidgetBase, _TemplatedMixin], {

        templateString: template,

        ENTER_KEY_CODE: 13,
        _restStore: new JsonRest({
            target: 'rest/player'
        }),

        constructor: function(player) {
            this.player = player;
        },

        postCreate: function() {
            console.log("Creating player Element");
            new PlayerImagePicker({
                playerId: '3'
            }, this.imagePicker);

            new PField({
                changeCallback: this.funcUpdatePlayer(),
                player: this.player
            }, this.playerName)
        },

        funcUpdatePlayer: function() {
            var restStore = this._restStore;
            return function(newPlayer) {
                restStore.put(newPlayer);
            };

        }
    });
});