(function() {
    $(document).on("click",".checkLogin",function(e){
       e.preventDefault();
       const target = $(this).attr("href");

        $.ajax({
            url: "/user/sign/checkLogin.json",
            method: 'post',
            dataType: 'json',
            contentType: false,
            processData: false,
            success: function(result) {
                if(result.message) {
                    popupOpen("induceLogin");
                }else{
                    moveCourseMap(target);
                }
            }
        });
    });

    function moveCourseMap(url) {
        $.ajax({
            url: url,
            type: 'get',
            dataType: 'json',
            success: function(result) {
                if(result.message) {
                    alert(result.message);
                }

                if(result.success) {
                    location.href = result.redirectUrl;
                }
            }
        });
    }
})();