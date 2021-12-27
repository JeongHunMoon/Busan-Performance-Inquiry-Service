//-------------------------------변수 선언------------------------------------------
//api 인증키
const appKey = '8ktFgkosFIYx7p%2FkZzmjWvD20eEUWMgZOipB0SNmBt%2BllCqqY0UoTiS0SHYConkvQ14vg31BhVGRGUFZ%2BMWBfg%3D%3D';
//뮤지컬 url 
const musicalApiLink = 'http://apis.data.go.kr/6260000/BusanCultureMusicalDetailService/getBusanCultureMusicalDetail?serviceKey=';
//오페라 url
const operaApiLink = 'http://apis.data.go.kr/6260000/BusanCultureOperaDetailService/getBusanCultureOperaDetail?serviceKey=';
//연극 url
const playApiLink = 'http://apis.data.go.kr/6260000/BusanCulturePlayDetailService/getBusanCulturePlayDetail?serviceKey=';
//전통예술 url
const tradApiLink = 'http://apis.data.go.kr/6260000/BusanCultureTraditionDetailService/getBusanCultureTraditionDetail?serviceKey=';
//클래식 url
const classicApiLink = 'http://apis.data.go.kr/6260000/BusanCultureClassicDetailService/getBusanCultureClassicDetail?serviceKey=';
//콘서트 url
const concertApiLink = 'http://apis.data.go.kr/6260000/BusanCultureConcertDetailService/getBusanCultureConcertDetail?serviceKey=';
//전시 url
const exhiApiLink = 'http://apis.data.go.kr/6260000/BusanCultureExhibitDetailService/getBusanCultureExhibitDetail?serviceKey=';
//무용 url
const danceApiLink = 'http://apis.data.go.kr/6260000/BusanCultureDanceDetailService/getBusanCultureDanceDetail?serviceKey=';
//공연장 url
const placeApiLink = 'http://apis.data.go.kr/6260000/BusanCulturePerformPlaceService/getBusanCulturePerformPlace?serviceKey=';
//전시공간 url
const exPlaceApiLink = 'http://apis.data.go.kr/6260000/BusanCultureExhibitPlaceService/getBusanCultureExhibitPlace?serviceKey=';
//테마 정보 url
const themeApiLink = 'http://apis.data.go.kr/6260000/BusanCultureThemeCodeService/getBusanCultureThemeCode?serviceKey=';
//공영주차장
const parking = "http://apis.data.go.kr/6260000/BusanPblcPrkngInfoService/getPblcPrkngInfo?serviceKey="
//공용링크
const commonApiLink = '&pageNo=1&numOfRows=';

//open api 데이터 타입 파라미터
const type = '&resultType=json';
//cors 에러 해결을 위한 프롣시
const proxy = 'https://busan-show.herokuapp.com/';
// else https://moonjeonghunapp1.herokuapp.com/

//초기 뮤지컬 url 생성
const initMusicalUrl = proxy + musicalApiLink + appKey + commonApiLink + 1 + type;
//초기 오페라 url 생성
const initOperaUrl = proxy + operaApiLink + appKey + commonApiLink + 1 + type;
//초기 오페라 url 생성
const initPlayUrl = proxy + playApiLink + appKey + commonApiLink + 1 + type;
//초기 전통예술 url
const initTradUrl = proxy + tradApiLink + appKey + commonApiLink + 1 + type;
//초기 전시 url
const initExhiUrl = proxy + exhiApiLink + appKey + commonApiLink + 1 + type;
//초기 클래식 url
const initClassicUrl = proxy + classicApiLink + appKey + commonApiLink + 1 + type;
//초기 콘서트 url
const initConcertUrl = proxy + concertApiLink + appKey + commonApiLink + 1 + type;
//초기 무용 url
const initDanceUrl = proxy + danceApiLink + appKey + commonApiLink + 1 + type;
//초기 공연장 url 생성
const initPlaceUrl = proxy + placeApiLink + appKey + commonApiLink + 1 + type;
//초기 전시공간 url 생성
const initExPlaceUrl = proxy + exPlaceApiLink + appKey + commonApiLink + 1 + type;
//초기 테마정보 url 생성
const initThemeUrl = proxy + themeApiLink + appKey + commonApiLink + 1 + type;
//초기  주차장정보 url 생성
const initParking = proxy + parking + appKey + commonApiLink + 1 + type;

//현재날짜를 ISOSTring으로 반환(YYYY-MM-DDTtime:min:sec)-json 날짜와 비교가능
const today = new Date().toISOString().split("T")[0];
//각데이터별 fetch 완료 토큰
var musicalLoaded = false;
var operaLoaded = false;
var playLoaded = false;
var tradLoaded = false;
var exhiLoaded = false;
var classicLoaded = false;
var concertLoaded = false;
var danceLoaded = false;
var placeLoaded = false;
var exPlaceLoaded = false;
var themeLoaded = false;
var parkingLoaded = false;
//위경도검색횟수 카운터
var searchCnt = 0;
//장소없는 배열 카운터
var noPlaceCnt = 0;
//주소 검색 결과를 저장할 배열
let resultDatas = [];
//infos 키값
var infosKey = ["musical", "opera", "play", "trad", "exhi", "classic", "concert", "dance", "place", "theme"];
//뮤지컬+오페라+연극
var infos = []
//공연장 목록을 저장할 배열
var placesInformation = [];
//이미지 로드 카운터
var imgCnt = 0;
//상영물 갯수
var showNum = 0;
//상영중 공연
var curShows = [];
//주차장 데이터
var parkingArr = [];
//주차장 검색 결과
var parkingResult = [];
//주차장 주대 검색수
var maxParkSearchCnt = 0;
//주차장 검색 카운터1번
var parkSearchCnt = 0;
//주차장 검색 카운터2번
var parkSearchCnt2 = 0;
//공연장 마커
var placeMarkers = [];
//테마 정보 저장할 배열
var themeInformation = [];
//fetch 로딩 카운터
var loadCnt = 0;
//로딩 문구
var load = document.querySelector(".state");
//이미지 로딩 문구
var loadImg = document.querySelector(".loadImg");
//상영물 정보를 그릴 dataPane
let dataPane = document.querySelector(".container");
//선택한 사영물의 상세 정보를 그릴 detailData
let detailData = document.querySelector(".detailInfo");
//test
let sectionMap = document.querySelector(".sectionMap");
//주차장 스위치
let parkingSw = document.getElementById("parking");

