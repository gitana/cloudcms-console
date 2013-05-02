(function($) {
    Gitana.Console.Pages.Users = Gitana.CMS.Pages.AbstractListPageGadget.extend(
    {
        SUBSCRIPTION : "users",

        FILTER : "user-list-filters",

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/users", this.index);
        },

        contextObject: function() {
            return this.domain();
        },

        /** TODO: what should we check? **/
        requiredAuthorities: function() {
            return [
                {
                    "permissioned" : this.contextObject(),
                    "permissions" : ["read"]
                }
            ];
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Server(this,"menu-users"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.Users(this));
        },

        setupToolbar: function() {
            var self = this;
            self.base();
            self.addButtons([
                {
                "id": "create",
                "title": "New User",
                    "icon" : Gitana.Utils.Image.buildImageUri('security', 'user-add', 48),
                    "url" : '/add/user',
                    "requiredAuthorities" : [
                        {
                            "permissioned" : this.contextObject(),
                            "permissions" : ["create_subobjects"]
                        }
                    ]
                }
            ]);

            this.toolbar(self.SUBSCRIPTION + "-toolbar",{
                "items" : {}
            });
        },

        /** Filter Related Methods **/
        filterEmptyData: function() {
            return {
                "principal-id" : "",
                "lastName" : "",
                "email" : "",
                "companyName" : "",
                "startDate" : "",
                "endDate": "",
                "query" : ""
            };
        },

        filterFormToJSON: function (formData) {
            if (! Alpaca.isValEmpty(formData)) {
                if (! Alpaca.isValEmpty(formData.query)) {
                    return JSON.parse(formData.query);
                } else {
                    var query = {};
                    if (formData['principal-id']) {
                        query['principal-id'] = {
                            "$regex" : formData['principal-id']
                        };
                    }
                    if (formData['lastName']) {
                        query['lastName'] = {
                            "$regex" : formData['lastName']
                        };
                    }
                    if (formData['email']) {
                        query['email'] = {
                            "$regex" : formData['email']
                        };
                    }
                    if (formData['companyName']) {
                        query['companyName'] = {
                            "$regex" : formData['companyName']
                        };
                    }
                    if (formData.startDate || formData.endDate) {
                        query["_system.modified_on.ms"] = {
                        };
                        if (formData.startDate) {
                            query["_system.modified_on.ms"]["$gte"] = Gitana.Utils.Date.strToDate(formData.startDate).getTime();
                        }
                        if (formData.endDate) {
                            query["_system.modified_on.ms"]["$lt"] = Gitana.Utils.Date.strToDate(formData.endDate).getTime() + 86400000;
                        }
                    }
                    return query;
                }
            } else {
                return {};
            }
        },

        filterSchema: function () {
            return {
                "type" : "object",
                "properties" : {
                    "principal-id" : {
                        "title": "ID",
                        "type" : "string"
                    },
                    "lastName" : {
                        "title": "Last Name",
                        "type" : "string"
                    },
                    "email" : {
                        "title": "Email",
                        "type" : "string"
                    },
                    "companyName" : {
                        "title": "Company Name",
                        "type" : "string"
                    },
                    "startDate" : {
                        "title": "Start Date",
                        "type" : "string",
                        "format": "date"
                    },
                    "endDate" : {
                        "title": "End Date",
                        "type" : "string",
                        "format": "date"
                    },
                    "query" : {
                        "title": "Full Query",
                        "type" : "string"
                    }
                }
            };
        },

        filterOptions: function() {
            return {
                "helper" : "Refine list by title, description, date range or full query.",
                "fields" : {
                    "principal-id" : {
                        "size": this.DEFAULT_FILTER_TEXT_SIZE,
                        "helper": "Enter regular expression for query by id."
                    },
                    "lastName" : {
                        "size": this.DEFAULT_FILTER_TEXT_SIZE,
                        "helper": "Enter regular expression for query by last name."
                    },
                    "email" : {
                        "size": this.DEFAULT_FILTER_TEXT_SIZE,
                        "helper": "Enter regular expression for query by email."
                    },
                    "companyName" : {
                        "size": this.DEFAULT_FILTER_TEXT_SIZE,
                        "helper": "Enter regular expression for query by company name."
                    },
                    "startDate" : {
                        "size": this.DEFAULT_FILTER_DATE_SIZE,
                        "helper": "Pick start date of date range."
                    },
                    "endDate" : {
                        "size": this.DEFAULT_FILTER_DATE_SIZE,
                        "helper": "Pick end date of date range."
                    },
                    "query" : {
                        "type": "editor",
                        "aceMode": "ace/mode/json",
                        "aceFitContentHeight": true,
                        "helper": "Enter full query in JSON."
                    }
                }
            };
        },

        filterView: function() {
            return {
                "parent": "VIEW_WEB_EDIT_LAYOUT_GRID_FOUR_COLUMN",
                "layout": {
                    "bindings": {
                        "principal-id": "column-1",
                        "lastName": "column-1",
                        "email": "column-1",
                        "companyName": "column-2",
                        "startDate": "column-2",
                        "endDate": "column-2",
                        "query" : "column-3"
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
                    "title": "Edit User",
                    "icon" : Gitana.Utils.Image.buildImageUri('security', 'user-edit', 48),
                    "click": function(user){
                        self.app().run("GET", self.link(user,'edit'));
                    },
                    "requiredAuthorities" : {
                        "permissions" : ["update"]
                    }
                },
                "delete": {
                    "title": "Delete User(s)",
                    "icon" : Gitana.Utils.Image.buildImageUri('security', 'user-delete', 48),
                    "selection" : "multiple",
                    "click": function(users) {
                        self.onClickDeleteMultiple(self.server(), users, "user", self.listLink('users') , Gitana.Utils.Image.buildImageUri('security', 'user', 20), 'user');
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
                {
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
                var checks = [];
                self.contextObject().trap(function(error) {
                    return self.handlePageError(el, error);
                }).queryUsers(self.query(),self.pagination(pagination)).each(function() {
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
                "title" : "Users",
                "description" : "Display list of users.",
                "listTitle" : "User List",
                "listIcon" : Gitana.Utils.Image.buildImageUri('security', 'user', 20),
                "searchBox" : true,
                "subscription" : this.SUBSCRIPTION,
                "filter" : this.FILTER
            };

            this.page(Alpaca.mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.Users);

})(jQuery);