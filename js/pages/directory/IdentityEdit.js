(function($) {
    Gitana.Console.Pages.IdentityEdit = Gitana.CMS.Pages.AbstractDatastoreObjectEdit.extend(
    {
        EDIT_URI: [
            "/directories/{directoryId}/identities/{identityId}/edit"
        ],

        EDIT_JSON_URI: [
            "/directories/{directoryId}/identities/{identityId}/edit/json"
        ],

        targetObject: function() {
            return this.identity();
        },

        schema: function() {
            return Alpaca.merge({}, Gitana.Console.Schema.Identity);
        },

        options: function() {
            return Alpaca.merge({}, Gitana.Console.Options.Identity);
        },


        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Identity(this));
        },

        setupBreadcrumb: function(el) {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Identity(this), [
                {
                    "text" : this.isEditJSONUri(el) ? 'Edit JSON' : "Edit"
                }
            ]));
        },

        setupEditForm: function (el) {
            var self = this;
            var object = self.targetObject();
            var defaultData = this.populateObject(["title","description"], object);
            $('#identity-edit', $(el)).alpaca({
                "data": defaultData,
                "schema": self.schema(),
                "options": self.options(),
                "postRender": function(form) {
                    Gitana.Utils.UI.beautifyAlpacaForm(form, 'identity-edit-save', true);
                    // Add Buttons
                    $('#identity-edit-save', $(el)).click(function() {
                        var formVal = form.getValue();
                        if (form.isValid(true)) {
                            Gitana.Utils.UI.block("Updating Identity...");
                            _mergeObject(object, formVal);
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
            return this.buildButtonConfig("identity", "Identity");
        },

        editPageConfig: function() {
            return this.buildPageConfig("identity", "Identity");
        },

        setupPage: function(el) {

            var page = this.buildPage("identity", "Identity");

            this.setupEditPage(el, page);

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.IdentityEdit);

})(jQuery);