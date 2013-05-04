(function($) {
    Gitana.Console.Pages.ArchiveAdd = Gitana.CMS.Pages.AbstractFormPageGadget.extend(
    {
        schema : function() {
            var schema = {
                "type" : "object",
                "properties": {
                    "file": {
                        "title": "Archive File",
                        "type": "string",
                        "format": "uri"
                    }
                }
            };
            return schema;
        },
        
        options : function () {
            var options = {
                "fields": {
                    "file": {
                        "type": "archive",
                        "name": "archivefile",
                        "helper": "Select a zip file.",
                        //TODO: Needs an API for upload URL
                        "uploadUri" : this.platform().getDriver().baseURL + this.vault().getUri() + "/archives",
                        "context" : this.vault()
                    }
                }
            };
            return options;
        },

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        targetObject: function() {
            return this.vault();
        },

        requiredAuthorities: function() {
            return [
                {
                    "permissioned" : this.targetObject(),
                    "permissions" : ["create_subobjects"]
                }
            ];
        },

        setup: function() {
            this.get("/vaults/{vaultId}/add/archive", this.index);
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Vault(this,"menu-vault-archives"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Archives(this), [
                {
                    "text" : "New Archive"
                }
            ]));
        },

        setupArchiveAddForm : function (el) {
            var self = this;
            $('#archive-add', $(el)).alpaca({
                "data": {},
                "schema": self.schema(),
                "options": self.options(),
                "postRender": function(form) {
                    Gitana.Utils.UI.beautifyAlpacaForm(form, 'archive-add-create', true);

                    var fileUploadControl = form.getControlByPath("file");
                    fileUploadControl.hideButtons();

                    // Add Buttons
                    $('#archive-add-create', $(el)).click(function() {
                        var formVal = form.getValue();
                        delete formVal['file'];
                        if (form.isValid(true)) {

                            Gitana.Utils.UI.block("Uploading Archive...");

                            var callback = function() {
                                self.app().run("GET", self.listLink('archives'));
                            };
                            if (fileUploadControl.getPayloadSize() > 0) {
                                fileUploadControl.enableUploadButtons();
                                fileUploadControl.uploadAll();

                                fileUploadControl.field.bind('fileuploaddone', function (e, data) {
                                    //TODO: Service return from archive uploading is not same as other uploading service.
                                    //TODO: That is why it displays error.
                                    Gitana.Utils.UI.unblock(callback);
                                });
                            } else {
                                Gitana.Utils.UI.unblock(callback);
                            }
                        }
                    });
                }
            });
        },

        setupForms : function (el) {
            this.setupArchiveAddForm(el);
        },

        setupPage : function(el) {

            var page = {
                "title" : "New Archive",
                "description" : "Upload a new archive to vault " + this.friendlyTitle(this.targetObject()) + ".",
                "forms" :[{
                    "id" : "archive-add",
                    "title" : "Upload A New Archive",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-add', 24),
                    "buttons" :[
                        {
                            "id" : "archive-add-create",
                            "title" : "Upload Archive",
                            "isLeft" : true
                        }
                    ]
                }]
            };

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.ArchiveAdd);

})(jQuery);