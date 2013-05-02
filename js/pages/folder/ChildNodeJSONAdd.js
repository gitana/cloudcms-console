(function($) {
    Gitana.Console.Pages.ChildNodeJSONAdd = Gitana.Console.Pages.NodeJSONAdd.extend(
        {
            setup: function() {
                this.get("/repositories/{repositoryId}/branches/{branchId}/folders/{nodeId}/add/jsonnode", this.index);
                this.get("/repositories/{repositoryId}/branches/{branchId}/children/{nodeId}/add/jsonnode", this.index);
            },

            setupMenu: function() {
                if (this.node().isContainer()) {
                    this.menu(Gitana.Console.Menu.Folder(this));
                } else {
                    this.menu(Gitana.Console.Menu.Node(this));
                }
            },

            setupBreadcrumb: function() {
                Gitana.Console.Breadcrumb.Folder(this, null, [
                    {
                        "text" : "New JSON Node"
                    }
                ]);
            },

            createNode: function(formVal) {
                var self = this;

                var msg = "Creating Node...";

                Gitana.Utils.UI.block(msg);

                var node = self.node();
                if (node.isContainer()) {
                    self.node().createChild(formVal).then(function() {
                        var link = self.folderLink(this);
                        var callback = function() {
                            self.app().run("GET", link);
                        };
                        Gitana.Utils.UI.unblock(callback);
                    });
                } else {
                    node.listRelatives({
                        "type" : "a:child",
                        "direction" : "INCOMING"
                    }).count(function(count) {
                            if (count == 1) {
                                this.keepOne().then(function() {
                                    this.createChild(formVal).then(function() {
                                        var link = self.folderLink(this);
                                        var callback = function() {
                                            self.app().run("GET", link);
                                        };
                                        Gitana.Utils.UI.unblock(callback);
                                    });
                                });
                            }
                        })
                }
            },

            setupPage: function(el) {

                var page = {
                    "title" : "New JSON Node",
                    "description" : "Create a new json node.",
                    "forms" :[
                        {
                            "id" : "node-add",
                            "title" : "Create A New JSON Node",
                            "icon" : Gitana.Utils.Image.buildImageUri('objects', 'json-add', 24),
                            "buttons" :[
                                {
                                    "id" : "node-add-create",
                                    "title" : "Create JSON Node",
                                    "isLeft" : true
                                }
                            ]
                        }
                    ]
                };

                this.page(Alpaca.mergeObject(page, this.base(el)));

            }

        });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.ChildNodeJSONAdd);

})(jQuery);