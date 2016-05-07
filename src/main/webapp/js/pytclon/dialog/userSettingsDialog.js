/**
    * Created by arthan on 01.05.2016. Project pytclon
    */

define([
    'dijit/Dialog',
    'dijit/form/Button',
    'dijit/layout/BorderContainer',
    'dijit/layout/ContentPane',
    'dojo/dom-construct'
], function (
    Dialog,
    Button,
    BorderContainer,
    ContentPane,
    domConstruct
) {
    var dialogContent = domConstruct.create('div');

    var bc = new BorderContainer({
        gutters: false,
        style: "width: 600px; height: 500px;"
    });
    var leftPane = new ContentPane({
        region: "left",
        style: "width: 150px; border-right: solid grey 1px",
        content: 'Tabs'
    });
    var mainPane = new ContentPane({
        region: "center",
        content: 'Main'
    });
    var bottomPanel = new ContentPane({
        region: "bottom",
        style: "border-top: solid grey 1px"
    });
    bc.addChild(leftPane);
    bc.addChild(mainPane);
    bc.addChild(bottomPanel);

    bc.startup();

    var dialog = new Dialog({
        title: "User settings",
        content: bc,
        closable: false
    });
    new Button({
        label: 'Cancel',
        style: 'float: right',
        onClick: function () {
            dialog.hide();
        }
    }).placeAt(bottomPanel);

    return dialog
});