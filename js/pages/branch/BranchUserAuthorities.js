(function($) {
    Gitana.Console.Pages.BranchUserAuthorities = Gitana.Console.AbstractGitanaConsoleUserAuthorityListGadget.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/repositories/{repositoryId}/branches/{branchId}/authorities/users", this.index);
        },

        targetObject: function() {
            return this.branch();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Branch(this,'menu-branch-security'));
        },

        setupBreadcrumb: function(el) {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Branch(this), [
                {
                    "text" : "User Security"
                }
            ]));
        },

        setupPage : function(el) {
            var page = {
                "title" : "Branch User Security",
                "description" : "Display and manage user access to this branch.",
                "listTitle" : "User List",
                "listIcon" : Gitana.Utils.Image.buildImageUri('security', 'user', 20),
                "searchBox" : true,
                "subscription" : this.SUBSCRIPTION,
                "filter" : this.FILTER
            };

            this.page(Alpaca.mergeObject(page,this.base(el)));
        }
    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.BranchUserAuthorities);

})(jQuery);