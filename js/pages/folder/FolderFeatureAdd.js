(function($) {
    Gitana.Console.Pages.FolderFeatureAdd = Gitana.Console.Pages.NodeFeatureAdd.extend(
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
            this.get("/repositories/{repositoryId}/branches/{branchId}/folders/{nodeId}/add/feature", this.index);
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
                    "text" : "New Feature"
                }
            ]);
        },

        setupPage : function(el) {

            var page = {
                "title" : "New Folder Feature",
                "description" : "Add a new feature to current folder.",
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

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.FolderFeatureAdd);

})(jQuery);