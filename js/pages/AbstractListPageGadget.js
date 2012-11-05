(function($) {
    Gitana.CMS.Pages.AbstractListPageGadget = Gitana.CMS.Pages.AbstractPageGadget.extend(
    {
        TEMPLATE: "layouts/console.list",

        DEFAULT_FILTER_TEXT_SIZE: 35,
        DEFAULT_FILTER_DATE_SIZE: 30,

        FILTER_TOOLBAR: {
            "query" : {
                "title" : "Query List",
                "icon" : Gitana.Utils.Image.buildImageUri('browser', 'query', 48)
            }
        },

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        index: function(el) {
            var self = this;

            this.tokens = el.tokens;

            // load context
            self.loadContext(el, function() {
                // check authorities
                self.checkAuthorities(function(isEntitled, error) {
                    if (isEntitled) {
                        // set up menu
                        self.setupMenu();

                        // set up breadcrumb
                        self.setupBreadcrumb();

                        // set up toolbar
                        self.setupToolbar();

                        // set up filter
                        self.setupFilter(el);

                        // set up the list
                        self.setupList(el);

                        // set up the dashlets
                        self.setupDashlets(el);

                        // set up the page
                        self.setupPage(el);

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

                            Gitana.Utils.UI.processBreadcrumb();

                        });
                    } else {
                        self.handleUnauthorizedPageAccess(el, error);
                    }
                });
            });
        },

        /** ABSTRACT **/
        setupList: function(el) {
        },

        /** ABSTRACT **/
        searchFilter: function(key) {
            return {
                $or : [
                    {
                        "title" : {
                            "$regex" : key
                        }
                    },
                    {
                        "description" : {
                            "$regex" : key
                        }
                    }
                ]
            };
        },

        setupListSearchbox: function(el) {
            var self = this;
            $('input.list-search', $(el)).keypress(function(e) {
                if (e.which == 13) {
                    var query = self.searchFilter($(this).val());
                    var targetObservable = Alpaca.isFunction(self.FILTER) ? self.FILTER() : self.FILTER;
                    self.observable(targetObservable).set({
                        "formData" : {},
                        "jsonData" : query
                    });
                }
            });
        },

        /** ABSTRACT **/
        setupDashlets: function(el) {
        },

        /** ABSTRACT **/
        processList: function(el) {
        },

        resetFilter: function() {
            var filter = Alpaca.isFunction(this.FILTER) ? this.FILTER() : this.FILTER;
            this.observable(filter).set(this.observable(filter).get());
        },

        setupToolbar: function() {
            var self = this;
            self.base();

            if (this.FILTER) {

                if (this.HIDE_FILTER == null || !this.HIDE_FILTER) {
                    self.addButtons([
                        {
                            "id": "filter-list",
                            "title": this.FILTER_TOOLBAR.query.title,
                            "icon" : this.FILTER_TOOLBAR.query.icon,
                            "click" : function() {
                                $('.filter').toggle();
                            }
                        }
                    ]);
                }

                self.addButtons([
                    {
                        "id": "refresh-list",
                        "title": "Refresh List",
                        "icon" : Gitana.Utils.Image.buildImageUri('browser', 'refresh', 48),
                        "click" : function() {
                            $('.list-toolbar').css({
                                "border": "0px none"
                            });
                            self.resetFilter();
                        }
                    }
                ]);
            }

            this.toolbar(self.SUBSCRIPTION + "-toolbar", {
                "items" : {}
            });
        },

        /** Filter Related Methods **/
        filterEmptyData: function() {
            return {
                "id" : "",
                "title" : "",
                "description" : "",
                "startDate" : "",
                "endDate": "",
                "query" : ""
            };
        },

        query: function() {
            var filter = Alpaca.isFunction(this.FILTER) ? this.FILTER() : this.FILTER;
            var filterObservable = this.observable(filter).get();

            var query = {}

            if (filterObservable && filterObservable.jsonData) {
                query = filterObservable.jsonData;
            }
            return query;
        },

        pagination: function(pagination) {
            if (!pagination) {
                pagination = {
                    "skip" : 0,
                    "limit" : this.consoleSetting('LIST_SIZE'),
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

        filterFormToJSON: function (formData, renderedField) {
            if (! Alpaca.isValEmpty(formData)) {
                if (! Alpaca.isValEmpty(formData.query)) {
                    return formData.query;
                } else {
                    var query = {};
                    if (formData.id) {
                        query._doc = formData.id;
                    }
                    if (formData.title) {
                        query.title = {
                            "$regex" : formData.title
                        };
                    }
                    if (formData.description) {
                        query.description = {
                            "$regex" : formData.description
                        };
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
                    "id" : {
                        "title": "Id",
                        "type" : "string"
                    },
                    "title" : {
                        "title": "Title",
                        "type" : "string"
                    },
                    "description" : {
                        "title": "Description",
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
                        "title": "Full Query",
                        "type" : "string"
                    }
                }
            };
        },

        filterOptions: function() {
            return {
                "helper" : "Query list by id, title, description, date range or full query.",
                "fields" : {
                    "id" : {
                        "size": this.DEFAULT_FILTER_TEXT_SIZE,
                        "helper": "Enter Gitana GUID for query by exact matching of id."
                    },
                    "title" : {
                        "size": this.DEFAULT_FILTER_TEXT_SIZE,
                        "helper": "Enter regular expression for query by title."
                    },
                    "description" : {
                        "size": this.DEFAULT_FILTER_TEXT_SIZE,
                        "helper": "Enter regular expression for query by description."
                    },
                    "startDate" : {
                        "size": this.DEFAULT_FILTER_DATE_SIZE,
                        "helper": "Pick start date of date range."
                    },
                    "endDate" : {
                        "size": this.DEFAULT_FILTER_DATE_SIZE,
                        "helper": "Pick end date of date range."
                    },
                    "query" : {
                        "type" : "json",
                        "cols": 60,
                        "rows" : 5,
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
                        "id": "column-1",
                        "title": "column-1",
                        "description": "column-1",
                        "startDate": "column-2",
                        "endDate": "column-2",
                        "query" : "column-3"
                    }
                }
            };
        },

        filterPostRender: function (renderedField, self) {
            var targetObservable = Alpaca.isFunction(self.FILTER) ? self.FILTER() : self.FILTER;
            $('<div style="margin:5px;" class="button">' + this.FILTER_TOOLBAR.query.title +'</div>').click(
                    function() {
                        if (renderedField.isValid(true)) {
                            var formData = renderedField.getValue();
                            var jsonData = self.filterFormToJSON(formData, renderedField);
                            self.observable(targetObservable).set({
                                "formData" : formData,
                                "jsonData" : jsonData
                            });
                        }
                    }).appendTo($('#column-4', renderedField.outerEl));

            var filterViewOptions = self.filterView();

            if (filterViewOptions && filterViewOptions['layout'] && filterViewOptions['layout']['bindings'] && filterViewOptions['layout']['bindings']['query']) {
                $('<div style="margin:5px;" class="button">Switch To Full Query</div>').click(
                    function() {
                        $('#column-1', renderedField.outerEl).toggle();
                        $('#column-2', renderedField.outerEl).toggle();
                        $('#column-3', renderedField.outerEl).toggle();
                        var buttonText = $(this).html() == 'Switch To Full Query' ? 'Switch To Detailed Query' : 'Switch To Full Query';
                        $(this).html(buttonText);
                    }).appendTo($('#column-4', renderedField.outerEl));
            }
            /*
             $('<div style="margin:5px;" class="button red">Last</div>').click(function() {
             renderedField.setValue(self.filterDefaultData());
             }).appendTo($('#column-1', renderedField.outerEl));
             */

            $('<div style="margin:5px;" class="button red">Reset</div>').click(
                    function() {
                        renderedField.setValue(self.filterEmptyData());
                    }).appendTo($('#column-4', renderedField.outerEl));
        },

        filterDefaultData : function(el) {
            var defaultData = this.filterEmptyData(el);

            var targetObservable = Alpaca.isFunction(this.FILTER) ? this.FILTER() : this.FILTER;

            var existingData = this.observable(targetObservable).get();

            if (existingData && existingData.formData && !Alpaca.isValEmpty(existingData.formData)) {
                defaultData = existingData.formData;
            }
            return defaultData;
        },

        setupFilter: function(el) {
            var self = this;
            this.filter({
                "displayFilter" : this.consoleSetting('DISPLAY_LIST_FILTER') || this.DISPLAY_LIST_FILTER,
                "form" : {
                    "data": this.filterDefaultData(el),
                    "schema" : this.filterSchema(el),
                    "options" : this.filterOptions(el),
                    "view" : this.filterView(el),
                    "postRender": function (renderedField) {
                        self.filterPostRender(renderedField, self);
                    }
                }
            });
        },

        defaultList: function() {
            return {
                hideIcon : true,
                tableConfig : {
                    'bJQueryUI': false,
                    "oLanguage": {
                        "sLengthMenu": "Show _MENU_ entries"
                    },
                    "aLengthMenu" :[[5,10,25,50,100],[5,10,25,50,100]],
                    "iDisplayLength": this.consoleSetting('LIST_SIZE')
                }
            };
        },

        prepareListPermissionCheck: function(listItem, permissions) {
            var checks = [];
            var userId = this.user().getDomainQualifiedId();
            $.each(permissions, function(i,v) {
                checks.push({
                    "permissionedId": listItem.getId(),
                    "principalId": userId,
                    "permissionId": v
                });
            });
            return checks;
        }
    });

})(jQuery);