(function($) {
    Gitana.Console.Pages.NodeUserAuthorities = Gitana.Console.AbstractGitanaConsoleUserAuthorityListGadget.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/repositories/{repositoryId}/branches/{branchId}/nodes/{nodeId}/authorities/users", this.index);
        },

        targetObject: function() {
            return this.node();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Node(this,'menu-node-security'));
        },

        setupBreadcrumb: function(el) {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Node(this), [
                {
                    "text" : "User Security"
                }
            ]));
        },

        setupPage : function(el) {
            var page = {
                "title" : "Node User Security",
                "description" : "Display and manage user access to this node.",
                "listTitle" : "User List",
                "listIcon" : Gitana.Utils.Image.buildImageUri('security', 'group', 20),
                "searchBox" : true,
                "subscription" : this.SUBSCRIPTION,
                "filter" : this.FILTER
            };

            this.page(_mergeObject(page,this.base(el)));
        }
    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.NodeUserAuthorities);

})(jQuery);