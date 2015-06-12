$(document).ready(function(){

	// study link opens flyout
	if (location.hostname.search(/www\.uni-hohenheim\.de/) != -1) {
		jQuery('li.nav-section__level-1:nth-child(2) li.nav-section__level-2:nth-child(2) a').click(
			function (event) {
				event.preventDefault();
				jQuery('li.nav-section__level-1:nth-child(6) > a').click();
			}
		);
	}

	$('a[href="#nav-panel-search"], a[href="#nav-panel-login"]').click(function(e){
		var thePanel = $(this).attr('href');
		if ($(thePanel).hasClass('navigation-main__panel_state-active')){

			setTimeout(function(){
				$(thePanel).removeClass('navigation-main__panel_state-active');
				$('a[href="' + thePanel + '"]').removeClass('navigation-main__button_active');
			}, 100);
		}
	});

	$('.nav-section__level-1').each(function(){
		var childlessContents = '';
		var childlessCount = 0;
		var allItemsCount = 0;

		$(this).find('.nav-section__level-2').each(function(k, el) {
			allItemsCount++;
			if($(el).find('ul').length == 0) {
				childlessContents += $(el).html();
				childlessCount++;
			}
		});

		if (allItemsCount == 0) {
			$(this).find('a[data-nav-toggle="level-1"]').click(function() {
				location.href = $(this).attr('href');
			});
		}

		if (childlessContents != '' && allItemsCount > childlessCount) {
			$(this).find('.nav-section__level-2').each(function(k, el) {
				if($(el).find('ul').length == 0) {
					$(el).remove();
				}
			});
			$(this).find('div.nav-section__flyout.navigation-main__sub > ul').append('<li class="nav-section__level-2 bstrdchilds">' + childlessContents + '</li>');
		}

		var items = $(this).find('.nav-section__level-2');
		if (items.length < 4) {
			items.each(function() {
				$(this).addClass('nav-section__level-2_colspan-3');
			});
		}
		if (items.length  == 4) {
			items.each(function() {
				$(this).addClass('nav-section__level-2_colspan-25');
			});
		}
		if (items.length  > 4) {
			items.each(function() {
				$(this).addClass('nav-section__level-2_colspan-2');
			});
		}

	});

	if ($('#nav-panel-search').css('width') != '0px') {
		$('.navigation-main__button-search').addClass('navigation-main__button_active');
	}

	$('.panel-title a').addClass('collapsed');

	$('.nav-section__level-2').each(function () {
		if ($(this).find('ul').length == 0) {
			$(this).addClass('noborder');
		}
	});
});
