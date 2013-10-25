(function($) {
    Gitana.Console.Pages.ChildNodeExport = Gitana.Console.Pages.NodeExport.extend(
    {
        LINK : function() {
            return this.folderLink;
        },

        setup: function() {
            this.get("/repositories/{repositoryId}/branches/{branchId}/children/{nodeId}/export", this.index);
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Child(this));
        },

        setupBreadcrumb: function(el) {
            Gitana.Console.Breadcrumb.Folder(this, null, [
                {
                    "text" : "Export"
                }
            ]);
        }
    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.ChildNodeExport);

})(jQuery);