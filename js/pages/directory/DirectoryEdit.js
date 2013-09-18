(function($) {
    Gitana.Console.Pages.DirectoryEdit = Gitana.CMS.Pages.AbstractDatastoreEdit.extend(
    {
        EDIT_URI: [
            "/directories/{directoryId}/edit"
        ],

        EDIT_JSON_URI: [
            "/directories/{directoryId}/edit/json"
        ],

        targetObject: function() {
            return this.directory();
        },

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

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Directory(this));
        },

        setupBreadcrumb: function(el) {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Directory(this), [
                {
                    "text" : this.isEditJSONUri(el) ? 'Edit JSON' : "Edit"
                }
            ]));
        },

        setupEditForm: function (el, callback) {
            var self = this;
            var directory = self.targetObject();
            var defaultData = this.populateObject(["title","description"], directory);
            $('#directory-edit', $(el)).alpaca({
                "data": defaultData,
                "schema": self.schema(),
                "options": self.options(),
                "postRender": function(form) {
                    Gitana.Utils.UI.beautifyAlpacaForm(form, 'directory-edit-save', true);
                    // Add Buttons
                    $('#directory-edit-save', $(el)).click(function() {
                        var formVal = form.getValue();
                        if (form.isValid(true)) {
                            Gitana.Utils.UI.block("Updating Directory...");
                            directory.replacePropertiesWith(formVal);
                            directory.update().then(function() {
                                Gitana.Utils.UI.unblock(function() {
                                    self.app().run('GET', self.LINK().call(self,self.targetObject()));
                                });
                            });
                        }
                    });

                    callback();
                }
            });
        },

        editButtonConfig: function() {
            return this.buildButtonConfig("directory", "Directory");
        },

        editPageConfig: function() {
            return this.buildPageConfig("directory", "Directory");
        },

        setupPage: function(el) {
            this.buildPage(el, "directory", "Directory");
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.DirectoryEdit);

})(jQuery);