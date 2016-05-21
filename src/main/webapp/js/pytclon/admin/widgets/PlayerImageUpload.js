/**
    * Created by ashamsiev on 18.05.2016
    */

define([
    "dojo/_base/declare",
    "dojo/dom-construct",
    "dojo/dom",
    "dojo/request",
    "dijit/form/Button",
    "dijit/_WidgetBase",
    "dojox/form/Uploader",
    "dojox/form/uploader/FileList"
], function(
    declare,
    domConstruct,
    dom,
    request,
    Button,
    _WidgetBase,
    Uploader,
    FileList
) {
    return declare("admin/widgets/PlayerImageUpload", [_WidgetBase], {

        buildRendering: function() {
            this.domNode = domConstruct.create('div');

            var uploadForm = domConstruct.create('form', {}, this.domNode);

            var imageUploader = (new Uploader({
                label: "Select images",
                multiple: true,
                uploadOnSelect: true,
                onComplete: function () {
                    console.log('File uploaded!');
                },
                url: "rest/player/images"
            }, uploadForm));
            imageUploader.startup();
        }
    });
});