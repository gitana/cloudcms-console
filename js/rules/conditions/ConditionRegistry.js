(function()
{
    if (!Gitana.Console.Rule) {
        Gitana.Console.Rule = {};
    }
    Gitana.Console.Rule.ConditionRegistry = {};
    Gitana.Console.Rule.ConditionRegistry.registry = {};

    /**
     * Registers a rule condition.
     *
     * @param id
     * @param rule
     */
    Gitana.Console.Rule.ConditionRegistry.register = function(condition)
    {
        Gitana.Console.Rule.ConditionRegistry.registry[condition.id] = condition;
    };

    /**
     * Retrieves a rule condition by its id.
     *
     * @param id
     */
    Gitana.Console.Rule.ConditionRegistry.find = function(id)
    {
        return Gitana.Console.Rule.ConditionRegistry.registry[id];
    };

    /**
     * @return array of ids of all of the registered rule conditions
     */
    Gitana.Console.Rule.ConditionRegistry.getIds = function()
    {
        var ids = [];

        for (var id in Gitana.Console.Rule.ConditionRegistry.registry)
        {
            ids.push(id);
        }

        return ids;
    }

})();
