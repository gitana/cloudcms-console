(function($) {
    Gitana.Console.Pages.ChildNodeRuleAdd = Gitana.Console.Pages.NodeRuleAdd.extend(
    {
        setup: function() {
            this.get("/repositories/{repositoryId}/branches/{branchId}/folders/{nodeId}/add/rule", this.index);
            this.get("/repositories/{repositoryId}/branches/{branchId}/children/{nodeId}/add/rule", this.index);
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Child(this,"menu-node-rules"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.FolderRules(this), [{
                "text" : "New Rule"
            }]));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.ChildNodeRuleAdd);

})(jQuery);