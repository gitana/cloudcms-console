(function($) {
    Gitana.Console.Pages.ChildNodeFeatureAdd = Gitana.Console.Pages.NodeFeatureAdd.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        LINK : function() {
            return this.folderLink;
        },

        featuresLink: function() {
            return this.LIST_LINK().call(this,"child-features");
        },

        setup: function() {
            this.get("/repositories/{repositoryId}/branches/{branchId}/children/{nodeId}/add/feature", this.index);
        },

        setupMenu: function() {
           this.menu(Gitana.Console.Menu.Child(this,"menu-node-features"));
        },

        setupBreadcrumb: function(el) {
            Gitana.Console.Breadcrumb.Folder(this, null, [
                {
                    "text" : "New Feature"
                }
            ]);
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.ChildNodeFeatureAdd);

})(jQuery);