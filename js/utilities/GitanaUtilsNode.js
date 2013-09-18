(function($) {

    Gitana.Utils.Node = {

        /**
         * Loads and creates a map of definitions for a given branch.
         * Optionally caches on a cacheContext.
         *
         * @param {Gitana.Branch} branch the Gitana Branch instance
         * @param {Function} callback function to receive the definitions object
         * @param [Object] cacheContext an optional object into which cached definitions are stored
         * @param [Boolean] forceCacheReset whether to force a cache reset (a reload)
         */
        loadDefinitions: function(branch, callback, cacheContext, forceCacheReset)
        {
            var _definitions = null;
            if (cacheContext) {
                _definitions = cacheContext._definitions;
            }

            if (forceCacheReset) {
                _definitions = null;
            }

            // if no definitions, load them
            if (!_definitions)
            {
                _definitions = {
                    qnames: [],
                    names: [],
                    labels: {},
                    associationQNames: [],
                    featureQNames: [],
                    typeQNames: [],
                    qnameLabels: {}
                };

                Chain(branch).listDefinitions({
                    "limit": Gitana.Console.LIMIT_NONE
                }).each(function() {
                    _definitions.qnames.push(this.getQName());
                    _definitions.names.push(this["title"]);
                    var label = this["title"];
                    if (!label) {
                        label = this["_doc"];
                    }
                    _definitions.labels[this.getQName()] = label;

                    if (this.getTypeQName() == "d:type") {
                        _definitions.typeQNames.push(this.getQName());
                    }
                    if (this.getTypeQName() == "d:feature") {
                        _definitions.featureQNames.push(this.getQName());
                    }
                    if (this.getTypeQName() == "d:association") {
                        _definitions.associationQNames.push(this.getQName());
                    }

                    var qnameLabel = this["title"];
                    if (!qnameLabel) {
                        qnameLabel = this.getQName();
                    }
                    _definitions.qnameLabels[this.getQName()] = qnameLabel;

                }).then(function() {

                    if (cacheContext) {
                        cacheContext._definitions = _definitions;
                    }

                    callback(_definitions);
                });
            }
            else
            {
                callback(_definitions);
            }
        },

        loadPolicies: function(callback, scope)
        {
            // scope == 0 --> instance
            // scope == 1 --> class

            var policies = {};
            if (!scope || scope == 0)
            {
                // INSTANCE
                policies["nodeLabels"] = {
                    "p:afterReadNode": "After this node is read",
                    //"p:beforeCreateNode": "",
                    //"p:afterCreateNode": "",
                    "p:beforeUpdateNode": "Before this node is updated",
                    "p:afterUpdateNode": "After this node is updated",
                    "p:beforeDeleteNode": "Before this node is deleted",
                    "p:afterDeleteNode": "After this node is deleted"
                };
                policies["nodeKeys"] = [
                    "p:afterReadNode",
                    //"p:beforeCreateNode",
                    //"p:afterCreateNode",
                    "p:beforeUpdateNode",
                    "p:afterUpdateNode",
                    "p:beforeDeleteNode",
                    "p:afterDeleteNode"
                ];
                policies["associationLabels"] = {
                    "p:beforeAssociate": "Before this node is associated with another node",
                    "p:afterAssociate": "After this node is associated with another node",
                    "p:beforeUnassociate": "Before this node is unassociated with another node",
                    "p:afterUnassociate": "After this node is unassociated with another node"
                };
                policies["associationKeys"] = [
                    "p:beforeAssociate",
                    "p:afterAssociate",
                    "p:beforeUnassociate",
                    "p:afterUnassociate"
                ]
            }
            else if (scope == 1)
            {
                // CLASS
                policies["nodeLabels"] = {
                    "p:afterReadNode": "After a node of this type is read",
                    "p:beforeCreateNode": "Before a node of this type is created",
                    "p:afterCreateNode": "After a node of this type is created",
                    "p:beforeUpdateNode": "Before a node of this type is updated",
                    "p:afterUpdateNode": "After a node of this type is updated",
                    "p:beforeDeleteNode": "Before a node of this type is deleted",
                    "p:afterDeleteNode": "After a node of this type is deleted"
                };
                policies["nodeKeys"] = [
                    "p:afterReadNode",
                    "p:beforeCreateNode",
                    "p:afterCreateNode",
                    "p:beforeUpdateNode",
                    "p:afterUpdateNode",
                    "p:beforeDeleteNode",
                    "p:afterDeleteNode"
                ];
                policies["associationLabels"] = {
                    "p:beforeAssociate": "Before a node of this type is associated with another node",
                    "p:afterAssociate": "After a node of this type is associated with another node",
                    "p:beforeUnassociate": "Before a node of this type is unassociated with another node",
                    "p:afterUnassociate": "After a node of this type is unassociated with another node"
                };
                policies["associationKeys"] = [
                    "p:beforeAssociate",
                    "p:afterAssociate",
                    "p:beforeUnassociate",
                    "p:afterUnassociate"
                ]
            }

            policies["allLabels"] = {};
            Gitana.copyInto(policies.allLabels, policies.nodeLabels);
            Gitana.copyInto(policies.allLabels, policies.associationLabels);
            policies["allKeys"] = [];
            for (var i = 0; i < policies.nodeKeys.length; i++)
            {
                policies["allKeys"].push(policies.nodeKeys[i]);
            }
            for (var i = 0; i < policies.associationKeys.length; i++)
            {
                policies["allKeys"].push(policies.associationKeys[i]);
            }

            callback(policies);
        }
    };

})(jQuery);