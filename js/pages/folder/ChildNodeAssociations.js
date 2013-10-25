(function($) {
    Gitana.Console.Pages.ChildNodeAssociations = Gitana.Console.Pages.NodeAssociations.extend(
    {
        LINK : function() {
            return this.folderLink;
        },

        setup: function() {
            this.get("/repositories/{repositoryId}/branches/{branchId}/children/{nodeId}/associations", this.index);
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Child(this,"menu-associations"));
        },

        setupBreadcrumb: function() {
            Gitana.Console.Breadcrumb.Folder(this, null, [
                {
                    "text" : "Associations"
                }
            ]);
        }
    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.ChildNodeAssociations);

})(jQuery);