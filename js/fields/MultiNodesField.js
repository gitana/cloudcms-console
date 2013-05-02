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
        constructor: function(container, data, options, schema, view, connector) {
            this.base(container, data, options, schema, view, connector);
        },

        /**
         * @see Alpaca.Fields.TextField#setup
         */
        setup: function() {
            this.base();

            this.controlFieldTemplateDescriptor = this.view.getTemplateDescriptor("controlFieldMultiNodes");

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
            return this.wrapTemplate("multiNodesUploadTemplate");
        },

        /**
         *
         */
        getDownloadTemplate: function() {
            return this.wrapTemplate("multiNodesDownloadTemplate");
        },

        /**
         *
         */
        onFileUploadChange: function (e, data) {
            this.base(e, data);
            if ($('tr.template-upload', this.field).length > 0) {
                $('tr.template-upload:last', this.field).css('border-bottom', '1px solid #ccc');
            }
        },

        onFileUploadFail: function (e, data) {
            this.base(e, data);
            if ($('tr.template-upload', this.field).length <= 2) {
                $('tr.template-upload', this.field).css('border-bottom', 'none');
            }
        },

        onNodeCreated: function (node,index,context) {

        },

        /*
        renderPreview : function (previews) {
            var _this = this;
            var images = [];
            $.each(previews, function(index, thumbnail) {
                var pageNumber = parseInt(index) + 1;
                images.push({
                    'image' : thumbnail.url,
                    'title' : "Page " + pageNumber,
                    'description' : "<a href='" + thumbnail.url + "' target='_blank'>Download (" + thumbnail.size + ")</a>"
                });
            });
            var tempDiv = $('<div class="ui-widget-header" style="padding:5px;"></div>');
            $('.fileupload-slideshow', _this.getEl()).empty().append(tempDiv);
            tempDiv.galleria({
                data_source: images,
                width:600,
                height:400,
                margin: 'auto',
                lightbox: true,
                extend: function(options) {
                }
            });
            $('.galleria-container', tempDiv).css('margin', 'auto');
        },

        renderThumbnails : function (previews) {
            var _this = this;
            var images = []
            $.each(previews, function(index, thumbnail) {
                images.push({
                    'image' : thumbnail.url,
                    'title' : "Thumbnail " + thumbnail.id,
                    'description' : "<a href='" + thumbnail.url + "' target='_blank'>Download (" + thumbnail.size + ")</a>"
                });
            });
            var tempDiv = $('<div class="ui-widget-header" style="padding:5px;"></div>');
            $('.fileupload-slideshow', _this.getEl()).empty().append(tempDiv);
            tempDiv.galleria({
                data_source: images,
                width:600,
                height:400,
                margin: 'auto',
                lightbox: true,
                extend: function(options) {
                }
            });
            $('.galleria-container', tempDiv).css('margin', 'auto');
        },
        */

        /**
         *
         * @param e
         */
        onFileUploadStart: function (e) {
            Gitana.Utils.UI.block('Uploading File(s)...');
        },

        /**
         *
         * @param e
         */
        onFileUploadStop: function (e) {
           Gitana.Utils.UI.unblock();
        },

        /**
         *
         * @param e
         * @param data
         * @param fileUpload
         */
        onFileUploadDone: function (e, data, fileUpload) {

            fileUpload = this.fileUpload.data("blueimp-fileupload");

            var _this = this;
            var gitanaResults = data.result;
            data.result = [];
            var loadedExpectedResults = [];
            if (gitanaResults.total_rows > 0) {
                var branch = _this.context.branch ? _this.context.branch() : _this.context.getBranch();
                //console.log("Prepare download files");
                $.each(gitanaResults.rows, function(index, result) {
                    var nodeId = result['_doc'];
                    //console.log("Node : " + nodeId);
                    data.result.push({
                        "loaded" : false
                    });
                    branch.readNode(nodeId).then(function() {
                        var node = this;
                        // add a post processing callback
                        _this.onNodeCreated(node, index , _this.context);
                        var nodeUrl;
                        if (_this.nodeUrl) {
                            nodeUrl = _this.nodeUrl(node.getId());
                        } else {
                            nodeUrl = node.getProxiedUri();
                        }
                        var expectedResult = {
                            "title": node.getTitle(),
                            "size": 0,
                            "type": '',
                            "url": nodeUrl,
                            "delete_url":  node.getProxiedUri(),
                            "delete_type": "DELETE",
                            "attachmentId" : "default"
                        };

                        /*
                        var driver = node.getDriver();
                        var options = {
                            "url" : node.getProxiedUri(),
                            "type" : "DELETE"
                        }
                        Gitana.oAuth.prepareJQueryAjaxRequest(driver, options);
                        expectedResult['oauth_header'] = JSON.stringify(options.headers, null, ' ');
                        */
                        var thumbnails = [];
                        var previews = [];
                        var attachments = [];
                        node.attachment('default').then(function() {
                            var attachment = this;
                            attachments.push({
                                "id"  : attachment.getId(),
                                "type" : attachment.getContentType(),
                                "size" : Math.round(attachment.getLength() / 10.24) / 100 + ' KB',
                                "url"  : attachment.getDownloadUri(),
                                "name" : attachment.getFilename()
                            });
                        }).then(function() {
                            expectedResult.loaded = true;
                            expectedResult.thumbnails = thumbnails;
                            expectedResult.previews = previews;
                            expectedResult.attachments = attachments;
                            loadedExpectedResults.push(expectedResult);
                            if (loadedExpectedResults.length == gitanaResults.total_rows) {
                                if (data.context) {
                                    data.context.each(function (index) {
                                        var file = ($.isArray(loadedExpectedResults) &&
                                                loadedExpectedResults[index]) || {error: 'emptyResult'};
                                        if (file.error) {
                                            fileUpload._adjustMaxNumberOfFiles(1);
                                        }
                                        //.replaceAll(this)
                                        fileUpload._renderDownload([file])
                                                .css('display', 'none')
                                                .appendTo($('.files'))
                                                .fadeIn(function () {
                                            // Fix for IE7 and lower:
                                            $(this).show();
                                            $('.fileupload-preview',$(this)).click(function() {
                                                _this.renderPreview(loadedExpectedResults[index].previews);
                                            });
                                            $('.fileupload-thumbnails',$(this)).click(function() {
                                                _this.renderThumbnails(loadedExpectedResults[index].thumbnails);
                                            });
                                        });
                                    });
                                } else {
                                    fileUpload._renderDownload(loadedExpectedResults)
                                            .css('display', 'none')
                                            .appendTo($(this).find('.files'))
                                            .fadeIn(function () {
                                        // Fix for IE7 and lower:
                                        $(this).show();
                                    });
                                }
                            }
                        });
                    });
                });
                fileUpload._adjustMaxNumberOfFiles(gitanaResults.total_rows);
            }
        },

        /**
         * @see Alpaca.Fields.TextField#postRender
         */
        postRender: function() {
            this.base();
            // apply additional css
            if (this.fieldContainer) {
                this.fieldContainer.addClass("alpaca-controlfield-multinodes");
            }
        },

        /**
         * Returns service uri for attachment upload
         */
        computeAttachmentUploadUri : function () {
            var nodesUploadUri = "#";
            var context = this.context;
            if (context) {
                var repository = context.repository();
                var branch = context.branch();
                if (repository) {
                    nodesUploadUri = repository.getDriver().baseURL;
                    nodesUploadUri += "/repositories/" + repository.getId();
                }
                if (branch) {
                    nodesUploadUri += "/branches/" + branch.getId();
                }
                var format = Ratchet.Browser.ie ? ".text" : "";
                nodesUploadUri += "/nodes"+format;
            }
            return nodesUploadUri;
        },

        /**
         * Prepares final uri for attachment upload
         */
        prepareUploadFormFields : function (data) {
            var _this = this;
            var formElem = this.field.find('form');
            var actionUri = this.computeAttachmentUploadUri();
            formElem.find('.properties-field').remove();
            /* add hidden fields */
            $('input:hidden', formElem).remove();
            $.each(data.files, function(index, file) {
                var alpacaId = file['alpacaId'];
                //$('input.node-title-input:text:[data-alpacaid=' + alpacaId + ']', _this.field).each(function(index2) {
                $('input[data-alpacaid=' + alpacaId + ']', _this.field).each(function(index2) {
                    formElem.append('<input class="properties-field" type="hidden" name="property' + index + '_title" value="' + $(this).val() + '">');
                });
                //$('textarea.node-description-input:[data-alpacaid=' + alpacaId + ']', _this.field).each(function(index2) {
                $('textarea[data-alpacaid=' + alpacaId + ']', _this.field).each(function(index2) {
                    formElem.append('<input class="properties-field" type="hidden" name="property' + index + '_description" value="' + $(this).val() + '">');
                });

                if (_this.nodeType) {
                    formElem.append('<input class="properties-field" type="hidden" name="property' + index + '__type" value="' + _this.nodeType + '">');
                } else {
                    if($('.upload-node-type').val() != null) {
                        formElem.append('<input class="properties-field" type="hidden" name="property' + index + '__type" value="' + $('.upload-node-type').val() + '">');
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
        handleValidate: function() {
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
        getTitle: function() {
            return "Multiple Node Field";
        },

        /**
         * @see Alpaca.Fields.TextField#getDescription
         */
        getDescription: function() {
            return "Field for uploading multiple nodes.";
        },

        /**
         * @see Alpaca.Fields.TextField#getFieldType
         */
        getFieldType: function() {
            return "file";
        }
    });

    Alpaca.registerTemplate('multiNodesUploadTemplate', '<tr class="fileupload-item"><tr><td style="display:none;"><strong>Title</strong></td><td class="node-title" colspan="6"  style="display:none;"><input class="node-title-input" size="40" type="text" data-alpacaid="${alpacaId}" value="${name}"/></td></tr><tr><td style="display:none;"><strong>Description</strong></td><td class="node-description" colspan="6"  style="display:none;"><textarea class="node-description-input" rows="5" cols="40" data-alpacaid="${alpacaId}"></textarea></td></tr><tr class="template-upload{{if error}} ui-state-error{{/if}}"><td class="attachment-id"  style="display:none;"><span class="ui-icon ui-icon-copy" style="float:left;"/><input class="attachment-id-input" type="text" value="${attachmentId}" data-alpacaid="${alpacaId}"/></td><td class="preview"></td><td class="name">${name}</td><td class="type">${type}</td><td class="size">${sizef}</td>{{if error}}<td class="upload-error" colspan="2">Error:{{if error === \'maxFileSize\'}}File is too big{{else error === \'minFileSize\'}}File is too small{{else error === \'acceptFileTypes\'}}Filetype not allowed{{else error === \'maxNumberOfFiles\'}}Max number of files exceeded{{else}}${error}{{/if}}</td>{{else}}<td class="progress" style="display:none"><div></div></td><td class="start"><button  style="display:none">Start</button></td>{{/if}}<td class="cancel"><button>Cancel</button></td></tr></tr>');

    Alpaca.registerTemplate('multiNodesDownloadTemplate', '{{if loaded}}<tr class="template-download{{if error}} ui-state-error{{/if}}" data-attachmentid="${attachmentId}">{{if error}}<td></td><td class="attachment-id"><input class="attachment-id-input" type="text" value="${attachmentId}" disabled="disabled"/></td><td class="name">${name}</td><td class="size">${sizef}</td><td class="upload-error" colspan="2">Error:{{if error === 1}}File exceeds upload_max_filesize (php.ini directive){{else error === 2}}File exceeds MAX_FILE_SIZE (HTML form directive){{else error === 3}}File was only partially uploaded{{else error === 4}}No File was uploaded{{else error === 5}}Missing a temporary folder{{else error === 6}}Failed to write file to disk{{else error === 7}}File upload stopped by extension{{else error === \'maxFileSize\'}}File is too big{{else error === \'minFileSize\'}}File is too small{{else error === \'acceptFileTypes\'}}Filetype not allowed{{else error === \'maxNumberOfFiles\'}}Max number of files exceeded{{else error === \'uploadedBytes\'}}Uploaded bytes exceed file size{{else error === \'emptyResult\'}}Empty file upload result{{else}}${error}{{/if}}</td>{{else}}<td class="attachment-id"><a href="${url}">${title}</a></td><td class="preview" colspan="2" style="white-space:nowrap;">{{if thumbnails}}<span class="ui-icon ui-icon-image" style="float:left;"></span> {{each thumbnails}}<span style="padding:0 2px"><a href="${url}" class="thumbnail"  target="_blank">${id}</a></span>{{/each}}{{/if}}</td>{{if attachments}}<td class="name"  colspan="2" style="white-space:nowrap;"><span class="ui-icon ui-icon-copy" style="float:left;"/> {{each attachments}}<span style="padding:0 2px"><a href="${url}" class="attachment" title="${name} ${size} ${type}" target="_blank">${id}</a></span>{{/each}}</td>{{/if}}<td colspan="1"></td>{{/if}}<td><button class="delete" data-type="${delete_type}" data-url="${delete_url}">Delete</button></td></tr>{{/if}}');

    Alpaca.registerTemplate("controlFieldMultiNodes", '<div id="fileupload-${id}"><form method="POST" enctype="multipart/form-data"><div class="fileupload-buttonbar"><label class="fileinput-button"><span>Add files...</span><input type="file" name="files[]" multiple></label><select class="upload-node-type" style="float:right"></select></div></form><div class="fileupload-slideshow"></div><div class="fileupload-content dropzone" rel="tooltip-html" title="Drag-n-Drop your desktop file(s) to the above drop zone."><table class="files"></table><div class="fileupload-progressbar" style="visibility:hidden;display:none"></div></div></div>');

    Alpaca.registerFieldClass("multinodes", Alpaca.Fields.MultiNodesField);

})(jQuery);
