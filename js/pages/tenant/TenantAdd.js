(function($) {
    Gitana.Console.Pages.TenantAdd = Gitana.CMS.Pages.AbstractFormPageGadget.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        schema: function() {
            return _mergeObject(this.base(),Gitana.Console.Schema.Tenant);
        },

        options: function() {
            var self = this;
            var options = _mergeObject(this.base(),Gitana.Console.Options.Tenant);

            options['fields']['planKey']['dataSource'] = function(field, callback) {
                var firstOption;
                Chain(self.targetObject()).listPlans().each(
                    function(key, val, index) {
                        var title = this.getTitle() ? this.getTitle() : this.getPlanKey();
                        field.selectOptions.push({
                            "value": this.getPlanKey(),
                            "text": title
                        });
                        if (!firstOption) {
                            firstOption = this.getPlanKey();
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

            options['fields']['target']['validator'] = function(control, callback) {
                var target = control.getValue();

                if (!self.platform) {
                    callback({
                        "message": self.view.getMessage("emptyPlatform"),
                        "status": false
                    });
                    return false;
                }

                    if (Alpaca.isValEmpty(target)) {
                        callback({
                            "status" : true
                        });
                        return true;
                    } else {
                        Chain(self.platform()).trap(function(error) {
                            callback({
                                "message": "Invalid principal id.",
                                "status": false
                            });
                            return false;
                        }).then(function() {
                                var identifiers = this.extractPrincipalIdentifiers(target);
                                var domainId = identifiers['domain'];
                                var principalId = identifiers['principal'];
                                this.readDomain(domainId).readPrincipal(principalId).then(function() {
                                    this.subchain(self.targetObject()).trap(function(error) {
                                        callback({
                                            "message": "Valid principal id.",
                                            "status": true
                                        });
                                        return false;
                                    }).lookupTenantForPrincipal(this).then(function() {
                                            callback({
                                                "message": "This user already has tenant setup.",
                                                "status": false
                                            });
                                        });
                                });
                            });
                    }
            };

            options["fields"]["target"]["context"] = this;
            options["fields"]["target"]["hideInitValidationError"] = true;

            return options;
        },

        setup: function() {
            this.get("/registrars/{registrarId}/add/tenant", this.index);
        },

        targetObject: function() {
            return this.registrar();
        },

        contextObject: function() {
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
            this.menu(Gitana.Console.Menu.Registrar(this, "menu-registrar-tenants"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Tenants(this), [
                {
                    "text" : "New Tenant"
                }
            ]));
        },

        setupTenantAddForm : function (el, callback) {
            var self = this;
            $('#tenant-add', $(el)).alpaca({
                "view": "VIEW_WEB_CREATE",
                "data": {},
                "schema": self.schema(),
                "options": self.options(),
                "postRender": function(form) {
                    Gitana.Utils.UI.beautifyAlpacaForm(form, 'tenant-add-create', true);
                    // Add Buttons
                    $('#tenant-add-create', $(el)).click(function() {
                        form.showHiddenMessages();

                        var formVal = form.getValue();
                        if (form.isValid(true)) {

                            Gitana.Utils.UI.block("Creating Tenant...");

                            var target = formVal['target'];
                            var planKey = formVal['planKey'];
                            var paymentMethod = null;
                            if (formVal['paymentMethod'] && formVal['paymentMethod']['holderName'])
                            {
                                paymentMethod = Alpaca.cloneObject(formVal['paymentMethod']);
                            }

                            delete formVal['target'];
                            delete formVal['planKey'];
                            delete formVal['paymentMethod'];

                            Chain(self.platform()).then(function() {
                                var identifiers = this.extractPrincipalIdentifiers(target);
                                var domainId = identifiers['domain'];
                                var principalId = identifiers['principal'];
                                this.readDomain(domainId).readPrincipal(principalId).then(function() {
                                    this.subchain(self.targetObject()).createTenant(this,planKey,paymentMethod).then(function() {
                                        var newTenant = this;
                                        _mergeObject(newTenant,formVal);
                                        this.update().then(function() {
                                            // Create a customer for the new tenant
                                            var tenantPlatform = this.getPlatform();
                                            /*
                                            this.readDefaultClient().then(function() {
                                                var consumerkey = this.getKey();
                                                //this.object['allowOpenDriverAuthentication'] = true;
                                                //this.update();
                                                // And an authentication grant as well
                                                this.subchain(tenantPlatform).createAuthenticationGrant({
                                                    "consumerKey" : consumerkey,
                                                    "principalDomainId" : domainId,
                                                    "principalId" : principalId,
                                                    "enabled" : true
                                                });
                                            });
                                            */
                                        });

                                        this.then(function() {
                                            Gitana.Utils.UI.unblock(function() {
                                                self.app().run('GET', self.LINK().call(self, newTenant));
                                            });
                                        });

                                    });
                                })
                            });
                        }
                    });

                    callback();
                }
            });
        },

        setupForms : function (el, callback) {
            this.setupTenantAddForm(el, callback);
        },

        setupPage : function(el) {

            var page = {
                "title" : "New Tenant",
                "description" : "Create a new tenant.",
                "listTitle" : "User List",
                "listIcon" : Gitana.Utils.Image.buildImageUri('security', 'user', 20),
                "subscription" : this.SUBSCRIPTION,
                "filter" : this.FILTER,
                "forms" :[{
                    "id" : "tenant-add",
                    "title" : "Create A New Tenant",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'tenant-add', 24),
                    "buttons" :[
                        {
                            "id" : "tenant-add-create",
                            "title" : "Create Tenant",
                            "isLeft" : true
                        }
                    ]
                }]
            };

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.TenantAdd);

})(jQuery);