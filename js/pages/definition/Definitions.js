(function($) {
    Gitana.Console.Pages.Definitions = Gitana.CMS.Pages.AbstractListPageGadget.extend(
    {
        SUBSCRIPTION : "definitions",

        FILTER : function() {
            return "definition-list-filters-" + this.branch().getId()
        },

        FILTER_TOOLBAR: {
            "query" : {
                "title" : "Query Definitions",
                "icon" : Gitana.Utils.Image.buildImageUri('browser', 'query', 48)
            }
        },

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/repositories/{repositoryId}/branches/{branchId}/definitions", this.index);
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
            this.menu(Gitana.Console.Menu.Branch(this,"menu-definitions"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.Definitions(this));
        },

        setupToolbar: function() {
            var self = this;
            self.base();
            self.addButtons([
                {
                "id": "create",
                "title": "New Definition",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'definition-add', 48),
                    "url" : this.LINK().call(self,this.branch(),'add','definition'),
                    "requiredAuthorities" : [
                        {
                            "permissioned" : self.targetObject(),
                            "permissions" : ["create_subobjects"]
                        }
                    ]
                },
                {
                    "id": "import",
                    "title": "Import Archive",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-import', 48),
                    "url" : this.LINK().call(this, this.contextObject(), 'import'),
                    "requiredAuthorities" : [
                        {
                            "permissioned" : this.contextObject(),
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
            return "";
        },

        filterFormToJSON: function (formData) {
            return formData['type'];
        },

        filterSchema: function () {
            return {
                "type" : "object",
                "properties" : {
                    "type" : {
                        "title": "Definition Type",
                        "type" : "string",
                        "enum" : ["type","association","feature"]
                    }
                }
            };
        },

        filterOptions: function() {

            var options = {
                "helper" : "Query definitions by definition type.",
                "fields" : {
                    "type" : {
                        "type" : "select",
                        "helper" : "Pick definition type."
                    }
                }
            };

            return options;
        },

        filterView: function() {
            return {
                "parent": "VIEW_WEB_EDIT_LAYOUT_GRID_FOUR_COLUMN",
                "layout": {
                    "bindings": {
                        "type": "column-1"
                    }
                }
            };
        },

        /** OVERRIDE **/
        setupList: function(el) {
            var self = this;

            // define the list
            var list = self.defaultList();

            list["actions"] = self.actionButtons({
                "edit": {
                    "title": "Edit Definition",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'definition-edit', 48),
                    "click": function(definition){
                        self.app().run("GET", self.LINK().call(self,definition,'edit'));
                    },
                    "requiredAuthorities" : {
                        "permissions" : ["update"]
                    }
                },
                "delete": {
                    "title": "Delete Definition(s)",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'definition-delete', 48),
                    "click": function(definitions) {
                        self.onClickDeleteMultiple(self.branch(), definitions , "definition", self.LIST_LINK().call(self,'definitions') , Gitana.Utils.Image.buildImageUri('objects', 'definition', 20), 'definition');
                    },
                    "selection" : "multiple",
                    "requiredAuthorities" : {
                        "permissions" : ["delete"]
                    }
                },
                "editJSON": {
                    "title": "Edit JSON",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'json-edit', 48),
                    "click": function(definition) {
                        self.app().run("GET", self.LINK().call(self,definition,"edit","json"));
                    },
                    "requiredAuthorities" : {
                        "permissions" : ["update"]
                    }
                },
                "export": {
                    "title": "Export Definition",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-export', 48),
                    "click": function(definition) {
                        self.app().run("GET", self.LINK().call(self,definition,'export'));
                    },
                    "requiredAuthorities" : {
                        "permissions" : ["read"]
                    }
                }
            });

            list["columns"] = [
                {
                    "title": "Description",
                    "type":"property",
                    "sortingExpression": "description",
                    "property": function(callback) {
                        var description = this.getDescription() ? this.getDescription() : self.friendlyTitle(this);
                        var value = "<a href='#" + self.LINK().call(self,this) + "'>" + description + "</a>";
                        callback(value);
                    }
                },
                {
                    "title": "QName",
                    "type":"property",
                    "sortingExpression": "_qname",
                    "property": function(callback) {
                        var title = this.getQName() ? this.getQName() : "";
                        callback(title);
                    }
                },
                {
                    "title": "Type",
                    "type":"property",
                    "sortingExpression": "_type",
                    "property": function(callback) {
                        var type = this.getTypeQName() ? this.getTypeQName() : "";
                        var friendlyTypeNames = {
                            "d:type" : "Type",
                            "d:association" : "Association",
                            "d:feature" : "Feature"
                        }
                        var title = friendlyTypeNames[type] ? friendlyTypeNames[type] : type;
                        callback(title);
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
                var query = self.query();
                var checks = [];
                if (query) {
                    Chain(self.targetObject()).trap(function(error) {
                        return self.handlePageError(el, error);
                    }).listDefinitions(query, self.pagination(pagination)).each(function() {
                        $.merge(checks, self.prepareListPermissionCheck(this, ['update','delete']));
                    }).then(function() {
                        var _this = this;
                        this.subchain(self.branch()).checkNodePermissions(checks, function(checkResults) {
                            self.updateUserRoles(checkResults);
                            callback.call(_this);
                        });
                    });
                } else {
                    Chain(self.targetObject()).listDefinitions(null, self.pagination(pagination)).each(function() {
                        $.merge(checks, self.prepareListPermissionCheck(this, ['update','delete']));
                    }).then(function() {
                        var _this = this;
                        this.subchain(self.branch()).checkNodePermissions(checks, function(checkResults) {
                            self.updateUserRoles(checkResults);
                            callback.call(_this);
                        });
                    });
                }
            };

            // store list configuration onto observer
            self.list(self.SUBSCRIPTION, list);
        },

        setupPage : function(el) {
            var page = {
                "title" : "Definitions",
                "description" : "Display list of definitions of branch " + this.friendlyTitle(this.branch()) +".",
                "listTitle" : "Definition List",
                "listIcon" : Gitana.Utils.Image.buildImageUri('objects', 'definitions', 20),
                "subscription" : this.SUBSCRIPTION,
                "filter" : this.FILTER()
            };

            this.page(_mergeObject(page,this.base(el)));
        }
    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.Definitions);

})(jQuery);