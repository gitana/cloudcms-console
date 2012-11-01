(function($) {
    Gitana.Console.Pages.BillingProviderExport = Gitana.Console.Pages.AbstractExport.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/billingproviders/{billingProviderId}/export", this.index);
        },

        targetObject: function() {
            return this.billingProvider();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.BillingProvider(this));
        },

        setupBreadcrumb: function(el) {
            var items = [
                {
                    "text" : "Export"
                }
            ];

            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.BillingProvider(this), items));
        },

        setupPage : function(el) {

            var page = {
                "title" : "Export Billing Provider",
                "description" : "Export billing provider " + this.friendlyTitle(this.targetObject()) + " to an archive file.",
                "forms" :[{
                    "id" : "export",
                    "title" : "Export Billing Provider",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-export', 24),
                    "buttons" :[
                        {
                            "id" : "export-create",
                            "title" : "Export Billing Provider",
                            "isLeft" : true
                        }
                    ]
                }]
            };

            this.page(Alpaca.mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.BillingProviderExport);

})(jQuery);