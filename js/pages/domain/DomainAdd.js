(function($) {
    Gitana.Console.Pages.DomainAdd = Gitana.CMS.Pages.AbstractFormPageGadget.extend(
    {
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
                        //"helper" : "Enter domain title."
                    },
                    "description" : {
                        //"helper" : "Enter domain description."
                    }
                }
            });
        },

        setup: function() {
            this.get("/add/domain", this.index);
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
            this.menu(Gitana.Console.Menu.Platform(this, "menu-platform-domains"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Domains(this), [
                {
                    "text" : "New Domain"
                }
            ]));
        },

        setupDomainAddForm : function (el, callback) {
            var self = this;
            $('#domain-add', $(el)).alpaca({
                "view": "VIEW_WEB_CREATE",
                "data": {},
                "schema": self.schema(),
                "options": self.options(),
                "postRender": function(form) {
                    Gitana.Utils.UI.beautifyAlpacaForm(form, 'domain-add-create', true);
                    // Add Buttons
                    $('#domain-add-create', $(el)).click(function() {
                        var formVal = form.getValue();
                        if (form.isValid(true)) {

                            Gitana.Utils.UI.block("Creating Domain...");

                            self.targetObject().createDomain(formVal).then(function() {
                                var newDomain = this;
                                Gitana.Utils.UI.unblock(function() {
                                    self.app().run('GET', self.LINK().call(self,newDomain));
                                });
                            });
                        }
                    });

                    callback();
                }
            });
        },

        setupForms : function (el, callback) {
            this.setupDomainAddForm(el, callback);
        },

        setupPage : function(el) {

            var page = {
                "title" : "New Domain",
                "description" : "Create a new domain.",
                "forms" :[{
                    "id" : "domain-add",
                    "title" : "Create A New Domain",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'domain-add', 24),
                    "buttons" :[
                        {
                            "id" : "domain-add-create",
                            "title" : "Create Domain",
                            "isLeft" : true
                        }
                    ]
                }]
            };

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.DomainAdd);

})(jQuery);