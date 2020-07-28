const url = 'https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json';
let data = {}; //裝全部資料的容器，很多方訓要用，必須放在全域
let zoneData = []; //特定地區資料容器，很多方訓要用，也放在全域
let areaList = document.querySelector('.area'); //中間輸出資料位置
let areaName = document.querySelector('.areaName'); //中間區域名稱
let selectList = document.querySelector('.top-select select'); //上方下拉選單

axios.get(url).then(res => {
    data = res.data.result.records; //所需資料位置
    // console.log(data); //確認有抓到資料
    selectZone(data); //下拉選單畫面
    // render(data); //渲染畫面，改成由分頁函式渲染
    pageAll(data, 1); //分頁，(帶入資料，目前頁數)
}).catch(err => {
    console.log(err);
})

//下拉選單篩選+畫面
let selectZone = (data) => {
    let zoneList = []; //篩選後的選單容器
    let str = `<option value="請選擇行政區"> - - 請選擇行政區 - - </option>`; //存放篩選後的選項字串
    data.forEach(item => {
        zoneList.push(item.Zone); //只存入Zone的資料，注意大小寫
    })
    // console.log(zoneList);//確認存入資料
    zoneList = [...new Set(zoneList)]; //使用 解構賦值 + Set 去除重複選項再放回容器
    // console.log(zoneList);//確認篩選後的存入資料
    zoneList.forEach((item) => {
        str += `<option value="${item}">${item}</option>`;
    })
    selectList.innerHTML = str; //將選項放入下拉選單
}

//選擇下拉選單內的選項，更改中間區塊標題+渲染篩選後畫面
let selectChange = e => {
    zoneData.length = 0; //清空上一個函式的資料
    const selectValue = e.target.value;
    //e.target.value 取得所點擊的值
    // console.log(selectValue); //確認選擇的值
    areaName.textContent = selectValue; //更改中間區塊標題

    switch (true) { //使用選項的值比對並輸出內容
        case selectValue !== '請選擇行政區':
            data.forEach(item => {
                if (selectValue == item['Zone']) {
                    zoneData.push(item);
                }
            })
            pageAll(zoneData, 1); //使用篩選後的區域資料
            break;
        default: //使用全部資料，會出現和進入網頁時相同的畫面
            areaName.textContent = '高雄旅遊'; //將標題改為回預設
            pageAll(data, 1);
            break;
    }
}
selectList.addEventListener('change', selectChange, false); //監聽下拉選單

//渲染畫面
let render = (data) => { //參數是要傳入的資料
    let str = ``;
    data.forEach(item => {
        str += ` <div class="area-container">
                    <img src="${item.Picture1}" alt="">
                    <div class="title">
                        <h3>${item.Name}</h3>
                        <p>${item.Zone}</p>
                    </div>
                    <div class="open_time">
                        <p>${item.Opentime}</p>
                    </div>
                    <div class="address">
                        <p>${item.Add}</p>
                    </div>
                    <div class="phone">
                        <p>${item.Tel}</p>
                    </div>
                    <div class="tag">
                        <p>${item.Ticketinfo}</p>
                    </div>
                </div>`;
    })
    areaList.innerHTML = str;
}

//製作分頁
let pageAll = (inData, dataPage) => { //(要傳入的當前資料,當前頁數)
    const dataTotal = inData.length; //取得資料總數(長度)
    // console.log(dataTotal);//確認長度，100
    const onePage = 6; //預設一頁有6筆資料
    const pageTotal = Math.ceil(dataTotal / onePage); //切換選單後出現的按鈕數量，亦即總頁數
    //Math.ceil() 無條件進位為最小整數
    // console.log(`全部資料:${dataTotal} 每一頁顯示:${onePage}筆 總頁數:${pageTotal}`);
    let nowPage = dataPage; //當前頁數=所設定的參數
    if (nowPage > pageTotal) {
        nowPage = pageTotal;
    }
    //如果當前頁數>總頁數，則當前頁數改為總頁數的數量
    const minData = (nowPage * onePage) - onePage + 1; //最小值，起始點
    //當前頁數 * 每一頁顯示數量 - 每一頁顯示數量  + 1 = 下一頁出現的第一筆資料編號
    //注意下一頁起始編號是從上一頁頁顯示數量+1開始，所以需要+1
    //ex. 2*6-6+1 = 12-6+1 = 7 
    const maxData = (nowPage * onePage); //最大值，結束點
    //當前頁數*每頁顯示數量 =總資料數量
    //這個數量不一定等於資料實際數量，因此需要往下繼續判斷
    const pageData = []; //建立新陣列，用來儲存分頁篩選後的資料
    inData.forEach((item, index) => {
        const num = index + 1; //陣列索引，+1是因為index從0開始
        if (num >= minData && num <= maxData) { //當minData <= num >= maxData ，就把資料存入新陣列
            pageData.push(item);
        }
    })
    render(pageData); //渲染畫面使用篩選後的資料

    const pages = { //用物件的方式傳遞資料，此處可以和上方整合
        pageTotal, //總頁數
        nowPage, //目前頁數
        hasPage: nowPage > 1, //上一頁
        hasNextPage: nowPage < pageTotal //下一頁
    }
    pageBtn(pages); //分頁按鈕
}

