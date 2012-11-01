(function($) {

    Gitana.oAuth = {

        _oAuth: function (driver, options) {

            // Utilities

            function Collection(obj) {
                var args = arguments, /*args_callee = args.callee,*/ args_length = args.length, i, collection = this;
                /*
                 if (!(this instanceof args_callee)) {
                 return new args_callee(obj);
                 }
                 */
                for (i in obj) {
                    if (obj.hasOwnProperty(i)) {
                        collection[i] = obj[i];
                    }
                }

                return collection;
            }

            function Hash() {
            }

            Hash.prototype = {
                join: function(string) {
                    string = string || '';
                    return this.values().join(string);
                },
                keys: function() {
                    var i, arr = [], self = this;
                    for (i in self) {
                        if (self.hasOwnProperty(i)) {
                            arr.push(i);
                        }
                    }

                    return arr;
                },
                values: function() {
                    var i, arr = [], self = this;
                    for (i in self) {
                        if (self.hasOwnProperty(i)) {
                            arr.push(self[i]);
                        }
                    }

                    return arr;
                },
                shift: function() {
                    throw 'not implimented';
                },
                unshift: function() {
                    throw 'not implimented';
                },
                push: function() {
                    throw 'not implimented';
                },
                pop: function() {
                    throw 'not implimented';
                },
                sort: function() {
                    throw 'not implimented';
                },

                ksort: function(func) {
                    var self = this, keys = self.keys(), i, value, key;

                    if (func == undefined) {
                        keys.sort();
                    } else {
                        keys.sort(func);
                    }

                    for (i = 0; i < keys.length; i++) {
                        key = keys[i];
                        value = self[key];
                        delete self[key];
                        self[key] = value;
                    }

                    return self;
                },
                toObject: function () {
                    var obj = {}, i, self = this;
                    for (i in self) {
                        if (self.hasOwnProperty(i)) {
                            obj[i] = self[i];
                        }
                    }

                    return obj;
                }
            };
            Collection.prototype = new Hash;
            /**
             * Url
             *
             * @constructor
             * @param {String} url
             */
            function URI(url) {
                var args = arguments, /*args_callee = args.callee,*/
                    parsed_uri, scheme, host, port, path, query, anchor, parser = /^([^:\/?#]+?:\/\/)*([^\/:?#]*)?(:[^\/?#]*)*([^?#]*)(\?[^#]*)?(#(.*))*/
                    /*,uri = this*/;
                /*
                 if (!(this instanceof args_callee)) {
                 return new args_callee(url);
                 }
                 */
                var uri = {
                    scheme: '',
                    host: '',
                    port: '',
                    path: '',
                    query: '',
                    anchor: '',
                    toString: function () {
                        var self = this, query = self.query + '';
                        return self.scheme + '://' + self.host + self.path + (query != '' ? '?' + query : '') + (self.anchor !== '' ? '#' + self.anchor : '');
                    }
                };
                uri.scheme = '';
                uri.host = '';
                uri.port = '';
                uri.path = '';
                uri.query = new QueryString();
                uri.anchor = '';

                if (url !== null) {
                    parsed_uri = url.match(parser);

                    scheme = parsed_uri[1];
                    host = parsed_uri[2];
                    port = parsed_uri[3];
                    path = parsed_uri[4];
                    query = parsed_uri[5];
                    anchor = parsed_uri[6];

                    scheme = (scheme !== undefined) ? scheme.replace('://', '').toLowerCase() : 'http';
                    port = (port ? port.replace(':', '') : (scheme === 'https' ? '443' : '80'));
                    // correct the scheme based on port number
                    scheme = (scheme == 'http' && port === '443' ? 'https' : scheme);
                    query = query ? query.replace('?', '') : '';
                    anchor = anchor ? anchor.replace('#', '') : '';


                    // Fix the host name to include port if non-standard ports were given
                    if ((scheme === 'https' && port !== '443') || (scheme === 'http' && port !== '80')) {
                        host = host + ':' + port;
                    }

                    uri.scheme = scheme;
                    uri.host = host;
                    uri.port = port;
                    uri.path = path || '/';
                    uri.query.setQueryParams(query);
                    uri.anchor = anchor || '';
                }
                return uri;
            }

            URI.prototype = {
                scheme: '',
                host: '',
                port: '',
                path: '',
                query: '',
                anchor: '',
                toString: function () {
                    var self = this, query = self.query + '';
                    return self.scheme + '://' + self.host + self.path + (query != '' ? '?' + query : '') + (self.anchor !== '' ? '#' + self.anchor : '');
                }
            };

            /**
             * Create and manage a query string
             *
             * @param {Object} obj
             */
            function QueryString(obj) {
                var args = arguments, /*args_callee = args.callee,*/ args_length = args.length, i, querystring = this;

                /*
                 if (!(this instanceof args_callee)) {
                 return new args_callee(obj);
                 }
                 */
                if (obj != undefined) {
                    for (i in obj) {
                        if (obj.hasOwnProperty(i)) {
                            querystring[i] = obj[i];
                        }
                    }
                }

                return querystring;
            }

            // QueryString is a type of collection So inherit
            QueryString.prototype = new Collection();

            QueryString.prototype.toString = function () {
                var i, self = this, q_arr = [], ret = '', val = '', encode = OAuth.urlEncode;
                self.ksort(); // lexicographical byte value ordering of the keys

                for (i in self) {
                    if (self.hasOwnProperty(i)) {
                        if (i != undefined && self[i] != undefined) {
                            val = encode(i) + '=' + encode(self[i]);
                            q_arr.push(val);
                        }
                    }
                }

                if (q_arr.length > 0) {
                    ret = q_arr.join('&');
                }

                return ret;
            };

            /**
             *
             * @param {Object} query
             */
            QueryString.prototype.setQueryParams = function (query) {
                var args = arguments, args_length = args.length, i, query_array, query_array_length, querystring = this, key_value;

                if (args_length == 1) {
                    if (typeof query === 'object') {
                        // iterate
                        for (i in query) {
                            if (query.hasOwnProperty(i)) {
                                querystring[i] = query[i];
                            }
                        }
                    } else if (typeof query === 'string') {
                        // split string on '&'
                        query_array = query.split('&');
                        // iterate over each of the array items
                        for (i = 0, query_array_length = query_array.length; i < query_array_length; i++) {
                            // split on '=' to get key, value
                            key_value = query_array[i].split('=');
                            querystring[key_value[0]] = key_value[1];
                        }
                    }
                } else {
                    for (i = 0; i < arg_length; i += 2) {
                        // treat each arg as key, then value
                        querystring[args[i]] = args[i + 1];
                    }
                }
            };

            /** @const */ var OAUTH_VERSION_1_0 = '1.0';

            /**
             * Get a string of the parameters for the OAuth Authorization header
             *
             * @param params {object} A key value paired object of data
             *                           example: {'q':'foobar'}
             *                           for GET this will append a query string
             */
            function toHeaderString(params) {
                var arr = [], i, realm;

                for (i in params) {
                    if (params[i] && params[i] !== undefined && params[i] !== '') {
                        if (i === 'realm') {
                            realm = i + '="' + params[i] + '"';
                        } else {
                            arr.push(i + '="' + OAuth.urlEncode(params[i] + '') + '"');
                        }
                    }
                }

                arr.sort();
                if (realm) {
                    arr.unshift(realm);
                }

                return arr.join(', ');
            }

            /**
             * Generate a signature base string for the request
             *
             * @param method {string} ['GET', 'POST', 'PUT', ...]
             * @param url {string} A valid http(s) url
             * @param header_params A key value paired object of additional headers
             * @param query_params {object} A key value paired object of data
             *                               example: {'q':'foobar'}
             *                               for GET this will append a query string
             */
            function toSignatureBaseString(method, url, header_params, query_params) {
                var arr = [], i, encode = OAuth.urlEncode;

                for (i in header_params) {
                    if (header_params[i] !== undefined && header_params[i] !== '') {
                        arr.push([OAuth.urlEncode(i), OAuth.urlEncode(header_params[i] + '')]);
                    }
                }

                for (i in query_params) {
                    if (query_params[i] !== undefined && query_params[i] !== '') {
                        if (!header_params[i]) {
                            arr.push([encode(i), encode(query_params[i] + '')]);
                        }
                    }
                }

                arr = arr.sort(
                    function(a, b) {
                        if (a[0] < b[0]) {
                            return -1;
                        } else if (a[0] > b[0]) {
                            return 1;
                        } else {
                            if (a[1] < b[1]) {
                                return -1;
                            } else if (a[1] > b[1]) {
                                return 1;
                            } else {
                                return 0;
                            }
                        }
                    }).map(function(el) {
                        return el.join("=");
                    });

                /*
                 // strip out proxy from URL if it is there
                 var x = url.indexOf(proxyURI);
                 if (x > -1)
                 {
                 url = url.substring(0, x) + url.substring(x + proxyURI.length, url.length);
                 }
                 */

                return [
                    method,
                    encode(url),
                    encode(arr.join('&'))
                ].join('&');
            }

            /**
             * Generate a timestamp for the request
             */
            function getTimestamp() {
                return parseInt(+new Date() / 1000, 10); // use short form of getting a timestamp
            }

            /**
             * Generate a nonce for the request
             *
             * @param key_length {number} Optional nonce length
             */
            function getNonce(key_length) {
                function rand() {
                    return Math.floor(Math.random() * chars.length);
                }

                key_length = key_length || 64;

                var key_bytes = key_length / 8, value = '', key_iter = key_bytes / 4, key_remainder = key_bytes % 4, i, chars = ['20', '21', '22', '23', '24', '25', '26', '27', '28', '29',
                    '2A', '2B', '2C', '2D', '2E', '2F', '30', '31', '32', '33',
                    '34', '35', '36', '37', '38', '39', '3A', '3B', '3C', '3D',
                    '3E', '3F', '40', '41', '42', '43', '44', '45', '46', '47',
                    '48', '49', '4A', '4B', '4C', '4D', '4E', '4F', '50', '51',
                    '52', '53', '54', '55', '56', '57', '58', '59', '5A', '5B',
                    '5C', '5D', '5E', '5F', '60', '61', '62', '63', '64', '65',
                    '66', '67', '68', '69', '6A', '6B', '6C', '6D', '6E', '6F',
                    '70', '71', '72', '73', '74', '75', '76', '77', '78', '79',
                    '7A', '7B', '7C', '7D', '7E'];

                for (i = 0; i < key_iter; i++) {
                    value += chars[rand()] + chars[rand()] + chars[rand()] + chars[rand()];
                }

                // handle remaing bytes
                for (i = 0; i < key_remainder; i++) {
                    value += chars[rand()];
                }

                return value;
            }

            function toUrlString(params) {
                var arr = [], i, realm;

                for (i in params) {
                    if (params[i] && params[i] !== undefined && params[i] !== '') {
                        if (i === 'realm') {
                            realm = i + '=' + params[i] + '';
                        } else {
                            arr.push(i + '=' + OAuth.urlEncode(params[i] + '') + '');
                        }
                    }
                }

                arr.sort();
                if (realm) {
                    arr.unshift(realm);
                }

                return arr.join('&');
            }

            // End of Utilities

            if (driver && driver.oauth) {
                var oauth = driver.oauth;

                var method, url, data, headers, success, failure, xhr, i, headerParams, signatureMethod, signatureString, signature, query = [], appendQueryString, signatureData = {}, params, withFile;

                method = options.type || 'GET';
                url = URI(options.url);
                data = options.data || {};
                headers = options.headers || {};

                signatureMethod = options.signatureMethod || 'HMAC-SHA1';

                // According to the spec
                withFile = (function() {
                    var hasFile = false;

                    for (var name in data) {
                        // Thanks to the FileAPI any file entry
                        // has a fileName property
                        if (typeof data[name].fileName != 'undefined') hasFile = true;
                    }

                    return hasFile;
                })();

                appendQueryString = options.appendQueryString ? options.appendQueryString : false;

                if (oauth.enablePrivilege) {
                    netscape.security.PrivilegeManager.enablePrivilege('UniversalBrowserRead UniversalBrowserWrite');
                }

                headerParams = {
                    /*'oauth_callback': oauth.callbackUrl,*/
                    'oauth_consumer_key': driver.consumerKey/*oauth.consumerKey*/,
                    'oauth_token': oauth.getAccessTokenKey() /*oauth.accessTokenKey*/,
                    'oauth_signature_method': 'HMAC-SHA1' /*oauth.signatureMethod*/,
                    'oauth_timestamp': getTimestamp(),
                    'oauth_nonce': getNonce(),
                    'oauth_verifier': oauth.getVerifier() /*oauth.verifier*/,
                    'oauth_version': OAUTH_VERSION_1_0
                };

                if (driver.consumerSecret) {
                    headerParams['oauth_consumer_secret'] = driver.consumerSecret
                }
                else {
                    headerParams['oauth_callback'] = "opendriver";
                }

                signatureMethod = oauth.signatureMethod;

                // According to the OAuth spec
                // if data is transfered using
                // multipart the POST data doesn't
                // have to be signed:
                // http://www.mail-archive.com/oauth@googlegroups.com/msg01556.html
                if ((!('Content-Type' in headers) || headers['Content-Type'] == 'application/x-www-form-urlencoded') && !withFile) {
                    params = url.query.toObject();
                    for (i in params) {
                        signatureData[i] = params[i];
                    }
                    for (i in data) {
                        signatureData[i] = data[i];
                    }
                }
                else if (('Content-Type' in headers)) {
                    // UZI: if content type in headers, we still prepend any query parameters
                    params = url.query.toObject();
                    for (i in params) {
                        signatureData[i] = params[i];
                    }
                }

                urlString = url.scheme + '://' + url.host + url.path;
                signatureString = toSignatureBaseString(method, urlString, headerParams, signatureData);

                signature = OAuth.signatureMethod['HMAC-SHA1'](oauth.consumerSecret, oauth.accessTokenSecret, signatureString);

                headerParams.oauth_signature = signature;

                if (this.realm) {
                    headerParams['realm'] = this.realm;
                }

                if (appendQueryString || method == 'GET') {
                    url.query.setQueryParams(data);
                    query = null;
                } else if (!withFile) {
                    if (typeof data == 'string') {
                        query = data;
                        if (!('Content-Type' in headers)) {
                            headers['Content-Type'] = 'text/plain';
                        }
                    } else {
                        for (i in data) {
                            query.push(OAuth.urlEncode(i) + '=' + OAuth.urlEncode(data[i] + ''));
                        }
                        query = query.sort().join('&');
                        if (!('Content-Type' in headers)) {
                            headers['Content-Type'] = 'application/x-www-form-urlencoded';
                        }
                    }

                } else if (withFile) {
                    // When using FormData multipart content type
                    // is used by default and required header
                    // is set to multipart/form-data etc
                    query = new FormData();
                    for (i in data) {
                        query.append(i, data[i]);
                    }
                }

                return {
                    "header" : {
                        'Authorization': 'OAuth ' + toHeaderString(headerParams),
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    "downloadUrl" : toUrlString(headerParams)
                }
            } else {
                return null;
            }
        },

        prepareJQueryAjaxRequest : function(driver, options) {
            var oAuthParameters = Gitana.oAuth._oAuth(driver, options);
            if (oAuthParameters && oAuthParameters['header']) {
                options.headers = $.extend(options.headers, oAuthParameters['header']);
            }
        },

        prepareDownloadUrl : function(driver, url) {
            var options = {
                "url" : url
            };
            var oAuthParameters = Gitana.oAuth._oAuth(driver, options);
            if (oAuthParameters && oAuthParameters['downloadUrl']) {
                if (url.indexOf('?') != -1) {
                    url += "&" + oAuthParameters['downloadUrl'];
                } else {
                    url += "?" + oAuthParameters['downloadUrl'];
                }
            }
            return url;
        }
    };

})(jQuery);