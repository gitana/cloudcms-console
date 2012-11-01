(function($) {
    Gitana.Console.Pages.FolderAuditRecords = Gitana.Console.Pages.ChildNodeAuditRecords.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/repositories/{repositoryId}/branches/{branchId}/folders/{nodeId}/auditrecords", this.index);
        },

        setupMenu: function() {
           this.menu(Gitana.Console.Menu.Folder(this,"menu-node-audit-records"));
        },

        setupPage : function(el) {
            var page = {
                "title" : "Folder Audit Records",
                "description" : "Display list of audit records for current folder.",
                "listTitle" : "Audit Record List",
                "subscription" : this.SUBSCRIPTION,
                "filter" : this.FILTER,
                "dashlets" :[{
                    "id" : "audit-record-details",
                    "title" : "Audit Record Details",
                    "grid" : "grid_12"
                }]
            };

            this.page(Alpaca.mergeObject(page,this.base(el)));
        }
    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.FolderAuditRecords);

})(jQuery);