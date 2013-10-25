(function($) {
    Gitana.CMS.Components.Stats = Gitana.CMS.Components.AbstractComponentGadget.extend(
    {
        TEMPLATE : "components/stats",

        preSwap: function(el) {
            Gitana.Utils.UI.contentBox($(el));
        }

    });

    Ratchet.GadgetRegistry.register("stats", Gitana.CMS.Components.Stats);

})(jQuery);