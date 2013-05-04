(function($) {
    Gitana.Console.Pages.Sessions = Gitana.CMS.Pages.AbstractListPageGadget.extend(
        {
            SUBSCRIPTION : "sessions-page",

            FILTER : "session-list-filters",

            FILTER_TOOLBAR: {
                "query" : {
                    "title" : "Query Sessions",
                    "icon" : Gitana.Utils.Image.buildImageUri('browser', 'query', 48)
                }
            },

            constructor: function(id, ratchet) {
                this.base(id, ratchet);
            },

            setup: function() {
                this.get("/warehouses/{warehouseId}/sessions", this.index);
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
                this.menu(Gitana.Console.Menu.Warehouse(this, "menu-warehouse-sessions"));
            },

            setupBreadcrumb: function() {
                return this.breadcrumb(Gitana.Console.Breadcrumb.Sessions(this));
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

                /*
                this.toolbar(self.SUBSCRIPTION + "-toolbar", {
                    "items" : {}
                });
                */
            },

            /** Filter Related Methods **/
            resetFilter: function() {
                this.base();
            },

            filterEmptyData: function() {
                return Alpaca.merge(this.base(), {
                    "startTime" : "",
                    "endTime" : "",
                    "_doc" : ""
                });
            },

            filterFormToJSON: function (formData, renderedField) {
                if (! Alpaca.isValEmpty(formData)) {
                    if (! Alpaca.isValEmpty(formData.query)) {
                        return formData.query;
                    } else {
                        var query = {};
                        if (formData.startDate || formData.endDate) {
                            if (formData.startDate) {
                                query["timestamp.start"] = {
                                };
                                var time = Gitana.Utils.Date.strToDate(formData.startDate).getTime();
                                if (formData.startTime) {
                                    time += Gitana.Utils.Date.strToMs(formData.startTime);
                                }
                                query["timestamp.start"]["$gte"] = time;

                            }
                            if (formData.endDate) {
                                query["timestamp.end"] = {
                                };
                                var time = Gitana.Utils.Date.strToDate(formData.endDate).getTime();
                                if (formData.endTime) {
                                    time += Gitana.Utils.Date.strToMs(formData.endTime);
                                } else {
                                    time += 86400000
                                }
                                query["timestamp.end"]["$lt"] = time;
                            }
                        }

                        if (formData.id) {
                            query._doc = formData.id;
                        }

                        return query;
                    }
                } else {
                    return {};
                }
            },

            filterSchema: function () {
                return {
                    "type" : "object",
                    "properties" : {
                        "startDate" : {
                            "title": "Start Date",
                            "type" : "string",
                            "format": "date"
                        },
                        "endDate" : {
                            "title": "End Date",
                            "type" : "string",
                            "format": "date"
                        },
                        "startTime" : {
                            "title": "Start Time",
                            "type" : "string",
                            "format": "time"
                        },
                        "endTime" : {
                            "title": "End Time",
                            "type" : "string",
                            "format": "time"
                        },
                        "id" : {
                            "title": "ID",
                            "type" : "string"
                        },
                        "query" : {
                            "title": "Full Query",
                            "type" : "string"
                        }
                    }
                };
            },

            filterOptions: function() {
                return {
                    "helper" : "Filter list by session start timestamp, end timestamp, id or full query.",
                    "fields" : {
                        "startDate" : {
                            "size": this.DEFAULT_FILTER_DATE_SIZE,
                            "helper": "Pick start date of start date range."
                        },
                        "endDate" : {
                            "size": this.DEFAULT_FILTER_DATE_SIZE,
                            "helper": "Pick end date of start date range."
                        },
                        "startTime" : {
                            "size": this.DEFAULT_FILTER_DATE_SIZE,
                            "helper": "Pick start time of start date range."
                        },
                        "endTime" : {
                            "size": this.DEFAULT_FILTER_DATE_SIZE,
                            "helper": "Pick end time of start date range."
                        },
                        "id" : {
                            "size": this.DEFAULT_FILTER_TEXT_SIZE,
                            "helper": "Enter Cloud CMS GUID for query by exact matching of id."
                        },
                        "query" : {
                            "type": "editor",
                            "aceMode": "ace/mode/json",
                            "aceFitContentHeight": true,
                            "helper": "Enter full query in JSON."
                        }
                    }
                };
            },

            filterView: function() {
                return {
                    "parent": "VIEW_WEB_EDIT_LAYOUT_GRID_FOUR_COLUMN",
                    "layout": {
                        "bindings": {
                            "startDate": "column-1",
                            "endDate": "column-1",
                            "startTime": "column-2",
                            "endTime": "column-2",
                            "id": "column-1",
                            "query" : "column-3"
                        }
                    }
                };
            },
            /** OVERRIDE **/
            setupList: function(el) {
                var self = this;

                // define the list
                var list = self.defaultList();

                list["actions"] = self.actionButtons({
                    "export": {
                        "title": "Export Session",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-export', 48),
                        "click": function(session) {
                            self.app().run("GET", self.LINK().call(self, session, 'export'));
                        },
                        "requiredAuthorities" : {
                            "permissions" : ["read"]
                        }
                    }
                });

                list.hideCheckbox = true;

                list["columns"] = [
                    {
                        "title": "Title",
                        "type":"property",
                        "sortingExpression": "title",
                        "property": function(callback) {
                            var title = self.friendlyTitle(this);
                            var link = self.LINK().call(self, this);
                            var value = "<a href='#" + link + "'>" + title + "</a>";
                            callback(value);
                        }
                    },
                    {
                        "title": "Start",
                        "sortingExpression" : "timestamp.start",
                        "property": function(callback) {
                            var value = new Date(this.getTimestampStart());
                            callback(value);
                        }
                    },
                    {
                        "title": "End",
                        "sortingExpression" : "timestamp.end",
                        "property": function(callback) {
                            var value = this.getTimestampEnd() ? new Date(this.getTimestampEnd()) : "";
                            callback(value);
                        }
                    }
                ];

                list["loadFunction"] = function(query, pagination, callback) {
                    //var checks = [];
                    Chain(self.targetObject()).trap(
                        function(error) {
                            return self.handlePageError(el, error);
                        }).queryInteractionSessions(self.query(), self.pagination(pagination)).then(function() {
                            callback.call(this);
                        });
                };

                // store list configuration onto observer
                self.list(self.SUBSCRIPTION, list);
            },

            setupPage : function(el) {
                var page = {
                    "title" : "Interaction Sessions List",
                    "description" : "Display list of interaction sessions of warehouse " + this.friendlyTitle(this.targetObject()) + ".",
                    "listTitle" : "Sessions List",
                    "listIcon" : Gitana.Utils.Image.buildImageUri('objects', 'session', 20),
                    "subscription" : this.SUBSCRIPTION,
                    "filter" : this.FILTER
                };

                this.page(_mergeObject(page, this.base(el)));
            }
        });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.Sessions);

})(jQuery);