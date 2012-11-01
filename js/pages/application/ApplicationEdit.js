(function($) {
    Gitana.Console.Pages.ApplicationEdit = Gitana.CMS.Pages.AbstractEditFormPageGadget.extend(
    {
        EDIT_URI: [
            "/applications/{applicationId}/edit"
        ],

        EDIT_JSON_URI: [
            "/applications/{applicationId}/edit/json"
        ],

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        targetObject: function() {
            return this.application();
        },

        contextObject: function() {
            return this.platform();
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

            var schema = Alpaca.cloneObject(Gitana.Console.Schema.Application);

            Alpaca.mergeObject(schema,this.base());

            return schema;
        },

        options: function() {

            var self = this;

            var options = Alpaca.cloneObject(Gitana.Console.Options.Application);

            Alpaca.mergeObject(options,this.base());

            //TODO: Make key field readonly?
            options['fields']['key']['validator'] = function(control, callback) {
                var controlVal = control.getValue();

                if (Alpaca.isValEmpty(controlVal)) {
                    callback({
                        "message": "Empty key.",
                        "status": true
                    });
                    return true
                }

                if (self.targetObject().get('key') == controlVal) {
                    callback({
                        "message": "Same key.",
                        "status": true
                    });
                    return true
                }

                Chain(self.targetObject()).queryApplications({
                    "key" : controlVal
                }).count(function(count) {
                        if (count == 0) {
                            callback({
                                "message": "Valid application key.",
                                "status": true
                            });
                        } else {
                            callback({
                                "message": "Unique application key required!",
                                "status": false
                            });
                        }
                    });
            };

            return options;
        },


        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Application(this));
        },

        setupBreadcrumb: function(el) {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Application(this), [
                {
                    "text" : this.isEditJSONUri(el) ? 'Edit JSON' : "Edit"
                }
            ]));
        },

        setupEditForm: function (el) {
            var self = this;
            var application = self.targetObject();
            var defaultData = this.populateObject(["key","title","description"],application);
            $('#application-edit', $(el)).alpaca({
                "data": defaultData,
                "schema": self.schema(),
                "options": self.options(),
                "postRender": function(form) {
                    Gitana.Utils.UI.beautifyAlpacaForm(form, 'application-edit-save', true);
                    // Add Buttons
                    $('#application-edit-save', $(el)).click(function() {
                        var formVal = form.getValue();
                        if (form.isValid(true)) {
                            Gitana.Utils.UI.block("Updating Application ...");
                            application.replacePropertiesWith(formVal);
                            application.update().then(function() {
                                Gitana.Utils.UI.unblock(function() {
                                    self.app().run('GET', self.LINK().call(self,self.targetObject()));
                                });
                            });
                        }
                    });
                    $('#application-edit-reset', $(el)).click(function() {
                        form.setValue(defaultData);
                    });
                }
            });
        },

        editButtonConfig: function() {
            return  {
                "id": "edit",
                "title": "Edit Application",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'application-edit', 48),
                "url" : this.LINK().call(this,this.targetObject(), 'edit')
            };
        },

        editPageConfig: function() {
            return {
                "id" : "application-edit",
                "title" : "Edit Application",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'application-edit', 24),
                "buttons" :[
                    {
                        "id" : "application-edit-reset",
                        "title" : "Reset"
                    },
                    {
                        "id" : "application-edit-save",
                        "title" : "Save Application",
                        "isLeft" : true
                    }
                ]
            };
        },

        setupPage: function(el) {

            var page = {
                "title" : "Edit Application",
                "description" : "Edit application " + this.friendlyTitle(this.application()) + ".",
                "forms" :[]
            };

            this.setupEditPage(el, page);

            this.page(Alpaca.mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.ApplicationEdit);

})(jQuery);