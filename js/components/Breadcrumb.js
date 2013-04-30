(function($) {
    Gitana.CMS.Components.Breadcrumb = Gitana.CMS.Components.AbstractComponentGadget.extend(
    {
        TEMPLATE : "components/breadcrumb",

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        index: function(el) {
            var self = this;

            self.setupRefreshSubscription(el);

            var breadcrumb = this.model(el);

            if (breadcrumb) {
                $.each(breadcrumb, function(i, item) {

                    item["visibility"] = false;

                    if (item.requiredAuthorities) {
                        self.checkAuthorities(function(isEntitled) {
                            if (isEntitled) {
                                // turn on the item
                                item["visibility"] = true;
                                var itemIndex = i + 1;
                                $('#breadcrumbs li:eq(' + itemIndex + ')').show();
                                $('#breadcrumbs li:eq(' + itemIndex + ')', $(el)).show();
                            }
                        }, item.requiredAuthorities);
                    } else {
                        // turn on the item
                        item["visibility"] = true;
                    }
                });

                // render
                self.renderTemplate(el, self.TEMPLATE, function(el) {

                    el.swap();

                });
            }
        }
    });

    Ratchet.GadgetRegistry.register("breadcrumb", Gitana.CMS.Components.Breadcrumb);

})(jQuery);