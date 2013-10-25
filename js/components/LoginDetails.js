(function($) {
    Gitana.Console.Components.LoginDetails = Gitana.CMS.Components.AbstractComponentGadget.extend(
    {
        TEMPLATE : "components/login-details",

        index: function(el, callback) {
            var self = this;

            self.setupRefreshSubscription(el);

            this.model(el);

            // render
            self.renderTemplate(el, self.TEMPLATE, function(el) {

                var imageUrl = $('#tenant-logo',$(el)).attr('src');
                if (imageUrl == null || imageUrl != 'css/images/themes/clean/console/logos/logo-default.png') {
                    $('#tenant-logo',$(el)).attr('src', $('#tenant-logo',$(el)).attr('data-src'));
                }

                el.swap(function(swappedEl) {

                    if (callback)
                    {
                        callback();
                    }
                });
            });
        }

    });

    Ratchet.GadgetRegistry.register("logindetails", Gitana.Console.Components.LoginDetails);

})(jQuery);