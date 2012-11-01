(function($) {
    Gitana.Console.Pages.FolderGroupAuthorities = Gitana.Console.Pages.NodeGroupAuthorities.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        LINK : function() {
            return this.folderLink;
        },

        setup: function() {
            this.get("/repositories/{repositoryId}/branches/{branchId}/folders/{nodeId}/authorities/groups", this.index);
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Folder(this,'menu-node-security'));
        },

        setupBreadcrumb: function(el) {
            Gitana.Console.Breadcrumb.Folder(this, null, [
                {
                    "text" : "Group Security"
                }
            ]);
        }
    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.FolderGroupAuthorities);

})(jQuery);