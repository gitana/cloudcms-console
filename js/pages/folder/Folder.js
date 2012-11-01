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
            /*
            self.addButtons([
                {
                "id": "create-folder",
                "title": "New Folder",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'folder-add', 48),
                    "url" : self.folderLink(self.node(), "add","folder"),
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
                },
                {
                "id": "create-node",
                "title": "New Node",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'node-add', 48),
                    "url" : self.folderLink(self.node(), "add","node"),
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
                },
                {
                "id": "create-json-node",
                "title": "New JSON Node",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'json-add', 48),
                    "url" : self.folderLink(self.node(), "add","jsonnode"),
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
                },
                {
                "id": "create-text-node",
                "title": "New Text Node",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'txt-node-add', 48),
                    "url" : self.folderLink(self.node(), "add","textnode"),
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
                },
                {
                "id": "create-html-node",
                "title": "New HTML Node",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'html-node-add', 48),
                    "url" : self.folderLink(self.node(), "add","htmlnode"),
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
                },
                {
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
                },
                {
                "id": "edit-folder",
                "title": "Edit Folder",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'folder-edit', 48),
                    "url" : self.folderLink(self.node(), "edit"),
                    "requiredAuthorities" : [
                        {
                            "permissioned" : this.node(),
                            "permissions" : ["update"]
                        }
                    ]
                },
                {
                "id": "edit-json",
                "title": "Edit JSON",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'json-edit', 48),
                    "url" : self.folderLink(self.node(), "edit","json"),
                    "requiredAuthorities" : [
                        {
                            "permissioned" : this.node(),
                            "permissions" : ["update"]
                        }
                    ]
                },
                {
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
                },
                {
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
                },
                {
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
                }
            ]);

            this.toolbar(self.SUBSCRIPTION + "-toolbar",{
                "items" : {}
            });
            */
            this.addGroupedButtons({
                "groups" : [
                    {
                        "title" : "Create",
                        "items" : {
                            "create-folder": {
                                "id": "create-folder",
                                "title": "New Folder",
                                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'folder-add', 48),
                                "url" : self.folderLink(self.node(), "add", "folder"),
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
                            },
                            "create-node" : {
                                "id": "create-node",
                                "title": "New Node",
                                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'node-add', 48),
                                "url" : self.folderLink(self.node(), "add", "node"),
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
                            },
                            "create-json-node" : {
                                "id": "create-json-node",
                                "title": "New JSON Node",
                                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'json-add', 48),
                                "url" : self.folderLink(self.node(), "add", "jsonnode"),
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
                            }
                        }
                    },
                    {
                        "title" : "Upload",
                        "items" : {
                            "create-text-node" : {
                                "id": "create-text-node",
                                "title": "New Text Node",
                                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'txt-node-add', 48),
                                "url" : self.folderLink(self.node(), "add", "textnode"),
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
                            },
                            "create-html-node" : {
                                "id": "create-html-node",
                                "title": "New HTML Node",
                                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'html-node-add', 48),
                                "url" : self.folderLink(self.node(), "add", "htmlnode"),
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
                            },
                            "upload-files": {
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
                            }
                        }
                    },
                    {
                        "title" : "Edit",
                        "items" : {
                            "edit-folder" : {
                                "id": "edit-folder",
                                "title": "Edit Folder",
                                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'folder-edit', 48),
                                "url" : self.folderLink(self.node(), "edit"),
                                "requiredAuthorities" : [
                                    {
                                        "permissioned" : this.node(),
                                        "permissions" : ["update"]
                                    }
                                ]
                            },
                            "edit-json" : {
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
                            }
                        }
                    },
                    {
                        "title" : "Other",
                        "items" : {
                            "copy" : {
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
                            },
                            "import": {
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
                            },
                            "export" : {
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
                        }
                    }
                ]
            });
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

            this.page(Alpaca.mergeObject(page,this.base(el)));
        }
    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.Folder);

})(jQuery);