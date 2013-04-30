(function($) {
    Gitana.Console.Pages.DomainUserEdit = Gitana.CMS.Pages.AbstractEditFormPageGadget.extend(
    {
        EDIT_URI: "/domains/{domainId}/users/{userId}/edit",

        EDIT_JSON_URI: "/domains/{domainId}/users/{userId}/edit/json",

        targetObject: function() {
            return this.principalUser();
        },

        contextObject: function() {
            return this.domain();
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
            var schema =  Alpaca.cloneObject(Gitana.Console.Schema.PrincipalUser);
            schema['properties']['name']['readonly'] = true;
            return schema;
        },
        options : function () {
            var self = this;
            var options = Alpaca.cloneObject(Gitana.Console.Options.PrincipalUser);
            options["fields"]["file"]["context"] = self.targetObject();
            return options;
        },

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.DomainUser(this));
        },

        setupBreadcrumb: function(el) {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.DomainUser(this), [
                {
                    "text" : this.isEditJSONUri(el) ? 'Edit JSON' : "Edit"
                }
            ]));
        },

        setupEditForm : function (el) {
            var self = this;
            var user = self.targetObject();
            var defaultData = this.populateObject(["firstName","lastName","companyName","email","name"],user);
            defaultData["password"] = "";
            $('#user-edit',$(el)).alpaca({
                "data": defaultData,
                "schema": self.schema(),
                "options": self.options(),
                "postRender": function(form) {
                    Gitana.Utils.UI.beautifyAlpacaForm(form, 'user-edit-save', true);
                    var fileUploadControl = form.getControlByPath("file");
                    // Add Buttons
                    $('#user-edit-save',$(el)).click(function(){
                        if (form.isValid(true)) {
                            Gitana.Utils.UI.block("Updating User...");
                            var updatedUser = form.getValue();

                            var newPassword = updatedUser["password"];

                            delete updatedUser ["password"];

                            delete updatedUser['file'];
                            Alpaca.mergeObject(user, updatedUser);
                            user.trap(function(error) {
                                return self.handlePageError(el, error);
                            }).update().reload().then(function() {
                                var updatedUser = this;

                                if (newPassword != "") {
                                    this.readIdentity().changePassword(newPassword,newPassword);
                                }

                                this.then(function() {

                                    var callback = function () {
                                        Gitana.Utils.UI.unblock(function() {
                                            self.app().run("GET", self.link(updatedUser));
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
                        }
                    });
                }
            });
        },

        editButtonConfig: function() {
            return  {
                "id": "edit",
                "title": "Edit User",
                "icon" : Gitana.Utils.Image.buildImageUri('security', 'user-edit', 48),
                "url" : this.link(this.targetObject(), 'edit')
            };
        },

        editPageConfig: function() {
            return {
                "id" : "user-edit",
                "title" : "Edit User",
                "icon" : Gitana.Utils.Image.buildImageUri('security', 'user-edit', 24),
                "buttons" :[
                    {
                        "id" : "user-edit-save",
                        "title" : "Save User",
                        "isLeft" : true
                    }
                ]
            };
        },

        setupPage: function(el) {

            var page = {
                "title" : "Edit User",
                "description" : "Edit user " + this.friendlyName(this.targetObject()),
                "forms" :[]
            };

            this.setupEditPage(el, page);

            this.page(Alpaca.mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.DomainUserEdit);

})(jQuery);