(function($) {
    Gitana.Console.Pages.GroupEdit = Gitana.CMS.Pages.AbstractEditFormPageGadget.extend(
    {
        EDIT_URI: "/groups/{groupId}/edit",

        EDIT_JSON_URI: "/groups/{groupId}/edit/json",

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        schema: function() {
            return Alpaca.mergeObject(this.base(), {
                "properties" : {
                    "file": {
                        "title": "Avatar",
                        "type": "string",
                        "format": "uri"
                    }
                }
            });
        },

        options: function() {
            return Alpaca.mergeObject(this.base(), {
                "fields" : {
                    "title" : {
                        "helper" : "Enter group title."
                    },
                    "description" : {
                        "helper" : "Enter group description."
                    },
                    "file": {
                        "type": "avatar",
                        "name": "attachment",
                        "helper": "Select an image as your group avatar.",
                        "context": this.group()
                    }
                }
            });
        },

        targetObject: function() {
            return this.group();
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
            this.menu(Gitana.Console.Menu.Group(this));
        },

        setupBreadcrumb: function(el) {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Group(this), [
                {
                    "text" : this.isEditJSONUri(el) ? 'Edit JSON' : "Edit"
                }
            ]));
        },

        setupEditForm: function (el) {
            var self = this;
            var group = self.targetObject();
            var defaultData = self.populateObjectAll(group);
            $('#repo-edit', $(el)).alpaca({
                "data": defaultData,
                "schema": self.schema(),
                "options": self.options(),
                "postRender": function(form) {
                    Gitana.Utils.UI.beautifyAlpacaForm(form, 'repo-edit-save', true);
                    var fileUploadControl = form.getControlByPath("file");
                    // Add Buttons
                    $('#repo-edit-save', $(el)).click(function() {
                        var formVal = form.getValue();
                        delete formVal['file'];
                        if (form.isValid(true)) {

                            Gitana.Utils.UI.block("Updating Group...");

                            Alpaca.mergeObject(group, formVal);

                            Chain(group).update().reload().then(function() {

                                var callback = function () {
                                    Gitana.Utils.UI.unblock(function() {
                                        self.app().run('GET', self.link(self.targetObject()));
                                    });
                                }

                                if (fileUploadControl.getPayloadSize() > 0) {
                                    fileUploadControl.uploadAll();

                                    fileUploadControl.field.bind('fileuploaddone', function (e, data) {
                                        callback();
                                    });
                                } else {
                                    callback();
                                }

                            });


                        }
                    });
                }
            });
        },

        editButtonConfig: function() {
            return  {
                "id": "edit",
                "title": "Edit Group",
                "icon" : Gitana.Utils.Image.buildImageUri('security', 'group-edit', 48),
                "url" : this.link(this.targetObject(), 'edit')
            };
        },

        editPageConfig: function() {
            return {
                "id" : "repo-edit",
                "title" : "Edit Group",
                "icon" : Gitana.Utils.Image.buildImageUri('security', 'group-edit', 24),
                "buttons" :[
                    {
                        "id" : "repo-edit-save",
                        "title" : "Save Group",
                        "isLeft" : true
                    }
                ]
            };
        },

        setupPage: function(el) {

            var page = {
                "title" : "Edit Group",
                "description" : "Edit group " + this.friendlyTitle(this.group()) + ".",
                "forms" :[]
            };

            this.setupEditPage(el, page);

            this.page(Alpaca.mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.GroupEdit);

})(jQuery);