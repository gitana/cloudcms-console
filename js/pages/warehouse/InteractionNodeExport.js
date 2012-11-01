(function($) {
    Gitana.Console.Pages.InteractionNodeExport = Gitana.Console.Pages.AbstractExport.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/warehouses/{warehouseId}/nodes/{interactionNodeId}/export", this.index);
        },

        targetObject: function() {
            return this.interactionNode();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.InteractionNode(this));
        },

        setupBreadcrumb: function(el) {
            var items = [
                {
                    "text" : "Export"
                }
            ];

            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.InteractionNode(this), items));
        },

        setupPage : function(el) {

            var page = {
                "title" : "Export Interaction Node",
                "description" : "Export interaction node " + this.friendlyTitle(this.targetObject()) + " to an archive file.",
                "forms" :[{
                    "id" : "export",
                    "title" : "Export Interaction Node",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-export', 24),
                    "buttons" :[
                        {
                            "id" : "export-create",
                            "title" : "Export Interaction Node",
                            "isLeft" : true
                        }
                    ]
                }]
            };

            this.page(Alpaca.mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.InteractionNodeExport);

})(jQuery);