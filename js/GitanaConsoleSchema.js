(function($) {

    Gitana.Console.Schema = {
        "Settings" : {
            "type" : "object",
            "properties" : {
                "id" : {
                    "type" : "object",
                    "title" : "Identifier",
                    "properties" : {
                        "scope" : {
                            "title" : "Scope",
                            "description" : "Enter settings scope.",
                            "type" : "string",
                            "required" : true
                        },
                        "key" : {
                            "title" : "Key",
                            "description" : "Enter settings key.",
                            "type" : "string",
                            "required" : true
                        }
                    }
                },
                "title" : {
                    "type" : "string"
                },
                "description" : {
                    "type" : "string"
                },
                "settings" : {
                    "title" : "Settings",
                    "description" : "Enter settings key/value pairs.",
                    "type" : "string"
                }
            }
        },
        "Application" : {
            "type" : "object",
            "properties" : {
                "key" : {
                    "type" : "string",
                    "required" : true
                },
                "applicationType": {
                    "type": "string",
                    "enum": ["web", "trusted"],
                    "required": true
                },
                "trustedScope": {
                    "type": "string",
                    "enum": ["webdav", "ftp", "cmis"],
                    "dependencies": "applicationType"
                },
                "trustedHost": {
                    "type": "string",
                    "dependencies": "applicationType"
                },
                "deployments": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "webhost": {
                                "type": "string"
                            },
                            "subdomain": {
                                "type": "string"
                            },
                            "domain": {
                                "type": "string"
                            },
                            "clientId": {
                                "type": "string"
                            },
                            "authGrantId": {
                                "type": "string"
                            }
                        }
                    },
                    "dependencies": "applicationType"
                },
                "source": {
                    "type": "object",
                    "properties": {
                        "type": {
                            "type": "string",
                            "enum": ["github"]
                        },
                        "public": {
                            "type": "boolean"
                        },
                        "uri": {
                            "type": "string"
                        }
                    },
                    "dependencies": "applicationType"
                }
            }
        },
        "Warehouse" : {
        },
        "PrincipalGroup" : {
            "type" : "object",
            "properties" : {
                "name" : {
                    "title": "Principal Name",
                    "description" : "Enter a unique group principal name using only numbers, letters, underscore and hyphen.",
                    "type" : "string",
                    "required" : true,
                    //"default" : "group-" + new Date().getTime(),
                    "pattern" : /^[0-9a-zA-Z-_]*$/
                },
                "title" : {
                    "type" : "string"
                },
                "description" : {
                    "type" : "string"
                },
                "file": {
                    "title": "Avatar",
                    "description" : "Select an image as your group avatar.",
                    "type": "string",
                    "format": "uri"
                }
            }
        },
        "PrincipalUser" : {
            "type" : "object",
            "properties" : {
                "name" : {
                    "title": "Principal Name",
                    "description" : "Enter a unique user principal name using only numbers, letters, underscore and hyphen.",
                    "type" : "string",
                    "required" : true,
                    //"default" : "user-" + new Date().getTime(),
                    "pattern" : /^[0-9a-zA-Z-_]*$/
                },
                "password" : {
                    "title": "Password",
                    "description": "Enter your password.",
                    "type" : "string",
                    "format" : "password"
                },
                "passwordVerify" : {
                    "title": "Verify Password",
                    "description": "Verify your password by entering it again.",
                    "type" : "string",
                    "format" : "password"
                },
                "firstName" : {
                    "title": "First Name",
                    "description" : "Enter your first name.",
                    "type" : "string"
                },
                "lastName" : {
                    "title": "Last Name",
                    "description" : "Enter your last name.",
                    "type" : "string"
                },
                "email" : {
                    "title": "Email",
                    "description" : "Enter your email address.",
                    "type" : "string",
                    "format": "email"
                },
                "companyName" : {
                    "title": "Company Name",
                    "description" : "Enter your company name.",
                    "type" : "string"
                },
                "file": {
                    "title": "Avatar",
                    "description" : "Select an image as your avatar.",
                    "type": "string",
                    "format": "uri"
                }
            }
        },
        "Tenant" : {
            "type": "object",
            "properties" : {
                "planKey" : {
                    "type" : "string",
                    "title" : "Plan",
                    "required" : true
                },
                "target" : {
                    "title": "Cloud CMS Principal User",
                    "type" : "string",
                    "required" : true
                },
                "paymentMethod" : {
                    "title": "Payment Method",
                    "type" : "object",
                    "properties" : {
                        "holderName" : {
                            "title" : "Holder Name",
                            "type" : "string",
                            "required" : false
                        },
                        "expirationMonth" : {
                            "title" : "Expiration Month",
                            "type" : "integer",
                            "required" : false,
                            "enum" : [1,2,3,4,5,6,7,8,9,10,11,12],
                            "default" : new Date().getMonth() + 1
                        },
                        "expirationYear" : {
                            "title" : "Expiration Year",
                            "type" : "integer",
                            "required" : false,
                            "enum" : [
                                new Date().getFullYear(),
                                new Date().getFullYear() + 1,
                                new Date().getFullYear() + 2,
                                new Date().getFullYear() + 3,
                                new Date().getFullYear() + 4,
                                new Date().getFullYear() + 5,
                                new Date().getFullYear() + 6,
                                new Date().getFullYear() + 7,
                                new Date().getFullYear() + 8,
                                new Date().getFullYear() + 9,
                                new Date().getFullYear() + 10
                            ],
                            "default" : new Date().getFullYear()
                        },
                        "number" : {
                            "title" : "Credit Card Number",
                            "type" : "string",
                            "required" : false
                        }
                    }
                },
                "dnsSlug" : {
                    "title": "DNS Slug",
                    "type" : "string",
                    "required" : false
                }
            }
        },
        "AuthenticationGrant" : {
            "type": "object",
            "properties" : {
                "clientId" : {
                    "title" : "Client ID",
                    "type" : "string",
                    "required" : true
                },
                /*
                 "principalDomainId" : {
                 "title" : "Principal Domain Id",
                 "type" : "string"
                 },
                 "principalId" : {
                 "title" : "Principal Id",
                 "type" : "string"
                 },
                 */
                "gitanaPrincipalUser" : {
                    "title" : "Cloud CMS Principal User",
                    "type" : "string",
                    "required" : true
                },
                "enabled" : {
                    "title" : "Authentication Grant",
                    "type" : "boolean",
                    "default" : true
                },
                "allowOpenDriverAuthentication" : {
                    "title" : "Allow Open Driver?",
                    "type" : "boolean",
                    "default" : false
                }
            }
        },
        "Client" : {
            "type": "object",
            "properties" : {
                "authorizedGrantTypes" : {
                    "title" : "Authorized Grant Types",
                    "type" : "string",
                    "required": true
                },
                "scope" : {
                    "title" : "Scope",
                    "type" : "string",
                    "required": true
                },
                "allowOpenDriverAuthentication" : {
                    "title" : "Open Driver Authentication",
                    "type" : "boolean",
                    "default" : true
                },
                "domainUrls" : {
                    "title" : "Domain Urls",
                    "type" : "array",
                    "items": {
                        "title": "Domain Url",
                        "type": "string",
                        "format": "uri"
                    }
                },
                "enabled" : {
                    "title" : "Client",
                    "type" : "boolean",
                    "default" : true
                }
            }
        },
        "Project" : {
            "type": "object",
            "properties" : {
                "title" : {
                    "type" : "string"
                },
                "description" : {
                    "type" : "string"
                }
            }
        },
        "Archive" : {
            "type": "object",
            "properties": {
                "group" : {
                    "title": "Group ID",
                    "type" : "string",
                    "required" : true
                    //"pattern" : /^([a-zA-Z0-9_]+(\.[a-zA-Z0-9_]+)*)$/
                },
                "artifact" : {
                    "title": "Artifact ID",
                    "type" : "string",
                    "required" : true
                    // TODO: we allow "-" in artifact value (i.e. gitana-demo is valid)... this RegEx doesn't?
                    //"pattern" : /^([a-zA-Z0-9_]+(\.[a-zA-Z0-9_]+)*)$/
                },
                "version" : {
                    "title": "Version",
                    "type" : "string",
                    "required" : true
                    //"pattern" : /^([0-9_]+(\.[0-9_]+)*)$/
                }
            }
        },
        "Features" : {
            "default" : {
                "title" : "Feature Configurations",
                "type" : "string",
                "default" : "{}"
            },
            "f:multilingual" : {
                "title" : "Multi-lingual Feature Configurations",
                "type" : "object",
                "default" : {
                    "edition": "edition1"
                },
                "properties" : {
                    "edition" : {
                        "title" : "Edition",
                        "type" : "string",
                        "required" : true
                    }
                }
            },
            "f:thumbnailable" : {
                "title" : "Thumbnail Feature Configurations",
                "type" : "array",
                "default" : {
                    "thumb50": {
                        "_key" : "thumb50",
                        "source" : "default",
                        "mimetype": "image/png",
                        "width": 50,
                        "height": 50
                    }
                },
                "items": {
                    "title": "Thumbnail Configuration",
                    "type": "object",
                    "properties" : {
                        "_key" : {
                            "title" : "Key",
                            "type" : "string",
                            "required" : true
                        },
                        "source" : {
                            "title" : "Source Id",
                            "type" : "string",
                            "required" : true,
                            "default" : "default"
                        },
                        "mimetype" : {
                            "title" : "Mime Type",
                            "type" : "string",
                            "required" : true
                        },
                        "width" : {
                            "title" : "Width",
                            "type" : "integer",
                            "default" : 50,
                            "minimum" : 1,
                            "required" : true
                        },
                        "height" : {
                            "title" : "Height",
                            "default" : 50,
                            "type" : "integer",
                            "minimum" : -2,
                            "required" : true
                        }
                    }
                }
            },
            "f:previewable" : {
                "title" : "Preview Feature Configurations",
                "type" : "object",
                "default" : {
                    "schedule": "asynchronous",
                    "previews": {
                        "default": {
                            "mimetype": "image/png",
                            "width": 1600,
                            "height": -1,
                            "prefix": "preview_",
                            "maxFileSize": 1572864
                        }
                    }
                },
                "properties" : {
                    "schedule" : {
                        "title" : "Generation Schedule",
                        "type" : "string",
                        "enum" : ["asynchronous","synchronous"],
                        "default" : "asynchronous"
                    },
                    "previews" : {
                        "type" : "array",
                        "items": {
                            "title": "Preview Configuration",
                            "type": "object",
                            "properties" : {
                                "_key" : {
                                    "title" : "Key",
                                    "type" : "string",
                                    "required" : true
                                },
                                "mimetype" : {
                                    "title" : "Mime Type",
                                    "type" : "string",
                                    "required" : true
                                },
                                "width" : {
                                    "title" : "Width",
                                    "type" : "integer",
                                    "default" : 50,
                                    "minimum" : 1,
                                    "required" : true
                                },
                                "height" : {
                                    "title" : "Height",
                                    "default" : 50,
                                    "type" : "integer",
                                    "minimum" : -2,
                                    "required" : true
                                },
                                "prefix" : {
                                    "title" : "Prefix",
                                    "type" : "string",
                                    "required" : true
                                },
                                "maxFileSize" : {
                                    "title" : "Maximum File Size",
                                    "default" : 50,
                                    "type" : "integer",
                                    "minimum" : 1572864
                                }
                            }
                        }
                    }
                }
            }
        },
        "RuleConditions" : {
            "default" : {
                "title" : "Conditions",
                "type" : "string",
                "default" : "{}"
            },
            "propertyEquals" : {
                "title" : "Property Equals",
                "type" : "object",
                "default" : {
                    "property" : "",
                    "value" : ""
                },
                "properties" : {
                    "property" : {
                        "title" : "Property Name",
                        "type" : "string",
                        "required" : true
                    },
                    "value" : {
                        "title" : "Value",
                        "type" : "any",
                        "required" : true
                    }
                }
            },
            "typeEquals" : {
                "title" : "Type Equals",
                "type" : "object",
                "default" : {
                    "type" : ""
                },
                "properties" : {
                    "type" : {
                        "title" : "Type",
                        "type" : "string"
                    }
                }
            }
        },
        "RuleActions" : {
            "executeScriptNode" : {
                "title" : "Execute Script",
                "type" : "object",
                "default" : {
                    "scriptNodeId" : "",
                    "scriptAttachmentId" : "default",
                    "methodName": "execute",
                    "args": [],
                    "model": {}
                },
                "properties" : {
                    "scriptNodeId" : {
                        "title" : "Script Node ID",
                        "type" : "string",
                        "required" : true
                    },
                    "scriptAttachmentId" : {
                        "title" : "Attachment ID",
                        "type" : "string",
                        "required" : true
                    },
                    "methodName": {
                        "title": "Method Name",
                        "type": "string",
                        "required": false
                    },
                    "args": {
                        "title": "Arguments",
                        "type": "array",
                        "required": false
                    },
                    "model": {
                        "title": "Model",
                        "type": "any",
                        "required": false
                    }
                }
            },
            "mapToList" : {
                "title" : "Type Equals",
                "type" : "object",
                "default" : {
                    "script" : "",
                    "scriptMimetype": "",
                    "scriptNodeId": "",
                    "reduce": false
                },
                "properties" : {
                    "script" : {
                        "title" : "Script",
                        "type" : "string",
                        "required": false
                    },
                    "scriptMimetype" : {
                        "title" : "Script Mimetype",
                        "type" : "string",
                        "required": true
                    },
                    "scriptNodeId" : {
                        "title" : "Script Node",
                        "type" : "string",
                        "required": false
                    },
                    "reduce" : {
                        "title" : "Call reduce function",
                        "type" : "boolean",
                        "required": false
                    }
                }
            }
        },
        "BillingProvider" : {
            "type": "object",
            "properties" : {
                "providerId" : {
                    "type" : "string",
                    "title" : "Billing Provider Id",
                    "required" : true,
                    "default" : "braintree"
                },
                "environment" : {
                    "title": "Environment",
                    "type" : "string"
                },
                "merchantId" : {
                    "title": "Merchant Id",
                    "type" : "string"
                },
                "publicKey" : {
                    "title": "Public Key",
                    "type" : "string"
                },
                "privateKey" : {
                    "title": "Private Key",
                    "type" : "string"
                }
            }
        },
        "Directory" : {
            "type": "object",
            "properties" : {
                "title" : {
                    "type" : "string"
                },
                "description" : {
                    "type" : "string"
                }
            }
        },
        "Identity" : {
            "type": "object",
            "properties" : {
                "encryptedPassword" : {
                    "title" : "Encrypted Password",
                    "type" : "string"
                },
                "authenticationEnabled" : {
                    "title" : "Authentication Enabled",
                    "type" : "string"
                }
            }
        },
        "Connection" : {
            "type": "object",
            "properties" : {
                "title": {
                    "title": "Title",
                    "type": "string"
                },
                "description": {
                    "title": "Description",
                    "type": "string"
                },
                "identity-id": {
                    "title": "Identity ID",
                    "type": "string"
                },
                "providerId": {
                    "title": "Provider ID",
                    "type": "string",
                    "enum": ["twitter", "facebook", "linkedin", "github", "netflix"]
                }
            }
        },
        "Webhost" : {
            "type": "object",
            "properties" : {
                "urlPatterns" : {
                    "title" : "Url Patterns",
                    "type" : "array",
                    "items": {
                        "title": "Url Pattern",
                        "type": "string",
                        "format": "uri"
                    }
                }
            }
        },
        "AutoClientMapping" : {
            "type": "object",
            "properties" : {
                "uri" : {
                    "title" : "Source URI",
                    "type" : "string",
                    "format": "uri",
                    "required": true
                },
                "clientKey" : {
                    "title" : "Client",
                    "type" : "string",
                    "required": true
                },
                "applicationId" : {
                    "title" : "Application",
                    "type" : "string",
                    "required": true
                }
            }
        },
        "TrustedDomainMapping" : {
            "type": "object",
            "properties" : {
                "host" : {
                    "title" : "Host",
                    "type" : "string",
                    "format": "uri",
                    "required": true
                },
                "scope" : {
                    "title" : "Scope",
                    "type" : "string",
                    "enum": ["webdav", "ftp", "cmis"],
                    "default": "webdav",
                    "required": true
                },
                "platformId" : {
                    "title" : "Platform ID",
                    "type" : "string",
                    "required": true
                }
            }
        },
        "Locale" : {
            "type" : "string",
            "title" : "Locale",
            "required" : true,
            "enum" :[
                "sq_AL",
                "ar_DZ",
                "ar_BH",
                "ar_EG",
                "ar_IQ",
                "ar_JO",
                "ar_KW",
                "ar_LB",
                "ar_LY",
                "ar_MA",
                "ar_OM",
                "ar_QA",
                "ar_SA",
                "ar_SD",
                "ar_SY",
                "ar_TN",
                "ar_AE",
                "ar_YE",
                "be_BY",
                "bg_BG",
                "ca_ES",
                "zh_CN",
                "zh_HK",
                "zh_SG",
                "zh_TW",
                "hr_HR",
                "cs_CZ",
                "da_DK",
                "nl_BE",
                "nl_NL",
                "en_AU",
                "en_CA",
                "en_IN",
                "en_IE",
                "en_MT",
                "en_NZ",
                "en_PH",
                "en_SG",
                "en_ZA",
                "en_GB",
                /*"en_US",*/
                "et_EE",
                "fi_FI",
                "fr_BE",
                "fr_CA",
                "fr_FR",
                "fr_LU",
                "fr_CH",
                "de_AT",
                "de_DE",
                "de_LU",
                "de_CH",
                "el_CY",
                "el_GR",
                "iw_IL",
                "hi_IN",
                "hu_HU",
                "is_IS",
                "in_ID",
                "ga_IE",
                "it_IT",
                "it_CH",
                "ja_JP",
                "ja_JP_JP",
                "ko_KR",
                "lv_LV",
                "lt_LT",
                "mk_MK",
                "ms_MY",
                "mt_MT",
                "no_NO",
                "no_NO_NY",
                "pl_PL",
                "pt_BR",
                "pt_PT",
                "ro_RO",
                "ru_RU",
                "sr_BA",
                "sr_ME",
                "sr_CS",
                "sr_RS",
                "sk_SK",
                "sl_SI",
                "es_AR",
                "es_BO",
                "es_CL",
                "es_CO",
                "es_CR",
                "es_DO",
                "es_EC",
                "es_SV",
                "es_GT",
                "es_HN",
                "es_MX",
                "es_NI",
                "es_PA",
                "es_PY",
                "es_PE",
                "es_PR",
                "es_ES",
                "es_US",
                "es_UY",
                "es_VE",
                "sv_SE",
                "th_TH",
                "th_TH_TH",
                "tr_TR",
                "uk_UA",
                "vi_VN"
            ]
        }
    };

    Gitana.Console.Options = {
        "Settings" : {
            "fields" : {
                "id" : {
                    "fields" : {
                        "scope" : {
                            "type" : "text",
                            "size" : 60
                        },
                        "key" : {
                            "type" : "text",
                            "size" : 60
                        }
                    }
                },
                "title" : {
                    "helper" : "Enter settings title."
                },
                "description": {
                    "helper" : "Enter settings description."
                },
                "settings" : {
                    "type" : "json",
                    "rows" : 15,
                    "cols" : 60
                }
            }
        },
        "Application" : {
            "fields" : {
                "title" : {
                    "type": "text",
                    "label": "Title",
                    "helper" : "Enter application title."
                },
                "description": {
                    "type": "textarea",
                    "label": "Description",
                    "helper" : "Enter application description."
                },
                "key" : {
                    "type" : "text",
                    "label": "Key",
                    "helper": "Enter a unique key for this application",
                    "size" : 60
                },
                "applicationType": {
                    "type": "select",
                    "label": "Type",
                    "optionLabels": ["Hosted Web Application", "Trusted API"]
                },
                "trustedScope": {
                    "type": "select",
                    "label": "Trusted Scope",
                    "optionLabels": ["WebDAV", "FTP", "CMIS"],
                    "dependencies": {
                        "applicationType": "trusted"
                    }
                },
                "trustedHost": {
                    "type": "text",
                    "label": "Trusted Host",
                    "dependencies": {
                        "applicationType": "trusted"
                    }
                },
                "deployments": {
                    "toolbarSticky": true,
                    "label": "Deployments",
                    "fields": {
                        "item": {
                            "fields": {
                                "webhost": {
                                    "type": "text",
                                    "label": "ID of Web Host"
                                },
                                "subdomain": {
                                    "type": "text",
                                    "label": "SubDomain"
                                },
                                "domain": {
                                    "type": "text",
                                    "label": "Domain"
                                },
                                "clientId": {
                                    "type": "text",
                                    "label": "ID of Client Object"
                                },
                                "authGrantId": {
                                    "type": "text",
                                    "label": "ID of Authentication Grant"
                                }
                            }
                        }
                    },
                    "dependencies": {
                        "applicationType": "web"
                    }
                },
                "source": {
                    "type": "object",
                    "label": "Source Control",
                    "fields": {
                        "type": {
                            "type": "text",
                            "label": "Type",
                            "optionLabels": ["GitHub"],
                            "helper": "Choose your source control type"
                        },
                        "public": {
                            "type": "checkbox",
                            "label": "Public",
                            "helper": "Is this a public repository?"
                        },
                        "uri": {
                            "type": "text",
                            "label": "URI"
                        }
                    },
                    "dependencies": {
                        "applicationType": "web"
                    }
                }

            }
        },
        "Warehouse" : {
            "fields" : {
                "title" : {
                    "helper" : "Enter warehouse title."
                },
                "description": {
                    "helper" : "Enter warehouse description."
                }
            }
        },
        "PrincipalGroup" :  {
            "fields": {
                "name" : {
                    "type":"text",
                    "size":60,
                    "hideInitValidationError": true
                },
                "title" : {
                    "helper" : "Enter group title."
                },
                "description": {
                    "helper" : "Enter group description."
                },
                "file": {
                    "type": "avatar",
                    "name": "avatarfile"
                }
            }
        },
        "PrincipalUser" :  {
            "fields": {
                "name" : {
                    "type":"text",
                    "size":60,
                    "hideInitValidationError": true
                },
                "password" : {
                    "size": 60
                },
                "passwordVerify" : {
                    "size": 60
                },
                "firstName" : {
                    "type":"text",
                    "size":60
                },
                "lastName" : {
                    "type":"text",
                    "size": 60
                },
                "email" : {
                    "size":60
                },
                "companyName" : {
                    "type":"text",
                    "size": 60
                },
                "file": {
                    "type": "avatar",
                    "name": "avatarfile"
                }
            }
        },
        "Tenant" : {
            "fields" : {
                "title" : {
                    "helper" : "Enter tenant title."
                },
                "description" : {
                    "helper" : "Enter tenant description."
                },
                "planKey" : {
                    "helper" : "Select plan.",
                    "type" : "select"
                },
                "target" : {
                    "helper" : "Pick Cloud CMS principal user or enter his domain qualified id.",
                    "type" : "gitanaprincipalpicker",
                    "size" : 60
                },
                "paymentMethod" : {
                    "helper": "Enter credit card payment information",
                    "type" : "object",
                    "fields" : {
                        "holderName" : {
                            "helper" : "Enter credit card holder name.",
                            "type" : "text",
                            "hideInitValidationError" : true
                        },
                        "expirationMonth" : {
                            "helper" : "Select credit card expiration month.",
                            "type" : "select",
                            "hideInitValidationError" : true,
                            "optionLabels" : ["January","February","March","April","May","June","July","August","September","October","November","December"]
                        },
                        "expirationYear" : {
                            "helper" : "Select credit card expiration year.",
                            "type" : "select",
                            "hideInitValidationError" : true
                        },
                        "number" : {
                            "helper" : "Enter credit card number.",
                            "type" : "text",
                            "hideInitValidationError" : true
                        }
                    }
                },
                "dnsSlug" : {
                    "helper" : "Choose a sub-domain slug for application URLs managed for this tenant"
                }
            }
        },
        "AuthenticationGrant" : {
            "fields" : {
                "title" : {
                    "helper" : "Enter authentication grant title."
                },
                "description" : {
                    "helper" : "Enter authentication grant description."
                },
                "clientId" : {
                    "helper" : "Select target client id.",
                    "type" : "select"
                },
                /*
                 "principalDomainId" : {
                 "helper" : "Select a domain for picking target user.",
                 "type" : "select",
                 "fieldClass" : "domain-picker"
                 },
                 "principalId" : {
                 "helper" : "Enter target user principal id or select it from the following user list.",
                 "fieldClass" : "target-principal-id"
                 },
                 */
                "gitanaPrincipalUser" : {
                    "helper" : "Pick Cloud CMS principal user or enter his domain qualified id.",
                    "type" : "gitanaprincipalpicker",
                    "size" : 60
                },
                "enabled" : {
                    "rightLabel" : "Enabled ?",
                    "helper" : "Check this option to enable the grant."
                },
                "allowOpenDriverAuthentication" : {
                    "rightLabel" : "Allow Open Driver?"
                }
            }
        },
        "Client" : {
            "fields" : {
                "authorizedGrantTypes" : {
                    "helper": "Select client authorized grant types.",
                    "type": "select",
                    "multiple" : true,
                    "fieldClass" : "authorized-grant-types",
                    "dataSource" : {
                        "authorization_code" : "Authorization Code",
                        "client_credentials" : "Client Credentials",
                        "implicit" : "Implicit",
                        "password" : "Password",
                        "refresh_token" : "Refresh Token"
                    }
                },
                "scope" : {
                    "helper": "Select client scope.",
                    "type": "select",
                    "multiple" : true,
                    "fieldClass" : "scope",
                    "dataSource" : {
                        "api" : "api"
                    }
                },
                "allowOpenDriverAuthentication" : {
                    "rightLabel": "Allowed?",
                    "helper" : "Check this option to allow open driver authentication."
                },
                "domainUrls" : {
                    "helper" : "Enter list of allowed domain URLs",
                    "fields" : {
                        "item": {
                            "helper": "Enter domain url."
                        }
                    }
                },
                "enabled" : {
                    "rightLabel" : "Enabled ?",
                    "helper" : "Check this option to enable the client."
                }
            }
        },
        "Project" : {
            "fields" : {
                "title" : {
                    "helper" : "Enter title."
                },
                "description": {
                    "helper" : "Enter description."
                }
            }
        },
        "Archive" : {
            "fields": {
                "group" : {
                },
                "artifact" : {
                },
                "version" : {
                }
            }
        },
        "Features" : {
            "default" : {
                "type" : "json",
                "rows" : 20,
                "cols" : 60,
                "helper" : "Enter feature configurations."
            },
            "f:multilingual" : {
                "type" : "object",
                "fields" : {
                    "edition" : {
                        "size" : 60,
                        "helper" : "Provide a unique default edition key."
                    }
                }
            },
            "f:thumbnailable" : {
                "type" : "map",
                "dependencies": {
                    "feature": "f:thumbnailable"
                },
                "fields": {
                    "item" : {
                        "fields" : {
                            "_key" : {
                                "size" : 60,
                                "helper" : "Provide a unique thumbnail key."
                            },
                            "source" : {
                                "size" : 60,
                                "helper" : "Provide source attachment id."
                            },
                            "mimetype" : {
                                "size" : 60,
                                "helper" : "Enter thumbnail mime-type."
                            },
                            "width" : {
                                "size" : 6,
                                "helper" : "Enter thumbnail width."
                            },
                            "height" : {
                                "size" : 6,
                                "helper" : "Enter thumbnail height."
                            }
                        }
                    }
                }
            },
            "f:previewable" : {
                "type" : "object",
                "dependencies": {
                    "feature": "f:previewable"
                },
                "fields" : {
                    "schedule" : {
                        "type" : "select",
                        "helper" : "Select generation schedule."
                    },
                    "previews" : {
                        "type" : "map",
                        "fields": {
                            "item" : {
                                "fields" : {
                                    "_key" : {
                                        "size" : 60,
                                        "helper" : "Provide a unique preview key."
                                    },
                                    "mimetype" : {
                                        "size" : 60,
                                        "helper" : "Enter thumbnail mime-type."
                                    },
                                    "width" : {
                                        "size" : 6,
                                        "helper" : "Enter thumbnail width."
                                    },
                                    "height" : {
                                        "size" : 6,
                                        "helper" : "Enter thumbnail height."
                                    },
                                    "prefix" : {
                                        "size" : 60,
                                        "helper" : "Provide a unique preview prefix."
                                    },
                                    "maxFileSize" : {
                                        "size" : 6,
                                        "helper" : "Enter maximum file size."
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        "RuleConditions": {
            "propertyEquals" : {
                "fields": {
                    "property": {
                    },
                    "value": {
                    }
                }
            },
            "typeEquals" : {
                "fields": {
                    "type": {
                    }
                }
            }
        },
        "RuleActions" : {
            "executeScriptNode" : {
                "fields": {
                    "scriptNodeId": {
                    },
                    "scriptAttachmentId": {
                    },
                    "methodName":{
                    },
                    "args": {
                    },
                    "model": {
                    }
                }
            },
            "mapToList" : {
                "fields": {
                    "script": {
                    },
                    "scriptMimetype": {
                    },
                    "scriptNodeId": {
                    },
                    "reduce": {
                    }
                }
            }
        },
        "BillingProvider" : {
            "type": "object",
            "fields" : {
                "providerId" : {
                    "type" : "text",
                    "helper" : "Enter a unique billing provider id.",
                    "hideInitValidationError" : true
                },
                "environment" : {
                    "helper": "Enter environment for billing provider configuration.",
                    "type" : "text"
                },
                "merchantId" : {
                    "helper": "Enter billing provider configuration merchant id.",
                    "type" : "text"
                },
                "publicKey" : {
                    "helper": "Enter billing provider configuration public key.",
                    "type" : "text"
                },
                "privateKey" : {
                    "helper": "Enter billing provider configuration private key.",
                    "type" : "text"
                }
            }
        },
        "Directory" : {
            "type": "object",
            "fields" : {
                "title" : {
                    "helper" : "Enter directory title."
                },
                "description": {
                    "helper" : "Enter directory description."
                }
            }
        },
        "Identity" : {
            "type": "object",
            "fields" : {
                "encryptedPassword" : {
                },
                "authenticationEnabled" : {
                    "helper" : "Whether this identity is allowed to authenticate to the server."
                }
            }
        },
        "Connection" : {
            "type": "object",
            "fields" : {
                "title": {
                },
                "description": {
                },
                "identity-id": {
                },
                "providerId": {
                    "optionLabels": ["Twitter", "Facebook", "LinkedIn", "Github", "NetFlix"]
                }
            }
        },
        "Webhost" : {
            "type": "object",
            "fields" : {
                "urlPatterns" : {
                    "helper" : "Enter list of url patterns",
                    "fields" : {
                        "item": {
                            "helper": "Enter url pattern."
                        }
                    }
                }
            }
        },
        "AutoClientMapping" : {
            "type": "object",
            "fields" : {
                "uri" : {
                    "helper" : "Enter source URI.",
                    "type" : "text",
                    "hideInitValidationError" : true
                },
                "clientKey" : {
                    "helper" : "Select client for auto client mapping.",
                    "type" : "select",
                    "hideInitValidationError" : true
                },
                "applicationId" : {
                    "helper" : "Select application for auto client mapping.",
                    "type" : "select",
                    "hideInitValidationError" : true
                }
            }
        },
        "TrustedDomainMapping" : {
            "type": "object",
            "fields" : {
                "host" : {
                    "type" : "text",
                    "hideInitValidationError" : true
                },
                "scope" : {
                    "type" : "select",
                    "optionLabels" : ["WebDAV", "FTP", "CMIS"],
                    "hideInitValidationError" : true
                },
                "platformId" : {
                    "type" : "text",
                    "hideInitValidationError" : true
                }
            }
        },
        "Locale" : {
            "type" : "select",
            "helper" : "Select your language locale.",
            "optionLabels" : [
                "sq_AL - Albanian (Albania)",
                "ar_DZ - Arabic (Algeria)",
                "ar_BH - Arabic (Bahrain)",
                "ar_EG - Arabic (Egypt)",
                "ar_IQ - Arabic (Iraq)",
                "ar_JO - Arabic (Jordan)",
                "ar_KW - Arabic (Kuwait)",
                "ar_LB - Arabic (Lebanon)",
                "ar_LY - Arabic (Libya)",
                "ar_MA - Arabic (Morocco)",
                "ar_OM - Arabic (Oman)",
                "ar_QA - Arabic (Qatar)",
                "ar_SA - Arabic (Saudi Arabia)",
                "ar_SD - Arabic (Sudan)",
                "ar_SY - Arabic (Syria)",
                "ar_TN - Arabic (Tunisia)",
                "ar_AE - Arabic (United Arab Emirates)",
                "ar_YE - Arabic (Yemen)",
                "be_BY - Belarusian (Belarus)",
                "bg_BG - Bulgarian (Bulgaria)",
                "ca_ES - Catalan (Spain)",
                "zh_CN - Chinese (China)",
                "zh_HK - Chinese (HongKong)",
                "zh_SG - Chinese (Singapore)",
                "zh_TW - Chinese (Taiwan)",
                "hr_HR - Croatian (Croatia)",
                "cs_CZ - Czech (Czech Republic)",
                "da_DK - Danish (Denmark)",
                "nl_BE - Dutch (Belgium)",
                "nl_NL - Dutch (Netherlands)",
                "en_AU - English (Australia)",
                "en_CA - English (Canada)",
                "en_IN - English (India)",
                "en_IE - English (Ireland)",
                "en_MT - English (Malta)",
                "en_NZ - English (New Zealand)",
                "en_PH - English (Philippines)",
                "en_SG - English (Singapore)",
                "en_ZA - English (South Africa)",
                "en_GB - English (United Kingdom)",
                /*"en_US - English (United States)",*/
                "et_EE - Estonian (Estonia)",
                "fi_FI - Finnish (Finland)",
                "fr_BE - French (Belgium)",
                "fr_CA - French (Canada)",
                "fr_FR - French (France)",
                "fr_LU - French (Luxembourg)",
                "fr_CH - French (Switzerland)",
                "de_AT - German (Austria)",
                "de_DE - German (Germany)",
                "de_LU - German (Luxembourg)",
                "de_CH - German (Switzerland)",
                "el_CY - Greek (Cyprus)",
                "el_GR - Greek (Greece)",
                "iw_IL - Hebrew (Israel)",
                "hi_IN - Hindi (India)",
                "hu_HU - Hungarian (Hungary)",
                "is_IS - Icelandic (Iceland)",
                "in_ID - Indonesian (Indonesia)",
                "ga_IE - Irish (Ireland)",
                "it_IT - Italian (Italy)",
                "it_CH - Italian (Switzerland)",
                "ja_JP - Japanese (Japan)",
                "ja_JP_JP - Japanese (Japan,JP)",
                "ko_KR - Korean (SouthKorea)",
                "lv_LV - Latvian (Latvia)",
                "lt_LT - Lithuanian (Lithuania)",
                "mk_MK - Macedonian (Macedonia)",
                "ms_MY - Malay (Malaysia)",
                "mt_MT - Maltese (Malta)",
                "no_NO - Norwegian (Norway)",
                "no_NO_NY - Norwegian (Norway,Nynorsk)",
                "pl_PL - Polish (Poland)",
                "pt_BR - Portuguese (Brazil)",
                "pt_PT - Portuguese (Portugal)",
                "ro_RO - Romanian (Romania)",
                "ru_RU - Russian (Russia)",
                "sr_BA - Serbian (Bosnia and Herzegovina)",
                "sr_ME - Serbian (Montenegro)",
                "sr_CS - Serbian (Serbia and Montenegro)",
                "sr_RS - Serbian (Serbia)",
                "sk_SK - Slovak (Slovakia)",
                "sl_SI - Slovenian (Slovenia)",
                "es_AR - Spanish (Argentina)",
                "es_BO - Spanish (Bolivia)",
                "es_CL - Spanish (Chile)",
                "es_CO - Spanish (Colombia)",
                "es_CR - Spanish (Costa Rica)",
                "es_DO - Spanish (Dominican Republic)",
                "es_EC - Spanish (Ecuador)",
                "es_SV - Spanish (ElSalvador)",
                "es_GT - Spanish (Guatemala)",
                "es_HN - Spanish (Honduras)",
                "es_MX - Spanish (Mexico)",
                "es_NI - Spanish (Nicaragua)",
                "es_PA - Spanish (Panama)",
                "es_PY - Spanish (Paraguay)",
                "es_PE - Spanish (Peru)",
                "es_PR - Spanish (PuertoRico)",
                "es_ES - Spanish (Spain)",
                "es_US - Spanish (United States)",
                "es_UY - Spanish (Uruguay)",
                "es_VE - Spanish (Venezuela)",
                "sv_SE - Swedish (Sweden)",
                "th_TH - Thai (Thailand)",
                "th_TH_TH - Thai (Thailand,TH)",
                "tr_TR - Turkish (Turkey)",
                "uk_UA - Ukrainian (Ukraine)",
                "vi_VN - Vietnamese (Vietnam)"
            ]
        }
    };

})(jQuery);