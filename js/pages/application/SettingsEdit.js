(function($) {
    Gitana.Console.Pages.SettingsEdit = Gitana.CMS.Pages.AbstractEditFormPageGadget.extend(
    {
        EDIT_URI: [
            "/applications/{applicationId}/settings/{settingsId}/edit"
        ],

        EDIT_JSON_URI: [
            "/applications/{applicationId}/settings/{settingsId}/edit/json"
        ],

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        targetObject: function() {
            return this.settings();
        },

        contextObject: function() {
            return this.application();
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

            var schema = Alpaca.cloneObject(Gitana.Console.Schema.Settings);
            
            _mergeObject(schema,this.base());

            return schema;
        },

        options: function() {

            var self = this;

            var options = Alpaca.cloneObject(Gitana.Console.Options.Settings);
            
            _mergeObject(options,this.base());

            options['fields']['id']['validator'] = function(control, callback) {
                var controlVal = control.getValue();

                if (controlVal['key'] == self.settings().get('key') && controlVal['scope'] == self.settings().get('scope')) {
                    callback({
                        "message": "Same scope and key.",
                        "status": true
                    });
                    return true;
                }

                Chain(self.contextObject()).querySettings(controlVal).count(function(count) {
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

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Settings(this));
        },

        setupBreadcrumb: function(el) {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Setting(this), [
                {
                    "text" : this.isEditJSONUri(el) ? 'Edit JSON' : "Edit"
                }
            ]));
        },

        setupEditForm: function (el, callback) {
            var self = this;
            var settings = self.targetObject();

            var defaultData = {
                "id" : {
                    "scope" : settings['scope'],
                    "key" : settings['key']
                },
                "settings" : Alpaca.cloneObject(settings.getSettings())
            };

            if (settings['title']) {
                defaultData['title'] = settings['title'];
            }

            if (settings['description']) {
                defaultData['description'] = settings['description'];
            }

            $('#settings-edit', $(el)).alpaca({
                "data": defaultData,
                "schema": self.schema(),
                "options": self.options(),
                "postRender": function(form) {
                    Gitana.Utils.UI.beautifyAlpacaForm(form, 'settings-edit-save', true);
                    // Add Buttons
                    $('#settings-edit-save', $(el)).click(function() {
                        var formVal = form.getValue();
                        if (form.isValid(true)) {
                            Gitana.Utils.UI.block("Updating Settings ...");

                            formVal['key'] = formVal['id']['key'];
                            formVal['scope'] = formVal['id']['scope'];

                            delete formVal['id'];

                            _mergeObject(settings,formVal);

                            settings.update().then(function() {
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
                "title": "Edit Settings",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'settings-edit', 48),
                "url" : this.LINK().call(this,this.targetObject(), 'edit')
            };
        },

        editPageConfig: function() {
            return {
                "id" : "settings-edit",
                "title" : "Edit Settings",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'settings-edit', 24),
                "buttons" :[
                    {
                        "id" : "settings-edit-save",
                        "title" : "Save Settings",
                        "isLeft" : true
                    }
                ]
            };
        },

        setupPage: function(el) {

            var page = {
                "title" : "Edit Settings",
                "description" : "Edit settings " + this.friendlyTitle(this.settings()) + ".",
                "forms" :[]
            };

            this.setupEditPage(el, page);

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.SettingsEdit);

})(jQuery);