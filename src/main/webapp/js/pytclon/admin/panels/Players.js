/**
    * Created by ashamsiev on 10.03.2016
    */

define([
    "dojo/_base/declare",
    "dijit/layout/ContentPane",
    "pytclon/admin/panels/_AdminPanelMixin",
    "pytclon/admin/widgets/PlayerImageUpload"
], function(
    declare,
    ContentPane,
    _AdminPanelMixin,
    PlayerImageUpload
) {
    return declare("admin/panels/Players", [ContentPane, _AdminPanelMixin], {

        content: 'Players',
        title: 'Players',

        constructor: function() {
            console.debug('NotUsers panel constructed');
        },

        postCreate: function() {
            (new PlayerImageUpload()).placeAt(this.containerNode);
        }
    });
});