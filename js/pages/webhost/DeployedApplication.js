(function($) {
    Gitana.Console.Pages.DeployedApplication = Gitana.CMS.Pages.AbstractDashboardPageGadget.extend({

        setup: function() {
            this.get("/webhosts/{webhostId}/deployedapplications/{deployedApplicationId}", this.index);
        },

        targetObject: function() {
            return this.deployedApplication();
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
            this.menu(Gitana.Console.Menu.DeployedApplication(this));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.DeployedApplication(this));
        },

        setupToolbar: function() {
            var self = this;
            self.base();
            self.addButtons([
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
                    "id": "start",
                    "title": "Start",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'deployed-application-start', 48),
                    "click": function()
                    {
                        self.doModal("Please Confirm...", "Are you sure that you would like to start this deployed application?", "Start", "Starting...", function(cb) {

                            Chain(self.targetObject()).start().then(function() {
                                cb(function() {
                                    var link = self.link(self.targetObject());
                                    self.refresh(link);
                                });
                            });

                        });
                    },
                    "requiredAuthorities" : [
                        {
                            "permissioned" : this.targetObject(),
                            "permissions" : ["update"]
                        }
                    ]
                },
                {
                    "id": "stop",
                    "title": "Stop",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'deployed-application-stop', 48),
                    "click": function()
                    {
                        self.doModal("Please Confirm...", "Are you sure that you would like to stop this deployed application?", "Stop", "Stopping...", function(cb) {

                            Chain(self.targetObject()).stop().then(function() {
                                cb(function() {
                                    var link = self.link(self.targetObject());
                                    self.refresh(link);
                                });
                            });

                        });
                    },
                    "requiredAuthorities" : [
                        {
                            "permissioned" : this.targetObject(),
                            "permissions" : ["update"]
                        }
                    ]
                },
                {
                    "id": "restart",
                    "title": "Restart",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'deployed-application-restart', 48),
                    "click": function()
                    {
                        self.doModal("Please Confirm...", "Are you sure that you would like to restart this deployed application?", "Restart", "Restarting...", function(cb) {

                            Chain(self.targetObject()).restart().then(function() {
                                cb(function() {
                                    var link = self.link(self.targetObject());
                                    self.refresh(link);
                                });
                            });

                        });
                    },
                    "requiredAuthorities" : [
                        {
                            "permissioned" : this.targetObject(),
                            "permissions" : ["update"]
                        }
                    ]
                },
                {
                    "id": "redeploy",
                    "title": "Redeploy",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'deployed-application-redeploy', 48),
                    "click": function()
                    {
                        self.doModal("Please Confirm...", "Are you sure that you would like to redeploy?", "Redeploy", "Redeploying...", function(cb) {

                            Chain(self.targetObject()).redeploy().then(function() {
                                cb(function() {
                                    var link = self.listLink("deployed-applications");
                                    self.refresh(link);
                                });
                            });

                        });
                    },
                    "requiredAuthorities" : [
                        {
                            "permissioned" : this.targetObject(),
                            "permissions" : ["update"]
                        }
                    ]
                },
                {
                    "id": "undeploy",
                    "title": "Undeploy",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'deployed-application-undeploy', 48),
                    "click": function()
                    {
                        self.doModal("Please Confirm...", "Are you sure that you would like to undeploy?", "Undeploy", "Undeploying...", function(cb) {

                            Chain(self.targetObject()).undeploy().then(function() {
                                cb(function() {
                                    var link = self.listLink("deployed-applications");
                                    self.refresh(link);
                                });
                            });

                        });
                    },
                    "requiredAuthorities" : [
                        {
                            "permissioned" : this.targetObject(),
                            "permissions" : ["delete"]
                        }
                    ]
                },
                {
                    "id": "export",
                    "title": "Export",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-export', 48),
                    "url" : self.LINK().call(self, self.targetObject(), 'export'),
                    "requiredAuthorities" : [
                        {
                            "permissioned" : self.targetObject(),
                            "permissions" : ["read"]
                        }
                    ]
                }
            ]);

        },

        setupDeployedApplicationOverview: function ()
        {
            var self = this;
            var deployedApplication = self.targetObject();

            var urlsHtml = "";
            var urls = deployedApplication["urls"] ? deployedApplication["urls"] : [];
            if (urls.length == 0)
            {
                urlsHtml = "None";
            }
            else
            {
                for (var i = 0; i < urls.length; i++)
                {
                    if (i > 0)
                    {
                        urlsHtml += "<br/>";
                    }

                    urlsHtml += "<a target='_blank' href='" + urls[i] + "'>" + urls[i] + "</a>";
                }
            }

            var pairs = {
                "title" : "Overview",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'deployed-application', 20),
                "alert" : "",
                "items" : []
            };
            this._pushItem(pairs.items, {
                "key" : "ID",
                "value" : self.listItemProp(deployedApplication, '_doc')
            });
            this._pushItem(pairs.items, {
                "key" : "Application",
                "value" : self.listItemProp(deployedApplication, 'applicationId')
            });
            this._pushItem(pairs.items, {
                "key" : "Deployment Key",
                "value" : self.listItemProp(deployedApplication, 'deploymentKey')
            });
            this._pushItem(pairs.items, {
                "key" : "Host",
                "value" : self.listItemProp(deployedApplication, 'host')
            });
            this._pushItem(pairs.items, {
                "key" : "URLs",
                "value" : '<div style="display: inline-block;vertical-align: top;">' + urlsHtml + '</div>'
            });
            this._pushItem(pairs.items, {
                "key" : "Status",
                "value" : "Deployed"
            });

            var platform = Chain(this.platform());

            Chain().then(function() {

                var f00 = function() {
                    this.subchain(platform).readApplication(deployedApplication["applicationId"]).then(function () {
                        var title = this.getTitle() ? this.getTitle() : this.getId();
                        self._updateItem(pairs.items, "Application", "<a href='#" + self.link(this) +"'>" + title + "</a>");

                        this.loadDeploymentInfo(deployedApplication.deploymentKey, function(info) {

                            var status = "Deployed and Running";
                            if (!info.active)
                            {
                                status = "Deployed and Stopped";
                            }

                            self._updateItem(pairs.items, "Status", status);
                        });

                    });
                };

                this.then([f00]).then(function() {
                    self.pairs("deployed-application-overview", pairs);
                });
            });

            this.pairs("deployed-application-overview", pairs);
        },

        setupDeployedApplicationDescriptor: function () {
            var self = this;
            var deployedApplication = self.targetObject();

            var include = {
                "title" : "Descriptor",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'deployed-application', 20),
                "alert" : "",
                "html": ""
            };

            var div = $("<div><pre></pre></div>");
            div.css({
                "width": "100%",
                "font-family": "Courier",
                "font-size": "12px"
            });

            var platform = Chain(this.platform());

            Chain().then(function() {

                var f00 = function() {
                    this.subchain(platform).readApplication(deployedApplication["applicationId"]).then(function () {

                        this.loadDeploymentInfo(deployedApplication.deploymentKey, function(info) {

                            var descriptorJson = JSON.stringify(info.descriptor, null, '   ');

                            $(div).find("pre").html(descriptorJson);
                            include.html = $(div).outerHTML();
                        });

                    });
                };

                this.then([f00]).then(function() {
                    self.include("deployed-application-descriptor", include);
                });
            });

            this.include("deployed-application-descriptor", include);
        },

        setupDashlets : function (el, callback)
        {
            this.setupDeployedApplicationOverview();
            this.setupDeployedApplicationDescriptor();
            callback();
        },

        setupPage : function(el) {

            var title = this.friendlyTitle(this.targetObject());

            var page = {
                "title" : title,
                "description" : "Overview of deployed application " + title + ".",
                "dashlets" : [
                    {
                        "id" : "overview",
                        "grid" : "grid_12",
                        "gadget" : "pairs",
                        "subscription" : "deployed-application-overview"
                    },
                    {
                        "id" : "descriptor",
                        "grid" : "grid_12",
                        "gadget" : "include",
                        "subscription" : "deployed-application-descriptor"
                    }
                ]
            };

            this.page(_mergeObject(page, this.base(el)));
        },

        doModal: function(title, body, buttonName, actionMessage, callback)
        {
            var self = this;

            var dialog = $('<div><p>' + body + '</p></div>');

            var config = {
                title : title,
                resizable: true,
                height: 250,
                width: 650,
                modal: true,
                buttons: {}
            };
            config.buttons[buttonName] = function() {

                Gitana.Utils.UI.block(actionMessage);

                callback(function(cb2) {

                    Gitana.Utils.UI.unblock(function() {

                        // we also have to close the dialog
                        $(dialog).dialog("close");

                        cb2();

                    });
                });
            };

            dialog.dialog(config);

            $('.ui-dialog').css("overflow", "hidden");
            $('.ui-dialog-buttonpane').css("overflow", "hidden");
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.DeployedApplication);

})(jQuery);

