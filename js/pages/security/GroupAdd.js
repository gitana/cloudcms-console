(function($) {
    Gitana.Console.Pages.GroupAdd = Gitana.CMS.Pages.AbstractFormPageGadget.extend(
    {
        schema : function() {
            var schema = _mergeObject(this.base(), {
                "type": "object",
                "properties": {
                    "groupId" : {
                        "title": "Group Id",
                        "type" : "string",
                        //"default" : "group-" + (new Date()).getTime(),
                        "required" : true
                    },
                    "file": {
                        "title": "Avatar",
                        "type": "string",
                        "format": "uri"
                    }
                }
            });

            if (this.group()) {
                _mergeObject(schema, {
                    "properties": {
                        "parentGroupId" : {
                            "title": "Parent Group Id",
                            "type" : "string",
                            "default" : this.group().getId(),
                            "readonly" : true,
                            "required" : true
                        }
                    }
                });
            }

            return schema;
        },
        options : function () {
            var self = this;
            return _mergeObject(this.base(), {
                "fields": {
                    "title" : {
                        "helper" : "Enter group title."
                    },
                    "description": {
                        "helper" : "Enter group description."
                    },
                    "groupId" : {
                        "type":"text",
                        "size":60,
                        "helper" : "Enter a unique group id",
                        "validator" : function(control, callback) {
                            var controlVal = control.getValue();
                            self.server().trap(function(error) {
                                if (error.status && error.status == '404') {
                                    if (!controlVal.match(/^[0-9a-zA-Z-_]*$/)) {
                                        callback({
                                            "message": "Group id should contain only alphabets, numbers, underscore or hyphen",
                                            "status": false
                                        });
                                    } else {
                                        callback({
                                            "message": "Valid group id",
                                            "status": true
                                        });
                                    }
                                }
                                return false;
                            }).readGroup(controlVal).then(function() {
                                callback({
                                    "message": "Unique group id required!",
                                    "status": false
                                });
                            });
                        }
                    },
                    "file": {
                        "type": "avatar",
                        "name": "avatarfile",
                        "helper": "Select an image file as group avatar."
                    }
                }
            });
        },

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/add/group", this.index);
            this.get("/groups/{groupId}/add/group", this.index);
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

        setupMenu: function() {
            if (this.group()) {
                this.menu(Gitana.Console.Menu.Group(this));
            } else {
                this.menu(Gitana.Console.Menu.Server(this,"menu-groups"));
            }
        },

        setupBreadcrumb: function() {
            var items = [
                {
                    "text" : "New Group"
                }
            ];

            if (this.group()) {
                return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Group(this), items));
            } else {
                return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Groups(this), items));
            }
        },

        setupToolbar: function() {
            var self = this;
            self.base();
            self.addButtons([
                {
                "id": "create",
                "title": "New Sub Group",
                    "icon" : Gitana.Utils.Image.buildImageUri('security', 'group-add', 48),
                    "click": function() {
                    }
                }
            ]);
        },

        setupGroupAddForm : function (el) {
            var self = this;
            $('#group-add',$(el)).alpaca({
                "data": {},
                "schema": self.schema(),
                "options": self.options(),
                "postRender": function(form) {
                    Gitana.Utils.UI.beautifyAlpacaForm(form, 'group-add-create', true);

                    var fileUploadControl = form.getControlByPath("file");
                    fileUploadControl.hideButtons();

                    // Add Buttons
                    $('#group-add-create',$(el)).click(function(){
                        var formVal = form.getValue();
                        var groupId = formVal['groupId'];
                        var parentGroupId = formVal['parentGroupId'];
                        delete formVal['groupId'];
                        delete formVal['file'];
                        if (parentGroupId) {
                            delete formVal['parentGroupId'];
                        }
                        if (form.isValid(true)) {

                            Gitana.Utils.UI.block("Creating Group...");

                            self.getServer().trap(function() {
                                return false;
                            }).createGroup(groupId,formVal).then(function() {
                                var newGroupObj = this;
                                var link = self.link(newGroupObj);

                                if (parentGroupId) {
                                    this.subchain(self.server()).addMember(self.group(), newGroupObj);
                                }

                                this.then(function() {

                                    var callback = function() {
                                        self.app().run("GET", link);
                                    };
                                    if (fileUploadControl.getPayloadSize() > 0) {
                                        fileUploadControl.setContext(newGroupObj);
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
            this.setupGroupAddForm(el);
        },

        setupPage : function(el) {

            var page = {
                "title" : "New Group",
                "description" : "Create a new group.",
                "forms" :[{
                    "id" : "group-add",
                    "title" : "Create A New Group",
                    "icon" : Gitana.Utils.Image.buildImageUri('security', 'group-add', 24),
                    "buttons" :[
                        {
                            "id" : "group-add-create",
                            "title" : "Create Group",
                            "isLeft" : true
                        }
                    ]
                }]
            };

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.GroupAdd);

})(jQuery);