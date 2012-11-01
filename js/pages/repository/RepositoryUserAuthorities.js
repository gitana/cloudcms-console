(function($) {
    Gitana.Console.Pages.RepositoryUserAuthorities = Gitana.Console.AbstractGitanaConsoleUserAuthorityListGadget.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/repositories/{repositoryId}/authorities/users", this.index);
        },

        targetObject: function() {
            return this.repository();
        },

        requiredAuthorities: function() {
            return [
                {
                    "permissioned" : this.targetObject(),
                    "permissions" : ["modify_permissions"]
                }
            ];
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Repository(this,'menu-repository-security'));
        },

        setupBreadcrumb: function(el) {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Repository(this), [
                {
                    "text" : "User Security"
                }
            ]));
        },

        setupPage : function(el) {
            var page = {
                "title" : "Repository User Security",
                "description" : "Display and manage user access to repository " + this.friendlyTitle(this.targetObject()) + ".",
                "listTitle" : "User List",
                "listIcon" : Gitana.Utils.Image.buildImageUri('security', 'user', 20),
                "subscription" : this.SUBSCRIPTION,
                "filter" : this.FILTER
            };

            this.page(Alpaca.mergeObject(page,this.base(el)));
        }
    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.RepositoryUserAuthorities);

})(jQuery);