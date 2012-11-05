(function($) {
    Gitana.Console.Pages.StackEdit = Gitana.CMS.Pages.AbstractEditFormPageGadget.extend(
    {
        EDIT_URI: [
            "/stacks/{stackId}/edit"
        ],

        EDIT_JSON_URI: [
            "/stacks/{stackId}/edit/json"
        ],

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        targetObject: function() {
            return this.stack();
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
            return {
                "type": "object",
                "properties": {
                    "title": {
                        "title": "Title",
                        "type": "string"
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

            return Alpaca.mergeObject(this.base(), {
                "fields" : {
                    "title" : {
                        "helper" : "Enter stack title."
                    },
                    "description" : {
                        "helper" : "Enter stack description."
                    },
                    "key": {
                        "helper": "Enter stack key."
                    }
                }
            });
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Stack(this));
        },

        setupBreadcrumb: function(el) {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Stack(this), [
                {
                    "text" : this.isEditJSONUri(el) ? 'Edit JSON' : "Edit"
                }
            ]));
        },

        setupEditForm: function (el) {
            var self = this;
            var stack = self.targetObject();
            var defaultData = Alpaca.cloneObject(stack.object);
            $('#stack-edit', $(el)).alpaca({
                "data": defaultData,
                "schema": self.schema(),
                "options": self.options(),
                "postRender": function(form) {
                    Gitana.Utils.UI.beautifyAlpacaForm(form, 'stack-edit-save', true);
                    // Add Buttons
                    $('#stack-edit-save', $(el)).click(function() {
                        var formVal = form.getValue();
                        if (form.isValid(true)) {
                            Gitana.Utils.UI.block("Updating Stack ...");
                            stack.replacePropertiesWith(formVal);
                            stack.update().then(function() {
                                Gitana.Utils.UI.unblock(function() {
                                    self.app().run('GET', self.LINK().call(self,self.targetObject()));
                                });
                            });
                        }
                    });
                    $('#stack-edit-reset', $(el)).click(function() {
                        form.setValue(defaultData);
                    });
                }
            });
        },

        editButtonConfig: function() {
            return  {
                "id": "edit",
                "title": "Edit Stack",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'stack-edit', 48),
                "url" : this.LINK().call(this,this.targetObject(), 'edit')
            };
        },

        editPageConfig: function() {
            return {
                "id" : "stack-edit",
                "title" : "Edit Stack",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'stack-edit', 24),
                "buttons" :[
                    {
                        "id" : "stack-edit-reset",
                        "title" : "Reset"
                    },
                    {
                        "id" : "stack-edit-save",
                        "title" : "Save Stack",
                        "isLeft" : true
                    }
                ]
            };
        },

        setupPage: function(el) {

            var page = {
                "title" : "Edit Stack",
                "description" : "Edit stack " + this.friendlyTitle(this.stack()) + ".",
                "forms" :[]
            };

            this.setupEditPage(el, page);

            this.page(Alpaca.mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.StackEdit);

})(jQuery);