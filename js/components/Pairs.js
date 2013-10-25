(function($) {
    Gitana.CMS.Components.Pairs = Gitana.CMS.Components.AbstractComponentGadget.extend(
    {
        TEMPLATE: "components/pairs",

        preSwap: function(el) {
            Gitana.Utils.UI.contentBox($(el));
        }
    });

    Ratchet.GadgetRegistry.register("pairs", Gitana.CMS.Components.Pairs);

})(jQuery);