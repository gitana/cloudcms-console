(function($) {
    Gitana.Console.Pages.ChildNodeFeatureEdit = Gitana.Console.Pages.NodeFeatureEdit.extend(
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
            this.get("/repositories/{repositoryId}/branches/{branchId}/children/{nodeId}/features/{featureId}/edit", this.index);
        },

        setupMenu: function() {
           this.menu(Gitana.Console.Menu.Child(this,"menu-node-features"));
        },

        setupBreadcrumb: function(el) {
            Gitana.Console.Breadcrumb.Folder(this, null, [
                {
                    "text" : "Edit Feature " + this.featureId(el)
                }
            ]);
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.ChildNodeFeatureEdit);

})(jQuery);