(function($) {
    Gitana.Console.Pages.PlatformTeams = Gitana.Console.Pages.AbstractObjectTeams.extend({

        SUBSCRIPTION : "platform-teams",

        FILTER : "platform-team-list-filters",

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/teams", this.index);
        },

        targetObject: function() {
            return this.platform();
        },

        contextObject: function() {
            //return this.myTenant();
            return this.tenantDetails();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Platform(this, "menu-platform-teams"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.PlatformTeams(this));
        },

        setupPage : function(el) {
            var page = {
                "title" : "Platform Teams",
                "description" : "Display list of teams of tenant " + this.friendlyTitle(this.targetObject()) + ".",
                "listTitle" : "Team List",
                "listIcon" : Gitana.Utils.Image.buildImageUri('security', 'team', 20),
                "subscription" : this.SUBSCRIPTION,
                "filter" : this.FILTER
            };

            this.page(Alpaca.mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.PlatformTeams);

})(jQuery);