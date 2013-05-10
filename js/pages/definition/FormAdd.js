(function($) {
    Gitana.Console.Pages.FormAdd = Gitana.CMS.Pages.AbstractFormPageGadget.extend(
    {
        schema: function() {

            return {
                "type": "object",
                "properties": {
                    "title": {
                        "title": "Title",
                        "type": "string",
                        "required": true
                    },
                    "description": {
                        "title": "Description",
                        "type": "string"
                    },
                    "formKey" : {
                        "title": "Unique Form Key",
                        "type" : "string",
                        "required": true
                    },
                    "body" : {
                        "title" : "Form Configuration",
                        "type" : "string",
                        "default" : JSON.stringify({
                            "fields": {}
                        }, null, "    ")
                    }
                }
            };
        },

        options: function() {
            var self = this;

            var options = {
                "focus": true,
                "fields" : {
                    "title" : {
                        "size" : 60
                    },
                    "description": {
                        "type": "textarea",
                        "cols" : 60
                    }
                }
            };

            options ["fields"]["formKey"] = {
                "type": "text",
                "size" : 60,
                "postRender" : function(control) {
                    self.definition().listFormAssociations().count(function(count) {
                        control.setValue("form" + count);
                    });
                },
                "validator" : function(control, callback) {
                    var controlVal = control.getValue();
                    if (!Alpaca.isValEmpty(controlVal)) {
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
                    }
                }
            };

            options ["fields"]["body"] = {
                "type" : "editor",
                "aceMode": "ace/mode/javascript",
                "aceFitContentHeight": true
            };

            return options;
        },

        setup: function() {
            this.get("/repositories/{repositoryId}/branches/{branchId}/definitions/{definitionId}/add/form", this.index);
            this.get("/repositories/{repositoryId}/branches/{branchId}/definitions/{definitionId}/forms/{formId}/add/form", this.index);
        },

        requiredAuthorities: function() {
            return [
                {
                    "permissioned" : this.branch(),
                    "permissions" : ["create_subobjects"]
                },
                {
                    "permissioned" : this.definition(),
                    "permissions" : ["update"]
                }
            ];
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Definition(this,"menu-definition-forms"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Forms(this), [
                {
                    "text" : "New Form"
                }
            ]));
        },

        setupPage : function(el) {

            var page = {
                "title" : "New Form",
                "description" : "Create a new form.",
                "forms" :[{
                    "id" : "form-add",
                    "title" : "Create A New Form",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'form-add', 24),
                    "buttons" :[
                        {
                            "id" : "form-add-create",
                            "title" : "Create Form",
                            "isLeft" : true
                        }
                    ]
                }]
            };

            this.page(_mergeObject(page,this.base(el)));
        },

        processFormAddForm : function (el) {
            var self = this;
            $('#form-add').alpaca({
                "view": "VIEW_WEB_CREATE",
                "schema": self.schema(),
                "options": self.options(),
                "postRender": function(renderedField) {

                    Gitana.Utils.UI.beautifyAlpacaForm(renderedField, 'form-add-create', true);

                    // Add Buttons
                    $('#form-add-create').click(function(){

                        var value = renderedField.getValue();

                        var formBody = JSON.parse(value['body']);
                        formBody['title'] = value['title'] ? value['title'] : "";
                        formBody['description'] = value['description'] ? value['description'] : "";

                        var formKey = value['formKey'];

                        if (renderedField.isValid(true)) {

                            Gitana.Utils.UI.block("Creating Form...");

                            self.definition().createForm(formKey,formBody).then(function() {

                                // TODO: better link generation
                                var link = self.LIST_LINK().call(self,'forms') + formKey;

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

        processForms : function (el) {
            this.processFormAddForm(el);
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.FormAdd);

})(jQuery);