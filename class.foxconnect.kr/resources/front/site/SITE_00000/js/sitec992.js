(function() {

	$(document).on('change','#topMenu', function() {
		const actionUrl = $(this).val();
		const menuNo = $(this).find('option:selected').data('no');
		if(!isEmpty(menuNo)) {
			jsonAjax({
				url: '/mnu/menuList.json',
				method: 'get',
				data: {menuNo: menuNo},
				callback: function(result) {
					if(result.success) {
						const list = result.data.list;
						const subList = list[0]._children;
						let target = document.getElementById('subMenu');
						const subTarget = document.getElementById('sub-subMenu');
						if(list.length > 0) {
							$('#sub-subMenu').hide();

							target.options.length = 0;
							list.forEach(function (item) {

								const $item = $('<option value="' + item.menuUrl + '" data-no="' + item.menuNo + '">' + item.menuNm + '</option>');
								$('#subMenu').append($item);

								if (list.length == 1) {
									location.href = item.menuUrl;
								}
							});
							location.href = list[0].menuUrl;

						}else {
							if(!isEmpty(actionUrl) && actionUrl != '#') {
								location.href = actionUrl;
							}
						}
						if(!isEmpty(subList)) {
							$('#sub-subMenu').show();

							subTarget.options.length = 0;
							subList.forEach(function(item) {

								const $item = $('<option value="' + item.menuUrl + '" data-no="' + item.menuNo + '">' + item.menuNm + '</option>');
								$('#sub-subMenu').append($item);

								if(item.length == 1) {
									location.href = item.menuUrl;
								}
							});
						}
					}
				}
			});
		}
	});

	$(document).on('change','#subMenu', function() {
		const actionUrl = $(this).val();
		const menuNo = $(this).find('option:selected').data('no');
		if(!isEmpty(menuNo)) {
			jsonAjax({
				url: '/mnu/menuList.json',
				method: 'get',
				data: {menuNo: menuNo},
				callback: function(result) {
					if(result.success) {
						let subList = result.data.subList;
						let subTarget = document.getElementById('sub-subMenu');
						if(subList.length > 0) {
							$('#sub-subMenu').show();

							subTarget.options.length = 0;
							subList.forEach(function(item) {

								const $item = $('<option value="' + item.menuUrl + '" data-no="' + item.menuNo + '">' + item.menuNm + '</option>');
								$('#sub-subMenu').append($item);

								if(subList.length == 1) {
									location.href = item.menuUrl;
								}
							});
							location.href = subList[0].menuUrl;

						}else {
							$('#sub-subMenu').hide();

							if(isEmpty(subList._children) && !isEmpty(actionUrl) && actionUrl != '#') {
								location.href = actionUrl;
							}
						}
					}
				}
			});
		}
	});

	$(document).on('change','#sub-subMenu', function() {
		const actionUrl = $(this).val();
		if(!isEmpty(actionUrl) && actionUrl != '#') {
			location.href = actionUrl;
		}
	});

	// 로그인 알럿
	$(document).on('click', '.btn-no-login', function(e) {
		e.preventDefault();
		if(confirm('로그인을 하신 후 이용해 주시기 바랍니다.')) {
			location.href = LOGIN_URL;
		};
	});

	// 학습하기 클릭(뷰어페이지 이동)
	$(document).on('click', '.openViewer', function(e) {
		e.preventDefault();
		var actionUrl = $(this).attr('href');

		//popupWindow(actionUrl, '폭스 클래스 뷰어', screen.width, screen.height, 0, 0);
		//location.href = actionUrl;
		//window.open(actionUrl);

		const urlParams = new URLSearchParams(actionUrl.split("?")[1]);

		const classId = urlParams.get('classId');
		const crclmNo = urlParams.get('crclmNo');

		var formData = new FormData();
		if(classId != undefined && classId != null && classId != ""){
			formData.append('classId', classId);
		}
		if(crclmNo != undefined && crclmNo != null && crclmNo != ""){
			formData.append('crclmNo', crclmNo);
		}

		$.ajax({
			url: actionUrl.split("?")[0],
			type: 'post',
			data: formData,
			dataType: 'json',
			processData: false,
			contentType: false,
			success: function(result) {

				if(result.success) {
					window.open(result.redirectUrl);
				}else{
					if(result.message) {
						alert(result.message);
					}
				}
			}
		});

	});

	function getWeekAgoDate() {
		let nowDate = new Date();
		let weekDate = nowDate.getTime() - (7*24*60*60*1000);
		nowDate.setTime(weekDate);

		let weekYear = nowDate.getFullYear();
		let weekMonth = nowDate.getMonth() + 1;
		let weekDay = nowDate.getDate();

		if(weekMonth < 10) {weekMonth = "0" + weekMonth};
		if(weekDay < 10) {weekDay = "0" + weekDay};

		let resultDate = weekYear + "-" + weekMonth + "-" + weekDay;
		return resultDate;
	}

	function currentDateFormat() {
		let current_date = new Date();

		let weekYear = current_date.getFullYear();
		let weekMonth = current_date.getMonth() + 1;
		let weekDay = current_date.getDate();

		if(weekMonth < 10) {weekMonth = "0" + weekMonth};
		if(weekDay < 10) {weekDay = "0" + weekDay};
		return weekYear + "-" + weekMonth + "-" + weekDay;
	}

	function saveInLocalStorage(keyword) {
		//로컬 스토리지에 검색어 저장
		const localStorage = window.localStorage;

		if(localStorage.getItem("autoSaveDisabled") !== 'Y') {

			let current_date = currentDateFormat();
			let data = {id: "", keyword : keyword, datetime : current_date, searchSeCode: "sch"};
			let result;

			if(localStorage.getItem("searchRecord") !== null) {
				let old_data = JSON.parse(localStorage.getItem("searchRecord"));
				let dataArray = [];

				if(old_data.length === undefined) {
					dataArray.push(old_data);
				} else {
					for(let i=0; i<old_data.length; i++) {
						dataArray.push(old_data[i]);
					}
				}

				for(let i=0; i<dataArray.length; i++) {
					if(dataArray[i].keyword == keyword) {
						dataArray.splice(i, 1);
					}
				}

				data.id = dataArray[dataArray.length-1].id+1;
				dataArray.push(data);

				if(dataArray.length > 10) {
					dataArray.splice(0, 1);
				}

				result = dataArray;
			} else {
				data.id = 1;
				result = data;
			}

			localStorage.setItem("searchRecord", JSON.stringify(result));
		}
	}

	//localStorage 검색어 기록
	$(document).ready(function() {
		const localStorage = window.localStorage;

		if(localStorage.getItem("autoSaveDisabled") === 'Y') {
			$("#auto-save-disabled").addClass("btn-display-none");
			$("#auto-save-active").removeClass("btn-display-none");
		};

		let data_from_storage = localStorage.getItem("searchRecord");
		let result = JSON.parse(data_from_storage);
		let current_date = currentDateFormat();

		let week_ago = getWeekAgoDate();

		if(result !== null) {
			if(result.length !== undefined) {
				for(let i=0; i<result.length; i++) {
					if(result[i].datetime >= week_ago && result[i].datetime <= current_date) {
						if(i > 9) {return false;}

						let url;
						if(result[i].searchSeCode === 'sch') {
							url = '/fox/cls/globalSearch.do?searchCondition=ALL&searchKeyword='+result[i].keyword;
						} else if(result[i].searchSeCode === 'tag') {
							url = '/fox/cls/globalSearch.do?searchTag='+result[i].keyword;
						}

						let html = $("<li>").addClass("search-li");
						let a_btn = $("<a>").text(result[i].keyword).attr("href", url).addClass("btn-click-search");
						let delete_btn = $("<button>").addClass("btn-close gr btn-delete-keyword").text("삭제").attr("data-keyword-id", result[i].id);
						html.append(a_btn)
							.append(delete_btn);
						$(".gsch-list").append(html);
					} else {
						continue;
					}
				}
			} else {
				if(result.datetime >= week_ago && result.datetime <= current_date) {
					let url;
					if(result.searchSeCode === 'sch') {
						url = '/fox/cls/globalSearch.do?searchCondition=ALL&searchKeyword='+result.keyword;
					} else if(result.searchSeCode === 'tag') {
						url = '/fox/cls/globalSearch.do?searchTag='+result.keyword;
					}
					let html = $("<li>").addClass("search-li");
					let a_btn = $("<a>").text(result.keyword).attr("href", url).addClass("btn-click-search");
					let delete_btn = $("<button>").addClass("btn-close gr btn-delete-keyword").text("삭제").attr("data-keyword-id", result.id);
					html.append(a_btn)
						.append(delete_btn);
					$(".gsch-list").append(html);
				}
			}

		}
		// const gnbliList = $(".site-gnb>ul>li");
		// const totalMenuCnt = gnbliList.length;
		// const gnbWidth = $(".site-gnb").width();
		// let gnbTotLiWidth = 0;
		// gnbliList.each((i)=>{
		// 	gnbTotLiWidth += $(gnbliList[i]).width();
		// });
		// console.log(gnbTotLiWidth);
		// const gnbPadWidth = (gnbWidth - gnbTotLiWidth) / (totalMenuCnt * 2) ;
		// $(".site-gnb>ul>li>a").css("padding","0 "+gnbPadWidth+"px");
	});

	//검색기록 전체 삭제
	$(document).on('click', '#delete_search_record', function(e) {
		e.preventDefault();
		window.localStorage.removeItem("searchRecord");

		//localStorage 삭제 후 화면에 있는 목록도 remove
		$(".gsch-list").children("li").remove();
	});

	//자동저장 끄기
	$(document).on('click', '#auto-save-disabled', function(e) {
		e.preventDefault();

		window.localStorage.setItem("autoSaveDisabled", 'Y');
		$(this).toggleClass("btn-display-none");
		$("#auto-save-active").toggleClass("btn-display-none");
	});

	//자동저장 켜기
	$(document).on('click', '#auto-save-active', function(e) {
		e.preventDefault();

		window.localStorage.removeItem("autoSaveDisabled");
		$(this).toggleClass("btn-display-none");
		$("#auto-save-disabled").toggleClass("btn-display-none");
	});

	//검색기록 중에서 삭제 선택한 키워드만 삭제
	$(document).on('click', '.btn-delete-keyword', function(e) {
		let localStorage = window.localStorage;
		let data = JSON.parse(localStorage.getItem("searchRecord"));
		let id = $(this).data("keyword-id");

		for(let i=0; i<data.length; i++) {
			if(id === data[i].id) {
				data.splice(i, 1);
			}
		}

		$(this).parents(".search-li").remove();
		localStorage.setItem("searchRecord", JSON.stringify(data));
	});

	// 통합검색
	$(document).on('submit', '#globalSearchForm', function(e) {
		let searchKeyword = document.getElementById('globalSearchKeyword').value;
		if (isEmpty(searchKeyword)) {
			alert('검색어를 입력하세요.');
			return false;
		}

		let keyword = $("#globalSearchKeyword").val();
		saveInLocalStorage(keyword);

		/*if($('.search-target').length > 0) {
			var $targetForm = $('.search-target');
			var searchKeyword = $('#globalSearchKeyword').val();
			if(!isEmpty(searchKeyword)) {
				$targetForm.find('input[name=pageIndex]').val('1');
				$targetForm.find('input[name=searchCondition]').val('ALL');
				$targetForm.find('input[name=searchKeyword]').val(searchKeyword);
				$targetForm.submit();
			}else {
				$('#globalSearchKeyword').attr('placeholder','검색어를 입력하세요.');
			}
		}*/
	});

	$(document).on('click', ".btn-click-search", function (e) {
		e.preventDefault();

		let keyword = $(this).text();
		saveInLocalStorage(keyword);

		location.href = $(this).attr("href");
	});

})();

