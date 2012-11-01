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
        },

        /**
         * @see Alpaca.Fields.TextField#setup
         */
        setup: function() {
            this.base();
            this.controlFieldTemplate = this.view.getTemplate("controlFieldAttachment");
            if (this.options && this.options.context) {
                this.context = this.options.context;
                if (this.context.platform && this.context.platform()) {
                    Alpaca.mergeObject(this.options, {
                        "fileupload" : {
                            "driver" : this.context.platform().getDriver()
                        }
                    });
                } else if (this.context.getDriver && this.context.getDriver()) {
                    Alpaca.mergeObject(this.options, {
                        "fileupload" : {
                            "driver" : this.context.getDriver()
                        }
                    });
                }
            }
        },

        getAuthorizedUrl: function(url) {
            if (this.context && this.context.getDriver && this.context.getDriver()) {
                return url;
            } else {
                return url;
            }
        },

        /**
         *
         */
        getUploadTemplate: function() {
            return this.view.getTemplate("templateUpload");
        },

        /**
         *
         */
        getDownloadTemplate: function() {
            return this.view.getTemplate("templateDownload");
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
         *
         * @param e
         * @param data
         * @param fileUpload
         */
         onFileUploadDone: function (e, data, fileUpload) {

            var _this = this;
            var field = this.field;
            var gitanaResults = data.result;
            var expectedResults = [];
            if (gitanaResults.total_rows > 0) {
                $.each(gitanaResults.rows, function(index, result) {
                    var attachmentUrl = _this.context.getDriver().baseURL + _this.context.getUri() + "/attachments/" + result.attachmentId + "?a=true";
                    var expectedResult = {
                        "name": result.filename,
                        "size": result.length,
                        "type": result.contentType,
                        "url": _this.getAuthorizedUrl(attachmentUrl),
                        "thumbnail_url":_this.getAuthorizedUrl(attachmentUrl + "?timestamp=" + new Date().getTime()),
                        "delete_url":attachmentUrl,
                        "delete_type":"DELETE",
                        "attachmentId" : result.attachmentId
                    };
                    /*
                    if (_this.context && _this.context.getDriver && _this.context.getDriver()) {
                        var driver = _this.context.getDriver();
                        var options = {
                            "url" : attachmentUrl,
                            "type" : "DELETE"
                        }
                        Gitana.oAuth.prepareJQueryAjaxRequest(driver, options);
                        expectedResult['oauth_header'] = JSON.stringify(options.headers, null, ' ');
                    }
                    */
                    expectedResults.push(expectedResult);
                    // remove the old attachment display
                    $('tr.template-download[data-attachmentid="' + result.attachmentId + '"]', field).remove();
                });
                data.result = expectedResults;
                fileUpload._adjustMaxNumberOfFiles(gitanaResults.total_rows);

                if (this.options && this.options.renderAttachments) {
                    this.options.renderAttachments();
                }
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
        postRender: function() {
            var _this = this;
            var field = this.field;
            var outerEl = _this.getEl();
            this.fileUploadOptions = {
                "uploadTemplate" : this.getUploadTemplate(),
                "downloadTemplate" : this.getDownloadTemplate()
            };
            // merge with user provided options
            if (this.options && this.options.fileupload) {
                Alpaca.mergeObject(this.fileUploadOptions, this.options.fileupload);
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

            if (this.options && this.options.renderAttachments) {
                this.options.renderAttachments();
            } else {
                this.renderAttachments();
            }

            this.base();
            // apply additional css
            if (this.fieldContainer) {
                this.fieldContainer.addClass("alpaca-controlfield-file");
            }

        },

        renderThumbnails : function (thumbnails) {
            var _this = this;
            if (thumbnails.length > 0) {
                $('.fileupload-thumbnails', this.getEl()).button({
                    icons: {
                        primary:'ui-icon-image'
                    }
                }).click(function() {
                    var images = []
                    $.each(thumbnails, function(index, thumbnail) {
                        images.push({
                            'image' : thumbnail.url,
                            'title' : "Thumbnail " + thumbnail.id,
                            'description' : "<a href='"+thumbnail.url+"' target='_blank'>Download ("+thumbnail.size+")</a>"
                        });
                    });
                    var tempDiv = $('<div class="ui-widget-header" style="padding:5px;"></div>');
                    $('.fileupload-slideshow',_this.getEl()).empty().append(tempDiv);
                    tempDiv.galleria({
                        data_source: images,
                        width:600,
                        height:400,
                        margin: 'auto',
                        lightbox: true,
                        extend: function(options) {
                        }
                    });
                    $('.galleria-container',tempDiv).css('margin','auto');
                }).show();
            } else {
                $('.fileupload-thumbnails', this.getEl()).button('disable');
            }
        },

        renderPreview : function (previews) {
            var _this = this;
            if (previews.length > 0) {
                $('.fileupload-preview', this.getEl()).button({
                    icons: {
                        primary:'ui-icon-image'
                    }
                }).click(function() {
                    var images = []
                    $.each(previews, function(index, thumbnail) {
                        var pageNumber = parseInt(index)+1;
                        images.push({
                            'image' : thumbnail.url,
                            'title' : "Page " + pageNumber,
                            'description' : "<a href='"+thumbnail.url+"' target='_blank'>Download ("+thumbnail.size+")</a>"
                        });
                    });
                    var tempDiv = $('<div class="ui-widget-header" style="padding:5px;"></div>');
                    $('.fileupload-slideshow',_this.getEl()).empty().append(tempDiv);
                    tempDiv.galleria({
                        data_source: images,
                        width:600,
                        height:400,
                        margin: 'auto',
                        lightbox: true,
                        extend: function(options) {
                        }
                    });
                    $('.galleria-container',tempDiv).css('margin','auto');
                }).show();
            } else {
                $('.fileupload-preview', this.getEl()).button('disable');
            }
        },
        /**
         * Renders all attachments of the node
         */
        renderAttachments : function () {
            var _this = this;
            if (this.context && this.context.listAttachments) {
                $('tr.template-download', this.field).remove();
                var thumbnails = [];
                var attachments = [];
                var pdfPreview = [];

                var nodeObj = this.context;
                var thumbnailKeys = [];

                if (nodeObj && nodeObj.getFeature && nodeObj.getFeature('f:thumbnailable')) {
                    $.each(nodeObj.getFeature('f:thumbnailable'), function(key, val) {
                        thumbnailKeys.push(key);
                    })
                }

                var isPreviewAttachment = function(attachmentId) {
                    var matchedKey = false;

                    if (nodeObj && nodeObj.getFeature && nodeObj.getFeature('f:previewable') && nodeObj.getFeature('f:previewable')['previews']) {
                        $.each(nodeObj.getFeature('f:previewable')['previews'], function(key, val) {
                            if (Alpaca.startsWith(attachmentId, val['prefix'])) {
                                matchedKey = true;
                                return;
                            }
                        })
                    }

                   return  matchedKey;
                };

                this.context.listAttachments().each(function(key, attachment, index) {
                    if ($.inArray(attachment.getId(),thumbnailKeys) != -1) {
                        thumbnails.push({
                            "id"  : attachment.getId(),
                            "url" : _this.getAuthorizedUrl(attachment.getDownloadUri()+"?a=true"),
                            "size" : Math.round(attachment.getLength() / 10.24) / 100 + ' KB'
                        });
                    } else if (isPreviewAttachment(attachment.getId())) {
                        pdfPreview.push({
                            "id"  : attachment.getId(),
                            "url" : _this.getAuthorizedUrl(attachment.getDownloadUri()+"?a=true"),
                            "size" : Math.round(attachment.getLength() / 10.24) / 100 + ' KB'
                        });
                    } else {
                        var item = {
                            "id"  : attachment.getId(),
                            "attachmentId" : attachment.getId(),
                            "type" : attachment.getContentType(),
                            "size" : Math.round(attachment.getLength() / 10.24) / 100 + ' KB',
                            "url"  : _this.getAuthorizedUrl(attachment.getDownloadUri()+"?a=true"),
                            "thumbnail_url":_this.getAuthorizedUrl(attachment.getDownloadUri() + "?timestamp=" + new Date().getTime()),
                            "delete_url":attachment.getDownloadUri(),
                            "delete_type":"DELETE",
                            "name" : attachment.getFilename ? attachment.getFilename() : attachment.getId()
                        };
                        /*
                        if (_this.context && _this.context.getDriver && _this.context.getDriver()) {
                            var driver = _this.context.getDriver();
                            var options = {
                                "url" : attachment.getDownloadUri(),
                                "type" : "DELETE"
                            }
                            Gitana.oAuth.prepareJQueryAjaxRequest(driver, options);
                            item['oauth_header'] = JSON.stringify(options.headers, null, ' ');
                        }
                        */
                        attachments.push(item);
                    }
                }).then(function() {
                    $.each(attachments,function(index,attachment){
                        _this.fileUpload.data().fileupload._renderDownload([
                            attachment
                        ]).appendTo($(_this.fileUpload).find('.files')).fadeIn(function () {
                            // Fix for IE7 and lower:
                            $(this).show();
                            _this.renderThumbnails(thumbnails);
                            _this.renderPreview(pdfPreview);
                        });
                    });
                });
            }
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
         * Returns service uri for attachment upload
         */
        _getNodeUploadUri : function () {
            var format = $.browser.msie ? ".text" : "";
            var nodeUploadUri = this.context ? this.context.getDriver().baseURL + this.context.getUri() + "/attachments" + format : "";
            return nodeUploadUri;
        },

        /**
         * Sets node for file upload
         */
        setContext: function (context) {
            this.context = context;
        },

        /**
         * Prepares final uri for attachment upload
         */
        prepareUploadFormFields : function (data) {
            var formElem = this.field.find('form');
            if (this.options.uploadUri) {
                formElem.attr('action', this.options.uploadUri);
            } else {
                var actionUri = this._getNodeUploadUri();

                if (data.files.length == 1) {

                    var alpacaId = data.files[0]['alpacaId'];
                    $('input.attachment-id-input:text:not(:disabled)[data-alpacaId="'+  alpacaId +'"]', this.field).each(function(index) {
                        var uriPrefix = (index == 0) ? '?' : "&";
                        actionUri += uriPrefix + "attachmentId_" + index + "=" + $(this).val();
                    });
                } else {
                    //TODO : seems to have issues with multiplars -- files are empty
                    $('input.attachment-id-input:text:not(:disabled)', this.field).each(function(index) {
                        var uriPrefix = (index == 0) ? '?' : "&";
                        actionUri += uriPrefix + "attachmentId_" + index + "=" + $(this).val();
                    });
                }
                formElem.attr('action', actionUri);
            }
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

    Alpaca.registerTemplate('templateUpload', '<tr class="template-upload{{if error}} ui-state-error{{/if}}"><td class="attachment-id"><input class="attachment-id-input" type="text" value="${attachmentId}" data-alpacaid="${alpacaId}" autocomplete="off" placeholder="Attachment ID"/></td><td class="preview"></td><td class="name">${name}</td><td class="type">${type}</td><td class="size">${sizef}</td>{{if error}}<td class="upload-error" colspan="2">Error:{{if error === \'maxFileSize\'}}File is too big{{else error === \'minFileSize\'}}File is too small{{else error === \'acceptFileTypes\'}}Filetype not allowed{{else error === \'maxNumberOfFiles\'}}Max number of files exceeded{{else}}${error}{{/if}}</td>{{else}}<td class="progress" style="display:none;"><div></div></td><td class="start"><button style="display:none;">Start</button></td>{{/if}}<td class="cancel"><button>Cancel</button></td></tr>');

    Alpaca.registerTemplate('templateDownload', '<tr class="template-download{{if error}} ui-state-error{{/if}}" data-attachmentid="${attachmentId}">{{if error}}<td></td><td class="attachment-id"><span class="fileupload-attachment-id">${attachmentId}</span></td><td class="preview"></td><td class="name">${name}</td><td class="size">${sizef}</td><td class="upload-error" colspan="2">Error:{{if error === 1}}File exceeds upload_max_filesize (php.ini directive){{else error === 2}}File exceeds MAX_FILE_SIZE (HTML form directive){{else error === 3}}File was only partially uploaded{{else error === 4}}No File was uploaded{{else error === 5}}Missing a temporary folder{{else error === 6}}Failed to write file to disk{{else error === 7}}File upload stopped by extension{{else error === \'maxFileSize\'}}File is too big{{else error === \'minFileSize\'}}File is too small{{else error === \'acceptFileTypes\'}}Filetype not allowed{{else error === \'maxNumberOfFiles\'}}Max number of files exceeded{{else error === \'uploadedBytes\'}}Uploaded bytes exceed file size{{else error === \'emptyResult\'}}Empty file upload result{{else}}${error}{{/if}}</td>{{else}}<td class="attachment-id"><span class="fileupload-attachment-id">${attachmentId}</span></td><td class="preview"></td><td class="name"><a class="fileupload-attachment-download" href="${url}">${name}</a></td><td class="type">${type}</td><td class="size">${size}</td>{{/if}}<td class="delete" colspan="3"><button data-type="${delete_type}" data-url="${delete_url}">Delete</button></td></tr>');

    Alpaca.registerTemplate("controlFieldAttachment", '<div id="fileupload-${id}"><form method="POST" enctype="multipart/form-data"><div class="fileupload-buttonbar"><label class="fileinput-button"><span>Add files...</span><input type="file" name="{{if options.name}}${options.name}{{else}}files[]{{/if}}" multiple></label><button type="submit" class="start">Start upload</button><button type="reset" class="cancel" style="display:none;">Cancel upload</button><button type="button" class="delete"  style="display:none;">Delete files</button><button type="button" class="fileupload-thumbnails" style="display:none;">Thumbnails</button><button type="button" class="fileupload-preview" style="display:none;">Preview</button></div></form><div class="fileupload-slideshow"></div><div class="fileupload-content dropzone" rel="tooltip-html" title="Drag-n-Drop your desktop file(s) to the above drop zone."><table class="files"></table><div class="fileupload-progressbar" style="display:none"></div></div></div>');

    Alpaca.registerFieldClass("attachment", Alpaca.Fields.AttachmentField);

})(jQuery);
