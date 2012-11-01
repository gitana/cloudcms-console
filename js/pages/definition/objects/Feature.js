(function(window) {
    var Gitana = window.Gitana;

    Gitana.Feature = Gitana.Chainable.extend(
    {
        constructor: function(object, key) {
            this.base();

            this.objectType = "Gitana.Feature";

            this.key = key;

            this.object = object;
        },

        getId: function() {
            return this.key;
        }

    });

})(window);
