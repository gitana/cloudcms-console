(function($) {

    Ratchet.useHandlerCallbacks = true;

    Gitana.Apps.APP_NAME = "console";

    if (typeof Gitana.Console === "undefined") {
        Gitana.Console = {};
    }

    if (typeof Gitana.Console.Components === "undefined") {
        Gitana.Console.Components = {};
    }

    if (typeof Gitana.Console.Pages === "undefined") {
        Gitana.Console.Pages = {};
    }

    Gitana.Console.Settings = {};

    Gitana.Console.Settings.Default = {
        "NUMBER_OF_HISTORY_ENTRIES" : 8,
        "NUMBER_OF_CLIPBOARD_ENTRIES" : 8,
        "LIST_SIZE" : 25,
        "DISPLAY_LIST_FILTER" : false,
        "NUMBER_OF_LATEST_ITEMS" : 5,
        "NUMBER_OF_ACTIVITY_ITEMS" : 10
    };

    Gitana.Console.Settings.Schema = {
        "type" : "object",
        "properties" : {
            "NUMBER_OF_HISTORY_ENTRIES" : {
                "title" : "Number of entries to show in the console history",
                "default" : Gitana.Console.Settings.Default['NUMBER_OF_HISTORY_ENTRIES'],
                "type" : "integer",
                "minimum" : 1
            },
            "NUMBER_OF_CLIPBOARD_ENTRIES" : {
                "title" : "Number of entries to show in the console clipboard",
                "default" : Gitana.Console.Settings.Default['NUMBER_OF_CLIPBOARD_ENTRIES'],
                "type" : "integer",
                "minimum" : 1
            },
            "LIST_SIZE" : {
                "title" : "Number of items to show in console lists",
                "default" : Gitana.Console.Settings.Default['LIST_SIZE'],
                "enum" : [10,25,50,100]
            },
            "DISPLAY_LIST_FILTER" : {
                "title" : "Show the filter for console lists automatically?",
                "default" : Gitana.Console.Settings.Default['DISPLAY_LIST_FILTER'],
                "type" : "boolean"
            },
            "NUMBER_OF_LATEST_ITEMS" : {
                "title" : "Number of items to show for console latest items",
                "default" : Gitana.Console.Settings.Default['NUMBER_OF_LATEST_ITEMS'],
                "type" : "integer",
                "minimum" : 1
            },
            "NUMBER_OF_ACTIVITY_ITEMS" : {
                "title" : "Number of items to show on the platform dashboard's activities list",
                "default" : Gitana.Console.Settings.Default['NUMBER_OF_ACTIVITY_ITEMS'],
                "type" : "integer",
                "minimum" : 1
            }
        }
    };


    Gitana.Console.Messages = {
        "NON_AUTHORIZED_PAGE" : "You are not authorized to view this page!"
    };

    Gitana.Console.AUTHORITIES = {
        "connector" : {
            "title" : "Connector",
            "permissions": ["CONNECT","READ"]
        },
        "consumer" : {
            "title" : "Consumer",
            "permissions": ["CONNECT","READ"]
        },
        "contributor" : {
            "title" : "Contributor",
            "permissions": ["CONNECT","READ", "CREATE_SUBOBJECTS"]
        },
        "editor" : {
            "title" : "Editor",
            "permissions": ["CONNECT","READ", "UPDATE", "DELETE"]
        },
        "collaborator" : {
            "title" : "Collaborator",
            "permissions": ["CONNECT","READ", "CREATE_SUBOBJECTS", "UPDATE", "DELETE"]
        },
        "manager" : {
            "title" : "Manager",
            "permissions": ["CONNECT","READ", "CREATE_SUBOBJECTS", "UPDATE", "DELETE", "MODIFY_PERMISSIONS"]
        }
    };

    Gitana.Console.LIMIT_NONE = 99999;

    Alpaca.registerView({
        "id": "VIEW_WEB_CREATE",
        "displayReadonly": true
    });

    Alpaca.registerView({
        "id": "VIEW_WEB_EDIT",
        "templates": {
            "threeColumnGridLayout": '<div class="filter-content">'
                    + '{{if options.label}}<h2>${options.label}</h2><span></span>{{/if}}'
                    + '{{if options.helper}}<p>${options.helper}</p>{{/if}}'
                    + '<div id="column-1" class="grid_6"> </div>'
                    + '<div id="column-2" class="grid_6"> </div>'
                    + '<div id="column-3" class="grid_12"> </div>'
                    + '<div class="clear"></div>'
                    + '</div>',
            "fourColumnGridLayout": '<div class="filter-content">'
                    + '{{if options.label}}<h2>${options.label}</h2><span></span>{{/if}}'
                    + '{{if options.helper}}<p>${options.helper}</p>{{/if}}'
                    + '<div id="column-1" class="grid_6"> </div>'
                    + '<div id="column-2" class="grid_6"> </div>'
                    + '<div id="column-3" class="grid_12"> </div>'
                    + '<div id="column-4" class="grid_12"> </div>'
                    + '<div class="clear"></div>'
                    + '</div>'
        }
    });

    Alpaca.registerView({
        "id": "VIEW_WEB_EDIT_LAYOUT_GRID_THREE_COLUMN",
        "parent": "VIEW_WEB_EDIT",
        "title": "Web Edit View with three-Column Grid Layout",
        "description": "Web edit default view with three-column grid layout.",
        "layout" : {
            "template" : "threeColumnGridLayout"
        }
    });

    Alpaca.registerView({
        "id": "VIEW_WEB_EDIT_LAYOUT_GRID_FOUR_COLUMN",
        "parent": "VIEW_WEB_EDIT",
        "title": "Web Edit View with four-Column Grid Layout",
        "description": "Web edit default view with four-column grid layout.",
        "layout" : {
            "template" : "fourColumnGridLayout"
        }
    });

    // adjust the VIEW_WEB_EDIT view so it uses jQuery UI
    Alpaca.registerView({
        "id": "VIEW_WEB_EDIT",
        "style": "jquery-ui",
        "ui": "jquery-ui"/*,
        "templates": {
            // Templates for control fields
            "controlFieldOuterEl": '<div>{{html this.html}}</div>',
            "controlFieldMessage": '<div><div class="ui-icon ui-icon-alert"></div><div class="alpaca-controlfield-message-text">${message}</div></div>',
            "controlFieldLabel": '{{if options.label}}<div class="{{if options.labelClass}}${options.labelClass}{{/if}}"><div>${options.label}</div></div>{{/if}}',
            "controlFieldHelper": '{{if options.helper}}<div class="{{if options.helperClass}}${options.helperClass}{{/if}}"><div class="ui-icon ui-icon-info"></div><div class="alpaca-controlfield-helper-text">${options.helper}</div></div>{{/if}}',
            "controlFieldContainer": '<div>{{html this.html}}</div>',
            "controlField": '{{wrap(null, {}) Alpaca.fieldTemplate(this,"controlFieldOuterEl",true)}}{{html Alpaca.fieldTemplate(this,"controlFieldLabel")}}{{wrap(null, {}) Alpaca.fieldTemplate(this,"controlFieldContainer",true)}}{{html Alpaca.fieldTemplate(this,"controlFieldHelper")}}{{/wrap}}{{/wrap}}',
            // Templates for container fields
            "fieldSetOuterEl": '<fieldset>{{html this.html}}</fieldset>',
            "fieldSetMessage": '<div><div class="ui-icon ui-icon-alert" style="float: left; margin-right: .3em;"></div><div>${message}</div></div>',
            "fieldSetLegend": '{{if options.label}}<legend class="{{if options.labelClass}}${options.labelClass}{{/if}}">${options.label}</legend>{{/if}}',
            "fieldSetHelper": '{{if options.helper}}<div class="{{if options.helperClass}}${options.helperClass}{{/if}}">${options.helper}</div>{{/if}}',
            "fieldSetItemsContainer": '<div>{{html this.html}}</div>',
            "fieldSet": '{{wrap(null, {}) Alpaca.fieldTemplate(this,"fieldSetOuterEl",true)}}{{html Alpaca.fieldTemplate(this,"fieldSetLegend")}}{{html Alpaca.fieldTemplate(this,"fieldSetHelper")}}{{wrap(null, {}) Alpaca.fieldTemplate(this,"fieldSetItemsContainer",true)}}{{/wrap}}{{/wrap}}',
            "fieldSetItemContainer": '<div></div>'
        }
        */
    });

    // adjust the VIEW_WEB_CREATE view so it uses jQuery UI
    Alpaca.registerView({
        "id": "VIEW_WEB_CREATE",
        "style": "jquery-ui",
        "ui": "jquery-ui"
    });

    var _msg = window._msg = function(key, messageContext)
    {
        var value = null;

        if (key) {
            value = Ratchet.resolveDotNotation(Gitana.CMS.Messages, key);
            if (!value) {
                value = Ratchet.resolveDotNotation(window, key);
            }
        }

        if (!value)
        {
            console.log("Unable to _msg resolve: " + key);
        }
        else
        {
            if (messageContext) {
                value = $.tmpl("<div>" + value + "</div>", messageContext);
                if (value) {
                    value = value.html();
                }
            }
        }

        return value;
    };

    var _previewMimetypeFallback = window._previewMimetypeFallback = function(originalUrl, mimetype)
    {
        var mimetypeFilename = mimetype + ".png";
        mimetypeFilename = mimetypeFilename.replace("/", "-");

        return _previewFallback(originalUrl, "css/images/themes/clean/console/filetypes/64/" + mimetypeFilename);
    };

    var _previewFallback = window._previewFallback = function(originalUrl, fallback)
    {
        var url = originalUrl;

        if (fallback)
        {
            if (originalUrl.indexOf("?") == -1) {
                url += "?";
            } else {
                url += "&";
            }

            url += "fallback=";
            url += window.location.protocol + "//" + window.location.hostname;
            if (window.location.port)
            {
                url += ":" + window.location.port;
            }
            url += "/console/" + fallback;
        }

        return url;
    };

    var _mergeObject = window._mergeObject = function(target, source)
    {
        Ratchet.merge(source, target);

        return target;
    };

    var _safeParse = window._safeParse = function(text)
    {
        var json = {};

        if (text)
        {
            json = JSON.parse(text);
        }

        return json;
    };

    var _filterPreviews = window._filterPreviews = function(attachments)
    {
        if (attachments && attachments.length > 0)
        {
            var i = 0;
            do
            {
                var attachment = attachments[i];

                var remove = false;
                if (this.options.filterPreviews)
                {
                    if (attachment.attachmentId.indexOf("_preview_") == 0)
                    {
                        remove = true;
                    }
                }

                if (remove)
                {
                    attachments.splice(i, 1);
                }
                else
                {
                    i++;
                }
            }
            while (i < attachments.length);
        }
    };

})(jQuery);