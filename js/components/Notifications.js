(function($) {
    Gitana.CMS.Components.Notifications = Gitana.CMS.Components.AbstractComponentGadget.extend(
    {
        TEMPLATE : "components/notifications",

        preSwap: function(el) {
            $('span.hide', $(el)).click(function() {
                $(this).parent().slideUp();
            });
        }
    });

    Ratchet.GadgetRegistry.register("notifications", Gitana.CMS.Components.Notifications);

})(jQuery);