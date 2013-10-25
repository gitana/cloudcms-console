(function($) {
    Gitana.Console.Pages.ChildNodeGroupAuthorities = Gitana.Console.Pages.NodeGroupAuthorities.extend(
    {
        LINK : function() {
            return this.folderLink;
        },

        setup: function() {
            this.get("/repositories/{repositoryId}/branches/{branchId}/children/{nodeId}/authorities/groups", this.index);
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Child(this, 'menu-node-security'));
        },

        setupBreadcrumb: function(el) {
            Gitana.Console.Breadcrumb.Folder(this, null, [
                {
                    "text" : "Group Security"
                }
            ]);
        }
    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.ChildNodeGroupAuthorities);

})(jQuery);