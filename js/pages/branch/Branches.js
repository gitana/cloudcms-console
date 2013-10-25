(function($) {
    Gitana.Console.Pages.Branches = Gitana.CMS.Pages.AbstractListPageGadget.extend(
        {
            SUBSCRIPTION : "branches",

            FILTER : function() {
                return "branch-list-filters-" + this.repository().getId()
            },

            FILTER_TOOLBAR: {
                "query" : {
                    "title" : "Query Branches",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'branch-query', 48)
                }
            },

            setup: function() {
                this.get("/repositories/{repositoryId}/branches", this.index);
            },

            targetObject: function() {
                return this.repository();
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
                this.menu(Gitana.Console.Menu.Repository(this, "menu-branches"));
            },

            setupBreadcrumb: function() {
                return this.breadcrumb(Gitana.Console.Breadcrumb.Branches(this));
            },

            setupToolbar: function() {
                var self = this;
                self.base();
                self.addButtons([
                    {
                        "id": "create",
                        "title": "New Branch",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'branch-add', 48),
                        "url" : self.LINK().call(self, self.branch(), 'add', 'branch'),
                        "requiredAuthorities" : [
                            {
                                "permissioned" : self.repository(),
                                "permissions" : ["create_subobjects"]
                            }
                        ]
                    },
                {
                    "id": "import",
                    "title": "Import Archive",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-import', 48),
                    "url" : this.LINK().call(this, this.repository(), 'import', 'repository'),
                    "requiredAuthorities" : [
                        {
                            "permissioned" : this.repository(),
                            "permissions" : ["create_subobjects"]
                        }
                    ]
                }
                ]);

                this.toolbar("branches-toolbar", {
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
                        "title": "Edit Branch",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'branch-edit', 48),
                        "click": function(branch) {
                            self.app().run("GET", self.LINK().call(self, branch, 'edit'));
                        },
                        "requiredAuthorities" : {
                            "permissions" : ["update"]
                        }
                    },
                    "editJSON": {
                        "title": "Edit JSON",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'json-edit', 48),
                        "click": function(branch) {
                            self.app().run("GET", self.LINK().call(self, branch, 'edit', 'json'));
                        },
                        "requiredAuthorities" : {
                            "permissions" : ["update"]
                        }
                    },
                    "export": {
                        "title": "Export Branch",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-export', 48),
                        "click": function(branch) {
                            self.app().run("GET", self.LINK().call(self, branch, 'export'));
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
                            var title = this.get('title') ? this.get('title') : "";
                            var value = "<a href='#" + self.LINK().call(self, this) + "'>" + title + "</a>";
                            callback(value);
                        }
                    },
                    {
                        "title": "Type",
                        "type":"property",
                        "sortingExpression": "type",
                        "property": function(callback) {
                            var value = this.get('type') ? this.get('type') : "";
                            callback(value);
                        }
                    },
                    {
                        "title": "Root Changeset",
                        "type":"property",
                        "sortingExpression": "root",
                        "property": function(callback) {
                            var value = this.get('root') ? this.get('root') : "";
                            if (value) {
                                value = "<a href='#" + self.listLink("changesets") + value + "'>" + value + "</a>"
                            }
                            callback(value);
                        }
                    },
                    {
                        "title": "Tip Changeset",
                        "type":"property",
                        "sortingExpression": "tip",
                        "property": function(callback) {
                            var value = this.get('tip') ? this.get('tip') : "";
                            if (value) {
                                value = "<a href='#" + self.listLink("changesets") + value + "'>" + value + "</a>"
                            }
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
                list.hideIcon = true;

                list["loadFunction"] = function(query, pagination, callback) {
                    var checks = [];
                    self.repository().trap(
                        function(error) {
                            return self.handlePageError(el, error);
                        }).queryBranches(self.query(), self.pagination(pagination)).each(
                        function() {
                            $.merge(checks, self.prepareListPermissionCheck(this, ['update','delete']));
                        }).then(function() {
                            var _this = this;
                            this.subchain(self.repository()).checkBranchPermissions(checks, function(checkResults) {
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
                    "title" : "Branches",
                    "description" : "Displays a list of branches contained within repository '" + this.friendlyTitle(this.repository()) + "'.",
                    "listTitle" : "Branch List",
                    "listIcon" : Gitana.Utils.Image.buildImageUri('objects', 'branch', 20),
                    "searchBox" : true,
                    "subscription" : "branches",
                    "filter" : this.FILTER()
                };

                this.page(_mergeObject(page, this.base(el)));
            }
        });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.Branches);

})(jQuery);