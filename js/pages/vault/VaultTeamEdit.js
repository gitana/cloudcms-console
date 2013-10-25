(function($) {
    Gitana.Console.Pages.VaultTeamEdit = Gitana.Console.Pages.AbstractObjectTeamEdit.extend(
    {
        EDIT_URI: "/vaults/{vaultId}/teams/{teamId}/edit",

        EDIT_JSON_URI: "/vaults/{vaultId}/teams/{teamId}/edit/json",

        contextObject: function() {
            return this.vault();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.VaultTeam(this));
        },

        setupBreadcrumb: function(el) {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.VaultTeam(this), [
                {
                    "text" : this.isEditJSONUri(el) ? 'Edit JSON' : "Edit"
                }
            ]));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.VaultTeamEdit);

})(jQuery);