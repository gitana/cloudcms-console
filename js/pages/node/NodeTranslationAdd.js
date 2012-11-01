(function($) {
    Gitana.Console.Pages.NodeTranslationAdd = Gitana.CMS.Pages.AbstractFormPageGadget.extend({
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/repositories/{repositoryId}/branches/{branchId}/nodes/{nodeId}/add/translation", this.index);
        },

        targetObject: function() {
            return this.node();
        },

        contextObject: function() {
            return this.branch();
        },

        requiredAuthorities: function() {
            return [
                {
                    "permissioned" : this.contextObject(),
                    "permissions" : ["create_subobjects"]
                }
            ];
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Node(this, "menu-translations"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Translations(this), [
                {
                    "text" : "New Translation"
                }
            ]));
        },

        schema: function() {

            var multilingualConfigs = this.targetObject().getFeature('f:multilingual');

            var defaultEdition = multilingualConfigs && multilingualConfigs['edition'] ? multilingualConfigs['edition'] : "edition1";

            return {
                "type" : "object",
                "properties" : {
                    "locale" : Alpaca.cloneObject(Gitana.Console.Schema.Locale),
                    "edition" : {
                        "type" : "string",
                        "title" : "Edition",
                        "required" : true,
                        "default" : defaultEdition
                    },
                    "duplicate" : {
                        "type" : "boolean",
                        "title" : "Duplicate",
                        "default" : true
                    }
                }
            };
        },

        options: function() {
            var self = this;
            var options = {
                "fields" : {
                    "locale" : Alpaca.cloneObject(Gitana.Console.Options.Locale),
                    "edition" : {
                        "helper" : "Enter edition of the translation."
                    },
                    "duplicate" : {
                        "type" : "checkbox",
                        "rightLabel" : "Make a copy of the original node?"
                    }
                },
                "validator" : function(control, callback) {
                    var controlVal = control.getValue();

                    var locale = controlVal['locale'];
                    var edition = controlVal['edition'];

                    if (locale && edition) {
                        Chain(self.targetObject()).locales(edition, function(locales) {
                            if ($.inArray(locale, locales) == -1) {
                                callback({
                                    "message": "Valid locale and edition combination.",
                                    "status": true
                                });
                            } else {
                                callback({
                                    "message": "Translation for Edition " + edition + " and Locale " + locale + " already exists!",
                                    "status": false
                                });
                            }
                        });
                    }
                }
            };

            return options;
        },

        createTranslation: function(formVal) {
            var self = this;
            Gitana.Utils.UI.block("Creating Translation...");

            var newObj = {
                "_type" : self.node().getTypeQName()
            };

            if (formVal['duplicate']) {
                Alpaca.mergeObject(newObj,self.node().object);
                $.each(newObj,function(k,v) {
                    if (Alpaca.startsWith(k,'_')) {
                        delete newObj[k];
                    }
                })
            }

            newObj["_type"] = self.node().getTypeQName();
            newObj["title"] = self.node().getTitle() + " (Translation for " + formVal['locale'] + ")"

            self.node().createTranslation(formVal['edition'], formVal['locale'], newObj).then(function() {
                this.readTranslation(formVal['edition'], formVal['locale']).then(function() {
                    var link = self.LINK().call(self, this, 'edit');
                    var localized = this.getFeature('f:localized');
                    if (localized && localized['translation-node-id']) {
                        link = self.LIST_LINK().call(self, 'nodes') + localized['translation-node-id'] + '/edit';
                    }
                    var callback = function() {
                        self.app().run("GET", link);
                    };
                    Gitana.Utils.UI.unblock(callback);
                });
            });
        },

        setupNodeAddForm : function (el) {
            var self = this;
            var formDiv = el ? $('#translation-add', $(el)) : $('#translation-add');

            var schema = self.schema();
            var options = self.options();

            Chain(self.targetObject()).locales(schema["properties"]["edition"]["default"], function(locales) {

                var defaultLocale = "";

                $.each(Gitana.Console.Schema.Locale['enum'],function(i,v) {
                    if ($.inArray(v, locales) == -1) {
                        defaultLocale = v;
                        return false;
                    }
                });

                formDiv.empty().alpaca({
                    "data" : {
                        "locale" : defaultLocale
                    },
                    "schema" : schema,
                    "options": options,
                    "postRender": function(form) {

                        Gitana.Utils.UI.beautifyAlpacaForm(form, 'translation-add-create', true);

                        // Add Buttons
                        var buttonDiv = $('#translation-add-create').length > 0 ? $('#translation-add-create') : $('#translation-add-create', $(el));
                        buttonDiv.click(function() {

                            var formVal = form.getValue();

                            if (form.isValid(true)) {

                                self.createTranslation(formVal);
                            }
                        });
                    }
                });
            });
        },

        setupForms : function (el) {

            var self = this;

            this.setupNodeAddForm(el);
        },

        setupPage: function(el) {

            var page = {
                "title" : "New Translation",
                "description" : "Create a new translation of node " + this.friendlyTitle(this.targetObject()) + ".",
                "forms" :[
                    {
                        "id" : "translation-add",
                        "title" : "Create A New Translation",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'translation-add', 24),
                        "buttons" :[
                            {
                                "id" : "translation-add-create",
                                "title" : "Create Translation",
                                "isLeft" : true
                            }
                        ]
                    }
                ]
            };

            this.page(Alpaca.mergeObject(page, this.base(el)));

        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.NodeTranslationAdd);

})(jQuery);