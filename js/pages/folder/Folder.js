(function($) {
    Gitana.Console.Pages.Folder = Gitana.CMS.Pages.AbstractListPageGadget.extend(
    {
        SUBSCRIPTION : "folder",

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/repositories/{repositoryId}/branches/{branchId}/folders/{nodeId}", this.index);
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
            this.menu(Gitana.Console.Menu.Folder(this));
        },

        setupBreadcrumb: function() {
            Gitana.Console.Breadcrumb.Folder(this);
        },

        setupToolbar: function() {
            var self = this;
            self.base();

            self.addButtons([
            {
                "id": "edit-folder",
                "title": "Properties",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'folder-edit', 48),
                "url" : self.folderLink(self.node(), "edit"),
                "requiredAuthorities" : [
                    {
                        "permissioned" : this.node(),
                        "permissions" : ["update"]
                    }
                ]
            },{
                "id": "edit-json",
                "title": "Edit JSON",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'json-edit', 48),
                "url" : self.folderLink(self.node(), "edit", "json"),
                "requiredAuthorities" : [
                    {
                        "permissioned" : this.node(),
                        "permissions" : ["update"]
                    }
                ]
            },
            {
                "id": "create-folder",
                "title": "New Folder",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'folder-add', 48),
                "url" : self.folderLink(self.node(), "add", "folder"),
                "requiredAuthorities" : [{
                    "permissioned" : this.branch(),
                    "permissions" : ["create_subobjects"]
                },{
                    "permissioned" : this.node(),
                    "permissions" : ["update"]
                }]
            },
            {
                "id": "create-node",
                "title": "Create Node...",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'node-add', 48),
                "requiredAuthorities" : [
                    {
                        "permissioned" : self.targetObject(),
                        "permissions" : ["create_subobjects"]
                    },
                    {
                        "permissioned" : self.node(),
                        "permissions" : ["update"]
                    }
                ],
                "click": function() {
                    Gitana.Utils.UI.modalSelector({
                        "title": "What would you like to create?",
                        "items": [{
                            "title": "Node using Form",
                            "description": "Use a content entry form to enter your node's content.",
                            "iconUrl": Gitana.Utils.Image.buildImageUri('objects', 'node-add', 48),
                            "link": "#" + self.folderLink(self.node(), "add", "node")
                        }, {
                            "title": "Node from JSON",
                            "description": "Enter the JSON for your new node directly.",
                            "iconUrl": Gitana.Utils.Image.buildImageUri('objects', 'json-add', 48),
                            "link": "#" + self.folderLink(self.node(), "add", "jsonnode")
                        }, {
                            "title": "Text Document",
                            "description": "Provide the text payload for a node.",
                            "iconUrl": Gitana.Utils.Image.buildImageUri('objects', 'txt-node-add', 48),
                            "link": "#" + self.folderLink(self.node(), "add", "textnode")
                        }, {
                            "title": "HTML Document",
                            "description": "Provide the HTML payload for a node.",
                            "iconUrl": Gitana.Utils.Image.buildImageUri('objects', 'html-node-add', 48),
                            "link": "#" + self.folderLink(self.node(), "add", "htmlnode")
                        }]
                    });
                }
            },{
                "id": "upload-files",
                "title": "Upload Files",
                "icon" : Gitana.Utils.Image.buildImageUri('special', 'upload', 48),
                "url" : self.folderLink(self.node(), "upload"),
                "requiredAuthorities" : [
                    {
                        "permissioned" : this.branch(),
                        "permissions" : ["create_subobjects"]
                    },
                    {
                        "permissioned" : this.node(),
                        "permissions" : ["update"]
                    }
                ]

            },{
                "id": "copy",
                "title": "Copy Folder",
                "icon" : Gitana.Utils.Image.buildImageUri('browser', 'copy', 48),
                "click": function(node) {
                    self.onClickCopy(self.targetObject(), self.LINK().call(self, self.targetObject()), 'folder-48');
                },
                "requiredAuthorities" : [
                    {
                        "permissioned" : self.targetObject(),
                        "permissions" : ["read"]
                    }
                ]
            },{
                "id": "import",
                "title": "Import Archive",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-import', 48),
                "url" : self.folderLink(self.targetObject(), 'import'),
                "requiredAuthorities" : [
                    {
                        "permissioned" : self.targetObject(),
                        "permissions" : ["create_subobjects"]
                    }
                ]
            },{
                "id": "export",
                "title": "Export Folder",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-export', 48),
                "url" : self.folderLink(self.targetObject(), 'export'),
                "requiredAuthorities" : [
                    {
                        "permissioned" : self.targetObject(),
                        "permissions" : ["read"]
                    }
                ]
            }
            ]);

        },

        /** OVERRIDE **/
        setupList: function(el) {
            var self = this;

            // define the list
            var list = self.defaultList();

            list.hideIcon = true;

            list["iconUri"] = function(callback) {
                var icon = Gitana.Utils.Image.imageUri(this, 16);
                callback(icon);
            };

            list["actions"] = self.actionButtons({
                "edit": {
                    "title": "Edit Node",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'node-edit', 48),
                    "click": function(node){
                        self.app().run("GET", self.folderLink(node,'edit'));
                    },
                    "requiredAuthorities" : {
                        "permissions" : ["update"]
                    }
                },
                "preview": {
                    "title": "Preview Node",
                    "icon" : Gitana.Utils.Image.buildImageUri('special', 'preview', 48),
                    "click": function(node){
                        self.app().run("GET", self.folderLink(node,'preview'));
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
                        self.onClickDeleteMultiple(self.branch(), nodes , "node", self.folderLink(self.targetObject()) , Gitana.Utils.Image.buildImageUri('objects', 'node', 20), 'node');
                    },
                    "requiredAuthorities" : {
                        "permissions" : ["delete"]
                    }
                },
                "editJSON": {
                    "title": "Edit JSON",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'json-edit', 48),
                    "click": function(node) {
                        self.app().run("GET", self.folderLink(node,'edit','json'));
                    },
                    "requiredAuthorities" : {
                        "permissions" : ["update"]
                    }
                },
                "export-node": {
                    "title": "Export Node",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-export', 48),
                    "click": function(node) {
                        self.app().run("GET", self.folderLink(node,'export'));
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
                        var link = self.folderLink(this);
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
                        var value = "<a href='#" + self.link(this) + "'>" + title + "</a>";
                        callback(value);
                    }
                },
                {
                    "title": "Last Modified By",
                    "sortingExpression" : "_system.modified_by",
                    "property": function(callback) {
                        var value = this.getSystemMetadata().getModifiedBy();
                        callback(value);
                    }
                },
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
                self.node().trap(function(error) {
                    return self.handlePageError(el, error);
                }).listChildren(self.pagination(pagination)).each(function() {
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

            this.setupPaste();

            var title = this.friendlyTitle(this.node());
            if (this.node().getQName() == "r:root") {
                title = "Root Folder";
            }
            var page = {
                "title" : title,
                "description" : "Display list of this folder's child nodes and sub-folders.",
                "listTitle" : "Child List",
                "listIcon" : Gitana.Utils.Image.buildImageUri('browser', 'list', 20),
                "subscription" : this.SUBSCRIPTION
            };

            this.page(_mergeObject(page,this.base(el)));
        }
    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.Folder);

})(jQuery);