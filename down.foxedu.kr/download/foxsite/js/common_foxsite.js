var toggleCommonFunc = function (opt) {
	opt.obj = opt.obj;

	$(opt.obj).toggleClass(opt.className);

	if ($(opt.obj).hasClass(opt.className)) {
		opt.hasClass()

	} else {
		opt.noneClass();
	}
}

if (jQuery) (function ($) {
	$.extend($.fn, {
		foxNavFunc: function () {
			var init = function (obj) {
				$foxnavarea = $('.foxsite-nav');
				$(document).on('click', function (e) {
					if (!$(e.target).closest($foxnavarea) || !$(e.target).is('.btn-foxsite-nav-open, .foxsite-nav .is-disabled')) {
						$foxnavarea.removeClass('is-open');
					}
				});
				$(document).on('click', '.btn-foxsite-nav-open', function () {
					$foxnavarea.addClass('is-open');
				});
				$(document).on('click', '.btn-foxsite-nav-close', function () {
					$foxnavarea.removeClass('is-open');
				});

				$(document).on('scroll', function (e) {
					$foxnavarea.removeClass('is-open');
				});
			};
			init(this);
			return $(this);
		}
	});
})(jQuery);

/* footer connect */
function footerConnect(event) {
	var option = event.srcElement.children[event.srcElement.selectedIndex];
	if (option.dataset.noAlert !== undefined) {
		return;
	}
	else if (option.dataset.alert !== undefined) {
		alert('준비중입니다.')
		return;
	}
	else {
		window.open(option.value, '_blank');
		return;
	}
}

$(window).on("load", function () {
	$('.foxsite-nav').foxNavFunc();
});