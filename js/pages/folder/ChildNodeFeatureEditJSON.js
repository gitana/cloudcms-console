(function($) {
    Gitana.Console.Pages.ChildNodeFeatureEditJSON = Gitana.Console.Pages.NodeFeatureEditJSON.extend(
    {
        LINK : function() {
            return this.folderLink;
        },

        featuresLink: function() {
            return this.LIST_LINK().call(this,"child-features");
        },

        setup: function() {
            this.get("/repositories/{repositoryId}/branches/{branchId}/children/{nodeId}/features/{featureId}/edit/json", this.index);
        },

        setupMenu: function() {
           this.menu(Gitana.Console.Menu.Child(this,"menu-node-features"));
        },

        setupBreadcrumb: function(el) {
            Gitana.Console.Breadcrumb.Folder(this, null, [
                {
                    "text" : "Edit Feature " + this.featureId(el) + " JSON"
                }
            ]);
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.ChildNodeFeatureEditJSON);

})(jQuery);