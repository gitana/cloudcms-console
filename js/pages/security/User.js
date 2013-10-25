(function($) {
    Gitana.Console.Pages.User = Gitana.CMS.Pages.AbstractListPageGadget.extend(
    {
        SUBSCRIPTION : "user-page",

        FILTER : "subuser-list-filters",

        setup: function() {
            this.get("/users/{userId}", this.index);
        },

        targetObject: function() {
            return this.principalUser();
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
            this.menu(Gitana.Console.Menu.User(this));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.User(this));
        },

        setupToolbar: function() {
            var self = this;
            self.base();
            self.addButtons([
                {
                "id": "edit",
                "title": "Edit User",
                    "icon" : Gitana.Utils.Image.buildImageUri('security', 'user-edit', 48),
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
                "title": "Delete User",
                    "icon" : Gitana.Utils.Image.buildImageUri('security', 'user-delete', 48),
                    "click": function(user) {
                        self.onClickDelete(self.targetObject(),'user',self.listLink('users'),Gitana.Utils.Image.buildImageUri('security', 'user', 20), 'principalUser');
                    },
                    "requiredAuthorities" : [
                        {
                            "permissioned" : this.contextObject(),
                            "permissions" : ["delete"]
                        }
                    ]
                },
                {
                "id": "manage",
                "title": "Manage Memberships",
                    "icon" : Gitana.Utils.Image.buildImageUri('security', 'member-manage', 48),
                    "url": self.link(this.targetObject(),"manage","memberships"),
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

            /*
            this.toolbar(self.SUBSCRIPTION + "-toolbar",{
                "items" : {}
            });
            */
        },

        /** Filter Related Methods **/
        filterEmptyData: function() {
            return "";
        },

        filterFormToJSON: function (formData) {
            return formData['indirect'];
        },

        filterSchema: function () {
            return {
                "type" : "object",
                "properties" : {
                    "indirect" : {
                        "title": "Membership Option",
                        "type" : "boolean",
                        "default" : false
                    }
                }
            };
        },

        filterOptions: function() {

            var options = {
                "helper" : "Query list by membership option.",
                "fields" : {
                    "indirect" : {
                        "helper" : "Set membership option.",
                        "rightLabel": "Including indirect memberships ?"
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
                        "indirect": "column-1"
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
                "remove-member": {
                    "title": "Remove Membership",
                    "icon" : Gitana.Utils.Image.buildImageUri('security', 'member-manage', 48),
                    "click": function(member){
                        Gitana.Utils.UI.block('Removing membership ' + member.getId() + '...');
                        Chain(member).trap(function() {
                        }).removeMember(self.targetObject().getId()).then(function() {
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
                        var title = this.get('title') ? this.get('title') : "";
                        callback(title);
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
                Chain(self.principalUser()).trap(function(error) {
                    return self.handlePageError(el, error);
                }).listMemberships(self.query()).then(function() {
                    callback.call(this);
                });
            };

            // store list configuration onto observer
            self.list(this.SUBSCRIPTION,list);
        },

        setupProfile: function () {
            var self = this;
            var user = self.targetObject();
            var pairs = {
                "title" : "Overview",
                "icon" : Gitana.Utils.Image.buildImageUri('security', 'user', 20),
                "alert" : "",
                "items" : [
                    {
                        "key" : "Last Name",
                        "value" : self.listItemProp(user,'lastName')
                    },
                    {
                        "key" : "First Name",
                        "value" : self.listItemProp(user,'firstName')
                    },
                    {
                        "key" : "Email",
                        "value" : self.listItemProp(user,'email')
                    },
                    {
                        "key" : "Company",
                        "value" : self.listItemProp(user,'companyName')
                    },
                    {
                        "key" : "Avatar",
                        "img" : "",
                        "class" : "avatar-photo"
                    },
                    {
                        "key" : "Last Modified",
                        "value" : user.getSystemMetadata().getModifiedOn().getTimestamp()
                    }
                ]
            };

            this.pairs("user-profile-pairs",pairs);

            user.attachment('avatar').trap(function() {
                return false;
            }).then(function() {
                if (this.getLength() > 0) {
                    pairs["items"][4]['img'] = this.getDownloadUri() + "?timestamp=" + new Date().getTime();
                    self.pairs("user-profile-pairs", pairs);
                }
            });
        },

        setupDashlets: function(el, callback) {
            this.setupProfile();
            callback();
        },

        setupPage : function(el) {
            var page = {
                "title" : "User " + this.targetObject().getId(),
                "listTitle" : "Membership List",
                "listIcon" : Gitana.Utils.Image.buildImageUri('security', 'member', 20),
                "subscription" : this.SUBSCRIPTION,
                "pageToolbar" : true,
                "filter" : this.FILTER,
                "dashlets" :[{
                    "id" : "pairs",
                    "grid" : "grid_12",
                    "gadget" : "pairs",
                    "subscription" : "user-profile-pairs"
                }]
            };

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.User);

})(jQuery);