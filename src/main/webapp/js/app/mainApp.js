/**
    * Created by ashamsiev on 18.03.2016. Project pytclon
    */

require([
    'dojo/parser',
    'pytclon/common/ContentHolder',
    'dijit/form/Button',
    'dijit/layout/ContentPane',
    'dijit/layout/BorderContainer',
    'dijit/registry',
    'dojo/dom',
    'dojo/dom-construct',
    'dojo/on',
    'dojo/request',
    'pytclon/util/overlay',
    'dojo/domReady!'
], function(
    parser,
    ContentHolder,
    Button,
    ContentPane,
    BorderContainer,
    registry,
    dom,
    domConstruct,
    on,
    request,
    Overlay)
{
    (new Overlay()).init();

    on(dom.byId('addBtn'), 'click', function() {
        var leftContent = registry.byId('leftContent');
        var newContent = domConstruct.create('div', {
            innerHTML: '<span>New User</span>'
        });
        leftContent.add(newContent);
    });

    request("/pytclon/rest/users/get/current")
        .then(function(data) {
            var welcomeNode = dom.byId('welcome');
            domConstruct.empty(welcomeNode);
            domConstruct.place('<em>Welcome to Game,' + ' ' + data + '</em>', welcomeNode);
        });

    var userSettingsButtonNode = domConstruct.create(
        'button', {
            style: 'float: right'
        },
        dom.byId('pageHeader')
    );
    new Button({
        label: 'UserSettings',
        style: 'float: right',
        onClick: function () {
            alert('TODO: show user settings dialog');
        }
    }, userSettingsButtonNode).startup();

    /*
    var logoutButton = new Button({
        label: 'Log out',
        style: 'float: right'
    }, 'logoutBtn').startup();
    */
});