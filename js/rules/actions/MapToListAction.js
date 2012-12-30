(function($)
{
    Gitana.Console.Rule.MapToListAction = Gitana.Console.Rule.AbstractSingleFormAction.extend({

        constructor: function()
        {
            this.base({
                "id": "mapToList",
                "title": "Map to List",
                "description": "Maps and optionally reduces the data from this node into a list.",
                "operationText": "The node is mapped to a list.",
                "iconClass": "rule-48"
            });
        },

        schema: function(callback)
        {
            callback({
                "type": "object",
                "properties": {
                    "scriptNodeId": {
                        "title": "Node ID",
                        "type": "string",
                        "required": true
                    },
                    "scriptAttachmentId": {
                        "title": "Attachment ID",
                        "type": "string",
                        "default": "default",
                        "required": true
                    },
                    /*
                    "script": {
                        "title": "Script",
                        "type": "string"
                    },
                    "scriptMimetype": {
                        "title": "Mimetype",
                        "type": "string",
                        "required": true
                    },
                    */
                    "reduce": {
                        "title": "Call reduce method?",
                        "type": "boolean",
                        "required": false
                    }

                }
            });
        },

        options: function(callback)
        {
            callback({
                "hideInitValidationError": true,
                "fields": {
                    "scriptNodeId": {
                        "helper": "Pick the node that contains your map() and optional reduce() methods.",
                        "hideInitValidationError": true,
                        "type": "gitananodepicker",
                        "branch": this.observable("branch").get()
                    },
                    "scriptAttachmentId": {
                        "helper": "The attachment that contains the script to execute.",
                        "hideInitValidationError": true
                    },
                    /*
                    "script": {
                        "helper": "Enter the script manually that you would like to execute."
                    },
                    "scriptMimetype": {
                        "helper": "Choose the kind of script this is."
                    },
                    */
                    "reduce": {
                        "helper": "Whether to call reduce() after mapping.",
                        "hideInitValidationError": true
                    }


                }
            });
        }
    });

    // auto register
    Gitana.Console.Rule.ActionRegistry.register(new Gitana.Console.Rule.MapToListAction());

})(jQuery);