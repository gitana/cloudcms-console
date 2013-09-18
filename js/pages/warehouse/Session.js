(function($) {
    Gitana.Console.Pages.Session = Gitana.CMS.Pages.AbstractListPageGadget.extend(
        {
            SUBSCRIPTION : "warehouse-sessions-page",

            FILTER : "sessions-interaction-list-filters",

            FILTER_TOOLBAR: {
                "query" : {
                    "title" : "Query Interactions",
                    "icon" : Gitana.Utils.Image.buildImageUri('browser', 'query', 48)
                }
            },

            constructor: function(id, ratchet) {
                this.base(id, ratchet);
            },

            setup: function() {
                this.get("/warehouses/{warehouseId}/sessions/{sessionId}", this.index);
            },

            targetObject: function() {
                return this.session();
            },

            contextObject: function() {
                return this.warehouse();
            },

            setupMenu: function() {
                this.menu(Gitana.Console.Menu.Session(this));
            },

            setupBreadcrumb: function() {
                return this.breadcrumb(Gitana.Console.Breadcrumb.Session(this));
            },

            setupToolbar: function() {
                var self = this;
                self.base();
                self.addButtons([{
                    "id": "export",
                    "title": "Export Session",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-export', 48),
                    "url" : self.LINK().call(self, self.targetObject(), 'export'),
                    "requiredAuthorities" : [
                        {
                            "permissioned" : self.targetObject(),
                            "permissions" : ["read"]
                        }
                    ]
                }], self.SUBSCRIPTION + "-page-toolbar");
            },

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
                    var json_query = _safeParse(formData.query);
                    if (!Alpaca.isValEmpty(json_query)) {
                        return json_query;
                    } else {
                        var query = {};
                        if (formData.startDate || formData.endDate) {
                            query["timestamp.ms"] = {
                            };
                            if (formData.startDate) {
                                var time = Gitana.Utils.Date.strToDate(formData.startDate).getTime();
                                if (formData.startTime) {
                                    time += Gitana.Utils.Date.strToMs(formData.startTime);
                                }
                                query["timestamp.ms"]["$gte"] = time;

                            }
                            if (formData.endDate) {
                                var time = Gitana.Utils.Date.strToDate(formData.endDate).getTime();
                                if (formData.endTime) {
                                    time += Gitana.Utils.Date.strToMs(formData.endTime);
                                } else {
                                    time += 86400000
                                }
                                query["timestamp.ms"]["$lt"] = time;
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
                    "helper" : "Filter list by interaction start timestamp, end timestamp, id or full query.",
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

                list.hideCheckbox = true;

                list["actions"] = self.actionButtons({
                });

                list["columns"] = [
                    {
                        "title": "ID",
                        "type":"property",
                        "sortingExpression": "_doc",
                        "property": function(callback) {
                            var title = this.getId();
                            var item = this;
                            var value = "<a href='javascript:void(0);' id='interaction-" + title + "'>" + title + "</a>";
                            $('body').delegate('#interaction-'+title,'click',function() {
                                self.displayInteractionDetails(item);
                            });
                            callback(value);
                        }
                    },
                    {
                        "title": "Timestamp",
                        "sortingExpression" : "timestamp.ms",
                        "property": function(callback) {
                            var value = new Date(this.getTimestampMs());
                            callback(value);
                        }
                    }
                ];

                list["loadFunction"] = function(query, pagination, callback) {
                    Chain(self.targetObject()).trap(
                        function(error) {
                            return self.handlePageError(el, error);
                        }).queryInteractions(self.query(), self.pagination(pagination)).then(function() {
                            callback.call(this);
                        });
                };

                // store list configuration onto observer
                self.list(this.SUBSCRIPTION, list);
            },

            setupProfile: function () {
                var self = this;
                var session = self.targetObject();
                var pairs = {
                    "title" : "Overview",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'session', 20),
                    "alert" : "",
                    "items" : []
                };
                this._pushItem(pairs.items, {
                    "key" : "ID",
                    "value" : session.getId()
                });
                this._pushItem(pairs.items, {
                    "key" : "Start",
                    "value" : new Date(session.getTimestampStart())
                });
                this._pushItem(pairs.items, {
                    "key" : "End",
                    "value" : session.getTimestampEnd() ? new Date(session.getTimestampEnd()) : ""
                });

                this.pairs("session-profile-pairs", pairs);
            },

            displayInteractionDetails: function(interaction) {

                var self = this;

                var title = "Interaction Details";
                var dialog = "<div id='interaction-details'></div>";

                interaction.object = self.populateObjectAll(interaction);
                interaction.object.fullJson = JSON.stringify(interaction.object, null, ' ');

                //_mergeObject(interaction.object, interaction.system);

                var templatePath = (Gitana.Apps.APP_NAME ? "/" : "") + Gitana.Apps.APP_NAME + "/templates/themes/" + Gitana.Apps.THEME + "/interactions/interaction-details.html";

                $(dialog).empty().alpaca({
                    "data" : interaction.object,
                    "view" : {
                        "globalTemplate": templatePath
                    },
                    "postRender" : function(renderedField) {
                        renderedField.getEl().dialog({
                            title : "<img src='" + Gitana.Utils.Image.buildImageUri('objects', 'interaction', 20) + "' /> " + title,
                            resizable: true,
                            width: 900,
                            height: 600,
                            modal: true,
                            buttons: {
                            }
                        });
                    }
                });

                $('.ui-dialog').css("overflow", "hidden");
                $('.ui-dialog-buttonpane').css("overflow", "hidden");

            },

            setupDashlets : function (el, callback) {
                this.setupProfile();
                callback();
            },

            setupPage : function(el) {
                var page = {
                    "title" : "Session " + this.friendlyTitle(this.targetObject()),
                    "listTitle" : "Interaction List",
                    "listIcon" : Gitana.Utils.Image.buildImageUri('objects', 'interaction', 20),
                    "subscription" : this.SUBSCRIPTION,
                    "pageToolbar" : true,
                    "filter" : this.FILTER,
                    "dashlets" :[
                        {
                            "id" : "pairs",
                            "grid" : "grid_12",
                            "gadget" : "pairs",
                            "subscription" : "session-profile-pairs"
                        }
                    ]
                };

                this.page(_mergeObject(page, this.base(el)));
            }

        });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.Session);

})(jQuery);