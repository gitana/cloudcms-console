(function($) {
    Gitana.Console.Pages.Applications = Gitana.CMS.Pages.AbstractListPageGadget.extend(
    {
        SUBSCRIPTION : "applications",

        FILTER : "application-list-filters",

        FILTER_TOOLBAR: {
            "query" : {
                "title" : Gitana.CMS.Messages.Applications.toolbar.query.title,
                "icon" : Gitana.Utils.Image.buildImageUri('browser', 'query', 48)
            }
        },

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/applications", this.index);
        },

        contextObject: function() {
            return this.platform();
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
            this.menu(Gitana.Console.Menu.Platform(this,"menu-platform-applications"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.Applications(this));
        },

        setupToolbar: function() {
            this.base();
            this.addButtons([
                {
                "id": "create",
                "title": Gitana.CMS.Messages.Applications.toolbar.create.title,
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'application-add', 48),
                    "url" : '/add/application',
                    "requiredAuthorities" : [
                        {
                            "permissioned" : this.contextObject(),
                            "permissions" : ["create_subobjects"]
                        }
                    ]
                },
                {
                    "id": "import",
                    "title": Gitana.CMS.Messages.Applications.toolbar.importarchive.title,
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-import', 48),
                    "url" : this.LINK().call(this, this.contextObject(), 'import','application'),
                    "requiredAuthorities" : [
                        {
                            "permissioned" : this.contextObject(),
                            "permissions" : ["create_subobjects"]
                        }
                    ]
                }
            ]);
        },

        /** Filter Related Methods **/
        filterEmptyData: function() {
            return Alpaca.merge(this.base(),{
                "key" : [""]
            });
        },

        filterFormToJSON: function (formData) {
            var query = this.base(formData);
            if (! Alpaca.isValEmpty(formData)) {
                if (Alpaca.isValEmpty(formData.query)) {
                    if (formData['key']) {
                        query['key'] = formData['key'];
                    }
                }
            }

            return query;
        },

        filterSchema: function () {
            return Alpaca.mergeObject({
                "properties" : {
                    "key" : {
                        "title": "Key",
                        "type" : "string"
                    }
                }
            },this.base());
        },

        filterOptions: function() {

            var options = Alpaca.mergeObject(this.base(), {
                "helper" : "Query applications by key, id, title, description, date range, keyword, type or full query.",
                "fields" : {
                    "key" : {
                        "size": this.DEFAULT_FILTER_TEXT_SIZE,
                        "helper": "Enter regular expression for query by application key."
                    }
                }
            });

            return options;
        },

        filterView: function() {
            return Alpaca.mergeObject(this.base(),{
                "layout": {
                    "bindings": {
                        "key": "column-1",
                        "description" : "column-2"
                    }
                }
            });
        },

        /** OVERRIDE **/
        setupList: function(el) {
            var self = this;

            // define the list
            var list = self.defaultList();

            list["actions"] = self.actionButtons({
                "edit": {
                    "title": "Edit",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'application-edit', 48),
                    "click": function(application){
                        self.app().run("GET", self.link(application,'edit'));
                    },
                    "requiredAuthorities" : {
                        "permissions" : ["update"]
                    }
                },
                "delete": {
                    "title": "Delete",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'application-delete', 48),
                    "click": function(applications) {
                        self.onClickDeleteMultiple(self.platform(), applications , "application", self.listLink('applications') , Gitana.Utils.Image.buildImageUri('objects', 'application', 20), 'application');
                    },
                    "selection" : "multiple",
                    "requiredAuthorities" : {
                        "permissions" : ["delete"]
                    }
                },
                "editJSON": {
                    "title": "Edit JSON",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'json-edit', 48),
                    "click": function(application) {
                       self.app().run("GET", self.link(application,'edit','json'));
                    },
                    "requiredAuthorities" : {
                        "permissions" : ["update"]
                    }
                },
                "export": {
                    "title": "Export",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-export', 48),
                    "click": function(application) {
                        self.app().run("GET", self.LINK().call(self,application,'export'));
                    },
                    "requiredAuthorities" : {
                        "permissions" : ["read"]
                    }
                }
            });

            list["columns"] = [
                {
                    "title": "Title",
                    "type":"property",
                    "sortingExpression": "title",
                    "property": function(callback) {
                        var title = self.friendlyTitle(this);
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

            list["isItemReadonly"] = function(item) {
                return item.get('key') && item.get('key') == 'console';
            };

            list["loadFunction"] = function(query, pagination, callback) {
                var checks = [];
                Chain(self.contextObject()).trap(function(error) {
                    return self.handlePageError(el, error);
                }).queryApplications(self.query(),self.pagination(pagination)).each(function() {
                    $.merge(checks, self.prepareListPermissionCheck(this,['update','delete']));
                }).then(function() {
                    var _this = this;
                    this.subchain(self.contextObject()).checkApplicationPermissions(checks, function(checkResults) {
                        self.updateUserRoles(checkResults);
                        callback.call(_this);
                    });
                });
            };

            // store list configuration onto observer
            self.list(self.SUBSCRIPTION, list);
        },

        setupPage : function(el) {
            var page = {
                "title" : Gitana.CMS.Messages.Applications.title,
                "description" : Gitana.CMS.Messages.Applications.description,
                "listTitle" : Gitana.CMS.Messages.Applications.list.title,
                "listIcon" : Gitana.Utils.Image.buildImageUri('objects', 'application', 20),
                "searchBox" : false,
                "subscription" : this.SUBSCRIPTION,
                "filter" : this.FILTER
            };

            this.page(Alpaca.mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.Applications);

})(jQuery);