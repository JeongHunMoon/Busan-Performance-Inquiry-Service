var mapContainer = document.getElementById('map') // 지도를 표시할 div 
  var mapOption = {
      center: new kakao.maps.LatLng(35.13417, 129.11397), // 지도의 중심좌표
        level: 7, // 지도의 확대 레벨
        mapTypeId : kakao.maps.MapTypeId.ROADMAP,
  }; 
  
// 지도를 생성한다 
var map = new kakao.maps.Map(mapContainer, mapOption); 
var ps = new kakao.maps.services.Places();

function detailScreenEventSet() {
  
  // "마커 보이기" 버튼을 클릭하면 호출되어 배열에 추가된 마커를 지도에 표시하는 함수입니다
  function showMarkers() {
    setMarkers(map)    
  }   
  var scrollBar_ul_childCount = document.querySelector('#scrollBar_ul');

    //뮤지컬 상세보기 창 클릭시 이벤트
    performanceDetailInformation.onclick = function() {
    while ( performanceDetailInformation.hasChildNodes() ) { performanceDetailInformation.removeChild( performanceDetailInformation.firstChild ); }// 태그 초기화
    //설명창 닫으면 li중 배경 색이 skyblue 이면 skyblue->#EAEAEA로 변경
    for(let i = 0; i < scrollBar_ul_childCount.childElementCount; i++) {
      if(scrollBar_ul_childCount.children[i].style.backgroundColor == "skyblue") {
        scrollBar_ul_childCount.children[i].style.backgroundColor = "#EAEAEA";
        break;
      }
    }
    showMarkers();
    cilckMarker.setMap(null);
    performanceDetailInformation.style.width = '0px';
    performanceDetailInformation.style.height = '0px';
    idMainTag.style.height = '85%'; //원래 크기 복구
    idMain_section1Tag.style.height = '100%'; //원래 크기 복구

  }
}

