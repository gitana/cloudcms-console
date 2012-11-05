(function($) {
    Gitana.Console.Pages.TagNodes = Gitana.CMS.Pages.AbstractListPageGadget.extend(
    {
        SUBSCRIPTION : "associations",

        FILTER : "node-associations-list-filters",

        HIDE_FILTER : true,

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/repositories/{repositoryId}/branches/{branchId}/tags/{nodeId}/taggednodes", this.index);
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
            this.menu(Gitana.Console.Menu.Tag(this,"menu-tagged-nodes"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Tag(this), [
                {
                    "text" : "Tagged Nodes"
                }
            ]));
        },

        setupToolbar: function() {
            var self = this;
            self.base();

            this.toolbar(self.SUBSCRIPTION + "-toolbar",{
                "items" : {}
            });
        },

        /** OVERRIDE **/
        setupList: function(el) {
            var self = this;

            // define the list
            var list = self.defaultList();

            list["actions"] = self.actionButtons({
                "edit": {
                    "title": "Edit Node",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'node-edit', 48),
                    "click": function(node){
                        self.app().run("GET", self.LINK().call(self,node,'edit'));
                    },
                    "requiredAuthorities" : {
                        "permissions" : ["update"]
                    }
                },
                "preview": {
                    "title": "Preview Node",
                    "icon" : Gitana.Utils.Image.buildImageUri('special', 'preview', 48),
                    "click": function(node){
                        self.app().run("GET", self.LINK().call(self,node,'preview'));
                    },
                    "requiredAuthorities" : {
                        "permissions" : ["read"]
                    }
                },
                "delete": {
                    "title": "Delete Node(s)",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'node-delete', 48),
                    "selection" : "multiple",
                    "click": function(nodes) {
                        self.onClickDeleteMultiple(self.branch(), nodes , "node", self.LIST_LINK().call(self,'nodes') , Gitana.Utils.Image.buildImageUri('objects', 'node', 20), 'node');
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
                        // For Form Nodes, create a node link since we can't get the definition object from form object
                        var link;
                        if (this && this.objectType && this.objectType() == "Gitana.Form") {
                            link = self.LIST_LINK().call(self,"nodes") + this.getId();
                        } else {
                            link = self.LINK().call(self,this);
                        }
                        var value = "<a href='#" + link + "'>" + title + "</a>";
                        callback(value);
                    }
                },
                {
                    "title": "Type",
                    "type":"property",
                    "sortingExpression": "_type",
                    "property": function(callback) {
                        var title = this.get('_type') ? this.get('_type') : "";
                        callback(title);
                    }
                },
                {
                    "title": "Last Modified By",
                    "sortingExpression" : "_system.modified_by",
                    "property": function(callback) {
                        var value = this.getSystemMetadata().getModifiedBy();
                        callback(value);
                    }
                }
                ,
                {
                    "title": "Last Modified On",
                    "sortingExpression" : "_system.modified_on.ms",
                    "property": function(callback) {
                        var value = this.getSystemMetadata().getModifiedOn().getTimestamp();
                        callback(value);
                    }
                }
            ];

            list["loadFunction"] = function(query, pagination, callback) {
                var checks = [];
                Chain(self.targetObject()).trap(function(error) {
                    return self.handlePageError(el, error);
                }).listRelatives({
                    "type": "a:has_tag",
                    "direction": "INCOMING"
                },self.pagination(pagination)).each(function() {
                    $.merge(checks, self.prepareListPermissionCheck(this,['read','update','delete']));
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
                "title" : "Tagged Nodes",
                "description" : "Display list of nodes tagged by tag " + this.friendlyTitle(this.targetObject()) +".",
                "listTitle" : "Node List",
                "listIcon" : Gitana.Utils.Image.buildImageUri('objects', 'nodes', 20),
                "subscription" : this.SUBSCRIPTION,
                "filter" : this.FILTER
            };

            this.page(Alpaca.mergeObject(page,this.base(el)));
        }
    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.TagNodes);

})(jQuery);