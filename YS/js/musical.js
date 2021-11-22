//-------------------------------변수 선언------------------------------------------
//api 인증키
const appKey = '8ktFgkosFIYx7p%2FkZzmjWvD20eEUWMgZOipB0SNmBt%2BllCqqY0UoTiS0SHYConkvQ14vg31BhVGRGUFZ%2BMWBfg%3D%3D';
//뮤지컬 url 
const musicalApiLink = 'http://apis.data.go.kr/6260000/BusanCultureMusicalDetailService/getBusanCultureMusicalDetail?serviceKey=';
//공연장 url
const placeApiLink = 'http://apis.data.go.kr/6260000/BusanCulturePerformPlaceService/getBusanCulturePerformPlace?serviceKey=';
//테마 정보 url
const themeApiLink = 'http://apis.data.go.kr/6260000/BusanCultureThemeCodeService/getBusanCultureThemeCode?serviceKey=';
//공용링크
const commonApiLink = '&pageNo=1&numOfRows=';

//open api 데이터 타입 파라미터
const type = '&resultType=json';
//cors 에러 해결을 위한 프롣시
const proxy = 'https://busan-show.herokuapp.com/';

//초기 뮤지컬 url 생성
const initMusicalUrl = proxy + musicalApiLink + appKey + commonApiLink + 1 + type;
//초기 공연장 url
const initHallUrl = proxy + placeApiLink + appKey + commonApiLink + 1 + type;
//초기 테마정보 url
const initThemeUrl = proxy + themeApiLink + appKey + commonApiLink + 1 + type;

//현재날짜를 ISOSTring으로 반환(YYYY-MM-DDTtime:min:sec)-json 날짜와 비교가능
const today = new Date().toISOString();

//뮤지컬 목록을 저장할 배열
var showInformation = [];
//공연장 목록을 저장할 배열
var placesInformation = [];
//공연장 마커
var placeMarkers = [];
//테마 정보 저장할 배열
var themeInformation = [];
//상영물 정보를 그릴 dataPane
let dataPane = document.querySelector(".theater_data");
//선택한 사영물의 상세 정보를 그릴 detailData
let detailData = document.querySelector(".detailInfo");
//----------------------------------------함수-------------------------------------
//공연 종료일기준으로 정렬
function sortByEnd(arrData) {
    for (var i = arrData.length - 1; i > 0; i--) {
        for (var j = 0; j < i; j++) {
            if (arrData[j].op_ed_dt > arrData[j + 1].op_ed_dt) {
                var temp = arrData[j];
                arrData[j] = arrData[j + 1];
                arrData[j + 1] = temp;
            }
            else if (arrData[j].op_ed_dt == arrData[j + 1].op_ed_dt) {
                if (arrData[j].op_st_dt > arrData[j + 1].op_st_dt) {
                    var temp = arrData[j];
                    arrData[j] = arrData[j + 1];
                    arrData[j + 1] = temp;
                }
            }
        }
    }
    return arrData;
}
//키워드 필터-추후 기능추가 요망
//현재기능-괄호 앞 키워드까지만 검색
function keywordFilter(str) {
    var arr = str.split('');//문자별로 분할
    var indexNum;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == '(') { //괄호 검색
            indexNum = i;//괄호의 인덱스 저장
        }
    }

    var result = arr.join('');
    result = result.substring(0, indexNum);//제일앞부터 괄호앞까지 자르기
    //console.log(result);
    return "부산 " + result; //스트링으로 변환하여 반환

}

