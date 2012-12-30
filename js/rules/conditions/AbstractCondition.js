(function($)
{
    if (!Gitana.Console.Rule) {
        Gitana.Console.Rule = {};
    }
    Gitana.Console.Rule.AbstractCondition = Base.extend({

        constructor: function(config)
        {
            this.base();

            if (!config) {
                console.log("Abstract Condition: missing config");
            }
            if (!config.id) {
                console.log("Abstract Condition: missing config id");
            }

            // required
            this.id = config.id;

            // optional
            this.title = config.title ? config.title : null;
            this.description = config.description ? config.description : null;
            this.iconClass = config.iconClass ? config.iconClass : null;
            this.operationText = config.operationText ? config.operationText : null;
        },

        modalOpen: function(config)
        {
            this.dialog = Gitana.Utils.UI.modalOpen(config);
            this.context = config.context;

            return this.dialog;
        },

        modal: function()
        {
            return this.dialog;
        },

        modalClose: function()
        {
            if (this.dialog)
            {
                $(this.dialog).dialog('close');
            }

            $(this.dialog).remove();

            this.dialog = null;
            this.context = null;
        },

        /**
         * EXTENSION POINT
         *
         * This gets called when a condition of this type is being added.
         */
        onAddCondition: function(callback)
        {

        },

        /**
         * Reads an observable.
         *
         * @param [String] scope optional scope
         * @param {String} id the variable id
         */
        observable: function()
        {
            var scope;
            var id;

            var args = Ratchet.makeArray(arguments);
            if (args.length == 1)
            {
                scope = "global";
                id = args.shift();
            }
            else if (args.length == 2)
            {
                scope = args.shift();
                id = args.shift();
            }

            var observables = Ratchet.ScopedObservables.get(scope);
            return observables.observable(id);
        }

    });

})(jQuery);