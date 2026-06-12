/*
	Author	: hyojeong yang
	Date	: 2022-02-18
	Project	: 폭스클래스
*/
var toggleCommonFunc = function (opt) {
	opt.obj = opt.obj;

	$(opt.obj).toggleClass(opt.className);

	if ($(opt.obj).hasClass(opt.className)) {
		opt.hasClass()

	} else {
		opt.noneClass();
	}
}

//popup open
var popupOpen = function (target) {
	var $pop = $('[data-popup="' + target + '"]');
	$pop.show();
	$('.layer').hide();
	$('.dim').show();
	$('body').css({ 'overflow-y': 'hidden' });
}

var popupOpen2 = function (target) {
	var $pop = $('[data-popup="' + target + '"]'),
		$popBody = $pop.find('.pop-body');
	$pop.show().addClass('zindex-pop');
	$('.dim').show().addClass('zindex-dim');
	// if (scollvCheck($popBody) == true) {
	// 	$popBody.scrollTop(0);
	// }

}

//popup close
// var popupClose = function (target) {
// 	var $pop = $('[data-popup="' + target + '"]');
// 	$pop.fadeOut(200);
// 	$('body').css({ 'overflow-y': 'auto' });
// 	$('.dim, .layer').hide();
// }
var popClose = function (target) {
	var $pop = $('[data-popup="' + target + '"]');
	//$pop.fadeOut(200);
	if ($pop.hasClass('zindex-pop') == false) {
		$('body').css({ 'overflow-y': 'auto' });
		$('.dim:not(.zindex-dim)').hide();
		$pop.hide();
	}
	else if ($pop.hasClass('zindex-pop') == true) {
		$pop.removeClass('zindex-pop');
		$('.dim').removeClass('zindex-dim');
	}
}

//layer open
var layerOpen = function (target, el) {
	var $layer = $('[data-layer="' + target + '"]'),
		$el = $(el),
		offsetTop = $el.offset().top + ($el.height() / 2 - 20),
		offsetLeft = $el.offset().left + ($el.width() + 20);
	$layer.css({ "top": offsetTop, "left": offsetLeft }).fadeIn(200);
}

//layer close
var layerClose = function (target) {
	var $layer = $('[data-layer="' + target + '"]');
	$layer.fadeOut(200);
}

//토스트 메세지
var toastopen = false;
var toast = function (msg) {
	var $msg = msg;
	if (toastopen == false) {
		$('.toast').addClass('is-open', function () {
			$(this).find('div').html($msg);
			TweenMax.fromTo($(this), .4, { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1 });
			toastopen = true;
		});
		setTimeout(function () {
			$('.toast').removeClass('is-open', function () {
				TweenMax.fromTo($(this), .3, { yPercent: 0, opacity: 1 }, { yPercent: 100, opacity: 0 });
			});
			toastopen = false;
		}, 2500);
	}
}

