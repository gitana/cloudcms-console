(function($) {
    Gitana.Console.Pages.NodeFeatures = Gitana.Console.Pages.Features.extend(
    {
        SUBSCRIPTION : "node-features",

        ROOT_KEY: "_features",

        setup: function() {
            this.get("/repositories/{repositoryId}/branches/{branchId}/nodes/{nodeId}/features", this.index);
        },

        featuresLink: function() {
            return this.LIST_LINK().call(this,"node-features");
        },

        targetObject: function() {
            return this.node();
        },

        requiredAuthorities: function() {
            return [
                {
                    "permissioned" : this.targetObject(),
                    "permissions" : ["read"]
                }
            ];
        },

        setupMenu: function() {
           this.menu(Gitana.Console.Menu.Node(this,"menu-node-features"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.NodeFeatures(this));
        },

        setupPage : function(el) {
            var page = {
                "title" : "Features",
                "description" : "Display list of features of node " + this.friendlyTitle(this.targetObject()) + ".",
                "listTitle" : "Feature List",
                "listIcon" : Gitana.Utils.Image.buildImageUri('objects', 'features', 20),
                "subscription" : this.SUBSCRIPTION
            };

            this.page(_mergeObject(page, this.pageHistory(el)));
        }
    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.NodeFeatures);

})(jQuery);