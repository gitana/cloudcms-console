(function($) {
    Gitana.Console.Pages.ClientEdit = Gitana.CMS.Pages.AbstractEditFormPageGadget.extend(
    {
        EDIT_URI: [
            "/clients/{clientId}/edit"
        ],

        EDIT_JSON_URI: [
            "/clients/{clientId}/edit/json"
        ],

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        targetObject: function() {
            return this.client();
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
            return Alpaca.mergeObject(this.base(), Gitana.Console.Schema.Client);
        },

        options: function() {

            var options = Alpaca.mergeObject(this.base(), {
                "fields" : {
                    "title" : {
                        "helper" : "Enter client title."
                    },
                    "description" : {
                        "helper" : "Enter client description."
                    }
                }
            });

            options = Alpaca.mergeObject(options, Gitana.Console.Options.Client);
            return options;
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Client(this));
        },

        setupBreadcrumb: function(el) {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Client(this), [
                {
                    "text" : this.isEditJSONUri(el) ? 'Edit JSON' : "Edit"
                }
            ]));
        },

        setupEditForm: function (el) {
            var self = this;
            var client = self.targetObject();
            var defaultData = this.populateObject(["title","description","authorizedGrantTypes","scope","allowOpenDriverAuthentication","domainUrls","enabled"],client);
            $('#client-edit', $(el)).alpaca({
                "data": defaultData,
                "schema": self.schema(),
                "options": self.options(),
                "postRender": function(form) {
                    Gitana.Utils.UI.beautifyAlpacaFormWithASMSelect(form, 'client-edit-save', true);
                    // Add Buttons
                    $('#client-edit-save', $(el)).click(function() {
                        var formVal = form.getValue();
                        if (form.isValid(true)) {
                            Gitana.Utils.UI.block("Updating Client ...");
                            Alpaca.mergeObject(client,formVal);
                            client.update().then(function() {
                                Gitana.Utils.UI.unblock(function() {
                                    self.app().run('GET', self.LINK().call(self,self.targetObject()));
                                });
                            });
                        }
                    });
                    $('#client-edit-reset', $(el)).click(function() {
                        form.setValue(defaultData);
                    });
                }
            });
        },

        processForm: function() {
            $('body').bind('swap', function(event, param) {
                var authorizedGrantTypesSelector = $('#client-edit .authorized-grant-types select');

                authorizedGrantTypesSelector.attr('title', 'Select and Add A Authorized Grant Type');

                if (!authorizedGrantTypesSelector.parent().hasClass('asmContainer')) {
                    authorizedGrantTypesSelector.asmSelect({
                        sortable: false,
                        removeLabel: "Remove"
                    });
                }

                var scopeSelector = $('#client-edit .scope select');

                scopeSelector.attr('title', 'Select and Add A Scope');

                if (!scopeSelector.parent().hasClass('asmContainer')) {
                    scopeSelector.asmSelect({
                        sortable: false,
                        removeLabel: "Remove"
                    });
                }
            });
        },

        editButtonConfig: function() {
            return  {
                "id": "edit",
                "title": "Edit Client",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'client-edit', 48),
                "url" : this.LINK().call(this,this.targetObject(), 'edit')
            };
        },

        editPageConfig: function() {
            return {
                "id" : "client-edit",
                "title" : "Edit Client",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'client-edit', 24),
                "buttons" :[
                    {
                        "id" : "client-edit-reset",
                        "title" : "Reset"
                    },
                    {
                        "id" : "client-edit-save",
                        "title" : "Save Client",
                        "isLeft" : true
                    }
                ]
            };
        },

        setupPage: function(el) {

            var page = {
                "title" : "Edit Client",
                "description" : "Edit client " + this.friendlyTitle(this.client()) + ".",
                "forms" :[]
            };

            this.setupEditPage(el, page);

            this.page(Alpaca.mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.ClientEdit);

})(jQuery);