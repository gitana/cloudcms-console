(function($) {
    Gitana.Console.Pages.ApplicationTeams = Gitana.Console.Pages.AbstractObjectTeams.extend({

        SUBSCRIPTION : "application-teams",

        FILTER : "application-team-list-filters",

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/applications/{applicationId}/teams", this.index);
        },

        targetObject: function() {
            return this.application();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Application(this, "menu-application-teams"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.ApplicationTeams(this));
        },

        setupPage : function(el) {
            var page = {
                "title" : "Application Teams",
                "description" : "Display list of teams of application " + this.friendlyTitle(this.targetObject()) + ".",
                "listTitle" : "Team List",
                "listIcon" : Gitana.Utils.Image.buildImageUri('security', 'team', 20),
                "subscription" : this.SUBSCRIPTION,
                "filter" : this.FILTER
            };

            this.page(Alpaca.mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.ApplicationTeams);

})(jQuery);