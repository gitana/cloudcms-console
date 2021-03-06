(function($) {
    Gitana.Console.Pages.ProjectExport = Gitana.Console.Pages.AbstractExport.extend(
    {
        setup: function() {
            this.get("/projects/{projectId}/export", this.index);
        },

        targetObject: function() {
            return this.project();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Project(this));
        },

        setupBreadcrumb: function(el) {
            var items = [
                {
                    "text" : "Export"
                }
            ];

            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Project(this), items));
        },

        setupPage : function(el) {

            var page = {
                "title" : "Export Project",
                "description" : "Export project " + this.friendlyTitle(this.targetObject()) + " to an archive file.",
                "forms" :[{
                    "id" : "export",
                    "title" : "Export Project",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-export', 24),
                    "buttons" :[
                        {
                            "id" : "export-create",
                            "title" : "Export Project",
                            "isLeft" : true
                        }
                    ]
                }]
            };

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.ProjectExport);

})(jQuery);