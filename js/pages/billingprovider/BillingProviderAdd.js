(function($) {
    Gitana.Console.Pages.BillingProviderAdd = Gitana.CMS.Pages.AbstractFormPageGadget.extend(
        {
            constructor: function(id, ratchet) {
                this.base(id, ratchet);
            },

            schema: function() {
                return Alpaca.merge(this.base(), Gitana.Console.Schema.BillingProvider);
            },

            options: function() {
                var self = this;

                var options = Alpaca.merge(this.base(), Gitana.Console.Options.BillingProvider);

                return Alpaca.merge(options, {
                    "fields" : {
                        "title" : {
                            "helper" : "Enter billing provider config title."
                        },
                        "description" : {
                            "helper" : "Enter billing provider config description."
                        }
                    }
                });
            },

            setup: function() {
                this.get("/add/billingprovider", this.index);
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
                this.menu(Gitana.Console.Menu.Platform(this, "menu-platform-billing-providers"));
            },

            setupBreadcrumb: function() {
                return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.BillingProviders(this), [
                    {
                        "text" : "New Billing Provider Config"
                    }
                ]));
            },

            setupBillingProviderAddForm : function (el) {
                var self = this;
                $('#billing-provider-add', $(el)).alpaca({
                    "data": {},
                    "schema": self.schema(),
                    "options": self.options(),
                    "postRender": function(form) {
                        Gitana.Utils.UI.beautifyAlpacaForm(form, 'billing-provider-add-create', true);
                        // Add Buttons
                        $('#billing-provider-add-create', $(el)).click(function() {

                            form.showHiddenMessages();

                            var formVal = form.getValue();
                            if (form.isValid(true)) {

                                Gitana.Utils.UI.block("Creating Billing Provider...");

                                var id = formVal['providerId'];
                                delete formVal['providerId'];
                                self.targetObject().trap(function(error) {
                                    return self.handlePageError(el, error);
                                }).createBillingProviderConfiguration(id,formVal).then(function() {
                                    var newBillingProvider = this;
                                    Gitana.Utils.UI.unblock(function() {
                                        self.app().run('GET', self.LINK().call(self, newBillingProvider));
                                    });
                                });
                            }
                        });
                    }
                });
            },

            setupForms : function (el) {
                this.setupBillingProviderAddForm(el);
            },

            setupPage : function(el) {

                var page = {
                    "title" : "New Billing Provider Config",
                    "description" : "Create a new billing provider config.",
                    "forms" :[
                        {
                            "id" : "billing-provider-add",
                            "title" : "Create A New Billing Provider Config",
                            "icon" : Gitana.Utils.Image.buildImageUri('objects', 'billing-provider-add', 24),
                            "buttons" :[
                                {
                                    "id" : "billing-provider-add-create",
                                    "title" : "Create Billing Provider Config",
                                    "isLeft" : true
                                }
                            ]
                        }
                    ]
                };

                this.page(Alpaca.mergeObject(page, this.base(el)));
            }

        });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.BillingProviderAdd);

})(jQuery);