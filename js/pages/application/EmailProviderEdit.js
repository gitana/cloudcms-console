(function($) {
    Gitana.Console.Pages.EmailProviderEdit = Gitana.CMS.Pages.AbstractEditFormPageGadget.extend(
    {
        EDIT_URI: [
            "/applications/{applicationId}/emailproviders/{emailProviderId}/edit"
        ],

        EDIT_JSON_URI: [
            "/applications/{applicationId}/emailproviders/{emailProviderId}/edit/json"
        ],

        targetObject: function() {
            return this.emailProvider();
        },

        contextObject: function() {
            return this.application();
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

            var schema = Alpaca.cloneObject(Gitana.Console.Schema.EmailProvider);

            schema = _mergeObject(this.base(),schema);

            return schema;
        },

        options: function() {

            var self = this;

            var options = Alpaca.cloneObject(Gitana.Console.Options.EmailProvider);
            
            options = _mergeObject(this.base(),options);

            return options;
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.EmailProvider(this));
        },

        setupBreadcrumb: function(el) {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.EmailProvider(this), [
                {
                    "text" : this.isEditJSONUri(el) ? 'Edit JSON' : "Edit"
                }
            ]));
        },

        setupEditForm: function (el, callback) {
            var self = this;
            var emailProvider = self.targetObject();

            $('#emailprovider-edit', $(el)).alpaca({
                "data": emailProvider,
                "schema": self.schema(),
                "options": self.options(),
                "postRender": function(form) {
                    Gitana.Utils.UI.beautifyAlpacaForm(form, 'emailprovider-edit-save', true);
                    // Add Buttons
                    $('#emailprovider-edit-save', $(el)).click(function() {
                        var formVal = form.getValue();
                        if (form.isValid(true)) {
                            Gitana.Utils.UI.block("Updating Email Provider ...");

                            if (!formVal.port || formVal.port == "-1") {
                                formVal.port = "";
                            }

                            _mergeObject(emailProvider,formVal);

                            emailProvider.update().then(function() {
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
                "title": "Edit Email Provider",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'emailprovider', 48),
                "url" : this.LINK().call(this,this.targetObject(), 'edit')
            };
        },

        editPageConfig: function() {
            return {
                "id" : "emailprovider-edit",
                "title" : "Edit Email Provider",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'emailprovider', 24),
                "buttons" :[
                    {
                        "id" : "emailprovider-edit-save",
                        "title" : "Save Email Provider",
                        "isLeft" : true
                    }
                ]
            };
        },

        setupPage: function(el) {

            var page = {
                "title" : "Edit Email Provider",
                "description" : "Edit Email Provider " + this.friendlyTitle(this.emailProvider()) + ".",
                "forms" :[]
            };

            this.setupEditPage(el, page);

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.EmailProviderEdit);

})(jQuery);