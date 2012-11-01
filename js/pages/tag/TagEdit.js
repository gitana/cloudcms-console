(function($) {
    Gitana.Console.Pages.TagEdit = Gitana.CMS.Pages.AbstractEditFormPageGadget.extend({
        EDIT_URI: [
            "/repositories/{repositoryId}/branches/{branchId}/tags/{nodeId}/edit"
        ],

        EDIT_JSON_URI: [
            "/repositories/{repositoryId}/branches/{branchId}/tags/{nodeId}/edit/json"
        ],

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        schema: function() {
            return Alpaca.mergeObject(this.base(), {
                "properties" : {
                    "tag" : {
                        "title" : "Tag",
                        "type" : "string",
                        "format" : "lowercase"
                    }
                }
            });
        },

        options: function() {
            var self = this;
            var options = Alpaca.mergeObject(this.base(), {
                "fields" : {
                    "title" : {
                        "helper" : "Enter tag title."
                    },
                    "description" : {
                        "helper" : "Enter tag description."
                    },
                    "tag" : {
                        "helper" : "Enter tag body."
                    }
                }
            });

            options['fields']['tag']['validator'] = function(control, callback) {

                var controlVal = control.getValue();
                self.branch().queryNodes({
                    "_type" : "n:tag",
                    "tag" : controlVal,
                    "_doc" : {
                        "$ne" : self.targetObject().getId()
                    }
                }).count(function(count) {
                        if (count > 0) {
                            callback({
                                "message": "Tag already exists.",
                                "status": false
                            });
                        } else {
                            callback({
                                "message": "Valid tag.",
                                "status": true
                            });
                        }
                    });
            };

            return options;
        },

        LINK : function() {
            return this.tagLink;
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
            this.menu(Gitana.Console.Menu.Tag(this));
        },

        setupBreadcrumb: function(el) {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Tag(this), [
                {
                    "text" : this.isEditJSONUri(el) ? 'Edit JSON' : "Edit"
                }
            ]));
        },

        setupEditForm: function (el) {

            var self = this;

            var node = self.targetObject();

            var defaultData = Alpaca.cloneObject(node.object);

            var schema = self.schema();

            var options = self.options();

            var editDiv = $('#tag-edit', $(el));

            var saveButton = $('#tag-edit-save', $(el));

            var resetButton = $('#tag-edit-reset', $(el));

            editDiv.alpaca({
                "data": defaultData,
                "schema": schema,
                "options": options,
                "postRender": function(form) {
                    Gitana.Utils.UI.beautifyAlpacaForm(form, 'tag-edit-save', true);
                    // Add Buttons
                    saveButton.click(function() {
                        var formVal = form.getValue();
                        if (form.isValid(true)) {

                            Gitana.Utils.UI.block("Updating tag...");

                            Alpaca.mergeObject(node.object, formVal);

                            node.update().then(function() {

                                var updatedNode = this;

                                var link = self.LINK().call(self, updatedNode);

                                var callback = function() {
                                    self.app().run("GET", link);
                                };

                                Gitana.Utils.UI.unblock(callback);

                            });
                        }
                    });
                    resetButton.click(function() {
                        form.setValue(defaultData);
                    });
                }
            });
        },

        editButtonConfig: function() {
            return  {
                "id": "edit",
                "title": "Edit Tag",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'tag-edit', 48),
                "url" : this.link(this.targetObject(), 'edit')
            };
        },

        editPageConfig: function() {
            return {
                "id" : "tag-edit",
                "title" : "Edit Tag",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'tag-edit', 24),
                "buttons" :[
                    {
                        "id" : "tag-edit-reset",
                        "title" : "Reset"
                    },
                    {
                        "id" : "tag-edit-save",
                        "title" : "Save Tag",
                        "isLeft" : true
                    }
                ]
            };
        },

        setupPage: function(el) {

            var page = {
                "title" : "Edit Tag",
                "description" : "Edit tag " + this.friendlyTitle(this.targetObject()) + ".",
                "forms" :[]
            };

            this.setupEditPage(el, page);

            this.page(Alpaca.mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.TagEdit);

})(jQuery);