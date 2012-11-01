(function(window) {
    var Gitana = window.Gitana;

    Gitana.Setting = Gitana.Chainable.extend(
    {
        constructor: function(object, key) {
            this.base();

            this.objectType = "Gitana.Setting";

            this.key = key;

            this.object = object;
        },

        getId: function() {
            return this.key;
        },

        getValue: function() {
            return this.object;
        }

    });

})(window);