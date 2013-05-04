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

            return {
                "type": "object",
                "properties" : {
                    "_type" : {
                        "title": "What kind of definition is this?",
                        "type" : "string",
                        "default" : "d:type",
                        "enum" : ["d:type","d:feature","d:association"],
                        "required" : true
                    },
                    "_qname" : {
                        "title": "Unique QName",
                        "type" : "string",
                        "required": true
                    },
                    "title": {
                        "title": "Title",
                        "type": "string",
                        "required": true
                    },
                    "description": {
                        "title": "Description",
                        "type": "string"
                    },
                    "_parent" : {
                        "title": "Inherits from:",
                        "type" : "string",
                        "default" : "n:node",
                        "required" : true
                    },
                    "body" : {
                        "title" : "Schema",
                        "type" : "string",
                        "default" : JSON.stringify({
                            "type": "object",
                            "properties": {}
                        }, null, "  ")
                    }
                }
            };

        },

        options: function() {
            var self = this;

            var options = {
                "focus": true,
                "fields" : {
                    "_type" : {
                        "type": "select",
                        "optionLabels": ["Content Type Definition", "Feature Definition", "Association Definition"]
                    },
                    "_qname" : {
                        "type": "text",
                        "size" : 60
                    },
                    "title" : {
                        "size" : 60
                    },
                    "description": {
                        "type": "textarea",
                        "cols" : 60
                    },
                    "_parent" : {
                        "type": "select"
                    },
                    "body" : {
                        "type" : "editor",
                        "aceMode": "ace/mode/javascript",
                        "aceFitContentHeight": true
                    }
                }
            };

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
                        "value": this.getQName(),
                        "text": this.getQName()
                    });
                }).then(function() {
                    if (callback) {
                        callback();
                        field.field.val("n:node").change();

                        Gitana.Utils.UI.uniform(field.getEl());
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

            this.page(_mergeObject(page,this.base(el)));
        },

        processEditForm: function (el) {
            var self = this;
            var definition = self.targetObject();
            var defaultData = self.populateObjectAll(definition);

            defaultData['body'] = {};
            defaultData['body']['type'] = definition['type'] ? definition['type'] : "object";
            defaultData['body']['properties'] = {};
            if (definition['properties'] != null) {
                defaultData['body']['properties'] = definition['properties'];
                //delete defaultData['properties'];
            }
            defaultData["body"] = JSON.stringify(defaultData["body"], null, "    ");
            defaultData['_qname'] = definition.getQName();

            $('#definition-edit').alpaca({
                "data": defaultData,
                "schema": self.schema(),
                "options": self.options(),
                "postRender": function(control) {
                    Gitana.Utils.UI.uniform(control.getEl());
                    control.getEl().css('border', 'none');

                    // Add Buttons
                    $('#definition-edit-save').click(function() {

                        var form = control.getValue();
                        var schemaBody = JSON.parse(form['body']);
                        delete form['body'];

                        if (control.isValid(true)) {

                            Gitana.Utils.UI.block("Updating definition...");

                            if (definition['properties'] != null) {
                                delete definition['properties'];
                            }

                            _mergeObject(definition,form);
                            _mergeObject(definition,schemaBody);

                            _Chain(definition).update().then(function() {
                                var updatedDefinition = this;
                                Gitana.Utils.UI.unblock(function() {
                                    self.app().run("GET", self.LINK().call(self,updatedDefinition));
                                });

                            });
                        }
                    });
                }
            });
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.DefinitionEdit);

})(jQuery);