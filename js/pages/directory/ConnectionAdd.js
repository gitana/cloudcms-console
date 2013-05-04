(function($) {
    Gitana.Console.Pages.ConnectionAdd = Gitana.CMS.Pages.AbstractDatastoreObjectAdd.extend(
        {
            schema: function() {
                return Alpaca.merge({}, Gitana.Console.Schema.Connection);
            },

            options: function() {
                return Alpaca.merge({}, Gitana.Console.Options.Connection);
            },

            targetObject: function() {
                return this.directory();
            },

            setup: function() {
                this.get("/directories/{directoryId}/add/connection", this.index);
            },

            setupMenu: function() {
                this.menu(Gitana.Console.Menu.Directory(this, "menu-directory-connection"));
            },

            setupBreadcrumb: function() {
                return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Directory(this), [
                    {
                        "text" : "New Connection"
                    }
                ]));
            },

            setupAddForm : function (el) {
                var self = this;
                $('#connection-add', $(el)).alpaca({
                    "data": {},
                    "schema": self.schema(),
                    "options": self.options(),
                    "postRender": function(form) {
                        Gitana.Utils.UI.beautifyAlpacaForm(form, 'connection-add-create', true);

                        // Add Buttons
                        $('#connection-add-create', $(el)).click(function() {

                            form.showHiddenMessages();

                            var formVal = form.getValue();
                            if (form.isValid(true)) {

                                /*

                                Gitana.Utils.UI.block("Creating Connection...");

                                self.targetObject().createConnection(formVal).then(function() {
                                    var newConnection = this;
                                    Gitana.Utils.UI.unblock(function() {
                                        self.app().run('GET', self.LINK().call(self, newConnection));
                                    });
                                });
                                */

                                // redirect to gitana
                                //window.location.href = "/proxy/signin/" + formVal["providerId"];

                                var returnUrl = "http://demo.cloudcms.net/console";
                                var url = "/proxy/signin/" + formVal["providerId"];
                                var html = "<form action='" + url + "' method='POST'>";
                                //html += "<input type='text' name='return_url' value='" + returnUrl + "' />";
                                html += "</form>";
                                var f = $(html);
                                $(document.body).append(f);
                                $(f).submit();

                            }
                        });
                    }
                });
            },

            setupForms : function (el) {
                this.setupAddForm(el);
            },

            setupPage : function(el) {

                var page = this.buildPage("connection", "Connection");

                this.page(_mergeObject(page, this.base(el)));
            }

        });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.ConnectionAdd);

})(jQuery);