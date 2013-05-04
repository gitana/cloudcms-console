(function($) {
    Gitana.Console.Pages.Identity = Gitana.CMS.Pages.AbstractDatastoreObject.extend({

        setup: function() {
            this.get("/directories/{directoryId}/identities/{identityId}", this.index);
        },

        targetObject: function() {
            return this.identity();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Identity(this));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.Identity(this));
        },

        setupToolbar: function() {
            this.base();

            var buttons = this.buildButtons("identity", "identities", "Identity");

            // remove the first two (edit and delete)
            buttons = buttons.slice(1);
            buttons = buttons.slice(1);
            // remove export
            buttons = buttons.slice(0, buttons.length);

            this.addButtons(buttons);
        },

        setupOverview: function () {
            var self = this;
            var object = self.targetObject();

            var pairs = {
                "title" : "Overview",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'identity', 20),
                "alert" : "",
                "items" : [
                    {
                        "key" : "ID",
                        "value" : self.listItemProp(object, '_doc')
                    },
                    {
                        "key" : "Title",
                        "value" : self.listItemProp(object, 'title')
                    },
                    {
                        "key" : "Description",
                        "value" : self.listItemProp(object, 'description')
                    }
                ]
            };

            this.pairs("identity-overview", pairs);
        },

        setupDashlets : function ()
        {
            this.setupOverview();
        },

        setupPage : function(el) {

            var page = this.buildPage("identity", "Identity", "identity-overview");

            this.page(_mergeObject(page, this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.Identity);

})(jQuery);

