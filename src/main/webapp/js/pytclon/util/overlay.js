/**
 * Created by ashamsiev on 18.03.2016.
 */

define([
    'dojo/_base/fx',
    'dojo/_base/declare',
    'dojo/ready',
    'dojo/query',
    'dojo/dom-style',
    'dojo/dom-construct',
    'dojo/_base/window'
], function(
    fx,
    declare,
    ready,
    query,
    domStyle,
    domConstruct,
    win
){
    return declare(null, {

        init: function() {
            //var overlayNode = this._createOverlayNode();
            this._setupOverlayOnLoad(query('.loadingOverlay')[0]);
        },

        _createOverlayNode: function () {
            var overlayNode = domConstruct.create('div', {
                class: 'loadingOverlay'
            }, win.body(), 'first');

            domConstruct.create('h1', {
                innerHTML: 'Loading...'
            }, overlayNode);

            return overlayNode;
        },

        _setupOverlayOnLoad: function (overlayNode) {
            ready(function() {
                fx.animateProperty({
                    node: overlayNode,
                    properties: {
                        top: '300',
                        opacity: '0'
                    },
                    onEnd: function(node) {
                        domStyle.set(node, {
                            display: 'none'
                        })
                    }
                }).play();
            });
        }
    });

});