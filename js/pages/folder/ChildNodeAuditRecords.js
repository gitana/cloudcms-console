(function($) {
    Gitana.Console.Pages.ChildNodeAuditRecords = Gitana.Console.Pages.NodeAuditRecords.extend(
    {
        setup: function() {
            this.get("/repositories/{repositoryId}/branches/{branchId}/children/{nodeId}/auditrecords", this.index);
        },

        setupMenu: function() {
           this.menu(Gitana.Console.Menu.Child(this,"menu-node-audit-records"));
        },

        setupBreadcrumb: function() {
            Gitana.Console.Breadcrumb.Folder(this, null, [
                {
                    "text" : "Audit Records"
                }
            ]);
        }
    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.ChildNodeAuditRecords);

})(jQuery);