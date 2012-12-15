(function($) {
    Gitana.Console.Pages.TrustedDomainMapping = Gitana.CMS.Pages.AbstractDashboardPageGadget.extend({
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/webhosts/{webhostId}/trusteddomainmappings/{trustedDomainMappingId}", this.index);
        },

        targetObject: function() {
            return this.trustedDomainMapping();
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
            this.menu(Gitana.Console.Menu.TrustedDomainMapping(this));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.TrustedDomainMapping(this));
        },

        setupToolbar: function() {
            var self = this;
            self.base();
            self.addButtons([
                {
                    "id": "edit",
                    "title": "Edit",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'auto-trusted-domain-edit', 48),
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
                    "title": "Delete",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'auto-trusted-domain-delete', 48),
                    "click": function(autoClientMapping) {
                        self.onClickDelete(self.targetObject(), 'trusted domain mapping', self.listLink('trusted-domain-mappings'), Gitana.Utils.Image.buildImageUri('objects', 'trusted-domain-mapping', 24), 'trusted domain mapping');
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
                    "title": "Export",
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

        setupTrustedDomainMappingOverview: function () {
            var self = this;
            var trustedDomainMapping = self.targetObject();

            var pairs = {
                "title" : "Overview",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'trusted-domain-mapping', 20),
                "alert" : "",
                "items" : [
                    {
                        "key" : "ID",
                        "value" : self.listItemProp(trustedDomainMapping, '_doc')
                    },
                    {
                        "key" : "Host",
                        "value" : self.listItemProp(trustedDomainMapping, 'host')
                    },
                    {
                        "key" : "Scope",
                        "value" : self.listItemProp(trustedDomainMapping, 'scope')
                    },
                    {
                        "key" : "Platform ID",
                        "value" : self.listItemProp(trustedDomainMapping, 'platformId')
                    }
                ]
            };

            this.pairs("trusted-domain-mapping-overview", pairs);
        },

        setupDashlets : function () {
            this.setupTrustedDomainMappingOverview();
        },

        setupPage : function(el) {

            var title = this.friendlyTitle(this.targetObject());

            var page = {
                "title" : title,
                "description" : "Overview of trusted domain mapping " + title + ".",
                "dashlets" : [
                    {
                        "id" : "overview",
                        "grid" : "grid_12",
                        "gadget" : "pairs",
                        "subscription" : "trusted-domain-mapping-overview"
                    }
                ]
            };

            this.page(Alpaca.mergeObject(page, this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.TrustedDomainMapping);

})(jQuery);
