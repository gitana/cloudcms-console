(function($) {
    Gitana.Console.Pages.Clients = Gitana.CMS.Pages.AbstractListPageGadget.extend(
    {
        SUBSCRIPTION : "clients",

        FILTER : "client-list-filters",

        FILTER_TOOLBAR: {
            "query" : {
                "title" : "Query Clients",
                "icon" : Gitana.Utils.Image.buildImageUri('browser', 'query', 48)
            }
        },

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/clients", this.index);
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
            this.menu(Gitana.Console.Menu.Platform(this,"menu-platform-clients"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.Clients(this));
        },

        setupToolbar: function() {
            this.base();
            this.addButtons([
                {
                "id": "create",
                "title": "New Client",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'client-add', 48),
                    "url" : '/add/client',
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
                    "title": "Edit Client",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'client-edit', 48),
                    "click": function(client){
                        self.app().run("GET", self.link(client,'edit'));
                    },
                    "requiredAuthorities" : {
                        "permissions" : ["update"]
                    }
                },
                "delete": {
                    "title": "Delete Clients",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'client-delete', 48),
                    "click": function(clients) {
                        self.onClickDeleteMultiple(self.platform(), clients , "client", self.listLink('clients') , Gitana.Utils.Image.buildImageUri('objects', 'client', 20), 'client');
                    },
                    "selection" : "multiple",
                    "requiredAuthorities" : {
                        "permissions" : ["delete"]
                    }
                },
                "editJSON": {
                    "title": "Edit JSON",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'json-edit', 48),
                    "click": function(client) {
                       self.app().run("GET", self.link(client,'edit','json'));
                    },
                    "requiredAuthorities" : {
                        "permissions" : ["update"]
                    }
                },
                "export": {
                    "title": "Export Client",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-export', 48),
                    "click": function(client) {
                        self.app().run("GET", self.LINK().call(self,client,'export'));
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
                        var title = this["title"];
                        if (!title)
                        {
                            title = this["_doc"];
                        }
                        var value = "<a href='#" + self.link(this) + "'>" + title + "</a>";
                        callback(value);
                    }
                },
                {
                    "title": "Key",
                    "type":"property",
                    "sortingExpression": "key",
                    "property": function(callback) {
                        var value = this["key"];
                        callback(value);
                    }
                },
                {
                    "title": "Domain URLs",
                    "sortingExpression": "domainUrls",
                    "property": function(callback) {
                        var domainUrls = this["domainUrls"];
                        var value = "";
                        if (domainUrls ) {
                            for (var i = 0; i < domainUrls.length; i++) {
                                value += "<a href='" + domainUrls[i] + "' target='_blank'>" + domainUrls[i] + "</a>";
                                value += "<br/>";
                            }
                        }
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
                }).queryClients(self.query(),self.pagination(pagination)).each(function() {
                    $.merge(checks, self.prepareListPermissionCheck(this,['update','delete']));
                }).then(function() {
                    var _this = this;
                    this.subchain(self.contextObject()).checkClientPermissions(checks, function(checkResults) {
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
                "title" : "Clients",
                "description" : "Display list of clients.",
                "listTitle" : "Client List",
                "listIcon" : Gitana.Utils.Image.buildImageUri('objects', 'client', 20),
                "searchBox" : false,
                "subscription" : this.SUBSCRIPTION,
                "filter" : this.FILTER
            };

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.Clients);

})(jQuery);