(function($) {
    Gitana.Console.Pages.NodeRules = Gitana.CMS.Pages.AbstractListPageGadget.extend(
    {
        SUBSCRIPTION : "node-rules",

        FILTER : function() {
            return "node-rules-list-filters-" + this.node().getId()
        },

        FILTER_TOOLBAR: {
            "query" : {
                "title" : "Query Rules",
                "icon" : Gitana.Utils.Image.buildImageUri('browser', 'query', 48)
            }
        },

        setup: function() {
            this.get("/repositories/{repositoryId}/branches/{branchId}/nodes/{nodeId}/rules", this.index);
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
            this.menu(Gitana.Console.Menu.Node(this,"menu-node-rules"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.NodeRules(this));
        },

        setupToolbar: function() {
            var self = this;
            self.base();
            self.addButtons([
                {
                    "id": "create",
                    "title": "New Rule",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'rule-add', 48),
                    "url" : this.LINK().call(this, this.node(), 'add', 'rule'),
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
                // TODO
            };
        },

        filterFormToJSON: function (formData) {
            var query = {};
            /*
            if (! Alpaca.isValEmpty(formData)) {
                if (formData['type']) {
                    query['type'] = formData['type'];
                }
                if (formData['direction']) {
                    query['direction'] = formData['direction'];
                }
            }
            */
            return query;
        },

        filterSchema: function () {
            return {
                "type" : "object",
                "properties" : {
                    "title" : {
                        "title": "Title",
                        "type" : "string"
                    },
                    "description" : {
                        "title": "Description",
                        "type" : "string"
                    }
                }
            };
        },

        filterOptions: function() {

            var self = this;

            var options = {
                "helper" : "Refine list by rule title or description.",
                "fields" : {
                    "title" : {
                        "type" : "text",
                        "helper": "Enter the title of the rule."
                    },
                    "description" : {
                        "type" : "text",
                        "helper": "Enter the description of the rule."
                    }
                }
            };

            return options;
        },

        filterView: function() {
            return Alpaca.mergeObject(this.base(),{
                "layout": {
                    "bindings": {
                        "title": "column-1",
                        "description" : "column-2"
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
                    "title": "Edit Rule",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'rule-edit', 48),
                    "click": function(node){
                        self.app().run("GET", this.LINK().call(this, node, 'edit'));
                    },
                    "requiredAuthorities" : {
                        "permissions" : ["update"]
                    }
                },
                "delete": {
                    "title": "Delete Rule",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'rule-delete', 48),
                    "click": function(rule) {
                        var link = this.LINK().call(this, self.node(), 'rules');

                        self.onClickDelete(rule, 'rule', link, Gitana.Utils.Image.buildImageUri('objects', 'rule', 20), 'rule');
                    },
                    "requiredAuthorities" : {
                        "permissions" : ["delete"]
                    }
                },
                "editJSON": {
                    "title": "Edit JSON",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'json-edit', 48),
                    "click": function(node) {
                        self.app().run("GET", self.LINK().call(self, node, 'edit', 'json'));
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
                    "title": "Description",
                    "type":"property",
                    "sortingExpression": "description",
                    "property": function(callback) {
                        callback(this.getDescription());
                    }
                },
                {
                    "title": "Policy",
                    "type":"property",
                    "sortingExpression": "policy",
                    "property": function(callback) {
                        callback(this["policy"]);
                    }
                }
            ];

            list["loadFunction"] = function(query, pagination, callback) {
                var checks = [];
                var thisQuery = Alpaca.isValEmpty(self.query()) ? null : self.query()
                if (!thisQuery) {
                    thisQuery = {};
                }
                thisQuery["_type"] = "a:has_behavior";
                thisQuery["source"] = self.node().getId();
                thisQuery["target_type"] = "n:rule";
                self.branch().trap(function(error) {
                    return self.handlePageError(el, error);
                }).queryNodes(thisQuery, self.pagination(pagination)).then(function() {

                    var associations = this;

                    // collect all target rule ids
                    var targetIds = [];
                    for (var i = 0; i < associations.__keys().length; i++)
                    {
                        targetIds.push(associations[associations.__keys()[i]]["target"]);
                    }

                    // query for rules
                    var query2 = { "_doc": { "$in" : targetIds } };
                    Chain(self.branch()).queryNodes(query2).each(function() {
                        $.merge(checks, self.prepareListPermissionCheck(this,['update','delete']));
                    }).then(function() {

                        // add in policy binding information into result set
                        for (var i = 0; i < associations.__keys().length; i++)
                        {
                            var associationObject = associations[associations.__keys()[i]];
                            var targetId = associationObject["target"];

                            var policy = associationObject["policy"];
                            if (!policy) {
                                alert("Missing policy");
                            }

                            this[targetId].policy = policy;
                        }

                        var _this = this;

                        this.subchain(self.branch()).checkNodePermissions(checks, function(checkResults) {
                            self.updateUserRoles(checkResults);

                            // fire back
                            callback.call(_this);
                        });

                    });

                });
            };

            // store list configuration onto observer
            self.list(self.SUBSCRIPTION, list);
        },

        setupPage : function(el) {
            var page = {
                "title" : "Node Rules",
                "description" : "A list of the rules that are bound to node '" + this.friendlyTitle(this.targetObject()) + "'.",
                "listTitle" : "Rule List",
                "listIcon" : Gitana.Utils.Image.buildImageUri('objects', 'rule', 20),
                "subscription" : this.SUBSCRIPTION,
                "filter" : this.FILTER()
            };

            this.page(Alpaca.mergeObject(page,this.base(el)));
        }
    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.NodeRules);

})(jQuery);