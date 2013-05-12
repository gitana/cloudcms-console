(function($) {
    Gitana.Console.Pages.DomainGroup = Gitana.Console.Pages.AbstractDomainGroup.extend(
        {
            SUBSCRIPTION : "domain-group-page",

            FILTER : "domain-member-list-filters",

            constructor: function(id, ratchet) {
                this.base(id, ratchet);
            },

            setup: function() {
                this.get("/domains/{domainId}/groups/{groupId}", this.index);
            },

            /** Filter Related Methods **/
            filterEmptyData: function() {
                var emptyData = _mergeObject({
                    "indirect" : false
                }, this.base());
                delete emptyData["domainId"];
                return emptyData;
            },

            filterFormToJSON: function (formData) {
                if (! Alpaca.isValEmpty(formData)) {
                    var json_query = _safeParse(formData.query);
                    if (!Alpaca.isValEmpty(json_query)) {
                        return json_query;
                    } else {
                        var query = this.base(formData);
                        query['indirect'] = formData['indirect'];
                        return query;
                    }
                } else {
                    return {};
                }
            },

            filterSchema: function () {
                var schema = _mergeObject({
                    "type" : "object",
                    "properties" : {
                        "indirect" : {
                            "title": "Indirect Membership",
                            "type" : "boolean",
                            "default" : false,
                            "dependencies": "member"
                        }
                    }
                }, this.base());
                delete schema["properties"]["domainId"];
                return schema;
            },

            filterOptions: function() {
                var options = this.base();
                options["fields"]["indirect"] = {
                    "helper" : "Set this option to find out principal's indirect membership.",
                    "rightLabel": "Querying indirect members?",
                    "dependencies": {
                        "member" : false
                    }
                };
                delete options["fields"]["domainId"];
                return options;
            },

            filterView: function() {
                return _mergeObject(this.base(), {
                    "layout": {
                        "bindings": {
                            "indirect": "column-2"
                        }
                    }
                });
            },

            targetObject: function() {
                return this.group();
            },

            contextObject: function() {
                return this.domain();
            },

            setupMenu: function() {
                this.menu(Gitana.Console.Menu.DomainGroup(this));
            },

            setupBreadcrumb: function() {
                return this.breadcrumb(Gitana.Console.Breadcrumb.DomainGroup(this));
            },

            setupToolbar: function() {
                var self = this;
                self.base();
                self.addButtons([
                    {
                        "id": "create",
                        "title": "New Sub Group",
                        "icon" : Gitana.Utils.Image.buildImageUri('security', 'group-add', 48),
                        "url" : self.link(this.targetObject(), "add", "group"),
                        "requiredAuthorities" : [
                            {
                                "permissioned" : this.contextObject(),
                                "permissions" : ["create_subobjects"]
                            }
                        ]
                    },
                    {
                        "id": "create-user",
                        "title": "New User",
                        "icon" : Gitana.Utils.Image.buildImageUri('security', 'user-add', 48),
                        "url" : self.link(this.targetObject(), "add", "user"),
                        "requiredAuthorities" : [
                            {
                                "permissioned" : this.contextObject(),
                                "permissions" : ["create_subobjects"]
                            }
                        ]
                    },
                    {
                        "id": "edit",
                        "title": "Edit Group",
                        "icon" : Gitana.Utils.Image.buildImageUri('security', 'group-edit', 48),
                        "url" : self.link(this.targetObject(), "edit"),
                        "requiredAuthorities" : [
                            {
                                "permissioned" : this.targetObject(),
                                "permissions" : ["update"]
                            }
                        ]
                    },
                    {
                        "id": "delete",
                        "title": "Delete Group",
                        "icon" : Gitana.Utils.Image.buildImageUri('security', 'group-delete', 48),
                        "click": function(group) {
                            self.onClickDelete(self.targetObject(), 'group', self.listLink('groups'), Gitana.Utils.Image.buildImageUri('security', 'group', 20), 'group');
                        },
                        "requiredAuthorities" : [
                            {
                                "permissioned" : this.targetObject(),
                                "permissions" : ["delete"]
                            }
                        ]
                    },
                    {
                        "id": "edit-json",
                        "title": "Edit JSON",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'json-edit', 48),
                        "url" : self.link(this.targetObject(), "edit", "json"),
                        "requiredAuthorities" : [
                            {
                                "permissioned" : this.targetObject(),
                                "permissions" : ["update"]
                            }
                        ]
                    },
                    {
                        "id": "export",
                        "title": "Export Group",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-export', 48),
                        "url" : self.LINK().call(self, self.targetObject(), 'export'),
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
                        "url" : self.LINK().call(self, self.targetObject(), 'import'),
                        "requiredAuthorities" : [
                            {
                                "permissioned" : self.targetObject(),
                                "permissions" : ["create_subobjects"]
                            }
                        ]
                    }
                ], self.SUBSCRIPTION + "-page-toolbar");
            },

            /** OVERRIDE **/
            setupList: function(el) {
                var self = this;

                // define the list
                var list = self.defaultList();

                list.hideCheckbox = true;

                list["actions"] = self.actionButtons({
                });

                list["columns"] = [
                    {
                        "title": "Name",
                        "type":"property",
                        "sortingExpression": "name",
                        "property": function(callback) {
                            /*
                             var id = self.listItemProp(this,'name');
                             var value = "<a href='#" + self.link(this) + "'>" + id + "</a>";
                             callback(value);
                             */
                            var id = self.listItemProp(this, 'name');
                            var link = "";
                            if (this.get('teamGroup') && this.get('teamableTypeId')) {
                                var teamableTypeId = this.get('teamableTypeId');
                                if (teamableTypeId == 'repository') {
                                    link = "/repositories/";
                                } else {
                                    link = "/" + teamableTypeId + "s/";
                                }
                                link += this.get('teamableId') + "/teams/" + this.get('teamKey');
                            } else {
                                link = self.link(this);
                            }
                            var value = "<a href='#" + link + "'>" + id + "</a>";
                            callback(value);
                        }
                    },
                    {
                        "title": "Title",
                        "type":"property",
                        "property": function(callback) {
                            var type = this.getType();
                            if (type == "GROUP") {
                                callback(self.friendlyTitle(this));
                            } else {
                                callback(self.friendlyName(this));
                            }
                        }
                    },
                    {
                        "title": "Type",
                        "type":"property",
                        "sortingExpression": "type",
                        "property": function(callback) {
                            /*
                             var type = this.getType();
                             callback(type);
                             */
                            var type = this.getType();
                            if (this.get('teamGroup') && this.get('teamableTypeId')) {
                                type = this.get('teamableTypeId').toUpperCase() + ' TEAM';
                            }
                            callback(type);
                        }
                    },
                    {
                        "title": "Last Modified",
                        "sortingExpression" : "_system.modified_on.ms",
                        "property": function(callback) {
                            var value = this.getSystemMetadata().getModifiedOn().getTimestamp();
                            callback(value);
                        }
                    },
                    {
                        "title": "Membership",
                        "property": function(callback) {
                            var buttonText = this.get('isMember') ? "Remove" : "Add";
                            var buttonClass = this.get('isMember') ? "membership-remove" : "membership-add";
                            if (this.get('isIndirectMember')) {
                                buttonText = "Add";
                                buttonClass = "membership-add";
                            }
                            var extraText = this.get('isIndirectMember') ? "<div style='margin-bottom: 6px;'>Indirect Member</div>" : "";
                            var value = extraText + "<a id='" + this.getDomainQualifiedId() + "' class='membership-action " + buttonClass + "'><span>" + buttonText + "</span></a>";
                            if (this.get('teamGroup')) {
                                value = "";
                            }
                            callback(value);
                        }
                    }
                ];

                list["loadFunction"] = function(query, pagination, callback) {
                    var memberIds = [];
                    var directMemberIds = [];
                    var principalQuery = Alpaca.cloneObject(self.query());

                    if (Alpaca.isValEmpty(principalQuery) || principalQuery['member']) {
                        Chain(self.contextObject()).trap(
                            function(error) {
                                return self.handlePageError(el, error);
                            }).then(function() {
                                var indirect = null;
                                var _this;
                                this.listMembers(self.targetObject(), null, self.pagination(), indirect).then(function() {
                                    _this = this;
                                    this.each(function() {
                                        _this[this.getId()]['isMember'] = true;
                                    }).then(function() {
                                        callback.call(this);
                                    });
                                });
                            });
                    } else {

                        delete principalQuery['member'];

                        var indirect = principalQuery['indirect'];

                        delete principalQuery['indirect'];

                        _mergeObject(principalQuery, {
                            "teamGroup" : {
                                "$ne" : true
                            }
                        });

                        if (!principalQuery['_doc']) {
                            _mergeObject(principalQuery, {
                                "_doc" : {
                                    "$ne" : self.targetObject().getId()
                                }
                            });
                        }

                        Chain(self.contextObject()).trap(
                            function(error) {
                                return self.handlePageError(el, error);
                            }).queryPrincipals(principalQuery, self.pagination(pagination)).then(function() {

                                this.subchain(self.contextObject()).listMembers(self.targetObject(), null, null, indirect).each(function() {
                                    memberIds.push(this.getId());
                                });

                                if (indirect) {
                                    this.subchain(self.contextObject()).listMembers(self.targetObject(), null, null, false).each(function() {
                                        directMemberIds.push(this.getId());
                                    });
                                }

                                var _this;
                                this.then(function() {
                                    var _this = this;
                                    this.each(
                                        function() {
                                            if ($.inArray(this.getId(), memberIds) != -1) {
                                                _this[this.getId()]['isMember'] = true;
                                                if (indirect && $.inArray(this.getId(), directMemberIds) == -1) {
                                                    _this[this.getId()]['isIndirectMember'] = true;
                                                }
                                            } else {
                                                _this[this.getId()]['isMember'] = false;
                                            }
                                        }).then(function() {
                                            callback.call(this);
                                        });
                                });
                            });
                    }
                };

                // store list configuration onto observer
                self.list(this.SUBSCRIPTION, list);
            },

            setupProfile: function () {
                var self = this;
                var group = self.targetObject();
                var pairs = {
                    "title" : "Overview",
                    "icon" : Gitana.Utils.Image.buildImageUri('security', 'group', 20),
                    "alert" : "",
                    "items" : [
                        {
                            "key" : "ID",
                            "value" : self.listItemProp(group, '_doc')
                        },
                        {
                            "key" : "Name",
                            "value" : self.listItemProp(group, 'name')
                        },
                        {
                            "key" : "Title",
                            "value" : self.listItemProp(group, 'title')
                        },
                        {
                            "key" : "Description",
                            "value" : self.listItemProp(group, 'description')
                        },
                        {
                            "key" : "Avatar",
                            "img" : "",
                            "class" : "avatar-photo"
                        },
                        {
                            "key" : "Last Modified",
                            "value" : group.getSystemMetadata().getModifiedOn().getTimestamp()
                        }
                    ]
                };

                this.pairs("group-profile-pairs", pairs);

                Chain(group).attachment('avatar').trap(
                    function() {
                        return false;
                    }).then(function() {
                        if (this.getLength() > 0) {
                            pairs["items"][4]['img'] = this.getDownloadUri() + "?timestamp=" + new Date().getTime();
                            self.pairs("group-profile-pairs", pairs);
                        }
                    });

                Chain(group).listMemberships(false).each(
                    function() {
                        pairs["items"].push({
                            "key" : "Parent Group",
                            "value" : self.friendlyTitle(this),
                            "link" : "#" + self.link(this)
                        });
                    }).then(function() {
                        self.pairs("group-profile-pairs", pairs);
                    });

            },

            processList: function(el) {
                var self = this;

                $("body").undelegate(".membership-add", "click").delegate(".membership-add", "click", function() {
                    var control = $(this);
                    var userId = control.attr('id');
                    Gitana.Utils.UI.block('Adding member ' + userId + '...');
                    Chain(self.contextObject()).trap(
                        function() {

                        }).addMember(self.targetObject(), userId).then(function() {
                            Gitana.Utils.UI.unblock();
                            control.removeClass('membership-add').addClass('membership-remove');
                            $('span', $(control)).html('Remove');
                        });
                });

                $("body").undelegate(".membership-remove", "click").delegate(".membership-remove", "click", function() {
                    var control = $(this);
                    var userId = control.attr('id');

                    Gitana.Utils.UI.block('Removing member ' + userId + '...');
                    Chain(self.contextObject()).trap(
                        function() {

                        }).removeMember(self.targetObject(), userId).then(function() {
                            Gitana.Utils.UI.unblock();
                            control.removeClass('membership-remove').addClass('membership-add');
                            $('span', $(control)).html('Add');
                        });
                });
            },

            setupDashlets : function () {
                this.setupProfile();
            },

            setupPage : function(el) {
                var page = {
                    "title" : "Group " + this.friendlyTitle(this.targetObject()),
                    "listTitle" : "Member List",
                    "listIcon" : Gitana.Utils.Image.buildImageUri('security', 'member', 20),
                    "subscription" : this.SUBSCRIPTION,
                    "pageToolbar" : true,
                    "filter" : this.FILTER,
                    "dashlets" :[
                        {
                            "id" : "pairs",
                            "grid" : "grid_12",
                            "gadget" : "pairs",
                            "subscription" : "group-profile-pairs"
                        }
                    ]
                };

                this.page(_mergeObject(page, this.base(el)));
            }

        });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.DomainGroup);

})(jQuery);