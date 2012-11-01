(function(window) {
    var Gitana = window.Gitana;

    Gitana.Setting = Gitana.Chainable.extend(
    {
        constructor: function(value, key) {
            this.base();

            this.objectType = function() { return "Gitana.Setting"; };

            this.key = key;

            this.value = value;
        },
        
        /**
         * @override
         */
        clone: function()
        {
            return new Gitana.Setting(this.value, this.key);
        },

        getId: function() {
            return this.key;
        },

        getValue: function() {
            return this.value;
        }

    });

})(window);