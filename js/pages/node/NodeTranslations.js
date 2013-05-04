(function($) {
    Gitana.Console.Pages.NodeTranslations = Gitana.CMS.Pages.AbstractListPageGadget.extend(
    {
        SUBSCRIPTION : "translations",

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/repositories/{repositoryId}/branches/{branchId}/nodes/{nodeId}/translations", this.index);
        },

        targetObject: function() {
            return this.node();
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
            this.menu(Gitana.Console.Menu.Node(this,"menu-translations"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.Translations(this));
        },

        setupToolbar: function() {
            var self = this;
            self.base();
            self.addButtons([
                {
                    "id": "create",
                    "title": "New Translation",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'translation-add', 48),
                    "url" : this.LINK().call(this, this.node(), 'add', 'translation'),
                    "requiredAuthorities" : [
                        {
                            "permissioned" : self.branch(),
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
                    "title": "Edit Translation",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'translation-edit', 48),
                    "click": function(node){
                        self.app().run("GET", this.LINK().call(this,node,'edit'));
                    },
                    "requiredAuthorities" : {
                        "permissions" : ["update"]
                    }
                },
                "delete": {
                    "title": "Delete Translations",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'translation-delete', 48),
                    "click": function(node) {
                        self.onClickDelete(node,'translation', self.listLink('translations'), Gitana.Utils.Image.buildImageUri('objects', 'translation', 20), 'translations',function(obj) {
                            var title = obj.get('locale') ? obj.get('locale') : "";
                            var localeIndex = $.inArray(title, Gitana.Console.Schema.Locale['enum']);
                            if (localeIndex != -1) {
                                title = Gitana.Console.Options.Locale.optionLabels[localeIndex];
                            }
                            var edition = obj.get('edition') ? obj.get('edition') : "";
                            return "Translation of Locale " + title + " and Edition " + edition;
                        });
                    },
                    "requiredAuthorities" : {
                        "permissions" : ["delete"]
                    }
                },
                "editJSON": {
                    "title": "Edit JSON",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'json-edit', 48),
                    "click": function(node) {
                        self.app().run("GET", self.LINK().call(self,node,'edit','json'));
                    },
                    "requiredAuthorities" : {
                        "permissions" : ["update"]
                    }
                }
            });

            list["columns"] = [
                {
                    "title": "Locale",
                    "type":"property",
                    "sortingExpression": "locale",
                    "property": function(callback) {
                        var title = this.get('locale') ? this.get('locale') : "";
                        var localeIndex = $.inArray(title,Gitana.Console.Schema.Locale['enum']);
                        if (localeIndex != -1) {
                            title = Gitana.Console.Options.Locale.optionLabels[localeIndex];
                        }
                        var otherNodeId = this.getOtherNodeId(self.node());
                        var value = "<a href='#" + self.LIST_LINK().call(self,"nodes") + otherNodeId + "' title='" + otherNodeId + "'>" + title + "</a>";
                        callback(value);
                    }
                },
                {
                    "title": "Edition",
                    "type":"property",
                    "sortingExpression": "edition",
                    "property": function(callback) {
                        var title = this.get('edition') ? this.get('edition') : "";
                        callback(title);
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
                self.node().trap(function(error) {
                    return self.handlePageError(el, error);
                }).associations({
                    "type" : "a:has_translation",
                    "direction" : "OUTGOING"
                },self.pagination(pagination)).each(function() {
                    $.merge(checks, self.prepareListPermissionCheck(this,['update','delete']));
                }).then(function() {
                    var _this = this;
                    this.subchain(self.branch()).checkNodePermissions(checks, function(checkResults) {
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
                "title" : "Node Translations",
                "description" : "Display list of translations for node " + this.friendlyTitle(this.targetObject()) + ".",
                "listTitle" : "Translation List",
                "listIcon" : Gitana.Utils.Image.buildImageUri('objects', 'translation', 20),
                "subscription" : this.SUBSCRIPTION
            };

            this.page(_mergeObject(page,this.base(el)));
        }
    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.NodeTranslations);

})(jQuery);