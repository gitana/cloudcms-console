(function($) {
    Gitana.Console.Pages.Tenant = Gitana.CMS.Pages.AbstractDashboardPageGadget.extend({
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/registrars/{registrarId}/tenants/{tenantId}", this.index);
        },

        targetObject: function() {
            return this.tenant();
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
            this.menu(Gitana.Console.Menu.Tenant(this));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.Tenant(this));
        },

        setupToolbar: function() {
            var self = this;
            self.base();
            self.addButtons([
                {
                "id": "edit",
                "title": "Edit Tenant",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'tenant-edit', 48),
                    "url" : self.link(this.targetObject(),"edit"),
                    "requiredAuthorities" : [
                        {
                            "permissioned" : this.targetObject(),
                            "permissions" : ["update"]
                        }
                    ]
                },
                {
                "id": "delete",
                "title": "Delete Tenant",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'tenant-delete', 48),
                    "click": function(registrar) {
                        self.onClickDelete(self.targetObject(),'tenant',self.listLink('tenants'),Gitana.Utils.Image.buildImageUri('security', 'tenant', 20), 'tenant');
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
                    "url" : self.link(this.targetObject(),"edit","json"),
                    "requiredAuthorities" : [
                        {
                            "permissioned" : this.targetObject(),
                            "permissions" : ["update"]
                        }
                    ]
                }
            ]);
        },

        setupTenantOverview: function () {
            var self = this;
            var tenant = self.targetObject();
            var pairs = {
                "title" : "Overview",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'tenant', 20),
                "alert" : "",
                "items" : [
                    {
                        "key" : "ID",
                        "value" : self.listItemProp(tenant, '_doc')
                    },
                    {
                        "key" : "Title",
                        "value" : self.listItemProp(tenant, 'title')
                    },
                    {
                        "key" : "Description",
                        "value" : self.listItemProp(tenant, 'description')
                    },
                    {
                        "key" : "Plan",
                        "value" : self.listItemProp(tenant, 'planKey')
                    },
                    {
                        "key" : "Sub-Domain",
                        "value" : self.listItemProp(tenant, 'dnsSlug')
                    },
                    {
                        "key" : "Last Modified",
                        "value" : "By " + tenant.getSystemMetadata().getModifiedBy() + " @ " + tenant.getSystemMetadata().getModifiedOn().getTimestamp()
                    }
                ]
            };

            this.pairs("tenant-overview", pairs);
        },

        setupPlanOverview: function () {
            var self = this;
            var tenant = self.targetObject();
            var pairs = {
                "title" : "Plan",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'plan', 20),
                "alert" : "",
                "items" : [
                    {
                        "key" : "ID",
                        "value" : ""
                    },
                    {
                        "key" : "Key",
                        "value" : ""
                    },
                    {
                        "key" : "Title",
                        "value" : ""
                    },
                    {
                        "key" : "Description",
                        "value" : ""
                    }
                ]
            };

            this.pairs("tenant-plan", pairs);

            Chain(self.registrar()).readPlan(self.targetObject().get('planKey')).then(function(){
                pairs['items'][0]['value'] = this.getId();
                pairs['items'][0]['link']  = "#" + self.link(this);
                pairs['items'][1]['value'] = this.getPlanKey();
                pairs['items'][2]['value'] = self.listItemProp(this,"title");
                pairs['items'][3]['value'] = self.listItemProp(this,"description");
                self.pairs("tenant-plan", pairs);
            });
        },

        setupPrincipalOverview: function () {
            var self = this;
            var tenant = self.targetObject();
            var domainId = tenant.get('domainId');
            var principalId = tenant.get('principalId');
            var pairs = {
                "title" : "Principal User",
                "icon" : Gitana.Utils.Image.buildImageUri('security', 'user', 20),
                "alert" : "",
                "items" : [
                    {
                        "key" : "Domain",
                        "value" : ""
                    },
                    {
                        "key" : "Principal",
                        "value" : ""
                    },
                    {
                        "key" : "Full Name",
                        "value" : ""
                    },
                    {
                        "key" : "Email",
                        "value" : ""
                    },
                    {
                        "key" : "Company",
                        "value" : ""
                    }
                ]
            };

            this.pairs("tenant-principal", pairs);

            Chain(self.platform()).readDomain(domainId).then(function(){
                pairs['items'][0]['value'] = self.friendlyTitle(this);
                pairs['items'][0]['link']  = "#" + self.link(this);

                this.readPrincipal(principalId).then(function() {
                    pairs['items'][1]['value'] = this.getName();
                    pairs['items'][1]['link']  = "#" + self.link(this);
                    pairs['items'][2]['value'] = self.friendlyName(this);
                    if (this.getEmail()) {
                        pairs['items'][3]['value'] = this.getEmail();
                    }
                    if (this.getCompanyName()) {
                        pairs['items'][4]['value'] = this.getCompanyName();
                    }
                    self.pairs("tenant-principal", pairs);
                });
            });
        },

        setupMeterOverview: function() {
            var self = this;
            var tenant = self.targetObject();

            var setupMeter = function(title, meterType, observableName)
            {
                Chain(self.registrar()).queryMeters({ "tenantId": tenant.getId(), "meterType": meterType }).keepOne().then(function()
                {
                    var style = "width: 300px !important";
                    var pairs = {
                        "title" : title,
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'plan', 20),
                        "alert" : "",
                        "items" : [
                            {
                                "key" : "Meter Type",
                                "value" : "",
                                "style": style
                            },
                            {
                                "key" : "Meter Start",
                                "value" : "",
                                "style": style
                            },
                            {
                                "key" : "Meter End",
                                "value" : "",
                                "style": style
                            },
                            {
                                "key" : "Max Byte Count",
                                "value" : "",
                                "style": style
                            },
                            {
                                "key" : "Raw Byte Count",
                                "value" : "",
                                "style": style
                            },
                            {
                                "key" : "Raw Byte Count Percentage",
                                "value" : "",
                                "style": style
                            },
                            {
                                "key" : "Unprocessed Byte Count",
                                "value" : "",
                                "style": style
                            },
                            {
                                "key" : "Billable Byte Count",
                                "value" : "",
                                "style": style
                            },
                            {
                                "key" : "Billable Byte Count Percentage",
                                "value" : "",
                                "style": style
                            },
                            {
                                "key" : "Max Object Count",
                                "value" : "",
                                "style": style
                            },
                            {
                                "key" : "Raw Object Count",
                                "value" : "",
                                "style": style
                            },
                            {
                                "key" : "Raw Object Count Percentage",
                                "value" : "",
                                "style": style
                            },
                            {
                                "key" : "Unprocessed Object Count",
                                "value" : "",
                                "style": style
                            },
                            {
                                "key" : "Billable Object Count",
                                "value" : "",
                                "style": style
                            },
                            {
                                "key" : "Billable Object Count Percentage",
                                "value" : "",
                                "style": style
                            }
                        ]
                    };

                    pairs['items'][0]['value'] = self.listItemProp(this,"meterType");
                    pairs['items'][1]['value'] = self.listItemProp(this,"meterStart")["timestamp"];
                    pairs['items'][2]['value'] = self.listItemProp(this,"meterEnd")["timestamp"];

                    var maxByteCount = self.listItemProp(this,"maxByteCount");
                    if (maxByteCount == -1)
                    {
                        pairs['items'][3]['value'] = "-1 (Unlimited)";
                    }
                    else
                    {
                        pairs['items'][3]['value'] = maxByteCount + " bytes";
                    }

                    pairs['items'][4]['value'] = self.listItemProp(this,"rawByteCount") + " bytes";

                    var rawByteCountPercentage = self.listItemProp(this,"rawByteCountPercentage");
                    if (rawByteCountPercentage)
                    {
                        pairs['items'][5]['value'] = rawByteCountPercentage + "%";
                    }

                    pairs['items'][6]['value'] = self.listItemProp(this,"unprocessedByteCount") + " bytes";
                    pairs['items'][7]['value'] = self.listItemProp(this,"billableByteCount") + " bytes";

                    var billableByteCountPercentage = self.listItemProp(this,"billableByteCountPercentage");
                    if (billableByteCountPercentage)
                    {
                        pairs['items'][8]['value'] = billableByteCountPercentage + "%";
                    }

                    pairs['items'][9]['value'] = self.listItemProp(this,"maxObjectCount") + " objects";
                    pairs['items'][10]['value'] = self.listItemProp(this,"rawObjectCount") + " objects";

                    var rawObjectCountPercentage = self.listItemProp(this,"rawObjectCountPercentage");
                    if (rawObjectCountPercentage)
                    {
                        pairs['items'][11]['value'] = rawObjectCountPercentage + "%";
                    }
                    pairs['items'][12]['value'] = self.listItemProp(this,"unprocessedObjectCount") + " objects";
                    pairs['items'][13]['value'] = self.listItemProp(this,"billableObjectCount") + " objects";

                    var billableObjectCountPercentage = self.listItemProp(this,"billableObjectCountPercentage");
                    if (billableObjectCountPercentage)
                    {
                        pairs['items'][14]['value'] = billableObjectCountPercentage + "%";
                    }

                    self.pairs(observableName, pairs);
                });
            };

            setupMeter("Storage Meter", "STORAGE", "tenant-storage");
            setupMeter("Transfer Out Meter", "TRANSFER_OUT", "tenant-transferOut");
        },


        /*
        setupAuthenticationGrantOverview: function () {
            var self = this;
            var authenticationGrant = self.targetObject();
            var pairs = {
                "title" : "Authentication Grant",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'authentication-grant', 20),
                "alert" : "",
                "items" : [
                    {
                        "key" : "ID",
                        "value" : ""
                    },
                    {
                        "key" : "Client Id",
                        "value" : ""
                    },
                    {
                        "key" : "Secret",
                        "value" : ""
                    },
                    {
                        "key" : "Access Token",
                        "value" : ""
                    },
                    {
                        "key" : "Status",
                        "value" : ""
                    },
                    {
                        "key" : "Last Modified",
                        "value" : ""
                    }
                ]
            };

            var tenantPlatform = this.targetObject().getPlatform();

            var defaultClientObject;

            Chain().then(function() {

                var f0 = function() {
                    this.subchain(self.targetObject()).readDefaultAllocatedClientObject(function(clientObject) {

                        defaultClientObject = this;
                        pairs['items'][1]['value'] = clientObject["key"];
                        pairs['items'][2]['value'] = '<pre class="record-full-json">' + clientObject["secret"] + "</pre>";
                    });

                    this.then(function() {
                        this.subchain(tenantPlatform).queryAuthenticationGrants({
                            "clientId" : defaultClientObject["key"]
                        }, {
                            "skip" : 0,
                            "limit" : 1
                        }).count(function(count) {
                            if (count > 0) {
                                this.keepOne().then(function() {
                                    var authenticationGrant = this;
                                    pairs['items'][0]['value'] = authenticationGrant.getId();
                                    pairs['items'][3]['value'] = authenticationGrant.getKey();
                                    pairs['items'][4]['value'] = authenticationGrant.getEnabled() ? "Enabled" : "Disabled"
                                    pairs['items'][5]['value'] = "By " + authenticationGrant.getSystemMetadata().getModifiedBy() + " @ " + authenticationGrant.getSystemMetadata().getModifiedOn().getTimestamp()
                                });
                            }
                        });
                    });
                };

                this.then([f0]).then(function() {
                    self.pairs("tenant-authentication-grant", pairs);
                });
            });

            this.pairs("tenant-authentication-grant", pairs);

        },
        */

        setupAutoClientMappingsOverview: function () {
            var self = this;
            var tenant = self.targetObject();
            var pairs = {
                "title" : "Automatic Client Mappings",
                "icon" : Gitana.Utils.Image.buildImageUri('security', 'user', 20),
                "alert" : "",
                "items" : []
            };

            Chain(tenant).listAutoClientMappingObjects(function(objects) {

                if (objects.length > 0)
                {
                    for (var i = 0; i < objects.length; i++)
                    {
                        var object = objects[i];
                        pairs['items'].push({
                            "img" : Gitana.Utils.Image.buildImageUri('objects', 'domain', 48),
                            "class" : "block-list-item-img",
                            "value" : object["uri"] + "<div class='block-list-item-desc'>Application: " + object["applicationId"] + ", Client Key: " + object["clientKey"] + "</div>",
                            "link" : object["uri"]
                        });
                    }
                }
                self.processItemsDashlet(objects.length,pairs,"");
                self.pairs("tenant-autoclientmappings", pairs);
            });
        },


        setupDashlets : function () {
            this.setupTenantOverview();
            this.setupPlanOverview();
            this.setupPrincipalOverview();
            this.setupMeterOverview();
            //this.setupAuthenticationGrantOverview();
            this.setupAutoClientMappingsOverview();
        },

        setupPage : function(el) {

            var self = this;

            var tenant = this.targetObject();

            var title = this.friendlyTitle(tenant);

            var page = {
                "title" : title,
                "description" : "Overview of tenant " + title + ".",
                "dashlets" : [
                    {
                        "id" : "overview",
                        "grid" : "grid_12",
                        "gadget" : "pairs",
                        "subscription" : "tenant-overview"
                    },{
                        "id" : "tenant-plan",
                        "grid" : "grid_12",
                        "gadget" : "pairs",
                        "subscription" : "tenant-plan"
                    },{
                        "id" : "tenant-principal",
                        "grid" : "grid_12",
                        "gadget" : "pairs",
                        "subscription" : "tenant-principal"
                    },
                    /*
                    {
                        "id" : "tenant-authentication-grant",
                        "grid" : "grid_12",
                        "gadget" : "pairs",
                        "subscription" : "tenant-authentication-grant"
                    }
                    */
                    {
                        "id" : "tenant-autoclientmappings",
                        "grid" : "grid_12",
                        "gadget" : "pairs",
                        "subscription" : "tenant-autoclientmappings"
                    }
                ]
            };

            // meters
            page.dashlets.push({
                "id": "tenant-storage",
                "grid": "grid_12",
                "gadget": "pairs",
                "subscription": "tenant-storage"
            });
            page.dashlets.push({
                "id": "tenant-transferOut",
                "grid": "grid_12",
                "gadget": "pairs",
                "subscription": "tenant-transferOut"
            });

            self.page(_mergeObject(page, self.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.Tenant);

})(jQuery);