//----------------------------------------함수-------------------------------------
//포스트 이미지 url 반환 함수
function getImgUrl(show) {//다봄 url삽입
    fetch(proxy + show.dabom_url)
        .then(function (response) {
            return response.text();
        }).then(function (html) {
            var parser = new DOMParser();
            //다봄 페이지 html 파일 가져오기
            var doc = parser.parseFromString(html, 'text/html');
            //페이지 내 포스터이미지 요소 가져오기
            var imgElement = doc.querySelector("div.leftbox>img");
            //이미지요소의 소스, 즉 이미지의 호스팅 url 가져오기
            var imgUrl = imgElement.src;
            //가져온 url에 도메인이 빠져있어서 분해후 마지막 파일명 추출하고 url생성
            var splitUrl = imgUrl.split('/')
            imgUrl = 'http://busandabom.net/images/contents/' + splitUrl[5]
            //일부파일은 경로가 다름
            if (splitUrl[5] == "noimg_classic.jpg"
                || splitUrl[5] == "noimg_art.jpg"
                || splitUrl[5] == "noimg_dance.jpg"
                || splitUrl[5] == "noimg_concert.jpg"
                || splitUrl[5] == "noimg_musical.jpg") {
                imgUrl = 'http://busandabom.net/img/content/' + splitUrl[5]
            }
            //데이터의 이미지 url을 가져온 url로 변경 
            show.imgUrl = imgUrl;
            //로드 카운터 증가
            imgCnt++;
            //로딩문구출력
            loadImg.innerHTML = "포스터 이미지 로딩중 - " + imgCnt + "/" + showNum;
            //마지막 로드시 1s간 완료문구
            if (imgCnt == showNum) {
                loadImg.innerHTML = "완료"
                setTimeout(() => {
                    loadImg.innerHTML = ""
                }, 1000)
            }
        })
}

//공연 종료일기준으로 정렬후 시작일기준 정렬(Bubble Sort)
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

//가까운순으로 정렬(Bubble Sort)
function sortByUsrLoc(show) {
    var usrY = usrLatitude;
    var usrX = usrLongitude;
    //사용자위치가 있을떄
    if(usrY != 0 && usrX !=0){
        for (var i = show.length - 1; i > 0; i--) {
            for (var j = 0; j < i; j++) {
                if (getDistanceFromLatLonInKm(usrY, usrX, show[j].lttd, show[j].lngt) > getDistanceFromLatLonInKm(usrY, usrX, show[j + 1].lttd, show[j + 1].lngt)) {
                    var temp = show[j];
                    show[j] = show[j + 1];
                    show[j + 1] = temp;
                }
            }
        }
        
    }
    //사용자위치가 없을때
    else {
        alert("사용자 위치 정보가 없습니다.");
        // 사용자 현재위치가 받을수있을대 실행됨 허용 안내후 위치 가져오기
        navigator.geolocation.getCurrentPosition(function (pos) {
            usrLatitude = pos.coords.latitude;
            usrLongitude = pos.coords.longitude;
            usrLocation();//사용자 현재위치에 마커 표시 밑 맵 센터로
        });
        //체크해제
        var sort = document.getElementById("sort");
        sort.checked = false;
    }
    return show;
}

//현재기능-괄호 앞 키워드까지만 검색
function keywordFilter(str) {
    var arr = str.split('');//문자별로 분할
    var indexNum;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == '(' || arr[i] == '[') { //괄호 검색
            indexNum = i;//괄호의 인덱스 저장
        }
    }
    var result = arr.join('');
    result = result.substring(0, indexNum);//제일앞부터 괄호앞까지 자르기
    //console.log(result);
    return result; //스트링으로 변환하여 반환
}

//공연데이터에 포함된 공연장 이름과 카맵에서 검색한 장소 둘을 비교해주는함수
function isSame(str1, str2) {
    //console.log("start")
    var isSame = false;
    //console.log("first "+str1+" "+str2)
    if (str1 == str2) {//두 문자열이 완전 일치
        isSame = true;
    }
    else {
        var secondCompareStr1 = keywordFilter(str1).replace(/(\s*)/g, "");
        var secondCompareStr2 = keywordFilter(str2).replace(/(\s*)/g, "");
        //console.log("second "+secondCompareStr1+" "+secondCompareStr2);
        if (secondCompareStr1 == secondCompareStr2) {//괄호와 공백을 제거한 두문자열의 일치
            isSame = true;
        }
        else {
            var noSpaceStr1 = str1.replace(/(\s*)/g, "");//공백제거
            var noSpaceStr2 = str2.replace(/(\s*)/g, "");
            var strArrS = noSpaceStr1.split('');//작은문자열(검사전)
            var strArrB = noSpaceStr2.split('');//큰문자열(검사전)
            if (strArrB.length < strArrS.length) {//검사하고 이름에맞게 맞춰줌
                var temp = strArrS;
                strArrS = strArrB;
                strArrB = temp;
            }
            //console.log("third "+strArrB+" "+strArrS);
            if (strArrB == strArrS) {//정제한 문자열이 같으면 true
                isSame = true;
            }
            else {
                for (var i = 0; i < strArrS.length; i++) {//큰문자열앞부터에 끝까지에 작은문자열이 포함되있는지 검사
                    //console.log(strArrS);
                    if (strArrS[i] != strArrB[i]) {//중간에 같지않으면 break하고 false값 반환
                        //console.log("forth not Matched "+strArrS+" "+strArrB);
                        isSame = false;
                        var forthStr1 = keywordFilter(str1)//괄호및 공백제거
                        forthStr1 = forthStr1.replace(/(\s*)/g, "");

                        var forthStr2 = keywordFilter(str2)
                        forthStr2 = forthStr2.replace(/(\s*)/g, "");

                        forthStr1 = forthStr1.replace("부산", '');//부산 제거
                        forthStr2 = forthStr2.replace("부산", '');
                        //console.log("fifth "+forthStr1+" "+forthStr2);
                        if (forthStr1 == forthStr2) {
                            isSame = true;
                        }
                        else {
                            //특수케이스1 부산사직실내체육관 & 부산사직종합운동장 실내체육관
                            if (str1 == "부산사직실내체육관" && str2 == "부산사직종합운동장 실내체육관") {
                                isSame = true;
                            }
                            //특수케이스2 PANACA B & 파나카 B
                            else if (str1 == "PANACA B" && str2 == "파나카B") {
                                isSame = true;
                            }
                            else {
                                //console.log("ended with no match "+str1 +", "+ str2)
                                isSame = false//분기의 마지막
                            }
                        }
                        break;
                    } else {
                        isSame = true;//for문이 도중에 멈추지않았다면 true
                    }
                }
            }
        }
    }
    //검색결과가 같은지 반환
    return isSame;
}

