(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.MultiNodesField = Alpaca.Fields.AttachmentField.extend(
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
        constructor: function(container, data, options, schema, view, connector)
        {
            this.base(container, data, options, schema, view, connector);
        },

        /**
         * @see Alpaca.Fields.TextField#setup
         */
        setup: function()
        {
            this.base();

            this.controlFieldTemplateDescriptor = this.view.getTemplateDescriptor("controlFieldMultiNodes");

            if (this.options && this.options.nodeType) {
                this.nodeType = this.options.nodeType;
            }
            if (this.options && this.options.nodeUrl) {
                this.nodeUrl = this.options.nodeUrl;
            }
        },

        branch: function()
        {
            return Chain(this.context);
        },

        /**
         * @override
         */
        getUploadTemplate: function()
        {
            return this.wrapTemplate("multiNodesUploadTemplate");
        },

        /**
         * @override
         */
        getDownloadTemplate: function()
        {
            return this.wrapTemplate("multiNodesDownloadTemplate");
        },

        /**
         * @override
         */
        onFileUploadChange: function (e, data)
        {
            this.base(e, data);

            if ($('tr.template-upload', this.field).length > 0) {
                $('tr.template-upload:last', this.field).css('border-bottom', '1px solid #ccc');
            }
        },

        /**
         * @override
         */
        onFileUploadFail: function (e, data)
        {
            this.base(e, data);

            if ($('tr.template-upload', this.field).length <= 2) {
                $('tr.template-upload', this.field).css('border-bottom', 'none');
            }
        },

        /**
         * @override
         */
        onNodeCreated: function(node,index)
        {
            // nothing
        },

        /**
         * @param e
         */
        onFileUploadStart: function (e)
        {
            Gitana.Utils.UI.block('Uploading File(s)...');
        },

        /**
         * @param e
         */
        onFileUploadStop: function (e)
        {
           Gitana.Utils.UI.unblock();
        },

        /**
         * This method converts the Gitana row response to the format that the file upload plugin expects.
         *
         * @param e
         * @param data
         * @param fileUpload
         */
        onFileUploadDone: function (e, data, fileUpload) {

            var self = this;

            var branch = self.branch();

            var files = [];

            for (var i = 0; i < data.result.rows.length; i++)
            {
                var row = data.result.rows[i];
                var currentFile = data.files[i];

                var nodeId = row["_doc"];
                var attachmentId = currentFile["attachmentId"];

                // we read the node here to fire the callback, but this is done async
                Chain(branch).readNode(nodeId).then(function() {
                    self.onNodeCreated.call(self, this, i);
                });

                var nodeUrl = branch.getDriver().baseURL + branch.getUri() + "/nodes/" + nodeId;

                var thumbnailUrl = nodeUrl + "/preview/console-attachment-" + attachmentId + "?attachment=default&size=64&mimetype=image/jpeg";
                if (attachmentId.indexOf("_preview") == 0)
                {
                    thumbnailUrl = nodeUrl + "/attachments/" + attachmentId;
                }
                thumbnailUrl = _previewMimetypeFallback(thumbnailUrl);

                var browseUrl = "#/repositories/" + branch.getRepositoryId() + "/branches/" + branch.getId() + "/nodes/" + nodeId;

                // the new file
                var file = {
                    "name": currentFile.name,
                    "size": currentFile.size,
                    "type": currentFile.type,
                    "url": nodeUrl,
                    "thumbnail_url": thumbnailUrl,
                    "browse_url": browseUrl,
                    "delete_url": nodeUrl,
                    "delete_type": "DELETE",
                    "attachmentId": "default"
                };

                files.push(file);
            }

            /*
            data.result = {
                "files": files
            };
            */
            data.result.files = files;

            this.renderAttachments();
        },

        /**
         * @see Alpaca.Fields.TextField#postRender
         */
        postRender: function(callback)
        {
            var self = this;

            var branch = self.branch();

            this.base(function() {

                // apply additional css
                if (self.fieldContainer) {
                    self.fieldContainer.addClass("alpaca-controlfield-multinodes");
                }

                var uploadNodeTypeEl = $(self.field).find(".upload-node-type");

                Chain(branch).listDefinitions('type', {
                    "limit": Gitana.Console.LIMIT_NONE
                }).each(function() {
                    var type = this.getQName();
                    $(uploadNodeTypeEl).append('<option value="' + type+ '">' + type+ '</option>');
                }).then(function() {
                    $(uploadNodeTypeEl).val("n:node");
                    window.setTimeout(function() {
                        $(uploadNodeTypeEl).multiselect({
                            minWidth: '300',
                            multiple: false,
                            selectedList: 1,
                            header: "Select Node Type"
                        }).multiselectfilter();
                    }, 400);
                }).then(function() {
                    callback();
                });

            });
        },

        /**
         * Returns service uri for attachment upload
         */
        computeAttachmentUploadUri : function ()
        {
            var branch = this.branch();

            var nodesUploadUri = branch.getDriver().baseURL + "/repositories/" + branch.getRepositoryId() + "/branches/" + branch.getId() + "/nodes";

            var format = Ratchet.Browser.ie ? ".text" : "";
            nodesUploadUri += format;

            return nodesUploadUri;
        },

        /**
         * Prepares final uri for attachment upload
         */
        prepareUploadFormFields: function (data)
        {
            var _this = this;
            var formElem = this.field.find('form');
            var actionUri = this.computeAttachmentUploadUri();
            formElem.find('.properties-field').remove();
            /* add hidden fields */
            $('input:hidden', formElem).remove();
            $.each(data.files, function(index, file) {
                var alpacaId = file['alpacaId'];
                /*
                //$('input.node-title-input:text:[data-alpacaid=' + alpacaId + ']', _this.field).each(function(index2) {
                $('input[data-alpacaid=' + alpacaId + ']', _this.field).each(function(index2) {
                    formElem.append('<input class="properties-field" type="hidden" name="property' + index + '_title" value="' + $(this).val() + '">');
                });
                //$('textarea.node-description-input:[data-alpacaid=' + alpacaId + ']', _this.field).each(function(index2) {
                $('textarea[data-alpacaid=' + alpacaId + ']', _this.field).each(function(index2) {
                    formElem.append('<input class="properties-field" type="hidden" name="property' + index + '_description" value="' + $(this).val() + '">');
                });
                */

                var propertyName = "_type";
                if (_this.nodeType) {
                    formElem.append('<input class="properties-field" type="hidden" name="property' + index + '__' + propertyName + '" value="' + _this.nodeType + '">');
                } else {
                    var nodeType = $('.upload-node-type').val();
                    if (nodeType)
                    {
                        formElem.append('<input class="properties-field" type="hidden" name="property' + index + '__' + propertyName + '" value="' + nodeType + '">');
                    }
                }
            });
            formElem.attr('action', actionUri);
            var thisContext = [];
            $.each(data.context, function(index, elem) {
                if ($(elem).hasClass('template-upload')) {
                    thisContext.push(elem);
                } else {
                    $(elem).remove();
                }
            });
            data.context = $(thisContext);
        },

        /**
         * @see Alpaca.ControlField#handleValidate
         */
        handleValidate: function()
        {
            var valInfo = this.validation;

            var status = this._validateAttachmentId();
            valInfo["invalidAttachmentId"] = {
                "message": status ? "" : 'Invalid Attachment Id.',
                "status": status
            };

            status = valInfo["invalidAttachmentId"]["status"];

            return status;
        },

        /**
         * @see Alpaca.Fields.TextField#getTitle
         */
        getTitle: function()
        {
            return "Multiple Node Field";
        },

        /**
         * @see Alpaca.Fields.TextField#getDescription
         */
        getDescription: function()
        {
            return "Field for uploading multiple nodes.";
        },

        /**
         * @see Alpaca.Fields.TextField#getFieldType
         */
        getFieldType: function()
        {
            return "file";
        }
    });

    var _TEMPLATE_MULTINODES = Alpaca.Fields.MultiNodesField._TEMPLATE_MULTINODES = ' \
        <div id="fileupload-${id}"> \
            <form method="POST" enctype="multipart/form-data"> \
            <div class="fileupload-buttonbar"> \
                <label class="fileinput-button"> \
                    <span>Add files...</span> \
                    <input type="file" name="files[]" multiple> \
                    </label> \
                    <select class="upload-node-type" style="float:right"></select> \
                </div> \
            </form> \
            <div class="fileupload-slideshow"></div> \
            <div class="fileupload-content dropzone" rel="tooltip-html" title="Drag-n-Drop your desktop file(s) to the above drop zone."> \
                <table class="files"></table> \
                <div class="fileupload-progressbar" style="display:none"></div> \
            </div> \
        </div> \
    ';

    var _TEMPLATE_UPLOAD_TEMPLATE = Alpaca.Fields.MultiNodesField._TEMPLATE_UPLOAD_TEMPLATE = ' \
        <tr class="template-upload {{if error}}ui-state-error{{/if}}"> \
            <td class="node-title" colspan="6"> \
                <input class="node-title-input" size="40" type="text" data-alpacaid="${alpacaId}" value="${name}"/> \
            </td> \
            <td class="attachment-id" style="display:none;"> \
                <input class="attachment-id-input" type="text" value="${attachmentId}" data-alpacaid="${alpacaId}"/> \
            </td> \
            <td class="preview"></td> \
            <td class="type">${type}</td> \
            <td class="size">${size}</td> \
        {{if error}} \
            <td class="upload-error" colspan="2">Error:{{if error === \'maxFileSize\'}}File is too big{{else error === \'minFileSize\'}}File is too small{{else error === \'acceptFileTypes\'}}Filetype not allowed{{else error === \'maxNumberOfFiles\'}}Max number of files exceeded{{else}}${error}{{/if}} \
            </td> \
        {{else}} \
            <td> \
                <div class="progress"> \
                    <div class="bar" style="width:0%;"></div> \
                </div> \
            </td> \
            <td><button class="start">Start</button></td> \
        {{/if}} \
            <td> \
                <button class="cancel">Cancel</button> \
            </td> \
        </tr> \
    ';

    var _TEMPLATE_DOWNLOAD_TEMPLATE = Alpaca.Fields.MultiNodesField._TEMPLATE_DOWNLOAD_TEMPLATE = ' \
        <tr class="template-download{{if error}} ui-state-error{{/if}}" data-attachmentid="${attachmentId}"> \
        {{if error}} \
            <td></td> \
            <td class="preview"></td> \
            <td class="name">${name}</td> \
            <td class="type">${type}</td> \
            <td class="size">${size}</td> \
            <td class="upload-error" colspan="2"> \
                Error:{{if error === 1}}File exceeds upload_max_filesize (php.ini directive){{else error === 2}}File exceeds MAX_FILE_SIZE (HTML form directive){{else error === 3}}File was only partially uploaded{{else error === 4}}No File was uploaded{{else error === 5}}Missing a temporary folder{{else error === 6}}Failed to write file to disk{{else error === 7}}File upload stopped by extension{{else error === \'maxFileSize\'}}File is too big{{else error === \'minFileSize\'}}File is too small{{else error === \'acceptFileTypes\'}}Filetype not allowed{{else error === \'maxNumberOfFiles\'}}Max number of files exceeded{{else error === \'uploadedBytes\'}}Uploaded bytes exceed file size{{else error === \'emptyResult\'}}Empty file upload result{{else}}${error}{{/if}} \
            </td> \
        {{else}} \
            <td class="preview">\
                <img src="${thumbnail_url}"> \
            </td> \
            <td class="name"> \
                <a class="fileupload-attachment-download" href="${browse_url}">${name}</a> \
            </td> \
            <td class="type">${type}</td> \
            <td class="size">${size}</td> \
        {{/if}} \
            <td colspan="3"> \
                <button class="delete" data-type="${delete_type}" data-url="${delete_url}">Delete</button> \
            </td> \
        </tr> \
    ';

    Alpaca.registerTemplate('multiNodesUploadTemplate', _TEMPLATE_UPLOAD_TEMPLATE);
    Alpaca.registerTemplate('multiNodesDownloadTemplate', _TEMPLATE_DOWNLOAD_TEMPLATE);
    Alpaca.registerTemplate("controlFieldMultiNodes", _TEMPLATE_MULTINODES);

    Alpaca.registerFieldClass("multinodes", Alpaca.Fields.MultiNodesField);

})(jQuery);
