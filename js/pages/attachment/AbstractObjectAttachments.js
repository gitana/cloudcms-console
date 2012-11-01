(function($) {
    Gitana.Console.Pages.AbstractObjectAttachments = Gitana.CMS.Pages.AbstractListPageGadget.extend(
    {
        requiredAuthorities: function() {
            return [
                {
                    "permissioned" : this.targetObject(),
                    "permissions" : ["read"]
                }
            ];
        },

        setupToolbar: function() {
            var self = this;
            self.base();
            self.addButtons([
                {
                    "id": "upload",
                    "title": "Add Attachments",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'attachment-add', 48),
                    "url" : this.LINK().call(this, this.targetObject(),'manage','attachments'),
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

        /** Filter Related Methods **/
        filterEmptyData: function() {
            return {
                "file" : ""
            };
        },

        filterFormToJSON: function (formData) {
            var query = formData && formData['name'] ? formData['name'] : "";

            return query;
        },

        filterSchema: function () {
            return {
                "type" : "object",
                "properties" : {
                    "name": {
                        "title" : "Name",
                        "type" : "string",
                        "default" : "Thumb*"
                    }
                }
            };
        },

        filterOptions: function() {
            var self = this;
            return {
                "fields": {
                    "name": {
                        "type" : "text",
                        "size" : "60",
                        "helper" : "Enter regular expression for filtering attachments by name"
                    }
                }
            };
        },

        filterView: function() {
            return Alpaca.mergeObject(this.base(),{
                "layout": {
                    "bindings": {
                        "name": "column-1"
                    }
                }
            });
        },

        onClickDeleteMultiple: function(parentObject, objects , objectType, link , img , titleFunction) {
            var self = this;

            var friendlyTitle = titleFunction ? titleFunction : self.friendlyTitle;

            var objectList = "<ul>";

            $.each(objects, function(index, val) {

                objectList += "<li>" + friendlyTitle(val) + "</li>";

            });

            objectList += "</ul>";

            var dialog = $('<div><h2 style="padding:20px;margin:2px;line-height:1.2em;">Are you sure you want to remove the following ' + objectType +'(s) ?' + objectList + '</h2></div>');

            dialog.alpaca({
                "data": {},
                "schema": {},
                "options": {},
                "view": 'VIEW_WEB_EDIT_LIST',
                "postRender": function(control) {
                    Gitana.Utils.UI.uniform(dialog);

                    dialog.dialog({
                        title : "<img src='" + img + "' /> Remove " + objectType + "(s) ?",
                        resizable: true,
                        height: 250,
                        width: 650,
                        modal: true,
                        buttons: {
                            "Remove": function() {
                                if (control.isValid(true)) {

                                    Gitana.Utils.UI.block("Deleting " + objectType + "(s) ...");

                                    parentObject.then(function() {

                                        var _this = this;

                                        $.each(objects, function(key,obj) {
                                            parentObject.attachment(obj['attachmentId']).del();
                                        });

                                        this.then(function() {
                                            if (link) {
                                                self.refresh(link);
                                            } else {
                                                self.refresh();
                                            }
                                        });

                                    });

                                    // we also have to close the dialog
                                    $(this).dialog("close");
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
                "delete": {
                    "title": "Delete Attachment(s)",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'attachment-delete', 48),
                    /*
                    "click": function(node) {
                        self.onClickDelete(node);
                    },
                    */
                    "selection" : "multiple",
                    "click": function(attachments) {
                        self.onClickDeleteMultiple(self.targetObject(),attachments,'attachment',self.LINK().call(self,self.targetObject(),'attachments'),Gitana.Utils.Image.buildImageUri('objects', 'attachment-delete', 24),function(attachment) {
                            return attachment.attachmentId;
                        });
                    },
                    "requiredAuthorities" : {
                        "permissioned" : self.node(),
                        "permissions" : ["update"]
                    }
                }
            });

            list["columns"] = [
                {
                    "title": "Id",
                    "type":"property",
                    "property": function(callback) {
                        var attachmentUrl = this.getDownloadUri() + "?a=true'";
                        var value = "<a href='" + attachmentUrl + "'>" + this.getFilename() + "</a>";
                        callback(value);
                    }
                },
                {
                    "title": "Filename",
                    "type":"property",
                    "property": function(callback) {
                        callback(this.getFilename());
                    }
                },
                    {
                    "title": "Content Type",
                    "type":"property",
                    "property": function(callback) {
                        var value = this.getContentType();
                        callback(value);
                    }
                },
                    {
                    "title": "Size",
                    "type":"property",
                    "property": function(callback) {
                        var value = Math.round(this.getLength() / 10.24) / 100 + ' KB';
                        callback(value);
                    }
                }
            ];

            list["loadFunction"] = function(query, pagination, callback) {
                self.targetObject().trap(function(error) {
                    var result = this.subchain(this.getFactory().tenantMap(self.targetObject()));
                    result.object['total_rows'] = 0;
                    callback.call(result);
                }).listAttachments().count(function(count) {
                    this.object['total_rows'] = count;
                }).then(function() {
                    callback.call(this);
                });
            };

            // store list configuration onto observer
            self.list(self.SUBSCRIPTION, list);
        }
    });

})(jQuery);