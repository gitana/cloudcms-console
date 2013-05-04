(function($) {
    Gitana.Console.Pages.AutoClientMappingExport = Gitana.Console.Pages.AbstractExport.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/webhosts/{webhostId}/autoclientmappings/{autoClientMappingId}/export", this.index);
        },

        targetObject: function() {
            return this.autoClientMapping();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.AutoClientMapping(this));
        },

        setupBreadcrumb: function(el) {
            var items = [
                {
                    "text" : "Export"
                }
            ];

            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.AutoClientMapping(this), items));
        },

        setupPage : function(el) {

            var page = {
                "title" : "Export Auto Client Mapping",
                "description" : "Export auto client mapping " + this.friendlyTitle(this.targetObject()) + " to an archive file.",
                "forms" :[{
                    "id" : "export",
                    "title" : "Export Auto Client Mapping",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-export', 24),
                    "buttons" :[
                        {
                            "id" : "export-create",
                            "title" : "Export Auto Client Mapping",
                            "isLeft" : true
                        }
                    ]
                }]
            };

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.AutoClientMappingExport);

})(jQuery);