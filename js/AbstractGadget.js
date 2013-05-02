(function($) {
    Gitana.CMS.AbstractGadget = Ratchet.Gadget.extend(
    {
        constructor: function(type, ratchet) {
            this.base(type, ratchet);

            var self = this;

            var val = $(this.ratchet().el).attr('subscription');
            this.subscription = val ? val : type;
            this.filterSubscription = $(this.ratchet().el).attr('filter');

            this.setupRefreshSubscription = function(el)
            {
                self.subscribe(self.subscription, self.refreshHandler(el));
            };
        },

        setup: function() {
            this.get(this.index);
        },

        model: function(el) {
            if (!el.model[this.getGadgetType()]) {
                el.model[this.getGadgetType()] = this.observable(this.subscription).get();
            }
            return el.model[this.getGadgetType()];
        },

        preSwap: function(el) {
        },

        postSwap: function(el) {
        },

        index: function(el) {
            var self = this;

            this.setupRefreshSubscription(el);

            this.model(el);

            // render
            self.renderTemplate(el, self.TEMPLATE, function(el) {
                self.preSwap();
                el.swap();
                self.postSwap();
            });
        },

        protocolHostPort: function() {
            var str = window.location.href;

            var a = str.indexOf("//");
            if (a > -1) {
                var b = str.indexOf("/", a + 2);

                str = str.substring(0, b);
            }

            return str;
        },

        /*
        //TODO: add handler?
        invalidTicketHandler: function(error) {
            alert('Invalid Ticket');
        },
        */

        platform: function() {

            return Gitana.Authentication.platform().trap(this.invalidTicketHandler);
        },

        driver: function() {
            return this.platform().getDriver();
        },

        friendlyTitle: function(persistable) {
            var title = null;

            if (persistable.objectType) {
                if (persistable.objectType() == "Gitana.DomainPrincipal") {
                    if (persistable["firstName"] && persistable["lastName"]) {
                        title = persistable["firstName"] + " " + persistable["lastName"];
                    }
                    else {
                        title = persistable["name"];
                    }
                }
            }
            if (!title && persistable.getTypeQName) {
                if (persistable.getTypeQName() == "n:group") {
                    title = persistable["principal-name"];
                }
                else if (persistable.getTypeQName() == "n:person") {
                    title = persistable["principal-name"];
                }
            }

            if (!title && persistable.getTitle) {
                title = persistable.getTitle();
            }

            if (!title && persistable.getId) {
                title = persistable.getId();
            }

            // look for .title, .id and ._doc on straight JSON objects (tenantDetails support)
            if (!title && persistable.title)
            {
                title = persistable.title;
            }
            if (!title && persistable.id)
            {
                title = persistable.id;
            }
            if (!title && persistable._doc)
            {
                title = persistable._doc;
            }

            return title;
        },

        friendlyName: function(principal) {
            var name = "";

            if (principal.getType() == 'USER') {
                name = principal.getFirstName &&  principal.getFirstName() ? principal.getFirstName() : "";
                if (principal.getLastName &&  principal.getLastName()) {
                    name += name == "" ? principal.getLastName() : " "+principal.getLastName();
                }
            } else {
               name = principal.getTitle &&  principal.getTitle() ? principal.getTitle() : "";
            }
            if (name == "") {
                name = principal.getName();
            }
            return name;
        },




        _observable : function (key, args, defaultVal) {
            var _args = Ratchet.makeArray(args);
            if (_args.length > 0) {
                if (typeof _args[0] == "string") {
                    key = _args.shift();
                    if (_args.length > 0) {
                        this.observable(key).set(_args.shift());
                    }
                }
                else {
                    this.observable(key).set(_args.shift());
                }
            }
            var val = this.observable(key).get();
            if (val == null && defaultVal != null) {
                val = defaultVal;
                this.observable(key).set(defaultVal);
            }
            return val;
        },

        _clearObservable: function(key, defaultKey) {
            var _key = key ? key : defaultKey;
            this.observable(_key).clear();
        },
        /**
         * Convenient methods for
         *
         * 1) Retrieving and optionally setting component's observables
         *
         * 2) Clearing component's observables
         */
        toolbar: function() {
            return this._observable("toolbar", arguments, {});
        },

        clearToolbar: function(key) {
            this._clearObservable(key, "toolbar");
        },

        selectedItems: function() {
            return this._observable("selectedItems", arguments);
        },

        clearSelectedItems: function() {
            this.observable("selectedItems").clear();
        },

        list: function() {
            return this._observable("list", arguments, {});
        },

        clearList: function(key) {
            this._clearObservable(key, "list");
        },

        pairs: function() {
            return this._observable("pairs", arguments, {});
        },

        clearPairs: function(key) {
            this._clearObservable(key, "pairs");
        },

        breadcrumb: function() {
            return this._observable("breadcrumb", arguments, {});
        },

        clearBreadcrumb: function(key) {
            this._clearObservable(key, "breadcrumb");
        },

        barChart: function() {
            return this._observable("barchart", arguments, {});
        },

        clearBarChart: function(key) {
            this._clearObservable(key, "barchart");
        },

        plot: function() {
            return this._observable("plot", arguments, {});
        },

        clearPlot: function(key) {
            this._clearObservable(key, "plot");
        },

        tabs: function() {
            return this._observable("tabs", arguments, {});
        },

        clearTabs: function(key) {
            this._clearObservable(key, "tabs");
        },

        filter: function() {
            return this._observable("filter", arguments);
        },

        clearFilter: function(key) {
            this._clearObservable(key, "filter");
        },

        menu: function() {
            return this._observable("menu", arguments);
        },

        clearMenu: function() {
            this.observable("menu").clear();
        },

        stats: function() {
            return this._observable("stats", arguments);
        },

        clearStats: function() {
            this.observable("stats").clear();
        },

        notifications: function() {
            return this._observable("notifications", arguments);
        },

        clearNotifications: function() {
            this.observable("notifications").clear();
        },

        getStat : function(node, stat, defaultVal) {
            if (defaultVal == null) {
                defaultVal = "";
            }
            return node.get('stats') && node.get('stats')[stat] ? node.get('stats')[stat] : defaultVal;
        },

        /**
         *
         * @param el
         * @param templatePath
         * @param data
         * @param callback
         */
        renderTemplate: function(el, templatePath, data, callback) {

            if (templatePath.indexOf('/') != 0) {
                var prefix = (Gitana.Apps.APP_NAME ? "/" : "") + Gitana.Apps.APP_NAME + "/templates/themes/" + Gitana.Apps.THEME;
                templatePath = prefix + "/" + templatePath;
            }

            if (data && callback) {
                el.transform(templatePath, data, function(el) {
                    callback(el);
                });
            } else {
                callback = data;
                el.transform(templatePath, function(el) {
                    callback(el);
                });
            }
        },

        /**
         *
         * @param uri
         * @param tokensMap
         */
        applyTokens: function(uri, tokensMap) {
            for (var token in tokensMap) {
                var tokenValue = tokensMap[token];
                uri = uri.replace("{" + token + "}", tokenValue);
            }

            return uri;
        },

        /**
         *
         * @param x
         * @param y
         */
        unionArrays : function  (x, y) {
            var obj = {};
            for (var i = x.length - 1; i >= 0; -- i)
                obj[x[i]] = x[i];
            for (var i = y.length - 1; i >= 0; -- i)
                obj[y[i]] = y[i];
            var res = []
            for (var k in obj) {
                if (obj.hasOwnProperty(k))  // <-- optional
                    res.push(obj[k]);
            }
            return res;
        },

        refresh: function(link)
        {
            debugger;
            Gitana.CMS.refresh(link);
        }

    });

})(jQuery);