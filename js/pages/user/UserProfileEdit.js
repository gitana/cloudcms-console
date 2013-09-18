(function($) {
    Gitana.Console.Pages.UserProfileEdit = Gitana.CMS.Pages.AbstractFormPageGadget.extend(
    {
        targetObject: function() {
            return this.user();
        },

        schema : function() {
            var schema = {
                "type" : "object",
                "properties" : {
                    "firstName" : {
                        "title": "First Name",
                        "type" : "string"
                    },
                    "lastName" : {
                        "title": "Last Name",
                        "type" : "string"
                    },
                    "email" : {
                        "title": "Email",
                        "type" : "string",
                        "format": "email"
                    },
                    "companyName" : {
                        "title": "Company Name",
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

            schema.properties['_settings'] = {
                "type" : "object",
                "title" : "Settings",
                "properties" : {

                }
            };

            _mergeObject(schema.properties['_settings'],Gitana.Console.Settings.Schema);

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
                        "hideInitValidationError": true,
                        "size":60
                    },
                    "companyName" : {
                        "type":"text",
                        "size": 60
                    },
                    "password" : {
                        "size": 60
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

        setup: function() {
            this.get("/profile/edit", this.index);
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Dashboard(this,"menu-my-profile"));

        },

        setupBreadcrumb: function() {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.MyProfile(this), [
                {
                    "text" : "Edit"
                }
            ]));
        },

        setupUserProfileEditForm : function (el, callback) {
            var self = this;
            var user = self.targetObject();
            var defaultData = this.populateObject(["_settings","firstName","lastName","email","companyName"],user);
            defaultData["password"] = "";
            defaultData["_settings"] = self.consoleAppSettings();
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
                            Gitana.Utils.UI.block("Updating Profile...");
                            var updatedUser = form.getValue();

                            var newPassword = updatedUser["password"];

                            delete updatedUser ["password"];
                            delete updatedUser['file'];

                            var settings = Alpaca.cloneObject(updatedUser["_settings"]);

                            delete updatedUser["_settings"];

                            _mergeObject(user, updatedUser);
                            Chain(user).update().reload().then(function() {
                                var updatedUser = this;

                                if (newPassword != "") {
                                    this.changePassword(newPassword);
                                }

                                this.then(function() {

                                    this.subchain(self.platform()).queryApplications({
                                        "key" : "console"
                                    }).count(function(count) {
                                            if (count > 0) {
                                                this.keepOne().then(function() {
                                                    this.readApplicationPrincipalSettings(self.user()).then(function() {
                                                        _mergeObject(this, {
                                                            "settings" : settings
                                                        });
                                                        this.update().reload().then(function() {
                                                            var setting1 = self.consoleAppSettings();
                                                            var setting2 = this.getSettings();
                                                            self.consoleAppSettings(setting2,setting1);
                                                        })
                                                    });
                                                });
                                            }
                                    });

                                    this.then(function() {

                                        var unblockCallback = function() {
                                            Gitana.Utils.UI.unblock(function() {
                                                self.app().run("GET", "/profile");
                                            });
                                        };

                                        var callback = function () {
                                            // update user details observable
                                            var userDetails = updatedUser;
                                            userDetails['friendlyName'] = updatedUser.getFirstName() ? updatedUser.getFirstName() : updatedUser.getName();
                                            userDetails['fullName'] = updatedUser.getFirstName() && updatedUser.getLastName() ? updatedUser.getFirstName() + ' ' + updatedUser.getLastName() : userDetails['friendlyName'];
                                            updatedUser.attachment('avatar').trap(
                                                function() {
                                                    self.userDetails(userDetails);
                                                    unblockCallback();
                                                    return false;
                                                }).then(function() {
                                                    if (this.getLength() > 0) {
                                                        userDetails['avatarUrl'] = this.getDownloadUri() + "?timestamp=" + new Date().getTime();
                                                    }
                                                    self.userDetails(userDetails);
                                                    unblockCallback();
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

            var msgContext = {
                "userFullName": this.userDetails().fullName
            };

            var page = {
                "title" : _msg("Personal.MyProfileEdit.title", msgContext),
                "description" : _msg("Personal.MyProfileEdit.description", msgContext),
                "forms" :[
                    {
                        "id" : "userprofile-edit",
                        "title" : "Edit My Profile ("+ this.targetObject().getName() +")",
                        "icon" : Gitana.Utils.Image.buildImageUri('security', 'user-edit', 24),
                        "buttons" :[
                            {
                                "id" : "userprofile-edit-save",
                                "title" : "Save Profile",
                                "isLeft" : true
                            }
                        ]
                    }]
            };

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.UserProfileEdit);

})(jQuery);