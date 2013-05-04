(function($) {
    Gitana.Console.Pages.Domain = Gitana.CMS.Pages.AbstractDashboardPageGadget.extend(
        {
            constructor: function(id, ratchet) {
                this.base(id, ratchet);
            },

            setup: function() {
                this.get("/domains/{domainId}", this.index);
            },

            targetObject: function() {
                return this.domain();
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
                this.menu(Gitana.Console.Menu.Domain(this));
            },

            setupBreadcrumb: function() {
                return this.breadcrumb(Gitana.Console.Breadcrumb.Domain(this));
            },

            setupToolbar: function() {
                var self = this;
                self.base();
                self.addButtons([
                    {
                        "id": "create-group",
                        "title": "New Group",
                        "icon" : Gitana.Utils.Image.buildImageUri('security', 'group-add', 48),
                        "url" : self.LINK().call(self, self.domain(), 'add', 'group'),
                        "requiredAuthorities" : [
                            {
                                "permissioned" : self.targetObject(),
                                "permissions" : ["create_subobjects"]
                            }
                        ]
                    },
                    {
                        "id": "create-user",
                        "title": "New User",
                        "icon" : Gitana.Utils.Image.buildImageUri('security', 'user-add', 48),
                        "url" : self.LINK().call(self, self.domain(), 'add', 'user'),
                        "requiredAuthorities" : [
                            {
                                "permissioned" : self.targetObject(),
                                "permissions" : ["create_subobjects"]
                            }
                        ]
                    }
                ]);

                self.addButtons([
                    {
                        "id": "edit",
                        "title": "Edit Domain",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'domain-edit', 48),
                        "url" : self.link(this.targetObject(), "edit"),
                        "requiredAuthorities" : [
                            {
                                "permissioned" : this.targetObject(),
                                "permissions" : ["update"]
                            }
                        ]
                    },
                    {
                        "id": "edit-json",
                        "title": "Edit JSON",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'json-edit', 48),
                        "url" : self.link(this.targetObject(), "edit", "json"),
                        "requiredAuthorities" : [
                            {
                                "permissioned" : this.targetObject(),
                                "permissions" : ["update"]
                            }
                        ]
                    },
                    {
                        "id": "export",
                        "title": "Export Domain",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-export', 48),
                        "url" : self.LINK().call(self, self.targetObject(), 'export'),
                        "requiredAuthorities" : [
                            {
                                "permissioned" : self.targetObject(),
                                "permissions" : ["read"]
                            }
                        ]
                    },
                    {
                        "id": "import",
                        "title": "Import Archive",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-import', 48),
                        "url" : self.LINK().call(self, self.targetObject(), 'import'),
                        "requiredAuthorities" : [
                            {
                                "permissioned" : self.targetObject(),
                                "permissions" : ["create_subobjects"]
                            }
                        ]
                    }
                ]);
            },

            setupLatestGroups: function () {
                var self = this;
                var pairs = {
                    "title" : "Latest Groups",
                    "icon" : Gitana.Utils.Image.buildImageUri('security', 'group', 20),
                    "alert" : "",
                    "items" : [
                    ]
                };

                var pagination = self.defaultLatestItemsPagination();

                var domain = this.domain();

                Chain(domain).queryGroups({
                    "teamGroup" : {
                        "$ne" : true
                    }
                }, pagination).each(
                    function() {
                        pairs['items'].push({
                            "img" : Gitana.Utils.Image.buildImageUri('security', 'group', 48),
                            "class" : "block-list-item-img",
                            "value" : self.friendlyTitle(this) + "<div class='block-list-item-desc'>By " + this.getSystemMetadata().getModifiedBy() + " @ " + this.getSystemMetadata().getModifiedOn().getTimestamp() + "</div>",
                            "link" : "#" + self.listLink('groups') + this.getId()
                        });
                    }).totalRows(function (totalRows) {
                        self.processItemsDashlet(totalRows, pairs, self.listLink('groups'));
                        self.pairs("latest-groups", pairs);
                    });

                this.pairs("latest-groups", pairs);
            },

            setupLatestUsers: function () {
                var self = this;
                var pairs = {
                    "title" : "Latest Users",
                    "icon" : Gitana.Utils.Image.buildImageUri('security', 'user', 20),
                    "alert" : "",
                    "items" : [
                    ]
                };

                var pagination = this.defaultLatestItemsPagination();

                var domain = this.domain();

                Chain(domain).listUsers(pagination).each(
                    function() {
                        var avatarImageUri = "css/images/themes/clean/console/misc/avatar_small.png";
                        //if (this.listAttachments(true) && this.listAttachments(true)["avatar"]) {
                        //    avatarImageUri = Gitana.Utils.Image.avatarImageUri(this, 48);
                        //}

                        pairs['items'].push({
                            "img": avatarImageUri,
                            "class" : "block-list-item-img",
                            "value" : "<div class='block-list-item-div'><div class='block-list-item-text'>" + self.friendlyName(this) + "</div><div class='block-list-item-desc'>By " + this.getSystemMetadata().getModifiedBy() + " @ " + this.getSystemMetadata().getModifiedOn().getTimestamp() + "</div></div>"
                        });

                    }).totalRows(function (totalRows) {
                        self.processItemsDashlet(totalRows, pairs, self.listLink('users'));
                        self.pairs("latest-users", pairs);
                    });

                this.pairs("latest-users", pairs);
            },

            setupDomainStats: function () {
                var self = this;
                var stats = {
                    "title" : "Domain Snapshot",
                    "alert" : "",
                    "icon" : Gitana.Utils.Image.buildImageUri('browser', 'statistics', 20),
                    "items" : [
                        {
                            "key" : "Groups",
                            "link" : "#" + this.listLink('groups'),
                            "value" : ""
                        },
                        {
                            "key" : "Users",
                            "link" : "#" + this.listLink('users'),
                            "value" : ""
                        }
                    ]
                };

                var pagination = this.defaultSnapshotPagination();

                var domain = this.domain();

                Chain(domain).queryGroups({
                    "teamGroup" : {
                        "$ne" : true
                    }
                }, pagination).then(function () {
                        stats.items[0]['value'] = this.size() == null ? 0 : this.size();
                        this.subchain(domain).listUsers(pagination).then(function() {
                            stats.items[1]['value'] = this.size() == null ? 0 : this.size();
                        });
                        this.then(function() {
                            self.stats("domain-stats", stats);
                        });
                    });
                this.stats("domain-stats", stats);
            },

            setupDomainPlot : function (el) {

                var self = this;

                var currentTime = new Date();

                var todayDate = Gitana.Utils.Date.strToDate(Gitana.Utils.Date.dateToStr(currentTime));

                var sevenDaysAgo = new Date(todayDate.getTime() - 453600000);

                var barChartSeries = [
                    {
                        "label" : "New Groups"
                    },
                    {
                        "label" : "New Users"
                    },
                    {
                        "label" : "New Vaults"
                    }
                ];

                var dates = [];

                var barChartData = [];

                this.plot("domain-activities", {
                    "title" : "Domain Activities",
                    "icon" : Gitana.Utils.Image.buildImageUri('browser', 'chart', 20),
                    "displayQueryButton" : false,
                    "queryForm" : {
                        "data"  : {
                            "startDate" : Gitana.Utils.Date.dateToStr(sevenDaysAgo),
                            "endDate" : Gitana.Utils.Date.dateToStr(todayDate)
                        },
                        "schema" : {
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
                                }
                            }
                        },
                        "options" : {
                            "fields" : {
                                "startDate" : {
                                    "size": 20
                                },
                                "endDate" : {
                                    "size": 20
                                }
                            }
                        },
                        "view" : {
                            "parent": "VIEW_WEB_EDIT_LAYOUT_GRID_TWO_COLUMN",
                            "layout": {
                                "bindings": {
                                    "startDate": "column-1",
                                    "endDate": "column-2"
                                }
                            }
                        },
                        "postRender": function (renderedField) {
                            var self = this;
                            var endDateControl = renderedField.getControlByPath("endDate");
                            $(endDateControl.field).change(function() {
                                if (renderedField.isValid(true)) {
                                    var val = renderedField.getValue();
                                    self.loadPlot(val);
                                }
                            });
                        }
                    },
                    "data" : barChartData,
                    "options": {
                        // The "seriesDefaults" option is an options object that will
                        // be applied to all series in the chart.
                        seriesDefaults:{
                            renderer:$.jqplot.BarRenderer,
                            rendererOptions: {fillToZero: true}
                        },
                        // Custom labels for the series are specified with the "label"
                        // option on the series option.  Here a series option object
                        // is specified for each series.
                        series: barChartSeries,
                        // Show the legend and put it outside the grid, but inside the
                        // plot container, shrinking the grid to accomodate the legend.
                        // A value of "outside" would not shrink the grid and allow
                        // the legend to overflow the container.
                        legend: {
                            show: true
                            //placement: 'outsideGrid'
                        },
                        axes: {
                            // Use a category axis on the x axis and use our custom ticks.
                            xaxis: {
                                renderer: $.jqplot.CategoryAxisRenderer,
                                ticks: dates
                            },
                            // Pad the y axis just a little so bars can get close to, but
                            // not touch, the grid boundaries.  1.2 is the default padding.
                            yaxis: {
                                min: 0,
                                pad: 1.05,
                                tickInterval: 10,
                                tickOptions: {formatString: '%d'}
                            }
                        }
                    },
                    "loadFunction" : function(query, callback) {
                        // Real work goes here
                        var startDate = query['startDate'];
                        var endDate = query['endDate'];

                        var startTime = Gitana.Utils.Date.strToDate(startDate).getTime();
                        var endTime = Gitana.Utils.Date.strToDate(endDate).getTime() + 86400000;

                        var dates = [];
                        var barChartData = [
                            [],
                            []
                        ];

                        var groupQuery = {
                            "_system.created_on.ms" : {
                                "$gte" : startTime,
                                "$lt" : endTime
                            },
                            "teamGroup" : {
                                "$ne" : true
                            },
                            "type" : "GROUP"
                        };

                        var userQuery = {
                            "_system.created_on.ms" : {
                                "$gte" : startTime,
                                "$lt" : endTime
                            },
                            "type" : "USER"
                        };

                        var datesLookup = [];

                        for (var ms = startTime; ms < endTime; ms += 86400000) {
                            dates.push(Gitana.Utils.Date.dateToStr(new Date(ms)));
                            barChartData[0].push(0);
                            barChartData[1].push(0);
                            datesLookup.push({
                                "startTime" : ms,
                                "endTime" : ms + 86400000
                            });
                        }

                        var domain = self.domain();

                        Chain(domain).trap(
                            function(error) {
                                return self.handlePageError(el, error);
                            }).then(function() {
                                this.queryGroups(groupQuery).each(function() {
                                    var timestamp = this.getSystemMetadata().getCreatedOn().getTime();
                                    var dateIndex = -1;
                                    $.each(datesLookup, function(index, date) {
                                        if (timestamp >= date.startTime && timestamp < date.endTime) {
                                            dateIndex = index;
                                        }
                                    });
                                    if (dateIndex != -1) {
                                        barChartData[0][dateIndex] += 1;
                                    }
                                });
                                this.queryUsers(userQuery).each(function() {
                                    var timestamp = this.getSystemMetadata().getCreatedOn().getTime();
                                    var dateIndex = -1;
                                    $.each(datesLookup, function(index, date) {
                                        if (timestamp >= date.startTime && timestamp < date.endTime) {
                                            dateIndex = index;
                                        }
                                    });
                                    if (dateIndex != -1) {
                                        barChartData[1][dateIndex] += 1;
                                    }
                                });
                                this.then(function() {
                                    callback({
                                        "options" : {
                                            axes: {
                                                xaxis: {
                                                    ticks: dates
                                                }
                                            }
                                        },
                                        "data" : barChartData
                                    });
                                });
                            });
                    }
                });
            },

            setupDashlets : function () {
                this.setupDomainStats();
                this.setupDomainPlot();
                this.setupLatestGroups();
                this.setupLatestUsers();
            },

            setupPage : function(el) {

                var page = {
                    "title" : "Domain Dashboard",
                    "description" : "Overview of domain " + this.friendlyTitle(this.targetObject()) + ".",
                    "dashlets" :[
                        {
                            "id" : "domain-activities",
                            "grid" : "grid_12",
                            "gadget" : "plot",
                            "subscription" : "domain-activities"
                        },
                        {
                            "id" : "stats",
                            "grid" : "grid_12",
                            "gadget" : "stats",
                            "subscription" : "domain-stats"
                        },
                        {
                            "id" : "latest-groups",
                            "grid" : "grid_12",
                            "gadget" : "pairs",
                            "subscription" : "latest-groups"
                        },
                        {
                            "id" : "latest-users",
                            "grid" : "grid_12",
                            "gadget" : "pairs",
                            "subscription" : "latest-users"
                        }
                    ]
                };

                this.page(_mergeObject(page, this.base(el)));
            }
        });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.Domain);

})(jQuery);