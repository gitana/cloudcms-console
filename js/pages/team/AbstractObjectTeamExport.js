(function($) {
    Gitana.Console.Pages.AbstractObjectTeamExport = Gitana.Console.Pages.AbstractExport.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        targetObject: function() {
            return this.team();
        }

    });

})(jQuery);