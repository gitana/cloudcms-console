(function($) {
    Gitana.Console.Pages.StackTeamEdit = Gitana.Console.Pages.AbstractObjectTeamEdit.extend(
    {
        EDIT_URI: "/stacks/{stackId}/teams/{teamId}/edit",

        EDIT_JSON_URI: "/stacks/{stackId}/teams/{teamId}/edit/json",

        contextObject: function() {
            return this.stack();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.StackTeam(this));
        },

        setupBreadcrumb: function(el) {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.StackTeam(this), [
                {
                    "text" : this.isEditJSONUri(el) ? 'Edit JSON' : "Edit"
                }
            ]));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.StackTeamEdit);

})(jQuery);