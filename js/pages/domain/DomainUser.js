(function($) {
    Gitana.Console.Pages.DomainUser = Gitana.Console.Pages.AbstractDomainGroup.extend(
        {
            SUBSCRIPTION : "user-page",

            FILTER : "user-memberships-list-filters",

            FILTER_TOOLBAR: {
                "query" : {
                    "title" : "Query Groups",
                    "icon" : Gitana.Utils.Image.buildImageUri('security', 'group-query', 48)
                }
            },

            setup: function() {
                this.get("/domains/{domainId}/users/{userId}", this.index);
            },

            targetObject: function() {
                return this.principalUser();
            },

            contextObject: function() {
                return this.domain();
            },

            setupMenu: function() {
                this.menu(Gitana.Console.Menu.DomainUser(this));
            },

            setupBreadcrumb: function() {
                return this.breadcrumb(Gitana.Console.Breadcrumb.DomainUser(this));
            },

            setupToolbar: function() {
                var self = this;
                self.base();
                self.addButtons([
                    {
                        "id": "edit",
                        "title": "Edit User",
                        "icon" : Gitana.Utils.Image.buildImageUri('security', 'user-edit', 48),
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
                        "title": "Delete User",
                        "icon" : Gitana.Utils.Image.buildImageUri('security', 'user-delete', 48),
                        "click": function(user) {
                            self.onClickDelete(self.targetObject(), 'user', self.listLink('users'), Gitana.Utils.Image.buildImageUri('security', 'user', 20), 'principalUser');
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
                                "permissioned" : this.contextObject(),
                                "permissions" : ["update"]
                            }
                        ]
                    },
                    {
                        "id": "export",
                        "title": "Export User",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-export', 48),
                        "url" : self.LINK().call(self, self.targetObject(), 'export'),
                        "requiredAuthorities" : [
                            {
                                "permissioned" : self.targetObject(),
                                "permissions" : ["read"]
                            }
                        ]
                    }/*,
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
                    }*/
                ], self.SUBSCRIPTION + "-page-toolbar");

                /*
                 this.toolbar(self.SUBSCRIPTION + "-toolbar",{
                 "items" : {}
                 });
                 */
            },

            /** Filter Related Methods **/
            filterEmptyData: function() {
                return {
                    "member" : true,
                    "id" : "",
                    "name" : "",
                    "title" : "",
                    "description" : "",
                    "startDate" : "",
                    "endDate": "",
                    "query" : ""
                };
            },

            filterFormToJSON: function (formData) {
                if (! Alpaca.isValEmpty(formData)) {
                    var json_query = _safeParse(formData.query);
                    if (!Alpaca.isValEmpty(json_query)) {
                        return json_query;
                    } else {
                        var query = {};
                        query['member'] = formData['member'];

                        if (formData['id']) {
                            query['_doc'] = formData['id'];
                        }
                        if (formData['name']) {
                            query['name'] = {
                                "$regex" : formData['name']
                            };
                        }
                        if (formData['title']) {
                            query['title'] = {
                                "$regex" : formData['title']
                            };
                        }
                        if (formData['description']) {
                            query['description'] = {
                                "$regex" : formData['description']
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
                        "member" : {
                            "title": "Member",
                            "type" : "boolean"
                        },
                        "id" : {
                            "title": "Principal Id",
                            "type" : "string",
                            "dependencies" : "member"
                        },
                        "name" : {
                            "title": "Principal Name",
                            "type" : "string",
                            "dependencies" : "member"
                        },
                        "title" : {
                            "title": "Title",
                            "type" : "string",
                            "dependencies" : "member"
                        },
                        "description" : {
                            "title": "Description",
                            "type" : "string",
                            "dependencies" : "member"
                        },
                        "startDate" : {
                            "title": "Start Date",
                            "type" : "string",
                            "format": "date",
                            "dependencies" : "member"
                        },
                        "endDate" : {
                            "title": "End Date",
                            "type" : "string",
                            "format": "date",
                            "dependencies" : "member"
                        },
                        "query" : {
                            "title": "Full Query",
                            "type" : "string"
                        }
                    }
                };
            },

            filterOptions: function() {
                var self = this;
                return {
                    "helper" : "Query groups by id, name, title, description or full query.",
                    "fields" : {
                        "member" : {
                            "label": "Membership",
                            "rightLabel": "Only display current user memberships?",
                            "helper": "Check this option for displaying groups that current user has direct membership."
                        },
                        "id" : {
                            "size": this.DEFAULT_FILTER_TEXT_SIZE,
                            "helper": "Enter a valid Cloud CMS id for query by exact match of id.",
                            "dependencies" : {
                                "member" : function(value) {
                                    return !value;
                                }
                            }
                        },
                        "name" : {
                            "size": this.DEFAULT_FILTER_TEXT_SIZE,
                            "helper": "Enter regular expression for query by name.",
                            "dependencies" : {
                                "member" : function(value) {
                                    return !value;
                                }
                            }
                        },
                        "title" : {
                            "size": this.DEFAULT_FILTER_TEXT_SIZE,
                            "helper": "Enter regular expression for query by title.",
                            "dependencies" : {
                                "member" : function(value) {
                                    return !value;
                                }
                            }
                        },
                        "description" : {
                            "size": this.DEFAULT_FILTER_TEXT_SIZE,
                            "helper": "Enter regular expression for query by description.",
                            "dependencies" : {
                                "member" : function(value) {
                                    return !value;
                                }
                            }
                        },
                        "startDate" : {
                            "size": this.DEFAULT_FILTER_DATE_SIZE,
                            "helper": "Pick start date of date range.",
                            "dependencies" : {
                                "member" : function(value) {
                                    return !value;
                                }
                            }
                        },
                        "endDate" : {
                            "size": this.DEFAULT_FILTER_DATE_SIZE,
                            "helper": "Pick end date of date range.",
                            "dependencies" : {
                                "member" : function(value) {
                                    return !value;
                                }
                            }
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
                            "member": "column-1",
                            "id": "column-1",
                            "title": "column-1",
                            "description": "column-1",
                            "name": "column-2",
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

                list.hideCheckbox = true;

                list["actions"] = self.actionButtons({
                });

                list["columns"] = [
                    {
                        "title": "Name",
                        "type":"property",
                        "sortingExpression": "name",
                        "property": function(callback) {
                            var id = self.listItemProp(this, 'name');
                            var link = "";
                            if (this.get('teamGroup') && this.get('teamableTypeId')) {
                                var teamableTypeId = this.get('teamableTypeId');
                                if (teamableTypeId == 'platform') {
                                    link = "";
                                }
                                else
                                {
                                    if (teamableTypeId == 'repository') {
                                        link = "/repositories/";
                                    } else {
                                        link = "/" + teamableTypeId + "s/";
                                    }

                                    link += this.get('teamableId');
                                }
                                link += "/teams/" + this.get('teamKey');
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
                            var buttonText = this.get('isMember') ? "Leave" : "Join";
                            var buttonClass = this.get('isMember') ? "membership-remove" : "membership-add";
                            var value = "<a id='" + this.getId() + "' class='membership-action " + buttonClass + "'><span>" + buttonText + "</span></a>";
                            if (this.get('teamGroup')) {
                                value = "";
                            }
                            callback(value);
                        }
                    }
                ];

                list["loadFunction"] = function(query, pagination, callback) {
                    var memberIds = [];
                    var principalQuery = Alpaca.cloneObject(self.query());

                    var _this;
                    if (Alpaca.isValEmpty(principalQuery) || principalQuery['member']) {
                        Chain(self.targetObject()).trap(
                            function(error) {
                                return self.handlePageError(el, error);
                            }).then(function() {
                                this.listMemberships(false).then(function(){
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

                        _mergeObject(principalQuery, {
                            "teamGroup" : {
                                "$ne" : true
                            },
                            "type" : "GROUP"
                        });

                        Chain(self.contextObject()).trap(
                            function(error) {
                                return self.handlePageError(el, error);
                            }).queryPrincipals(principalQuery, self.pagination(pagination)).then(function() {

                                this.subchain(self.targetObject()).listMemberships(false).each(function() {
                                    memberIds.push(this.getId());
                                });

                                var _this = this;
                                this.then(function() {
                                    this.each(
                                        function() {
                                            if ($.inArray(this.getId(), memberIds) != -1) {
                                                _this[this.getId()]['isMember'] = true;
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
                var user = self.targetObject();
                var pairs = {
                    "title" : "Overview",
                    "icon" : Gitana.Utils.Image.buildImageUri('security', 'user', 20),
                    "alert" : "",
                    "items" : [{
                        "key" : "ID",
                        "value" : self.listItemProp(user, '_doc')
                    }]
                };
                if (user["name"]) {
                    pairs.items.push({
                        "key" : "Principal",
                        "value" : self.listItemProp(user, 'name')
                    });
                }
                if (user["lastName"]) {
                    pairs.items.push({
                        "key" : "Last Name",
                        "value" : self.listItemProp(user, 'lastName')
                    });
                }
                if (user["firstName"]) {
                    pairs.items.push({
                        "key" : "First Name",
                        "value" : self.listItemProp(user, 'firstName')
                    });
                }
                if (user["email"]) {
                    pairs.items.push({
                        "key" : "Email",
                        "value" : self.listItemProp(user, 'email')
                    });
                }
                if (user["companyName"]) {
                    pairs.items.push({
                        "key" : "Company",
                        "value" : self.listItemProp(user, 'companyName')
                    });
                }
                pairs.items.push({
                    "key" : "Avatar",
                    "img" : "",
                    "class" : "avatar-photo"
                });
                pairs.items.push({
                    "key" : "Last Modified",
                    "value" : user.getSystemMetadata().getModifiedOn().getTimestamp()
                });
                if (user["directoryId"] && user["identityId"])
                {
                    var directoryId = user["directoryId"];
                    var identityId = user["identityId"];

                    pairs.items.push({
                        "key": "Identity",
                        "value": "<a href='#/directories/" + directoryId + "/identities/" + identityId + "'>" + identityId + "</a>"
                    });
                }

                this.pairs("user-profile-pairs", pairs);

                user.attachment('avatar').trap(
                    function() {
                        return false;
                    }).then(function() {
                        if (this.getLength() > 0) {
                            pairs["items"][6]['img'] = this.getDownloadUri() + "?timestamp=" + new Date().getTime();
                            self.pairs("user-profile-pairs", pairs);
                        }
                    });
            },

            processList: function(el) {
                var self = this;

                $("body").undelegate(".membership-add", "click").delegate(".membership-add", "click", function() {
                    var control = $(this);
                    var groupId = control.attr('id');
                    Gitana.Utils.UI.block('Adding membership ' + groupId + '...');
                    Chain(self.contextObject()).trap(
                        function() {

                        }).addMember(groupId, self.targetObject().getDomainQualifiedId()).then(function() {
                            Gitana.Utils.UI.unblock();
                            control.removeClass('membership-add').addClass('membership-remove');
                            $('span', $(control)).html('Leave');
                        });
                });

                $("body").undelegate(".membership-remove", "click").delegate(".membership-remove", "click", function() {
                    var control = $(this);
                    var groupId = control.attr('id');

                    Gitana.Utils.UI.block('Removing membership ' + groupId + '...');
                    Chain(self.contextObject()).trap(
                        function() {

                        }).removeMember(groupId, self.targetObject().getDomainQualifiedId()).then(function() {
                            Gitana.Utils.UI.unblock();
                            control.removeClass('membership-remove').addClass('membership-add');
                            $('span', $(control)).html('Join');
                        });
                });

                /*
                 $("body").undelegate(".member-selection", "click").delegate(".member-selection", "click", function() {
                 var control = $(this);
                 var groupId = control.val();
                 var option = control.is(':checked');
                 if (option) {
                 Gitana.Utils.UI.block('Adding membership ' + groupId + '...');
                 Chain(self.contextObject()).trap(function() {

                 }).addMember(groupId,self.targetObject()).then(function() {
                 Gitana.Utils.UI.unblock();
                 });
                 } else {
                 Gitana.Utils.UI.block('Removing membership ' + groupId + '...');
                 Chain(self.contextObject()).trap(function() {

                 }).removeMember(groupId,self.targetObject()).then(function() {
                 Gitana.Utils.UI.unblock();
                 });
                 }
                 })
                 */
            },

            setupDashlets : function (el, callback) {
                this.setupProfile();

                callback();
            },

            setupPage : function(el) {
                var page = {
                    "title" : "User " + this.targetObject().getName(),
                    "listTitle" : "Membership List",
                    "listIcon" : Gitana.Utils.Image.buildImageUri('security', 'member', 20),
                    "subscription" : this.SUBSCRIPTION,
                    "pageToolbar" : true,
                    "filter" : this.FILTER,
                    "dashlets" :[
                        {
                            "id" : "pairs",
                            "grid" : "grid_12",
                            "gadget" : "pairs",
                            "subscription" : "user-profile-pairs"
                        }
                    ]
                };

                this.page(_mergeObject(page, this.base(el)));
            }

        });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.DomainUser);

})(jQuery);