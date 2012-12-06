(function($) {
    Gitana.Console.Pages.ProjectAdd = Gitana.CMS.Pages.AbstractFormPageGadget.extend(
        {
            constructor: function(id, ratchet) {
                this.base(id, ratchet);
            },

            schema: function() {

                return Alpaca.mergeObject(this.base(), Gitana.Console.Schema.Project);
            },

            options: function() {

                var options = Alpaca.mergeObject(this.base(), {
                    "fields" : {
                        "title" : {
                            "helper" : "Enter project title."
                        },
                        "description" : {
                            "helper" : "Enter project description."
                        }
                    }
                });

                options = Alpaca.mergeObject(options, Gitana.Console.Options.Project);
                return options;
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

                                self.targetObject().createProject(formVal).then(function() {
                                    var newProject = this;
                                    Gitana.Utils.UI.unblock(function() {
                                        debugger;
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

                this.page(Alpaca.mergeObject(page, this.base(el)));
            },

            processForm: function() {
            }

        });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.ProjectAdd);

})(jQuery);