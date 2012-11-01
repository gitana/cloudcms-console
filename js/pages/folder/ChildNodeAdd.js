(function($) {
    Gitana.Console.Pages.ChildNodeAdd = Gitana.Console.Pages.NodeAdd.extend(
        {
            constructor: function(id, ratchet) {
                this.base(id, ratchet);
            },

            schema: function() {

                return this.base();
            },

            options: function() {

                return this.base();
            },

            setup: function() {
                this.get("/repositories/{repositoryId}/branches/{branchId}/folders/{nodeId}/add/node", this.index);
                this.get("/repositories/{repositoryId}/branches/{branchId}/children/{nodeId}/add/node", this.index);
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
                        "text" : "New Node"
                    }
                ]);
            },

            createNode: function(formVal) {
                var self = this;
                Gitana.Utils.UI.block("Creating Child Node...");

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
                    "title" : "New Child Node",
                    "description" : "Create a new child node.",
                    "forms" :[
                        {
                            "id" : "form-pick",
                            "title" : "Select Node Type and Form",
                            "icon" : Gitana.Utils.Image.buildImageUri('objects', 'definition', 24)
                        },
                        {
                            "id" : "node-add",
                            "title" : "Create A New Child Node",
                            "icon" : Gitana.Utils.Image.buildImageUri('objects', 'node-add', 24),
                            "buttons" :[
                                {
                                    "id" : "node-add-create",
                                    "title" : "Create Node",
                                    "isLeft" : true
                                }
                            ]
                        }
                    ]
                };

                this.page(Alpaca.mergeObject(page, this.pageHistory(el)));

            }

        });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.ChildNodeAdd);

})(jQuery);