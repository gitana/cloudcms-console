(function($) {
    Gitana.Console.Pages.ChildNodeTextAdd = Gitana.Console.Pages.NodeTextAdd.extend(
    {
        setup: function() {
            this.get("/repositories/{repositoryId}/branches/{branchId}/folders/{nodeId}/add/textnode", this.index);
            this.get("/repositories/{repositoryId}/branches/{branchId}/children/{nodeId}/add/textnode", this.index);
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
                    "text" : "New Text Node"
                }
            ]);
        },

        createNode: function(formVal) {
            var self = this;

            var msg = self.mimeType() == "text/plain" ? "Creating Text Node..." : "Creating HTML Node...";

            Gitana.Utils.UI.block(msg);

            var nodeBody = formVal['body'];
            delete formVal['body'];

            var node = self.node();
            if (node.isContainer()) {
                self.node().createChild(formVal).then(function() {
                    var link = self.folderLink(this);
                    var callback = function() {
                        self.app().run("GET", link);
                    };
                    if (Alpaca.isValEmpty(nodeBody)) {
                        Gitana.Utils.UI.unblock(callback);
                    } else {
                        this.attach("default", self.mimeType(), nodeBody).then(function() {
                            Gitana.Utils.UI.unblock(callback);
                        });
                    }
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
                                    if (Alpaca.isValEmpty(nodeBody)) {
                                        Gitana.Utils.UI.unblock(callback);
                                    } else {
                                        this.attach("default", self.mimeType(), nodeBody).then(function() {
                                            Gitana.Utils.UI.unblock(callback);
                                        });
                                    }
                                });
                            });
                        }
                    })
            }
        },

        setupPage: function(el) {

            var page = {
                "title" : "New Text Node",
                "description" : "Create a new text node.",
                "forms" :[
                    {
                        "id" : "form-pick",
                        "title" : "Select Text Node Type and Form",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'definition', 24)
                    },
                    {
                        "id" : "node-add",
                        "title" : "Create A New Text Node",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'txt-node-add', 24),
                        "buttons" :[
                            {
                                "id" : "node-add-create",
                                "title" : "Create Text Node",
                                "isLeft" : true
                            }
                        ]
                    }
                ]
            };

            this.page(_mergeObject(page,this.base(el)));

        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.ChildNodeTextAdd);

})(jQuery);