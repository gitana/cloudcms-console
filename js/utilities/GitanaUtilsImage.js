(function($) {
    Gitana.Utils.Image = {

        /**
         * @param category "objects" or "types"
         * @param type "repository", "server"... etc, or "n:node"
         * @param size
         */
        buildImageUri: function(category, type, size) {
            // treat type to remove ":" if it is in there
            var i = type.indexOf(":");
            if (i > -1) {
                type = type.substring(0, i) + "_" + type.substring(i + 1);
            }

            return "css/images/themes/" + Gitana.Apps.THEME + "/console/" + category + "/" + type + "-" + size + ".png";
        },

        /**
         * Determines a URI to a icon for a mimetype.
         *
         * @param mimetype
         */
        buildMimetypeImageUri : function(mimetype, filename, size) {
            var image = null;

            image = Gitana.Utils.Image.MimeTypeIconRegistry[mimetype];
            if (!image) {
                image = "default";
            }

            return Gitana.Apps.APP_NAME + "/images/themes/" + Gitana.Apps.THEME + "/console/" + "mimetypes/" + image + "-" + size + ".png";
        },

        extraTypesWithImages : ["n:tag"],

        imageUri : function(object, size) {
            var category = null;
            var type = null;

            // special case for browser/navigation
            if (Gitana.isString(object)) {
                category = "browser";
                type = object;
            }
            else {
                // must have an objectType field
                // gitana core object type (changeset, repository, node, changeset, etc)
                if (object.objectType) {
                    category = "objects";

                    var i = object.objectType().indexOf(".");
                    type = object.objectType().substring(i + 1).toLowerCase();

                    // is it a node?
                    if (object.getTypeQName) {
                        // assume node
                        category = "types";
                        type = "n:node";

                        // we can get a little more specific if we know it's a container (space)
                        if (object.isContainer()) {
                            category = "special";
                            type = "container";
                        }
                        else {
                            // see if we can drill down on node type
                            var typeQName = object.getTypeQName();

                            // is it a node that we know about?
                            if (Gitana.ObjectFactory.registry[typeQName]) {
                                category = "types";
                                type = typeQName;
                            } else if ($.inArray(typeQName,Gitana.Utils.Image.extraTypesWithImages) != -1) {
                                category = "types";
                                type = typeQName;
                            }
                        }
                    }
                }
                else {
                    alert("No objectType field!");
                }
            }

            return Gitana.Utils.Image.buildImageUri(category, type, size);
        },

        listImageUri : function(object) {
            return Gitana.Utils.Image.imageUri(object, 32);
        },


        listMimetypeImageUri: function(mimetype, filename) {
            return Gitana.Utils.Image.buildMimetypeImageUri(mimetype, filename, 32);
        },

        avatarImageUri: function(user, size) {
            return "/proxy/domains/" + user.getDomainId() + "/principals/" + user.getId() + "/attachments/avatar" + size;
        },

        // register mimetypes
        MimeTypeIconRegistry : {
            "video/avi" : "avi",
            "audio/aac" : "aac",
            "video/bmp" : "bmp",
            "text/css" : "css",
            "text/css" : "css",
            "text/css" : "excel",
            "image/gif" : "gif",
            "text/html" : "html",
            "image/jpeg" : "jpg",
            "image/jpg" : "jpg",
            "script/js" : "js",
            "text/js" : "js",
            "application/js" : "js",
            "video/quicktime" : "mov",
            "video/mov" : "mov",
            "audio/mp3" : "mp3",
            "audio/mpeg" : "mp3",
            "video/mpeg" : "mpg",
            "application/pdf" : "pdf",
            "image/png" : "png",
            "application/ppt" : "ppt",
            "text/rtf" : "rtf",
            "text/plain" : "text",
            "audio/wav" : "wav",
            "audio/wma" : "wma",
            "video/wmv" : "wmv",
            "application/word" : "word",
            "text/xml" : "xml",
            "text/xsl" : "xsl"
        }
    }
})(jQuery);
