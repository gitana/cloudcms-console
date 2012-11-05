(function($) {
    Gitana.Console.Pages.FeatureEdit = Gitana.CMS.Pages.AbstractFormPageGadget.extend(
    {
        ROOT_KEY: "mandatoryFeatures",

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        featuresLink: function() {
            return this.LIST_LINK().call(this,"features");
        },

        targetObject: function() {
            return this.definition();
        },

        targetFeaturesObject: function() {
            //return this.targetObject().object[this.ROOT_KEY];
            return this.targetObject().__features();
        },

        featureId: function(el) {

            if (this.featureToken) {

                return this.featureToken;

            } else {

                var token = el.tokens['featureId'];

                //TODO : need to figure how to configure apache to avoid encoding already-encoded url
                while (token && token.indexOf('%') !=  -1) {

                    token = decodeURIComponent(token);

                }

                this.featureToken = token;

                return this.featureToken;
            }
        },

        schema: function(featureId) {

            var schema = {
                "type" : "object",
                "properties" : {
                }
            };

            var defaultSchema = Gitana.Console.Schema["Features"];

            if (defaultSchema[featureId]) {

                schema['properties'][featureId] = defaultSchema[featureId];

            } else {

                schema['properties'][featureId] = defaultSchema['default'];

            }

            return schema;
        },

        options: function(featureId) {

            var self = this;

            var options = {
                "fields" : {
                }
            };

            var defaultOptions = Gitana.Console.Options["Features"];

            if (defaultOptions[featureId]) {

                options['fields'][featureId] = defaultOptions[featureId];

            } else {

                options['fields'][featureId] = defaultOptions['default'];

            }

            return options;
        },

        view: function(featureId) {

            var defaultSchema = Gitana.Console.Schema["Features"];

            if (defaultSchema[featureId]) {

                return "VIEW_WEB_EDIT_LIST";

            } else {

                return "VIEW_WEB_EDIT";

            }
        },

        setup: function() {
            this.get("/repositories/{repositoryId}/branches/{branchId}/definitions/{definitionId}/features/{featureId}/edit", this.index);
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Type(this, "menu-definition-features"));
        },

        setupBreadcrumb: function(el) {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Features(this), [
                {
                    "text" : "Edit Feature " + this.featureId(el)
                }
            ]));
        },

        setupFeatureEditForm : function (el) {

            var self = this;

            var featureId = this.featureId(el);

            var defaultData = {};

            defaultData[featureId] = self.targetFeaturesObject()[featureId];

            $('#feature-edit', $(el)).alpaca({

                "data" : defaultData,

                "schema": self.schema(featureId),

                "options": self.options(featureId),

                "view" : self.view(featureId),

                "postRender": function(renderedField) {

                    Gitana.Utils.UI.uniform(renderedField.getEl());
                    renderedField.getEl().css('border', 'none');

                    // Add Buttons
                    $('#feature-edit-save', $(el)).click(function() {

                        var value = renderedField.getValue();

                        if (renderedField.isValid(true)) {

                            self.targetFeaturesObject()[featureId] = value[featureId];

                            Gitana.Utils.UI.block("Updating feature " + featureId + "...");

                            self.targetObject().update().then(function() {

                                var link = self.featuresLink();

                                var callback = function() {

                                    self.app().run("GET", link);

                                };

                                Gitana.Utils.UI.unblock(callback);

                            });

                        }
                    });
                }
            });

        },

        setupForms : function (el) {
            this.setupFeatureEditForm(el);
        },

        setupPage : function(el) {

            var page = {
                "title" : "Edit Definition Feature",
                "description" : "Edit configurations of feature " + this.featureId(el) + ".",
                "forms" :[
                    {
                        "id" : "feature-edit",
                        "title" : "Edit Definition Feature " + this.featureId(el),
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'features-edit', 24),
                        "buttons" :[
                            {
                                "id" : "feature-edit-save",
                                "title" : "Save Feature",
                                "isLeft" : true
                            }
                        ]
                    }
                ]
            };

            this.page(Alpaca.mergeObject(page,this.base(el)));
        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.FeatureEdit);

})(jQuery);