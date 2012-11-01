(function($) {
    Gitana.Console.Pages.PlatformGroupAuthorities = Gitana.Console.AbstractGitanaConsoleGroupAuthorityListGadget.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        LINK : function() {
            return this.platformLink;
        },

        setup: function() {
            this.get("/authorities/groups", this.index);
        },

        targetObject: function() {
            return this.platform();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Platform(this,'menu-platform-security'));
        },

        setupBreadcrumb: function(el) {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Platform(this), [
                {
                    "text" : "Group Security"
                }
            ]));
        },

        setupPage : function(el) {
            var page = {
                "title" : "Platform Group Security",
                //"description" : "Display and manage group access to platform of tenant " + this.friendlyTitle(this.myTenant()) + ".",
                "description" : "Display and manage group access to platform of tenant " + this.friendlyTitle(this.tenantDetails()) + ".",
                "listTitle" : "Group List",
                "listIcon" : Gitana.Utils.Image.buildImageUri('security', 'group', 20),
                "searchBox" : true,
                "subscription" : this.SUBSCRIPTION,
                "filter" : this.FILTER
                //"dashlets" : this.publicSecurityDashlet()
            };

            this.page(Alpaca.mergeObject(page,this.base(el)));
        }
    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.PlatformGroupAuthorities);

})(jQuery);