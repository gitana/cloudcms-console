(function($) {
    Gitana.CMS.Components.Plot = Gitana.CMS.Components.AbstractComponentGadget.extend(
        {
            TEMPLATE : "components/plot",

            constructor: function(id, ratchet) {
                this.base(id, ratchet);
            },

            renderPlot: function(plot, loadedData) {
                var self = this;
                var generatedId = Ratchet.generateId() + "-jqplot";
                $('.plot', $(self.ratchet().el)).attr('id', generatedId);

                var options = Alpaca.cloneObject(plot.options);

                if (loadedData.options) {
                    _mergeObject(options, loadedData.options);
                }

                if ($("#" + generatedId).length > 0) {
                    if (self.chart != null) {
                        $.jqplot(generatedId, loadedData.data, options).replot();
                    } else {
                        self.chart = $.jqplot(generatedId, loadedData.data, options);
                    }
                } else {
                    $('body').bind('swap', function(event, param) {
                        if ($("#" + generatedId).length > 0 && $("#" + generatedId).html() == '') {
                            self.chart = $.jqplot(generatedId, loadedData.data, options);
                        }
                    });
                }
            },

            loadPlot : function(query) {
                var self = this;
                var plot = this.plot;
                if (plot['loadFunction'] && Alpaca.isFunction(plot['loadFunction'])) {
                    plot['loadFunction'](query, function(loadedData) {
                        self.renderPlot(plot, loadedData);
                    });
                }
            },

            index: function(el) {
                var self = this;

                // detect changes to the pairs and redraw when they occur
                self.setupRefreshSubscription(el);

                // list model
                this.plot = self.model(el);

                // render
                if (this.plot) {
                    self.renderTemplate(el, self.TEMPLATE, function(el) {

                        var formDiv = $('.plot-form', $(el));

                        el.swap();

                        var queryFormOptions = self.plot['queryForm'];

                        if (queryFormOptions) {
                            var userPostRender = queryFormOptions["postRender"];
                            queryFormOptions["postRender"] = function(form) {

                                Gitana.Utils.UI.beautifyAlpacaForm(form);

                                if (userPostRender) {
                                    userPostRender.call(self, form);
                                }
                                if ($(".query-button", form.getEl()).length == 0 && self.plot['displayQueryButton']) {
                                    var queryButton = $('<div class="button">Query</div>').click(
                                        function() {
                                            self.loadPlot(form.getValue());
                                        }
                                    ).appendTo(form.getEl());
                                }
                                self.loadPlot(form.getValue());
                            };
                            formDiv.alpaca(queryFormOptions);
                        } else {
                            self.loadPlot(null);
                        }

                    });
                }
            }

        });

    Ratchet.GadgetRegistry.register("plot", Gitana.CMS.Components.Plot);

})(jQuery);