//버튼 클릭시 사용되는 함수
function clickedShow(show, place, i, placeMarkers) {
    const defaultMarkerImage = defaultMarker.getImage();
    //장소 검색 토큰
    let isSerched = false;
    var c = place.length + 1;
    var addr;//공연장 목록이없는경우 공연장을 검색하여 위치를 저장
    for (var k = 0; k < place.length ; k++) {
        //해당 뮤지컬 상영 공연장 id를 공연장 목록 서비스에서 검색
        if (place[k]["placeId"] == show[i].place_id) {
            c = k;
            break;
        }
    }
    var slttd = show[i].place_lttd;
    var slngt = show[i].place_lngt
    if (c < place.length) {// 검색이 된경우
        isSerched = true;
        setCenter(slttd,slngt);
        resetMarkerImg(placeMarkers,defaultMarkerImage);
        var t = whatMarkerIndex(slttd,placeMarkers);
        setSpMarkerImg(placeMarkers, t);
    }
    else {//검색이 되지않은 경우
        isSerched = false;
        setCenter(slttd,slngt);
        resetMarkerImg(placeMarkers,defaultMarkerImage);
        var t = whatMarkerIndex(slttd,placeMarkers);
        setSpMarkerImg(placeMarkers, t);
    }

    
    
    /*
    --------------json 객체의 맴버-----------
    변수 명         설명                   샘플데이터
    ==================================================
    res_no          공연 번호               2020070045
    title           공연 제목               브로드웨이42번가 [부산]
    op_st_dt        상영 시작일자           2020-09-04
    op_ed_dt        상영 종료일자           2020-09-06
    op_at           오픈런                  N
    place_id        상영장소 아이디         FC001347          
    place_nm        상영장소 이름           소향씨어터
    theme           테마코드                0003,1002,2002
    runtime         런타임                  2시간 40분
    showtime        관람회차                금요일(20:00), 토요일 ~ 일요일(14:00,18:30)
    rating          관람등급                만 9세 이상
    price           가격                    VIP석 140,000원, OP석 130,000원, R석 120,000원, S석 90,000원, A석 60,000원
    original        원작명                    
    casting         출현진                  송일국, 이종혁, 양준모, 최정원, 정영주, 배해선, 전수경 등
    crew            제작진                  
    enterprise      기획사                  주)CJ ENM, (주)샘컴퍼니
    avg_star        평점                    0
    dabom_url       다봄 url                http://busandabom.net/play/view.nm?lang=ko&amp;url=play&amp;menuCd
    ------------------------------------------*/
    //------------------------------버튼 클릭시 상세정보 띄우기-------------------


    //상세내용 기입할 dom 추가
    let detailDiv = document.createElement('Div');
    let titleD = document.createElement('p');
    let whenD = document.createElement('p');
    let whereD = document.createElement('p');
    let whereAddr = document.createElement('p');
    let showtimeD = document.createElement('p');
    let runtimeD = document.createElement('p');
    let themeCodes = document.createElement('p');
    let ratingD = document.createElement('p');
    let priceD = document.createElement('p');
    let castingD = document.createElement('p');
    let entD = document.createElement('p');
    let avgStarD = document.createElement('p');
    let dabomD = document.createElement('button');
    let getDiret = document.createElement('button');
    //dom 내용 추가
    titleD.textContent = "제목: " + show[i].title;
    whenD.textContent = "상영기간: " + show[i].op_st_dt + '~' + show[i].op_ed_dt;
    whereD.textContent = "장소: " + show[i].place_nm;

    if (isSerched) {
        whereAddr.textContent = "주소: " + place[k].addr;
        getDiret.textContent = "길찾아보기(새창으로 이동합니다.)"
        getDiret.onclick = function () { window.open("https://map.kakao.com/link/to/" + show[i].place_nm + "," + place[c].lttd + "," + place[c].lngt) }
    }
    else {


        // 장소 검색 객체를 생성합니다
        var ps = new kakao.maps.services.Places();
        //좌표로 주소를 가져오는 객체를 생성
        var geocoder = new kakao.maps.services.Geocoder();
        //키워드 필터링
        var searchKeyword = keywordFilter(show[i].place_nm);
        //console.log(searchKeyword);
        // 키워드로 장소를 검색합니다
        ps.keywordSearch(searchKeyword, placesSearchCB);


        var callback = function (result, status) {
            if (status === kakao.maps.services.Status.OK) {
                whereAddr.textContent = "주소: " + result[0].address.address_name
            }
        };
        // 키워드 검색 완료 시 호출되는 콜백함수 입니다
        function placesSearchCB(data, status, pagination) {
            if (status === kakao.maps.services.Status.OK) {
                geocoder.coord2Address(data[0].x, data[0].y, callback);
                getDiret.textContent = "길찾아보기(새창으로 이동합니다.)"
                getDiret.onclick = function () { window.open("https://map.kakao.com/link/to/" + data.place_name + "," + data[0].y + "," + data[0].x) }

            }
            else {
                console.log("검색결과 없음");
            }
        }

    }
    runtimeD.textContent = "상영 시간: " + show[i].runtime;
    showtimeD.textContent = "상영 시각: " + show[i].showtime;
    //테마코드 문자화
    var themeStrArr = getTheme(show[i].theme, themeInformation);
    themeCodes.textContent = "테마 코드: " + themeStrArr;
    ratingD.textContent = "관람 연령: " + show[i].rating;
    priceD.textContent = "가격: " + show[i].price;
    castingD.textContent = "캐스팅: " + show[i].casting;
    entD.textContent = "공급: " + show[i].enterprise;
    avgStarD.textContent = "평점: " + show[i].avg_star;
    dabomD.textContent = "다봄 에서 정보 더 보고 예매하러가기 ";
    dabomD.onclick = function () { window.open(show[i].dabom_url); }
    //dom 추가ㅣ
    detailData.replaceChildren(detailDiv);
    detailDiv.appendChild(titleD);
    detailDiv.appendChild(whenD);
    detailDiv.appendChild(whereD);
    detailDiv.appendChild(whereAddr);
    detailDiv.appendChild(showtimeD);
    detailDiv.appendChild(runtimeD);
    detailDiv.appendChild(themeCodes);
    detailDiv.appendChild(ratingD);
    detailDiv.appendChild(priceD);
    detailDiv.appendChild(castingD);
    detailDiv.appendChild(entD);
    detailDiv.appendChild(avgStarD);
    detailDiv.appendChild(dabomD);
    detailDiv.appendChild(getDiret);
};
//테마코드 문자열을 받고 한글 테마명을 리턴하는 함수
function getTheme(themeCode, themeInfos){//themeCode: 테마코드 문자열, themeInfos: 테마코드api추출 배열
    themeCodeArr = themeCode.split(",")// , 단위로 분리하여 코드배열 생성
    var themeStrArr =[];//한글 테마를 저장할 배열
    for(var i = 0; i<themeCodeArr.length;i++){
        for(var j = 0; j<themeInfos.length;j++){
            if(themeCodeArr[i]==themeInfos[j].theme){//코드 찾으면 실행
                themeStrArr.push(themeInfos[j].theme_nm)
                break;//찾은 후 j반복문 중단, 다음 코드를 한글화 시킴
            }
        }
    }
    return themeStrArr;//한글화된 테마명 반환
}
//--------------------------------------------함수 선언 끝--------------------------------------------------------------
//--------------------------------------------fetch 시작---------------------------------------------------------
//테마 정보 추출
fetch(initThemeUrl)
    .then((res)=>res.json())
    .then((resJson)=>{
        //총 테마 개수 파라미터
        var numOfRowsTheme = resJson.getBusanCultureThemeCode.totalCount;
        //총 테마 개수 만큼 불러오는 url
        var themeUrl = proxy + themeApiLink + appKey + commonApiLink + numOfRowsTheme + type;
        fetch(themeUrl)
            .then((res)=>res.json())
            .then((resJson)=>{
                var theme = resJson.getBusanCultureThemeCode.item;
                for(let i=0; i< numOfRowsTheme;i++){
                    themeInformation.push(theme[i]);
                }
            });

    });

