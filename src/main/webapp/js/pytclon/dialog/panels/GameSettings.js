/**
    * Created by arthan on 12.05.2016. Project pytclon
    */

define([
    'dijit/layout/ContentPane',
    'dojo/_base/declare',
    'dojo/text!./GameSettings.html'
], function (
    ContentPane,
    declare,
    panelContent
) {
    return declare("dialog/panels/GameSettings", [ContentPane], {
        title: 'Game',
        content: panelContent,
        class: 'noPad',

        constructor: function() {
            console.log('Game settings constructed');
        }
    });
});