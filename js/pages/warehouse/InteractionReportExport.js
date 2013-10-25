(function($) {
    Gitana.Console.Pages.InteractionReportExport = Gitana.Console.Pages.AbstractExport.extend(
    {
        setup: function() {
            this.get("/warehouses/{warehouseId}/reports/{interactionReportId}/export", this.index);
        },

        targetObject: function() {
            return this.interactionReport();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.InteractionReport(this));
        },

        setupBreadcrumb: function(el) {
            var items = [
                {
                    "text" : "Export"
                }
            ];

            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.InteractionReport(this), items));
        },

        setupPage : function(el) {

            var page = {
                "title" : "Export Interaction Report",
                "description" : "Export interaction report " + this.friendlyTitle(this.targetObject()) + " to an archive file.",
                "forms" :[{
                    "id" : "export",
                    "title" : "Export Interaction Report",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-export', 24),
                    "buttons" :[
                        {
                            "id" : "export-create",
                            "title" : "Export Interaction Report",
                            "isLeft" : true
                        }
                    ]
                }]
            };

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.InteractionReportExport);

})(jQuery);