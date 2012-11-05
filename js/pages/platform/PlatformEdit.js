(function($) {
    Gitana.Console.Pages.PlatformEdit = Gitana.CMS.Pages.AbstractEditFormPageGadget.extend(
    {
        EDIT_URI: [
            "/edit"
        ],

        EDIT_JSON_URI: [
            "/edit/json"
        ],

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        targetObject: function() {
            //return this.myTenant();
            return this.tenantDetails();
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
            /*
            return Alpaca.mergeObject(this.base(), {
                "properties" : {
                    "planKey" : {
                        "type" : "string",
                        "title" : "Plan"
                    },
                    "file": {
                        "title": "Logo",
                        "type": "string",
                        "format": "uri"
                    }
                }
            });
            */
            return Alpaca.mergeObject({}, {
                "properties" : {
                    "file": {
                        "title": "Logo",
                        "type": "string",
                        "format": "uri"
                    }
                }
            });
        },

        options: function() {

            var self = this;

            /*
            var options = Alpaca.mergeObject(this.base(), {
                "fields" : {
                    "title" : {
                        "helper" : "Enter tenant title."
                    },
                    "description" : {
                        "helper" : "Enter tenant description."
                    },
                    "planKey" : {
                        "type" : "select",
                        "helper": "Select plan."
                    },
                    "file": {
                        "type": "avatar",
                        "name": "attachment",
                        "helper": "Select an image as your tenant logo.",
                        "context": self.targetObject()
                    }
                }
            });

            options['fields']['planKey']['dataSource'] = function(field, callback) {
                Chain(self.platform()).readRegistrar("default").listPlans().each(
                    function(key, val, index) {
                        field.selectOptions.push({
                            "value": this.getPlanKey(),
                            "text": this.getPlanKey()
                        });
                }).then(function() {
                        if (callback) {
                            callback();
                            field.field.val(self.targetObject().get('planKey')).change();
                        }
                });
            };
            */

            var options = Alpaca.mergeObject({}, {
                "fields" : {
                    "file": {
                        "type": "platform-logo",
                        "name": "attachment",
                        "helper": "Select an image as your platform logo.",
                        "platform": self.platform()
                    }
                }
            });
            return options;
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Platform(this));
        },

        setupBreadcrumb: function(el) {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Platform(this), [
                {
                    "text" : this.isEditJSONUri(el) ? 'Edit Platform JSON' : "Edit Platform"
                }
            ]));
        },

        setupEditForm: function (el) {
            var self = this;
            var tenant = self.targetObject();
            var defaultData = Alpaca.cloneObject(tenant);
            $('#tenant-edit', $(el)).alpaca({
                "data": defaultData,
                "schema": self.schema(),
                "options": self.options(),
                "postRender": function(form) {
                    Gitana.Utils.UI.beautifyAlpacaForm(form);
                    var fileUploadControl = form.getControlByPath("file");

                    fileUploadControl.field.bind('fileuploaddone', function (e, data) {
                        self.platform().tenantAttachment('avatar').trap(function() {

                        }).then(function() {
                                var tenantDetails = self.tenantDetails();
                                if (this.getLength() > 0) {
                                    tenantDetails['avatarUrl'] = this.getDownloadUri() + "?timestamp=" + new Date().getTime();
                                    self.tenantDetails(tenantDetails);
                                }
                        });
                    });

                    // Add Buttons
                    /*
                    $('#tenant-edit-save', $(el)).click(function() {
                        var formVal = form.getValue();
                        if (form.isValid(true)) {
                            Gitana.Utils.UI.block("Updating My Tenant ...");
                            delete formVal['file'];
                            Alpaca.mergeObject(tenant.object,formVal);
                            tenant.update().then(function() {

                                var updatedTenant = this;

                                var unblockCallback = function() {
                                    Gitana.Utils.UI.unblock(function() {
                                        self.app().run('GET', self.LINK().call(self, self.platform()));
                                    });
                                };

                                var callback = function () {
                                    // update tenant details observable
                                    var tenantDetails = updatedTenant.object;
                                    tenantDetails['friendlyName'] = self.friendlyTitle(updatedTenant);
                                    tenantDetails['description'] = updatedTenant.getDescription() ? updatedTenant.getDescription() : "";
                                    updatedTenant.attachment('avatar').trap(
                                        function() {
                                            self.tenantDetails(tenantDetails);
                                            unblockCallback();
                                            return false;
                                        }).then(function() {
                                            if (this.getLength() > 0) {
                                                tenantDetails['avatarUrl'] = this.getDownloadUri() + "?timestamp=" + new Date().getTime();
                                            }
                                            self.tenantDetails(tenantDetails);
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
                        }
                    });
                    $('#tenant-edit-reset', $(el)).click(function() {
                        form.setValue(defaultData);
                    });
                    */
                }
            });
        },

        editButtonConfig: function() {
            return  {
                "id": "edit",
                "title": "Edit Platform",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'tenant-edit', 48),
                "url" : this.LINK().call(this,this.targetObject(), 'edit')
            };
        },

        editPageConfig: function() {
            return {
                "id" : "tenant-edit",
                "title" : "Edit Platform",
                "icon" : Gitana.Utils.Image.buildImageUri('objects', 'tenant-edit', 24)
                /*,
                "buttons" :[

                    {
                        "id" : "tenant-edit-reset",
                        "title" : "Reset"
                    },
                    {
                        "id" : "tenant-edit-save",
                        "title" : "Save Platform",
                        "isLeft" : true
                    }
                ]
                */
            };
        },

        setupPage: function(el) {

            var page = {
                "title" : "Edit Platform",
                //"description" : "Edit tenant " + this.friendlyTitle(this.myTenant()) + ".",
                "description" : "Edit platform " + this.friendlyTitle(this.tenantDetails()) + ".",
                "forms" :[]
            };

            this.setupEditPage(el, page);

            this.page(Alpaca.mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.PlatformEdit);

})(jQuery);