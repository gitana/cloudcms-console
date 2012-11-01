(function($) {
    Gitana.Console.Pages.DefinitionEdit = Gitana.CMS.Pages.AbstractEditFormPageGadget.extend(
    {
        EDIT_URI: [
            "/repositories/{repositoryId}/branches/{branchId}/definitions/{definitionId}/edit"
        ],

        EDIT_JSON_URI: [
            "/repositories/{repositoryId}/branches/{branchId}/definitions/{definitionId}/edit/json"
        ],

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        targetObject: function() {
            return this.definition();
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
                        if (this.getQName() != self.definition().getQName()) {
                            callback({
                                "message": "QName already used.",
                                "status": false
                            });
                        } else {
                            callback({
                                "message": "Valid QName",
                                "status": true
                            });
                        }
                    });
                }
            };

            options['fields']['_parent']['dataSource'] = function(field, callback) {
                self.branch().listDefinitions().each(function() {
                    field.selectOptions.push({
                        "value": this.get('_qname'),
                        "text": this.get('_qname')
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

        setupMenu: function() {
            if (this.targetObject().getTypeQName() == "d:type") {

                return this.menu(Gitana.Console.Menu.Type(this))

            } else {

                return this.menu(Gitana.Console.Menu.Definition(this));

            }
        },

        setupBreadcrumb: function(el) {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Definition(this), [
                {
                    "text" : "Edit"
                }
            ]));
        },

        setupEditForm: function (el) {
            var self = this;
            var definition = self.targetObject();
            var defaultData = Alpaca.cloneObject(definition.object);
            defaultData['body'] = {};
            defaultData['body']['type'] = definition.object['type'] ? definition.object['type'] : "object";
            if (definition.object['properties'] != null) {
                defaultData['body']['properties'] = definition.object['properties'];
                delete defaultData['properties'];
            }
            defaultData['body'] = JSON.stringify(defaultData['body'], null, ' ');

            $('#definition-edit', $(el)).alpaca({
                "data": defaultData,
                "schema": self.schema(),
                "options": self.options(),
                "postRender": function(control) {
                    Gitana.Utils.UI.uniform(control.getEl());
                    control.getEl().css('border', 'none');
                    // Add Buttons
                    $('#definition-edit-save', $(el)).click(function() {
                        var form = control.getValue();
                        var schemaBody = form['body'];
                        delete form['body'];
                        if (control.isValid(true)) {

                            Gitana.Utils.UI.block("Updating definition...");

                            if (definition.object['properties'] != null) {
                                delete definition.object['properties'];
                            }

                            Alpaca.mergeObject(definition.object,form);
                            Alpaca.mergeObject(definition.object,schemaBody);

                            definition.update().then(function() {
                                var updatedDefinition = this;
                                Gitana.Utils.UI.unblock(function() {
                                    self.app().run("GET", self.LINK().call(self,updatedDefinition));
                                });

                            });
                        }
                    });
                    $('#definition-edit-reset', $(el)).click(function() {
                        control.setValue(defaultData);
                    });
                }
            });
        },

        editButtonConfig: function() {
            return  {
                "id": "edit",
                "title": "Edit Definition",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'definition-edit', 48),
                "url" : this.LINK().call(this,this.targetObject(), 'edit')
            };
        },

        editPageConfig: function() {
            return {
                "id" : "definition-edit",
                "title" : "Edit Definition",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'definition-edit', 24),
                "buttons" :[
                    {
                        "id" : "definition-edit-reset",
                        "title" : "Reset"
                    },
                    {
                        "id" : "definition-edit-save",
                        "title" : "Save Definition",
                        "isLeft" : true
                    }
                ]
            };
        },

        setupPage: function(el) {

            var page = {
                "title" : "Edit Definition",
                "description" : "Edit definition " + this.friendlyTitle(this.targetObject()) + ".",
                "forms" :[]
            };

            this.setupEditPage(el, page);

            this.page(Alpaca.mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.DefinitionEdit);

})(jQuery);