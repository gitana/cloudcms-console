(function($) {
    Gitana.Utils.Activity = {
        activityDetails: function(self, activity) {

            // Get Action Type
            var type = activity.getType();
            var typeText = type;
            switch (type) {
                case 'CREATE' :
                    typeText = 'created';
                    break;
                case 'UPDATE' :
                    typeText = 'modified';
                    break;
                case 'CREATE' :
                    typeText = 'deleted';
                    break;
                case 'JOIN' :
                    typeText = 'joined';
                    break;
            }

            var objectTypeId = activity.getObjectTypeId();
            if (objectTypeId == "stackAssignment") {
                objectTypeId = "stack";
            }

            var iconId = objectTypeId;
            if (objectTypeId == "autoClientMapping") {
                iconId = "auto-client-mapping";
            }
            if (objectTypeId == "authenticationGrant") {
                iconId = "authentication-grant";
            }
            if (objectTypeId == "billingProviderConfiguration") {
                iconId = "billing-provider";
            }

            var dataStoreTypeId = activity.getObjectDataStoreTypeId();
            var objectLink = "";

            switch (dataStoreTypeId) {
                case 'platform':
                    break;
                case 'repository':
                    objectLink += self.listLink('repositories') + activity.getObjectDataStoreId();
                    break;
                default:
                    objectLink += self.listLink(dataStoreTypeId + 's') + activity.getObjectDataStoreId();
                    break;
            }

            switch (objectTypeId) {
                case 'settings':
                    objectLink += "/" + objectTypeId + "/" + activity.getObjectId();
                    break;
                case 'association':
                    objectLink += "/branches/" + activity.get('branchId') + "/nodes/" + activity.getObjectId();
                    break;
                case 'node':
                    objectLink += "/branches/" + activity.get('branchId') + "/nodes/" + activity.getObjectId();
                    break;
                case 'branch':
                    objectLink += "/branches/" + activity.getObjectId();
                    break;
                case 'repository':
                    objectLink += "/repositories/" + activity.getObjectId();
                    break;
                default:
                    objectLink += "/" + objectTypeId.toLowerCase() + "s" + "/" + activity.getObjectId();
                    break;
            }

            var userLink = activity.getUserDomainId() ? "#" + self.listLink('domains') + activity.getUserDomainId() + "/users/" + activity.getUserId() : "javascript:void(0)";

            var itemText = "<span class='sprite-16 user-16'></span><a class='activity-link' href='" + userLink + "'>" + activity.getUserName() + "</a> " + typeText + " <span class='sprite-16 " + iconId + "-16'></span><a class='activity-link' href='" + "#" + objectLink + "'>" + activity.getObjectTitle() + "</a>";
            var plainItemText = typeText + " " +iconId + " <a class='activity-link' href='" + "#" + objectLink + "'>" + activity.getObjectTitle() + "</a>";


            if (activity.get('branchId')) {
                var repositoryLink = self.listLink('repositories') + activity.getObjectDataStoreId();
                var branchLink = repositoryLink + "/branches/" + activity.get('branchId');

                itemText += " under <span class='sprite-16 branch-16'></span><a class='activity-link' href='" + "#" + branchLink + "'>branch</a> of <span class='sprite-16 repository-16'></span><a class='activity-link' href='" + "#" + repositoryLink + "'>repository</a>";
                plainItemText += " under <a class='activity-link' href='" + "#" + branchLink + "'>branch</a> of <a class='activity-link' href='" + "#" + repositoryLink + "'>repository</a>";
            }

            if (activity.getObjectTypeId() == "stackAssignment") {
            }

            if (type == 'JOIN') {
                var otherLink = self.listLink(activity.getOtherDataStoreTypeId() + 's') + activity.getOtherDataStoreId();
                otherLink += "/" + activity.getOtherTypeId().toLowerCase() + "s" + "/" + activity.getOtherId();

                itemText = " <span class='sprite-16 " + activity.getOtherTypeId() + "-16'></span><a class='activity-link' href='" + "#" + otherLink + "'>" + activity.getOtherTitle() + "</a> " + typeText + " <span class='sprite-16 " + iconId + "-16'></span><a class='activity-link' href='" + "#" + objectLink + "'>" + activity.getObjectTitle() + "</a>" + " by <span class='sprite-16 user-16'></span><a class='activity-link' href='" + userLink + "'>" + activity.getUserName() + "</a> ";
                plainItemText = activity.getOtherTypeId() + " <a class='activity-link' href='" + "#" + otherLink + "'>" + activity.getOtherTitle() + "</a> " + typeText + " " + iconId + " <a class='activity-link' href='" + "#" + objectLink + "'>" + activity.getObjectTitle() + "</a>" + " by <a class='activity-link' href='" + userLink + "'>" + activity.getUserName() + "</a> ";
            }

            return {
                "iconId" : iconId,
                "typeText" : typeText,
                "objectLink" : objectLink,
                "itemText" : itemText,
                "plainItemText" : plainItemText
            }

        }
    }
})(jQuery);