(function($) {
    Gitana.Console.Pages.AuthenticationGrants = Gitana.CMS.Pages.AbstractListPageGadget.extend(
    {
        SUBSCRIPTION : "authentication-grants",

        FILTER : "authentication-grant-list-filters",

        FILTER_TOOLBAR: {
            "query" : {
                "title" : "Query",
                "icon" : Gitana.Utils.Image.buildImageUri('browser', 'query', 48)
            }
        },

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/authenticationgrants", this.index);
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
            this.menu(Gitana.Console.Menu.Platform(this,"menu-platform-authenticationgrants"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.AuthenticationGrants(this));
        },

        setupToolbar: function() {
            this.base();
            this.addButtons([
                {
                "id": "create",
                "title": "New Auth Grant",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'authentication-grant-add', 48),
                    "url" : '/add/authenticationgrant',
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
                    "title": "Edit Auth Grant",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'authentication-grant-edit', 48),
                    "click": function(authenticationGrant){
                        self.app().run("GET", self.link(authenticationGrant,'edit'));
                    },
                    "requiredAuthorities" : {
                        "permissions" : ["update"]
                    }
                },
                "delete": {
                    "title": "Delete Auth Grants",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'authentication-grant-delete', 48),
                    "click": function(authenticationGrants) {
                        self.onClickDeleteMultiple(self.platform(), authenticationGrants , "authenticationGrant", self.listLink('authenticationGrants') , Gitana.Utils.Image.buildImageUri('objects', 'authentication-grant', 20), 'authenticationGrant');
                    },
                    "selection" : "multiple",
                    "requiredAuthorities" : {
                        "permissions" : ["delete"]
                    }
                },
                "editJSON": {
                    "title": "Edit JSON",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'json-edit', 48),
                    "click": function(authenticationGrant) {
                       self.app().run("GET", self.link(authenticationGrant,'edit','json'));
                    },
                    "requiredAuthorities" : {
                        "permissions" : ["update"]
                    }
                },
                "export": {
                    "title": "Export Auth Grant",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-export', 48),
                    "click": function(authenticationGrant) {
                        self.app().run("GET", self.LINK().call(self,authenticationGrant,'export'));
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
                        var key = this["key"];
                        var value = "<a href='#" + self.link(this) + "'>" + key + "</a>";
                        callback(value);
                    }
                },
                {
                    "title": "Client",
                    "type":"property",
                    "property": function(callback) {
                        var clientId = this["clientId"];
                        var value = "<a href='#/clients/" + clientId + "'>" + clientId + "</a>";
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
                }).queryAuthenticationGrants(self.query(),self.pagination(pagination)).each(function() {
                    $.merge(checks, self.prepareListPermissionCheck(this,['update','delete']));
                }).then(function() {
                    var _this = this;
                    this.subchain(self.contextObject()).checkAuthenticationGrantPermissions(checks, function(checkResults) {
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
                "title" : "Authentication Grants",
                "description" : "Display list of authentication grants.",
                "listTitle" : "Authentication Grant List",
                "listIcon" : Gitana.Utils.Image.buildImageUri('objects', 'authentication-grant', 20),
                "searchBox" : false,
                "subscription" : this.SUBSCRIPTION,
                "filter" : this.FILTER
            };

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.AuthenticationGrants);

})(jQuery);