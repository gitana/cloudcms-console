(function($) {
    Gitana.Console.Pages.Project = Gitana.CMS.Pages.AbstractDashboardPageGadget.extend({
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/projects/{projectId}", this.index);
        },

        targetObject: function() {
            return this.project();
        },

        contextObject: function() {
            return this.platform();
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
            this.menu(Gitana.Console.Menu.Project(this));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.Project(this));
        },

        setupToolbar: function() {
            var self = this;
            self.base();
            self.addButtons([
                {
                "id": "edit",
                "title": "Edit",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'project-edit', 48),
                    "url" : self.link(this.targetObject(),"edit"),
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
                    "url" : self.link(this.targetObject(),"edit","json"),
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
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'project-delete', 48),
                    "click": function(project) {
                        self.onClickDelete(self.targetObject(),'project',self.listLink('projects'),Gitana.Utils.Image.buildImageUri('objects', 'project', 20), 'project');
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
                }/*,
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
                }*/
            ]);
        },

        setupProjectOverview: function () {
            var self = this;
            var project = self.targetObject();
            var pairs = {
                "title" : "Overview",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'project', 20),
                "alert" : "",
                "items" : []
            };
            this._pushItem(pairs.items, {
                "key" : "ID",
                "value" : self.listItemProp(project, '_doc')
            });
            this._pushItem(pairs.items, {
                "key" : "Title",
                "value" : self.listItemProp(project, 'title')
            });
            this._pushItem(pairs.items, {
                "key" : "Description",
                "value" : self.listItemProp(project, 'description')
            });
            this._pushItem(pairs.items, {
                "key" : "Last Modified",
                "value" : "By " + project.getSystemMetadata().getModifiedBy() + " @ " + project.getSystemMetadata().getModifiedOn().getTimestamp()
            });
            this._pushItem(pairs.items, {
                "key": "Stack",
                "value": "<a href='#" + self.LIST_LINK().call(self, "stacks") + self.listItemProp(project, "stackId") + "'>" + self.listItemProp(project, "stackId") + "</a>"
            });
            this._pushItem(pairs.items, {
                "key": "Project Type",
                "value": self.listItemProp(project, "projectType")
            });

            this.pairs("project-overview", pairs);
        },

        setupDashlets : function () {
            this.setupProjectOverview();
        },

        setupPage : function(el) {

            var title = this.friendlyTitle(this.targetObject());

            var page = {
                "title" : title,
                "description" : "Overview of project " + title + ".",
                "dashlets" : [
                    {
                        "id" : "overview",
                        "grid" : "grid_12",
                        "gadget" : "pairs",
                        "subscription" : "project-overview"
                    }
                ]
            };

            this.page(Alpaca.mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.Project);

})(jQuery);

