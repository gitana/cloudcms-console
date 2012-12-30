(function($)
{
    Gitana.Console.Rule.AbstractSingleFormAction = Gitana.Console.Rule.AbstractAction.extend({

        constructor: function(config)
        {
            this.base(config);
        },

        schema: function(callback)
        {
            callback({});
        },

        options: function(callback)
        {
            callback({});
        },

        postRender: function(control, callback)
        {
            callback.call(this, control.getValue());
        },

        onAddAction: function(callback)
        {
            var self = this;

            self.schema(function(schema) {
                self.options(function(options) {

                    var div = $("<div></div>");
                    $(div).alpaca({
                        "data": {},
                        "schema": schema,
                        "options": options,
                        "postRender": function(control) {

                            self.modalOpen({
                                "title": self.title,
                                "body": div,
                                "buttons": {
                                    "Save": function(control, callback) {
                                        return function() {

                                            if (control.isValid(true))
                                            {
                                                self.modalClose.call(self);

                                                self.postRender.call(self, control, callback);
                                            }
                                        }
                                    }(control, callback)
                                }
                            });
                        }
                    });

                });
            });
        }

    });

})(jQuery);