(function($) {
    Gitana.Console.Pages.NodeImport = Gitana.Console.Pages.AbstractImport.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/repositories/{repositoryId}/branches/{branchId}/nodes/{nodeId}/import", this.index);
        },

        targetObject: function() {
            return this.node();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Node(this));
        },

        setupBreadcrumb: function(el) {
            Gitana.Console.Breadcrumb.Node(this, null, [
                {
                    "text" : "Import"
                }
            ]);
        },

        setupToolbar: function() {
            var self = this;
            self.base();
            self.addButtons([
            ]);
        },

        containerType: function() {
            return 'node';
        },

        setupPage : function(el) {

            var page = {
                "title" : "Node Import",
                "description" : "Import an archive to node " + this.friendlyTitle(this.targetObject()) + ".",
                "listTitle" : "Archive List",
                "listIcon" : Gitana.Utils.Image.buildImageUri('objects', 'archive', 20),
                "subscription" : this.SUBSCRIPTION,
                "filter" : this.FILTER,
                "forms" :[
                    {
                        "id" : "import",
                        "title" : "Import Archive",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-import', 24),
                        "buttons" :[
                            {
                                "id" : "import-create",
                                "title" : "Import Archive",
                                "isLeft" : true
                            }
                        ]
                    }
                ]
            };

            this.page(Alpaca.mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.NodeImport);

})(jQuery);