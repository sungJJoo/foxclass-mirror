(function() {
	
	$(document).on('click', '.btnDelArticle', function(e) {
		if(!confirm('삭제하시겠습니까?')) {
			e.preventDefault();
		}
	});
})();