(function($) {
    Gitana.Console.Pages.UserEdit = Gitana.CMS.Pages.AbstractFormPageGadget.extend(
    {
        targetObject: function() {
            return this.principalUser();
        },

        requiredAuthorities: function() {
            return [
                {
                    "permissioned" : this.targetObject(),
                    "permissions" : ["update"]
                }
            ];
        },

        schema : function() {
            var schema = {
                "type" : "object",
                "properties" : {
                    "firstName" : {
                        "title": "First Name",
                        "description" : "Enter your first name.",
                        "type" : "string"
                    },
                    "lastName" : {
                        "title": "Last Name",
                        "description" : "Enter your last name.",
                        "type" : "string"
                    },
                    "email" : {
                        "title": "Email",
                        "description" : "Enter your email address.",
                        "type" : "string",
                        "format": "email"
                    },
                    "companyName" : {
                        "title": "Company Name",
                        "description" : "Enter your company name.",
                        "type" : "string"
                    },
                    "password" : {
                        "title": "Password",
                        "type" : "string",
                        "format" : "password"
                    },
                    "file": {
                        "title": "Avatar",
                        "type": "string",
                        "format": "uri"
                    }
                }
            };

            return schema;
        },
        options : function () {
            var self = this;
            return {
                "fields": {
                    "firstName" : {
                        "type":"text",
                        "size":60
                    },
                    "lastName" : {
                        "type":"text",
                        "size": 60
                    },
                    "email" : {
                        "size":60
                    },
                    "companyName" : {
                        "type":"text",
                        "size": 60
                    },
                    "password" : {
                        "size": 60,
                        "helper":"Reset password."
                    },
                    "file": {
                        "type": "avatar",
                        "name": "attachment",
                        "helper": "Select an image as your avatar.",
                        "context": self.targetObject()
                    }
                }
            };
        },

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/users/{userId}/edit", this.index);
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.User(this));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.User(this), [
                {
                    "text" : "Edit"
                }
            ]));
        },

        setupToolbar: function() {
            var self = this;
            self.base();
            self.addButtons([
            ]);
        },

        setupUserProfileEditForm : function (el, callback) {
            var self = this;
            var user = self.targetObject();
            var defaultData =self.populateObjectAll(user);
            defaultData["password"] = "";
            $('#userprofile-edit',$(el)).alpaca({
                "data": defaultData,
                "schema": self.schema(),
                "options": self.options(),
                "postRender": function(form) {
                    Gitana.Utils.UI.beautifyAlpacaForm(form, 'userprofile-edit-save', true);
                    var fileUploadControl = form.getControlByPath("file");
                    // Add Buttons
                    $('#userprofile-edit-save',$(el)).click(function(){
                        if (form.isValid(true)) {
                            Gitana.Utils.UI.block("Updating User...");
                            var updatedUser = form.getValue();

                            var newPassword = updatedUser["password"];
                            delete updatedUser ["password"];
                            delete updatedUser['file'];

                            _mergeObject(user, updatedUser);
                            Chain(user).update().reload().then(function() {
                                var updatedUser = this;

                                if (newPassword != "") {
                                    this.changePassword(newPassword);
                                }

                                this.then(function() {

                                    var callback = function () {
                                        self.app().run("GET", self.link(updatedUser));
                                    };

                                    if (fileUploadControl.getPayloadSize() > 0) {
                                        fileUploadControl.uploadAll();

                                        fileUploadControl.field.bind('fileuploaddone', function (e, data) {
                                            callback();
                                        });
                                    } else {
                                        callback();
                                    }
                                });

                            });
                        }
                    });

                    callback();
                }
            });
        },

        setupForms : function (el, callback) {
            this.setupUserProfileEditForm(el, callback);
        },

        setupPage : function(el) {

            var page = {
                "title" : "Edit User",
                "description" : "Edit user profile.",
                "forms" :[
                    {
                        "id" : "userprofile-edit",
                        "title" : "Edit Profile - "+ this.targetObject().getId(),
                        "icon" : Gitana.Utils.Image.buildImageUri('security', 'user-edit', 24),
                        "buttons" :[
                            {
                                "id" : "userprofile-edit-save",
                                "title" : "Save User",
                                "isLeft" : true
                            }
                        ]
                    }]
            };

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.UserEdit);

})(jQuery);