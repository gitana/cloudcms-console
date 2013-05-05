(function($) {
    Gitana.Console.Pages.Registrar = Gitana.CMS.Pages.AbstractDashboardPageGadget.extend({
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/registrars/{registrarId}", this.index);
        },

        targetObject: function() {
            return this.registrar();
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
            this.menu(Gitana.Console.Menu.Registrar(this));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.Registrar(this));
        },

        setupToolbar: function() {
            var self = this;
            self.base();
            if (this.targetObject().getId() != "default") {
                self.addButtons([
                    {
                        "id": "edit",
                        "title": "Edit Registrar",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'registrar-edit', 48),
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
                        "title": "Delete Registrar",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'registrar-delete', 48),
                        "click": function(registrar) {
                            self.onClickDelete(self.targetObject(), 'registrar', self.listLink('registrars'), Gitana.Utils.Image.buildImageUri('security', 'registrar', 20), 'registrar');
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
                    }
                ]);
            } else {
                self.addButtons([
                    {
                        "id": "edit",
                        "title": "Edit Registrar",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'registrar-edit', 48),
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
            self.addButtons([
                {
                    "id": "export",
                    "title": "Export Registrar",
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
        },

        setupRegistrarOverview: function () {
            var self = this;
            var registrar = self.targetObject();
            var pairs = {
                "title" : "Overview",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'registrar', 20),
                "alert" : "",
                "items" : []
            };
            this._pushItem(pairs.items, {
                "key" : "ID",
                "value" : self.listItemProp(registrar, '_doc')
            });
            this._pushItem(pairs.items, {
                "key" : "Title",
                "value" : self.listItemProp(registrar, 'title')
            });
            this._pushItem(pairs.items, {
                "key" : "Description",
                "value" : self.listItemProp(registrar, 'description')
            });
            this._pushItem(pairs.items, {
                "key" : "Last Modified",
                "value" : "By " + registrar.getSystemMetadata().getModifiedBy() + " @ " + registrar.getSystemMetadata().getModifiedOn().getTimestamp()
            });

            this.pairs("registrar-overview", pairs);
        },

        setupDashlets : function () {
            this.setupRegistrarOverview();
        },

        setupPage : function(el) {

            var title = this.friendlyTitle(this.targetObject());

            var page = {
                "title" : title,
                "description" : "Overview of registrar " + title + ".",
                "dashlets" : [
                    {
                        "id" : "overview",
                        "grid" : "grid_12",
                        "gadget" : "pairs",
                        "subscription" : "registrar-overview"
                    }
                ]
            };

            this.page(_mergeObject(page, this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.Registrar);

})(jQuery);

