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
                        "vault" : {
                            "title": "Vault",
                            "type" : "string",
                            "required" : true
                        },
                        "archive" : {
                            "title" : "Archive",
                            "type" : "object"
                        },
                        "configuration" : {
                            "title" : "Configuration",
                            "type" : "object",
                            "properties" : {
                                "includeACLs" : {
                                    "title": "ACLs",
                                    "type" : "boolean",
                                    "required" : true,
                                    "default" : true
                                },
                                "includeTeams" : {
                                    "title": "Teams",
                                    "type" : "boolean",
                                    "required" : true,
                                    "default" : true
                                },
                                "includeActivities" : {
                                    "title": "Activities",
                                    "type" : "boolean",
                                    "required" : true,
                                    "default" : true
                                },
                                "includeBinaries" : {
                                    "title": "Binaries",
                                    "type" : "boolean",
                                    "required" : true,
                                    "default" : true
                                },
                                "includeAttachments" : {
                                    "title": "Attachments",
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
                Alpaca.mergeObject(schema.properties.archive, Gitana.Console.Schema.Archive);
                return schema;
            },

            options: function() {
                var self = this;
                var options = {
                    "fields" : {
                        "vault" : {
                            "type" : "select",
                            "helper" : "Select a vault for storing archive.",
                            "dataSource": function(field, callback) {
                                var firstOption;
                                self.platform().listVaults().each(
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
                        },
                        "archive" : {
                            "helper" : "Provide settings of export archive."
                        },
                        "configuration" : {
                            "helper" : "Provide export configuration.",
                            "fields" : {
                                "includeACLs" : {
                                    "type" : "checkbox",
                                    "rightLabel" : "Include ACLs?",
                                    "helper" : "Check option for including ACLs."
                                },
                                "includeTeams" : {
                                    "type" : "checkbox",
                                    "rightLabel" : "Include Teams?",
                                    "helper" : "Check option for including teams."
                                },
                                "includeActivities" : {
                                    "type" : "checkbox",
                                    "rightLabel" : "Include Activities?",
                                    "helper" : "Check option for including activities."
                                },
                                "includeBinaries" : {
                                    "type" : "checkbox",
                                    "rightLabel" : "Include Binaries?",
                                    "helper" : "Check option for including binaries."
                                },
                                "includeAttachments" : {
                                    "type" : "checkbox",
                                    "rightLabel" : "Include Attachments?",
                                    "helper" : "Check option for including attachments."
                                },
                                "startDate" : {
                                    "helper" : "Select start datetime of objects to be exported."
                                },
                                "endDate" : {
                                    "helper" : "Select end datetime of objects to be exported."
                                },
                                "schedule" : {
                                    "helper" : "Select export schedule.",
                                    "optionLabels" : ["Asynchronous","Synchronous"]
                                }
                            }
                        }
                    }
                };
                Alpaca.mergeObject(options.fields.archive, Gitana.Console.Options.Archive);
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

            setupExportForm : function (el) {

                var objectType = this.targetObject()['objectType'];

                if (Alpaca.startsWith(objectType, 'Gitana.')) {
                    objectType = objectType.substring(7);
                }

                var self = this;
                $('#export', $(el)).alpaca({
                    "data" : {
                        "archive" : {
                            "group" : objectType.toLowerCase() + "." + this.targetObject().getId(),
                            "artifact" : "export." + new Date().getTime(),
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
                            var vaultId = formVal['vault'];
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
                    }
                });
            },

            setupForms : function (el) {
                this.setupExportForm(el);
            }

        });

})(jQuery);