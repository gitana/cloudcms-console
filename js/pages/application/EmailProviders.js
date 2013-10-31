(function($) {
    Gitana.Console.Pages.EmailProviders = Gitana.CMS.Pages.AbstractListPageGadget.extend(
    {
        SUBSCRIPTION : "emailproviders-page",

        FILTER : "emailprovider-list-filters",

        FILTER_TOOLBAR: {
            "query" : {
                "title" : "Query Email Providers",
                "icon" : Gitana.Utils.Image.buildImageUri('browser', 'query', 48)
            }
        },

        setup: function() {
            this.get("/applications/{applicationId}/emailproviders", this.index);
        },

        targetObject: function() {
            return this.application();
        },

        requiredAuthoritieas: function() {
            return [
                {
                    "permissioned" : this.targetObject(),
                    "permissions" : ["read"]
                }
            ];
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Application(this,"menu-application-emailproviders"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.EmailProviders(this));
        },

        setupToolbar: function() {
            var self = this;
            self.base();
            self.addButtons([
                {
                "id": "create",
                "title": "New Email Provider",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'emailprovider-add', 48),
                    "url" : this.LINK().call(self,this.targetObject(),'add','emailprovider'),
                    "requiredAuthorities" : [
                        {
                            "permissioned" : self.targetObject(),
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

        /** Filter Related Methods **/
        filterEmptyData: function() {
            return Alpaca.merge(this.base(),{
                "scope" : "",
                "key" : ""
            });
        },

        filterFormToJSON: function (formData) {
            var query = this.base(formData);
            if (! Alpaca.isValEmpty(formData)) {
                var json_query = _safeParse(formData.query);
                if (Alpaca.isValEmpty(json_query)) {
                    if (formData['scope']) {
                        query['scope'] = formData['scope'];
                    }
                    if (formData['key']) {
                        query['key'] = formData['key'];
                    }
                }
            }

            return query;
        },

        filterSchema: function () {
            return _mergeObject({
                "properties" : {
                    "scope" : {
                        "title": "Scope",
                        "type" : "string"
                    },
                    "key" : {
                        "title": "Key",
                        "type" : "string"
                    }
                }
            }, this.base());
        },

        filterOptions: function() {

            var options = _mergeObject(this.base(), {
                "helper" : "Query email providers by property or full query.",
                "fields" : {
                    "scope" : {
                        "size": this.DEFAULT_FILTER_TEXT_SIZE,
                        "helper": "Enter regular expression for query by email provider scope."
                    },
                    "key" : {
                        "size": this.DEFAULT_FILTER_TEXT_SIZE,
                        "helper": "Enter regular expression for query by email provider key."
                    }
                }
            });

            return options;
        },

        filterView: function() {
            return _mergeObject(this.base(),{
                "layout": {
                    "bindings": {
                        "scope" : "column-1",
                        "key" : "column-2"
                    }
                }
            });
        },

        /** OVERRIDE **/
        setupList: function(el) {
            var self = this;

            // define the list
            var list = self.defaultList();

            list["actions"] = self.actionButtons({
                "edit": {
                    "title": "Edit Email Provider",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'emailprovider-edit', 48),
                    "click": function(emailProvider){
                        self.app().run("GET", self.LINK().call(self,emailProvider,'edit'));
                    },
                    "requiredAuthorities" : {
                        "permissions" : ["update"]
                    }
                },
                "delete": {
                    "title": "Delete Email Provider",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'emailprovider-delete', 48),
                    "selection" : "multiple",
                    "click": function(emailProviders) {
                        self.onClickDeleteMultiple(self.targetObject(), emailProviders , "emailproviders", self.LIST_LINK().call(self,'emailprovider') , Gitana.Utils.Image.buildImageUri('objects', 'emailprovider', 20), 'emailprovider');
                    },
                    "requiredAuthorities" : {
                        "permissions" : ["delete"]
                    }
                },
                "editJSON": {
                    "title": "Edit JSON",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'json-edit', 48),
                    "click": function(emailProvider) {
                        self.app().run("GET", self.LINK().call(self,emailProvider,'edit','json'));
                    },
                    "requiredAuthorities" : {
                        "permissions" : ["update"]
                    }
                },
                "export": {
                    "title": "Export Email Provider",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-export', 48),
                    "click": function(emailProvider) {
                        self.app().run("GET", self.LINK().call(self,emailProvider,'export'));
                    },
                    "requiredAuthorities" : {
                        "permissions" : ["read"]
                    }
                }
            });

            list["columns"] = [
                {
                    "title": "ID",
                    "type":"property",
                    "sortingExpression": "_doc",
                    "property": function(callback) {
                        var title = self.listItemProp(this,'_doc');
                        var link = self.link(this);
                        var value = "<a href='#" + link + "'>" + title + "</a>";
                        callback(value);
                    }
                },
                {
                    "title": "Host",
                    "type":"property",
                    "sortingExpression": "host",
                    "property": function(callback) {
                        callback(self.listItemProp(this,'host'));
                    }
                },
                {
                    "title": "Port",
                    "type":"property",
                    "sortingExpression": "port",
                    "property": function(callback) {
                        callback(self.listItemProp(this,'port'));
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
                Chain(self.targetObject()).trap(function(error) {
                    return self.handlePageError(el, error);
                }).queryEmailProviders(self.query(),self.pagination(pagination)).each(function() {
                    $.merge(checks, self.prepareListPermissionCheck(this,['read','update','delete']));
                }).then(function() {
                    var _this = this;
                    //TODO: Add checks back once 404 issue is resolved
                    this.subchain(self.targetObject()).checkEmailProviderPermissions(checks, function(checkResults) {
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
                "title" : "Email Provider List",
                "description" : "Email providers for application " + this.friendlyTitle(this.targetObject()) +".",
                "listTitle" : "Email Provider List",
                "listIcon" : Gitana.Utils.Image.buildImageUri('objects', 'emailprovider', 20),
                "subscription" : this.SUBSCRIPTION,
                "filter" : this.FILTER
            };

            this.page(_mergeObject(page,this.base(el)));
        }
    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.EmailProviders);

})(jQuery);