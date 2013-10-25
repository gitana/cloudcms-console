(function($) {
    Gitana.Console.Pages.BranchGroupAuthorities = Gitana.Console.AbstractGitanaConsoleGroupAuthorityListGadget.extend(
    {
        setup: function() {
            this.get("/repositories/{repositoryId}/branches/{branchId}/authorities/groups", this.index);
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
                    "text" : "Group Security"
                }
            ]));
        },

        setupPage : function(el) {
            var page = {
                "title" : "Branch Group Security",
                "description" : "Display and manage group access to branch " + this.friendlyTitle(this.targetObject()) + ".",
                "listTitle" : "Group List",
                "listIcon" : Gitana.Utils.Image.buildImageUri('security', 'group', 20),
                "subscription" : this.SUBSCRIPTION,
                "filter" : this.FILTER,
                "searchBox" : true
                //"dashlets" : this.publicSecurityDashlet()
            };

            this.page(_mergeObject(page,this.base(el)));
        }
    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.BranchGroupAuthorities);

})(jQuery);