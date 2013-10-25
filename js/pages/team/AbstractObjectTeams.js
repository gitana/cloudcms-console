(function($) {
    Gitana.Console.Pages.AbstractObjectTeams = Gitana.CMS.Pages.AbstractListPageGadget.extend(
    {
        requiredAuthorities: function() {
            return [
                {
                    "permissioned" : this.targetObject(),
                    "permissions" : ["read"]
                }
            ];
        },

        setupToolbar: function() {
            var self = this;
            self.base();
            self.addButtons([
                {
                "id": "create",
                "title": "New Team",
                    "icon" : Gitana.Utils.Image.buildImageUri('security', 'team-add', 48),
                    "url" : self.link(self.targetObject(),'add','team'),
                    "requiredAuthorities" : [
                        {
                            "permissioned" : this.targetObject(),
                            "permissions" : ["update","create_subobjects"]
                        }
                    ]
                }/*,
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
                }*/
            ]);
        },

        /** OVERRIDE **/
        setupList: function(el) {
            var self = this;

            // define the list
            var list = self.defaultList();

            list["actions"] = self.actionButtons({
                "edit": {
                    "title": "Edit Team",
                    "icon" : Gitana.Utils.Image.buildImageUri('security', 'team-edit', 48),
                    "click": function(team){
                        self.app().run("GET", self.teamLink(team, self.contextObject(),'edit'));
                    },
                    "requiredAuthorities" : [{
                        "permissioned" : function(row) {
                            return row.get('group')
                        },
                        "permissions" : ["update"]
                    },{
                        "permissioned" : self.targetObject(),
                        "permissions" : ["update"]
                    }]
                },
                "delete": {
                    "title": "Delete Team(s)",
                    "icon" : Gitana.Utils.Image.buildImageUri('security', 'team-delete', 48),
                    "selection" : "multiple",
                    "click": function(teams) {
                        self.onClickDeleteMultiple(self.targetObject(),teams,'team',self.link(self.targetObject(),'teams'),Gitana.Utils.Image.buildImageUri('security', 'team', 20),'team');
                    },
                    "requiredAuthorities" : [{
                        "permissioned" : function(row) {
                            return row.get('group')
                        },
                        "permissions" : ["delete"]
                    },{
                        "permissioned" : self.targetObject(),
                        "permissions" : ["update"]
                    }]
                },
                "editJSON": {
                    "title": "Edit JSON",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'json-edit', 48),
                    "click": function(object) {
                        self.app().run("GET", self.link(object,'edit','json'));
                    },
                    "requiredAuthorities" : [{
                        "permissioned" : function(row) {
                            return row.get('group')
                        },
                        "permissions" : ["update"]
                    },{
                        "permissioned" : self.targetObject(),
                        "permissions" : ["update"]
                    }]
                }/*,
                "export": {
                    "title": "Export Team",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-export', 48),
                    "click": function(team) {
                        self.app().run("GET", self.teamLink(team, self.contextObject(),'export'));
                    },
                    "requiredAuthorities" : {
                        "permissions" : ["read"]
                    }
                }*/
            });

            list["columns"] = [
                {
                    "title": "Key",
                    "type":"property",
                    "sortingExpression": "_doc",
                    "property": function(callback) {
                        var title = this.getKey();
                        var value = "<a href='#" + self.teamLink(this, self.contextObject()) + "'>" + title + "</a>";
                        callback(value);
                    }
                },
                {
                    "title": "Roles",
                    "type":"property",
                    "property": function(callback) {
                        var roles = this.getRoleKeys().join(";");
                        callback(roles);
                    }
                }/*,
                {
                    "title": "Last Modified By",
                    "type":"property",
                    "property": function(callback) {
                        callback(self.listItemProp(this,"lastModifiedBy"));
                    }
                },
                {
                    "title": "Last Modified On",
                    "type":"property",
                    "property": function(callback) {
                        callback(self.listItemProp(this,"lastModifiedOn"));
                    }
                }*/
            ];

            list.hideIcon = true;

            /*
            list["loadFunction"] = function(query, pagination, callback) {
                var groupIds = [];
                var groupStats = {};

                var checks = [];
                self.targetObject().listTeams().each(function() {
                    $.merge(checks, self.prepareListPermissionCheck(this,['update','delete']));
                    groupIds.push(this.getGroupId());
                }).then(function() {
                    var _this = this;
                    this.subchain(self.server()).checkRepositoryPermissions(checks, function(checkResults) {
                        self.updateUserRoles(checkResults);
                        _this.subchain(self.server()).queryGroups({
                            "principal-id" : {
                                "$in" : groupIds
                            }
                        }).each(function() {
                            groupStats[this.getPrincipalId()] = {
                                "lastModifiedBy" : this.getSystemMetadata().getModifiedBy(),
                                "lastModifiedOn" : this.getSystemMetadata().getModifiedOn().getTimestamp()
                            }
                        });

                        _this.then(function() {
                            _this.each(function() {
                                this.object["lastModifiedBy"] = groupStats[this.getGroupId()]["lastModifiedBy"];
                                this.object["lastModifiedOn"] = groupStats[this.getGroupId()]["lastModifiedOn"];
                            });
                            _this.then(function() {
                                callback.call(this);
                            });
                        });
                    });
                });
            };
            */
            /*
            list["isItemReadonly"] = function(item) {
                return item.getKey() == 'owners';
            };
            */
            list["loadFunction"] = function(query, pagination, callback) {
                var groupIds = [];
                var groupLookup = {};

                var checks = [];
                self.targetObject().trap(function(error) {
                    return self.handlePageError(el, error);
                }).listTeams().each(function() {
                    groupIds.push(this.getGroupId());
                }).then(function() {
                        this.subchain(self.platform()).readPrimaryDomain().then(function() {

                            this.queryGroups({
                                "_doc" : {
                                    "$in" : groupIds
                                }
                            }).each(function() {
                                    $.merge(checks, self.prepareListPermissionCheck(this, ['update','delete']));
                                    groupLookup[this.getId()] = this;
                            });

                            this.then(function() {
                                this.checkPrincipalPermissions(checks, function(checkResults) {
                                    self.updateUserRoles(checkResults);
                                });
                            })
                        });

                        this.then(function() {
                            /*
                            this.each(function() {
                                this.object["group"] = groupLookup[this.getGroupId()];
                                this.object["lastModifiedBy"] = groupLookup[this.getGroupId()].getSystemMetadata().getModifiedBy();
                                this.object["lastModifiedOn"] = groupLookup[this.getGroupId()].getSystemMetadata().getModifiedOn().getTimestamp();
                            });
                            */
                            this.then(function() {
                                callback.call(this);
                            });
                        });
                    });
            };

            // store list configuration onto observer
            self.list(self.SUBSCRIPTION,list);
        }

    });

})(jQuery);