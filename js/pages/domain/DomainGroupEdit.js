(function($) {
    Gitana.Console.Pages.GroupEdit = Gitana.CMS.Pages.AbstractEditFormPageGadget.extend(
    {
        EDIT_URI: "/domains/{domainId}/groups/{groupId}/edit",

        EDIT_JSON_URI: "/domains/{domainId}/groups/{groupId}/edit/json",

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        schema: function() {
            var schema = {};

            _mergeObject(schema,Gitana.Console.Schema.PrincipalGroup);

            _mergeObject(schema,this.base());

            schema['properties']['name']['readonly'] = true;

            return schema;
        },

        options: function() {
            var self = this;
            var options = Alpaca.cloneObject(Gitana.Console.Options.PrincipalGroup);

            _mergeObject(options,this.base());

            options['fields']['file']['context'] = self.targetObject();

            return options;
        },

        targetObject: function() {
            return this.group();
        },

        requiredAuthorities: function() {
            return [
                {
                    "permissioned" : this.targetObject(),
                    "permissions" : ["update"]
                }
            ];
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.DomainGroup(this));
        },

        setupBreadcrumb: function(el) {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.DomainGroup(this), [
                {
                    "text" : this.isEditJSONUri(el) ? 'Edit JSON' : "Edit"
                }
            ]));
        },

        setupEditForm: function (el, callback) {
            var self = this;
            var group = self.targetObject();
            var defaultData = this.populateObject(["title","description","name"],group);
            $('#group-edit', $(el)).alpaca({
                "data": defaultData,
                "schema": self.schema(),
                "options": self.options(),
                "postRender": function(form) {
                    Gitana.Utils.UI.beautifyAlpacaForm(form, 'group-edit-save', true);
                    var fileUploadControl = form.getControlByPath("file");
                    // Add Buttons
                    $('#group-edit-save', $(el)).click(function() {
                        var formVal = form.getValue();
                        delete formVal['file'];
                        if (form.isValid(true)) {

                            Gitana.Utils.UI.block("Updating Group...");

                            _mergeObject(group, formVal);

                            Chain(group).update().reload().then(function() {

                                var cb = function () {
                                    Gitana.Utils.UI.unblock(function() {
                                        self.app().run('GET', self.link(self.targetObject()));
                                    });
                                };

                                if (fileUploadControl.getPayloadSize() > 0) {
                                    fileUploadControl.uploadAll();

                                    fileUploadControl.field.bind('fileuploaddone', function (e, data) {
                                        cb();
                                    });
                                } else {
                                    cb();
                                }

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
                "title": "Edit Group",
                "icon" : Gitana.Utils.Image.buildImageUri('security', 'group-edit', 48),
                "url" : this.link(this.targetObject(), 'edit')
            };
        },

        editPageConfig: function() {
            return {
                "id" : "group-edit",
                "title" : "Edit Group",
                "icon" : Gitana.Utils.Image.buildImageUri('security', 'group-edit', 24),
                "buttons" :[
                    {
                        "id" : "group-edit-save",
                        "title" : "Save Group",
                        "isLeft" : true
                    }
                ]
            };
        },

        setupPage: function(el) {

            var page = {
                "title" : "Edit Group",
                "description" : "Edit group " + this.friendlyTitle(this.group()) + ".",
                "forms" :[]
            };

            this.setupEditPage(el, page);

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.GroupEdit);

})(jQuery);