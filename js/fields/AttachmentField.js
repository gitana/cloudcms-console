(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.AttachmentField = Alpaca.Fields.TextField.extend(
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

            // wraps an existing template descriptor into a method that looks like fn(model)
            // this is compatible with the requirements of fileinput
            // config looks like
            //    {
            //       "files": [],
            //       "formatFileSize": fn,
            //       "options": {}
            //    }
            //
            var self = this;
            this.wrapTemplate = function(templateId)
            {
                return function(config) {

                    var files = config.files;
                    var formatFileSize = config.formatFileSize;
                    var options = config.options;

                    var rows = [];
                    for (var i = 0; i < files.length; i++)
                    {
                        var model = Alpaca.cloneObject(files[i]);
                        model.size = formatFileSize(model.size);

                        var row = Alpaca.tmpl(self.view, self.view.getTemplateDescriptor(templateId), model);

                        rows.push(row[0]);
                    }

                    return $(rows);
                };
            };
        },

        /**
         * @see Alpaca.Fields.TextField#setup
         */
        setup: function() {
            this.base();

            this.controlFieldTemplateDescriptor = this.view.getTemplateDescriptor("controlFieldAttachment");

            if (!this.options) {
                this.options = {};
            }
            if (Ratchet.isUndefined(this.options.multiple))
            {
                this.options.multiple = true;
            }
            if (Ratchet.isUndefined(this.options.attachmentIdAsFilename))
            {
                this.options.attachmentIdAsFilename = false;
            }
            if (Ratchet.isUndefined(this.options.filterPreviews))
            {
                this.options.filterPreviews = false;
            }
            if (Ratchet.isUndefined(this.options.uploadSingleAttachmentById))
            {
                this.options.uploadSingleAttachmentById = true;
            }

            if (this.options && this.options.context) {
                this.context = this.options.context;
                if (this.context.platform && this.context.platform()) {
                    _mergeObject(this.options, {
                        "fileupload" : {
                            "driver" : this.context.platform().getDriver()
                        }
                    });
                } else if (this.context.getDriver && this.context.getDriver()) {
                    _mergeObject(this.options, {
                        "fileupload" : {
                            "driver" : this.context.getDriver()
                        }
                    });
                }
            }
        },

        getAuthorizedUrl: function(url) {
            /*
            if (this.context && this.context.getDriver && this.context.getDriver()) {
                return url;
            } else {
                return url;
            }
            */
            return url;
        },

        /**
         *
         */
        getUploadTemplate: function() {
            return this.wrapTemplate("templateUpload");
        },

        /**
         *
         */
        getDownloadTemplate: function() {
            return this.wrapTemplate("templateDownload");
        },

        /**
         * @see Alpaca.Field#getValue
         */
        getValue: function() {
            return $('input:file', this.field).val();
        },

        /**
         * @see Alpaca.Fields.TextField#setValue
         */
        setValue: function(value) {
            // be sure to call into base method
            // We won't be able to actually set the value for file input field so we use the mask input
            var tmp = this.field;
            this.field = $('.alpaca-filefield-control', this.fieldContainer);
            this.base(value);
            // switch it back to actual file input
            this.field = tmp;
        },

        /**
         *
         * @param e
         * @param data
         */
        onFileUploadChange: function (e, data) {
            var _this = this;
            var field = this.field;
            var outerEl = _this.getEl();
            $.each(data.files, function (index, file) {
                var alpacaId = Alpaca.generateId();
                file['alpacaId'] = alpacaId;
                var attachmentId = "attachment" + alpacaId.substring(6);
                if (index == 0 && $('.attachment-id-input').length == 0) {
                    attachmentId = "default";
                }
                attachmentId = (_this.fileUploadOptions.attachmentId) ? _this.fileUploadOptions.attachmentId : attachmentId;

                file['attachmentId'] = attachmentId;
                outerEl.delegate('.attachment-id-input[data-alpacaid="' + file['alpacaId'] + '"]', 'change', function() {
                    file['attachmentId'] = $(this).val();
                });
                outerEl.delegate('.attachment-id-input[data-alpacaid="' + file['alpacaId'] + '"]', 'blur', function() {
                    $('.attachment-id-input', outerEl).removeClass("ui-state-error alpaca-field-invalid").addClass("alpaca-field-valid");
                    _this.enableUploadButtons();
                    _this.renderValidationState();
                });
                outerEl.delegate('.attachment-id-input[data-alpacaid="' + file['alpacaId'] + '"]', 'click', function() {
                    if (_this.fileUploadOptions.attachmentId) {
                        $('.attachment-id-input', outerEl).attr('readonly', true);
                    }
                });
            });
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

            var files = [];

            var count = 0;
            $.each(data.result.rows, function(index, gitanaResult) {

                var fileUploadFile = data.files[index];

                files.push(self.computeFile(gitanaResult, fileUploadFile));
                count++;
            });

            data.result = {
                "files": files
            };

            this.renderAttachments();
        },

        /**
         * Produces a URI to the attachment.
         *
         * @param attachmentId
         * @return {String}
         */
         computeAttachmentUrl: function(attachmentId)
         {
             var uriPrefix = this.options.uriPrefix;
             if (!uriPrefix) {
                 uriPrefix = "";
             }

             var attachmentUrl = this.context.getDriver().baseURL + this.context.getUri() + uriPrefix + "/attachments/" + attachmentId + "?a=true";
             return this.getAuthorizedUrl(attachmentUrl);
         },

        /**
         * Produces a URI to the thumbnail version of this attachment.
         *
         * @param attachmentId
         * @param size
         * @return {String}
         */
         computeThumbnailUrl: function(attachmentId, size)
         {
             if (!size) {
                 size = 64;
             }

             var uriPrefix = this.options.uriPrefix;
             if (!uriPrefix) {
                 uriPrefix = "";
             }

             var thumbnailUrl = this.context.getDriver().baseURL + this.context.getUri() + "/preview/console-attachment-" + this.getId() + "?attachment=" + this.getId() + "&size=64&mimetype=image/jpeg";
             if (attachmentId.indexOf("_preview") == 0)
             {
                 thumbnailUrl = this.getDriver().baseURL + this.getUri();
             }
             thumbnailUrl = _previewMimetypeFallback(thumbnailUrl);

             return this.getAuthorizedUrl(thumbnailUrl);
         },

        /**
         * Produces a URI to the URI to use for deleting an attachment.
         *
         * @param attachmentId
         * @return {*}
         */
         computeDeleteUrl: function(attachmentId)
         {
             return this.computeAttachmentUrl(attachmentId);
         },

        /**
         * Converts a Gitana attachment into a file upload model.
         *
         * @param attachableAttachment
         * @return {Object}
         */
         computeAttachment: function(attachableAttachment)
         {
             return {
                 "id"  : attachableAttachment.getId(),

                 "name" : attachableAttachment.getFilename ? attachableAttachment.getFilename() : attachableAttachment.getId(),
                 "size" : attachableAttachment.getLength(),
                 "type" : attachableAttachment.getContentType(),
                 "url"  : this.computeAttachmentUrl(attachableAttachment.getId()),
                 "thumbnail_url": this.computeThumbnailUrl(attachableAttachment.getId()),
                 "delete_url": this.computeDeleteUrl(attachableAttachment.getId()),
                 "delete_type": "DELETE",

                 "attachmentId" : attachableAttachment.getId()
             };
         },

        /**
         * Converts a Gitana Result to a File.
         *
         * @param gitanaResult
         * @param fileUploadFile
         *
         * @return {Object}
         */
         computeFile: function(gitanaResult, fileUploadFile)
         {
             var attachmentId = gitanaResult.attachmentId;
             if (!attachmentId) {
                 attachmentId = fileUploadFile.attachmentId;
             }

             var file = {
                 "name": gitanaResult.filename,
                 "size": gitanaResult.length,
                 "type": gitanaResult.contentType,
                 "url": this.computeAttachmentUrl(attachmentId),
                 "thumbnail_url": this.computeThumbnailUrl(attachmentId),
                 "delete_url": this.computeDeleteUrl(attachmentId),
                 "delete_type": "DELETE",

                 "attachmentId": gitanaResult.attachmentId
             };

             if (this.options.attachmentIdAsFilename)
             {
                 file.filename = file.attachmentId;
             }

             return file;
         },

        /**
         * Returns the URI for handling attachment uploads.
         * This should be a bare /attachments handler (not specific to any attachment id).
         */
         computeAttachmentUploadUri : function () {

            if (this.options.uploadUri)
            {
                return this.options.uploadUri;
            }

            var uriPrefix = this.options.uriPrefix;
            if (!uriPrefix) {
                uriPrefix = "";
            }

            var format = Ratchet.Browser.ie ? ".text" : "";
            return this.context ? this.context.getDriver().baseURL + this.context.getUri() + uriPrefix + "/attachments" + format : "";
         },

        /**
         * Lists the attachments for the currently bound context.
         *
         * @param callback
         */
         listAttachments: function(callback)
         {
             var self = this;

             if (this.context && this.context.listAttachments) {

                 var attachments = [];
                 this.context.listAttachments().each(function() {
                     attachments.push(self.computeAttachment(this));
                 }).then(function() {

                     self.filterAttachments(attachments);

                     callback(attachments);
                 });

                 return;
             }

             callback([]);
         },

         filterAttachments: function(attachments)
         {
             if (attachments && attachments.length && attachments.length > 0)
             {
                 var i = 0;
                 do
                 {
                     var attachment = attachments[i];

                     var remove = false;
                     if (this.options.filterPreviews)
                     {
                         if (attachment.attachmentId.indexOf("_preview_") == 0)
                         {
                             remove = true;
                         }
                     }

                     if (remove)
                     {
                         attachments.splice(i, 1);
                     }
                     else
                     {
                         i++;
                     }
                 }
                 while (i < attachments.length);
             }
         },

        /**
         *
         * @param e
         * @param data
         */
        onFileUploadCustomBeforeSend: function (e, data) {
            this.prepareUploadFormFields(data);
        },

        /**
         *
         * @param e
         * @param data
         */
        onFileUploadAdd: function (e, data) {
        },

        /**
         *
         * @param e
         * @param data
         */
        onFileUploadFail: function (e, data) {
        },

        /**
         *
         * @param e
         */
        onFileUploadStart: function (e) {
            Gitana.Utils.UI.block('Uploading Attachment(s)...');
        },

        /**
         *
         * @param e
         */
        onFileUploadStop: function (e) {
            Gitana.Utils.UI.unblock();
        },

        /**
         * @see Alpaca.Fields.TextField#postRender
         */
        postRender: function(callback)
        {
            var _this = this;

            var field = this.field;
            var outerEl = _this.getEl();
            this.fileUploadOptions = {
                "autoUpload": false,
                //"autoUpload": true,
                "uploadTemplateId": null,
                "uploadTemplate" : this.getUploadTemplate(),
                "downloadTemplateId": null,
                "downloadTemplate" : this.getDownloadTemplate(),
                "dropZone": $(outerEl).find(".fileupload-content.dropzone")
            };
            // merge with user provided options
            if (this.options && this.options.fileupload) {
                _mergeObject(this.fileUploadOptions, this.options.fileupload);
            }

            // custom handler for file widget change event
            this.fileUploadOptions.change = function (e, data) {
                _this.onFileUploadChange(e, data);
            };

            // custom handler for file upload customerbeforesend event
            field.bind('fileuploadcustombeforesend', function (e, data) {
                _this.onFileUploadCustomBeforeSend(e,data);
            });

            // custom handler for file upload customerbeforesend event
            field.bind('fileuploadfail', function (e, data) {
                _this.onFileUploadFail(e, data);
            });

            // custom handler for file upload done event
            field.bind('fileuploaddone', function (e, data) {
                var fileUpload = $(this).data('fileupload');
                _this.onFileUploadDone(e, data, fileUpload);
            });

            // custom handler for file upload customerbeforesend event
            field.bind('fileuploadadd', function (e, data) {
                _this.onFileUploadAdd(e, data);
            });

            // custom handler for file upload customerbeforesend event
            field.bind('fileuploadstart', function (e) {
                _this.onFileUploadStart(e);
            });

            // custom handler for file upload customerbeforesend event
            field.bind('fileuploadstop', function (e) {
                _this.onFileUploadStop(e);
            });

            this.fileUpload = field.fileupload(this.fileUploadOptions);

            outerEl.delegate('.attachment-id-input', 'load', function() {
                _this.renderValidationState();
            });

            this.renderAttachments();

            this.base(function() {

                // apply additional css
                if (_this.fieldContainer) {
                    _this.fieldContainer.addClass("alpaca-controlfield-file");
                }

                callback();
            });

        },

        /**
         * Renders all attachments of the attachable
         */
        renderAttachments : function ()
        {
            if (this.options && this.options.renderAttachments)
            {
                this.options.renderAttachments();
            }
            else
            {
                this._renderAttachments();
            }
        },

        _renderAttachments: function()
        {
            var _this = this;

            this.listAttachments(function(attachments) {

                if (attachments && attachments.length > 0)
                {
                    $('tr.template-download', this.field).remove();

                    $.each(attachments,function(index,attachment){

                        _this.fileUpload.data().blueimpFileupload._renderDownload([attachment]).appendTo($(_this.fileUpload).find('.files')).fadeIn(function () {

                            // Fix for IE7 and lower:
                            $(this).show();
                        });
                    });
                }
            });
        },

        /**
         * Disables all upload buttons
         */
        disableUploadButtons: function () {
            this.field.find('.start').each(function () {
                $(this).button('disable');
            });
            this.field.find('.start > button').each(function () {
                $(this).button('disable');
            });
        },

        /**
         * Enables all upload buttons
         */
        enableUploadButtons: function () {
            //var actionUrl = this.field.find('form').attr('action');
            //if ((actionUrl && actionUrl != '') || this.context != null) {
                this.field.find('.start').each(function () {
                    $(this).button('enable');
                });
                this.field.find('.start > button').each(function () {
                    $(this).button('enable');
                });
            //}
        },

        /**
         * Sets attachable for file upload
         */
        setContext: function (context) {
            this.context = context;
        },

        /**
         * Prepares final uri for attachment upload
         */
        prepareUploadFormFields : function (data) {

            var self = this;

            var actionUri = this.computeAttachmentUploadUri();

            var formElem = this.field.find('form');

            if (data.files.length == 1) {

                var alpacaId = data.files[0]['alpacaId'];
                $('input.attachment-id-input:text:not(:disabled)[data-alpacaId="'+  alpacaId +'"]', this.field).each(function(index) {

                    var attachmentId = $(this).val();

                    if (self.options.supportMultiple)
                    {
                        var uriPrefix = (index == 0) ? '?' : "&";
                        actionUri += uriPrefix + "attachmentId_" + index + "=" + attachmentId;
                    }
                    else
                    {
                        if (self.options.uploadSingleAttachmentById)
                        {
                            actionUri += "/" + attachmentId;
                        }
                    }
                });
            }
            else
            {
                //TODO : seems to have issues with multiplars -- files are empty
                $('input.attachment-id-input:text:not(:disabled)', this.field).each(function(index) {

                    var attachmentId = $(this).val();

                    var uriPrefix = (index == 0) ? '?' : "&";
                    actionUri += uriPrefix + "attachmentId_" + index + "=" + attachmentId;
                });
            }

            formElem.attr('action', actionUri);
        },

        /**
         * Uploads all attachment
         */
        uploadAll: function() {
            this.field.find('.start').click();
        },

        /**
         * Uploads all attachment
         */
        getPayloadSize: function() {
            return $('.template-upload',this.field).length;
        },

        /**
         * @see Alpaca.ControlField#handleValidate
         */
        handleValidate: function() {
            var baseStatus = this.base();

            var valInfo = this.validation;

            var status = this._validateAttachmentId();
            valInfo["invalidAttachmentId"] = {
                "message": status ? "" : 'Invalid Attachment Id.',
                "status": status
            };

            status = this._validateDuplicateAttachmentId();
            valInfo["duplicateIAttachmentId"] = {
                "message": status ? "" : 'Duplicate Attachment Id.',
                "status": status
            };

            status = baseStatus && valInfo["invalidAttachmentId"]["status"] && valInfo["duplicateIAttachmentId"]["status"];

            return status;
        },

        /**
         * Validates attachment ID.
         *
         * @returns {Boolean} True if attachment ID is valid, false otherwise.
         */
        _validateAttachmentId: function() {
            var _this = this;
            var status = true;
            $('.attachment-id-input', this.getEl()).each(function (index) {
                var val = $(this).val();
                if (!val.match(/^[0-9a-zA-Z-]+$/)) {
                    $(this).addClass("ui-state-error alpaca-field-invalid").removeClass("alpaca-field-valid");
                    status = false;
                    //_this.field.fileupload('disable');
                    _this.disableUploadButtons();
                }
            });
            return status;
        },

        /**
         * Validates uniqueness of attachment ID.
         *
         * @returns {Boolean} True if the attachment ID is unique, false otherwise.
         */
        _validateDuplicateAttachmentId: function() {

            var status = true;
            var _this = this;
            $('.attachment-id-input:not(:disabled)', this.getEl()).each(function (index) {
                var val = $(this).val();
                $('.attachment-id-input:not(:disabled)', _this.getEl()).each(function (index2) {
                    if (index2 != index && val == $(this).val()) {
                        status = false;
                        $(this).addClass("ui-state-error alpaca-field-invalid").removeClass("alpaca-field-valid");
                        //_this.field.fileupload('disable');
                        _this.disableUploadButtons();
                    }
                });
            });

            return status;
        },

        /**
         * @see Alpaca.Fields.TextField#getTitle
         */
        getTitle: function() {
            return "Attachment Field";
        },

        /**
         * @see Alpaca.Fields.TextField#getDescription
         */
        getDescription: function() {
            return "Field for uploading attachments.";
        },

        /**
         * @see Alpaca.Fields.TextField#getFieldType
         */
        getFieldType: function() {
            return "file";
        }
    });

    Alpaca.registerTemplate('templateUpload', '<tr class="template-upload{{if error}} ui-state-error{{/if}}"><td class="attachment-id"><input class="attachment-id-input" type="text" value="${attachmentId}" data-alpacaid="${alpacaId}" autocomplete="off" placeholder="Attachment ID"/></td><td class="preview"></td><td class="name">${name}</td><td class="type">${type}</td><td class="size">${size}</td>{{if error}}<td class="upload-error" colspan="2">Error:{{if error === \'maxFileSize\'}}File is too big{{else error === \'minFileSize\'}}File is too small{{else error === \'acceptFileTypes\'}}Filetype not allowed{{else error === \'maxNumberOfFiles\'}}Max number of files exceeded{{else}}${error}{{/if}}</td>{{else}}<td><div class="progress"><div class="bar" style="width:0%;"></div></div></td><td><button class="start">Start</button></td>{{/if}}<td><button class="cancel">Cancel</button></td></tr>');

    //Alpaca.registerTemplate('templateDownload', '<tr class="template-download{{if error}} ui-state-error{{/if}}" data-attachmentid="${attachmentId}">{{if error}}<td></td><td class="attachment-id"><span class="fileupload-attachment-id">${attachmentId}</span></td><td class="preview"></td><td class="name">${name}</td><td class="size">${size}</td><td class="upload-error" colspan="2">Error:{{if error === 1}}File exceeds upload_max_filesize (php.ini directive){{else error === 2}}File exceeds MAX_FILE_SIZE (HTML form directive){{else error === 3}}File was only partially uploaded{{else error === 4}}No File was uploaded{{else error === 5}}Missing a temporary folder{{else error === 6}}Failed to write file to disk{{else error === 7}}File upload stopped by extension{{else error === \'maxFileSize\'}}File is too big{{else error === \'minFileSize\'}}File is too small{{else error === \'acceptFileTypes\'}}Filetype not allowed{{else error === \'maxNumberOfFiles\'}}Max number of files exceeded{{else error === \'uploadedBytes\'}}Uploaded bytes exceed file size{{else error === \'emptyResult\'}}Empty file upload result{{else}}${error}{{/if}}</td>{{else}}<td class="attachment-id"><span class="fileupload-attachment-id">${attachmentId}</span></td><td class="preview"></td><td class="name"><a class="fileupload-attachment-download" href="${url}">${name}</a></td><td class="type">${type}</td><td class="size">${size}</td>{{/if}}<td class="delete" colspan="3"><button data-type="${delete_type}" data-url="${delete_url}">Delete</button></td></tr>');
    Alpaca.registerTemplate('templateDownload', '<tr class="template-download{{if error}} ui-state-error{{/if}}" data-attachmentid="${attachmentId}">{{if error}}<td></td><td class="attachment-id"><span class="fileupload-attachment-id">${attachmentId}</span></td><td class="preview"></td><td class="name">${name}</td><td class="size">${size}</td><td class="upload-error" colspan="2">Error:{{if error === 1}}File exceeds upload_max_filesize (php.ini directive){{else error === 2}}File exceeds MAX_FILE_SIZE (HTML form directive){{else error === 3}}File was only partially uploaded{{else error === 4}}No File was uploaded{{else error === 5}}Missing a temporary folder{{else error === 6}}Failed to write file to disk{{else error === 7}}File upload stopped by extension{{else error === \'maxFileSize\'}}File is too big{{else error === \'minFileSize\'}}File is too small{{else error === \'acceptFileTypes\'}}Filetype not allowed{{else error === \'maxNumberOfFiles\'}}Max number of files exceeded{{else error === \'uploadedBytes\'}}Uploaded bytes exceed file size{{else error === \'emptyResult\'}}Empty file upload result{{else}}${error}{{/if}}</td>{{else}}<td class="attachment-id"><span class="fileupload-attachment-id">${attachmentId}</span></td><td class="preview"></td><td class="name"><a class="fileupload-attachment-download" href="${url}">${name}</a></td><td class="type">${type}</td><td class="size">${size}</td>{{/if}}<td colspan="3"><button class="delete" data-type="${delete_type}" data-url="${delete_url}">Delete</button></td></tr>');

    //Alpaca.registerTemplate("controlFieldAttachment", '<div id="fileupload-${id}"><form method="POST" enctype="multipart/form-data"><div class="fileupload-buttonbar"><label class="fileinput-button"><span>Add files...</span><input type="file" name="{{if options.name}}${options.name}{{else}}files[]{{/if}}" multiple></label><button type="submit" class="start">Start upload</button><button type="reset" class="cancel" style="display:none;">Cancel upload</button><button type="button" class="delete"  style="display:none;">Delete files</button><button type="button" class="fileupload-thumbnails" style="display:none;">Thumbnails</button><button type="button" class="fileupload-preview" style="display:none;">Preview</button></div></form><div class="fileupload-slideshow"></div><div class="fileupload-content dropzone" rel="tooltip-html" title="Drag-n-Drop your desktop file(s) to the above drop zone."><table class="files"></table><div class="fileupload-progressbar" style="display:none"></div></div></div>');
    //Alpaca.registerTemplate("controlFieldAttachment", '<div id="fileupload-${id}"><form method="POST" enctype="multipart/form-data"><div class="fileupload-buttonbar"><label class="fileinput-button"><span>Add files...</span><input type="file" name="{{if options.name}}${options.name}{{else}}files[]{{/if}}" multiple></label><button type="submit" class="start">Start upload</button><button type="reset" class="cancel" style="display:none;">Cancel upload</button><button type="button" class="delete"  style="display:none;">Delete files</button></div></form><div class="fileupload-slideshow"></div><div class="fileupload-content dropzone" rel="tooltip-html" title="Drag-n-Drop your desktop file(s) to the above drop zone."><table class="files"></table><div class="fileupload-progressbar" style="display:none"></div></div></div>');
    Alpaca.registerTemplate("controlFieldAttachment", '<div id="fileupload-${id}"><form method="POST" enctype="multipart/form-data"><div class="fileupload-buttonbar"><label class="fileinput-button"><span>Add files...</span><input type="file" name="{{if options.name}}${options.name}{{else}}files[]{{/if}}" multiple></label></div></form><div class="fileupload-slideshow"></div><div class="fileupload-content dropzone" rel="tooltip-html" title="Drag-n-Drop your desktop file(s) to the above drop zone."><table class="files"></table><div class="fileupload-progressbar" style="display:none"></div></div></div>');

    Alpaca.registerFieldClass("attachment", Alpaca.Fields.AttachmentField);

})(jQuery);
