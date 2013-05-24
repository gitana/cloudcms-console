(function($) {
    Gitana.Apps.AbstractGitanaAppGadget = Gitana.CMS.AbstractGadget.extend(
    {
        constructor: function(id, ratchet) {
            this.base(id, ratchet);
        },

        requiredAuthorities: function() {
            return [];
        },

        isGitanaAdmin: function() {
            var user = this.user();
            return /*user.getName() == "admin"*/false;
        },

        getPermissionedObjectId: function(obj) {
            if (obj) {
                if (obj.getId) {
                    return obj.getId();
                }
            }
        },

        updateUserRoles: function(checkResults) {
            var userRoles = this.userRoles();
            $.each(checkResults, function(i, v) {
                if (!userRoles[v['permissionedId']]) {
                    userRoles[v['permissionedId']] = {};
                }
                userRoles[v['permissionedId']][v['permissionId']] = v['result'];
            });
            this.userRoles(userRoles);
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

        checkAuthorities: function(callback, providedAuthorities, isBulk) {
            var self = this;

            if (this.isGitanaAdmin()) {
                // Administrator gets pass
                callback(true);
            } else {
                var userRoles = this.userRoles();
                var userId = this.user().getDomainQualifiedId();
                var requiredAuthorities = providedAuthorities ? providedAuthorities : this.requiredAuthorities();
                if (requiredAuthorities.length == 0) {
                    // No required authorities
                    callback(true);
                } else {
                    var isEntitled = true;
                    var checks = {};
                    var objectLookup = {};
                    // Check cached version
                    $.each(requiredAuthorities, function(authorityIndex, authority) {
                        var object = authority['permissioned'];
                        if (object) {
                            var objectId = self.getPermissionedObjectId(object);
                            $.each(authority['permissions'], function(permissionIndex, permission) {
                                if (userRoles[objectId] != null && userRoles[objectId][permission] != null) {
                                    if (!userRoles[objectId][permission]) {
                                        isEntitled = false;
                                        return false;
                                    }
                                } else {
                                    if (!checks[objectId]) {
                                        checks[objectId] = [];
                                    }
                                    objectLookup[objectId] = object;

                                    var isDuplicate = false;
                                    $.each(checks[objectId], function(i,v) {
                                        if (v['permissionedId'] == objectId && v['principalId'] == userId && v['permissionId'] == permission) {
                                            isDuplicate = true;
                                            return false;
                                        }
                                    });

                                    if (!isDuplicate) {
                                        checks[objectId].push({
                                            "permissionedId": objectId,
                                            "principalId": userId,
                                            "permissionId": permission
                                        });
                                    }
                                }
                            });
                        }
                    });

                    if (!isEntitled && !isBulk) {
                        callback(isEntitled);
                        return isEntitled;
                    }

                    if ($.isEmptyObject(checks)) {
                        // Nothing to check
                        callback(isEntitled);
                        return isEntitled;
                    } else {
                        // Run bulk or single permission check service
                        Chain(this.platform()).trap(function(error) {
                            isEntitled = false;
                            self.userRoles(userRoles);
                            callback(isEntitled, error);
                            return false;
                        }).then(function() {
                            var _this = this;
                            isEntitled = true;
                            $.each(checks, function(objectId, check) {
                                var object = objectLookup[objectId];
                                var objectType = object.objectType ? object.objectType() : null;
                                if (objectType) {
                                    if (objectType == "Gitana.Platform") {
                                        $.each(check, function(checkItemIndex, checkItem) {
                                            //console.log('Checking..' + checkItem['principalId'] + "---" +checkItem['permissionId']);
                                            _this.checkPermission(checkItem['principalId'],checkItem['permissionId'],function(checkResult) {
                                                if (!userRoles[objectId]) {
                                                    userRoles[objectId] = {};
                                                }
                                                userRoles[objectId][checkItem['permissionId']] = checkResult;
                                                //console.log(JSON.stringify(userRoles,null,' '));
                                                if (!checkResult) {
                                                    isEntitled = false;
                                                }
                                            });
                                        });
                                    }

                                    if (objectType == "Gitana.SecurityUser" || objectType == "Gitana.SecurityGroup") {
                                        $.each(check, function(checkItemIndex, checkItem) {
                                            _this.subchain(object).checkPermission(checkItem['principalId'],checkItem['permissionId'],function(checkResult) {
                                                if (!userRoles[objectId]) {
                                                    userRoles[objectId] = {};
                                                }
                                                userRoles[objectId][checkItem['permissionId']] = checkResult;
                                                if (!checkResult) {
                                                    isEntitled = false;
                                                }
                                            });
                                        });
                                    }

                                    var handleCheckResult = function(checkResult) {
                                        $.each(check, function(checkItemIndex, checkItem) {
                                            if (!userRoles[objectId]) {
                                                userRoles[objectId] = {};
                                            }
                                            userRoles[objectId][checkItem['permissionId']] = checkResult[checkItemIndex]['result'];
                                            if (!checkResult[checkItemIndex]['result']) {
                                                isEntitled = false;
                                            }
                                        });
                                    };

                                    // data stores
                                    if (objectType == "Gitana.Application") {
                                        _this.checkApplicationPermissions(check, handleCheckResult);
                                    }
                                    if (objectType == "Gitana.Directory") {
                                        _this.checkDirectoryPermissions(check, handleCheckResult);
                                    }
                                    if (objectType == "Gitana.Domain") {
                                        _this.checkDomainPermissions(check, handleCheckResult);
                                    }
                                    if (objectType == "Gitana.Registrar") {
                                        _this.checkRegistrarPermissions(check, handleCheckResult);
                                    }
                                    if (objectType == "Gitana.Repository") {
                                        _this.checkRepositoryPermissions(check, handleCheckResult);
                                    }
                                    if (objectType == "Gitana.Vault") {
                                        _this.checkVaultPermissions(check, handleCheckResult);
                                    }
                                    if (objectType == "Gitana.Warehouse") {
                                        _this.checkWarehousePermissions(check, handleCheckResult);
                                    }

                                    // platform objects
                                    if (objectType == "Gitana.AuthenticationGrant") {
                                        _this.checkAuthenticationGrantPermissions(check, handleCheckResult);
                                    }
                                    if (objectType == "Gitana.Client") {
                                        _this.checkClientPermissions(check, handleCheckResult);
                                    }
                                    if (objectType == "Gitana.Stack") {
                                        _this.checkStackPermissions(check, handleCheckResult);
                                    }

                                    // repository objects
                                    if (objectType == "Gitana.Branch") {
                                        _this.subchain(self.repository()).checkBranchPermissions(check, handleCheckResult);
                                    }
                                    if (objectType == "Gitana.Node") {
                                        _this.subchain(self.branch()).checkNodePermissions(check, handleCheckResult);
                                    }
                                }
                            });
                            this.then(function() {
                                self.userRoles(userRoles);
                                //console.log('Final result of checking....' + isEntitled);
                                callback(isEntitled);
                            });
                        });
                    }
                }

            }
        },

        /**
         * Convenient methods for
         *
         * 1) Retrieving and optionally setting application's observables
         *
         * 2) Clearing application's observables
         */
        error: function() {
            return this._observable("error", arguments, {});
        },

        clearError: function(key) {
            this._clearObservable(key, "error");
        },

        user: function() {
            return this._observable("user", arguments);
        },

        clearUser: function() {
            this.observable("user").clear();
        },

        userRoles: function() {
            return this._observable("userRoles", arguments);
        },

        clearUserRoles: function() {
            this.observable("userRoles").clear();
        },

        authInfo: function() {
            return this._observable("authInfo", arguments);
        },

        clearAuthInfo: function() {
            this.observable("authInfo").clear();
        },

        tenantDetails: function() {
            return this._observable("tenantDetails", arguments);
        },

        clearTenantDetails: function() {
            this.observable("tenantDetails").clear();
        },

        listItemProp: function(obj, key, defaultVal) {
            if (defaultVal == null) {
                defaultVal = "";
            }
            if (obj.get(key) == null) {
                return defaultVal;
            } else {
                return obj.get(key);
            }
        },

        friendlyTitle: function(persistable) {

            //TODO: Change it once we add the getKey function to Application.
            if (persistable.objectType && persistable.objectType() == 'Gitana.Application' && !persistable.getTitle() && persistable.get('key')) {
                return persistable.get('key');
            }

            if (persistable.objectType && persistable.objectType() == 'Gitana.Team') {
                return persistable.getKey();
            }

            if (persistable.objectType && persistable.getTypeQName && persistable.getTypeQName() == 'n:person') {
                var personNodeTitle = "Person node for principal ";
                personNodeTitle +=  persistable.get('principal-domain') ? persistable.get('principal-domain') + "/" : "";
                personNodeTitle +=  persistable.get('principal-name');
                return personNodeTitle;
            }

            var title = this.base(persistable);
            if (persistable.getQName && persistable.getQName() == 'r:root' && title == persistable.getId()) {
                title = "Root Folder";
            }
            if (persistable.getTypeQName && persistable.getTypeQName() == 'n:tag' && title == persistable.getId()) {
                title = persistable.get('tag');
            }
            if (persistable.getPrincipalId && title == persistable.getId()) {
                title = persistable.getPrincipalId();
            }

            return title;
        },

        removeButton: function(id, key) {
            var _key = key ? key : "toolbar"
            var toolbar = this.toolbar(_key);
            if (toolbar.items[id]) {
                delete toolbar.items[id];
                this.toolbar(_key, toolbar);
            }
        },

        addButton: function(button, key) {
            //if (this._isEntitled(button['REQUIRED_ROLES'])) {
            var _key = key ? key : "toolbar"
            var toolbar = this.toolbar(_key);
            toolbar.items[button.id] = button;
            this.toolbar(_key, toolbar);
            //}
        },

        addButtons: function(newButtons, key) {
            var self = this;
            var _key = key ? key : "toolbar"
            var toolbar = this.toolbar(_key);
            if (! toolbar.items) {
                toolbar.items = {};
            }
            $.each(newButtons, function(i, v) {
                self.addButton(v, key);
            });
        },

        addGroupedButtons: function(configs, key) {
            var _key = key ? key : "toolbar"
            this.toolbar(_key, configs);
        },

        actionButtons: function(buttons) {
            var self = this;
            var entitledButtons = {};
            $.each(buttons, function(key, button) {
                //if (self._isEntitled(button['REQUIRED_ROLES'])) {
                    entitledButtons[key] = button;
                //}
            });
            return entitledButtons;
        },

        setupBreadcrumb: function() {
            return [
            ];
        },
        
        setupMenu: function() {
            
        },

        setupToolbar: function() {
            this.clearToolbar();
        },

        onClickDelete: function(object , objectType, link , img, observableName, titleFunction) {
            var self = this;

            var friendlyTitle = titleFunction ? titleFunction : self.friendlyTitle;

            var objectList = "<ul>" + "<li>" + friendlyTitle(object) + "</li>" + "</ul>";

            var dialog = $('<div><h2 class="dialog-delete-message">Are you sure you want to remove following ' + objectType +'?' + objectList + '</h2></div>');

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
                        height: 250,
                        width: 650,
                        modal: true,
                        buttons: {
                            "Remove": function() {
                                if (control.isValid(true)) {

                                    Gitana.Utils.UI.block("Deleting " + objectType + " ...");

                                    Chain(object).del().then(function() {

                                        if (observableName && self.observable(observableName).get()) {
                                            self.observable(observableName).clear();
                                        }

                                        if (link) {
                                            Gitana.Utils.UI.unblock(function() {
                                                self.app().run('GET',link);
                                            });
                                        } else {
                                            Gitana.Utils.UI.unblock();
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

        onClickDeleteMultiple: function(parentObject, objects , objectType, link , img , observableName, titleFunction) {
            var self = this;

            var friendlyTitle = titleFunction ? titleFunction : self.friendlyTitle;

            var objectList = "<ul>";

            $.each(objects, function(index, val) {

                objectList += "<li>" + friendlyTitle(val) + "</li>";

            });

            objectList += "</ul>";

            var dialog = $('<div><h2 class="dialog-delete-message">Are you sure you want to remove following ' + objectType +'(s) ?' + objectList + '</h2></div>');

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
                        height: 250,
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
                                            _this.subchain(obj).del().then(function() {
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

        //
        // Abstract methods to be overridden
        //
        handleUnauthorizedPageAccess: function(el ,error) {
        },

        link: function() {
        },

        listLink: function() {
        },

        LINK : function() {
            return this.link;
        },

        LIST_LINK : function() {
            return this.listLink;
        },

        targetObject: function() {
        },

        contextObject: function() {
            return this.targetObject();
        },

        loadContext: function(el, callback) {
        },

        setupPage: function(el) {
            return {
                "url" : el.route.uri,
                "timestamp" : new Date()
            }
        },

        /**
         * Conditionally pushes a pair item if it has a value.
         *
         * @param items
         * @param item
         *
         * @private
         */
        _pushItem: function(items, item)
        {
            //if (item && !Ratchet.isUndefined(item.value))
            if (item && item.value)
            {
                items.push(item);
            }
        },

        _updateItem: function(items, key, value, link)
        {
            if (items) {
                for (var i = 0; i < items.length; i++) {
                    if (items[i].key == key) {

                        if (value) {
                            items[i].value = value;
                        }
                        if (link) {
                            items[i].link = link;
                        }

                        break;
                    }
                }
            }
        }
    });

})(jQuery);