(function($) {
    Gitana.Console.Pages.FolderAdd = Gitana.Console.Pages.ChildNodeAdd.extend(
        {
            setup: function() {
                this.get("/repositories/{repositoryId}/branches/{branchId}/folders/{nodeId}/add/folder", this.index);
            },

            targetObject: function() {
                return this.branch();
            },

            requiredAuthorities: function() {
                return [
                    {
                        "permissioned" : this.targetObject(),
                        "permissions" : ["create_subobjects"]
                    }
                ];
            },

            setupMenu: function() {
                this.menu(Gitana.Console.Menu.Folder(this));
            },

            setupBreadcrumb: function() {
                Gitana.Console.Breadcrumb.Folder(this, null, [
                    {
                        "text" : "New Folder"
                    }
                ]);
            },

            createNode: function(formVal) {
                var self = this;
                Gitana.Utils.UI.block("Creating Folder...");

                if (!formVal["_features"]) {
                    formVal["_features"] = {};
                }

                formVal["_features"]["f:container"] = {
                    "active": "true"
                };

                var node = self.node();
                if (node.isContainer()) {
                    self.node().createChild(formVal).then(function() {
                        var link = self.folderLink(this);
                        var callback = function() {
                            self.app().run("GET", link);
                        };
                        Gitana.Utils.UI.unblock(callback);
                    });
                }
            },

            setupPage: function(el) {

                var page = {
                    "title" : "New Folder",
                    "description" : "Create a new folder.",
                    "forms" :[
                        {
                            "id" : "form-pick",
                            "title" : "Select Folder Type and Form",
                            "icon" : Gitana.Utils.Image.buildImageUri('objects', 'definition', 24)
                        },
                        {
                            "id" : "node-add",
                            "title" : "Create A New Folder",
                            "icon" : Gitana.Utils.Image.buildImageUri('objects', 'folder-add', 24),
                            "buttons" :[
                                {
                                    "id" : "node-add-create",
                                    "title" : "Create Folder",
                                    "isLeft" : true
                                }
                            ]
                        }
                    ]
                };

                this.page(_mergeObject(page, this.pageHistory(el)));
            }

        });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.FolderAdd);

})(jQuery);