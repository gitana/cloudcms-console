(function($) {
    Gitana.Console.Pages.AbstractObjectTeamExport = Gitana.Console.Pages.AbstractExport.extend(
    {
        targetObject: function() {
            return this.team();
        }

    });

})(jQuery);