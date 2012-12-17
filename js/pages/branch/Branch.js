(function($) {
    Gitana.Console.Pages.Branch = Gitana.CMS.Pages.AbstractDashboardPageGadget.extend(
        {
            constructor: function(id, ratchet) {
                this.base(id, ratchet);
            },

            setup: function() {
                this.get("/repositories/{repositoryId}/branches/{branchId}", this.index);
            },

            targetObject: function() {
                return this.branch();
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
                this.menu(Gitana.Console.Menu.Branch(this));
            },

            setupBreadcrumb: function() {
                return this.breadcrumb(Gitana.Console.Breadcrumb.Branch(this));
            },

            setupToolbar: function() {
                var self = this;
                self.base();
                self.addButtons([
                    {
                        "id": "create-node",
                        "title": "New Node",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'node-add', 48),
                        "url" : self.LINK().call(self, self.targetObject(), 'add', 'node'),
                        "requiredAuthorities" : [
                            {
                                "permissioned" : self.targetObject(),
                                "permissions" : ["create_subobjects"]
                            }
                        ]
                    },
                    {
                        "id": "create-json",
                        "title": "New JSON Node",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'json-add', 48),
                        "url" : self.LINK().call(self, self.targetObject(), 'add', 'jsonnode'),
                        "requiredAuthorities" : [
                            {
                                "permissioned" : self.targetObject(),
                                "permissions" : ["create_subobjects"]
                            }
                        ]
                    },
                    {
                        "id": "create-text",
                        "title": "New Text Node",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'txt-node-add', 48),
                        "url" : this.LINK().call(self, this.targetObject(), 'add', 'textnode'),
                        "requiredAuthorities" : [
                            {
                                "permissioned" : self.targetObject(),
                                "permissions" : ["create_subobjects"]
                            }
                        ]
                    },
                    {
                        "id": "create-html",
                        "title": "New HTML Node",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'html-node-add', 48),
                        "url" : this.LINK().call(self, this.targetObject(), 'add', 'htmlnode'),
                        "requiredAuthorities" : [
                            {
                                "permissioned" : self.targetObject(),
                                "permissions" : ["create_subobjects"]
                            }
                        ]
                    },
                    {
                        "id": "upload-files",
                        "title": "Upload Files",
                        "icon" : Gitana.Utils.Image.buildImageUri('special', 'upload', 48),
                        "url" : this.LINK().call(self, this.targetObject(), 'upload'),
                        "requiredAuthorities" : [
                            {
                                "permissioned" : self.targetObject(),
                                "permissions" : ["create_subobjects"]
                            }
                        ]
                    },
                    {
                        "id": "create-branch",
                        "title": "New Branch",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'branch-add', 48),
                        "url" : self.LINK().call(self, self.targetObject(), 'add', 'branch'),
                        "requiredAuthorities" : [
                            {
                                "permissioned" : self.targetObject(),
                                "permissions" : ["create_subobjects"]
                            }
                        ]
                    },
                    {
                        "id": "edit",
                        "title": "Edit Branch",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'branch-edit', 48),
                        "url" : self.LINK().call(self, self.targetObject(), 'edit'),
                        "requiredAuthorities" : [
                            {
                                "permissioned" : self.targetObject(),
                                "permissions" : ["update"]
                            }
                        ]
                    },
                    {
                        "id": "edit-json",
                        "title": "Edit JSON",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'json-edit', 48),
                        "url" : self.link(self.targetObject(), 'edit', 'json'),
                        "requiredAuthorities" : [
                            {
                                "permissioned" : self.targetObject(),
                                "permissions" : ["update"]
                            }
                        ]
                    }/*,
                    {
                        "id": "export-branch",
                        "title": "Export Branch",
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
                        "id": "import-branch",
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

            setupBranchOverview: function () {
                var self = this;
                var branch = self.targetObject();
                var pairs = {
                    "title" : "Overview",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'branch', 20),
                    "alert" : "",
                    "items" : [
                        {
                            "key" : "ID",
                            "value" : self.listItemProp(branch, '_doc')
                        },
                        {
                            "key" : "Title",
                            "value" : self.listItemProp(branch, 'title')
                        },
                        {
                            "key" : "Description",
                            "value" : self.listItemProp(branch, 'description')
                        },
                        {
                            "key" : "Root Changeset",
                            "value" : self.listItemProp(branch, 'root'),
                            "link" : "#" + self.LIST_LINK().call(self, 'changesets') + self.listItemProp(branch, 'root')
                        },
                        {
                            "key" : "Tip Changeset",
                            "value" : self.listItemProp(branch, 'tip'),
                            "link" : "#" + self.LIST_LINK().call(self, 'changesets') + self.listItemProp(branch, 'tip')
                        },
                        {
                            "key" : "Last Modified",
                            "value" : "By " + branch.getSystemMetadata().getModifiedBy() + " @ " + branch.getSystemMetadata().getModifiedOn().getTimestamp()
                        }
                    ]
                };

                this.pairs("branch-overview", pairs);
            },

            setupBranchStats: function () {
                var self = this;
                var stats = {
                    "title" : "Branch Snapshot",
                    "alert" : "",
                    "icon" : Gitana.Utils.Image.buildImageUri('browser', 'statistics', 20),
                    "items" : [
                        {
                            "key" : "Nodes",
                            "value" : "",
                            "link" : "#" + self.LIST_LINK().call(self, 'nodes')
                        },
                        /*
                         {
                         "key" : "Mounts",
                         "value" : ""
                         },
                         */
                        {
                            "key" : "Association Definitions",
                            "value" : "",
                            "link" : "#" + self.LIST_LINK().call(self, 'definitions')
                        },
                        {
                            "key" : "Type Definitions",
                            "value" : "",
                            "link" : "#" + self.LIST_LINK().call(self, 'definitions')
                        },
                        {
                            "key" : "Feature Definitions",
                            "value" : "",
                            "link" : "#" + self.LIST_LINK().call(self, 'definitions')
                        }
                    ]
                };

                this.stats("branch-stats", stats);
            },

            getListNodeDescription: function(node) {

                var self = this;

                var description = "<div class='block-list-item-desc'>" + self.listItemProp(node, "description") + "</div>";

                if (node.isAssociation()) {

                    var sourceNodeId = node.getSourceNodeId();

                    var targetNodeId = node.getTargetNodeId();

                    var icon = node.getDirectionality() == "UNDIRECTED" ? Gitana.Utils.Image.buildImageUri('special', 'mutual', 16) : Gitana.Utils.Image.buildImageUri('special', 'right', 16);

                    description += "<div class='block-list-item-desc' style='margin-left: 58px;'>" + "<a href='" + self.LIST_LINK().call(self, 'nodes') + sourceNodeId + "'>Source Node</a>" + "<img src='" + icon + "' class='block-list-item-description-img'/>" + "<a href='" + self.LIST_LINK().call(self, 'nodes') + targetNodeId + "'>Target Node</a>" + "</div>";

                }

                return description;
            },

            setupNodePairs: function () {
                var self = this;
                var latestNodesPairs = {
                    "title" : "Latest Nodes of Branch",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'nodes', 20),
                    "alert" : "",
                    "items" : [
                    ]
                };

                var myLatestNodesPairs = {
                    "title" : "My Latest Nodes",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'nodes', 20),
                    "alert" : "",
                    "items" : [
                    ]
                };

                this.pairs("latest-nodes", latestNodesPairs);
                this.pairs("my-latest-nodes", myLatestNodesPairs);
            },

            setupDashlets : function () {
                this.setupBranchOverview();
                this.setupBranchStats();
                this.setupNodePairs();

                var self = this;

                var pagination = self.defaultSnapshotPagination();

                var pagination2 = self.defaultLatestItemsPagination();

                var stats = Alpaca.cloneObject(self.stats("branch-stats"));

                Chain().then(function() {

                    var f00 = function() {
                        this.subchain(self.targetObject()).queryNodes({}, pagination).totalRows(function (totalRows) {
                            stats.items[0]['value'] = totalRows;
                        });
                    };

                    var f01 = function() {
                        this.subchain(self.targetObject()).listDefinitions('association').totalRows(function (totalRows) {
                            stats.items[1]['value'] = totalRows;
                        });
                    };

                    var f02 = function() {
                        this.subchain(self.targetObject()).listDefinitions('type').totalRows(function (totalRows) {
                            stats.items[2]['value'] = totalRows;
                        });
                    };

                    var f03 = function() {
                        this.subchain(self.targetObject()).listDefinitions('feature').totalRows(function (totalRows) {
                            stats.items[3]['value'] = totalRows;
                        });
                    };

                    var f1 = function() {
                        var pagination = self.defaultLatestItemsPagination();

                        var branch = self.targetObject();

                        var typeQNames = [];

                        var getItem = function(item) {
                            var title = item.isAssociation() ? item.getTypeQName() : self.friendlyTitle(item);
                            var description = self.getListNodeDescription(item);
                            return {
                                "img" : Gitana.Utils.Image.imageUri(item, 48),
                                "class" : "block-list-item-img",
                                "value" : title + "<div class='block-list-item-desc'>By " + item.getSystemMetadata().getModifiedBy() + " @ " + item.getSystemMetadata().getModifiedOn().getTimestamp() + "</div>" + description,
                                "link" : "#" + self.LIST_LINK().call(self, 'nodes') + item.getId()
                            };
                        };

                        var latestNodesPairs = Alpaca.cloneObject(self.pairs("latest-nodes"));
                        var myLatestNodesPairs = Alpaca.cloneObject(self.pairs("my-latest-nodes"));

                        this.subchain(self.targetObject()).listDefinitions('type').each(
                            function() {
                                typeQNames.push(this.getQName());
                            }).then(function() {
                                this.subchain(branch).queryNodes({
                                    "_type" : {
                                        "$in" : typeQNames
                                    }
                                }, pagination).each(
                                    function() {
                                        latestNodesPairs['items'].push(getItem(this));
                                    }).totalRows(function (totalRows) {
                                        self.processItemsDashlet(totalRows, latestNodesPairs, self.LIST_LINK().call(self, 'nodes'));
                                        self.pairs("latest-nodes", latestNodesPairs);
                                    });

                                this.subchain(branch).queryNodes({
                                    "_type" : {
                                        "$in" : typeQNames
                                    },
                                    "_system.modified_by_principal_id" : self.user().getId()
                                }, pagination).each(
                                    function() {
                                        myLatestNodesPairs['items'].push(getItem(this));
                                    }).totalRows(function (totalRows) {
                                        self.processItemsDashlet(totalRows, myLatestNodesPairs, self.LIST_LINK().call(self, 'nodes'));
                                        self.pairs("my-latest-nodes", myLatestNodesPairs);
                                    });
                            });
                    };

                    this.then([f00,f01,f02,f03,f1]).then(function() {
                        self.stats("branch-stats", stats);
                    });
                });


            },

            setupPage : function(el) {

                var title = this.friendlyTitle(this.targetObject());

                var page = {
                    "title" : this.friendlyTitle(this.targetObject()),
                    "description" : "Overview of branch '" + title + "' of the repository '" + this.friendlyTitle(this.repository()) + "'.",
                    "dashlets" :[
                        {
                            "id" : "overview",
                            "grid" : "grid_12",
                            "gadget" : "pairs",
                            "subscription" : "branch-overview"
                        },
                        {
                            "id" : "stats",
                            "grid" : "grid_12",
                            "gadget" : "stats",
                            "subscription" : "branch-stats"
                        },
                        {
                            "id" : "latest-nodes",
                            "grid" : "grid_12",
                            "class" : "block-list",
                            "gadget" : "pairs",
                            "subscription" : "latest-nodes"
                        },
                        {
                            "id" : "my-latest-nodes",
                            "grid" : "grid_12",
                            "class" : "block-list",
                            "gadget" : "pairs",
                            "subscription" : "my-latest-nodes"
                        }
                    ]
                };

                this.page(Alpaca.mergeObject(page, this.base(el)));
            }

        });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.Branch);

})(jQuery);