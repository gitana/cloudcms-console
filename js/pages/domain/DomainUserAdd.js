(function($) {
    Gitana.Console.Pages.DomainUserAdd = Gitana.CMS.Pages.AbstractFormPageGadget.extend(
    {
        schema : function() {
            var schema = Alpaca.cloneObject(Gitana.Console.Schema.PrincipalUser);

            if (this.group()) {
                return _mergeObject({
                    "properties": {
                        "parentGroupId" : {
                            "title": "Parent Group Id",
                            "type" : "string",
                            "default" : this.group().getId()
                        }
                    }
                },schema);
            } else {
                return schema;
            }

        },
        options : function () {
            var self = this;
            var options = Alpaca.cloneObject(Gitana.Console.Options.PrincipalUser);

            options["fields"]["name"]["validator"] = function(control, callback) {
                var controlVal = control.getValue();
                Chain(self.targetObject()).queryPrincipals({
                    "name" : controlVal
                }).count(function(count) {
                        if (count == 0) {
                            callback({
                                "message": "Valid user id",
                                "status": true
                            });
                        } else {
                            callback({
                                "message": "Unique user principal name required!",
                                "status": false
                            });
                        }
                    });
            };
            options["fields"]["file"]["context"] = self.platform();

            if (this.group()) {
                options["fields"]["parentGroupId"] = {
                    "type":"text",
                    "size":60,
                    "helper" : "Enter parent group id.",
                    "validator" : function(control, callback) {
                        var controlVal = control.getValue();
                        Chain(self.targetObject()).trap(function(error) {
                            if (error.status && error.status == '404') {
                                callback({
                                    "message": "Invalid group id.",
                                    "status": false
                                });
                            }
                            return false;
                        }).readPrincipal(controlVal).then(function() {
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
            return this.domain();
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
            this.get("/domains/{domainId}/add/user", this.index);
            this.get("/domains/{domainId}/groups/{groupId}/add/user", this.index);
        },

        setupMenu: function() {
            if (this.group()) {
                this.menu(Gitana.Console.Menu.DomainGroup(this));
            } else {
                this.menu(Gitana.Console.Menu.Domain(this,"menu-domain-users"));
            }
        },

        setupBreadcrumb: function() {
            var items = [
                {
                    "text" : "New User"
                }
            ];

            if (this.group()) {
                return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.DomainGroup(this), items));
            } else {
                return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.DomainUsers(this), items));
            }
        },

        setupDomainUserAddForm : function (el, callback) {
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
                        form.showHiddenMessages();
                        var formVal = form.getValue();
                        var parentGroupId = formVal['parentGroupId'];
                        delete formVal['file'];
                        if (parentGroupId) {
                            delete formVal['parentGroupId'];
                        }
                        if (form.isValid(true)) {

                            Gitana.Utils.UI.block("Creating User...");

                            self.targetObject().trap(function() {
                                return false;
                            }).createUser(formVal).then(function() {
                                var newUserObj = this;
                                var link = self.link(newUserObj);

                                if (parentGroupId) {
                                    this.subchain(self.domain()).addMember(self.group(), newUserObj);
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

                    callback();
                }
            });
        },

        setupForms : function (el, callback) {
            this.setupDomainUserAddForm(el, callback);
        },

        setupPage : function(el) {

            var page = {
                "title" : "New User",
                "description" : "Create a new user.",
                "forms" :[{
                    "id" : "user-add",
                    "title" : "Create A New User",
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

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.DomainUserAdd);

})(jQuery);