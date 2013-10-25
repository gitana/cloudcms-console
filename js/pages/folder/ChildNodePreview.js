(function($) {
    Gitana.Console.Pages.ChildNodePreview = Gitana.Console.Pages.NodePreview.extend(
    {
        LINK : function() {
            return this.folderLink;
        },

        setup: function() {
            this.get("/repositories/{repositoryId}/branches/{branchId}/children/{nodeId}/preview", this.index);
            this.get("/repositories/{repositoryId}/branches/{branchId}/children/{nodeId}/preview/{previewSetId}", this.index);
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Child(this));
        },

        setupBreadcrumb: function(el) {
            Gitana.Console.Breadcrumb.Folder(this, null, [
                {
                    "text" : "Preview"
                }
            ]);
        }
    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.ChildNodePreview);

})(jQuery);