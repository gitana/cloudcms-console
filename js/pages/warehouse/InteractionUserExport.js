(function($) {
    Gitana.Console.Pages.InteractionUserExport = Gitana.Console.Pages.AbstractExport.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/warehouses/{warehouseId}/users/{interactionUserId}/export", this.index);
        },

        targetObject: function() {
            return this.interactionUser();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.InteractionUser(this));
        },

        setupBreadcrumb: function(el) {
            var items = [
                {
                    "text" : "Export"
                }
            ];

            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.InteractionUser(this), items));
        },

        setupPage : function(el) {

            var page = {
                "title" : "Export Interaction User",
                "description" : "Export interaction user " + this.friendlyTitle(this.targetObject()) + " to an archive file.",
                "forms" :[{
                    "id" : "export",
                    "title" : "Export Interaction User",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-export', 24),
                    "buttons" :[
                        {
                            "id" : "export-create",
                            "title" : "Export Interaction User",
                            "isLeft" : true
                        }
                    ]
                }]
            };

            this.page(Alpaca.mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.InteractionUserExport);

})(jQuery);