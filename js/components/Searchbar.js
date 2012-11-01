(function($) {
    Gitana.CMS.Components.Searchbar = Gitana.CMS.Components.AbstractComponentGadget.extend(
    {
        TEMPLATE : "components/searchbar",

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        }
    });

    Ratchet.GadgetRegistry.register("searchbar", Gitana.CMS.Components.Searchbar);

})(jQuery);