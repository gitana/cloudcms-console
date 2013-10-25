(function($) {
    Gitana.Console.Pages.PlatformExport = Gitana.Console.Pages.AbstractExport.extend(
    {
        setup: function() {
            this.get("/export", this.index);
        },

        targetObject: function() {
            return this.platform();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Platform(this));
        },

        setupBreadcrumb: function(el) {
            var items = [
                {
                    "text" : "Export"
                }
            ];

            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Platform(this), items));
        },

        setupPage : function(el) {

            var msgContext = {
                "tenantFriendlyTitle": this.friendlyTitle(this.tenantDetails())
            };

            var page = {
                "title" : _msg("Platform.Export.title", msgContext),
                "description" : _msg("Platform.Export.description", msgContext),
                "forms" :[{
                    "id" : "export",
                    "title" : "Export Platform",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-export', 24),
                    "buttons" :[
                        {
                            "id" : "export-create",
                            "title" : "Export Platform",
                            "isLeft" : true
                        }
                    ]
                }]
            };

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.PlatformExport);

})(jQuery);