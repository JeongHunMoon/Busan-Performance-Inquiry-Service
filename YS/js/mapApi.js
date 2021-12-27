//사용자 좌표값을 저장할곳
var usrLatitude = 0;
var usrLongitude = 0;
var usrMarker;
//기본 마커-사용안함
//var defaultMarker = new kakao.maps.Marker({});
//타입별 마커이미지 url
const playMarkerUrl = 'https://mpv990422.duckdns.org/imgs/markerImg/green.png'
const operaMarkerUrl = 'https://mpv990422.duckdns.org/imgs/markerImg/pink.png'
const musicalMarkerUrl = 'https://mpv990422.duckdns.org/imgs/markerImg/purple.png'
const overMarkerUrl = 'https://mpv990422.duckdns.org/imgs/markerImg/ivory.png'
const tradMarkerUrl = 'https://mpv990422.duckdns.org/imgs/markerImg/red.png'
const exhiMarkerUrl = 'https://mpv990422.duckdns.org/imgs/markerImg/skyblue.png'
const classicMarkerUrl = 'https://mpv990422.duckdns.org/imgs/markerImg/light_green.png'
const concertMarkerUrl = 'https://mpv990422.duckdns.org/imgs/markerImg/yellow.png'
const danceMarkerUrl = 'https://mpv990422.duckdns.org/imgs/markerImg/black.png'
const parkMarkerUrl = 'https://mpv990422.duckdns.org/imgs/markerImg/parkMarker.png'
const selMarkerUrl = 'https://mpv990422.duckdns.org/imgs/markerImg/selMarker.gif'

//마커클릭 동작을 제어하기위한 변수
var MarkerClicked = false;
var showClicked = false;

//뮤지컬 마커 이미지
var musicalMarkerImage = new kakao.maps.MarkerImage(
	musicalMarkerUrl,
	new kakao.maps.Size(28, 40), new kakao.maps.Point(14, 40));
//오페라 마커 이미지
var operaMarkerImage = new kakao.maps.MarkerImage(
	operaMarkerUrl,
	new kakao.maps.Size(28, 40), new kakao.maps.Point(14, 40));
//연극 마커 이미지
var playMarkerImage = new kakao.maps.MarkerImage(
	playMarkerUrl,
	new kakao.maps.Size(28, 40), new kakao.maps.Point(14, 40));
//전통예술 마커 이미지
var tradMarkerImage = new kakao.maps.MarkerImage(
	tradMarkerUrl,
	new kakao.maps.Size(28, 40), new kakao.maps.Point(14, 40));
//전시 마커 이미지
var exhiMarkerImage = new kakao.maps.MarkerImage(
	exhiMarkerUrl,
	new kakao.maps.Size(28, 40), new kakao.maps.Point(14, 40));
//클래식 마커 이미지
var classicMarkerImage = new kakao.maps.MarkerImage(
	classicMarkerUrl,
	new kakao.maps.Size(28, 40), new kakao.maps.Point(14, 40));
//콘서트 마커 이미지
var concertMarkerImage = new kakao.maps.MarkerImage(
	concertMarkerUrl,
	new kakao.maps.Size(28, 40), new kakao.maps.Point(14, 40));
//무용 마커 이미지
var danceMarkerImage = new kakao.maps.MarkerImage(
	danceMarkerUrl,
	new kakao.maps.Size(28, 40), new kakao.maps.Point(14, 40));
//주차장 마커 이미지
var parkMarkerImage = new kakao.maps.MarkerImage(
	parkMarkerUrl,
		new kakao.maps.Size(28, 40), new kakao.maps.Point(14, 40));
//선택된 마커 이미지
var selMarkerImage = new kakao.maps.MarkerImage(
	selMarkerUrl,
		new kakao.maps.Size(80, 80), new kakao.maps.Point(40, 80));
		
		
//중복 마커 - 아이보리
var overMarkerImage = new kakao.maps.MarkerImage(
overMarkerUrl,
new kakao.maps.Size(28, 40), new kakao.maps.Point(14, 40));


/*//마커배열내의 마커를 전부 기본마커로 리셋 -사용안함
function resetMarkerImg(markerArr, img) {
	for (var i = 0; i < markerArr.length; i++) {
		markerArr[i].setImage(img);
	}
}*/
//기본 지도 그리기
let mapContainer = document.getElementById('map'), // 지도를 표시할 div 
	mapOption = {
		center: new kakao.maps.LatLng(35.1379222, 129.05562775), // 지도의 중심좌표
		level: 3, // 지도의 확대 레벨
		mapTypeId: kakao.maps.MapTypeId.ROADMAP // 지도종류
	};
