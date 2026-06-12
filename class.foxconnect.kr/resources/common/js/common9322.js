// Empty 여부
var isEmpty = function(x) {
	if( (typeof x) == 'undefined') {
		return true;
	}else if( (typeof x) == 'number') {
		return (
			(x == null) ||
			(x == false) ||
			(x.length == 0) ||
			(x == "") ||
			(!/[^\s]/.test(x)) ||
			(/^\s*$/.test(x))
		);
	}else if ((typeof x) == 'string') {
		return (
			(x == null) ||
			(x == false) ||
			(x.length == 0) ||
			(x == "") ||
			(x.replace(/\s/g,"") == "") ||
			(!/[^\s]/.test(x)) ||
			(/^\s*$/.test(x))
		);
	}else if((typeof x) == 'object') {
		return (
			(x == null)
		)
	}
}

/*
 * 알림 팝업
 */
function noticePopup(popupId, url, title, w, h, x, y) {
	if(Cookies.get(popupId) != 'Y') {
		popupWindow(url, title, w, h, x, y);
	}
}

/*
 * 윈도우 팝업
 */
function popupWindow(url, title, w, h, x, y) {
	var screenX = typeof window.screenX != 'undefined' ? window.screenX : window.screenLeft;
	var	screenY = typeof window.screenY != 'undefined' ? window.screenY : window.screenTop;
	var left = screenX + x; //(x || Math.round((window.screen.width/2)-(w/2)));
	var top = screenY + y; //(y ||  Math.round((window.screen.height/2)-(h/2)));
	var popup =window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, '
		+ 'menubar=no, scrollbars=yes, resizable=yes, copyhistory=no, width=' + w
		+ ', height=' + h + ', top=' + top + ', left=' + left);

	if(popup == null) {
		alert('팝업 차단 기능 혹은 팝업차단 프로그램이 동작중입니다. \n팝업차단 기능을 해제한 후 이용하시기 바랍니다.');
	}

	popup.focus();
}

(function() {
	/**
	 * 레이어 팝업
	 */
	if($('.popup-item').length > 0) {
		$('.popup-item').each(function(index) {
			var popupId = $(this).data('popupId');
			if(Cookies.get(popupId) != 'Y') {
				$(this).show();
			}
		});
	}

	if($('.popup-today-check').length > 0) {
		$('.popup-today-check').click(function() {
			if($(this).is(':checked')) {
				var popupId = $(this).val();
				Cookies.set(popupId, 'Y', { expires: 1 });
				$('[data-popup-id="' + popupId + '"]').slideUp('fast');
			}
		});
	}
	
	/**
	 * 레이어 팝업 닫기
	 */
	$(document).on('click', '.btn-close-popup', function(e) {
		e.preventDefault();
		var popupId = $(this).data('id');
		$('[data-popup-id="' + popupId + '"]').slideUp('fast');
	});
	
	/**
	 * 윈두우 팝업: 오늘하루 열지 않기
	 */
	$(document).on('click', '.window-popup-today-check', function() {
		if($(this).is(':checked')) {
			var popupId = $(this).val();
			// Cookies.set(popupId, 'Y', { expires: 1 });
			setCookie(popupId, 'false', 1);
			$('[data-popup-id="' + popupId + '"]').slideUp('fast');
			self.close();
		}
	});

	/** 윈도우 팝업 띄우기 **/
	if($('.window-popup-today-check').length > 0) {
		$('.window-popup-today-check').each(function() {
			var popupId = getCookie($(this).val());

			if(popupId == 'false') {
				$('[data-popup-id="' + popupId + '"]').slideUp('fast');
				self.close();
			}
		});
	}
	
	/** Web Editor: summernote **/
	initWebEditor = function() {
		$('.summernote').summernote({
			lang: 'ko-KR',
			tabsize:2,
			height:300,
			dialogsInBody: true
		});
	};
	
	/**
	 * 삭제전 질문
	 */
	$(document).on('click', '.btnCommonDelete', function(e) {
		if(!confirm('삭제하시겠습니까?')) {
			return false;
		}
	});

	/**
	 * 사이트 이용제한
	 */
	$(document).on('click', '.link-accessDenied', function(e) {
		e.preventDefault();
		alert('사이트 접근 권한이 없습니다.');
		return false;
	});
	
})();

/** Ajax : json */
jsonAjax = function(option) {
	var actionUrl = option.url;
	var ajaxMethod = option.method;
	var ajaxData = option.data;
	var ajaxType = option.type;
	var callback = option.callback;
	var formData = option.formData;
	
	var cType = 'application/x-www-form-urlencoded; charset=UTF-8';
	var pData = true;

	if(!isEmpty(formData)) {
		cType = false;
		pData = false;
		
		ajaxData = formData;
	}else if(!isEmpty(option.contentType)) {
		cType = option.contentType;
	}
	
	if(!isEmpty(ajaxType)) {
		ajaxMethod = ajaxType;
	}
	
	$.ajax({
		url: actionUrl,
		method: ajaxMethod,
		data: ajaxData,
		dataType: 'json',
		cache: false,
		contentType: cType,
		processData: pData,
		success: function(result) {
			if(result.message) {
				alert(result.message);
			}
			
			if(result.redirectUrl) {
				location.href = CTX_ROOT + result.redirectUrl;
			}else {
				callback(result);
			}
		}
	});
};