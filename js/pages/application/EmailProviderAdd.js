(function($) {
    Gitana.Console.Pages.EmailProviderAdd = Gitana.CMS.Pages.AbstractFormPageGadget.extend(
    {
        schema: function()
        {
            var schema = Alpaca.cloneObject(Gitana.Console.Schema.EmailProvider);
            return _mergeObject(this.base(), schema);
        },

        options: function()
        {
            var options = Alpaca.cloneObject(Gitana.Console.Options.EmailProvider);
            return _mergeObject(this.base(), options);
        },

        setup: function() {
            this.get("/applications/{applicationId}/add/emailprovider", this.index);
        },

        targetObject: function() {
            return this.application();
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
            this.menu(Gitana.Console.Menu.Application(this, "menu-application-emailprovider"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Application(this), [
                {
                    "text" : "New Email Provider"
                }
            ]));
        },

        setupAddForm: function (el, callback) {
            var self = this;
            $('#emailprovider-add', $(el)).alpaca({
                "view": "VIEW_WEB_CREATE",
                "data": {},
                "schema": self.schema(),
                "options": self.options(),
                "postRender": function(form) {
                    Gitana.Utils.UI.beautifyAlpacaForm(form, 'emailprovider-add-create', true);
                    // Add Buttons
                    $('#emailprovider-add-create', $(el)).click(function() {

                        form.showHiddenMessages();

                        if (form.isValid(true)) {

                            var formVal = form.getValue();
                            if (!formVal.port || formVal.port == "-1") {
                                formVal.port = "";
                            }

                            Gitana.Utils.UI.block("Creating Email Provider...");

                            self.targetObject().createEmailProvider(formVal).then(function() {
                                var newEmailProvider = this;
                                Gitana.Utils.UI.unblock(function() {
                                    self.app().run('GET', self.LINK().call(self,newEmailProvider));
                                });
                            });
                        }
                    });

                    callback();
                }
            });
        },

        setupForms : function (el, callback) {
            this.setupAddForm(el, callback);
        },

        setupPage : function(el) {

            var page = {
                "title" : "New Email Provider",
                "description" : "Create a new email provider.",
                "forms" :[{
                    "id" : "emailprovider-add",
                    "title" : "Create A New Email Provider",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'emailprovider', 24),
                    "buttons" :[
                        {
                            "id" : "emailprovider-add-create",
                            "title" : "Create Email Provider",
                            "isLeft" : true
                        }
                    ]
                }]
            };

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.EmailProviderAdd);

})(jQuery);