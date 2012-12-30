(function($)
{
    Gitana.Console.Rule.ExecuteScriptNodeAction = Gitana.Console.Rule.AbstractSingleFormAction.extend({

        constructor: function()
        {
            this.base({
                "id": "executeScriptNode",
                "title": "Execute Script Node",
                "description": "Executes a script node",
                "operationText": "A script for node '${scriptNodeId}' and attachment '${scriptAttachmentId}' is executed.",
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
                        "required": true,
                        "default": "default"
                    },
                    "methodName": {
                        "title": "Method Name",
                        "type": "string",
                        "default": "execute"
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
                        "type": "gitananodepicker",
                        "helper": "Pick the node that holds the script to execute.",
                        "hideInitValidationError": true,
                        "branch": this.observable("branch").get()
                    },
                    "scriptAttachmentId": {
                        "helper": "The ID of the attachment that holds the script to execute.",
                        "hideInitValidationError": true
                    },
                    "methodName": {
                        "helper": "The name of the method in the script to execute."
                    }
                }
            });
        }

    });

    // auto register
    Gitana.Console.Rule.ActionRegistry.register(new Gitana.Console.Rule.ExecuteScriptNodeAction());

})(jQuery);