(function($) {

    Gitana.Utils.Render = {

        processTemplate: function(templatePath, model, callback)
        {
            if (templatePath.indexOf('/') != 0)
            {
                var prefix = (Gitana.Apps.APP_NAME ? "/" : "") + Gitana.Apps.APP_NAME + "/templates/themes/" + Gitana.Apps.THEME;
                templatePath = prefix + "/" + templatePath;
            }

            this.processRootTemplate(templatePath, model, callback);
        },

        processRootTemplate: function(templatePath, model, callback)
        {
            var self = this;

            $.ajax({
                type: "GET",
                url: templatePath,
                dataType: "html",
                success: function(html) {

                    // now transform using jTmpl
                    html = $.tmpl(html, model);
                    html = self.cleanMarkup(html);

                    // callback
                    callback(html);
                }
            });
        },

        processHtmlTemplate: function(html, model)
        {
            var self = this;

            // now transform using jTmpl
            html = $.tmpl(html, model);
            html = self.cleanMarkup(html);

            return html;
        },

        cleanMarkup: function(html)
        {
            // convert to a dom briefly
            var dom = $(html);

            // if if starts with a script tag, then we strip that out
            if ($(dom).length == 1)
            {
                if ($(dom)[0].nodeName.toLowerCase() == "script")
                {
                    html = $(dom).html();
                }
            }

            return html;
        }
    };

})(jQuery);