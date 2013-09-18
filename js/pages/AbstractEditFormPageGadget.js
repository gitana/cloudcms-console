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

        setupForms: function (el, callback)
        {
            var self = this;
            if (this.isEditJSONUri(el)) {
                // this is handled in "processForms" after the swap
                callback();
            } else {
                this.setupEditForm(el, callback);
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
        setupEditForm: function (el, callback)
        {
            callback();
        },

        editPageConfig: function() {
        },

        editButtonConfig: function() {
        },

        targetJsonObject: function() {
            return this.targetObject();
        },

        processForms: function(el, newEl, callback) {

            var self = this;

            if (this.isEditJSONUri(el))
            {
                this.processJSONEditForm(newEl, this.targetJsonObject(), null, callback);
            }
            else
            {
                this.processEditForm(newEl, callback);
            }
        },

        processEditForm: function(el, callback) {
            callback();
        },

        processJSONEditForm: function(el, object, targetId, callback) {

            var self = this;

            var targetId = targetId ? targetId : "json-edit";
            var defaultData = JSON.stringify(object, null, "    ");

            $(el).find("#" + targetId).alpaca({
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

                    window.setTimeout(function() {
                        self.editor.setValue(self.editor.getValue());
                        self.editor.clearSelection();
                    }, 200);

                    control.getEl().css('border', 'none');

                    // Add Buttons
                    $(el).find('#' + targetId + '-save').click(function() {

                        if (control.isValid(true))
                        {
                            Gitana.Utils.UI.block("Updating Object JSON...");

                            // json
                            var json = JSON.parse(control.getValue());
                            delete json._doc;

                            // update
                            self.handleUpdate(object, json, function(updatedObject) {
                                Gitana.Utils.UI.unblock(function() {
                                    self.app().run("GET", self.LINK().call(self,updatedObject));
                                });
                            });
                        }
                    });

                    callback();
                }
            });
        },

        handleUpdate: function(object, json, callback)
        {
            // Clean up object first
            for (var key in object) {
                if (object.hasOwnProperty(key) && !Gitana.isFunction(object[key])) {
                    if (key !== "_doc") {
                        delete object[key];
                    }
                }
            }

            Ratchet.merge(json, object);

            object.update().then(function() {
                callback(this);
            });
        }

    });

})(jQuery);