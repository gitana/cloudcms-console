(function($) {
    Gitana.Console.Components.TenantBar = Gitana.CMS.Components.AbstractComponentGadget.extend(
    {
        TEMPLATE : "components/tenant-bar",

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        }

        /*
        ,

        index: function(el) {
            var self = this;

            this.subscribe(this.subscription, this.refresh);

            var tenant = this.model(el);

            // render
            self.renderTemplate(el, self.TEMPLATE, function(el) {

                if (tenant) {
                    var tenantTitle = self.friendlyTitle(tenant);
                    $('.tenant-link',$(el)).html('<a rel="tooltip-html" title="Platform Dashboard" href="#/'  + '">' + tenantTitle + '</a>');
                    $('#info-dialog',$(el)).attr('title', 'About '+tenantTitle);
                    $('#info-dialog p',$(el)).html(tenant.getDescription() ? tenant.getDescription() : "");
                }

                el.swap();
            });
        }
        */

    });

    Ratchet.GadgetRegistry.register("tenantbar", Gitana.Console.Components.TenantBar);

})(jQuery);