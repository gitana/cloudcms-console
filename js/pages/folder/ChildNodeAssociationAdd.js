(function($) {
    Gitana.Console.Pages.ChildNodeAssociationAdd = Gitana.Console.Pages.AssociationAdd.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        LINK : function() {
            return this.folderLink;
        },

        setup: function() {
            this.get("/repositories/{repositoryId}/branches/{branchId}/folders/{nodeId}/add/association", this.index);
            this.get("/repositories/{repositoryId}/branches/{branchId}/children/{nodeId}/add/association", this.index);
        },

        targetObject: function() {
            return this.branch();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Child(this,"menu-associations"));
        },

        setupBreadcrumb: function() {
            Gitana.Console.Breadcrumb.Folder(this, null, [
                {
                    "text" : "Associations",
                    "link" : this.LINK().call(this,this.node(),'associations')
                },
                {
                    "text" : "New Association"
                }
            ]);
        },

        setupPage : function(el) {

            var page = {
                "title" : "New Association",
                "description" : "Create a new association for node " + this.friendlyTitle(this.node()) + ".",
                "listTitle" : "Node List",
                "listIcon" : Gitana.Utils.Image.buildImageUri('objects', 'node', 20),
                "subscription" : this.SUBSCRIPTION,
                "filter" : this.FILTER,
                "forms" :[
                    {
                        "id" : "form-pick",
                        "title" : "Select Association Type and Form",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'definition', 24)
                    },
                    {
                        "id" : "association-add",
                        "title" : "Create A New Association",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'association-add', 24),
                        "buttons" :[
                            {
                                "id" : "association-add-create",
                                "title" : "Create Association",
                                "isLeft" : true
                            }
                        ]
                    }
                ]
            };

            this.page(_mergeObject(page, this.pageHistory(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.ChildNodeAssociationAdd);

})(jQuery);