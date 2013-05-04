(function($) {
    Gitana.Console.Pages.PlatformLogs = Gitana.CMS.Pages.AbstractListPageGadget.extend(
    {
        TEMPLATE: "layouts/console.list.logs",

        SUBSCRIPTION : "platform-logs",

        FILTER : "platform-logs-filters",

        LOG_ENTRIES : "platform-logs-entries",

        FILTER_TOOLBAR: {
            "query" : {
                "title" : "Query Logs",
                "icon" : Gitana.Utils.Image.buildImageUri('browser', 'query', 48)
            }
        },

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/logs", this.index);
        },

        setupMenu: function() {
           this.menu(Gitana.Console.Menu.Platform(this, "menu-platform-logs"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.PlatformLogs(this));
        },

        setupToolbar: function() {
            var self = this;
            self.base();
            self.addButtons([
                {
                    "id": "switch-view",
                    "title": "Switch View",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'logs', 48),
                    "click" : function() {
                        $('.list-datatable').toggle();
                        $('.log-text-view').toggle();
                    }
                }
            ]);
        },

        targetObject: function() {
            $('.list-datatable').show();
            $('.log-text-view').hide();
            return this.platform();
        },

        /** TODO: what should we check? **/
        requiredAuthorities: function() {
            return [
                {
                    "permissioned" : this.platform(),
                    "permissions" : ["read"]
                }
            ];
        },

        /** Filter Related Methods **/
        resetFilter: function() {
            this.base();
        },


        filterEmptyData: function() {
            return {
                "startDate" : "",
                "endDate": "",
                "startTime": "",
                "endTime": "",
                "query" : ""
            };
        },

        pagination: function(pagination) {
            if (!pagination) {
                pagination = {
                    "skip" : 0,
                    "limit" : this.consoleSetting('LIST_SIZE'),
                    "sort": {
                        'timestamp.ms': -1
                    }
                }
            }
            if (!pagination.sort) {
                pagination.sort = {
                    'timestamp.ms': -1
                };
            }
            return pagination;
        },

        filterFormToJSON: function (formData,renderedField) {
            if (! Alpaca.isValEmpty(formData)) {
                if (! Alpaca.isValEmpty(formData.query)) {
                    return formData.query;
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
                    "query" : {
                        "title": "Full Query",
                        "type" : "string"
                    }
                }
            };
        },

        filterOptions: function() {
            return {
                "helper" : "Filter list by date range or full query.",
                "fields" : {
                    "startDate" : {
                        "size": this.DEFAULT_FILTER_DATE_SIZE,
                        "helper": "Pick start date of date range."
                    },
                    "endDate" : {
                        "size": this.DEFAULT_FILTER_DATE_SIZE,
                        "helper": "Pick end date of date range."
                    },
                    "startTime" : {
                        "size": this.DEFAULT_FILTER_DATE_SIZE,
                        "helper": "Pick start time of date range."
                    },
                    "endTime" : {
                        "size": this.DEFAULT_FILTER_DATE_SIZE,
                        "helper": "Pick end time of date range."
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
                "entry": {
                    "title": "View Details",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'log', 48),
                    "click": function(entry){
                        self.setupLogEntry(entry);
                    }
                }
            });

            list["columns"] = [
                {
                    "title": "File Name",
                    "type":"property",
                    "sortingExpression": "filename",
                    "property": function(callback) {
                        callback(self.listItemProp(this,'filename'));
                    }
                },
                /*{
                    "title": "Method",
                    "type":"property",
                    "sortingExpression": "Method",
                    "property": function(callback) {
                        callback(self.listItemProp(this,'method'));
                    }
                },*/
                {
                    "title": "Line",
                    "type":"property",
                    "sortingExpression": "line",
                    "property": function(callback) {
                        callback(self.listItemProp(this,'line'));
                    }
                },
                /*{
                    "title": "Principal Id",
                    "type":"property",
                    "sortingExpression": "principalId",
                    "property": function(callback) {
                        callback(self.listItemProp(this,'principalId'));
                    }
                },*/
                {
                    "title": "Level",
                    "type":"property",
                    "sortingExpression": "level",
                    "property": function(callback) {
                        callback(self.listItemProp(this,'level'));
                    }
                },
                /*{
                    "title": "Message",
                    "type":"property",
                    "sortingExpression": "message",
                    "property": function(callback) {
                        var value = "";
                        if (this.getMessage()) {
                            value = "<img src='" + Gitana.Utils.Image.buildImageUri('objects', 'log', 16) + "'/>";
                        }
                        callback(value);
                    }
                },*/
                {
                    "title": "Exceptions",
                    "type":"property",
                    "sortingExpression": "throwables",
                    "property": function(callback) {
                        var value = "";
                        if (this.getThrowables()) {
                            value = "<img src='" + Gitana.Utils.Image.buildImageUri('special', 'warning', 16) + "'/>";
                        }
                        callback(value);
                    }
                },
                {
                    "title": "Timestamp",
                    "type":"property",
                    "sortingExpression": "timestamp.ms",
                    "property": function(callback) {
                        callback(self.listItemProp(this,'timestamp')['timestamp']);
                    }
                }
            ];
            list.hideIcon = true;

            list["loadFunction"] = function(query, pagination, callback) {
                var allItems = [];
                var _this;
                self.targetObject().trap(function(error) {
                    return self.handlePageError(el, error);
                }).queryLogEntries(self.query(),self.pagination(pagination)).then(function() {
                    _this = this;
                    this.each(function(key,entry,index) {
                        _this[entry.getId()].object = self.populateObjectAll(entry);
                        _this[entry.getId()].object.fullJson = JSON.stringify(_this[entry.getId()].object, null, ' ');
                        //_mergeObject(entry.object, entry.system);
                        allItems.push(_this[entry.getId()].object);
                    }).then(function() {
                        self.observable(self.LOG_ENTRIES).set(allItems);
                        callback.call(this);
                    });
                });
            };

            // store list configuration onto obplatform
            self.list(self.SUBSCRIPTION,list);
        },

        setupLogEntry: function(entry) {

            var self = this;

            var title = "Log Entry Details";
            var dialog = "<div id='log-entry-details'></div>";

            entry.object.fullJson = JSON.stringify(entry.object.fullJson, null, ' ');

            _mergeObject(entry.object,entry.system);

            var templatePath = (Gitana.Apps.APP_NAME ? "/" : "") + Gitana.Apps.APP_NAME + "/templates/themes/" + Gitana.Apps.THEME + "/logs/log-entry.html";

            $(dialog).empty().alpaca({
                "data" : entry.object,
				"view" : {
                    "globalTemplate": templatePath
				},
                "postRender" : function(renderedField) {
                    renderedField.getEl().dialog({
                        title : "<img src='" + Gitana.Utils.Image.buildImageUri('objects', 'log', 24) + "' /> " + title,
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

        setupLogEntries: function(el) {

            var self = this;

            var entries = this.observable(self.LOG_ENTRIES).get();

            if (entries) {

                var templatePath = (Gitana.Apps.APP_NAME ? "/" : "") + Gitana.Apps.APP_NAME + "/templates/themes/" + Gitana.Apps.THEME + "/logs/log-entries.html";

                $('.log-text-view').empty().alpaca({
                    "data" : entries,
                    "view" : {
                        "globalTemplate": templatePath
                    },
                    "postRender" : function(renderedField) {
                    }
                });

            }

        },

        setupPage : function(el) {
            var page = {
                "title" : "Platform Logs",
                "description" : "Display list of platform log entries.",
                "listTitle" : "Log Entry List",
                "listIcon" : Gitana.Utils.Image.buildImageUri('objects', 'log', 20),
                "subscription" : this.SUBSCRIPTION,
                "filter" : this.FILTER
            };

            this.page(_mergeObject(page,this.base(el)));
        },

        processList : function(el) {
            var self = this;
            this.subscribe(this.LOG_ENTRIES, function() {
                self.setupLogEntries(el);
            });
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.PlatformLogs);

})(jQuery);