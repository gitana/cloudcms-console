(function($) {
    Gitana.CMS.Components.Commands = Gitana.CMS.Components.AbstractComponentGadget.extend(
    {
        TEMPLATE : "components/commands",

        index: function(el) {
            var self = this;

            // subscribe: "commands"
            self.setupRefreshSubscription(el);

            var commands = self.model(el);
            if (commands)
            {
                var items = commands.items ? commands.items : {};

                var allRequiredAuthorities = [];
                $.each(items, function(i, item) {
                    if (item.requiredAuthorities) {
                        $.merge(allRequiredAuthorities, item.requiredAuthorities);
                    }
                });

                self.checkAuthorities(function() {

                    $.each(items, function(i, item) {

                        item["visibility"] = false;

                        if (item.requiredAuthorities) {
                            self.checkAuthorities(function(isEntitled) {
                                if (isEntitled) {
                                    // turn on the item
                                    item["visibility"] = true;
                                }
                            }, item.requiredAuthorities);
                        } else {
                            // turn on the item
                            item["visibility"] = true;
                        }
                    });

                    // transform
                    self.renderTemplate(el, self.TEMPLATE, function(el) {

                        $('.commands-item', $(el)).each(function(index, item) {
                            var itemId = $(this).attr("item-id");

                            var itemConfig = items[itemId];

                            $(this).click(function() {

                                if (itemConfig && itemConfig.click) {
                                    itemConfig.click();
                                }

                                if (itemConfig && itemConfig.url) {
                                    self.app().run("GET", itemConfig.url);
                                }

                            });
                        });

                        el.swap();

                    });

                }, allRequiredAuthorities);
            }
        }
    });

    Ratchet.GadgetRegistry.register("commands", Gitana.CMS.Components.Commands);

})(jQuery);