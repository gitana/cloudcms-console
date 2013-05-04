(function($) {
    Gitana.Console.Pages.SettingsAdd = Gitana.CMS.Pages.AbstractFormPageGadget.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        schema: function() {

            var schema = Alpaca.cloneObject(Gitana.Console.Schema.Settings);

            _mergeObject(schema,this.base());

            return schema;
        },

        options: function() {

            var self = this;

            var options = Alpaca.cloneObject(Gitana.Console.Options.Settings);

            _mergeObject(options,this.base());

            options["fields"]["id"]["fields"]["scope"]["hideInitValidationError"] = true;
            options["fields"]["id"]["fields"]["key"]["hideInitValidationError"] = true;

            options['fields']['id']['validator'] = function(control, callback) {
                var controlVal = control.getValue();

                if (Alpaca.isValEmpty(controlVal)) {
                    callback({
                        "message": "Empty key.",
                        "status": true
                    });
                    return true
                }

                Chain(self.targetObject()).querySettings(controlVal).count(function(count) {
                        if (count == 0) {
                            callback({
                                "message": "Valid Settings key.",
                                "status": true
                            });
                        } else {
                            callback({
                                "message": "Unique Settings Id required!",
                                "status": false
                            });
                        }
                    });
            };

            return options;
        },

        setup: function() {
            this.get("/applications/{applicationId}/add/settings", this.index);
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
            this.menu(Gitana.Console.Menu.Application(this, "menu-application-settingss"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Settings(this), [
                {
                    "text" : "New Settings"
                }
            ]));
        },

        setupSettingsAddForm : function (el) {
            var self = this;
            $('#settings-add', $(el)).alpaca({
                "data": {},
                "schema": self.schema(),
                "options": self.options(),
                "postRender": function(form) {
                    Gitana.Utils.UI.beautifyAlpacaForm(form, 'settings-add-create', true);
                    // Add Buttons
                    $('#settings-add-create', $(el)).click(function() {

                        form.showHiddenMessages();

                        var formVal = form.getValue();
                        if (form.isValid(true)) {

                            Gitana.Utils.UI.block("Creating Settings...");

                            formVal['key'] = formVal['id']['key'];
                            formVal['scope'] = formVal['id']['scope'];

                            delete formVal['id'];

                            self.targetObject().createSettings(formVal).then(function() {
                                var newSettings = this;
                                Gitana.Utils.UI.unblock(function() {
                                    self.app().run('GET', self.LINK().call(self,newSettings));
                                });
                            });
                        }
                    });
                }
            });
        },

        setupForms : function (el) {
            this.setupSettingsAddForm(el);
        },

        setupPage : function(el) {

            var page = {
                "title" : "New Settings",
                "description" : "Create a new settings.",
                "forms" :[{
                    "id" : "settings-add",
                    "title" : "Create A New Settings",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'settings-add', 24),
                    "buttons" :[
                        {
                            "id" : "settings-add-create",
                            "title" : "Create Settings",
                            "isLeft" : true
                        }
                    ]
                }]
            };

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.SettingsAdd);

})(jQuery);