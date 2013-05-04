(function($) {
    Gitana.Console.Pages.DomainUserImport = Gitana.Console.Pages.AbstractImport.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/domains/{domainId}/users/{userId}/import", this.index);
        },

        targetObject: function() {
            return this.principalUser();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.DomainUser(this));
        },

        setupBreadcrumb: function(el) {
            var items = [
                {
                    "text" : "Import"
                }
            ];

            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.DomainUser(this), items));
        },

        setupToolbar: function() {
            var self = this;
            self.base();
            self.addButtons([
            ]);
        },

        setupPage : function(el) {

            var page = {
                "title" : "User Import",
                "description" : "Import an archive to user " + this.friendlyTitle(this.targetObject()) + ".",
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

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.DomainUserImport);

})(jQuery);