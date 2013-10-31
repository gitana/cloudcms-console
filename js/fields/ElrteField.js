(function($) {

    var Alpaca = $.alpaca;

    Alpaca.Fields.ElrteField = Alpaca.Fields.TextAreaField.extend(
    /**
     * @lends Alpaca.Fields.WysiwygField.prototype
     */
    {
        /**
         * @constructs
         * @augments Alpaca.Fields.TextAreaField
         *
         * @class WYSIWYG control for chunk of text.
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
         * @see Alpaca.Fields.TextAreaField#setup
         */
        setup: function() {
            this.base();
        },

        getValue: function() {
            if (this.field.elrte) {
                this.field.elrte('updateSource');
            }
            return $(this.field).val();
        },

        /**
         * @see Alpaca.Fields.TextAreaField#postRender
         */
    	postRender: function(callback)
        {
            var self = this;

            this.base(function() {

                // see if we can render jWysiwyg
                if (self.field.elrte) {

                    self.field.addClass('alpaca-controlfield-elrte');

                    var opts = {
                        cssClass : 'el-rte',
                        // lang     : 'ru',
                        height   : 450,
                        toolbar  : 'complete',
                        cssfiles : ['console/css/thirdparty/jquery/elrte/css/elrte-inner.css']
                    };
                    $('body').bind('form-rendered', function(event, param) {
                        $('.alpaca-controlfield-elrte').elrte(opts);
                    });
                }

                callback();

            });
        },

		/**
         * @see Alpaca.Fields.TextAreaField#getTitle
		 */
		getTitle: function() {
			return "Elrte Editor";
		},

		/**
         * @see Alpaca.Fields.TextAreaField#getDescription
		 */
		getDescription: function() {
			return "Elrte editor for multi-line text.";
		},

		/**
         * @see Alpaca.Fields.TextAreaField#getFieldType
         */
        getFieldType: function() {
            return "elrte";
        }
    });

    Alpaca.registerFieldClass("elrte", Alpaca.Fields.ElrteField);

})(jQuery);
