(function($) {
    Gitana.Console.Pages.TagAdd = Gitana.CMS.Pages.AbstractFormPageGadget.extend({

        schema: function() {

            return _mergeObject(this.base(), {
                "properties" : {
                    "tag" : {
                        "title" : "Tag",
                        "type" : "string",
                        "format" : "lowercase"
                    }
                }
            });
        },

        options: function() {
            var self = this;
            var options = _mergeObject(this.base(), {
                "fields" : {
                    "title" : {
                        "helper" : "Enter tag title."
                    },
                    "description" : {
                        "helper" : "Enter tag description."
                    },
                    "tag" : {
                        "helper" : "Enter tag body."
                    }
                }
            });

            options['fields']['tag']['validator'] = function(control, callback) {

                var controlVal = control.getValue();
                self.branch().queryNodes({
                    "_type" : "n:tag",
                    "tag" : controlVal,
                    "_doc" : {
                        "$ne" : self.targetObject().getId()
                    }
                }).count(function(count) {
                        if (count > 0) {
                            callback({
                                "message": "Tag already exists.",
                                "status": false
                            });
                        } else {
                            callback({
                                "message": "Valid tag.",
                                "status": true
                            });
                        }
                });
            };

            return options;
        },

        setup: function() {
            this.get("/repositories/{repositoryId}/add/tag", this.index);
            this.get("/repositories/{repositoryId}/branches/{branchId}/add/tag", this.index);
            this.get("/repositories/{repositoryId}/branches/{branchId}/tags/{nodeId}/add/tag", this.index);
        },

        LINK : function() {
            return this.tagLink;
        },

        targetObject: function() {
            return this.branch();
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
            this.menu(Gitana.Console.Menu.Tag(this, "menu-tags"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Tags(this), [
                {
                    "text" : "New Tag"
                }
            ]));
        },

        setupNodeAddForm : function (el, callback) {
            var self = this;
            $('#tag-add', $(el)).alpaca({
                "view": "VIEW_WEB_CREATE",
                "schema": self.schema(),
                "options": self.options(),
                "postRender": function(form) {

                    Gitana.Utils.UI.beautifyAlpacaForm(form, 'tag-add-create', true);

                    // Add Buttons
                    $('#tag-add-create', $(el)).click(function() {

                        var formVal = form.getValue();

                        formVal['_type'] = "n:tag";

                        if (form.isValid(true)) {

                            Gitana.Utils.UI.block("Creating tag...");

                            self.branch().createNode(formVal).then(function() {
                                var link = self.LINK().call(self, this);
                                var callback = function() {
                                    self.app().run("GET", link);
                                };
                                Gitana.Utils.UI.unblock(callback);

                            });
                        }
                    });

                    callback();
                }
            });
        },

        setupForms : function (el, callback) {
            this.setupNodeAddForm(el, callback);
        },

        setupPage : function(el) {

            var page = {
                "title" : "New Tag",
                "description" : "Create a new tag of branch " + this.friendlyTitle(this.branch()) + ".",
                "forms" :[
                    {
                        "id" : "tag-add",
                        "title" : "Create A New Tag",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'tag-add', 24),
                        "buttons" :[
                            {
                                "id" : "tag-add-create",
                                "title" : "Create Tag",
                                "isLeft" : true
                            }
                        ]
                    }
                ]
            };

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.TagAdd);

})(jQuery);