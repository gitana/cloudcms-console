(function($) {
    Gitana.Console.Pages.PlatformActivities = Gitana.CMS.Pages.AbstractListPageGadget.extend(
        {
            SUBSCRIPTION : "activities",

            FILTER : "activity-list-filters",

            FILTER_TOOLBAR: {
                "query" : {
                    "title" : "Query Activities",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'query', 48)
                }
            },

            setup: function() {
                this.get("/activities", this.index);
            },

            contextObject: function() {
                return this.platform();
            },

            /** TODO: what should we check? **/
            requiredAuthorities: function() {
                return [
                    {
                        "permissioned" : this.contextObject(),
                        "permissions" : ["read"]
                    }
                ];
            },

            setupMenu: function() {
                this.menu(Gitana.Console.Menu.Platform(this, "menu-platform-activities"));
            },

            setupBreadcrumb: function() {
                return this.breadcrumb(Gitana.Console.Breadcrumb.PlatformActivities(this));
            },

            setupToolbar: function() {
                this.base();
                this.addButtons([
                ]);
            },

            /** Filter Related Methods **/
            filterEmptyData: function() {
                return Alpaca.merge(this.base(), {
                    "type" : [""],
                    "userName" : "",
                    "objectTypeId" : "",
                    "objectDatastoreTypeId" : ""
                });
            },

            filterFormToJSON: function (formData) {
                var query = this.base(formData);
                if (! Alpaca.isValEmpty(formData)) {
                    var json_query = JSON.parse(formData.query);
                    if (Alpaca.isValEmpty(json_query)) {
                        if (formData['type']) {
                            if (formData['type'].length == 1 && formData['type'][0] == "") {
                                // no type selected
                            } else {
                                query['type'] = {
                                    "$in" : formData['type']
                                };
                            }
                        }
                        if (formData['userName']) {
                            query['userName'] = formData['userName'];
                        }
                        if (formData['objectTypeId']) {
                            query['objectTypeId'] = formData['objectTypeId'];
                        }
                        if (formData['objectDatastoreTypeId']) {
                            query['objectDatastoreTypeId'] = formData['objectDatastoreTypeId'];
                        }
                    }
                }

                return query;
            },

            filterSchema: function () {
                return _mergeObject(this.base(), {
                    "properties" : {
                        "type" : {
                            "title": "Activity Type",
                            "type" : "string"
                        },
                        "userName" : {
                            "title": "User Name",
                            "type" : "string"
                        },
                        "objectTypeId" : {
                            "title": "Object Type",
                            "type" : "string"
                        },
                        "objectDatastoreTypeId" : {
                            "title": "Datastore Type",
                            "type" : "string"
                        }
                    }
                });
            },

            filterOptions: function() {

                var self = this;

                var options = _mergeObject(this.base(), {
                    "helper" : "Query nodes by id, title, description, date range, keyword, activity type, object type, datastore type or full query.",
                    "fields" : {
                        "type" : {
                            "type" : "select",
                            "optionLabels" : ['Create','Delete','Update','Join'],
                            "multiple": true,
                            "size" : 5,
                            "helper": "Select one or multiple types."
                        },
                        "userName" : {
                            "size": this.DEFAULT_FILTER_TEXT_SIZE,
                            "helper": "Enter user name."
                        },
                        "objectTypeId" : {
                            "size": this.DEFAULT_FILTER_TEXT_SIZE,
                            "helper": "Enter object type."
                        },
                        "objectDatastoreTypeId" : {
                            "size": this.DEFAULT_FILTER_TEXT_SIZE,
                            "helper": "Enter object datastore type."
                        }
                    }
                });

                options['fields']['type']['dataSource'] = function(field, callback) {
                    field.selectOptions.push({
                        "value": "CREATE",
                        "text": "Create"
                    });
                    field.selectOptions.push({
                        "value": "DELETE",
                        "text": "Delete"
                    });
                    field.selectOptions.push({
                        "value": "UPDATE",
                        "text": "Update"
                    });
                    field.selectOptions.push({
                        "value": "Join",
                        "text": "JOIN"
                    });
                    if (callback) {
                        callback();
                    }
                };

                options['fields']['type']['postRender'] = function(renderedField) {
                    var el = renderedField.getEl();
                    $('select', $(el)).css({
                        "width" : "370px"
                    }).multiselect().multiselectfilter();
                };

                return options;
            },

            filterView: function() {
                return _mergeObject(this.base(), {
                    "layout": {
                        "bindings": {
                            "id": "column-1",
                            "userName": "column-2",
                            "type" : "column-1",
                            "objectTypeId" : "column-2",
                            "objectDatastoreTypeId" : "column-2",
                            "query" : "column-3"
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
                    "details": {
                        "title": "View Details",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'activity', 48),
                        "selection" : "single",
                        "click": function(activity) {
                            self.displayActivityDetails(activity);
                        }
                    }
                });

                list["columns"] = [
                    {
                        "title": "User",
                        "sortingExpression" : "userName",
                        "property": function(callback) {
                            var value = this.getUserName();
                            callback(value);
                        }
                    },
                    {
                        "title": "Details",
                        "type":"property",
                        "sortingExpression": "objectTypeId",
                        "property": function(callback) {
                            var value = this.get('activityDetails')['plainItemText'];
                            callback(value);
                        }
                    },
                    {
                        "title": "Timestamp",
                        "sortingExpression" : "timestamp.ms",
                        "property": function(callback) {
                            //var value = this.getSystemMetadata().getModifiedOn().getTimestamp();
                            var value = this["timestamp"].timestamp;
                            callback(value);
                        }
                    }
                ];

                list["loadFunction"] = function(query, pagination, callback) {
                    var _this;
                    Chain(self.contextObject()).trap(function(error) {
                        return self.handlePageError(el, error);
                    }).queryActivities(self.query(), self.pagination(pagination)).then(function(){
                        //_this = this;
                        this.each(function() {
                            //_this[this.getId()]['activityDetails'] = Gitana.Utils.Activity.activityDetails(self, this);
                            this['activityDetails'] = Gitana.Utils.Activity.activityDetails(self, this);
                        }).then(function() {
                            callback.call(this);
                        });
                    });
                };

                // store list configuration onto observer
                self.list(self.SUBSCRIPTION, list);
            },

            displayActivityDetails: function(activity) {

                var self = this;

                var title = "Activity Details";
                var dialog = "<div id='activity-details'></div>";

                activity.object = self.populateObjectAll(activity);
                activity.object.fullJson = JSON.stringify(activity.object, null, ' ');

                //_mergeObject(activity.object, activity.system);

                var templatePath = (Gitana.Apps.APP_NAME ? "/" : "") + Gitana.Apps.APP_NAME + "/templates/themes/" + Gitana.Apps.THEME + "/activities/activity-details.html";

                $(dialog).empty().alpaca({
                    "data" : activity.object,
                    "view" : {
                        "globalTemplate": templatePath
                    },
                    "postRender" : function(renderedField) {
                        renderedField.getEl().dialog({
                            title : "<img src='" + Gitana.Utils.Image.buildImageUri('objects', 'activity', 20) + "' /> " + title,
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

                var msgContext = {};

                var page = {
                    "title" : _msg("Platform.Activities.title", msgContext),
                    "description" : _msg("Platform.Activities.description", msgContext),
                    "listTitle" : "Platform Activity List",
                    "listIcon" : Gitana.Utils.Image.buildImageUri('objects', 'activity', 20),
                    "subscription" : this.SUBSCRIPTION,
                    "filter" : this.FILTER
                };

                this.page(_mergeObject(page, this.base(el)));
            }

        });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.PlatformActivities);

})(jQuery);