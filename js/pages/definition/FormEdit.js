(function($) {
    Gitana.Console.Pages.FormEdit = Gitana.CMS.Pages.AbstractEditFormPageGadget.extend(
    {
        EDIT_URI: [
            "/repositories/{repositoryId}/branches/{branchId}/definitions/{definitionId}/forms/{formId}/edit"        ],

        EDIT_JSON_URI: [
            "/repositories/{repositoryId}/branches/{branchId}/definitions/{definitionId}/forms/{formId}/edit/json"        ],

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        schema: function() {
            var self = this;
            return Alpaca.mergeObject(this.base(), {
                "properties" : {
                    "formKey" : {
                        "title": "Form Key",
                        "type" : "string",
                        "default" : self.form()['formKey'],
                        "required" : true
                    },
                    "body" : {
                        "title" : "Form Body",
                        "type" : "string",
                        "default" : "{\"fields\" : {}}"
                    }
                }
            });
        },

        options: function() {
            var self = this;
            var options = Alpaca.mergeObject(this.base(), {
                "fields" : {
                    "title" : {
                        "helper" : "Enter form title."
                    },
                    "description" : {
                        "helper" : "Enter form description."
                    },
                    "body" : {
                        "type" : "json",
                        "rows" : 20,
                        "cols" : 90,
                        "helper" : "Enter form body."
                    }
                }
            });

            options ["fields"]["formKey"] = {
                "type": "text",
                "helper": "Enter a unique form key.",
                "size" : 60,
                "validator" : function(control, callback) {
                    var controlVal = control.getValue();
                    if (!Alpaca.isValEmpty(controlVal) && controlVal != self.form()['formKey']) {
                        self.branch().queryNodes({
                            "_type" : 	"a:has_form",
                            "source" : self.definition().getId(),
                            "form-key" : controlVal
                        }).count(function(count) {
                            if (count == 0) {
                                callback({
                                    "message": "Valid Form Key",
                                    "status": true
                                });
                            } else {
                                callback({
                                    "message": "Form key already used.",
                                    "status": false
                                });
                            }
                        });
                    } else {
                        callback({
                            "message": "Valid Form Key",
                            "status": true
                        });
                    }
                }
            };

            return options;
        },

        targetObject: function() {
            return this.form();
        },

        requiredAuthorities: function() {
            return [
                {
                    "permissioned" : this.targetObject(),
                    "permissions" : ["update"]
                }
            ];
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Form(this));
        },

        setupBreadcrumb: function(el) {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Form(this), [
                {
                    "text" : "Edit"
                }
            ]));
        },

        setupEditForm: function (el) {

            var self = this;
            var form = self.targetObject();

            var defaultData = self.populateObjectAll(form);
            defaultData['body'] = {};
            if (form['fields'] != null) {
                defaultData['body']['fields'] = form['fields'];
                delete defaultData['fields'];
                delete form['fields'];
            }
            defaultData['body'] = JSON.stringify(defaultData['body'], null, ' ');

            $('#form-edit', $(el)).alpaca({
                "data": defaultData,
                "schema": self.schema(),
                "options": self.options(),
                "postRender": function(control) {
                    Gitana.Utils.UI.beautifyAlpacaForm(control, 'form-edit-save', true);
                    // Add Buttons
                    $('#form-edit-save', $(el)).click(function() {
                        var formVal = control.getValue();
                        var schemaBody = formVal['body'];
                        var formKey = formVal['formKey'];
                        delete formVal['body'];
                        delete formVal['formKey'];
                        if (control.isValid(true)) {

                            Gitana.Utils.UI.block("Updating form...");

                            Alpaca.mergeObject(form, formVal);
                            Alpaca.mergeObject(form, schemaBody);

                            form.update().then(function() {
                                var updatedForm = this;
                                updatedForm['formKey'] = self.form()['formKey'];

                                if (formKey != self.form()['formKey']) {

                                    this.subchain(self.branch()).queryNodes({
                                        "_type" :     "a:has_form",
                                        "source" : self.definition().getId(),
                                        "form-key" : self.form()['formKey']
                                    }).count(function(count) {
                                        if (count == 1) {
                                            this.keepOne().then(function() {
                                                this['form-key'] = formKey;
                                                this.update().then(function() {
                                                    updatedForm['formKey'] = formKey;
                                                });
                                            });
                                        }
                                    });

                                    this.then(function() {
                                        Gitana.Utils.UI.unblock(function() {
                                            self.app().run("GET", self.LINK().call(self, updatedForm));
                                        });
                                    });

                                } else {
                                    Gitana.Utils.UI.unblock(function() {
                                        self.app().run("GET", self.LINK().call(self, updatedForm));
                                    });
                                }
                            });
                        }
                    });
                    $('#form-edit-reset', $(el)).click(function() {
                        control.setValue(defaultData);
                    });
                }
            });
        },

        setupJSONEditForm: function (el, object, targetId) {
            var targetId = targetId ? targetId : "json-edit";
            var self = this;

            var defaultData = object.stringify(true);

            $('#' + targetId, $(el)).alpaca({
                "data": defaultData,
                "options": {
                    "type" : "json",
                    "rows" : 20,
                    "cols" : 90
                },
                "postRender": function(control) {
                    Gitana.Utils.UI.beautifyAlpacaForm(control, targetId + '-save', true);
                    // Add Buttons
                    $('#' + targetId + '-save', $(el)).click(function() {
                        var form = control.getValue();
                        if (control.isValid(true)) {

                            var obj = form;

                            Gitana.Utils.UI.block("Updating Object JSON...");

                            // update our selected object with the new json
                            Alpaca.mergeObject(object,obj);

                            // update
                            object.update().then(function () {
                                var updatedObject = this;
                                updatedObject['formKey'] = self.form()['formKey'];
                                Gitana.Utils.UI.unblock(function() {
                                    self.app().run("GET", self.LINK().call(self,updatedObject));
                                });
                            });
                        }
                    });
                    $('#' + targetId + '-reset', $(el)).click(function() {
                        control.setValue(defaultData);
                    });
                }
            });
        },

        editButtonConfig: function() {
            return  {
                "id": "edit",
                "title": "Edit Form",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'form-edit', 48),
                "url" : this.link(this.targetObject(), 'edit')
            };
        },

        editPageConfig: function() {
            return {
                "id" : "form-edit",
                "title" : "Edit Form",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'form-edit', 24),
                "buttons" :[
                    {
                        "id" : "form-edit-reset",
                        "title" : "Reset"
                    },
                    {
                        "id" : "form-edit-save",
                        "title" : "Save Form",
                        "isLeft" : true
                    }
                ]
            };
        },

        setupPage: function(el) {

            var page = {
                "title" : "Edit Form",
                "description" : "Edit form " + this.friendlyTitle(this.targetObject()) + ".",
                "forms" :[]
            };

            this.setupEditPage(el, page);

            this.page(Alpaca.mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.FormEdit);

})(jQuery);