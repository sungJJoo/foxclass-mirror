(function() {

    //상위카테고리
    $(document).on('change', '#upperCategory', function (e) {
        e.preventDefault();

        document.getElementById('lowerCategory').value = '';
        document.forms['searchForm'].submit();
    });

    //하위카테고리
    $(document).on('change', '#lowerCategory', function (e) {
        e.preventDefault();
        document.forms['searchForm'].submit();
    });

    //검색결과 정렬
    $(document).on('change', "#searchOrder", function(e) {
        e.preventDefault();
        $("#searchOrderField").val($(this).val());
        document.forms['searchForm'].submit();
    });

    //날짜 검색
    $(document).on('change', ".datepicker", function(e) {
        e.preventDefault();
        $("#searchLive").val($(this).val());
        document.forms['searchForm'].submit();
    });

    $(document).ready(function(){
        //카테고리 초기화
        initCatory();
    });

    function initCatory(){
        var catetoryUrl = "/fox/cls/categoryData.json";
        $.ajax({
            url: catetoryUrl ,
            type: 'post',
            dataType: 'json',
            success: function (result) {
                if (result.success) {
                    let target = document.getElementById('upperCategory');
                    target.options.length = 0;
                    // console.log(result);
                    upperCategryList = result.data.categryList;
                    upperCategryList.forEach((v,i) => {
                        if($("#upperCategryVal").val() =='' && i ==0){
                            selectLowerCategory(v.menuNo);
                        }
                        if(v.menuNo == $("#upperCategryVal").val()){
                            selectLowerCategory(v.menuNo);
                            $("#upperCategory").append('<option value="' + v.menuNo + '" selected>' + v.menuNm + '</option>');
                        }else{
                            $("#upperCategory").append('<option value="' + v.menuNo + '">' + v.menuNm + '</option>');
                        }
                    });
                }
            }
        });
    }


    //하위 카테고리 검색
    function selectLowerCategory(code) { //code -> menuNo
        $("#lowerCategory").html("");
        upperCategryList.forEach(e => {
            if(code == e.menuNo){
                /*e.children.forEach(ce => {
                    if(ce.children.length > 0){ //4depth
                        ce.children.forEach(i => {
                            if (i.menuNo == $("#lowerCategryVal").val()) {
                                $("#lowerCategory").append('<option value="' + i.menuNo + '" selected>' + i.menuNm + '</option>');
                            } else {
                                $("#lowerCategory").append('<option value="' + i.menuNo + '">' + i.menuNm + '</option>');
                            }
                        });
                    }else {
                        if(ce.menuNo == $("#lowerCategryVal").val()){
                            $("#lowerCategory").append('<option value="' + ce.menuNo + '" selected>' + ce.menuNm + '</option>');
                        }else{
                            $("#lowerCategory").append('<option value="' + ce.menuNo + '">' + ce.menuNm + '</option>');
                        }
                    }
                });*/
                if(e.children.length == 0){
                    $("#lowerCategory").append('<option value="' + code + '" selected>없음</option>');
                }else {
                    e.children.forEach(ce => {
                        if(ce.children.length > 0){ //4depth
                            ce.children.forEach(i => {
                                if (i.menuNo == $("#lowerCategryVal").val()) {
                                    $("#lowerCategory").append('<option value="' + i.menuNo + '" selected>' + i.menuNm + '</option>');
                                } else {
                                    $("#lowerCategory").append('<option value="' + i.menuNo + '">' + i.menuNm + '</option>');
                                }
                            });
                        }else {
                            if(ce.menuNo == $("#lowerCategryVal").val()){
                                $("#lowerCategory").append('<option value="' + ce.menuNo + '" selected>' + ce.menuNm + '</option>');
                            }else{
                                $("#lowerCategory").append('<option value="' + ce.menuNo + '">' + ce.menuNm + '</option>');
                            }
                        }
                    });
                }
            }
        });
    }
})();