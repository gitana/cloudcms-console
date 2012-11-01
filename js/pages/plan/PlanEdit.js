(function($) {
    Gitana.Console.Pages.PlanEdit = Gitana.CMS.Pages.AbstractEditFormPageGadget.extend(
    {
        EDIT_URI: [
            "/registrars/{registrarId}/plans/{planId}/edit"
        ],

        EDIT_JSON_URI: [
            "/registrars/{registrarId}/plans/{planId}/edit/json"
        ],

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        targetObject: function() {
            return this.plan();
        },

        contextObject: function() {
            return this.registrar();
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
            return Alpaca.mergeObject(this.base(), {
                "properties" : {
                    "planKey" : {
                        "type" : "string",
                        "title" : "Plan Key",
                        "required" : true,
                        "default" : "plan " +  new Date().getTime()
                    },
                    "requiresBilling": {
                        "type": "boolean",
                        "title": "Requires Billing",
                        "required": true,
                        "default": false
                    },
                    "base": {
                        "title": "Base Pricing",
                        "properties": {
                            "price": {
                                "type": "number",
                                "title": "Price",
                                "required": false
                            },
                            "schedule": {
                                "type": "string",
                                "title": "Schedule",
                                "required": false,
                                "enum" : ["NONE", "ONETIME", "MONTHLY", "ANNUALLY"]
                            }
                        }
                    },
                    "storage": {
                        "title": "Storage Pricing",
                        "properties": {
                            "unit": {
                                "type": "string",
                                "title": "Unit",
                                "required": false,
                                "enum" : ["MB", "GB"],
                                "default": "GB"
                            },
                            "allowance": {
                                "type": "number",
                                "title": "Allowance",
                                "required": false
                            },
                            "max": {
                                "type": "number",
                                "title": "Max",
                                "required": false
                            },
                            "requiresBilling": {
                                "type": "string",
                                "title": "Requires Billing",
                                "required": false
                            },
                            "billingKey": {
                                "type": "string",
                                "title": "Billing Key",
                                "required": false
                            }
                        }
                    },
                    "transferOut": {
                        "title": "Transfer Out Pricing",
                        "properties": {
                            "unit": {
                                "type": "string",
                                "title": "Unit",
                                "required": false,
                                "enum" : ["MB", "GB"],
                                "default": "GB"
                            },
                            "allowance": {
                                "type": "number",
                                "title": "Allowance",
                                "required": false
                            },
                            "max": {
                                "type": "number",
                                "title": "Max",
                                "required": false
                            },
                            "requiresBilling": {
                                "type": "string",
                                "title": "Requires Billing",
                                "required": false
                            },
                            "billingKey": {
                                "type": "string",
                                "title": "Billing Key",
                                "required": false
                            }
                        }
                    }
                }
            });
        },

        options: function() {

            var self = this;

            var options = Alpaca.mergeObject(this.base(), {
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
                if (controlVal != self.targetObject().getPlanKey()) {
                    Chain(self.contextObject()).trap(
                        function(error) {
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
                } else {
                    callback({
                        "message": "Plan key not changed.",
                        "status": true
                    });
                }
            };

            return options;
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Plan(this));
        },

        setupBreadcrumb: function(el) {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Plan(this), [
                {
                    "text" : this.isEditJSONUri(el) ? 'Edit JSON' : "Edit"
                }
            ]));
        },

        setupEditForm: function (el) {
            var self = this;
            var plan = self.targetObject();
            var defaultData = this.populateObject(["title","description","planKey","requiresBilling","base","storage","transferOut"],plan);
            $('#plan-edit', $(el)).alpaca({
                "data": defaultData,
                "schema": self.schema(),
                "options": self.options(),
                "postRender": function(form) {
                    Gitana.Utils.UI.beautifyAlpacaForm(form, 'plan-edit-save', true);
                    // Add Buttons
                    $('#plan-edit-save', $(el)).click(function() {
                        var formVal = form.getValue();
                        if (form.isValid(true)) {
                            Gitana.Utils.UI.block("Updating Plan ...");
                            plan.replacePropertiesWith(formVal);
                            plan.update().then(function() {
                                Gitana.Utils.UI.unblock(function() {
                                    self.app().run('GET', self.LINK().call(self,self.targetObject()));
                                });
                            });
                        }
                    });
                    $('#plan-edit-reset', $(el)).click(function() {
                        form.setValue(defaultData);
                    });
                }
            });
        },

        editButtonConfig: function() {
            return  {
                "id": "edit",
                "title": "Edit Plan",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'plan-edit', 48),
                "url" : this.LINK().call(this,this.targetObject(), 'edit')
            };
        },

        editPageConfig: function() {
            return {
                "id" : "plan-edit",
                "title" : "Edit Plan",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'plan-edit', 24),
                "buttons" :[
                    {
                        "id" : "plan-edit-reset",
                        "title" : "Reset"
                    },
                    {
                        "id" : "plan-edit-save",
                        "title" : "Save Plan",
                        "isLeft" : true
                    }
                ]
            };
        },

        setupPage: function(el) {

            var page = {
                "title" : "Edit Plan",
                "description" : "Edit plan " + this.friendlyTitle(this.plan()) + ".",
                "forms" :[]
            };

            this.setupEditPage(el, page);

            this.page(Alpaca.mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.PlanEdit);

})(jQuery);