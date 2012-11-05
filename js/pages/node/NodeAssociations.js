(function($) {
    Gitana.Console.Pages.NodeAssociations = Gitana.CMS.Pages.AbstractListPageGadget.extend(
    {
        SUBSCRIPTION : "associations",

        FILTER : function() {
            return "node-association-list-filters-" + this.node().getId()
        },

        FILTER_TOOLBAR: {
            "query" : {
                "title" : "Query Associations",
                "icon" : Gitana.Utils.Image.buildImageUri('browser', 'query', 48)
            }
        },

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/repositories/{repositoryId}/branches/{branchId}/nodes/{nodeId}/associations", this.index);
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
            this.menu(Gitana.Console.Menu.Node(this,"menu-associations"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.Associations(this));
        },

        setupToolbar: function() {
            var self = this;
            self.base();
            self.addButtons([
                {
                    "id": "create",
                    "title": "New Association",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'association-add', 48),
                    "url" : this.LINK().call(this, this.node(), 'add', 'association'),
                    "requiredAuthorities" : [
                        {
                            "permissioned" : self.branch(),
                            "permissions" : ["create_subobjects"]
                        }
                    ]
                }
            ]);

            this.toolbar(self.SUBSCRIPTION + "-toolbar",{
                "items" : {}
            });
        },

        /** Filter Related Methods **/
        filterEmptyData: function() {
            return {
                "type" : "",
                "direction" : ""
            };
        },

        filterFormToJSON: function (formData) {
            var query = {};
            if (! Alpaca.isValEmpty(formData)) {
                if (formData['type']) {
                    query['type'] = formData['type'];
                }
                if (formData['direction']) {
                    query['direction'] = formData['direction'];
                }
            }
            return query;
        },

        filterSchema: function () {
            return {
                "type" : "object",
                "properties" : {
                    "type" : {
                        "title": "Association Type",
                        "type" : "string"
                    },
                    "direction" : {
                        "title": "Association Direction",
                        "type" : "string",
                        "enum" : ['INCOMING','OUTGOING','MUTUAL']
                    }
                }
            };
        },

        filterOptions: function() {

            var self = this;

            var options = {
                "helper" : "Refine list by association type or direction.",
                "fields" : {
                    "type" : {
                        "type" : "select",
                        "helper": "Select one or multiple types."
                    },
                    "direction" : {
                        "type" : "select",
                        "helper": "Enter regular expression for query by id."
                    }
                }
            };

            options['fields']['type']['dataSource'] = function(field, callback) {
                self.branch().listDefinitions('association').each(function(key, definition, index) {
                    field.selectOptions.push({
                        "value": definition.getQName(),
                        "text": definition.getQName()
                    });
                 }).then(function() {
                    if (callback) {
                        callback();
                    }
                });
            };

            return options;
        },

        filterView: function() {
            return Alpaca.mergeObject(this.base(),{
                "layout": {
                    "bindings": {
                        "type": "column-1",
                        "direction" : "column-2"
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
                "edit": {
                    "title": "Edit Association",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'association-edit', 48),
                    "click": function(node){
                        self.app().run("GET", this.LINK().call(this,node,'edit'));
                    },
                    "requiredAuthorities" : {
                        "permissions" : ["update"]
                    }
                },
                "delete": {
                    "title": "Delete Associations",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'association-delete', 48),
                    "click": function(node) {
                        self.onClickDelete(node);
                    },
                    "requiredAuthorities" : {
                        "permissions" : ["delete"]
                    }
                },
                "editJSON": {
                    "title": "Edit JSON",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'json-edit', 48),
                    "click": function(node) {
                        self.app().run("GET", self.LINK().call(self,node,'edit','json'));
                    },
                    "requiredAuthorities" : {
                        "permissions" : ["update"]
                    }
                }
            });

            list["columns"] = [
                {
                    "title": "Title",
                    "type":"property",
                    "sortingExpression": "title",
                    "property": function(callback) {
                        var title = self.friendlyTitle(this);
                        var value = "<a href='#" + self.LINK().call(self,this) + "'>" + title + "</a>";
                        callback(value);
                    }
                },
                {
                    "title": "Type",
                    "type":"property",
                    "sortingExpression": "_type",
                    "property": function(callback) {
                        var title = this.getTypeQName() ? this.getTypeQName() : "";
                        callback(title);
                    }
                },
                {
                    "title": "Associated",
                    "type":"property",
                    "property": function(callback) {
                        var otherNodeId = this.getOtherNodeId(self.node());
                        var value = "<a href='#" + self.LIST_LINK().call(self,"nodes") + otherNodeId + "' title='" + otherNodeId + "'>relative node</a>";
                        callback(value);
                    }
                },
                {
                    "title": "Direction",
                    "type":"property",
                    "property": function(callback) {
                        var value = this.getDirection(self.node()) ? this.getDirection(self.node()) : "";
                        callback(value);
                    }
                },
                {
                    "title": "Last Modified",
                    "sortingExpression" : "_system.modified_on.ms",
                    "property": function(callback) {
                        var value = this.getSystemMetadata().getModifiedOn().getTimestamp();
                        callback(value);
                    }
                }
            ];

            list["loadFunction"] = function(query, pagination, callback) {
                var checks = [];
                var thisQuery = Alpaca.isValEmpty(self.query()) ? null : self.query()
                self.node().trap(function(error) {
                    return self.handlePageError(el, error);
                }).associations(thisQuery,self.pagination(pagination)).each(function() {
                    $.merge(checks, self.prepareListPermissionCheck(this,['update','delete']));
                }).then(function() {
                    var _this = this;
                    this.subchain(self.branch()).checkNodePermissions(checks, function(checkResults) {
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
                "title" : "Node Associations",
                "description" : "Display list of associations for node " + this.friendlyTitle(this.targetObject()) + ".",
                "listTitle" : "Association List",
                "listIcon" : Gitana.Utils.Image.buildImageUri('objects', 'association', 20),
                "subscription" : this.SUBSCRIPTION,
                "filter" : this.FILTER()
            };

            this.page(Alpaca.mergeObject(page,this.base(el)));
        }
    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.NodeAssociations);

})(jQuery);