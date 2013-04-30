(function($) {
    Gitana.Console.Pages.NodeEdit = Gitana.CMS.Pages.AbstractEditFormPageGadget.extend(
    {
        EDIT_URI: [
            "/repositories/{repositoryId}/branches/{branchId}/nodes/{nodeId}/edit"
        ],

        EDIT_JSON_URI: [
            "/repositories/{repositoryId}/branches/{branchId}/nodes/{nodeId}/edit/json"
        ],

        schema: function() {
            return Alpaca.mergeObject(this.base(), {
                "properties": {
                    "tags": {
                        "title": "Tags",
                        "type": "string"
                    }
                }
            });
        },

        options: function() {
            return Alpaca.mergeObject(this.base(), {
                "fields" : {
                    "title" : {
                        "helper" : "Enter node title."
                    },
                    "description" : {
                        "helper" : "Enter node description."
                    },
                    "tags" : {
                        "type" : "tag",
                        "size" : 60,
                        "helper" : "Enter tags separated by commas."
                    }
                }
            });
        },

        targetObject: function() {
            return this.node();
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
            this.menu(Gitana.Console.Menu.Node(this));
        },

        setupBreadcrumb: function(el) {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Node(this), [
                {
                    "text" : this.isEditJSONUri(el) ? 'Edit JSON' : "Edit"
                }
            ]));
        },

        _setupEditForm: function (editDiv, saveButton, node, defaultData, schema, options, mimeType) {
            var self = this;

            editDiv.empty().alpaca({
                "data": defaultData,
                "schema": schema,
                "options": options,
                "postRender": function(form) {
                    Gitana.Utils.UI.beautifyAlpacaForm(form, 'node-edit-save', true);

                    $('body').trigger('form-rendered',[form.getEl()]);

                    // Add Buttons
                    saveButton.click(function() {
                        var formVal = form.getValue();
                        if (form.isValid(true)) {

                            Gitana.Utils.UI.block("Updating node...");

                            var nodeBody = formVal['body'];

                            if (nodeBody) {
                                delete formVal['body'];
                            }

                            if ($('.form-picker select').val()) {
                                formVal['_form'] = $('.form-picker select').val();
                            }

                            Alpaca.mergeObject(node,formVal);

                            var tags = formVal['tags'];

                            if (node.getFeature('f:taggable') == null) {
                                if (tags && tags.length > 0) {
                                    node.addFeature('f:taggable', {});
                                } else {
                                    delete formVal['tags'];
                                }
                            }

                            node.update().then(function() {

                                var updatedNode = this;

                                var link = self.LINK().call(self,updatedNode);

                                var callback = function() {
                                    self.app().run("GET", link);
                                };

                                if (Alpaca.isValEmpty(nodeBody)) {
                                    Gitana.Utils.UI.unblock(callback);
                                } else {
                                    this.attach("default", mimeType, nodeBody).then(function() {
                                        Gitana.Utils.UI.unblock(callback);
                                    });
                                }

                            });
                        }
                    });
                    resetButton.click(function() {
                        form.setValue(defaultData);
                    });
                }
            });
        },

        setupEditForm: function (el) {

            var self = this;

            var node = self.targetObject();

            var defaultData = Alpaca.cloneObject(node);

            var schema = self.schema();

            var options = self.options();

            if (self.definition() && self.definition().properties) {
                schema = Alpaca.mergeObject(schema, {
                    "properties" : self.definition().properties
                });
            }

            delete schema['title'];
            delete schema['description'];

            var options = self.options();

            if (self.form()) {
                options = Alpaca.mergeObject(options, self.form());
            }

            var editDiv = el ? $('#node-edit', $(el)) : $('#node-edit');

            var saveButton = el ? $('#node-edit-save', $(el)) : $('#node-edit-save');

            Chain(node).listAttachments().trap(function() {

                self._setupEditForm(editDiv, saveButton, node, defaultData, schema, options);

                return false;

            }).select('default').then(function() {

                var mimeType = this.getContentType();

                if (mimeType == "text/plain" || mimeType == "text/html") {

                    schema = Alpaca.mergeObject(schema, {
                        "properties" : {
                            "body" : {
                                "title": "Node Body",
                                "type" : "string"
                            }
                        }
                    });

                    options = Alpaca.mergeObject(options, {
                        "fields" : {
                            "body" : {
                                "type" :  mimeType == "text/plain" ? "textarea" : "elrte",
                                "helper" : "Enter node body.",
                                "cols" : 60,
                                "rows" : 8
                            }
                        }
                    });

                    $.ajax({
                        "url": this.getDownloadUri(),
                        "type": "get",
                        "dataType": "text",
                        "success": function(doc) {
                            defaultData['body'] = doc;
                            self._setupEditForm(editDiv, saveButton, node, defaultData, schema, options, mimeType);
                        },
                        "error": function(jqXHR, textStatus, errorThrown) {
                            self._setupEditForm(editDiv, saveButton, node, defaultData, schema, options, mimeType);
                        }
                    });

                } else {

                    self._setupEditForm(editDiv, saveButton, node, defaultData, schema, options);
                }

            });

        },

        setupEditFormSelectionForm : function (el) {
            var self = this;

            $('body').undelegate('.form-picker select', 'change').delegate('.form-picker select', 'change', function() {
                var formKey = $(this).val();
                if (formKey) {
                    Chain(self.definition()).readForm(formKey).then(function() {
                        self.form(this);
                    });
                } else {
                    self.clearForm();
                }
            });

            $('#form-pick', $(el)).alpaca({
                "schema": {
                    "type" : "object",
                    "properties" : {
                        "_form" : {
                            "title": "Form",
                            "type" : "string"
                        }
                    }
                },
                "options": {
                    "fields" : {
                        "_form" : {
                            "type": "select",
                            "helper" : "Pick form.",
                            "fieldClass" : "form-picker",
                            "dataSource" : function(field, callback) {

                                var formIds = [];
                                var formLookup = {};
                                var formReverseLookup = {};

                                self.branch().readDefinition(self.targetObject().getTypeQName()).then(function() {
                                    self.definition(this);
                                }).listFormAssociations().each(function() {
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
                                            formLookup[this.getId()]['title'] = this.getTitle() ? formLookup[this.getId()]['key'] + " - " + this.getTitle() : formLookup[this.getId()]['key'];
                                    });

                                    this.then(function() {
                                        this.each(function() {
                                            var formKey = this.getFormKey();
                                            field.selectOptions.push({
                                                "value": formKey,
                                                "text": formLookup[formReverseLookup[formKey]]['title']
                                            });
                                        }).then(function() {
                                                if (callback) {
                                                    callback();

                                                    var defaultFormKey = self.targetObject().get('_form');

                                                    if (defaultFormKey) {
                                                        field.field.val(defaultFormKey).change();
                                                    } else {
                                                        self.clearForm();
                                                    }

                                                }

                                                if ($('.ui-multiselect', field.getEl()).length > 0) {
                                                    field.field.multiselect("refresh");
                                                } else {
                                                    field.field.multiselect({
                                                        minWidth: '300',
                                                        multiple: false,
                                                        selectedList: 1,
                                                        header: "Select Form"
                                                    }).multiselectfilter();
                                                }
                                        });
                                    });
                                });
                            }
                        }
                    }
                },
                "postRender": function(form) {

                    Gitana.Utils.UI.beautifyAlpacaForm(form);

                }
            });
        },

        editButtonConfig: function() {
            return  {
                "id": "edit",
                "title": "Edit Node",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'node-edit', 48),
                "url" : this.link(this.targetObject(), 'edit')
            };
        },

        editPageConfig: function() {
            return {
                "id" : "node-edit",
                "title" : "Edit Node",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'node-edit', 24),
                "buttons" :[
                    {
                        "id" : "node-edit-save",
                        "title" : "Save Node",
                        "isLeft" : true
                    }
                ]
            };
        },

        setupForms: function (el) {
            var self = this;
            if (!this.isEditJSONUri(el)) {
                this.setupEditFormSelectionForm(el);
            }
            this.subscribe('form', function() {
                self.setupEditForm();
            });
            this.base(el);
        },

        setupPage: function(el) {

            var page = {
                "title" : "Edit Node",
                "description" : "Edit node " + this.friendlyTitle(this.targetObject()) + ".",
                "forms" :[]
            };

            this.clearDefinition();

            this.clearForm();

            this.setupEditPage(el, page);

            if (!this.isEditJSONUri(el)) {
                page['forms'].splice(0,0,{
                    "id" : "form-pick",
                    "title" : "Select Node Edit Form",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'form', 24)
                });
            }

            this.page(Alpaca.mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.NodeEdit);

})(jQuery);