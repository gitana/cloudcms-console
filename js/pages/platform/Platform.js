(function($) {
    Gitana.Console.Pages.Platform = Gitana.CMS.Pages.AbstractDashboardPageGadget.extend(
        {
            constructor: function(id, ratchet) {
                this.base(id, ratchet);
            },

            setup: function() {
                this.get("/", this.index);
            },

            targetObject: function() {
                return this.platform();
            },

            requiredAuthorities: function() {
                return [
                    {
                        "permissioned" : this.targetObject(),
                        "permissions" : ["update"]
                    }
                ];
            },

            handleUnauthorizedPageAccess: function(el, error) {
                this.app().run('GET', '/dashboard');
            },

            setupMenu: function() {
                this.menu(Gitana.Console.Menu.Platform(this));
            },

            setupBreadcrumb: function() {
                return this.breadcrumb(Gitana.Console.Breadcrumb.Platform(this));
            },

            setupToolbar: function() {
                var self = this;
                self.base();
                self.addButtons([
                    {
                        "id": "create-domain",
                        "title": "New Domain",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'domain-add', 48),
                        "url" : '/add/domain',
                        "requiredAuthorities" : [
                            {
                                "permissioned" : self.targetObject(),
                                "permissions" : ["create_subobjects"]
                            }
                        ]
                    },
                    {
                        "id": "create-repository",
                        "title": "New Repository",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'repository-add', 48),
                        "url" : '/add/repository',
                        "requiredAuthorities" : [
                            {
                                "permissioned" : self.targetObject(),
                                "permissions" : ["create_subobjects"]
                            }
                        ]
                    },
                    {
                        "id": "create-vault",
                        "title": "New Vault",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'vault-add', 48),
                        "url" : '/add/vault',
                        "requiredAuthorities" : [
                            {
                                "permissioned" : self.targetObject(),
                                "permissions" : ["create_subobjects"]
                            }
                        ]
                    },
                    {
                        "id": "create-registrar",
                        "title": "New Registrar",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'registrar-add', 48),
                        "url" : '/add/registrar',
                        "requiredAuthorities" : [
                            {
                                "permissioned" : self.targetObject(),
                                "permissions" : ["create_subobjects"]
                            }
                        ]
                    },
                    {
                        "id": "create-application",
                        "title": "New Application",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'application-add', 48),
                        "url" : '/add/application',
                        "requiredAuthorities" : [
                            {
                                "permissioned" : self.targetObject(),
                                "permissions" : ["create_subobjects"]
                            }
                        ]
                    },
                    {
                        "id": "create-stack",
                        "title": "New Stack",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'stack-add', 48),
                        "url" : '/add/stack',
                        "requiredAuthorities" : [
                            {
                                "permissioned" : self.targetObject(),
                                "permissions" : ["create_subobjects"]
                            }
                        ]
                    },
                    {
                        "id": "edit",
                        "title": "Edit Platform",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'tenant-edit', 48),
                        "url" : "/edit",
                        "requiredAuthorities" : [
                            /*
                             {
                             "permissioned" : this.myTenant(),
                             "permissions" : ["update"]
                             }
                             */
                        ]
                    },
                    {
                        "id": "export",
                        "title": "Export Platform",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-export', 48),
                        "url" : "/export",
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
                        "url" : "/import",
                        "requiredAuthorities" : [
                             {
                             "permissioned" : self.targetObject(),
                             "permissions" : ["read"]
                             }
                        ]
                    }
                    /*
                     ,
                     {
                     "id": "edit-json",
                     "title": "Edit JSON",
                     "icon" : Gitana.Utils.Image.buildImageUri('objects', 'json-edit', 48),
                     "url" : "/edit/json",
                     "requiredAuthorities" : [

                     {
                     "permissioned" : this.myTenant(),
                     "permissions" : ["update"]
                     }

                     ]
                     }
                     */
                ]);

                this.toolbar(self.SUBSCRIPTION + "-toolbar", {
                    "items" : {}
                });
            },

            setupLatestActivities: function (el) {
                var pairs = {
                    "title" : "Latest Activities",
                    "alert" : "",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'activity', 20),
                    "items" : [
                    ]
                };
                this.pairs("latest-activities", pairs);
            },

            setupPlatformStats: function (el) {
                var self = this;
                var stats = {
                    "title" : "Platform Snapshot",
                    "alert" : "",
                    "icon" : Gitana.Utils.Image.buildImageUri('browser', 'statistics', 20),
                    "items" : [
                        {
                            "key" : "Domains",
                            "link" : "#" + this.listLink('domains'),
                            "value" : ""
                        },
                        {
                            "key" : "Repositories",
                            "link" : "#" + this.listLink('repositories'),
                            "value" : ""
                        },
                        {
                            "key" : "Vaults",
                            "link" : "#" + this.listLink('vaults'),
                            "value" : ""
                        },
                        {
                            "key" : "Registrars",
                            "link" : "#" + this.listLink('registrars'),
                            "value" : ""
                        },
                        {
                            "key" : "Applications",
                            "link" : "#" + this.listLink('applications'),
                            "value" : ""
                        },
                        {
                            "key" : "Web Hosts",
                            "link" : "#" + this.listLink('webhosts'),
                            "value" : ""
                        }
                    ]
                };

                this.stats("platform-stats", stats);
            },

            setupPlatformPlot : function (el) {

                var self = this;

                var currentTime = new Date();

                var todayDate = Gitana.Utils.Date.strToDate(Gitana.Utils.Date.dateToStr(currentTime));

                var sevenDaysAgo = new Date(todayDate.getTime() - 453600000);

                var barChartSeries = [
                    {
                        "label" : "New Domains"
                    },
                    {
                        "label" : "New Repositories"
                    },
                    {
                        "label" : "New Vaults"
                    },
                    {
                        "label" : "New Stacks"
                    }
                ];

                var dates = [];

                var barChartData = [];

                this.plot("platform-activities", {
                    "title" : "Platform Overview",
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
                            [],
                            [],
                            []
                        ];

                        var query = {
                            "type" : "CREATE",
                            "objectDatastoreTypeId": "platform",
                            "objectTypeId"  : {
                                "$in" : ["domain","repository","vault","stack"]
                            },
                            "timestamp.ms" : {
                                "$gte" : startTime,
                                "$lt" : endTime
                            }
                        };

                        var datesLookup = [];

                        for (var ms = startTime; ms < endTime; ms += 86400000) {
                            dates.push(Gitana.Utils.Date.dateToStr(new Date(ms)));
                            barChartData[0].push(0);
                            barChartData[1].push(0);
                            barChartData[2].push(0);
                            barChartData[3].push(0);
                            datesLookup.push({
                                "startTime" : ms,
                                "endTime" : ms + 86400000
                            });
                        }

                        Chain(self.platform()).trap(function(error) {
                            return self.handlePageError(el, error);
                        }).queryActivities(query).each(function() {
                            var timestamp = this.get('timestamp')['ms'];
                            var dateIndex = -1;
                            $.each(datesLookup, function(index, date) {
                                if (timestamp >= date.startTime && timestamp < date.endTime) {
                                    dateIndex = index;
                                }
                            });
                            if (dateIndex != -1) {
                                var objectTypeId = this.getObjectTypeId();
                                switch (objectTypeId) {
                                    case "domain" :
                                        barChartData[0][dateIndex] += 1;
                                        break;
                                    case "repository" :
                                        barChartData[1][dateIndex] += 1;
                                        break;
                                    case "vault" :
                                        barChartData[2][dateIndex] += 1;
                                        break;
                                    case "stack" :
                                        barChartData[3][dateIndex] += 1;
                                        break;
                                }
                            }
                        }).then(function() {
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
                    }
                });
            },

            setupDashlets : function (el) {
                this.setupPlatformPlot(el);
                this.setupPlatformStats(el);
                this.setupLatestActivities(el);

                var self = this;

                var pagination = self.defaultPlatformActivitiesPagination();

                var stats = Alpaca.cloneObject(self.stats("platform-stats"));

                var platform = Chain(this.platform());

                Chain().then(function() {

                    var f00 = function() {
                        this.subchain(platform).then(function() {
                            this.loadInfo(function (response) {
                                var counts = response["datastore_counts"];
                                stats.items[0]['value'] = counts["domain"];
                                stats.items[1]['value'] = counts["repository"];
                                stats.items[2]['value'] = counts["vault"];
                                stats.items[3]['value'] = counts["registrar"];
                                stats.items[4]['value'] = counts["application"];
                                stats.items[5]['value'] = counts["webhost"];
                            });
                        });
                    };

                    var f0 = function() {
                        var pairs = Alpaca.cloneObject(self.pairs("latest-activities"));
                        this.subchain(platform).listActivities(pagination).each(
                            function() {
                                var activityDetails = Gitana.Utils.Activity.activityDetails(self, this);

                                pairs['items'].push({
                                    //"img" : Gitana.Utils.Image.buildImageUri('objects', activityDetails.iconId, 48),
                                    "img": activityDetails.userAvatarUri,
                                    "class" : "block-list-item-img",
                                    "value" : activityDetails.itemText + "." + "<div class='block-list-item-desc'>" + " @ " + this.get('timestamp')['timestamp'] + "</div>"
                                });
                            }).totalRows(function (totalRows) {
                                self.processItemsDashlet(totalRows, pairs, self.listLink('activities'));
                                self.pairs("latest-activities", pairs);
                            });
                    };

                    this.then([f00,f0]).then(function() {
                        self.stats("platform-stats", stats);
                    });
                });
            },

            setupPage : function(el) {

                var page = {
                    "title" : "Platform Dashboard",
                    "description" : "Platform overview of tenant " + this.friendlyTitle(this.tenantDetails()) + ".",
                    "dashlets" :[
                        {
                            "id" : "platform-activities",
                            "grid" : "grid_12",
                            "gadget" : "plot",
                            "subscription" : "platform-activities"
                        },
                        {
                            "id" : "stats",
                            "grid" : "grid_12",
                            "gadget" : "stats",
                            "subscription" : "platform-stats"
                        },
                        {
                            "id" : "latest-activities",
                            "grid" : "grid_12",
                            "gadget" : "pairs",
                            "subscription" : "latest-activities"
                        }
                    ]
                };

                this.page(Alpaca.mergeObject(page, this.base(el)));
            }
        });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.Platform);

})(jQuery);