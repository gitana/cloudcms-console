(function($) {
    Gitana.Console.Pages.Setting = Gitana.CMS.Pages.AbstractListPageGadget.extend(
    {
        SUBSCRIPTION : "application-settings-page",

        FILTER : "settings-setting-list-filters",

        HIDE_FILTER : true,

        setup: function() {
            this.get("/applications/{applicationId}/settings/{settingsId}", this.index);
        },

        targetObject: function() {
            return this.settings();
        },

        contextObject: function() {
            return this.application();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Settings(this));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.Setting(this));
        },

        setupToolbar: function() {
            var self = this;
            self.base();
            self.addButtons([
               {
                "id": "edit",
                "title": "Edit Settings",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'settings-edit', 48),
                    "url" : self.link(this.targetObject(),"edit"),
                    "requiredAuthorities" : [
                        {
                            "permissioned" : this.targetObject(),
                            "permissions" : ["update"]
                        }
                    ]
                },
                {
                "id": "delete",
                "title": "Delete Settings",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'settings-delete', 48),
                    "click": function(setting) {
                        self.onClickDelete(self.targetObject(),'setting',self.listLink('settings'),Gitana.Utils.Image.buildImageUri('objects', 'settings', 20), 'setting');
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
                    "url" : self.link(this.targetObject(),"edit","json"),
                    "requiredAuthorities" : [
                        {
                            "permissioned" : this.targetObject(),
                            "permissions" : ["update"]
                        }
                    ]
                },
                {
                    "id": "export",
                    "title": "Export Settings",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive-export', 48),
                    "url" : self.LINK().call(self, self.targetObject(), 'export'),
                    "requiredAuthorities" : [
                        {
                            "permissioned" : self.targetObject(),
                            "permissions" : ["read"]
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

            list.hideCheckbox = true;

            list["actions"] = self.actionButtons({
            });

            list["columns"] = [
                {
                    "title": "Key",
                    "type":"property",
                    "property": function(callback) {
                        callback(this.getId());
                    }
                },
                {
                    "title": "Value",
                    "type":"property",
                    "property": function(callback) {
                        var value = this.getValue();
                        if (Alpaca.isObject(value)) {
                            callback(JSON.stringify(value,null,' '));
                        } else if (Alpaca.isArray(value)) {
                            callback("[" + value.join(',') + "]");
                        } else {
                            callback(value);
                        }
                    }
                }
            ];

            list["loadFunction"] = function(query, pagination, callback) {
                var settingMap = new Gitana.SettingMap(self.platform().getDriver(),self.targetObject());

                Chain(settingMap).paginate(pagination).then(function() {
                    callback.call(this);
                });
            };

            // store list configuration onto observer
            self.list(this.SUBSCRIPTION,list);
        },

        setupProfile: function () {
            var self = this;
            var setting = self.targetObject();
            var pairs = {
                "title" : "Overview",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'settings', 20),
                "alert" : "",
                "items" : [
                    {
                        "key" : "ID",
                        "value" : self.listItemProp(setting,'_doc')
                    },
                    {
                        "key" : "Key",
                        "value" : self.listItemProp(setting,'key')
                    },
                    {
                        "key" : "Scope",
                        "value" : self.listItemProp(setting,'scope')
                    },
                    {
                        "key" : "Title",
                        "value" : self.listItemProp(setting,'title')
                    },
                    {
                        "key" : "Description",
                        "value" : self.listItemProp(setting,'description')
                    },
                    {
                        "key" : "Last Modified",
                        "value" : setting.getSystemMetadata().getModifiedOn().getTimestamp()
                    }
                ]
            };

            this.pairs("setting-profile-pairs",pairs);
        },

        setupDashlets : function (el, callback)
        {
            this.setupProfile();
            callback();
        },

        setupPage : function(el) {
            var page = {
                "title" : "Settings " + this.friendlyTitle(this.targetObject()),
                "listTitle" : "Setting List",
                "listIcon" : Gitana.Utils.Image.buildImageUri('objects', 'settings', 20),
                "subscription" : this.SUBSCRIPTION,
                "pageToolbar" : true,
                "filter" : this.FILTER,
                "dashlets" :[{
                    "id" : "pairs",
                    "grid" : "grid_12",
                    "gadget" : "pairs",
                    "subscription" : "setting-profile-pairs"
                }]
            };

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.Setting);

})(jQuery);