(function($) {
    Gitana.Console.Pages.ChildNodeUserAuthorities = Gitana.Console.Pages.NodeUserAuthorities.extend(
    {
        LINK : function() {
            return this.folderLink;
        },

        setup: function() {
            this.get("/repositories/{repositoryId}/branches/{branchId}/children/{nodeId}/authorities/users", this.index);
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Child(this,'menu-node-security'));
        },

        setupBreadcrumb: function(el) {
            Gitana.Console.Breadcrumb.Folder(this, null, [
                {
                    "text" : "Child Security"
                }
            ]);
        }
    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.ChildNodeUserAuthorities);

})(jQuery);