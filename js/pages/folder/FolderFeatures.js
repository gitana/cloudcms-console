(function($) {
    Gitana.Console.Pages.FolderFeatures = Gitana.Console.Pages.NodeFeatures.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/repositories/{repositoryId}/branches/{branchId}/folders/{nodeId}/features", this.index);
        },

        LINK : function() {
            return this.folderLink;
        },

        featuresLink: function() {
            return this.LIST_LINK().call(this,"folder-features");
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Folder(this,"menu-folder-features"));
        },

        setupBreadcrumb: function() {
            Gitana.Console.Breadcrumb.Folder(this, null, [
                {
                    "text" : "Features"
                }
            ]);
        },

        setupPage : function(el) {
            var page = {
                "title" : "Folder Features",
                "description" : "Display list of features of current folder.",
                "listTitle" : "Feature List",
                "subscription" : this.SUBSCRIPTION
            };

            this.page(_mergeObject(page,this.base(el)));
        }
    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.FolderFeatures);

})(jQuery);