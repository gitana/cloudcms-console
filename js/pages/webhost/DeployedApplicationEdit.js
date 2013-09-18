(function($) {
    Gitana.Console.Pages.DeployedApplicationEdit = Gitana.CMS.Pages.AbstractEditFormPageGadget.extend(
    {
        EDIT_URI: [
            "/webhosts/{webhostId}/deployedapplications/{deployedApplicationId}/edit"
        ],

        EDIT_JSON_URI: [
            "/webhosts/{webhostId}/deployedapplications/{deployedApplicationId}/edit/json"
        ],

        targetObject: function() {
            return this.deployedApplication();
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
            return Alpaca.merge({}, Gitana.Console.Schema.DeployedApplication);
        },

        options: function() {
            return Alpaca.merge({}, Gitana.Console.Options.DeployedApplication);
        },


        setupMenu: function() {
            this.menu(Gitana.Console.Menu.DeployedApplication(this));
        },

        setupBreadcrumb: function(el) {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.DeployedApplication(this), [
                {
                    "text" : this.isEditJSONUri(el) ? 'Edit JSON' : "Edit"
                }
            ]));
        },

        setupEditForm: function (el, callback) {
            var self = this;
            var deployedApplication = self.targetObject();
            var defaultData = this.populateObject([
                "title",
                "description"
            ], deployedApplication);

            $('#deployed-application-edit', $(el)).alpaca({
                "data": defaultData,
                "schema": self.schema(),
                "options": self.options(),
                "postRender": function(form) {
                    Gitana.Utils.UI.beautifyAlpacaForm(form, 'deployed-application-edit-save', true);
                    // Add Buttons
                    $('#deployed-application-edit-save', $(el)).click(function() {
                        var formVal = form.getValue();
                        if (form.isValid(true)) {
                            Gitana.Utils.UI.block("Updating Deployed Application...");
                            _mergeObject(deployedApplication,formVal);
                            deployedApplication.update().then(function() {
                                Gitana.Utils.UI.unblock(function() {
                                    self.app().run('GET', self.LINK().call(self,self.targetObject()));
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
                "title": "Edit Deployed Application",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'deployed-application-edit', 48),
                "url" : this.LINK().call(this,this.targetObject(), 'edit')
            };
        },

        editPageConfig: function() {
            return {
                "id" : "deployed-application-edit",
                "title" : "Edit Deployed Application",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'deployed-application-edit', 24),
                "buttons" :[
                    {
                        "id" : "deployed-application-edit-save",
                        "title" : "Save Deployed Application",
                        "isLeft" : true
                    }
                ]
            };
        },

        setupPage: function(el) {

            var page = {
                "title" : "Edit Deployed Application",
                "description" : "Edit Deployed Application " + this.friendlyTitle(this.webhost()) + ".",
                "forms" :[]
            };

            this.setupEditPage(el, page);

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.DeployedApplicationEdit);

})(jQuery);