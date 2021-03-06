(function($) {
    Gitana.Console.Pages.NodeAttachments = Gitana.CMS.Pages.AbstractListPageGadget.extend(
    {
        SUBSCRIPTION : "attachments",

        FILTER : function() {
            //return "node-attachment-list-filters-" + this.node().getId()
            return "node-attachment-list-filters";
        },

        FILTER_TOOLBAR: {
            "query" : {
                "title" : "Query",
                "icon" : Gitana.Utils.Image.buildImageUri('browser', 'query', 48)
            }
        },

        setup: function() {
            this.get("/repositories/{repositoryId}/branches/{branchId}/nodes/{nodeId}/attachments", this.index);
        },

        targetObject: function() {
            return this.node();
        },

        requiredAuthorities: function() {
            return [
                {
                    "permissioned" : this.targetObject(),
                    "permissions" : ["read"]
                }
            ];
        },

        setupMenu: function() {
            this.menu(Gitana.Console.Menu.Node(this,"menu-attachments"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.Attachments(this));
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
                "id" : ""
            };
        },

        filterFormToJSON: function (formData) {
            var query = formData && formData['id'] ? formData['id'] : "";

            return query;
        },

        filterSchema: function () {
            return {
                "type" : "object",
                "properties" : {
                    "id": {
                        "title" : "Attachment Id",
                        "type" : "string"
                    }
                }
            };
        },

        filterOptions: function() {
            var self = this;
            return {
                "fields": {
                    "id": {
                        "type" : "text",
                        "size" : this.DEFAULT_FILTER_TEXT_SIZE,
                        "helper" : "Enter regular expression for query by attachment id."
                    }
                }
            };
        },

        filterView: function() {
            return {
                "parent": "VIEW_WEB_EDIT_LAYOUT_GRID_FOUR_COLUMN",
                "layout": {
                    "bindings": {
                        "id": "column-1"
                    }
                }
            };
        },

        onClickDeleteMultiple: function(parentObject, objects , objectType, link , img , titleFunction) {
            var self = this;

            var friendlyTitle = titleFunction ? titleFunction : self.friendlyTitle;

            var objectList = "<ul>";

            $.each(objects, function(index, val) {

                objectList += "<li>" + friendlyTitle(val) + "</li>";

            });

            objectList += "</ul>";

            var dialog = $('<div><h2 class="dialog-delete-message-2">Are you sure you want to remove the following ' + objectType +'(s) ?' + objectList + '</h2></div>');

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

                                    Chain(parentObject).then(function() {

                                        var _this = this;

                                        $.each(objects, function(key,obj) {
                                            _this.attachment(obj["attachmentId"]).del();
                                        });

                                        this.then(function() {
                                            if (link) {
                                                self.refresh(link);
                                            } else {
                                                Gitana.CMS.refresh();
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
                    "title": "ID",
                    "type":"property",
                    "sortingExpression": "attachmentId",
                    "property": function(callback) {
                        //var attachmentUrl = Gitana.oAuth.prepareDownloadUrl(self.platform().getDriver(), this.getDownloadUri() + "?a=true");
                        //var value = "<a href='" + attachmentUrl + "'>" + this.getId() + "</a>";
                        //var link = this.getDownloadUri() + "?a=true";
                        var link = this.getDownloadUri();
                        var value = "<div class='attachment-download' data-link='" + link + "'>" + this.getId() + "</div>";
                        callback(value);
                    }
                },
                {
                    "title": "Preview",
                    "type":"property",
                    "cssClass": "table-preview-attachment",
                    "property": function(callback) {
                        //var previewUrl = _previewMimetypeFallback(this.getPreviewUri(this.getId()), this.getContentType());
                        var attachmentName = this.getId();

                        var previewUrl = this.getDriver().baseURL + this.getUri() + "/../../preview/console-attachment-" + this.getId() + "?attachment=" + this.getId() + "&size=64&mimetype=image/jpeg";
                        if (attachmentName.indexOf("_preview") == 0)
                        {
                            previewUrl = this.getDriver().baseURL + this.getUri();
                        }
                        previewUrl = _previewMimetypeFallback(previewUrl);

                        var value = "<div><img src='" + previewUrl + "'></div>";
                        callback(value);
                    }
                },
                {
                    "title": "Filename",
                    "type":"property",
                    "sortingExpression": "filename",
                    "property": function(callback) {
                        var value = this.getFilename();
                        callback(value);
                    }
                },
                {
                    "title": "Content Type",
                    "type":"property",
                    "sortingExpression": "contentType",
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
                var query = self.query();
                Chain(self.node()).trap(function(error) {
                    return self.handlePageError(el, error);
                }).listAttachments().filter(function() {
                    if (!Alpaca.isValEmpty(query) && ! this.attachmentId.match(query)) {
                        return false;
                    } else {
                        /*
                        if (this.attachmentId.indexOf("_preview_") == 0) {
                            return false;
                        }
                        */
                        return true;
                    }
                }).then(function () {
                    if (self.pagination(pagination).sort) {
                        var direction = -1;
                        $.each(self.pagination(pagination).sort ,function(i,v) {
                            direction = v;
                        });
                        this.sort(function(val1, val2) {
                            if (val1 == null || val2 == null) {
                                return 1;
                            } else {
                                if (val1 > val2) {
                                    return direction;
                                }
                                if (val1 < val2) {
                                    return direction * -1;
                                }
                                if (val1 == val2) {
                                    return 0;
                                }
                            }
                        }).then(function() {
                            this.paginate(self.pagination(pagination)).then(function() {
                                callback.call(this);
                            });
                        });
                    } else {
                        this.then(function() {
                            this.paginate(self.pagination(pagination)).then(function() {
                                callback.call(this);
                            });
                        });
                    }
                });
            };

            // store list configuration onto observer
            self.list(self.SUBSCRIPTION, list);
        },

        processList: function(el) {
            var self = this;
            $("body").undelegate(".attachment-download", "click").delegate(".attachment-download", "click", function(e, data) {
                var downloadLink = $(this).attr('data-link');
                var link = downloadLink;
                window.open(link);
            });
        },

        setupPage : function(el) {

            var page = {
                "title" : "Node Attachments",
                "description" : "Add, remove or view attachment(s) of node " + this.friendlyTitle(this.node()) + ".",
                "listTitle" : "Attachment List",
                "listIcon" : Gitana.Utils.Image.buildImageUri('objects', 'attachment', 20),
                "subscription" : this.SUBSCRIPTION,
                "filter" : this.FILTER(),
                "forms" :[{
                    "id" : "add-attachments",
                    "title" : "Attachment Manager",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'attachment', 24),
                    "buttons" :[
                    ]
                }]
            };

            this.page(_mergeObject(page,this.base(el)));
        }
    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.NodeAttachments);

})(jQuery);