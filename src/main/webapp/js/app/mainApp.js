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

    var welcomeNode = dom.byId('welcome');
    domConstruct.place('<em>Welcome to Game</em>', welcomeNode);
});