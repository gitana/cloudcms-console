(function($) {
    Gitana.Console.Pages.Tag = Gitana.CMS.Pages.AbstractDashboardPageGadget.extend({

        setup: function() {
            this.get("/repositories/{repositoryId}/branches/{branchId}/tags/{nodeId}", this.index);
        },

        LINK : function() {
            return this.tagLink;
        },

        targetObject: function() {
            return this.node();
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
            this.menu(Gitana.Console.Menu.Tag(this));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.Tag(this));
        },

        setupToolbar: function() {
            var self = this;
            self.base();
            var targetNode = this.targetObject();
            var buttons = [
                {
                    "id": "edit",
                    "title": "Edit Tag",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'tag-edit', 48),
                    "url" : self.LINK().call(self, targetNode, 'edit'),
                    "requiredAuthorities" : [
                        {
                            "permissioned" : targetNode,
                            "permissions" : ["update"]
                        }
                    ]
                },
                {
                    "id": "delete",
                    "title": "Delete Tag",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'tag-delete', 48),
                    "click": function(repository) {
                        self.onClickDelete(targetNode, 'tag', self.LIST_LINK().call(self, 'tags'), Gitana.Utils.Image.buildImageUri('objects', 'tag', 20), 'tag');
                    },
                    "requiredAuthorities" : [
                        {
                            "permissioned" : targetNode,
                            "permissions" : ["delete"]
                        }
                    ]
                },
                {
                    "id": "edit-json",
                    "title": "Edit JSON",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'json-edit', 48),
                    "url" : self.LINK().call(self, targetNode, 'edit', 'json'),
                    "requiredAuthorities" : [
                        {
                            "permissioned" : targetNode,
                            "permissions" : ["update"]
                        }
                    ]
                }
            ];

            self.addButtons(buttons);
        },

        setupTagOverview: function () {
            var self = this;
            var node = self.targetObject();
            var pairs = {
                "title" : "Overview",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'tag', 20),
                "alert" : "",
                "items" : [
                    {
                        "key" : "ID",
                        "value" : self.listItemProp(node, '_doc')
                    },
                    {
                        "key" : "Title",
                        "value" : self.listItemProp(node, 'title')
                    },
                    {
                        "key" : "Description",
                        "value" : self.listItemProp(node, 'description')
                    },
                    {
                        "key" : "Last Modified",
                        "value" : "By " + this.node().getSystemMetadata().getModifiedBy() + " @ " + this.node().getSystemMetadata().getModifiedOn().getTimestamp()
                    }
                ]
            };

            this.pairs("tag-overview", pairs);

        },

        setupTagSnapshot: function () {
            var self = this;
            var stats = {
                "title" : "Tag Snapshot",
                "alert" : "",
                "icon" : Gitana.Utils.Image.buildImageUri('browser', 'statistics', 20),
                "items" : [
                    {
                        "key" : "Tagged Nodes",
                        "value" : this.targetObject().stats && this.targetObject().stats()['a:has_tag'] ? this.targetObject().stats()['a:has_tag'] : 0,
                        "link" : "#" + self.LINK().call(self, this.targetObject(), 'taggednodes')
                    }
                ]
            };

            this.stats("tag-snapshot",stats);
        },

        setupTagStats: function () {
            var self = this;
            var stats = {
                "title" : "Tag Statistics",
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

            this.stats("tag-stats", stats);
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

            node.associations(null, pagination).each(
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

        setupDashlets : function (el, callback) {
            this.setupTagOverview();
            this.setupTagSnapshot();
            this.setupLatestNeighbors();
            this.setupTagStats();
            callback();
        },

        setupPage : function(el) {

            var description = "Overview of tag " + this.friendlyTitle(this.targetObject()) + ".";

            var page = {
                "title" : this.friendlyTitle(this.node()),
                "description" : description,
                "dashlets" :[
                    {
                        "id" : "overview",
                        "grid" : "grid_12",
                        "gadget" : "pairs",
                        "subscription" : "tag-overview"
                    },
                    {
                        "id" : "stats",
                        "grid" : "grid_12",
                        "gadget" : "stats",
                        "subscription" : "tag-snapshot"
                    },
                    {
                        "id" : "stats",
                        "grid" : "grid_12",
                        "gadget" : "stats",
                        "subscription" : "tag-stats"
                    },
                    {
                        "id" : "latest-neighbors",
                        "grid" : "grid_12",
                        "gadget" : "pairs",
                        "subscription" : "latest-neighbors"
                    }
                ]
            };

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.Tag);

})(jQuery);

