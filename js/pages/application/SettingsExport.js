(function($) {
    Gitana.Console.Pages.SettingsExport = Gitana.Console.Pages.AbstractExport.extend(
    {
        setup: function() {
            this.get("/applications/{applicationId}/settings/{settingsId}/export", this.index);
        },

        targetObject: function() {
            return this.settings();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Settings(this));
        },

        setupBreadcrumb: function(el) {
            var items = [
                {
                    "text" : "Export"
                }
            ];

            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Settings(this), items));
        },

        setupPage : function(el) {

            var page = {
                "title" : "Export Settings",
                "description" : "Export settings " + this.friendlyTitle(this.targetObject()) + " to an archive file.",
                "forms" :[{
                    "id" : "export",
                    "title" : "Export Settings",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-export', 24),
                    "buttons" :[
                        {
                            "id" : "export-create",
                            "title" : "Export Settings",
                            "isLeft" : true
                        }
                    ]
                }]
            };

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.SettingsExport);

})(jQuery);