(function($) {
    Gitana.Console.Pages.ChildNodeHTMLAdd = Gitana.Console.Pages.ChildNodeTextAdd.extend(
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
            this.get("/repositories/{repositoryId}/branches/{branchId}/folders/{nodeId}/add/htmlnode", this.index);
            this.get("/repositories/{repositoryId}/branches/{branchId}/children/{nodeId}/add/htmlnode", this.index);
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
                    "text" : "New HTML Node"
                }
            ]);
        },

        setupPage: function(el) {

            var page = {
                "title" : "New HTML Node",
                "description" : "Create a new html node.",
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

            this.page(_mergeObject(page,this.base(el)));

        }
    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.ChildNodeHTMLAdd);

})(jQuery);