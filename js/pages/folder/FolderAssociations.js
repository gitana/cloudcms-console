(function($) {
    Gitana.Console.Pages.FolderNodeAssociations = Gitana.Console.Pages.NodeAssociations.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        LINK : function() {
            return this.folderLink;
        },

        setup: function() {
            this.get("/repositories/{repositoryId}/branches/{branchId}/folders/{nodeId}/associations", this.index);
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Folder(this,"menu-associations"));
        },

        setupBreadcrumb: function() {
            Gitana.Console.Breadcrumb.Folder(this, null, [
                {
                    "text" : "Associations"
                }
            ]);
        }
    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.FolderNodeAssociations);

})(jQuery);