(function($) {
    Gitana.Console.Pages.AbstractObjetTeamAdd = Gitana.CMS.Pages.AbstractFormPageGadget.extend(
    {
        schema : function() {
            var schema = Alpaca.mergeObject(this.base(), {
                "type": "object",
                "properties": {
                    "teamKey" : {
                        "title": "Team Key",
                        "type" : "string",
                        "default" : "team-" + (new Date()).getTime(),
                        "required" : true
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

            return schema;
        },
        
        options : function () {
            var self = this;
            var rolesDS = {};

            $.each(Gitana.Console.AUTHORITIES,function(key,val) {
                rolesDS[key] = val['title'];
            });

            return Alpaca.mergeObject(this.base(), {
                "fields": {
                    "title" : {
                        "helper" : "Enter team title."
                    },
                    "description": {
                        "helper" : "Enter team description."
                    },
                    "teamKey" : {
                        "type":"text",
                        "size":60,
                        "helper" : "Enter a unique team key.",
                        "validator" : function(control, callback) {
                            var controlVal = control.getValue();
                            self.targetObject().trap(function(error) {
                                if (error.status && error.status == '404') {
                                    if (!controlVal.match(/^[0-9a-zA-Z-_]*$/)) {
                                        callback({
                                            "message": "Group id should contain only alphabets, numbers, underscore or hyphen",
                                            "status": false
                                        });
                                    } else {
                                        callback({
                                            "message": "Valid team key.",
                                            "status": true
                                        });
                                    }
                                }
                                return false;
                            }).readTeam(controlVal).then(function() {
                                callback({
                                    "message": "Unique group id required!",
                                    "status": false
                                });
                            });
                        }
                    },
                    "roles" : {
                        "helper": "Select team roles.",
                        "type": "select",
                        "multiple" : true,
                        "dataSource" : rolesDS
                    },
                    "file": {
                        "type": "avatar",
                        "name": "avatarfile",
                        "helper": "Select an image file as team avatar.",
                        "context" : self.platform()
                    }
                }
            });
        },

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        requiredAuthorities: function() {
            return [
                {
                    "permissioned" : this.targetObject(),
                    "permissions" : ["create_subobjects"]
                }
            ];
        },

        setupTeamAddForm : function (el) {
            var self = this;
            $('#team-add',$(el)).alpaca({
                "data": {
                    "roles" : ['consumer']
                },
                "schema": self.schema(),
                "options": self.options(),
                "postRender": function(form) {
                    Gitana.Utils.UI.beautifyAlpacaForm(form, 'team-add-create', true);

                    var fileUploadControl = form.getControlByPath("file");
                    fileUploadControl.hideButtons();


                    // Add Buttons
                    $('#team-add-create',$(el)).click(function(){

                        var val = form.getValue();
                        var teamKey = val['teamKey'];
                        var teamRoles = val['roles'];

                        delete val['teamKey'];
                        delete val['file'];
                        delete val['roles'];

                        if (form.isValid(true)) {

                            Gitana.Utils.UI.block("Creating Team...");

                            Chain(self.targetObject()).trap(function(error) {
                                return self.handlePageError(el,error);
                            }).createTeam(teamKey).then(function() {

                                this.subchain(self.targetObject()).readTeam(teamKey).then(function() {

                                    var team = this;

                                    var newGroupId = this.getGroupId();
                                    var link = self.teamLink(this, self.targetObject());

                                    $.each(teamRoles, function() {
                                        team.grant(this);
                                    });

                                    this.then(function() {
                                        this.subchain(self.platform()).readPrimaryDomain().readPrincipal(newGroupId).then(function() {

                                            Alpaca.mergeObject(this, val);

                                            this.update().then(function() {

                                                var callback = function() {
                                                    self.app().run("GET", link);
                                                };

                                                if (fileUploadControl.getPayloadSize() > 0) {
                                                    fileUploadControl.setContext(this);
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
                                    });
                                });

                            });

                        }
                    });
                }
            });
        },

        setupForms : function (el) {
            this.setupTeamAddForm(el);
        },

        processForms: function() {
            $('body').bind('swap', function(event, param) {
                var rolesSelector = $('#team-add select');

                rolesSelector.attr('title', 'Select and Add a Role');

                if (!rolesSelector.parent().hasClass('asmContainer')) {
                    rolesSelector.asmSelect({
                        sortable: false,
                        removeLabel: "Remove"
                    });
                }
            });
        }
    });

})(jQuery);