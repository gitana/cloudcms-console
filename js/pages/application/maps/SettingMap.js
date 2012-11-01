(function(window) {
    var Gitana = window.Gitana;

    Gitana.SettingMap = Gitana.AbstractMap.extend(
    {
        constructor: function(driver, object)
        {
            this.objectType = "Gitana.SettingMap";

            this.base(driver, object);

        },

        handleResponse: function(settings) 
        {

            this.clear();

            if (settings)
            {
                var settingsObject = settings['settings'];

                for (var key in settingsObject) {
                    if (settingsObject.hasOwnProperty(key) && !Gitana.isFunction(settingsObject[key])) {
                        var value = settingsObject[key];

                        var o = this.buildObject(value);
                        this[key] = o;

                        this.__keys().push(key);
                    }
                }
                this.__size(this.__keys().length);
                this.__totalRows(this.__keys().length);
            }





           /*
            this.clear();

            var object = {
                "rows" : {},
                "total_rows" : 0
            };

            if (settings) 
            {
                // parse object
                if (settings['settings'])
                {

                    var settingsObject = settings['settings'];

                    for (var key in settingsObject)
                    {
                        var value = settingsObject[key];

                        var o = this.buildObject(value, key);

                        this[key] = o;

                        this.__keys().push(key);

                        object["rows"][key] = {};

                        Gitana.copyInto(object["rows"][key], value);

                        object["total_rows"] ++;
                    }
                }
            }

            Gitana.copyInto(this.object, object);
            */
        },

        /**
         * @abstract
         * ABSTRACT METHOD
         *
         * @param json
         */
        buildObject: function(json, key) {
            return new Gitana.Setting(json,key);
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
                    if (i< skip || i >= skip + limit)
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

            /*
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
           */
        }
    });

})(window);
