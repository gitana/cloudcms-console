(function($) {
    Gitana.Console.Pages.TrustedDomainMappingAdd = Gitana.CMS.Pages.AbstractFormPageGadget.extend(
        {
            constructor: function(id, ratchet) {
                this.base(id, ratchet);
            },

            schema: function() {
                return Alpaca.merge({}, Gitana.Console.Schema.TrustedDomainMapping);
            },

            options: function() {
                return Alpaca.merge({}, Gitana.Console.Options.TrustedDomainMapping);
            },

            targetObject: function() {
                return this.webhost();
            },

            requiredAuthorities: function() {
                return [
                    {
                        "permissioned" : this.targetObject(),
                        "permissions" : ["create_subobjects"]
                    }
                ];
            },

            setup: function() {
                this.get("/webhosts/{webhostId}/add/trusteddomainmapping", this.index);
            },

            setupMenu: function() {
                this.menu(Gitana.Console.Menu.Webhost(this, "menu-webhost-trusted-domain-mappings"));
            },

            setupBreadcrumb: function() {
                return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.TrustedDomainMappings(this), [
                    {
                        "text" : "New Trusted Domain Mapping"
                    }
                ]));
            },

            setupTrustedDomainMappingAddForm : function (el) {
                var self = this;
                $('#trusted-domain-mapping-add', $(el)).alpaca({
                    "data": {},
                    "schema": self.schema(),
                    "options": self.options(),
                    "postRender": function(form) {
                        Gitana.Utils.UI.beautifyAlpacaForm(form, 'trusted-domain-mapping-add-create', true);

                        // Add Buttons
                        $('#trusted-domain-mapping-add-create', $(el)).click(function() {

                            form.showHiddenMessages();

                            var formVal = form.getValue();
                            if (form.isValid(true)) {

                                var host = formVal['host'];
                                var scope = formVal['scope'];
                                var platformId = formVal['platformId'];

                                delete formVal['host'];
                                delete formVal['scope'];
                                delete formVal['platformId'];

                                Gitana.Utils.UI.block("Creating Trusted Domain Mapping...");

                                self.targetObject().createTrustedDomainMapping(host, scope, platformId, formVal).then(function() {
                                    var newTrustedDomainMapping = this;
                                    Gitana.Utils.UI.unblock(function() {
                                        self.app().run('GET', self.LINK().call(self, newTrustedDomainMapping));
                                    });
                                });
                            }
                        });
                    }
                });
            },

            setupForms : function (el) {
                this.setupTrustedDomainMappingAddForm(el);
            },

            setupPage : function(el) {

                var page = {
                    "title" : "New Trusted Domain Mapping",
                    "description" : "Create a new trusted domain mapping on webhost " + this.friendlyTitle(this.targetObject()) + ".",
                    "forms" :[
                        {
                            "id" : "trusted-domain-mapping-add",
                            "title" : "Create A New Trusted Domain Mapping",
                            "icon" : Gitana.Utils.Image.buildImageUri('objects', 'trusted-domain-mapping-add', 24),
                            "buttons" :[
                                {
                                    "id" : "trusted-domain-mapping-add-create",
                                    "title" : "Create Trusted Domain Mapping",
                                    "isLeft" : true
                                }
                            ]
                        }
                    ]
                };

                this.page(_mergeObject(page, this.base(el)));
            }

        });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.TrustedDomainMappingAdd);

})(jQuery);