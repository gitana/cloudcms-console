(function($) {
    Gitana.Console.Pages.InteractionApplications = Gitana.CMS.Pages.AbstractListPageGadget.extend(
        {
            SUBSCRIPTION : "interaction-applications-page",

            FILTER : "interaction-application-list-filters",

            FILTER_TOOLBAR: {
                "query" : {
                    "title" : "Query Interaction Applications",
                    "icon" : Gitana.Utils.Image.buildImageUri('browser', 'query', 48)
                }
            },

            setup: function() {
                this.get("/warehouses/{warehouseId}/applications", this.index);
            },

            targetObject: function() {
                return this.warehouse();
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
                this.menu(Gitana.Console.Menu.Warehouse(this, "menu-warehouse-interaction-applications"));
            },

            setupBreadcrumb: function() {
                return this.breadcrumb(Gitana.Console.Breadcrumb.InteractionApplications(this));
            },

            setupToolbar: function() {
                var self = this;
                self.base();
                self.addButtons([
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
                return Alpaca.merge(this.base(), {
                    "key" : [""]
                });
            },

            filterFormToJSON: function (formData) {
                var query = this.base(formData);
                if (! Alpaca.isValEmpty(formData)) {
                    var json_query = _safeParse(formData.query);
                    if (Alpaca.isValEmpty(json_query)) {
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
                        "key" : {
                            "title": "Key",
                            "type" : "string"
                        }
                    }
                }, this.base());
            },

            filterOptions: function() {

                var options = _mergeObject(this.base(), {
                    "helper" : "Query interaction applications by key, id, title, description, date range, key or full query.",
                    "fields" : {
                        "key" : {
                            "size": this.DEFAULT_FILTER_TEXT_SIZE,
                            "helper": "Enter regular expression for query by key."
                        }
                    }
                });

                return options;
            },

            filterView: function() {
                return _mergeObject(this.base(), {
                    "layout": {
                        "bindings": {
                            "key": "column-1",
                            "description" : "column-2"
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
                    "export": {
                        "title": "Export Interaction Application",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-export', 48),
                        "click": function(interactionApplication) {
                            self.app().run("GET", self.LINK().call(self, interactionApplication, 'export'));
                        },
                        "requiredAuthorities" : {
                            "permissions" : ["read"]
                        }
                    }
                });

                list.hideCheckbox = true;

                list["columns"] = [
                    {
                        "title": "Key",
                        "type":"property",
                        "sortingExpression": "key",
                        "property": function(callback) {
                            var title = self.listItemProp(this, 'key');
                            var link = self.LINK().call(self, this);
                            var value = "<a href='#" + link + "'>" + title + "</a>";
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
                    //var checks = [];
                    Chain(self.targetObject()).trap(
                        function(error) {
                            return self.handlePageError(el, error);
                        }).queryInteractionApplications(self.query(), self.pagination(pagination)).then(function() {
                            callback.call(this);
                        });
                };

                // store list configuration onto observer
                self.list(self.SUBSCRIPTION, list);
            },

            setupPage : function(el) {
                var page = {
                    "title" : "Interaction Applications List",
                    "description" : "Display list of interaction applications of warehouse " + this.friendlyTitle(this.targetObject()) + ".",
                    "listTitle" : "Interaction Application List",
                    "listIcon" : Gitana.Utils.Image.buildImageUri('objects', 'interaction-application', 20),
                    "subscription" : this.SUBSCRIPTION,
                    "filter" : this.FILTER
                };

                this.page(_mergeObject(page, this.base(el)));
            }
        });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.InteractionApplications);

})(jQuery);