/**
    * Created by ashamsiev on 18.05.2016
    */

define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/dom-construct",
    "dojo/dom",
    "dojo/request",
    "dijit/form/Button",
    "dijit/_WidgetBase",
    "dojox/form/Uploader",
    "dojox/form/uploader/FileList"
], function(
    declare,
    lang,
    domConstruct,
    dom,
    request,
    Button,
    _WidgetBase,
    Uploader,
    FileList
) {
    return declare("admin/widgets/PlayerImageUpload", [_WidgetBase], {

        imageGallery: undefined,

        buildRendering: function() {
            this.domNode = domConstruct.create('div');

            var uploadForm = domConstruct.create('form', {}, this.domNode);

            var imageUploader = (new Uploader({
                label: "Select images",
                multiple: true,
                uploadOnSelect: true,
                onComplete: lang.hitch(this, this.reloadGallery),
                url: "rest/player/images"
            }, uploadForm));
            imageUploader.startup();

            this.imageGallery = domConstruct.create('div', {
                id: 'imageDisplay',
                class: "image-gallery"
            }, this.domNode);

            this.reloadGallery();
        },

        postCreate: function () {

        },

        reloadGallery: function() {
            var gallery = this.imageGallery;

            domConstruct.empty(gallery);

            request("rest/player/images", {
                handleAs: "json"
            }).then(function (ids) {
                ids.forEach(function (item) {
                    addImageToGallery(gallery, item);
                });
            }, function (error) {
                alert(error);   
            });

            function addImageToGallery(gallery, imageId) {
                domConstruct.create('img', {
                    src: "rest/player/image/" + imageId,
                    width: 80,
                    height: 80,
                    style: "margin: 2px;"
                }, gallery)
            }
        }
    });
    
});