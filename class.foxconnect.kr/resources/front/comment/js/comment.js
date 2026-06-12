(function() {
	
	function reloadComment() {
		location.reload();
	}
	
	function makeModifyCommentForm(comment) {
		
	}
	
	// 검색 Submit
	$(document).on('submit', '#commentSearchForm', function(e) {
		e.preventDefault();
		
		var actionUrl = $(this).attr('action');
		var formData = $(this).serialize();
		
		$.ajax({
			url: actionUrl,
			method: 'get',
			data: formData,
			dataType: 'html',
			cache: false,
			success: function(result) {
				$('#comment-list').html(result);
				/*
				var tag = $.parseHTML(result);
				var commentList = $(tag).find('#commentList').html();
				console.log(commentList);
				
				$('#commentList').html(commentList);
				*/
			}
			
		});
		
	});
	
	//저장 Submit
	$(document).on('submit', '#commentForm', function(e) {
		e.preventDefault();
		
		var actionUrl = $(this).attr('action');
		var formData = $(this).serialize();
		
		jsonAjax({
			url: actionUrl,
			method: 'post',
			data: formData, 
			callback: function(result) {
				if(result.success) {
					// reload comment list
					//$('#comment').remove();
					reloadComment();
				}
			}
		});
	});
	
	// 수정 Submit
	$(document).on('submit', '[name=commentModifyForm]', function(e) {
		e.preventDefault();
		
		var actionUrl = $(this).attr('action');
		var formData = $(this).serialize();
		
		jsonAjax({
			url: actionUrl,
			method: 'post',
			data: formData, 
			callback: function(result) {
				if(result.success) {
					// reload comment list
					//clearCommentForm();
					reloadComment();
				}
			}
		});
		
	});
	
	//페이징 Click
	$(document).on('click', '.paging a', function(e) {
		e.preventDefault();
		var actionUrl = $(this).attr('href');
		
		if(actionUrl != '#') {
			$.ajax({
				url: actionUrl,
				method: 'get',
				dataType: 'html',
				cache: false,
				success: function(result) {
					$('.comment-item').html(result);
				}
			});
		}
	});
	
	//수정 Click
	$(document).on('click', '.btnEditComment', function(e) {
		e.preventDefault();
		var actionUrl = $(this).attr('href');
		var $commentBody = $(this).parents('.comment-body');
		var $commentItem = $(this).parents('.comment-item');
		var date = $(this).parents('.comment-item').find('.comment-date').text()
		$commentItem.hide();
		
		var commentFormTemplate = $('#commentFormTemplate').html();
		
		jsonAjax({
			url: actionUrl,
			methos: 'get',
			callback: function(result) {
				var html = commentFormTemplate.replace(/{CONTENT}/gi, result.data.comment.commentCn)
							.replace(/{ID}/gi, result.data.comment.commentId)
							.replace(/{WRTERNM}/gi, result.data.comment.wrterNm)
							.replace(/{DATE}/gi, date);
				$commentBody.append(html);
			}
		});
	});
	
	//삭제 Click
	$(document).on('click', '.btnDeleteComment', function(e) {
		e.preventDefault();
		if(!confirm('삭제하시겠습니까?')) {
			return false;
		}
		
		var actionUrl = $(this).attr('href');
		jsonAjax({
			url: actionUrl,
			method: 'post',
			callback: function(result) {
				if(result.success) {
					reloadComment();
				}
			}
		});
	});
	
	//저장 Click
	$(document).on('click', '.btnSave', function(e) {
		e.preventDefault();
		if(!confirm('저장하시겠습니까?')) {
			return false;
		}
		$('#commentModifyForm').submit();
	});
	
	//취소 Click
	$(document).on('click', '.btnModifyCancel', function(e) {
		e.preventDefault();
		$(this).parents('.comment-body').find('.comment-item').show();
		$(this).parents('[name=commentModifyForm]').remove();
	});
	
	
})();