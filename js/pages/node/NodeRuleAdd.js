(function($) {
    Gitana.Console.Pages.NodeRuleAdd = Gitana.CMS.Pages.AbstractFormPageGadget.extend(
    {
        SUBSCRIPTION : "node-rule-add",

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        definitions: function(callback)
        {
            Gitana.Utils.Node.loadDefinitions(this.branch(), function(definitions) {
                callback(definitions);
            }, this, false);
        },

        policies: function(callback)
        {
            Gitana.Utils.Node.loadPolicies(function(policies) {
                callback(policies);
            });
        },

        schema: function(callback) {

            var self = this;

            self.definitions(function(definitions) {
                self.policies(function(policies) {

                    callback({
                        "type": "object",
                        "properties" : {
                            "title": {
                                "title": "Title",
                                "type": "string",
                                "required": true
                            },
                            "description": {
                                "title": "Description",
                                "type": "string"
                            },
                            "event": {
                                "title": "Event",
                                "type": "object",
                                "properties": {
                                    "policy": {
                                        "type": "string",
                                        "enum": policies.allKeys,
                                        "default": "p:afterUpdateNode",
                                        "required": true
                                    }/*,
                                     "scope": {
                                     "type": "number",
                                     "default": 0,
                                     "enum": [0, 1]
                                     }*/
                                }
                            },
                            "conditions" : {
                                "type" : "array",
                                "minItems": 1,
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "_key": {
                                            "title": "Condition ID",
                                            "type": "string"
                                        },
                                        "type": {
                                            "title": "Condition Type",
                                            "type": "string",
                                            "enum": ["propertyEquals", "typeEquals"]
                                        },
                                        "config": {
                                            "title": "Condition Configuration",
                                            "type": "object"
                                        }
                                    }
                                }
                            },
                            "actions" : {
                                "type" : "array",
                                "minItems": 1,
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "_key": {
                                            "title": "Action ID",
                                            "type": "string"
                                        },
                                        "type": {
                                            "title": "Action Type",
                                            "type": "string",
                                            "enum": ["executeScriptNode", "mapToList"]
                                        },
                                        "config": {
                                            "title": "Action Configuration",
                                            "type": "object"
                                        }
                                    }
                                }
                            }
                        }
                    });
                });
            });
        },

        options: function(callback) {

            var self = this;

            self.definitions(function(definitions) {
                self.policies(function(policies) {

                    callback({
                        "fields" : {
                            "title" : {
                                "hideInitValidationError": true,
                                "size" : 60
                            },
                            "description": {
                                "type": "textarea",
                                "cols" : 60
                            },
                            "event": {
                                "label": "Event",
                                "helper": "When does this rule trigger?",
                                "fields": {
                                    "policy": {
                                        "type": "select",
                                        "hideInitValidationError": true,
                                        "label": "Policy",
                                        "helper": "The policy that is intercepted.",
                                        "optionLabels": policies.allLabels
                                    }/*,
                                     "scope": {
                                     "type": "select",
                                     "label": "Scope",
                                     "helper": "Whether the policy intercepts for a class or instance scope.",
                                     "optionLabels": ["Instance", "Class"]
                                     }
                                     */
                                }
                            },
                            "conditions": {
                                "addItemLabel": "Add Condition",
                                "type": "rule-conditions",
                                "label": "Conditions",
                                "helper": "Define the conditions that must trigger in order for this rule to execute.",
                                "toolbarSticky": true,
                                "fields": {
                                    "item": {
                                        "type": "rule-condition",
                                        "fields": {
                                            "_key": {
                                                "type": "text"
                                            },
                                            "type": {
                                                "type": "select",
                                                "optionLabels": {
                                                    "propertyEquals": "Property Equals",
                                                    "typeEquals": "Type Equals"
                                                }
                                            },
                                            "config": {
                                                "type": "editor",
                                                "aceMode": "ace/mode/json",
                                                "aceFitContentHeight": true
                                            }
                                        }
                                    }
                                }
                            },
                            "actions": {
                                "addItemLabel": "Add Action",
                                "type": "rule-actions",
                                "label": "Actions",
                                "helper": "When this condition triggers, the following actions will execute.",
                                "toolbarSticky": true,
                                "fields": {
                                    "item": {
                                        "type": "rule-action",
                                        "fields": {
                                            "_key": {
                                                "type": "text"
                                            },
                                            "type": {
                                                "type": "select",
                                                "optionLabels": {
                                                    "executeScriptNode": "Execute Script Node",
                                                    "mapToList": "Map To List"
                                                }
                                            },
                                            "config": {
                                                "type": "editor",
                                                "aceMode": "ace/mode/json",
                                                "aceFitContentHeight": true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    });
                });
            });
        },

        setup: function() {
            this.get("/repositories/{repositoryId}/branches/{branchId}/nodes/{nodeId}/add/rule", this.index);
        },

        targetObject: function() {
            return this.node();
        },

        requiredAuthorities: function() {
            return [{
                "permissioned" : this.targetObject(),
                "permissions" : ["create_subobjects"]
            }];
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Node(this,"menu-node-rules"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.NodeRules(this), [{
                "text" : "New Rule"
            }]));
        },

        setupToolbar: function() {
            var self = this;
            self.base();
            self.addButtons([]);
        },

        asyncSetupForms : function(el, callback) {
            var self = this;

            self.schema(function(schema) {

                self.options(function(options) {

                    $(el).find("#node-rule-add").alpaca({
                        "data": {},
                        "schema": schema,
                        "options": options,
                        "view": {
                            "parent": "VIEW_WEB_EDIT_LIST",
                            "layout": {
                                "template": "./templates/wizards/rule-wizard-template.html",
                                "bindings": {
                                    "title": "alpaca-wizard-step-1",
                                    "description": "alpaca-wizard-step-1",
                                    "event": "alpaca-wizard-step-2",
                                    "conditions": "alpaca-wizard-step-3",
                                    "actions": "alpaca-wizard-step-4"
                                }
                            },
                            "wizard": {
                                "renderWizard": true,
                                "statusBar": true
                            }
                        },
                        "postRender": function(form) {

                            Gitana.Utils.UI.beautifyAlpacaForm(form, 'node-rule-add-create', true);

                            $('#node-rule-add').find(".alpaca-wizard-button-done").click(function() {

                                var formVal = form.getValue();
                                if (form.isValid(true)) {
                                    Gitana.Utils.UI.block("Creating Rule...");

                                    var nodeObject = {};
                                    nodeObject.title = formVal.title;
                                    nodeObject.description = formVal.description;
                                    nodeObject.conditions = formVal.conditions;
                                    nodeObject.actions = formVal.actions;
                                    nodeObject._type = "n:rule";

                                    var policyQName = formVal.event.policy;
                                    //var scope = formVal.binding.scope;
                                    var scope = 0; // 0 = instance, 1 = class

                                    // create the rule (node)
                                    Chain(self.branch()).then(function() {

                                        var ruleNode = null;
                                        this.createNode(nodeObject).then(function() {
                                            ruleNode = this;
                                        });

                                        this.then(function() {
                                            this.subchain(self.node()).associate(ruleNode, {
                                                "_type": "a:has_behavior",
                                                "policy": policyQName,
                                                "scope": scope
                                            }).then(function() {

                                                var link = self.LINK().call(self, self.node()) + "/rules";

                                                Gitana.Utils.UI.unblock(function() {
                                                    self.app().run("GET", link);
                                                });
                                            });
                                        });
                                    });

                                }

                            });
                        }
                    });

                    callback();
                });

            });

        },

        setupPage : function(el) {

            var page = {
                "title" : "New Rule",
                "description" : "Create a new rule for node '" + this.friendlyTitle(this.node()) + "'.",
                "listTitle" : "Rule List",
                "listIcon" : Gitana.Utils.Image.buildImageUri('objects', 'rule', 20),
                "subscription" : this.SUBSCRIPTION,
                "forms" :[{
                    "id" : "node-rule-add",
                    "title" : "Create A New Rule",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'rule-add', 24)
                }]
            };

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.NodeRuleAdd);

})(jQuery);