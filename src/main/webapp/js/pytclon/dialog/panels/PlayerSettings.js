/**
    * Created by arthan on 12.05.2016. Project pytclon
    */

define([
    'dijit/layout/ContentPane',
    'dojo/_base/declare',
    'dojo/text!./PlayerSettings.html'
], function (
    ContentPane,
    declare,
    panelContent
) {
    return declare("dialog/panels/PlayerSettings", [ContentPane], {
        title: 'Players',
        content: panelContent,
        class: 'noPad',

        constructor: function() {
            console.log('Player settings constructed');
        }
    });
});