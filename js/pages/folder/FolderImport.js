(function($) {
    Gitana.Console.Pages.FolderImport = Gitana.Console.Pages.AbstractImport.extend(
        {
            setup: function() {
                this.get("/repositories/{repositoryId}/branches/{branchId}/folders/{nodeId}/import", this.index);
            },

            targetObject: function() {
                return this.node();
            },

            setupMenu: function() {
                this.menu(Gitana.Console.Menu.Folder(this));
            },

            setupBreadcrumb: function(el) {
                Gitana.Console.Breadcrumb.Folder(this, null, [
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
                    "title" : "Folder Import",
                    "description" : "Import an archive to folder " + this.friendlyTitle(this.targetObject()) + ".",
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

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.FolderImport);

})(jQuery);