(function($) {
    Gitana.CMS.Components.Searchbar = Gitana.CMS.Components.AbstractComponentGadget.extend(
    {
        TEMPLATE : "components/searchbar"
    });

    Ratchet.GadgetRegistry.register("searchbar", Gitana.CMS.Components.Searchbar);

})(jQuery);