;(function ( $, window, document, undefined ) {

	var navbar = "navbar";
	defaults = {};

	// The actual plugin constructor
	function Navbar( element, options ) {

		navbar = this;

		navbar.el = element;
		$navbar = $(navbar.el);
		navbar.options = $.extend( {}, defaults, options) ;
		navbar._defaults = defaults;
		navbar._name = mainNavigation;
		navbar.clickListener = navbar.options.clickListener;
		navbar.currentMenuId = null;
		$navbar.currentMenu = null;
		navbar.openStateClass = navbar.options.openStateClass;
		navbar.init();

	}

	Navbar.prototype = {

		init: function() {
			navbar.prepareMainLevel(navbar.options.mainLevelATag);
		},

		prepareMainLevel: function(mainLevelATag) {
			$navbar.find(mainLevelATag).on(navbar.clickListener, function(e){

				var hasSub = $(this).parent().find(navbar.options.subLevelContainer).length;

				if(hasSub) {
					e.preventDefault();
					if(navbar.currentMenuId !== $(this).parent().data().menuId) {
						navbar.currentMenuId = $(this).parent().data().menuId;
						$navbar.currentMenu = $(this).parent();
						$navbar.currentMenu.addClass(navbar.openStateClass);
						navbar._resetInactiveMenus();
					} else {
						$navbar.currentMenu.removeClass(navbar.openStateClass);
						navbar.currentMenuId = null;
					}
				} else {
					navbar.currentMenuId = null;
					navbar._resetInactiveMenus();
				}

			})

		},

		_resetInactiveMenus: function() {


			$(navbar.options.mainLevelContainer).find('.'+navbar.openStateClass).each(function() {

				console.log("ICH SETZE ZURÜCK");

				if(navbar.currentMenuId != $(this).data().menuId) {
					$(this).removeClass(navbar.openStateClass);
				}

			});

		}


	};

	$.fn[navbar] = function ( options ) {
		return this.each(function () {
			if (!$.data(this, "plugin_" + navbar)) {
				$.data(this, "plugin_" + navbar,
					new Navbar( this, options ));
			}
		});
	};

})( jQuery, window, document );