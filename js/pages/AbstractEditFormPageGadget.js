(function($) {
    Gitana.CMS.Pages.AbstractEditFormPageGadget = Gitana.CMS.Pages.AbstractFormPageGadget.extend(
    {
        setup: function() {
            var self = this;
            if ($.isArray(this.EDIT_URI)) {
                $.each(this.EDIT_URI, function() {
                    self.get(this, self.index);
                });
            } else {
                this.get(this.EDIT_URI, this.index);
            }

            if ($.isArray(this.EDIT_JSON_URI)) {
                $.each(this.EDIT_JSON_URI, function() {
                    self.get(this, self.index);
                });
            } else {
                this.get(this.EDIT_JSON_URI, this.index);
            }
        },

        teardown: function() {
            this.base();

            this.editor = null;
        },

        setupJSONEditForm: function (el, object, targetId) {

            /*
            var self = this;

            var targetId = targetId ? targetId : "json-edit";
            var self = this;

            var defaultData = JSON.stringify(object, null, "   ");

            $("#" + targetId, $(el)).alpaca({
                "data": defaultData,
                "schema": {
                    "type": "string"
                },
                "options": {
                    "type": "editor",
                    "aceMode": "ace/mode/json",
                    "aceFitContentHeight": true
                },
                "postRender": function(control) {

                    self.editor = control.getEditor();

                    control.getEditor().setShowPrintMargin(false);

                    //Gitana.Utils.UI.uniform(control.getEl());
                    control.getEl().css('border', 'none');
                    // Add Buttons
                    $('#' + targetId + '-save', $(el)).click(function() {
                        var form = control.getValue();
                        if (control.isValid(true)) {

                            var obj = form;

                            Gitana.Utils.UI.block("Updating Object JSON...");

                            // update our selected object with the new json

                            // Clean up object first
                            for (var key in object) {
                                if (object.hasOwnProperty(key) && !Gitana.isFunction(object[key])) {
                                    delete object[key];
                                }
                            }

                            Alpaca._mergeObject(object,obj);
                            //object.object = Alpaca.cloneObject(obj);

                            // update
                            object.update().then(function () {
                                var updatedObject = this;
                                Gitana.Utils.UI.unblock(function() {
                                    self.app().run("GET", self.LINK().call(self,updatedObject));
                                });
                            });
                        }
                    });
                }
            });
            */
        },

        isEditJSONUri: function(el) {
            var self = this;
            var check = false;
            if ($.isArray(this.EDIT_JSON_URI)) {
                $.each(this.EDIT_JSON_URI, function() {
                    if (el.ratchet().executeMatch(this, el.route.uri) != null) {
                        check = true;
                        return false;
                    }
                });
                return check;
            } else {
                return el.ratchet().executeMatch(this.EDIT_JSON_URI, el.route.uri) != null;
            }
        },

        setupEditPage: function(el, page) {
            if (this.isEditJSONUri(el)) {
                page['forms'].push({
                    "id" : "json-edit",
                    "title" : "Edit JSON",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'json-edit', 24),
                    "buttons" :[
                        {
                            "id" : "json-edit-save",
                            "title" : "Save JSON",
                            "isLeft" : true
                        }
                    ]
                });
            } else {
                page['forms'].push(this.editPageConfig());
            }
        },

        setupForms: function (el) {
            var self = this;
            if (this.isEditJSONUri(el)) {
                this.setupJSONEditForm(el, this.targetObject());
            } else {
                this.setupEditForm(el);
            }
        },

        setupEditButton: function (el) {
            if (this.isEditJSONUri(el)) {
                this.addButton(this.editButtonConfig());
            } else {
                this.addButtons([
                    {
                        "id": "edit-json",
                        "title": "Edit JSON",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'json-edit', 48),
                        "url" : this.LINK().call(this,this.targetObject(), 'edit', 'json')
                    }
                ]);
            }
        },

        /** Abstract methods **/
        setupEditForm: function (el) {
        },

        editPageConfig: function() {
        },

        editButtonConfig: function() {
        },

        processForms: function(el) {

            var self = this;
            if (this.isEditJSONUri(el)) {
                this.processJSONEditForm(el, this.targetObject());
            } else {
                this.processEditForm(el);
            }
        },

        processEditForm: function(el) {
        },

        processJSONEditForm: function(el, object, targetId) {

            var self = this;

            var targetId = targetId ? targetId : "json-edit";
            var defaultData = JSON.stringify(object, null, "   ");

            $("#" + targetId).alpaca({
                "data": defaultData,
                "schema": {
                    "type": "string"
                },
                "options": {
                    "type": "editor",
                    "aceMode": "ace/mode/json",
                    "aceFitContentHeight": true
                },
                "postRender": function(control) {

                    self.editor = control.getEditor();

                    //Gitana.Utils.UI.uniform(control.getEl());
                    control.getEl().css('border', 'none');

                    // Add Buttons
                    $('#' + targetId + '-save').click(function() {

                        if (control.isValid(true))
                        {
                            Gitana.Utils.UI.block("Updating Object JSON...");

                            // json
                            var json = JSON.parse(control.getValue());
                            delete json._doc;

                            // Clean up object first
                            for (var key in object) {
                                if (object.hasOwnProperty(key) && !Gitana.isFunction(object[key])) {
                                    if (key !== "_doc") {
                                        delete object[key];
                                    }
                                }
                            }

                            Ratchet.merge(json, object);

                            // update
                            object.update().then(function () {
                                var updatedObject = this;
                                Gitana.Utils.UI.unblock(function() {
                                    self.app().run("GET", self.LINK().call(self,updatedObject));
                                });
                            });
                        }
                    });
                }
            });

        }

    });

})(jQuery);