//포스트 이미지 url 반환
async function getImgUrl(dabomUrl){//다봄 url삽입
    const proxy = 'https://busan-show.herokuapp.com/';
    var request = new XMLHttpRequest();
    request.open("GET", proxy+dabomUrl);
    request.responseType = "document";
    request.onload =  function () {
        if (request.readyState === 4) {
        if (request.status === 200) {
        var imgElement = request.responseXML.querySelector("div.leftbox>img");
        var imgUrl = imgElement.src;
        var splitUrl = imgUrl.split('/')
        imgUrl = 'http://busandabom.net/images/contents/'+ splitUrl[5]
        console.log(imgUrl)
        
        return imgUrl;

      } else {
        console.error(request.status, request.statusText);
      }
    }
  };
  request.onerror = function (e) {
    console.error(request.status, request.statusText);
  };
  request.send(null);  // not a POST request, so don't send extra data

  let resultUrl = await request.onload();

  return resultUrl;
}