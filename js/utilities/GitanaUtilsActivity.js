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
                case 'DELETE' :
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

            var userAvatarUri = "css/images/themes/clean/console/misc/avatar_small.png";
            if (activity["userAvatarAttachmentId"])
            {
                userAvatarUri = "/proxy/domains/" + activity.getUserDomainId() + "/principals/" + activity.getUserId() + "/attachments/" + activity["userAvatarAttachmentId"];
            }

            //var itemText = "<span class='sprite-16 user-16'></span><a class='activity-link' href='" + userLink + "'>" + activity.getUserName() + "</a> " + typeText + " <span class='sprite-16 " + iconId + "-16'></span><a class='activity-link' href='" + "#" + objectLink + "'>" + activity.getObjectTitle() + "</a>";
            //var itemText = "<span class='sprite-16 user-16'></span>";
            var itemText = "";
            if (activity.getUserTitle())
            {
                itemText += "<a class='activity-link' href='" + userLink + "'>";
                itemText += activity.getUserTitle();
                itemText += "</a>";
                itemText += "&nbsp;";
                itemText += "(";
                itemText += "<a class='activity-link' href='" + userLink + "'>";
                itemText += activity.getUserName();
                itemText += "</a>";
                itemText += ")";
            }
            else
            {
                itemText += "<a class='activity-link' href='" + userLink + "'>";
                itemText += activity.getUserName();
                itemText += "</a>";
            }

            var firstLetter = objectTypeId.substring(0,1);
            var objectTypeName = firstLetter.toUpperCase() + objectTypeId.substring(1);
            itemText += " " + typeText + " the " + objectTypeName;
            itemText += " ";
            //itemText += "<span class='sprite-16 " + iconId + "-16'></span>";
            itemText += "<a class='activity-link' href='" + "#" + objectLink + "'>";
            itemText += activity.getObjectTitle();
            itemText += "</a>";

            var plainItemText = typeText + " " +iconId + " <a class='activity-link' href='" + "#" + objectLink + "'>" + activity.getObjectTitle() + "</a>";


            if (activity.get('branchId')) {
                var repositoryLink = self.listLink('repositories') + activity.getObjectDataStoreId();
                var branchLink = repositoryLink + "/branches/" + activity.get('branchId');

                var branchId = activity.get('branchId');
                var repositoryId = activity.getObjectDataStoreId();

                itemText += " in branch <a class='activity-link' href='" + "#" + branchLink + "'>" + branchId + "</a> of repository <a class='activity-link' href='" + "#" + repositoryLink + "'>repositoryId</a>";
                plainItemText += " in branch <a class='activity-link' href='" + "#" + branchLink + "'>" + branchId + "</a> of repository <a class='activity-link' href='" + "#" + repositoryLink + "'>repositoryId</a>";
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
                "userAvatarUri": userAvatarUri,
                "iconId" : iconId,
                "typeText" : typeText,
                "objectLink" : objectLink,
                "itemText" : itemText,
                "plainItemText" : plainItemText
            }

        }
    }
})(jQuery);