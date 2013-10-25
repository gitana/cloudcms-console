(function($) {
    Gitana.CMS.Components.Include = Gitana.CMS.Components.AbstractComponentGadget.extend(
    {
        TEMPLATE: "components/include",

        preSwap: function(el) {
            Gitana.Utils.UI.contentBox($(el));
        }
    });

    Ratchet.GadgetRegistry.register("include", Gitana.CMS.Components.Include);

})(jQuery);