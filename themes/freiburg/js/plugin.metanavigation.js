;(function ( $, window, document, undefined ) {

	var metaNavigation = "metaNavigation";
	defaults = {};

	// The actual plugin constructor
	function MetaNavigation( element, options ) {

		metanavigation = this;

		metanavigation.element = element;
		metanavigation.options = $.extend( {}, defaults, options) ;
		metanavigation._defaults = defaults;
		metanavigation._name = metaNavigation;
		metanavigation.activeMenuUid = false;
		metanavigation.previousMenuUid = false;
		metanavigation.activeMenuLink = null;
		metanavigation.clickListener = metanavigation.options.clickListener;
		metanavigation.controlSelector = metanavigation.options.controlSelector;
		metanavigation.metaLayer = metanavigation.options.metaLayer;
		metanavigation.metaContentContainer = metanavigation.options.metaContentContainer;
		metanavigation.init();

	}

	MetaNavigation.prototype = {

		init: function() {

			$(metanavigation.element).find(metanavigation.options.linkSelector).on(metanavigation.clickListener, function(e) {
				e.preventDefault();

				var clickedMenuUid = parseInt($(this).data().menuUid);
				var ajaxUrl = $(this).data().ajaxRequest;

				// TODO: Request content before to check if it exists
				// Note: Ajax is async, so we need to use a callback function or a promise

				if(!metanavigation.activeMenuUid) {
					metanavigation.activeMenuUid = clickedMenuUid;
					metanavigation._updateContent(ajaxUrl);
					metanavigation._openMetaLayer();
				}
				else if(clickedMenuUid !== metanavigation.activeMenuUid) {
					metanavigation.activeMenuUid = clickedMenuUid;
					metanavigation._closeMetaLayer();
					metanavigation._updateContent(ajaxUrl, 500);
					metanavigation._reopenDelayed(500);

				} else {
					metanavigation.activeMenuUid = false;
					metanavigation._closeMetaLayer();
				}

				metanavigation._setActiveClass();

			});

			$('.trigger-close a').on(metanavigation.clickListener, function(e) {
				metanavigation.activeMenuUid = false;
				metanavigation._closeMetaLayer();
			});


		},

		_setActiveClass: function() {

			$(metanavigation.element).find('a').each(function() {

				if(parseInt($(this).data().menuUid) === metanavigation.activeMenuUid) {
					$(this).addClass('active');
				} else {
					$(this).removeClass('active');
				}

			});

		},

		_reopenDelayed: function(ms) {
			setTimeout(
				function() {
					$(metanavigation.metaLayer).addClass('open-meta');
				}, ms);
		},

		_openMetaLayer: function() {
			$(metanavigation.metaLayer).addClass('open-meta');
		},

		_closeMetaLayer: function() {
			$(metanavigation.metaLayer).removeClass('open-meta');

		},

		_updateContent: function(url, delay) {
			setTimeout(
				function() {
					$.ajax({
						url: url,
						complete: function(data) {
							console.log(data.responseText);
							metanavigation.handleContentReplacement(data.responseText);
						}
					});
				}, delay);

		},

		handleContentReplacement: function (content) {
			$(metanavigation.metaContentContainer).html(content);
		}

	};

	$.fn[metaNavigation] = function ( options ) {
		return this.each(function () {
			if (!$.data(this, "plugin_" + metaNavigation)) {
				$.data(this, "plugin_" + metaNavigation,
					new MetaNavigation( this, options ));
			}
		});
	};

})( jQuery, window, document );