(function($) {
    Gitana.Console.Pages.ClientExport = Gitana.Console.Pages.AbstractExport.extend(
    {
        setup: function() {
            this.get("/clients/{clientId}/export", this.index);
        },

        targetObject: function() {
            return this.client();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Client(this));
        },

        setupBreadcrumb: function(el) {
            var items = [
                {
                    "text" : "Export"
                }
            ];

            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Client(this), items));
        },

        setupPage : function(el) {

            var page = {
                "title" : "Export Client",
                "description" : "Export client " + this.friendlyTitle(this.targetObject()) + " to an archive file.",
                "forms" :[{
                    "id" : "export",
                    "title" : "Export Client",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-export', 24),
                    "buttons" :[
                        {
                            "id" : "export-create",
                            "title" : "Export Client",
                            "isLeft" : true
                        }
                    ]
                }]
            };

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.ClientExport);

})(jQuery);