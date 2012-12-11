(function($) {
    Gitana.Console.Pages.Group = Gitana.CMS.Pages.AbstractListPageGadget.extend(
    {
        SUBSCRIPTION : "group-page",

        FILTER : "subgroup-list-filters",

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/groups/{groupId}", this.index);
        },

        filterFormToJSON: function (formData) {

            var query = {};

            if (! Alpaca.isValEmpty(formData)) {
                query = formData
            }

            return query;
        },

        filterSchema: function () {
            return {
                "type" : "object",
                "properties" : {
                    "type" : {
                        "title": "Member Type",
                        "type" : "string",
                        "enum" : ['user','group']
                    },
                    "indirect" : {
                        "title": "Membership Option",
                        "type" : "boolean",
                        "default" : false
                    }
                }
            };
        },

        filterOptions: function() {
            return {
                "helper" : "Refine list by member type and option.",
                "fields" : {
                    "type" : {
                        "type" : "select",
                        "helper": "Select member type.",
                        "optionLabels": ["User", "Group"]
                    },
                    "indirect" : {
                        "helper" : "Set membership option.",
                        "rightLabel": "Including indirect memberships ?"
                    }
                }
            };
        },

        filterView: function() {
            return {
                "parent": "VIEW_WEB_EDIT_LAYOUT_GRID_FOUR_COLUMN",
                "layout": {
                    "bindings": {
                        "type": "column-1",
                        "indirect": "column-2"
                    }
                }
            };
        },

        targetObject: function() {
            return this.group();
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
            this.menu(Gitana.Console.Menu.Group(this));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.Group(this));
        },

        setupToolbar: function() {
            var self = this;
            self.base();
            self.addButtons([
                {
                "id": "create",
                "title": "New Sub Group",
                    "icon" : Gitana.Utils.Image.buildImageUri('security', 'group-add', 48),
                    "url" : self.link(this.targetObject(),"add","group"),
                    "requiredAuthorities" : [
                        {
                            "permissioned" : this.server(),
                            "permissions" : ["create_subobjects"]
                        }
                    ]
                },
                {
                "id": "create-user",
                "title": "New User",
                    "icon" : Gitana.Utils.Image.buildImageUri('security', 'user-add', 48),
                    "url" : self.link(this.targetObject(),"add","user"),
                    "requiredAuthorities" : [
                        {
                            "permissioned" : this.server(),
                            "permissions" : ["create_subobjects"]
                        }
                    ]
                },                {
                "id": "edit",
                "title": "Edit Group",
                    "icon" : Gitana.Utils.Image.buildImageUri('security', 'group-edit', 48),
                    "url" : self.link(this.targetObject(),"edit"),
                    "requiredAuthorities" : [
                        {
                            "permissioned" : this.contextObject(),
                            "permissions" : ["update"]
                        }
                    ]
                },
                {
                "id": "delete",
                "title": "Delete Group",
                    "icon" : Gitana.Utils.Image.buildImageUri('security', 'group-delete', 48),
                    "click": function(group) {
                        self.onClickDelete(self.targetObject(),'group',self.listLink('groups'),Gitana.Utils.Image.buildImageUri('security', 'group', 20), 'group');
                    },
                    "requiredAuthorities" : [
                        {
                            "permissioned" : this.targetObject(),
                            "permissions" : ["delete"]
                        }
                    ]
                },
                {
                "id": "manage",
                "title": "Manage Memberships",
                    "icon" : Gitana.Utils.Image.buildImageUri('security', 'member-manage', 48),
                    "url": self.link(this.targetObject(),"manage","members"),
                    "requiredAuthorities" : [
                        {
                            "permissioned" : this.contextObject(),
                            "permissions" : ["update"]
                        }
                    ]
                },
                {
                "id": "edit-json",
                "title": "Edit JSON",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'json-edit', 48),
                    "url" : self.link(this.targetObject(),"edit","json"),
                    "requiredAuthorities" : [
                        {
                            "permissioned" : this.contextObject(),
                            "permissions" : ["update"]
                        }
                    ]
                }
            ],self.SUBSCRIPTION + "-page-toolbar");
        },

        /** OVERRIDE **/
        setupList: function(el) {
            var self = this;

            // define the list
            var list = self.defaultList();

            list["actions"] = self.actionButtons({
                "remove-member": {
                    "title": "Remove Member",
                    "icon" : Gitana.Utils.Image.buildImageUri('security', 'member-manage', 48),
                    "click": function(member){
                        Gitana.Utils.UI.block('Removing member ' + member.getId() + '...');
                        Chain(self.group()).trap(function() {
                        }).removeMember(member.getId()).then(function() {
                            Gitana.Utils.UI.unblock(function() {
                                $('.list-toolbar').css({
                                    "border": "0px none"
                                });
                                self.resetFilter();
                            });
                        });
                    },
                    "requiredAuthorities" : {
                        "permissions" : ["update"]
                    }
                }
            });

            list["columns"] = [
                {
                    "title": "ID",
                    "type":"property",
                    "sortingExpression": "principal-id",
                    "property": function(callback) {
                        var id = this.get('principal-id') ? this.get('principal-id') : "";
                        var value = "<a href='#" + self.link(this) + "'>" + id + "</a>";
                        callback(value);
                    }
                },
                {
                    "title": "Title",
                    "type":"property",
                    "sortingExpression": "title",
                    "property": function(callback) {
                        var type = this.get('principal-type') ? this.get('principal-type') : "";
                        if (type == "GROUP") {
                            var title = this.get('title') ? this.get('title') : "";
                            callback(title);
                        } else {
                            var name = "";
                            if (this.getFirstName()) {
                                name += this.getFirstName() + " ";
                            }
                            if (this.getLastName()) {
                                name += this.getLastName();
                            }
                            callback(name);
                        }
                    }
                },
                {
                    "title": "Type",
                    "type":"property",
                    "sortingExpression": "principal-type",
                    "property": function(callback) {
                        var type = this.get('principal-type') ? this.get('principal-type') : "";
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
                }
            ];
            list["loadFunction"] = function(query, pagination, callback) {
                Chain(self.group()).trap(function(error) {
                    return self.handlePageError(el, error);
                }).listMembers(self.query()['type'],self.query()['indirect'],self.pagination(pagination)).then(function() {
                    callback.call(this);
                });
            };

            // store list configuration onto observer
            self.list(this.SUBSCRIPTION,list);
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
                        "key" : "Title",
                        "value" : self.listItemProp(group,'title')
                    },
                    {
                        "key" : "Description",
                        "value" : self.listItemProp(group,'description')
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

            this.pairs("group-profile-pairs",pairs);

            group.attachment('avatar').trap(function() {
                return false;
            }).then(function() {
                if (this.getLength() > 0) {
                    pairs["items"][2]['img'] = this.getDownloadUri() + "?timestamp=" + new Date().getTime();
                    self.pairs("group-profile-pairs", pairs);
                }
            });

            group.listMemberships(false).each(function() {
                pairs["items"].push({
                    "key" : "Parent Group",
                    "value" : self.friendlyTitle(this),
                    "link" : "#" + self.link(this)
                });
            }).then(function() {
                self.pairs("group-profile-pairs", pairs);
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
                "dashlets" :[{
                    "id" : "pairs",
                    "grid" : "grid_12",
                    "gadget" : "pairs",
                    "subscription" : "group-profile-pairs"
                }]
            };

            this.page(Alpaca.mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.Group);

})(jQuery);