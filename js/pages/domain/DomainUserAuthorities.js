(function($) {
    Gitana.Console.Pages.DomainUserAuthorities = Gitana.Console.AbstractGitanaConsoleUserAuthorityListGadget.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/domains/{domainId}/authorities/users", this.index);
        },

        targetObject: function() {
            return this.domain();
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
            this.menu(Gitana.Console.Menu.Domain(this,'menu-domain-security'));
        },

        setupBreadcrumb: function(el) {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Domain(this), [
                {
                    "text" : "User Security"
                }
            ]));
        },

        setupPage : function(el) {
            var page = {
                "title" : "Domain User Security",
                "description" : "Display and manage user access to domain " + this.friendlyTitle(this.targetObject()) + ".",
                "listTitle" : "User List",
                "listIcon" : Gitana.Utils.Image.buildImageUri('security', 'user', 20),
                "subscription" : this.SUBSCRIPTION,
                "filter" : this.FILTER
            };

            this.page(Alpaca.mergeObject(page,this.base(el)));
        }
    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.DomainUserAuthorities);

})(jQuery);