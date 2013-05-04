(function($) {
    Gitana.Console.Pages.ChildNodeAttachments = Gitana.Console.Pages.NodeAttachments.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        LINK : function() {
            return this.folderLink;
        },

        setup: function() {
            this.get("/repositories/{repositoryId}/branches/{branchId}/children/{nodeId}/attachments", this.index);
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Child(this,"menu-attachments"));
        },

        setupBreadcrumb: function() {
            Gitana.Console.Breadcrumb.Folder(this, null, [
                {
                    "text" : "Attachments"
                }
            ]);
        },

        setupPage : function(el) {

            var page = {
                "title" : "Node Attachments",
                "description" : "Add, remove or view attachment(s) of current node.",
                "listTitle" : "Attachment List",
                "subscription" : this.SUBSCRIPTION,
                "filter" : this.FILTER,
                "forms" :[{
                    "id" : "add-attachments",
                    "title" : "Attachment Manager",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'attachment', 24),
                    "buttons" :[
                    ]
                }]
            };

            this.page(_mergeObject(page,this.base(el)));
        }
    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.ChildNodeAttachments);

})(jQuery);