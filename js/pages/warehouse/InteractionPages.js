(function($) {
    Gitana.Console.Pages.InteractionPages = Gitana.CMS.Pages.AbstractListPageGadget.extend(
        {
            SUBSCRIPTION : "interaction-pages-page",

            FILTER : "interaction-page-list-filters",

            FILTER_TOOLBAR: {
                "query" : {
                    "title" : "Query Interaction Pages",
                    "icon" : Gitana.Utils.Image.buildImageUri('browser', 'query', 48)
                }
            },

            constructor: function(id, ratchet) {
                this.base(id, ratchet);
            },

            setup: function() {
                this.get("/warehouses/{warehouseId}/pages", this.index);
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
                this.menu(Gitana.Console.Menu.Warehouse(this, "menu-warehouse-interaction-pages"));
            },

            setupBreadcrumb: function() {
                return this.breadcrumb(Gitana.Console.Breadcrumb.InteractionPages(this));
            },

            setupToolbar: function() {
                var self = this;
                self.base();
                self.addButtons([{
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
                }]);
            },

            /** Filter Related Methods **/
            filterEmptyData: function() {
                return Alpaca.merge(this.base(),{
                    "uri" : [""]
                });
            },

            filterFormToJSON: function (formData) {
                var query = this.base(formData);
                if (! Alpaca.isValEmpty(formData)) {
                    if (Alpaca.isValEmpty(formData.query)) {
                        if (formData['uri']) {
                            query['uri'] = formData['uri'];
                        }
                    }
                }

                return query;
            },

            filterSchema: function () {
                return Alpaca.mergeObject({
                    "properties" : {
                        "uri" : {
                            "title": "Uri",
                            "type" : "string"
                        }
                    }
                },this.base());
            },

            filterOptions: function() {

                var options = Alpaca.mergeObject(this.base(), {
                    "helper" : "Query interaction pages by uri, id, title, description, date range, uri or full query.",
                    "fields" : {
                        "uri" : {
                            "size": this.DEFAULT_FILTER_TEXT_SIZE,
                            "helper": "Enter regular expression for query by uri."
                        }
                    }
                });

                return options;
            },

            filterView: function() {
                return Alpaca.mergeObject(this.base(),{
                    "layout": {
                        "bindings": {
                            "uri": "column-1",
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
                        "title": "Export Interaction Page",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-export', 48),
                        "click": function(interactionPage) {
                            self.app().run("GET", self.LINK().call(self, interactionPage, 'export'));
                        },
                        "requiredAuthorities" : {
                            "permissions" : ["read"]
                        }
                    }
                });

                list.hideCheckbox = true;

                list["columns"] = [
                    {
                        "title": "Uri",
                        "type":"property",
                        "sortingExpression": "uri",
                        "property": function(callback) {
                            var title = self.listItemProp(this,'uri');
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
                        }).queryInteractionPages(self.query(), self.pagination(pagination)).then(function() {
                            callback.call(this);
                        });
                };

                // store list configuration onto observer
                self.list(self.SUBSCRIPTION, list);
            },

            setupPage : function(el) {
                var page = {
                    "title" : "Interaction Pages List",
                    "description" : "Display list of interaction pages of warehouse " + this.friendlyTitle(this.targetObject()) + ".",
                    "listTitle" : "Interaction Page List",
                    "listIcon" : Gitana.Utils.Image.buildImageUri('objects', 'interaction-page', 20),
                    "subscription" : this.SUBSCRIPTION,
                    "filter" : this.FILTER
                };

                this.page(Alpaca.mergeObject(page, this.base(el)));
            }
        });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.InteractionPages);

})(jQuery);