(function($) {
    Gitana.Console.Pages.NodeFeatureEditJSON = Gitana.Console.Pages.FeatureEditJSON.extend(
    {
        ROOT_KEY: "_features",

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/repositories/{repositoryId}/branches/{branchId}/nodes/{nodeId}/features/{featureId}/edit/json", this.index);
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
            this.menu(Gitana.Console.Menu.Node(this, "menu-node-features"));
        },

        setupBreadcrumb: function(el) {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.NodeFeatures(this), [
                {
                    "text" : "Edit Feature " + this.featureId(el) + " JSON"
                }
            ]));
        },

        setupPage : function(el) {

            var page = {
                "title" : "Edit Node Feature JSON",
                "description" : "Edi configurations of feature " + this.featureId(el) + ".",
                "forms" :[
                    {
                        "id" : "feature-edit",
                        "title" : "Edit Node Feature " + this.featureId(el) + " JSON",
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

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.NodeFeatureEditJSON);

})(jQuery);