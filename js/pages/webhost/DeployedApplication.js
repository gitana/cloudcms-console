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
                    "id": "edit",
                    "title": "Edit",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'deployed-application-edit', 48),
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
                    "id": "delete",
                    "title": "Delete",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'deployed-application-delete', 48),
                    "click": function(autoClientMapping) {
                        self.onClickDelete(self.targetObject(), 'deployed application', self.listLink('deployed-applications'), Gitana.Utils.Image.buildImageUri('objects', 'deployed-application', 24), 'deployed application');
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

        setupDeployedApplicationOverview: function () {
            var self = this;
            var deployedApplication = self.targetObject();

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
                "key" : "Host",
                "value" : self.listItemProp(deployedApplication, 'host')
            });
            this._pushItem(pairs.items, {
                "key" : "Scope",
                "value" : self.listItemProp(deployedApplication, 'scope')
            });
            this._pushItem(pairs.items, {
                "key" : "Platform ID",
                "value" : self.listItemProp(deployedApplication, 'platformId')
            });

            this.pairs("deployed-application-overview", pairs);
        },

        setupDashlets : function () {
            this.setupDeployedApplicationOverview();
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
                    }
                ]
            };

            this.page(_mergeObject(page, this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.DeployedApplication);

})(jQuery);

