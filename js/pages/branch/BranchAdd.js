(function($) {
    Gitana.Console.Pages.BranchAdd = Gitana.CMS.Pages.AbstractFormPageGadget.extend(
    {
        schema: function() {

            return _mergeObject(this.base(), {
                "properties" : {
                    "root" : {
                        "title": "Root",
                        "type" : "string",
                        "default" : this.branch().getTip(),
                        "required" : true                        
                    }
                }
            });
        },

        options: function() {
            var self = this;
            var options = _mergeObject(this.base(), {
                "fields" : {
                    "title" : {
                        "helper" : "Enter branch title."
                    },
                    "description" : {
                        "helper" : "Enter branch description."
                    },
                    "root" : {
                        "type": "text",
                        "size": 60,
                        "helper" : "Enter root changeset id."
                    }
                }
            });

            options['fields']['root']['validator'] = function(control, callback) {
                var controlVal = control.getValue();
                self.repository().trap(function(error) {
                    if (error.status && error.status == '404') {
                        callback({
                            "message": "Invalid changeset id",
                            "status": false
                        });
                    }
                }).readChangeset(controlVal).then(function() {
                    callback({
                        "message": "Valid changeset id",
                        "status": true
                    });
                });
            };

            return options;
        },

        setup: function() {
            this.get("/repositories/{repositoryId}/add/branch", this.index);
            this.get("/repositories/{repositoryId}/branches/{branchId}/add/branch", this.index);
        },
        
        targetObject: function() {
            return this.repository();
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
            this.menu(Gitana.Console.Menu.Repository(this, "menu-branches"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Branches(this), [
                {
                    "text" : "New Branch"
                }
            ]));
        },

        setupBranchAddForm: function (el, callback) {
            var self = this;
            $('#branch-add',$(el)).alpaca({
                "view": "VIEW_WEB_CREATE",
                "schema": self.schema(),
                "options": self.options(),
                "postRender": function(form) {

                    Gitana.Utils.UI.beautifyAlpacaForm(form, 'branch-add-create', true);

                    // Add Buttons
                    $('#branch-add-create',$(el)).click(function(){

                        var formVal = form.getValue();
                        var rootBranchId = formVal['root'];
                        delete formVal['root'];

                        if (form.isValid(true)) {

                            Gitana.Utils.UI.block("Creating Branch...");

                            self.repository().createBranch(rootBranchId, formVal).then(function() {
                                var link = self.LINK().call(self,this);
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
            this.setupBranchAddForm(el, callback);
        },

        setupPage : function(el) {

            var page = {
                "title" : "New Branch",
                "description" : "Create a new branch.",
                "forms" :[{
                    "id" : "branch-add",
                    "title" : "Create A New Branch",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'branch-add', 24),
                    "buttons" :[
                        {
                            "id" : "branch-add-create",
                            "title" : "Create Branch",
                            "isLeft" : true
                        }
                    ]
                }]
            };

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.BranchAdd);

})(jQuery);