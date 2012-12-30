(function()
{
    if (!Gitana.Console.Rule) {
        Gitana.Console.Rule = {};
    }
    Gitana.Console.Rule.ActionRegistry = {};
    Gitana.Console.Rule.ActionRegistry.registry = {};

    /**
     * Registers a rule action.
     *
     * @param id
     * @param rule
     */
    Gitana.Console.Rule.ActionRegistry.register = function(action)
    {
        Gitana.Console.Rule.ActionRegistry.registry[action.id] = action;
    };

    /**
     * Retrieves a rule action by its id.
     *
     * @param id
     */
    Gitana.Console.Rule.ActionRegistry.find = function(id)
    {
        return Gitana.Console.Rule.ActionRegistry.registry[id];
    };

    /**
     * @return array of ids of all of the registered rule actions
     */
    Gitana.Console.Rule.ActionRegistry.getIds = function()
    {
        var ids = [];

        for (var id in Gitana.Console.Rule.ActionRegistry.registry)
        {
            ids.push(id);
        }

        return ids;
    }

})();
