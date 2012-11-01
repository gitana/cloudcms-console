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

        /**
         * @abstract
         * ABSTRACT METHOD
         *
         * @param json
         */
        buildObject: function(json, key) {
            return new Gitana.Feature(json,key);
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
