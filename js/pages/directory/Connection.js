(function($) {
    Gitana.Console.Pages.Connection = Gitana.CMS.Pages.AbstractDatastoreObject.extend({

        setup: function() {
            this.get("/directories/{directoryId}/connections/{connectionId}", this.index);
        },

        targetObject: function() {
            return this.connection();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Connection(this));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.Connection(this));
        },

        setupToolbar: function() {
            this.base();

            var buttons = this.buildButtons("connection", "connections", "Connection");

            this.addButtons(buttons);
        },

        setupOverview: function () {
            var self = this;
            var object = self.targetObject();

            var pairs = {
                "title" : "Overview",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'connection', 20),
                "alert" : "",
                "items" : []
            };
            this._pushItem(pairs.items, {
                "key" : "ID",
                "value" : self.listItemProp(object, '_doc')
            });
            this._pushItem(pairs.items, {
                "key" : "Title",
                "value" : self.listItemProp(object, 'title')
            });
            this._pushItem(pairs.items, {
                "key" : "Description",
                "value" : self.listItemProp(object, 'description')
            });

            this.pairs("connection-overview", pairs);
        },

        setupDashlets: function(el, callback)
        {
            this.setupOverview();

            callback();
        },

        setupPage : function(el) {

            var page = this.buildPage("connection", "Connection", "connection-overview");

            this.page(_mergeObject(page, this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.Connection);

})(jQuery);

