(function($) {
    Gitana.Console.Pages.AuthenticationGrant = Gitana.CMS.Pages.AbstractDashboardPageGadget.extend({
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/authenticationgrants/{authenticationGrantId}", this.index);
        },

        targetObject: function() {
            return this.authenticationGrant();
        },

        contextObject: function() {
            return this.platform();
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
            this.menu(Gitana.Console.Menu.AuthenticationGrant(this));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.AuthenticationGrant(this));
        },

        setupToolbar: function() {
            var self = this;
            self.base();
            self.addButtons([
                {
                "id": "edit",
                "title": "Edit Auth Grant",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'authentication-grant-edit', 48),
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
                "title": "Delete Auth Grant",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'authentication-grant-delete', 48),
                    "click": function(authenticationGrant) {
                        self.onClickDelete(self.targetObject(),'authenticationGrant',self.listLink('authenticationGrants'),Gitana.Utils.Image.buildImageUri('objects', 'authentication-grant', 20), 'authenticationGrant');
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
                },
                {
                    "id": "export",
                    "title": "Export Auth Grant",
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

        setupAuthenticationGrantOverview: function () {
            var self = this;
            var authenticationGrant = self.targetObject();
            var pairs = {
                "title" : "Overview",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'authentication-grant', 20),
                "alert" : "",
                "items" : [
                    {
                        "key" : "ID",
                        "value" : self.listItemProp(authenticationGrant, '_doc')
                    },
                    {
                        "key" : "Title",
                        "value" : self.listItemProp(authenticationGrant, 'title')
                    },
                    {
                        "key" : "Description",
                        "value" : self.listItemProp(authenticationGrant, 'description')
                    },
                    {
                        "key" : "Key",
                        "value" : authenticationGrant.getKey()
                    },
                    {
                        "key" : "Secret",
                        "value" : '<pre class="record-full-json">' + authenticationGrant.getSecret() + "</pre>"
                    },
                    {
                        "key" : "Client Id",
                        "value" : authenticationGrant.getClientId()
                    },
                    {
                        "key" : "Domain",
                        "value" : authenticationGrant.getPrincipalDomainId()
                    },
                    {
                        "key" : "Principal",
                        "value" : authenticationGrant.getPrincipalId()
                    },
                    {
                        "key" : "Allow Open Driver?",
                        "value" : authenticationGrant.getAllowOpenDriverAuthentication() ? "Yes" : "No"
                    },
                    {
                        "key" : "Status",
                        "value" : authenticationGrant.getEnabled() ? "Enabled" : "Disabled"
                    },
                    {
                        "key" : "Last Modified",
                        "value" : "By " + authenticationGrant.getSystemMetadata().getModifiedBy() + " @ " + authenticationGrant.getSystemMetadata().getModifiedOn().getTimestamp()
                    }
                ]
            };

            Chain(this.contextObject()).readDomain(authenticationGrant.getPrincipalDomainId()).then(function() {

                pairs['items'][6]['value'] = "<a href='#" + self.link(this) + "'>" + self.friendlyTitle(this) + "</a>";

                this.readPrincipal(authenticationGrant.getPrincipalId()).then(function() {
                    var friendlyName = self.friendlyName(this);
                    var link = self.link(this);
                    pairs['items'][7]['value'] = "<a href='#" + link + "'>" + friendlyName + " (" + this.getName() + ")</a>";
                    self.pairs("authentication-grant-overview", pairs);
                });
            });

            this.pairs("authentication-grant-overview", pairs);

        },

        setupDashlets : function () {
            this.setupAuthenticationGrantOverview();
        },

        setupPage : function(el) {

            var title = this.friendlyTitle(this.targetObject());

            var page = {
                "title" : title,
                "description" : "Overview of Authentication Grant " + title + ".",
                "dashlets" : [
                    {
                        "id" : "overview",
                        "grid" : "grid_12",
                        "gadget" : "pairs",
                        "subscription" : "authentication-grant-overview"
                    }
                ]
            };

            this.page(Alpaca.mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.AuthenticationGrant);

})(jQuery);

