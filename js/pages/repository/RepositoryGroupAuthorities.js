(function($) {
    Gitana.Console.Pages.RepositoryGroupAuthorities = Gitana.Console.AbstractGitanaConsoleGroupAuthorityListGadget.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/repositories/{repositoryId}/authorities/groups", this.index);
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
                    "text" : "Group Security"
                }
            ]));
        },

        setupPage : function(el) {
            var page = {
                "title" : "Repository Group Security",
                "description" : "Display and manage group access to repository " + this.friendlyTitle(this.targetObject()) + ".",
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

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.RepositoryGroupAuthorities);

})(jQuery);