(function($) {
    Gitana.Console.Pages.UserManageMemberships = Gitana.Console.Pages.Groups.extend(
    {
        SUBSCRIPTION : "user-membership-page",

        FILTER : "user-members-list-filters",

        setup: function() {
            this.get("/users/{userId}/manage/memberships", this.index);
        },

        targetObject: function() {
            return this.principalUser();
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
            this.menu(Gitana.Console.Menu.User(this));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.User(this), [
                {
                    "text" : "Manage Memberships"
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
                    "title": "ID",
                    "type":"property",
                    "sortingExpression": "principal-id",
                    "property": function(callback) {
                        var id = self.listItemProp(this,'principal-id');
                        var value = "<a href='#" + self.link(this) + "'>" + id + "</a>";
                        callback(value);
                    }
                },
                {
                    "title": "Membership",
                    "property": function(callback) {
                        var checked = this.get('isMember') ? "checked" : "";
                        var value = "<input type='checkbox' value='" + this.getId() + "' class='member-selection' " +  checked + "/>";
                        callback(value);
                    }
                },
                {
                    "title": "Title",
                    "type":"property",
                    "sortingExpression": "title",
                    "property": function(callback) {
                        var title = self.listItemProp(this,'title');
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
            var memberIds = [];
            list["loadFunction"] = function(query, pagination, callback) {
                var _this;
                self.domain().trap(function(error) {
                    return self.handlePageError(el, error);
                }).queryGroups(self.query(),self.pagination(pagination)).then(function() {
                    _this = this;

                    this.subchain(self.targetObject()).listMemberships(false).each(function() {
                        memberIds.push(this.getId());
                    });

                    this.then(function() {
                        this.each(function() {
                            if ($.inArray(this.getId(),memberIds) != -1) {
                                this['isMember'] = true;
                            } else {
                                this['isMember'] = false;
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
                var groupId = control.val();
                var userId = self.targetObject().getId();
                var option = control.is(':checked');
                if (option) {
                    Gitana.Utils.UI.block('Adding membership ' + groupId + '...');
                    Chain(self.server()).readGroup(groupId).then(function() {
                        this.addMember(userId).then(function() {
                            Gitana.Utils.UI.unblock();
                        });
                    });
                } else {
                    Gitana.Utils.UI.block('Removing membership ' + groupId + '...');
                    Chain(self.server()).readGroup(groupId).then(function() {
                        this.removeMember(userId).then(function() {
                            Gitana.Utils.UI.unblock();
                        });
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

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.UserManageMemberships);

})(jQuery);