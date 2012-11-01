(function($) {

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

    /*
    Gitana.Console.Settings = {
        "LIST_SIZE" : {
            "title" : "List Size",
            "description" : "Default console list size.",
            "default" : 25,
            "enum" : [10,25,50,100]
        },
        "DISPLAY_LIST_FILTER" : {
            "title" : "Display lister filter",
            "description" : "Show list filter automatically if checked.",
            "default" : false,
            "type" : "boolean"
        },
        "NUMBER_OF_LATEST_ITEMS" : {
            "title" : "Number of Latest Items",
            "description" : "Default number of latest items on dashboard pages.",
            "default" : 5,
            "type" : "integer",
            "minimum" : 1
        }
    };
    */

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
                "title" : "Number of history entries",
                "description" : "Default number of history entries.",
                "default" : Gitana.Console.Settings.Default['NUMBER_OF_HISTORY_ENTRIES'],
                "type" : "integer",
                "minimum" : 1
            },
            "NUMBER_OF_CLIPBOARD_ENTRIES" : {
                "title" : "Number of clipboard entries",
                "description" : "Default number of clipboard entries.",
                "default" : Gitana.Console.Settings.Default['NUMBER_OF_CLIPBOARD_ENTRIES'],
                "type" : "integer",
                "minimum" : 1
            },
            "LIST_SIZE" : {
                "title" : "List Size",
                "description" : "Default console list size.",
                "default" : Gitana.Console.Settings.Default['LIST_SIZE'],
                "enum" : [10,25,50,100]
            },
            "DISPLAY_LIST_FILTER" : {
                "title" : "Display list filter",
                "description" : "Show list filter automatically if checked.",
                "default" : Gitana.Console.Settings.Default['DISPLAY_LIST_FILTER'],
                "type" : "boolean"
            },
            "NUMBER_OF_LATEST_ITEMS" : {
                "title" : "Number of Latest Items",
                "description" : "Default number of latest items on dashboard pages.",
                "default" : Gitana.Console.Settings.Default['NUMBER_OF_LATEST_ITEMS'],
                "type" : "integer",
                "minimum" : 1
            },
            "NUMBER_OF_ACTIVITY_ITEMS" : {
                "title" : "Number of Platform Activities Items",
                "description" : "Default number of activities items on platform dashboard page.",
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

})(jQuery);