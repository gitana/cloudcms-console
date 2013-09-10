(function($) {
    Gitana.Console.Pages.AutoClientMappingAdd = Gitana.CMS.Pages.AbstractFormPageGadget.extend(
        {
            schema: function() {
                return Alpaca.merge({}, Gitana.Console.Schema.AutoClientMapping);
            },

            options: function() {
                var self = this;

                var options = Alpaca.merge({}, Gitana.Console.Options.AutoClientMapping);

                options['fields']['clientKey']['dataSource'] = function(field, callback) {
                    var firstOption;
                    Chain(self.platform()).listClients({
                        "limit": -1
                    }).each(
                        function(key, val, index) {
                            var title = this.getTitle() ? this.getTitle() : this.getKey();
                            field.selectOptions.push({
                                "value": this.getKey(),
                                "text": title
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

                options['fields']['authGrantKey']['dataSource'] = function(field, callback) {
                    var firstOption;
                    Chain(self.platform()).queryAuthenticationGrants({}, {
                        "limit": -1
                    }).each(
                        function(key, val, index) {
                            var title = this.getTitle() ? this.getTitle() : this.getKey();
                            field.selectOptions.push({
                                "value": this.getKey(),
                                "text": title
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

                options['fields']['applicationId']['dataSource'] = function(field, callback) {
                    var firstOption;
                    Chain(self.platform()).listApplications({
                        "limit": -1
                    }).each(
                        function(key, val, index) {
                            var title = this.getTitle() ? this.getTitle() : this.getId();
                            field.selectOptions.push({
                                "value": this.getId(),
                                "text": title
                            });
                            if (!firstOption) {
                                firstOption = this.getId();
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

                return options;
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
                this.get("/webhosts/{webhostId}/add/autoclientmapping", this.index);
            },

            setupMenu: function() {
                this.menu(Gitana.Console.Menu.Webhost(this, "menu-webhost-auto-client-mappings"));
            },

            setupBreadcrumb: function() {
                return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.AutoClientMappings(this), [
                    {
                        "text" : "New Auto Client Mapping"
                    }
                ]));
            },

            setupAutoClientMappingAddForm : function (el) {
                var self = this;
                $('#auto-client-mapping-add', $(el)).alpaca({
                    "view": "VIEW_WEB_CREATE",
                    "data": {},
                    "schema": self.schema(),
                    "options": self.options(),
                    "postRender": function(form) {
                        Gitana.Utils.UI.beautifyAlpacaForm(form, 'auto-client-mapping-add-create', true);

                        // Add Buttons
                        $('#auto-client-mapping-add-create', $(el)).click(function() {

                            form.showHiddenMessages();

                            var formVal = form.getValue();
                            if (form.isValid(true)) {

                                Gitana.Utils.UI.block("Creating Auto Client Mapping...");

                                var uri = formVal['uri'];
                                var clientKey = formVal['clientKey'];
                                var applicationId = formVal['applicationId'];

                                delete formVal['uri'];
                                delete formVal['clientKey'];
                                delete formVal['applicationId'];

                                self.targetObject().createAutoClientMapping(uri,applicationId,clientKey,formVal).then(function() {
                                    var newAutoClientMapping = this;
                                    Gitana.Utils.UI.unblock(function() {
                                        self.app().run('GET', self.LINK().call(self, newAutoClientMapping));
                                    });
                                });
                            }
                        });
                    }
                });
            },

            setupForms : function (el) {
                this.setupAutoClientMappingAddForm(el);
            },

            setupPage : function(el) {

                var page = {
                    "title" : "New Auto Client Mapping",
                    "description" : "Create a new auto client mapping on webhost " + this.friendlyTitle(this.targetObject()) + ".",
                    "forms" :[
                        {
                            "id" : "auto-client-mapping-add",
                            "title" : "Create A New Auto Client Mapping",
                            "icon" : Gitana.Utils.Image.buildImageUri('objects', 'auto-client-mapping-add', 24),
                            "buttons" :[
                                {
                                    "id" : "auto-client-mapping-add-create",
                                    "title" : "Create Auto Client Mapping",
                                    "isLeft" : true
                                }
                            ]
                        }
                    ]
                };

                this.page(_mergeObject(page, this.base(el)));
            }

        });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.AutoClientMappingAdd);

})(jQuery);