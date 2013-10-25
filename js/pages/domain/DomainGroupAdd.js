(function($) {
    Gitana.Console.Pages.DomainGroupAdd = Gitana.CMS.Pages.AbstractFormPageGadget.extend(
    {
        schema : function() {

            var schema = {};

            if (this.group()) {
               _mergeObject(schema,{
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

            _mergeObject(schema,Gitana.Console.Schema.PrincipalGroup);

            _mergeObject(schema,this.base());

            return schema;
        },
        options : function () {
            var self = this;
            var options = Alpaca.cloneObject(Gitana.Console.Options.PrincipalGroup);

            _mergeObject(options,this.base());

            options['fields']['file']['context'] = self.platform();

            options['fields']['name']['validator'] = function(control, callback) {
                var controlVal = control.getValue();
                Chain(self.targetObject()).queryPrincipals({
                    "name" : controlVal
                }).count(function(count) {
                        if (count == 0) {
                            callback({
                                "message": "Valid group id",
                                "status": true
                            });
                        } else {
                            callback({
                                "message": "Unique group id required!",
                                "status": false
                            });
                        }
                    });
            };
            return options;
        },

        setup: function() {
            this.get("/domains/{domainId}/add/group", this.index);
            this.get("/domains/{domainId}/groups/{groupId}/add/group", this.index);
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

        setupMenu: function() {
            if (this.group()) {
                this.menu(Gitana.Console.Menu.DomainGroup(this));
            } else {
                this.menu(Gitana.Console.Menu.Domain(this,"menu-domain-groups"));
            }
        },

        setupBreadcrumb: function() {
            var items = [
                {
                    "text" : "New Group"
                }
            ];

            if (this.group()) {
                return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.DomainGroup(this), items));
            } else {
                return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.DomainGroups(this), items));
            }
        },

        setupDomainGroupAddForm : function (el, callback) {
            var self = this;
            $('#group-add',$(el)).alpaca({
                "view": "VIEW_WEB_CREATE",
                "data": {},
                "schema": self.schema(),
                "options": self.options(),
                "postRender": function(form) {
                    Gitana.Utils.UI.beautifyAlpacaForm(form, 'group-add-create', true);

                    var fileUploadControl = form.getControlByPath("file");
                    fileUploadControl.hideButtons();

                    // Add Buttons
                    $('#group-add-create',$(el)).click(function(){
                        form.showHiddenMessages();
                        var formVal = form.getValue();
                        var parentGroupId = formVal['parentGroupId'];
                        delete formVal['file'];
                        if (parentGroupId) {
                            delete formVal['parentGroupId'];
                        }
                        if (form.isValid(true)) {

                            Gitana.Utils.UI.block("Creating Group...");

                            self.targetObject().trap(function() {
                                return false;
                            }).createGroup(formVal).then(function() {
                                var newGroupObj = this;
                                var link = self.link(newGroupObj);

                                if (parentGroupId) {
                                    this.subchain(self.targetObject()).addMember(self.group(), newGroupObj);
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

                    callback();
                }
            });
        },

        setupForms : function (el, callback) {
            this.setupDomainGroupAddForm(el, callback);
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

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.DomainGroupAdd);

})(jQuery);