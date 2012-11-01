(function($) {
    Gitana.CMS.Components.BarChart = Gitana.CMS.Components.AbstractComponentGadget.extend(
    {
        TEMPLATE : "components/barchart",

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        index: function(el) {
            var self = this;

            // detect changes to the pairs and redraw when they occur
            this.subscribe(this.subscription, this.refresh);

            // list model
            var barChart = self.model(el);

            // render
            if (barChart) {
                self.renderTemplate(el, self.TEMPLATE, function(el) {
                    var size = barChart.formOptions && barChart.formOptions.fieldSize ? barChart.formOptions.fieldSize :40;
                    $('.jqplot-form', $(el)).alpaca({
                        "data": {
                            "startDate" : barChart.startDate,
                            "endDate": barChart.endDate
                        },
                        "schema" : {
                            "type" : "object",
                            "properties" : {
                                "startDate" : {
                                    "title": "Start Date",
                                    "type" : "string",
                                    "format": "date"
                                },
                                "endDate" : {
                                    "title": "End Date",
                                    "type" : "string",
                                    "format": "date"
                                }
                            }
                        },
                        "options" : {
                            "fields" : {
                                "startDate" : {
                                    "size": size
                                },
                                "endDate" : {
                                    "size": size
                                }
                            }
                        },
                        "view" : {
                            "parent": "VIEW_WEB_EDIT_LAYOUT_GRID_TWO_COLUMN",
                            "layout": {
                                "bindings": {
                                    "startDate": "column-1",
                                    "endDate": "column-2"
                                }
                            }
                        },
                        "postRender": function (renderedField) {
                            Gitana.Utils.UI.beautifyAlpacaForm(renderedField);
                            el.swap();
                            var endDateControl = renderedField.getControlByPath("endDate");
                            $(endDateControl.field).change(function() {
                                if (renderedField.isValid(true)) {
                                    if (barChart.render) {
                                        var val = renderedField.getValue();
                                        barChart.render(val['startDate'], val['endDate'], barChart.context);
                                    }
                                }
                            });

                            var generatedId = Ratchet.generateId() + "-jqplot";
                            $('.jqplot', $(self.ratchet().el)).attr('id', generatedId);

                            if ($("#" + generatedId).length > 0) {
                                self.chart = $.jqplot(generatedId, barChart.data, barChart.options);
                            } else {
                                $('body').bind('swap', function(event, param) {
                                    if ($("#" + generatedId).length > 0) {
                                        self.chart = $.jqplot(generatedId, barChart.data, barChart.options);
                                    }
                                });
                            }
                        }
                    });
                });
            }
        }

    });

    Alpaca.registerView({
        "id": "VIEW_WEB_EDIT_LIST",
        "templates": {
            "twoColumnGridLayout": '<div class="filter-content">'
                    + '{{if options.label}}<h2>${options.label}</h2><span></span>{{/if}}'
                    + '{{if options.helper}}<p>${options.helper}</p>{{/if}}'
                    + '<div id="column-1" class="grid_6"> </div>'
                    + '<div id="column-2" class="grid_6"> </div>'
                    + '<div class="clear"></div>'
                    + '</div>'
        }
    });

    Alpaca.registerView({
        "id": "VIEW_WEB_EDIT_LAYOUT_GRID_TWO_COLUMN",
        "parent": "VIEW_WEB_EDIT_LIST",
        "title": "Web Edit View with two-Column Grid Layout",
        "description": "Web edit default view with two-column grid layout.",
        "layout" : {
            "template" : "twoColumnGridLayout"
        }
    });

    Ratchet.GadgetRegistry.register("barchart", Gitana.CMS.Components.BarChart);

})(jQuery);