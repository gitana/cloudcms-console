(function($) {
    Gitana.Console.Pages.NodeTextAdd = Gitana.Console.Pages.NodeAdd.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        schema: function() {

            return Alpaca.mergeObject(this.base(), {
                "properties" : {
                    "body" : {
                        "title": "Node Body",
                        "type" : "string"
                    }
                }
            });
        },

        options: function() {
            var self = this;
            var options = Alpaca.mergeObject(this.base(), {
                "fields" : {
                    "body" : {
                        "type" : "textarea",
                        "helper" : "Enter node body.",
                        "cols" : 60,
                        "rows" : 8
                    }
                }
            });

            return options;
        },

        mimeType: function() {
            return "text/plain";
        },

        setup: function() {
            this.get("/repositories/{repositoryId}/add/textnode", this.index);
            this.get("/repositories/{repositoryId}/branches/{branchId}/add/textnode", this.index);
            this.get("/repositories/{repositoryId}/branches/{branchId}/nodes/{nodeId}/add/textnode", this.index);
         },

        setupBreadcrumb: function() {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Nodes(this), [
                {
                    "text" : "New Text Node"
                }
            ]));
        },

        createNode: function(formVal) {
            var self = this;
            Gitana.Utils.UI.block("Creating Text Node...");

            var nodeBody = formVal['body'];
            delete formVal['body'];

            self.branch().createNode(formVal).then(function() {
                var link = self.LINK().call(self, this);
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
        },

        setupPage: function(el) {

            var page = {
                "title" : "New Text Node",
                "description" : "Create a new text node of branch " + this.friendlyTitle(this.branch()) + ".",
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

            this.page(Alpaca.mergeObject(page,this.base(el)));

        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.NodeTextAdd);

})(jQuery);