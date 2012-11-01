(function($) {
    Gitana.Console.Pages.FormAdd = Gitana.CMS.Pages.AbstractFormPageGadget.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        schema: function() {

            return Alpaca.mergeObject(this.base(), {
                "properties" : {
                    "formKey" : {
                        "title": "Form Key",
                        "type" : "string"
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
                    }
                }
            });

            options ["fields"]["formKey"] = {
                "type": "text",
                "helper": "Enter a unique form key.",
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
                "type" : "json",
                "rows" : 20,
                "cols" : 90,
                "helper" : "Enter form body."
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

        setupFormAddForm : function (el) {
            var self = this;
            $('#form-add',$(el)).alpaca({
                "schema": self.schema(),
                "options": self.options(),
                "postRender": function(renderedField) {

                    Gitana.Utils.UI.beautifyAlpacaForm(renderedField, 'form-add-create', true);

                    // Add Buttons
                    $('#form-add-create',$(el)).click(function(){

                        var value = renderedField.getValue();

                        var formBody = value['body'];
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

        setupForms : function (el) {
            this.setupFormAddForm(el);
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

            this.page(Alpaca.mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.FormAdd);

})(jQuery);