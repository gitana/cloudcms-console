(function($) {
    Gitana.Console.Pages.ApplicationTeam = Gitana.Console.Pages.AbstractObjectTeam.extend(
    {
        SUBSCRIPTION : "application-team-page",

        FILTER : "application-team-member-list-filters",

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/applications/{applicationId}/teams/{teamId}", this.index);
        },

        contextObject: function() {
            return this.application();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.ApplicationTeam(this));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.ApplicationTeam(this));
        }
    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.ApplicationTeam);

})(jQuery);