(function() {
    if (typeof Gitana === "undefined") {
        /** @namespace */
        Gitana = {};
    }

    if (typeof Gitana.CMS === "undefined") {
        Gitana.CMS = {};
    }

    if (typeof Gitana.CMS.Components === "undefined") {
        Gitana.CMS.Components = {};
    }

    if (typeof Gitana.Apps === "undefined") {
        Gitana.Apps = {};
    }

    Gitana.Apps.APP_NAME = "";

    Gitana.Apps.THEME = "clean";

    if (typeof Gitana.CMS.Pages === "undefined") {
        Gitana.CMS.Pages = {};
    }

    if (typeof Gitana.Utils === "undefined") {
        Gitana.Utils = {};
    }

    if (typeof Gitana.CMS.Reports === "undefined") {
        Gitana.CMS.Reports = {
            /**
             * Maps of field types to field class implementations.
             */
            reportClassRegistry: {},

            /**
             * Registers an implementation class for a type of field.
             *
             * @param {String} type Field type.
             * @param {Alpaca.Field} reportClass Field class.
             */
            registerReportClass: function(type, reportClass) {
                this.reportClassRegistry[type] = reportClass;
            },

            /**
             * Returns the implementation class for a type of field.
             *
             * @param {String} type Field type.
             *
             * @returns {Alpaca.Field} Field class mapped to field type.
             */
            getReportClass: function(type) {
                return this.reportClassRegistry[type];
            },

            /**
             * Gets the field type id for a given field implementation class.
             *
             * @param {Alpaca.Field} reportClass Field class.
             *
             * @returns {String} Field type of the field class.
             */
            getReportClassType: function(reportClass) {
                for (var type in this.reportClassRegistry) {
                    if (this.reportClassRegistry.hasOwnProperty(type)) {
                        if (this.reportClassRegistry[type] == reportClass) {
                            return type;
                        }
                    }
                }
                return null;
            }
        };
    }

    Gitana.CMS.load = function ()
    {
        // pick an authenticator
        var authenticator = new Gitana.CMS.UsernamePasswordAuthenticator({
            "client" : {}
        });
        //var authenticator = new Gitana.CMS.ImplicitFlowAuthenticator();

        // let the authenticator decide whether it lacks any state it might need to proceed
        // this is to support external authorization services
        //authenticator.preload();
        authenticator.init();

        // set up document ready handler
        $(document).ready(function() {

            $(document.body).ratchet(function() {
                // require authentication for every uri
                this.requireAuthentication("**");
                this.authenticator = authenticator;
            }).run();
        });
    };

    Gitana.CMS.refresh = function () {
        window.location.reload();
    };

    // tell ratchet to go to the personal dashboard if nothing specified on the hash
    Ratchet.DEFAULT_URI = "/dashboard";

    /**
     * Provides a single place where developers can override the client id and secret to be used by the application.
     * All OAuth2 authenticators will look to this object for client id/secret.
     *
     * If you're testing, make sure to override these values before calling CMS.load().
     *
     * When hosted in the cloud, the Gitana.DEFAULT_CONFIG object will automatically be updated to use the client
     * that was mapped to the web host for this application.
     */
    /*
    Gitana.CMS.DEFAULT_CONFIG = {
        "clientId": Gitana.DEFAULT_CONFIG.clientId,
        "clientSecret": Gitana.DEFAULT_CONFIG.clientSecret
    };
    */
})();