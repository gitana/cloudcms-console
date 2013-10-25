(function($) {
    Gitana.Console.Pages.RepositoryTeams = Gitana.Console.Pages.AbstractObjectTeams.extend({

        SUBSCRIPTION : "repository-teams",

        FILTER : "repository-team-list-filters",

        setup: function() {
            this.get("/repositories/{repositoryId}/teams", this.index);
        },

        targetObject: function() {
            return this.repository();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Repository(this, "menu-repository-teams"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.RepositoryTeams(this));
        },

        setupPage : function(el) {
            var page = {
                "title" : "Repository Teams",
                "description" : "Display list of teams of repository " + this.friendlyTitle(this.targetObject()) + ".",
                "listTitle" : "Team List",
                "listIcon" : Gitana.Utils.Image.buildImageUri('security', 'team', 20),
                "subscription" : this.SUBSCRIPTION,
                "filter" : this.FILTER
            };

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.RepositoryTeams);

})(jQuery);