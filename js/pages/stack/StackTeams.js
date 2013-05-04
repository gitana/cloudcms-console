(function($) {
    Gitana.Console.Pages.StackTeams = Gitana.Console.Pages.AbstractObjectTeams.extend({

        SUBSCRIPTION : "stack-teams",

        FILTER : "stack-team-list-filters",

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/stacks/{stackId}/teams", this.index);
        },

        targetObject: function() {
            return this.stack();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Stack(this, "menu-stack-teams"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.StackTeams(this));
        },

        setupPage : function(el) {
            var page = {
                "title" : "Stack Teams",
                "description" : "Display list of teams of stack " + this.friendlyTitle(this.targetObject()) + ".",
                "listTitle" : "Team List",
                "listIcon" : Gitana.Utils.Image.buildImageUri('security', 'team', 20),
                "subscription" : this.SUBSCRIPTION,
                "filter" : this.FILTER
            };

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.StackTeams);

})(jQuery);