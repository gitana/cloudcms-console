(function($) {
    Gitana.Console.Pages.Plan = Gitana.CMS.Pages.AbstractDashboardPageGadget.extend({
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/registrars/{registrarId}/plans/{planId}", this.index);
        },

        targetObject: function() {
            return this.plan();
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
            this.menu(Gitana.Console.Menu.Plan(this));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.Plan(this));
        },

        setupToolbar: function() {
            var self = this;
            self.base();
            self.addButtons([
                {
                    "id": "edit",
                    "title": "Edit Plan",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'plan-edit', 48),
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
                    "title": "Delete Plan",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'plan-delete', 48),
                    "click": function(plan) {
                        self.onClickDelete(self.targetObject(), 'plan', self.listLink('plans'), Gitana.Utils.Image.buildImageUri('security', 'plan', 20), 'plan');
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
                    "title": "Export Plan",
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

        setupPlanOverview: function () {
            var self = this;
            var plan = self.targetObject();
            var style = "width: 175px !important";
            var pairs = {
                "title" : "Overview",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'plan', 20),
                "alert" : "",
                "items" : []
            };
            this._pushItem(pairs.items, {
                "key" : "ID",
                "style": style,
                "value" : self.listItemProp(plan, '_doc')
            });
            this._pushItem(pairs.items, {
                "key" : "Title",
                "style": style,
                "value" : self.listItemProp(plan, 'title')
            });
            this._pushItem(pairs.items, {
                "key" : "Description",
                "style": style,
                "value" : self.listItemProp(plan, 'description')
            });
            this._pushItem(pairs.items, {
                "key" : "Plan Key",
                "style": style,
                "value" : self.listItemProp(plan, 'planKey')
            });
            this._pushItem(pairs.items, {
                "key" : "Last Modified",
                "style": style,
                "value" : "By " + plan.getSystemMetadata().getModifiedBy() + " @ " + plan.getSystemMetadata().getModifiedOn().getTimestamp()
            });
            this._pushItem(pairs.items, {
                "key" : "Requires Billing",
                "style": style,
                "value" : self.listItemProp(plan, 'requiresBilling')
            });

            // BASE
            if (plan.get("base"))
            {
                this._pushItem(pairs.items, {
                    "key" : "Base Price",
                    "style": style,
                    "value" : plan.get("base")["price"]
                });
                this._pushItem(pairs.items, {
                    "key" : "Base Schedule",
                    "style": style,
                    "value" : plan.get("base")["schedule"]
                });
            }

            // STORAGE
            if (plan.get("storage"))
            {
                this._pushItem(pairs.items, {
                    "key" : "Storage Unit",
                    "style": style,
                    "value" : plan.get("storage")["unit"]
                });
                this._pushItem(pairs.items, {
                    "key" : "Storage Allowance",
                    "style": style,
                    "value" : plan.get("storage")["allowance"]
                });
                this._pushItem(pairs.items, {
                    "key" : "Storage Price",
                    "style": style,
                    "value" : plan.get("storage")["price"]
                });
                this._pushItem(pairs.items, {
                    "key" : "Storage Addon Key",
                    "style": style,
                    "value" : plan.get("storage")["addonKey"]
                });
                this._pushItem(pairs.items, {
                    "key" : "Storage Max",
                    "style": style,
                    "value" : plan.get("storage")["max"]
                });
            }

            this.pairs("plan-overview", pairs);
        },

        setupDashlets : function () {
            this.setupPlanOverview();
        },

        setupPage : function(el) {

            var title = this.friendlyTitle(this.targetObject());

            var page = {
                "title" : title,
                "description" : "Overview of plan " + title + ".",
                "dashlets" : [
                    {
                        "id" : "overview",
                        "grid" : "grid_12",
                        "gadget" : "pairs",
                        "subscription" : "plan-overview"
                    }
                ]
            };

            this.page(_mergeObject(page, this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.Plan);

})(jQuery);

