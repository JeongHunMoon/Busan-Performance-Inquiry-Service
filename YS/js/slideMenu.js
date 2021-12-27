document.addEventListener('DOMContentLoaded', function () {
    document.querySelector(".menu_button").addEventListener("click", function () {
        if (document.querySelector('.menu').classList.contains('on')) {
            //메뉴 닫기
            document.querySelector('.menu').classList.remove('on');
            document.querySelector('.menu_box').classList.remove('on');
            document.querySelector('.menu_button').classList.remove('on');
            document.querySelector('.menu_title').classList.remove('on');
            //어두운 레이어 해제
            document.querySelector('#dimmed').remove();
        }
        else {
            //메뉴 펼치기
            document.querySelector('.menu').classList.add('on');
            document.querySelector('.menu_box').classList.add('on');
            document.querySelector('.menu_button').classList.add('on');
            document.querySelector('.menu_title').classList.add('on');
            //어두운 레이어 추가
            let div = document.createElement('div');
            div.id = 'dimmed';
            div.onclick = function(){//여백 클릭시 메뉴 닫힘
                if (document.querySelector('.menu').classList.contains('on')) {
                    //메뉴 닫기
                    document.querySelector('.menu').classList.remove('on');
                    document.querySelector('.menu_box').classList.remove('on');
                    document.querySelector('.menu_button').classList.remove('on');
                    document.querySelector('.menu_title').classList.remove('on');
                    //어두운 레이어 해제
                    document.querySelector('#dimmed').remove();
                }
            }
            document.body.append(div);
        }
    });

});
