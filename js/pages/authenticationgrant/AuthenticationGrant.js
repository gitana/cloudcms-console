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
                "title": "Edit",
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
                    "id": "delete",
                    "title": "Delete",
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
                "items" : []
            };
            this._pushItem(pairs.items, {
                "key" : "ID",
                "value" : self.listItemProp(authenticationGrant, '_doc')
            });
            this._pushItem(pairs.items, {
                "key" : "Title",
                "value" : self.listItemProp(authenticationGrant, 'title')
            });
            this._pushItem(pairs.items, {
                "key" : "Description",
                "value" : self.listItemProp(authenticationGrant, 'description')
            });
            this._pushItem(pairs.items, {
                "key" : "Key",
                "value" : authenticationGrant.getKey()
            });
            this._pushItem(pairs.items, {
                "key" : "Secret",
                "value" : '<code class="record-full-json">' + authenticationGrant.getSecret() + "</code>"
            });
            this._pushItem(pairs.items, {
                "key" : "Client ID",
                "value" : authenticationGrant.getClientId()
            });
            this._pushItem(pairs.items, {
                "key" : "Domain",
                "value" : authenticationGrant.getPrincipalDomainId()
            });
            this._pushItem(pairs.items, {
                "key" : "Principal",
                "value" : authenticationGrant.getPrincipalId()
            });
            this._pushItem(pairs.items, {
                "key" : "Allow Open Driver?",
                "value" : authenticationGrant.getAllowOpenDriverAuthentication() ? "Yes" : "No"
            });
            this._pushItem(pairs.items, {
                "key" : "Status",
                "value" : authenticationGrant.getEnabled() ? "Enabled" : "Disabled"
            });
            this._pushItem(pairs.items, {
                "key" : "Last Modified",
                "value" : "By " + authenticationGrant.getSystemMetadata().getModifiedBy() + " @ " + authenticationGrant.getSystemMetadata().getModifiedOn().getTimestamp()
            });

            Chain(this.contextObject()).readDomain(authenticationGrant.getPrincipalDomainId()).then(function() {

                self._updateItem(pairs.items, "Domain", "<a href='#" + self.link(this) + "'>" + self.friendlyTitle(this) + "</a>");

                this.readPrincipal(authenticationGrant.getPrincipalId()).then(function() {
                    var friendlyName = self.friendlyName(this);
                    var link = self.link(this);

                    self._updateItem(pairs.items, "Principal", "<a href='#" + link + "'>" + friendlyName + " (" + this.getName() + ")</a>");

                    self.pairs("authentication-grant-overview", pairs);
                });
            });

            Chain(this.contextObject()).readClient(authenticationGrant.getClientId()).then(function() {

                self._updateItem(pairs.items, "Client ID", "<a href='#" + self.link(this) + "'>" + self.friendlyTitle(this) + "</a>");

                self.pairs("authentication-grant-overview", pairs);
            });

            this.pairs("authentication-grant-overview", pairs);

        },

        setupDashlets : function (el, callback)
        {
            this.setupAuthenticationGrantOverview();
            callback();
        },

        setupPage : function(el) {

            var title = this.friendlyTitle(this.targetObject());

            var page = {
                "title" : title,
                "description" : "Overview of an Authentication Grant " + title,
                "dashlets" : [
                    {
                        "id" : "overview",
                        "grid" : "grid_12",
                        "gadget" : "pairs",
                        "subscription" : "authentication-grant-overview"
                    }
                ]
            };

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.AuthenticationGrant);

})(jQuery);

