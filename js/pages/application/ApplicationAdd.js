(function($) {
    Gitana.Console.Pages.ApplicationAdd = Gitana.CMS.Pages.AbstractFormPageGadget.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        schema: function() {

            var schema = Alpaca.cloneObject(this.base());

            Alpaca.mergeObject(schema,Gitana.Console.Schema.Application);

            // automatic stack creation
            Alpaca.mergeObject(schema, {
                "properties" : {
                    "stack" : {
                        "title" : "Stack",
                        "description" : "Select what kind of stack you'd like to auto-provision for your application.",
                        "type" : "string",
                        "required" : true,
                        "enum" : ["none","stack1"],
                        "default": "none"
                    }
                }
            });

            return schema;
        },

        options: function() {

            var self = this;

            var options = Alpaca.cloneObject(Gitana.Console.Options.Application);

            Alpaca.mergeObject(options,this.base());

            // automatic stack creation
            Alpaca.mergeObject(options, {
                "fields" : {
                    "stack" : {
                        "type": "select",
                        "optionLabels": ["None", "Default Application Stack"]
                    }
                }
            });

            options["fields"]["key"]["hideInitValidationError"] = true;

            options['fields']['key']['validator'] = function(control, callback) {
                var controlVal = control.getValue();

                if (Alpaca.isValEmpty(controlVal)) {
                    callback({
                        "message": "Empty key.",
                        "status": true
                    });
                    return true
                }

                Chain(self.targetObject()).queryApplications({
                    "key" : controlVal
                }).count(function(count) {
                        if (count == 0) {
                            callback({
                                "message": "Valid application key.",
                                "status": true
                            });
                        } else {
                            callback({
                                "message": "Unique application key required!",
                                "status": false
                            });
                        }
                    });
            };

            return options;
        },

        setup: function() {
            this.get("/add/application", this.index);
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
            this.menu(Gitana.Console.Menu.Platform(this, "menu-platform-applications"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Applications(this), [
                {
                    "text" : "New Application"
                }
            ]));
        },

        setupApplicationAddForm : function (el) {
            var self = this;
            $('#application-add', $(el)).alpaca({
                "data": {},
                "schema": self.schema(),
                "options": self.options(),
                "postRender": function(form) {
                    Gitana.Utils.UI.beautifyAlpacaForm(form , 'application-add-create' , true);
                    // Add Buttons
                    $('#application-add-create', $(el)).click(function() {

                        form.showHiddenMessages();

                        var formVal = form.getValue();
                        if (form.isValid(true)) {

                            Gitana.Utils.UI.block("Creating Application...");

                            /*
                            self.targetObject().createApplication(formVal).then(function() {
                                var newApplication = this;
                                Gitana.Utils.UI.unblock(function() {
                                    self.app().run('GET', self.LINK().call(self,newApplication));
                                });
                            });
                            */

                            // automatic stack creation
                            var stack = formVal.stack;
                            delete formVal.stack;

                            self.targetObject().then(function() {

                                // NOTE: this = platform

                                this.then(function() {

                                    // NOTE: this = platform

                                    var done = function(newApplication)
                                    {
                                        Gitana.Utils.UI.unblock(function() {
                                            self.app().run('GET', self.LINK().call(self,newApplication));
                                        });
                                    };

                                    if (stack == "stack1")
                                    {
                                        var app = null;
                                        this.createApplication(formVal).then(function() {
                                            app = this;
                                        });
                                        var insight = null;
                                        this.createRepository({"title": "Insight"}).then(function() {
                                            insight = this;
                                        });
                                        var content = null;
                                        this.createRepository({"title": "Content"}).then(function() {
                                            content = this;
                                        });

                                        this.then(function() {

                                            this.createStack({
                                                "title": "Stack for: " + app.getId()
                                            }).then(function() {

                                                this.assignDataStore(app, "app");
                                                this.assignDataStore(insight, "insight");
                                                this.assignDataStore(content, "content");

                                                this.then(function() {
                                                    done(app);
                                                });
                                            });
                                        });
                                    }
                                    else
                                    {
                                        this.createApplication(formVal).then(function() {
                                            done(this);
                                        });
                                    }

                                });

                            });
                        }
                    });
                }
            });
        },

        setupForms : function (el) {
            this.setupApplicationAddForm(el);
        },

        setupPage : function(el) {

            var page = {
                "title" : "New Application",
                "description" : "Create a new application.",
                "forms" :[{
                    "id" : "application-add",
                    "title" : "Create A New Application",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'application-add', 24),
                    "buttons" :[
                        {
                            "id" : "application-add-create",
                            "title" : "Create Application",
                            "isLeft" : true
                        }
                    ]
                }]
            };

            this.page(Alpaca.mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.ApplicationAdd);

})(jQuery);