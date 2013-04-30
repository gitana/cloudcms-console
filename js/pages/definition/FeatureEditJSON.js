(function($) {
    Gitana.Console.Pages.FeatureEditJSON = Gitana.Console.Pages.FeatureEdit.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        schema: function(featureId) {

            var schema = {
                "type" : "object",
                "properties" : {
                }
            };

            var defaultSchema = Gitana.Console.Schema["Features"];

            schema['properties'][featureId] = defaultSchema['default'];

            return schema;
        },

        options: function(featureId) {

            var self = this;

            var options = {
                "fields" : {
                }
            };

            var defaultOptions = Gitana.Console.Options["Features"];

            options['fields'][featureId] = defaultOptions['default'];

            return options;
        },

        view: function(featureId) {
            return "VIEW_WEB_EDIT";
        },

        setup: function() {
            this.get("/repositories/{repositoryId}/branches/{branchId}/definitions/{definitionId}/features/{featureId}/edit/json", this.index);
        },

        setupBreadcrumb: function(el) {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Features(this), [
                {
                    "text" : "Edit Feature " + this.featureId(el) + " JSON"
                }
            ]));
        },

        setupPage : function(el) {

            var page = {
                "title" : "Edit Feature JSON",
                "description" : "Edi configurations of feature " + this.featureId(el) + ".",
                "forms" :[
                    {
                        "id" : "feature-edit",
                        "title" : "Edit Feature " + this.featureId(el) +" JSON",
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

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.FeatureEditJSON);

})(jQuery);