if (jQuery) (function ($) {
	//common
	//$.extend($.fn, {
	//    Func: function () {
	//        var init = function (obj) {

	//        };
	//        $(this).each(function () {
	//            init(this);
	//        });
	//        return $(this);
	//    }
	//});

	$.extend($.fn, {
		quickSlideFunc: function () {
			var init = function (obj) {
				$(obj).slick({
					infinite: false,
					speed: 500,
					slidesToShow: 6,
					slidesToScroll: 1,
					/*infinite: true,*/
					responsive: [
						{
							breakpoint: 1279,
							settings: {
								slidesToShow: 4.5,
								slidesToScroll: 4,
								arrows: false
							}
						},
						{
							breakpoint: 767,
							settings: {
								slidesToShow: 4.5,
								slidesToScroll: 4,
								arrows: false
							}
						}]
				});
			};
			$(this).each(function () {
				init(this);
			});
			return $(this);
		}
	});

	$.extend($.fn, {
		itemSlideFunc: function () {
			var init = function (obj) {
				$(obj).slick({
					infinite: false,
					speed: 500,
					slidesToShow: 4,
					slidesToScroll: 1,
					/*infinite: true,*/
					responsive: [
						{
							breakpoint: 1279,
							settings: {
								slidesToShow: 3.5,
								slidesToScroll: 3,
								arrows: false
							}
						},
						{
							breakpoint: 767,
							settings: {
								slidesToShow: 2.2,
								slidesToScroll: 2,
								arrows: false
							}
						}]
				});
			};
			$(this).each(function () {
				init(this);
			});
			return $(this);
		}
	});

	//lyersmFunc
	$.extend($.fn, {
		layersmFunc: function () {
			var init = function (obj) {
				var $btn = $(obj),
					$layer = $('[data-layersm]');

				$(document).on('click', $btn, function (e) {
					var $target = $(e.target);
					if ($target.is($btn)) {
						var val = e.target.getAttribute("data-layersm-open"),
							$layer = $('[data-layersm="' + val + '"]'),
							$li = $target.closest('li'),
							offsetTop = $target.offset().top + 5,
							offsetLeft = $target.offset().left + ($layer.width() / 2) - 20;

						$li.addClass('is-active');
						$li.siblings('li').removeClass('is-active');
						$layer.css({ "top": offsetTop, "left": offsetLeft }).show();
					}
				});

				$(document).on("click", '[data-layersm] a, [data-layersm] button', function (e) {
					$btn.closest('li').siblings('li').removeClass('is-active');
					var $target = $(e.target).closest('[data-layersm]');
					$target.hide();
				});

				$(document).on('click', $layer, function (e) {
					if (!$layer.is(e.target) && $layer.has(e.target).length === 0 && !$btn.is(e.target)) {
						$btn.closest('li').siblings('li').removeClass('is-active');
						var $target = $('[data-layersm]');
						$target.hide();
					}
				});
			};
			init(this);
			return $(this);
		}
	});

	//popup
	$.extend($.fn, {
		popupFunc: function () {
			var init = function (obj) {
				var $btn = $('.popup .btn-close, .popup-img .btn-close, .popup-zoom .btn-close');
				$(document).on('click', $btn, function (e) {
					var $target = $(e.target);
					if ($target.is($btn)) {
						$pop = $target.closest('.popup, .popup-img, .popup-zoom');
						if ($pop.hasClass('zindex-pop') == true) {
							$pop.removeClass('zindex-pop').hide();
							$('.dim').removeClass('zindex-dim');
						}
						else {
							$pop.fadeOut(200);
							$('.dim').hide();
							$('body').css({ 'overflow-y': 'auto' });
						}
					}
				});

				$('.dim').on('click', function (e) {
					if ($(this).hasClass('zindex-dim') == true && $('.popup-alert').is(':visible') == false) {
						$('[data-popup].zindex-pop').removeClass('zindex-pop').hide();
						$(this).removeClass('zindex-dim');
					}
					//이중팝업 제외 dim hide
					else if ($(this).hasClass('zindex-dim') == false && $('.popup-alert').is(':visible') == false) {
						$('[data-popup]').fadeOut(200);
						$('body').css({ 'overflow-y': 'auto' });
						$(this).hide();
					}
				});
			};
			init(this);
			return $(this);
		}
	});

	//gnbFunc
	$.extend($.fn, {
		gnbFunc: function () {
			var init = function (obj) {
				var $gnb = $(obj),
					$dep1 = $gnb.find('>ul>li'),
					$frist = $gnb.find('>ul>li:first-child>a'),
					$last = $gnb.find('>ul>li:last-child>ul>li:last-child a');

				//mouseenter,
				$(document).on('mouseenter', '.site-gnb>ul>li', function (e) {
					$gnb.find('>ul>li').removeClass('is-active');
					TweenMax.fromTo($(this).find('ul'), .3, { opacity: 0, height: 0 }, { opacity: 1, height: "auto" });
					$(this).addClass('is-active');
				});

				$(document).on('mouseleave', '.site-gnb>ul>li', function () {
					$(this).removeClass('is-active');
				});

				//$dep1.on('mouseenter', function () {
				//	$gnb.find('>ul>li').removeClass('is-active');
				//	TweenMax.fromTo($(this).find('ul'), .3, { opacity: 0, height: 0 }, { opacity: 1, height: "auto" });
				//	$(this).addClass('is-active');
				//});

				//mouseleave
				//$dep1.on('mouseleave', function () {
				//	$(this).removeClass('is-active');
				//});

				//focusin
				//$dep1.on('focusin', function () {
				//	$gnb.find('>ul>li').removeClass('is-active');
				//	$(this).addClass('is-active');
				//});

				////첫링크 포커스 아웃
				//$frist.keyup(function (e) {
				//	if (e.shiftKey && e.keyCode == 9) {
				//		$gnb.find('>ul>li').removeClass('is-active');
				//	}
				//});

				////마지막링크 포커스 아웃
				//$last.keyup(function (e) {
				//	if (e.keyCode == '9') {
				//		$gnb.find('>ul>li').removeClass('is-active');
				//	}
				//});
			};
			init(this);
			return $(this);
		}
	});

	//menuFunc
	$.extend($.fn, {
		menuFunc: function () {
			var init = function (obj) {
				var $btn = $(obj);
				$(document).on('click', '.btn-menu', function (e) {
					toggleCommonFunc({
						obj: $('.menu-area'),
						className: 'is-active',
						hasClass: function (obj) {
							$('.dim-header').show();
						},
						noneClass: function (obj) {
							$('.dim-header').hide();
						}
					});
				});

				$(document).on('click', '.dim-header', function (e) {
					$('.menu-area').removeClass('is-active');
					$('.dim-header').hide();
				});
			};
			init(this);
			return $(this);
		}
	});

	//mMenuFunc
	$.extend($.fn, {
		mMenuFunc: function () {
			var init = function (obj) {
				var $depth1 = $('.m-site-menu').find('>ul>li>a');
				$depth1Area = $depth1.closest('li');

				$(document).on('click', '.m-btn-menu', function (e) {
					toggleCommonFunc({
						obj: $('.m-menu-area'),
						className: 'is-active',
						hasClass: function (obj) {
							$('body').css({ 'overflow-y': 'hidden' });
						},
						noneClass: function (obj) {
							$depth1Area.removeClass('is-active');
							$('body').css({ 'overflow-y': 'auto' });
						}
					});
				});

				$(document).on('click', '.m-site-menu > ul  >li > a', function (e) {
					$li = $(this).closest('li');
					toggleCommonFunc({
						obj: $li,
						className: 'is-active',
						hasClass: function (obj) {
							$li.siblings('li').removeClass('is-active');
						},
						noneClass: function (obj) {
						}
					});
				});
			};
			init(this);
			return $(this);
		}
	});


	//lnbFunc
	$.extend($.fn, {
		lnbFunc: function () {
			var init = function (obj) {
				var $depth1 = $('.lnb').find('>ul>li>a');
				$depth1Area = $depth1.closest('li');

				$(document).on('click', '.lnb > ul  >li > a', function (e) {
					$li = $(this).closest('li');
					toggleCommonFunc({
						obj: $li,
						className: 'is-active',
						hasClass: function (obj) {
							// $li.siblings('li').removeClass('is-active');
						},
						noneClass: function (obj) {
						}
					});
				});
			};
			init(this);
			return $(this);
		}
	});


	$.extend($.fn, {
		gschFunc: function () {
			var init = function (obj) {
				//$btn = $(obj),
				//	$btnClose = $('.btn-gsch-close'),
				//	$dim = $('.dim-header'),
				var gschOpen = function () {
						$('.gsch-area').addClass('is-active');
						$('.gsch').find('input').focus();
						$('.dim-header').show();
					},
					gschClose = function () {
						$('.gsch-area').removeClass('is-active');
						$('.gsch').find('input').blur();
						$('.dim-header').hide();
					};
				$(document).on("click", '.btn-gsch-open', function (e) {
					gschOpen();
				});

				$(document).on("click", '.btn-gsch-close, .dim-header', function (e) {
					gschClose();
				});
			};

			init(this);
			return $(this);
		}
	});

	//toggleFunc
	$.extend($.fn, {
		toggleFunc: function () {
			var init = function (obj) {
				var $btn = $(obj);
				$(document).on('click', $btn, function (e) {
					var $target = $(e.target);
					if ($target.is($btn)) {
						toggleCommonFunc({
							obj: $target,
							className: 'is-active',
							hasClass: function (obj) {

							},
							noneClass: function (obj) {

							}
						});
					}
				});
			};
			init(this);
			return $(this);
		}
	});

	//txtMoreFunc
	$.extend($.fn, {
		contMoreFunc: function () {
			var init = function (obj) {
				var $btn = $(obj);
				$(document).on('click', $btn, function (e) {
					var $target = $(e.target);
					if ($target.is($btn)) {
						toggleCommonFunc({
							obj: $target,
							className: 'is-active',
							hasClass: function (obj) {
								$target.html('접기');
								$target.closest('.cont-more-area').addClass('is-active');
							},
							noneClass: function (obj) {
								$target.html('더보기');
								$target.closest('.cont-more-area').removeClass('is-active');
							}
						});
					}
				});
			};
			init(this);
			return $(this);
		}
	});

	//tabs-noraml
	$.extend($.fn, {
		tabsNormalFunc: function () {
			var init = function (obj) {
				var $currentTab = $(obj).find("[class^='tabs-nav']").find('a.is-active').attr('href');
				$($currentTab).show();

				$(obj).find("[class^='tabs-nav']").find('a').on('click', function (e) {
					//var $li = $(this).parent('li');
					e.preventDefault();
					if ($(this).hasClass("is-active") == false) {
						$(obj).find("[class^='tabs-nav']").find('a').removeClass("is-active");
						$(this).addClass("is-active");
					}

					$(obj).find('.tabs-cont').hide();
					var $activeTab = $(this).attr('href');
					$($activeTab).show();
				});
			};
			$(this).each(function () {
				init(this);
			});
			return $(this);
		}
	});

	//tooltip
	$.extend($.fn, {
		tooltipFunc: function () {
			var init = function (obj) {
				$(document).on('click', '.btn-tooltip', function (e) {
					var $target = $(e.target),
						$area = $target.closest('.tooltip-area');

					if ($area.hasClass('is-active')) {
						$area.removeClass('is-active');
					}
					else {
						$('.tooltip-area').removeClass('is-active');
						$area.addClass('is-active');
					}
				});
				$(document).click(function (e) {
					if (!$(e.target).is('.btn-tooltip, .btn-tooltip *')) {
						$('.tooltip-area').removeClass('is-active');
					}
				});
			};
			init(this);
			return $(this);
		}
	});

	//thumbSel
	$.extend($.fn, {
		thumbSelFunc: function () {
			var init = function (obj) {
				var $btn = $(obj);
				$(document).on('click', $btn, function (e) {
					var $target = $(e.target);
					if ($target.is($btn)) {
						toggleCommonFunc({
							obj: $target,
							className: 'is-active',
							hasClass: function (obj) {
								$target.closest('li').siblings('li').find('.btn-thumb-sel').removeClass('is-active');
							},
							noneClass: function (obj) {
							}
						});
					}
				});
			};
			init(this);
			return $(this);
		}
	});

	//accordion
	$.extend($.fn, {
		accordionFunc: function () {
			var init = function (obj) {
				var $btn = $(obj).find('li').find('.btn-accordion-toggle');
				$(document).on('click', $btn, function (e) {
					var $target = $(e.target);
					if ($target.is($btn)) {
						$target.closest('li').siblings('li').removeClass('is-active');
						toggleCommonFunc({
							obj: $target.closest('li'),
							className: 'is-active',
							hasClass: function (obj) {
								//$(obj).removeClass('is-active');
								TweenMax.fromTo('.accordion-txt-area', .5, { opacity: 0 }, { opacity: 1 });
								$btn.html('열기');
								$target.html('닫기');
							},
							noneClass: function (obj) {
								TweenMax.fromTo('.accordion-txt-area', .5, { opacity: 1 }, { opacity: 0 });
								$btn.html('열기');
							}
						});
					}
				});
			};
			init(this);
			return $(this);
		}
	});

	$.extend($.fn, {
		etcFunc: function () {
			var init = function (obj) {
				$(document).on('click', '.btn-etc-fnc', function (e) {
					$area = $(this).closest('.etc-fnc-area');
					$el = $area.find('.etc-fnc');
					// $('.etc-fnc-area').removeClass('is-active');
					toggleCommonFunc({
						obj: $area,
						className: 'is-active',
						hasClass: function (obj) {
							$elArea = $el.closest('.etc-fnc-area');
							TweenMax.fromTo($el, .5, { opacity: 0 }, { opacity: 1 });
							$('.etc-fnc-area').not($elArea).removeClass('is-active');
						},
						noneClass: function (obj) {
							TweenMax.fromTo($el, .5, { opacity: 1 }, { opacity: 0 });
						}
					});
				});
				$(document).click(function (e) {
					if (!$(e.target).is('.btn-etc-fnc')) {
						$('.etc-fnc-area').removeClass('is-active');
					}
				});
			};
			init(this);
			return $(this);
		}
	});

	//headerFunc
	$.extend($.fn, {
		headerFunc: function () {
			var init = function (obj) {
				var headerH = $('.site-header').height();
				//console.log(headerH);
				//hedaer sticky
				var controllerSticky = new ScrollMagic.Controller();
				var sceneBtnSticky = new ScrollMagic.Scene({
					offset: 1
				}).setClassToggle('.site-header, #portal-top', "is-sticky").addTo(controllerSticky);
				//.on('enter', function () {
				//	$('.site-body').css({ 'padding-top': headerH + 10 });
				//}).on('leave', function () {
				//	$('.site-body').css({ 'padding-top': '0' });
				//});
			};
			init(this);
			return $(this);
		}
	});

	//mnvisualSlide
	$.extend($.fn, {
		mnvisualSlide: function () {
			var init = function (obj) {
				$(obj).slick({
					fade: true,
					autoplay: true,
					infinite: true,
					speed: 1000,
					autoplaySpeed: 2000,
					slidesToShow: 1,
					slidesToScroll: 1,
					dots: true
				});
			};
			init(this);
			return $(this);
		}
	});
	// $.extend($.fn, {
	// 	mnVisualSwiper: function () {
	// 		var init = function (obj) {
	// 			$area = $('.mn-visaul-swiper');
	// 			$obj = $(obj);
	// 			$slide = $(obj).find('.swiper-wrapper').find('.swiper-slide');
	// 			$progressbar = $area.find('.swiper-progress-bar');
	// 			$pagin = $area.find('.swiper-pagination');
	// 			$btnplay = $area.find('.swiper-playstop .btn-play');
	// 			$btnstop = $area.find('.swiper-playstop .btn-stop');
	// 			$btnprev = $area.find('.swiper-button-prev');
	// 			$btnnext = $area.find('.swiper-button-next'),
	// 				autoplay = true;

	// 			var swiper = new Swiper($obj, {
	// 				fadeEffect: { crossFade: true },
	// 				effect: 'fade',
	// 				//autoplayDisableOnInteraction: true,
	// 				speed: 500,
	// 				loop: true,
	// 				autoplay: {
	// 					delay: 7000,
	// 					disableOnInteraction: false // 버튼 클릭 시 자동 슬라이드 정지.
	// 				},
	// 				pagination: {
	// 					el: $pagin,
	// 					type: "fraction"
	// 				},
	// 				navigation: {
	// 					nextEl: $btnnext,
	// 					prevEl: $btnprev
	// 				},
	// 				on: {
	// 					init: function () {
	// 						$progressbar.addClass("animate");
	// 					},
	// 					slideChangeTransitionStart: function () {
	// 						/* color change */
	// 						var $color = $(obj).find('.swiper-slide-active').find('a').css('color');
	// 						$('.mn-visaul-swiper .swiper-pagination').css({ 'color': $color });
	// 						$progressbar.children().css({ 'background': $color });
	// 						$btnplay.css({ 'border-color': $color });
	// 						$btnplay.find('span').css({ 'border-left-color': $color });
	// 						$btnstop.css({ 'border-color': $color });
	// 						$btnstop.find('span').css({ 'border-color': $color });
	// 						$('.swiper-button-prev, .swiper-button-next, .swiper-button-prev span, .swiper-button-next span').css({ 'border-color': $color });

	// 						//progressbar animation
	// 						$progressbar.removeClass("animate");

	// 						//txt animation
	// 						$('.visual-txt-area').css({ 'opacity': 0 });
	// 						var tl = new TimelineMax();
	// 						var $el = $(obj).find('.swiper-slide-active .visual-txt-area');
	// 						tl.fromTo($el, .4, { xPercent: 50, opacity: 0 }, { xPercent: 0, opacity: 1 }, .4);
	// 					},
	// 					slideChangeTransitionEnd: function () {
	// 						if (autoplay) {
	// 							$progressbar.addClass("animate");
	// 						}
	// 						else {
	// 							$progressbar.removeClass("animate");
	// 						}
	// 					},
	// 					touchMove: function () {
	// 						var $color = $(obj).find('.swiper-slide-active').find('a').css('color');
	// 						$('.mn-visaul-swiper .swiper-pagination').css({ 'color': $color });
	// 						$progressbar.children().css({ 'background': $color });
	// 						$btnplay.css({ 'border-color': $color });
	// 						$btnplay.find('span').css({ 'border-left-color': $color });
	// 						$btnstop.css({ 'border-color': $color });
	// 						$btnstop.find('span').css({ 'border-color': $color });

	// 						$('.swiper-button-prev').css({ 'border-color': $color });
	// 						$('.swiper-button-next').css({ 'border-color': $color });
	// 						$('.swiper-button-prev').find('span').css({ 'border-color': $color });
	// 						$('.swiper-button-next').find('span').css({ 'border-color': $color });
	// 						$progressbar.removeClass("animate");

	// 						//mn-visual
	// 						$('.visual-txt-area').css({ 'opacity': 0 });

	// 						var tl = new TimelineMax();
	// 						var $el = $(obj).find('.swiper-slide-active .visual-txt-area');

	// 						tl.fromTo($el, .4, { xPercent: 50, opacity: 0 }, { xPercent: 0, opacity: 1 }, .4);
	// 					},
	// 					touchEnd: function () {
	// 						if (autoplay) {
	// 							$progressbar.addClass("animate");
	// 						}
	// 						else {
	// 							$progressbar.removeClass("animate");
	// 						}
	// 					}
	// 				}
	// 			});

	// 			//$btnprev.on('click', function () {
	// 			//    mnSwiperStop();
	// 			//});
	// 			//$btnnext.on('click', function () {
	// 			//    mnSwiperStop();
	// 			//});
	// 			$btnplay.on('click', function () {
	// 				mnSwiperStop();
	// 			});
	// 			$btnstop.on('click', function () {
	// 				mnSwiperPlay();
	// 			});

	// 			var changeStart = function () {
	// 				/* color change */
	// 				var $color = $(obj).find('.swiper-slide-active').find('a').css('color');
	// 				$('.mn-visaul-swiper .swiper-pagination').css({ 'color': $color });
	// 				$progressbar.children().css({ 'background': $color });
	// 				$btnplay.css({ 'border-color': $color });
	// 				$btnplay.find('span').css({ 'border-left-color': $color });
	// 				$btnstop.css({ 'border-color': $color });
	// 				$btnstop.find('span').css({ 'border-color': $color });

	// 				$('.swiper-button-prev, .swiper-button-next, .swiper-button-prev span, .swiper-button-next span').css({ 'border-color': $color });
	// 				//$('.swiper-button-next').css({ 'border-color': $color });
	// 				//$('.swiper-button-prev').find('span').css({ 'border-color': $color });
	// 				//$('.swiper-button-next').find('span').css({ 'border-color': $color });

	// 				//progressbar animation
	// 				$progressbar.removeClass("animate");

	// 				//txt animation
	// 				$('.visual-txt-area').css({ 'opacity': 0 });
	// 				var tl = new TimelineMax();
	// 				var $el = $(obj).find('.swiper-slide-active .visual-txt-area');
	// 				tl.fromTo($el, .4, { xPercent: 50, opacity: 0 }, { xPercent: 0, opacity: 1 }, .4);
	// 			}
	// 			var changeEnd = function () {
	// 				if (autoplay) {
	// 					$progressbar.addClass("animate");
	// 				}
	// 				else {
	// 					$progressbar.removeClass("animate");
	// 				}
	// 			}
	// 			var mnSwiperStop = function () {
	// 				autoplay = false;
	// 				swiper.autoplay.stop();
	// 				$btnplay.hide();
	// 				$btnstop.css({ 'display': 'block' });
	// 				$progressbar.removeClass("animate");
	// 			}

	// 			var mnSwiperPlay = function () {
	// 				autoplay = true;
	// 				$progressbar.removeClass("animate");
	// 				swiper.autoplay.start();
	// 				$btnstop.hide();
	// 				$btnplay.css({ 'display': 'block' });
	// 				$progressbar.addClass("animate");
	// 			}
	// 		}
	// 		init(this);
	// 		return $(this);
	// 	}
	// });
	$.extend($.fn, {
		mnIntroSwiper: function () {
			var init = function (obj) {
				const txt = $(obj).find('.intro-txt-swiper');
				const img = $(obj).find('.intro-img-swiper');
				// Swiper1 - 텍스트 슬라이드
				const infoSwiper1 = new Swiper('.intro-txt-swiper', {
					effect: 'fade',
					fadeEffect: {
						crossFade: true
					},
					loop: true,
					speed: 1000,
					autoplay: {
						delay: 3000,
						disableOnInteraction: false,
					},
					pagination: {
						el: '.swiper-pagination',
						clickable: true
					},
					navigation: {
						nextEl: '.swiper-button-next',
						prevEl: '.swiper-button-prev',
					},
				});

				// Swiper2 - 이미지 슬라이드
				const infoSwiper2 = new Swiper('.intro-img-swiper', {
					effect: 'fade',
					fadeEffect: {
						crossFade: true
					},
					touchRatio: 0
				});
				infoSwiper1.on('slideChange', function () {
					infoSwiper2.slideTo(this.realIndex);
				});
				// Swiper Sync Plugin 초기화
				// infoSwiper1.controller.control = infoSwiper2;
				// infoSwiper2.controller.control = infoSwiper1;
			};
			init(this);
			return $(this);
		}
	});
	$.extend($.fn, {
		mnCurriculumSwiper: function () {
			var init = function (obj) {
				const reviewSwiper = new Swiper('.curriculum-swiper', {
					slidesPerView: 3,
					spaceBetween: 30,
					autoHeight: false,
					breakpoints: {
						0: {
							slidesPerView: 1.2,
							spaceBetween: 8,
						},
						768: {
							slidesPerView: 2.5,
							spaceBetween: 20,
						},
						1280: {
							slidesPerView: 3,
							spaceBetween: 30,
						},
					},
				});
			};
			init(this);
			return $(this);
		}
	});
	$.extend($.fn, {
		mnReviewSwiper: function () {
			var init = function (obj) {
				const reviewSwiper = new Swiper('.review-swiper', {
					centeredSlides: true,
					spaceBetween: 20,
					loop: true,
					loopAdditionalSlides: 1,
					speed: 1000,
					autoplay: true,
					navigation: {
						prevEl: '.swiper-button-prev',
						nextEl: '.swiper-button-next'
					},
				});
			};
			init(this);
			return $(this);
		}
	});

	//beforeMnCuration
	$.extend($.fn, {
		bmnCurationFunc: function () {
			var init = function (obj) {
				//mn-particle
				//function particlePosition() {
				//	var divs = $('.curation-list').find('li');
				//	var winWidth = $('.curation-list').width();
				//	var winHeight = $('.curation-list').height();

				//	for (var i = 0; i < divs.length; i++) {
				//		var thisDiv = divs[i];
				//		var thisDivW = $(thisDiv).width();
				//		var thisDivH = $(thisDiv).height();

				//		randomTop = getRandomNumber(0, winHeight);
				//		randomLeft = getRandomNumber(0, winWidth);

				//		if (randomLeft > (winWidth / 2) && randomTop > (winHeight / 2)) {
				//			thisDiv.style.top = randomTop - thisDivH + "px";
				//			thisDiv.style.left = randomLeft - thisDivW + "px";
				//		}
				//		else if (randomLeft > (winWidth / 2)) {
				//			thisDiv.style.top = randomTop + "px";
				//			thisDiv.style.left = randomLeft - thisDivW + "px";
				//		}
				//		else if (randomTop > (winHeight / 2)) {
				//			thisDiv.style.top = randomTop - thisDivH + "px";
				//			thisDiv.style.left = randomLeft + "px";
				//		}
				//		else {
				//			thisDiv.style.top = randomTop + "px";
				//			thisDiv.style.left = randomLeft + "px";
				//		}

				//	}
				//}

				//function getRandomNumber(min, max) {
				//	return Math.floor(Math.random() * (max - min) + min);
				//}

				/*particlePosition();*/
				var particles = Particles.init({
					selector: '.background',
					color: '#dddddd',
					speed: 0.3,
					sizeVariations: 5,
					maxParticles: 400,
					connectParticles: true,
					minDistans: 300,
					responsive: [
						{
							breakpoint: 1920,
							options: {
								maxParticles: 180,
								minDistans: 120,
							}
						},
						{
							breakpoint: 1279,
							options: {
								maxParticles: 80,
								sizeVariations: 5,
								/*minDistans: 120,*/
							}
						},
						{
							breakpoint: 767,
							options: {
								maxParticles: 50,
								speed: 0.1,
								/* minDistans: 120,*/
							}
						},
						{
							breakpoint: 480,
							options: {
								maxParticles: 30,
								minDistans: 50,
								speed: 0.1,
							}
						},
					]
				});
				particles.pauseAnimation();
				var controller = new ScrollMagic.Controller();
				var scene = new ScrollMagic.Scene({
					triggerElement: '.before-mn-curation',
					duration: "100%"
				})
					.addTo(controller)
					.on('enter', function (e) {
						particles.resumeAnimation();
					})
					.on('leave', function (e) {
						particles.pauseAnimation();
					});
			};
			init(this);
			return $(this);
		}
	});

	$.extend($.fn, {
		bmnVideoFunc: function () {
			var init = function (obj) {
				var controller = new ScrollMagic.Controller();
				var video = $(obj).find('.bg-video video');
				var scene = new ScrollMagic.Scene({
					triggerElement: '.before-mn-video',
					duration: "100%"
				})
					.addTo(controller)
					.on('enter', function (e) {
						video.get(0).play();
					})
					.on('leave', function (e) {
						video.get(0).pause();
					});
			};
			init(this);
			return $(this);
		}
	});

	$.extend($.fn, {
		itemviewDetailFunc: function () {
			var init = function (obj) {
				$tabsnav = $(obj).find('.tabs-nav');

				// 상품상세 탭 스크롤
				var controller = new ScrollMagic.Controller();
				$('.itemview-detail-area section').each(function () {
					var $this = $(this);
					var id = $this.attr('id');
					new ScrollMagic.Scene({
						triggerElement: this,
						triggerHook: .1,
						//offset: '100',
						duration: $this.outerHeight()
					}).on('enter', function (e) {
						var $anchor = $tabsnav.find('a[href="#' + id + '"]');

						$tabsnav.find('a').removeClass("is-active");
						$anchor.addClass("is-active");

						left = $anchor.parent('li').position().left;
						width = ($anchor.outerWidth() / 2);
						$('.detail-nav-area .tabs-nav').scrollLeft(left);
						/*console.log(left);*/

					}).addTo(controller);
				});
				$(document).on("click", ".itemview-detail-area .tabs-nav li a", function (e) {
					var $anchor = $(this);
					if ($anchor.hasClass("is-active") == false) {
						$(".tabs-nav li a").removeClass("is-active");
						$(this).addClass("is-active");
					}
				});
				var scenetabsSticky = new ScrollMagic.Scene({
					triggerElement: '.itemview-detail-area',
					triggerHook: 'onLeave'
				}).setClassToggle('.itemview-detail-area .tabs-nav', 'is-sticky').addTo(controller);

			};
			init(this);
			return $(this);
		}
	});


	$.extend($.fn, {
		courseMapFunc: function () {
			var init = function (obj) {
				$header = $(obj).find('.course-map-header');

				// 상품상세 탭 스크롤
				var controller = new ScrollMagic.Controller();
				$('.course-map-body section').each(function () {
					var $this = $(this);
					var $type = $this.data('map');
					//alert(map);
					new ScrollMagic.Scene({
						triggerElement: this,
						triggerHook: .1,
						//offset: '100',
						duration: $this.outerHeight()
					}).on('enter', function (e) {
						$header.attr('data-map', $type);
						// var $anchor = $tabsnav.find('a[href="#' + id + '"]');

						// $tabsnav.find('a').removeClass("is-active");
						// $anchor.addClass("is-active");

						// left = $anchor.parent('li').position().left;
						// width = ($anchor.outerWidth() / 2);
						// $('.detail-nav-area .tabs-nav').scrollLeft(left);
						/*console.log(left);*/

					}).addTo(controller);
				});
				// $(document).on("click", ".itemview-detail-area .tabs-nav li a", function (e) {
				// 	var $anchor = $(this);
				// 	if ($anchor.hasClass("is-active") == false) {
				// 		$(".tabs-nav li a").removeClass("is-active");
				// 		$(this).addClass("is-active");
				// 	}
				// });
				// var scenetabsSticky = new ScrollMagic.Scene({
				// 	triggerElement: '.itemview-detail-area',
				// 	triggerHook: 'onLeave'
				// }).setClassToggle('.itemview-detail-area .tabs-nav', 'is-sticky').addTo(controller);

			};
			init(this);
			return $(this);
		}
	});

	//common
	$.extend($.fn, {
		liveListFunc: function () {
			var init = function (obj) {
				var $btn = $(obj);
				$(document).on('click', $btn, function (e) {
					var $target = $(e.target);
					if ($target.is($btn)) {
						toggleCommonFunc({
							obj: $target,
							className: 'is-active',
							hasClass: function (obj) {
								$target.parent('li').siblings('li').find('button').removeClass('is-active');
							},
							noneClass: function (obj) {

							}
						});
					}
				});
			};
			init(this);
			return $(this);
		}
	});

	$.extend($.fn, {
		stickyFunc: function () {
			var init = function (obj) {

				var controller = null;
				var tooSmall = false;
				var maxWidth = 1280;

				//var controller = new ScrollMagic.Controller();
				//var sceneSticky = new ScrollMagic.Scene({
				//	triggerElement: '.sticky-container',
				//	triggerHook: 'onLeave'
				//}).setClassToggle('.sticky-container .sticky-area', 'is-sticky').addTo(controller);
				//var sceneBottomSticky = new ScrollMagic.Scene({
				//	triggerElement: '.site-footer',
				//	triggerHook: 0.1
				//}).setClassToggle('.sticky-container .sticky-area', 'is-sticky-b').addTo(controller);

				function initScrollMagic() {
					controller = new ScrollMagic.Controller();

					var sceneBottomSticky = new ScrollMagic.Scene({
						triggerElement: '.sticky-container',
						triggerHook: "onLeave",
						duration: "300%",
					}).setPin('.sticky-area').setClassToggle('.sticky-area', 'is-sticky').addTo(controller);
				}


				function size() {
					var wWidth = $(window).width();
					if (wWidth < maxWidth) {
						if (controller !== null && controller !== undefined) {
							controller = controller.destroy(true);
						}
					} else if (wWidth >= maxWidth) {
						if (controller === null || controller === undefined) {
							initScrollMagic();
						}
					}
				}
				if (!tooSmall) {
					size();
				}
				$(window).resize(function () {
					size();
				});
			};
			init(this);
			return $(this);
		}
	});

	//viewerFloatFunc
	$.extend($.fn, {
		viewerFloatFunc: function () {
			var init = function (obj) {
				var $btn = $(obj);
				$(document).on('click', $btn, function (e) {
					var $target = $(e.target);
					if ($target.is($btn)) {
						toggleCommonFunc({
							obj: '.viewer-float-area',
							className: 'is-active',
							hasClass: function (obj) {

							},
							noneClass: function (obj) {

							}
						});
					}
				});
			};
			init(this);
			return $(this);
		}
	});

	//cviewerMenuFunc
	$.extend($.fn, {
		cviewerMenuFunc: function () {
			var init = function (obj) {
				var $btn = $(obj);
				$(document).on('click', $btn, function (e) {
					var $target = $(e.target);
					if ($target.is($btn)) {
						toggleCommonFunc({
							obj: '.cviewer',
							className: 'is-active-cmenu',
							hasClass: function (obj) {

							},
							noneClass: function (obj) {

							}
						});
					}
				});
			};
			init(this);
			return $(this);
		}
	});
})(jQuery);

