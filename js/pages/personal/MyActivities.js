(function($) {
    Gitana.Console.Pages.MyActivities = Gitana.Console.Pages.PlatformActivities.extend(
        {
            SUBSCRIPTION : "my-activities",

            FILTER : "my-activity-list-filters",

            setup: function() {
                this.get("/dashboard/activities", this.index);
            },

            contextObject: function() {
                return this.platform();
            },

            /** TODO: what should we check? **/
            requiredAuthorities: function() {
                return [
                ];
            },

            setupMenu: function() {
                this.menu(Gitana.Console.Menu.Dashboard(this, "menu-my-activities"));
            },

            setupBreadcrumb: function() {
                var breadcrumb = [
                    {
                        "text" : "My Activities"
                    }
                ];

                this.breadcrumb(breadcrumb);
            },

            /** Filter Related Methods **/

            filterFormToJSON: function (formData) {
                var query = this.base(formData);
                delete query["userName"];
                return query;
            },

            filterOptions: function() {

                var self = this;

                var options = Alpaca.mergeObject(this.base(), {
                    "fields" : {
                        "userName" : {
                            "hidden" : true
                        }
                    }
                });

                return options;
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
                            var value = this.getSystemMetadata().getModifiedOn().getTimestamp();
                            callback(value);
                        }
                    }
                ];

                list["loadFunction"] = function(query, pagination, callback) {
                    var thisQuery = self.query();
                    thisQuery["userDomainId"] = this.user().getDomainId();
                    thisQuery["userId"] = this.user().getId();
                    var _this;
                    Chain(self.contextObject()).trap(function(error) {
                        return self.handlePageError(el, error);
                    }).queryActivities(thisQuery, self.pagination(pagination)).then(function(){
                        this.each(function() {
                            this['activityDetails'] = Gitana.Utils.Activity.activityDetails(self, this);
                        }).then(function() {
                            callback.call(this);
                        });
                    });
                };

                // store list configuration onto observer
                self.list(self.SUBSCRIPTION, list);
            },

            setupPage : function(el) {

                var msgContext = {
                    "userFullName": this.userDetails().fullName
                };

                var page = {
                    "title": _msg("Personal.MyActivities.title", msgContext),
                    "description": _msg("Personal.MyActivities.description", msgContext),
                    "listTitle" : "My Activity List",
                    "listIcon" : Gitana.Utils.Image.buildImageUri('objects', 'activity', 20),
                    "subscription" : this.SUBSCRIPTION,
                    "filter" : this.FILTER
                };

                this.page(Alpaca.mergeObject(page, this.base(el)));
            }

        });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.MyActivities);

})(jQuery);