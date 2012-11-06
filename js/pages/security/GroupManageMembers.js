(function($) {
    Gitana.Console.Pages.GroupManageMembers = Gitana.Console.Pages.Users.extend(
    {
        SUBSCRIPTION : "group-membership-page",

        FILTER : "group-members-list-filters",

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/groups/{groupId}/manage/members", this.index);
        },

        targetObject: function() {
            return this.group();
        },

        requiredAuthorities: function() {
            return [
                {
                    "permissioned" : this.targetObject(),
                    "permissions" : ["update"]
                }
            ];
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Group(this));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Group(this), [
                {
                    "text" : "Manage Members"
                }
            ]));
        },

        /** OVERRIDE **/
        setupList: function(el) {
            var self = this;

            // define the list
            var list = self.defaultList();

            list["actions"] = self.actionButtons({
                "update-members": {
                    "title": "Update Members",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'json-edit', 48),
                    "click": function(object) {
                        self.app().run("GET", self.link(object,'edit','json'));
                    }
                }
            });

            list.hideCheckbox = true;

            list["columns"] = [
                {
                    "title": "Id",
                    "type":"property",
                    "sortingExpression": "principal-id",
                    "property": function(callback) {
                        var id = self.listItemProp(this,'principal-id');
                        var value = "<a href='#" + self.link(this) + "'>" + id + "</a>";
                        callback(value);
                    }
                },
                {
                    "title": "Member",
                    "property": function(callback) {
                        var checked = this.get('isMember') ? "checked" : "";
                        var value = "<input type='checkbox' value='" + this.getId() + "' class='member-selection' " +  checked + "/>";
                        callback(value);
                    }
                },
                {
                    "title": "Last Name",
                    "type":"property",
                    "sortingExpression": "lastName",
                    "property": function(callback) {
                        var value = self.listItemProp(this,'lastName');
                        callback(value);
                    }
                },
                {
                    "title": "First Name",
                    "type":"property",
                    "sortingExpression": "firstName",
                    "property": function(callback) {
                        var value = self.listItemProp(this,'firstName');
                        callback(value);
                    }
                },
 /*               {
                    "title": "Email",
                    "type":"property",
                    "sortingExpression": "email",
                    "property": function(callback) {
                        var value = self.listItemProp(this,'email');
                        callback(value);
                    }
                },
                {
                    "title": "Company",
                    "type":"property",
                    "sortingExpression": "companyName",
                    "property": function(callback) {
                        var value = self.listItemProp(this,'companyName');
                        callback(value);
                    }
                },*/
                {
                    "title": "Last Modified",
                    "sortingExpression" : "_system.modified_on.ms",
                    "property": function(callback) {
                        var value = this.getSystemMetadata().getModifiedOn().getTimestamp();
                        callback(value);
                    }
                }
            ];
            var memberIds = [];
            list["loadFunction"] = function(query, pagination, callback) {
                var _this;
                self.domain().trap(function(error) {
                    return self.handlePageError(el, error);
                }).queryUsers(self.query(),self.pagination(pagination)).then(function() {

                    _this = this;

                    this.subchain(self.group()).listUsers().each(function() {
                        memberIds.push(this.getId());
                    });

                    this.then(function() {
                        this.each(function() {
                            if ($.inArray(this.getId(),memberIds) != -1) {
                                _this[this.getId()]['isMember'] = true;
                            } else {
                                _this[this.getId()]['isMember'] = false;
                            }
                        }).then(function() {
                            callback.call(this);
                        });
                    });
                });
            };

            // store list configuration onto observer
            self.list(this.SUBSCRIPTION,list);
        },

        processList: function(el) {
            var self = this;

            $("body").undelegate(".member-selection", "click").delegate(".member-selection", "click", function() {
                var control = $(this);
                var userId = control.val();
                var option = control.is(':checked');
                if (option) {
                    Gitana.Utils.UI.block('Adding member ' + userId + '...');
                    Chain(self.group()).trap(function() {

                    }).addMember(userId).then(function() {
                        Gitana.Utils.UI.unblock();
                    });
                } else {
                    Gitana.Utils.UI.block('Removing member ' + userId + '...');
                    Chain(self.group()).trap(function() {

                    }).removeMember(userId).then(function() {
                        Gitana.Utils.UI.unblock();
                    });
                }
            })
        },

        setupPage : function(el) {
            var page = {
                "title" : "Group " + this.friendlyTitle(this.targetObject()) + " Memberships",
                "description" : "To add or remove a member from this group, simply check or un-check the member's membership checkbox.",
                "listTitle" : "User List",
                "listIcon" : Gitana.Utils.Image.buildImageUri('security', 'user', 20),
                "searchBox" : true,
                "subscription" : this.SUBSCRIPTION,
                "filter" : this.FILTER
            };

            this.page(Alpaca.mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.GroupManageMembers);

})(jQuery);