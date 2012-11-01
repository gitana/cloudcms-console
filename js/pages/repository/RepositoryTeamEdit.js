(function($) {
    Gitana.Console.Pages.RepositoryTeamEdit = Gitana.Console.Pages.AbstractObjectTeamEdit.extend(
    {
        EDIT_URI: "/repositories/{repositoryId}/teams/{teamId}/edit",

        EDIT_JSON_URI: "/repositories/{repositoryId}/teams/{teamId}/edit/json",

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        contextObject: function() {
            return this.repository();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.RepositoryTeam(this));
        },

        setupBreadcrumb: function(el) {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.RepositoryTeam(this), [
                {
                    "text" : this.isEditJSONUri(el) ? 'Edit JSON' : "Edit"
                }
            ]));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.RepositoryTeamEdit);

})(jQuery);