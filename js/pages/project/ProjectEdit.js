(function($) {
    Gitana.Console.Pages.ProjectEdit = Gitana.CMS.Pages.AbstractEditFormPageGadget.extend(
    {
        EDIT_URI: [
            "/projects/{projectId}/edit"
        ],

        EDIT_JSON_URI: [
            "/projects/{projectId}/edit/json"
        ],

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        targetObject: function() {
            return this.client();
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

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Project(this));
        },

        setupBreadcrumb: function(el) {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Project(this), [
                {
                    "text" : this.isEditJSONUri(el) ? 'Edit JSON' : "Edit"
                }
            ]));
        },

        setupEditForm: function (el) {
            var self = this;
            var project = self.targetObject();
            var defaultData = this.populateObject(["title","description"],project);
            $('#client-edit', $(el)).alpaca({
                "data": defaultData,
                "schema": self.schema(),
                "options": self.options(),
                "postRender": function(form) {
                    Gitana.Utils.UI.beautifyAlpacaFormWithASMSelect(form, 'project-edit-save', true);
                    // Add Buttons
                    $('#project-edit-save', $(el)).click(function() {
                        var formVal = form.getValue();
                        if (form.isValid(true)) {
                            Gitana.Utils.UI.block("Updating Project ...");
                            Alpaca.mergeObject(project,formVal);
                            client.update().then(function() {
                                Gitana.Utils.UI.unblock(function() {
                                    self.app().run('GET', self.LINK().call(self,self.targetObject()));
                                });
                            });
                        }
                    });
                    $('#project-edit-reset', $(el)).click(function() {
                        form.setValue(defaultData);
                    });
                }
            });
        },

        processForm: function() {
        },

        editButtonConfig: function() {
            return  {
                "id": "edit",
                "title": "Edit Project",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'project-edit', 48),
                "url" : this.LINK().call(this,this.targetObject(), 'edit')
            };
        },

        editPageConfig: function() {
            return {
                "id" : "project-edit",
                "title" : "Edit Project",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'project-edit', 24),
                "buttons" :[
                    {
                        "id" : "project-edit-reset",
                        "title" : "Reset"
                    },
                    {
                        "id" : "project-edit-save",
                        "title" : "Save Project",
                        "isLeft" : true
                    }
                ]
            };
        },

        setupPage: function(el) {

            var page = {
                "title" : "Edit Project",
                "description" : "Edit project " + this.friendlyTitle(this.client()) + ".",
                "forms" :[]
            };

            this.setupEditPage(el, page);

            this.page(Alpaca.mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.ProjectEdit);

})(jQuery);