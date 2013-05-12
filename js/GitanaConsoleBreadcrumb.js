(function($) {

    Gitana.Console.Breadcrumb = {


        "PATHS" : {

        },

        "findPath": function (child, self, callback) {
            child.listRelatives({
                "type" : "a:child",
                "direction" : "INCOMING"
            }, {
                "skip" : 0,
                "limit" : 1
            }).count(function(count) {

                if (count == 1) {

                    this.keepOne().then(function() {

                        var parentNode = this;

                        if (Gitana.Console.Breadcrumb.PATHS[parentNode.getId()]) {
                            var childPath = $.merge([], Gitana.Console.Breadcrumb.PATHS[parentNode.getId()]);
                            childPath.push({
                                "text" : self.friendlyTitle(child),
                                "link" : self.folderLink(child)
                            });
                            Gitana.Console.Breadcrumb.PATHS[child.getId()] = childPath;
                        } else {
                            Gitana.Console.Breadcrumb.findPath(parentNode, self, function() {
                                if (Gitana.Console.Breadcrumb.PATHS[parentNode.getId()]) {
                                    var childPath = $.merge([], Gitana.Console.Breadcrumb.PATHS[parentNode.getId()]);
                                    childPath.push({
                                        "text" : self.friendlyTitle(child),
                                        "link" : self.folderLink(child)
                                    });
                                    Gitana.Console.Breadcrumb.PATHS[child.getId()] = childPath;
                                }
                            });
                        }
                    });
                }

                this.then(function() {
                    if (callback) {
                        callback();
                    }
                });
            });
        },

        "Error" : function(self, el) {
            return [
                {
                    "text" : "Error",
                    "link" : "/error"
                }
            ];
        },

        "MyProfile" : function(self, el) {
            return [
                {
                    "text" : "My Profile",
                    "link" : "/profile"
                }
            ];
        },

        "Platform" : function(self, el) {
            return [
                {
                    "text" : "Platform",
                    "link" : self.link(self.platform()),
                    "requiredAuthorities" : [
                        {
                            "permissioned" : self.platform(),
                            "permissions" : ["update"]
                        }
                    ]
                }
            ];
        },

        "PlatformTeams" : function(self, el) {
            return $.merge(this.Platform(self, el), [
                {
                    "text" : "Teams",
                    "link" : self.LINK().call(self, self.platform(), "teams")
                }
            ]);
        },

        "PlatformTeam" : function(self , el) {
            return $.merge(this.PlatformTeams(self, el), [
                {
                    "text" : self.friendlyTitle(self.team()),
                    "link" : self.teamLink(self.team(),self.platform())
                }
            ]);
        },

        "PlatformLogs" : function(self, el) {
            return $.merge(this.Platform(self, el), [
                {
                    "text" : "Logs",
                    "link" : self.link(self.platform()) + "logs"
                }
            ]);
        },

        "PlatformJobs" : function(self, el) {
            return $.merge(this.Platform(self, el), [
                {
                    "text" : "Jobs",
                    "link" : self.listLink("jobs")
                }
            ]);
        },

        "Domains" : function(self , el) {
            return $.merge(this.Platform(self, el), [
                {
                    "text" : "Domains",
                    "link" : self.LIST_LINK().call(self,'domains')
                }
            ]);
        },

        "Domain" : function(self , el) {
            return $.merge(this.Domains(self, el), [
                {
                    "text" : self.friendlyTitle(self.domain()),
                    "link" : self.LINK().call(self,self.domain())
                }
            ]);
        },

        "Vaults" : function(self , el) {
            return $.merge(this.Platform(self, el), [
                {
                    "text" : "Vaults",
                    "link" : self.LIST_LINK().call(self,'vaults')
                }
            ]);
        },

        "Vault" : function(self , el) {
            return $.merge(this.Vaults(self, el), [
                {
                    "text" : self.friendlyTitle(self.vault()),
                    "link" : self.LINK().call(self,self.vault())
                }
            ]);
        },

        "VaultTeams" : function(self, el) {
            return $.merge(this.Vault(self, el), [
                {
                    "text" : "Teams",
                    "link" : self.LINK().call(self, self.vault(), "teams")
                }
            ]);
        },

        "VaultTeam" : function(self , el) {
            return $.merge(this.VaultTeams(self, el), [
                {
                    "text" : self.friendlyTitle(self.team()),
                    "link" : self.teamLink(self.team(),self.vault())
                }
            ]);
        },

        "Archives" : function(self , el) {
            return $.merge(this.Vault(self, el), [
                {
                    "text" : "Archives",
                    "link" : self.LIST_LINK().call(self,'archives')
                }
            ]);
        },

        "Archive" : function(self , el) {
            return $.merge(this.Archives(self, el), [
                {
                    "text" : self.friendlyTitle(self.archive()),
                    "link" : self.LINK().call(self,self.archive())
                }
            ]);
        },

        "Stacks" : function(self , el) {
            return $.merge(this.Platform(self, el), [
                {
                    "text" : "Stacks",
                    "link" : self.LIST_LINK().call(self,'stacks')
                }
            ]);
        },

        "Stack" : function(self , el) {
            return $.merge(this.Stacks(self, el), [
                {
                    "text" : self.friendlyTitle(self.stack()),
                    "link" : self.LINK().call(self,self.stack())
                }
            ]);
        },

        "StackAttachments" : function(self, el) {
            return $.merge(this.Stack(self, el), [
                {
                    "text" : "Attachments",
                    "link" : self.LINK().call(self, self.stack(), "attachments")
                }
            ]);
        },

        "StackLogs" : function(self , el) {
            return $.merge(this.Stack(self, el), [
                {
                    "text" : "Logs",
                    "link" : self.LINK().call(self, self.stack(),"logs")
                }
            ]);
        },

        "StackTeams" : function(self, el) {
            return $.merge(this.Stack(self, el), [
                {
                    "text" : "Teams",
                    "link" : self.LINK().call(self, self.stack(), "teams")
                }
            ]);
        },

        "StackTeam" : function(self , el) {
            return $.merge(this.StackTeams(self, el), [
                {
                    "text" : self.friendlyTitle(self.team()),
                    "link" : self.teamLink(self.team(),self.stack())
                }
            ]);
        },

        "Applications" : function(self , el) {
            return $.merge(this.Platform(self, el), [
                {
                    "text" : "Applications",
                    "link" : self.LIST_LINK().call(self,'applications')
                }
            ]);
        },

        "Application" : function(self , el) {
            return $.merge(this.Applications(self, el), [
                {
                    "text" : self.friendlyTitle(self.application()),
                    "link" : self.LINK().call(self,self.application())
                }
            ]);
        },

        "Settings" : function(self , el) {
            return $.merge(this.Application(self, el), [
                {
                    "text" : "Settings List",
                    "link" : self.LIST_LINK().call(self,'settings')
                }
            ]);
        },

        "Setting" : function(self , el) {
            return $.merge(this.Settings(self, el), [
                {
                    "text" : self.friendlyTitle(self.settings()),
                    "link" : self.LINK().call(self,self.settings())
                }
            ]);
        },

        "Warehouses" : function(self , el) {
            return $.merge(this.Platform(self, el), [
                {
                    "text" : "Warehouses",
                    "link" : self.LIST_LINK().call(self,'warehouses')
                }
            ]);
        },

        "Warehouse" : function(self , el) {
            return $.merge(this.Warehouses(self, el), [
                {
                    "text" : self.friendlyTitle(self.warehouse()),
                    "link" : self.LINK().call(self,self.warehouse())
                }
            ]);
        },

        "Sessions" : function(self , el) {
            return $.merge(this.Warehouse(self, el), [
                {
                    "text" : "Interaction Sessions",
                    "link" : self.LIST_LINK().call(self,'sessions')
                }
            ]);
        },

        "Session" : function(self , el) {
            return $.merge(this.Sessions(self, el), [
                {
                    "text" : self.friendlyTitle(self.session()),
                    "link" : self.LINK().call(self,self.session())
                }
            ]);
        },

        "InteractionReports" : function(self , el) {
            return $.merge(this.Warehouse(self, el), [
                {
                    "text" : "Interaction Reports",
                    "link" : self.LIST_LINK().call(self,'interaction-reports')
                }
            ]);
        },

        "InteractionReport" : function(self , el) {
            return $.merge(this.InteractionReports(self, el), [
                {
                    "text" : self.friendlyTitle(self.interactionReport()),
                    "link" : self.LINK().call(self,self.interactionReport())
                }
            ]);
        },

        "InteractionPages" : function(self , el) {
            return $.merge(this.Warehouse(self, el), [
                {
                    "text" : "Interaction Pages",
                    "link" : self.LIST_LINK().call(self,'interaction-pages')
                }
            ]);
        },

        "InteractionPage" : function(self , el) {
            return $.merge(this.InteractionPages(self, el), [
                {
                    "text" : self.friendlyTitle(self.interactionPage()),
                    "link" : self.LINK().call(self,self.interactionPage())
                }
            ]);
        },

        "InteractionUsers" : function(self , el) {
            return $.merge(this.Warehouse(self, el), [
                {
                    "text" : "Interaction Users",
                    "link" : self.LIST_LINK().call(self,'interaction-users')
                }
            ]);
        },

        "InteractionUser" : function(self , el) {
            return $.merge(this.InteractionUsers(self, el), [
                {
                    "text" : self.friendlyTitle(self.interactionUser()),
                    "link" : self.LINK().call(self,self.interactionUser())
                }
            ]);
        },

        "InteractionNodes" : function(self , el) {
            return $.merge(this.Warehouse(self, el), [
                {
                    "text" : "Interaction Nodes",
                    "link" : self.LIST_LINK().call(self,'interaction-nodes')
                }
            ]);
        },

        "InteractionNode" : function(self , el) {
            return $.merge(this.InteractionNodes(self, el), [
                {
                    "text" : self.friendlyTitle(self.interactionNode()),
                    "link" : self.LINK().call(self,self.interactionNode())
                }
            ]);
        },

        "InteractionApplications" : function(self , el) {
            return $.merge(this.Warehouse(self, el), [
                {
                    "text" : "Interaction Applications",
                    "link" : self.LIST_LINK().call(self,'interaction-applications')
                }
            ]);
        },

        "InteractionApplication" : function(self , el) {
            return $.merge(this.InteractionApplications(self, el), [
                {
                    "text" : self.friendlyTitle(self.interactionApplication()),
                    "link" : self.LINK().call(self,self.interactionApplication())
                }
            ]);
        },

        "ApplicationTeams" : function(self, el) {
            return $.merge(this.Application(self, el), [
                {
                    "text" : "Teams",
                    "link" : self.LINK().call(self, self.application(), "teams")
                }
            ]);
        },

        "ApplicationTeam" : function(self , el) {
            return $.merge(this.ApplicationTeams(self, el), [
                {
                    "text" : self.friendlyTitle(self.team()),
                    "link" : self.teamLink(self.team(),self.application())
                }
            ]);
        },

        "WarehouseTeams" : function(self, el) {
            return $.merge(this.Warehouse(self, el), [
                {
                    "text" : "Teams",
                    "link" : self.LINK().call(self, self.warehouse(), "teams")
                }
            ]);
        },

        "WarehouseTeam" : function(self , el) {
            return $.merge(this.WarehouseTeams(self, el), [
                {
                    "text" : self.friendlyTitle(self.team()),
                    "link" : self.teamLink(self.team(),self.warehouse())
                }
            ]);
        },

        "Registrars" : function(self , el) {
            return $.merge(this.Platform(self, el), [
                {
                    "text" : "Registrars",
                    "link" : self.LIST_LINK().call(self,'registrars')
                }
            ]);
        },

        "Registrar" : function(self , el) {
            return $.merge(this.Registrars(self, el), [
                {
                    "text" : self.friendlyTitle(self.registrar()),
                    "link" : self.LINK().call(self,self.registrar())
                }
            ]);
        },

        "Tenants" : function(self , el) {
            return $.merge(this.Registrar(self, el), [
                {
                    "text" : "Tenants",
                    "link" : self.LIST_LINK().call(self,'tenants')
                }
            ]);
        },

        "Tenant" : function(self , el) {
            return $.merge(this.Tenants(self, el), [
                {
                    "text" : self.friendlyTitle(self.tenant()),
                    "link" : self.LINK().call(self,self.tenant())
                }
            ]);
        },

        "TenantAttachments" : function(self, el) {
            return $.merge(this.Tenant(self, el), [
                {
                    "text" : "Attachments",
                    "link" : self.LINK().call(self, self.tenant(), "attachments")
                }
            ]);
        },

        "TenantTeams" : function(self, el) {
            return $.merge(this.Tenant(self, el), [
                {
                    "text" : "Teams",
                    "link" : self.LINK().call(self, self.tenant(), "teams")
                }
            ]);
        },

        "TenantTeam" : function(self , el) {
            return $.merge(this.TenantTeams(self, el), [
                {
                    "text" : self.friendlyTitle(self.team()),
                    "link" : self.teamLink(self.team(),self.tenant())
                }
            ]);
        },

        "Plans" : function(self , el) {
            return $.merge(this.Registrar(self, el), [
                {
                    "text" : "Plans",
                    "link" : self.LIST_LINK().call(self,'plans')
                }
            ]);
        },

        "Plan" : function(self , el) {
            return $.merge(this.Plans(self, el), [
                {
                    "text" : self.friendlyTitle(self.plan()),
                    "link" : self.LINK().call(self,self.plan())
                }
            ]);
        },

        "Clients" : function(self , el) {
            return $.merge(this.Platform(self, el), [
                {
                    "text" : "Clients",
                    "link" : self.LIST_LINK().call(self,'clients')
                }
            ]);
        },

        "Client" : function(self , el) {
            return $.merge(this.Clients(self, el), [
                {
                    "text" : self.friendlyTitle(self.client()),
                    "link" : self.LINK().call(self,self.client())
                }
            ]);
        },

        "AuthenticationGrants" : function(self , el) {
            return $.merge(this.Platform(self, el), [
                {
                    "text" : "Authentication Grants",
                    "link" : self.LIST_LINK().call(self,'authenticationGrants')
                }
            ]);
        },

        "AuthenticationGrant" : function(self , el) {
            return $.merge(this.AuthenticationGrants(self, el), [
                {
                    "text" : self.friendlyTitle(self.authenticationGrant()),
                    "link" : self.LINK().call(self,self.authenticationGrant())
                }
            ]);
        },

        "Projects" : function(self , el) {
            return $.merge(this.Platform(self, el), [
                {
                    "text" : "Projects",
                    "link" : self.LIST_LINK().call(self,'projects')
                }
            ]);
        },

        "Project" : function(self , el) {
            return $.merge(this.Projects(self, el), [
                {
                    "text" : self.friendlyTitle(self.project()),
                    "link" : self.LINK().call(self,self.project())
                }
            ]);
        },

        "Repositories" : function(self , el) {
            return $.merge(this.Platform(self, el), [
                {
                    "text" : "Repositories",
                    "link" : self.LIST_LINK().call(self,'repositories')
                }
            ]);
        },

        "RepositoryLogs" : function(self , el) {
            return $.merge(this.Repositories(self, el), [
                {
                    "text" : "Logs",
                    "link" : self.LINK().call(self,self.repository(),"logs")
                }
            ]);
        },

        "RepositoryChangesets" : function(self , el) {
            return $.merge(this.Repositories(self, el), [
                {
                    "text" : "Change Sets",
                    "link" : self.LINK().call(self,self.repository(),"changesets")
                }
            ]);
        },

        "DomainGroups" : function(self , el) {
            return $.merge(this.Domain(self, el), [
                {
                    "text" : "Groups",
                    "link" : self.listLink('groups')
                }
            ]);
        },

        "DomainUsers" : function(self , el) {
            return $.merge(this.Domain(self, el), [
                {
                    "text" : "Users",
                    "link" : self.listLink('users')
                }
            ]);
        },

        "Repository" : function(self , el) {
            return $.merge(this.Repositories(self, el), [
                {
                    "text" : self.friendlyTitle(self.repository()),
                    "link" : self.LINK().call(self,self.repository())
                }
            ]);
        },

        "RepositoryTeams" : function(self , el) {
            return $.merge(this.Repository(self, el), [
                {
                    "text" : "Teams",
                    "link" : self.listLink('repository-teams')
                }
            ]);
        },

        "RepositoryTeam" : function(self , el) {
            return $.merge(this.RepositoryTeams(self, el), [
                {
                    "text" : self.friendlyTitle(self.team()),
                    "link" : self.teamLink(self.team(),self.repository())
                }
            ]);
        },

        "Changesets" : function(self , el) {
            return $.merge(this.Repository(self, el), [
                {
                    "text" : "Changesets",
                    "link" : self.LIST_LINK().call(self,'changesets')
                }
            ]);
        },

        "Changeset" : function(self , el) {
            return $.merge(this.Changesets(self, el), [
                {
                    "text" : self.friendlyTitle(self.changeset()),
                    "link" : self.LINK().call(self,self.changeset())
                }
            ]);
        },

        "DomainGroup" : function(self , el) {
            return $.merge(this.DomainGroups(self, el), [
                {
                    "text" : self.friendlyTitle(self.group()),
                    "link" : self.link(self.group())
                }
            ]);
        },

        "DomainUser" : function(self , el) {
            return $.merge(this.DomainUsers(self, el), [
                {
                    "text" : self.friendlyName(self.principalUser()),
                    "link" : self.link(self.principalUser())
                }
            ]);
        },

        "Branches" : function(self , el) {
            return $.merge(this.Repository(self, el), [
                {
                    "text" : "Branches",
                    "link" : self.LIST_LINK().call(self,"branches")
                }
            ]);
        },

        "Branch" : function(self , el) {
            return $.merge(this.Branches(self, el), [
                {
                    "text" : self.friendlyTitle(self.branch()),
                    "link" : self.LINK().call(self,self.branch())
                }
            ]);
        },

        "BranchLogs" : function(self , el) {
            return $.merge(this.Branch(self, el), [
                {
                    "text" : "Logs",
                    "link" : self.LINK().call(self,self.branch(),"logs")
                }
            ]);
        },

        "Nodes" : function(self , el) {
            return $.merge(this.Branch(self, el), [
                {
                    "text" : "Nodes",
                    "link" : self.LIST_LINK().call(self,"nodes")
                }
            ]);
        },

        "Tags" : function(self , el) {
            return $.merge(this.Branch(self, el), [
                {
                    "text" : "Tags",
                    "link" : self.LIST_LINK().call(self,"tags")
                }
            ]);
        },

        "Definitions" : function(self , el) {
            return $.merge(this.Branch(self, el), [
                {
                    "text" : "Definitions",
                    "link" : self.LIST_LINK().call(self,"definitions")
                }
            ]);
        },

        "Definition" : function(self , el) {
            return $.merge(this.Definitions(self, el), [
                {
                    "text" : self.definition().getQName(),
                    "link" : self.LINK().call(self,self.definition())
                }
            ]);
        },

        "Forms" : function(self , el) {
            return $.merge(this.Definition(self, el), [
                {
                    "text" : "Forms",
                    "link" : self.LIST_LINK().call(self,'forms')
                }
            ]);
        },

        "Form" : function(self , el) {
            return $.merge(this.Forms(self, el), [
                {
                    "text" : self.form()['formKey'],
                    "link" : self.LINK().call(self,self.form())
                }
            ]);
        },

        "Features" : function(self , el) {
            return $.merge(this.Definition(self, el), [
                {
                    "text" : "Features",
                    "link" : self.LIST_LINK().call(self,'features')
                }
            ]);
        },

        "Node" : function(self , el) {
            return $.merge(this.Nodes(self, el), [
                {
                    "text" : self.friendlyTitle(self.node()),
                    "link" : self.LINK().call(self,self.node())
                }
            ]);
        },

        "Tag" : function(self , el) {
            return $.merge(this.Tags(self, el), [
                {
                    "text" : self.friendlyTitle(self.node()),
                    "link" : self.LINK().call(self,self.node())
                }
            ]);
        },

        "Attachments" : function(self , el) {
            return $.merge(this.Node(self, el), [
                {
                    "text" : "Attachments",
                    "link" : self.LIST_LINK().call(self,"attachments")
                }
            ]);
        },

        "Associations" : function(self , el) {
            return $.merge(this.Node(self, el), [
                {
                    "text" : "Associations",
                    "link" : self.LIST_LINK().call(self,"associations")
                }
            ]);
        },

        "Translations" : function(self , el) {
            return $.merge(this.Node(self, el), [
                {
                    "text" : "Translations",
                    "link" : self.LIST_LINK().call(self,"translations")
                }
            ]);
        },

        "NodeAuditRecords" : function(self , el) {
            return $.merge(this.Node(self, el), [
                {
                    "text" : "Audit Records",
                    "link" : self.LINK().call(self,self.node(),"auditrecords")
                }
            ]);
        },

        "NodeFeatures" : function(self , el) {
            return $.merge(this.Node(self, el), [
                {
                    "text" : "Features",
                    "link" : self.LINK().call(self,self.node(),"features")
                }
            ]);
        },

        "NodeRules" : function(self , el) {
            return $.merge(this.Node(self, el), [
                {
                    "text" : "Rules",
                    "link" : self.LIST_LINK().call(self,"rules")
                }
            ]);
        },

        "Folder" : function(self, el, extra) {

            if (self.node().get('_is_association')) {
                return self.breadcrumb(Gitana.Console.Breadcrumb.Nodes(self));
            } else {

                var breadcrumb = self.breadcrumb(Gitana.Console.Breadcrumb.Branch(self));

                var nodeId = self.node().getId();

                if (Gitana.Console.Breadcrumb.PATHS[nodeId]) {
                    var nodeBreadcrumb = $.merge(breadcrumb, Gitana.Console.Breadcrumb.PATHS[nodeId]);
                    if (extra) {
                        $.merge(nodeBreadcrumb, extra);
                    }
                    //return self.breadcrumb(nodeBreadcrumb);
                } else {
                    Gitana.Console.Breadcrumb.findPath(self.node(), self, function() {
                        if (Gitana.Console.Breadcrumb.PATHS[nodeId]) {
                            var nodeBreadcrumb = $.merge(self.breadcrumb(), Gitana.Console.Breadcrumb.PATHS[nodeId]);
                            if (extra) {
                                $.merge(nodeBreadcrumb, extra);
                            }
                        }
                    });
                }

                return self.breadcrumb(nodeBreadcrumb);
            }
        },

        "FolderRules" : function(self , el) {
            return $.merge(this.Folder(self, el), [
                {
                    "text" : "Rules",
                    "link" : self.LIST_LINK().call(self,"rules")
                }
            ]);
        },

        "BillingProviders" : function(self , el) {
            return $.merge(this.Platform(self, el), [
                {
                    "text" : "Billing Provider Configs",
                    "link" : self.LIST_LINK().call(self,'billing-providers')
                }
            ]);
        },

        "BillingProvider" : function(self , el) {
            return $.merge(this.BillingProviders(self, el), [
                {
                    "text" : self.friendlyTitle(self.billingProvider()),
                    "link" : self.LINK().call(self,self.billingProvider())
                }
            ]);
        },

        "Directories" : function(self , el) {
            return $.merge(this.Platform(self, el), [
                {
                    "text" : "Directories",
                    "link" : self.LIST_LINK().call(self,'directories')
                }
            ]);
        },

        "Directory" : function(self , el) {
            return $.merge(this.Directories(self, el), [
                {
                    "text" : self.friendlyTitle(self.directory()),
                    "link" : self.LINK().call(self,self.directory())
                }
            ]);
        },

        "Identities" : function(self , el) {
            return $.merge(this.Directory(self, el), [
                {
                    "text" : "Identities",
                    "link" : self.LIST_LINK().call(self,'identities')
                }
            ]);
        },

        "Identity" : function(self , el) {
            return $.merge(this.Identities(self, el), [
                {
                    "text" : self.friendlyTitle(self.identity()),
                    "link" : self.LINK().call(self,self.identity())
                }
            ]);
        },

        "Connections" : function(self , el) {
            return $.merge(this.Directory(self, el), [
                {
                    "text" : "Connections",
                    "link" : self.LIST_LINK().call(self,'connections')
                }
            ]);
        },

        "Connection" : function(self , el) {
            return $.merge(this.Connections(self, el), [
                {
                    "text" : self.friendlyTitle(self.connection()),
                    "link" : self.LINK().call(self,self.connection())
                }
            ]);
        },

        "Webhosts" : function(self , el) {
            return $.merge(this.Platform(self, el), [
                {
                    "text" : "Web Hosts",
                    "link" : self.LIST_LINK().call(self,'webhosts')
                }
            ]);
        },

        "Webhost" : function(self , el) {
            return $.merge(this.Webhosts(self, el), [
                {
                    "text" : self.friendlyTitle(self.webhost()),
                    "link" : self.LINK().call(self,self.webhost())
                }
            ]);
        },

        "AutoClientMappings" : function(self , el) {
            return $.merge(this.Webhost(self, el), [
                {
                    "text" : "Auto Client Mappings",
                    "link" : self.LIST_LINK().call(self,'auto-client-mappings')
                }
            ]);
        },

        "AutoClientMapping" : function(self , el) {
            return $.merge(this.AutoClientMappings(self, el), [
                {
                    "text" : self.friendlyTitle(self.autoClientMapping()),
                    "link" : self.LINK().call(self,self.autoClientMapping())
                }
            ]);
        },

        "TrustedDomainMappings" : function(self , el) {
            return $.merge(this.Webhost(self, el), [
                {
                    "text" : "Trusted Domain Mappings",
                    "link" : self.LIST_LINK().call(self,'trusted-domain-mappings')
                }
            ]);
        },

        "TrustedDomainMapping" : function(self , el) {
            return $.merge(this.TrustedDomainMappings(self, el), [
                {
                    "text" : self.friendlyTitle(self.trustedDomainMapping()),
                    "link" : self.LINK().call(self,self.trustedDomainMapping())
                }
            ]);
        },

        "DeployedApplications" : function(self , el) {
            return $.merge(this.Webhost(self, el), [
                {
                    "text" : "Deployed Applications",
                    "link" : self.LIST_LINK().call(self,'deployed-applications')
                }
            ]);
        },

        "DeployedApplication" : function(self , el) {
            return $.merge(this.DeployedApplications(self, el), [
                {
                    "text" : self.friendlyTitle(self.deployedApplication()),
                    "link" : self.LINK().call(self,self.deployedApplication())
                }
            ]);
        },

        "PlatformActivities" : function(self , el) {
            return $.merge(this.Platform(self, el), [
                {
                    "text" : "Activities",
                    "link" : self.LIST_LINK().call(self,'activities')
                }
            ]);
        }
    };


})(jQuery);