(function($) {
    Gitana.Console.Pages.StackTeam = Gitana.Console.Pages.AbstractObjectTeam.extend(
    {
        SUBSCRIPTION : "stack-team-page",

        FILTER : "stack-team-member-list-filters",

        setup: function() {
            this.get("/stacks/{stackId}/teams/{teamId}", this.index);
        },

        contextObject: function() {
            return this.stack();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.StackTeam(this));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.StackTeam(this));
        }
    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.StackTeam);

})(jQuery);