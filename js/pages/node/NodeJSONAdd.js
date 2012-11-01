(function($) {
    Gitana.Console.Pages.NodeJSONAdd = Gitana.CMS.Pages.AbstractFormPageGadget.extend({
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/repositories/{repositoryId}/add/jsonnode", this.index);
            this.get("/repositories/{repositoryId}/branches/{branchId}/add/jsonnode", this.index);
            this.get("/repositories/{repositoryId}/branches/{branchId}/nodes/{nodeId}/add/jsonnode", this.index);
        },

        targetObject: function() {
            return this.branch();
        },

        requiredAuthorities: function() {
            return [
                {
                    "permissioned" : this.targetObject(),
                    "permissions" : ["create_subobjects"]
                }
            ];
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Branch(this, "menu-nodes"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb($.merge(Gitana.Console.Breadcrumb.Nodes(this), [
                {
                    "text" : "New JSON Node"
                }
            ]));
        },

        createNode: function(formVal) {
            var self = this;
            Gitana.Utils.UI.block("Creating Node...");

            self.branch().createNode(formVal).then(function() {
                var link = self.LINK().call(self, this);
                var callback = function() {
                    self.app().run("GET", link);
                };
                Gitana.Utils.UI.unblock(callback);

            });
        },

        setupNodeAddForm : function (el) {
            var self = this;
            var formDiv = el ? $('#node-add',$(el)) : $('#node-add');

            formDiv.empty().alpaca({
                "data" : "{}",
                "options": {
                    "type" : "json",
                    "rows" : 20,
                    "cols" : 90
                },
                "postRender": function(form) {

                    Gitana.Utils.UI.beautifyAlpacaForm(form, 'node-add-create', true);

                    // Add Buttons
                    $('#node-add-create',$(el)).click(function() {

                        var formVal = form.getValue();

                        if (form.isValid(true)) {

                            self.createNode(formVal);
                        }
                    });
                }
            });
        },

        setupForms : function (el) {

            var self = this;

            this.setupNodeAddForm(el);
        },

        setupPage: function(el) {

            var page = {
                "title" : "New JSON Node",
                "description" : "Create a new json node of branch " + this.friendlyTitle(this.branch()) + ".",
                "forms" :[
                    {
                        "id" : "node-add",
                        "title" : "Create A New JSON Node",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'json-add', 24),
                        "buttons" :[
                            {
                                "id" : "node-add-create",
                                "title" : "Create JSON Node",
                                "isLeft" : true
                            }
                        ]
                    }
                ]
            };

            this.page(Alpaca.mergeObject(page,this.base(el)));

        }

    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.NodeJSONAdd);

})(jQuery);