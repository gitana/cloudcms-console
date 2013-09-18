(function($) {
    Gitana.Console.Pages.NodeFileUpload = Gitana.CMS.Pages.AbstractFormPageGadget.extend(
    {
        SUBSCRIPTION : "node-file-upload",

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/repositories/{repositoryId}/branches/{branchId}/upload", this.index);
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Branch(this, "menu-nodes"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Nodes(this), [
                {
                    "text" : "Upload File(s)"
                }
            ]));
        },

        setupFileUploadForm : function (el, callback) {
            var self = this;
            $('#upload-files',$(el)).alpaca({
                "schema" : {
                    "type" : "object",
                    "properties" : {
                        "file": {
                            "type": "string",
                            "format": "uri"
                        }
                    }
                },
                "options" : {
                    "fields": {
                        "file": {
                            "type": "multinodes",
                            "name": "fields",
                            "helper": "Select and upload file(s).",
                            "context": self,
                            "fileupload" : {
                                "attachmentId" : "default"
                            },
                            "nodeUrl" : function(nodeId) {
                                return "#" + self.link(self.branch()) + "/nodes/" + nodeId;
                            }
                        }
                    }
                },
                "postRender": function (renderedField) {
                    Gitana.Utils.UI.uniform(renderedField.getEl());
                    renderedField.getEl().css('border', 'none');
                    var el = renderedField.outerEl;
                    $(".fileupload-content",$(el)).css({
                        "min-width" : "600px",
                        "min-height" : "200px",
                        "display" : "block"
                    });
                    $(".files",$(el)).css({
                        "width" : "100%"
                    });

                    self.branch().listDefinitions('type', {
                        'limit': Gitana.Console.LIMIT_NONE
                    }).each(function() {
                        var type = this.getQName();
                        $('.upload-node-type',$(el)).append('<option value="' + type+ '">' + type+ '</option>');
                    }).then(function() {
                        $('.upload-node-type',$(el)).val("n:node");
                        $('.upload-node-type', $(el)).multiselect({
                            minWidth: '300',
                            multiple: false,
                            selectedList: 1,
                            header: "Select Node Type"
                        }).multiselectfilter();
                    }).then(function() {
                        callback();
                    });
                }
            });
        },


        setupForms : function (el, callback) {
            this.setupFileUploadForm(el, callback);
        },

        setupPage : function(el) {

            var page = {
                "title" : "Upload Files",
                "description" : "Upload files to branch " + this.friendlyTitle(this.branch()) + ".",
                "forms" :[{
                    "id" : "upload-files",
                    "title" : "Upload Manager",
                    "icon" : Gitana.Utils.Image.buildImageUri('special', 'upload', 24)
                }]
            };

            this.page(_mergeObject(page,this.base(el)));
        }
    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.NodeFileUpload);

})(jQuery);