/**
 * Created by arthan on 28.05.2016.
 */

define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/request",
    "dojo/dom-construct",
    "dijit/TooltipDialog",
    "dijit/popup",
    "dijit/_WidgetBase"
], function(
    declare,
    lang,
    on,
    request,
    domConstruct,
    TooltipDialog,
    popup,
    _WidgetBase
) {
    return declare([_WidgetBase], {

        _tooltip: null,
        imageIds: null,

        _initTooltip: function () {
            this._tooltip = new TooltipDialog({
                content: domConstruct.create('div', {
                    style: 'background-color: red',
                    innerHTML: 'Test'
                }),
                onClick: this._closeTooltip,
                onMouseLeave: this._closeTooltip
            });
            request("rest/player/images", {
                handleAs: "json"
            }).then(lang.hitch(this, function (res) {
                this.imageIds = res;
            }));
        },
        
        constructor: function(config) {
            
            if (!config.player.id) {
                throw new Error('Player ID for player image picker is not defined!')
            }
            this.player = config.player;

            this._initTooltip();

            console.log('Player image picker constructed');
        },

        buildRendering: function() {
            this.domNode = domConstruct.create('div', {
                class: 'player-thumbnail'
            });

            on(this.domNode, "click", lang.hitch(this, function () {
                console.log('Showing available player images');
                this._showGallery(this.imageIds);
            }));
        },

        postCreate: function () {
            if (this.player.playerImageId) {
                this._setImage(this.player.playerImageId)
            }
        },
        
        _closeTooltip: function () {
            popup.close(this._tooltip)
        },

        _setImage: function (imageId) {
            domConstruct.empty(this.domNode);
            domConstruct.create('img', {
                src: "rest/player/image/" + imageId,
                width: 60,
                height: 60
            }, this.domNode);
        },

        _showGallery: function (images) {
            var gallery = domConstruct.create('div', null);

            images.forEach(lang.hitch(this, function (imageId) {
                var imageNode = domConstruct.create('img', {
                    src: "rest/player/image/" + imageId,
                    width: 80,
                    height: 80,
                    style: "margin: 2px;"
                }, gallery);
                on(imageNode, "click", lang.hitch(this, function () {
                    this._setImage(imageId);
                    // TODO: send image id selected for player
                    
                    this._savePlayerImage(imageId);
                }));
            }));

            this._tooltip.set('content', gallery);
            popup.open({
                popup: this._tooltip,
                around: this.domNode
            });
        },

        _savePlayerImage: function (imageId) {
            this.changeCallback({
                playerImageId: imageId,
                id: this.player.id
            });
        }

    });
});