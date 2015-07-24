;(function ( $, window, document, undefined ) {

	var autoheighter = "autoheighter";
	defaults = {};

	// The actual plugin constructor
	function Autoheighter( element, options ) {

		autoheighter = this;
		autoheighter.el = element;
		$autoheightContainer = $(autoheighter.el);
		autoheighter.options = $.extend( {}, defaults, options) ;
		autoheighter._defaults = defaults;
		autoheighter.maxHeight = 0;
		autoheighter.init();

	}

	Autoheighter.prototype = {

		init: function() {
			autoheighter._calculateMaxHeight();
			autoheighter._adjustAllHeightSizes();
		},

		_adjustAllHeightSizes: function() {
			$autoheightContainer.find(autoheighter.options.elemSelector).each(function() {
				$(this).height(autoheighter.maxHeight);
			});
		},

		_calculateMaxHeight: function() {
			$autoheightContainer.find(autoheighter.options.elemSelector).each(function() {
				if($(this).height() > autoheighter.maxHeight) {
					autoheighter.maxHeight = $(this).height();
				}
			});
		}

	};

	$.fn[autoheighter] = function ( options ) {
		return this.each(function () {
			if (!$.data(this, "plugin_" + autoheighter)) {
				$.data(this, "plugin_" + autoheighter,
					new Autoheighter( this, options ));
			}
		});
	};

})( jQuery, window, document );