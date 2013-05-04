(function($) {
    Gitana.Console.Pages.TrustedDomainMappingExport = Gitana.Console.Pages.AbstractExport.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/webhosts/{webhostId}/trustedomainmappings/{trustedDomainMappingId}/export", this.index);
        },

        targetObject: function() {
            return this.trustedDomainMapping();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.TrustedDomainMapping(this));
        },

        setupBreadcrumb: function(el) {
            var items = [
                {
                    "text" : "Export"
                }
            ];

            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.TrustedDomainMapping(this), items));
        },

        setupPage : function(el) {

            var page = {
                "title" : "Export Trusted Domain Mapping",
                "description" : "Export trusted domain mapping " + this.friendlyTitle(this.targetObject()) + " to an archive file.",
                "forms" :[{
                    "id" : "export",
                    "title" : "Export Trusted Domain Mapping",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-export', 24),
                    "buttons" :[
                        {
                            "id" : "export-create",
                            "title" : "Export Trusted Domain Mapping",
                            "isLeft" : true
                        }
                    ]
                }]
            };

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.TrustedDomainMappingExport);

})(jQuery);