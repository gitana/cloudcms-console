(function($) {
    Gitana.Console.Pages.RepositoryImport = Gitana.Console.Pages.AbstractImport.extend(
        {
            setup: function() {
                this.get("/repositories/{repositoryId}/import", this.index);
            },

            targetObject: function() {
                return this.repository();
            },

            setupMenu: function() {
                this.menu(Gitana.Console.Menu.Repository(this));
            },

            setupBreadcrumb: function(el) {
                var items = [
                    {
                        "text" : "Import"
                    }
                ];

                return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Repository(this), items));
            },

            setupToolbar: function() {
                var self = this;
                self.base();
                self.addButtons([
                ]);
            },

            containerType: function() {
                return 'repository';
            },

            setupPage : function(el) {

                var page = {
                    "title" : "Repository Import",
                    "description" : "Import an archive to repository " + this.friendlyTitle(this.targetObject()) + ".",
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

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.RepositoryImport);

})(jQuery);