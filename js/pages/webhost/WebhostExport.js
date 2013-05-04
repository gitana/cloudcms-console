(function($) {
    Gitana.Console.Pages.WebhostExport = Gitana.Console.Pages.AbstractExport.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/webhosts/{webhostId}/export", this.index);
        },

        targetObject: function() {
            return this.webhost();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Webhost(this));
        },

        setupBreadcrumb: function(el) {
            var items = [
                {
                    "text" : "Export"
                }
            ];

            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Webhost(this), items));
        },

        setupPage : function(el) {

            var page = {
                "title" : "Export Webhost",
                "description" : "Export webhost " + this.friendlyTitle(this.targetObject()) + " to an archive file.",
                "forms" :[{
                    "id" : "export",
                    "title" : "Export Webhost",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-export', 24),
                    "buttons" :[
                        {
                            "id" : "export-create",
                            "title" : "Export Webhost",
                            "isLeft" : true
                        }
                    ]
                }]
            };

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.WebhostExport);

})(jQuery);