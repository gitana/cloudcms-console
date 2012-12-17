(function($) {

    Gitana.Console.Menu = {
        "Error" : function(self , current) {
            var defaultItem = "menu-Error-dashboard";
            var current = current ? current : defaultItem;
            return {
                "items" : [
                    {
                        "id" : defaultItem,
                        "link" : "#/error",
                        "title" : "Error",
                        "icon" : Gitana.Utils.Image.buildImageUri('special', 'warning', 16),
                        "current" : current == defaultItem
                    }]
            };
        },

        "Dashboard" : function(self , current) {
            var defaultItem = "menu-my-dashboard";
            var current = current ? current : defaultItem;
            return {
                "items": [{
                    "id": "menu-my-dashboard-header",
                    "title": "My Dashboard",
                    "header": true,
                    "items" : [{
                        "id" : defaultItem,
                        "link" : "#/dashboard",
                        "title" : "Overview",
                        "icon" : Gitana.Utils.Image.buildImageUri('browser', 'dashboard',16),
                        "current" : current == defaultItem
                    },
                    {
                        "id" : "menu-my-profile",
                        "link" : "#/profile",
                        "title" : "My Profile",
                        "icon" : Gitana.Utils.Image.buildImageUri('security', 'user', 16),
                        "current" : current == "menu-my-profile"
                    },
                    {
                        "id" : "menu-my-activities",
                        "link" :  "#" + self.listLink('my-activities'),
                        "title" : "My Activities",
                        "icon" :  Gitana.Utils.Image.buildImageUri('objects', 'activity', 16),
                        "current" : current == "menu-my-activities"
                    }]
                }, {
                    "id": "menu-my-dashboard-quicklinks",
                    "title": "Quick Links",
                    "header": true,
                    "items": [{
                        "id": "menu-my-dashboard-browse-platform",
                        "title": "Browse Platform",
                        "link" : "#/",
                        "icon" : Gitana.Utils.Image.buildImageUri('browser', 'dashboard',16)
                    }]
                }]
            };
        },

        "Tenant" : function(self , current) {
            var defaultItem = "menu-tenant-dashboard";
            var current = current ? current : "menu-tenant-dashboard";
            return {
                "items" : [
                    {
                        "id" : "menu-tenant-dashboard",
                        "link" : "#" + self.link(self.tenant()),
                        "title" : "Dashboard",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'tenant', 16),
                        "current" : current == "menu-tenant-dashboard"
                    },
                    {
                        "id" : "menu-tenant-attachments",
                        "link" : "#" + self.link(self.tenant(),'attachments'),
                        "title" : "Attachments",
                        "icon" :  Gitana.Utils.Image.buildImageUri('objects', 'attachment', 16),
                        "current" : current == "menu-tenant-attachments"
                    }
                ]
            };
        },

        "TenantTeam" : function(self , current) {
            var defaultItem = "menu-tenant-team-dashboard";
            var current = current ? current : defaultItem;
            return {
                "items" : [
                    {
                        "id" : defaultItem,
                        "link" : "#" + self.teamLink(self.team(),self.tenant()),
                        "title" : "Dashboard",
                        "icon" : Gitana.Utils.Image.buildImageUri('security', 'team', 16),
                        "current" : current == defaultItem
                    }
                ]
            };
        },

        "Platform" : function(self , current) {
            var defaultItem = "menu-platform-dashboard-header";
            var current = current ? current : "menu-platform-dashboard";
            return {
                "items" : [
                    {
                        "id" : "menu-platform-dashboard-header",
                        "title" : "Platform",
                        //"icon" : Gitana.Utils.Image.buildImageUri('objects', 'platform', 16),
                        "header": true,
                        "items": [{
                            "id" : "menu-platform-dashboard",
                            "link" : "#/",
                            "title" : "Dashboard",
                            "icon" : Gitana.Utils.Image.buildImageUri('objects', 'platform', 16),
                            "current" : current == "menu-platform-dashboard"
                        },{
                            "id" : "menu-platform-activities",
                            "link" : "#/activities",
                            "title" : "Activities",
                            "icon" :  Gitana.Utils.Image.buildImageUri('objects', 'activity', 16),
                            "current" : current == "menu-platform-activities"
                        },{
                            "id" : "menu-platform-security",
                            "link" : "#/authorities/groups",
                            "title" : "Security",
                            "icon" :  Gitana.Utils.Image.buildImageUri('security', 'security', 16),
                            "current" : current == "menu-platform-security"
                        },{
                            "id" : "menu-platform-teams",
                            "link" : "#" + self.listLink('platform-teams'),
                            "title" : "Teams",
                            "icon" :  Gitana.Utils.Image.buildImageUri('security', 'team', 16),
                            "current" : current == "menu-platform-teams"
                        },{
                            "id" : "menu-platform-jobs",
                            "link" : "#" + self.listLink("jobs"),
                            "title" : "Jobs",
                            "icon" :  Gitana.Utils.Image.buildImageUri('objects', 'job', 16),
                            "current" : current == "menu-platform-jobs"
                        },{
                            "id" : "menu-platform-logs",
                            "link" : "#" + self.link(self.platform()) + "logs",
                            "title" : "Logs",
                            "icon" :  Gitana.Utils.Image.buildImageUri('objects', 'log', 16),
                            "current" : current == "menu-platform-logs"
                        }]
                    },{
                        "id" : "menu-platform-datastores-header",
                        "title" : "Data Stores",
                        //"icon" : Gitana.Utils.Image.buildImageUri('objects', 'platform', 16),
                        "header": true,
                        "items": [{
                            "id" : "menu-platform-applications",
                            "link" : "#" + self.listLink('applications'),
                            "title" : "Applications",
                            "icon" :  Gitana.Utils.Image.buildImageUri('objects', 'application', 16),
                            "current" : current == "menu-platform-applications"
                        },{
                            "id" : "menu-platform-directories",
                            "link" : "#" + self.listLink('directories'),
                            "title" : "Directories",
                            "icon" :  Gitana.Utils.Image.buildImageUri('objects', 'directory', 16),
                            "current" : current == "menu-platform-directories"
                        },{
                            "id" : "menu-platform-domains",
                            "link" : "#" + self.listLink('domains'),
                            "title" : "Domains",
                            "icon" :  Gitana.Utils.Image.buildImageUri('objects', 'domain', 16),
                            "current" : current == "menu-platform-domains"
                        },{
                            "id" : "menu-platform-registrars",
                            "link" : "#" + self.listLink('registrars'),
                            "title" : "Registrars",
                            "icon" :  Gitana.Utils.Image.buildImageUri('objects', 'registrar', 16),
                            "current" : current == "menu-platform-registrars"
                        },{
                            "id" : "menu-platform-repositories",
                            "link" : "#" + self.listLink('repositories'),
                            "title" : "Repositories",
                            "icon" :  Gitana.Utils.Image.buildImageUri('objects', 'repositories', 16),
                            "current" : current == "menu-platform-repositories"
                        },{
                            "id" : "menu-platform-vaults",
                            "link" : "#" + self.listLink('vaults'),
                            "title" : "Vaults",
                            "icon" :  Gitana.Utils.Image.buildImageUri('objects', 'vault', 16),
                            "current" : current == "menu-platform-vaults"
                        },{
                            "id" : "menu-platform-warehouses",
                            "link" : "#" + self.listLink('warehouses'),
                            "title" : "Warehouses",
                            "icon" :  Gitana.Utils.Image.buildImageUri('objects', 'warehouse', 16),
                            "current" : current == "menu-platform-warehouses"
                        },{
                            "id" : "menu-platform-webhosts",
                            "link" : "#" + self.listLink('webhosts'),
                            "title" : "Web Hosts",
                            "icon" :  Gitana.Utils.Image.buildImageUri('objects', 'webhost', 16),
                            "current" : current == "menu-platform-webhosts"
                        }]
                    },{
                        "id" : "menu-platform-objects-header",
                        "title" : "Objects",
                        //"icon" : Gitana.Utils.Image.buildImageUri('objects', 'platform', 16),
                        "header": true,
                        "items": [{
                            "id" : "menu-platform-authenticationgrants",
                            "link" : "#" + self.listLink('authenticationGrants'),
                            "title" : "Authentication Grants",
                            "icon" :  Gitana.Utils.Image.buildImageUri('objects', 'authentication-grant', 16),
                            "current" : current == "menu-platform-authenticationgrants"
                        },{
                            "id" : "menu-platform-billing-providers",
                            "link" : "#" + self.listLink('billing-providers'),
                            "title" : "Billing Configurations",
                            "icon" :  Gitana.Utils.Image.buildImageUri('objects', 'billing-provider', 16),
                            "current" : current == "menu-platform-billing-providers"
                        },{
                            "id" : "menu-platform-clients",
                            "link" : "#" + self.listLink('clients'),
                            "title" : "Clients",
                            "icon" :  Gitana.Utils.Image.buildImageUri('objects', 'client', 16),
                            "current" : current == "menu-platform-clients"
                        },{
                            "id" : "menu-platform-projects",
                            "link" : "#" + self.listLink('projects'),
                            "title" : "Projects",
                            "icon" :  Gitana.Utils.Image.buildImageUri('objects', 'project', 16),
                            "current" : current == "menu-platform-projects"
                        },{
                            "id" : "menu-platform-stacks",
                            "link" : "#" + self.listLink('stacks'),
                            "title" : "Stacks",
                            "icon" :  Gitana.Utils.Image.buildImageUri('objects', 'stack', 16),
                            "current" : current == "menu-platform-stacks"
                        }]
                    }
                ]
            };
        },

        "PlatformTeam" : function(self , current) {
            var defaultItem = "menu-platform-team-dashboard";
            var current = current ? current : defaultItem;
            return {
                "items": [{
                    "id": "menu-platform-team-header",
                    "title": "Platform Team",
                    "header": true,
                    "items": [{
                        "id" : defaultItem,
                        "link" : "#" + self.teamLink(self.team(),self.tenant()),
                        "title" : "Dashboard",
                        "icon" : Gitana.Utils.Image.buildImageUri('security', 'team', 16),
                        "current" : current == defaultItem
                    }]
                }]
            };
        },

        "Domain" : function(self , current) {
            var defaultItem = "menu-domain-dashboard";
            var current = current ? current : "menu-domain-dashboard";
            return {
                "items" : [{
                    "id": defaultItem + "-header",
                    "title": "Domain",
                    "header": true,
                    "items": [{
                        "id" : defaultItem,
                        "link" : "#" + self.LINK().call(self,self.domain()),
                        "title" : "Dashboard",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'domain', 16),
                        "current" : current == defaultItem
                    },
                    {
                        "id" : "menu-domain-security",
                        "link" : "#" + self.LINK().call(self,self.domain(),"authorities","groups"),
                        "title" : "Security",
                        "icon" :  Gitana.Utils.Image.buildImageUri('security', 'security', 16),
                        "current" : current == "menu-domain-security"
                    }]
                },{
                    "id": defaultItem + "-objects-header",
                    "title": "Objects",
                    "header": true,
                    "items": [{
                        "id" : "menu-domain-users",
                        "link" : "#" + self.LINK().call(self,self.domain(),"users"),
                        "title" : "Users",
                        "icon" :  Gitana.Utils.Image.buildImageUri('security', 'user', 16),
                        "current" : current == "menu-domain-users"
                    },
                    {
                        "id" : "menu-domain-groups",
                        "link" : "#" + self.LINK().call(self,self.domain(),"groups"),
                        "title" : "Groups",
                        "icon" :  Gitana.Utils.Image.buildImageUri('security', 'group', 16),
                        "current" : current == "menu-domain-groups"
                    }]
                }]
            };
        },

        "Vault" : function(self , current) {
            var defaultItem = "menu-vault-dashboard";
            var current = current ? current : "menu-vault-dashboard";
            return {
                "items": [{
                    "id": "menu-vault-header",
                    "title": "Vault",
                    "header": true,
                    "items": [{
                        "id" : "menu-vault-dashboard",
                        "link" : "#" + self.link(self.vault()),
                        "title" : "Dashboard",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'vault', 16),
                        "current" : current == defaultItem
                    },
                    {
                        "id" : "menu-vault-teams",
                        "link" : "#" + self.link(self.vault(),'teams'),
                        "title" : "Teams",
                        "icon" :  Gitana.Utils.Image.buildImageUri('security', 'team', 16),
                        "current" : current == "menu-vault-teams"
                    }]
                }, {
                    "id": "menu-vault-objects-header",
                    "title": "Objects",
                    "header": true,
                    "items": [{
                        "id" : "menu-vault-archives",
                        "link" : "#" + self.link(self.vault(),'archives'),
                        "title" : "Archives",
                        "icon" :  Gitana.Utils.Image.buildImageUri('objects', 'archive', 16),
                        "current" : current == "menu-vault-archives"
                    }]
                }]
            };
        },

        "VaultTeam" : function(self , current) {
            var defaultItem = "menu-vault-team-dashboard";
            var current = current ? current : defaultItem;
            return {
                "items": [{
                    "id": "menu-vault-team-header",
                    "title": "Vault Team",
                    "header": true,
                    "items": [{
                        "id" : defaultItem,
                        "link" : "#" + self.teamLink(self.team(),self.vault()),
                        "title" : "Dashboard",
                        "icon" : Gitana.Utils.Image.buildImageUri('security', 'team', 16),
                        "current" : current == defaultItem
                    }]
                }]
            };
        },

        "Archive" : function(self , current) {
            var defaultItem = "menu-archive-dashboard";
            var current = current ? current : "menu-archive-dashboard";
            return {
                "items": [{
                    "id": "menu-archive-header",
                    "title": "Archive",
                    "header": true,
                    "items": [{
                        "id" : "menu-archive-dashboard",
                        "link" : "#" + self.link(self.archive()),
                        "title" : "Dashboard",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'archive', 16),
                        "current" : current == defaultItem
                    }]
                }]
            };
        },

        "Stack" : function(self , current) {
            var defaultItem = "menu-stack-dashboard";
            var current = current ? current : "menu-stack-dashboard";
            return {
                "items" : [{
                    "id": "menu-stack-header",
                    "title": "Stack",
                    "header": true,
                    "items": [{
                        "id" : "menu-stack-attachments",
                        "link" : "#" + self.link(self.stack(),'attachments'),
                        "title" : "Attachments",
                        "icon" :  Gitana.Utils.Image.buildImageUri('objects', 'attachment', 16),
                        "current" : current == "menu-stack-attachments"
                    },
                    {
                        "id" : "menu-stack-dashboard",
                        "link" : "#" + self.link(self.stack()),
                        "title" : "Dashboard",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'stack', 16),
                        "current" : current == defaultItem
                    },
                    {
                        "id" : "menu-stack-logs",
                        "link" : "#" + self.link(self.stack(),'logs'),
                        "title" : "Logs",
                        "icon" :  Gitana.Utils.Image.buildImageUri('objects', 'log', 16),
                        "current" : current == "menu-stack-logs"
                    },
                    {
                        "id" : "menu-stack-security",
                        "link" : "#" + self.link(self.stack(),"authorities","groups"),
                        "title" : "Security",
                        "icon" :  Gitana.Utils.Image.buildImageUri('security', 'security', 16),
                        "current" : current == "menu-stack-security"
                    },
                    {
                        "id" : "menu-stack-teams",
                        "link" : "#" + self.link(self.stack(),'teams'),
                        "title" : "Teams",
                        "icon" :  Gitana.Utils.Image.buildImageUri('security', 'team', 16),
                        "current" : current == "menu-stack-teams"
                    }]
                }]
            };
        },

        "StackTeam" : function(self , current) {
            var defaultItem = "menu-stack-team-dashboard";
            var current = current ? current : defaultItem;
            return {
                "items": [{
                    "id": "menu-stack-team-header",
                    "title": "Stack Team",
                    "header": true,
                    "items": [{
                        "id" : defaultItem,
                        "link" : "#" + self.teamLink(self.team(),self.stack()),
                        "title" : "Dashboard",
                        "icon" : Gitana.Utils.Image.buildImageUri('security', 'team', 16),
                        "current" : current == defaultItem
                    }]
                }]
            };
        },

        "Warehouse" : function(self , current) {
            var defaultItem = "menu-warehouse-dashboard";
            var current = current ? current : "menu-warehouse-dashboard";
            return {
                "items": [{
                    "id": "menu-warehouse-header",
                    "title": "Warehouse",
                    "header": true,
                    "items" : [{
                        "id" : "menu-warehouse-dashboard",
                        "link" : "#" + self.link(self.warehouse()),
                        "title" : "Dashboard",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'warehouse', 16),
                        "current" : current == defaultItem
                    },
                    {
                        "id" : "menu-warehouse-teams",
                        "link" : "#" + self.link(self.warehouse(),'teams'),
                        "title" : "Warehouse Teams",
                        "icon" :  Gitana.Utils.Image.buildImageUri('security', 'team', 16),
                        "current" : current == "menu-warehouse-teams"
                    }]
                },{
                    "id": "menu-warehouse-objects",
                    "title": "Objects",
                    "header": true,
                    "items": [{
                        "id" : "menu-warehouse-interaction-applications",
                        "link" : "#" + self.listLink('interaction-applications'),
                        "title" : "Interaction Applications",
                        "icon" :  Gitana.Utils.Image.buildImageUri('objects', 'interaction-application', 16),
                        "current" : current == "menu-warehouse-interaction-applications"
                    },
                    {
                        "id" : "menu-warehouse-sessions",
                        "link" : "#" + self.listLink('sessions'),
                        "title" : "Interaction Sessions",
                        "icon" :  Gitana.Utils.Image.buildImageUri('objects', 'session', 16),
                        "current" : current == "menu-warehouse-sessions"
                    },
                    {
                        "id" : "menu-warehouse-interaction-pages",
                        "link" : "#" + self.listLink('interaction-pages'),
                        "title" : "Interaction Pages",
                        "icon" :  Gitana.Utils.Image.buildImageUri('objects', 'interaction-page', 16),
                        "current" : current == "menu-warehouse-interaction-pages"
                    },
                    {
                        "id" : "menu-warehouse-interaction-nodes",
                        "link" : "#" + self.listLink('interaction-nodes'),
                        "title" : "Interaction Nodes",
                        "icon" :  Gitana.Utils.Image.buildImageUri('objects', 'interaction-node', 16),
                        "current" : current == "menu-warehouse-interaction-nodes"
                    },
                    {
                        "id" : "menu-warehouse-interaction-users",
                        "link" : "#" + self.listLink('interaction-users'),
                        "title" : "Interaction Users",
                        "icon" :  Gitana.Utils.Image.buildImageUri('objects', 'interaction-user', 16),
                        "current" : current == "menu-warehouse-interaction-users"
                    },
                    {
                        "id" : "menu-warehouse-interaction-reports",
                        "link" : "#" + self.listLink('interaction-reports'),
                        "title" : "Interaction Reports",
                        "icon" :  Gitana.Utils.Image.buildImageUri('objects', 'interaction-report', 16),
                        "current" : current == "menu-warehouse-interaction-reports"
                    }]
                }]
            };
        },

        "WarehouseTeam" : function(self , current) {
            var defaultItem = "menu-warehouse-team-dashboard";
            var current = current ? current : defaultItem;
            return {
                "items": [{
                    "id": "menu-warehouse-team-header",
                    "title": "Warehouse Team",
                    "header": true,
                    "items" : [{
                        "id" : defaultItem,
                        "link" : "#" + self.teamLink(self.team(),self.warehouse()),
                        "title" : "Dashboard",
                        "icon" : Gitana.Utils.Image.buildImageUri('security', 'team', 16),
                        "current" : current == defaultItem
                    }]
                }]
            };
        },

        "Settings" : function(self , current) {
            var defaultItem = "menu-settings-dashboard";
            var current = current ? current : defaultItem;
            return {
                "items": [{
                    "id": "menu-settings-header",
                    "title": "Settings",
                    "header": true,
                    "items": [{
                        "id" : "menu-settings-dashboard",
                        "link" : "#" + self.link(self.settings()),
                        "title" : "Dashboard",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'settings', 16),
                        "current" : current == defaultItem
                    }]
                }]
            };
        },

        "Application" : function(self , current) {
            var defaultItem = "menu-application-dashboard";
            var current = current ? current : "menu-application-dashboard";
            return {
                "items": [{
                    "id": "menu-application-header",
                    "title": "Application",
                    "header": true,
                    "items": [{
                        "id" : "menu-application-dashboard",
                        "link" : "#" + self.link(self.application()),
                        "title" : "Dashboard",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'application', 16),
                        "current" : current == defaultItem
                    },
                    {
                        "id" : "menu-application-teams",
                        "link" : "#" + self.link(self.application(),'teams'),
                        "title" : "Teams",
                        "icon" :  Gitana.Utils.Image.buildImageUri('security', 'team', 16),
                        "current" : current == "menu-application-teams"
                    }]
                },{
                    "id": "menu-application-objects",
                    "title": "Objects",
                    "header": true,
                    "items": [{
                        "id" : "menu-application-settings",
                        "link" : "#" + self.listLink('settings'),
                        "title" : "Settings List",
                        "icon" :  Gitana.Utils.Image.buildImageUri('objects', 'settings', 16),
                        "current" : current == "menu-application-settings"
                    }]
                }]
            };
        },

        "ApplicationTeam" : function(self , current) {
            var defaultItem = "menu-application-team-dashboard";
            var current = current ? current : defaultItem;
            return {
                "items": [{
                    "id": "menu-application-team-header",
                    "title": "Application Team",
                    "header": true,
                    "items": [{
                        "id" : defaultItem,
                        "link" : "#" + self.teamLink(self.team(),self.application()),
                        "title" : "Dashboard",
                        "icon" : Gitana.Utils.Image.buildImageUri('security', 'team', 16),
                        "current" : current == defaultItem
                    }]
                }]
            };
        },

        "Session" : function(self , current) {
            var defaultItem = "menu-session-dashboard";
            var current = current ? current : defaultItem;
            return {
                "items": [{
                    "id": "menu-session-header",
                    "title": "Interaction Session",
                    "header": true,
                    "items" : [{
                        "id" : "menu-session-dashboard",
                        "link" : "#" + self.link(self.session()),
                        "title" : "Dashboard",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'session', 16),
                        "current" : current == defaultItem
                    }]
                }]
            };
        },

        "InteractionReport" : function(self , current) {
            var defaultItem = "menu-interaction-report-dashboard";
            var current = current ? current : defaultItem;
            return {
                "items" : [{
                    "id": "menu-interaction-report-header",
                    "title": "Interaction Report",
                    "header": true,
                    "items": [{
                        "id" : "menu-interaction-report-dashboard",
                        "link" : "#" + self.link(self.interactionReport()),
                        "title" : "Dashboard",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'interaction-report', 16),
                        "current" : current == defaultItem
                    }]
                }]
            };
        },

        "InteractionPage" : function(self , current) {
            var defaultItem = "menu-interaction-page-dashboard";
            var current = current ? current : defaultItem;
            return {
                "items" : [{
                    "id": "menu-interaction-page-header",
                    "title": "Interaction Page",
                    "header": true,
                    "items": [{
                        "id" : "menu-interaction-page-dashboard",
                        "link" : "#" + self.link(self.interactionPage()),
                        "title" : "Dashboard",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'interaction-page', 16),
                        "current" : current == defaultItem
                    }]
                }]
            };
        },

        "InteractionUser" : function(self , current) {
            var defaultItem = "menu-interaction-user-dashboard";
            var current = current ? current : defaultItem;
            return {
                "items" : [{
                    "id": "menu-interaction-user-header",
                    "title": "Interaction User",
                    "header": true,
                    "items": [{
                        "id" : "menu-interaction-user-dashboard",
                        "link" : "#" + self.link(self.interactionUser()),
                        "title" : "Dashboard",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'interaction-user', 16),
                        "current" : current == defaultItem
                    }]
                }]
            };
        },

        "InteractionNode" : function(self , current) {
            var defaultItem = "menu-interaction-node-dashboard";
            var current = current ? current : defaultItem;
            return {
                "items" : [{
                    "id": "menu-interaction-node-header",
                    "title": "Interaction Node",
                    "header": true,
                    "items": [{
                        "id" : "menu-interaction-node-dashboard",
                        "link" : "#" + self.link(self.interactionNode()),
                        "title" : "Dashboard",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'interaction-node', 16),
                        "current" : current == defaultItem
                    }]
                }]
            };
        },

        "InteractionApplication" : function(self , current) {
            var defaultItem = "menu-interaction-application-dashboard";
            var current = current ? current : defaultItem;
            return {
                "items" : [{
                    "id": "menu-interaction-application-header",
                    "title": "Interaction Application",
                    "header": true,
                    "items": [{
                        "id" : "menu-interaction-application-dashboard",
                        "link" : "#" + self.link(self.interactionApplication()),
                        "title" : "Dashboard",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'interaction-application', 16),
                        "current" : current == defaultItem
                    }]
                }]
            };
        },

        "Registrar" : function(self , current) {
            var defaultItem = "menu-registrar-dashboard";
            var current = current ? current : "menu-registrar-dashboard";
            return {
                "items": [{
                    "id": "menu-registrar-header",
                    "title": "Registrar",
                    "header": true,
                    "items": [{
                        "id" : "menu-registrar-dashboard",
                        "link" : "#" + self.link(self.registrar()),
                        "title" : "Dashboard",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'registrar', 16),
                        "current" : current == defaultItem
                    }]
                },{
                    "id": "menu-registrar-objects",
                    "title": "Objects",
                    "header": true,
                    "items": [{
                        "id" : "menu-registrar-plans",
                        "link" : "#" + self.link(self.registrar(), "plans"),
                        "title" : "Plans",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'plan', 16),
                        "current" : current == "menu-registrar-plans"
                    },
                    {
                        "id" : "menu-registrar-tenants",
                        "link" : "#" + self.link(self.registrar(), "tenants"),
                        "title" : "Tenants",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'tenant', 16),
                        "current" : current == "menu-registrar-tenants"
                    }]
                }]
            };
        },

        "Plan" : function(self , current) {
            var defaultItem = "menu-plan-dashboard";
            var current = current ? current : "menu-plan-dashboard";
            return {
                "items": [{
                    "id": "menu-plan-header",
                    "title": "Plan",
                    "header": true,
                    "items": [{
                        "id" : "menu-plan-dashboard",
                        "link" : "#" + self.link(self.plan()),
                        "title" : "Dashboard",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'plan', 16),
                        "current" : current == defaultItem
                    }]
                }]
            };
        },

        "Client" : function(self , current) {
            var defaultItem = "menu-client-dashboard";
            var current = current ? current : "menu-client-dashboard";
            return {
                "items": [{
                    "id": "menu-client-header",
                    "title": "Client",
                    "header": true,
                    "items": [{
                        "id" : "menu-client-dashboard",
                        "link" : "#" + self.link(self.client()),
                        "title" : "Dashboard",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'client', 16),
                        "current" : current == defaultItem
                    }]
                }]
            };
        },

        "AuthenticationGrant" : function(self , current) {
            var defaultItem = "menu-authenticationgrant-dashboard";
            var current = current ? current : defaultItem;
            return {
                "items" : [{
                    "id": "menu-authenticationgrant-header",
                    "title": "Authentication Grant",
                    "header": true,
                    "items": [{
                        "id" : "menu-authenticationgrant-dashboard",
                        "link" : "#" + self.link(self.authenticationGrant()),
                        "title" : "Dashboard",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'authentication-grant', 16),
                        "current" : current == defaultItem
                    }]
                }]
            };
        },

        "Project" : function(self , current) {
            var defaultItem = "menu-project-dashboard";
            var current = current ? current : "menu-project-dashboard";
            return {
                "items": [{
                    "id": "menu-project-header",
                    "title": "Project",
                    "header": true,
                    "items": [{
                        "id" : "menu-project-dashboard",
                        "link" : "#" + self.link(self.project()),
                        "title" : "Dashboard",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'project', 16),
                        "current" : current == defaultItem
                    }]
                }]
            };
        },

        "Repository" : function(self , current) {
            var defaultItem = "menu-repository-dashboard";
            var current = current ? current : "menu-repository-dashboard";
            return {
                "items": [{
                    "id": "menu-repository-header",
                    "title": "Repository",
                    "header": true,
                    "items": [{
                        "id" : "menu-repository-dashboard",
                        "link" : "#" + self.LINK().call(self,self.repository()),
                        "title" : "Dashboard",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'repository', 16),
                        "current" : current == "menu-repository-dashboard"
                    },
                    {
                        "id" : "menu-repository-security",
                        "link" : "#" + self.LINK().call(self,self.repository(),"authorities","groups"),
                        "title" : "Security",
                        "icon" :  Gitana.Utils.Image.buildImageUri('security', 'security', 16),
                        "current" : current == "menu-repository-security"
                    },
                    {
                        "id" : "menu-repository-teams",
                        "link" : "#" + self.LIST_LINK().call(self,'repository-teams'),
                        "title" : "Teams",
                        "icon" :  Gitana.Utils.Image.buildImageUri('security', 'team', 16),
                        "current" : current == "menu-repository-teams"
                    }]
                },{
                    "id": "menu-repository-objects",
                    "title": "Objects",
                    "header": true,
                    "items": [{
                        "id" : "menu-branches",
                        "link" : "#" + self.LIST_LINK().call(self,'branches'),
                        "title" : "Branches",
                        "icon" :  Gitana.Utils.Image.buildImageUri('objects', 'branches', 16),
                        "current" : current == "menu-branches"
                    },
                    {
                        "id" : "menu-change-sets",
                        "link" : "#" + self.LINK().call(self,self.repository(),"changesets"),
                        "title" : "Changesets",
                        "icon" :  Gitana.Utils.Image.buildImageUri('objects', 'changesets', 16),
                        "current" : current == "menu-change-sets"
                    }]
                }]
            };
        },

        "DomainGroup" : function(self , current) {
            var defaultItem = "menu-group-dashboard";
            var current = current ? current : defaultItem;
            return {
                "items" : [{
                    "id" : defaultItem + "-header",
                    "title" : "Group",
                    "header": true,
                    "items": [{
                        "id" : defaultItem,
                        "link" : "#" + self.link(self.group()),
                        "title" : "Dashboard",
                        "icon" : Gitana.Utils.Image.buildImageUri('security', 'group', 16),
                        "current" : current == defaultItem,
                        "visibility": true
                    }]
                }]
            };
        },

        "RepositoryTeam" : function(self , current) {
            var defaultItem = "menu-repository-team-dashboard";
            var current = current ? current : defaultItem;
            return {
                "items": [{
                    "id": defaultItem + "-header",
                    "title": "Repository Team",
                    "header": true,
                    "items": [{
                        "id" : defaultItem,
                        "link" : "#" + self.teamLink(self.team(),self.repository()),
                        "title" : "Dashboard",
                        "icon" : Gitana.Utils.Image.buildImageUri('security', 'team', 16),
                        "current" : current == defaultItem
                    }]
                }]
            };
        },

        "DomainUser" : function(self , current) {
            var defaultItem = "menu-user-dashboard";
            var current = current ? current : defaultItem;
            return {
                "items": [{
                    "id": defaultItem + "-header",
                    "title": "Domain User",
                    "header": true,
                    "items": [{
                        "id" : defaultItem,
                        "link" : "#" + self.link(self.principalUser()),
                        "title" : "Dashboard",
                        "icon" : Gitana.Utils.Image.buildImageUri('security', 'user', 16),
                        "current" : current == defaultItem
                    }]
                }]
            };
        },

        "Branch" : function(self , current) {
            var defaultItem = "menu-branch-dashboard";
            var current = current ? current : defaultItem;
            return {
                "items": [{
                    "id": "menu-branch-header",
                    "title": "Branch",
                    "header": true,
                    "items": [{
                        "id" : defaultItem,
                        "link" : "#" + self.LINK().call(self,self.branch()),
                        "title" : "Dashboard",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'branch', 16),
                        "current" : current == defaultItem
                    },
                    {
                        "id" : "menu-branch-security",
                        "link" : "#" + self.LINK().call(self,self.branch(),"authorities","groups"),
                        "title" : "Security",
                        "icon" :  Gitana.Utils.Image.buildImageUri('security', 'security', 16),
                        "current" : current == "menu-branch-security"
                    }]
                },{
                    "id": "menu-branch-objects",
                    "title": "Objects",
                    "header": true,
                    "items": [{
                        "id" : "menu-root-folder",
                        "link" : "#" + self.LIST_LINK().call(self,'folders') + self.rootNode().getId(),
                        "title" : "Root Folder",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'root-folder', 16),
                        "current" : current == "menu-root-folder"
                    },
                    {
                        "id" : "menu-nodes",
                        "link" : "#" + self.LIST_LINK().call(self,'nodes'),
                        "title" : "Nodes",
                        "icon" :  Gitana.Utils.Image.buildImageUri('objects', 'nodes', 16),
                        "current" : current == "menu-nodes"
                    },
                    {
                        "id" : "menu-definitions",
                        "link" : "#" + self.LIST_LINK().call(self,'definitions'),
                        "title" : "Definitions",
                        "icon" :  Gitana.Utils.Image.buildImageUri('objects', 'definitions', 16),
                        "current" : current == "menu-definitions"
                    },
                    {
                        "id" : "menu-tags",
                        "link" : "#" + self.LIST_LINK().call(self,'tags'),
                        "title" : "Tags",
                        "icon" :  Gitana.Utils.Image.buildImageUri('objects', 'tag', 16),
                        "current" : current == "menu-tags"
                    }
                    /*
                    {
                        "id" : "menu-branch-templates",
                        "link" : "#" ,
                        "title" : "Templates",
                        "icon" :  Gitana.Utils.Image.buildImageUri('objects', 'auditrecord', 16),
                        "current" : current == "menu-branch-templates"
                    },
                    {
                        "id" : "menu-branch-scripts",
                        "link" : "#" ,
                        "title" : "Scripts",
                        "icon" :  Gitana.Utils.Image.buildImageUri('objects', 'auditrecord', 16),
                        "current" : current == "menu-branch-scripts"
                    },
                    {
                        "id" : "menu-branch-rules",
                        "link" : "#" ,
                        "title" : "Rules",
                        "icon" :  Gitana.Utils.Image.buildImageUri('objects', 'auditrecord', 16),
                        "current" : current == "menu-branch-rules"
                    },

                    {
                        "id" : "menu-branch-logs",
                        "link" : "#" + self.LINK().call(self,self.branch(),"logs"),
                        "title" : "Logs",
                        "icon" :  Gitana.Utils.Image.buildImageUri('objects', 'log', 16),
                        "current" : current == "menu-branch-logs"
                    }
                    */
                    ]
                }]
            };
        },

        "Node" : function(self , current) {
            var defaultItem = "menu-node-dashboard";
            var current = current ? current : defaultItem;
            var menuItems = {
                "items": [{
                    "id": "menu-node-header",
                    "title": "Node",
                    "header": true,
                    "items": [{
                        "id" : defaultItem,
                        "link" : "#" + self.LINK().call(self,self.node()),
                        "title" : "Dashboard",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'node', 16),
                        "current" : current == defaultItem
                    },
                    {
                        "id" : "menu-associations",
                        "link" : "#" + self.LIST_LINK().call(self,'associations'),
                        "title" : "Associations",
                        "icon" :  Gitana.Utils.Image.buildImageUri('objects', 'association', 16),
                        "current" : current == "menu-associations"
                    },
                    {
                        "id" : "menu-attachments",
                        "link" : "#" + self.LIST_LINK().call(self,'attachments'),
                        "title" : "Attachments",
                        "icon" :  Gitana.Utils.Image.buildImageUri('objects', 'attachment', 16),
                        "current" : current == "menu-attachments"
                    },
                    {
                        "id" : "menu-node-audit-records",
                        "link" : "#" + self.LINK().call(self,self.node()) + "/auditrecords",
                        "title" : "Audit Records",
                        "icon" :  Gitana.Utils.Image.buildImageUri('objects', 'auditrecord', 16),
                        "current" : current == "menu-node-audit-records"
                    },
                    {
                        "id" : "menu-node-features",
                        "link" : "#" + self.LINK().call(self,self.node(),"features"),
                        "title" : "Features",
                        "icon" :  Gitana.Utils.Image.buildImageUri('objects', 'features', 16),
                        "current" : current == "menu-node-features"
                    },
                    {
                        "id" : "menu-node-security",
                        "link" : "#" + self.LINK().call(self,self.node(),"authorities","groups"),
                        "title" : "Security",
                        "icon" :  Gitana.Utils.Image.buildImageUri('security', 'security', 16),
                        "current" : current == "menu-node-security"
                    }]
                }]
            };

            if (self.node().hasFeature('f:translation')) {
                menuItems.items[0].push({
                    "id" : "menu-master-node",
                    "link" :    "#" + self.LIST_LINK().call(self, 'nodes') + self.node().getFeature('f:translation')['master-node-id'],
                    "title" : "Master Node",
                    "icon" :  Gitana.Utils.Image.buildImageUri('objects', 'translation', 16),
                    "current" : false
                });
            }

            if (self.node().hasFeature('f:multilingual')) {
                menuItems.items[0].push({
                    "id" : "menu-translations",
                    "link" : "#" + self.LIST_LINK().call(self, 'translations'),
                    "title" : "Translations",
                    "icon" :  Gitana.Utils.Image.buildImageUri('objects', 'translation', 16),
                    "current" : current == "menu-translations"
                });
            }

            return menuItems;
        },

        "Tag" : function(self , current) {
            var defaultItem = "menu-tag-dashboard";
            var current = current ? current : defaultItem;
            return {
                "items": [{
                    "id": "menu-tag-header",
                    "title": "Tag",
                    "header": true,
                    "items": [{
                        "id" : defaultItem,
                        "link" : "#" + self.LINK().call(self,self.node()),
                        "title" : "Dashboard",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'tag', 16),
                        "current" : current == defaultItem
                    },
                    {
                        "id" : "menu-tagged-nodes",
                        "link" : "#" + self.LINK().call(self,self.node()) + "/taggednodes",
                        "title" : "Tagged Nodes",
                        "icon" :  Gitana.Utils.Image.buildImageUri('objects', 'node-tagged', 16),
                        "current" : current == "menu-tagged-nodes"
                    }]
                }]
            };
        },

        "Folder" : function(self , current) {
            var defaultItem = "menu-folder-dashboard";
            var current = current ? current : defaultItem;
            return {
                "items": [{
                    "id": "menu-folder-header",
                    "title": "Folder",
                    "header": true,
                    "items": [{
                        "id" : defaultItem,
                        "link" : "#" + self.folderLink(self.node()),
                        "title" : "Dashboard",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'folder', 16),
                        "current" : current == defaultItem
                    },
                    {
                        "id" : "menu-folder-security",
                        "link" : "#" + self.folderLink(self.node(), "authorities","groups"),
                        "title" : "Security",
                        "icon" :  Gitana.Utils.Image.buildImageUri('security', 'security', 16),
                        "current" : current == "menu-folder-security"
                    },
                    {
                        "id" : "menu-attachments",
                        "link" : "#" + self.folderLink(self.node(), 'attachments'),
                        "title" : "Attachments",
                        "icon" :  Gitana.Utils.Image.buildImageUri('objects', 'attachment', 16),
                        "current" : current == "menu-attachments"
                    },
                    {
                        "id" : "menu-associations",
                        "link" : "#" + self.folderLink(self.node(),'associations'),
                        "title" : "Associations",
                        "icon" :  Gitana.Utils.Image.buildImageUri('objects', 'association', 16),
                        "current" : current == "menu-associations"
                    },
                    {
                        "id" : "menu-folder-features",
                        "link" : "#" + self.LIST_LINK().call(self,"folder-features"),
                        "title" : "Features",
                        "icon" :  Gitana.Utils.Image.buildImageUri('objects', 'features', 16),
                        "current" : current == "menu-folder-features"
                    },
                    {
                        "id" : "menu-folder-audit-records",
                        "link" : "#" + self.folderLink(self.node(), "auditrecords"),
                        "title" : "Audit Records",
                        "icon" :  Gitana.Utils.Image.buildImageUri('objects', 'auditrecord', 16),
                        "current" : current == "menu-folder-audit-records"
                    }]
                }]
            };
        },

        "Child" : function(self , current) {
            var defaultItem = "menu-child-dashboard";
            var current = current ? current : defaultItem;
            var menuItems = {
                "items": [{
                    "id" : "menu-child-header",
                    "title": "Node",
                    "header": true,
                    "items": [{
                        "id" : defaultItem,
                        "link" : "#" + self.folderLink(self.node()),
                        "title" : "Dashboard",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'node', 16),
                        "current" : current == defaultItem
                    },
                    {
                        "id" : "menu-node-security",
                        "link" : "#" + self.folderLink(self.node(), "authorities","groups"),
                        "title" : "Security",
                        "icon" :  Gitana.Utils.Image.buildImageUri('security', 'security', 16),
                        "current" : current == "menu-node-security"
                    },
                    {
                        "id" : "menu-attachments",
                        "link" : "#" + self.folderLink(self.node(), 'attachments'),
                        "title" : "Attachments",
                        "icon" :  Gitana.Utils.Image.buildImageUri('objects', 'attachment', 16),
                        "current" : current == "menu-attachments"
                    },
                    {
                        "id" : "menu-associations",
                        "link" : "#" + self.folderLink(self.node(), 'associations'),
                        "title" : "Associations",
                        "icon" :  Gitana.Utils.Image.buildImageUri('objects', 'association', 16),
                        "current" : current == "menu-associations"
                    },
                    {
                        "id" : "menu-node-features",
                        "link" : "#" + self.LIST_LINK().call(self,"child-features"),
                        "title" : "Features",
                        "icon" :  Gitana.Utils.Image.buildImageUri('objects', 'features', 16),
                        "current" : current == "menu-node-features"
                    },
                    {
                        "id" : "menu-node-audit-records",
                        "link" : "#" + self.folderLink(self.node(), "auditrecords"),
                        "title" : "Audit Records",
                        "icon" :  Gitana.Utils.Image.buildImageUri('objects', 'auditrecord', 16),
                        "current" : current == "menu-node-audit-records"
                    }]
                }]
            };

            if (self.node().hasFeature('f:multilingual')) {
                menuItems.items[0].push({
                    "id" : "menu-translations",
                    "link" : "#" + self.LIST_LINK().call(self, 'translations'),
                    "title" : "Translations",
                    "icon" :  Gitana.Utils.Image.buildImageUri('objects', 'translation', 16),
                    "current" : current == "menu-translations"
                });
            }

            return menuItems;
        },

        "Definition" : function(self , current) {
            var defaultItem = "menu-definition-dashboard";
            var current = current ? current : defaultItem;
            return {
                "items": [{
                    "id": "menu-definition-header",
                    "title": "Definition",
                    "header": true,
                    "items": [{
                        "id" : defaultItem,
                        "link" : "#" + self.LINK().call(self,self.definition()),
                        "title" : "Dashboard",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'definition', 16),
                        "current" : current == defaultItem
                    },
                    {
                        "id" : "menu-definition-forms",
                        "link" : "#" + self.LIST_LINK().call(self,'forms'),
                        "title" : "Forms",
                        "icon" :  Gitana.Utils.Image.buildImageUri('objects', 'forms', 16),
                        "current" : current == "menu-definition-forms"
                    }]
                }]
            };
        },

        "Type" : function(self , current) {
            var defaultItem = "menu-definition-dashboard";
            var current = current ? current : defaultItem;
            return {
                "items": [{
                    "id": "menu-definition-header",
                    "title": "Definition",
                    "header": true,
                    "items": [{
                        "id" : defaultItem,
                        "link" : "#" + self.LINK().call(self,self.definition()),
                        "title" : "Dashboard",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'definition', 16),
                        "current" : current == defaultItem
                    },
                    {
                        "id" : "menu-definition-forms",
                        "link" : "#" + self.LIST_LINK().call(self,'forms'),
                        "title" : "Forms",
                        "icon" :  Gitana.Utils.Image.buildImageUri('objects', 'forms', 16),
                        "current" : current == "menu-definition-forms"
                    },
                    {
                        "id" : "menu-definition-features",
                        "link" : "#" + self.LIST_LINK().call(self,'features'),
                        "title" : "Features",
                        "icon" :  Gitana.Utils.Image.buildImageUri('objects', 'features', 16),
                        "current" : current == "menu-definition-features"
                    }]
                }]
            };
        },

        "Form" : function(self , current) {
            var defaultItem = "menu-form-dashboard";
            var current = current ? current : defaultItem;
            return {
                "items": [{
                    "id": "menu-form-header",
                    "title": "Form",
                    "header": true,
                    "items": [{
                        "id" : defaultItem,
                        "link" : "#" + self.LINK().call(self,self.form()),
                        "title" : "Dashboard",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'form', 16),
                        "current" : current == defaultItem
                    }]
                }]
            };
        },

        "Changeset" : function(self , current) {
            var defaultItem = "menu-changeset-dashboard";
            var current = current ? current : defaultItem;
            return {
                "items": [{
                    "id": "menu-changeset-header",
                    "title": "Changeset",
                    "header": true,
                    "items": [{
                        "id" : defaultItem,
                        "link" : "#" + self.LINK().call(self,self.changeset()),
                        "title" : "Dashboard",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'changesets', 16),
                        "current" : current == defaultItem
                    }]
                }]
            };
        },

        "BillingProvider" : function(self , current) {
            var defaultItem = "menu-billing-provider-dashboard";
            var current = current ? current : "menu-billing-provider-dashboard";
            return {
                "items": [{
                    "id": "menu-billing-provider-header",
                    "title": "Billing Provider Configuration",
                    "header": true,
                    "items": [{
                        "id" : "menu-billing-provider-dashboard",
                        "link" : "#" + self.link(self.billingProvider()),
                        "title" : "Dashboard",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'billing-provider', 16),
                        "current" : current == defaultItem
                    }]
                }]
            };
        },

        "Directory" : function(self , current) {
            var defaultItem = "menu-directory-dashboard";
            var current = current ? current : "menu-directory-dashboard";
            return {
                "items": [{
                    "id": "menu-directory-header",
                    "title": "Directory",
                    "header": true,
                    "items": [{
                        "id" : "menu-directory-dashboard",
                        "link" : "#" + self.link(self.webhost()),
                        "title" : "Dashboard",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'directory', 16),
                        "current" : current == defaultItem
                    }]
                },{
                    "id": "menu-directory-objects",
                    "title": "Objects",
                    "header": true,
                    "items": [{
                        "id" : "menu-directory-identities",
                        "link" : "#" + self.link(self.directory(),'identities'),
                        "title" : "Identities",
                        "icon" :  Gitana.Utils.Image.buildImageUri('objects', 'identity', 16),
                        "current" : current == "menu-directory-identities"
                    },{
                        "id": "menu-directory-connections",
                        "link" : "#" + self.LIST_LINK().call(self,'connections'),
                        "title": "Connections",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'connection', 16),
                        "current" : current == "menu-directory-connections"
                    }]
                }]
            };
        },

        "Identity" : function(self , current) {
            var defaultItem = "menu-identity-dashboard";
            var current = current ? current : "menu-identity-dashboard";
            return {
                "items": [{
                    "id": "menu-identity-header",
                    "title": "Identity",
                    "header": true,
                    "items": [{
                        "id" : "menu-identity-dashboard",
                        "link" : "#" + self.link(self.identity()),
                        "title" : "Dashboard",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'identity', 16),
                        "current" : current == defaultItem
                    }]
                }]
            };
        },

        "Connection" : function(self , current) {
            var defaultItem = "menu-connection-dashboard";
            var current = current ? current : "menu-connection-dashboard";
            return {
                "items": [{
                    "id": "menu-connection-header",
                    "title": "Connection",
                    "header": true,
                    "items": [{
                        "id" : "menu-connection-dashboard",
                        "link" : "#" + self.link(self.connection()),
                        "title" : "Dashboard",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'connection', 16),
                        "current" : current == defaultItem
                    }]
                }]
            };
        },

        "Webhost" : function(self , current) {
            var defaultItem = "menu-webhost-dashboard";
            var current = current ? current : "menu-webhost-dashboard";
            return {
                "items": [{
                    "id": "menu-webhost-header",
                    "title": "Web Host",
                    "header": true,
                    "items": [{
                        "id" : "menu-webhost-dashboard",
                        "link" : "#" + self.link(self.webhost()),
                        "title" : "Dashboard",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'webhost', 16),
                        "current" : current == defaultItem
                    }]
                },{
                    "id": "menu-webhost-objects",
                    "title": "Objects",
                    "header": true,
                    "items": [{
                        "id" : "menu-webhost-auto-client-mappings",
                        "link" : "#" + self.link(self.webhost(),'autoclientmappings'),
                        "title" : "Auto Client Mappings",
                        "icon" :  Gitana.Utils.Image.buildImageUri('objects', 'auto-client-mapping', 16),
                        "current" : current == "menu-webhost-auto-client-mappings"
                    },
                    {
                        "id" : "menu-webhost-trusted-domain-mappings",
                        "link" : "#" + self.link(self.webhost(),'trusteddomainmappings'),
                        "title" : "Trusted Domain Mappings",
                        "icon" :  Gitana.Utils.Image.buildImageUri('objects', 'trusted-domain-mapping', 16),
                        "current" : current == "menu-webhost-trusted-domain-mappings"
                    }]
                }]
            };
        },

        "AutoClientMapping" : function(self , current) {
            var defaultItem = "menu-auto-client-mapping-dashboard";
            var current = current ? current : "menu-auto-client-mapping-dashboard";
            return {
                "items": [{
                    "id": "menu-auto-client-mapping-header",
                    "title": "Auto Client Mapping",
                    "header": true,
                    "items": [{
                        "id" : "menu-auto-client-mapping-dashboard",
                        "link" : "#" + self.link(self.autoClientMapping()),
                        "title" : "Dashboard",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'auto-client-mapping', 16),
                        "current" : current == defaultItem
                    }]
                }]
            };
        },

        "TrustedDomainMapping" : function(self , current) {
            var defaultItem = "menu-trusted-domain-mapping-dashboard";
            var current = current ? current : "menu-trusted-domain-mapping-dashboard";
            return {
                "items": [{
                    "id": "menu-trusted-domain-mapping-header",
                    "title": "Trusted Domain Mapping",
                    "header": true,
                    "items": [{
                        "id" : "menu-trusted-domain-mapping-dashboard",
                        "link" : "#" + self.link(self.trustedDomainMapping()),
                        "title" : "Dashboard",
                        "icon" : Gitana.Utils.Image.buildImageUri('objects', 'trusted-domain-mapping', 16),
                        "current" : current == defaultItem
                    }]
                }]
            };
        }

    };


})(jQuery);