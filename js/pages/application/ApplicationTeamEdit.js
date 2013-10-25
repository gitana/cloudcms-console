(function($) {
    Gitana.Console.Pages.ApplicationTeamEdit = Gitana.Console.Pages.AbstractObjectTeamEdit.extend(
    {
        EDIT_URI: "/applications/{applicationId}/teams/{teamId}/edit",

        EDIT_JSON_URI: "/applications/{applicationId}/teams/{teamId}/edit/json",

        contextObject: function() {
            return this.application();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.ApplicationTeam(this));
        },

        setupBreadcrumb: function(el) {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.ApplicationTeam(this), [
                {
                    "text" : this.isEditJSONUri(el) ? 'Edit JSON' : "Edit"
                }
            ]));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.ApplicationTeamEdit);

})(jQuery);