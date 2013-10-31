(function($) {
    Gitana.Console.Pages.EmailProvider = Gitana.CMS.Pages.AbstractDashboardPageGadget.extend({

        setup: function() {
            this.get("/applications/{applicationId}/emailproviders/{emailProviderId}", this.index);
        },

        targetObject: function() {
            return this.emailProvider();
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
            this.menu(Gitana.Console.Menu.EmailProvider(this));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.EmailProvider(this));
        },

        setupToolbar: function() {
            var self = this;
            self.base();
            self.addButtons([
                {
                    "id": "edit",
                    "title": "Edit",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'emailprovider-edit', 48),
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
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'emailprovider-delete', 48),
                    "click": function(emailProvider) {
                        self.onClickDelete(self.targetObject(), 'email provider', self.listLink('emailproviders'), Gitana.Utils.Image.buildImageUri('objects', 'emailprovider', 20), 'email provider');
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
                }
            ]);

        },

        setupOverview: function () {
            var self = this;
            var emailProvider = self.targetObject();

            var pairs = {
                "title" : "Overview",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'emailprovider', 20),
                "alert" : "",
                "items" : []
            };

            var schema = Gitana.Console.Schema.EmailProvider;
            var options = Gitana.Console.Options.EmailProvider;

            for (var key in schema.properties)
            {
                var label = options.fields[key].label;
                if (!label) {
                    label = options.fields[key].rightLabel;
                }
                if (!label) {
                    label = schema.properties[key].title;
                }

                this._pushItem(pairs.items, {
                    "key" : label,
                    "value" : self.listItemProp(emailProvider, key)
                });
            }

            this._pushItem(pairs.items, {
                "key" : "Last Modified",
                "value" : "By " + emailProvider.getSystemMetadata().getModifiedBy() + " @ " + emailProvider.getSystemMetadata().getModifiedOn().getTimestamp()
            });

            this.pairs("emailprovider-overview", pairs);
        },

        setupDashlets : function (el, callback) {
            this.setupOverview();
            callback();
        },

        setupPage : function(el) {

            var title = this.friendlyTitle(this.targetObject());

            var page = {
                "title" : title,
                "description" : "Overview of email provider " + title + ".",
                "dashlets" : [
                    {
                        "id" : "overview",
                        "grid" : "grid_12",
                        "gadget" : "pairs",
                        "subscription" : "emailprovider-overview"
                    }
                ]
            };

            this.page(_mergeObject(page, this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.EmailProvider);

})(jQuery);

