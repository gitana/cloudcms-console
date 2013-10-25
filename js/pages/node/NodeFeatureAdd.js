(function($) {
    Gitana.Console.Pages.NodeFeatureAdd = Gitana.Console.Pages.FeatureAdd.extend(
    {
        ROOT_KEY: "_features",

        setup: function() {
            this.get("/repositories/{repositoryId}/branches/{branchId}/nodes/{nodeId}/add/feature", this.index);
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
                    "permissions" : ["update"]
                }
            ];
        },

        setupMenu: function() {
           this.menu(Gitana.Console.Menu.Node(this,"menu-node-features"));
        },

        setupBreadcrumb: function(el) {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.NodeFeatures(this), [
                {
                    "text" : "New Feature"
                }

            ]));
        },

        setupPage : function(el) {

            var page = {
                "title" : "New Node Feature",
                "description" : "Add a new feature to current node.",
                "forms" :[{
                    "id" : "feature-add",
                    "title" : "Add A New Feature",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'features-add', 24),
                    "buttons" :[
                        {
                            "id" : "feature-add-create",
                            "title" : "Add Feature",
                            "isLeft" : true
                        }
                    ]
                }]
            };

            this.page(_mergeObject(page, this.pageHistory(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.NodeFeatureAdd);

})(jQuery);