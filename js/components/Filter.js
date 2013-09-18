(function($) {
    Gitana.CMS.Components.Filter = Gitana.CMS.Components.AbstractComponentGadget.extend(
    {
        TEMPLATE : "components/filter",

        index: function(el, callback) {
            var self = this;

            self.setupRefreshSubscription(el);

            var filter = this.model(el);

            // render
            self.renderTemplate(el, self.TEMPLATE, function(el) {

                if (filter && filter.form) {

                    $('.filter', $(el)).alpaca({
                        "data": filter.form.data,
                        "schema" : filter.form.schema,
                        "options" : filter.form.options,
                        "view" : filter.form.view,
                        "postRender": function (renderedField) {
                            filter.form.postRender(renderedField);
                            if (!filter.displayFilter) {
                                $('.filter',$(el)).css('display','none');
                            }
                            el.swap(function(swappedEl) {

                                if (callback)
                                {
                                    callback();
                                }

                            });
                        }
                    });
                }
            });
        }
    });

    Ratchet.GadgetRegistry.register("filter", Gitana.CMS.Components.Filter);

})(jQuery);