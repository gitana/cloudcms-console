(function($) {
    Gitana.Console.Pages.AuthenticationGrantImport = Gitana.Console.Pages.AbstractImport.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/authenticationgrants/{authenticationGrantId}/import", this.index);
        },

        targetObject: function() {
            return this.authenticationGrant();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.AuthenticationGrant(this));
        },

        setupBreadcrumb: function(el) {
            var items = [
                {
                    "text" : "Import"
                }
            ];

            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.AuthenticationGrant(this), items));
        },

        setupToolbar: function() {
            var self = this;
            self.base();
            self.addButtons([
            ]);
        },

        containerType: function() {
            return 'authenticationgrant';
        },

        setupPage : function(el) {

            var page = {
                "title" : "Authentication Grant Import",
                "description" : "Import an archive to authentication grant " + this.friendlyTitle(this.targetObject()) + ".",
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

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.AuthenticationGrantImport);

})(jQuery);