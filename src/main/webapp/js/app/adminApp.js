/**
 * Created by ashamsiev on 02.03.2016.
 */

require([
    'dojo/parser',
    'dojo/_base/fx',
    'dojo/ready',
    'dojo/query',
    'dojo/dom-style',
    'pytclon/util/overlay',
    'dojo/domReady!'
], function(
    parser,
    fx,
    ready,
    query,
    domStyle,
    Overlay
) {
    (new Overlay()).init();
});