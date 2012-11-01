(function($) {
    Gitana.CMS.Components.Stats = Gitana.CMS.Components.AbstractComponentGadget.extend(
    {
        TEMPLATE : "components/stats",

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        preSwap: function(el) {
            Gitana.Utils.UI.contentBox($(el));
        }

    });

    Ratchet.GadgetRegistry.register("stats", Gitana.CMS.Components.Stats);

})(jQuery);