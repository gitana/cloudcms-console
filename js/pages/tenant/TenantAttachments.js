(function($) {
    Gitana.Console.Pages.TenantAttachments = Gitana.Console.Pages.AbstractObjectAttachments.extend(
    {
        SUBSCRIPTION : "tenant-attachments",

        FILTER : "node-attachments-list-filters",

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/registrars/{registrarId}/tenants/{tenantId}/attachments", this.index);
        },

        targetObject: function() {
            return this.tenant();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Tenant(this,"menu-tenant-attachments"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.TenantAttachments(this));
        },

        setupPage : function(el) {

            var page = {
                "title" : "Tenant Attachments",
                "description" : "Add, remove or view attachment(s) of tenant " + this.friendlyTitle(this.targetObject()) + ".",
                "listTitle" : "Attachment List",
                "listIcon" : Gitana.Utils.Image.buildImageUri('objects', 'attachment', 20),
                "subscription" : this.SUBSCRIPTION,
                "filter" : this.FILTER,
                "forms" :[{
                    "id" : "add-attachments",
                    "title" : "Attachment Manager",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'attachment', 24),
                    "buttons" :[
                    ]
                }]
            };

            this.page(Alpaca.mergeObject(page,this.base(el)));
        }
    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.TenantAttachments);

})(jQuery);