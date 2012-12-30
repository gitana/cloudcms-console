(function($)
{
    Gitana.Console.Rule.PropertyComparisonCondition = Gitana.Console.Rule.AbstractSingleFormCondition.extend({

        constructor: function()
        {
            this.base({
                "id": "propertyComparison",
                "title": "Property Comparison",
                "description": "Checks how a property value compares to a value specified.",
                "operationText": "The node property '${property}' is ${comparison} the value '${value}'",
                "iconClass": "rule-48"
            });
        },

        schema: function(callback)
        {
            callback({
                "type": "object",
                "properties": {
                    "property": {
                        "title": "Property Name",
                        "type": "string",
                        "required": true
                    },
                    "comparison": {
                        "title": "Comparison",
                        "type": "string",
                        "required": true,
                        "enum": [
                            "&gt;",
                            "&lt;",
                            "$eq;"
                        ]
                    },
                    "value": {
                        "title": "Property Value",
                        "type": "string",
                        "required": true
                    }
                }
            });
        },

        options: function(callback)
        {
            callback({
                "hideInitValidationError": true,
                "fields": {
                    "property": {
                        "helper": "Enter the name of the property",
                        "hideInitValidationError": true
                    },
                    "comparison": {
                        "helper": "How should the value be compared?",
                        "hideInitValidationError": true,
                        "optionLabels": {
                            "&gt;": "Greater Than",
                            "&lt;": "Less Than",
                            "$eq;": "Equal To"
                        }
                    },
                    "value": {
                        "helper": "Enter the value to be matched",
                        "hideInitValidationError": true
                    }
                }
            });
        }
    });

    // auto register
    Gitana.Console.Rule.ConditionRegistry.register(new Gitana.Console.Rule.PropertyComparisonCondition());

})(jQuery);