(function($) {
    Gitana.Console.Pages.ProjectEdit = Gitana.CMS.Pages.AbstractEditFormPageGadget.extend(
    {
        EDIT_URI: [
            "/projects/{projectId}/edit"
        ],

        EDIT_JSON_URI: [
            "/projects/{projectId}/edit/json"
        ],

        targetObject: function() {
            return this.project();
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
            return Gitana.Console.Schema.Project(this.platform());
        },

        options: function() {
            return Gitana.Console.Options.Project(this.platform());
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
            $('#project-edit', $(el)).alpaca({
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
                            project.update().then(function() {
                                Gitana.Utils.UI.unblock(function() {
                                    self.app().run('GET', self.LINK().call(self,self.targetObject()));
                                });
                            });
                        }
                    });
                }
            });
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
                "description" : "Edit project " + this.friendlyTitle(this.project()) + ".",
                "forms" :[]
            };

            this.setupEditPage(el, page);

            this.page(Alpaca.mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.ProjectEdit);

})(jQuery);