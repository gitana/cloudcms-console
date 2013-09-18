(function($) {
    Gitana.Console.Pages.Directory = Gitana.CMS.Pages.AbstractDatastore.extend({

        setup: function() {
            this.get("/directories/{directoryId}", this.index);
        },

        targetObject: function() {
            return this.directory();
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
            this.menu(Gitana.Console.Menu.Directory(this));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.Directory(this));
        },

        setupToolbar: function() {
            this.base();
            this.buildToolbar("directory", "directories", "Directory");
        },

        setupOverview: function () {
            var self = this;
            var datastore = self.targetObject();

            var pairs = {
                "title" : "Overview",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'directory', 20),
                "alert" : "",
                "items" : []
            };
            this._pushItem(pairs.items, {
                "key" : "ID",
                "value" : self.listItemProp(datastore, '_doc')
            });
            this._pushItem(pairs.items, {
                "key" : "Title",
                "value" : self.listItemProp(datastore, 'title')
            });
            this._pushItem(pairs.items, {
                "key" : "Description",
                "value" : self.listItemProp(datastore, 'description')
            });

            this.pairs("directory-overview", pairs);
        },

        setupDashlets : function (el, callback) {
            this.setupOverview();

            callback();
        },

        setupPage : function(el) {
            this.buildPage(el, "directory", "Directory", "directory-overview");
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.Directory);

})(jQuery);

