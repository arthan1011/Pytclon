/**
    * Created by arthan on 01.05.2016. Project pytclon
    */

define([
    'dijit/Dialog',
    'dijit/form/Button',
    'dojo/dom-construct'
], function (
    Dialog,
    Button,
    domConstruct
) {
    var dialogContent = domConstruct.create('div');

    var mainDialogRegion = domConstruct.create('div', {
        style: 'height: 500px; width: 600px; background-color: gray',
        "class": "dijitDialogPaneContentArea"
    }, dialogContent) ;

    var footerActionBar = domConstruct.create('div', {
        style: 'background-color: lightgrey; padding: 3px',
        "class": "dijitDialogPaneActionBar"
    }, dialogContent);

    var cancelButtonNode = domConstruct.create('button', {
        innerHTML: 'Cancel',
        type: 'button'
    }, footerActionBar);

    var dialog = new Dialog({
        title: "User settings",
        content: dialogContent,
        closable: false
    });
    new Button({
        label: 'Cancel',
        onClick: function () {
            dialog.hide();
        }
    }, cancelButtonNode);

    return dialog
});