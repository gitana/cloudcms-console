(function($) {
    Gitana.Console.Pages.RegistrarEdit = Gitana.CMS.Pages.AbstractEditFormPageGadget.extend(
    {
        EDIT_URI: [
            "/registrars/{registrarId}/edit"
        ],

        EDIT_JSON_URI: [
            "/registrars/{registrarId}/edit/json"
        ],

        targetObject: function() {
            return this.registrar();
        },

        requiredAuthorities: function() {
            return [
                {
                    "permissioned" : this.targetObject(),
                    "permissions" : ["update"]
                }
            ];
        },

        options: function() {

            return _mergeObject(this.base(), {
                "fields" : {
                    "title" : {
                        "helper" : "Enter registrar title."
                    },
                    "description" : {
                        "helper" : "Enter registrar description."
                    }
                }
            });
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Registrar(this));
        },

        setupBreadcrumb: function(el) {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Registrar(this), [
                {
                    "text" : this.isEditJSONUri(el) ? 'Edit JSON' : "Edit"
                }
            ]));
        },

        setupEditForm: function (el, callback) {
            var self = this;
            var registrar = self.targetObject();
            var defaultData = this.populateObject(["title","description"],registrar);
            $('#registrar-edit', $(el)).alpaca({
                "data": defaultData,
                "schema": self.schema(),
                "options": self.options(),
                "postRender": function(form) {
                    Gitana.Utils.UI.beautifyAlpacaForm(form, 'registrar-edit-save', true);
                    // Add Buttons
                    $('#registrar-edit-save', $(el)).click(function() {
                        var formVal = form.getValue();
                        if (form.isValid(true)) {
                            Gitana.Utils.UI.block("Updating Registrar ...");
                            registrar.replacePropertiesWith(formVal);
                            registrar.update().then(function() {
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
            return  {
                "id": "edit",
                "title": "Edit Registrar",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'registrar-edit', 48),
                "url" : this.LINK().call(this,this.targetObject(), 'edit')
            };
        },

        editPageConfig: function() {
            return {
                "id" : "registrar-edit",
                "title" : "Edit Registrar",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'registrar-edit', 24),
                "buttons" :[
                    {
                        "id" : "registrar-edit-save",
                        "title" : "Save Registrar",
                        "isLeft" : true
                    }
                ]
            };
        },

        setupPage: function(el) {

            var page = {
                "title" : "Edit Registrar",
                "description" : "Edit registrar " + this.friendlyTitle(this.registrar()) + ".",
                "forms" :[]
            };

            this.setupEditPage(el, page);

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.RegistrarEdit);

})(jQuery);