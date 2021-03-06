(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.AvatarField = Alpaca.Fields.AttachmentField.extend(
    /**
     * @lends Alpaca.Fields.AttachmentField.prototype
     */
    {
        /**
         * @constructs
         * @augments Alpaca.Fields.TextField
         *
         * @class File control with nice custom styles.
         *
         * @param {Object} container Field container.
         * @param {Any} data Field data.
         * @param {Object} options Field options.
         * @param {Object} schema Field schema.
         * @param {Object|String} view Field view.
         * @param {Alpaca.Connector} connector Field connector.
         */
        constructor: function(container, data, options, schema, view, connector) {
            this.base(container, data, options, schema, view, connector);
        },

        /**
         * @see Alpaca.Fields.TextField#setup
         */
        setup: function() {

            this.base();

            this.options.attachmentIdAsFilename = true;
            this.options.filterPreviews = true;

            this.controlFieldTemplateDescriptor = this.view.getTemplateDescriptor("controlFieldAvatar");

            _mergeObject(this.options, {
                "fileupload" : {
                    "attachmentId" : "avatar",
                    "maxNumberOfFiles" :1,
                    "autoUpload": true,
                    "acceptFileTypes" : /(\.|\/)(gif|jpe?g|png)$/i
                }
            });
        },

        /**
         * Disables all upload buttons
         */
        hideButtons: function () {
            this.field.find('.delete').hide();
            this.field.find('.start').hide();
            this.field.find('.cancel').hide();
        },

        /**
         *
         */
        getUploadTemplate: function() {
            return this.wrapTemplate("templateAvatarUpload");
        },

        /**
         *
         */
        getDownloadTemplate: function() {
            return this.wrapTemplate("templateAvatarDownload");
        },

        /**
         * @see Alpaca.Fields.TextField#getTitle
         */
        getTitle: function() {
            return "Avatar Field";
        },

        /**
         * @see Alpaca.Fields.TextField#getDescription
         */
        getDescription: function() {
            return "Field for uploading avatar.";
        },

        /**
         * @see Alpaca.Fields.TextField#getFieldType
         */
        getFieldType: function() {
            return "file";
        }
    });

    Alpaca.registerTemplate('templateAvatarUpload', '<tr class="template-upload{{if error}} ui-state-error{{/if}}"><td class="attachment-id" style="display:none;"><input class="attachment-id-input" type="text" value="${attachmentId}" data-alpacaid="${alpacaId}"/></td><td class="preview"></td><td class="name">${name}</td><td class="type">${type}</td><td class="size">${sizef}</td>{{if error}}<td class="upload-error" colspan="2">Error:{{if error === \'maxFileSize\'}}File is too big{{else error === \'minFileSize\'}}File is too small{{else error === \'acceptFileTypes\'}}Filetype not allowed{{else error === \'maxNumberOfFiles\'}}Max number of files exceeded{{else}}${error}{{/if}}</td>{{else}}<td><div class="progress"><div class="bar" style="width:0%;"></div></div></td><td><button class="start">Start</button></td>{{/if}}<td><button class="cancel">Cancel</button></td></tr>');

    Alpaca.registerTemplate('templateAvatarDownload', '<tr class="template-download{{if error}} ui-state-error{{/if}}" data-attachmentid="${attachmentId}">{{if error}}<td></td><td class="attachment-id"><span class="fileupload-attachment-id">${attachmentId}</span></td><td class="name">${name}</td><td class="size">${sizef}</td><td class="upload-error" colspan="2">Error:{{if error === 1}}File exceeds upload_max_filesize (php.ini directive){{else error === 2}}File exceeds MAX_FILE_SIZE (HTML form directive){{else error === 3}}File was only partially uploaded{{else error === 4}}No File was uploaded{{else error === 5}}Missing a temporary folder{{else error === 6}}Failed to write file to disk{{else error === 7}}File upload stopped by extension{{else error === \'maxFileSize\'}}File is too big{{else error === \'minFileSize\'}}File is too small{{else error === \'acceptFileTypes\'}}Filetype not allowed{{else error === \'maxNumberOfFiles\'}}Max number of files exceeded{{else error === \'uploadedBytes\'}}Uploaded bytes exceed file size{{else error === \'emptyResult\'}}Empty file upload result{{else}}${error}{{/if}}</td>{{else}}<td class="attachment-id"><span class="fileupload-attachment-id" style="display:none;">${attachmentId}</span><span>${name}</span></td><td class="name"><a class="fileupload-attachment-download" href="${url}"><img src="${thumbnail_url}" class="avatar-photo"/></a></td><td class="type">${type}</td><td class="size">${size}</td><td></td>{{/if}}<td><button class="delete" data-type="${delete_type}" data-url="${delete_url}">Delete</button></td></tr>');

    //Alpaca.registerTemplate("controlFieldAvatar", '<div id="fileupload-${id}"><form method="POST" enctype="multipart/form-data"><div class="fileupload-buttonbar"><label class="fileinput-button"><span>Add avatar...</span><input type="file" name="{{if options.name}}${options.name}{{else}}files[]{{/if}}" multiple></label><button type="submit" class="start">Start upload</button><button type="reset" class="cancel" style="display:none">Cancel upload</button><button type="button" class="delete" style="display:none">Delete files</button><button type="button" class="fileupload-thumbnails" style="display:none;">Thumbnails</button><button type="button" class="fileupload-preview" style="display:none;">Preview</button></div></form><div class="fileupload-slideshow"></div><div class="fileupload-content dropzone" rel="tooltip-html" title="Drag-n-Drop your desktop file to the above drop zone."><table class="files"></table><div class="fileupload-progressbar"></div></div></div>');
    Alpaca.registerTemplate("controlFieldAvatar", '<div id="fileupload-${id}"><form method="POST" enctype="multipart/form-data"><div class="fileupload-buttonbar"><label class="fileinput-button"><span>Add avatar...</span><input type="file" name="{{if options.name}}${options.name}{{else}}files[]{{/if}}" multiple></label></div></form><div class="fileupload-slideshow"></div><div class="fileupload-content dropzone" rel="tooltip-html" title="Drag-n-Drop your desktop file to the above drop zone."><table class="files"></table><div class="fileupload-progressbar"></div></div></div>');

    Alpaca.registerFieldClass("avatar", Alpaca.Fields.AvatarField);

})(jQuery);
