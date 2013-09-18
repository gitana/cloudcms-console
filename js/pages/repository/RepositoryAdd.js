(function($) {
    Gitana.Console.Pages.RepositoryAdd = Gitana.CMS.Pages.AbstractFormPageGadget.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        schema: function() {
            return _mergeObject(this.base(), {
                "properties": {
                    "title": {
                        "required": true
                    }
                }
            });
        },

        options: function() {

            return _mergeObject(this.base(), {
                "fields" : {
                    "title" : {
                        //"helper" : "Enter repository title."
                    },
                    "description" : {
                        //"helper" : "Enter repository description."
                    }
                }
            });
        },

        setup: function() {
            this.get("/add/repository", this.index);
        },

        targetObject: function() {
            return this.platform();
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
            this.menu(Gitana.Console.Menu.Platform(this, "menu-platform-repositories"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Repositories(this), [
                {
                    "text" : "New Repository"
                }
            ]));
        },

        setupRepositoryAddForm : function (el, callback) {
            var self = this;
            $('#repo-add', $(el)).alpaca({
                "view": "VIEW_WEB_CREATE",
                "data": {},
                "schema": self.schema(),
                "options": self.options(),
                "postRender": function(form) {
                    Gitana.Utils.UI.beautifyAlpacaForm(form, 'repo-add-create', true);

                    // Add Buttons
                    $('#repo-add-create', $(el)).click(function() {
                        var formVal = form.getValue();
                        if (form.isValid(true)) {

                            Gitana.Utils.UI.block("Creating Repository...");

                            self.targetObject().createRepository(formVal).then(function() {
                                var newRepository = this;
                                Gitana.Utils.UI.unblock(function() {
                                    self.app().run('GET', self.LINK().call(self,newRepository));
                                });
                            });
                        }
                    });

                    callback();
                }
            });
        },

        setupForms : function (el, callback) {
            this.setupRepositoryAddForm(el, callback);
        },

        setupPage : function(el) {

            var page = {
                "title" : "New Repository",
                "description" : "Create a new repository.",
                "forms" :[{
                    "id" : "repo-add",
                    "title" : "Create A New Repository",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'repository-add', 24),
                    "buttons" :[
                        {
                            "id" : "repo-add-create",
                            "title" : "Create Repository",
                            "isLeft" : true
                        }
                    ]
                }]
            };

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.RepositoryAdd);

})(jQuery);