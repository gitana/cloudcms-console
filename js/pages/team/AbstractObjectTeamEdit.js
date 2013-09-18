(function($) {
    Gitana.Console.Pages.AbstractObjectTeamEdit = Gitana.CMS.Pages.AbstractEditFormPageGadget.extend(
    {
        targetObject: function() {
            return this.team();
        },

        schema: function() {
            return _mergeObject(this.base(), {
                "properties" : {
                    "teamKey" : {
                        "title": "Team Key",
                        "type" : "string",
                        "required" : true,
                        "readonly" : true
                    },
                    "roles" : {
                        "title": "Team Roles",
                        "type": "string",
                        "required": true
                    },
                    "file": {
                        "title": "Avatar",
                        "type": "string",
                        "format": "uri"
                    }
                }
            });
        },

        options: function() {
            var rolesDS = {};

            $.each(Gitana.Console.AUTHORITIES,function(key,val) {
                rolesDS[key] = val['title'];
            });

            return _mergeObject(this.base(), {
                "fields" : {
                    "title" : {
                        "helper" : "Enter team title."
                    },
                    "description" : {
                        "helper" : "Enter team description."
                    },
                    "roles" : {
                        "helper": "Select team roles.",
                        "type": "select",
                        "multiple" : true,
                        "dataSource" : rolesDS
                    },
                    "file": {
                        "type": "avatar",
                        "name": "attachment",
                        "helper": "Select an image as your team avatar.",
                        "context": this.group()
                    }
                }
            });
        },

        requiredAuthorities: function() {
            return [
                {
                    "permissioned" : this.targetObject(),
                    "permissions" : ["update"]
                }
            ];
        },

        setupEditForm: function (el, callback) {
            var self = this;
            var group = self.group();
            var defaultData = this.populateObject(["title","description"],group);
            defaultData['teamKey'] = this.team().getKey();
            defaultData['roles'] = this.team().getRoleKeys();
            $('#team-edit', $(el)).alpaca({
                "data": defaultData,
                "schema": self.schema(),
                "options": self.options(),
                "postRender": function(form) {

                    Gitana.Utils.UI.beautifyAlpacaForm(form, 'team-edit-save', true);

                    var fileUploadControl = form.getControlByPath("file");

                    // Add Buttons
                    $('#team-edit-save', $(el)).click(function() {
                        var formVal = form.getValue();
                        delete formVal['file'];
                        var roles = formVal['roles'];
                        delete formVal['roles'];
                        if (form.isValid(true)) {

                            Gitana.Utils.UI.block("Updating Team...");

                            _mergeObject(group, formVal);

                            self.team().then(function() {

                                var team = this;

                                $.each(this.getRoleKeys(),function() {
                                    team.revoke(this);
                                });

                                this.then(function() {

                                    $.each(roles,function() {
                                        team.grant(this);
                                    });

                                    this.then(function() {
                                        this.subchain(group).update().reload().then(function() {

                                            var callback = function () {
                                                Gitana.Utils.UI.unblock(function() {
                                                    self.app().run('GET',self.teamLink(self.targetObject(), self.contextObject()));
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

                            });
                        }
                    });

                    callback();
                }
            });
        },

        editButtonConfig: function() {
            return  {
                "id": "edit",
                "title": "Edit Team",
                "icon" : Gitana.Utils.Image.buildImageUri('security', 'team-edit', 48),
                "url" : this.teamLink(this.team(),this.contextObject(), 'edit')
            };
        },

        editPageConfig: function() {
            return {
                "id" : "team-edit",
                "title" : "Edit Team",
                "icon" : Gitana.Utils.Image.buildImageUri('security', 'team-edit', 24),
                "buttons" :[
                    {
                        "id" : "team-edit-save",
                        "title" : "Save Team",
                        "isLeft" : true
                    }
                ]
            };
        },

        processForms: function(el, newEl, callback)
        {
            $(newEl).find('body').bind('swap', function(event, param) {
                var rolesSelector = $('select');

                rolesSelector.attr('title', 'Select and Add a Role');

                if (!rolesSelector.parent().hasClass('asmContainer')) {
                    rolesSelector.asmSelect({
                        sortable: false,
                        removeLabel: "Remove"
                    });
                }
            });

            callback();
        },

        setupPage: function(el) {

            var page = {
                "title" : "Edit Team",
                "description" : "Edit Team " + this.team().getKey() +  ".",
                "forms" :[]
            };

            this.setupEditPage(el, page);

            this.page(_mergeObject(page,this.base(el)));
        }
    });

})(jQuery);