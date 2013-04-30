(function($) {
    Gitana.Console.Pages.FolderFeatureEditJSON = Gitana.Console.Pages.NodeFeatureEditJSON.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        LINK : function() {
            return this.folderLink;
        },

        featuresLink: function() {
            return this.LIST_LINK().call(this,"folder-features");
        },

        setup: function() {
            this.get("/repositories/{repositoryId}/branches/{branchId}/folders/{nodeId}/features/{featureId}/edit/json", this.index);
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Folder(this,"menu-folder-features"));
        },

        setupBreadcrumb: function(el) {
            Gitana.Console.Breadcrumb.Folder(this, null, [
                {
                    "text" : "Features",
                    "link" : this.featuresLink()

                },
                {
                    "text" : "Edit Feature " + this.featureId(el) + " JSON"
                }
            ]);
        },

        setupPage : function(el) {

            var page = {
                "title" : "Edit Folder Feature JSON",
                "description" : "Edi configurations of feature " + this.featureId(el) + ".",
                "forms" :[
                    {
                        "id" : "feature-edit",
                        "title" : "Edit Folder Feature " + this.featureId(el) + " JSON",
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

            this.page(Alpaca.mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.FolderFeatureEditJSON);

})(jQuery);