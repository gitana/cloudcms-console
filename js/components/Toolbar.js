(function($) {
    Gitana.CMS.Components.Toolbar = Gitana.CMS.Components.AbstractComponentGadget.extend(
    {
        TEMPLATE : "components/toolbar",

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        index: function(el) {
            var self = this;

            // subscribe: "toolbar"
            self.setupRefreshSubscription(el);

            var toolbar = self.model(el);

            if (toolbar) {

                var items = toolbar.items ? toolbar.items : {};
                if (toolbar.groups) {
                    $.each(toolbar.groups, function(i,group) {
                        Alpaca.mergeObject(items, group.items);
                    })
                }

                var allRequiredAuthorities = [];
                $.each(items, function(i, item) {
                    if (item.requiredAuthorities) {
                        $.merge(allRequiredAuthorities,item.requiredAuthorities);
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
                                    $('.list-toolbar-content .toolbar-list li[id="toolbar-item-' + i + '"]').show();
                                    $('.list-toolbar-content .toolbar-list li[id="toolbar-item-' + i + '"]', $(el)).show();
                                    $('.page-toolbar-content .toolbar-list li[id="toolbar-item-' + i + '"]').show();
                                    $('.page-toolbar-content .toolbar-list li[id="toolbar-item-' + i + '"]', $(el)).show();
                                }
                            }, item.requiredAuthorities);
                        } else {
                            // turn on the item
                            item["visibility"] = true;
                            $('.list-toolbar-content .toolbar-list li[id="toolbar-item-' + i + '"]').show();
                            $('.list-toolbar-content .toolbar-list li[id="toolbar-item-' + i + '"]', $(el)).show();
                            $('.page-toolbar-content .toolbar-list li[id="toolbar-item-' + i + '"]').show();
                            $('.page-toolbar-content .toolbar-list li[id="toolbar-item-' + i + '"]', $(el)).show();
                        }
                    });

                    if (toolbar.groups) {
                        $.each(toolbar.groups, function(i, group) {
                            $.each(group.items, function(j, item) {
                                item[['visibility']] = items[item.id]['visibility'];
                            })
                        })
                    }

                }, allRequiredAuthorities);

                // transform
                self.renderTemplate(el, self.TEMPLATE, function(el) {

                    $('.toolbar-item', $(el)).each(function(index, item) {
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

                        if (itemConfig && (itemConfig['selection'] == 'single' || itemConfig['selection'] == 'multiple')) {
                            // how to do disable
                            $('#toolbar-item-' + itemId, $(el)).hide();
                        }
                    });

                    if (toolbar.groups) {
                        $('body').bind('swap', function(event, param) {
                            if ($('.list-toolbar-content .easy-accordion').length == 0) {
                                $('.list-toolbar-content').easyAccordion({
                                    autoStart: false,
                                    slideNum:false
                                });
                            }
                        });
                    }

                    el.swap();

                });
            }
        }
    });

    Ratchet.GadgetRegistry.register("toolbar", Gitana.CMS.Components.Toolbar);

})(jQuery);