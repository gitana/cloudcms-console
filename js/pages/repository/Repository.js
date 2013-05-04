(function($) {
    Gitana.Console.Pages.Repository = Gitana.CMS.Pages.AbstractDashboardPageGadget.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/repositories/{repositoryId}", this.index);
        },

        targetObject: function() {
            return this.repository();
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
            this.menu(Gitana.Console.Menu.Repository(this));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.Repository(this));
        },

        setupToolbar: function() {
            var self = this;
            self.base();
            self.addButtons([
                {
                    "id": "master-branch",
                    "title": "Master Branch",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'master-branch', 48),
                    "url" : self.LINK().call(self,self.branch()),
                    "requiredAuthorities" : [
                        {
                            "permissioned" : self.branch(),
                            "permissions" : ["read"]
                        }
                    ]
                },
                {
                    "id": "create",
                    "title": "New Branch",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'branch-add', 48),
                    "url" : self.LINK().call(self,self.targetObject(),'add','branch'),
                    "requiredAuthorities" : [
                        {
                            "permissioned" : self.targetObject(),
                            "permissions" : ["create_subobjects"]
                        }
                    ]
                },
                {
                    "id": "edit",
                    "title": "Edit Repository",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'repository-edit', 48),
                    "url" : self.LINK().call(self,self.targetObject(),'edit'),
                    "requiredAuthorities" : [
                        {
                            "permissioned" : self.targetObject(),
                            "permissions" : ["update"]
                        }
                    ]
                },
                {
                "id": "delete",
                "title": "Delete Repository",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'repository-delete', 48),
                    "click": function(repository) {
                        self.onClickDelete(self.targetObject(),'repository',self.LIST_LINK().call(self,'repositories'),Gitana.Utils.Image.buildImageUri('objects', 'repository', 20), 'repository');
                    },
                    "requiredAuthorities" : [
                        {
                            "permissioned" : self.targetObject(),
                            "permissions" : ["delete"]
                        }
                    ]
                },
                {
                    "id": "edit-json",
                    "title": "Edit JSON",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'json-edit', 48),
                    "url" : self.LINK().call(self,self.targetObject(),'edit','json'),
                    "requiredAuthorities" : [
                        {
                            "permissioned" : self.targetObject(),
                            "permissions" : ["update"]
                        }
                    ]
                },
                {
                    "id": "export",
                    "title": "Export Repository",
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

        setupRepositoryOverview: function () {
            var self = this;
            var repository = self.targetObject();
            var pairs = {
                "title" : "Overview",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'repository', 20),
                "alert" : "",
                "items" : []
            };

            this._pushItem(pairs.items, {
                "key" : "ID",
                "value" : self.listItemProp(repository,'_doc')
            });
            this._pushItem(pairs.items, {
                "key" : "Title",
                "value" : self.listItemProp(repository,'title')
            });
            this._pushItem(pairs.items, {
                "key" : "Description",
                "value" : self.listItemProp(repository,'description')
            });
            this._pushItem(pairs.items, {
                "key" : "Last Modified",
                "value" : "By " + repository.getSystemMetadata().getModifiedBy() + " @ " + repository.getSystemMetadata().getModifiedOn().getTimestamp()
            });

            this.pairs("repository-overview",pairs);
        },

        setupRepositoryStats: function () {
            var self = this;
            var stats = {
                "title" : "Repository Snapshot",
                "alert" : "",
                "icon" : Gitana.Utils.Image.buildImageUri('browser', 'statistics', 20),
                "items" : [{
                    "key" : "Branches",
                    "value" : "",
                    "link" : "#" + self.LIST_LINK().call(self,"branches")
                },
                {
                    "key" : "Changesets",
                    "value" : "",
                    "link" : "#" + self.LIST_LINK().call(self,"changesets")
                }]
            };

            this.stats("repository-stats",stats);
        },

        setupLatestBranches: function () {
            var self = this;
            var branch = this.branch();
            var pairs = {
                "title" : "Latest Branches",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'branch', 20),
                "alert" : "",
                "items" : [
                ]
            };

            this.pairs("latest-branches",pairs);
        },

        setupLatestChangesets: function () {
            var self = this;
            var pairs = {
                "title" : "Latest Changesets",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'changesets', 20),
                "alert" : "",
                "items" : [
                ]
            };

            this.pairs("latest-changesets",pairs);
        },

        setupDashlets : function () {
            var self = this;

            this.setupRepositoryOverview();
            this.setupRepositoryStats();
            this.setupLatestBranches();
            this.setupLatestChangesets();

            var pagination = self.defaultSnapshotPagination();

            var pagination2 = self.defaultLatestItemsPagination();

            var stats = Alpaca.cloneObject(self.stats("repository-stats"));

            Chain().then(function() {

                var f0 = function() {
                    this.subchain(self.targetObject()).listBranches(pagination).then(function () {
                        stats.items[0]['value'] = this.size() == null ? 0 : this.size();
                    });
                };

                var f1 = function() {
                    this.subchain(self.targetObject()).queryChangesets({},pagination).then(function () {
                        stats.items[1]['value'] = this.size() == null ? 0 : this.size();
                    });
                };

                var f2 = function() {
                    var pairs = Alpaca.cloneObject(self.pairs("latest-branches"));

                    this.subchain(self.targetObject()).queryBranches({}, pagination2).each(function() {
                        pairs['items'].push({
                            "img" : Gitana.Utils.Image.buildImageUri('objects', 'branch', 48),
                            "class" : "block-list-item-img",
                            "value" : self.friendlyTitle(this) + "<div class='block-list-item-desc'>By " + this.getSystemMetadata().getModifiedBy() + " @ " + this.getSystemMetadata().getModifiedOn().getTimestamp() + "</div>",
                            "link" : "#" + self.LINK().call(self, this)
                        });
                    }).totalRows(function (totalRows) {
                        self.processItemsDashlet(totalRows, pairs, self.LIST_LINK().call(self, 'branches'));
                        self.pairs("latest-branches", pairs);
                    });
                };

                var f3 = function() {
                    var pairs = Alpaca.cloneObject(self.pairs("latest-changesets"));

                    this.subchain(self.targetObject()).queryChangesets({},pagination2).each(function() {
                        pairs['items'].push({
                            "img" : Gitana.Utils.Image.buildImageUri('objects', 'changeset', 48),
                            "class" : "block-list-item-img",
                            "value" : self.friendlyTitle(this) + "<div class='block-list-item-desc'>Revision " + self.listItemProp(this, 'revision') + "</div>",
                            "link" : "#" + self.LINK().call(self, this)
                        });
                    }).totalRows(function (totalRows) {
                        self.processItemsDashlet(totalRows,pairs,self.LIST_LINK().call(self,'changesets'));
                        self.pairs("latest-changesets", pairs);
                    });
                };

                this.then([f0,f1,f2,f3]).then(function() {
                    self.stats("repository-stats", stats);
                });
            });

        },

        setupPage : function(el) {

            var title = this.friendlyTitle(this.repository());

            var page = {
                "title" : title,
                "description" : "Overview of repository " + title +".",
                "dashlets" : [
                    {
                        "id" : "overview",
                        "grid" : "grid_12",
                        "gadget" : "pairs",
                        "subscription" : "repository-overview"
                    },
                    {
                        "id" : "stats",
                        "grid" : "grid_12",
                        "gadget" : "stats",
                        "subscription" : "repository-stats"
                    },
                    {
                        "id" : "latest-branches",
                        "gadget" : "pairs",
                        "grid" : "grid_12",
                        "subscription" : "latest-branches"
                    },
                    {
                        "id" : "latest-changesets",
                        "gadget" : "pairs",
                        "grid" : "grid_12",
                        "subscription" : "latest-changesets"
                    }
                ]
            };

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.Repository);

})(jQuery);