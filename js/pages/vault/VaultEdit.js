(function($) {
    Gitana.Console.Pages.VaultEdit = Gitana.CMS.Pages.AbstractEditFormPageGadget.extend(
    {
        EDIT_URI: [
            "/vaults/{vaultId}/edit"
        ],

        EDIT_JSON_URI: [
            "/vaults/{vaultId}/edit/json"
        ],

        targetObject: function() {
            return this.vault();
        },

        requiredAuthorities: function() {
            return [
                {
                    "permissioned" : this.targetObject(),
                    "permissions" : ["update"]
                }
            ];
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

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Vault(this));
        },

        setupBreadcrumb: function(el) {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Vault(this), [
                {
                    "text" : this.isEditJSONUri(el) ? 'Edit JSON' : "Edit"
                }
            ]));
        },

        setupEditForm: function (el, callback) {
            var self = this;
            var vault = self.targetObject();
            var defaultData = this.populateObject(["title","description"],vault);
            $('#vault-edit', $(el)).alpaca({
                "data": defaultData,
                "schema": self.schema(),
                "options": self.options(),
                "postRender": function(form) {
                    Gitana.Utils.UI.beautifyAlpacaForm(form, 'vault-edit-save', true);
                    // Add Buttons
                    $('#vault-edit-save', $(el)).click(function() {
                        var formVal = form.getValue();
                        if (form.isValid(true)) {
                            Gitana.Utils.UI.block("Updating Vault ...");
                            vault.replacePropertiesWith(formVal);
                            vault.update().then(function() {
                                Gitana.Utils.UI.unblock(function() {
                                    self.app().run('GET', self.LINK().call(self,self.targetObject()));
                                });
                            });
                        }
                    });

                    callback();
                }
            });
        },

        editButtonConfig: function() {
            return  {
                "id": "edit",
                "title": "Edit Vault",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'vault-edit', 48),
                "url" : this.LINK().call(this,this.targetObject(), 'edit')
            };
        },

        editPageConfig: function() {
            return {
                "id" : "vault-edit",
                "title" : "Edit Vault",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'vault-edit', 24),
                "buttons" :[
                    {
                        "id" : "vault-edit-save",
                        "title" : "Save Vault",
                        "isLeft" : true
                    }
                ]
            };
        },

        setupPage: function(el) {

            var page = {
                "title" : "Edit Vault",
                "description" : "Edit vault " + this.friendlyTitle(this.vault()) + ".",
                "forms" :[]
            };

            this.setupEditPage(el, page);

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.VaultEdit);

})(jQuery);