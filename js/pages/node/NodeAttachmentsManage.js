(function($) {
    Gitana.Console.Pages.NodeAttachmentsManage = Gitana.Console.Pages.AbstractObjectAttachmentsManage.extend(
    {
        SUBSCRIPTION : "node-attachments",

        FILTER : "node-attachments-list-filters",

        setup: function() {
            this.get("/repositories/{repositoryId}/branches/{branchId}/nodes/{nodeId}/manage/attachments", this.index);
        },

        targetObject: function() {
            return this.node();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Node(this,"menu-attachments"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Attachments(this), [
                {
                    "text" : "Manage"
                }
            ]));
        },

        setupPage : function(el) {

            var page = {
                "title" : "Manage Node Attachments",
                "description" : "Add, remove or view attachment(s) of node " + this.friendlyTitle(this.node()) + "."
            };

            this.page(_mergeObject(page,this.base(el)));
        }
    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.NodeAttachmentsManage);

})(jQuery);