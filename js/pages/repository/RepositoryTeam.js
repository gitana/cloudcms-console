(function($) {
    Gitana.Console.Pages.RepositoryTeam = Gitana.Console.Pages.AbstractObjectTeam.extend(
    {
        SUBSCRIPTION : "repository-team-page",

        FILTER : "repository-team-member-list-filters",

        setup: function() {
            this.get("/repositories/{repositoryId}/teams/{teamId}", this.index);
        },

        contextObject: function() {
            return this.repository();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.RepositoryTeam(this));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.RepositoryTeam(this));
        }
    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.RepositoryTeam);

})(jQuery);