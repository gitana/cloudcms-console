(function($) {
    Gitana.Console.Pages.BranchEdit = Gitana.CMS.Pages.AbstractEditFormPageGadget.extend(
    {
        EDIT_URI: [
            "/repositories/{repositoryId}/branches/{branchId}/edit"
        ],

        EDIT_JSON_URI: [
            "/repositories/{repositoryId}/branches/{branchId}/edit/json"
        ],

        options: function() {
            return _mergeObject(this.base(), {
                "fields" : {
                    "title" : {
                        "helper" : "Enter branch title."
                    },
                    "description" : {
                        "helper" : "Enter branch description."
                    }
                }
            });
        },

        targetObject: function() {
            return this.branch();
        },

        requiredAuthorities: function() {
            return [
                {
                    "permissioned" : this.targetObject(),
                    "permissions" : ["update"]
                }
            ];
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Branch(this));
        },

        setupBreadcrumb: function(el) {
            var items = [
                {
                    "text" : this.isEditJSONUri(el) ? 'Edit JSON' : "Edit"
                }
            ];

            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Branch(this), items));
        },

        setupEditForm: function (el, callback) {
            var self = this;
            var branch = self.targetObject();
            var defaultData = this.populateObject(["title","description"],branch);
            $('#branch-edit', $(el)).alpaca({
                "data": defaultData,
                "schema": self.schema(),
                "options": self.options(),
                "postRender": function(form) {
                    Gitana.Utils.UI.beautifyAlpacaForm(form, 'branch-edit-save', true);
                    // Add Buttons
                    $('#branch-edit-save', $(el)).click(function() {
                        var formVal = form.getValue();
                        if (form.isValid(true)) {

                            Gitana.Utils.UI.block("Updating Branch...");

                            branch.replacePropertiesWith(formVal);
                            branch.update().then(function() {

                                Gitana.Utils.UI.unblock(function() {
                                    self.app().run("GET", self.LINK().call(self,self.targetObject()));
                                });

                            });
                        }
                    });

                    callback();
                }
            });
        },

        editButtonConfig: function() {
            return  {
                "id": "edit",
                "title": "Edit Branch",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'branch-edit', 48),
                "url" : this.link(this.targetObject(), 'edit')
            };
        },

        editPageConfig: function() {
            return {
                "id" : "branch-edit",
                "title" : "Edit Branch",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'branch-edit', 24),
                "buttons" :[
                    {
                        "id" : "branch-edit-save",
                        "title" : "Save Branch",
                        "isLeft" : true
                    }
                ]
            };
        },

        setupPage: function(el) {

            var page = {
                "title" : "Edit Branch",
                "description" : "Edit branch " + this.friendlyTitle(this.branch()) + ".",
                "forms" :[]
            };

            this.setupEditPage(el, page);

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.BranchEdit);

})(jQuery);