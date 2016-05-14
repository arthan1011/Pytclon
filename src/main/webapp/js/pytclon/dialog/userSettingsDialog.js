/**
    * Created by arthan on 01.05.2016. Project pytclon
    */

define([
    'pytclon/dialog/panels/PlayerSettings',
    'pytclon/dialog/panels/GameSettings',
    'dijit/Dialog',
    'dijit/form/Button',
    'dijit/layout/BorderContainer',
    'dijit/layout/ContentPane',
    'dojo/on',
    'dojo/topic',
    'dojo/dom-construct'
], function (
    PlayerSettings,
    GameSettings,
    Dialog,
    Button,
    BorderContainer,
    ContentPane,
    on,
    topic,
    domConstruct
) {
    const changeTabTopic = 'UserSettingsDialog_changeTab';

    function createDialog(tabs) {
        var bc = new BorderContainer({
            gutters: false,
            style: "width: 600px; height: 500px;"
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

        topic.subscribe(changeTabTopic, function (widget) {
            domConstruct.empty(mainPane.domNode);
            widget.placeAt(mainPane);
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
        return dialog;
    }

    function initTabs(tabs) {
        var _tabs = [
            new PlayerSettings(),
            new GameSettings()
        ];
        _tabs.forEach(function (tabWidget) {
            var tabNode = domConstruct.create('div', {
                class: 'dialogTab',
                innerHTML: tabWidget.get('title')
            }, tabs);
            on(tabNode, 'click', function () {
                topic.publish(changeTabTopic, tabWidget);
            })
        });
    }

    var tabs = domConstruct.create('div');

    initTabs(tabs);

    var dialog = createDialog(tabs);

    return dialog
});