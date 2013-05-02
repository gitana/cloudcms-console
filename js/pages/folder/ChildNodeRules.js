(function($) {
    Gitana.Console.Pages.ChildNodeRules = Gitana.Console.Pages.NodeRules.extend(
    {
        setup: function() {
            this.get("/repositories/{repositoryId}/branches/{branchId}/children/{nodeId}/rules", this.index);
        },

        LINK : function() {
            return this.folderLink;
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Child(this,"menu-node-rules"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.FolderRules(this));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.ChildNodeRules);

})(jQuery);