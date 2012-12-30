(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.RuleActionsField = Alpaca.Fields.ArrayField.extend(
        /**
         * @lends Alpaca.Fields.RuleActionsField.prototype
         */
        {
            /**
             * @constructs
             * @augments Alpaca.Fields.ArrayField
             *
             * @class Rule Actions control.
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

                    var onAddAction = function(that, index, fieldOptions, value, insertAfterId) {
                        return function(actionConfig)
                        {
                            that._addItem.call(that, index, fieldOptions, actionConfig, insertAfterId);
                        }
                    }(_this, index, fieldOptions, value, insertAfterId);

                    // pop up a modal
                    var items = [];
                    var ids = Gitana.Console.Rule.ActionRegistry.getIds();
                    for (var i = 0; i < ids.length; i++)
                    {
                        var actionId = ids[i];

                        var action = Gitana.Console.Rule.ActionRegistry.find(actionId);
                        items.push({
                            "title": action.title,
                            "description": action.description,
                            "iconClass": action.iconClass,
                            "click": function(action, actionId) {
                                return function() {
                                    action.onAddAction(function(actionConfig) {
                                        onAddAction.call(_this, {
                                            "_key": "action_" + new Date().getTime(),
                                            "id": actionId,
                                            "config": actionConfig
                                        });
                                    });
                                    return false;
                                }
                            }(action, actionId)
                        });
                    }

                    Gitana.Utils.UI.modalSelector({
                        "title": "Which action do you want to add?",
                        "items": items
                    });
                }
            },

            /**
             * @see Alpaca.Fields.ArrayField#getTitle
             */
            getTitle: function() {
                return "Rule Actions Field";
            },

            /**
             * @see Alpaca.Fields.ArrayField#getDescription
             */
            getDescription: function() {
                return "Rule Actions Field";
            },

            /**
             * @see Alpaca.Fields.ArrayField#getFieldType
             */
            getFieldType: function() {
                return "rule-actions";
            }
        });

    Alpaca.registerFieldClass("rule-actions", Alpaca.Fields.RuleActionsField);

})(jQuery);
