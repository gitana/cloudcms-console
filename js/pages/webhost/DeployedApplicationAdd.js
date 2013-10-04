(function($) {
    Gitana.Console.Pages.DeployedApplicationAdd = Gitana.CMS.Pages.AbstractFormPageGadget.extend(
        {
            schema: function() {
                var schema = Alpaca.merge({}, Gitana.Console.Schema.DeployedApplication);

                // remove a few proeprties that we don't care about while creating
                delete schema.properties["deploymentWebhost"];
                delete schema.properties["host"];
                delete schema.properties["urls"];

                return schema;
            },

            options: function() {
                var options = Alpaca.merge({}, Gitana.Console.Options.DeployedApplication);

                // use application picker for the application id
                options.fields["applicationId"].type = "gitanaapplicationpicker";
                options.fields["applicationId"].platform = this.platform();

                // remove a few fields that we don't care about while creating
                delete options.fields["deploymentWebhost"];
                delete options.fields["host"];
                delete options.fields["urls"];

                return options;
            },

            targetObject: function() {
                return this.webhost();
            },

            requiredAuthorities: function() {
                return [
                    {
                        "permissioned" : this.targetObject(),
                        "permissions" : ["create_subobjects"]
                    }
                ];
            },

            setup: function() {
                this.get("/webhosts/{webhostId}/add/deployedapplication", this.index);
            },

            setupMenu: function() {
                this.menu(Gitana.Console.Menu.Webhost(this, "menu-webhost-deployed-applications"));
            },

            setupBreadcrumb: function() {
                return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.DeployedApplications(this), [
                    {
                        "text" : "Deploy an Application"
                    }
                ]));
            },

            setupDeployedApplicationAddForm : function (el, callback) {
                var self = this;
                $('#deployed-application-add', $(el)).alpaca({
                    "view": "VIEW_WEB_CREATE",
                    "data": {},
                    "schema": self.schema(),
                    "options": self.options(),
                    "postRender": function(form) {
                        Gitana.Utils.UI.beautifyAlpacaForm(form, 'deployed-application-add-create', true);

                        // when the application changes, update the deployment keys selector
                        $(form.childrenByPropertyId["applicationId"].field).change(function() {

                            // read the application
                            var applicationId = $(this).val();
                            self.platform().readApplication(applicationId).then(function() {

                                form.childrenByPropertyId["deploymentKey"].schema["enum"] = [];
                                form.childrenByPropertyId["deploymentKey"].options.optionLabels = [];

                                var firstDeploymentKey = null;
                                for (var deploymentKey in this.deployments)
                                {
                                    if (!firstDeploymentKey)
                                    {
                                        firstDeploymentKey = deploymentKey;
                                    }

                                    form.childrenByPropertyId["deploymentKey"].schema["enum"].push(deploymentKey);
                                    form.childrenByPropertyId["deploymentKey"].options.optionLabels.push(deploymentKey);
                                }

                                if (firstDeploymentKey)
                                {
                                    form.childrenByPropertyId["deploymentKey"].setValue(firstDeploymentKey);
                                }

                                var x = form.childrenByPropertyId["deploymentKey"].getValue();

                                form.childrenByPropertyId["deploymentKey"].render();
                            });
                        });

                        // Add Buttons
                        $('#deployed-application-add-create', $(el)).click(function() {

                            form.showHiddenMessages();

                            var formVal = form.getValue();
                            if (form.isValid(true)) {

                                var applicationId = formVal['applicationId'];
                                var deploymentKey = formVal['deploymentKey'];

                                Gitana.Utils.UI.block("Deploying Application...");

                                self.platform().readApplication(applicationId).then(function() {
                                    this.deploy(deploymentKey).then(function() {
                                        var newDeployedApplication = this;
                                        Gitana.Utils.UI.unblock(function() {
                                            var link = self.link(newDeployedApplication);
                                            self.refresh(link);
                                        });
                                    });
                                });
                            }
                        });

                        callback();
                    }
                });
            },

            setupForms : function (el, callback) {
                this.setupDeployedApplicationAddForm(el, callback);
            },

            setupPage : function(el) {

                var page = {
                    "title" : "Deploy an Application",
                    "description" : "Deploy an application on webhost " + this.friendlyTitle(this.targetObject()) + ".",
                    "forms" :[
                        {
                            "id" : "deployed-application-add",
                            "title" : "Deploy an Application",
                            "icon" : Gitana.Utils.Image.buildImageUri('objects', 'deployed-application-add', 24),
                            "buttons" :[
                                {
                                    "id" : "deployed-application-add-create",
                                    "title" : "Deploy Application",
                                    "isLeft" : true
                                }
                            ]
                        }
                    ]
                };

                this.page(_mergeObject(page, this.base(el)));
            }

        });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.DeployedApplicationAdd);

})(jQuery);