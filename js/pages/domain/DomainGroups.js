(function($) {
    Gitana.Console.Pages.DomainGroups = Gitana.CMS.Pages.AbstractListPageGadget.extend(
    {
        SUBSCRIPTION : "domain-groups-page",

        FILTER : "domain-group-list-filters",

        FILTER_TOOLBAR: {
            "query" : {
                "title" : "Query Groups",
                "icon" : Gitana.Utils.Image.buildImageUri('security', 'member-manage', 48)
            }
        },

        setup: function() {
            this.get("/domains/{domainId}/groups", this.index);
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

        /** Filter Related Methods **/
        filterEmptyData: function() {
            return Alpaca.merge(this.base(),{
                "name" : "",
                "teamGroup" : true
            });
        },

        filterFormToJSON: function (formData) {
            var query = this.base(formData);
            if (! Alpaca.isValEmpty(formData)) {
                var json_query = _safeParse(formData.query);
                if (Alpaca.isValEmpty(json_query)) {
                    if (formData['name']) {
                        query['name'] = {
                            "$regex" : formData['name']
                        };
                    }
                    if (formData['teamGroup']) {
                        query['teamGroup'] = {
                            "$ne" : true
                        };
                    } else {
                        query['teamGroup'] = {
                            "$exists" : true
                        };
                    }
                }
            }

            return query;
        },

        filterSchema: function () {
            return _mergeObject(this.base(), {
                "properties" : {
                    "name" : {
                        "title": "Name",
                        "type" : "string"
                    },
                    "teamGroup" : {
                        "title": "Team Group",
                        "type" : "boolean"
                    }
                }
            });
        },

        filterOptions: function() {

            var self = this;

            var options = _mergeObject(this.base(), {
                "helper" : "Query groups by id, name, title, description, date range, type or full query.",
                "fields" : {
                    "name" : {
                        "size": this.DEFAULT_FILTER_TEXT_SIZE,
                        "helper": "Enter regular expression for query by group name."
                    },
                    "teamGroup" : {
                        "rightLabel": "Not displaying team groups?",
                        "helper": "Check option for hiding team groups."
                    }
                }
            });

            return options;
        },

        filterView: function() {
            return _mergeObject(this.base(),{
                "layout": {
                    "bindings": {
                        "name": "column-1",
                        "teamGroup": "column-2"
                    }
                }
            });
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Domain(this,"menu-domain-groups"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.DomainGroups(this));
        },

        setupToolbar: function() {
            var self = this;
            self.base();
            self.addButtons([
                {
                "id": "create",
                "title": "New Group",
                    "icon" : Gitana.Utils.Image.buildImageUri('security', 'group-add', 48),
                    "url" : self.LINK().call(this,self.domain(),'add','group'),
                    "requiredAuthorities" : [
                        {
                            "permissioned" : this.contextObject(),
                            "permissions" : ["create_subobjects"]
                        }
                    ]
                },
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
                }
            ]);

            this.toolbar(self.SUBSCRIPTION + "-toolbar",{
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
                    "click": function(groups) {
                        self.onClickDeleteMultiple(self.platform(), groups, "group", self.listLink('groups') , Gitana.Utils.Image.buildImageUri('security', 'group', 20), 'group');
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
                },
                "export": {
                    "title": "Export Group",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-export', 48),
                    "click": function(group) {
                        self.app().run("GET", self.LINK().call(self,group,'export'));
                    },
                    "requiredAuthorities" : {
                        "permissions" : ["read"]
                    }
                }
            });

            list["columns"] = [
                {
                    "title": "Name",
                    "type":"property",
                    "sortingExpression": "name",
                    "property": function(callback) {
                        var id = self.listItemProp(this,'name');
                        var value = "<a href='#" + self.link(this) + "'>" + id + "</a>";
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

            list["loadFunction"] = function(query, pagination, callback) {
                var checks = [];
                var _query = self.query();
                if (Alpaca.isValEmpty(_query)) {
                    _query = {
                        "teamGroup" : {
                            "$ne" : true
                        }
                    }
                }
                Chain(self.contextObject()).trap(function(error) {
                    return self.handlePageError(el, error);
                }).queryGroups(_query,self.pagination(pagination)).each(function() {
                    $.merge(checks, self.prepareListPermissionCheck(this,['update','delete']));
                }).then(function() {
                    var _this = this;
                    this.subchain(self.contextObject()).checkPrincipalPermissions(checks, function(checkResults) {
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
                "title" : "Groups",
                "description" : "Display list of groups of domain " + this.friendlyTitle(this.domain()) + ".",
                "listTitle" : "Group List",
                "listIcon" : Gitana.Utils.Image.buildImageUri('security', 'group', 20),
                "searchBox" : true,
                "subscription" : this.SUBSCRIPTION,
                "filter" : this.FILTER
            };

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.DomainGroups);

})(jQuery);