//show 배열에따라 마커추가
function addMarkerByShow(show, placeMarkers) {
    for (var t = 0; t < show.length; t++) {
        if (!(isOverlap(show[t].lttd, placeMarkers, show[t].type))) {//중복체크후 마커 추가
            addMarkerToArray(show[t], placeMarkers, show);
        }
        else {
        }
    }
    return placeMarkers;
}
//라디오버튼 클릭시 사용되는 함수
function clickedShow(show, i, placeMarkers) {
    showClicked = true;
    let selShow = show[i];
    //센터 표기
    //console.log(selShow);
    setCenter(selShow.lttd, selShow.lngt);
    if (!MarkerClicked) {
        placeMarkers = []
        //마커 리셋
        placeMarkers = addMarkerByShow(show, placeMarkers);
        //주차장 마커 삽입
        if (parkingSw.checked) {
            addClosePark(selShow, parkingResult, placeMarkers);
        }
        //공연장 lttd에 해당하는 마커배열의 인덱스 get
        var t = getMarkerIndex(selShow.lttd, placeMarkers);
        //해당 인덱스의 마커 이미지 변경
        placeMarkers[t].setImage(selMarkerImage);
        placeMarkers[t].setZIndex(20);

        clusterer.clear();
        addMarkerToMap(placeMarkers);
        clusterer.redraw();
    }

    //------------------------------버튼 클릭시 상세정보 띄우기-------------------
    //기존내용 지우기
    if (sectionMap.firstChild.className == "detailInfoPannel") {
        sectionMap.removeChild(sectionMap.firstChild);
    }

    let testDiv = document.createElement('div');
    testDiv.className = "detailInfoPannel";

    //상세내용 기입할 dom 추가
    let detailDiv = document.createElement('Div');
    let emptyDiv = document.createElement('Div');
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
    //이미지
    let img = document.createElement('img');
    //닫기버튼
    let closeButton = document.createElement('button');
    closeButton.className = "closeButton";
    //처음엔 로딩이미지
    img.src = show[i].imgUrl;
    if (img.src != "http://mpv990422.duckdns.org/imgs/smallSpinner.gif") {
        img.style.width = "240px"
    }


    //dom 내용 추가
    titleD.innerHTML = "제목<br>" + selShow.title;
    whenD.innerHTML = "상영기간<br>" + selShow.op_st_dt + '~' + selShow.op_ed_dt;
    whereD.innerHTML = "장소<br>" + selShow.place_nm;
    whereAddr.innerHTML = "주소<br>" + selShow.addr;
    getDiret.textContent = "길찾아보기"
    getDiret.onclick = function () { window.open("https://map.kakao.com/link/to/" + keywordFilter(selShow.place_nm) + "," + selShow.lttd + "," + selShow.lngt) }
    runtimeD.innerHTML = "상영 시간<br>" + selShow.runtime;
    showtimeD.innerHTML = "상영 시각<br>" + selShow.showtime;

    //테마코드 문자화
    var themeStrArr = getTheme(selShow.theme, themeInformation);
    themeCodes.innerHTML = "테마<br>" + themeStrArr;
    ratingD.innerHTML = "관람 연령<br>" + selShow.rating;
    priceD.innerHTML = "가격<br>" + selShow.price;
    castingD.innerHTML = "캐스팅<br>" + selShow.casting;
    entD.innerHTML = "공급<br>" + selShow.enterprise;
    avgStarD.innerHTML = "평점<br>" + selShow.avg_star;
    dabomD.textContent = "예매하러가기 ";
    dabomD.onclick = function () { window.open(selShow.dabom_url); }
    closeButton.onclick = function () {
        if (sectionMap.firstChild.className == "detailInfoPannel") {
            sectionMap.removeChild(sectionMap.firstChild);
        }
    }
    //dom 추가ㅣ
    detailDiv.appendChild(closeButton)
    detailDiv.appendChild(emptyDiv);
    detailDiv.appendChild(img);
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
    testDiv.replaceChildren(detailDiv);
    sectionMap.prepend(testDiv);
};
//테마코드 문자열을 받고 한글 테마명을 리턴하는 함수
function getTheme(themeCode, themeInfos) {//themeCode: 테마코드 문자열, themeInfos: 테마코드api추출 배열
    themeCodeArr = themeCode.split(",")// , 단위로 분리하여 코드배열 생성
    var themeStrArr = [];//한글 테마를 저장할 배열
    for (var i = 0; i < themeCodeArr.length; i++) {
        for (var j = 0; j < themeInfos.length; j++) {
            if (themeCodeArr[i] == themeInfos[j].theme) {//코드 찾으면 실행
                themeStrArr.push(themeInfos[j].theme_nm)
                break;//찾은 후 j반복문 중단, 다음 코드를 한글화 시킴
            }
        }
    }
    return themeStrArr;//한글화된 테마명 반환
}

