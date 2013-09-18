(function($) {
    Gitana.Console.Pages.Nodes = Gitana.CMS.Pages.AbstractListPageGadget.extend(
    {
        SUBSCRIPTION : "nodes",

        FILTER : function() {
            return "node-list-filters-" + this.branch().getId()
        },

        FILTER_TOOLBAR: {
            "query" : {
                "title" : "Query Nodes",
                "icon" : Gitana.Utils.Image.buildImageUri('browser', 'query', 48)
            }
        },

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/repositories/{repositoryId}/branches/{branchId}/nodes", this.index);
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
            this.menu(Gitana.Console.Menu.Branch(this,"menu-nodes"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.Nodes(this));
        },

        setupToolbar: function() {
            var self = this;
            self.base();
            self.addButtons([
                {
                    "id": "create-node",
                    "title": "Create Node...",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'node-add', 48),
                    "requiredAuthorities" : [
                        {
                            "permissioned" : self.targetObject(),
                            "permissions" : ["create_subobjects"]
                        }
                    ],
                    "click": function() {
                        Gitana.Utils.UI.modalSelector({
                            "title": "What would you like to create?",
                            "items": [{
                                "title": "Node using Form",
                                "description": "Use a content entry form to enter your node's content.",
                                "iconUrl": Gitana.Utils.Image.buildImageUri('objects', 'node-add', 48),
                                "link": "#" + self.LINK().call(self, self.targetObject(), 'add', 'node')
                            }, {
                                "title": "Node from JSON",
                                "description": "Enter the JSON for your new node directly.",
                                "iconUrl": Gitana.Utils.Image.buildImageUri('objects', 'json-add', 48),
                                "link": "#" + self.LINK().call(self, self.targetObject(), 'add', 'jsonnode')
                            }, {
                                "title": "Text Document",
                                "description": "Provide the text payload for a node.",
                                "iconUrl": Gitana.Utils.Image.buildImageUri('objects', 'txt-node-add', 48),
                                "link": "#" + self.LINK().call(self, self.targetObject(), 'add', 'textnode')
                            }, {
                                "title": "HTML Document",
                                "description": "Provide the HTML payload for a node.",
                                "iconUrl": Gitana.Utils.Image.buildImageUri('objects', 'html-node-add', 48),
                                "link": "#" + self.LINK().call(self, self.targetObject(), 'add', 'htmlnode')
                            }]
                        });
                    }
                },




                /*
                {
                "id": "create",
                "title": "New Node",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'node-add', 48),
                    "url" : this.LINK().call(self,this.targetObject(),'add','node'),
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
                    "url" : this.LINK().call(self,this.targetObject(),'add','textnode'),
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
                    "url" : this.LINK().call(self,this.targetObject(),'add','htmlnode'),
                    "requiredAuthorities" : [
                        {
                            "permissioned" : self.targetObject(),
                            "permissions" : ["create_subobjects"]
                        }
                    ]
                },
                */
                {
                "id": "upload-files",
                "title": "Upload Files",
                    "icon" : Gitana.Utils.Image.buildImageUri('special', 'upload', 48),
                    "url" : this.LINK().call(self,this.targetObject(),'upload'),
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
            return Alpaca.merge(this.base(),{
                "type" : [""],
                "keyword" : ""
            });
        },

        filterFormToJSON: function (formData) {
            var query = this.base(formData);
            if (! Alpaca.isValEmpty(formData)) {
                var json_query = _safeParse(formData.query);
                if (Alpaca.isValEmpty(json_query)) {
                    if (formData['type']) {
                        if (formData['type'].length ==  1 && formData['type'][0] == "") {
                            // no type selected
                        } else {
                            query['_type'] = {
                                "$in" : formData['type']
                            };
                        }
                    }
                }
            }

            var findQuery = {
                "query" : query
            };

            if (! Alpaca.isValEmpty(formData) && ! Alpaca.isValEmpty(formData['keyword'])) {
                findQuery['search'] = formData['keyword'];
            }

            return findQuery;
        },

        filterSchema: function () {
            return _mergeObject(this.base(), {
                "properties" : {
                    "type" : {
                        "title": "Type",
                        "type" : "string"
                    },
                    "keyword" : {
                        "title": "Keyword",
                        "type" : "string"
                    }
                }
            });
        },

        filterOptions: function() {

            var self = this;

            var options = _mergeObject(this.base(), {
                "helper" : "Query nodes by id, title, description, date range, keyword, type or full query.",
                "fields" : {
                    "type" : {
                        "type" : "select",
                        "multiple": true,
                        "size" : 5,
                        "helper": "Select one or multiple types."
                    },
                    "keyword" : {
                        "size": this.DEFAULT_FILTER_TEXT_SIZE,
                        "helper": "Enter keyword for full-text search."
                    }
                }
            });

            options['fields']['type']['dataSource'] = function(field, callback) {
                self.branch().listDefinitions({
                    "limit": Gitana.Console.LIMIT_NONE
                }).each(function(key, definition, index) {
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

            options['fields']['type']['postRender'] = function(renderedField) {
                var el = renderedField.getEl();
                $('select',$(el)).css({
                    "width" : "370px"
                }).multiselect().multiselectfilter();
                var val = renderedField.getValue();
                // Make sure we don't check the None checkbox
                if (!Alpaca.isValEmpty(val) && val.length == 1 && val[0] == "") {
                    $('select',$(el)).multiselect("uncheckAll");
                }
            };

            return options;
        },

        filterView: function() {
            return _mergeObject(this.base(),{
                "layout": {
                    "bindings": {
                        "id": "column-1",
                        "keyword": "column-2",
                        "type" : "column-1",
                        "query" : "column-3"
                    }
                }
            });
        },

        setupListSearchbox: function(el) {
            var self = this;
            $('input.list-search', $(el)).keypress(function(e) {
                if (e.which == 13) {

                    var keyword = $(this).val();

                    var targetObservable = self.FILTER();

                    var listQuery = self.observable(targetObservable).get();

                    if (!Alpaca.isValEmpty(keyword)) {
                        if (Alpaca.isValEmpty(listQuery)) {
                            listQuery = {
                                "formData" : {},
                                "jsonData" : {
                                    "search" : keyword
                                }
                            }
                        } else {
                            listQuery["jsonData"] = {
                                "search" : keyword
                            };
                        }
                    } else {
                        if (listQuery && listQuery["jsonData"] && listQuery["jsonData"]["search"]) {
                            delete listQuery["jsonData"]["search"];
                        }
                    }

                    self.observable(targetObservable).set(listQuery);
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
                },
                "export": {
                    "title": "Export Node",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-export', 48),
                    "click": function(node) {
                        self.app().run("GET", self.LINK().call(self,node,'export'));
                    },
                    "requiredAuthorities" : {
                        "permissions" : ["read"]
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
                        var title = this.getTypeQName();
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

            list["isItemReadonly"] = function(item) {
                return item.getTypeQName() == "n:root";
            };

            list["loadFunction"] = function(query, pagination, callback) {
                var checks = [];
                Chain(self.branch()).trap(function(error) {
                    return self.handlePageError(el, error);
                }).find(self.query(),self.pagination(pagination)).each(function() {
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
                "title" : "Nodes",
                "description" : "Display list of nodes of branch " + this.friendlyTitle(this.branch()) +".",
                "listTitle" : "Node List",
                "listIcon" : Gitana.Utils.Image.buildImageUri('objects', 'nodes', 20),
                "searchBox" : true,
                "subscription" : this.SUBSCRIPTION,
                "filter" : this.FILTER()
            };

            this.page(_mergeObject(page,this.base(el)));
        }
    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.Nodes);

})(jQuery);