(function($) {
    Gitana.Console.Pages.AbstractObjectTeamImport = Gitana.Console.Pages.AbstractImport.extend(
    {
        targetObject: function() {
            return this.team();
        }
    });

})(jQuery);