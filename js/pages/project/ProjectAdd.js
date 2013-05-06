(function($) {
    Gitana.Console.Pages.ProjectAdd = Gitana.CMS.Pages.AbstractFormPageGadget.extend(
        {
            schema: function() {
                return {
                    "type": "object",
                    "properties" : {
                        "title" : {
                            "type" : "string",
                            "required": true
                        },
                        "description" : {
                            "type" : "string"
                        },
                        "stackSelection": {
                            "type": "string",
                            "enum": ["new", "existing"],
                            "default": "new",
                            "required": true
                        },
                        "stackId": {
                            "type": "string",
                            "dependencies": "stackSelection"
                        },
                        "projectType": {
                            "type": "string",
                            "dependencies": "stackSelection",
                            "enum": ["collaboration"],
                            "default": "collaboration",
                            "required": true
                        }
                    }
                };
            },

            options: function() {
                return {
                    "fields" : {
                        "title" : {
                            "label": "What would you like to call this project?",
                            "hideInitValidationError": true,
                        },
                        "description": {
                            "label": "Provide a brief project description:",
                            "type": "textarea",
                            "hideInitValidationError": true,
                        },
                        "stackSelection": {
                            "label": "Configure your Infrastructure Stack",
                            "helper": "By default, a new infrastructure stack will be created for your project.  If you'd like to reuse an existing infrastructure stack, you can elect to do so.",
                            "optionLabels": ["Create a New Stack", "Use an Existing Stack"],
                            "hideInitValidationError": true,
                        },
                        "stackId": {
                            "label": "Pick an Existing Stack",
                            "hideInitValidationError": true,
                            "type": "gitanastackpicker",
                            "platform": this.platform(),
                            "dependencies": {
                                "stackSelection": "existing"
                            }
                        },
                        "projectType": {
                            "label": "What kind of project would you like to create?",
                            "type": "select",
                            "optionLabels": ["Collaboration Project"],
                            "hideInitValidationError": true,
                            "dependencies": {
                                "stackSelection": "new"
                            }
                        }
                    }
                };
            },

            setup: function() {
                this.get("/add/project", this.index);
            },

            targetObject: function() {
                return this.platform();
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
                this.menu(Gitana.Console.Menu.Platform(this, "menu-platform-projects"));
            },

            setupBreadcrumb: function() {
                return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Projects(this), [
                    {
                        "text" : "New Project"
                    }
                ]));
            },

            setupProjectAddForm : function (el) {
                var self = this;
                $('#project-add', $(el)).alpaca({
                    "data": {
                    },
                    "schema": self.schema(),
                    "options": self.options(),
                    "postRender": function(form) {
                        Gitana.Utils.UI.beautifyAlpacaFormWithASMSelect(form , 'project-add-create', true);
                        // Add Buttons
                        $('#project-add-create', $(el)).click(function() {
                            var formVal = form.getValue();
                            if (form.isValid(true)) {

                                Gitana.Utils.UI.block("Creating Project...");

                                var projectObject = {};
                                Gitana.copyInto(projectObject, formVal);

                                if (projectObject.stackSelection == "new")
                                {
                                    delete formVal.stackId;
                                }
                                delete projectObject.stackSelection;

                                self.targetObject().createProject(projectObject).then(function() {
                                    var newProject = this;
                                    Gitana.Utils.UI.unblock(function() {
                                        self.app().run('GET', self.LINK().call(self, newProject));
                                    });
                                });

                            }
                        });
                    }
                });
            },

            setupForms : function (el) {
                this.setupProjectAddForm(el);
            },

            setupPage : function(el) {

                var page = {
                    "title" : "New Project",
                    "description" : "Create a new project.",
                    "forms" :[
                        {
                            "id" : "project-add",
                            "title" : "Create A New Project",
                            "icon" : Gitana.Utils.Image.buildImageUri('objects', 'project-add', 24),
                            "buttons" :[
                                {
                                    "id" : "project-add-create",
                                    "title" : "Create Project",
                                    "isLeft" : true
                                }
                            ]
                        }
                    ]
                };

                this.page(_mergeObject(page, this.base(el)));
            },

            processForms: function() {
            }

        });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.ProjectAdd);

})(jQuery);