(function($) {
    Gitana.Console.AbstractGitanaConsoleGadget = Gitana.Apps.AbstractGitanaAppGadget.extend(
    {
        handleUnauthorizedPageAccess: function(el ,error) {
            var self = this;

            if (!error) {
                self.error({
                    "message" : Gitana.Console.Messages.NON_AUTHORIZED_PAGE,
                    "details" : "Url of the page you are trying to access is " + el.route.uri + "."
                });
            } else {
                self.error(error);
            }

            self.app().run('GET', '/error');
        },

        handlePageError: function(el, error) {
            error['page'] = Alpaca.cloneObject(this.page());
            error['page']['url'] = el.route.uri;
            this.error(error);

            if (error.status && error.status == '401') {
                this.app().authenticator.logout(this, function() {
                    Gitana.CMS.refresh();
                });
            } else {
                this.app().run('GET', '/error');
            }
            return false;
        },

        setupBreadcrumb: function() {
            return [
                {
                    "text" : "Platform",
                    "link" : "/"
                }
            ];
        },

        consoleAppSettings: function() {
            return this._observable("consoleAppSettings", arguments);
        },

        clearConsoleAppSettings: function() {
            this.observable("consoleAppSettings").clear();
        },

        myConsoleAppSettings: function() {
            return this._observable("myConsoleAppSettings", arguments);
        },

        clearMyConsoleAppSettings: function() {
            this.observable("myConsoleAppSettings").clear();
        },


        domain: function() {
            return this._observable("domain", arguments);
        },

        clearDomain: function() {
            this.observable("domain").clear();
        },

        vault: function() {
            return this._observable("vault", arguments);
        },

        clearVault: function() {
            this.observable("vault").clear();
        },

        archive: function() {
            return this._observable("archive", arguments);
        },

        clearArchive: function() {
            this.observable("archive").clear();
        },

        stack: function() {
            return this._observable("stack", arguments);
        },

        clearStack: function() {
            this.observable("stack").clear();
        },

        application: function() {
            return this._observable("application", arguments);
        },

        clearApplication: function() {
            this.observable("application").clear();
        },

        settings: function() {
            return this._observable("settings", arguments);
        },

        clearSettings: function() {
            this.observable("settings").clear();
        },

        emailProvider: function() {
            return this._observable("emailProvider", arguments);
        },

        clearEmailProvider: function() {
            this.observable("emailProvider").clear();
        },

        registrar: function() {
            return this._observable("registrar", arguments);
        },

        clearRegistrar: function() {
            this.observable("registrar").clear();
        },

        tenant: function() {
            return this._observable("tenant", arguments);
        },

        clearTenant: function() {
            this.observable("tenant").clear();
        },

        plan: function() {
            return this._observable("plan", arguments);
        },

        clearPlan: function() {
            this.observable("plan").clear();
        },

        client: function() {
            return this._observable("client", arguments);
        },

        clearClient: function() {
            this.observable("client").clear();
        },

        authenticationGrant: function() {
            return this._observable("authenticationGrant", arguments);
        },

        clearAuthenticationGrant: function() {
            this.observable("authenticationGrant").clear();
        },

        project: function() {
            return this._observable("project", arguments);
        },

        clearProject: function() {
            this.observable("project").clear();
        },

        warehouse: function() {
            return this._observable("warehouse", arguments);
        },

        clearWarehouse: function() {
            this.observable("warehouse").clear();
        },

        repository: function() {
            return this._observable("repository", arguments);
        },

        clearRepository: function() {
            this.observable("repository").clear();
        },

        branch: function() {
            return this._observable("branch", arguments);
        },

        clearBranch: function() {
            this.observable("branch").clear();
        },

        node: function() {
            return this._observable("node", arguments);
        },

        clearNode: function() {
            this.observable("node").clear();
        },

        rootNode: function() {
            return this._observable("rootNode", arguments);
        },

        clearRootNode: function() {
            this.observable("rootNode").clear();
        },

        definition: function() {
            return this._observable("definition", arguments);
        },

        clearDefinition: function() {
            this.observable("definition").clear();
        },

        changeset: function() {
            return this._observable("changeset", arguments);
        },

        clearChangeset: function() {
            this.observable("changeset").clear();
        },

        form: function() {
            return this._observable("form", arguments);
        },

        clearForm: function() {
            this.observable("form").clear();
        },

        selectedItems: function() {
            return this._observable("selectedItems", arguments);
        },

        clearSelectedItems: function() {
            this.observable("selectedItems").clear();
        },

        principalUser: function() {
            return this._observable("principalUser", arguments);
        },

        clearPrincipalUser: function() {
            this.observable("principalUser").clear();
        },

        group: function() {
            return this._observable("group", arguments);
        },

        clearGroup: function() {
            this.observable("group").clear();
        },

        team: function() {
            return this._observable("team", arguments);
        },

        clearTeam: function() {
            this.observable("team").clear();
        },

        filter: function() {
            return this._observable("filter", arguments);
        },

        clearFilter: function(key) {
            this._clearObservable(key, "filter");
        },

        userDetails: function() {
            return this._observable("userDetails", arguments);
        },

        clearUserDetails: function() {
            this.observable("userDetails").clear();
        },

        tenantDetails: function() {
            return this._observable("tenantDetails", arguments);
        },

        clearTenantDetails: function() {
            this.observable("tenantDetails").clear();
        },

        menu: function() {
            return this._observable("menu", arguments);
        },

        clearMenu: function() {
            this.observable("menu").clear();
        },

        stats: function() {
            return this._observable("stats", arguments);
        },

        clearStats: function() {
            this.observable("stats").clear();
        },

        toolbar: function() {
            return this._observable("toolbar", arguments, {});
        },

        clearToolbar: function(key) {
            this._clearObservable(key, "toolbar");
        },

        notifications: function() {
            return this._observable("notifications", arguments);
        },

        clearNotifications: function() {
            this.observable("notifications").clear();
        },

        alerts: function() {
            return this._observable("alerts", arguments);
        },

        clearAlerts: function() {
            this.observable("alerts").clear();
        },

        billingProvider: function() {
            return this._observable("billingProvider", arguments);
        },

        clearBillingProvider: function() {
            this.observable("billingProvider").clear();
        },

        directory: function() {
            return this._observable("directory", arguments);
        },

        clearDirectory: function() {
            this.observable("directory").clear();
        },

        identity: function() {
            return this._observable("identity", arguments);
        },

        clearIdentity: function() {
            this.observable("identity").clear();
        },

        connection: function() {
            return this._observable("connection", arguments);
        },

        clearConnection: function() {
            this.observable("connection").clear();
        },

        webhost: function() {
            return this._observable("webhost", arguments);
        },

        clearWebhost: function() {
            this.observable("webhost").clear();
        },

        autoClientMapping: function() {
            return this._observable("autoClientMapping", arguments);
        },

        clearAutoClientMapping: function() {
            this.observable("autoClientMapping").clear();
        },

        trustedDomainMapping: function() {
            return this._observable("trustedDomainMapping", arguments);
        },

        clearTrustedDomainMapping: function() {
            this.observable("trustedDomainMapping").clear();
        },

        deployedApplication: function() {
            return this._observable("deployedApplication", arguments);
        },

        clearDeployedApplication: function() {
            this.observable("deployedApplication").clear();
        },

        session: function() {
            return this._observable("session", arguments);
        },

        clearSession: function() {
            this.observable("session").clear();
        },

        interactionReport: function() {
            return this._observable("interactionReport", arguments);
        },

        clearInteractionReport: function() {
            this.observable("interactionReport").clear();
        },

        interactionPage: function() {
            return this._observable("interactionPage", arguments);
        },

        clearInteractionPage: function() {
            this.observable("interactionPage").clear();
        },

        interactionUser: function() {
            return this._observable("interactionUser", arguments);
        },

        clearInteractionUser: function() {
            this.observable("interactionUser").clear();
        },

        interactionNode: function() {
            return this._observable("interactionNode", arguments);
        },

        clearInteractionNode: function() {
            this.observable("interactionNode").clear();
        },

        interactionApplication: function() {
            return this._observable("interactionApplication", arguments);
        },

        clearInteractionApplication: function() {
            this.observable("interactionApplication").clear();
        },

        primaryDomain: function() {
            return this._observable("primaryDomain", arguments);
        },

        clearPrimaryDomain: function() {
            this.observable("primaryDomain").clear();
        },

        clipboard: function() {
            return this._observable("clipboard", arguments, []);
        },

        clearClipboard: function() {
            this.observable("clipboard").clear();
        },

        loadContext: function(el, callback) {
            var self = this;

            /*
            var loadGitanaConsole = function() {
                // load other things we know about
                var tokenCandidates = [
                    ["nodeId", "node"],
                    ["personId", "person"],
                    ["definitionId", "definition"],
                    ["formId", "form"],
                    ["changesetId", "changeset"]
                ];
                var tokens = [];
                while (tokenCandidates.length > 0) {
                    var tokenCombo = tokenCandidates.shift();

                    var thisTokenId = tokenCombo.shift();
                    var thisObservableKey = tokenCombo.shift();

                    if(el.tokens[thisTokenId] != null) {
                        tokens.push([thisTokenId,thisObservableKey]);
                    }
                }

                var loadFromTokens = function(chainable, tokens, whenDone) {
                    var observableKey = null;
                    var token = null;
                    var tokenId = null;

                    while (!token && tokens.length > 0) {
                        var tokenCombo = tokens.shift();

                        tokenId = tokenCombo.shift();
                        observableKey = tokenCombo.shift();

                        token = decodeURIComponent(el.tokens[tokenId]);
                    }

                    var tryNext = function() {
                        // load next token if we have one
                        if (tokens.length > 0) {
                            loadFromTokens(chainable, tokens, whenDone);
                        }
                        else {
                            whenDone.call();
                        }
                    };

                    var handleError = function(error) {
                        self.error(error);
                        self.app().run('GET', '/error');
                        self.branch(Chain(self.branch()));
                        return false;
                    };

                    if (token != null) {

                        if (tokenId == "definitionId") {

                            console.log('trying to read definition...' + token);

                            chainable.trap(handleError).readDefinition(token).then(function() {
                                self.observable(observableKey).set(this);

                                tryNext();

                            });

                        } else if (tokenId == "formId") {

                            console.log('trying to read form...' + token);

                            chainable.subchain(self.definition()).trap(handleError).readForm(token).then(function() {

                                this['formKey'] = token;

                                self.observable(observableKey).set(this);

                                tryNext();

                            });

                        } else if (tokenId == "changesetId") {

                            console.log('trying to read changeset...' + token);

                            chainable.subchain(self.repository()).trap(handleError).readChangeset(token).then(function() {

                                self.observable(observableKey).set(this);

                                tryNext();

                            });

                        } else {

                            chainable.trap(handleError).readNode(token).then(function() {
                                self.observable(observableKey).set(this);

                                tryNext();

                            });
                        }
                    }
                    else {
                        whenDone.call();
                    }
                };

                self.branch().then(function() {
                    loadFromTokens(this, tokens, function() {

                        if (callback) {
                            callback.call();
                        }

                    });
                });
            };
            */

            var loadDefinitionSubObjects = function(definition) {

                definition.then(function() {

                    var formKey = el.tokens["formId"];

                    if (formKey) {
                        this.readForm(formKey).then(function() {
                            this['formKey'] = formKey;
                            self.form(this);
                        });
                    }

                });
            };

            var loadBranchSubObjects = function(branch) {

                branch.then(function() {

                    if (!self.rootNode() || self.rootNode().getBranch().getId() != branch.getId()) {
                        this.readNode('r:root').then(function() {
                            self.rootNode(this);
                            if (!Gitana.Console.Breadcrumb.PATHS[this.getId()]) {
                                Gitana.Console.Breadcrumb.PATHS[this.getId()] = [
                                    {
                                        "text" : "Root Folder",
                                        "link" : self.folderLink(this)
                                    }
                                ];
                            }
                        });
                    }

                    var nodeId = el.tokens["nodeId"];

                    if (nodeId) {
                        if (!self.node() || self.node().getId() != nodeId || self.node().getBranch().getId() != branch.getId()) {
                            this.readNode(nodeId).then(function() {
                                self.node(this);
                            });
                        }
                    }

                    var definitionId = el.tokens["definitionId"];

                    if (definitionId) {
                        if (!self.definition() || self.definition().getId() != definitionId) {
                            this.readDefinition(definitionId).then(function() {
                                self.definition(this);
                                loadDefinitionSubObjects(this);
                            });
                        } else {
                            loadDefinitionSubObjects(this.subchain(self.definition()));
                        }
                    } else {
                        self.clearDefinition();
                    }

                });
            };

            var loadRepositorySubObjects = function(repository) {

                repository.then(function() {

                    var branchId = el.tokens["branchId"] ? el.tokens["branchId"] : "master";

                    //var isLoadedMaster = (branchId == "master") && self.branch() && (self.branch().getType() == "MASTER");

                    if (!self.branch() || (self.branch().getId() != branchId /*&& !isLoadedMaster*/)) {
                        this.readBranch(branchId).then(function() {
                            self.branch(this);

                            loadBranchSubObjects(this);
                        });
                    }
                    else {
                        loadBranchSubObjects(this.subchain(self.branch()));
                    }

                    var changesetId = el.tokens["changesetId"];

                    if (changesetId) {
                        //TODO : need to figure how to configure apache to avoid encoding already-encoded url
                        while (changesetId && changesetId.indexOf('%') != -1) {
                            changesetId = decodeURIComponent(changesetId);
                        }
                        if (!self.changeset() || self.changeset().getId() != changesetId) {
                            this.readChangeset(changesetId).then(function() {
                                self.changeset(this);
                            });
                        }
                    }

                    loadObjectTeam(this);

                });
            };

            var loadVaultSubObjects = function(vault) {

                vault.then(function() {

                    var archiveId = el.tokens["archiveId"];

                    if (archiveId) {
                        if (!self.archive() || self.archive().getId() != archiveId) {
                            this.readArchive(archiveId).then(function() {
                                self.archive(this);
                            });
                        }
                    }

                    loadObjectTeam(this);

                });
            };

            var loadStackSubObjects = function(stack) {

                stack.then(function() {

                    loadObjectTeam(this);

                });
            };

            var loadWarehouseSubObjects = function(warehouse) {

                warehouse.then(function() {

                    var sessionId = el.tokens["sessionId"];

                    if (sessionId) {
                        this.readInteractionSession(sessionId).then(function() {
                            self.session(this);
                        });
                    }

                    var interactionReportId = el.tokens["interactionReportId"];

                    if (interactionReportId) {
                        this.readInteractionReport(interactionReportId).then(function() {
                            self.interactionReport(this);
                        });
                    }

                    var interactionPageId = el.tokens["interactionPageId"];

                    if (interactionPageId) {
                        this.readInteractionPage(interactionPageId).then(function() {
                            self.interactionPage(this);
                        });
                    }

                    var interactionNodeId = el.tokens["interactionNodeId"];

                    if (interactionNodeId) {
                        this.readInteractionNode(interactionNodeId).then(function() {
                            self.interactionNode(this);
                        });
                    }

                    var interactionUserId = el.tokens["interactionUserId"];

                    if (interactionUserId) {
                        this.readInteractionUser(interactionUserId).then(function() {
                            self.interactionUser(this);
                        });
                    }

                    var interactionApplicationId = el.tokens["interactionApplicationId"];

                    if (interactionApplicationId) {
                        this.readInteractionApplication(interactionApplicationId).then(function() {
                            self.interactionApplication(this);
                        });
                    }

                    loadObjectTeam(this);

                });
            };

            var loadApplicationSubObjects = function(application) {

                application.then(function() {

                    var settingsId = el.tokens["settingsId"];
                    if (settingsId)
                    {
                        this.readSettings(settingsId).then(function() {
                            self.settings(this);
                        });
                    }

                    var emailProviderId = el.tokens["emailProviderId"];
                    if (emailProviderId)
                    {
                        this.readEmailProvider(emailProviderId).then(function() {
                            self.emailProvider(this);
                        });
                    }

                    loadObjectTeam(this);

                });
            };

            var loadRegistrarSubObjects = function(registrar) {

                registrar.then(function() {

                    var tenantId = el.tokens["tenantId"];

                    if (tenantId) {
                        if (!self.tenant() || self.tenant().getId() != tenantId) {
                            this.readTenant(tenantId).then(function() {
                                self.tenant(this);
                            });
                        }
                    }

                    var planId = el.tokens["planId"];

                    if (planId) {
                        if (!self.plan() || self.plan().getId() != planId) {
                            this.readPlan(planId).then(function() {
                                self.plan(this);
                            });
                        }
                    }

                });
            };

            var loadClientSubObjects = function(client) {

                client.then(function() {

                });
            };

            var loadAuthenticationGrantSubObjects = function(authenticationGrant) {

                authenticationGrant.then(function() {

                });
            };

            var loadBillingProviderSubObjects = function(billingProvider) {

                billingProvider.then(function() {

                });
            };

            var loadProjectSubObjects = function(project) {

                project.then(function() {

                });
            };

            var loadWebhostSubObjects = function(webhost) {

                webhost.then(function() {
                    var autoClientMappingId = el.tokens["autoClientMappingId"];

                    if (autoClientMappingId) {
                        if (!self.autoClientMapping() || self.autoClientMapping().getId() != autoClientMappingId) {
                            this.readAutoClientMapping(autoClientMappingId).then(function() {
                                self.autoClientMapping(this);
                            });
                        }
                    }

                    var trustedDomainMappingId = el.tokens["trustedDomainMappingId"];

                    if (trustedDomainMappingId) {
                        if (!self.trustedDomainMapping() || self.trustedDomainMapping().getId() != trustedDomainMappingId) {
                            this.readTrustedDomainMapping(trustedDomainMappingId).then(function() {
                                self.trustedDomainMapping(this);
                            });
                        }
                    }

                    var deployedApplicationId = el.tokens["deployedApplicationId"];

                    if (deployedApplicationId) {
                        if (!self.deployedApplication() || self.deployedApplication().getId() != deployedApplicationId) {
                            this.readDeployedApplication(deployedApplicationId).then(function() {
                                self.deployedApplication(this);
                            });
                        }
                    }

                });
            };

            var loadObjectTeam = function(targetObject) {
                targetObject.then(function() {
                    var teamId = el.tokens["teamId"];
                    if (teamId) {
                        if (!self.team() || self.team().getId() != teamId) {
                            this.readTeam(teamId).then(function() {
                                self.team(this);
                                var groupId = this.getGroupId();
                                this.subchain(self.platform()).readPrimaryDomain().then(function() {
                                    self.primaryDomain(this);
                                    this.readPrincipal(groupId).then(function() {
                                        self.group(this);
                                    });
                                });
                            });
                        }
                    }
                });
            };

            var loadDomainSubObjects = function(domain) {

                domain.then(function() {

                    var groupId = el.tokens["groupId"];
                    var userId = el.tokens["userId"];

                    if (groupId) {
                        if (!self.group() || self.group().getId() != groupId) {
                            this.readPrincipal(groupId).then(function() {
                                self.group(this);
                            });
                        }
                    } else {
                        self.clearGroup();
                    }

                    if (userId) {
                        if (!self.principalUser() || self.principalUser().getId() != userId) {
                            this.readPrincipal(userId).then(function() {
                                self.principalUser(this);
                            });
                        }
                    } else {
                        self.clearPrincipalUser();
                    }

                });
            };

            var loadDirectorySubObjects = function(directory) {

                directory.then(function() {

                    var identityId = el.tokens["identityId"];

                    if (identityId) {
                        if (!self.identity() || self.identity().getId() != identityId) {
                            this.readIdentity(identityId).then(function() {
                                self.identity(this);
                            });
                        }
                    }

                    loadObjectTeam(this);

                });
            };


            Chain(self.platform()).trap(function(error) {
                self.error(error);
                self.app().run('GET','/error');
                return false;
            }).then(function() {
                var platform = this;
                var domainId = el.tokens["domainId"];
                var vaultId  = el.tokens["vaultId"];
                var stackId  = el.tokens["stackId"];
                var applicationId  = el.tokens["applicationId"];
                var registrarId  = el.tokens["registrarId"];
                var clientId  = el.tokens["clientId"];
                var authenticationGrantId  = el.tokens["authenticationGrantId"];
                var projectId = el.tokens["projectId"];
                var repositoryId  = el.tokens["repositoryId"];
                var billingProviderId  = el.tokens["billingProviderId"];
                var webhostId  = el.tokens["webhostId"];
                var warehouseId  = el.tokens["warehouseId"];
                var directoryId = el.tokens["directoryId"];

                // Load user console settings
                var authInfo = platform.getDriver().getAuthInfo();
                var principalDomainId = authInfo.getPrincipalDomainId();
                var principalId = authInfo.getPrincipalId();
                var myConsoleAppSettings = {};

                // TODO : update it once we are able to read application by key.
                var currentConsoleSetting = self.consoleAppSettings();
                if (Alpaca.isValEmpty(currentConsoleSetting)) {
                    platform.queryApplications({
                        "key" : "console"
                    }).count(function(count) {
                        if (count > 0) {
                            this.keepOne().then(function() {
                                var consoleAppDefaultSettings, consoleAppUserSettings;
                                this.readApplicationSettings().then(function(){
                                    consoleAppDefaultSettings = this.getSettings();
                                });
                                this.readApplicationPrincipalSettings(principalDomainId,principalId).then(function(){
                                    self.myConsoleAppSettings(this);
                                    consoleAppUserSettings = this.getSettings();
                                });
                                this.then(function() {
                                    _mergeObject(myConsoleAppSettings,Gitana.Console.Settings.Default);
                                    _mergeObject(myConsoleAppSettings,consoleAppDefaultSettings);
                                    _mergeObject(myConsoleAppSettings,consoleAppUserSettings);
                                    self.consoleAppSettings(myConsoleAppSettings);
                                })
                            });
                        }
                    });
                }

                if (domainId) {
                    if (!self.domain() || self.domain().getId() != domainId) {
                        platform.readDomain(domainId).then(function() {
                            self.domain(this);
                            loadDomainSubObjects(this);
                        });
                    } else {
                        loadDomainSubObjects(this.subchain(self.domain()));
                    }
                }

                if (vaultId) {
                    if (!self.vault() || self.vault().getId() != vaultId) {
                        platform.readVault(vaultId).then(function() {
                            self.vault(this);
                            loadVaultSubObjects(this);
                        });
                    } else {
                        loadVaultSubObjects(this.subchain(self.vault()));
                    }
                }

                if (stackId) {
                    if (!self.stack() || self.stack().getId() != stackId) {
                        platform.readStack(stackId).then(function() {
                            self.stack(this);
                            loadStackSubObjects(this);
                        });
                    } else {
                        loadStackSubObjects(this.subchain(self.stack()));
                    }
                }

                if (warehouseId) {
                    if (!self.warehouse() || self.warehouse().getId() != warehouseId) {
                        platform.readWarehouse(warehouseId).then(function() {
                            self.warehouse(this);
                            loadWarehouseSubObjects(this);
                        });
                    } else {
                        loadWarehouseSubObjects(this.subchain(self.warehouse()));
                    }
                }

                if (applicationId) {
                    if (!self.application() || self.application().getId() != applicationId) {
                        platform.readApplication(applicationId).then(function() {
                            self.application(this);
                            loadApplicationSubObjects(this);
                        });
                    } else {
                        loadApplicationSubObjects(this.subchain(self.application()));
                    }
                }

                if (registrarId) {
                    if (!self.registrar() || self.registrar().getId() != registrarId) {
                        platform.readRegistrar(registrarId).then(function() {
                            self.registrar(this);
                            loadRegistrarSubObjects(this);
                        });
                    } else {
                        loadRegistrarSubObjects(this.subchain(self.registrar()));
                    }
                }

                if (clientId) {
                    if (!self.client() || self.client().getId() != clientId) {
                        platform.readClient(clientId).then(function() {
                            self.client(this);
                            loadClientSubObjects(this);
                        });
                    } else {
                        loadClientSubObjects(this.subchain(self.client()));
                    }
                }

                if (authenticationGrantId) {
                    if (!self.authenticationGrant() || self.authenticationGrant().getId() != authenticationGrantId) {
                        platform.readAuthenticationGrant(authenticationGrantId).then(function() {
                            self.authenticationGrant(this);
                            loadAuthenticationGrantSubObjects(this);
                        });
                    } else {
                        loadAuthenticationGrantSubObjects(this.subchain(self.authenticationGrant()));
                    }
                }

                if (projectId) {
                    if (!self.project() || self.project().getId() != projectId) {
                        platform.readProject(projectId).then(function() {
                            self.project(this);
                            loadProjectSubObjects(this);
                        });
                    } else {
                        loadProjectSubObjects(this.subchain(self.project()));
                    }
                }

                if (billingProviderId) {
                    if (!self.billingProvider() || self.billingProvider().getId() != billingProviderId) {
                        platform.readBillingProviderConfiguration(billingProviderId).then(function() {
                            self.billingProvider(this);
                            loadBillingProviderSubObjects(this);
                        });
                    } else {
                        loadBillingProviderSubObjects(this.subchain(self.billingProvider()));
                    }
                }

                if (webhostId) {
                    if (!self.webhost() || self.webhost().getId() != webhostId) {
                        platform.readWebHost(webhostId).then(function() {
                            self.webhost(this);
                            loadWebhostSubObjects(this);
                        });
                    } else {
                        loadWebhostSubObjects(this.subchain(self.webhost()));
                    }
                }

                if (repositoryId) {
                    if (!self.repository() || self.repository().getId() != repositoryId) {
                        platform.readRepository(repositoryId).then(function() {
                            self.repository(this);
                            loadRepositorySubObjects(this);
                        });
                    } else {
                        loadRepositorySubObjects(this.subchain(self.repository()));
                    }
                }

                if (directoryId) {
                    if (!self.directory() || self.directory().getId() != directoryId) {
                        platform.readDirectory(directoryId).then(function() {
                            self.directory(this);
                            loadDirectorySubObjects(this);
                        });
                    } else {
                        loadDirectorySubObjects(this.subchain(self.directory()));
                    }
                }

                // For platform team
                if (el.tokens["teamId"] && self.team() == null) {
                    loadObjectTeam(platform);
                }

                this.then(function() {
                    if (callback) {
                        callback.call();
                    }
                })
            });

        },

        _isEntitled: function(requiredRoles, callback) {
            var self = this;
            var role = self.role();
            // Check user role
            if (requiredRoles && requiredRoles.length > 0) {
                var isEntitled = false;
                $.each(requiredRoles, function(i, v) {
                    if (role[v]) {
                        isEntitled = true;
                    }
                });
                if (! isEntitled) {
                    if (callback) {
                        callback();
                    }
                    return false;
                }
            }
            return true;
        },

        /**
         *
         * @param node
         * @param mode
         * @param target
         */
        link: function(node, mode, target) {

            var link = "";

            if (node && node.objectType()) {

                var objectType = node.objectType();

                switch (objectType) {

                    case 'Gitana.Platform':

                        link += "/";

                        break;

                    case 'Gitana.Domain':

                        link += this.listLink('domains');

                        break;

                    case 'Gitana.Vault':

                        link += this.listLink('vaults');

                        break;

                    case 'Gitana.Archive':

                        link += this.listLink('archives');

                        break;

                    case 'Gitana.Stack':

                        link += this.listLink('stacks');

                        break;

                    case 'Gitana.Warehouse':

                        link += this.listLink('warehouses');

                        break;

                    case 'Gitana.Application':

                        link += this.listLink('applications');

                        break;

                    case 'Gitana.Settings':

                        link += this.listLink('settings');

                        break;

                    case 'Gitana.EmailProvider':

                        link += this.listLink('emailproviders');

                        break;

                    case 'Gitana.InteractionSession':

                        link += this.listLink('sessions');

                        break;

                    case 'Gitana.InteractionReport':

                        link += this.listLink('interaction-reports');

                        break;

                    case 'Gitana.InteractionPage':

                        link += this.listLink('interaction-pages');

                        break;

                    case 'Gitana.InteractionUser':

                        link += this.listLink('interaction-users');

                        break;

                    case 'Gitana.InteractionNode':

                        link += this.listLink('interaction-nodes');

                        break;

                    case 'Gitana.InteractionApplication':

                        link += this.listLink('interaction-applications');

                        break;

                    case 'Gitana.Registrar':

                        link += this.listLink('registrars');

                        break;

                    case 'Gitana.Client':

                        link += this.listLink('clients');

                        break;

                    case 'Gitana.AuthenticationGrant':

                        link += this.listLink('authenticationGrants');

                        break;

                    case 'Gitana.Project':

                        link += this.listLink('projects');

                        break;

                    case 'Gitana.Tenant':

                        link += this.listLink('tenants');

                        break;

                    case 'Gitana.Plan':

                        link += this.listLink('plans');

                        break;

                    case 'Gitana.Job':

                        link += this.listLink('jobs');

                        break;

                    case 'Gitana.Repository':

                        link += this.listLink('repositories');

                        break;

                    case 'Gitana.Branch':

                        link += this.listLink('branches');

                        break;

                    case 'Gitana.DomainPrincipal':

                        if (node.getType() == 'USER') {
                            link += this.listLink('domains') + node.getDomainId() + "/users/";
                        } else {
                            link += this.listLink('domains') + node.getDomainId() + "/groups/";
                        }

                        break;

                    case 'Gitana.Node':

                        //if (node.getTypeQName() == 'n:tag') {
                        //    link += this.listLink('tags');
                        //} else {
                            link += this.listLink('nodes');
                        //}
                        break;

                    /*
                    case 'Gitana.Association':

                        link += this.listLink('nodes');

                        break;
                    */
                    case 'Gitana.Person':

                        link += this.listLink('nodes');

                        break;

                    case 'Gitana.Definition':

                        link += this.listLink('definitions');

                        break;

                    case 'Gitana.Form':

                        link += this.listLink('forms');

                        break;

                    case 'Gitana.Changeset':

                        link += this.listLink('changesets');

                        break;

                    case 'Gitana.BillingProviderConfiguration':

                        link += this.listLink('billing-providers');

                        break;

                    case 'Gitana.WebHost':

                        link += this.listLink('webhosts');

                        break;

                    case 'Gitana.AutoClientMapping':

                        link += this.listLink('auto-client-mappings');

                        break;

                    case 'Gitana.TrustedDomainMapping':

                        link += this.listLink('trusted-domain-mappings');

                        break;

                    case 'Gitana.DeployedApplication':

                        link += this.listLink('deployed-applications');

                        break;

                    case 'Gitana.Directory':

                        link += this.listLink('directories');

                        break;

                    case 'Gitana.Identity':

                        link += this.listLink('identities');

                        break;

                    case 'Gitana.Connection':

                        link += this.listLink('connections');

                        break;

                    default:

                        if (node.isAssociation && node.isAssociation()) {
                            link += this.listLink('nodes');
                        }
                        break;
                }

                if (objectType == 'Gitana.Form') {

                    link += node['formKey']; //encodeURIComponent(node.getQName());

                } else if (objectType == 'Gitana.Team') {

                    link += node['teamKey'];

                } else if (objectType == 'Gitana.Platform') {


                } else {

                    link += node.getId();
                }
            }

            if (mode) {

                link += link != "/" ? "/" : "";

                switch (mode) {
                    case 'edit':
                        link += "edit";
                        break;
                    case 'add':
                        link += "add";
                        break;
                    default:
                        link += mode;
                        break;
                }
                if (target) {
                    link += "/" + target;
                }
            }
            return link;
        },

        /**
         *
         * @param node
         * @param mode
         * @param target
         */
        datastoreLink : function(node, mode, target) {

            var link = "";

            if (node && node.objectType) {

                var objectType = node.objectType();

                switch (objectType) {

                    case 'Gitana.Directory':

                        link += this.listLink('directories');

                        break;

                    case 'Gitana.Domain':

                        link += this.listLink('domains');

                        break;

                    case 'Gitana.Vault':

                        link += this.listLink('vaults');

                        break;

                    case 'Gitana.Application':

                        link += this.listLink('applications');

                        break;

                    case 'Gitana.Registrar':

                        link += this.listLink('registrars');

                        break;

                    case 'Gitana.Repository':

                        link += this.listLink('repositories');

                        break;

                    case 'Gitana.Warehouse':

                        link += this.listLink('warehouses');

                        break;

                    case 'Gitana.WebHost':

                        link += this.listLink('webhosts');

                        break;
                }

                link += node.get('datastoreId');

            }

            if (mode) {

                link += link != "/" ? "/" : "";

                switch (mode) {
                    case 'edit':
                        link += "edit";
                        break;
                    case 'add':
                        link += "add";
                        break;
                    default:
                        link += mode;
                        break;
                }
                if (target) {
                    link += "/" + target;
                }
            }
            return link;
        },

        /**
         *
         * @param node
         * @param mode
         * @param target
         */
        tagLink : function(node, mode, target) {

            var link = "";

            if (node && node.objectType) {

                var objectType = node.objectType();

                switch (objectType) {

                    case 'Gitana.Branch':

                        link += this.listLink('branches');

                        break;

                    case 'Gitana.Node':

                        if (node.getTypeQName() == 'n:tag') {
                            link += this.listLink('tags');
                        } else {
                            link += this.listLink('nodes');
                        }
                        break;
                }

                link += node.getId();
            }

            if (mode) {
                switch (mode) {
                    case 'edit':
                        link += "/edit";
                        break;
                    case 'add':
                        link += "/add";
                        break;
                    default:
                        link += "/" + mode;
                        break;
                }
                if (target) {
                    link += "/" + target;
                }
            }
            return link;
        },

        /**
         *
         * @param type
         */
        listLink: function (type) {
            var link = "/";

            if (type) {

                switch (type) {

                    case 'dashboard':

                        link += "dashboard/";

                        break;

                    case 'my-activities':

                        link += "dashboard/activities";

                        break;

                    case 'my-repositories':

                        link += "dashboard/repositories";

                        break;

                    case 'my-groups':

                        link += "dashboard/groups";

                        break;

                    case 'my-tenants':

                        link += "dashboard/tenants/";

                        break;

                    case 'platform-teams':

                        link += "teams/";

                        break;

                    case 'domains':

                        link += "domains/";

                        break;

                    case 'vaults':

                        link += "vaults/";

                        break;

                    case 'vault-teams':

                        link += "vaults/"+ this.vault().getId() + "/teams/";

                        break;

                    case 'stacks':

                        link += "stacks/";

                        break;

                    case 'stack-teams':

                        link += "stacks/"+ this.stack().getId() + "/teams/";

                        break;

                    case 'warehouses':

                        link += "warehouses/";

                        break;

                    case 'warehouse-teams':

                        link += "warehouses/"+ this.warehouse().getId() + "/teams/";

                        break;

                    case 'applications':

                        link += "applications/";

                        break;

                    case 'application-teams':

                        link += "applications/"+ this.application().getId() + "/teams/";

                        break;

                    case 'settings':

                        link += "applications/"+ this.application().getId() + "/settings/";

                        break;

                    case 'emailproviders':

                        link += "applications/"+ this.application().getId() + "/emailproviders/";

                        break;

                    case 'sessions':

                        link += "warehouses/"+ this.warehouse().getId() + "/sessions/";

                        break;

                    case 'interaction-reports':

                        link += "warehouses/"+ this.warehouse().getId() + "/reports/";

                        break;

                    case 'interaction-pages':

                        link += "warehouses/"+ this.warehouse().getId() + "/pages/";

                        break;

                    case 'interaction-nodes':

                        link += "warehouses/"+ this.warehouse().getId() + "/nodes/";

                        break;

                    case 'interaction-users':

                        link += "warehouses/"+ this.warehouse().getId() + "/users/";

                        break;

                    case 'interaction-applications':

                        link += "warehouses/"+ this.warehouse().getId() + "/applications/";

                        break;

                    case 'archives':

                        link += "vaults/"+ this.vault().getId() + "/archives/";

                        break;

                    case 'registrars':

                        link += "registrars/";

                        break;

                    case 'tenants':

                        link += "registrars/" + this.registrar().getId() + "/tenants/";

                        break;

                    case 'plans':

                        link += "registrars/" + this.registrar().getId() + "/plans/";

                        break;

                    case 'clients':

                        link += "clients/";

                        break;

                    case 'projects':

                        link += "projects/";

                        break;

                    case 'authenticationGrants':

                        link += "authenticationgrants/";

                        break;

                    case 'directories':

                        link += "directories/";

                        break;

                    case 'repositories':

                        link += "repositories/";

                        break;

                    case 'repository-teams':

                        link += "repositories/" + this.repository().getId() + "/teams/";

                        break;

                    case 'branches':

                        link += "repositories/" + this.repository().getId() + "/branches/";

                        break;

                    case 'users':

                        link += "domains/" + this.domain().getId() + "/users/";

                        break;

                    case 'groups':

                        link += "domains/" + this.domain().getId() + "/groups/";

                        break;

                    case 'jobs':

                        link += "jobs/";

                        break;

                    case 'nodes':

                        link += "repositories/" + this.repository().getId() + "/branches/" + this.branch().getId() + "/nodes/";

                        break;

                    case 'tags':

                        link += "repositories/" + this.repository().getId() + "/branches/" + this.branch().getId() + "/tags/";

                        break;

                    case 'folders':

                        link += "repositories/" + this.repository().getId() + "/branches/" + this.branch().getId() + "/folders/";

                        break;

                    case 'children':

                        link += "repositories/" + this.repository().getId() + "/branches/" + this.branch().getId() + "/children/";

                        break;

                    case 'definitions':

                        link += "repositories/" + this.repository().getId() + "/branches/" + this.branch().getId() + "/definitions/";

                        break;

                    case 'persons':

                        link += "repositories/" + this.repository().getId() + "/branches/" + this.branch().getId() + "/persons/";

                        break;

                    case 'attachments':

                        link += "repositories/" + this.repository().getId() + "/branches/" + this.branch().getId() + "/nodes/" + this.node().getId() + "/attachments/";

                        break;

                    case 'node-features':

                        link += "repositories/" + this.repository().getId() + "/branches/" + this.branch().getId() + "/nodes/" + this.node().getId() + "/features/";

                        break;

                    case 'associations':

                        link += "repositories/" + this.repository().getId() + "/branches/" + this.branch().getId() + "/nodes/" + this.node().getId() + "/associations/";

                        break;

                    case 'translations':

                        link += "repositories/" + this.repository().getId() + "/branches/" + this.branch().getId() + "/nodes/" + this.node().getId() + "/translations/";

                        break;

                    case 'forms':

                        link += "repositories/" + this.repository().getId() + "/branches/" + this.branch().getId() + "/definitions/" + this.definition().getId() + "/forms/";

                        break;

                    case 'features':

                        link += "repositories/" + this.repository().getId() + "/branches/" + this.branch().getId() + "/definitions/" + this.definition().getId() + "/features/";

                        break;

                    case 'child-features':

                        link += "repositories/" + this.repository().getId() + "/branches/" + this.branch().getId() + "/children/" + this.node().getId() + "/features/";

                        break;

                    case 'folder-features':

                        link += "repositories/" + this.repository().getId() + "/branches/" + this.branch().getId() + "/folders/" + this.node().getId() + "/features/";

                        break;

                    case 'changesets':

                        link += "repositories/" + this.repository().getId() + "/changesets/";

                        break;

                    case 'billing-providers':

                        link += "billingproviders/";

                        break;

                    case 'webhosts':

                        link += "webhosts/";

                        break;

                    case 'auto-client-mappings':

                        link += "webhosts/"+ this.webhost().getId() + "/autoclientmappings/";

                        break;

                    case 'trusted-domain-mappings':

                        link += "webhosts/"+ this.webhost().getId() + "/trusteddomainmappings/";

                        break;

                    case 'deployed-applications':

                        link += "webhosts/"+ this.webhost().getId() + "/deployedapplications/";

                        break;

                    case 'activities':

                        link += "activities/";

                        break;

                    case 'identities':

                        link += "directories/" + this.directory().getId() + "/identities/";

                        break;

                    case 'connections':

                        link += "directories/" + this.directory().getId() + "/connections/";

                        break;
                }
            }
            return link;
        },

        teamLink : function(team, context, mode, target) {

            var link = "";

            if (context && context.objectType)
            {
                switch (context && context.objectType()) {

                    /*
                    case 'Gitana.Tenant':

                        link += this.listLink('platform-teams');

                        break;

                    case 'Gitana.Platform':

                        link += this.listLink('platform-teams');

                        break;
                    */

                    case 'Gitana.Repository':

                        link += this.listLink('repository-teams');

                        break;

                    case 'Gitana.Vault':

                        link += this.listLink('vault-teams');

                        break;

                    case 'Gitana.Stack':

                        link += this.listLink('stack-teams');

                        break;

                    case 'Gitana.Warehouse':

                        link += this.listLink('warehouse-teams');

                        break;

                    case 'Gitana.Application':

                        link += this.listLink('application-teams');

                        break;
                }
            }

            if (link.length == 0)
            {
                link += "/teams/"
            }

            if (team && team['teamKey']) {
                link += team['teamKey'];
            }

            if (mode) {
                switch (mode) {
                    case 'edit':
                        link += "/edit";
                        break;
                    case 'add':
                        link += "/add";
                        break;
                    default:
                        link += "/" + mode;
                        break;
                }
                if (target) {
                    link += "/" + target;
                }
            }
            return link;
        },

        folderLink : function(node, mode, target) {

            if (!node) {
                return "";
            }

            if (node && node.objectType && (node.objectType() != "Gitana.Node" && /*node.objectType != "Gitana.Association")*/ !(node.isAssociation && node.isAssociation()))) {
                return this.link(node, mode, target);
            }

            var link = node.isContainer() ? this.LIST_LINK().call(this,'folders') : this.LIST_LINK().call(this,'children');

            if (node && node.objectType) {

                link += node.getId();
            }

            if (mode) {
                switch (mode) {
                    case 'edit':
                        link += "/edit";
                        break;
                    case 'add':
                        link += "/add";
                        break;
                    default:
                        link += "/" + mode;
                        break;
                }
                if (target) {
                    link += "/" + target;
                }
            }
            return link;
        },

        platformLink : function(object, mode, target) {

            var link = "";

            if (mode) {
                switch (mode) {
                    case 'edit':
                        link += "/edit";
                        break;
                    case 'add':
                        link += "/add";
                        break;
                    default:
                        link += "/" + mode;
                        break;
                }
                if (target) {
                    link += "/" + target;
                }
            }
            return link;
        },

        setupToolbar: function() {
            this.clearToolbar();
        },

        consoleSetting: function(key) {
            /*
            var value = Gitana.Console.Settings[key]["default"];
            var userDetails = this.userDetails();
            if (userDetails && userDetails['_settings'] && userDetails['_settings'][key]) {
                value = userDetails['_settings'][key];
            }
            return value;
            */
            var myConsoleSettings = this.consoleAppSettings();
            return myConsoleSettings[key];
        },

        /**
         *
         * @param object
         * @param callback
         */
        onQuickEditJSON: function(object, callback) {
            var _this = this;

            var title = object.getTitle();
            var html = "<textarea id='text' rows='25' cols='60' style='width:850px;margin:5px;'>" + object.stringify(true) + "</textarea>";

            var dialog = $("<div></div>");
            dialog.css("font-family", "Courier New");
            dialog.css("background-color", "white");
            dialog.html(html);

            _this.uniform(dialog);

            $(dialog).dialog({
                title : "<img src='" + Gitana.Utils.Image.buildImageUri('objects', 'json-edit', 24) + "' /> "+title,
                resizable: true,
                width: 900,
                height: 600,
                modal: true,
                buttons: {
                    "Save": function() {

                        _this.block("Updating JSON...");

                        var json = $(this).find("[id=text]")[0].value;
                        var obj = JSON.parse(json);

                        // update our selected object with the new json
                        object.replacePropertiesWith(obj);

                        // update
                        object.update().then(function () {
                            if (callback) {
                                callback();
                            }
                        });

                        // we also have to close the dialog
                        $(this).dialog("close");
                    }
                }
            });
            $('.ui-dialog').css("overflow", "hidden");
            $('.ui-dialog-buttonpane').css("overflow", "hidden");
        },

        onClickDelete: function(object , objectType, link , img, observableName, titleFunction) {
            var self = this;

            var friendlyTitle = titleFunction ? titleFunction : self.friendlyTitle;

            var objectList = "<ul>";

            objectList += "<li>" + friendlyTitle(object) + "</li>";

            objectList += "</ul>";

            var dialog = $('<div><h2 class="dialog-delete-message-2">Are you sure you want to remove the following ' + objectType +'?' + objectList + '</h2></div>');

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
                        height: 300,
                        width: 650,
                        modal: true,
                        buttons: {
                            "Remove": function() {
                                if (control.isValid(true)) {

                                    Gitana.Utils.UI.block("Deleting " + objectType + "...");

                                    Chain(object).del().then(function() {

                                        if (observableName && self.observable(observableName).get()) {
                                            self.observable(observableName).clear();
                                        }

                                        if (link) {
                                            self.refresh(link);
                                        } else {
                                            self.refresh();
                                        }
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


        onClickDeleteMultiple: function(parentObject, objects , objectType, link, img , observableName, titleFunction) {
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
                        height: 300,
                        width: 650,
                        modal: true,
                        buttons: {
                            "Remove": function() {
                                if (control.isValid(true)) {

                                    Gitana.Utils.UI.block("Deleting " + objectType + "(s) ...");

                                    parentObject.then(function() {

                                        var _this = this;

                                        $.each(objects, function(key,obj) {
                                            var objId = obj.getId();
                                            _this.subchain(obj)
                                                .trap(function(err) {

                                                    // error handler if problem deleting an item

                                                    self.error(err);
                                                    self.app().run('GET', '/error');
                                                    return false;

                                                })
                                                .del().then(function() {
                                                if (observableName) {
                                                    var targetObservable = self.observable(observableName).get();
                                                    if (targetObservable && targetObservable.getId() == objId) {
                                                        self.observable(observableName).clear();
                                                    }
                                                }
                                           });
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

        onClickCopy: function(object, objectLink, objectIcon) {
            var clipboard = this.clipboard();
            if (clipboard.length >= this.consoleSetting('NUMBER_OF_CLIPBOARD_ENTRIES')) {
                clipboard.shift();
            }
            clipboard.push({
                "object" : object,
                "icon" : objectIcon,
                "url" : objectLink
            });
            $('.clipboard-icon').click();
        },

        friendlyTitle: function(persistable) {

            /**
             * TODO: we no longer have the getDefaultDomainId() method
             * We now have to do a chained method for readPrimaryDomain()...
             *
             * Commenting this out for now
             */

            if (persistable.objectType && persistable.objectType() == 'Gitana.Domain' && Alpaca.isValEmpty(persistable.getTitle()) && persistable.get('primary')) {
                return "Primary Domain";
            }

            if (persistable.objectType && persistable.objectType() == 'Gitana.Vault' && Alpaca.isValEmpty(persistable.getTitle()) && persistable.get('primary')) {
                return "Primary Vault";
            }

            return this.base(persistable);
        },

        LINK : function() {
            return this.link;
        },

        LIST_LINK : function() {
            return this.listLink;
        },

        page: function() {
            if (arguments.length > 0) {
                var history = this.history();
                if (history.length >= this.consoleSetting('NUMBER_OF_HISTORY_ENTRIES')) {
                    history.shift();
                }
                var newPage = this._observable("page", arguments);
                history.push(newPage);
                return newPage;
            } else {
                return this._observable("page", arguments);
            }
        },

        clearPage: function() {
            this.observable("page").clear();
        },

        history: function() {
            return this._observable("history", arguments, []);
        },

        clearHistory: function() {
            this.observable("history").clear();
        },

        pageHistory: function(el) {
            return {
                "url" : el.route.uri,
                "timestamp" : new Date(),
                "breadcrumb" : this.breadcrumb()
            }
        },

        setupPage: function(el) {
            return this.pageHistory(el);
        },

        setupPaste : function () {
            var self = this;
            var target = self.targetObject();
            $('body').undelegate('.clipboard li', 'click').delegate('.clipboard li', 'click', function() {
                var source = self.clipboard()[$(this).attr('data-index')].object;
                if (source != null) {
                    $('.ui-icon-closethick').click();
                    var target = self.targetObject();
                    Gitana.Utils.UI.block("Pasting...");
                    Chain(source).copy(target).then(function() {
                        Gitana.Utils.UI.unblock();
                    });
                }
            });
            $('.clipboard li').tipsy({
                fade: true,
                html: true,
                live: false,
                fallback : 'Click to paste this item to folder ' + self.friendlyTitle(target) + '.'
            });
        },

        populateObject : function(keys,item) {
            var object = {};
            if (keys) {
                $.each(keys, function(i,v) {
                    if (item.get(v) != null) {
                        object[v] = item.get(v);
                    }
                });
            }
            return object;
        },

        populateObjectAll : function(item) {
            var object = {};
            for (var key in item) {
                if (item.hasOwnProperty(key) && !Gitana.isFunction(item[key])) {
                    var value = item[key];
                    object[key] = value;
                }
            }
            return object;
        }
    });

})(jQuery);