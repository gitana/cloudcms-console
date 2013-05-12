(function($) {
    Gitana.Console.Pages.GitanaClientSelector = Gitana.CMS.Pages.AbstractListPageGadget.extend(
    {
        TEMPLATE : "components/gitana-client-selector",

        SUBSCRIPTION : "client-picker",

        DISPLAY_LIST_FILTER: true,

        FILTER : "client-candidates-list-filters",

        FILTER_TOOLBAR: {
            "query" : {
                "title" : "Query Clients",
                "icon" : Gitana.Utils.Image.buildImageUri('browser', 'query', 48)
            }
        },

        constructor: function(id, ratchet) {
            this.base(id, ratchet);

            this.selectHandler = function(id, title) {
            };
        },

        setup: function() {
            this.get(this.index);
        },

        targetObject: function() {
            return this.platform();
        },

        requiredAuthorities: function() {
            return [
                {
                    "permissioned" : this.targetObject(),
                    "permissions" : ["read"]
                }
            ];
        },

        /** Filter Related Methods **/
        filterEmptyData: function() {
            return {
                "text" : "",
                "startDate" : "",
                "endDate": "",
                "query" : ""
            };
        },

        filterFormToJSON: function (formData) {
            if (! Alpaca.isValEmpty(formData)) {
                var json_query = _safeParse(formData.query);
                if (!Alpaca.isValEmpty(json_query)) {
                    return json_query;
                } else {
                    var query = {};
                    if (formData['text']) {
                        query["$or"] = [{
                            "_doc": formData['text']
                        }, {
                            "title": formData['text']
                        }, {
                            "description": formData['text']
                        }]
                    }
                    if (formData.startDate || formData.endDate) {
                        query["_system.modified_on.ms"] = {
                        };
                        if (formData.startDate) {
                            query["_system.modified_on.ms"]["$gte"] = Gitana.Utils.Date.strToDate(formData.startDate).getTime();
                        }
                        if (formData.endDate) {
                            query["_system.modified_on.ms"]["$lt"] = Gitana.Utils.Date.strToDate(formData.endDate).getTime() + 86400000;
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
                    "text" : {
                        "title": "Text",
                        "type" : "string"
                    },
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
                    "query" : {
                        "title": "Full JSON Query",
                        "type" : "string"
                    }
                }
            };
        },

        filterOptions: function() {
            var self = this;
            return {
                "fields" : {
                    "text" : {
                        "size": this.DEFAULT_FILTER_TEXT_SIZE
                    },
                    "startDate" : {
                        "size": this.DEFAULT_FILTER_DATE_SIZE
                    },
                    "endDate" : {
                        "size": this.DEFAULT_FILTER_DATE_SIZE
                    },
                    "query" : {
                        "type": "editor",
                        "aceMode": "ace/mode/json",
                        "aceFitContentHeight": true
                    }
                }
            };
        },

        filterView: function() {
            return {
                "parent": "VIEW_WEB_EDIT_LAYOUT_GRID_FOUR_COLUMN",
                "layout": {
                    "bindings": {
                        "text": "column-1",
                        "startDate": "column-2",
                        "endDate": "column-2",
                        "query" : "column-3"
                    }
                }
            };
        },

        setupToolbar: function() {
            var self = this;
            self.base();
            self.addButtons([]);

            this.toolbar(self.SUBSCRIPTION + "-toolbar",{
                "items" : {}
            });
        },

        /** OVERRIDE **/
        setupList: function(el) {
            var self = this;

            // define the list
            var list = self.defaultList();

            list["actions"] = self.actionButtons({});

            list.hideCheckbox = true;

            list["columns"] = [
                {
                    "title": "Title",
                    "type":"property",
                    "sortingExpression": "title",
                    "property": function(callback) {
                        var title = self.listItemProp(this, "title");
                        if (!title)
                        {
                            title = self.listItemProp(this, '_doc');
                        }
                        callback(title);
                    }
                },
                {
                    "title": "Key",
                    "sortingExpression" : "key",
                    "property": function(callback) {
                        var value = self.listItemProp(this, "key");
                        callback(value);
                    }
                },
                {
                    "title": "Modified On",
                    "sortingExpression" : "_system.modified_on.ms",
                    "property": function(callback) {
                        var value = this.getSystemMetadata().getModifiedOn().getTimestamp();
                        callback(value);
                    }
                },
                {
                    "title": "Action",
                    "property": function(callback) {

                        var id = self.listItemProp(this, '_doc');
                        var title = self.listItemProp(this, 'title');

                        var value = "<a class='gitana-selector-action client-action gitana-selector-select client-select' data-target-client-id='" + id + "' data-target-client-title='" + title + "'><span>Select</span></a>";
                        callback(value);
                    }
                }
            ];

            list["loadFunction"] = function(query, pagination, callback) {
                var _query = Alpaca.cloneObject(self.query());

                Chain(self.platform()).queryClients(_query, self.pagination(pagination)).then(function() {
                    callback.call(this);
                });
            };

            // store list configuration onto observer
            self.list(this.SUBSCRIPTION,list);
        },

        pagination: function(pagination) {
            if (!pagination) {
                pagination = {
                    "skip" : 0,
                    "limit" : 10,
                    "sort": {
                        '_system.modified_on.ms': -1
                    }
                }
            }
            if (!pagination.sort) {
                pagination.sort = {
                    '_system.modified_on.ms': -1
                };
            }
            return pagination;
        },

        defaultList: function() {

            var defaultList = this.base();

            defaultList.tableConfig.iDisplayLength = 10;
            defaultList.tableConfig["aLengthMenu"] = [[5,10,25,50,100],[5,10,25,50,100]];

            return defaultList;
        },


        processList: function(el) {
            var self = this;

            $("body").undelegate(".client-select", "click").delegate(".client-select", "click", function() {

                var control = $(this);
                var id = control.attr("data-target-client-id");
                var title = control.attr("data-target-client-title");

                self.selectHandler.call(this, id, title);
            })
        },

        setupGitanaClientSelector : function(el) {

            var page = {
                "title" : "Client List",
                "description" : "List of Clients",
                "listTitle" : "Client List",
                "listIcon" : Gitana.Utils.Image.buildImageUri('objects', 'client', 20),
                "subscription" : this.SUBSCRIPTION,
                "filter" : this.FILTER
            };

            this.observable('clientselector').set(page);
        },

        index: function(el) {
            var self = this;

            this.tokens = el.tokens;

            // load context
            self.loadContext(el, function() {
                // check authorities
                self.checkAuthorities(function(isEntitled, error) {
                    if (isEntitled) {
                        // set up toolbar
                        self.setupToolbar();

                        // set up filter
                        self.setupFilter(el);

                        // set up the list
                        self.setupList(el);

                        // set up the page
                        self.setupGitanaClientSelector(el);

                        // list model
                        var page = self.model(el);

                        // render layout
                        self.renderTemplate(el, self.TEMPLATE, function(el) {

                            Gitana.Utils.UI.jQueryUIDatePickerPatch();

                            Gitana.Utils.UI.contentBox($(el));

                            // set up list search box
                            self.setupListSearchbox(el);

                            el.swap();

                            self.processList(el);

                            Gitana.Utils.UI.enableTooltip();

                        });
                    } else {
                        self.handleUnauthorizedPageAccess(el, error);
                    }
                });
            });
        }

    });

    Ratchet.GadgetRegistry.register("clientselector", Gitana.Console.Pages.GitanaClientSelector);

})(jQuery);