(function($) {
    Gitana.Console.Pages.RepositoryEdit = Gitana.CMS.Pages.AbstractEditFormPageGadget.extend(
    {
        EDIT_URI: [
            "/repositories/{repositoryId}/edit"
        ],

        EDIT_JSON_URI: [
            "/repositories/{repositoryId}/edit/json"
        ],

        targetObject: function() {
            return this.repository();
        },

        requiredAuthorities: function() {
            return [
                {
                    "permissioned" : this.targetObject(),
                    "permissions" : ["update"]
                }
            ];
        },

        options: function() {

            return _mergeObject(this.base(), {
                "fields" : {
                    "title" : {
                        "helper" : "Enter repository title."
                    },
                    "description" : {
                        "helper" : "Enter repository description."
                    }
                }
            });
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Repository(this));
        },

        setupBreadcrumb: function(el) {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Repository(this), [
                {
                    "text" : this.isEditJSONUri(el) ? 'Edit JSON' : "Edit"
                }
            ]));
        },

        setupEditForm: function (el) {
            var self = this;
            var repository = self.targetObject();
            var defaultData = this.populateObject(["title","description"],repository);
            $('#repo-edit', $(el)).alpaca({
                "data": defaultData,
                "schema": self.schema(),
                "options": self.options(),
                "postRender": function(form) {
                    Gitana.Utils.UI.beautifyAlpacaForm(form, 'repo-edit-save', true);
                    // Add Buttons
                    $('#repo-edit-save', $(el)).click(function() {
                        var formVal = form.getValue();
                        if (form.isValid(true)) {
                            Gitana.Utils.UI.block("Updating Repository ...");
                            repository.replacePropertiesWith(formVal);
                            repository.update().then(function() {
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
                "title": "Edit Repository",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'repository-edit', 48),
                "url" : this.LINK().call(this,this.targetObject(), 'edit')
            };
        },

        editPageConfig: function() {
            return {
                "id" : "repo-edit",
                "title" : "Edit Repository",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'repository-edit', 24),
                "buttons" :[
                    {
                        "id" : "repo-edit-save",
                        "title" : "Save Repository",
                        "isLeft" : true
                    }
                ]
            };
        },

        setupPage: function(el) {

            var page = {
                "title" : "Edit Repository",
                "description" : "Edit repository " + this.friendlyTitle(this.repository()) + ".",
                "forms" :[]
            };

            this.setupEditPage(el, page);

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.RepositoryEdit);

})(jQuery);