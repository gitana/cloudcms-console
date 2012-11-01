(function($) {
    Gitana.Console.Pages.ChildNode = Gitana.Console.Pages.Node.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        LINK : function() {
            return this.folderLink;
        },

        setup: function() {
            this.get("/repositories/{repositoryId}/branches/{branchId}/children/{nodeId}", this.index);
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Child(this));
        },

        setupBreadcrumb: function() {
            Gitana.Console.Breadcrumb.Folder(this);
        }
    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.ChildNode);

})(jQuery);