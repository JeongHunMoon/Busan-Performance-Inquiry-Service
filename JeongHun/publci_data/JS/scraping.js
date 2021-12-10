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
  return result; //스트링으로 변환하여 반환

}

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
console.log(keywordFilter("부산문화회관"));
console.log(isSame("MBC드림홀(구.MBC삼주아트홀)", "부산MBC 드림홀"));