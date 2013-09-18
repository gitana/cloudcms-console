(function($) {
    Gitana.Console.Pages.PlanAdd = Gitana.CMS.Pages.AbstractFormPageGadget.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        schema: function() {
            return _mergeObject(this.base(), {
                "properties" : {
                    "planKey" : {
                        "type" : "string",
                        "title" : "Plan Key",
                        "required" : true,
                        "default" : "plan " +  new Date().getTime()
                    }
                }
            });
        },

        options: function() {

            var self = this;

            var options = _mergeObject(this.base(), {
                "fields" : {
                    "title" : {
                        "helper" : "Enter plan title."
                    },
                    "description" : {
                        "helper" : "Enter plan description."
                    },
                    "planKey" : {
                        "helper": "Enter a unique plan key."
                    }
                }
            });

            options['fields']['planKey']['validator'] = function(control, callback) {
                var controlVal = control.getValue();
                Chain(self.targetObject()).trap(function(error) {
                    if (error.status && error.status == '404') {
                        callback({
                            "message": "Valid plan key.",
                            "status": true
                        });
                    } else {
                        //TODO : after we fix the http status error issue.
                        /*
                         callback({
                         "message": "Invalid plan key.",
                         "status": false
                         });
                         */
                        callback({
                            "message": "Valid plan key.",
                            "status": true
                        });
                    }
                }).readPlan(controlVal).then(function() {
                    callback({
                        "message": "Plan key not unique.",
                        "status": false
                    });
                });
            };

            return options;
        },

        setup: function() {
            this.get("/registrars/{registrarId}/add/plan", this.index);
        },

        targetObject: function() {
            return this.registrar();
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
            this.menu(Gitana.Console.Menu.Registrar(this, "menu-registrar-plans"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Plans(this), [
                {
                    "text" : "New Plan"
                }
            ]));
        },

        setupPlanAddForm : function (el, callback) {
            var self = this;
            $('#plan-add', $(el)).alpaca({
                "view": "VIEW_WEB_CREATE",
                "data": {},
                "schema": self.schema(),
                "options": self.options(),
                "postRender": function(form) {
                    Gitana.Utils.UI.beautifyAlpacaForm(form, 'plan-add-create', true);
                    // Add Buttons
                    $('#plan-add-create', $(el)).click(function() {
                        var formVal = form.getValue();
                        if (form.isValid(true)) {

                            Gitana.Utils.UI.block("Creating Plan...");

                            self.targetObject().createPlan(formVal).then(function() {
                                var newPlan = this;
                                Gitana.Utils.UI.unblock(function() {
                                    self.app().run('GET', self.LINK().call(self,newPlan));
                                });
                            });
                        }
                    });

                    callback();
                }
            });
        },

        setupForms : function (el, callback) {
            this.setupPlanAddForm(el, callback);
        },

        setupPage : function(el) {

            var page = {
                "title" : "New Plan",
                "description" : "Create a new plan.",
                "forms" :[{
                    "id" : "plan-add",
                    "title" : "Create A New Plan",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'plan-add', 24),
                    "buttons" :[
                        {
                            "id" : "plan-add-create",
                            "title" : "Create Plan",
                            "isLeft" : true
                        }
                    ]
                }]
            };

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.PlanAdd);

})(jQuery);