(function($) {
    Gitana.Console.Pages.Tenants = Gitana.CMS.Pages.AbstractListPageGadget.extend(
    {
        SUBSCRIPTION : "my-tenants",

        FILTER : "my-tenant-list-filters",

        setup: function() {
            this.get("/dashboard/tenants", this.index);
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
            this.menu(Gitana.Console.Menu.Dashboard(this,"menu-my-tenants"));
        },

        setupBreadcrumb: function() {
            var breadcrumb = [
                {
                    "text" : "My Tenants"
                }
            ];

            this.breadcrumb(breadcrumb);
        },

        setupToolbar: function() {
            this.base();
            this.addButtons([
            ]);
        },

        /** OVERRIDE **/
        setupList: function(el) {
            var self = this;

            // define the list
            var list = self.defaultList();

            list["actions"] = self.actionButtons({
            });

            list["columns"] = [
                {
                    "title": "Title",
                    "type":"property",
                    "sortingExpression": "title",
                    "property": function(callback) {
                        var title = self.friendlyTitle(this);
                        callback(title);
                    }
                },
                {
                    "title": "Plan",
                    "type":"property",
                    "sortingExpression": "planKey",
                    "property": function(callback) {
                        var value = self.listItemProp(this,'planKey');
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
                Chain(self.contextObject()).trap(function(error) {
                    return self.handlePageError(el, error);
                }).readRegistrar("default").queryTenants(self.query(), self.pagination(pagination)).then(function() {
                    callback.call(this);
                });
            };

            // store list configuration onto observer
            self.list(self.SUBSCRIPTION, list);
        },

        setupPage : function(el) {
            var page = {
                "title" : "My Tenants",
                "description" : "Display list of my tenants.",
                "listTitle" : "Tenant List",
                "listIcon" : Gitana.Utils.Image.buildImageUri('objects', 'tenant', 20),
                "searchBox" : true,
                "subscription" : this.SUBSCRIPTION,
                "filter" : this.FILTER
            };

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.Tenants);

})(jQuery);

