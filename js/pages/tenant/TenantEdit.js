(function($) {
    Gitana.Console.Pages.TenantEdit = Gitana.CMS.Pages.AbstractEditFormPageGadget.extend(
    {
        EDIT_URI: [
            "/registrars/{registrarId}/tenants/{tenantId}/edit"
        ],

        EDIT_JSON_URI: [
            "/registrars/{registrarId}/tenants/{tenantId}/edit/json"
        ],

        targetObject: function() {
            return this.tenant();
        },

        contextObject: function() {
            return this.registrar();
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
            return _mergeObject(this.base(),Gitana.Console.Schema.Tenant);
        },

        options: function() {
            var self = this;
            var options = _mergeObject(this.base(),Gitana.Console.Options.Tenant);

            options['fields']['planKey']['dataSource'] = function(field, callback) {
                Chain(self.contextObject()).listPlans().each(
                    function(key, val, index) {
                        var title = this.getTitle() ? this.getTitle() : this.getPlanKey();
                        field.selectOptions.push({
                            "value": this.getPlanKey(),
                            "text": title
                        });
                    }).then(function() {
                        if (callback) {
                            callback();
                            field.field.val(self.tenant().getPlanKey()).change();
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
                                "message": "Invalid domain id.",
                                "status": false
                            });
                            return false;
                        }).then(function() {
                                var identifiers = this.extractPrincipalIdentifiers(target);
                                var domainId = identifiers['domain'];
                                var principalId = identifiers['principal'];
                                var domain;
                                this.readDomain(domainId).trap(function(error) {
                                    callback({
                                        "message": "Invalid principal id.",
                                        "status": false
                                    });
                                    return false;
                                }).then(function() {
                                    domain = this;
                                }).readPrincipal(principalId).then(function() {
                                        var friendlyName = self.friendlyName(this);
                                        var itemInfo = "<div>" + friendlyName + "</div>";
                                        itemInfo += "<div>" + self.listItemProp(this, 'email') + "</div>";
                                        itemInfo += "<div>" + self.listItemProp(this, 'companyName') + "</div>";
                                        itemInfo += "<div><b>Domain</b>: " + self.friendlyTitle(domain) + "</div>";
                                        itemInfo += "<div><b>Name</b>: " + this.getName() + "</div>";

                                        itemInfo.replace('<', '&lt;').replace('>', '$gt;');

                                        control.field.attr('title', itemInfo);
                                        callback({
                                            "message": "Valid principal id.",
                                            "status": true
                                        });
                                });
                            });
                    }
            };

            options["fields"]["target"]["context"] = this;

            return options;
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Tenant(this));
        },

        setupBreadcrumb: function(el) {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Tenant(this), [
                {
                    "text" : this.isEditJSONUri(el) ? 'Edit JSON' : "Edit"
                }
            ]));
        },

        setupEditForm: function (el, callback) {
            var self = this;
            var tenant = self.targetObject();
            var defaultData = this.populateObject(["title","description","planKey","paymentMethod","dnsSlug"],tenant);
            defaultData["target"] = defaultData["domainId"] + "/" + defaultData["principalId"];
            $('#tenant-edit', $(el)).alpaca({
                "data": defaultData,
                "schema": self.schema(),
                "options": self.options(),
                "postRender": function(form) {
                    Gitana.Utils.UI.beautifyAlpacaForm(form, 'tenant-edit-save', true);
                    // Add Buttons
                    $('#tenant-edit-save', $(el)).click(function() {
                        var formVal = form.getValue();
                        var gitanaPrincipalUser = formVal["target"];
                        var ids = gitanaPrincipalUser.split("/");
                        formVal['domainId'] = ids[0];
                        formVal['principalId'] = ids[1];

                        delete formVal["target"];
                        if (form.isValid(true)) {
                            Gitana.Utils.UI.block("Updating Tenant ...");
                            _mergeObject(tenant,formVal);
                            tenant.update().then(function() {
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
                "title": "Edit Tenant",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'tenant-edit', 48),
                "url" : this.LINK().call(this,this.targetObject(), 'edit')
            };
        },

        editPageConfig: function() {
            return {
                "id" : "tenant-edit",
                "title" : "Edit Tenant",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'tenant-edit', 24),
                "buttons" :[
                    {
                        "id" : "tenant-edit-save",
                        "title" : "Save Tenant",
                        "isLeft" : true
                    }
                ]
            };
        },

        setupPage: function(el) {

            var page = {
                "title" : "Edit Tenant",
                "description" : "Edit tenant " + this.friendlyTitle(this.tenant()) + ".",
                "forms" :[]
            };

            this.setupEditPage(el, page);

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.TenantEdit);

})(jQuery);