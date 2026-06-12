(function (){

    $(document).ready(function (){
        getQuizQestn(null);
    });

    /**
     * 퀴즈 질문 항목 선택
     */
    $(document).on('click', '.checkradio', function (){
        if($(this).data('respnsSeCd') === 'RSC02'){ //퀴즈점프
            getQuizQestn($(this).data('respnsId'));
        } else if($(this).data('respnsSeCd') === 'RSC03'){ //퀴즈종료
            quizEnd($(this).data('respnsId'), $(this).data('sortNo'));
        } else {
            alert("잘못된 데이터 입니다.");
        }
    });

    /**
     * 콘텐츠 Click
     */
    $(document).on('click', '.course-figure img', function (){
        $('.moveCourseMap').click();
    });

    /**
     * 코스보러가기 Click
     */
    $(document).on('click', '.moveCourseMap', function (e){
        e.preventDefault();

        let url = $(this).attr('href');
        let courseId = $(this).data('courseId');
        $.ajax({
            url: url,
            type: 'get',
            data: {'courseId': courseId},
            dataType: 'json',
            success: function(result) {
                if(result.message) {
                    // bootbox.alert({ title: '확인', message: result.message, size: 'small' });
                    alert(result.message);
                }

                if(result.success) {
                    location.href = result.redirectUrl;
                }
            }
        });
    });

    /**
     * 퀴즈 질문
     */
    function getQuizQestn(qestnNo){
        $.ajax({
            url: '/fox/quiz/courseQuizReco.json',
            type: 'get',
            data: {'qestnNo': qestnNo},
            dataType: 'json',
            success: function(result) {
                if(result.message) {
                    // bootbox.alert({ title: '확인', message: result.message, size: 'small' });
                    alert(result.message);
                }

                if(result.success) {
                    let qestn = result.data.result;
                    if(qestn != null){
                        let templat =
                            '<header><figure>'
                            + '<img src="/resources/front/site/SITE_00000/images/character/character_face.png" alt=""></figure>'
                            + '<h3 class="num">Q' + qestn.sortNo + '</h3></header>'
                            + '<div class="course-quiz-cont">'
                            + '<div class="quiz-tit">' + qestn.qestnCn + '</div>'
                            + '<fieldset class="quiz-cont checkradio-quiz-area">';

                        qestn.optionList.forEach((option, idx) => {
                            templat +=
                                '<div class="checkradio" data-respns-id="' + option.respnsId + '" data-respns-se-cd="' + option.respnsSeCd + '" data-sort-no="'+ option.sortNo +'">'
                                + '<input type="radio" id="q'+ qestn.sortNo +'_'+ idx +'" name="q' + qestn.sortNo + '">'
                                + '<label for="q'+ qestn.sortNo +'_'+ idx +'">'+ option.optionCn +'</label></div>';
                        });
                        templat +=
                            '</fieldset></div>';

                        $('.quiz-item').empty().append(templat);
                    } else {
                        alert("준비중입니다.");
                        location.href = '/index.do';
                    }
                }
            }
        });
    }

    /**
     * 퀴즈 종료
     * @param courseId
     */
    function quizEnd(courseId, sortNo){
        $.ajax({
            url: '/fox/quiz/courseRecomendQuizEnd.json',
            type: 'get',
            data: {'courseId': courseId},
            dataType: 'json',
            success: function(result) {
                if(result.message) {
                    // bootbox.alert({ title: '확인', message: result.message, size: 'small' });
                    alert(result.message);
                }

                if(result.success) {
                    let course = result.data.result;
                    if(course != null){
                        // 24.05.07 [엔트리 코드퀘스트] 문항 결과 메세지 하드코딩
                        const q5_1_msg = '엔트리 코드퀘스트 Level 4까지 모두 마스터해볼까요?<br/>사고력 문제부터 작품만들기까지 블록코딩으로 다양한 미션 프로그램을 만들어봐요.<br/>모두 마스터하면 YBM Coding Specialist 4급과 3급에도 도전해볼 수 있어요!';
                        let courseRcmdtnMsg =
                            (courseId == 'COURSE_0000000000017' && sortNo == 2) ?
                                q5_1_msg : course.courseRcmdtnMsg;

                        let imgUrl =
                            (course.thumbUrl != null && course.thumbUrl.length > 0) ?
                                course.thumbUrl : noImgUrl; // 기본이미지

                        let respnsTamplat =
                            '<header><h3>‘<em>' + course.courseNm + '</em>’ 콘텐츠를 추천해요.</h3>'
                            + '<p>' + courseRcmdtnMsg + '</p></header>'
                            + '<figure class="course-figure"><img src="' + imgUrl + '" alt="'+ course.courseNm +'">'
                            + '<div class="btn-cont">'
                            + '<a href="/embed/fox/course/checkCourseAuth.json" data-course-id="' + course.courseId +'" class="btn-lg spot2 moveCourseMap">코스 보러가기</a>'
                            + '<a href="/fox/quiz/courseQuizReco.do" class="btn-lg">다시 추천받기</a></div>';
                        $('.quiz-item').empty().removeClass('is-active');
                        $('.quiz-reco').empty().append(respnsTamplat);
                        $('.quiz-reco').addClass('is-active');
                    } else {
                        alert("조회에 실패하였습니다.");
                        location.reload();
                    }
                }
            }
        });
    }
})();