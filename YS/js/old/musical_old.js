const appKey = '8ktFgkosFIYx7p%2FkZzmjWvD20eEUWMgZOipB0SNmBt%2BllCqqY0UoTiS0SHYConkvQ14vg31BhVGRGUFZ%2BMWBfg%3D%3D';
const apiLink1 = 'http://apis.data.go.kr/6260000/BusanCultureMusicalDetailService/getBusanCultureMusicalDetail?serviceKey=';
const apiLink2 = '&pageNo=1&numOfRows=';
let type = '&resultType=json';
var numOfRows1;//뮤지컬 정보 수
const proxy = 'https://busan-show.herokuapp.com/';
const initMusicalUrl = proxy + apiLink1 + appKey + apiLink2 + 1 + type;
let today = new Date();

const hallApiLink1 = 'http://apis.data.go.kr/6260000/BusanCulturePerformPlaceService/getBusanCulturePerformPlace?serviceKey=';
const hallApiLink2 = '&pageNo=1&numOfRows=';

const initHallUrl = proxy + hallApiLink1 + appKey + hallApiLink2 + 1 + type;

const todayDate = today.toISOString(); //현재날짜를 ISOSTring으로 반환(YYYY-MM-DDTtime:min:sec)-json 날짜와 비교가능

fetch(initMusicalUrl)//뮤지컬 초기 값
    .then((res) => res.json())
    .then((resJson) => {
        numOfRows1 = resJson.getBusanCultureMusicalDetail.totalCount;//총 뮤지컬 개수
        const musicalUrl = proxy + apiLink1 + appKey + apiLink2 + numOfRows1 + type;

        fetch(musicalUrl)//전체 뮤지컬
            .then((res) => res.json())
            .then((resJson) => {

                fetch(initHallUrl)//공연장 초기값
                    .then((res2) => res2.json())
                    .then((res2Json) => {
                        var numOfRows2 = res2Json.getBusanCulturePerformPlace.totalCount;//총 공연장 개수
                        const hallUrl = proxy + hallApiLink1 + appKey + hallApiLink2 + numOfRows2 + type;

                        fetch(hallUrl)//전체 공연장
                            .then((res2) => res2.json())
                            .then((res2Json) => {

                                let place = res2Json.getBusanCulturePerformPlace.item;
                                let musicalData = resJson.getBusanCultureMusicalDetail.item;
                                var curMusicalData = [];//날짜순 정렬을위해 뮤지컬 목록을 저장할 배열
                                var j = 0;

                                for (var i = 0; i < numOfRows1; i++) {
                                    if (musicalData[i]["op_ed_dt"] >= todayDate) {//종료일이 현재 날짜보다 크거나 같은경우만 실행 -> 오늘을 기점으로 이전 인경우엔 실행안함
                                        curMusicalData[j] = {
                                            res_no: musicalData[i]["res_no"],//뮤지컬 넘버
                                            title: musicalData[i]["title"],//뮤지컬 제목
                                            op_st_dt: musicalData[i]["op_st_dt"],//시작 날짜
                                            op_ed_dt: musicalData[i]["op_ed_dt"],//종료날짜
                                            op_at: musicalData[i]["op_at"],//
                                            place_id: musicalData[i]["place_id"],//공연장 id
                                            place_nm: musicalData[i]["place_nm"],//공연장 이름
                                            themeCodes: musicalData[i]["theme"],//테마 코드
                                            runTime: musicalData[i]["runtime"],//상영 시간
                                            showTime: musicalData[i]["showtime"],//상영 시작/종료 시각
                                            rating: musicalData[i]["rating"],//연령 등급
                                            price: musicalData[i]["price"],//가격
                                            original: musicalData[i]["original"],//
                                            casting: musicalData[i]["casting"],//캐스팅
                                            crew: musicalData[i]["crew"],//
                                            enterprise: musicalData[i]["enterprise"],//엔터테이먼트
                                            avg_star: musicalData[i]["avg_star"],//평점
                                            dabom_url: musicalData[i]["dabom_url"]//보담 정보 url
                                        }
                                        j++;
                                    }
                                }


                                function sortByEnd() {
                                    for (var i = curMusicalData.length - 1; i > 0; i--) {
                                        for (var j = 0; j < i; j++) {
                                            if (curMusicalData[j].op_ed_dt > curMusicalData[j + 1].op_ed_dt) {
                                                var temp = curMusicalData[j];
                                                curMusicalData[j] = curMusicalData[j + 1];
                                                curMusicalData[j + 1] = temp;
                                            }
                                            else if (curMusicalData[j].op_ed_dt == curMusicalData[j + 1].op_ed_dt) {
                                                if (curMusicalData[j].op_st_dt > curMusicalData[j + 1].op_st_dt) {
                                                    var temp = curMusicalData[j];
                                                    curMusicalData[j] = curMusicalData[j + 1];
                                                    curMusicalData[j + 1] = temp;
                                                }
                                            }
                                        }
                                    }
                                }

                                sortByEnd();

                                let dataPane = document.querySelector(".theater_data");
                                let detailData = document.querySelector(".detailInfo");
                                let isSerched = false;
                                for (let i = 0; i < curMusicalData.length - 1; i++) {
                                    let myDiv = document.createElement('Div');
                                    let mh3 = document.createElement('p');
                                    let when = document.createElement('p');
                                    let where = document.createElement('p');
                                    let myButton = document.createElement('button');
                                    myButton.style.margin = '2%';
                                    myButton.onclick = function () {

                                        var c = place.length + 1;
                                        for (var k = 0; k < place.length - 1; k++) {
                                            if (place[k]["placeId"] == curMusicalData[i].place_id) {//해당 뮤지컬 상영 공연장 id를 공연장 목록 서비스에서 검색
                                                c = k;
                                                break;
                                            }
                                        }
                                        if (c < place.length) {// 검색이 된경우
                                            isSerched = true;
                                            setCenter(place[c]["lttd"], place[c]["lngt"]);
                                        }
                                        else {//검색이 되지않은 경우
                                            isSerched = false;
                                            alert("DB에 장소정보가 없기에 카카오맵 검색결과를 표시합니다")
                                            // 장소 검색 객체를 생성합니다
                                            var ps = new kakao.maps.services.Places();
  
                                            // 키워드로 장소를 검색합니다
                                            ps.keywordSearch("부산"+curMusicalData[i].place_nm, placesSearchCB);

                                            // 키워드 검색 완료 시 호출되는 콜백함수 입니다
                                            function placesSearchCB(data, status, pagination) {
                                                
                                                if (status === kakao.maps.services.Status.OK) {

                                                    // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
                                                    // LatLngBounds 객체에 좌표를 추가합니다
                                                    var bounds = new kakao.maps.LatLngBounds();

                                                    displayMarker(data[0]);
                                                    bounds.extend(new kakao.maps.LatLng(data[0].y, data[0].x));
                                                    
                                                    // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
                                                    map.setBounds(bounds);
                                                    
                                        
                                                    
                                                }
                                            }

                                            // 지도에 마커를 표시하는 함수입니다
                                            function displayMarker(place) {

                                                // 마커를 생성하고 지도에 표시합니다
                                                var marker = new kakao.maps.Marker({
                                                    map: map,
                                                    position: new kakao.maps.LatLng(place.y, place.x)
                                                });
                                            }

                                            
                                        }
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
                                        //dom 내용 추가
                                        titleD.textContent = curMusicalData[i].title;
                                        whenD.textContent = "상영기간: " + curMusicalData[i].op_st_dt + '~' + curMusicalData[i].op_ed_dt;
                                        whereD.textContent = "장소: " + curMusicalData[i].place_nm;
                                        
                                        if(isSerched){
                                            whereAddr.textContent = "주소: " + place[k].addr;
                                        }
                                        else{
                                            whereAddr.textContent = "주소: 검색결과 없음";
                                        }
                                        runtimeD.textContent = "상영 시간: " + curMusicalData[i].runTime;
                                        showtimeD.textContent = "상영 시각: " + curMusicalData[i].showTime;
                                        themeCodes.textContent = "테마 코드: " + curMusicalData[i].themeCodes;
                                        ratingD.textContent = "관람 연령: " + curMusicalData[i].rating;
                                        priceD.textContent = "가격: " + curMusicalData[i].price;
                                        castingD.textContent = "캐스팅: " + curMusicalData[i].casting;
                                        entD.textContent = "공급: " + curMusicalData[i].enterprise;
                                        avgStarD.textContent = "평점: " + curMusicalData[i].avg_star;
                                        dabomD.textContent = "다봄 에서 정보 더 보고 예매하러가기 ";
                                        dabomD.onclick = function () { window.open(curMusicalData[i].dabom_url); }
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

                                    };
                                    //dom에 내용 추가
                                    mh3.textContent = curMusicalData[i].title;
                                    when.textContent = "상영기간: " + curMusicalData[i].op_st_dt + '~' + curMusicalData[i].op_ed_dt
                                    where.textContent = "장소: " + curMusicalData[i].place_nm;

                                    //dom 추가
                                    dataPane.appendChild(myButton);
                                    myButton.appendChild(myDiv);
                                    myDiv.appendChild(mh3);
                                    myDiv.appendChild(when);
                                    myDiv.appendChild(where);

                                }
                                //모든 공연장에 마커 표시
                                var placeMarkers = [];

                                for (var i = 0; i < place.length; i++) {
                                    var lat = place[i]["lttd"];
                                    var lng = place[i]["lngt"];
                                    var placeMarker = new kakao.maps.Marker({
                                        position: new kakao.maps.LatLng(lat, lng),
                                        map: map
                                    });
                                    placeMarkers.push(placeMarker);
                                }
                                clusterer.addMarkers(placeMarkers);
                            })
                    })
            })
    })