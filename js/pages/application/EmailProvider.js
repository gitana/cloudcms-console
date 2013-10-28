(function($) {
    Gitana.Console.Pages.EmailProvider = Gitana.CMS.Pages.AbstractListPageGadget.extend(
    {
        SUBSCRIPTION : "application-emailprovider-page",

        FILTER : "emailproviders-list-filters",

        HIDE_FILTER : true,

        setup: function() {
            this.get("/applications/{applicationId}/emailproviders/{emailProviderId}", this.index);
        },

        targetObject: function() {
            return this.emailProvider();
        },

        contextObject: function() {
            return this.application();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.EmailProvider(this));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.EmailProvider(this));
        },

        setupToolbar: function() {
            var self = this;
            self.base();
            self.addButtons([
               {
                "id": "edit",
                "title": "Edit Email Provider",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'emailprovider-edit', 48),
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
                "title": "Delete Email Provider",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'emailprovider-delete', 48),
                    "click": function(emailProvider) {
                        self.onClickDelete(self.targetObject(),'emailprovider',self.listLink('emailprovider'),Gitana.Utils.Image.buildImageUri('objects', 'emailproviders', 20), 'emailprovider');
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
                    "title": "Export Email Provider",
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
                var emailProviderMap = new Gitana.EmailProviderMap(self.platform().getDriver(),self.targetObject());

                Chain(emailProviderMap).paginate(pagination).then(function() {
                    callback.call(this);
                });
            };

            // store list configuration onto observer
            self.list(this.SUBSCRIPTION,list);
        },

        setupProfile: function () {
            var self = this;
            var emailProvider = self.targetObject();
            var pairs = {
                "title" : "Overview",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'emailprovider', 20),
                "alert" : "",
                "items" : [
                    {
                        "key" : "ID",
                        "value" : self.listItemProp(emailProvider,'_doc')
                    },
                    {
                        "key" : "Key",
                        "value" : self.listItemProp(emailProvider,'key')
                    },
                    {
                        "key" : "Scope",
                        "value" : self.listItemProp(emailProvider,'scope')
                    },
                    {
                        "key" : "Title",
                        "value" : self.listItemProp(emailProvider,'title')
                    },
                    {
                        "key" : "Description",
                        "value" : self.listItemProp(emailProvider,'description')
                    },
                    {
                        "key" : "Last Modified",
                        "value" : emailProvider.getSystemMetadata().getModifiedOn().getTimestamp()
                    }
                ]
            };

            this.pairs("emailprovider-profile-pairs",pairs);
        },

        setupDashlets : function (el, callback)
        {
            this.setupProfile();
            callback();
        },

        setupPage : function(el) {
            var page = {
                "title" : "Email Provider " + this.friendlyTitle(this.targetObject()),
                "listTitle" : "Email Provider List",
                "listIcon" : Gitana.Utils.Image.buildImageUri('objects', 'emailproviders', 20),
                "subscription" : this.SUBSCRIPTION,
                "pageToolbar" : true,
                "filter" : this.FILTER,
                "dashlets" :[{
                    "id" : "pairs",
                    "grid" : "grid_12",
                    "gadget" : "pairs",
                    "subscription" : "emailproviders-profile-pairs"
                }]
            };

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.EmailProvider);

})(jQuery);