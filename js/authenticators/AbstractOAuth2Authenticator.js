(function($) {
    Gitana.CMS.AbstractOAuth2Authenticator = Gitana.CMS.AbstractAuthenticator.extend({

        constructor: function() {
            this.base();

            this.clientId = Gitana.CMS.DEFAULT_CONFIG.clientId;
            this.clientSecret = Gitana.CMS.DEFAULT_CONFIG.clientSecret;

            this.gitanaTicket = null;
        },

        /**
         * Checks to see if a GITANA_TICKET cookie is present
         */
        preload: function()
        {
            this.base();

            this.gitanaTicket = Gitana.readCookie('GITANA_TICKET');
        },

        /**
         * Authenticates using an existing GITANA_TICKET cookie in the browser.
         *
         * @param context
         * @param successCallback
         * @param failureCallback
         */
        authenticateWithCookie: function(context, successCallback, failureCallback) {
            var self = this;

            // init gitana
            var gitana = new Gitana({
                "clientId": self.clientId,
                "clientSecret": self.clientSecret
            });

            // now authenticate
            gitana.authenticate({
                "cookie": true
            },function() {

                if (failureCallback)
                {
                    failureCallback();
                }

            }).then(function() {

                self.handlePostAuthenticate(this, context, successCallback, failureCallback);

            });
        },

        /**
         * To be called once authentication successfully completed.
         * This sets up the Gitana console.
         *
         * @param chain
         * @param context
         * @param successCallback
         * @param failureCallback
         */
        handlePostAuthenticate: function(chain, context, successCallback, failureCallback)
        {
            var self = this;

            context.topRatchet().platform = chain;
            context.topRatchet().gitanaAuthenticated = true;

            var authInfo = chain.getDriver().getAuthInfo();

            context.observable("authInfo").set(authInfo);

            /** TODO: We can't read the parent registrar or tenant since those live on the parent platform **/
            /** TODO: We're logged into the child platform **/
            /*
             var tenantId = authInfo.getTenantId();
            this.readRegistrar("default").readTenant(tenantId).then(function() {
                self.populateTenant(context,this);
            });
            */
            self.populateTenant(context, authInfo);

            var userName = authInfo.getPrincipalName();
            var domainId = authInfo.getPrincipalDomainId();
            chain.readDomain(domainId).then(function() {
                context.observable("domain").set(this);
                this.readPrincipal(userName).then(function() {
                    self.populateAuthenticatedUser(context, this);
                });
            });

            chain.then(function() {
                if (successCallback) {
                    successCallback();
                }
            });
        }


    });

})(jQuery);