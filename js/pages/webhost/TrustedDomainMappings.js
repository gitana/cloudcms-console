(function($) {
    Gitana.Console.Pages.TrustedDomainMappings = Gitana.CMS.Pages.AbstractListPageGadget.extend(
        {
            SUBSCRIPTION : "trusted-domain-mappings",

            FILTER : "trusted-domain-mapping-list-filters",

            FILTER_TOOLBAR: {
                "query" : {
                    "title" : "Query",
                    "icon" : Gitana.Utils.Image.buildImageUri('browser', 'query', 48)
                }
            },

            setup: function() {
                this.get("/webhosts/{webhostId}/trusteddomainmappings", this.index);
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
                this.menu(Gitana.Console.Menu.Webhost(this, "menu-webhost-trusted-domain-mappings"));
            },

            setupBreadcrumb: function() {
                return this.breadcrumb(Gitana.Console.Breadcrumb.TrustedDomainMappings(this));
            },

            setupToolbar: function() {
                var self = this;
                self.base();
                self.addButtons([
                    {
                        "id": "create",
                        "title": "Create New",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'trusted-domain-mapping-add', 48),
                        "url" : this.LINK().call(self, this.targetObject(), 'add', 'trusteddomainmapping'),
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
                    "host" : "",
                    "scope" : "",
                    "platformId" : ""
                });
            },

            filterFormToJSON: function (formData) {
                var query = this.base(formData);
                if (! Alpaca.isValEmpty(formData)) {
                    var json_query = JSON.parse(formData.query);
                    if (Alpaca.isValEmpty(json_query)) {
                        if (formData['host']) {
                            query['host'] = formData['host'];
                        }
                        if (formData['scope']) {
                            query['scope'] = formData['scope'];
                        }
                        if (formData['platformId']) {
                            query['platformId'] = formData['platformId'];
                        }
                    }
                }

                return query;
            },

            filterSchema: function () {
                return _mergeObject(this.base(), {
                    "properties" : {
                        "host" : {
                            "title": "Host",
                            "type" : "string"
                        },
                        "scope" : {
                            "title": "Scope",
                            "type" : "string"
                        },
                        "platformId" : {
                            "title": "Platform ID",
                            "type" : "string"
                        }
                    }
                });
            },

            filterOptions: function() {

                var self = this;

                var options = _mergeObject(this.base(), {
                    //"helper" : "Query trusted domain mappings by id, title, description, date range, client key, uri or full query.",
                    "fields" : {
                        "host" : {
                            "size": this.DEFAULT_FILTER_TEXT_SIZE
                            //,"helper": "Enter regular expression for query by host."
                        },
                        "scope" : {
                            "size": this.DEFAULT_FILTER_TEXT_SIZE
                            //,"helper": "Enter regular expression for query by scope."
                        },
                        "platformId" : {
                            "size": this.DEFAULT_FILTER_TEXT_SIZE
                            //,"helper": "Enter regular expression for query by platform id."
                        }
                    }
                });

                return options;
            },

            filterView: function() {
                return _mergeObject(this.base(), {
                    "layout": {
                        "bindings": {
                            "host" : "column-1",
                            "scope" : "column-2",
                            "platformId" : "column-2"
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
                        "title": "Edit",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'trusted-domain-mapping-edit', 48),
                        "click": function(trustedDomainMapping){
                            self.app().run("GET", self.LINK().call(self, trustedDomainMapping, 'edit'));
                        },
                        "requiredAuthorities" : {
                            "permissions" : ["update"]
                        }
                    },
                    "delete": {
                        "title": "Delete",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'trusted-domain-mapping-delete', 48),
                        "selection" : "multiple",
                        "click": function(trustedDomainMappings) {
                            self.onClickDeleteMultiple(self.targetObject(), trustedDomainMappings, "trusted domain mapping", self.LIST_LINK().call(self, 'trusted-domain-mappings'), Gitana.Utils.Image.buildImageUri('objects', 'trusted-domain-mapping', 24), 'trusted domain mapping');
                        },
                        "requiredAuthorities" : {
                            "permissions" : ["delete"]
                        }
                    },
                    "export": {
                        "title": "Export",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-export', 48),
                        "click": function(trustedDomainMappings) {
                            self.app().run("GET", self.LINK().call(self, trustedDomainMappings, 'export'));
                        },
                        "requiredAuthorities" : {
                            "permissions" : ["read"]
                        }
                    }
                });

                list["columns"] = [
                    {
                        "title": "Host",
                        "type":"property",
                        "sortingExpression": "host",
                        "property": function(callback) {
                            callback(self.listItemProp(this, 'host'));
                        }
                    },
                    {
                        "title": "Scope",
                        "type":"property",
                        "sortingExpression": "scope",
                        "property": function(callback) {
                            callback(self.listItemProp(this, 'scope'));
                        }
                    },
                    {
                        "title": "Platform ID",
                        "type":"property",
                        "sortingExpression": "platformId",
                        "property": function(callback) {
                            callback(self.listItemProp(this, 'platformId'));
                        }
                    }
                ];

                list["loadFunction"] = function(query, pagination, callback) {
                    var checks = [];
                    Chain(self.targetObject()).trap(
                        function(error) {
                            return self.handlePageError(el, error);
                        }).queryTrustedDomainMappings(self.query(), self.pagination(pagination)).each(
                        function() {
                            $.merge(checks, self.prepareListPermissionCheck(this, ['read','delete']));
                        }).then(function() {
                            var _this = this;
                            this.subchain(self.targetObject()).checkTrustedDomainMappingsPermissions(checks, function(checkResults) {
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
                    "title" : "Trusted Domain Mappings",
                    "description" : "Display list of trusted domain mappings for web host " + this.friendlyTitle(this.targetObject()) + ".",
                    "listTitle" : "Trusted Domain Mappings",
                    "listIcon" : Gitana.Utils.Image.buildImageUri('objects', 'trusted-domain-mapping', 20),
                    "subscription" : this.SUBSCRIPTION,
                    "filter" : this.FILTER
                };

                this.page(_mergeObject(page, this.base(el)));
            }
        });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.TrustedDomainMappings);

})(jQuery);