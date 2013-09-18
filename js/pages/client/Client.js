(function($) {
    Gitana.Console.Pages.Client = Gitana.CMS.Pages.AbstractDashboardPageGadget.extend({
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/clients/{clientId}", this.index);
        },

        targetObject: function() {
            return this.client();
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
            this.menu(Gitana.Console.Menu.Client(this));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.Client(this));
        },

        setupToolbar: function() {
            var self = this;
            self.base();
            self.addButtons([
                {
                "id": "edit",
                "title": "Edit",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'client-edit', 48),
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
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'client-delete', 48),
                    "click": function(client) {
                        self.onClickDelete(self.targetObject(),'client',self.listLink('clients'),Gitana.Utils.Image.buildImageUri('security', 'client', 20), 'client');
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

        setupClientOverview: function () {
            var self = this;
            var client = self.targetObject();
            var domainUrls = client.getDomainUrls() ? client.getDomainUrls().join('<br/>') : ""
            var authorizedGrantTypes = client.getAuthorizedGrantTypes() ? client.getAuthorizedGrantTypes().join('<br/>') : ""
            var scope = client.getScope() ? client.getScope().join('<br/>') : ""
            var pairs = {
                "title" : "Overview",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'client', 20),
                "alert" : "",
                "items" : []
            };
            this._pushItem(pairs.items, {
                "key" : "ID",
                "value" : self.listItemProp(client, '_doc')
            });
            this._pushItem(pairs.items, {
                "key" : "Title",
                "value" : self.listItemProp(client, 'title')
            });
            this._pushItem(pairs.items, {
                "key" : "Description",
                "value" : self.listItemProp(client, 'description')
            });
            this._pushItem(pairs.items, {
                "key" : "Key",
                "value" : client.getKey()
            });
            this._pushItem(pairs.items, {
                "key" : "Secret",
                "value" : '<code class="record-full-json">' + client.getSecret() + "</code>"
            });
            this._pushItem(pairs.items, {
                "key" : "Open Driver",
                "value" : client.getAllowOpenDriverAuthentication() ? "Authentication Allowed" : "Authentication Not Allowed"
            });
            this._pushItem(pairs.items, {
                "key" : "Domain URLs",
                "value" : '<div style="display: inline-block;vertical-align: top;">' + domainUrls + '</div>'
            });
            this._pushItem(pairs.items, {
                "key" : "Authorized Grant Types",
                "value" : '<div style="display: inline-block;vertical-align: top;">' + authorizedGrantTypes + '</div>'
            });
            this._pushItem(pairs.items, {
                "key" : "Scope",
                "value" : '<div style="display: inline-block;vertical-align: top;">' + scope + '</div>'
            });
            this._pushItem(pairs.items, {
                "key" : "Enabled",
                "value" : client.getEnabled()
            });
            this._pushItem(pairs.items, {
                "key" : "Allow Guest Login",
                "value" : client["allowGuestLogin"]
            });
            this._pushItem(pairs.items, {
                "key" : "Last Modified",
                "value" : "By " + client.getSystemMetadata().getModifiedBy() + " @ " + client.getSystemMetadata().getModifiedOn().getTimestamp()
            });

            this.pairs("client-overview", pairs);
        },

        setupDashlets : function (el, callback) {
            this.setupClientOverview();
            callback();
        },

        setupPage : function(el) {

            var title = this.friendlyTitle(this.targetObject());

            var page = {
                "title" : title,
                "description" : "Overview of client " + title + ".",
                "dashlets" : [
                    {
                        "id" : "overview",
                        "grid" : "grid_12",
                        "gadget" : "pairs",
                        "subscription" : "client-overview"
                    }
                ]
            };

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.Client);

})(jQuery);

