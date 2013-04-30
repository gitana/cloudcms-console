(function($) {
    Gitana.Console.Pages.FolderEdit = Gitana.Console.Pages.ChildNodeEdit.extend(
    {
        EDIT_URI: [
            "/repositories/{repositoryId}/branches/{branchId}/folders/{nodeId}/edit"
        ],

        EDIT_JSON_URI: [
            "/repositories/{repositoryId}/branches/{branchId}/folders/{nodeId}/edit/json"
        ],

        LINK : function() {
            return this.folderLink;
        },

        setupEditForm: function (el) {
            var self = this;
            var node = self.targetObject();
            var defaultData = self.populateObjectAll(node);
            $('#node-edit', $(el)).alpaca({
                "data": defaultData,
                "schema": self.schema(),
                "options": self.options(),
                "postRender": function(form) {
                    Gitana.Utils.UI.beautifyAlpacaForm(form, 'node-edit-save', true);
                    // Add Buttons
                    $('#node-edit-save', $(el)).click(function() {
                        var formVal = form.getValue();
                        if (form.isValid(true)) {

                            Gitana.Utils.UI.block("Updating folder...");

                            Alpaca.mergeObject(node,formVal);

                            var tags = formVal['tags'];

                            if (node.getFeature('f:taggable') == null) {
                                if (tags && tags.length > 0) {
                                    node.addFeature('f:taggable', {});
                                } else {
                                    delete formVal['tags'];
                                }
                            }

                            node.update().then(function() {
                                var updatedNode = this;
                                Gitana.Utils.UI.unblock(function() {
                                    self.app().run("GET", self.folderLink(updatedNode));
                                });

                            });
                        }
                    });
                }
            });
        },

        editButtonConfig: function() {
            return  {
                "id": "edit",
                "title": "Edit Folder",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'node-edit', 48),
                "url" : this.link(this.targetObject(), 'edit')
            };
        },

        editPageConfig: function() {
            return {
                "id" : "node-edit",
                "title" : "Edit Folder",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'node-edit', 24),
                "buttons" :[
                    {
                        "id" : "node-edit-save",
                        "title" : "Save Folder",
                        "isLeft" : true
                    }
                ]
            };
        },

        setupPage: function(el) {

            var page = {
                "title" : "Edit Folder",
                "description" : "Edit folder " + this.friendlyTitle(this.targetObject()) + ".",
                "forms" :[]
            };

            this.setupEditPage(el, page);

            this.page(Alpaca.mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.FolderEdit);

})(jQuery);