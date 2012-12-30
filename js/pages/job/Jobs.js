(function($) {
    Gitana.Console.Pages.Jobs = Gitana.CMS.Pages.AbstractListPageGadget.extend(
        {
            SUBSCRIPTION : "platform-jobs",

            FILTER : "platform-jobs-filters",

            FILTER_TOOLBAR: {
                "query" : {
                    "title" : "Query Jobs",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'job-query', 48)
                }
            },

            constructor: function(id, ratchet) {
                this.base(id, ratchet);
            },

            setup: function() {
                this.get("/jobs", this.index);
            },

            setupMenu: function() {
                this.menu(Gitana.Console.Menu.Platform(this, "menu-platform-jobs"));
            },

            setupBreadcrumb: function() {
                return this.breadcrumb(Gitana.Console.Breadcrumb.PlatformJobs(this));
            },

            setupToolbar: function() {
                var self = this;
                self.base();
                self.addButtons([
                ]);
            },

            targetObject: function() {
                var self = this;
                return this.platform().trap(function(error) {
                    return self.handlePageError(null, error);
                });
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
            resetFilter: function() {
                this.base();
            },

            filterEmptyData: function() {
                return Alpaca.merge(this.base(), {
                    "startTime" : "",
                    "endTime" : "",
                    "status" : ""
                });
            },

            filterFormToJSON: function (formData, renderedField) {
                if (! Alpaca.isValEmpty(formData)) {
                    if (! Alpaca.isValEmpty(formData.query)) {
                        return formData.query;
                    } else {
                        var query = {};
                        if (formData.startDate || formData.endDate) {
                            query["start_timestamp.ms"] = {
                            };
                            if (formData.startDate) {
                                var time = Gitana.Utils.Date.strToDate(formData.startDate).getTime();
                                if (formData.startTime) {
                                    time += Gitana.Utils.Date.strToMs(formData.startTime);
                                }
                                query["start_timestamp.ms"]["$gte"] = time;

                            }
                            if (formData.endDate) {
                                var time = Gitana.Utils.Date.strToDate(formData.endDate).getTime();
                                if (formData.endTime) {
                                    time += Gitana.Utils.Date.strToMs(formData.endTime);
                                } else {
                                    time += 86400000
                                }
                                query["start_timestamp.ms"]["$lt"] = time;
                            }
                        }

                        if (formData.status) {
                            query['status'] = formData.status;
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
                        "status" : {
                            "title": "Job Status",
                            "type" : "string",
                            "enum": ["Unstarted","Running","Failed","Candidate","Finished"]
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
                    "helper" : "Filter list by job start date range, job status or full query.",
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
                        "status" : {
                            "type": "select",
                            "helper": "Pick job status."
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
                            "startDate": "column-1",
                            "endDate": "column-1",
                            "startTime": "column-2",
                            "endTime": "column-2",
                            "status": "column-1",
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
                    "details": {
                        "title": "View Details",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'job', 48),
                        "click": function(job) {
                            self.displayJobDetails(job);
                        }
                    },
                    "kill": {
                        "title": "Kill Job",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'job-delete', 48),
                        "click": function(job) {
                            Gitana.Utils.UI.block("Killing Job " + job.getId() + "...");
                            self.targetObject().readCluster().killJob(job.getId()).then(function() {
                                Gitana.Utils.UI.unblock(function() {
                                    $('.list-toolbar').css({
                                        "border": "0px none"
                                    });
                                    self.resetFilter();
                                });
                            });
                        }
                    }
                });

                list["columns"] = [
                    {
                        "title": "ID",
                        "type":"property",
                        "sortingExpression": "_doc",
                        "property": function(callback) {
                            callback(this.getId());
                        }
                    },
                    {
                        "title": "Type",
                        "type":"property",
                        "sortingExpression": "type",
                        "property": function(callback) {
                            callback(self.listItemProp(this, 'type'));
                        }
                    },
                    {
                        "title": "Status",
                        "type":"property",
                        "property": function(callback) {
                            /*
                            var value = "";
                            if (this.getState() == "WAITING") {
                                value += "<span class='job-status job-started' title='Job Waiting'></span>";
                            }
                            if (this.getState() == "RUNNING") {
                                value += "<span class='job-status job-running' title='Job Running'></span>";
                            }
                            if (this.getState() == "FINISHED") {
                                value += "<span class='job-status job-finished' title='Job Finished'></span>";
                            }
                            if (this.getState() == "ERROR") {
                                value += "<span class='job-status job-error'title='Job Error'></span>";
                            }
                            if (this.getState() == "PAUSED") {
                                value += "<span class='job-status job-paused'title='Job Paused'></span>";
                            }
                            callback(value);
                            */

                            callback(this.getState());
                        }
                    },
                    /*
                     {
                     "title": "Started",
                     "type":"property",
                     "sortingExpression": "is_started",
                     "property": function(callback) {
                     callback(self.listItemProp(this,'is_started'));
                     }
                     },
                     {
                     "title": "Running",
                     "type":"property",
                     "sortingExpression": "is_running",
                     "property": function(callback) {
                     callback(self.listItemProp(this,'is_running'));
                     }
                     },
                     {
                     "title": "Finished",
                     "type":"property",
                     "sortingExpression": "is_finished",
                     "property": function(callback) {
                     callback(self.listItemProp(this,'is_started'));
                     }
                     },
                     {
                     "title": "Error",
                     "type":"property",
                     "sortingExpression": "is_error",
                     "property": function(callback) {
                     callback(self.listItemProp(this,'is_error'));
                     }
                     },
                     */
                    {
                        "title": "Last Modified",
                        "sortingExpression" : "_system.modified_on.ms",
                        "property": function(callback) {
                            var value = this.getSystemMetadata().getModifiedOn().getTimestamp();
                            callback(value);
                        }
                    }
                ];
                list.hideIcon = true;

                list["loadFunction"] = function(query, pagination, callback) {

                    var status = "All";

                    query = self.query();

                    if (query && query['status']) {

                        status = query['status'];

                        delete query['status'];

                    }

                    var jobTargetObject = self.targetObject();

                    switch (status) {

                        case 'All':

                            jobTargetObject.readCluster().queryJobs(query, self.pagination(pagination)).then(function() {
                                callback.call(this);
                            });

                            break;

                        case 'Unstarted':

                            jobTargetObject.readCluster().queryUnstartedJobs(query, self.pagination(pagination)).then(function() {
                                callback.call(this);
                            });

                            break;

                        case 'Running':

                            jobTargetObject.readCluster().queryRunningJobs(query, self.pagination(pagination)).then(function() {
                                callback.call(this);
                            });

                            break;

                        case 'Finished':

                            jobTargetObject.readCluster().queryFinishedJobs(query, self.pagination(pagination)).then(function() {
                                callback.call(this);
                            });

                            break;

                        case 'Failed':

                            jobTargetObject.readCluster().queryFailedJobs(query, self.pagination(pagination)).then(function() {
                                callback.call(this);
                            });

                            break;

                        case 'Candidate':

                            jobTargetObject.readCluster().queryCandidateJobs(query, self.pagination(pagination)).then(function() {
                                callback.call(this);
                            });

                            break;

                        default :

                            break;
                    }
                };

                // store list configuration onto obplatform
                self.list(self.SUBSCRIPTION, list);
            },

            displayJobDetails: function(job) {

                var self = this;

                var title = "Job Details";
                var dialog = "<div id='job-details'></div>";

                job.object = self.populateObjectAll(job);
                job.object.fullJson = JSON.stringify(job.object, null, ' ');

                Alpaca.mergeObject(job.object, job.system);

                var templatePath = (Gitana.Apps.APP_NAME ? "/" : "") + Gitana.Apps.APP_NAME + "/templates/themes/" + Gitana.Apps.THEME + "/jobs/job-details.html";

                $(dialog).empty().alpaca({
                    "data" : job.object,
                    "view" : {
                        "globalTemplate": templatePath
                    },
                    "postRender" : function(renderedField) {
                        renderedField.getEl().dialog({
                            title : "<img src='" + Gitana.Utils.Image.buildImageUri('objects', 'job', 24) + "' /> " + title,
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

            setupPage : function(el) {
                var page = {
                    "title" : "Platform Jobs",
                    "description" : "Display list of platform jobs.",
                    "listTitle" : "Job List",
                    "listIcon" : Gitana.Utils.Image.buildImageUri('objects', 'job', 20),
                    "subscription" : this.SUBSCRIPTION,
                    "filter" : this.FILTER
                };

                this.page(Alpaca.mergeObject(page, this.base(el)));
            }
        });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.Jobs);

})(jQuery);