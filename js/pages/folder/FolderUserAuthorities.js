(function($) {
    Gitana.Console.Pages.FolderUserAuthorities = Gitana.Console.Pages.NodeUserAuthorities.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        LINK : function() {
            return this.folderLink;
        },

        setup: function() {
            this.get("/repositories/{repositoryId}/branches/{branchId}/folders/{nodeId}/authorities/users", this.index);
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Folder(this,'menu-node-security'));
        },

        setupBreadcrumb: function(el) {
            Gitana.Console.Breadcrumb.Folder(this, null, [
                {
                    "text" : "User Security"
                }
            ]);
        }
    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.FolderUserAuthorities);

})(jQuery);