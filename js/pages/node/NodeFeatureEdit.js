(function($) {
    Gitana.Console.Pages.NodeFeatureEdit = Gitana.Console.Pages.FeatureEdit.extend(
    {
        ROOT_KEY: "_features",

        setup: function() {
            this.get("/repositories/{repositoryId}/branches/{branchId}/nodes/{nodeId}/features/{featureId}/edit", this.index);
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
                    "text" : "Edit Feature " + this.featureId(el)
                }

            ]));
        },

        setupPage : function(el) {

            var page = {
                "title" : "Edit Node Feature",
                "description" : "Edit configurations of feature " + this.featureId(el) + ".",
                "forms" :[
                    {
                        "id" : "feature-edit",
                        "title" : "Edit Node Feature " + this.featureId(el),
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'features-edit', 24),
                        "buttons" :[
                            {
                                "id" : "feature-edit-save",
                                "title" : "Save Feature",
                                "isLeft" : true
                            }
                        ]
                    }
                ]
            };

            this.page(_mergeObject(page, this.pageHistory(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.NodeFeatureEdit);

})(jQuery);