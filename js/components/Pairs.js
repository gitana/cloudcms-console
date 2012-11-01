(function($) {
    Gitana.CMS.Components.Pairs = Gitana.CMS.Components.AbstractComponentGadget.extend(
    {
        TEMPLATE: "components/pairs",

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        preSwap: function(el) {
            Gitana.Utils.UI.contentBox($(el));
        }
    });

    Ratchet.GadgetRegistry.register("pairs", Gitana.CMS.Components.Pairs);

})(jQuery);