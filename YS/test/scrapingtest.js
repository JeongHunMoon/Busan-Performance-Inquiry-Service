//포스트 이미지 url 반환 함수
function getImgUrl(dabomUrl) {//다봄 url삽입
  const proxy = 'https://busan-show.herokuapp.com/';
  fetch(proxy + dabomUrl)
    .then(function (response) {
      return response.text();
    }).then(function (html) {
      var parser = new DOMParser();
      var doc = parser.parseFromString(html, 'text/html');
      var imgElement = doc.querySelector("div.leftbox>img");
      var imgUrl = imgElement.src;
      var splitUrl = imgUrl.split('/')
      imgUrl = 'http://busandabom.net/images/contents/' + splitUrl[5]
      if (splitUrl[5] == "noimg_classic.jpg") {
        imgUrl = 'http://busandabom.net/img/content/' + splitUrl[5]
      }
      console.log(imgUrl);
    })
}

//전역
var testUrl = 'http://busandabom.net/play/view.nm?lang=ko&url=play&menuCd=5&res_no=2021110278'
let start = new Date();
getImgUrl(testUrl);