$(document).ready(function () {
	//jquery-ui
	$('.datepicker').datepicker();

	//slide
	$('.quick-slide').quickSlideFunc();
	$('.item-slide').itemSlideFunc();

	//swiper
	//$('.mn-visual .visual-slide, .before-mn-visual .visual-slide').mnvisualSlide();
	//$('.mn-visual .swiper-container').mnVisualSwiper();
	$('.mn-intro').mnIntroSwiper();
	$('.mn-curriculum').mnCurriculumSwiper();
	$('.mn-review').mnReviewSwiper();

	//component
	$('.popup').popupFunc();
	$('.tabs-normal').tabsNormalFunc();
	$('.btn-zzim').toggleFunc();
	$('.btn-more-toggle').contMoreFunc();
	$('.btn-tooltip').tooltipFunc();
	$('.btn-thumb-sel').thumbSelFunc();
	$('.accordion, .mn-accordion').accordionFunc();
	$('.etc-fnc-area').etcFunc();

	//header
	$('.site-header').headerFunc();
	$('.site-gnb').gnbFunc();
	$('.btn-menu').menuFunc();
	$('.m-btn-menu').mMenuFunc();
	$('.lnb').lnbFunc();
	$('.btn-gsch-open').gschFunc();

	//detail
	$('.itemview').itemviewDetailFunc();
	$('.sticky-area').stickyFunc();
	$('.live-list button').liveListFunc();

	//viewer 
	$('.btn-viewer-float').viewerFloatFunc();
	$('.btn-cviewer-menu').cviewerMenuFunc();

	//course
	$('.course-map').courseMapFunc();

	var controller = new ScrollMagic.Controller();
	$(".mn-section").each(function (i) {
		var scene = new ScrollMagic.Scene({
			triggerElement: this,
			triggerHook: 0.8,
			reverse: true
		});

		scene.on("leave", function (event) {
			$(this.triggerElement()).removeClass("is-active");
		});

		scene.on("enter", function (event) {
			$(this.triggerElement()).addClass("is-active");
		});

		scene.addTo(controller);
	});

	$(".mn-visual").each(function (i) {
		var scene = new ScrollMagic.Scene({
			triggerElement: this,
			triggerHook: 0.2, // 수정된 부분: 요소가 뷰포트의 상단 20%에 도달할 때 trigger가 작동하도록 변경
			reverse: true
		});

		scene.on("enter", function (event) {
			$(this.triggerElement()).addClass("is-active");
		});

		scene.on("leave", function (event) {
			if (event.scrollDirection === "FORWARD") {
				$(this.triggerElement()).removeClass("is-active");
			}
		});

		scene.addTo(controller);
	});

	$(".course-section").each(function (i) {
		new ScrollMagic.Scene({
			triggerElement: this,
			triggerHook: 0.3
		}).setClassToggle(this, 'is-active').addTo(controller);
	});

	// let vh = window.innerHeight * 0.01;
	// document.documentElement.style.setProperty("--vh", `${vh}px`);
	// window.addEventListener("resize", () => {
	// 	console.log("resize");
	// 	let vh = window.innerHeight * 0.01;
	// 	document.documentElement.style.setProperty("--vh", `${vh}px`);
	// });
});



