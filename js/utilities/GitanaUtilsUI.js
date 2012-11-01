(function($) {
    Gitana.Utils.UI = {
        /**
         * Used to launch a modal blocking dialog with message.
         *
         * @param message
         */
        block: function(message) {
            $.blockUI({
                css: {
                    'background': 'url("' + "css/images/themes/" + Gitana.Apps.THEME + '/console/misc/shine-effect.png") repeat-x scroll 0 0 rgba(33, 40, 44, 0.7)',
                    'border': '1px solid #25333C',
                    'border-radius': '5px 5px 5px 5px',
                    'box-shadow': '0 0 5px rgba(0, 0, 0, 0.5)',
                    'padding': '8px'
                },
                message: '<div class="block-content"><h1><img src="' + "css/images/themes/" + Gitana.Apps.THEME + '/console/misc/busy.gif" />   ' + message + '</h1></div>'
            });
        },

        /**
         * Closes the modal blocking dialog
         */
        unblock: function(callback) {
            if (callback) {
                $.unblockUI({
                    "onUnblock" : callback
                });
            } else {
                $.unblockUI();
            }
        },

        /**
         * Fixes jQuery UI data picker issue with DOM swapping by ratchet.
         */
        jQueryUIDatePickerPatch: function() {
            $('body').bind('swap', function(event, param) {
                $('.hasDatepicker').removeClass('hasDatepicker').datepicker();
                $.datepicker.initialized = false;
            });
        },

        /**
         * Provides cross-browser unified view of form controls.
         * @param el
         */
        uniform : function(el) {
            if (el.uniform && $('.alpaca-controlfield-file',el).length == 0) {
                // remove select
                $("input:checkbox, input:text, input:password, input:radio, input:file, textarea", el).uniform();
            }
        },

        /**
         * Generates box-style chrome for default theme.
         * @param el
         */
        contentBox : function(el) {
            $("body").undelegate(".block-border .block-header span", "click").delegate(".block-border .block-header span", "click", function() {
                if ($(this).hasClass('closed')) {
                    $(this).removeClass('closed');
                } else {
                    $(this).addClass('closed');
                }

                $(this).parent().parent().children('.block-content').slideToggle();
            });
        },

        /**
         * Generates auto-resize breadcrumb using xBreadcrumbs library.
         * @param el
         */
        processBreadcrumb: function(el) {
            $('body').bind('swap', function(event, param) {
                if ($('#breadcrumbs').length > 0) {
                    $("#breadcrumbs li:last-child").addClass("last-breadcrumb-item");
                    $('#breadcrumbs').xBreadcrumbs({
                    });
                }
            });
        },

        /**
         * Automate form with focus on the first field and process enter key.
         * @param form
         */
        autoForm: function(form, buttonId) {
            if (form.children && form.children[0] && form.children[0].field) {
                var fieldId = $(form.children[0].field).attr('id');
                $('body').bind('swap', function(event, param) {
                    $('#' + fieldId).focus();
                });
                /*
                $.each(form.children,function(i,child) {
                   child.field.keypress(function(e) {
                        if (e.which == 13) {
                            if (buttonId) {
                                $('#' + buttonId).click();
                            }
                        }
                    });
                });
                */
            }
        },

        /**
         * Beautifies alpaca form.
         *
         * @param form
         * @param auto
         */
        beautifyAlpacaForm: function(form, buttonId, auto) {
            Gitana.Utils.UI.uniform(form.getEl());
            form.getEl().css('border', 'none');
            if (auto) {
                Gitana.Utils.UI.autoForm(form,buttonId);
            }
        },

        /**
         * Beautifies alpaca form with ASM Select.
         *
         * @param form
         */
        beautifyAlpacaFormWithASMSelect: function(form, buttonId, auto) {
            var el = form.getEl();
            if (el.uniform && $('.alpaca-controlfield-file',el).length == 0) {
                $("input:checkbox, input:text, input:password, input:radio, input:file, textarea", el).uniform();
            }
            form.getEl().css('border', 'none');
            if (auto) {
                Gitana.Utils.UI.autoForm(form,buttonId);
            }
        },

        /**
         * Enable tooltip.
         *
         */
        enableTooltip: function() {
            $('.tipsy').remove();
            $('a[rel=tooltip-html]').tipsy({
                fade: true,
                html: true,
                live: true
            });
            $('div[rel=tooltip-html]').tipsy({
                fade: true,
                html: true,
                live: true
            });
            $('input[rel=tooltip-html]').tipsy({
                fade: true,
                html: true,
                live: true
            });
        }
    }
})(jQuery);