function getCookie(key) {
	var result = null;
	var cookie = document.cookie.split(';');
	cookie.some(function (item) {
		// 공백을 제거
		item = item.replace(' ', '');

		var dic = item.split('=');

		if (key === dic[0]) {
			result = dic[1];
			return true;    // break;
		}
	});
	return result;
}

function setCookie(key, value, expiredays) {
	var todayDate = new Date();
	todayDate.setDate(todayDate.getDate() + expiredays);
	document.cookie = key + "=" + escape(value) + "; path=/; expires=" + todayDate.toGMTString() + ";"
}


/* javascript에서 parameter를 사용하기 위한 정규식 
 * 원하는 값의 key값을 매개변수로 넣으면 됩니다.
 * */
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function setNotice(message) {
	let notification = $("#bbs-temp-style-alert-zzim");
	notification.children().html(message);

	notification.addClass('reveal')
	setTimeout(() => {
		notification.removeClass('reveal');
	}, 1000);
}

// TOAST Message
function toastMessage(message) {
	let $notification = $('#alert_itrst_copy');
	$notification.children().html(message);

	$notification.addClass('reveal');
	setTimeout(() => {
		$notification.removeClass('reveal');
	}, 1500);

}

//찜 click
$(".act-zzim").click(function(e) {
	var classId = $(this).data("id");
	var curr_btn_zzim = $(this);

	if($(this).hasClass('btn-no-event')) {
		e.preventDefault();
		if(confirm('로그인을 하신 후 이용해 주시기 바랍니다.')) {
			location.href = LOGIN_URL;
		}
		return false;
	}

	if ($(this).hasClass('btn-no-access')) {
		e.preventDefault();
		alert('사이트 접근 권한이 없습니다.');
		return false;
	}

	$.ajax({
		url: "/fox/mark/handleMark.json",
		method: 'post',
		data: JSON.stringify({'classId' : classId}),
		dataType: 'json',
		contentType: 'application/json',
		success: function(result) {
			if(!result.success) {
				if(result.message) {
					alert(result.message);
				}
				if (result.redirectUrl) {
					location.href = CTX_ROOT + result.redirectUrl;
				}
			} else {
				if(result.message) {
					toastMessage(result.message);
				}

				if(curr_btn_zzim.hasClass("btn-lg")) {
					if(result.data.code == 'A') { //추가
						curr_btn_zzim.find(".ico-zzim").addClass("spot");
					}else if(result.data.code == 'C') { //취소
						curr_btn_zzim.find(".ico-zzim").removeClass("spot");
					}

					curr_btn_zzim.find("span").text(result.data.markCnt);
				}
			}
		}
	});
});

