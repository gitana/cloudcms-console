(function($)
{
    Gitana.Console.Rule.PropertyEqualsCondition = Gitana.Console.Rule.AbstractSingleFormCondition.extend({

        constructor: function()
        {
            this.base({
                "id": "propertyEquals",
                "title": "Property Equals",
                "description": "Checks whether the node has a property equal to a given value",
                "operationText": "The node property '${property}' has the value '${value}'",
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
                    "value": {
                        "helper": "Enter the value to be matched",
                        "hideInitValidationError": true
                    }
                }
            });
        }
    });

    // auto register
    Gitana.Console.Rule.ConditionRegistry.register(new Gitana.Console.Rule.PropertyEqualsCondition());

})(jQuery);