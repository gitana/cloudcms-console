(function($) {
    Gitana.Console.Pages.TrustedDomainMappingEdit = Gitana.CMS.Pages.AbstractEditFormPageGadget.extend(
    {
        EDIT_URI: [
            "/webhosts/{webhostId}/trusteddomainmappings/{trustedDomainMappingId}/edit"
        ],

        EDIT_JSON_URI: [
            "/webhosts/{webhostId}/trusteddomainmappings/{trustedDomainMappingId}/edit/json"
        ],

        targetObject: function() {
            return this.trustedDomainMapping();
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
            return Alpaca.merge({}, Gitana.Console.Schema.TrustedDomainMapping);
        },

        options: function() {
            return Alpaca.merge({}, Gitana.Console.Options.TrustedDomainMapping);
        },


        setupMenu: function() {
            this.menu(Gitana.Console.Menu.TrustedDomainMapping(this));
        },

        setupBreadcrumb: function(el) {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.TrustedDomainMapping(this), [
                {
                    "text" : this.isEditJSONUri(el) ? 'Edit JSON' : "Edit"
                }
            ]));
        },

        setupEditForm: function (el, callback) {
            var self = this;
            var trustedDomainMapping = self.targetObject();
            var defaultData = this.populateObject(["title","description","host","scope","platformId"], trustedDomainMapping);
            $('#trusted-domain-mapping-edit', $(el)).alpaca({
                "data": defaultData,
                "schema": self.schema(),
                "options": self.options(),
                "postRender": function(form) {
                    Gitana.Utils.UI.beautifyAlpacaForm(form, 'trusted-domain-mapping-edit-save', true);
                    // Add Buttons
                    $('#trusted-domain-mapping-edit-save', $(el)).click(function() {
                        var formVal = form.getValue();
                        if (form.isValid(true)) {
                            Gitana.Utils.UI.block("Updating Trusted Domain Mapping ...");
                            _mergeObject(trustedDomainMapping,formVal);
                            trustedDomainMapping.update().then(function() {
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
                "title": "Edit Trusted Domain Mapping",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'trusted-domain-mapping-edit', 48),
                "url" : this.LINK().call(this,this.targetObject(), 'edit')
            };
        },

        editPageConfig: function() {
            return {
                "id" : "trusted-domain-mapping-edit",
                "title" : "Edit Trusted Domain Mapping",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'trusted-domain-mapping-edit', 24),
                "buttons" :[
                    {
                        "id" : "trusted-domain-mapping-edit-save",
                        "title" : "Save Trusted Domain Mapping",
                        "isLeft" : true
                    }
                ]
            };
        },

        setupPage: function(el) {

            var page = {
                "title" : "Edit Trusted Domain Mapping",
                "description" : "Edit Trusted Domain Mapping " + this.friendlyTitle(this.webhost()) + ".",
                "forms" :[]
            };

            this.setupEditPage(el, page);

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.TrustedDomainMappingEdit);

})(jQuery);