// 공유하기
if(window.Kakao != undefined){
	Kakao.init(SHARE_KEY);
}

$(document).on('click', '.btn-share', function() {
	if($(this).hasClass('no-login')) {
		//toastMessage('로그인 후 이용가능합니다.');
		if(confirm('로그인을 하신 후 이용해 주시기 바랍니다.')) {
			location.href = LOGIN_URL;
		}
		return false;
	}

	var classId = $(this).data('classId');
	var classSj = $(this).data('classSj');
	var menuNo = $("#menuNo").val();
	var redirectURl = '/fox/cls/clsView.do?classId='+classId+'&amp;menuNo='+menuNo;

	var cnrs = {
		contentsId : classId,
		redirectUrl : redirectURl,
		cnrsSeCode : 'CLASS'
	};

	$.ajax({
		url: "/fox/writeCnrs.json",
		type: 'post',
		data: JSON.stringify(cnrs),
		contentType: 'application/json',
		dataType: 'json',
		success: function(result) {
			if(result.message) {
				alert(result.message);
			}
			if (result.success) {
				var uuidUrl = result.data.tempUrl;
				var tempPath = result.data.tempPath;

				$('#btn-share-link-copy').attr('href', uuidUrl);

				Kakao.Link.createCustomButton({
					container: '#btn-kakao-link',
					templateId: parseInt(SHARE_TEMPLATE_ID),
					templateArgs: {
						'title': classSj,
						'tempPath': tempPath
					}
				});
			}
			if (result.redirectUrl) {
				location.href = CTX_ROOT + result.redirectUrl;
			}
		}
	});
});

