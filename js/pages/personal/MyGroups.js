(function($) {
    Gitana.Console.Pages.MyGroups = Gitana.CMS.Pages.AbstractListPageGadget.extend(
    {
        SUBSCRIPTION : "my-groups-page",

        FILTER : "my-group-list-filters",

        setup: function() {
            this.get("/dashboard/groups", this.index);
        },

        contextObject: function() {
            return this.server();
        },

        /** TODO: what should we check? **/
        requiredAuthorities: function() {
            return [
            ];
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Dashboard(this,"menu-my-groups"));
        },

        setupBreadcrumb: function() {
            var breadcrumb = [
                {
                    "text" : "My Groups"
                }
            ];

            this.breadcrumb(breadcrumb);
        },

        setupToolbar: function() {
            var self = this;
            self.base();
            self.addButtons([
            ]);

            this.toolbar(self.SUBSCRIPTION + "-toolbar",{
                "items" : {}
            });
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
                "edit": {
                    "title": "Edit Group",
                    "icon" : Gitana.Utils.Image.buildImageUri('security', 'group-edit', 48),
                    "click": function(group){
                        self.app().run("GET", self.link(group,'edit'));
                    },
                    "requiredAuthorities" : {
                        "permissions" : ["update"]
                    }
                },
                "delete": {
                    "title": "Delete Group(s)",
                    "icon" : Gitana.Utils.Image.buildImageUri('security', 'group-delete', 48),
                    "selection" : "multiple",
                    "click": function(group) {
                        self.onClickDelete(group,'group',self.listLink('groups'));
                    },
                    "requiredAuthorities" : {
                        "permissions" : ["delete"]
                    }
                },
                "editJSON": {
                    "title": "Edit JSON",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'json-edit', 48),
                    "click": function(object) {
                        self.app().run("GET", self.link(object,'edit','json'));
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
                        var id = self.listItemProp(this,'principal-id');
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
                self.user().trap(function(error) {
                    return self.handlePageError(el, error);
                }).listMemberships(self.query()).each(function() {
                    $.merge(checks, self.prepareListPermissionCheck(this,['update','delete']));
                }).then(function() {
                    var _this = this;
                    this.subchain(self.server()).checkRepositoryPermissions(checks, function(checkResults) {
                        self.updateUserRoles(checkResults);
                        callback.call(_this);
                    });
                });
            };

            // store list configuration onto observer
            self.list(this.SUBSCRIPTION,list);
        },

        setupPage : function(el) {
            var page = {
                "title" : "My Groups",
                "description" : "Display list of my groups.",
                "listTitle" : "Group List",
                "listIcon" : Gitana.Utils.Image.buildImageUri('security', 'group', 20),
                "searchBox" : false,
                "subscription" : this.SUBSCRIPTION,
                "filter" : this.FILTER
            };

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.MyGroups);

})(jQuery);