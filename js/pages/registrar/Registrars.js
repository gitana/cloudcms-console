(function($) {
    Gitana.Console.Pages.Registrars = Gitana.CMS.Pages.AbstractListPageGadget.extend(
    {
        SUBSCRIPTION : "registrars",

        FILTER : "registrar-list-filters",

        FILTER_TOOLBAR: {
            "query" : {
                "title" : Gitana.CMS.Messages.Registrars.toolbar.query.title,
                "icon" : Gitana.Utils.Image.buildImageUri('browser', 'query', 48)
            }
        },

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/registrars", this.index);
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
            this.menu(Gitana.Console.Menu.Platform(this,"menu-platform-registrars"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.Registrars(this));
        },

        setupToolbar: function() {
            this.base();
            this.addButtons([
                {
                "id": "create",
                "title": Gitana.CMS.Messages.Registrars.toolbar.create.title,
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'registrar-add', 48),
                    "url" : '/add/registrar',
                    "requiredAuthorities" : [
                        {
                            "permissioned" : this.contextObject(),
                            "permissions" : ["create_subobjects"]
                        }
                    ]
                },
                {
                    "id": "import",
                    "title": Gitana.CMS.Messages.Registrars.toolbar.importarchive.title,
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-import', 48),
                    "url" : this.LINK().call(this, this.contextObject(), 'import','registrar'),
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
                    "title": "Edit Registrar",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'registrar-edit', 48),
                    "click": function(registrar){
                        self.app().run("GET", self.link(registrar,'edit'));
                    },
                    "requiredAuthorities" : {
                        "permissions" : ["update"]
                    }
                },
                "delete": {
                    "title": "Delete Registrars",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'registrar-delete', 48),
                    "click": function(registrars) {
                        self.onClickDeleteMultiple(self.platform(), registrars , "registrar", self.listLink('registrars') , Gitana.Utils.Image.buildImageUri('objects', 'registrar', 20), 'registrar');
                    },
                    "selection" : "multiple",
                    "requiredAuthorities" : {
                        "permissions" : ["delete"]
                    }
                },
                "editJSON": {
                    "title": "Edit JSON",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'json-edit', 48),
                    "click": function(registrar) {
                       self.app().run("GET", self.link(registrar,'edit','json'));
                    },
                    "requiredAuthorities" : {
                        "permissions" : ["update"]
                    }
                },
                "export": {
                    "title": "Export Registrar",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-export', 48),
                    "click": function(registrar) {
                        self.app().run("GET", self.LINK().call(self,registrar,'export'));
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
                Chain(self.contextObject()).trap(function(error) {
                    return self.handlePageError(el, error);
                }).queryRegistrars(self.query(),self.pagination(pagination)).each(function() {
                    $.merge(checks, self.prepareListPermissionCheck(this,['update','delete']));
                }).then(function() {
                    var _this = this;
                    this.subchain(self.contextObject()).checkRegistrarPermissions(checks, function(checkResults) {
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
                "title" : Gitana.CMS.Messages.Registrars.title,
                "description" : Gitana.CMS.Messages.Registrars.description,
                "listTitle" : Gitana.CMS.Messages.Registrars.list.title,
                "listIcon" : Gitana.Utils.Image.buildImageUri('objects', 'registrar', 20),
                "searchBox" : false,
                "subscription" : this.SUBSCRIPTION,
                "filter" : this.FILTER
            };

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.Registrars);

})(jQuery);