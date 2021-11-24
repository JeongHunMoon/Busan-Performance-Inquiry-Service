//사용자 좌표값을 저장할곳
var usrLatitude;
var usrLongitude;
var usrMarker;
var defaultMarker = new kakao.maps.Marker({});
const playMarkerUrl = 'https://mpv990422.duckdns.org/imgs/makerImg/green.png'
const operaMarkerUrl = 'https://mpv990422.duckdns.org/imgs/makerImg/pink.png'
const musicalMarkerUrl = 'https://mpv990422.duckdns.org/imgs/makerImg/purple.png'
const overMarkerUrl = 'https://mpv990422.duckdns.org/imgs/makerImg/ivory.png'

//뮤지컬 마커
var musicalMarkerImage = new kakao.maps.MarkerImage(
	musicalMarkerUrl,
	new kakao.maps.Size(28, 40), new kakao.maps.Point(14, 40));
//오페라 마커
var operaMarkerImage = new kakao.maps.MarkerImage(
	operaMarkerUrl,
	new kakao.maps.Size(28, 40), new kakao.maps.Point(14, 40));
//연극 마커
var playMarkerImage = new kakao.maps.MarkerImage(
	playMarkerUrl,
	new kakao.maps.Size(28, 40), new kakao.maps.Point(14, 40));
	//중복 마커
var overMarkerImage = new kakao.maps.MarkerImage(
	overMarkerUrl,
	new kakao.maps.Size(28, 40), new kakao.maps.Point(14, 40));


//마커배열내의 마커를 전부 기본마커로 리셋
function resetMarkerImg(markerArr, img) {
	for (var i = 0; i < markerArr.length; i++) {
		markerArr[i].setImage(img);
	}
}
//기본 지도 그리기
let mapContainer = document.getElementById('map'), // 지도를 표시할 div 
	mapOption = {
		center: new kakao.maps.LatLng(35.1379222, 129.05562775), // 지도의 중심좌표
		level: 3, // 지도의 확대 레벨
		mapTypeId: kakao.maps.MapTypeId.ROADMAP // 지도종류
	};
// 지도를 생성한다 
var map = new kakao.maps.Map(mapContainer, mapOption);

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

navigator.geolocation.getCurrentPosition(function (pos) { // 사용자 현재위치가 받을수있을대 실행됨
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
function addMarkerToArray(show, targetMarkerArry) {
	var Marker = new kakao.maps.Marker({
		position: new kakao.maps.LatLng(show.lttd, show.lngt),
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
		var markerUrl = markerArray[i].T.Yj;
		if( markerUrl == musicalMarkerUrl){//들어온 마커의 상영종류를 판별
			curType = "musical"
		}
		else if(markerUrl == operaMarkerUrl){
			curType = "opera"
		}
		else if(markerUrl == playMarkerUrl){
			curType = "play"
		}
		var posLat = pos.getLat();
		//var posLng = pos.getLng();
		if (lat > posLat) {//오차범위  +=0.00001
			if (lat - posLat < 0.00001) {
				isOverlap = true;
				if(curType != type){//생성할 마커와 이미 존재하는 마커가 다른 상영물일때
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
				if(curType != type){//생성할 마커와 이미 존재하는 마커가 다른 상영물일때
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
//마커 크기 키우기
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
}