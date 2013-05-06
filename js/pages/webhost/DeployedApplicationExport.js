(function($) {
    Gitana.Console.Pages.DeployedApplicationExport = Gitana.Console.Pages.AbstractExport.extend(
    {
        setup: function() {
            this.get("/webhosts/{webhostId}/deployedapplications/{deployedApplicationId}/export", this.index);
        },

        targetObject: function() {
            return this.deployedApplication();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.DeployedApplication(this));
        },

        setupBreadcrumb: function(el) {
            var items = [
                {
                    "text" : "Export"
                }
            ];

            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.DeployedApplication(this), items));
        },

        setupPage : function(el) {

            var page = {
                "title" : "Export Deployed Application",
                "description" : "Export deployed application " + this.friendlyTitle(this.targetObject()) + " to an archive file.",
                "forms" :[{
                    "id" : "export",
                    "title" : "Export Deployed Application",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-export', 24),
                    "buttons" :[
                        {
                            "id" : "export-create",
                            "title" : "Export Deployed Application",
                            "isLeft" : true
                        }
                    ]
                }]
            };

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.DeployedApplicationExport);

})(jQuery);