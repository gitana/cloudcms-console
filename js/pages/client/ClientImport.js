(function($) {
    Gitana.Console.Pages.ClientImport = Gitana.Console.Pages.AbstractImport.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/clients/{clientId}/import", this.index);
        },

        targetObject: function() {
            return this.client();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Client(this));
        },

        setupBreadcrumb: function(el) {
            var items = [
                {
                    "text" : "Import"
                }
            ];

            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Client(this), items));
        },

        setupToolbar: function() {
            var self = this;
            self.base();
            self.addButtons([
            ]);
        },

        containerType: function() {
            return 'client';
        },

        setupPage : function(el) {

            var page = {
                "title" : "Client Import",
                "description" : "Import an archive to client " + this.friendlyTitle(this.targetObject()) + ".",
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

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.ClientImport);

})(jQuery);