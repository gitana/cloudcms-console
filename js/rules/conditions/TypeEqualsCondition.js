(function($)
{
    Gitana.Console.Rule.TypeEqualsCondition = Gitana.Console.Rule.AbstractSingleFormCondition.extend({

        constructor: function()
        {
            this.base({
                "id": "typeEquals",
                "title": "Type Equals",
                "description": "Checks whether the type of the node equals a given value",
                "operationText": "The node type is '${value}'",
                "iconClass": "rule-48"
            });
        },

        definitions: function(callback)
        {
            var self = this;

            if (!this._definitions)
            {
                this._definitions = {
                    qnames: [],
                    names: [],
                    labels: {}
                };

                var branch = this.observable("branch").get();
                Chain(branch).listDefinitions().each(function() {
                    self._definitions.qnames.push(this.getQName());
                    self._definitions.names.push(this["title"]);
                    self._definitions.labels[this.getQName()] = this["title"];
                }).then(function() {
                    callback(self._definitions);
                });
            }
            else
            {
                callback(self._definitions);
            }
        },

        schema: function(callback)
        {
            this.definitions(function(definitions) {
                callback({
                    "type": "object",
                    "properties": {
                        "value": {
                            "title": "Type",
                            "type": "string",
                            "required": true,
                            "default": "n:node",
                            "enum": definitions.qnames
                        }
                    }
                });

            });
        },

        options: function(callback)
        {
            this.definitions(function(definitions) {
                callback({
                    "hideInitValidationError": true,
                    "fields": {
                        "value": {
                            "type": "select",
                            "helper": "Pick the content type to be matched.",
                            "optionLabels": definitions.labels,
                            "hideInitValidationError": true
                        }
                    }
                });
            });
        }

    });

    // auto register
    Gitana.Console.Rule.ConditionRegistry.register(new Gitana.Console.Rule.TypeEqualsCondition());

})(jQuery);