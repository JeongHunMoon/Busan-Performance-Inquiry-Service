
const url = 'https://apis.data.go.kr/6260000/BusanPblcPrkngInfoService/getPblcPrkngInfo?serviceKey=8ktFgkosFIYx7p%2FkZzmjWvD20eEUWMgZOipB0SNmBt%2BllCqqY0UoTiS0SHYConkvQ14vg31BhVGRGUFZ%2BMWBfg%3D%3D&pageNo=1&numOfRows=10&resultType=json';
    
    dataPane = document.getElementById("sample_data");
    fetch(url)
      .then(res => res.json())
      .then(resJson => {
        dataPane.innerText = JSON.stringify(resJson, null,10);
      })