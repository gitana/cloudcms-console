(function($) {
    Gitana.Console.Pages.WarehouseImport = Gitana.Console.Pages.AbstractImport.extend(
        {
            setup: function() {
                this.get("/warehouses/{warehouseId}/import", this.index);
            },

            targetObject: function() {
                return this.warehouse();
            },

            setupMenu: function() {
                this.menu(Gitana.Console.Menu.Warehouse(this));
            },

            setupBreadcrumb: function(el) {
                var items = [
                    {
                        "text" : "Import"
                    }
                ];

                return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Warehouse(this), items));
            },

            containerType: function() {
                return 'warehouse';
            },

            setupToolbar: function() {
                var self = this;
                self.base();
                self.addButtons([
                ]);
            },

            setupPage : function(el) {

                var page = {
                    "title" : "Warehouse Import",
                    "description" : "Import an archive to warehouse " + this.friendlyTitle(this.targetObject()) + ".",
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

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.WarehouseImport);

})(jQuery);