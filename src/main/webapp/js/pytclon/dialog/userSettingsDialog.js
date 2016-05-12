/**
    * Created by arthan on 01.05.2016. Project pytclon
    */

define([
    'dijit/Dialog',
    'dijit/form/Button',
    'dijit/layout/BorderContainer',
    'dijit/layout/ContentPane',
    'dojo/on',
    'dojo/topic',
    'dojo/dom-construct'
], function (
    Dialog,
    Button,
    BorderContainer,
    ContentPane,
    on,
    topic,
    domConstruct
) {
    const changeTabTopic = 'UserSettingsDialog_changeTab';

    var dialogContent = domConstruct.create('div');

    var bc = new BorderContainer({
        gutters: false,
        style: "width: 600px; height: 500px;"
    });

    var tabs = domConstruct.create('div');
    on(domConstruct.create('div', {
        style: 'width: 100%; height: 35px; margin-bottom: 2px; background-color: red'
    }, tabs), 'click', function () {
        console.log('Red');
        topic.publish(changeTabTopic, domConstruct.create('span', {innerHTML: 'RED'}));
    });
    on(domConstruct.create('div', {
        style: 'width: 100%; height: 35px; margin-bottom: 2px; background-color: green'
    }, tabs), 'click', function () {
        console.log('Green');
        topic.publish(changeTabTopic, domConstruct.create('span', {innerHTML: 'GREEN'}));
    });
    var leftPane = new ContentPane({
        region: "left",
        style: "width: 150px; border-right: solid grey 1px",
        content: tabs
    });

    var mainPane = new ContentPane({
        region: "center",
        content: 'Main'
    });

    topic.subscribe(changeTabTopic, function (mainContent) {
        domConstruct.empty(mainPane.domNode);
        domConstruct.place(mainContent, mainPane.domNode);
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