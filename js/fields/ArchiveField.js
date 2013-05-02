(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.ArchiveField = Alpaca.Fields.AttachmentField.extend(
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

            this.controlFieldTemplateDescriptor = this.view.getTemplateDescriptor("controlFieldArchive");

            Alpaca.mergeObject(this.options, {
                "fileupload" : {
                    "attachmentId" : "archive",
                    "maxNumberOfFiles" :1,
                    "acceptFileTypes" : /(\.|\/)(zip|gz|tar|jar|war)$/i
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
            return this.wrapTemplate("templateArchiveUpload");
        },

        /**
         *
         */
        getDownloadTemplate: function() {
            return this.wrapTemplate("templateArchiveDownload");
        },

        /**
         * @see Alpaca.Fields.TextField#getTitle
         */
        getTitle: function() {
            return "Archive Field";
        },

        /**
         * @see Alpaca.Fields.TextField#getDescription
         */
        getDescription: function() {
            return "Field for uploading archive.";
        },

        /**
         * @see Alpaca.Fields.TextField#getFieldType
         */
        getFieldType: function() {
            return "file";
        }
    });

    Alpaca.registerTemplate('templateArchiveUpload', '<tr class="template-upload{{if error}} ui-state-error{{/if}}"><td class="attachment-id" style="display:none;"><input class="attachment-id-input" type="text" value="${attachmentId}" data-alpacaid="${alpacaId}"/></td><td class="preview"></td><td class="name">${name}</td><td class="type">${type}</td><td class="size">${sizef}</td>{{if error}}<td class="upload-error" colspan="2">Error:{{if error === \'maxFileSize\'}}File is too big{{else error === \'minFileSize\'}}File is too small{{else error === \'acceptFileTypes\'}}Filetype not allowed{{else error === \'maxNumberOfFiles\'}}Max number of files exceeded{{else}}${error}{{/if}}</td>{{else}}<td class="progress" style="display:none;"><div></div></td><td class="start" style="display:none;"><button>Start</button></td>{{/if}}<td class="cancel"><button>Cancel</button></td></tr>');

    Alpaca.registerTemplate('templateArchiveDownload', '<tr class="template-download{{if error}} ui-state-error{{/if}}" data-attachmentid="${attachmentId}">{{if error}}<td></td><td class="attachment-id"><span class="fileupload-attachment-id">${attachmentId}</span></td><td class="name">${name}</td><td class="size">${sizef}</td><td class="upload-error" colspan="2">Error:{{if error === 1}}File exceeds upload_max_filesize (php.ini directive){{else error === 2}}File exceeds MAX_FILE_SIZE (HTML form directive){{else error === 3}}File was only partially uploaded{{else error === 4}}No File was uploaded{{else error === 5}}Missing a temporary folder{{else error === 6}}Failed to write file to disk{{else error === 7}}File upload stopped by extension{{else error === \'maxFileSize\'}}File is too big{{else error === \'minFileSize\'}}File is too small{{else error === \'acceptFileTypes\'}}Filetype not allowed{{else error === \'maxNumberOfFiles\'}}Max number of files exceeded{{else error === \'uploadedBytes\'}}Uploaded bytes exceed file size{{else error === \'emptyResult\'}}Empty file upload result{{else}}${error}{{/if}}</td>{{else}}<td class="attachment-id"><span class="fileupload-attachment-id" style="display:none;">${attachmentId}</span><span>${name}</span></td><td class="name"><a class="fileupload-attachment-download" href="${url}"><img src="${thumbnail_url}" class="archive-photo"/></a></td><td class="type">${type}</td><td class="size">${size}</td><td></td>{{/if}}<td><button class="delete" data-type="${delete_type}" data-url="${delete_url}">Delete</button></td></tr>');

    Alpaca.registerTemplate("controlFieldArchive", '<div id="fileupload-${id}"><form method="POST" enctype="multipart/form-data"><div class="fileupload-buttonbar"><label class="fileinput-button"><span>Add archive...</span><input type="file" name="{{if options.name}}${options.name}{{else}}files[]{{/if}}" multiple></label><button type="submit" class="start">Start upload</button><button type="reset" class="cancel" style="display:none">Cancel upload</button><button type="button" class="delete" style="display:none">Delete files</button><button type="button" class="fileupload-thumbnails" style="display:none;">Thumbnails</button><button type="button" class="fileupload-preview" style="display:none;">Preview</button></div></form><div class="fileupload-slideshow"></div><div class="fileupload-content dropzone" rel="tooltip-html" title="Drag-n-Drop your desktop file to the above drop zone."><table class="files"></table><div class="fileupload-progressbar"></div></div></div>');

    Alpaca.registerFieldClass("archive", Alpaca.Fields.ArchiveField);

})(jQuery);
