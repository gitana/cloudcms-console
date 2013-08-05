(function($) {
    Gitana.Console.Pages.ChildNodeChangeType = Gitana.Console.Pages.NodeChangeType.extend(
        {
            setup: function() {
                this.get("/repositories/{repositoryId}/branches/{branchId}/children/{nodeId}/changetype", this.index);
            },

            setupMenu: function() {
                this.menu(Gitana.Console.Menu.Node(this));
            },

            setupBreadcrumb: function() {
                Gitana.Console.Breadcrumb.Folder(this, null, [
                    {
                        "text" : "Change Node Type"
                    }
                ]);
            }

        });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.ChildNodeChangeType);

})(jQuery);