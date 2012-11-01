(function(window) {
    var Gitana = window.Gitana;

    Gitana.SettingMap = Gitana.AbstractMap.extend(
    {
        constructor: function(driver, object)
        {
            this.objectType = function() { return "Gitana.SettingMap"; };

            this.base(driver, object);
        },

        handleResponse: function(settings) 
        {
            this.clear();

            // on first load, we have json with a .settings property
            if (settings && settings['settings'])
            {
                settings = settings['settings'];
            }

            for (var key in settings) {
                if (settings.hasOwnProperty(key) && !Gitana.isFunction(settings[key])) {
                
                    var value = settings[key];
                    if (typeof(value) == "object" && value.objectType() == "Gitana.Setting") {
                        // if handleResponse is given a map of Gitana.Setting objects...
                        value = value.value;
                    }
                
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
            return new Gitana.SettingMap(this.getDriver(), this);
        },

        /**
         * @param json
         */
        buildObject: function(value, key) {
            return new Gitana.Setting(value, key);
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
