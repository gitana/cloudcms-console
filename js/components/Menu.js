(function($) {
    Gitana.CMS.Components.Menu = Gitana.CMS.Components.AbstractComponentGadget.extend(
    {
        TEMPLATE : "components/menu",

        index: function(el, callback) {
            var self = this;

            self.setupRefreshSubscription(el);

            var menu = self.model(el);

            if (menu) {

                $.each(menu.items, function(i, item) {

                    item["visibility"] = false;

                    if (item.requiredAuthorities) {
                        self.checkAuthorities(function(isEntitled) {
                            if (isEntitled) {
                                // turn on the item
                                item["visibility"] = true;
                                $('.menu li:eq(' + i + ')').show();
                                $('.menu li:eq(' + i + ')', $(el)).show();
                            }
                        }, item.requiredAuthorities);
                    } else {
                        // turn on the item
                        item["visibility"] = true;
                    }
                });

                self.renderTemplate(el, self.TEMPLATE, function(el) {
                    $('.menu', $(el)).initMenu();
                    $('.menu li a.selectable', $(el)).slideList();
                    el.swap(function(swappedEl) {

                        if (callback)
                        {
                            callback();
                        }
                    });
                });

            }
            else
            {
                if (callback)
                {
                    callback();
                }
            }
        }

    });

    Ratchet.GadgetRegistry.register("menu", Gitana.CMS.Components.Menu);

})(jQuery);