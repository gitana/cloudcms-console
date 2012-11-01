(function($) {
    Gitana.Console.Pages.VaultTeam = Gitana.Console.Pages.AbstractObjectTeam.extend(
    {
        SUBSCRIPTION : "vault-team-page",

        FILTER : "vault-team-member-list-filters",

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/vaults/{vaultId}/teams/{teamId}", this.index);
        },

        contextObject: function() {
            return this.vault();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.VaultTeam(this));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.VaultTeam(this));
        }
    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.VaultTeam);

})(jQuery);