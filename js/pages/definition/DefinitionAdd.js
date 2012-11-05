(function($) {
    Gitana.Console.Pages.DefinitionAdd = Gitana.CMS.Pages.AbstractFormPageGadget.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        schema: function() {

            return Alpaca.mergeObject(this.base(), {
                "properties" : {
                    "_type" : {
                        "title": "Definition Type",
                        "type" : "string",
                        "default" : "d:type",
                        "enum" : ["d:type","d:feature","d:association"],
                        "required" : true                        
                    },
                    "_parent" : {
                        "title": "Parent Type",
                        "type" : "string",
                        "default" : "n:node",
                        "required" : true                        
                    },                    
                    "_qname" : {
                        "title": "Definition QName",
                        "type" : "string"
                    },
                    "body" : {
                        "title" : "Schema Body",
                        "type" : "string",
                        "default" : "{\"type\" : \"object\", \"properties\" : {}}"
                    }
                }
            });
        },

        options: function() {
            var self = this;
            var options = Alpaca.mergeObject(this.base(), {
                "fields" : {
                    "title" : {
                        "helper" : "Enter definition title."
                    },
                    "description" : {
                        "helper" : "Enter definition description."
                    },
                    "_type" : {
                        "type": "select",
                        "helper" : "Pick definition type.",
                        "optionLabels": ["Type", "Feature", "Association"]
                    },
                    "_parent" : {
                        "type": "select",
                        "helper" : "Pick parent type."
                    },                    
                    "_qname" : {
                        "type": "text",
                        "helper": "Enter a unique qname.",
                        "size" : 60
                    },
                    "body" : {
                        "type" : "json",
                        "rows" : 20,
                        "cols" : 90,
                        "helper" : "Enter definition body."
                    }
                }
            });

            options['fields']['_qname']['postRender'] = function(control) {
                self.branch().generateQName({
                    "title" : "definition"
                }, function(qname) {
                    control.setValue(qname);
                });
            },

            options['fields']['_qname']['validator'] = function(control, callback) {
                var controlVal = control.getValue();
                if (!Alpaca.isValEmpty(controlVal)) {
                    self.branch().trap(function(error) {
                        if (error.status && error.status == '404') {
                            callback({
                                "message": "Valid QName",
                                "status": true
                            });
                        } else {
                            callback({
                                "message": "Invalid QName",
                                "status": false
                            });
                        }
                     }).readDefinition(controlVal).then(function() {
                        callback({
                            "message": "QName already used.",
                            "status": false
                        });
                    });
                }
            };

            options['fields']['_parent']['dataSource'] = function(field, callback) {
                self.branch().listDefinitions().each(function() {
                    field.selectOptions.push({
                        "value": this.getQName(),
                        "text": this.getQName()
                    });
                }).then(function() {
                    if (callback) {
                        callback();
                        field.field.val("n:node").change();
                    }
                });
            };

            return options;
        },

        setup: function() {
            this.get("/repositories/{repositoryId}/branches/{branchId}/add/definition", this.index);
            this.get("/repositories/{repositoryId}/branches/{branchId}/definitions/{definitionId}/add/definition", this.index);
        },

        targetObject: function() {
            return this.branch();
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
            this.menu(Gitana.Console.Menu.Branch(this,"menu-definitions"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Definitions(this), [
                {
                    "text" : "New Definition"
                }
            ]));
        },

        setupDefinitionAddForm : function (el) {
            var self = this;
            $('#definition-add',$(el)).alpaca({
                "schema": self.schema(),
                "options": self.options(),
                "postRender": function(renderedField) {

                    Gitana.Utils.UI.uniform(renderedField.getEl());
                    renderedField.getEl().css('border', 'none');

                    // Add Buttons
                    $('#definition-add-create',$(el)).click(function(){

                        var value = renderedField.getValue();
                        var schemaBody = value['body'];
                        delete value['body'];

                        Alpaca.mergeObject(value, schemaBody);

                        if (renderedField.isValid(true)) {

                            Gitana.Utils.UI.block("Creating Definition...");

                            self.targetObject().createNode(value).then(function() {
                                var link = self.LIST_LINK().call(self,"definitions") + this.getId();
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
            this.setupDefinitionAddForm(el);
        },

        setupPage : function(el) {

            var page = {
                "title" : "New Definition",
                "description" : "Create a new definition of branch " + this.friendlyTitle(this.branch()) + ".",
                "forms" :[{
                    "id" : "definition-add",
                    "title" : "Create A New Definition",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'definition-add', 24),
                    "buttons" :[
                        {
                            "id" : "definition-add-create",
                            "title" : "Create Definition",
                            "isLeft" : true
                        }
                    ]
                }]
            };

            this.page(Alpaca.mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.DefinitionAdd);

})(jQuery);