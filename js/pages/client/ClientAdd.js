(function($) {
    Gitana.Console.Pages.ClientAdd = Gitana.CMS.Pages.AbstractFormPageGadget.extend(
        {
            constructor: function(id, ratchet) {
                this.base(id, ratchet);
            },

            schema: function() {

                return _mergeObject(this.base(), Gitana.Console.Schema.Client);
            },

            options: function() {

                var options = _mergeObject(this.base(), {
                    "fields" : {
                        "title" : {
                            "helper" : "Enter client title."
                        },
                        "description" : {
                            "helper" : "Enter client description."
                        }
                    }
                });

                options = _mergeObject(options, Gitana.Console.Options.Client);
                return options;
            },

            setup: function() {
                this.get("/add/client", this.index);
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
                this.menu(Gitana.Console.Menu.Platform(this, "menu-platform-clients"));
            },

            setupBreadcrumb: function() {
                return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Clients(this), [
                    {
                        "text" : "New Client"
                    }
                ]));
            },

            setupClientAddForm : function (el) {
                var self = this;
                $('#client-add', $(el)).alpaca({
                    "view": "VIEW_WEB_CREATE",
                    "data": {
                        "authorizedGrantTypes" : ["authorization_code","client_credentials","implicit","password","refresh_token"],
                        "scope" : ['api']
                    },
                    "schema": self.schema(),
                    "options": self.options(),
                    "postRender": function(form) {
                        Gitana.Utils.UI.beautifyAlpacaFormWithASMSelect(form , 'client-add-create', true);
                        // Add Buttons
                        $('#client-add-create', $(el)).click(function() {
                            var formVal = form.getValue();
                            if (form.isValid(true)) {

                                Gitana.Utils.UI.block("Creating Client...");

                                self.targetObject().createClient(formVal).then(function() {
                                    var newClient = this;
                                    Gitana.Utils.UI.unblock(function() {
                                        self.app().run('GET', self.LINK().call(self, newClient));
                                    });
                                });
                            }
                        });
                    }
                });
            },

            setupForms : function (el) {
                this.setupClientAddForm(el);
            },

            setupPage : function(el) {

                var page = {
                    "title" : "New Client",
                    "description" : "Create a new client.",
                    "forms" :[
                        {
                            "id" : "client-add",
                            "title" : "Create A New Client",
                            "icon" : Gitana.Utils.Image.buildImageUri('objects', 'client-add', 24),
                            "buttons" :[
                                {
                                    "id" : "client-add-create",
                                    "title" : "Create Client",
                                    "isLeft" : true
                                }
                            ]
                        }
                    ]
                };

                this.page(_mergeObject(page, this.base(el)));
            },

            processForms: function() {
                $('body').bind('swap', function(event, param) {
                    var authorizedGrantTypesSelector = $('#client-add .authorized-grant-types select');

                    authorizedGrantTypesSelector.attr('title', 'Select and Add A Authorized Grant Type');

                    if (!authorizedGrantTypesSelector.parent().hasClass('asmContainer')) {
                        authorizedGrantTypesSelector.asmSelect({
                            sortable: false,
                            removeLabel: "Remove"
                        });
                    }

                    var scopeSelector = $('#client-add .scope select');

                    scopeSelector.attr('title', 'Select and Add A Scope');

                    if (!scopeSelector.parent().hasClass('asmContainer')) {
                        scopeSelector.asmSelect({
                            sortable: false,
                            removeLabel: "Remove"
                        });
                    }
                });
            }

        });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.ClientAdd);

})(jQuery);