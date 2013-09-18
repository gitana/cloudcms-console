(function($) {
    Gitana.Console.Pages.GitanaNodeSelector = Gitana.CMS.Pages.AbstractListPageGadget.extend(
    {
        TEMPLATE : "components/gitana-node-selector",

        SUBSCRIPTION : "node-picker",

        DISPLAY_LIST_FILTER: true,

        FILTER : "node-candidates-list-filters",

        FILTER_TOOLBAR: {
            "query" : {
                "title" : "Query Node",
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
            return this.branch();
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
                "helper" : "Query nodes by id, last name, email, company, date range or full query.",
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
                    "title": "Type",
                    "sortingExpression" : "_type",
                    "property": function(callback) {
                        var value = this.getTypeQName();
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

                        var value = "<a class='gitana-selector-action node-action gitana-selector-select node-select' data-target-node-id='" + id + "' data-target-node-title='" + title + "'><span>Select</span></a>";
                        callback(value);
                    }
                }
            ];

            list["loadFunction"] = function(query, pagination, callback) {
                var _query = Alpaca.cloneObject(self.query());

                Chain(self.branch()).queryNodes(_query, self.pagination(pagination)).then(function() {
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

            $("body").undelegate(".node-select", "click").delegate(".node-select", "click", function() {

                var control = $(this);
                var id = control.attr("data-target-node-id");
                var title = control.attr("data-target-node-title");

                self.selectHandler.call(this, id, title);
            })
        },

        setupGitanaNodeSelector : function(el) {

            var page = {
                "title" : "Node List",
                "description" : "List of Nodes.",
                "listTitle" : "Node List",
                "listIcon" : Gitana.Utils.Image.buildImageUri('objects', 'node', 20),
                "subscription" : this.SUBSCRIPTION,
                "filter" : this.FILTER
            };

            this.observable('nodeselector').set(page);
        },

        index: function(el, callback) {
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
                        self.setupGitanaNodeSelector(el);

                        // list model
                        var page = self.model(el);

                        // render layout
                        self.renderTemplate(el, self.TEMPLATE, function(el) {

                            Gitana.Utils.UI.jQueryUIDatePickerPatch();

                            Gitana.Utils.UI.contentBox($(el));

                            // set up list search box
                            self.setupListSearchbox(el);

                            el.swap(function(swappedEl) {

                                self.processList(swappedEl);

                                Gitana.Utils.UI.enableTooltip();

                                if (callback)
                                {
                                    callback();
                                }

                            });

                        });
                    } else {
                        self.handleUnauthorizedPageAccess(el, error);
                    }
                });
            });
        }

    });

    Ratchet.GadgetRegistry.register("nodeselector", Gitana.Console.Pages.GitanaNodeSelector);

})(jQuery);