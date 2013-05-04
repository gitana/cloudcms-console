(function($) {
    Gitana.Console.Pages.NodePreview = Gitana.Console.Pages.Node.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/repositories/{repositoryId}/branches/{branchId}/nodes/{nodeId}/preview", this.index);
            this.get("/repositories/{repositoryId}/branches/{branchId}/nodes/{nodeId}/preview/{previewSetId}", this.index);
        },

        setupBreadcrumb: function(el) {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Node(this), [
                {
                    "text" : "Preview"
                }
            ]));
        },

        setupToolbar: function() {
            this.clearToolbar();
        },

        setupNodePreview: function (el) {
            var self = this;
            var node = self.targetObject();

            var images = [];
            var thumbnailImages = [];
            var previewImages = [];

            var thumbnailKeys = [];

            if ( node.getFeature('f:thumbnailable')) {
                $.each(node.getFeature('f:thumbnailable'), function(key,val) {
                    thumbnailKeys.push(key);
                })
            }

            var previewSetId = el.tokens['previewSetId'] ? el.tokens['previewSetId'] : "";

            node.listAttachments().each(function(key, attachment, index) {
                var attachmentId = attachment.getId();
                if ($.inArray(attachmentId,thumbnailKeys) != -1) {
                    if (previewSetId == "" || previewSetId == "thumbnail") {
                        thumbnailImages.push({
                            'image' : attachment.getDownloadUri() + "?a=true",
                            'title' : "Thumbnail :: " + attachmentId,
                            'description' : "<a href='" + attachment.getDownloadUri() + "' target='_blank'>Download (" + Math.round(attachment.getLength() / 10.24) / 100 + ' KB' + ")</a>"
                        });
                    }
                } else {

                    var matchedTitle;

                    var matchedKey;

                    if (node.getFeature('f:previewable') && node.getFeature('f:previewable')['previews']) {
                        $.each(node.getFeature('f:previewable')['previews'], function(key, val) {
                            if (Alpaca.startsWith(attachmentId, val['prefix'])) {
                                matchedKey = key;
                                matchedTitle = key + " preview :: Page " + attachmentId.substring(val['prefix'].length)
                            }
                        })
                    }

                    if (matchedTitle) {
                        if (previewSetId == "" || previewSetId == matchedKey) {
                            previewImages.push({
                                'image' : attachment.getDownloadUri() + "?a=true",
                                'title' : matchedTitle,
                                'description' : "<a href='" + attachment.getDownloadUri() + "' target='_blank'>Download (" + Math.round(attachment.getLength() / 10.24) / 100 + ' KB' + ")</a>"
                            });
                        }
                    } else if (Alpaca.startsWith(attachment.getContentType(),'image/')) {
                        if (previewSetId == "" || previewSetId == "original") {
                            images.push({
                                'image' : attachment.getDownloadUri() + "?a=true",
                                'title' : "Original Attachment :: " + attachmentId,
                                'description' : "<a href='" + attachment.getDownloadUri() + "' target='_blank'>Download (" + Math.round(attachment.getLength() / 10.24) / 100 + ' KB' + ")</a>"
                            });
                        }
                    }
                }
            }).then(function() {

                images = $.merge(images,thumbnailImages);
                images = $.merge(images,previewImages);

                var isSelected = function(key1,key2) {
                    if (key1 && key2 && key1 == key2) {
                        return "selected='selected'";
                    } else {
                        return "";
                    }
                };

                var previewSetPicker = "<select class='preview-set-picker' style='float:right;margin:4px;'>";

                previewSetPicker += "<option value='' " + isSelected(previewSetId,"") + ">All</option>";
                previewSetPicker += "<option value='original' " + isSelected(previewSetId,"original") + ">Original</option>";
                previewSetPicker += "<option value='thumbnail' " + isSelected(previewSetId,"thumbnail") + ">Thumbnails</option>";

                if (node.getFeature('f:previewable') && node.getFeature('f:previewable')['previews']) {
                    $.each(node.getFeature('f:previewable') && node.getFeature('f:previewable')['previews'], function(key, val) {
                        previewSetPicker += "<option value='" + key + "' " + isSelected(previewSetId,key) + ">" + key + " preview" + "</option>";
                    })
                }

                previewSetPicker += "</select>";

                var tempDiv = $('<div class="block-border"><div class="block-header"><h1><img src="' + Gitana.Utils.Image.buildImageUri('special', 'preview', 24) + '"/>Preview</h1>' + previewSetPicker + '</div><div class="block-content"><div class="preview-div" style="margin:20px;min-height:1px;"></div></div></div>');

                $('#node-preview').empty().append(tempDiv);

                if (images.length > 0) {

                    $('.preview-div',tempDiv).galleria({
                        data_source: images,
                        width:600,
                        height:500,
                        margin: 'auto',
                        lightbox: true,
                        imageTimeout: 60000,
                        extend: function(options) {
                        }
                    });

                    $('.galleria-container', tempDiv).css('margin', 'auto');

                } else {

                    $('.preview-div',tempDiv).append('<h1>Nothing to preview</h1>');

                }

                $('.preview-set-picker').change(function() {

                    var val = $(this).val();

                    self.app().run("GET", self.LINK().call(self,node,'preview',val));

                });
            });
        },

        setupDashlets : function (el) {

            this.setupNodePreview(el);

        },

        setupPage : function(el) {

            var description = this.targetObject().isAssociation() ? "Preview of association " : "Preview of node ";

            var page = {
                "title" : "Preview Node",
                "description" : description + this.friendlyTitle(this.node()) + ".",
                "dashlets" :[{
                    "id" : "node-preview",
                    "grid" : "grid_12",
                    "subscription" : "node-overview"
                }]
            };

            this.page(_mergeObject(page, this.pageHistory(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.NodePreview);

})(jQuery);