// 지도를 생성한다 
var map = new kakao.maps.Map(mapContainer, mapOption);
// 지도 타입 변경 컨트롤을 생성한다
var mapTypeControl = new kakao.maps.MapTypeControl();

// 지도의 상단 우측에 지도 타입 변경 컨트롤을 추가한다
map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPLEFT);	

// 지도에 확대 축소 컨트롤을 생성한다
var zoomControl = new kakao.maps.ZoomControl();

// 지도의 우측에 확대 축소 컨트롤을 추가한다
map.addControl(zoomControl, kakao.maps.ControlPosition.LEFT);
function setCenter(lt, ln) {//해당위치를 맵의 센터로
	var moveLatLon = new kakao.maps.LatLng(lt, ln)
	map.setCenter(moveLatLon);
}

function usrLocation() { //사용자 위치허가 이후설정
	//사용자위치로 맵을 센터
	setCenter(usrLatitude, usrLongitude);
	// 지도에 마커를 생성하고 표시한다
	usrMarker = new kakao.maps.Marker({
		position: new kakao.maps.LatLng(usrLatitude, usrLongitude), // 마커의 좌표
		map: map // 마커를 표시할 지도 객체
	});
}

// 사용자 현재위치가 받을수있을대 실행됨
navigator.geolocation.getCurrentPosition(function (pos) { 
	usrLatitude = pos.coords.latitude;
	usrLongitude = pos.coords.longitude;
	usrLocation();//사용자 현재위치에 마커 표시 밑 맵 센터로
});

//맵에 마커를 추가하기위한 클러스터
var clusterer = new kakao.maps.MarkerClusterer({
	map: map,
	averageCenter: true,
	minLever: 5,
	minClusterSize: 100,
})
//상영정보를 받아 마커 생성하여 배열에 마커 삽입
function addMarkerToArray(show, targetMarkerArry,shows) {
	var Marker = new kakao.maps.Marker({
		position: new kakao.maps.LatLng(show.lttd, show.lngt),
		clickable: true
	});
	if (show.type == "musical") {
		Marker.setImage(musicalMarkerImage);
	}
	else if (show.type == "opera") {
		Marker.setImage(operaMarkerImage);
	}
	else if (show.type == "play") {
		Marker.setImage(playMarkerImage);
	}
	else if (show.type == "trad") {
		Marker.setImage(tradMarkerImage);
	}
	else if (show.type == "exhi") {
		Marker.setImage(exhiMarkerImage);
	}
	else if (show.type == "classic") {
		Marker.setImage(classicMarkerImage);
	}
	else if (show.type == "concert") {
		Marker.setImage(concertMarkerImage);
	}
	else if (show.type == "dance") {
		Marker.setImage(danceMarkerImage);
	}
	kakao.maps.event.addListener(Marker, 'click', function() {
		// 마커 위에 인포윈도우를 표시합니다

		var selMarkerLat =  show.lttd;
		var selMarkerLng = show.lngt;
		var temp = [];
		for(var i=0; i<shows.length;i++){
			if(shows[i].place_nm == show.place_nm){
				temp.push(shows[i]);
			}
		}
			if(Marker.T.lf.height == 40){
				MarkerClicked = true;
			}
			else{
				MarkerClicked = !MarkerClicked;
			}
			
			if(sectionMap.firstChild.className == "detailInfoPannel"){
				sectionMap.removeChild(sectionMap.firstChild);
			}

			if(MarkerClicked){
				drawInform(temp);
				setCenter(selMarkerLat, selMarkerLng);
				//공연장 lttd에 해당하는 마커배열의 인덱스 get
				placeMarkers = []
				//마커이미지 기존이미지로 리셋
				placeMarkers = addMarkerByShow(shows, placeMarkers);
				var t = getMarkerIndex(selMarkerLat, placeMarkers);
				//해당 인덱스의 마커 이미지 변경
				placeMarkers[t].setImage(selMarkerImage);
				placeMarkers[t].setZIndex(20);
				if(parkingSw.checked){
					addClosePark(show,parkingResult,placeMarkers);
				}
				clusterer.clear();
				addMarkerToMap(placeMarkers);
				clusterer.redraw();
				//console.log(Marker) 
			}
			else{
				
				drawInform(shows);
				if(parkingSw.checked){
					addClosePark(show,parkingResult,placeMarkers);
				}
				placeMarkers = []
				//마커이미지 기존이미지로 리셋
				placeMarkers = addMarkerByShow(shows, placeMarkers);
				clusterer.clear();
				addMarkerToMap(placeMarkers);
				clusterer.redraw();
			}


  });
	targetMarkerArry.push(Marker);

}
//클러스터로 맵에 마커 배열 삽입
function addMarkerToMap(MarkerArr) {
	clusterer.addMarkers(MarkerArr);
}

