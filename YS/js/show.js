//-------------------------------변수 선언------------------------------------------
//api 인증키
const appKey = '8ktFgkosFIYx7p%2FkZzmjWvD20eEUWMgZOipB0SNmBt%2BllCqqY0UoTiS0SHYConkvQ14vg31BhVGRGUFZ%2BMWBfg%3D%3D';
//뮤지컬 url 
const musicalApiLink = 'http://apis.data.go.kr/6260000/BusanCultureMusicalDetailService/getBusanCultureMusicalDetail?serviceKey=';
//오페라 url
const operaApiLink = 'http://apis.data.go.kr/6260000/BusanCultureOperaDetailService/getBusanCultureOperaDetail?serviceKey=';
//dusrmr url
const playApiLink = 'http://apis.data.go.kr/6260000/BusanCulturePlayDetailService/getBusanCulturePlayDetail?serviceKey=';
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
// else https://moonjeonghunapp1.herokuapp.com/

//초기 뮤지컬 url 생성
const initMusicalUrl = proxy + musicalApiLink + appKey + commonApiLink + 1 + type;
//초기 오페라 url 생성
const initOperaUrl = proxy + operaApiLink + appKey + commonApiLink + 1 + type;
//초기 오페라 url 생성
const initPlayUrl = proxy + playApiLink + appKey + commonApiLink + 1 + type;
//초기 공연장 url 생성
const initPlaceUrl = proxy + placeApiLink + appKey + commonApiLink + 1 + type;
//초기 테마정보 url 생성
const initThemeUrl = proxy + themeApiLink + appKey + commonApiLink + 1 + type;

//현재날짜를 ISOSTring으로 반환(YYYY-MM-DDTtime:min:sec)-json 날짜와 비교가능
const today = new Date().toISOString();

var tempLoc;
//주소 검색 결과를 저장할 배열
let resultDatas = [];
//infos 키값
var infosKey = ["musical", "opera", "play", "place", "theme"];//뮤지컬 0, 오페라1, 연극2, 장소3, 테마4
//뮤지컬+오페라+연극
var infos = []
//공연장 목록을 저장할 배열
var placesInformation = [];

//공연장 마커
var placeMarkers = [];
//테마 정보 저장할 배열
var themeInformation = [];

