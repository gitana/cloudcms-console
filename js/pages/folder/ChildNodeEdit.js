(function($) {
    Gitana.Console.Pages.ChildNodeEdit = Gitana.Console.Pages.NodeEdit.extend(
    {
        EDIT_URI: [
            "/repositories/{repositoryId}/branches/{branchId}/children/{nodeId}/edit"
        ],

        EDIT_JSON_URI: [
            "/repositories/{repositoryId}/branches/{branchId}/children/{nodeId}/edit/json"
        ],

        LINK : function() {
            return this.folderLink;
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Child(this));
        },

        setupBreadcrumb: function(el) {
            Gitana.Console.Breadcrumb.Folder(this, null, [
                {
                    "text" : this.isEditJSONUri(el) ? 'Edit JSON' : "Edit"
                }
            ]);
        }
    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.ChildNodeEdit);

})(jQuery);