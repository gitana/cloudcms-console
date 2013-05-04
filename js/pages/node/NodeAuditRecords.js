(function($) {
    Gitana.Console.Pages.NodeAuditRecords = Gitana.CMS.Pages.AbstractListPageGadget.extend(
    {
        SUBSCRIPTION : "audit-records",

        FILTER : function() {
            return "node-audit-records-list-filters-" + this.node().getId()
        },

        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        setup: function() {
            this.get("/repositories/{repositoryId}/branches/{branchId}/nodes/{nodeId}/auditrecords", this.index);
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
           this.menu(Gitana.Console.Menu.Node(this,"menu-node-audit-records"));
        },

        setupBreadcrumb: function() {
            return this.breadcrumb(Gitana.Console.Breadcrumb.NodeAuditRecords(this));
        },

        setupToolbar: function() {
            var self = this;
            self.base();
            self.addButtons([
            ]);

            this.toolbar(self.SUBSCRIPTION + "-toolbar",{
                "items" : {}
            });
        },

        /** OVERRIDE **/
        setupList: function(el) {
            var self = this;

            // define the list
            var list = self.defaultList();

            list["actions"] = self.actionButtons({
                "view": {
                    "title": "View Details",
                    "icon" : Gitana.Utils.Image.buildImageUri('objects', 'auditrecord', 48),
                    "click": function(record){
                        self.displayAuditRecordDetails(record);
                    }
                }
            });

            list["columns"] = [
                {
                    "title": "Title",
                    "type":"property",
                    "sortingExpression": "title",
                    "property": function(callback) {
                        var title = self.friendlyTitle(this);
                        callback(title);
                    }
                },
                {
                    "title": "Action",
                    "type":"property",
                    "sortingExpression": "action",
                    "property": function(callback) {
                        callback(self.listItemProp(this,'action'));
                    }
                },
                {
                    "title": "Principal ID",
                    "type":"property",
                    "sortingExpression": "principal",
                    "property": function(callback) {
                        callback(self.listItemProp(this,'principal'));
                    }
                },
                {
                    "title": "Last Modified",
                    "sortingExpression" : "_system.modified_on.ms",
                    "property": function(callback) {
                        var value = this.getSystemMetadata().getModifiedOn().getTimestamp();
                        if (value == null) {
                            value = "";
                        }
                        callback(value);
                    }
                }
            ];

            list["loadFunction"] = function(query, pagination, callback) {
                self.node().trap(function(error) {
                    return self.handlePageError(el, error);
                }).listAuditRecords(self.pagination(pagination)).then(function() {
                    callback.call(this);
                });
            };

            // store list configuration onto observer
            self.list(self.SUBSCRIPTION, list);
        },

        displayAuditRecordDetails: function(record) {
            
            var self = this;

            var title = "Audit Record Details";
            var dialog = "<div id='audit-record-details'></div>";

            record.object= self.populateObjectAll(record);

            record.object.fullJson = JSON.stringify(record.object, null, ' ');

            _mergeObject(record.object,record.__system());

            var templatePath = (Gitana.Apps.APP_NAME ? "/" : "") + Gitana.Apps.APP_NAME + "/templates/themes/" + Gitana.Apps.THEME + "/nodes/audit-record.html";

            $(dialog).empty().alpaca({
                "data" : record.object,
				"view" : {
                    "globalTemplate": templatePath
				},
                "postRender" : function(renderedField) {
                    renderedField.getEl().dialog({
                        title : "<img src='" + Gitana.Utils.Image.buildImageUri('objects', 'auditrecord', 24) + "' /> " + title,
                        resizable: true,
                        width: 900,
                        height: 600,
                        modal: true,
                        buttons: {
                        }
                    });
                }
            });

            $('.ui-dialog').css("overflow", "hidden");
            $('.ui-dialog-buttonpane').css("overflow", "hidden");
        },

        setupPage : function(el) {
            var page = {
                "title" : "Node Audit Records",
                "description" : "Display list of audit records for  node " + this.friendlyTitle(this.targetObject()) + ".",
                "listTitle" : "Audit Record List",
                "listIcon" : Gitana.Utils.Image.buildImageUri('objects', 'auditrecord', 20),
                "subscription" : this.SUBSCRIPTION,
                "filter" : this.FILTER()
            };

            this.page(_mergeObject(page,this.base(el)));
        }
    });

    Ratchet.GadgetRegistry.register("page", Gitana.Console.Pages.NodeAuditRecords);

})(jQuery);