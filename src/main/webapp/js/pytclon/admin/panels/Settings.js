/**
 * Created by ashamsiev on 10.03.2016.
 */

define([
    "dojo/_base/declare",
    "dijit/layout/ContentPane",
    "pytclon/admin/panels/_AdminPanelMixin"
], function(
    declare,
    ContentPane,
    _AdminPanelMixin
) {
    return declare("admin/panels/Settings", [ContentPane, _AdminPanelMixin], {
        content: 'Settings',
        title: 'Settings'
    });
});