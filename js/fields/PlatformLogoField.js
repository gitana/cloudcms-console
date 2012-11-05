(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.PlatformLogoField = Alpaca.Fields.AvatarField.extend(
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
            var platform = this.options.platform;
            this.options.context = platform;
            this.options.uploadUri = platform.getDriver().baseURL + "/" + platform.getUri() + "/tenant/attachments/avatar";
            this.base();
            this.controlFieldTemplate = this.view.getTemplate("controlFieldPlatformLogo");
        },

        /**
         * Renders all attachments of the node
         */
        renderAttachments : function () {
            var _this = this;
            if (this.context && this.context.listTenantAttachments) {
                $('tr.template-download', this.field).remove();
                var thumbnails = [];
                var attachments = [];
                var pdfPreview = [];

                var nodeObj = this.context;
                var thumbnailKeys = [];

                if (nodeObj.getFeature && nodeObj.getFeature('f:thumbnailable')) {
                    $.each(nodeObj.getFeature('f:thumbnailable'), function(key, val) {
                        thumbnailKeys.push(key);
                    })
                }

                var isPreviewAttachment = function(attachmentId) {
                    var matchedKey = false;

                    if (nodeObj.getFeature && nodeObj.getFeature('f:previewable') && nodeObj.getFeature('f:previewable')['previews']) {
                        $.each(nodeObj.getFeature('f:previewable')['previews'], function(key, val) {
                            if (Alpaca.startsWith(attachmentId, val['prefix'])) {
                                matchedKey = true;
                                return;
                            }
                        })
                    }

                   return  matchedKey;
                };

                this.context.listTenantAttachments().each(function(key, attachment, index) {
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
                    var attachmentUrl = _this.context.getDriver().baseURL + _this.context.getUri() + "/tenant/attachments/" + result.attachmentId + "?a=true";
                    var expectedResult = {
                        "name": result.filename,
                        "size": Math.round(result.length / 10.24) / 100 + ' KB',
                        "type": result.contentType,
                        "url": _this.getAuthorizedUrl(attachmentUrl),
                        "thumbnail_url":_this.getAuthorizedUrl(attachmentUrl + "?timestamp=" + new Date().getTime()),
                        "delete_url":attachmentUrl,
                        "delete_type":"DELETE",
                        "attachmentId" : result.attachmentId
                    };
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
         */
        getUploadTemplate: function() {
            return this.view.getTemplate("templatePlatformLogoUpload");
        },

        /**
         *
         */
        getDownloadTemplate: function() {
            return this.view.getTemplate("templatePlatformLogoDownload");
        }

    });

    Alpaca.registerTemplate('templatePlatformLogoUpload', '<tr class="template-upload{{if error}} ui-state-error{{/if}}"><td class="attachment-id" style="display:none;"><input class="attachment-id-input" type="text" value="${attachmentId}" data-alpacaid="${alpacaId}"/></td><td class="preview"></td><td class="name">${name}</td><td class="type">${type}</td><td class="size">${sizef}</td>{{if error}}<td class="upload-error" colspan="2">Error:{{if error === \'maxFileSize\'}}File is too big{{else error === \'minFileSize\'}}File is too small{{else error === \'acceptFileTypes\'}}Filetype not allowed{{else error === \'maxNumberOfFiles\'}}Max number of files exceeded{{else}}${error}{{/if}}</td>{{else}}<td class="progress" style="display:none;"><div></div></td><td class="start" style="display:none;"><button>Start</button></td>{{/if}}<td class="cancel"><button>Cancel</button></td></tr>');

    Alpaca.registerTemplate('templatePlatformLogoDownload', '<tr class="template-download{{if error}} ui-state-error{{/if}}" data-attachmentid="${attachmentId}">{{if error}}<td></td><td class="attachment-id"><span class="fileupload-attachment-id">${attachmentId}</span></td><td class="name">${name}</td><td class="size">${sizef}</td><td class="upload-error" colspan="2">Error:{{if error === 1}}File exceeds upload_max_filesize (php.ini directive){{else error === 2}}File exceeds MAX_FILE_SIZE (HTML form directive){{else error === 3}}File was only partially uploaded{{else error === 4}}No File was uploaded{{else error === 5}}Missing a temporary folder{{else error === 6}}Failed to write file to disk{{else error === 7}}File upload stopped by extension{{else error === \'maxFileSize\'}}File is too big{{else error === \'minFileSize\'}}File is too small{{else error === \'acceptFileTypes\'}}Filetype not allowed{{else error === \'maxNumberOfFiles\'}}Max number of files exceeded{{else error === \'uploadedBytes\'}}Uploaded bytes exceed file size{{else error === \'emptyResult\'}}Empty file upload result{{else}}${error}{{/if}}</td>{{else}}<td class="attachment-id"><span class="fileupload-attachment-id" style="display:none;">${attachmentId}</span><span>${name}</span></td><td class="name"><a class="fileupload-attachment-download" href="${url}"><img src="${thumbnail_url}" class="avatar-photo"/></a></td><td class="type">${type}</td><td class="size">${size}</td><td></td>{{/if}}<td class="delete"><button data-type="${delete_type}" data-url="${delete_url}">Delete</button></td></tr>');

    Alpaca.registerTemplate("controlFieldPlatformLogo", '<div id="fileupload-${id}"><form method="POST" enctype="multipart/form-data"><div class="fileupload-buttonbar"><label class="fileinput-button"><span>Add logo...</span><input type="file" name="{{if options.name}}${options.name}{{else}}files[]{{/if}}" multiple></label><button type="submit" class="start">Start upload</button><button type="reset" class="cancel" style="display:none">Cancel upload</button><button type="button" class="delete" style="display:none">Delete files</button><button type="button" class="fileupload-thumbnails" style="display:none;">Thumbnails</button><button type="button" class="fileupload-preview" style="display:none;">Preview</button></div></form><div class="fileupload-slideshow"></div><div class="fileupload-content dropzone" rel="tooltip-html" title="Drag-n-Drop your desktop file to the above drop zone."><table class="files"></table><div class="fileupload-progressbar"></div></div></div>');

    Alpaca.registerFieldClass("platform-logo", Alpaca.Fields.PlatformLogoField);

})(jQuery);
