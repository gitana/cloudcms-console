(function($) {
    Gitana.Console.Pages.PlanExport = Gitana.Console.Pages.AbstractExport.extend(
    {
        setup: function() {
            this.get("/registrars/{registrarId}/plans/{planId}/export", this.index);
        },

        targetObject: function() {
            return this.plan();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Plan(this));
        },

        setupBreadcrumb: function(el) {
            var items = [
                {
                    "text" : "Export"
                }
            ];

            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Plan(this), items));
        },

        setupPage : function(el) {

            var page = {
                "title" : "Export Plan",
                "description" : "Export plan " + this.friendlyTitle(this.targetObject()) + " to an archive file.",
                "forms" :[{
                    "id" : "export",
                    "title" : "Export Plan",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-export', 24),
                    "buttons" :[
                        {
                            "id" : "export-create",
                            "title" : "Export Plan",
                            "isLeft" : true
                        }
                    ]
                }]
            };

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.PlanExport);

})(jQuery);