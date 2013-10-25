(function($) {
    Gitana.Console.Pages.PlatformTeamEdit = Gitana.Console.Pages.AbstractObjectTeamEdit.extend(
    {
        EDIT_URI: "/teams/{teamId}/edit",

        EDIT_JSON_URI: "/teams/{teamId}/edit/json",

        contextObject: function() {
            return this.platform();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.PlatformTeam(this));
        },

        setupBreadcrumb: function(el) {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.PlatformTeam(this), [
                {
                    "text" : this.isEditJSONUri(el) ? 'Edit JSON' : "Edit"
                }
            ]));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.PlatformTeamEdit);

})(jQuery);