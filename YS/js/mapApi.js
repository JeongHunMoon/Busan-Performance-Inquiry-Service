//사용자 좌표값을 저장할곳
var usrLatitude;
var usrLongitude; 

//마커배열내의 특정좌표의 마커이미지를 변경합니다.
function specMarkerInArray(lat, lng, MarkerArry){
	
	var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png', // 특수 마커이미지의 주소입니다    
    imageSize = new kakao.maps.Size(64, 69), // 마커이미지의 크기입니다
    imageOption = {offset: new kakao.maps.Point(27, 69)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

	var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption),
    markerPosition = new kakao.maps.LatLng(lat, lng); // 마커가 표시될 위치입니다

	// 마커를 생성합니다
	var marker = new kakao.maps.Marker({
    position: markerPosition, 
    image: markerImage // 마커이미지 설정 
});
}
//기본 지도
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
	var marker = new kakao.maps.Marker({
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
//마커 배열에 마커 삽입
function addMarkerToArray(lat, lng, targetMarkerArry) {
	var Marker = new kakao.maps.Marker({
		position: new kakao.maps.LatLng(lat, lng),
		map: map
	});
	//중복값이 없으면 실행
	if(!targetMarkerArry.includes(Marker)){
		console.log(targetMarkerArry.indexOf(Marker));
		targetMarkerArry.push(Marker);
	}
}
//클러스터로 맵에 마커 넣기
function addMarkerToMap(MarkerArry) {
	clusterer.addMarkers(MarkerArry);
}
