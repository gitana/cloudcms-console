(function($) {
    Gitana.Console.Pages.Application = Gitana.CMS.Pages.AbstractDashboardPageGadget.extend({
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/applications/{applicationId}", this.index);
        },

        targetObject: function() {
            return this.application();
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
            this.menu(Gitana.Console.Menu.Application(this));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.Application(this));
        },

        setupToolbar: function() {
            var self = this;
            self.base();

            if (self.targetObject().get('key') == null || self.targetObject().get('key') != 'console') {
                self.addButtons([
                    {
                        "id": "edit",
                        "title": "Edit",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'application-edit', 48),
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
                    },
                    {
                        "id": "delete",
                        "title": "Delete",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'application-delete', 48),
                        "click": function(application) {
                            self.onClickDelete(self.targetObject(), 'application', self.listLink('applications'), Gitana.Utils.Image.buildImageUri('objects', 'application', 20), 'application');
                        },
                        "requiredAuthorities" : [
                            {
                                "permissioned" : this.targetObject(),
                                "permissions" : ["delete"]
                            }
                        ]
                    }
                ]);
            } else {
                self.addButtons([
                    {
                        "id": "edit",
                        "title": "Edit",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'application-edit', 48),
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
                    "title": "Export",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-export', 48),
                    "url" : self.LINK().call(self, self.targetObject(), 'export'),
                    "requiredAuthorities" : [
                        {
                            "permissioned" : self.targetObject(),
                            "permissions" : ["read"]
                        }
                    ]
                },
                {
                    "id": "import",
                    "title": "Import",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-import', 48),
                    "url" : self.LINK().call(self, self.targetObject(), 'import'),
                    "requiredAuthorities" : [
                        {
                            "permissioned" : self.targetObject(),
                            "permissions" : ["create_subobjects"]
                        }
                    ]
                }
            ]);
        },

        setupApplicationOverview: function () {
            var self = this;
            var application = self.targetObject();
            var pairs = {
                "title" : "Overview",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'application', 20),
                "alert" : "",
                "items" : []
            };
            this._pushItem(pairs.items, {
                "key" : "ID",
                "value" : application["_doc"]
            });
            this._pushItem(pairs.items, {
                "key" : "Key",
                "value" : application.key
            });
            this._pushItem(pairs.items, {
                "key" : "Title",
                "value" : application.title
            });
            this._pushItem(pairs.items, {
                "key" : "Description",
                "value" : application.description
            });
            this._pushItem(pairs.items, {
                "key" : "Last Modified",
                "value" : "By " + application.getSystemMetadata().getModifiedBy() + " @ " + application.getSystemMetadata().getModifiedOn().getTimestamp()
            });
            this._pushItem(pairs.items, {
                "key" : "Application Type",
                "value" : application.applicationType
            });
            if (application.applicationType == "web") {
                this._pushItem(pairs.items, {
                    "key" : "Trusted Scope",
                    "value" : application.trustedScope
                });
                this._pushItem(pairs.items, {
                    "key" : "Trusted Host",
                    "value" : application.trustedHost
                });
            }
            if (application.applicationType == "trusted") {
                if (application.source) {
                    this._pushItem(pairs.items, {
                        "key" : "Source Type",
                        "value" : application.source && application.source.type ? application.source.type : ""
                    });
                    this._pushItem(pairs.items, {
                        "key" : "Source Public",
                        "value" : application.source && application.source["public"] ? application.source["public"] : ""
                    });
                    this._pushItem(pairs.items, {
                        "key" : "Source URI",
                        "value" : application.source && application.source.uri ? application.source.uri : ""
                    });
                }

                // TODO: deployments
            }
            this._pushItem(pairs.items, {
                "key" : "Stack",
                "value" : "None"
            });

            // public api properties
            if (application["public"])
            {
                if (application["public"].runAsPrincipalId)
                {
                    this._pushItem(pairs.items, {
                        "key": "Public RunAs Principal",
                        "value": application["public"].runAsPrincipalId
                    });
                }
                if (application["public"].emailProviderId)
                {
                    this._pushItem(pairs.items, {
                        "key": "Email Provider",
                        "value": application["public"].emailProviderId
                    });
                }
                if (application["public"].userDomainId)
                {
                    this._pushItem(pairs.items, {
                        "key": "User Domain",
                        "value": application["public"].userDomainId
                    });
                }
                if (application["public"].tenantRegistrarId)
                {
                    this._pushItem(pairs.items, {
                        "key": "Tenant Registrar",
                        "value": application["public"].tenantRegistrarId
                    });
                }
            }

            Chain(this.contextObject()).trap(function() {
                // no stack found... no problem
            }).findStack().then(function() {
                self._updateItem(pairs.items, "Stack", "<a href='#" + self.link(this) + "'>" + self.friendlyTitle(this) + "</a>");
                self.pairs("application-overview", pairs);
            });

            this.pairs("application-overview", pairs);
        },

        setupAutoHostingOverview: function () {
            var self = this;
            var application = self.targetObject();
            var pairs = {
                "title" : "Web Application Hosting",
                "icon" : Gitana.Utils.Image.buildImageUri('security', 'user', 20),
                "alert" : "",
                "items" : []
            };

            Chain(application).listAutoClientMappingObjects(function(objects) {

                if (objects.length > 0) {
                    for (var i = 0; i < objects.length; i++) {
                        var object = objects[i];
                        pairs['items'].push({
                            "img" : Gitana.Utils.Image.buildImageUri('objects', 'domain', 48),
                            "class" : "block-list-item-img",
                            "value" : object["uri"] + "<div class='block-list-item-desc'>Application: " + object["applicationId"] + ", Client Key: " + object["clientKey"] + "</div>",
                            "link" : object["uri"],
                            "linkTarget": "_blank"
                        });
                    }
                }
                self.processItemsDashlet(objects.length, pairs, "");
                self.pairs("application-autoclientmappings", pairs);
            });
        },

        setupTrustedDomainMappingOverview: function () {
            var self = this;
            var application = self.targetObject();
            var pairs = {
                "title" : "Trusted Domain Mappings",
                "icon" : Gitana.Utils.Image.buildImageUri('security', 'user', 20),
                "alert" : "",
                "items" : []
            };

            Chain(application).listTrustedDomainMappingObjects(function(objects) {

                if (objects.length > 0) {
                    for (var i = 0; i < objects.length; i++) {
                        var object = objects[i];
                        pairs['items'].push({
                            "img" : Gitana.Utils.Image.buildImageUri('objects', 'trusted-domain-mapping', 48),
                            "class" : "block-list-item-img",
                            "value" : object["host"] + "<div class='block-list-item-desc'>Scope: " + object["scope"] + "</div>"
                        });
                    }
                }
                self.processItemsDashlet(objects.length, pairs, "");
                self.pairs("application-trusteddomainmappings", pairs);
            });
        },


        setupDashlets: function (el, callback)
        {
            this.setupApplicationOverview();
            this.setupAutoHostingOverview();
            this.setupTrustedDomainMappingOverview();

            callback();
        },

        setupPage : function(el) {

            var title = this.friendlyTitle(this.targetObject());

            var page = {
                "title" : title,
                "description" : "Overview of application " + title + ".",
                "dashlets" : [
                    {
                        "id" : "overview",
                        "grid" : "grid_12",
                        "gadget" : "pairs",
                        "subscription" : "application-overview"
                    },
                    {
                        "id" : "autoclientmappings",
                        "grid" : "grid_12",
                        "gadget" : "pairs",
                        "subscription" : "application-autoclientmappings"
                    },
                    {
                        "id" : "trusteddomainmappings",
                        "grid" : "grid_12",
                        "gadget" : "pairs",
                        "subscription" : "application-trusteddomainmappings"
                    }
                ]
            };

            this.page(_mergeObject(page, this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.Application);

})(jQuery);

