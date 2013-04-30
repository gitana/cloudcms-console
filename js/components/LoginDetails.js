(function($) {
    Gitana.Console.Components.LoginDetails = Gitana.CMS.Components.AbstractComponentGadget.extend(
    {
        TEMPLATE : "components/login-details",

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        index: function(el) {
            var self = this;

            self.setupRefreshSubscription(el);

            this.model(el);

            // render
            self.renderTemplate(el, self.TEMPLATE, function(el) {

                var imageUrl = $('#tenant-logo',$(el)).attr('src');
                if (imageUrl == null || imageUrl != 'css/images/themes/clean/console/logos/logo-default.png') {
                    $('#tenant-logo',$(el)).attr('src', $('#tenant-logo',$(el)).attr('data-src'));
                }

                // Add logout button
                /*
                $('.logout',$(el)).click(function() {
                    self.server().logout().then(function() {
                        Gitana.deleteCookie("GITANA_USER", "/");
                        Gitana.CMS.refresh();
                    });
                });

                $('.user-button',$(el)).click(function() {
                    $('.dropdown-username-menu').slideToggle();
                });
                */
                el.swap();
            });
        }

    });

    Ratchet.GadgetRegistry.register("logindetails", Gitana.Console.Components.LoginDetails);

})(jQuery);