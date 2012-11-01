/**
 * @preserve Galleria Gitana Theme 2011-08-01
 * http://galleria.aino.se
 *
 * Copyright (c) 2011, Aino
 * Licensed under the MIT license.
 */

/*global jQuery, Galleria */

Galleria.requires(1.25, 'This version of Gitana theme requires Galleria 1.2.5 or later');

(function($) {

Galleria.addTheme({
    name: 'gitana',
    author: 'Galleria',
    css: 'galleria.gitana.css',
    defaults: {
        transition: 'slide',
        thumbCrop:  'height',

        // set this to false if you want to show the caption all the time:
        _toggleInfo: true
    },
    init: function(options) {

        var _this = this;

        // add some elements
        this.addElement('info-link','info-close','preview-close');
        this.append({
            'info' : ['info-link','info-close'],
            'container' :['preview-close']
        });

        var previewClose = this.$('preview-close');
        previewClose.show();
        var _this = this;
        previewClose.bind( 'click', function() {
            _this.$('container').parent().remove();
        });

        // cache some stuff
        var info = this.$('info-link,info-close,info-text'),
            touch = Galleria.TOUCH,
            click = touch ? 'touchstart' : 'click';

        // show loader & counter with opacity
        this.$('loader').show().css('opacity', 0.4);
        this.$('counter').show();

        // some stuff for non-touch browsers
        if (! touch ) {
            this.addIdleState( this.get('image-nav-left'), { left:-50 });
            this.addIdleState( this.get('image-nav-right'), { right:-50 });
            //this.addIdleState( this.get('counter'), { opacity:0 });
        }

        // toggle info
        if ( options._toggleInfo === true ) {
            info.bind( click, function() {
                info.toggle();
                $('.galleria-info').toggleClass('galleria-info-show');
            });
        } else {
            info.show();
            this.$('info-link, info-close').hide();
        }

        // bind some stuff
        this.bind('thumbnail', function(e) {

            if (! touch ) {
                // fade thumbnails
                $(e.thumbTarget).css('opacity', 0.6).parent().hover(function() {
                    $(this).not('.active').children().stop().fadeTo(100, 1);
                }, function() {
                    $(this).not('.active').children().stop().fadeTo(400, 0.6);
                });

                if ( e.index === this.getIndex() ) {
                    $(e.thumbTarget).css('opacity',1);
                }
            } else {
                $(e.thumbTarget).css('opacity', this.getIndex() ? 1 : 0.6);
            }
        });

        this.bind('loadstart', function(e) {
            if (!e.cached) {
                this.$('loader').show().fadeTo(200, 0.4);
            }

            this.$('info').toggle( this.hasInfo() );

            $(e.thumbTarget).css('opacity',1).parent().siblings().children().css('opacity', 0.6);
        });

        this.bind('loadfinish', function(e) {
            this.$('loader').fadeOut(200);
        });

        this.$('container').delegate('div.galleria-counter', {
            'click' : function (e) {
                var current = $('span.galleria-current',this);
                var currentPageNum = current.html();
                var totalPages = parseInt($('span.galleria-total',this).html());
                var inputSpan = $('input:text',current);
                if (inputSpan.length == 0) {
                    inputSpan = '<input type="text" size="3" value="' + currentPageNum + '"/>';
                    current.empty().append(inputSpan);
                    $('input:text',current).focus();
                    $('input:text',current).blur( function(e) {
                        var newPageNum = $(this).val();
                        var pageIndex = parseInt(newPageNum);
                        if (pageIndex > 0 && pageIndex <= totalPages) {
                            if (currentPageNum != newPageNum) {
                                _this.show(pageIndex - 1);
                            }
                        }
                        $(this).remove();
                        current.html(currentPageNum);
                    });
                }
            }
        });
    }
});

}(jQuery));
