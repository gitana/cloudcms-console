(function($) {
    Gitana.Console.Pages.AuthenticationGrantAdd = Gitana.CMS.Pages.AbstractFormPageGadget.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        schema: function() {
            return Alpaca.mergeObject(this.base(),Gitana.Console.Schema.AuthenticationGrant);
        },

        options: function() {
            var self = this;
            var options = Alpaca.mergeObject(this.base(),Gitana.Console.Options.AuthenticationGrant);
            options["fields"]["clientId"]["dataSource"] = function(field, callback) {
                var firstOption;
                Chain(self.platform()).listClients({
                    "sort": {
                        '_system.modified_on.ms': -1
                    }
                }).each(function(key, val, index) {
                        field.selectOptions.push({
                            "value": this.getKey(),
                            "text": self.friendlyTitle(this)
                        });
                        if (!firstOption) {
                            firstOption = this.getKey();
                        }
                }).then(function() {
                        if (callback) {
                            callback();
                            if (firstOption) {
                                field.field.val(firstOption).change();
                            }
                        }
                });
            };

            options["fields"]["gitanaPrincipalUser"]["context"] = this;
            options["fields"]["gitanaPrincipalUser"]["hideInitValidationError"] = true;
            return options;
        },

        setup: function() {
            this.get("/add/authenticationgrant", this.index);
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
            this.menu(Gitana.Console.Menu.Platform(this, "menu-platform-authenticationgrants"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.AuthenticationGrants(this), [
                {
                    "text" : "New Auth Grant"
                }
            ]));
        },

        setupToolbar: function() {
            var self = this;
            self.base();
            self.addButtons([
            ]);
        },

        setupAuthenticationGrantAddForm : function (el) {
            var self = this;

            var schema = this.schema();

            var options = this.options();

            $('#authentication-grant-add',$(el)).alpaca({
                "schema": schema,
                "options": options,
                "postRender": function(form) {

                    Gitana.Utils.UI.beautifyAlpacaForm(form, 'authentication-grant-add-create', true);

                    // Add Buttons
                    $('#authentication-grant-add-create',$(el)).click(function(){
                        var formVal = form.getValue();

                        form.showHiddenMessages();

                        if (form.isValid(true)) {

                            Gitana.Utils.UI.block("Creating authentication grant...");

                            var gitanaPrincipalUser = formVal["gitanaPrincipalUser"];
                            var ids = gitanaPrincipalUser.split("/");
                            formVal['principalDomainId'] = ids[0];
                            formVal['principalId'] = ids[1];

                            delete formVal["gitanaPrincipalUser"];

                            Chain(self.targetObject()).createAuthenticationGrant(formVal).then(function() {
                                var link = self.link(this);
                                var callback = function() {
                                    self.app().run("GET", link);
                                };
                                Gitana.Utils.UI.unblock(callback);
                            });
                        }
                    });
                }
            });
        },

        setupForms : function (el) {
            var self = this;
            this.setupAuthenticationGrantAddForm(el);
        },

        setupPage : function(el) {

            var page = {
                "title" : "New Authentication Grant",
                "description" : "Create a new authentication grant.",
                "forms" :[{
                    "id" : "authentication-grant-add",
                    "title" : "Create A New Authencation Grant",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'authentication-grant-add', 24),
                    "buttons" :[
                        {
                            "id" : "authentication-grant-add-create",
                            "title" : "Create Authentication Grant",
                            "isLeft" : true
                        }
                    ]
                }]
            };

            this.page(Alpaca.mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.AuthenticationGrantAdd);

})(jQuery);