/**
 * Created by ashamsiev on 16.05.2016.
 */

define([
    "dojo/_base/declare",
    "dojo/dom-construct",
    "dojo/on",
    "dojo/store/JsonRest",
    "dijit/form/TextBox",
    "dijit/_WidgetBase",
    "pytclon/dialog/widgets/PlayerImagePicker"
], function(
    declare,
    domConstruct,
    on,
    JsonRest,
    TextBox,
    _WidgetBase,
    PlayerImagePicker
) {
    return declare("dialog/widgets/PlayerElement", [_WidgetBase], {

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

            var playerName = domConstruct.create('span', {
                innerHTML: this.player.name,
                class: 'set-field'
            }, playerProps);

            on(playerName, 'click', this.changeValue(playerName));
        },

        changeValue: function(fieldNode) {
            const VIEW_MODE = 'view';
            const EDIT_MODE = 'edit';
            var self = this;

            var mode = VIEW_MODE;
            return function() {
                if (mode === VIEW_MODE) {
                    console.log('Name click');
                    mode = EDIT_MODE;

                    var fieldValue = fieldNode.innerHTML;
                    domConstruct.empty(fieldNode);
                    var textBox = new TextBox({
                        value: fieldValue,
                        selectOnClick: true,
                        onBlur: function() {
                            var newValue = this.get('value');
                            console.log(newValue);
                            self.updatePlayer({
                                name: newValue
                            });
                        },
                        onKeyUp: function(e) {
                            if (e.keyCode == this.ENTER_KEY_CODE) {
                                console.log('Entered');
                            }
                        }
                    });
                    textBox.placeAt(fieldNode);
                    textBox.focus();
                }
            }
        },

        updatePlayer: function(newPlayer) {
            newPlayer.id = this.player.id;
            this._restStore.put(newPlayer);
        }
    });
});