(function($) {
    Gitana.Console.Pages.AbstractExport = Gitana.CMS.Pages.AbstractFormPageGadget.extend(
        {
            constructor: function(id, ratchet) {
                this.base(id, ratchet);
            },

            schema: function() {
                var schema = {
                    "type" : "object",
                    "properties" : {
                        "vault": {
                            "title": "Select a Destination Vault",
                            "type": "object",
                            "properties": {
                                "vaultId" : {
                                    "type" : "string",
                                    "required" : true
                                }
                            }
                        },
                        "archive" : {
                            "title" : "Archive Properties",
                            "type" : "object"
                        },
                        "configuration" : {
                            "title" : "Export Configuration",
                            "type" : "object",
                            "properties" : {
                                "includeACLs" : {
                                    "type" : "boolean",
                                    "required" : true,
                                    "default" : true
                                },
                                "includeTeams" : {
                                    "type" : "boolean",
                                    "required" : true,
                                    "default" : true
                                },
                                "includeActivities" : {
                                    "type" : "boolean",
                                    "required" : true,
                                    "default" : true
                                },
                                "includeBinaries" : {
                                    "type" : "boolean",
                                    "required" : true,
                                    "default" : true
                                },
                                "includeAttachments" : {
                                    "type" : "boolean",
                                    "required" : true,
                                    "default" : true
                                },
                                "startDate" : {
                                    "title": "Start Datetime",
                                    "type" : "string",
                                    "format": "datetime"
                                },
                                "endDate" : {
                                    "title": "End Datetime",
                                    "type" : "string",
                                    "format": "datetime"
                                },
                                "schedule" : {
                                    "title": "Schedule",
                                    "type" : "string",
                                    "enum": ["ASYNCHRONOUS" , "SYNCHRONOUS"],
                                    "default" : "ASYNCHRONOUS",
                                    "required" : true
                                }
                            }
                        }
                    }
                };
                _mergeObject(schema.properties.archive, Gitana.Console.Schema.Archive);
                return schema;
            },

            options: function() {
                var self = this;
                var options = {
                    "fields" : {
                        "vault": {
                            "fields": {
                                "vaultId" : {
                                    "label": false,
                                    "type" : "select",
                                    "dataSource": function(field, callback) {
                                        var firstOption;
                                        self.platform().listVaults({
                                            "limit": Gitana.Console.LIMIT_NONE
                                        }).each(
                                            function(key, val, index) {
                                                field.selectOptions.push({
                                                    "value": this.getId(),
                                                    "text": self.friendlyTitle(this)
                                                });
                                                if (!firstOption) {
                                                    firstOption = this.getId();
                                                }
                                            }).then(function() {
                                                if (callback) {
                                                    callback();
                                                    if (firstOption) {
                                                        field.field.val(firstOption).change();
                                                    }
                                                }
                                            });
                                    }
                                }
                            }
                        },
                        "archive" : {
                            "helper" : "Provide identification properties for the archive."
                        },
                        "configuration" : {
                            "helper" : "Configure how you would like the export process to run:",
                            "fields" : {
                                "includeACLs" : {
                                    "label": false,
                                    "type" : "checkbox",
                                    "rightLabel" : "Export Permissions and Access Control"
                                },
                                "includeTeams" : {
                                    "label": false,
                                    "type" : "checkbox",
                                    "rightLabel" : "Export Teams"
                                },
                                "includeActivities" : {
                                    "label": false,
                                    "type" : "checkbox",
                                    "rightLabel" : "Export Activities"
                                },
                                "includeBinaries" : {
                                    "label": false,
                                    "type" : "checkbox",
                                    "rightLabel" : "Export Data Store Binaries"
                                },
                                "includeAttachments" : {
                                    "label": false,
                                    "type" : "checkbox",
                                    "rightLabel" : "Export Object Attachments"
                                },
                                "startDate" : {
                                    "helper" : "Optionally limit the export to objects modified after a specific time."
                                },
                                "endDate" : {
                                    "helper" : "Optionally limit the import to objects modified before a specific time."
                                },
                                "schedule" : {
                                    "optionLabels" : ["Run in the Background", "Run Immediately and Wait"]
                                }
                            }
                        }
                    }
                };
                _mergeObject(options.fields.archive, Gitana.Console.Options.Archive);
                return options;
            },

            requiredAuthorities: function() {
                return [
                    {
                        "permissioned" : this.targetObject(),
                        "permissions" : ["read"]
                    }
                ];
            },

            setupExportForm : function (el, callback) {

                var objectType = this.targetObject().objectType();

                if (Alpaca.startsWith(objectType, 'Gitana.')) {
                    objectType = objectType.substring(7);
                }

                var tenantGroupIdentifier = this.tenantDetails().title.replace(/\W/g, '').toLowerCase();

                var self = this;
                $('#export', $(el)).alpaca({
                    "data" : {
                        "archive" : {
                            "group" : "org." + tenantGroupIdentifier,
                            "artifact" : this.targetObject().getType() + "." + this.targetObject().getId(),
                            "version" : "0.1"
                        }
                    },
                    "schema": self.schema(),
                    "options": self.options(),
                    "view" : {
                        "parent": "VIEW_WEB_EDIT_LAYOUT_GRID_FOUR_COLUMN",
                        "layout": {
                            "bindings": {
                                "vault": "column-1",
                                "archive": "column-1",
                                "configuration": "column-2"
                            }
                        }
                    },
                    "postRender": function(form) {

                        Gitana.Utils.UI.beautifyAlpacaForm(form, 'export-create', true);

                        // Export Buttons
                        $('#export-create', $(el)).click(function() {

                            var formVal = form.getValue();
                            var vaultId = formVal['vault']['vaultId'];
                            var groupId = formVal['archive']['group'];
                            var artifactId = formVal['archive']['artifact'];
                            var version = formVal['archive']['version'];

                            var schedule = formVal['configuration']['schedule'] == "ASYNCHRONOUS";

                            var configuration = {
                                "payload" : "publication",
                                "includeACLs" : formVal['configuration']['includeACLs'],
                                "includeTeams" : formVal['configuration']['includeTeams'],
                                "includeActivities" : formVal['configuration']['includeActivities'],
                                "includeBinaries" : formVal['configuration']['includeBinaries'],
                                "includeAttachments" : formVal['configuration']['includeAttachments']
                            };

                            if (formVal['configuration']['startDate']) {
                                configuration['startDate'] = formVal['configuration']['startDate'].getTime();
                            }

                            if (formVal['configuration']['endDate']) {
                                configuration['endDate'] = formVal['configuration']['endDate'].getTime();
                            }

                            if (form.isValid(true)) {

                                Gitana.Utils.UI.block("Exporting " + objectType + "...");

                                self.targetObject().exportArchive({
                                    "vault": vaultId,
                                    "group": groupId,
                                    "artifact": artifactId,
                                    "version": version,
                                    "configuration": configuration,
                                    "async" : schedule
                                }).then(function() {
                                        var link;
                                        if (schedule) {
                                            link = self.LIST_LINK().call(self, "jobs");
                                        } else {
                                            link = self.LIST_LINK().call(self, "vaults") + vaultId + "/archives";
                                        }
                                        var callback = function() {
                                            self.app().run("GET", link);
                                        };
                                        Gitana.Utils.UI.unblock(callback);
                                    });
                            }
                        });

                        callback();
                    }
                });
            },

            setupForms : function (el, callback) {
                this.setupExportForm(el, callback);
            }

        });

})(jQuery);