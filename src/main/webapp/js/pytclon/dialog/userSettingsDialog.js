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
    const SET_TAB_TOPIC = 'UserSettingsDialog_changeTab';

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

        function setWidget(widget, target) {
            domConstruct.empty(target.domNode);
            widget.placeAt(target);
        }

        topic.subscribe(SET_TAB_TOPIC, function (widget) {
            setWidget(widget, mainPane);
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

    function initTabs(tabsContainer) {
        var tabs = [
            new PlayerSettings(),
            new GameSettings()
        ];
        tabs.forEach(function (tabWidget) {
            var tabNode = domConstruct.create('div', {
                class: 'dialogTab',
                innerHTML: tabWidget.get('title')
            }, tabsContainer);
            on(tabNode, 'click', function () {
                topic.publish(SET_TAB_TOPIC, tabWidget);
            })
        });
        // set default tab
        topic.publish(SET_TAB_TOPIC, tabs[0]);
    }

    var tabsContainer = domConstruct.create('div');

    var dialog = createDialog(tabsContainer);

    initTabs(tabsContainer);

    return dialog
});