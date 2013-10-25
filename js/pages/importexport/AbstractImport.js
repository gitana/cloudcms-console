(function($) {
    Gitana.Console.Pages.AbstractImport = Gitana.CMS.Pages.AbstractListFormPageGadget.extend(
        {
            TEMPLATE: "layouts/console.picker.form",

            SUBSCRIPTION : "archive-candidates",

            FILTER : "archive-candidates-list-filters",

            FILTER_TOOLBAR: {
                "query" : {
                    "title" : "Query Archive",
                    "icon" : Gitana.Utils.Image.buildImageUri('browser', 'query', 48)
                }
            },

            schema: function() {
                var schema = {
                    "type" : "object",
                    "properties" : {
                        "vault" : {
                            "title": "Select a Vault",
                            "type" : "string",
                            "required" : true
                        },
                        "archive" : {
                            "title" : "Archive",
                            "type" : "object"
                        },
                        "schedule" : {
                            "title": "Schedule",
                            "type" : "string",
                            "enum": ["ASYNCHRONOUS" , "SYNCHRONOUS"],
                            "default" : "ASYNCHRONOUS",
                            "required" : true
                        },
                        "configuration" : {
                            "title" : "Configuration",
                            "type" : "object",
                            "properties" : {
                                "includeACLs" : {
                                    "title": "",
                                    "type" : "boolean",
                                    "required" : true,
                                    "default" : true
                                },
                                "includeTeams" : {
                                    "title": "",
                                    "type" : "boolean",
                                    "required" : true,
                                    "default" : true
                                },
                                "includeActivities" : {
                                    "title": "",
                                    "type" : "boolean",
                                    "required" : true,
                                    "default" : true
                                },
                                "includeBinaries" : {
                                    "title": "",
                                    "type" : "boolean",
                                    "required" : true,
                                    "default" : true
                                },
                                "includeAttachments" : {
                                    "title": "",
                                    "type" : "boolean",
                                    "required" : true,
                                    "default" : true
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
                        "vault" : {
                            "type" : "select",
                            "fieldClass" : "vault-picker",
                            "dataSource": function(field, callback) {
                                var firstOption;
                                self.platform().listVaults({
                                    "limit": Gitana.Console.LIMIT_NONE,
                                    "sort": {
                                        '_system.modified_on.ms': -1
                                    }
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
                        },
                        "archive" : {
                            "helper" : "Provide settings of import archive or select them from the following list."
                        },
                        "schedule" : {
                            "optionLabels" : ["Run in the Background", "Run Immediately and Wait"]
                        },
                        "configuration" : {
                            "helper" : "Configure how you would like the import process to run:",
                            "fields" : {
                                "includeACLs" : {
                                    "type" : "checkbox",
                                    "rightLabel" : "Import Access Control and Permissions"
                                },
                                "includeTeams" : {
                                    "type" : "checkbox",
                                    "rightLabel" : "Import Teams"
                                },
                                "includeActivities" : {
                                    "type" : "checkbox",
                                    "rightLabel" : "Import Activities"
                                },
                                "includeBinaries" : {
                                    "type" : "checkbox",
                                    "rightLabel" : "Import Data Store Binaries"
                                },
                                "includeAttachments" : {
                                    "type" : "checkbox",
                                    "rightLabel" : "Include Object Attachments"
                                }
                            }
                        }
                    }
                };
                _mergeObject(options.fields.archive, Gitana.Console.Options.Archive);
                _mergeObject(options.fields.archive, {
                    "fields" : {
                        "group" : {
                            "hideInitValidationError" : true,
                            "fieldClass" : "archive-group-id"
                        },
                        "artifact" : {
                            "hideInitValidationError" : true,
                            "fieldClass" : "archive-artifact-id"
                        },
                        "version" : {
                            "hideInitValidationError" : true,
                            "fieldClass" : "archive-version"
                        }
                    }
                });

                options.fields.archive['postRender'] = function(archiveField) {
                    $('<button class="gitana-picker-button">Select Archive...</button>').button({
                        icons: {
                            primary:'ui-icon-document'
                        }
                    }).click(function() {
                        $(".ui-dialog").remove();
                        $('div.gitana-picker').show().dialog({
                            title : "<div><img src='" + Gitana.Utils.Image.buildImageUri('objects', 'archive', 20) + "'/>Cloud CMS Archive Picker</div>",
                            resizable: true,
                            width: 900,
                            height: 600,
                            modal: true
                        }).height('auto');
                    }).appendTo(archiveField.outerEl);
                };

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

            setupToolbar: function() {
                var self = this;
                self.base();
                self.addButtons([
                ]);
            },

            setupImportForm : function (el, callback) {

                var self = this;

                var schema = this.schema();

                var options = this.options();

                $('#import', $(el)).alpaca({
                    "schema": schema,
                    "options": options,
                    "view" : {
                        "parent": "VIEW_WEB_EDIT_LAYOUT_GRID_FOUR_COLUMN",
                        "layout": {
                            "bindings": {
                                "vault": "column-1",
                                "archive": "column-1",
                                "schedule": "column-1",
                                "configuration": "column-2"
                            }
                        }
                    },
                    "postRender": function(form) {

                        Gitana.Utils.UI.beautifyAlpacaForm(form, 'import-create', true);

                        // Add Buttons
                        $('#import-create', $(el)).click(function() {

                            form.showHiddenMessages();

                            var formVal = form.getValue();
                            var vaultId = formVal['vault'];
                            var groupId = formVal['archive']['group'];
                            var artifactId = formVal['archive']['artifact'];
                            var version = formVal['archive']['version'];

                            var schedule = formVal['schedule'] == "ASYNCHRONOUS";

                            var configuration = {
                                "includeACLs" : formVal['configuration']['includeACLs'],
                                "includeTeams" : formVal['configuration']['includeTeams'],
                                "includeActivities" : formVal['configuration']['includeActivities'],
                                "includeBinaries" : formVal['configuration']['includeBinaries'],
                                "includeAttachments" : formVal['configuration']['includeAttachments']
                            };

                            /*
                            if (formVal['configuration']['overwrite'] != null) {
                                configuration['overwrite'] = formVal['configuration']['overwrite'];
                            }

                            if (formVal['configuration']['preserveIds'] != null) {
                                configuration['preserveIds'] = formVal['configuration']['preserveIds'];
                            }
                            */

                            if (form.isValid(true)) {

                                Gitana.Utils.UI.block("Importing archive...");

                                Chain(self.targetObject()).importArchive({
                                    "vault": vaultId,
                                    "group": groupId,
                                    "artifact": artifactId,
                                    "version": version,
                                    "configuration": configuration,
                                    "async" : schedule
                                }).then(function() {
                                        var link = self.LIST_LINK().call(self, 'jobs');
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

                $('body').undelegate('.vault-picker select', 'change').delegate('.vault-picker select', 'change', function() {
                    var vaultId = $(this).val();
                    Chain(self.platform()).readVault(vaultId).then(function() {
                        if (!self.vault() || self.vault().getId() != vaultId) {
                            self.vault(this);
                            self.resetFilter();
                        }
                    });
                });
            },

            setupForms : function (el, callback) {
                var self = this;
                this.setupImportForm(el, callback);
            },

            /** Filter Related Methods **/
            filterEmptyData: function(el) {
                var emptyData = Alpaca.merge(this.base(), {
                    "archive" : {
                        "groupId" : "",
                        "artifact" : "",
                        "version" : "",
                        "type" : ""
                    }
                });

                if (el.tokens["type"]) {
                    emptyData["archive"]["type"] = el.tokens["type"];
                }
                return emptyData;
            },

            filterFormToJSON: function (formData) {
                var query = this.base(formData);
                if (! Alpaca.isValEmpty(formData)) {
                    var json_query = _safeParse(formData.query);
                    if (Alpaca.isValEmpty(json_query)) {
                        if (formData['archive'] && formData['archive']['groupId']) {
                            query['groupId'] = formData['archive']['groupId'];
                        }
                        if (formData['archive'] && formData['archive']['artifactId']) {
                            query['artifactId'] = formData['archive']['artifactId'];
                        }
                        if (formData['archive'] && formData['archive']['version']) {
                            query['version'] = formData['archive']['version'];
                        }
                        if (formData['archive'] && formData['archive']['type']) {
                            query['type'] = formData['archive']['type'];
                        }
                    }
                }

                return query;
            },

            /*
            archiveDataStoreTypeLookup : {
                'repository' : 'Repository',
                'branch' : 'Branch',
                'domain' : 'Domain',
                'vault' : 'Vault',
                'application' : 'Application',
                'registrar' : 'Registrar',
                'webhost' : 'Webhost',
                'warehouse' : 'Warehouse',
                'platform' : 'Platform',
                'node' : 'Node'
            },
            */

            filterSchema: function (el) {
                var schema = _mergeObject(this.base(), {
                    "properties" : {
                        "archive" : {
                            "type" : "object",
                            "title" : "Archive",
                            "properties" : {
                                "groupId" : {
                                    "title": "Group Id",
                                    "type" : "string"
                                },
                                "artifact" : {
                                    "title": "Artifact",
                                    "type" : "string"
                                },
                                "version" : {
                                    "title": "Version",
                                    "type" : "string"
                                },
                                "type" : {
                                    "title": "Type",
                                    "type" : "string"
                                }
                            }
                        }
                    }
                });

                if (el.tokens["type"]) {
                    //schema["properties"]["archive"]["properties"]["type"]["readonly"] = true;
                }

                //var allowedDatastoreTypes = this.allowedDatastoreTypes();
                //if (!Alpaca.isValEmpty(allowedDatastoreTypes)) {
                //    schema["properties"]["archive"]["properties"]["type"]["required"] = true;
                //}

                return schema;
            },

            filterOptions: function() {

                var self = this;

                var options = _mergeObject(this.base(), {
                    "helper" : "Query archives by id, title, description, date range, archive id or full query.",
                    "fields" : {
                        "archive" : {
                            "fields" : {
                                "groupId" : {
                                    "size": this.DEFAULT_FILTER_TEXT_SIZE,
                                    "helper": "Enter regular expression for query by archive group id."
                                },
                                "artifact" : {
                                    "size": this.DEFAULT_FILTER_TEXT_SIZE,
                                    "helper": "Enter regular expression for query by archive artifact."
                                },
                                "version" : {
                                    "size": this.DEFAULT_FILTER_TEXT_SIZE,
                                    "helper": "Enter regular expression for query by archive version."
                                },
                                "type" : {
                                    "type" : "select",
                                    "helper": "Select archive type."
                                }
                            }
                        }
                    }
                });

                options["fields"]["archive"]["fields"]["type"]["dataSource"] = function(field, callback) {
                    var firstOption;
                    self.platform().readCluster().loadContainedTypes(self.containerType(), function(types) {
                        $.each(types, function(index, val) {

                            var friendlyVal = function(val) {
                                var friendlyVal = val.charAt(0).toUpperCase() + val.substring(1);
                                return friendlyVal.match(/[A-Z][a-z]+/g).join(' ');
                            }

                            field.selectOptions.push({
                                "value": val,
                                "text": friendlyVal(val)
                            });
                            if (!firstOption) {
                                firstOption = val;
                            }
                        });
                        if (callback) {
                            callback();
                            if (firstOption) {
                                field.field.val(firstOption).change();
                            }
                        }
                    });
                };

                return options;
            },

            filterView: function() {
                return _mergeObject(this.base(), {
                    "layout": {
                        "bindings": {
                            "startDate" : "column-1",
                            "endDate" : "column-1",
                            "archive" : "column-2"
                        }
                    }
                });
            },

            containerType: function() {
                return null;
            },

            /** OVERRIDE **/
            setupList: function(el) {
                var self = this;

                // define the list
                var list = self.defaultList();

                self.archiveLookup = {};

                list.hideCheckbox = true;

                list["actions"] = self.actionButtons({
                });

                list["columns"] = [
                    {
                        "title": "Group",
                        "type":"property",
                        "sortingExpression": "group",
                        "property": function(callback) {
                            var title = self.listItemProp(this, 'group');
                            self.archiveLookup[this.getId()] = JSON.stringify(this.object, null, ' ');
                            var value = "<a class='archive-details' data-archiveid='" + this.getId() + "'>" + title + "</a>";
                            callback(value);
                        }
                    },
                    {
                        "title": "Artifact",
                        "type":"property",
                        "sortingExpression": "artifact",
                        "property": function(callback) {
                            callback(self.listItemProp(this, 'artifact'));
                        }
                    },
                    {
                        "title": "Version",
                        "type":"property",
                        "sortingExpression": "version",
                        "property": function(callback) {
                            callback(self.listItemProp(this, 'version'));
                        }
                    },
                    {
                        "title": "Type",
                        "type":"property",
                        "sortingExpression": "type",
                        "property": function(callback) {
                            callback(self.listItemProp(this, 'type'));
                        }
                    },
                    {
                        "title": "Action",
                        "property": function(callback) {
                            var groupId = this.get('group');
                            var artifactId = this.get('artifact');
                            var version = this.get('version');
                            var value = "<a class='gitana-selector-select gitana-selector-action node-action node-select' data-targetgroupid='" + groupId + "' data-targetartifactid='" + artifactId + "' data-targetversion='" + version + "'><span>Select</span></a>";
                            callback(value);
                        }
                    }
                ];

                list["loadFunction"] = function(query, pagination, callback) {

                    var archiveQuery = self.query();

                    if (!archiveQuery || !archiveQuery['type']) {
                        if (el.tokens["type"]) {
                            archiveQuery["type"] = el.tokens["type"];
                        } else {
                            /*
                            var allowedDatastoreTypes = self.allowedDatastoreTypes();
                            if (!Alpaca.isValEmpty(allowedDatastoreTypes)) {
                                archiveQuery["type"] = {
                                    "$in" : allowedDatastoreTypes
                                }
                            }
                            */
                        }
                    }

                    if (self.containerType && self.containerType()) {
                        archiveQuery["_containerType"] = self.containerType();
                    }

                    if (self.vault()) {
                        Chain(self.vault()).trap(
                            function(error) {
                                return self.handlePageError(el, error);
                            }).queryArchives(archiveQuery, self.pagination(pagination)).then(function() {
                                callback.call(this);
                            });
                    } else {
                        Chain(self.platform()).trap(
                            function(error) {
                                return self.handlePageError(el, error);
                            }).listVaults({
                                "skip" : 0,
                                "limit" : 1,
                                "sort": {
                                    '_system.modified_on.ms': -1
                                }
                            }).then(function() {

                                var count = -1;
                                this.count(function(c) {
                                    count = c;
                                });

                                this.then(function() {

                                    if (count > 0) {
                                        this.keepOne().then(function() {
                                            self.vault(this);
                                            //Update the list selection?
                                            this.queryArchives(archiveQuery, self.pagination(pagination)).then(function() {
                                                callback.call(this);
                                            });
                                        });
                                    }

                                });
                            });
                    }
                };

                // store list configuration onto observer
                self.list(self.SUBSCRIPTION, list);
            },

            processList: function(el) {
                var self = this;
                $("body").undelegate(".node-select", "click").delegate(".node-select", "click", function() {
                    var control = $(this);
                    $('.ui-icon-closethick').click();
                    $('.archive-group-id input:text').val(control.attr('data-targetgroupid')).focus();
                    $('.archive-artifact-id input:text').val(control.attr('data-targetartifactid')).focus();
                    $('.archive-version input:text').val(control.attr('data-targetversion')).focus();
                });
                $("body").undelegate(".archive-details", "click").delegate(".archive-details", "click", function() {
                    var control = $(this);
                    var json = self.archiveLookup[control.attr('data-archiveid')];
                    var title = "Archive Details";
                    var dialog = "<pre style='margin: 0;'>" + json + "</pre>";

                    $(dialog).dialog({
                        title : "<img src='" + Gitana.Utils.Image.buildImageUri('objects', 'archive', 24) + "' /> " + title,
                        resizable: true,
                        width: 900,
                        height: 600,
                        modal: true,
                        buttons: {
                        }
                    });

                    $('.ui-dialog-buttonpane').css("overflow", "hidden");
                })
            }

        });

})(jQuery);