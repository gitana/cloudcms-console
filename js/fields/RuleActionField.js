(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.RuleActionField = Alpaca.Fields.ObjectField.extend(
        /**
         * @lends Alpaca.Fields.RuleActionField.prototype
         */
        {
            /**
             * @constructs
             * @augments Alpaca.Fields.ObjectField
             *
             * @class Rule Action control.
             *
             * @param {Object} container Field container.
             * @param {Any} data Field data.
             * @param {Object} options Field options.
             * @param {Object} schema Field schema.
             * @param {Object|String} view Field view.
             * @param {Alpaca.Connector} connector Field connector.
             * @param {Function} errorCallback Error callback.
             */
            constructor: function(container, data, options, schema, view, connector, errorCallback) {
                this.base(container, data, options, schema, view, connector, errorCallback);
            },

            /**
             * @see Alpaca.ContainerField#renderItems
             */
            renderItems: function() {
                var _this = this;
                var value = _this.data;

                // get the type of condition
                var type = value["id"];
                var config = value["config"];

                var action = Gitana.Console.Rule.ActionRegistry.find(type);
                if (!action)
                {
                    alert("Missing action: " + type);
                }

                var operationText = action.operationText;
                if (!operationText)
                {
                    alert("Missing operation text");
                }

                var html = Gitana.Utils.Render.processHtmlTemplate(operationText, config);

                $(this.fieldContainer).addClass("rule-action-operation-text");
                $(this.fieldContainer).append(html);

                this.renderValidationState();
            },

            /**
             * @see Alpaca.Fields.ObjectField#postRender
             */
            postRender: function() {
                this.base();
            },

            /**
             * @see Alpaca.Fields.ObjectField#getTitle
             */
            getTitle: function() {
                return "Rule Action Field";
            },

            /**
             * @see Alpaca.Fields.ObjectField#getDescription
             */
            getDescription: function() {
                return "Rule Action Field";
            },

            /**
             * @see Alpaca.Fields.ObjectField#getFieldType
             */
            getFieldType: function() {
                return "rule-action";
            }
        });

    Alpaca.registerFieldClass("rule-action", Alpaca.Fields.RuleActionField);

})(jQuery);
