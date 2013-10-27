(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.MultiFolderNodesField = Alpaca.Fields.MultiNodesField.extend(
    /**
     * @lends Alpaca.Fields.MultiNodesField.prototype
     */
    {
        /**
         * @constructs
         * @augments  Alpaca.Fields.AttachmentField
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

            this.controlFieldTemplateDescriptor = this.view.getTemplateDescriptor("controlFieldMultiFolderNodes");

            if (this.options && this.options.nodeType) {
                this.nodeType = this.options.nodeType;
            }
            if (this.options && this.options.nodeUrl) {
                this.nodeUrl = this.options.nodeUrl;
            }
        },

        /**
         *
         */
        getUploadTemplate: function() {
            return this.wrapTemplate("multiFolderNodesUploadTemplate");
        },

        /**
         *
         */
        getDownloadTemplate: function() {
            return this.wrapTemplate("multiFolderNodesDownloadTemplate");
        },

        /**
         *
         * @param node
         * @param index
         */
        onNodeCreated: function (node,index,context) {
            node.associateOf(context.node(),"a:child")
        },

        /**
         * @see Alpaca.Fields.TextField#postRender
         */
        postRender: function(callback)
        {
            var self = this;

            this.base(function() {

                // apply additional css
                if (self.fieldContainer) {
                    self.fieldContainer.addClass("alpaca-controlfield-multifoldernodes");
                }

            });
        },

        /**
         * @see Alpaca.Fields.TextField#getTitle
         */
        getTitle: function() {
            return "Multiple Node Field";
        },

        /**
         * @see Alpaca.Fields.TextField#getDescription
         */
        getDescription: function() {
            return "Field for uploading multiple nodes.";
        }
    });

    Alpaca.registerTemplate('multiFolderNodesUploadTemplate', '<tr class="fileupload-item"><tr><td style="display:none;"><strong>Title</strong></td><td class="node-title" colspan="6"  style="display:none;"><input class="node-title-input" size="40" type="text" data-alpacaid="${alpacaId}" value="${name}"/></td></tr><tr><td style="display:none;"><strong>Description</strong></td><td class="node-description" colspan="6"  style="display:none;"><textarea class="node-description-input" rows="5" cols="40" data-alpacaid="${alpacaId}"></textarea></td></tr><tr class="template-upload{{if error}} ui-state-error{{/if}}"><td class="attachment-id"  style="display:none;"><span class="ui-icon ui-icon-copy" style="float:left;"/><input class="attachment-id-input" type="text" value="${attachmentId}" data-alpacaid="${alpacaId}"/></td><td class="preview"></td><td class="name">${name}</td><td class="type">${type}</td><td class="size">${sizef}</td>{{if error}}<td class="upload-error" colspan="2">Error:{{if error === \'maxFileSize\'}}File is too big{{else error === \'minFileSize\'}}File is too small{{else error === \'acceptFileTypes\'}}Filetype not allowed{{else error === \'maxNumberOfFiles\'}}Max number of files exceeded{{else}}${error}{{/if}}</td>{{else}}<td><div class="progress"><div class="bar" style="width:0%;"></div></div></td><td><button class="start" style="display:none">Start</button></td>{{/if}}<td><button class="cancel">Cancel</button></td></tr></tr>');

    Alpaca.registerTemplate('multiFolderNodesDownloadTemplate', '{{if loaded}}<tr class="template-download{{if error}} ui-state-error{{/if}}" data-attachmentid="${attachmentId}">{{if error}}<td></td><td class="attachment-id"><input class="attachment-id-input" type="text" value="${attachmentId}" disabled="disabled"/></td><td class="name">${name}</td><td class="size">${sizef}</td><td class="upload-error" colspan="2">Error:{{if error === 1}}File exceeds upload_max_filesize (php.ini directive){{else error === 2}}File exceeds MAX_FILE_SIZE (HTML form directive){{else error === 3}}File was only partially uploaded{{else error === 4}}No File was uploaded{{else error === 5}}Missing a temporary folder{{else error === 6}}Failed to write file to disk{{else error === 7}}File upload stopped by extension{{else error === \'maxFileSize\'}}File is too big{{else error === \'minFileSize\'}}File is too small{{else error === \'acceptFileTypes\'}}Filetype not allowed{{else error === \'maxNumberOfFiles\'}}Max number of files exceeded{{else error === \'uploadedBytes\'}}Uploaded bytes exceed file size{{else error === \'emptyResult\'}}Empty file upload result{{else}}${error}{{/if}}</td>{{else}}<td class="attachment-id"><a href="${url}">${title}</a></td><td class="preview" colspan="2" style="white-space:nowrap;">{{if thumbnails}}<span class="ui-icon ui-icon-image" style="float:left;"></span> {{each thumbnails}}<span style="padding:0 2px"><a href="${url}" class="thumbnail"  target="_blank">${id}</a></span>{{/each}}{{/if}}</td>{{if attachments}}<td class="name"  colspan="2" style="white-space:nowrap;"><span class="ui-icon ui-icon-copy" style="float:left;"/> {{each attachments}}<span style="padding:0 2px"><a href="${url}" class="attachment" title="${name} ${size} ${type}" target="_blank">${id}</a></span>{{/each}}</td>{{/if}}<td colspan="1"></td>{{/if}}<td><button class="delete" data-type="${delete_type}" data-url="${delete_url}">Delete</button></td></tr>{{/if}}');

    Alpaca.registerTemplate("controlFieldMultiFolderNodes", '<div id="fileupload-${id}"><form method="POST" enctype="multipart/form-data"><div class="fileupload-buttonbar"><label class="fileinput-button"><span>Add files...</span><input type="file" name="files[]" multiple></label><select class="upload-node-type" style="float:right"></select></div></form><div class="fileupload-slideshow"></div><div class="fileupload-content dropzone" rel="tooltip-html" title="Drag-n-Drop your desktop file(s) to the above drop zone."><table class="files"></table><div class="fileupload-progressbar" style="visibility:hidden;display:none"></div></div></div>');

    Alpaca.registerFieldClass("multifoldernodes", Alpaca.Fields.MultiFolderNodesField);

})(jQuery);
