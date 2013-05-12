(function($) {
    Gitana.Console.Pages.DeployedApplications = Gitana.CMS.Pages.AbstractListPageGadget.extend(
        {
            SUBSCRIPTION : "deployed-applications",

            FILTER : "deployed-application-list-filters",

            FILTER_TOOLBAR: {
                "query" : {
                    "title" : "Query",
                    "icon" : Gitana.Utils.Image.buildImageUri('browser', 'query', 48)
                }
            },

            setup: function() {
                this.get("/webhosts/{webhostId}/deployedapplications", this.index);
            },

            targetObject: function() {
                return this.webhost();
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
                this.menu(Gitana.Console.Menu.Webhost(this, "menu-webhost-deployed-applications"));
            },

            setupBreadcrumb: function() {
                return this.breadcrumb(Gitana.Console.Breadcrumb.DeployedApplications(this));
            },

            setupToolbar: function() {
                var self = this;
                self.base();
                self.addButtons([
                    {
                        "id": "deploy",
                        "title": "New Deployment",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'deployed-application-add', 48),
                        "url" : this.LINK().call(self, this.targetObject(), 'add', 'deployedapplication'),
                        "requiredAuthorities" : [
                            {
                                "permissioned" : self.targetObject(),
                                "permissions" : ["create_subobjects"]
                            }
                        ]
                    },
                    {
                        "id": "import",
                        "title": "Import Archive",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-import', 48),
                        "url" : this.LINK().call(this, this.contextObject(), 'import'),
                        "requiredAuthorities" : [
                            {
                                "permissioned" : this.contextObject(),
                                "permissions" : ["create_subobjects"]
                            }
                        ]
                    }
                ]);

                this.toolbar(self.SUBSCRIPTION + "-toolbar", {
                    "items" : {}
                });
            },

            searchFilter: function(key) {

                var query = this.base(key);
                query["$or"].push({
                    "applicationId": {
                        "$regex" : key
                    },
                    "deploymentKey": {
                        "$regex" : key
                    },
                    "deploymentWebhost": {
                        "$regex" : key
                    },
                    "host": {
                        "$regex" : key
                    },
                    "urls": {
                        "$regex" : key
                    }
                });

                return query;
            },


            /** Filter Related Methods **/
            filterEmptyData: function() {
                return Alpaca.merge(this.base(), {
                    "applicationId" : "",
                    "deploymentKey" : "",
                    "host" : "",
                    "urls": ""
                });
            },

            filterFormToJSON: function (formData) {
                var query = this.base(formData);
                if (! Alpaca.isValEmpty(formData)) {
                    var json_query = JSON.parse(formData.query);
                    if (Alpaca.isValEmpty(json_query)) {
                        if (formData['applicationId']) {
                            query['applicationId'] = formData['applicationId'];
                        }
                        if (formData['deploymentKey']) {
                            query['deploymentKey'] = formData['deploymentKey'];
                        }
                        if (formData['host']) {
                            query['host'] = formData['host'];
                        }
                        if (formData['urls']) {
                            query['urls'] = formData['urls'];
                        }
                    }
                }

                return query;
            },

            filterSchema: function () {
                return _mergeObject(this.base(), {
                    "properties" : {
                        "applicationId": {
                            "title": "Application ID",
                            "type": "string"
                        },
                        "deploymentKey": {
                            "title": "Deployment Key",
                            "type": "string"
                        },
                        "host" : {
                            "title": "Host",
                            "type" : "string"
                        },
                        "urls" : {
                            "title": "URLs",
                            "type" : "string"
                        }
                    }
                });
            },

            filterOptions: function() {

                var self = this;

                var options = _mergeObject(this.base(), {
                    //"helper" : "Query deployed applications by id, title, description, date range, client key, uri or full query.",
                    "fields" : {
                        "applicationId" : {
                            "size": this.DEFAULT_FILTER_TEXT_SIZE
                        },
                        "deploymentKey" : {
                            "size": this.DEFAULT_FILTER_TEXT_SIZE
                        },
                        "host" : {
                            "size": this.DEFAULT_FILTER_TEXT_SIZE
                        },
                        "urls" : {
                            "size": this.DEFAULT_FILTER_TEXT_SIZE
                        }
                    }
                });

                return options;
            },

            filterView: function() {
                return _mergeObject(this.base(), {
                    "layout": {
                        "bindings": {
                            "applicationId" : "column-1",
                            "deploymentKey": "column-1",
                            "host" : "column-2",
                            "urls" : "column-2"
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
                    /*
                    "edit": {
                        "title": "Edit",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'deployed-application-edit', 48),
                        "click": function(deployedApplication){
                            self.app().run("GET", self.link(deployedApplication, 'edit'));
                        },
                        "requiredAuthorities" : {
                            "permissions" : ["update"]
                        }
                    },
                    */
                    "editJSON": {
                        "title": "Edit JSON",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'json-edit', 48),
                        "click": function(deployedApplication) {
                            self.app().run("GET", self.link(deployedApplication,'edit','json'));
                        },
                        "requiredAuthorities" : {
                            "permissions" : ["update"]
                        }
                    },
                    "delete": {
                        "title": "Delete",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'deployed-application-delete', 48),
                        "selection" : "multiple",
                        "click": function(deployedApplications) {
                            self.onClickDeleteMultiple(self.targetObject(), deployedApplications, "deployed application", self.LIST_LINK().call(self, 'deployed-applications'), Gitana.Utils.Image.buildImageUri('objects', 'deployed-application', 24), 'deployed application');
                        },
                        "requiredAuthorities" : {
                            "permissions" : ["delete"]
                        }
                    },
                    "export": {
                        "title": "Export",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-export', 48),
                        "click": function(deployedApplications) {
                            self.app().run("GET", self.LINK().call(self, deployedApplications, 'export'));
                        },
                        "requiredAuthorities" : {
                            "permissions" : ["read"]
                        }
                    }
                });

                list["columns"] = [
                    {
                        "title": "Title",
                        "type":"property",
                        "property": function(callback) {
                            var value = self.listItemProp(this, 'title');
                            callback(value);
                        }
                    },
                    {
                        "title": "Application",
                        "type":"property",
                        "property": function(callback) {
                            var value = "<a href='#/applications/" + this.applicationId + "'>" + this.applicationId + "</a>";
                            callback(value);
                        }
                    },
                    {
                        "title": "URLs",
                        "type":"property",
                        "property": function(callback) {

                            var value = "";
                            for (var i = 0; i < this.urls.length; i++)
                            {
                                value += "<a href='" + this.urls[i] + "' target='_blank'>" + this.urls[i] + "</a><br/>";
                            }

                            callback(value);
                        }
                    },
                    {
                        "title": "Deployment Key",
                        "type":"property",
                        "property": function(callback) {

                            var value = self.listItemProp(this, 'deploymentKey');
                            callback(value);
                        }
                    },
                    {
                        "title": "Deployment Status",
                        "type": "property",
                        "property": function(callback) {
                            callback("");
                        }
                    }
                ];

                list["loadFunction"] = function(query, pagination, callback) {
                    var checks = [];
                    Chain(self.targetObject()).trap(
                        function(error) {
                            return self.handlePageError(el, error);
                        }).queryDeployedApplications(self.query(), self.pagination(pagination)).each(
                        function() {
                            $.merge(checks, self.prepareListPermissionCheck(this, ['read','delete']));
                        }).then(function() {
                            var _this = this;
                            this.subchain(self.targetObject()).checkDeployedApplicationsPermissions(checks, function(checkResults) {
                                self.updateUserRoles(checkResults);
                                callback.call(_this);
                            });
                        });
                };

                // store list configuration onto observer
                self.list(self.SUBSCRIPTION, list);
            },

            setupPage : function(el) {
                var page = {
                    "title" : "Deployed Applications",
                    "description" : "Display list of deployed applications for web host " + this.friendlyTitle(this.targetObject()) + ".",
                    "listTitle" : "Deployed Applications",
                    "listIcon" : Gitana.Utils.Image.buildImageUri('objects', 'deployed-application', 20),
                    "subscription" : this.SUBSCRIPTION,
                    "filter" : this.FILTER
                };

                this.page(_mergeObject(page, this.base(el)));
            }
        });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.DeployedApplications);

})(jQuery);