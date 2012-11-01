(function($) {
    Gitana.CMS.Components.Notifications = Gitana.CMS.Components.AbstractComponentGadget.extend(
    {
        TEMPLATE : "components/notifications",

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        preSwap: function(el) {
            $('span.hide', $(el)).click(function() {
                $(this).parent().slideUp();
            });
        }
    });

    Ratchet.GadgetRegistry.register("notifications", Gitana.CMS.Components.Notifications);

})(jQuery);