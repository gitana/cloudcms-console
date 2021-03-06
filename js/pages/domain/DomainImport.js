(function($) {
    Gitana.Console.Pages.DomainImport = Gitana.Console.Pages.AbstractImport.extend(
        {
            setup: function() {
                this.get("/domains/{domainId}/import", this.index);
            },

            targetObject: function() {
                return this.domain();
            },

            setupMenu: function() {
                this.menu(Gitana.Console.Menu.Domain(this));
            },

            setupBreadcrumb: function(el) {
                var items = [
                    {
                        "text" : "Import"
                    }
                ];

                return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Domain(this), items));
            },

            setupToolbar: function() {
                var self = this;
                self.base();
                self.addButtons([
                ]);
            },

            containerType: function() {
                return 'domain';
            },

            setupPage : function(el) {

            var page = {
                "title" : "Domain Import",
                "description" : "Import an archive to domain " + this.friendlyTitle(this.targetObject()) + ".",
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

            this.page(_mergeObject(page, this.base(el)));
        }

        });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.DomainImport);

})(jQuery);