//중복체크-기능은하나 lat만 정상적으로 출력되기에 lat만으로 비교
function isOverlap(lat, markerArray, type) {
	var isOverlap;
	var curType;

	for (var i = 0; i < markerArray.length; i++) {
		var pos = markerArray[i].getPosition();
		//마커 이미지 url가져우기
		var markerUrl = markerArray[i].T.Yj;
		//들어온 마커의 상영종류를 이미지 url로판별
		if( markerUrl == musicalMarkerUrl){
			curType = "musical"
		}
		else if(markerUrl == operaMarkerUrl){
			curType = "opera"
		}
		else if(markerUrl == playMarkerUrl){
			curType = "play"
		}
		else if(markerUrl == tradMarkerUrl){
			curType = "trad"
		}
		else if(markerUrl == exhiMarkerUrl){
			curType = "exhi"
		}
		else if(markerUrl == classicMarkerUrl){
			curType = "classic"
		}
		else if(markerUrl == concertMarkerUrl){
			curType = "concert"
		}
		else if(markerUrl == danceMarkerUrl){
			curType = "dance"
		}
		else if(markerUrl == parkMarkerUrl){
			curType = "주차장"
		}
		var posLat = pos.getLat();
		//var posLng = pos.getLng();
		if (lat > posLat) {
			if (lat - posLat < 0.00001) {//오차범위  +=0.00001
				isOverlap = true;
				if (curType != type && type !="주차장") {//생성할 마커와 이미 존재하는 마커가 다른 상영물일때
					markerArray[i].setImage(overMarkerImage);
				}
				break;
			}
			else {
				isOverlap = false;
			}
		}
		else {
			if (posLat - lat < 0.00001) {
				isOverlap = true;
				if(curType != type && type !="주차장"){//생성할 마커와 이미 존재하는 마커가 다른 상영물일때
					markerArray[i].setImage(overMarkerImage);
				}
				break;
			}
			else {
				isOverlap = false;
			}
		}
	}
	return isOverlap;
}

//좌표값에 해당하는 마커 인덱스 반환-중복체크와 마찬가지로 lat만으로 확인
function getMarkerIndex(lat, markerArray) {
	var result;
	for (var i = 0; i < markerArray.length; i++) {
		var pos = markerArray[i].getPosition();
		var posLat = pos.getLat();
		if (lat > posLat) {
			if (lat - posLat < 0.00001) {
				result = i;
				break;
			}
		}
		else {
			if (posLat - lat < 0.00001) {
				result = i;
				break;
			}
		}
	}
	return result;
}
/*//마커 크기 키우기-사용안함
function upScaleMarker(marker){
	var newSize = new kakao.maps.Size(36, 48);
	var newPos = new kakao.maps.Point(18, 48);
	var markerUrl = marker.T.Yj;//마커 이미지 url;

	var newMarkerImg = new kakao.maps.MarkerImage(
		markerUrl,
		newSize,
		newPos
	)
	marker.setImage(newMarkerImg);
	return marker;
}*/
//공연정보를 받고 인근 공영주차장(1km내) 마커 출력
function addClosePark(selShow, park, placeMarker){
	var selY = selShow.lttd;
	var selX = selShow.lngt;
	for(var i = 0; i<park.length;i++){
		if(getDistanceFromLatLonInKm(selY,selX,park[i].y,park[i].x)<1){
			var Marker = new kakao.maps.Marker({
				position: new kakao.maps.LatLng(park[i].y, park[i].x)
			});
			Marker.setImage(parkMarkerImage);
			if(!isOverlap(park[i].y, placeMarker, "주차장")){
				placeMarker.push(Marker);
			}
			
		}
	}
}
//두좌표를 km으로 반환
function getDistanceFromLatLonInKm(lat1, lng1, lat2, lng2) 
{ function deg2rad(deg) { return deg * (Math.PI / 180) } var R = 6371; // Radius of the earth in km 
var dLat = deg2rad(lat2-lat1); // deg2rad below 
var dLon = deg2rad(lng2-lng1); 
var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2); 
var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
var d = R * c; // Distance in km 
return d; 
}

