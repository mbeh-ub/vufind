// General settings and constants
var GLOBALS = {
	'OS': window.navigator.platform,
	'IS_MAC': window.navigator.platform.toUpperCase().indexOf('MAC')!==-1,
	'IS_WINDOWS': window.navigator.platform.toUpperCase().indexOf('WIN')!==-1,
	'IS_LINUX': window.navigator.platform.toUpperCase().indexOf('LINUX')!==-1,
	'TOUCH_DEVICE': !!(Modernizr.touch || window.navigator.userAgent.indexOf("Windows Phone") > 0),
	'CLICK_EVENT': 'click', // default click event. Will be replaced by touch event when on touch screens
	'IS_RETINA': window.devicePixelRatio > 1 || (window.matchMedia && window.matchMedia("(-webkit-min-device-pixel-ratio: 1.5),(-moz-min-device-pixel-ratio: 1.5),(min-device-pixel-ratio: 1.5)").matches),
	'SVG_SUPPORT': Modernizr.svg
}

$(function() {

	// globals
	if(GLOBALS.TOUCH_DEVICE) {
		GLOBALS.CLICK_EVENT = 'touchstart';
	}

	// prepare accordion
	//$(".dummy_faq_listing ul" ).accordion({
	//	header: '.head',
	//	heightStyle: 'content',
	//	navigation: false,
	//	collapsible: true
	//});

	//alert($(".accordion").data('start'));

	$(".accordion" ).accordion({
		header: '.accordion-head',
		heightStyle: 'content',
		active: false,
		navigation: false,
		collapsible: true
	});

	if($(".accordion").data('init-active') !== false) {
		$(".accordion" ).accordion("option", "active", 0);
	}

	$(".tabs" ).tabs();



	$('#mainNavigation').navbar({
		clickListener: GLOBALS.CLICK_EVENT,
		mainLevelContainer: '.level-0',
		mainLevelATag: '.level-0 > li > a',
		openStateClass: 'open-state',
		subLevelContainer: '.level-1'

	});

	$('.ui-trigger').on(GLOBALS.CLICK_EVENT, function(e) {
		e.preventDefault();
		var action = $(this).data('action');
		var target = $(this).data('target');
		var handlerClass = $(this).data('handler-class');

		if(action === 'close') {
			console.log(target);
			console.log(handlerClass);
			$(target).removeClass(handlerClass);
		}

	})

	$('#metaNavigation').metaNavigation({
		linkSelector: 'a',
		metaLayer: '#metaNavigationPanel',
		metaContentContainer: '.meta-content',
		controlSelector: '#pageHead',
		openClassSelector: 'open-meta',
		clickListener: GLOBALS.CLICK_EVENT
	});


	//var alphaPager = [];
	//$('.data-table').find('.alpha').each(function() {
	//	alphaPager.push($(this).text());
	//});
	//
	//alphaPager = $.unique(alphaPager);
	//$.each(alphaPager, function(index, value) {
	//	$('.table-controls ul').append('<li>' + value + '</li>');
	//})


	$('.data-table').DataTable({
		"pagingType": "simple",
		"pageLength": 25,
		"order": [[ 0, "asc" ]],
		"language": {
			"lengthMenu": "_MENU_ Zeilen pro Seite",
			"info": "Seite _PAGE_ von _PAGES_",
			"sSearch": "Suchen",
			"paginate": {
				"next": "Nächste",
				"previous": "Vorherige"
			}
		}
		//"columnDefs": [
		//	{ "visible": false, "targets": 0 }
		//]
	});


	$('.autoheight-container').autoheighter({
		'elemSelector': '.autoheight-element'
	});



	$('#toPageTop a').on(GLOBALS.CLICK_EVENT, function(e) {
		e.preventDefault();
		var scrolltarget = $(this).attr('href');
		$('html,body').animate({
			scrollTop: $(scrolltarget).offset().top
		}, 1000);
	});


	var lastScrollTop = 0;
	$(window).scroll(function(e){
		var st = $(this).scrollTop();
		//var bottomEdge = $(document).height() - $(window).height();
		var offset = $(window).height();
		if(st < offset) {
			$('#toPageTop').removeClass('show');
		} else {
			$('#toPageTop').addClass('show');
		}
		lastScrollTop = st;
	});





})