//링크복사
$(document).on('click','#btn-share-link-copy', function(e) {
	e.preventDefault();

	var tempUrl = $(this).attr('href');
	if(tempUrl == '#') {
		alert('공유를 할 수 없습니다.');
		return false;
	}
	console.log(tempUrl)

	var inputText = document.createElement('input');
	var sharePopup = document.querySelector('.popup[data-popup="popup"]');
	sharePopup.appendChild(inputText);

	inputText.value = tempUrl;

	inputText.select();
	if(document.execCommand('copy')) {
		toastMessage('링크복사 완료');
	}else {
		// 필요시 input  생성
	}
	sharePopup.removeChild(inputText);
});

//footer connect
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

function changeLang(value){
	location.href = "/"+value;
}

//토스트 메세지
var toastopen = false;

function toast(msg) {
	// debugger;
	var $msg = msg;

	if (toastopen == false) {
		var $toast = $('.toast');
		// console.log($toast);
		$toast.addClass('is-open');
		$toast.find('div').html($msg);

		TweenMax.fromTo($toast, 0.4, { opacity: 0 }, { opacity: 1 });
		toastopen = true;

		setTimeout(function () {
			$toast.removeClass('is-open');
			TweenMax.fromTo($toast, 0.3, { opacity: 1 }, { opacity: 0 });
			toastopen = false;
			$toast.css("top",'');
		}, 3000);
	}
}

let initDatepickerForm = function() {
	$.datepicker.setDefaults({dateFormat: 'yy년 mm월 dd일'});
	$('.datepicker').datepicker();
};