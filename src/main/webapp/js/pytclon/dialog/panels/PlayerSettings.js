/**
    * Created by arthan on 12.05.2016. Project pytclon
    */

define([
    'dijit/layout/ContentPane',
    'pytclon/dialog/widgets/PlayerElement',
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/dom-construct',
    'dojo/store/JsonRest',
    'dojo/text!./PlayerSettings.html'
], function (
    ContentPane,
    PlayerElement,
    declare,
    lang,
    domConstruct,
    JsonRest,
    panelContent
) {
    return declare("dialog/panels/PlayerSettings", [ContentPane], {
        title: 'Players',
        content: panelContent,
        class: 'noPad',

        constructor: function() {
            console.log('Player settings constructed');
        },

        postCreate: function () {
            console.log('Creating player settings!');
            
            var restStore = new JsonRest({
                target: 'rest/player'
            });

            restStore.get()
                .then(lang.hitch(this, function (results) {
                    var containerNode = this.containerNode;
                    console.log('User players: ', results);
                    results.forEach(function(item) {
                        (new PlayerElement(item)).placeAt(containerNode);
                    });
                }));

            this.inherited(arguments);
        }
    });
});