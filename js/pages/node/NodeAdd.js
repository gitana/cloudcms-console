(function($) {
    Gitana.Console.Pages.NodeAdd = Gitana.CMS.Pages.AbstractFormPageGadget.extend({

        schema: function() {

            return _mergeObject(this.base(), {
                "properties" : {
                    "tags": {
                        "title": "Tags",
                        "type": "string"
                    }
                }
            });
        },

        options: function() {

            return _mergeObject(this.base(), {
                "fields" : {
                    "title" : {
                        //"helper" : "Enter node title."
                    },
                    "description" : {
                        //"helper" : "Enter node description."
                    },
                    "tags" : {
                        "type" : "tag",
                        "size" : 60,
                        "helper" : "Enter tags separated by commas."
                    }
                }
            });
        },

        setup: function() {
            this.get("/repositories/{repositoryId}/add/node", this.index);
            this.get("/repositories/{repositoryId}/branches/{branchId}/add/node", this.index);
            this.get("/repositories/{repositoryId}/branches/{branchId}/nodes/{nodeId}/add/node", this.index);
        },

        targetObject: function() {
            return this.branch();
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
            this.menu(Gitana.Console.Menu.Branch(this, "menu-nodes"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Nodes(this), [
                {
                    "text" : "New Node"
                }
            ]));
        },

        setupNodeTypeForm : function (el) {
            var self = this;

            self.clearDefinition();
            self.clearForm();

            var doPickForm = function(formKey)
            {
                $("INPUT[value='" + formKey + "']").click();

                Chain(self.definition()).readForm(formKey).then(function() {
                    self.form(this);

                    var inputs = $("#node-add input");
                    if (inputs && inputs.length > 0)
                    {
                        $(inputs[0]).focus();
                    }
                });
            };

            $('body').undelegate('.type-picker select', 'change').delegate('.type-picker select', 'change', function() {

                var typeQName = $(this).val();
                if (typeQName) {
                    Chain(self.branch()).readDefinition(typeQName).then(function() {
                        var selectedType = this;
                        self.definition(selectedType);
                        self.clearForm();
                        $('.form-picker select').empty().append($("<option></option>")
                                .attr("value", "")
                                .text("None"));
                        var formIds = [];
                        var formLookup = {};
                        var formReverseLookup = {};

                        this.listFormAssociations().each(function() {
                            var formKey = this.getFormKey();
                            var formId = this.getTargetNodeId();
                            formIds.push(formId);
                            formLookup[formId] = {
                                "key" : formKey
                            };
                            formReverseLookup[formKey] = formId;
                        }).then(function() {
                            this.subchain(self.branch()).queryNodes({
                                "_doc" : {
                                    "$in" : formIds
                                }
                            }).each(function() {
                                var formNode = this;
                                formLookup[this.getId()]['title'] = this.getTitle() ?  formLookup[this.getId()]['key'] + " - " + this.getTitle() : formLookup[this.getId()]['key'];
                            });

                            this.then(function() {
                                var firstFormKey = null;
                                this.each(function() {
                                    var formKey = this.getFormKey();
                                    var formId = this.getTargetNodeId();
                                    $('.form-picker select').append($("<option></option>")
                                        .attr("value", formKey)
                                        .text(formLookup[formReverseLookup[formKey]]['title']));
                                    if (!firstFormKey) {
                                        firstFormKey = formKey;
                                    }
                                }).then(function() {

                                    if ($('.form-picker .ui-multiselect').length > 0) {
                                        $('.form-picker select').multiselect("refresh");
                                    } else {
                                        $('.form-picker select').multiselect({
                                            minWidth: 300,
                                            multiple: false,
                                            selectedList: 1,
                                            header: "Select Form"
                                        }).multiselectfilter();
                                    }

                                    $('body').trigger('swap',[this]);

                                    if (firstFormKey)
                                    {
                                        doPickForm(firstFormKey);
                                    }

                                });
                            });
                        });
                    });
                }
            });

            $('body').undelegate('.form-picker select', 'change').delegate('.form-picker select', 'change', function() {
                var formKey = $(this).val();
                if (formKey) {
                    doPickForm(formKey);
                } else {
                    self.clearForm();
                }
            });

            $('#form-pick', $(el)).alpaca({
                "schema": {
                    "type" : "object",
                    "properties" : {
                        "_type" : {
                            "title": "Node Type",
                            "type" : "string",
                            "default" : "n:node",
                            "required" : true
                        },
                        "_form" : {
                            "title": "Form",
                            "type" : "string"
                        }
                    }
                },
                "options": {
                    "fields" : {
                        "_type" : {
                            "type": "select",
                            "helper" : "Pick node type.",
                            "fieldClass" : "type-picker",
                            "dataSource" : function(field, callback) {
                                self.branch().listDefinitions('type').each(function() {
                                    var value = this.getQName();
                                    var text = value;
                                    if (this.getTitle()) {
                                        text += " - " + this.getTitle();
                                    }
                                    field.selectOptions.push({
                                        "value": value,
                                        "text": text
                                    });
                                }).then(function() {
                                    if (callback) {
                                        callback();

                                        //var defaultTypeQName = self.definition() ? self.definition().getQName() : "n:node";
                                        var defaultTypeQName = "n:node";

                                        field.field.val(defaultTypeQName).change();

                                        field.field.multiselect({
                                            minWidth: 300,
                                            multiple: false,
                                            selectedList: 1,
                                            header: "Select Node Type"
                                        }).multiselectfilter();


                                    }
                                });
                            }
                        },
                        "_form" : {
                            "type": "select",
                            "helper" : "Pick form.",
                            "fieldClass" : "form-picker multi"
                        }
                    }
                },
                "postRender": function(form) {

                    Gitana.Utils.UI.beautifyAlpacaForm(form);

                }
            });
        },

        createNode: function(formVal) {
            var self = this;
            Gitana.Utils.UI.block("Creating Node...");

            self.branch().createNode(formVal).then(function() {
                var link = self.LINK().call(self, this);
                var callback = function() {
                    self.app().run("GET", link);
                };
                Gitana.Utils.UI.unblock(callback);

            });
        },

        setupNodeAddForm : function (el) {
            var self = this;
            var formDiv = el ? $('#node-add',$(el)) : $('#node-add');

            var schema = self.schema();

            if (self.definition() && self.definition().properties)
            {
                if (Ratchet.countProperties(self.definition().properties) > 0)
                {
                    schema.properties = {};
                    schema = _mergeObject(schema, {
                        "properties" : self.definition().properties
                    });
                }
            }

            delete schema['title'];
            delete schema['description'];

            var options = self.options();

            if (self.form()) {
                options = _mergeObject(options, self.form());
            }

            options = JSON.parse(JSON.stringify(options));

            formDiv.empty().alpaca({
                "view": "VIEW_WEB_CREATE",
                "schema": schema,
                "options": options,
                "postRender": function(form) {

                    Gitana.Utils.UI.beautifyAlpacaForm(form, 'node-add-create', true);

                    $('body').trigger('form-rendered',[form.getEl()]);

                    // Add Buttons
                    $('#node-add-create').unbind( 'click' ).click(function() {

                        var formVal = form.getValue();

                        var tags = formVal['tags'];

                        if (tags && tags.length > 0) {
                            formVal['_features'] = {
                                'f:taggable':{}
                            }
                        } else {
                            delete formVal['tags'];
                        }

                        formVal['_type'] = $('.type-picker select').val();

                        if ($('.form-picker select').val()) {
                           formVal['_form'] = $('.form-picker select').val();
                        }

                        if (form.isValid(true)) {

                            self.createNode(formVal);
                        }
                    });
                }
            });
        },

        setupForms : function (el) {

            var self = this;

            this.setupNodeTypeForm(el);

            this.setupNodeAddForm(el);

            this.subscribe('form', function() {
                self.setupNodeAddForm();
            });
        },

        setupPage: function(el) {

            var page = {
                "title" : "New Node",
                "description" : "Create a new node of branch " + this.friendlyTitle(this.branch()) + ".",
                "forms" :[
                    {
                        "id" : "form-pick",
                        "title" : "Select Node Type and Form",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'definition', 24)
                    },
                    {
                        "id" : "node-add",
                        "title" : "Create A New Node",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'node-add', 24),
                        "buttons" :[
                            {
                                "id" : "node-add-create",
                                "title" : "Create Node",
                                "isLeft" : true
                            }
                        ]
                    }
                ]
            };

            this.page(_mergeObject(page,this.base(el)));

        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.NodeAdd);

})(jQuery);