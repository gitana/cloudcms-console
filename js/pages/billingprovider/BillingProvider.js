(function($) {
    Gitana.Console.Pages.BillingProvider = Gitana.CMS.Pages.AbstractDashboardPageGadget.extend({

        setup: function() {
            this.get("/billingproviders/{billingProviderId}", this.index);
        },

        targetObject: function() {
            return this.billingProvider();
        },

        requiredAuthorities: function() {
            return [
                {
                    "permissioned" : this.targetObject(),
                    "permissions" : ["read"]
                }
            ];
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.BillingProvider(this));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.BillingProvider(this));
        },

        setupToolbar: function() {
            var self = this;
            self.base();
            if (this.targetObject().getId() != "default") {
                self.addButtons([
                    {
                        "id": "edit",
                        "title": "Edit Config",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'billing-provider-edit', 48),
                        "url" : self.link(this.targetObject(), "edit"),
                        "requiredAuthorities" : [
                            {
                                "permissioned" : this.targetObject(),
                                "permissions" : ["update"]
                            }
                        ]
                    },
                    {
                        "id": "delete",
                        "title": "Delete Config",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'billing-provider-delete', 48),
                        "click": function(billingProvider) {
                            self.onClickDelete(self.targetObject(), 'billing provider config', self.listLink('billingproviders'), Gitana.Utils.Image.buildImageUri('objects', 'billing-provider', 20), 'billing-provider');
                        },
                        "requiredAuthorities" : [
                            {
                                "permissioned" : this.targetObject(),
                                "permissions" : ["delete"]
                            }
                        ]
                    },
                    {
                        "id": "edit-json",
                        "title": "Edit JSON",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'json-edit', 48),
                        "url" : self.link(this.targetObject(), "edit", "json"),
                        "requiredAuthorities" : [
                            {
                                "permissioned" : this.targetObject(),
                                "permissions" : ["update"]
                            }
                        ]
                    },
                    {
                        "id": "export",
                        "title": "Export Config",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-export', 48),
                        "url" : self.LINK().call(self, self.targetObject(), 'export'),
                        "requiredAuthorities" : [
                            {
                                "permissioned" : self.targetObject(),
                                "permissions" : ["read"]
                            }
                        ]
                    }/*,
                    {
                        "id": "import",
                        "title": "Import Archive",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-import', 48),
                        "url" : self.LINK().call(self, self.targetObject(), 'import'),
                        "requiredAuthorities" : [
                            {
                                "permissioned" : self.targetObject(),
                                "permissions" : ["create_subobjects"]
                            }
                        ]
                    }*/
                ]);
            } else {
                self.addButtons([
                    {
                        "id": "edit",
                        "title": "Edit Config",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'billing-provider-edit', 48),
                        "url" : self.link(this.targetObject(), "edit"),
                        "requiredAuthorities" : [
                            {
                                "permissioned" : this.targetObject(),
                                "permissions" : ["update"]
                            }
                        ]
                    },
                    {
                        "id": "edit-json",
                        "title": "Edit JSON",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'json-edit', 48),
                        "url" : self.link(this.targetObject(), "edit", "json"),
                        "requiredAuthorities" : [
                            {
                                "permissioned" : this.targetObject(),
                                "permissions" : ["update"]
                            }
                        ]
                    }
                ]);

            }
        },

        setupBillingProviderOverview: function () {
            var self = this;
            var vault = self.targetObject();
            var pairs = {
                "title" : "Overview",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'vault', 20),
                "alert" : "",
                "items" : [
                    {
                        "key" : "ID",
                        "value" : self.listItemProp(vault, '_doc')
                    },
                    {
                        "key" : "Title",
                        "value" : self.listItemProp(vault, 'title')
                    },
                    {
                        "key" : "Description",
                        "value" : self.listItemProp(vault, 'description')
                    },
                    {
                        "key" : "Last Modified",
                        "value" : "By " + vault.getSystemMetadata().getModifiedBy() + " @ " + vault.getSystemMetadata().getModifiedOn().getTimestamp()
                    },
                    {
                        "key" : "Provider Id",
                        "value" : self.listItemProp(vault, 'providerId')
                    },
                    {
                        "key" : "Environment",
                        "value" : self.listItemProp(vault, 'environment')
                    },
                    {
                        "key" : "Merchant Id",
                        "value" : self.listItemProp(vault, 'merchantId')
                    },
                    {
                        "key" : "Public Key",
                        "value" : self.listItemProp(vault, 'publicKey')
                    },
                    {
                        "key" : "Private Key",
                        "value" : self.listItemProp(vault, 'privateKey')
                    }
                ]
            };

            this.pairs("billing-provider-overview", pairs);
        },

        setupDashlets: function (el, callback)
        {
            this.setupBillingProviderOverview();
            callback();
        },

        setupPage : function(el) {

            var title = this.friendlyTitle(this.targetObject());

            var page = {
                "title" : title,
                "description" : "Overview of billing provider config " + title + ".",
                "dashlets" : [
                    {
                        "id" : "overview",
                        "grid" : "grid_12",
                        "gadget" : "pairs",
                        "subscription" : "billing-provider-overview"
                    }
                ]
            };

            this.page(_mergeObject(page, this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.BillingProvider);

})(jQuery);

