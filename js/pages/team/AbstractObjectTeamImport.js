(function($) {
    Gitana.Console.Pages.AbstractObjectTeamImport = Gitana.Console.Pages.AbstractImport.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        targetObject: function() {
            return this.team();
        }
    });

})(jQuery);