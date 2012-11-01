(function($) {
    Gitana.Console.Pages.Domains = Gitana.CMS.Pages.AbstractListPageGadget.extend(
    {
        SUBSCRIPTION : "domains",

        FILTER : "domain-list-filters",

        FILTER_TOOLBAR: {
            "query" : {
                "title" : "Query Domains",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'domain-query', 48)
            }
        },

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/domains", this.index);
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
            this.menu(Gitana.Console.Menu.Platform(this,"menu-platform-domains"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.Domains(this));
        },

        setupToolbar: function() {
            this.base();
            this.addButtons([
                {
                "id": "create",
                "title": "New Domain",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'domain-add', 48),
                    "url" : '/add/domain',
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
                    "url" : this.LINK().call(this, this.contextObject(), 'import','domain'),
                    "requiredAuthorities" : [
                        {
                            "permissioned" : this.contextObject(),
                            "permissions" : ["create_subobjects"]
                        }
                    ]
                }
            ]);
        },

        filterFormToJSON: function (formData) {
            //TODO: This is a bug reported.
            var query = this.base(formData);
            if (query && query["_doc"]) {
                query["repository"] = query["_doc"];
                delete query["_doc"];
            }
            return query;
        },

        /** OVERRIDE **/
        setupList: function(el) {
            var self = this;

            // define the list
            var list = self.defaultList();

            list["actions"] = self.actionButtons({
                "edit": {
                    "title": "Edit Domain",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'domain-edit', 48),
                    "click": function(domain){
                        self.app().run("GET", self.link(domain,'edit'));
                    },
                    "requiredAuthorities" : {
                        "permissions" : ["update"]
                    }
                },
                "delete": {
                    "title": "Delete Domains",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'domain-delete', 48),
                    "click": function(domains) {
                        self.onClickDeleteMultiple(self.platform(), domains , "domain", self.listLink('domains') , Gitana.Utils.Image.buildImageUri('objects', 'domain', 20), 'domain');
                    },
                    "selection" : "multiple",
                    "requiredAuthorities" : {
                        "permissions" : ["delete"]
                    }
                },
                "editJSON": {
                    "title": "Edit JSON",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'json-edit', 48),
                    "click": function(domain) {
                       self.app().run("GET", self.link(domain,'edit','json'));
                    },
                    "requiredAuthorities" : {
                        "permissions" : ["update"]
                    }
                },
                "export": {
                    "title": "Export Domain",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-export', 48),
                    "click": function(domain) {
                        self.app().run("GET", self.LINK().call(self,domain,'export'));
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

            /** TODO: we no longer have getDefaultDomainId() on platform **/
            /** COMMENTING OUT FOR NOW **/
            /*
            list["isItemReadonly"] = function(item) {
                return item.getId() == self.platform().getDefaultDomainId();
            };
            */
            list["isItemReadonly"] = false;

            list["loadFunction"] = function(query, pagination, callback) {
                var checks = [];
                self.contextObject().trap(function(error) {
                    return self.handlePageError(el, error);
                }).queryDomains(self.query(),self.pagination(pagination)).each(function() {
                    $.merge(checks, self.prepareListPermissionCheck(this,['update','delete']));
                }).then(function() {
                    var _this = this;
                    //this.subchain(self.platform()).checkDomainPermissions(checks, function(checkResults) {
                    //    self.updateUserRoles(checkResults);
                        callback.call(_this);
                    //});
                });
            };

            // store list configuration onto observer
            self.list(self.SUBSCRIPTION, list);
        },

        setupPage : function(el) {
            var page = {
                "title" : "Domains",
                "description" : "Display list of platform domains.",
                "listTitle" : "Platform Domain List",
                "listIcon" : Gitana.Utils.Image.buildImageUri('objects', 'domain', 20),
                "searchBox" : false,
                "subscription" : this.SUBSCRIPTION,
                "filter" : this.FILTER
            };

            this.page(Alpaca.mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.Domains);

})(jQuery);