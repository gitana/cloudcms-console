(function(window) {
    var Gitana = window.Gitana;

    Gitana.Feature = Gitana.Chainable.extend(
    {
        constructor: function(value, key) {
            this.base();

            this.objectType = function() { return "Gitana.Feature"; };

            this.key = key;

            this.value = value;
        },
        
        /**
         * @override
         */
        clone: function()
        {
            return new Gitana.Feature(this.value, this.key);
        },

        getId: function() {
            return this.key;
        },

        getValue: function() {
            return this.value;
        }

    });

})(window);