function showPerformance(performanceInfor, performaceMaker) {
  //-------------맵에 마커 출력---------------------------------------------------- 
  
  // 지도에 마커를 생성하고 표시한다
  let j;
  for(let i=0; i < performanceInfor.length; i++) {
    var placeObject;
    for(j = 0; j < placeInformation.length; j++) {
      if(placeInformation[j].placeId == performanceInfor[i].place_id) {
         placeObject = placeInformation[j];
         //뮤지컬 요소 객체에 위도 경도 추가
         performanceInfor[i].lttd = placeObject.lttd;
         performanceInfor[i].lngt = placeObject.lngt;
         performanceInfor[i].addr = placeObject.addr;
         break;
      }
    }
    if(j == placeInformation.length) {
      // 키워드 검색 완료 시 호출되는 콜백함수 입니다
      let placesSearchCB = function (data, status, pagination) {
          if (status === kakao.maps.services.Status.OK) {
              // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
              // LatLngBounds 객체에 좌표를 추가합니다
              var bounds = new kakao.maps.LatLngBounds();

              for (let k=0; k<1; k++) {
                  displayMarker(data[k]);    
                  bounds.extend(new kakao.maps.LatLng(data[k].y, data[k].x));
                  //뮤지컬 요소 객체에 위도 경도 추가
              }      
          } 
          //장소 조회가 안된 경우
          else {
            performanceInfor[i].lttd = "";
          }
      }

      // 지도에 마커를 표시하는 함수입니다
      let displayMarker = function (place) {

          var infoWindow = new kakao.maps.InfoWindow({
              content: `Location: ${performanceInfor[i].place_nm}
              Title: ${performanceInfor[i].title}`,
          });
          
          // 마커를 생성하고 지도에 표시합니다
          var marker = new kakao.maps.Marker({
              map: map,
              position: new kakao.maps.LatLng(place.y, place.x) 
          });
          performanceInfor[i].lttd = place.y;
          performanceInfor[i].lngt = place.x;
          performanceInfor[i].addr = place.place_name;

          //kakao.maps.event.addListener(marker, "clickz", mouseOverListener(map, marker, infoWindow)); 
          //kakao.maps.event.addListener(marker, "focusout", mouseOutListener(infoWindow))
        
          performaceMaker.push(marker);  // 생성된 마커를 배열에 추가합니다
      }
      ps.keywordSearch(performanceInfor[i].place_nm, placesSearchCB);   
      // 마커 이벤트리스너 등록
      
    }   

    else {
      var lat = placeObject.lttd; //위도 저장
      var lng = placeObject.lngt; //경도 저장

      //-------------맵에 마커 출력-------------------------------
      var marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(lat, lng),
        map: map,
      });

      var infoWindow = new kakao.maps.InfoWindow({
        content: `Location: ${performanceInfor[i].place_nm}
        Title: ${performanceInfor[i].title}`,
      });
      // 마커 추가
            
      // 마커 이벤트리스너 등록
      //kakao.maps.event.addListener(marker, "click", mouseOverListener(map, marker, infoWindow)); 
      //kakao.maps.event.addListener(marker, "focusout", mouseOutListener(infoWindow));
      
      performaceMaker.push(marker);  // 생성된 마커를 배열에 추가합니다
    }
  }
  var cilckMarker;
  var performanceDetailInformation = document.querySelector('#performanceDetailInformation');

  // 배열에 추가된 마커들을 지도에 표시하거나 삭제하는 함수입니다
  function setMarkers(map) {
      for (let i = 0; i < performaceMaker.length; i++) {
        performaceMaker[i].setMap(map);
      }            
  }

  // "마커 감추기" 버튼을 클릭하면 호출되어 배열에 추가된 마커를 지도에서 삭제하는 함수입니다
  function hideMarkers() {
      setMarkers(null);    
  }

  //해당 위도 경도로 맵 위치 이동 
  function setFocusCenter(lt, ln) {
    var movaLatLon = new kakao.maps.LatLng(lt, ln);
    map.setCenter(movaLatLon);
  }

  //----스크롤에 목록 저장-----------------------------
  var scrollBar_ul = document.querySelector('#scrollBar_ul');
  var idMainTag = document.querySelector('#main');
  var idMain_section1Tag = document.querySelector('#main_section1');
  var headerTag = document.querySelector('#dropdown');
  var footer = document.querySelector('#footer');

  while ( scrollBar_ul.hasChildNodes() ) { scrollBar_ul.removeChild( scrollBar_ul.firstChild ); }// 태그 초기화
  for(let i = 0; i < performanceInfor.length; i++) {
        const li  = document.createElement('li');
        li.insertAdjacentHTML('beforeend', `${performanceInfor[i].title}<br><br>
        ${performanceInfor[i].op_st_dt} ~ ${performanceInfor[i].op_ed_dt}<br><br>
        ${performanceInfor[i].runtime}`);
        scrollBar_ul.appendChild(li);
        li.style.boxShadow = '5px 5px 5px gray';
        li.style.borderRadius = "10px";
        li.style.fontWeight= 'bold';
        li.onclick = function(event) {
          if(performanceDetailInformation.style.width == '0px' || performanceDetailInformation.style.width =="") {
            event.target.style.backgroundColor = "skyblue";
            if( performanceInfor[i].lttd == "") {
              hideMarkers();
              alert("장소를 조회할 수 없습니다. \n 뮤지컬 정보만 표시합니다.");
            }
            else {
              hideMarkers();
              var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png', // 마커이미지의 주소입니다    
              imageSize = new kakao.maps.Size(40, 50), // 마커이미지의 크기입니다
              imageOption = {offset: new kakao.maps.Point(27, 69)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
              // 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다.

              var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption),
                  markerPosition = new kakao.maps.LatLng(performanceInfor[i].lttd, performanceInfor[i].lngt); // 마커가 표시될 위치입니다

              // 마커를 생성합니다
              cilckMarker = new kakao.maps.Marker({
                  position: markerPosition, 
                  image: markerImage // 마커이미지 설정 
              });

              cilckMarker.setMap(map);
              setFocusCenter(performanceInfor[i].lttd, performanceInfor[i].lngt);
            }

            idMainTag.style.height = '115%'; ///80%->120%
            idMain_section1Tag.style.height = '70%'; ///100%->65%
            performanceDetailInformation.style.width = '100%';
            performanceDetailInformation.style.height = '250px';  

             /*여기다 뮤지컬 정보 표시*/
            for(let i = 0; i < scrollBar_ul_childCount.childElementCount; i++) {
              if(scrollBar_ul_childCount.children[i].style.backgroundColor == "skyblue") {
                performanceDetailInformation.insertAdjacentHTML('beforeend', 
               `<h4>Title: </h4>${performanceInfor[i].title}<br>
                <h4>Date: </h4>${performanceInfor[i].op_st_dt} ~ ${performanceInfor[i].op_ed_dt}<br>
                <h4>Location: </h4>${performanceInfor[i].place_nm}<br>
                <h4>Runtime: </h4>${performanceInfor[i].runtime}<br>
                <h4>Showtime: </h4>${performanceInfor[i].showtime}<br>
                <h4>Rating: </h4>${performanceInfor[i].rating}<br>
                <h4>Price: </h4>${performanceInfor[i].price}<br>
                <h4>Casting: </h4>${performanceInfor[i].casting}<br>
                <h4>Enterprise: </h4>${performanceInfor[i].enterprise}<br>
                <h4>More Information And Reservation: </h4><a href = "${performanceInfor[i].dabom_url}" target="_blank">${performanceInfor[i].dabom_url}</a><br><br><br>
                `);
                break;
              }
            }
          } 
        }
    }		

  //footer 3가지 이벤트 등록
  var naviIcon = document.querySelector('#naviIcon');
  var mapIcon = document.querySelector('#mapIcon');
  var reservationIcon = document.querySelector('#reservationIcon');
  Kakao.init('3f5d2674c29eb3cb86007a28668890f6');
  console.log(performanceInfor[0].addr);
  console.log(performanceInfor[0].lttd);
  console.log(performanceInfor[0].lngt);
  naviIcon.onclick = function() {
    for(let i = 0; i < scrollBar_ul_childCount.childElementCount; i++) {
        if(scrollBar_ul_childCount.children[i].style.backgroundColor == "skyblue") {
          if(performanceInfor[i].lttd == "") {
            alert(`장소를 조회할 수 없어 네비게이션으로 이동하지 않습니다.
            상세보기란에서 위치를 확인해주세요.`);
            return;
          }
          else {
            Kakao.Navi.start({
              name: performanceInfor[i].addr,
              x: Number(performanceInfor[i].lngt),
              y: Number(performanceInfor[i].lttd),
              coordType: 'wgs84'
            });
            return;
          }
        } 
    }
    alert(`공연을 선택하세요!`);
  }
 
  mapIcon.onclick = function() {
    for(let i = 0; i < scrollBar_ul_childCount.childElementCount; i++) {
        if(scrollBar_ul_childCount.children[i].style.backgroundColor == "skyblue") {
          if(performanceInfor[i].lttd == "") {
            alert(`장소를 조회할 수 없어 카카오맵으로 이동하지 않습니다.
            상세보기란에서 위치를 확인해주세요.`);
            return;
          }
          else {
            var url2 = `https://map.kakao.com/link/to/${performanceInfor[i].addr},${performanceInfor[i].lttd},${performanceInfor[i].lngt}`;
            window.open(url2);
            return;
          }
        }
    }
    alert(`공연을 선택하세요!`);
  }

  reservationIcon.onclick = function() {
    for(let i = 0; i < scrollBar_ul_childCount.childElementCount; i++) {
        if(scrollBar_ul_childCount.children[i].style.backgroundColor == "skyblue") {
          window.open(performanceInfor[i].dabom_url);
          return;
        }
    }
    alert(`공연을 선택하세요!`);
  }

  var loadingScreen = document.querySelector('#loadingScreen');
  loadingScreen.style.display='none';
}