(function($) {
    Gitana.Console.Pages.AuthenticationGrantEdit = Gitana.CMS.Pages.AbstractEditFormPageGadget.extend(
    {
        EDIT_URI: [
            "/authenticationgrants/{authenticationGrantId}/edit"
        ],

        EDIT_JSON_URI: [
            "/authenticationgrants/{authenticationGrantId}/edit/json"
        ],

        targetObject: function() {
            return this.authenticationGrant();
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
            return Alpaca.mergeObject(this.base(),Gitana.Console.Schema.AuthenticationGrant);
        },

        options: function() {
            var self = this;
            var options = Alpaca.mergeObject(this.base(),Gitana.Console.Options.AuthenticationGrant);
            options["fields"]["clientId"]["dataSource"] = function(field, callback) {
                Chain(self.platform()).listClients({
                    "sort": {
                        '_system.modified_on.ms': -1
                    }
                }).each(function(key, val, index) {
                        field.selectOptions.push({
                            "value": this.getKey(),
                            "text": self.friendlyTitle(this)
                        });
                }).then(function() {
                        if (callback) {
                            callback();
                             field.field.val(self.authenticationGrant().getClientId()).change();
                        }
                });
            };

            options["fields"]["gitanaPrincipalUser"]["context"] = this;
            return options;
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.AuthenticationGrant(this));
        },

        setupBreadcrumb: function(el) {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.AuthenticationGrant(this), [
                {
                    "text" : this.isEditJSONUri(el) ? 'Edit JSON' : "Edit"
                }
            ]));
        },

        setupEditForm: function (el) {
            var self = this;
            var authenticationGrant = self.targetObject();
            var defaultData = this.populateObject(["title","description","clientId","principalDomainId","principalId","enabled","allowOpenDriverAuthentication"],authenticationGrant);
            defaultData["gitanaPrincipalUser"] = defaultData["principalDomainId"] + "/" + defaultData["principalId"];
            $('#authentication-grant-edit', $(el)).alpaca({
                "data": defaultData,
                "schema": self.schema(),
                "options": self.options(),
                "postRender": function(form) {
                    Gitana.Utils.UI.beautifyAlpacaForm(form, 'authentication-grant-edit-save', true);
                    // Add Buttons
                    $('#authentication-grant-edit-save', $(el)).click(function() {
                        var formVal = form.getValue();
                        var gitanaPrincipalUser = formVal["gitanaPrincipalUser"];
                        var ids = gitanaPrincipalUser.split("/");
                        formVal['principalDomainId'] = ids[0];
                        formVal['principalId'] = ids[1];

                        delete formVal["gitanaPrincipalUser"];
                        if (form.isValid(true)) {
                            Gitana.Utils.UI.block("Updating Authentication Grant ...");
                            Alpaca.mergeObject(authenticationGrant,formVal);
                            authenticationGrant.update().then(function() {
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
                "title": "Edit AuthenticationGrant",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'authentication-grant-edit', 48),
                "url" : this.LINK().call(this,this.targetObject(), 'edit')
            };
        },

        editPageConfig: function() {
            return {
                "id" : "authentication-grant-edit",
                "title" : "Edit Authentication Grant",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'authentication-grant-edit', 24),
                "buttons" :[
                    {
                        "id" : "authentication-grant-edit-save",
                        "title" : "Save AuthenticationGrant",
                        "isLeft" : true
                    }
                ]
            };
        },

        setupPage: function(el) {

            var page = {
                "title" : "Edit Authentication Grant",
                "description" : "Edit authentication grant " + this.friendlyTitle(this.authenticationGrant()) + ".",
                "forms" :[]
            };

            this.setupEditPage(el, page);

            this.page(Alpaca.mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.AuthenticationGrantEdit);

})(jQuery);