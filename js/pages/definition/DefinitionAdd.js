(function($) {
    Gitana.Console.Pages.DefinitionAdd = Gitana.CMS.Pages.AbstractFormPageGadget.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
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

            options['fields']['_qname']['postRender'] = function(control) {
                self.branch().generateQName({
                    "title" : "definition"
                }, function(qname) {
                    control.setValue(qname);
                });
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
                        callback({
                            "message": "QName already used.",
                            "status": false
                        });
                    });
                }
            };

            options['fields']['_parent']['dataSource'] = function(field, callback) {
                self.branch().listDefinitions(null, {
                    "limit": -1
                }).each(function() {
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

            this.page(_mergeObject(page,this.base(el)));
        },

        processDefinitionAddForm : function (el) {
            var self = this;

            $('#definition-add').alpaca({
                "view": "VIEW_WEB_CREATE",
                "schema": self.schema(),
                "options": self.options(),
                "postRender": function(renderedField) {

                    Gitana.Utils.UI.uniform(renderedField.getEl());
                    renderedField.getEl().css('border', 'none');

                    // Add Buttons
                    $('#definition-add-create').click(function(){

                        var value = renderedField.getValue();
                        var schemaBody = JSON.parse(value['body']);
                        delete value['body'];

                        _mergeObject(value, schemaBody);

                        if (renderedField.isValid(true)) {

                            Gitana.Utils.UI.block("Creating Definition...");

                            _Chain(self.targetObject()).createNode(value).then(function() {
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

        processForms : function (el) {
            this.processDefinitionAddForm(el);
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.DefinitionAdd);

})(jQuery);