(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.RuleConditionsField = Alpaca.Fields.ArrayField.extend(
    /**
     * @lends Alpaca.Fields.RuleConditionsField.prototype
     */
    {
        /**
         * @constructs
         * @augments Alpaca.Fields.ArrayField
         *
         * @class Rule Conditions control.
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

        // OVERRIDE
        addItem: function(index, fieldOptions, value, insertAfterId) {
            var _this = this;
            if (_this._validateEqualMaxItems()) {

                var onAddCondition = function(that, index, fieldOptions, value, insertAfterId) {
                    return function(conditionConfig)
                    {
                        that._addItem.call(that, index, fieldOptions, conditionConfig, insertAfterId);
                    }
                }(_this, index, fieldOptions, value, insertAfterId);

                // pop up a modal
                var items = [];
                var ids = Gitana.Console.Rule.ConditionRegistry.getIds();
                for (var i = 0; i < ids.length; i++)
                {
                    var conditionId = ids[i];

                    var condition = Gitana.Console.Rule.ConditionRegistry.find(conditionId);
                    items.push({
                        "title": condition.title,
                        "description": condition.description,
                        "iconClass": condition.iconClass,
                        "click": function(condition, conditionId) {
                            return function() {
                                condition.onAddCondition(function(conditionConfig) {
                                    onAddCondition.call(_this, {
                                        "_key": "condition_" + new Date().getTime(),
                                        "id": conditionId,
                                        "config": conditionConfig
                                    });
                                });
                                return false;
                            }
                        }(condition, conditionId)
                    });
                }
                Gitana.Utils.UI.modalSelector({
                    "title": "Which condition do you want to add?",
                    "items": items
                });
            }
        },

        /**
         * @see Alpaca.Fields.ArrayField#getTitle
		 */
		getTitle: function() {
			return "Rule Conditions Field";
		},

		/**
         * @see Alpaca.Fields.ArrayField#getDescription
		 */
		getDescription: function() {
			return "Rule Conditions Field";
		},

		/**
         * @see Alpaca.Fields.ArrayField#getFieldType
         */
        getFieldType: function() {
            return "rule-conditions";
        }
    });

    Alpaca.registerFieldClass("rule-conditions", Alpaca.Fields.RuleConditionsField);

})(jQuery);