//상영물 정보를 그릴 dataPane
let dataPane = document.querySelector(".container");
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
//검색결과가 같은지 반환
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
                            //console.log("ended with no match")
                            isSame = false//분기의 마지막
                        }
                        break;
                    } else {
                        isSame = true;//for문이 도중에 멈추지않았다면 true
                    }
                }
            }
        }
    }

    return isSame;
}//show 배열에따라 마커추가
function addMarkerByShow(show,placeMarkers){
    for (var t = 0; t < show.length; t++) {
        if (!(isOverlap(show[t].lttd, placeMarkers,show[t].type))) {//중복체크후 마커 추가
            addMarkerToArray(show[t], placeMarkers);
        }
        else {
        }
    }
    return placeMarkers;
}
//라디오버튼 클릭시 사용되는 함수
function clickedShow(show, i, placeMarkers) {

    let selShow = show[i];
    //센터 표기
    //console.log(selShow);
    setCenter(selShow.lttd, selShow.lngt);
    placeMarkers = []
    //마커이미지 기존이미지로 리셋
    placeMarkers = addMarkerByShow(show, placeMarkers);
    //공연장 lttd에 해당하는 마커배열의 인덱스 get
    var t = getMarkerIndex(selShow.lttd, placeMarkers);
    //해당 인덱스의 마커 이미지 변경
    placeMarkers[t] = upScaleMarker(placeMarkers[t]);
    clusterer.clear();
    addMarkerToMap(placeMarkers);
    clusterer.redraw();

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
    titleD.textContent = "제목: " + selShow.title;
    whenD.textContent = "상영기간: " + selShow.op_st_dt + '~' + selShow.op_ed_dt;
    whereD.textContent = "장소: " + selShow.place_nm;


    whereAddr.textContent = "주소: " + selShow.addr;
    getDiret.textContent = "길찾아보기(새창으로 이동합니다.)"
    getDiret.onclick = function () { window.open("https://map.kakao.com/link/to/" + selShow.place_nm + "," + selShow.lttd + "," + selShow.lngt) }
    runtimeD.textContent = "상영 시간: " + selShow.runtime;
    showtimeD.textContent = "상영 시각: " + selShow.showtime;

    //테마코드 문자화
    var themeStrArr = getTheme(selShow.theme, themeInformation);
    themeCodes.textContent = "테마 코드: " + themeStrArr;
    ratingD.textContent = "관람 연령: " + selShow.rating;
    priceD.textContent = "가격: " + selShow.price;
    castingD.textContent = "캐스팅: " + selShow.casting;
    entD.textContent = "공급: " + selShow.enterprise;
    avgStarD.textContent = "평점: " + selShow.avg_star;
    dabomD.textContent = "다봄 에서 정보 더 보고 예매하러가기 ";
    dabomD.onclick = function () { window.open(selShow.dabom_url); }
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
    var musicalChecked = document.getElementById("musical");
    var operaChecked = document.getElementById("opera");
    var playChecked = document.getElementById("play");

    musicalChecked.checked = true;
    operaChecked.checked = true;
    playChecked.checked = true;

    var show = []
    //
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
                // 장소 검색 객체를 생성합니다
                var ps = new kakao.maps.services.Places();
                // 정제한 키워드로 장소를 검색합니다
                var searchedKeyword = keywordFilter(infos[infosKey[x]][y].place_nm);
                ps.keywordSearch("부산 " + searchedKeyword, placesSearchCB);
                function placesSearchCB(data, status, pagination) {
                    if (status === kakao.maps.services.Status.OK) {
                        resultDatas.push(data[0]);//첫 검색결과를 전역배열에 저장
                        if (data.length >= 2) {//결과가 2개이상이면 두번째도 저장
                            resultDatas.push(data[1]);
                        }
                    }
                    else {
                        console.log("no Result of " + searchedKeyword);
                    }
                }
            }
        }
    }
    setTimeout(() => {
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
                            //console.log("notMatch");
                        }
                    }
                }
                else {
                    //console.log("already has");
                }
            }
        }

        for (var i = 0; i < infos.musical.length; i++) {
            show.push(infos.musical[i]);
        }


        for (var j = 0; j < infos.opera.length; j++) {
            show.push(infos.opera[j]);
        }


        for (var k = 0; k < infos.play.length; k++) {
            show.push(infos.play[k]);
        }
        show = sortByEnd(show);
        //
        setTimeout(function () {
            ///////////////////////////////////////////////////////

            placeMarkers = []; //마커 배열 초기화
            placeMarkers = addMarkerByShow(show, placeMarkers);
            addMarkerToMap(placeMarkers);
            //console.log(placeMarkers);
            var loadingScreen = document.querySelector('.loading');
            loadingScreen.style.display = 'none';
            console.log("loaded All")////////////////////////////////////////////////////////코드 실행 최종단
            clusterer.redraw();
        }, 2000)

        addMarkerToMap(placeMarkers);
        //console.log(placeMarkers);
        clusterer.redraw();

        drawInform(show);
        //console.log(infos);
    }, 6000)


}
//왼쪽 패널 선택된 상영 종류에따라 마커 출력/infos 내용에 공연별 공연장 위치 저장까지//초기에 1회실행되야함
function checkBoxClicked() {
    var musicalChecked = document.getElementById("musical").checked;
    var operaChecked = document.getElementById("opera").checked;
    var playChecked = document.getElementById("play").checked;
    var show = []

    //console.log(musicalChecked + ", " + operaChecked + ", " + playChecked)
    //console.log(infos);
    if (musicalChecked) {
        for (var i = 0; i < infos.musical.length; i++) {
            show.push(infos.musical[i]);
            console.log("load musicalaDone")
        }
    }
    if (operaChecked) {
        for (var j = 0; j < infos.opera.length; j++) {
            show.push(infos.opera[j]);
            console.log("load operaDone")
        }
    }
    if (playChecked) {
        for (var k = 0; k < infos.play.length; k++) {
            show.push(infos.play[k]);
        }
    }
    show = sortByEnd(show);
    placeMarkers = []; //마커 배열 초기화
    placeMarkers = addMarkerByShow(show, placeMarkers);
    clusterer.clear();
    addMarkerToMap(placeMarkers);
    //console.log(placeMarkers);
    clusterer.redraw();
    drawInform(show);
}
//상영물 배열을 받고 라디오버튼을 그리는 버튼
function drawInform(show) {
    //버튼 그리기
    var topDiv = document.querySelector(".top");
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
        let outBox = document.createElement("div");
        outBox.className = "outBox"

        labels.onclick = function () {
            clickedShow(show, i, placeMarkers);
            radioBtn.checked = "checked"
        }

        var length = 15//...포함 15자
        var shortTitle = show[i].title
        if(shortTitle.length > length){
            shortTitle = shortTitle.substr(0,length-2)+"..."
        }
        outBox.innerHTML = '<span class="inner">' + shortTitle + "</span>"

        //d내용 추가//type에따라 테두리색 변경
        if (show[i].type == "musical") {
            outBox.style.border = "5px solid #603f83";
        }
        if (show[i].type == "opera") {
            outBox.style.border = " 5px solid #fad0c9";
        }
        if (show[i].type == "play") {
            outBox.style.border = " 5px solid #2bae66";
        }

        outBox.innerHTML +=
            '<span class="inner">' + show[i].op_st_dt + '~' + show[i].op_ed_dt + "</span>"
            + '<span class="inner">' + show[i].place_nm + "</span>";


        //dom 추가
        topDiv.appendChild(labelTopDiv);
        labelTopDiv.appendChild(labels);
        labels.appendChild(radioBtn);
        labels.appendChild(outBox);
    }
}
/////////////////////////////////////////////////////////메인함수///////////////////////////////////////////////////////////////////////
function main() {
    //상영 종류별 데이터 정렬 0~2 상영종류, 3 장소, 4 테마
    //데이터 로드 3초 대기
    setTimeout(function () {
        //초기화
        initialize();

        for (var i = 0; i < infosKey.length - 2; i++) {
            infos[infosKey[i]] = sortByEnd(infos[infosKey[i]]);
        }
        clusterer.redraw();
        //console.log(infos);
    }, 3000)

}
/////////////////////////////////////////////////////////메인함수 끝///////////////////////////////////////////////////////////////////////
//--------------------------------------------함수 선언 끝--------------------------------------------------------------
//--------------------------------------------fetch 시작---------------------------------------------------------
//테마 정보 추출
fetch(initThemeUrl)
    .then((res) => res.json())
    .then((resJson) => {
        //총 테마 개수 파라미터
        var numOfRowsTheme = resJson.getBusanCultureThemeCode.totalCount;
        //총 테마 개수 만큼 불러오는 url
        var themeUrl = proxy + themeApiLink + appKey + commonApiLink + numOfRowsTheme + type;
        fetch(themeUrl)
            .then((res) => res.json())
            .then((resJson) => {
                var theme = resJson.getBusanCultureThemeCode.item;
                for (let i = 0; i < numOfRowsTheme; i++) {
                    themeInformation.push(theme[i]);
                    themeInformation[i].type = "theme";
                }
                infos.theme = themeInformation;
            });

    });

