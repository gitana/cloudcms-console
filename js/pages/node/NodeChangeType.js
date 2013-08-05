(function($) {
    Gitana.Console.Pages.NodeChangeType = Gitana.CMS.Pages.AbstractFormPageGadget.extend({

        setup: function() {
            this.get("/repositories/{repositoryId}/branches/{branchId}/nodes/{nodeId}/changetype", this.index);
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

        setupBreadcrumb: function() {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Node(this), [
                {
                    "text" : "Change Type"
                }
            ]));
        },

        setupNodeTypeForm : function (el) {
            var self = this;

            self.clearDefinition();
            self.clearForm();

            var formHolder = $(el).find("#change-node-type-form");
            var button = $(el).find("#change-node-type-button");

            $(formHolder).alpaca({
                "schema": {
                    "type" : "object",
                    "properties" : {
                        "_type" : {
                            "title": "Node Type",
                            "type" : "string",
                            "default" : "n:node",
                            "required" : true
                        }
                    }
                },
                "options": {
                    "fields" : {
                        "_type" : {
                            "type": "select",
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

                                        var defaultTypeQName = self.node().getTypeQName();

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
                        }
                    }
                },
                "postRender": function(form) {

                    Gitana.Utils.UI.beautifyAlpacaForm(form);

                    // change type button
                    $(button).off().click(function() {

                        var formVal = form.getValue();

                        var typeQName = formVal._type;
                        if (typeQName)
                        {
                            self.changeNodeType(typeQName);
                        }

                    });


                }
            });
        },

        changeNodeType: function(typeQName)
        {
            var self = this;

            Gitana.Utils.UI.block("Updating Node Type...");

            self.node().changeTypeQName(typeQName).then(function() {
                var link = self.LINK().call(self, this);
                var callback = function() {
                    self.app().run("GET", link);
                };
                Gitana.Utils.UI.unblock(callback);
            });
        },

        setupForms : function (el) {

            this.setupNodeTypeForm(el);
        },

        setupPage: function(el) {

            var page = {
                "title" : "Change Node Type",
                "description" : "Change the type of this node.",
                "forms" :[
                    {
                        "id" : "change-node-type-form",
                        "title" : "Change Node Type",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'definition', 24),
                        "buttons" :[
                            {
                                "id" : "change-node-type-button",
                                "title" : "Change Node Type",
                                "isLeft" : true
                            }
                        ]
                    }
                ]
            };

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.NodeChangeType);

})(jQuery);