(function($) {
    Gitana.Console.Pages.RegistrarAdd = Gitana.CMS.Pages.AbstractFormPageGadget.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
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

        setup: function() {
            this.get("/add/registrar", this.index);
        },

        targetObject: function() {
            return this.platform();
        },

        requiredAuthorities: function() {
            return [
                {
                    "permissioned" : this.targetObject(),
                    "permissions" : ["create_subobjects"]
                }
            ];
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Platform(this, "menu-platform-registrars"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Registrars(this), [
                {
                    "text" : "New Registrar"
                }
            ]));
        },

        setupRegistrarAddForm : function (el) {
            var self = this;
            $('#registrar-add', $(el)).alpaca({
                "view": "VIEW_WEB_CREATE",
                "data": {},
                "schema": self.schema(),
                "options": self.options(),
                "postRender": function(form) {
                    Gitana.Utils.UI.beautifyAlpacaForm(form, 'registrar-add-create', true);
                    // Add Buttons
                    $('#registrar-add-create', $(el)).click(function() {
                        var formVal = form.getValue();
                        if (form.isValid(true)) {

                            Gitana.Utils.UI.block("Creating Registrar...");

                            self.targetObject().createRegistrar(formVal).then(function() {
                                var newRegistrar = this;
                                Gitana.Utils.UI.unblock(function() {
                                    self.app().run('GET', self.LINK().call(self,newRegistrar));
                                });
                            });
                        }
                    });
                }
            });
        },

        setupForms : function (el) {
            this.setupRegistrarAddForm(el);
        },

        setupPage : function(el) {

            var page = {
                "title" : "New Registrar",
                "description" : "Create a new registrar.",
                "forms" :[{
                    "id" : "registrar-add",
                    "title" : "Create A New Registrar",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'registrar-add', 24),
                    "buttons" :[
                        {
                            "id" : "registrar-add-create",
                            "title" : "Create Registrar",
                            "isLeft" : true
                        }
                    ]
                }]
            };

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.RegistrarAdd);

})(jQuery);