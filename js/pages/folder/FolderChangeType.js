(function($) {
    Gitana.Console.Pages.FolderChangeType = Gitana.Console.Pages.ChildNodeChangeType.extend(
        {
            setup: function() {
                this.get("/repositories/{repositoryId}/branches/{branchId}/folders/{nodeId}/changetype", this.index);
            },

            setupMenu: function() {
                this.menu(Gitana.Console.Menu.Folder(this));
            },

            setupBreadcrumb: function() {
                Gitana.Console.Breadcrumb.Folder(this, null, [
                    {
                        "text" : "Change Folder Type"
                    }
                ]);
            }

        });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.FolderChangeType);

})(jQuery);