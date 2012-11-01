(function($) {
    Gitana.Console.Pages.Warehouses = Gitana.CMS.Pages.AbstractListPageGadget.extend(
    {
        SUBSCRIPTION : "warehouses",

        FILTER : "warehouse-list-filters",

        FILTER_TOOLBAR: {
            "query" : {
                "title" : "Query Warehouses",
                "icon" : Gitana.Utils.Image.buildImageUri('browser', 'query', 48)
            }
        },

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/warehouses", this.index);
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
            this.menu(Gitana.Console.Menu.Platform(this,"menu-platform-warehouses"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.Warehouses(this));
        },

        setupToolbar: function() {
            this.base();
            this.addButtons([
                {
                "id": "create",
                "title": "New Warehouse",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'warehouse-add', 48),
                    "url" : '/add/warehouse',
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
                    "url" : this.LINK().call(this, this.contextObject(), 'import','warehouse'),
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
                    "title": "Edit Warehouse",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'warehouse-edit', 48),
                    "click": function(warehouse){
                        self.app().run("GET", self.link(warehouse,'edit'));
                    },
                    "requiredAuthorities" : {
                        "permissions" : ["update"]
                    }
                },
                "delete": {
                    "title": "Delete Warehouses",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'warehouse-delete', 48),
                    "click": function(warehouses) {
                        self.onClickDeleteMultiple(self.platform(), warehouses , "warehouse", self.listLink('warehouses') , Gitana.Utils.Image.buildImageUri('objects', 'warehouse', 20), 'warehouse');
                    },
                    "selection" : "multiple",
                    "requiredAuthorities" : {
                        "permissions" : ["delete"]
                    }
                },
                "editJSON": {
                    "title": "Edit JSON",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'json-edit', 48),
                    "click": function(warehouse) {
                       self.app().run("GET", self.link(warehouse,'edit','json'));
                    },
                    "requiredAuthorities" : {
                        "permissions" : ["update"]
                    }
                },
                "export": {
                    "title": "Export Warehouse",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-export', 48),
                    "click": function(warehouse) {
                        self.app().run("GET", self.LINK().call(self,warehouse,'export'));
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
                return item.get('key') && item.get('key') == 'console';
            };

            list["loadFunction"] = function(query, pagination, callback) {
                var checks = [];
                Chain(self.contextObject()).trap(function(error) {
                    return self.handlePageError(el, error);
                }).queryWarehouses(self.query(),self.pagination(pagination)).each(function() {
                    $.merge(checks, self.prepareListPermissionCheck(this,['update','delete']));
                }).then(function() {
                    var _this = this;
                    this.subchain(self.contextObject()).checkWarehousePermissions(checks, function(checkResults) {
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
                "title" : "Warehouses",
                "description" : "Display list of warehouses.",
                "listTitle" : "Warehouse List",
                "listIcon" : Gitana.Utils.Image.buildImageUri('objects', 'warehouse', 20),
                "searchBox" : false,
                "subscription" : this.SUBSCRIPTION,
                "filter" : this.FILTER
            };

            this.page(Alpaca.mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.Warehouses);

})(jQuery);