(function($) {
    Gitana.Console.Pages.BillingProviderEdit = Gitana.CMS.Pages.AbstractEditFormPageGadget.extend(
    {
        EDIT_URI: [
            "/billingproviders/{billingProviderId}/edit"
        ],

        EDIT_JSON_URI: [
            "/billingproviders/{billingProviderId}/edit/json"
        ],

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        targetObject: function() {
            return this.billingProvider();
        },

        requiredAuthorities: function() {
            return [
                {
                    "permissioned" : this.targetObject(),
                    "permissions" : ["update"]
                }
            ];
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


        setupMenu: function() {
            this.menu(Gitana.Console.Menu.BillingProvider(this));
        },

        setupBreadcrumb: function(el) {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.BillingProvider(this), [
                {
                    "text" : this.isEditJSONUri(el) ? 'Edit JSON' : "Edit"
                }
            ]));
        },

        setupEditForm: function (el) {
            var self = this;
            var billingProvider = self.targetObject();
            var defaultData = this.populateObject(["title","description","providerId","environment","merchantId","publicKey","privateKey"],billingProvider);
            $('#billing-provider-edit', $(el)).alpaca({
                "data": defaultData,
                "schema": self.schema(),
                "options": self.options(),
                "postRender": function(form) {
                    Gitana.Utils.UI.beautifyAlpacaForm(form, 'billing-provider-edit-save', true);
                    // Add Buttons
                    $('#billing-provider-edit-save', $(el)).click(function() {
                        var formVal = form.getValue();
                        if (form.isValid(true)) {
                            Gitana.Utils.UI.block("Updating Billing Provider ...");
                            billingProvider.replacePropertiesWith(formVal);
                            billingProvider.update().then(function() {
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
            return  {
                "id": "edit",
                "title": "Edit Billing Provider Config",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'billing-provider-edit', 48),
                "url" : this.LINK().call(this,this.targetObject(), 'edit')
            };
        },

        editPageConfig: function() {
            return {
                "id" : "billing-provider-edit",
                "title" : "Edit Billing Provider Config",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'billing-provider-edit', 24),
                "buttons" :[
                    {
                        "id" : "billing-provider-edit-save",
                        "title" : "Save Billing Provider",
                        "isLeft" : true
                    }
                ]
            };
        },

        setupPage: function(el) {

            var page = {
                "title" : "Edit BillingProvider",
                "description" : "Edit billing provider " + this.friendlyTitle(this.billingProvider()) + ".",
                "forms" :[]
            };

            this.setupEditPage(el, page);

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.BillingProviderEdit);

})(jQuery);