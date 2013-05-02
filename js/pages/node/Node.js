(function($) {
    Gitana.Console.Pages.Node = Gitana.CMS.Pages.AbstractDashboardPageGadget.extend(
        {
            setup: function() {
                this.get("/repositories/{repositoryId}/branches/{branchId}/nodes/{nodeId}", this.index);
            },

            targetObject: function() {

                if (!this._targetNode) {
                    if (this.node().get('_is_association')) {
                        this._targetNode = new Gitana.Association(this.branch(), this.node().object);
                    } else {
                        this._targetNode = this.node();
                    }
                }

                return Chain(this._targetNode);
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
                var self = this;
                this.menu(Gitana.Console.Menu.Node(this));
            },

            setupBreadcrumb: function() {
                return this.breadcrumb(Gitana.Console.Breadcrumb.Node(this));
            },

            setupToolbar: function() {
                var self = this;
                self.base();
                var targetNode = this.targetObject();
                var buttons = [];

                if (targetNode.getTypeQName() != "n:root") {
                    buttons = [
                        {
                            "id": "edit",
                            "title": targetNode.isAssociation() ? "Edit Association" : "Edit Node",
                            "icon" : targetNode.isAssociation() ? Gitana.Utils.Image.buildImageUri('objects', 'association-edit', 48) : Gitana.Utils.Image.buildImageUri('objects', 'node-edit', 48),
                            "url" : targetNode.isAssociation() ? self.LINK().call(self, self.targetObject(), 'edit') : self.LINK().call(self, self.targetObject(), 'edit'),
                            //"url" : targetNode.isAssociation() ? self.LINK().call(self,self.node(),'edit','association') : self.LINK().call(self,self.node(),'edit'),
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
                            "url" : self.LINK().call(self, self.targetObject(), 'edit', 'json'),
                            "requiredAuthorities" : [
                                {
                                    "permissioned" : self.targetObject(),
                                    "permissions" : ["update"]
                                }
                            ]
                        },
                        {
                            "id": "delete",
                            "title": targetNode.isAssociation() ? "Delete Association" : "Delete Node",
                            "icon" : targetNode.isAssociation() ? Gitana.Utils.Image.buildImageUri('objects', 'association-delete', 48) : Gitana.Utils.Image.buildImageUri('objects', 'node-delete', 48),
                            "click": function(repository) {
                                self.onClickDelete(self.targetObject(), 'node', self.LIST_LINK().call(self, 'nodes'), Gitana.Utils.Image.buildImageUri('objects', 'node', 20), 'node');
                            },
                            "requiredAuthorities" : [
                                {
                                    "permissioned" : self.targetObject(),
                                    "permissions" : ["delete"]
                                }
                            ]
                        },
                        {
                            "id": "touch",
                            "title": "Touch Node",
                            "icon" : Gitana.Utils.Image.buildImageUri('browser', 'refresh', 48),
                            "click": function() {
                                Gitana.Utils.UI.block("Touching " + self.friendlyTitle(self.targetObject()) + " ...");
                                Chain(self.targetObject()).touch().then(function() {

                                    Gitana.Utils.UI.unblock(function() {
                                        self.refresh(self.LINK().call(self, self.targetObject()));
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
                            "id": "copy",
                            "title": "Copy Node",
                            "icon" : Gitana.Utils.Image.buildImageUri('browser', 'copy', 48),
                            "click": function(node) {
                                self.onClickCopy(self.targetObject(),self.LINK().call(self, self.targetObject()),'node-48');
                            },
                            "requiredAuthorities" : [
                                {
                                    "permissioned" : self.targetObject(),
                                    "permissions" : ["read"]
                                }
                            ]
                        },
                        {
                            "id": "export",
                            "title": "Export Node",
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
                    ];
                }

                if (targetNode.isContainer()) {
                    buttons.push({
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
                    });
                }

                if (!targetNode.isAssociation()) {
                    buttons.push({
                        "id": "preview",
                        "title": "Preview Node",
                        "icon" : Gitana.Utils.Image.buildImageUri('special', 'preview', 48),
                        "url" : self.LINK().call(self, self.targetObject(), 'preview')
                    });
                }

                self.addButtons(buttons);
            },

            setupNodeOverview: function () {
                var self = this;
                var node = self.targetObject();
                var pairs = {
                    "title" : "Overview",
                    "icon" : node.isAssociation() ? Gitana.Utils.Image.buildImageUri('objects', 'association', 20) : Gitana.Utils.Image.buildImageUri('objects', 'node', 20),
                    "alert" : "",
                    "items" : []
                };
                this._pushItem(pairs.items, {
                    "key" : "ID",
                    "value" : self.listItemProp(node, '_doc')
                });
                this._pushItem(pairs.items, {
                    "key" : "Title",
                    "value" : self.listItemProp(node, 'title')
                });
                this._pushItem(pairs.items, {
                    "key" : "Description",
                    "value" : self.listItemProp(node, 'description')
                });
                this._pushItem(pairs.items, {
                    "key" : "Type",
                    "value" : node.getTypeQName()
                });
                this._pushItem(pairs.items, {
                    "key" : "QName",
                    "value" : node.getQName()
                });
                this._pushItem(pairs.items, {
                    "key" : "Last Modified",
                    "value" : "By " + this.node().getSystemMetadata().getModifiedBy() + " @ " + this.node().getSystemMetadata().getModifiedOn().getTimestamp()
                });

                this.pairs("node-overview", pairs);

                if (node.isAssociation()) {

                    node.then(function() {

                        pairs.items.push({
                            "key" : "Directionality",
                            "value" : node.getDirectionality()
                        });

                        this.readSourceNode().then(function() {
                            pairs.items.push({
                                "key" : "Source Node",
                                "value" : self.friendlyTitle(this),
                                "link" : "#" + self.LINK().call(self, this)
                            });
                        });

                        this.readTargetNode().then(function() {
                            pairs.items.push({
                                "key" : "Target Node",
                                "value" : self.friendlyTitle(this),
                                "link" : "#" + self.LINK().call(self, this)
                            });
                        });

                        this.then(function() {
                            self.pairs("node-overview", pairs);
                        });

                    });
                }

                if (node.getTypeQName() == "n:person") {
                    var person = new Gitana.Person(this.branch(), node.object);
                    pairs.items.push({
                        "key" : "Principal",
                        "value" : person.getPrincipalName(),
                        "link" : "#" + self.LIST_LINK().call(self, "domains") + person.getPrincipalDomainId() + "/users/" + person.getPrincipalId()
                    });
                    self.pairs("node-overview", pairs);
                }

                // read the definition and plug in
                Chain(node.getBranch()).readDefinition(node.getTypeQName()).then(function() {
                    var link = "#" + self.LIST_LINK().call(self, "definitions") + this.getId();
                    self._updateItem(pairs.items, "Type", null, link);
                    self.pairs("node-overview", pairs);
                })

            },

            setupNodeSnapshot: function () {
                var self = this;
                var stats = {
                    "title" : "Node Snapshot",
                    "alert" : "",
                    "icon" : Gitana.Utils.Image.buildImageUri('browser', 'statistics', 20),
                    "items" : [
                        {
                            "key" : "Attachments",
                            "value" : 0,
                            "link" : "#" + self.LINK().call(self, this.targetObject(), 'attachments')
                        },
                        {
                            "key" : "Associations",
                            "value" : 0,
                            "link" : "#" + self.LINK().call(self, this.targetObject(), 'associations')
                        }
                    ]
                };

                var pagination = self.defaultSnapshotPagination();

                Chain().then(function() {

                    var f0 = function() {
                        this.subchain(self.node()).listAttachments().count(function(count) {
                            stats.items[0]['value'] = count;
                        });
                    };

                    var f1 = function() {
                        this.subchain(self.node()).associations({}, pagination).totalRows(function(totalRows) {
                            stats.items[1]['value'] = totalRows;
                        });
                    };

                    this.then([f0,f1]).then(function() {
                        self.stats("node-snapshot", stats);
                    });
                });

                this.stats("node-snapshot", stats);
            },

            setupNodeStats: function () {
                var self = this;
                var stats = {
                    "title" : "Node Statistics",
                    "alert" : "",
                    "icon" : Gitana.Utils.Image.buildImageUri('browser', 'statistics', 20),
                    "items" : []
                };

                var node = this.node();

                if (node.stats) {
                    $.each(node.stats(), function(key, val) {
                        stats.items.push({
                            "key" :  key,
                            "value" : val
                        });
                    });
                }

                this.stats("node-stats", stats);
            },

            setupLatestNeighbors: function () {
                var self = this;
                var pairs = {
                    "title" : "Neighbors",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'nodes', 20),
                    "alert" : "",
                    "items" : [
                    ]
                };

                var pagination = self.defaultLatestItemsPagination();

                var node = this.node();

                var targetNodeIds = [];

                var associationLookup = {};

                Chain(node).associations(null, pagination).each(
                    function() {

                        var otherNodeId = this.getOtherNodeId(node);

                        targetNodeIds.push(otherNodeId);

                        if (! associationLookup[otherNodeId]) {
                            associationLookup[otherNodeId] = [];
                        }

                        associationLookup[otherNodeId].push(this);

                    }).then(function () {

                        this.subchain(self.branch()).queryNodes({
                            "_doc" : {
                                "$in" :  targetNodeIds
                            }
                        }).each(function() {

                                var value = "<a href='#" + self.LINK().call(self, this) + "'>" + self.friendlyTitle(this) + "</a>";

                                value += "<div class='block-list-item-desc'>";

                                $.each(associationLookup[this.getId()], function() {

                                    var direction = this.getDirection(node).toLowerCase();

                                    value += "<img src='" + Gitana.Utils.Image.buildImageUri('objects', 'association-' + direction, 24) + "' class='block-list-item-value-img'/>" + "<a href='#" + self.LINK().call(self, this) + "'>" + this.getTypeQName() + "</a>";
                                });

                                value += "</div>";

                                pairs['items'].push({
                                    "img" : Gitana.Utils.Image.imageUri(this, 48),
                                    "class" : "block-list-item-img",
                                    "value" : value
                                });

                            });

                        this.totalRows(function (totalRows) {
                            self.processItemsDashlet(totalRows, pairs, self.LIST_LINK().call(self, 'nodes'));
                            self.pairs("latest-neighbors", pairs);
                        });

                    });

                this.pairs("latest-neighbors", pairs);
            },

            setupDashlets : function () {

                if (this.targetObject().isContainer()) {
                    this.setupPaste();
                }

                this.setupNodeOverview();

                var node = this.targetObject();

                if (node.isAssociation()) {
                    this.clearPairs('node-snapshot');
                    this.clearPairs('latest-neighbors');
                    this.clearPairs('node-stats');
                } else {
                    this.setupNodeSnapshot();
                    this.setupLatestNeighbors();
                    this.setupNodeStats();
                }

            },

            setupPage : function(el) {

                var description = this.targetObject().isAssociation() ? "Overview of association " : "Overview of node ";

                description += this.friendlyTitle(this.targetObject()) + ".";

                var page = {
                    "title" : this.friendlyTitle(this.node()),
                    "description" : description,
                    "dashlets" :[
                        {
                            "id" : "overview",
                            "grid" : "grid_12",
                            "gadget" : "pairs",
                            "subscription" : "node-overview"
                        },
                        {
                            "id" : "snapshot",
                            "grid" : "grid_12",
                            "gadget" : "stats",
                            "subscription" : "node-snapshot"
                        },
                        {
                            "id" : "stats",
                            "grid" : "grid_12",
                            "gadget" : "stats",
                            "subscription" : "node-stats"
                        },
                        {
                            "id" : "latest-neighbors",
                            "grid" : "grid_12",
                            "gadget" : "pairs",
                            "subscription" : "latest-neighbors"
                        }
                    ]
                };

                this.page(Alpaca.mergeObject(page, this.base(el)));
            }

        });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.Node);

})(jQuery);