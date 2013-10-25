(function($) {
    Gitana.Console.Pages.Features = Gitana.CMS.Pages.AbstractListPageGadget.extend(
    {
        SUBSCRIPTION : "features",

        ROOT_KEY: "mandatoryFeatures",

        setup: function() {
            this.get("/repositories/{repositoryId}/branches/{branchId}/definitions/{definitionId}/features", this.index);
        },

        featuresLink: function() {
            return this.LIST_LINK().call(this,"features");
        },

        requiredAuthorities: function() {
            return [
                {
                    "permissioned" : this.targetObject(),
                    "permissions" : ["read"]
                }
            ];
        },

        targetObject: function() {
            return this.definition();
        },

        targetFeaturesObject: function() {
            return this.targetObject().object[this.ROOT_KEY];
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Type(this,"menu-definition-features"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.Features(this));
        },

        setupToolbar: function() {
            var self = this;
            self.base();
            self.addButtons([
                {
                "id": "create",
                "title": "New Feature",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'features-add', 48),
                    "url" : this.LINK().call(this,this.targetObject(),'add','feature'),
                    "requiredAuthorities" : [
                        {
                            "permissioned" : self.targetObject(),
                            "permissions" : ["update"]
                        }
                    ]
                }
            ]);

            this.toolbar(self.SUBSCRIPTION + "-toolbar",{
                "items" : {}
            });
        },

        onClickDelete: function(features) {

            var self = this;

            var featureList = "<ul>";

            $.each(features, function(index, val) {

                featureList += "<li>" + val.getId() + "</li>";

            });

            featureList += "</ul>";

            var dialog = $('<div><h2 class="dialog-delete-message-2">Are you sure you want to remove the following features?' + featureList + '</h2></div>');

            dialog.alpaca({
                "data": {},
                "schema": {},
                "options": {},
                "view": 'VIEW_WEB_EDIT_LIST',
                "postRender": function(control) {
                    Gitana.Utils.UI.uniform(dialog);

                    dialog.dialog({
                        title : "<img src='" + Gitana.Utils.Image.buildImageUri('objects', 'features-delete', 24) + "' /> Remove Features(s) ?",
                        resizable: true,
                        height: 250,
                        width: 650,
                        modal: true,
                        buttons: {
                            "Remove": function() {
                                //var featureVal = control.getValue();
                                if (control.isValid(true)) {

                                    Gitana.Utils.UI.block("Deleting Features ...");

                                    var targetObj = self.targetFeaturesObject();

                                    if (targetObj) {

                                        $.each(features, function(index, val) {

                                            var featureId = val.getId();

                                            self.targetObject().removeFeature(featureId).then(function() {

                                                if (index >= features.length) {
                                                    self.refresh(self.featuresLink());
                                                }

                                            });

                                            //if (targetObj[featureId] != null) {
                                            //    delete targetObj[featureId];
                                            //}

                                        });
                                    }
                                    $(this).dialog("close");

                                    /*

                                    self.targetObject().update().then(function() {

                                        self.refresh(self.featuresLink());

                                    });

                                    // we also have to close the dialog
                                    $(this).dialog("close");
                                    */
                                }
                            }
                        }
                    });
                    $('.ui-dialog').css("overflow", "hidden");
                    $('.ui-dialog-buttonpane').css("overflow", "hidden");
                }
            });
        },


        /** OVERRIDE **/
        setupList: function(el) {
            var self = this;

            // define the list
            var list = self.defaultList();

            list["actions"] = self.actionButtons({
                "edit": {
                    "title": "Edit Feature",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'features-edit', 48),
                    "click": function(feature){
                        var key = feature.getId();
                        self.app().run("GET", self.featuresLink() + key + '/edit');
                    },
                    "requiredAuthorities" : {
                        "permissioned" : self.targetObject(),
                        "permissions" : ["update"]
                    }
                },
                "delete": {
                    "title": "Delete Feature(s)",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'features-delete', 48),
                    "selection" : "multiple",
                    "click": function(features) {
                        self.onClickDelete(features);
                    },
                    "requiredAuthorities" : {
                        "permissioned" : self.targetObject(),
                        "permissions" : ["update"]
                    }
                },
                "editJSON": {
                    "title": "Edit JSON",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'json-edit', 48),
                    "click": function(feature) {
                        var key = feature.getId();
                        self.app().run("GET", self.featuresLink() + key + '/edit/json');
                    },
                    "requiredAuthorities" : {
                        "permissioned" : self.targetObject(),
                        "permissions" : ["update"]
                    }
                }
            });

            list["columns"] = [
                {
                    "title": "Feature",
                    "property": function(callback) {
                        var value = this.getId();
                        callback(value);
                    }
                }
            ];

            list["loadFunction"] = function(query, pagination, callback) {

                var featureMap = new Gitana.FeatureMap(self.platform().getDriver(),self.targetObject(),self.ROOT_KEY);

                callback.call(Chain(featureMap).paginate(pagination));

            };

            // store list configuration onto observer
            self.list(self.SUBSCRIPTION, list);
        },

        setupPage : function(el) {
            var page = {
                "title" : "Features",
                "description" : "Display list of features of definition " + this.targetObject().getQName() + ".",
                "listTitle" : "Feature List",
                "listIcon" : Gitana.Utils.Image.buildImageUri('objects', 'features', 20),
                "subscription" : this.SUBSCRIPTION
            };

            this.page(_mergeObject(page,this.base(el)));
        }
    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.Features);

})(jQuery);