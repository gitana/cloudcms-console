(function($) {
    Gitana.Console.Pages.TenantAttachmentsManage = Gitana.Console.Pages.AbstractObjectAttachmentsManage.extend(
    {
        SUBSCRIPTION : "tenant-attachments",

        FILTER : "tenant-attachments-list-filters",

        setup: function() {
            this.get("/registrars/{registrarId}/tenants/{tenantId}/manage/attachments", this.index);
        },

        targetObject: function() {
            return this.tenant();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Tenant(this,"menu-tenant-attachments"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.TenantAttachments(this), [
                {
                    "text" : "Manage"
                }
            ]));
        },

        setupPage : function(el) {

            var page = {
                "title" : "Manage Tenant Attachments",
                "description" : "Add, remove or view attachment(s) of tenant " + this.friendlyTitle(this.targetObject()) + "."
            };

            this.page(_mergeObject(page,this.base(el)));
        }
    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.TenantAttachmentsManage);

})(jQuery);