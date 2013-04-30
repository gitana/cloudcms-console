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
                    typeText = 'made changes to';
                    break;
                case 'DELETE' :
                    typeText = 'deleted';
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

            var itemText = "";
            if (activity.getUserTitle() && activity.getUserTitle() != activity.getUserName())
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

            // default way that we set up the activity string
            var firstLetter = objectTypeId.substring(0,1);
            var objectTypeName = firstLetter.toUpperCase() + objectTypeId.substring(1);

            if (activity.getObjectTypeId() == "stackAssignment___")
            {
                // TODO: "stackAssignment"
            }
            else if (type == 'JOIN' || type == "LEAVE")
            {
                var otherLink = self.listLink(activity.getOtherDataStoreTypeId() + 's') + activity.getOtherDataStoreId();
                otherLink += "/" + activity.getOtherTypeId().toLowerCase() + "s" + "/" + activity.getOtherId();

                var principalTypeNoun = (activity.getOtherTypeId() == "user" ? "User" : "Group");

                itemText += " ";
                if (type == "JOIN")
                {
                    itemText += "added the ";
                }
                else if (type == "LEAVE") {
                    itemText += "removed the ";
                }
                itemText += principalTypeNoun + " <a class='activity-link' href='" + "#" + otherLink + "'>" + activity.getOtherTitle() + "</a>";
                if (type == "JOIN") {
                    itemText += " to ";
                }
                else if (type == "LEAVE") {
                    itemText += " from ";
                }
                itemText += " the Team <a class='activity-link' href='" + "#" + objectLink + "'>" + activity.getObjectTitle() + "</a>";
            }
            else
            {
                // default
                itemText += " " + typeText + " the " + objectTypeName;
                itemText += " ";
                itemText += "<a class='activity-link' href='" + "#" + objectLink + "'>";
                itemText += activity.getObjectTitle();
                itemText += "</a>";
            }

            // if branch provided, add some additional info
            if (activity.get("branchId"))
            {
                var repositoryLink = self.listLink('repositories') + activity.getObjectDataStoreId();
                var branchLink = repositoryLink + "/branches/" + activity.get('branchId');

                var branchId = activity.get('branchId');
                var repositoryId = activity.getObjectDataStoreId();

                itemText += " in Branch <a class='activity-link' href='" + "#" + branchLink + "'>" + branchId + "</a> of Repository <a class='activity-link' href='" + "#" + repositoryLink + "'>" + repositoryId + "</a>";
            }

            var plainItemText = itemText;

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