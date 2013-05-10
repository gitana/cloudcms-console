(function($) {
    Gitana.Console.Pages.VaultAdd = Gitana.CMS.Pages.AbstractFormPageGadget.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        options: function() {

            return _mergeObject(this.base(), {
                "fields" : {
                    "title" : {
                        "helper" : "Enter vault title."
                    },
                    "description" : {
                        "helper" : "Enter vault description."
                    }
                }
            });
        },

        setup: function() {
            this.get("/add/vault", this.index);
        },

        targetObject: function() {
            return this.platform();
        },

        requiredAuthorities: function() {
            return [
                {
                    "permissioned" : this.targetObject(),
                    "permissions" : ["create_subobjects"]
                }
            ];
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Platform(this, "menu-platform-vaults"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Vaults(this), [
                {
                    "text" : "New Vault"
                }
            ]));
        },

        setupVaultAddForm : function (el) {
            var self = this;
            $('#vault-add', $(el)).alpaca({
                "view": "VIEW_WEB_CREATE",
                "data": {},
                "schema": self.schema(),
                "options": self.options(),
                "postRender": function(form) {
                    Gitana.Utils.UI.beautifyAlpacaForm(form, 'vault-add-create', true);
                    // Add Buttons
                    $('#vault-add-create', $(el)).click(function() {
                        var formVal = form.getValue();
                        if (form.isValid(true)) {

                            Gitana.Utils.UI.block("Creating Vault...");

                            self.targetObject().createVault(formVal).then(function() {
                                var newVault = this;
                                Gitana.Utils.UI.unblock(function() {
                                    self.app().run('GET', self.LINK().call(self,newVault));
                                });
                            });
                        }
                    });
                }
            });
        },

        setupForms : function (el) {
            this.setupVaultAddForm(el);
        },

        setupPage : function(el) {

            var page = {
                "title" : "New Vault",
                "description" : "Create a new vault.",
                "forms" :[{
                    "id" : "vault-add",
                    "title" : "Create A New Vault",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'vault-add', 24),
                    "buttons" :[
                        {
                            "id" : "vault-add-create",
                            "title" : "Create Vault",
                            "isLeft" : true
                        }
                    ]
                }]
            };

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.VaultAdd);

})(jQuery);