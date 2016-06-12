/**
    * Created by arthan on 12.06.2016. Project pytclon
    */

define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/dom-construct",
    "dojo/on",
    "dojo/keys",
    "dojo/store/JsonRest",
    "dijit/form/TextBox",
    "dijit/_WidgetBase"
], function(
    declare,
    lang,
    domConstruct,
    on,
    keys,
    JsonRest,
    TextBox,
    _WidgetBase
) {
    return declare([_WidgetBase], {

        changeCallback: null,
        player: null,
        modeHandler: null,

        constructor: function (config) {
            this.changeCallback = config.changeCallback;
            this.player = config.player;
        },
        
        buildRendering: function () {
            this.domNode = domConstruct.create('span', {
                innerHTML: this.player.name,
                "class": 'set-field'
            })
        },

        postCreate: function () {
            this.modeHandler = on.pausable(this.domNode, 'click', lang.hitch(this, this._changeValue));
        },

        _changeValue: function () {
            this.modeHandler.pause();
            var fieldValue = this.domNode.innerHTML;
            domConstruct.empty(this.domNode);
            var textBox = new TextBox({
                value: fieldValue,
                selectOnClick: true
            });
            /*textBox.onBlur = function () {
                var newValue = textBox.get('value');
                self.updatePlayer({
                    name: newValue
                });
            };*/
            on(textBox, "keyup", lang.hitch(this, function (e) {
                if (e.keyCode == keys.ENTER) {
                    var newValue = textBox.get('value');
                    this.changeCallback({
                        name: newValue,
                        id: this.player.id
                    });
                    textBox.destroy();
                    this.domNode.innerHTML = newValue;
                    this.modeHandler.resume();
                }
            }));

            textBox.placeAt(this.domNode);
            textBox.focus();
        }
    });
});