function initialize() {
    //장소대입
    for (let x = 0; x < infosKey.length - 2; x++) {
        for (let y = 0; y < infos[infosKey[x]].length; y++) {
            //key에 해당하는 Type의 상영정보 하나씩 불러오기
            for (let z = 0; z < infos.place.length; z++) {//공연장들 하나씩 불러오기
                if (infos[infosKey[x]][y].place_id == infos.place[z].placeId) {//상영정보의 place id와 공연장 placeid가 일치하면 시행
                    infos[infosKey[x]][y].lttd = infos.place[z].lttd;//공연장의 lttd, lngt를 상영정보에 기입 
                    infos[infosKey[x]][y].lngt = infos.place[z].lngt;
                    infos[infosKey[x]][y].addr = infos.place[z].addr;
                    infos[infosKey[x]][y].hasLoc = true;//검색 성공시 주소정보를 가지고 있음을 true값으로
                    break;//검색완료시 다음 상영정보로
                }
                else {
                    infos[infosKey[x]][y].hasLoc = false;//없으면 주소정보가 없다고 삽입
                }

            }
            if (infos[infosKey[x]][y].hasLoc == false) {//공연장 api에 없는 경우-공연장에 추가
                //장소없는 데이터 카운터+1
                noPlaceCnt++;
                // 장소 검색 객체를 생성합니다
                var ps = new kakao.maps.services.Places();
                // 정제한 키워드로 장소를 검색합니다
                var searchedKeyword = keywordFilter(infos[infosKey[x]][y].place_nm);
                //예외사항
                if (infos[infosKey[x]][y].place_nm == "PANACA B") {
                    searchedKeyword = "파나카 B"
                }
                ps.keywordSearch("부산 " + searchedKeyword, placesSearchCB);
                function placesSearchCB(data, status, pagination) {
                    if (status === kakao.maps.services.Status.OK) {
                        resultDatas.push(data[0]);//첫 검색결과를 전역배열에 저장
                        if (data.length >= 2) {//결과가 2개이상이면 두번째도 저장
                            resultDatas.push(data[1]);
                        }
                        //검색횟수 + 1
                        searchCnt++;
                    }
                    else {
                        console.log("no Result of " + searchedKeyword);
                        searchCnt++;
                    }
                }
            }
        }
    }
    //공공데이터 기반 주차장
    for (var tt = 0; tt < parkingArr.length; tt++) {
        var ps2 = new kakao.maps.services.Places();
        ps2.keywordSearch(parkingArr[tt].pkNam, function (data, status, pagination) {
            var isOver = false;
            // 정상적으로 검색이 완료됐으면 
            if (status === kakao.maps.services.Status.OK) {
                for (var ttt = 0; ttt < data.length; ttt++) {
                    //첫 결과 데이터 삽입
                    if (parkingResult.length == 0) {
                        parkingResult.push(data[ttt]);
                    }
                    else {
                        for (var r = 0; r < parkingResult.length; r++) {
                            //중복은 삽입안함
                            if (parkingResult[r].place_name == data[ttt].place_name) {
                                isOver = true;
                            }
                        }
                        //중복이 없으면 push
                        if (!isOver) {
                            parkingResult.push(data[ttt]);
                        }
                    }
                }
                parkSearchCnt++;
            }
            //안됬으면
            else {
                parkSearchCnt++;
            }
            //도로명주소 검색 종료시 
            if (parkSearchCnt == maxParkSearchCnt) {
                afterOpenApiParkingSearch();
            }
        });
    }
    afterSearched();
}

//도로명주소 검색완료시 실행될 함수
function afterOpenApiParkingSearch() {
    //"공연장소+주차장 카맵" api 검색
    for (let x = 0; x < infosKey.length - 2; x++) {
        for (let y = 0; y < infos[infosKey[x]].length; y++) {
            var nowShow = infos[infosKey[x]][y];
            var ps2 = new kakao.maps.services.Places();
            ps2.keywordSearch("부산" + keywordFilter(nowShow.place_nm) + "주차장", function (data, status, pagination) {
                // 정상적으로 검색이 완료됐으면 
                var isOver = false;
                if (status === kakao.maps.services.Status.OK) {
                    for (var i = 0; i < data.length; i++) {
                        //첫 결과 데이터 삽입
                        if (parkingResult.length == 0) {
                            parkingResult.push(data[i]);
                        }
                        else {
                            for (var j = 0; j < parkingResult.length; j++) {
                                //중복은 삽입안함
                                if (parkingResult[j].place_name == data[i].place_name) {
                                    isOver = true;
                                }
                            }
                            //중복이 없으면 push
                            if (!isOver) {
                                parkingResult.push(data[i]);
                            }
                        }
                    }
                    parkSearchCnt2++;
                }
                else {
                    parkSearchCnt2++;
                }
            });
        }
    }
}
function afterSearched() {
    //장르별 체크박스 가져오기
    var musicalChecked = document.getElementById("musical");
    var operaChecked = document.getElementById("opera");
    var playChecked = document.getElementById("play");
    var tradChecked = document.getElementById("trad");
    var exhiChecked = document.getElementById("exhi");
    var classicChecked = document.getElementById("classic");
    var concertChecked = document.getElementById("concert");
    var danceChecked = document.getElementById("dance");

    //체크박스 체크(초기값 지정)
    musicalChecked.checked = true;
    operaChecked.checked = true;
    playChecked.checked = true;
    tradChecked.checked = true;
    exhiChecked.checked = true;
    classicChecked.checked = true;
    concertChecked.checked = true;
    danceChecked.checked = true;
    var show = []
    //모든 검색이 끝나면 실행
    if (noPlaceCnt == searchCnt && parkSearchCnt == maxParkSearchCnt && parkSearchCnt2 == showNum) {
        //console.log(resultDatas);
        //검색결과를 토대로 재기입
        for (let x = 0; x < infosKey.length - 2; x++) {
            for (let y = 0; y < infos[infosKey[x]].length; y++) {
                //key에 해당하는 Type의 상영정보 하나씩 불러오기
                if (infos[infosKey[x]][y].hasLoc == false) {//공연정보 없으면 실행
                    for (var yy = 0; yy < resultDatas.length; yy++) {//전체 검색결과 하나씩 불러오기
                        if (isSame(infos[infosKey[x]][y].place_nm, resultDatas[yy].place_name)) {//검색어와 검색결과가 같은지 체크
                            infos[infosKey[x]][y].lttd = resultDatas[yy].y;//공연장의 lttd, lngt를 상영정보에 기입 
                            infos[infosKey[x]][y].lngt = resultDatas[yy].x;
                            infos[infosKey[x]][y].addr = resultDatas[yy].road_address_name;
                            //console.log("inserted"+infos[infosKey[x]][y].place_nm + ", " + resultDatas[yy].place_name)
                            infos[infosKey[x]][y].hasLoc = true;//검색 성공시 주소정보를 가지고 있음을 true값으로
                            break;//검색완료시 다음 상영정보로
                        }
                        else {
                            //console.log("notMatch: "+infos[infosKey[x]][y].place_nm + ", "+resultDatas[yy].place_name);
                        }
                    }
                }
                else {
                    //console.log("already has");
                }
            }
        }
        //장르별 데이터 삽입
        for (var i = 0; i < infos.musical.length; i++) {
            show.push(infos.musical[i]);
        }
        for (var j = 0; j < infos.opera.length; j++) {
            show.push(infos.opera[j]);
        }
        for (var k = 0; k < infos.play.length; k++) {
            show.push(infos.play[k]);
        }
        for (var l = 0; l < infos.trad.length; l++) {
            show.push(infos.trad[l]);
        }
        for (var m = 0; m < infos.exhi.length; m++) {
            show.push(infos.exhi[m]);
        }
        for (var n = 0; n < infos.classic.length; n++) {
            show.push(infos.classic[n]);
        }
        for (var o = 0; o < infos.concert.length; o++) {
            show.push(infos.concert[o]);
        }
        for (var p = 0; p < infos.dance.length; p++) {
            show.push(infos.dance[p]);
        }

        loadImg.innerHTML = "포스터 이미지 로딩중"
        show = sortByEnd(show);
        for (var tt = 0; tt < show.length; tt++) {
            show[tt].imgUrl = "http://mpv990422.duckdns.org/imgs/smallSpinner.gif"
            getImgUrl(show[tt]);
        }
        init2(show);
    }
    //검색이 끝나지않은경우 끝날때까지 afterSearched 실행, 0.5s 텀
    else {
        load.innerHTML = "initializing <br> loading Parking Lot Data " + Math.round((parkSearchCnt + parkSearchCnt2) / (maxParkSearchCnt + showNum) * 100) + "%";
        setTimeout(() => {
            afterSearched();
        }, 500)
    }
}
function init2(show) {
    //이미지파일 기다리기(10%까지만)
    if (imgCnt > showNum * 0.1) {
        placeMarkers = []; //마커 배열 초기화
        placeMarkers = addMarkerByShow(show, placeMarkers);
        addMarkerToMap(placeMarkers);
        //console.log(placeMarkers);
        var loadingScreen = document.querySelector('.loading');
        curShows = show;
        clusterer.redraw();

        addMarkerToMap(placeMarkers);
        //console.log(placeMarkers);
        clusterer.redraw();

        drawInform(show);
        load.innerHTML = "initialize done <br> keep loading more images "

        setTimeout(() => {
            //로딩창 해제
            loadingScreen.style.display = 'none';
            console.log("initialize done");////////////////////////////////////////////////////////코드 실행 최종단
        }, 2000)

    }
    else {
        load.innerHTML = "initializing <br> loading initial images " + Math.round((imgCnt / (showNum * 0.1)) * 100) + "%";
        setTimeout(() => {
            init2(show);
        }, 500)
    }
}