//공연장 정보 추출
fetch(initPlaceUrl)//공연장 초기값
    .then((res) => res.json())
    .then((resJson) => {
        //총 공연장 개수 파라미터
        var numOfRowsPlace = resJson.getBusanCulturePerformPlace.totalCount;
        //총 공연장 갯수만큼 불러오는 url
        var placeUrl = proxy + placeApiLink + appKey + commonApiLink + numOfRowsPlace + type;

        fetch(placeUrl)//전체 공연장
            .then((res) => res.json())
            .then((resJson) => {
                //테스트 문구-done
                //dataPane_t.innerText = JSON.stringify(resJson,null,1);
                var place = resJson.getBusanCulturePerformPlace.item;
                for (let i = 0; i < numOfRowsPlace; i++) {
                    placesInformation.push(place[i]);// 공연장 데이터를 총 공연장갯수만큼 삽입
                    placesInformation[i].type = "place";
                }
                infos.place = placesInformation;
            });
    });
//오페라 정보 fetch
fetch(initOperaUrl)//오페라 초기값
    .then((res) => res.json())
    .then((resJson) => {
        //총 오페라 개수 파라미터
        var numOfRowsOpera = resJson.getBusanCultureOperaDetail.totalCount;
        //총 오페라 갯수만큼 불러오는 url
        var operaUrl = proxy + operaApiLink + appKey + commonApiLink + numOfRowsOpera + type;

        fetch(operaUrl)//전체 오페라
            .then((res) => res.json())
            .then((resJson) => {
                //테스트 문구-done
                //dataPane_t.innerText = JSON.stringify(resJson,null,1);
                var j = 0;
                var operaInformation = [];
                var opera = resJson.getBusanCultureOperaDetail.item;
                //현시점과 비교하여 종료일이 현시점보다 크거나() 같은경우만 연극 정보에 push
                for (var i = 0; i < numOfRowsOpera; i++) {
                    if (opera[i].op_ed_dt >= today) {
                        operaInformation.push(opera[i]);
                        operaInformation[j].type = "opera";
                        j++
                    }
                }
                infos.opera = operaInformation;
            });
    });

