(function($) {
    Gitana.Console.Pages.AutoClientMappings = Gitana.CMS.Pages.AbstractListPageGadget.extend(
        {
            SUBSCRIPTION : "auto-client-mappings",

            FILTER : "auto-client-mapping-list-filters",

            FILTER_TOOLBAR: {
                "query" : {
                    "title" : "Query",
                    "icon" : Gitana.Utils.Image.buildImageUri('browser', 'query', 48)
                }
            },

            setup: function() {
                this.get("/webhosts/{webhostId}/autoclientmappings", this.index);
            },

            targetObject: function() {
                return this.webhost();
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
                this.menu(Gitana.Console.Menu.Webhost(this, "menu-webhost-auto-client-mappings"));
            },

            setupBreadcrumb: function() {
                return this.breadcrumb(Gitana.Console.Breadcrumb.AutoClientMappings(this));
            },

            setupToolbar: function() {
                var self = this;
                self.base();
                self.addButtons([
                    {
                        "id": "create",
                        "title": "New Mapping",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'auto-client-mapping-add', 48),
                        "url" : this.LINK().call(self, this.targetObject(), 'add', 'autoclientmapping'),
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

                this.toolbar(self.SUBSCRIPTION + "-toolbar", {
                    "items" : {}
                });
            },

            /** Filter Related Methods **/
            filterEmptyData: function() {
                return Alpaca.merge(this.base(), {
                    "clientKey" : "",
                    "uri" : "",
                    "applicationId" : ""
                });
            },

            filterFormToJSON: function (formData) {
                var query = this.base(formData);
                if (! Alpaca.isValEmpty(formData)) {
                    var json_query = _safeParse(formData.query);
                    if (Alpaca.isValEmpty(json_query)) {
                        if (formData['clientKey']) {
                            query['clientKey'] = formData['clientKey'];
                        }
                        if (formData['uri']) {
                            query['uri'] = formData['uri'];
                        }
                        if (formData['applicationId']) {
                            query['applicationId'] = formData['applicationId'];
                        }
                    }
                }

                return query;
            },

            filterSchema: function () {
                return _mergeObject(this.base(), {
                    "properties" : {
                        "clientKey" : {
                            "title": "Client Key",
                            "type" : "string"
                        },
                        "uri" : {
                            "title": "URI",
                            "type" : "string"
                        },
                        "applicationId" : {
                            "title": "Application Id",
                            "type" : "string"
                        }
                    }
                });
            },

            filterOptions: function() {

                var self = this;

                var options = _mergeObject(this.base(), {
                    "helper" : "Query auto group mappings by id, title, description, date range, client key, uri or full query.",
                    "fields" : {
                        "clientKey" : {
                            "size": this.DEFAULT_FILTER_TEXT_SIZE,
                            "helper": "Enter regular expression for query by client key."
                        },
                        "uri" : {
                            "size": this.DEFAULT_FILTER_TEXT_SIZE,
                            "helper": "Enter regular expression for query by uri."
                        },
                        "applicationId" : {
                            "size": this.DEFAULT_FILTER_TEXT_SIZE,
                            "helper": "Enter regular expression for query by application id."
                        }
                    }
                });

                return options;
            },

            filterView: function() {
                return _mergeObject(this.base(), {
                    "layout": {
                        "bindings": {
                            "clientKey" : "column-1",
                            "uri" : "column-2",
                            "applicationId" : "column-2"
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
                    "delete": {
                        "title": "Delete Auto Client Mapping(s)",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'auto-client-mapping-delete', 48),
                        "selection" : "multiple",
                        "click": function(autoClientMappings) {
                            self.onClickDeleteMultiple(self.targetObject(), autoClientMappings, "auto client mapping", self.LIST_LINK().call(self, 'auto-client-mappings'), Gitana.Utils.Image.buildImageUri('objects', 'auto-client-mapping', 20), 'auto client mapping');
                        },
                        "requiredAuthorities" : {
                            "permissions" : ["delete"]
                        }
                    },
                    "export": {
                        "title": "Export Auto Client Mapping",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-export', 48),
                        "click": function(autoClientMapping) {
                            self.app().run("GET", self.LINK().call(self, autoClientMapping, 'export'));
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
                        "title": "URI",
                        "type":"property",
                        "sortingExpression": "uri",
                        "property": function(callback) {
                            callback(self.listItemProp(this, 'uri'));
                        }
                    },
                    {
                        "title": "Application",
                        "type":"property",
                        "sortingExpression": "applicationId",
                        "property": function(callback) {
                            callback(self.listItemProp(this, 'applicationId'));
                        }
                    },
                    {
                        "title": "Client Key",
                        "type":"property",
                        "sortingExpression": "clientKey",
                        "property": function(callback) {
                            callback(self.listItemProp(this, 'clientKey'));
                        }
                    }
                ];

                list["loadFunction"] = function(query, pagination, callback) {
                    var checks = [];
                    Chain(self.targetObject()).trap(
                        function(error) {
                            return self.handlePageError(el, error);
                        }).queryAutoClientMappings(self.query(), self.pagination(pagination)).each(
                        function() {
                            $.merge(checks, self.prepareListPermissionCheck(this, ['read','delete']));
                        }).then(function() {
                            var _this = this;
                            this.subchain(self.targetObject()).checkAutoClientMappingsPermissions(checks, function(checkResults) {
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
                    "title" : "Auto Client Mappings",
                    "description" : "Display list of auto client mappings of web host " + this.friendlyTitle(this.targetObject()) + ".",
                    "listTitle" : "Auto Client Mapping List",
                    "listIcon" : Gitana.Utils.Image.buildImageUri('objects', 'auto-client-mapping', 20),
                    "subscription" : this.SUBSCRIPTION,
                    "filter" : this.FILTER
                };

                this.page(_mergeObject(page, this.base(el)));
            }
        });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.AutoClientMappings);

})(jQuery);