(function($) {
    Gitana.Console.Pages.Settings = Gitana.CMS.Pages.AbstractListPageGadget.extend(
    {
        SUBSCRIPTION : "settings-page",

        FILTER : "setting-list-filters",

        FILTER_TOOLBAR: {
            "query" : {
                "title" : "Query Settings",
                "icon" : Gitana.Utils.Image.buildImageUri('browser', 'query', 48)
            }
        },

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/applications/{applicationId}/settings", this.index);
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
            this.menu(Gitana.Console.Menu.Application(this,"menu-application-settings"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.Settings(this));
        },

        setupToolbar: function() {
            var self = this;
            self.base();
            self.addButtons([
                {
                "id": "create",
                "title": "New Settings",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'settings-add', 48),
                    "url" : this.LINK().call(self,this.targetObject(),'add','settings'),
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
                var json_query = JSON.parse(formData.query);
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
                "helper" : "Query settings by scope ,key, id, title, description, date range or full query.",
                "fields" : {
                    "scope" : {
                        "size": this.DEFAULT_FILTER_TEXT_SIZE,
                        "helper": "Enter regular expression for query by setting scope."
                    },
                    "key" : {
                        "size": this.DEFAULT_FILTER_TEXT_SIZE,
                        "helper": "Enter regular expression for query by setting key."
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
                    "title": "Edit Settings",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'settings-edit', 48),
                    "click": function(setting){
                        self.app().run("GET", self.LINK().call(self,setting,'edit'));
                    },
                    "requiredAuthorities" : {
                        "permissions" : ["update"]
                    }
                },
                "delete": {
                    "title": "Delete Settings",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'settings-delete', 48),
                    "selection" : "multiple",
                    "click": function(settings) {
                        self.onClickDeleteMultiple(self.targetObject(), settings , "settings", self.LIST_LINK().call(self,'settings') , Gitana.Utils.Image.buildImageUri('objects', 'settings', 20), 'setting');
                    },
                    "requiredAuthorities" : {
                        "permissions" : ["delete"]
                    }
                },
                "editJSON": {
                    "title": "Edit JSON",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'json-edit', 48),
                    "click": function(setting) {
                        self.app().run("GET", self.LINK().call(self,setting,'edit','json'));
                    },
                    "requiredAuthorities" : {
                        "permissions" : ["update"]
                    }
                },
                "export": {
                    "title": "Export Settings",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-export', 48),
                    "click": function(setting) {
                        self.app().run("GET", self.LINK().call(self,setting,'export'));
                    },
                    "requiredAuthorities" : {
                        "permissions" : ["read"]
                    }
                }
            });

            list["columns"] = [
                {
                    "title": "Scope",
                    "type":"property",
                    "sortingExpression": "scope",
                    "property": function(callback) {
                        var title = self.listItemProp(this,'scope');
                        var link = self.link(this);
                        var value = "<a href='#" + link + "'>" + title + "</a>";
                        callback(value);
                    }
                },
                {
                    "title": "Key",
                    "type":"property",
                    "sortingExpression": "key",
                    "property": function(callback) {
                        callback(self.listItemProp(this,'key'));
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
                }).querySettings(self.query(),self.pagination(pagination)).each(function() {
                    $.merge(checks, self.prepareListPermissionCheck(this,['read','update','delete']));
                }).then(function() {
                    var _this = this;
                    //TODO: Add checks back once 404 issue is resolved
                    this.subchain(self.targetObject()).checkSettingPermissions(checks, function(checkResults) {
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
                "title" : "Settings List",
                "description" : "Display list of settings of application " + this.friendlyTitle(this.targetObject()) +".",
                "listTitle" : "Settings List",
                "listIcon" : Gitana.Utils.Image.buildImageUri('objects', 'settings', 20),
                "subscription" : this.SUBSCRIPTION,
                "filter" : this.FILTER
            };

            this.page(_mergeObject(page,this.base(el)));
        }
    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.Settings);

})(jQuery);