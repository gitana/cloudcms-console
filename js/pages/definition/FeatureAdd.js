(function($) {
    Gitana.Console.Pages.FeatureAdd = Gitana.CMS.Pages.AbstractFormPageGadget.extend(
    {
        ROOT_KEY: "mandatoryFeatures",

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        targetObject: function() {
            return this.definition();
        },

        targetFeaturesObject: function() {
            /*
            if (this.targetObject().object[this.ROOT_KEY] == null) {
                this.targetObject().object[this.ROOT_KEY] = {
                };
            }
            return this.targetObject().object[this.ROOT_KEY];
            */
            return this.targetObject().__features();
        },

        featuresLink: function() {
            return this.LIST_LINK().call(this,"features");
        },

        schema: function(featureIds) {

            var schema = {
                "type" : "object",
                "properties" : {
                    "feature" : {
                        "title": "Feature Type",
                        "type" : "string",
                        "enum" : featureIds,
                        "default" : featureIds[0] ? featureIds[0] : ""
                    }
                }
            };

            var defaultSchema = Alpaca.cloneObject(Gitana.Console.Schema["Features"]);

            $.each(featureIds, function(index,val) {

                if (defaultSchema[val]) {

                    schema['properties'][val] = defaultSchema[val];

                    schema['properties'][val]["dependencies"] = "feature";

                }

            });

            var defaultIds = [] ;

            $.each(featureIds, function(index,val) {

                if (!schema['properties'][val]) {

                    defaultIds.push(val);

                }

            });

            if (defaultIds.length > 0) {

               schema['properties']['featureDefault'] = defaultSchema['default'];

               schema['properties']['featureDefault']["dependencies"] = "feature";

            }


            return schema;
        },

        options: function(featureIds, featureLabels) {

            var self = this;

            var options = {
                "fields" : {
                    "feature" : {
                        "type": "select",
                        "helper" : "Pick feature type.",
                        "optionLabels" : featureLabels
                    }
                }
            };

            var defaultOptions = Alpaca.cloneObject(Gitana.Console.Options["Features"]);

            $.each(featureIds, function(index,val) {

                if (defaultOptions[val]) {

                    options['fields'][val] = defaultOptions[val];

                    options['fields'][val]["dependencies"] = {
                        "feature": val
                    };

                }

            });

            var defaultIds = [] ;

            $.each(featureIds, function(index,val) {

                if (!options['fields'][val]) {

                    defaultIds.push(val);

                }

            });

            if (defaultIds.length > 0) {

                options['fields']['featureDefault'] = defaultOptions['default'];

                options['fields']['featureDefault']["dependencies"] = {
                    "feature": defaultIds
                };

            }

            return options;
        },

        setup: function() {
            this.get("/repositories/{repositoryId}/branches/{branchId}/definitions/{definitionId}/add/feature", this.index);
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
            this.menu(Gitana.Console.Menu.Type(this,"menu-definition-features"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Features(this), [
                {
                    "text" : "New Feature"
                }
            ]));
        },

        setupFeatureAddForm: function (el, callback) {

            var self = this;

            this.features = [];

            Chain(self.branch()).listDefinitions('feature', {
                "limit": Gitana.Console.LIMIT_NONE
            }).each(function() {

                self.features.push(this);

            }).then(function() {

                var existingFeatures = self.targetFeaturesObject();

                var featureIds = [];
                var featureLabels = [];

                $.each(self.features, function() {

                    var featureId = this.getQName();

                    var label = this.getDescription() ? featureId + " - " + this.getDescription() : featureId;

                    if (!existingFeatures[featureId]) {

                        featureIds.push(featureId);
                        featureLabels.push(label);

                    }
                });

                $('#feature-add', $(el)).alpaca({

                    "schema": self.schema(featureIds),

                    "options": self.options(featureIds, featureLabels),

                    "view": "VIEW_WEB_CREATE_LIST",

                    "postRender": function(renderedField) {

                        Gitana.Utils.UI.uniform(renderedField.getEl());
                        renderedField.getEl().css('border', 'none');

                        // Add Buttons
                        $('#feature-add-create', $(el)).click(function() {

                            var value = renderedField.getValue();

                            var featureId = value['feature'];

                            delete value['feature'];

                            if (renderedField.isValid(true)) {

                                var featureVal = {};

                                if (value[featureId]) {
                                    featureVal = value[featureId];
                                } else if (value['featureDefault']) {
                                    featureVal = value['featureDefault'];
                                }


                                Gitana.Utils.UI.block("Adding Feature ...");

                                // var definitionObj = self.targetFeaturesObject();

                                // definitionObj[featureId] = {};

                                // _mergeObject(definitionObj[featureId],featureVal);


                                self.targetObject().addFeature(featureId,featureVal).then(function() {

                                    var link = self.featuresLink();

                                    var callback = function() {

                                        self.app().run("GET", link);

                                    };

                                    Gitana.Utils.UI.unblock(callback);

                                });

                            }
                        });

                        el.swap();

                        callback();
                    }
                });

            });

        },

        setupForms : function (el, callback) {
            this.setupFeatureAddForm(el, callback);
        },

        index: function(el, callback) {
            var self = this;

            this.tokens = el.tokens;

            // load context
            self.loadContext(el, function() {

                self.checkAuthorities(function(isEntitled, error) {
                    if (isEntitled) {

                        // set up menu
                        self.setupMenu();

                        // set up breadcrumb
                        self.setupBreadcrumb(el);

                        // set up toolbar
                        // self.setupToolbar(el);

                        // set up the page
                        self.setupPage(el);

                        // detect changes to the list and redraw when they occur
                        self.setupRefreshSubscription(el);

                        // list model
                        var page = self.model(el);

                        // render layout
                        self.renderTemplate(el, self.TEMPLATE, function(el) {

                            Gitana.Utils.UI.contentBox($(el));

                            Gitana.Utils.UI.jQueryUIDatePickerPatch();

                            self.setupForms(el, function() {

                                if (callback)
                                {
                                    callback();
                                }

                            });

                        });
                    } else {
                        self.handleUnauthorizedPageAccess(el, error);
                    }
                });
            });
        },

        setupPage : function(el) {

            var page = {
                "title" : "New Feature",
                "description" : "Add a new feature.",
                "forms" :[{
                    "id" : "feature-add",
                    "title" : "Add A New Feature",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'features-add', 24),
                    "buttons" :[
                        {
                            "id" : "feature-add-create",
                            "title" : "Add Feature",
                            "isLeft" : true
                        }
                    ]
                }]
            };

            this.page(_mergeObject(page,this.base(el)));
        }

    });

    //Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.FeatureAdd);

})(jQuery);