!function ($) {
    "use strict";
    
    /* SLIDETABS CLASS DEFINITION
     * ==================== */

    var SlideTabs = function(element, options) {
            
        this.element = $(element);
        this.options = $.extend({}, $.fn.slidetabs.defaults, options);

        var self = this,
                $container = self.element.find('.tab-slide-container'),
                $prevBtn = self.element.find('.tab-prev'),
                $nextBtn = self.element.find('.tab-next'),
                $ul = $container.find('> ul.nav-tabs'),
                resizeTimer = null;

        // Bind previous button click event
        $prevBtn.on( "click.slidetabs", function(e) {
            self.slide('prev');
            return false;
        });

        // Bind next button click event
        $nextBtn.on( "click.slidetabs", function(e) {
            self.slide('next');
            return false;
        });

        // Bind tab shown event
        $('a[data-toggle="tab"]', element).on('shown', function (e) {
            self.goTo($(e.target).parent().index());
        });

        // Bind dynamic resizing
        $(window).on( "resize.slidetabs", function() {
            resizeTimer && clearTimeout(resizeTimer);						
            resizeTimer = setTimeout(self.resize, 100);
        });	
    
        /**
         * Remove the tabs functionality and return back to the pre-init state 
         * 
         * @returns {undefined}
         */
        self.destroy = function() {
            $(window).off( "resize.slidetabs" );
        };
        
        /**
         * Open/activate a specific tab. 
         * 
         * To open the first tab you would use: .goTo(0) 
         * 
         * @param {integer} index - The index position of the tab to go to.
         * @returns {undefined}
         */
        self.goTo = function( index ) {
            var $li = $ul.find('li').eq(index), 
                move = 0,
                offset;
        
            if (!$li.length) return;
            
            $ul.is(':animated') && $ul.stop(true, true);
            
            offset = parseInt($ul.css('margin-left'));
            
            if ($li.position().left < 0) {
                move -= $li.position().left;
            }
            else if($li.position().left + $li.outerWidth(true) > $container.width()) {
                move += $container.width() - ($li.position().left + $li.outerWidth(true));
            }
            
            move && $ul.animate({'margin-left': (offset + move) + 'px'}, 300);
        };
        
        /**
         * Open/activate the previous tab. 
         * 
         * @returns {undefined}
         */
        self.goToPrev = function() {
            var prev = $ul.find('li.active').prev().find('> a');
            prev.length && prev.trigger('click');
        };
        
        /**
         * Open/activate the next tab. 
         * 
         * @returns {undefined}
         */
        self.goToNext = function() {
            var next = $ul.find('li.active').next().find('> a');
            next.length && next.trigger('click');
        };
        
        /**
         * Slide the previous tab into view. 
         * 
         * @returns {undefined}
         */
        self.slidePrev = function() {
            this.slide('prev');
        };
        
        /**
         * Slide the next tab into view. 
         * 
         * @returns {undefined}
         */
        self.slideNext = function() {
            this.slide('next');
        };
    
        self.slide = function( direction ) {
            var $lis = $ul.find('> li'),
                    viewspace = $container.width(),
                    length = $lis.length,
                    width = 0,
                    i = 0,
                    offset;
            
            $ul.is(':animated') && $ul.stop(true, true);
            
            offset = parseInt($ul.css('margin-left'));
    
            while(i < length) {
                width += $lis.eq(i).outerWidth(true);
                
                if (direction === 'prev' && width + offset >= 0) {
                    offset = -(width - $lis.eq(i).outerWidth(true));
                    break;
                }
            
                if (direction === 'next' && width + offset > viewspace) {
                    offset = viewspace - width;
                    break;
                }
            
                i++;
            }
        
            $ul.animate({'margin-left': offset + "px"}, 300);
        };
    
        self.resize = function() {
            var $lis = $ul.find('> li'), 
                width = 0;

            $lis.each(function() {
                width += $(this).outerWidth(true);
            });

            $ul.closest('.tab-container')[(width > $container.width() ? 'add' : 'remove') + 'Class']('tab-sliding-active');
        };
    };

    SlideTabs.prototype = {
        constructor: SlideTabs
    };


    /* SLIDETABS PLUGIN DEFINITION
     * ===================== */

    var old = $.fn.slidetabs;

    $.fn.slidetabs = function(option) {
        return this.each(function() {
            var $this = $(this), 
                data = $this.data('slidetabs'), 
                options = typeof option === 'object' && option;
            if (!data) $this.data('slidetabs', (data = new SlideTabs(this, options)));
            if (typeof option === 'string') data[option]();
        });
    };

    $.fn.slidetabs.defaults = {};

    $.fn.slidetabs.Constructor = SlideTabs;

    /* SLIDETABS NO CONFLICT
     * =============== */

    $.fn.slidetabs.noConflict = function() {
        $.fn.slidetabs = old;
        return this;
    };
  
}(window.jQuery);