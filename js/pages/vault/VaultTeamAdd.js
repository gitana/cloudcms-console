(function($) {
    Gitana.Console.Pages.VaultTeamAdd = Gitana.Console.Pages.AbstractObjetTeamAdd.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/vaults/{vaultId}/add/team", this.index);
        },

        targetObject: function() {
            return this.vault();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Vault(this, "menu-vault-teams"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.VaultTeams(this), [
                {
                    "text" : "New Team"
                }
            ]));
        },

        setupPage : function(el) {

            var page = {
                "title" : "New Vault Team",
                "description" : "Create a new vault team.",
                "forms" :[{
                    "id" : "team-add",
                    "title" : "Create A New Vault Team",
                    "icon" : Gitana.Utils.Image.buildImageUri('security', 'team-add', 24),
                    "buttons" :[
                        {
                            "id" : "team-add-create",
                            "title" : "Create Team",
                            "isLeft" : true
                        }
                    ]
                }]
            };

            this.page(Alpaca.mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.VaultTeamAdd);

})(jQuery);