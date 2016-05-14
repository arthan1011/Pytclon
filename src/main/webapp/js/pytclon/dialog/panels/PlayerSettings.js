/**
    * Created by arthan on 12.05.2016. Project pytclon
    */

define([
    'dijit/layout/ContentPane',
    'dojo/_base/declare',
    'dojo/store/JsonRest',
    'dojo/text!./PlayerSettings.html'
], function (
    ContentPane,
    declare,
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
                .then(function (results) {
                    console.log('User players: ', results);
                });

            this.inherited(arguments);
        }
    });
});