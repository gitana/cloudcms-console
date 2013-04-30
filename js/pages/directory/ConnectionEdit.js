(function($) {
    Gitana.Console.Pages.ConnectionEdit = Gitana.CMS.Pages.AbstractDatastoreObjectEdit.extend(
    {
        EDIT_URI: [
            "/directories/{directoryId}/connections/{connectionId}/edit"
        ],

        EDIT_JSON_URI: [
            "/directories/{directoryId}/connections/{connectionId}/edit/json"
        ],

        targetObject: function() {
            return this.connection();
        },

        schema: function() {
            return Alpaca.merge({}, Gitana.Console.Schema.Connection);
        },

        options: function() {
            return Alpaca.merge({}, Gitana.Console.Options.Connection);
        },


        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Connection(this));
        },

        setupBreadcrumb: function(el) {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Connection(this), [
                {
                    "text" : this.isEditJSONUri(el) ? 'Edit JSON' : "Edit"
                }
            ]));
        },

        setupEditForm: function (el) {
            var self = this;
            var object = self.targetObject();
            var defaultData = this.populateObject(["title","description"], object);
            $('#connection-edit', $(el)).alpaca({
                "data": defaultData,
                "schema": self.schema(),
                "options": self.options(),
                "postRender": function(form) {
                    Gitana.Utils.UI.beautifyAlpacaForm(form, 'connection-edit-save', true);
                    // Add Buttons
                    $('#connection-edit-save', $(el)).click(function() {
                        var formVal = form.getValue();
                        if (form.isValid(true)) {
                            Gitana.Utils.UI.block("Updating Connection...");
                            Alpaca.mergeObject(object, formVal);
                            object.update().then(function() {
                                Gitana.Utils.UI.unblock(function() {
                                    self.app().run('GET', self.LINK().call(self,self.targetObject()));
                                });
                            });
                        }
                    });
                }
            });
        },

        editButtonConfig: function() {
            return this.buildButtonConfig("connection", "Connection");
        },

        editPageConfig: function() {
            return this.buildPageConfig("connection", "Connection");
        },

        setupPage: function(el) {

            var page = this.buildPage("connection", "Connection");

            this.setupEditPage(el, page);

            this.page(Alpaca.mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.ConnectionEdit);

})(jQuery);