//연극 정보 fetch
fetch(initPlayUrl)//연극 초기값
    .then((res) => res.json())
    .then((resJson) => {
        //총 연극 개수 파라미터
        var numOfRowsPlay = resJson.getBusanCulturePlayDetail.totalCount;
        //총 연극 갯수만큼 불러오는 url
        var playUrl = proxy + playApiLink + appKey + commonApiLink + numOfRowsPlay + type;
        fetch(playUrl)//전체 연극
            .then((res) => res.json())
            .then((resJson) => {
                //테스트 문구-done
                //dataPane_t.innerText = JSON.stringify(resJson,null,1);
                //연극 목록을 저장할 배열
                var j = 0;
                var playInformation = [];
                var play = resJson.getBusanCulturePlayDetail.item;
                for (var i = 0; i < numOfRowsPlay; i++) {
                    //현시점과 비교하여 종료일이 현시점보다 크거나() 같은경우만 뮤지컬 정보에 push
                    if (play[i].op_ed_dt >= today) {
                        playInformation.push(play[i]);
                        playInformation[j].type = "play";
                        j++;
                    }
                }
                infos.play = playInformation;
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
        fetch(musicalUrl)//전체 뮤지컬 epdlxj cncnf 데이터 추출
            .then((res) => res.json())
            .then((resJson) => {
                //musical에 뮤지컬 정보 호출
                //뮤지컬 관람 가능 목록을 저장할 배열
                var j = 0;
                var musicalInformation = [];
                var musical = resJson.getBusanCultureMusicalDetail.item;
                //데이터 호출테스트-done
                //console.log(musical);
                for (var i = 0; i < numOfRowsMusical; i++) {
                    //현시점과 비교하여 종료일이 현시점보다 크거나() 같은경우만 뮤지컬 정보에 push
                    if (musical[i].op_ed_dt >= today) {
                        musicalInformation.push(musical[i]);
                        musicalInformation[j].type = "musical";
                        j++
                    }
                }
                infos.musical = musicalInformation;
                //동작시킬 메인함수 호출
                main();
            });
    });