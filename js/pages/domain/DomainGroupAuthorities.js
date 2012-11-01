(function($) {
    Gitana.Console.Pages.DomainGroupAuthorities = Gitana.Console.AbstractGitanaConsoleGroupAuthorityListGadget.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/domains/{domainId}/authorities/groups", this.index);
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
                    "text" : "Group Security"
                }
            ]));
        },

        setupPage : function(el) {
            var page = {
                "title" : "Domain Group Security",
                "description" : "Display and manage group access to domain " + this.friendlyTitle(this.targetObject()) + ".",
                "listTitle" : "Group List",
                "listIcon" : Gitana.Utils.Image.buildImageUri('security', 'group', 20),
                "subscription" : this.SUBSCRIPTION,
                "filter" : this.FILTER,
                "searchBox" : true
                //"dashlets" : this.publicSecurityDashlet()
            };

            this.page(Alpaca.mergeObject(page,this.base(el)));
        }
    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.DomainGroupAuthorities);

})(jQuery);