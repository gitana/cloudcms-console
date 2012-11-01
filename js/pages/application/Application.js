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
                        "title": "Edit Application",
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
                        "id": "delete",
                        "title": "Delete Application",
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
                        "title": "Edit Application",
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
                    "title": "Export Application",
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
                    "title": "Import Archive",
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
                "items" : [
                    {
                        "key" : "ID",
                        "value" : self.listItemProp(application, '_doc')
                    },
                    {
                        "key" : "Key",
                        "value" : self.listItemProp(application, 'key')
                    },
                    {
                        "key" : "Title",
                        "value" : self.listItemProp(application, 'title')
                    },
                    {
                        "key" : "Description",
                        "value" : self.listItemProp(application, 'description')
                    },
                    {
                        "key" : "Last Modified",
                        "value" : "By " + application.getSystemMetadata().getModifiedBy() + " @ " + application.getSystemMetadata().getModifiedOn().getTimestamp()
                    }
                ]
            };

            this.pairs("application-overview", pairs);
        },

        setupAutoHostingOverview: function () {
            var self = this;
            var application = self.targetObject();
            var pairs = {
                "title" : "Application Hosting",
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
                            "link" : object["uri"]
                        });
                    }
                }
                self.processItemsDashlet(objects.length, pairs, "");
                self.pairs("application-autoclientmappings", pairs);
            });
        },


        setupDashlets : function () {
            this.setupApplicationOverview();
            this.setupAutoHostingOverview();
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
                    }
                ]
            };

            this.page(Alpaca.mergeObject(page, this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.Application);

})(jQuery);

