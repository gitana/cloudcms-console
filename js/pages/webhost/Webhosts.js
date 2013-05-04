(function($) {
    Gitana.Console.Pages.Webhosts = Gitana.CMS.Pages.AbstractListPageGadget.extend(
    {
        SUBSCRIPTION : "webhosts",

        FILTER : "webhost-list-filters",

        FILTER_TOOLBAR: {
            "query" : {
                "title" : Gitana.CMS.Messages.WebHosts.toolbar.query.title,
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'query', 48)
            }
        },

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/webhosts", this.index);
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
            this.menu(Gitana.Console.Menu.Platform(this,"menu-platform-webhosts"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.Webhosts(this));
        },

        setupToolbar: function() {
            this.base();
            this.addButtons([
                {
                "id": "create",
                "title": Gitana.CMS.Messages.WebHosts.toolbar.create.title,
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'webhost-add', 48),
                    "url" : '/add/webhost',
                    "requiredAuthorities" : [
                        {
                            "permissioned" : this.contextObject(),
                            "permissions" : ["create_subobjects"]
                        }
                    ]
                },
                {
                    "id": "import",
                    "title": Gitana.CMS.Messages.WebHosts.toolbar.importarchive.title,
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-import', 48),
                    "url" : this.LINK().call(this, this.contextObject(), 'import', 'webhost'),
                    "requiredAuthorities" : [
                        {
                            "permissioned" : this.contextObject(),
                            "permissions" : ["create_subobjects"]
                        }
                    ]
                }
            ]);
        },

        /** OVERRIDE **/
        setupList: function(el) {
            var self = this;

            // define the list
            var list = self.defaultList();

            list["actions"] = self.actionButtons({
                "edit": {
                    "title": "Edit Web Host",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'webhost-edit', 48),
                    "click": function(webhost){
                        self.app().run("GET", self.link(webhost,'edit'));
                    },
                    "requiredAuthorities" : {
                        "permissions" : ["update"]
                    }
                },
                "delete": {
                    "title": "Delete Web Hosts",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'webhost-delete', 48),
                    "click": function(webhosts) {
                        self.onClickDeleteMultiple(self.platform(), webhosts , "web host", self.listLink('webhosts') , Gitana.Utils.Image.buildImageUri('objects', 'webhost', 20), 'webhost');
                    },
                    "selection" : "multiple",
                    "requiredAuthorities" : {
                        "permissions" : ["delete"]
                    }
                },
                "editJSON": {
                    "title": "Edit JSON",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'json-edit', 48),
                    "click": function(webhost) {
                       self.app().run("GET", self.link(webhost,'edit','json'));
                    },
                    "requiredAuthorities" : {
                        "permissions" : ["update"]
                    }
                },
                "export": {
                    "title": "Export Web Host",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-export', 48),
                    "click": function(webhost) {
                        self.app().run("GET", self.LINK().call(self,webhost,'export'));
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
                return item.getId() == 'default';
            };

            list["loadFunction"] = function(query, pagination, callback) {
                var checks = [];
                self.contextObject().trap(function(error) {
                    return self.handlePageError(el, error);
                }).queryWebHosts(self.query(),self.pagination(pagination)).each(function() {
                    $.merge(checks, self.prepareListPermissionCheck(this,['update','delete']));
                }).then(function() {
                    var _this = this;
                    this.subchain(self.platform()).checkWebHostPermissions(checks, function(checkResults) {
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
                "title" : Gitana.CMS.Messages.WebHosts.title,
                "description" : Gitana.CMS.Messages.WebHosts.description,
                "listTitle" : Gitana.CMS.Messages.WebHosts.list.title,
                "listIcon" : Gitana.Utils.Image.buildImageUri('objects', 'webhost', 20),
                "searchBox" : false,
                "subscription" : this.SUBSCRIPTION,
                "filter" : this.FILTER
            };

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.Webhosts);

})(jQuery);