//왼쪽 패널 선택된 상영 종류에따라 마커 출력/infos 내용에 공연별 공연장 위치 저장까지//초기에 1회실행되야함
function checkBoxClicked() {
    //상세정보창 닫기
    if (sectionMap.firstChild.className == "detailInfoPannel") {
        sectionMap.removeChild(sectionMap.firstChild);
    }

    var musicalChecked = document.getElementById("musical").checked;
    var operaChecked = document.getElementById("opera").checked;
    var playChecked = document.getElementById("play").checked;
    var tradChecked = document.getElementById("trad").checked;
    var exhiChecked = document.getElementById("exhi").checked;
    var classicChecked = document.getElementById("classic").checked;
    var concertChecked = document.getElementById("concert").checked;
    var danceChecked = document.getElementById("dance").checked;
    var playingChecked = document.getElementById("playing").checked;
    var sort = document.getElementById("sort");

    var show = []
    var dateInput = document.getElementById("datepicker");

    dateInput.value = "";
    //console.log(musicalChecked + ", " + operaChecked + ", " + playChecked)
    //console.log(infos);
    //체크된 장르 데이터 정제
    if (musicalChecked) {
        for (var i = 0; i < infos.musical.length; i++) {
            show.push(infos.musical[i]);
            //console.log("load musicala Done")
        }
    }
    if (operaChecked) {
        for (var j = 0; j < infos.opera.length; j++) {
            show.push(infos.opera[j]);
        }
    }
    if (playChecked) {
        for (var k = 0; k < infos.play.length; k++) {
            show.push(infos.play[k]);
        }
    }
    if (tradChecked) {
        for (var l = 0; l < infos.trad.length; l++) {
            show.push(infos.trad[l]);
        }
    }
    if (exhiChecked) {
        for (var m = 0; m < infos.exhi.length; m++) {
            show.push(infos.exhi[m]);
        }
    }
    if (classicChecked) {
        for (var n = 0; n < infos.classic.length; n++) {
            show.push(infos.classic[n]);
        }
    }
    if (concertChecked) {
        for (var o = 0; o < infos.concert.length; o++) {
            show.push(infos.concert[o]);
        }
    }
    if (danceChecked) {
        for (var p = 0; p < infos.dance.length; p++) {
            show.push(infos.dance[p]);
        }
    }
    var playingShow = []
    if (playingChecked) {
        for (var ii = 0; ii <= show.length - 1; ii++) {
            if (show[ii].op_st_dt <= today) {
                playingShow.push(show[ii])
            }
        }
        show = playingShow;
    }



    if (sort.checked) {
        show = sortByUsrLoc(show);
    }
    else {
        show = sortByEnd(show);
    }

    placeMarkers = []; //마커 배열 초기화
    placeMarkers = addMarkerByShow(show, placeMarkers);
    clusterer.clear();
    addMarkerToMap(placeMarkers);
    //console.log(placeMarkers);
    clusterer.redraw();
    drawInform(show);

}
function allCheck() {
    //장르별 체크박스 가져오기
    var musicalChecked = document.getElementById("musical");
    var operaChecked = document.getElementById("opera");
    var playChecked = document.getElementById("play");
    var tradChecked = document.getElementById("trad");
    var exhiChecked = document.getElementById("exhi");
    var classicChecked = document.getElementById("classic");
    var concertChecked = document.getElementById("concert");
    var danceChecked = document.getElementById("dance");

    //체크박스 체크(초기값 지정)
    musicalChecked.checked = true;
    operaChecked.checked = true;
    playChecked.checked = true;
    tradChecked.checked = true;
    exhiChecked.checked = true;
    classicChecked.checked = true;
    concertChecked.checked = true;
    danceChecked.checked = true;
    checkBoxClicked();
}
function allUncheck() {
    //장르별 체크박스 가져오기
    var musicalChecked = document.getElementById("musical");
    var operaChecked = document.getElementById("opera");
    var playChecked = document.getElementById("play");
    var tradChecked = document.getElementById("trad");
    var exhiChecked = document.getElementById("exhi");
    var classicChecked = document.getElementById("classic");
    var concertChecked = document.getElementById("concert");
    var danceChecked = document.getElementById("dance");

    //체크박스 체크(초기값 지정)
    musicalChecked.checked = false;
    operaChecked.checked = false;
    playChecked.checked = false;
    tradChecked.checked = false;
    exhiChecked.checked = false;
    classicChecked.checked = false;
    concertChecked.checked = false;
    danceChecked.checked = false;
    checkBoxClicked();
}
//상영물 배열을 받고 라디오버튼을 그리는 버튼
function dateComfirmed() {
    //체크박스 체크 여부 가져오기
    var playingChecked = document.getElementById("playing");
    var musicalChecked = document.getElementById("musical").checked;
    var operaChecked = document.getElementById("opera").checked;
    var playChecked = document.getElementById("play").checked;
    var tradChecked = document.getElementById("trad").checked;
    var exhiChecked = document.getElementById("exhi").checked;
    var classicChecked = document.getElementById("classic").checked;
    var concertChecked = document.getElementById("concert").checked;
    var danceChecked = document.getElementById("dance").checked;

    //공연정보 삽입할 변수
    var temp = []
    //선택한 날짜 가져오기
    var selDate = $('#datepicker').val();

    if (selDate != "") {
        selDate = new Date(selDate);
        //날짜 형식 정제
        selDate = selDate.toISOString().split("T")[0];
        //console.log(selDate);
        //날짜 검사
        if (selDate < today) {
            alert("유효하지않은 날짜입니다")
        }
        else {
            //상영중 체크박스 체크 해제
            playingChecked.checked = false;
            //체크된 상영정보별로 담기
            for (var i = 0; i < curShows.length; i++) {
                if (curShows[i].op_st_dt <= selDate && curShows[i].op_ed_dt >= selDate) {
                    if (musicalChecked) {
                        if (curShows[i].type == "musical") {
                            temp.push(curShows[i])
                        }
                    }
                    if (operaChecked) {
                        if (curShows[i].type == "opera") {
                            temp.push(curShows[i])
                        }
                    }
                    if (playChecked) {
                        if (curShows[i].type == "muplaysical") {
                            temp.push(curShows[i])
                        }
                    }
                    if (tradChecked) {
                        if (curShows[i].type == "trad") {
                            temp.push(curShows[i])
                        }
                    }
                    if (exhiChecked) {
                        if (curShows[i].type == "exhi") {
                            temp.push(curShows[i])
                        }
                    }
                    if (classicChecked) {
                        if (curShows[i].type == "classic") {
                            temp.push(curShows[i])
                        }
                    }
                    if (concertChecked) {
                        if (curShows[i].type == "concert") {
                            temp.push(curShows[i])
                        }
                    }
                    if (danceChecked) {
                        if (curShows[i].type == "dance") {
                            temp.push(curShows[i])
                        }
                    }
                }
            }
            drawInform(temp);
            placeMarkers = []; //마커 배열 초기화
            placeMarkers = addMarkerByShow(temp, placeMarkers);
            clusterer.clear();
            addMarkerToMap(placeMarkers);
            //console.log(placeMarkers);
            clusterer.redraw();
        }
    } else {
        alert("날짜를 입력해주세요")
    }
}
function drawInform(show) {
    //버튼 그리기
    var topDiv = document.querySelector(".top");
    //기존버튼 삭제
    while (topDiv.hasChildNodes()) {
        topDiv.removeChild(topDiv.firstChild)
    }
    for (let i = 0; i < show.length; i++) {
        let labelTopDiv = document.createElement('div')
        labelTopDiv.className = "labelTop";

        //버튼 정보
        let radioBtn = document.createElement('input');
        radioBtn.name = "showInfos"
        radioBtn.type = "radio"
        let labels = document.createElement('lebel');
        labels.className = "labels"
        let outOfOutBox = document.createElement("div");
        outOfOutBox.className = "outOfOutBox"
        let outBox = document.createElement("div");
        outBox.className = "outBox"
        let tooltipBox = document.createElement("div");
        tooltipBox.className = "tooltipBox"
        let tooltip = document.createElement("span");
        tooltip.className = "tooltip";
        labels.onclick = function () {
            clickedShow(show, i, placeMarkers);
            radioBtn.checked = "checked"
        }

        var length = 15//...포함 15자
        var shortTitle = show[i].title
        if (shortTitle.length > length) {
            shortTitle = shortTitle.substr(0, length - 2) + "..."
        }
        outBox.innerHTML = '<p class="inner">' + shortTitle + "</p>"

        //type에따라 테두리색 변경
        if (show[i].type == "musical") {
            outOfOutBox.style.background = "#603f83";
        }
        else if (show[i].type == "opera") {
            outOfOutBox.style.background = "#fad0c9";
        }
        else if (show[i].type == "play") {
            outOfOutBox.style.background = "#2bae66";
        }
        else if (show[i].type == "trad") {
            outOfOutBox.style.background = "#b72e2e";
        }
        else if (show[i].type == "exhi") {
            outOfOutBox.style.background = "#29abe2";
        }
        else if (show[i].type == "classic") {
            outOfOutBox.style.background = "#ced46a";
        }
        else if (show[i].type == "concert") {
            outOfOutBox.style.background = "#f2aa4c";
        }
        else if (show[i].type == "dance") {
            outOfOutBox.style.background = "#191919";
        }
        outBox.innerHTML +=
            '<p class="inner">' + show[i].op_st_dt + '~' + show[i].op_ed_dt + "</p>"
            + '<p class="inner">' + show[i].place_nm + "</p>";
        tooltip.innerHTML = show[i].title
        //dom 추가
        topDiv.appendChild(labelTopDiv);
        labelTopDiv.appendChild(labels);
        outOfOutBox.appendChild(tooltipBox);
        tooltipBox.appendChild(tooltip);
        labels.appendChild(radioBtn);
        labels.appendChild(outOfOutBox);
        outOfOutBox.appendChild(outBox);
    }
}
/////////////////////////////////////////////////////////메인함수///////////////////////////////////////////////////////////////////////

