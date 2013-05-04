(function($) {
    Gitana.Console.Pages.InteractionApplicationExport = Gitana.Console.Pages.AbstractExport.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/warehouses/{warehouseId}/applications/{interactionApplicationId}/export", this.index);
        },

        targetObject: function() {
            return this.interactionApplication();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.InteractionApplication(this));
        },

        setupBreadcrumb: function(el) {
            var items = [
                {
                    "text" : "Export"
                }
            ];

            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.InteractionApplication(this), items));
        },

        setupPage : function(el) {

            var page = {
                "title" : "Export Interaction Application",
                "description" : "Export interaction application " + this.friendlyTitle(this.targetObject()) + " to an archive file.",
                "forms" :[{
                    "id" : "export",
                    "title" : "Export Interaction Application",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-export', 24),
                    "buttons" :[
                        {
                            "id" : "export-create",
                            "title" : "Export Interaction Application",
                            "isLeft" : true
                        }
                    ]
                }]
            };

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.InteractionApplicationExport);

})(jQuery);