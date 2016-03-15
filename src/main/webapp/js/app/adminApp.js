/**
 * Created by ashamsiev on 02.03.2016.
 */

require([
    'dojo/parser',
    'dojo/_base/fx',
    'dojo/ready',
    'dojo/query',
    'dojo/dom-style',
    'dojo/domReady!'
], function(
    parser,
    fx,
    ready,
    query,
    domStyle
) {
    ready(function() {
        var overlayNode = query('.loadingOverlay')[0];
        fx.animateProperty({
            node: overlayNode,
            properties: {
                top: '300',
                opacity: '0'
            },
            onEnd: function(node) {
                domStyle.set(node, {
                    display: 'none'
                });
            }
        }).play();

    });
});