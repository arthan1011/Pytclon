/**
 * Created by ashamsiev on 18.03.2016.
 */

require([
    'dojo/parser',
    'pytclon/common/ContentHolder',
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
            showWelcomeMsg(data);
        });

    function showWelcomeMsg(name) {
        var welcomeNode = dom.byId('welcome');
        domConstruct.place('<em>Welcome to Game,' + ' ' + name + '</em>', welcomeNode);
    }
});