(function($) {
    Gitana.Console.Pages.StackAdd = Gitana.CMS.Pages.AbstractFormPageGadget.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        schema: function() {
            return {
                "type": "object",
                "properties": {
                    "title": {
                        "title": "Title",
                        "type": "string",
                        "required": true
                    },
                    "description": {
                        "title": "Description",
                        "type": "string"
                    },
                    "key": {
                        "title": "Key",
                        "type": "string"
                    }
                }
            }
        },

        options: function() {

            return _mergeObject(this.base(), {
                "fields" : {
                    "title" : {
                        //"helper" : "Enter stack title."
                    },
                    "description" : {
                        //"helper" : "Enter stack description."
                    },
                    "key": {
                        //"helper": "Enter stack key."
                        "helper": "Please provide a unique key for your stack."
                    }
                }
            });
        },

        setup: function() {
            this.get("/add/stack", this.index);
        },

        targetObject: function() {
            return this.platform();
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
            this.menu(Gitana.Console.Menu.Platform(this, "menu-platform-stacks"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Stacks(this), [
                {
                    "text" : "New Stack"
                }
            ]));
        },

        setupStackAddForm : function (el) {
            var self = this;
            $('#stack-add', $(el)).alpaca({
                "view": "VIEW_WEB_CREATE",
                "data": {},
                "schema": self.schema(),
                "options": self.options(),
                "postRender": function(form) {
                    Gitana.Utils.UI.beautifyAlpacaForm(form, 'stack-add-create', true);
                    // Add Buttons
                    $('#stack-add-create', $(el)).click(function() {
                        var formVal = form.getValue();
                        if (form.isValid(true)) {

                            Gitana.Utils.UI.block("Creating Stack...");

                            self.targetObject().createStack(formVal).then(function() {

                                var newStack = this;
                                Gitana.Utils.UI.unblock(function() {
                                    self.app().run('GET', self.LINK().call(self,newStack));
                                });

                            });
                        }
                    });
                }
            });
        },

        setupForms : function (el) {
            this.setupStackAddForm(el);
        },

        setupPage : function(el) {

            var page = {
                "title" : "New Stack",
                "description" : "Create a new stack.",
                "forms" :[{
                    "id" : "stack-add",
                    "title" : "Create A New Stack",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'stack-add', 24),
                    "buttons" :[
                        {
                            "id" : "stack-add-create",
                            "title" : "Create Stack",
                            "isLeft" : true
                        }
                    ]
                }]
            };

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.StackAdd);

})(jQuery);