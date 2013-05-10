(function($) {
    Gitana.Console.Pages.WebhostAdd = Gitana.CMS.Pages.AbstractFormPageGadget.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        schema: function() {
            return Alpaca.merge(this.base(), Gitana.Console.Schema.Webhost);
        },

        options: function() {
            var self = this;

            var options = Alpaca.merge(this.base(), Gitana.Console.Options.Webhost);

            return Alpaca.merge(options, {
                "fields" : {
                    "title" : {
                        "helper" : "Enter web host title."
                    },
                    "description" : {
                        "helper" : "Enter web host description."
                    }
                }
            });
        },

        setup: function() {
            this.get("/add/webhost", this.index);
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
            this.menu(Gitana.Console.Menu.Platform(this, "menu-platform-webhosts"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Webhosts(this), [
                {
                    "text" : "New Web Host"
                }
            ]));
        },

        setupWebhostAddForm : function (el) {
            var self = this;
            $('#webhost-add', $(el)).alpaca({
                "view": "VIEW_WEB_CREATE",
                "data": {},
                "schema": self.schema(),
                "options": self.options(),
                "postRender": function(form) {
                    Gitana.Utils.UI.beautifyAlpacaForm(form, 'webhost-add-create', true);
                    // Add Buttons
                    $('#webhost-add-create', $(el)).click(function() {
                        var formVal = form.getValue();
                        if (form.isValid(true)) {

                            Gitana.Utils.UI.block("Creating Web Host...");

                            self.targetObject().createWebHost(formVal).then(function() {
                                var newWebhost = this;
                                Gitana.Utils.UI.unblock(function() {
                                    self.app().run('GET', self.LINK().call(self,newWebhost));
                                });
                            });
                        }
                    });
                }
            });
        },

        setupForms : function (el) {
            this.setupWebhostAddForm(el);
        },

        setupPage : function(el) {

            var page = {
                "title" : "New Web Host",
                "description" : "Create a new web host.",
                "forms" :[{
                    "id" : "webhost-add",
                    "title" : "Create A New Web Host",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'webhost-add', 24),
                    "buttons" :[
                        {
                            "id" : "webhost-add-create",
                            "title" : "Create Web Host",
                            "isLeft" : true
                        }
                    ]
                }]
            };

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.WebhostAdd);

})(jQuery);