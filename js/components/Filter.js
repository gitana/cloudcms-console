(function($) {
    Gitana.CMS.Components.Filter = Gitana.CMS.Components.AbstractComponentGadget.extend(
    {
        TEMPLATE : "components/filter",

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        index: function(el) {
            var self = this;

            this.subscribe(this.subscription, this.refresh);

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
                            el.swap();
                        }
                    });
                }
            });
        }
    });

    Ratchet.GadgetRegistry.register("filter", Gitana.CMS.Components.Filter);

})(jQuery);