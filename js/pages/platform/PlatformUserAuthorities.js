(function($) {
    Gitana.Console.Pages.PlatformUserAuthorities = Gitana.Console.AbstractGitanaConsoleUserAuthorityListGadget.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        LINK : function() {
            return this.platformLink;
        },

        setup: function() {
            this.get("/authorities/users", this.index);
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
                    "text" : "User Security"
                }
            ]));
        },

        setupPage : function(el) {

            var msgContext = {
                "tenantFriendlyTitle": this.friendlyTitle(this.tenantDetails())
            };

            var page = {
                "title" : _msg("Platform.UserAuthorities.title", msgContext),
                "description" : _msg("Platform.UserAuthorities.description", msgContext),
                "listTitle" : _msg("Platform.UserAuthorities.listTitle", msgContext),
                "listIcon" : Gitana.Utils.Image.buildImageUri('security', 'user', 20),
                "searchBox" : true,
                "subscription" : this.SUBSCRIPTION,
                "filter" : this.FILTER
            };

            this.page(_mergeObject(page,this.base(el)));
        }
    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.PlatformUserAuthorities);

})(jQuery);