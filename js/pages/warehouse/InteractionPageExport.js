(function($) {
    Gitana.Console.Pages.InteractionPageExport = Gitana.Console.Pages.AbstractExport.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/warehouses/{warehouseId}/pages/{interactionPageId}/export", this.index);
        },

        targetObject: function() {
            return this.interactionPage();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.InteractionPage(this));
        },

        setupBreadcrumb: function(el) {
            var items = [
                {
                    "text" : "Export"
                }
            ];

            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.InteractionPage(this), items));
        },

        setupPage : function(el) {

            var page = {
                "title" : "Export Interaction Page",
                "description" : "Export interaction page " + this.friendlyTitle(this.targetObject()) + " to an archive file.",
                "forms" :[{
                    "id" : "export",
                    "title" : "Export Interaction Page",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-export', 24),
                    "buttons" :[
                        {
                            "id" : "export-create",
                            "title" : "Export Interaction Page",
                            "isLeft" : true
                        }
                    ]
                }]
            };

            this.page(Alpaca.mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.InteractionPageExport);

})(jQuery);