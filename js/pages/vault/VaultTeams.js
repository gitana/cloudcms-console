(function($) {
    Gitana.Console.Pages.VaultTeams = Gitana.Console.Pages.AbstractObjectTeams.extend({

        SUBSCRIPTION : "vault-teams",

        FILTER : "vault-team-list-filters",

        setup: function() {
            this.get("/vaults/{vaultId}/teams", this.index);
        },

        targetObject: function() {
            return this.vault();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Vault(this, "menu-vault-teams"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.VaultTeams(this));
        },

        setupPage : function(el) {
            var page = {
                "title" : "Vault Teams",
                "description" : "Display list of teams of vault " + this.friendlyTitle(this.targetObject()) + ".",
                "listTitle" : "Team List",
                "listIcon" : Gitana.Utils.Image.buildImageUri('security', 'team', 20),
                "subscription" : this.SUBSCRIPTION,
                "filter" : this.FILTER
            };

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.VaultTeams);

})(jQuery);