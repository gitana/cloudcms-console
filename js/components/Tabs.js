(function($) {
    Gitana.CMS.Components.Tabs = Gitana.CMS.Components.AbstractComponentGadget.extend(
    {
        TEMPLATE : "components/tabs",

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        index: function(el) {
            var self = this;

            // detect changes to the tabs and redraw when they occur
            this.subscribe(this.subscription, this.refresh);

            var tabs = self.model(el);

            var selected = -1;
            var count = 0;
            $.each(tabs, function(key, tab) {
                if (tab.active) {
                    selected = count;
                }
                count++;
            });

            // transform
            self.renderTemplate(el, self.TEMPLATE, function(el) {

                var config = {
                    select: function(event, ui) {

                        event.preventDefault();

                        var tabKey = $(ui.tab).attr("tabKey");
                        var tab = tabs[tabKey];

                        self.app().run(tab.uri);

                        return false;
                    }
                };
                if (selected != -1) {
                    config.selected = selected;
                }

                $(el).find(".tabs").tabs(config);

                el.swap();
            });
        }

    });

    Ratchet.GadgetRegistry.register("tabs", Gitana.CMS.Components.Tabs);

})(jQuery);