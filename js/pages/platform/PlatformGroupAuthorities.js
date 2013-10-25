(function($) {
    Gitana.Console.Pages.PlatformGroupAuthorities = Gitana.Console.AbstractGitanaConsoleGroupAuthorityListGadget.extend(
    {
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

            var msgContext = {
                "tenantFriendlyTitle": this.friendlyTitle(this.tenantDetails())
            };

            var page = {
                "title" : _msg("Platform.GroupAuthorities.title", msgContext),
                "description" : _msg("Platform.GroupAuthorities.description", msgContext),
                "listTitle" : _msg("Platform.GroupAuthorities.listTitle", msgContext),
                "listIcon" : Gitana.Utils.Image.buildImageUri('security', 'group', 20),
                "searchBox" : true,
                "subscription" : this.SUBSCRIPTION,
                "filter" : this.FILTER
                //"dashlets" : this.publicSecurityDashlet()
            };

            this.page(_mergeObject(page,this.base(el)));
        }
    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.PlatformGroupAuthorities);

})(jQuery);