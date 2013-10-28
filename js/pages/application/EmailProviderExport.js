(function($) {
    Gitana.Console.Pages.EmailProviderExport = Gitana.Console.Pages.AbstractExport.extend(
    {
        setup: function() {
            this.get("/applications/{applicationId}/emailproviders/{emailProviderId}/export", this.index);
        },

        targetObject: function() {
            return this.emailProvider();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.EmailProvider(this));
        },

        setupBreadcrumb: function(el) {
            var items = [
                {
                    "text" : "Export"
                }
            ];

            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.EmailProvider(this), items));
        },

        setupPage : function(el) {

            var page = {
                "title" : "Export EmailProvider",
                "description" : "Export EmailProvider " + this.friendlyTitle(this.targetObject()) + " to an archive file.",
                "forms" :[{
                    "id" : "export",
                    "title" : "Export EmailProvider",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-export', 24),
                    "buttons" :[
                        {
                            "id" : "export-create",
                            "title" : "Export EmailProvider",
                            "isLeft" : true
                        }
                    ]
                }]
            };

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.EmailProviderExport);

})(jQuery);