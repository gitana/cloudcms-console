(function($) {
    Gitana.Console.Pages.AutoClientMapping = Gitana.CMS.Pages.AbstractDashboardPageGadget.extend({
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/webhosts/{webhostId}/autoclientmappings/{autoClientMappingId}", this.index);
        },

        targetObject: function() {
            return this.autoClientMapping();
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
            this.menu(Gitana.Console.Menu.AutoClientMapping(this));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.AutoClientMapping(this));
        },

        setupToolbar: function() {
            var self = this;
            self.base();
            self.addButtons([
                {
                    "id": "edit",
                    "title": "Edit Auto Client Mapping",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'auto-client-mapping-edit', 48),
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
                    "title": "Delete Auto Client Mapping",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'auto-client-mapping-delete', 48),
                    "click": function(autoClientMapping) {
                        self.onClickDelete(self.targetObject(), 'auto client mapping', self.listLink('auto-client-mappings'), Gitana.Utils.Image.buildImageUri('objects', 'auto-client-mapping', 20), 'auto client mapping');
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
                    "title": "Export Auto Client Mapping",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-export', 48),
                    "url" : self.LINK().call(self, self.targetObject(), 'export'),
                    "requiredAuthorities" : [
                        {
                            "permissioned" : self.targetObject(),
                            "permissions" : ["read"]
                        }
                    ]
                }
            ]);

        },

        setupAutoClientMappingOverview: function () {
            var self = this;
            var autoClientMapping = self.targetObject();

            var pairs = {
                "title" : "Overview",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'auto-client-mapping', 20),
                "alert" : "",
                "items" : [
                    {
                        "key" : "ID",
                        "value" : self.listItemProp(autoClientMapping, '_doc')
                    },
                    {
                        "key" : "Source URI",
                        "value" : self.listItemProp(autoClientMapping, 'uri')
                    },
                    {
                        "key" : "Client",
                        "value" : self.listItemProp(autoClientMapping, 'clientKey')
                    },
                    {
                        "key" : "Application",
                        "value" : self.listItemProp(autoClientMapping, 'applicationId')
                    },
                    {
                        "key" : "Tenant Id",
                        "value" : self.listItemProp(autoClientMapping, 'tenantId')
                    },
                    {
                        "key" : "Auto Manage",
                        "value" : self.listItemProp(autoClientMapping, 'automanage')
                    },
                    {
                        "key" : "Last Modified",
                        "value" : "By " + autoClientMapping.getSystemMetadata().getModifiedBy() + " @ " + autoClientMapping.getSystemMetadata().getModifiedOn().getTimestamp()
                    }
                ]
            };

            var platform = Chain(this.platform());

            Chain().then(function() {

                var f00 = function() {
                    this.subchain(platform).readClient(autoClientMapping.getTargetClientKey()).then(function () {
                        var title = this.getTitle() ? this.getTitle() : this.getKey();
                        pairs.items[2]['value'] = "<a href='#" + self.link(this) +"'>" + title + "</a>";
                    });
                };
                var f01 = function() {
                    this.subchain(platform).readApplication(autoClientMapping.getTargetApplicationId()).then(function () {
                        var title = this.getTitle() ? this.getTitle() : this.getId();
                        pairs.items[3]['value'] = "<a href='#" + self.link(this) +"'>" + title + "</a>";
                    });
                };

                this.then([f00,f01]).then(function() {
                    self.pairs("auto-client-mapping-overview", pairs);
                });
            });

            this.pairs("auto-client-mapping-overview", pairs);
        },

        setupDashlets : function () {
            this.setupAutoClientMappingOverview();
        },

        setupPage : function(el) {

            var title = this.friendlyTitle(this.targetObject());

            var page = {
                "title" : title,
                "description" : "Overview of auto client mapping " + title + ".",
                "dashlets" : [
                    {
                        "id" : "overview",
                        "grid" : "grid_12",
                        "gadget" : "pairs",
                        "subscription" : "auto-client-mapping-overview"
                    }
                ]
            };

            this.page(Alpaca.mergeObject(page, this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.AutoClientMapping);

})(jQuery);