//공연장 정보 추출
fetch(initHallUrl)//공연장 초기값
    .then((res) => res.json())
    .then((resJson) => {
        //총 공연장 개수 파라미터
        var numOfRowsPlace = resJson.getBusanCulturePerformPlace.totalCount;
        //총 공연장 갯수만큼 불러오는 url
        var hallUrl = proxy + placeApiLink + appKey + commonApiLink + numOfRowsPlace + type;

        fetch(hallUrl)//전체 공연장
            .then((res) => res.json())
            .then((resJson) => {
                //테스트 문구-done
                //dataPane_t.innerText = JSON.stringify(resJson,null,1);
                var place = resJson.getBusanCulturePerformPlace.item;
                for (let i = 0; i < numOfRowsPlace; i++) {
                    placesInformation.push(place[i]);// 공연장 데이터를 총 공연장갯수만큼 삽입

                }
            });
    });

//뮤지컬 정보추출및 전반적인 동작코드
fetch(initMusicalUrl)//뮤지컬 초기 값
    .then((res) => res.json())
    .then((resJson) => {
        //총 공연 개수 파라미터
        var numOfRowsMusical = resJson.getBusanCultureMusicalDetail.totalCount;
        //총 공연 개수만큼 불러오는 url
        var musicalUrl = proxy + musicalApiLink + appKey + commonApiLink + numOfRowsMusical + type;

        fetch(musicalUrl)//전체 뮤지컬 epdlxj cncnf
            .then((res) => res.json())
            .then((resJson) => {
                //정상적으로 호출되는지 테스트-done
                //console.log(placesInformation[0].placeNm)
                // ---------------------------여기서부터 작동될 메인코드------------------------------------
                //musical에 뮤지컬 정보 호출
                var musical = resJson.getBusanCultureMusicalDetail.item;
                //데이터 호출테스트-done
                //console.log(musical);
                for (var i = 0; i < numOfRowsMusical; i++) {
                    //현시점과 비교하여 종료일이 현시점보다 크거나() 같은경우만 뮤지컬 정보에 push
                    if (musical[i].op_ed_dt >= today) {
                        showInformation.push(musical[i]);
                    }
                }
                //삽입 테스트-done
                //console.log(showInformation)
                showInformation = sortByEnd(showInformation);
                //정렬 테스트-done
                /*for(var i = 0; i<showInformation.length;i++){
                    console.log(showInformation[i].title+": "+showInformation[i].op_st_dt+"~"+showInformation[i].op_ed_dt);
               }*/

                //모든 공연장에 마커 표시
                /*for (var i = 0; i < placesInformation.length; i++) {
                 var lat = placesInformation[i].lttd;
                 var lng = placesInformation[i].lngt;
                 addMarkerToArray(lat,lng,placeMarkers);
                 }
                 addMarkerToMap(placeMarkers);*/

                //선택 장르의 상영장만 마커 띄우기
                for (let i = 0; i < showInformation.length; i++) {
                    for (let j = 0; j < placesInformation.length; j++) {
                        if (showInformation[i].place_id == placesInformation[j].placeId) {
                            var lat = placesInformation[j].lttd;
                            var lng = placesInformation[j].lngt;
                            //공연장 좌표 공연정보에 추가
                            showInformation[i].place_lttd = lat;
                            showInformation[i].place_lngt = lng;
                            
                            var slttd = showInformation[i].place_lttd;
                            var slngt = showInformation[i].place_lngt;
                            
                            if (!(isOverlap(slttd, slngt, placeMarkers))) {
                                addMarkerToArray(slttd, slngt, placeMarkers);
                                //console.log("added marker num: "+placeMarkers.length);
                            }
                            else {
                                //console.log("overLaped");
                            }
                            break;
                        }
                        else {
                            // 장소 검색 객체를 생성합니다
                            var ps = new kakao.maps.services.Places();
                            var searchKeyword = keywordFilter(showInformation[i].place_nm);
                            // 키워드로 장소를 검색합니다
                            ps.keywordSearch(searchKeyword, placesSearchCB);

                            // 키워드 검색 완료 시 호출되는 콜백함수 입니다
                            function placesSearchCB(data, status, pagination) {
                                if (status === kakao.maps.services.Status.OK) {
                                    //검색된 공연장 좌표 공연 정보에 추가
                                    showInformation[i].place_lttd = data[0].y;
                                    showInformation[i].place_lngt = data[0].x;

                                    var slttd = showInformation[i].place_lttd;
                                    var slngt = showInformation[i].place_lngt;
                                    if (!(isOverlap(slttd, slngt, placeMarkers))) {
                                        addMarkerToArray(slttd, slngt, placeMarkers);
                                        //console.log("added marker num: "+placeMarkers.length);
                                    }
                                    else {
                                        //console.log("overLaped");
                                    }
                                }

                            }
                            break;
                        }
                    }
                }
                addMarkerToMap(placeMarkers)
                //버튼 그리기
                for (let i = 0; i < showInformation.length; i++) {
                    //버튼 정보
                    let myButton = document.createElement('button');
                    myButton.className = 'simpleInfo';
                    myButton.style.margin = '2%';
                    myButton.style.height = '25%';
                    myButton.style.width = '75%';
                    myButton.style.boxShadow = '5px 5px 5px gray';
                    myButton.style.borderRadius = "10px";
                    myButton.onmouseover = function (event) {
                        event.target.style.backgroundColor = "skyblue";
                    }
                    myButton.onmouseout = function (event) {
                        event.target.style.backgroundColor = "#EAEAEA";
                    }
                    myButton.onclick = function (event) {
                        clickedShow(showInformation, placesInformation, i, placeMarkers);
                        event.target.style.backgroundColor = "skyblue";
                    }

                    //d내용 추가
                    myButton.innerHTML =
                        showInformation[i].title + "<br>"
                        + showInformation[i].op_st_dt + '~' + showInformation[i].op_ed_dt + "<br>"
                        + showInformation[i].place_nm;


                    //dom 추가
                    dataPane.appendChild(myButton);
                }
                //console.log(showInformation);
                //console.log(placeMarkers);
            });
    });