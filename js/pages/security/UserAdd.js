(function($) {
    Gitana.Console.Pages.UserAdd = Gitana.CMS.Pages.AbstractFormPageGadget.extend(
    {
        schema : function() {
            var schema = {
                "type": "object",
                "properties": {
                    "userId" : {
                        "title": "User Id",
                        "type" : "string",
                        //"default" : "user-" + (new Date()).getTime(),
                        "required" : true
                    },
                    "password" : {
                        "title": "Password",
                        "type" : "string",
                        "format" : "password"
                    },
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
                    "file": {
                        "title": "Avatar",
                        "type": "string",
                        "format": "uri"
                    }
                }
            };

            if (this.group()) {
                _mergeObject(schema, {
                    "properties": {
                        "parentGroupId" : {
                            "title": "Parent Group Id",
                            "type" : "string",
                            "default" : this.group().getId(),
                            "required" : true
                        }
                    }
                });
            }

            return schema;
        },
        options : function () {
            var self = this;
            var options = {
                "fields": {
                    "userId" : {
                        "type":"text",
                        "size":60,
                        "helper" : "Enter a unique user id",
                        "validator" : function(control, callback) {
                            var controlVal = control.getValue();
                            self.server().trap(function(error) {
                                if (error.status && error.status == '404') {
                                    if (!controlVal.match(/^[0-9a-zA-Z-_]*$/)) {
                                        callback({
                                            "message": "User id should contain only alphabets, numbers, underscore or hyphen",
                                            "status": false
                                        });
                                    } else {
                                        callback({
                                            "message": "Valid user id",
                                            "status": true
                                        });
                                    }
                                }
                                return false;
                            }).readUser(controlVal).then(function() {
                                callback({
                                    "message": "Unique user id required!",
                                    "status": false
                                });
                            });
                        }
                    },
                    "password" : {
                        "size": 60
                    },
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
                    "file": {
                        "type": "avatar",
                        "name": "avatarfile",
                        "helper": "Select an image file as user avatar."
                    }
                }
            };

            if (this.group()) {
                options["fields"]["parentGroupId"] = {
                    "type":"text",
                    "size":60,
                    "helper" : "Enter a unique parent group id",
                    "validator" : function(control, callback) {
                        var controlVal = control.getValue();
                        Chain(self.server()).trap(
                                function(error) {
                                    if (error.status && error.status == '404') {
                                        callback({
                                            "message": "Invalid group id.",
                                            "status": false
                                        });
                                    }
                                    return false;
                                }).readGroup(controlVal).then(function() {
                            callback({
                                "message": "Valid group id.",
                                "status": true
                            });
                        });
                    }
                }
            }

            return options;
        },

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

         targetObject: function() {
            return this.server();
        },

        requiredAuthorities: function() {
            return [
                {
                    "permissioned" : this.targetObject(),
                    "permissions" : ["create_subobjects"]
                }
            ];
        },

        setup: function() {
            this.get("/add/user", this.index);
            this.get("/groups/{groupId}/add/user", this.index);
        },

        setupMenu: function() {
            if (this.group()) {
                this.menu(Gitana.Console.Menu.Group(this));
            } else {
                this.menu(Gitana.Console.Menu.User(this));
            }
        },

        setupBreadcrumb: function() {
            var items = [
                {
                    "text" : "New User"
                }
            ];

            if (this.group()) {
                return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Group(this), items));
            } else {
                return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Users(this), items));
            }
        },

        setupToolbar: function() {
            var self = this;
            self.base();
            self.addButtons([
                {
                "id": "create",
                "title": "New Sub User",
                    "icon" : Gitana.Utils.Image.buildImageUri('security', 'user-add', 48),
                    "click": function() {
                    }
                }
            ]);
        },

        setupUserAddForm : function (el) {
            var self = this;
            $('#user-add',$(el)).alpaca({
                "view": "VIEW_WEB_CREATE",
                "data": {},
                "schema": self.schema(),
                "options": self.options(),
                "postRender": function(form) {
                    Gitana.Utils.UI.beautifyAlpacaForm(form, 'user-add-create', true);

                    var fileUploadControl = form.getControlByPath("file");
                    fileUploadControl.hideButtons();

                    // Add Buttons
                    $('#user-add-create',$(el)).click(function(){
                        var formVal = form.getValue();
                        var userId = formVal['userId'];
                        var parentGroupId = formVal['parentGroupId'];
                        delete formVal['userId'];
                        delete formVal['file'];
                        if (parentGroupId) {
                            delete formVal['parentGroupId'];
                        }
                        if (form.isValid(true)) {

                            Gitana.Utils.UI.block("Creating User...");

                            self.getServer().trap(function() {
                                return false;
                            }).createUser(userId,formVal).then(function() {
                                var newUserObj = this;
                                var link = self.link(newUserObj);

                                if (parentGroupId) {
                                    this.subchain(self.server()).addMember(self.group(), newUserObj);
                                }

                                this.then(function() {

                                    var callback = function() {
                                        self.app().run("GET", link);
                                    };
                                    if (fileUploadControl.getPayloadSize() > 0) {
                                        fileUploadControl.setContext(newUserObj);
                                        fileUploadControl.enableUploadButtons();
                                        fileUploadControl.uploadAll();

                                        fileUploadControl.field.bind('fileuploaddone', function (e, data) {
                                            Gitana.Utils.UI.unblock(callback);
                                        });
                                    } else {
                                        Gitana.Utils.UI.unblock(callback);
                                    }
                                });
                            });

                        }
                    });
                }
            });
        },

        setupForms : function (el) {
            this.setupUserAddForm(el);
        },

        setupPage : function(el) {

            var page = {
                "title" : "New User",
                "description" : "Create a new user.",
                "forms" :[{
                    "id" : "user-add",
                    "title" : "Create A New User.",
                    "icon" : Gitana.Utils.Image.buildImageUri('security', 'user-add', 24),
                    "buttons" :[
                        {
                            "id" : "user-add-create",
                            "title" : "Create User",
                            "isLeft" : true
                        }
                    ]
                }]
            };

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.UserAdd);

})(jQuery);