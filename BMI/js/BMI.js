// 定義物件
const BMIData = {
    level1: {
        status: '體重過輕',
        class: '#31BAF9'
    },
    level2: {
        status: '體重正常',
        class: '#86D73E'
    },
    level3: {
        status: '體重過重',
        class: '#FF982D'
    },
    level4: {
        status: '輕度肥胖',
        class: '#FF6C02'
    },
    level5: {
        status: '中度肥胖',
        class: '#FF6C02'
    },
    level6: {
        status: '重度肥胖',
        class: '#FF1200'
    },
}

let btn = document.querySelector('.topBtn'); //計算按鈕
let btnClear = document.querySelector('.clear'); //全部清除按鈕
let btnList = document.querySelector('.topRight'); //上方顯示位置
let list = document.querySelector('.list'); //下方結果顯示
let height = document.querySelector('#height'); //身高輸入欄位
let weight = document.querySelector('#weight'); //體重輸入欄位
let arrayBMI = JSON.parse(localStorage.getItem('listData')) || [];
let today; //日期

let calBMI = () => { //計算並將值存入物件\
    let numHeight = height.value; //抓取身高的值
    let numKg = weight.value; //抓取體重的值
    let numBMI = (numKg / ((numHeight / 100) * (numHeight / 100))).toFixed(2);
    let userRecord = { //紀錄每一筆資料的容器
        status: '',
        height: '',
        weight: '',
        BMI: '',
        date: ''
    };
    if (numHeight === '' || numHeight <= 0 || numKg === '' || numKg <= 0) {
        alert('輸入錯誤');
        height.value = ''; //清空資料
        weight.value = '';
        return; //避免存入資料，導致輸出紀錄
    } else {
        userRecord.height = numHeight;
        userRecord.weight = numKg;
        userRecord.BMI = numBMI;
    };
    switch (true) {
        case numBMI < 18.5:
            userRecord.status = 'level1';
            break;
        case numBMI >= 18.5 && numBMI < 24:
            userRecord.status = 'level2';
            break;
        case numBMI >= 24 && numBMI < 27:
            userRecord.status = 'level3';
            break;
        case numBMI >= 27 && numBMI < 30:
            userRecord.status = 'level4';
            break;
        case numBMI >= 30 && numBMI < 35:
            userRecord.status = 'level5';
            break;
        case numBMI >= 35:
            userRecord.status = 'level6';
            break;
        default:
            break;
    }
    today = new Date(); //計算時間
    let time = (today.getMonth() + 1) + '-' + today.getDate() + '-' + today.getFullYear();
    userRecord.date = time;
    //增加物件到陣列
    // arrayBMI.unshift(userRecord); //把資料插入陣列前方--這個作業不要用unshift，上方按鈕的顯示會出錯，要反轉直接寫CSS
    arrayBMI.push(userRecord); //把資料插入後方
    localStorage.setItem('listData', JSON.stringify(arrayBMI));
    render(); //渲染畫面
    topB(); //渲染上方按鈕
    height.value = ''; //清除輸入資料
    weight.value = '';
}

let render = () => { //渲染畫面
    let str = ''; //存放BMI紀錄資料的字串
    arrayBMI.forEach((item, index) => {
        str += `<li style='border-left:7px solid ${BMIData[item.status].class}'>
                    <span class="status">${BMIData[item.status].status}</span>
                    <div class="liText">
                        <div class="allText">BMI</div>
                        <div class="bmi">${item['BMI']}</div>
                    </div>
                    <div class="liText">
                        <div class="allText">Weight</div>
                        <div class="weight">${item["weight"]}kg</div>
                    </div>
                    <div class="liText">
                        <div class="allText">Height</div>
                        <div class="height">${item["height"]}cm</div>
                    </div>
                    <div class="liText">
                        <div class="date allText">${item['date']}</div>
                    </div>
                    <a href="#" class="close" data-num="${index}">X</a>
                </li>     `;
    })
    list.innerHTML = str;
}
render(); //一開始就出現的渲染畫面，要放方訓後面，放let之前會抓不到

let topB = () => { //上方按鈕結果顯示
    let text = ''; //存放上方按鈕結果的字串
    arrayBMI.forEach(item => {
        text = `<div class="statusBtn" style='color:${BMIData[item.status].class};border:6px solid ${BMIData[item.status].class};display:flex'>
                        <p class="statusNum">${item['BMI']}</p>
                        <span>BMI</span>
                        <div class = "reBtn"
                        style = 'background-color:${BMIData[item.status].class};display:flex;' >
                            <a href="BMI.html">
                                <img src="img/icons_loop.png" alt="">
                            </a>
                        </div>
                    </div>`
    })
    btnList.innerHTML = text;
}
btn.addEventListener('click', calBMI, false);

let delAll = () => { //全部清除
    arrayBMI = []; //清空畫面上的資料
    localStorage.clear(); //清空localStorage內的資料
    render(); //重新渲染畫面
}
btnClear.addEventListener('click', delAll, false)


let delOneData = e => { //刪除單筆資料
    e.preventDefault();
    if (e.target.nodeName !== 'A') { //篩選不是a連結的按鈕
        return;
    } else {
        let num = e.target.dataset.num; //抓取data-num的值
        // console.log(num);//確認抓到的值是否正確
        arrayBMI.splice(num, 1); //刪除對應的內容
        localStorage.setItem('listData', JSON.stringify(arrayBMI)); //更新localStorage
        render();//重新渲染畫面
    }
}
list.addEventListener('click', delOneData, false); //注意監聽範圍是整個輸出列表