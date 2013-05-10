(function($) {
    Gitana.Console.Pages.IdentityAdd = Gitana.CMS.Pages.AbstractDatastoreObjectAdd.extend(
        {
            schema: function() {
                return Alpaca.merge({}, Gitana.Console.Schema.Identity);
            },

            options: function() {
                return Alpaca.merge({}, Gitana.Console.Options.Identity);
            },

            targetObject: function() {
                return this.directory();
            },

            setup: function() {
                this.get("/directories/{directoryId}/add/identity", this.index);
            },

            setupMenu: function() {
                this.menu(Gitana.Console.Menu.Directory(this, "menu-directory-identity"));
            },

            setupBreadcrumb: function() {
                return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Directory(this), [
                    {
                        "text" : "New Identity"
                    }
                ]));
            },

            setupAddForm : function (el) {
                var self = this;
                $('#identity-add', $(el)).alpaca({
                    "view": "VIEW_WEB_CREATE",
                    "data": {},
                    "schema": self.schema(),
                    "options": self.options(),
                    "postRender": function(form) {
                        Gitana.Utils.UI.beautifyAlpacaForm(form, 'identity-add-create', true);

                        // Add Buttons
                        $('#identity-add-create', $(el)).click(function() {

                            form.showHiddenMessages();

                            var formVal = form.getValue();
                            if (form.isValid(true)) {

                                Gitana.Utils.UI.block("Creating Identity...");

                                self.targetObject().createIdentity(formVal).then(function() {
                                    var newIdentity = this;
                                    Gitana.Utils.UI.unblock(function() {
                                        self.app().run('GET', self.LINK().call(self, newIdentity));
                                    });
                                });
                            }
                        });
                    }
                });
            },

            setupForms : function (el) {
                this.setupAddForm(el);
            },

            setupPage : function(el) {

                var page = this.buildPage("identity", "Identity");

                this.page(_mergeObject(page, this.base(el)));
            }

        });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.IdentityAdd);

})(jQuery);