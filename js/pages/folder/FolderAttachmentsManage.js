(function($) {
    Gitana.Console.Pages.FolderAttachmentsManage = Gitana.Console.Pages.NodeAttachmentsManage.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/repositories/{repositoryId}/branches/{branchId}/folders/{nodeId}/manage/attachments", this.index);
        },

        LINK : function() {
            return this.folderLink;
        },

        setupBreadcrumb: function() {
            Gitana.Console.Breadcrumb.Folder(this, null, [
                {
                    "text" : "Attachments",
                    "link" : this.folderLink(this.node(),'attachments')
                },{
                    "text" : "Manage"
                }
            ]);
        },

        setupPage : function(el) {

            var page = {
                "title" : "Manage Folder Attachments",
                "description" : "Add, remove or view attachment(s) of current folder.",
                "forms" :[{
                    "id" : "add-attachments",
                    "title" : "Attachment Manager",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'attachment', 24),
                    "buttons" :[
                    ]
                }]
            };

            this.page(Alpaca.mergeObject(page,this.base(el)));
        }
    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.FolderAttachmentsManage);

})(jQuery);