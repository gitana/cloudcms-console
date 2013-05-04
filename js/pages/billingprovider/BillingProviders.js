(function($) {
    Gitana.Console.Pages.BillingProviders = Gitana.CMS.Pages.AbstractListPageGadget.extend(
    {
        SUBSCRIPTION : "billing-providers",

        FILTER : "billing-provider-list-filters",

        FILTER_TOOLBAR: {
            "query" : {
                "title" : "Query Billing Provider Configs",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'query', 48)
            }
        },

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/billingproviders", this.index);
        },

        contextObject: function() {
            return this.platform();
        },

        /** TODO: what should we check? **/
        requiredAuthorities: function() {
            return [
                {
                    "permissioned" : this.contextObject(),
                    "permissions" : ["read"]
                }
            ];
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Platform(this,"menu-platform-billing-providers"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.BillingProviders(this));
        },

        setupToolbar: function() {
            this.base();
            this.addButtons([
                {
                "id": "create",
                "title": "New Billing Provider Config",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'billing-provider-add', 48),
                    "url" : '/add/billingprovider',
                    "requiredAuthorities" : [
                        {
                            "permissioned" : this.contextObject(),
                            "permissions" : ["create_subobjects"]
                        }
                    ]
                },
                {
                    "id": "import",
                    "title": "Import Archive",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-import', 48),
                    "url" : this.LINK().call(this, this.contextObject(), 'import'),
                    "requiredAuthorities" : [
                        {
                            "permissioned" : this.contextObject(),
                            "permissions" : ["create_subobjects"]
                        }
                    ]
                }
            ]);
        },

        /** OVERRIDE **/
        setupList: function(el) {
            var self = this;

            // define the list
            var list = self.defaultList();

            list["actions"] = self.actionButtons({
                "edit": {
                    "title": "Edit Billing Provider Config",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'billing-provider-edit', 48),
                    "click": function(billingProvider){
                        self.app().run("GET", self.link(billingProvider,'edit'));
                    },
                    "requiredAuthorities" : {
                        "permissions" : ["update"]
                    }
                },
                "delete": {
                    "title": "Delete Billing Provider Configs",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'billing-provider-delete', 48),
                    "click": function(billingProviders) {
                        self.onClickDeleteMultiple(self.platform(), billingProviders , "billing provider config", self.listLink('billing-providers') , Gitana.Utils.Image.buildImageUri('objects', 'billing-provider', 20), 'billing-provider');
                    },
                    "selection" : "multiple",
                    "requiredAuthorities" : {
                        "permissions" : ["delete"]
                    }
                },
                "editJSON": {
                    "title": "Edit JSON",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'json-edit', 48),
                    "click": function(billingProvider) {
                       self.app().run("GET", self.link(billingProvider,'edit','json'));
                    },
                    "requiredAuthorities" : {
                        "permissions" : ["update"]
                    }
                },
                "export": {
                    "title": "Export Billing Provider Configs",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-export', 48),
                    "click": function(billingProvider) {
                        self.app().run("GET", self.LINK().call(self,billingProvider,'export'));
                    },
                    "requiredAuthorities" : {
                        "permissions" : ["read"]
                    }
                }
            });

            list["columns"] = [
                {
                    "title": "Title",
                    "type":"property",
                    "sortingExpression": "title",
                    "property": function(callback) {
                        var title = self.friendlyTitle(this);
                        var value = "<a href='#" + self.link(this) + "'>" + title + "</a>";
                        callback(value);
                    }
                },
                {
                    "title": "Last Modified By",
                    "sortingExpression" : "_system.modified_by",
                    "property": function(callback) {
                        var value = this.getSystemMetadata().getModifiedBy();
                        callback(value);
                    }
                },
                {
                    "title": "Last Modified On",
                    "sortingExpression" : "_system.modified_on.ms",
                    "property": function(callback) {
                        var value = this.getSystemMetadata().getModifiedOn().getTimestamp();
                        callback(value);
                    }
                }
            ];

            list["isItemReadonly"] = function(item) {
                return item.getId() == 'default';
            };

            list["loadFunction"] = function(query, pagination, callback) {
                var checks = [];
                self.contextObject().trap(function(error) {
                    return self.handlePageError(el, error);
                }).queryBillingProviderConfigurations(self.query(),self.pagination(pagination)).each(function() {
                    $.merge(checks, self.prepareListPermissionCheck(this,['update','delete']));
                }).then(function() {
                    var _this = this;
                    this.subchain(self.platform()).checkBillingProviderConfigurationPermissions(checks, function(checkResults) {
                        self.updateUserRoles(checkResults);
                        callback.call(_this);
                    });
                });
            };

            // store list configuration onto observer
            self.list(self.SUBSCRIPTION, list);
        },

        setupPage : function(el) {
            var page = {
                "title" : "Billing Provider Configs",
                "description" : "Display list of billing provider configs.",
                "listTitle" : "Billing Provider Config List",
                "listIcon" : Gitana.Utils.Image.buildImageUri('objects', 'billing-provider', 20),
                "searchBox" : false,
                "subscription" : this.SUBSCRIPTION,
                "filter" : this.FILTER
            };

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.BillingProviders);

})(jQuery);