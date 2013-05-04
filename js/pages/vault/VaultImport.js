(function($) {
    Gitana.Console.Pages.VaultImport = Gitana.Console.Pages.AbstractImport.extend(
        {
            constructor: function(id, ratchet) {
                this.base(id, ratchet);
            },

            setup: function() {
                this.get("/vaults/{vaultId}/import", this.index);
            },

            targetObject: function() {
                return this.vault();
            },

            setupMenu: function() {
                this.menu(Gitana.Console.Menu.Vault(this));
            },

            setupBreadcrumb: function(el) {
                var items = [
                    {
                        "text" : "Import"
                    }
                ];

                return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Vault(this), items));
            },

            containerType: function() {
                return 'vault';
            },

            setupToolbar: function() {
                var self = this;
                self.base();
                self.addButtons([
                ]);
            },

            setupPage : function(el) {

                var page = {
                    "title" : "Vault Import",
                    "description" : "Import an archive to vault " + this.friendlyTitle(this.targetObject()) + ".",
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

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.VaultImport);

})(jQuery);