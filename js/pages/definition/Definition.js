(function($) {
    Gitana.Console.Pages.Definition = Gitana.CMS.Pages.AbstractDashboardPageGadget.extend(
    {
        setup: function() {
            this.get("/repositories/{repositoryId}/branches/{branchId}/definitions/{definitionId}", this.index);
        },

        targetObject: function() {
            return this.definition();
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
            if (this.targetObject().getTypeQName() == "d:type") {

                return this.menu(Gitana.Console.Menu.Type(this))

            } else {

                return this.menu(Gitana.Console.Menu.Definition(this));

            }
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.Definition(this));
        },

        setupToolbar: function() {
            var self = this;
            self.base();
            var targetNode = this.targetObject();
            self.addButtons([
                {
                    "id": "create",
                    "title": "New Form",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'form-add', 48),
                    "url" : self.LINK().call(self,self.targetObject(),'add','form'),
                    "requiredAuthorities" : [
                        {
                            "permissioned" : self.targetObject(),
                            "permissions" : ["create_subobjects"]
                        }
                    ]
                },
                {
                    "id": "edit",
                    "title": "Edit Definition",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'definition-edit', 48),
                    "url" : self.LINK().call(self,self.definition(),'edit'),
                    "requiredAuthorities" : [
                        {
                            "permissioned" : self.targetObject(),
                            "permissions" : ["update"]
                        }
                    ]
                },
                {
                "id": "delete",
                "title": "Delete Definition",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'definition-delete', 48),
                    "click": function(definition) {
                        self.onClickDelete(self.targetObject(),'definition',self.LIST_LINK().call(self,'definitions'),Gitana.Utils.Image.buildImageUri('objects', 'definition', 20), 'definition');
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
                    "title": "Export Definition",
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
                    "title": "Import Definition",
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

        setupDefinitionOverview: function () {
            var self = this;
            var definition = self.targetObject();
            var pairs = {
                "title" : "Overview",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'definition', 20),
                "alert" : "",
                "items" : []
            };
            this._pushItem(pairs.items, {
                "key" : "ID",
                "value" : self.listItemProp(definition,'_doc')
            });
            this._pushItem(pairs.items, {
                "key" : "Title",
                "value" : self.listItemProp(definition,'title')
            });
            this._pushItem(pairs.items, {
                "key" : "Description",
                "value" : self.listItemProp(definition,'description')
            });
            this._pushItem(pairs.items, {
                "key" : "Type",
                "value" : definition.getTypeQName()
            });
            this._pushItem(pairs.items, {
                "key" : "QName",
                "value" : definition.getQName()
            });
            this._pushItem(pairs.items, {
                "key" : "Last Modified",
                "value" : this.definition().getSystemMetadata().getModifiedOn().getTimestamp()
            });

            this.pairs("definition-overview",pairs);
        },

        setupDefinitionStats: function () {
            var self = this;
            var stats = {
                "title" : "Definition Snapshot",
                "alert" : "",
                "icon" : Gitana.Utils.Image.buildImageUri('browser', 'statistics', 20),
                "items" : [{
                    "key" : "Forms",
                    "value" : 0
                },{
                    "key" : "Nodes",
                    "value" : 0
                }]
            };

            this.stats("definition-stats",stats);
        },

        setupDefinitionLatestNodes: function () {
            var self = this;
            var pairs = {
                "title" : "Definition Latest Nodes",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'nodes', 20),
                "alert" : "",
                "items" : [
                ]
            };

            this.pairs("definition-latest-nodes",pairs);
        },

        setupDashlets : function (el, callback) {

            this.setupDefinitionOverview();
            this.setupDefinitionStats();
            this.setupDefinitionLatestNodes();

            var self = this;

            var pagination = self.defaultLatestItemsPagination();

            var pagination2 = self.defaultSnapshotPagination();

            var stats = Alpaca.cloneObject(self.stats("definition-stats"));

            Chain().then(function() {

                var f00 = function() {
                    this.subchain(self.targetObject()).listFormAssociations().count(function(count) {
                        stats.items[0]['value'] = count;
                    });
                };

                var f01 = function() {
                    this.subchain(self.branch()).queryNodes({
                        "_type" : self.targetObject().getQName()
                    },pagination2).totalRows(function(totalRows) {
                        stats.items[1]['value'] = totalRows == null ? 0 : totalRows;
                    });
                };

                var f1 = function() {
                    var pairs = Alpaca.cloneObject(self.pairs("definition-latest-nodes"));
                    this.subchain(self.branch()).queryNodes({
                        "_type" : self.targetObject().getQName()
                    }, pagination).each(function() {
                        pairs['items'].push({
                            "img" : Gitana.Utils.Image.imageUri(this, 48),
                            "class" : "block-list-item-img",
                            "value" : self.friendlyTitle(this) + "<div class='block-list-item-desc'>@ " + this.getSystemMetadata().getModifiedOn().getTimestamp() + "</div>",
                            "link" : "#" + self.link(this)
                        });
                    }).totalRows(function (totalRows) {
                        self.processItemsDashlet(totalRows, pairs, self.listLink('nodes'));
                        self.pairs("definition-latest-nodes", pairs);
                    });
                };

                this.then([f00,f01,f1]).then(function() {
                    self.stats("definition-stats", stats);
                });

            }).then(function() {
                callback();
            });
        },

        setupPage : function(el) {

            var description = "Overview of definition " + this.targetObject().getQName() + ".";

            var page = {
                "title" : this.targetObject().getQName(),
                "description" : description,
                "dashlets" :[
                    {
                        "id" : "overview",
                        "grid" : "grid_12",
                        "gadget" : "pairs",
                        "subscription" : "definition-overview"
                    },
                    {
                        "id" : "stats",
                        "grid" : "grid_12",
                        "gadget" : "stats",
                        "subscription" : "definition-stats"
                    },
                    {
                        "id" : "definition-latest-nodes",
                        "grid" : "grid_12",
                        "class" : "block-list",
                        "gadget" : "pairs",
                        "subscription" : "definition-latest-nodes"
                    }
                ]
            };

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.Definition);

})(jQuery);