let pageAllTwo = (inData, dataPage) => {
const onePage = 6;//每頁6筆資料
const pages = { //用物件的方式傳遞資料
    pageTotal: Math.ceil(dataTotal / onePage), //總頁數
    nowPage:dataPage, //目前頁數
    hasPage: nowPage > 1, //上一頁
    hasNextPage: nowPage < pageTotal //下一頁
}

}

//分頁按鈕
let pageBtnId = document.querySelector('#page'); //分頁按鈕位置
let pageBtn = pages => {
    let str = '';
    const total = pages.pageTotal; //總頁數，用在產生迴圈結束點

    if (pages.hasPage) { //判斷上一頁
        str += `
        <li class="page-item">
            <a class="page-link" href="#" data-page="${Number(pages.nowPage) - 1}">
                Previous
            </a>
        </li>`;
    } else { //注意有disabled，無法再往前或只有1頁就會呈現灰色的禁用按鈕
        str += `
        <li class="page-item disabled">
            <span class="page-link">Previous</span>
        </li>`;
    }

    for (let i = 1; i <= total; i++) { //迴圈增加頁碼
        if (Number(pages.nowPage) === i) {
            str += `
            <li class="page-item active">
                <a class="page-link" href="#" data-page="${i}">
                    ${i}            
                </a>
            </li>`;
        } else { //上方有active是指當前頁面
            str += `
            <li class="page-item">
                <a class="page-link" href="#" data-page="${i}">
                    ${i}
                </a>
            </li>`;
        }
    };

    if (pages.hasNextPage) { //下一頁
        str += `
        <li class="page-item">
            <a class="page-link" href="#" data-page="${Number(pages.nowPage) + 1}">
                Next
            </a>
        </li>`;
    } else {
        str += `
        <li class="page-item disabled">
            <span class="page-link">
                Next
            </span>
        </li>`;
    }
    pageBtnId.innerHTML = str;
}

let switchPage = e => { //分頁的換頁動作
    e.preventDefault(); //阻止默認行為
    if (e.target.nodeName !== 'A') {
        return
    }; //點到不是a連結的地方就無效
    const page = e.target.dataset.page; //抓取分頁按鈕的頁碼
    switch (true) {
        case areaName.textContent !== '高雄旅遊':
            pageAll(zoneData, page);
            break;
        default: //預設資料
            pageAll(data, page);
            break;
    }
}
pageBtnId.addEventListener('click', switchPage, false); //監聽分頁按鈕


let popularBtn = document.querySelector('.top-hot-btn'); //熱門地區
let popularZone = e => {
    if (e.target.nodeName !== 'BUTTON') { //只能點選按鈕
        return;
    }
    zoneData.length = 0; //清空上一個函式push的資料，不清空新資料會疊加在舊資料後方
    // console.log(zoneData.length);
    areaName.textContent = e.target.textContent; //判斷目前地區並顯示
    //e.target.textContent 取得所點擊的內容
    switch (true) {
        case areaName.textContent !== '高雄旅遊':
            data.forEach(item => {
                if (e.target.textContent === item['Zone']) {
                    zoneData.push(item);
                }
            })
            // console.log(e.target.textContent);//確認所點擊的內容
            // console.log(zoneData);//確認push的資料
            pageAll(zoneData, 1); //使用特定地區資料
            break;
        default:
            pageAll(data, 1); //使用全部資料
            break;
    }
}
popularBtn.addEventListener('click', popularZone, false);