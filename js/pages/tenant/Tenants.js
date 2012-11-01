(function($) {
    Gitana.Console.Pages.Tenants = Gitana.CMS.Pages.AbstractListPageGadget.extend(
    {
        SUBSCRIPTION : "tenants",

        FILTER : "tenant-list-filters",

        FILTER_TOOLBAR: {
            "query" : {
                "title" : "Query Tenants",
                "icon" : Gitana.Utils.Image.buildImageUri('browser', 'query', 48)
            }
        },

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/registrars/{registrarId}/tenants", this.index);
        },

        contextObject: function() {
            return this.registrar();
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
            this.menu(Gitana.Console.Menu.Registrar(this,"menu-registrar-tenants"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.Tenants(this));
        },

        setupToolbar: function() {
            this.base();
            this.addButtons([
                {
                "id": "create",
                "title": "New Tenant",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'tenant-add', 48),
                    "url" : this.LINK().call(this,this.contextObject(),'add','tenant'),
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
                    "title": "Edit Tenant",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'tenant-edit', 48),
                    "click": function(tenant){
                        self.app().run("GET", self.link(tenant,'edit'));
                    },
                    "requiredAuthorities" : {
                        "permissions" : ["update"]
                    }
                },
                "delete": {
                    "title": "Delete Tenants",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'tenant-delete', 48),
                    "click": function(tenants) {
                        self.onClickDeleteMultiple(self.contextObject(), tenants , "tenant", self.listLink('tenants') , Gitana.Utils.Image.buildImageUri('objects', 'tenant', 20), 'tenant');
                    },
                    "selection" : "multiple",
                    "requiredAuthorities" : {
                        "permissions" : ["delete"]
                    }
                },
                "editJSON": {
                    "title": "Edit JSON",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'json-edit', 48),
                    "click": function(tenant) {
                       self.app().run("GET", self.link(tenant,'edit','json'));
                    },
                    "requiredAuthorities" : {
                        "permissions" : ["update"]
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

            list["loadFunction"] = function(query, pagination, callback) {
                var checks = [];
                Chain(self.contextObject()).trap(function(error) {
                    return self.handlePageError(el, error);
                }).queryTenants(self.query(),self.pagination(pagination)).each(function() {
                    $.merge(checks, self.prepareListPermissionCheck(this,['update','delete']));
                }).then(function() {
                    var _this = this;
                    this.subchain(self.contextObject()).checkTenantPermissions(checks, function(checkResults) {
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
                "title" : "Tenants",
                "description" : "Display list of tenants of registrar " + this.friendlyTitle(this.contextObject()) + ".",
                "listTitle" : "Tenant List",
                "listIcon" : Gitana.Utils.Image.buildImageUri('objects', 'tenant', 20),
                "searchBox" : false,
                "subscription" : this.SUBSCRIPTION,
                "filter" : this.FILTER
            };

            this.page(Alpaca.mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.Tenants);

})(jQuery);