require.config({
    "baseUrl": ".",
    "paths": {
        "alpaca": "lib/alpaca/js/alpaca.js",
        "gitana": "lib/gitana/js/gitana.js",
        "jquery": "lib/jquery/jquery-1.6.2.min.js",
        "ratchet": "lib/ratchet/js/ratchet.js",
        "ratchet-tmpl": "lib/ratchet/js/ratchet-tmpl.js",
        "ratchet-gitana": "lib/ratchet/js/ratchet-gitana.js"
    },
    "shim": {
        "jquery.tmpl": ["jquery"],
        "ejs": []
    }
});

require([
    "jquery",

    "lib/jquery/jqplot/jquery.jqplot.js",
    "lib/jquery/jqplot/plugins/jqplot.barRenderer.js",
    "lib/jquery/jqplot/plugins/jqplot.categoryAxisRenderer.min.js",
    "lib/jquery/jqplot/plugins/jqplot.pointLabels.min.js",

    "lib/jquery/blockui/jquery.blockui.2.39.min.js",

    "lib/jquery/datatables/jquery.dataTables.1.8.1.min.js",
    "lib/jquery/datatables/TableTools.2.0.1.min.js",

    "lib/jquery/fileupload/jquery.iframe-transport.1.2.2.min.js",
    "lib/jquery/fileupload/jquery.fileupload.5.0.3-patched.js",
    "lib/jquery/fileupload/jquery.fileupload-ui.5.0.13-patched.js",

    "lib/jquery/galleria/galleria-1.2.5-patched.min.js",
    "lib/jquery/galleria/themes/gitana/galleria.gitana.js",

    "lib/jquery/notifications/jquery.notifications.min.js",

    "lib/jquery/uniform/jquery.uniform.1.7.5.min.js",

    "lib/jquery/validate/jquery.validate.1.8.1.min.js",

    "lib/jquery/tipsy/jquery.tipsy.1.0.0a.js",

    "lib/jquery/slidernav/jquery.slidernav.min.js",
    "lib/jquery/menu/jquery-menu.js",
    "lib/jquery/md5/jquery.md5.min.js",
    "lib/jquery/asmselect/jquery.asmselect-1.0.4a.min.js",
    "lib/jquery/xbreadcrumb/xbreadcrumbs.js",
    "lib/jquery/multiselect/jquery.multiselect.min.js",
    "lib/jquery/multiselect/jquery.multiselect.filter.min.js",
    "lib/jquery/stickysidebar/stickysidebar.jquery.js",
    "lib/jquery/elrte/elrte.min.js",
    "lib/jquery/cookie/jquery.cookie.js",
    "lib/alpaca/lib/jquery-ui-timepicker-addon.js",
    "lib/jquery/easyaccordion/easyAccordion-0.1.js",
    "alpaca",
    "gitana",
    "ratchet",
    "ratchet-tmpl",
    "ratchet-gitana",

    "js/fields/AttachmentField.js",
    "js/fields/AvatarField.js",
    "js/fields/ArchiveField.js",
    "js/fields/ElrteField.js",
    "js/fields/MultiNodesField.js",
    "js/fields/MultiFolderNodesField.js",
    "js/CMS.js",
    "js/Messages.js",
    "js/authenticators/UsernamePasswordAuthenticator.js",
    "js/AbstractGadget.js",
    "js/AbstractGitanaAppGadget.js",
    "js/utilities/GitanaUtilsDate.js",
    "js/utilities/GitanaUtilsImage.js",
    "js/utilities/GitanaUtilsRender.js",
    "js/utilities/GitanaUtilsUI.js",
    "js/reports/AbstractReport.js",
    "js/GitanaConsole.js",
    "js/AbstractGitanaConsoleGadget.js",

    "js/components/AbstractComponentGadget.js",
    "js/pages/AbstractGitanaPageGadget.js",

    "js/components/Alerts.js",
    "js/components/BarChart.js",
    "js/components/Plot.js",
    "js/components/Breadcrumb.js",
    "js/components/List.js",
    "js/components/Menu.js",
    "js/components/Notifications.js",
    "js/components/Pairs.js",
    "js/components/Searchbar.js",
    "js/components/Stats.js",
    "js/components/Tabs.js",
    "js/components/Toolbar.js",
    "js/components/Filter.js",

    "js/pages/AbstractDashboardPageGadget.js",
    "js/pages/AbstractListPageGadget.js",
    "js/pages/AbstractFormPageGadget.js",
    "js/pages/AbstractListFormPageGadget.js",
    "js/pages/AbstractEditFormPageGadget.js",
    "js/pages/AbstractNodeEditFormPageGadget.js",

    "js/fields/GitanaPrincipalPickerField.js",
    "js/fields/PlatformLogoField.js",

    "js/utilities/GitanaUtilsActivity.js",

    "js/pages/definition/objects/Feature.js",
    "js/pages/definition/maps/FeatureMap.js",

    "js/GitanaConsoleMenu.js",
    "js/GitanaConsoleBreadcrumb.js",
    "js/GitanaConsoleSchema.js",


    "js/components/Header.js",
    "js/components/LoginDetails.js",
    "js/components/TenantBar.js",

    "js/pages/importexport/AbstractExport.js",
    "js/pages/importexport/AbstractImport.js",

    "js/pages/authority/AbstractGitanaConsoleAuthorityList.js",
    "js/pages/authority/AbstractGitanaConsoleUserAuthorityList.js",
    "js/pages/authority/AbstractGitanaConsoleGroupAuthorityList.js",

    "js/pages/error/GitanaConsoleError.js",

    "js/pages/attachment/AbstractObjectAttachments.js",
    "js/pages/attachment/AbstractObjectAttachmentsManage.js",

    "js/pages/group/AbstractDomainGroup.js",

    "js/pages/team/AbstractObjectTeams.js",
    "js/pages/team/AbstractObjectTeam.js",
    "js/pages/team/AbstractObjectTeamAdd.js",
    "js/pages/team/AbstractObjectTeamEdit.js",

    "js/pages/AbstractDatastore.js",
    "js/pages/AbstractDatastoreAdd.js",
    "js/pages/AbstractDatastoreEdit.js",
    "js/pages/AbstractDatastoreExport.js",
    "js/pages/AbstractDatastoreImport.js",
    "js/pages/AbstractDatastores.js",

    "js/pages/AbstractDatastoreObject.js",
    "js/pages/AbstractDatastoreObjectAdd.js",
    "js/pages/AbstractDatastoreObjectEdit.js",
    "js/pages/AbstractDatastoreObjectExport.js",
    "js/pages/AbstractDatastoreObjects.js",


    "js/pages/personal/Dashboard.js",

    "js/pages/platform/Platform.js",
    "js/pages/platform/PlatformEdit.js",
    "js/pages/platform/PlatformLogs.js",

    "js/pages/platform/PlatformGroupAuthorities.js",
    "js/pages/platform/PlatformUserAuthorities.js",

    "js/pages/platform/PlatformTeams.js",
    "js/pages/platform/PlatformTeam.js",
    "js/pages/platform/PlatformTeamAdd.js",
    "js/pages/platform/PlatformTeamEdit.js",
    "js/pages/platform/PlatformExport.js",
    "js/pages/platform/PlatformImport.js",

    "js/pages/platform/PlatformActivities.js",
    "js/pages/personal/MyActivities.js",

    "js/pages/domain/Domains.js",
    "js/pages/domain/Domain.js",
    "js/pages/domain/DomainAdd.js",
    "js/pages/domain/DomainEdit.js",
    "js/pages/domain/DomainExport.js",
    "js/pages/domain/DomainImport.js",

    "js/pages/domain/DomainGroups.js",
    "js/pages/domain/DomainGroup.js",
    "js/pages/domain/DomainUsers.js",
    "js/pages/domain/DomainUser.js",
    "js/pages/domain/DomainUserAdd.js",
    "js/pages/domain/DomainUserEdit.js",
    "js/pages/domain/DomainUserExport.js",
    "js/pages/domain/DomainGroupAdd.js",
    "js/pages/domain/DomainGroupEdit.js",
    "js/pages/domain/DomainGroupExport.js",
    "js/pages/domain/DomainGroupImport.js",

    "js/pages/domain/DomainGroupAuthorities.js",
    "js/pages/domain/DomainUserAuthorities.js",

    "js/pages/job/Jobs.js",

    "js/pages/vault/Vaults.js",
    "js/pages/vault/Vault.js",
    "js/pages/vault/VaultAdd.js",
    "js/pages/vault/VaultEdit.js",
    "js/pages/vault/VaultTeams.js",
    "js/pages/vault/VaultTeam.js",
    "js/pages/vault/VaultTeamAdd.js",
    "js/pages/vault/VaultTeamEdit.js",
    "js/pages/vault/VaultExport.js",

    "js/pages/vault/Archives.js",
    "js/pages/vault/ArchiveAdd.js",
    "js/pages/vault/Archive.js",

    "js/pages/stack/Stacks.js",
    "js/pages/stack/StackAdd.js",
    "js/pages/stack/StackEdit.js",
    "js/pages/stack/Stack.js",
    "js/pages/stack/StackTeams.js",
    "js/pages/stack/StackTeam.js",
    "js/pages/stack/StackTeamAdd.js",
    "js/pages/stack/StackTeamEdit.js",
    "js/pages/stack/StackGroupAuthorities.js",
    "js/pages/stack/StackUserAuthorities.js",
    "js/pages/stack/StackAttachments.js",
    "js/pages/stack/StackAttachmentsManage.js",
    "js/pages/stack/StackLogs.js",
    "js/pages/stack/StackExport.js",

    "js/pages/application/Applications.js",
    "js/pages/application/ApplicationAdd.js",
    "js/pages/application/ApplicationEdit.js",
    "js/pages/application/Application.js",
    "js/pages/application/ApplicationTeams.js",
    "js/pages/application/ApplicationTeam.js",
    "js/pages/application/ApplicationTeamAdd.js",
    "js/pages/application/ApplicationTeamEdit.js",
    "js/pages/application/ApplicationImport.js",
    "js/pages/application/ApplicationExport.js",

    "js/pages/application/Settings.js",
    "js/pages/application/SettingsAdd.js",
    "js/pages/application/SettingsEdit.js",
    "js/pages/application/objects/Setting.js",
    "js/pages/application/maps/SettingMap.js",
    "js/pages/application/Setting.js",
    "js/pages/application/SettingsExport.js",

    "js/pages/warehouse/Warehouses.js",
    "js/pages/warehouse/Warehouse.js",
    "js/pages/warehouse/WarehouseAdd.js",
    "js/pages/warehouse/WarehouseEdit.js",
    "js/pages/warehouse/WarehouseTeams.js",
    "js/pages/warehouse/WarehouseTeam.js",
    "js/pages/warehouse/WarehouseTeamAdd.js",
    "js/pages/warehouse/WarehouseTeamEdit.js",
    "js/pages/warehouse/WarehouseExport.js",
    "js/pages/warehouse/WarehouseImport.js",

    "js/pages/warehouse/Sessions.js",
    "js/pages/warehouse/Session.js",
    "js/pages/warehouse/SessionExport.js",
    "js/pages/warehouse/InteractionReports.js",
    "js/pages/warehouse/InteractionReport.js",
    "js/pages/warehouse/InteractionPages.js",
    "js/pages/warehouse/InteractionPage.js",
    "js/pages/warehouse/InteractionPageExport.js",
    "js/pages/warehouse/InteractionUsers.js",
    "js/pages/warehouse/InteractionUser.js",
    "js/pages/warehouse/InteractionUserExport.js",
    "js/pages/warehouse/InteractionNodes.js",
    "js/pages/warehouse/InteractionNode.js",
    "js/pages/warehouse/InteractionNodeExport.js",
    "js/pages/warehouse/InteractionApplications.js",
    "js/pages/warehouse/InteractionApplication.js",
    "js/pages/warehouse/InteractionApplicationExport.js",

    "js/pages/registrar/Registrars.js",
    "js/pages/registrar/RegistrarAdd.js",
    "js/pages/registrar/RegistrarEdit.js",
    "js/pages/registrar/Registrar.js",
    "js/pages/registrar/RegistrarExport.js",

    "js/pages/tenant/Tenants.js",
    "js/pages/tenant/TenantAdd.js",
    "js/pages/tenant/TenantEdit.js",
    "js/pages/tenant/Tenant.js",
    "js/pages/tenant/TenantAttachments.js",
    "js/pages/tenant/TenantAttachmentsManage.js",

    "js/pages/plan/Plans.js",
    "js/pages/plan/PlanAdd.js",
    "js/pages/plan/PlanEdit.js",
    "js/pages/plan/Plan.js",
    "js/pages/plan/PlanExport.js",

    "js/pages/client/Clients.js",
    "js/pages/client/ClientAdd.js",
    "js/pages/client/ClientEdit.js",
    "js/pages/client/Client.js",
    "js/pages/client/ClientExport.js",

    "js/pages/authenticationgrant/AuthenticationGrants.js",
    "js/pages/authenticationgrant/AuthenticationGrant.js",
    "js/pages/authenticationgrant/AuthenticationGrantAdd.js",
    "js/pages/authenticationgrant/AuthenticationGrantEdit.js",

    "js/pages/authenticationgrant/AuthenticationGrantExport.js",

    "js/pages/billingprovider/BillingProviders.js",
    "js/pages/billingprovider/BillingProvider.js",
    "js/pages/billingprovider/BillingProviderAdd.js",
    "js/pages/billingprovider/BillingProviderEdit.js",
    "js/pages/billingprovider/BillingProviderExport.js",

    "js/pages/project/Projects.js",
    "js/pages/project/ProjectAdd.js",
    "js/pages/project/ProjectEdit.js",
    "js/pages/project/Project.js",
    "js/pages/project/ProjectExport.js",

    "js/pages/webhost/Webhosts.js",
    "js/pages/webhost/Webhost.js",
    "js/pages/webhost/WebhostAdd.js",
    "js/pages/webhost/WebhostEdit.js",
    "js/pages/webhost/WebhostExport.js",
    "js/pages/webhost/WebhostImport.js",

    "js/pages/webhost/AutoClientMappings.js",
    "js/pages/webhost/AutoClientMapping.js",
    "js/pages/webhost/AutoClientMappingAdd.js",
    "js/pages/webhost/AutoClientMappingEdit.js",
    "js/pages/webhost/AutoClientMappingExport.js",

    "js/pages/webhost/TrustedDomainMappings.js",
    "js/pages/webhost/TrustedDomainMapping.js",
    "js/pages/webhost/TrustedDomainMappingAdd.js",
    "js/pages/webhost/TrustedDomainMappingEdit.js",
    "js/pages/webhost/TrustedDomainMappingExport.js",

    "js/pages/directory/Directories.js",
    "js/pages/directory/Directory.js",
    "js/pages/directory/DirectoryAdd.js",
    "js/pages/directory/DirectoryEdit.js",
    "js/pages/directory/DirectoryExport.js",
    "js/pages/directory/DirectoryImport.js",

    "js/pages/directory/Identities.js",
    "js/pages/directory/Identity.js",
    "js/pages/directory/IdentityAdd.js",
    "js/pages/directory/IdentityEdit.js",
    "js/pages/directory/IdentityExport.js",

    "js/pages/directory/Connections.js",
    "js/pages/directory/Connection.js",
    "js/pages/directory/ConnectionAdd.js",
    "js/pages/directory/ConnectionEdit.js",
    "js/pages/directory/ConnectionExport.js",

    "js/pages/user/UserProfile.js",
    "js/pages/user/UserProfileEdit.js",

    "js/pages/repository/Repositories.js",
    "js/pages/repository/Repository.js",
    "js/pages/repository/RepositoryAdd.js",
    "js/pages/repository/RepositoryEdit.js",
    "js/pages/repository/RepositoryExport.js",
    "js/pages/repository/RepositoryImport.js",

    "js/pages/repository/RepositoryTeams.js",
    "js/pages/repository/RepositoryTeam.js",
    "js/pages/repository/RepositoryTeamAdd.js",
    "js/pages/repository/RepositoryTeamEdit.js",
    "js/pages/repository/RepositoryLogs.js",
    "js/pages/repository/RepositoryChangesets.js",
    "js/pages/repository/RepositoryChangeset.js",

    "js/pages/repository/RepositoryUserAuthorities.js",
    "js/pages/repository/RepositoryGroupAuthorities.js",

    "js/pages/branch/Branches.js",
    "js/pages/branch/Branch.js",
    "js/pages/branch/BranchAdd.js",
    "js/pages/branch/BranchEdit.js",

    "js/pages/branch/BranchLogs.js",

    "js/pages/branch/BranchUserAuthorities.js",
    "js/pages/branch/BranchGroupAuthorities.js",

    "js/pages/branch/BranchExport.js",
    "js/pages/branch/BranchImport.js",

    "js/pages/definition/Definitions.js",
    "js/pages/definition/Definition.js",
    "js/pages/definition/DefinitionAdd.js",
    "js/pages/definition/DefinitionEdit.js",
    "js/pages/definition/DefinitionExport.js",

    "js/pages/definition/Forms.js",
    "js/pages/definition/FormAdd.js",
    "js/pages/definition/Form.js",
    "js/pages/definition/FormEdit.js",
    "js/pages/definition/FormExport.js",

    "js/pages/definition/Features.js",
    "js/pages/definition/FeatureAdd.js",
    "js/pages/definition/FeatureEdit.js",
    "js/pages/definition/FeatureEditJSON.js",

    "js/pages/node/Nodes.js",
    "js/pages/node/Node.js",
    "js/pages/node/NodeAdd.js",
    "js/pages/node/NodeEdit.js",
    "js/pages/node/NodeAttachments.js",
    "js/pages/node/NodeAttachmentsManage.js",
    "js/pages/node/NodeAssociations.js",
    "js/pages/node/NodeTranslations.js",
    "js/pages/node/NodeAuditRecords.js",
    "js/pages/node/NodeExport.js",
    "js/pages/node/NodeImport.js",

    "js/pages/node/NodeFeatures.js",

    "js/pages/node/NodeFeatureEdit.js",
    "js/pages/node/NodeFeatureEditJSON.js",

    "js/pages/node/NodeFeatureAdd.js",

    "js/pages/node/NodePreview.js",

    "js/pages/node/NodeUserAuthorities.js",
    "js/pages/node/NodeGroupAuthorities.js",

    "js/pages/node/NodeJSONAdd.js",
    "js/pages/node/NodeTextAdd.js",
    "js/pages/node/NodeHTMLAdd.js",
    "js/pages/node/NodeFileUpload.js",

    "js/pages/node/AssociationAdd.js",

    "js/pages/node/NodeTranslationAdd.js",

    "js/pages/tag/Tags.js",
    "js/pages/tag/Tag.js",
    "js/pages/tag/TagEdit.js",
    "js/pages/tag/TagAdd.js",
    "js/pages/tag/TagNodes.js",

    "js/pages/folder/Folder.js",
    "js/pages/folder/FolderAttachments.js",
    "js/pages/folder/FolderAttachmentsManage.js",
    "js/pages/folder/FolderAssociations.js",
    "js/pages/folder/ChildNodeAdd.js",
    "js/pages/folder/FolderAdd.js",
    "js/pages/folder/ChildNode.js",
    "js/pages/folder/ChildNodeEdit.js",
    "js/pages/folder/ChildNodeAttachments.js",
    "js/pages/folder/ChildNodeAttachmentsManage.js",
    "js/pages/folder/ChildNodeAssociations.js",
    "js/pages/folder/ChildNodeAssociationAdd.js",
    "js/pages/folder/FolderEdit.js",
    "js/pages/folder/FolderExport.js",
    "js/pages/folder/FolderImport.js",
    "js/pages/folder/ChildNodeExport.js",
    "js/pages/folder/ChildNodeImport.js",

    "js/pages/folder/ChildNodePreview.js",
    "js/pages/folder/ChildNodeJSONAdd.js",
    "js/pages/folder/ChildNodeTextAdd.js",
    "js/pages/folder/ChildNodeHTMLAdd.js",

    "js/pages/folder/FolderFileUpload.js",

    "js/pages/folder/ChildNodeAuditRecords.js",
    "js/pages/folder/FolderAuditRecords.js",
    "js/pages/node/AssociationAdd.js",

    "js/pages/folder/ChildNodeGroupAuthorities.js",
    "js/pages/folder/ChildNodeUserAuthorities.js",

    "js/pages/folder/FolderGroupAuthorities.js",
    "js/pages/folder/FolderUserAuthorities.js",

    "js/pages/folder/ChildNodeFeatures.js",
    "js/pages/folder/ChildNodeFeatureEdit.js",
    "js/pages/folder/ChildNodeFeatureEditJSON.js",
    "js/pages/folder/ChildNodeFeatureAdd.js",

    "js/pages/folder/FolderFeatures.js",
    "js/pages/folder/FolderFeatureEdit.js",
    "js/pages/folder/FolderFeatureEditJSON.js",
    "js/pages/folder/FolderFeatureAdd.js",

    "js/components/GitanaPrincipalSelector.js"

], function()
{
    Gitana.CMS.load();
});


