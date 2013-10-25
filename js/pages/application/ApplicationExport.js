(function($) {
    Gitana.Console.Pages.ApplicationExport = Gitana.Console.Pages.AbstractExport.extend(
    {
        setup: function() {
            this.get("/applications/{applicationId}/export", this.index);
        },

        targetObject: function() {
            return this.application();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Application(this));
        },

        setupBreadcrumb: function(el) {
            var items = [
                {
                    "text" : "Export"
                }
            ];

            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Application(this), items));
        },

        setupPage : function(el) {

            var page = {
                "title" : "Export Application",
                "description" : "Export application " + this.friendlyTitle(this.targetObject()) + " to an archive file.",
                "forms" :[{
                    "id" : "export",
                    "title" : "Export Application",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-export', 24),
                    "buttons" :[
                        {
                            "id" : "export-create",
                            "title" : "Export Application",
                            "isLeft" : true
                        }
                    ]
                }]
            };

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.ApplicationExport);

})(jQuery);