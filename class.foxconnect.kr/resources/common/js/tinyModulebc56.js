// Prevent Bootstrap dialog from blocking focusin
$(document).on('focusin', function(e) {
    if ($(e.target).closest(".tox-tinymce, .tox-tinymce-aux, .moxman-window, .tam-assetmanager-root").length) {
        e.stopImmediatePropagation();
    }
});


const initModule = (props) => {
    const initWebEditor = (props) =>{
        //constructor
        let constructor = {
            'min_height': 500,
        };

        if(props != undefined && props != null ){
            constructor = merge(constructor,props);
        }
        tinymce.remove();
        tinymce.init({
            content_style: "body p { margin-block: 0; }",
            promotion: false,//프로모션 비활성화
            selector: '.tinymce-editor',
            language: 'ko_KR', //언어팩 설정
            branding: false, //하단부 브랜드 로고 제거
            elementpath: false, //하단부 태크 제
            // sandbox_iframes: false, //iframe xss 보안 정책 이슈 추가
            sandbox_iframes: true, // 2024-05-13 하단에 허용 가능한 사이트 적용.  'scratch.mit.edu'
            sandbox_iframes_exclusions: [
                'youtube.com',
                'youtu.be',
                'vimeo.com',
                'player.vimeo.com',
                'dailymotion.com',
                'embed.music.apple.com',
                'open.spotify.com',
                'giphy.com',
                'dai.ly',
                'codepen.io',
                'scratch.mit.edu',
                'playentry.org',
            ],

            // 기본 삽입 및 도구에 '이미지','코드' 추가
            plugins: [
                'image',
                'link',
                'preview',
                'searchreplace',
                'table',
                'code',
                //'quickbars',//커서에 나오는 퀵메뉴 -- file_picker_types와 연동
                'media',
                'lists',
            ],
            menu: {
                insert: {
                    title: 'insert',
                    items: 'image code vod'
                }
            },
            menubar: 'file edit view insert format table',
            file_picker_types: 'image',
            min_height: constructor.min_height,
            //툴바 customizing
            toolbar: [
                {name: 'font', items: ['fontfamily', 'fontsize']},
                {name: 'history', items: ['undo', 'redo']},
                {name: 'styles', items: ['styles']},
                {name: 'formatting', items: ['bold', 'italic']},
                {name: 'alignment', items: ['alignleft', 'aligncenter', 'alignright', 'alignjustify']},
                {name: 'list',items:['numlist','bullist']},
                // {name: 'indentation', items: ['outdent', 'indent']},//내어쓰기,들여쓰기
                {name: 'added', items: ['image', 'code','lineheight']},
            ],
            line_height_formats: '2pt 4pt 6pt 8pt 10pt 12pt 14pt',
            //파일 업로드 콜백 방식
            file_picker_callback: (cb, value, meta) => {
                const input = document.createElement('input');
                input.setAttribute('type', 'file');
                input.setAttribute('accept', 'image/*');

                input.addEventListener('change', (e) => {
                    const file = e.target.files[0];

                    const reader = new FileReader();
                    reader.addEventListener('load', () => {
                        const id = 'blobid' + (new Date()).getTime();
                        const blobCache =  tinymce.activeEditor.editorUpload.blobCache;
                        const base64 = reader.result.split(',')[1];
                        const blobInfo = blobCache.create(id, file, base64);
                        blobCache.add(blobInfo);
                        cb(blobInfo.blobUri(), { title: file.name });
                    });
                    reader.readAsDataURL(file);
                });

                if (meta.filetype == 'image') {
                    imgUploadCallback(cb, value, meta);
                }
                if (meta.filetype == 'media') {
                    console.log('미디어는 준비중입니다.');
                }
            },
            //upload_handler 커스터마이징 방식
            images_upload_handler: image_upload_handler,
        });
    }

    //이미지 업로드 콜백(삽입)
    const imgUploadCallback = (cb, value, meta) => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');

        let element = document.getElementById(tinymce.activeEditor.id);
        let seCode = $(element).data('seCode');
        let imgAtchFileId = document.getElementById($(element).data('id')).value;
        let elementId = $(element).data('id');

        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            let form_data = new FormData();
            form_data.append('atchFile', file);
            form_data.append('atchFildId', imgAtchFileId);
            form_data.append('seCode', seCode);
            $.ajax({
                data: form_data,
                type: "POST",
                url: '/fms/imgUpload.json',
                cache: false,
                contentType: false,
                enctype: 'multipart/form-data',
                processData: false,
                success: function (result) {
                    let atchFileId = result.data.atchFileId;
                    let fileSn = result.data.fileSn;
                    let imageUrl = "/fms/getImage.do?atchFileId=" + atchFileId + '&fileSn=' + fileSn

                    cb(imageUrl, {title: file.name});

                    // IMG ATCH파일 존재 시 fileSN 중복오류
                    // if (document.getElementById(elementId).value === null || document.getElementById(elementId).value === '') {
                    //     document.getElementById(elementId).value = atchFileId;
                    // }
                }
            });
        });
        input.click();
    };

    //자동 이미지 업로드 처리
    const image_upload_handler = (blobInfo, progress) =>
        new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.withCredentials = false;
            xhr.open('POST', '/fms/imgUpload.json');

            //로딩바
            // xhr.upload.onprogress = (e) => {
            //     progress(e.loaded / e.total * 100);
            // };

            let element = document.getElementById(tinymce.activeEditor.id);
            let seCode = $(element).data('seCode');
            let imgAtchFileId = document.getElementById($(element).data('id')).value;
            let elementId = $(element).data('id');

            xhr.onload = () => {
                if (xhr.status === 403) {
                    reject({message: 'HTTP Error: ' + xhr.status, remove: true});
                    return;
                }

                if (xhr.status < 200 || xhr.status >= 300) {
                    reject('HTTP Error: ' + xhr.status);
                    return;
                }

                const json = JSON.parse(xhr.responseText);
                let imageUrl = '';
                if (json.success) {
                    let result = json;
                    let atchFileId = result.data.atchFileId;
                    let fileSn = result.data.fileSn;
                    imageUrl = "/fms/getImage.do?atchFileId=" + atchFileId + '&fileSn=' + fileSn;
                    $.each(tinymce.activeEditor.dom.select('img'), function (idx) {
                        if ($(this)[0].currentSrc === "") {
                            $(this)[0].currentSrc = imageUrl;
                        }
                    });

                } else {
                    reject('Invalid JSON: ' + xhr.responseText);
                    return;
                }
                resolve(imageUrl);
            };

            xhr.onerror = () => {
                reject('Image upload failed due to a XHR Transport error. Code: ' + xhr.status);
            };

            const formData = new FormData();
            formData.append('atchFile', blobInfo.blob());
            // IMG ATCH파일 존재 시 fileSN 중복오류
            //formData.append('atchFildId', imgAtchFileId);
            formData.append('seCode', seCode);

            xhr.send(formData);
        });

    return {
        initWebEditor,
        imgUploadCallback,
        image_upload_handler
    }
}
const merge = (target, source) => {
    for (let key of Object.keys(source)) {
        if (source[key] instanceof Object) Object.assign(source[key], merge(target[key], source[key]))
    }

    Object.assign(target || {}, source)
    return target
}

const tinyModule = {initModule};
