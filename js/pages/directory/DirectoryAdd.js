(function($) {
    Gitana.Console.Pages.DirectoryAdd = Gitana.CMS.Pages.AbstractDatastoreAdd.extend(
    {
        schema: function() {
            return Alpaca.merge(this.base(), Gitana.Console.Schema.Directory);
        },

        options: function() {
            var self = this;

            var options = Alpaca.merge(this.base(), Gitana.Console.Options.Directory);

            return Alpaca.merge(options, {
                "fields" : {
                    "title" : {
                        "helper" : "Enter directory title."
                    },
                    "description" : {
                        "helper" : "Enter directory description."
                    }
                }
            });
        },

        setup: function() {
            this.get("/add/directory", this.index);
        },

        targetObject: function() {
            return this.platform();
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Platform(this, "menu-platform-webhosts"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Webhosts(this), [
                {
                    "text" : "New Web Host"
                }
            ]));
        },

        setupAddForm : function (el) {
            var self = this;
            $('#directory-add', $(el)).alpaca({
                "view": "VIEW_WEB_CREATE",
                "data": {},
                "schema": self.schema(),
                "options": self.options(),
                "postRender": function(form) {
                    Gitana.Utils.UI.beautifyAlpacaForm(form, 'directory-add-create', true);
                    // Add Buttons
                    $('#directory-add-create', $(el)).click(function() {
                        var formVal = form.getValue();
                        if (form.isValid(true)) {

                            Gitana.Utils.UI.block("Creating Directory...");

                            self.targetObject().createDirectory(formVal).then(function() {
                                var newWebhost = this;
                                Gitana.Utils.UI.unblock(function() {
                                    self.app().run('GET', self.LINK().call(self,newWebhost));
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
            this.buildPage(el, "directory", "Directory");
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.DirectoryAdd);

})(jQuery);