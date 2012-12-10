(function($) {
    Gitana.CMS.Components.Alerts = Gitana.CMS.Components.AbstractComponentGadget.extend(
    {
        TEMPLATE : "components/alerts",

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        preSwap: function(el) {
            $('span.hide', $(el)).click(function() {
                $(this).parent().slideUp();
            });
        }
    });

    Ratchet.GadgetRegistry.register("alerts", Gitana.CMS.Components.Alerts);

})(jQuery);