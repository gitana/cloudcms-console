(function($) {
    Gitana.Console.Pages.NodeHTMLAdd = Gitana.Console.Pages.NodeTextAdd.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        options: function() {
            var options = this.base();

            options['fields']['body']['type'] = 'elrte';

            return options;
        },

        mimeType: function() {
            return "text/html";
        },

        setup: function() {
            this.get("/repositories/{repositoryId}/add/htmlnode", this.index);
            this.get("/repositories/{repositoryId}/branches/{branchId}/add/htmlnode", this.index);
            this.get("/repositories/{repositoryId}/branches/{branchId}/nodes/{nodeId}/add/htmlnode", this.index);
        },

        setupBreadcrumb: function() {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Nodes(this), [
                {
                    "text" : "New HTML Node"
                }
            ]));
        },

        setupPage: function(el) {

            var page = {
                "title" : "New HTML Node",
                "description" : "Create a new html node of branch " + this.friendlyTitle(this.branch()) + ".",
                "forms" :[
                    {
                        "id" : "form-pick",
                        "title" : "Select HTML Node Type and Form",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'definition', 24)
                    },
                    {
                        "id" : "node-add",
                        "title" : "Create A New HTML Node",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'html-node-add', 24),
                        "buttons" :[
                            {
                                "id" : "node-add-create",
                                "title" : "Create HTML Node",
                                "isLeft" : true
                            }
                        ]
                    }
                ]
            };

            this.page(Alpaca.mergeObject(page,this.base(el)));

        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.NodeHTMLAdd);

})(jQuery);