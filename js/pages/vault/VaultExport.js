(function($) {
    Gitana.Console.Pages.VaultExport = Gitana.Console.Pages.AbstractExport.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/vaults/{vaultId}/export", this.index);
        },

        targetObject: function() {
            return this.vault();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Vault(this));
        },

        setupBreadcrumb: function(el) {
            var items = [
                {
                    "text" : "Export"
                }
            ];

            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Vault(this), items));
        },

        setupPage : function(el) {

            var page = {
                "title" : "Export Vault",
                "description" : "Export vault " + this.friendlyTitle(this.targetObject()) + " to an archive file.",
                "forms" :[{
                    "id" : "export",
                    "title" : "Export Vault",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-export', 24),
                    "buttons" :[
                        {
                            "id" : "export-create",
                            "title" : "Export Vault",
                            "isLeft" : true
                        }
                    ]
                }]
            };

            this.page(Alpaca.mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.VaultExport);

})(jQuery);