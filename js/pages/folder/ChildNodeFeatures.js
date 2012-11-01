(function($) {
    Gitana.Console.Pages.ChildNodeFeatures = Gitana.Console.Pages.NodeFeatures.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/repositories/{repositoryId}/branches/{branchId}/children/{nodeId}/features", this.index);
        },

        LINK : function() {
            return this.folderLink;
        },

        featuresLink: function() {
            return this.LIST_LINK().call(this,"child-features");
        },

        setupMenu: function() {
           this.menu(Gitana.Console.Menu.Child(this,"menu-node-features"));
        },

        setupBreadcrumb: function() {
            Gitana.Console.Breadcrumb.Folder(this, null, [
                {
                    "text" : "Features"
                }
            ]);
        }
    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.ChildNodeFeatures);

})(jQuery);