function main() {

    //모든데이터 fetch 완료시 실행
    if (musicalLoaded &&
        operaLoaded &&
        playLoaded &&
        tradLoaded &&
        exhiLoaded &&
        classicLoaded &&
        concertLoaded &&
        danceLoaded &&
        placeLoaded &&
        exPlaceLoaded &&
        themeLoaded &&
        parkingLoaded) {

        //상영 종류별 데이터 정렬 0~2 상영종류, 3 장소, 4 테마
        for (var i = 0; i < infosKey.length - 2; i++) {
            infos[infosKey[i]] = sortByEnd(infos[infosKey[i]]);
            showNum += infos[infosKey[i]].length;
        }
        console.log("sorting done");
        loadCnt++;
        load.innerHTML = "Loading data <br>" + Math.round((loadCnt / (13)) * 100) + "%";

        //console.log(today)
        //console.log(infos)
        //console.log(resultDatas)
        //console.log(placesInformation)

        console.log("initializing");
        loadCnt++;
        load.innerHTML = "initializing... "
        //초기화진행(장소검색 및 이미지검색실행)
        initialize();
        //마커 다시그리기
        clusterer.redraw();
        //console.log(infos);
    }
    //안됐으면 다시 main()호출하면서 ture될때까지 실행, 0.5s 텀
    else {
        load.innerHTML = "Loading data <br>" + Math.round((loadCnt / (13)) * 100) + "%";
        setTimeout(() => {
            main();
        }, 500)
    }
}
/////////////////////////////////////////////////////////메인함수 끝///////////////////////////////////////////////////////////////////////
//--------------------------------------------함수 선언 끝--------------------------------------------------------------
//--------------------------------------------fetch 시작---------------------------------------------------------
//메타데이터를 fetch할 함수
function fetchAPI(Url) {
    var response = fetch(Url);
    return response.then(res => res.json())
}
async function fetchAll() {
    load.innerHTML = "Loading MetaData"
    //정보별 메타데이터에서 totalCount 값을 빼 넣을 변수
    var numOfMusical;
    var numOfOpera;
    var numOfPlay;
    var numOfTrad;
    var numOfExhi;
    var numOfClassic;
    var numOfConcert;
    var numOfDance;
    var numOfPlace;
    var numOfExPlace;
    var numOfTheme;
    var numOfParking;

    //await 로 promise가 아닌 실 네이터를 json으로 받기 
    var json = await fetchAPI(initMusicalUrl);
    //메타데이터에서 totalCount 값 가져오기
    numOfMusical = json.getBusanCultureMusicalDetail.totalCount;
    load.innerHTML = "Loading MetaData 1/12"
    //뮤지컬 정보추출
    //총 공연 개수만큼 불러오는 url 생성
    var musicalUrl = proxy + musicalApiLink + appKey + commonApiLink + numOfMusical + type;
    fetch(musicalUrl)//전체 뮤지컬 데이터 추출
        .then((res) => res.json())
        .then((resJson) => {
            //musical에 뮤지컬 정보 호출
            //뮤지컬 관람 가능 목록을 저장할 배열
            var j = 0;
            var musicalInformation = [];
            var musical = resJson.getBusanCultureMusicalDetail.item;
            //데이터 호출테스트-done
            //console.log(musical);
            for (var i = 0; i < numOfMusical; i++) {
                //현시점과 비교하여 종료일이 현시점보다 크거나() 같은경우만 뮤지컬 정보에 push
                if (musical[i].op_ed_dt >= today) {
                    musicalInformation.push(musical[i]);
                    //상영물 데이터에 장르 삽입
                    musicalInformation[j].type = "musical";
                    j++
                }
            }
            //정제한 데이터를 전체 데이터에 삽입
            infos.musical = musicalInformation;
            console.log("musical done");
            //로드완료 토큰
            musicalLoaded = true;
            //로드 카운터 증가
            loadCnt++;
            //로드율 표시
            load.innerHTML = "Loading Musical <br>" + Math.round((loadCnt / (13)) * 100) + "%";
        });

    /////////////////////////////////////
    //이하 다른 데이터에서도 위와같이 작업//
    /////////////////////////////////////
    //오페라
    json = await fetchAPI(initOperaUrl);
    numOfOpera = json.getBusanCultureOperaDetail.totalCount;
    load.innerHTML = "Loading MetaData 2/12"
    var operaUrl = proxy + operaApiLink + appKey + commonApiLink + numOfOpera + type;
    fetch(operaUrl)
        .then((res) => res.json())
        .then((resJson) => {
            var j = 0;
            var operaInformation = [];
            var opera = resJson.getBusanCultureOperaDetail.item;
            for (var i = 0; i < numOfOpera; i++) {
                if (opera[i].op_ed_dt >= today) {
                    operaInformation.push(opera[i]);
                    operaInformation[j].type = "opera";
                    j++
                }
            }
            infos.opera = operaInformation;
            console.log("opera done");
            operaLoaded = true;
            loadCnt++;
            load.innerHTML = "Loading Opera <br>" + Math.round((loadCnt / (13)) * 100) + "%";
        });
    //연극
    json = await fetchAPI(initPlayUrl);
    numOfPlay = json.getBusanCulturePlayDetail.totalCount;
    load.innerHTML = "Loading MetaData 3/12"
    var playUrl = proxy + playApiLink + appKey + commonApiLink + numOfPlay + type;
    fetch(playUrl)
        .then((res) => res.json())
        .then((resJson) => {
            var j = 0;
            var playInformation = [];
            var play = resJson.getBusanCulturePlayDetail.item;
            for (var i = 0; i < numOfPlay; i++) {
                if (play[i].op_ed_dt >= today) {
                    playInformation.push(play[i]);
                    playInformation[j].type = "play";
                    j++;
                }
            }
            infos.play = playInformation;
            console.log("play done");
            playLoaded = true;
            loadCnt++;
            load.innerHTML = "Loading Play<br>" + Math.round((loadCnt / (13)) * 100) + "%";
        });
    //전통예술
    json = await fetchAPI(initTradUrl);
    numOfTrad = json.getBusanCultureTraditionDetail.totalCount;
    load.innerHTML = "Loading MetaData 4/12"
    var tradUrl = proxy + tradApiLink + appKey + commonApiLink + numOfTrad + type;
    fetch(tradUrl)
        .then((res) => res.json())
        .then((resJson) => {
            var j = 0;
            var tradInformation = [];
            var trad = resJson.getBusanCultureTraditionDetail.item;
            for (var i = 0; i < numOfTrad; i++) {
                if (trad[i].op_ed_dt >= today) {
                    tradInformation.push(trad[i]);
                    tradInformation[j].type = "trad";
                    j++;
                }
            }
            infos.trad = tradInformation;
            console.log("tradition done");
            tradLoaded = true;
            loadCnt++;
            load.innerHTML = "Loading Tradition <br>" + Math.round((loadCnt / (13)) * 100) + "%";
        });
    //전시
    json = await fetchAPI(initExhiUrl);
    numOfExhi = json.getBusanCultureExhibitDetail.totalCount;
    load.innerHTML = "Loading MetaData 5/12"
    var exhiUrl = proxy + exhiApiLink + appKey + commonApiLink + numOfExhi + type;
    fetch(exhiUrl)
        .then((res) => res.json())
        .then((resJson) => {
            var j = 0;
            var exhiInformation = [];
            var exhi = resJson.getBusanCultureExhibitDetail.item;
            for (var i = 0; i < numOfExhi; i++) {
                if (exhi[i].op_ed_dt >= today) {
                    exhiInformation.push(exhi[i]);
                    exhiInformation[j].type = "exhi";
                    j++;
                }
            }
            infos.exhi = exhiInformation;
            console.log("exhibition done");
            exhiLoaded = true;
            loadCnt++;
            load.innerHTML = "Loading Exhibition <br>" + Math.round((loadCnt / (13)) * 100) + "%";
        });
    //클래식
    json = await fetchAPI(initClassicUrl);
    numOfClassic = json.getBusanCultureClassicDetail.totalCount;
    load.innerHTML = "Loading MetaData 6/12"
    var classicUrl = proxy + classicApiLink + appKey + commonApiLink + numOfClassic + type;
    fetch(classicUrl)//전체 연극
        .then((res) => res.json())
        .then((resJson) => {
            var j = 0;
            var classicInformation = [];
            var classic = resJson.getBusanCultureClassicDetail.item;
            for (var i = 0; i < numOfClassic; i++) {
                if (classic[i].op_ed_dt >= today) {
                    classicInformation.push(classic[i]);
                    classicInformation[j].type = "classic";
                    j++;
                }
            }
            infos.classic = classicInformation;
            console.log("classic done");
            classicLoaded = true;
            loadCnt++;
            load.innerHTML = "Loading Classic <br>" + Math.round((loadCnt / (13)) * 100) + "%";
        });
    //콘서트
    json = await fetchAPI(initConcertUrl);
    numOfConcert = json.getBusanCultureConcertDetail.totalCount;
    load.innerHTML = "Loading MetaData 7/12"
    var concertUrl = proxy + concertApiLink + appKey + commonApiLink + numOfConcert + type;
    fetch(concertUrl)
        .then((res) => res.json())
        .then((resJson) => {
            var j = 0;
            var concertInformation = [];
            var concert = resJson.getBusanCultureConcertDetail.item;
            for (var i = 0; i < numOfConcert; i++) {
                if (concert[i].op_ed_dt >= today) {
                    concertInformation.push(concert[i]);
                    concertInformation[j].type = "concert";
                    j++;
                }
            }
            infos.concert = concertInformation;
            console.log("concert done");
            concertLoaded = true;
            loadCnt++;
            load.innerHTML = "Loading Concert <br>" + Math.round((loadCnt / (13)) * 100) + "%";
        });
    //무용
    json = await fetchAPI(initDanceUrl);
    numOfDance = json.getBusanCultureDanceDetail.totalCount;
    load.innerHTML = "Loading MetaData 8/12"
    var danceUrl = proxy + danceApiLink + appKey + commonApiLink + numOfDance + type;
    fetch(danceUrl)
        .then((res) => res.json())
        .then((resJson) => {
            var j = 0;
            var danceInformation = [];
            var dance = resJson.getBusanCultureDanceDetail.item;
            for (var i = 0; i < numOfDance; i++) {
                if (dance[i].op_ed_dt >= today) {
                    danceInformation.push(dance[i]);
                    danceInformation[j].type = "dance";
                    j++;
                }
            }
            infos.dance = danceInformation;
            console.log("dance done");
            danceLoaded = true;
            loadCnt++;
            load.innerHTML = "Loading Dance <br>" + Math.round((loadCnt / (13)) * 100) + "%";
        });
    //공연장
    json = await fetchAPI(initPlaceUrl);
    numOfPlace = json.getBusanCulturePerformPlace.totalCount;
    load.innerHTML = "Loading MetaData 9/12"

    var placeUrl = proxy + placeApiLink + appKey + commonApiLink + numOfPlace + type;
    fetch(placeUrl)
        .then((res) => res.json())
        .then((resJson) => {

            var place = resJson.getBusanCulturePerformPlace.item;
            for (let i = 0; i < numOfPlace; i++) {
                placesInformation.push(place[i]);
                placesInformation[i].type = "place";
            }
            placeLoaded = true;

        });
    //전시공간 (공연장 정보와 함께 저장)
    json = await fetchAPI(initExPlaceUrl);
    numOfExPlace = json.getBusanCultureExhibitPlace.totalCount;
    load.innerHTML = "Loading MetaData 10/12"
    var exPlaceUrl = proxy + exPlaceApiLink + appKey + commonApiLink + numOfExPlace + type;
    fetch(exPlaceUrl)
        .then((res) => res.json())
        .then((resJson) => {
            var exPlace = resJson.getBusanCultureExhibitPlace.item;
            for (let i = 0; i < numOfExPlace; i++) {
                placesInformation.push(exPlace[i]);
                placesInformation[i].type = "place";
            }
            infos.place = placesInformation;
            console.log("place done");
            exPlaceLoaded = true;
            loadCnt++;
            load.innerHTML = "Loading Place <br>" + Math.round((loadCnt / (13)) * 100) + "%";
        });
    //테마코드
    json = await fetchAPI(initThemeUrl);
    numOfTheme = json.getBusanCultureThemeCode.totalCount;
    var themeUrl = proxy + themeApiLink + appKey + commonApiLink + numOfTheme + type;
    fetch(themeUrl)
        .then((res) => res.json())
        .then((resJson) => {
            var theme = resJson.getBusanCultureThemeCode.item;
            for (let i = 0; i < numOfTheme; i++) {
                themeInformation.push(theme[i]);
                themeInformation[i].type = "theme";
            }
            infos.theme = themeInformation;
            console.log("theme done");
            themeLoaded = true;
            loadCnt++;
            load.innerHTML = "Loading Theme <br>" + Math.round((loadCnt / (13)) * 100) + "%";
        });
    load.innerHTML = "Loading Met aData 11/12"
    json = await fetchAPI(initParking);
    numOfParking = json.getPblcPrkngInfo.totalCount;
    load.innerHTML = "Loading Meta Data done"
    //공영 주차장
    var parkingUrl = proxy + parking + appKey + commonApiLink + numOfParking + type;
    fetch(parkingUrl)
        .then((res) => res.json())
        .then((resJson) => {
            var parking = resJson.getPblcPrkngInfo.item;
            //도로명주소 존재하는 데이터만 뽑기
            for (var i = 0; i < numOfParking; i++) {
                if (parking[i].doroAddr != '-') {
                    parkingArr.push(parking[i]);
                    maxParkSearchCnt++;
                }
            }
            console.log("parking done");
            parkingLoaded = true;
            loadCnt++;
            load.innerHTML = "Loading Parking Lot <br>" + Math.round((loadCnt / (13)) * 100) + "%";
        });

    //동작시킬 메인함수 호출
    main();
}

//데이터 추출 시점
fetchAll()