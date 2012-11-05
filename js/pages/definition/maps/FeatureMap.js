/*
(function(window) {
    var Gitana = window.Gitana;

    Gitana.FeatureMap = Gitana.AbstractMap.extend(
    {
        constructor: function(driver, object , rootKey) {

            this.objectType = "Gitana.FeatureMap";

            this.rootKey = rootKey ?  rootKey : "mandatoryFeatures";

            this.base(driver, object);

        },

        handleResponse: function(definition) {
            this.clear();

            var object = {
                "rows" : {},
                "total_rows" : 0
            };

            if (definition) {
                // parse object
                if (definition.object && definition.object[this.rootKey]) {

                    var features = definition.object[this.rootKey];

                    for (var key in features) {

                        var value = features[key];

                        var o = this.buildObject(value,key);

                        this.map[key] = o;

                        this.keys.push(key);

                        object["rows"][key] = {};

                        Gitana.copyInto(object["rows"][key], value);

                        object["total_rows"] ++;
                    }
                }
            }

            Gitana.copyInto(this.object, object);

        },

        buildObject: function(json, key) {
            return new Gitana.Feature(json,key);
        },

        paginate: function(pagination)
        {
            return this.then(function() {

                var skip = pagination.skip;
                var limit = pagination.limit;
                var keysToRemove = [];

                // figure out which keys to remove
                for (var i = 0; i < this.keys.length; i++)
                {
                    if (i< skip || i >= skip + limit)
                    {
                        keysToRemove.push(this.keys[i]);
                    }
                }

                // truncate the keys
                // NOTE: we can't use slice here since that produces a new array
                while (this.keys.length > limit + skip)
                {
                    this.keys.pop();
                }

                for (var i = 0 ; i < skip ; i++ )
                {
                    this.keys.shift();
                }

                // remove any keys to remove from map
                for (var i = 0; i < keysToRemove.length; i++)
                {
                    delete this.map[keysToRemove[i]];
                }

            });
        }
    });

})(window);
*/

(function(window) {
    var Gitana = window.Gitana;

    Gitana.FeatureMap = Gitana.AbstractMap.extend(
    {
        constructor: function(driver, object)
        {
            this.objectType = function() { return "Gitana.FeatureMap"; };

            this.base(driver, object);
        },

        handleResponse: function(features) 
        {
            this.clear();

            if (features && features.__features) {
                features = features.__features();
            }

            for (var key in features) {
                if (features.hasOwnProperty(key) && !Gitana.isFunction(features[key])) {
                
                    var value = features[key];
                    /*
                    if (typeof(value) == "object" && value.objectType() == "Gitana.Feature") {
                        value = value.value;
                    }
                    */
                    this[key] = this.buildObject(value, key);

                    this.__keys().push(key);
                }
            }
            this.__size(this.__keys().length);
            this.__totalRows(this.__keys().length);
        },

        /**
         * @override
         */
        clone: function()
        {
            return new Gitana.FeatureMap(this.getDriver(), this);
        },

        /**
         * @param json
         */
        buildObject: function(value, key) {
            return new Gitana.Feature(value, key);
        },

        /**
         * Client-side pagination of elements in the map.
         *
         * @chained
         *
         * @param pagination
         */
        paginate: function(pagination)
        {
            return this.then(function() {

                var skip = pagination.skip;
                var limit = pagination.limit;

                var keysToRemove = [];

                // figure out which keys to remove
                for (var i = 0; i < this.__keys().length; i++)
                {
                    if (i < skip || i >= skip + limit)
                    {
                        keysToRemove.push(this.__keys()[i]);
                    }
                }

                // truncate the keys
                // NOTE: we can't use slice here since that produces a new array
                while (this.__keys().length > limit + skip)
                {
                    this.__keys().pop();
                }

                // remove any keys to remove from map
                for (var i = 0; i < keysToRemove.length; i++)
                {
                    delete this[keysToRemove[i]];
                }

                // reset the limit
                this.__size(this.__keys().length);
            });
        }
    });

})(window);

