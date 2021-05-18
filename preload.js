// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const storage = require('electron-localstorage');

let fs = require('fs');       //引入文件读取模块
let request = require('request');

const http = require("https"); //require('http');
var crypto = require('crypto');
const FormData = require('./formData.js');
const AuthLogin = require('./auth_login');
const FinderPublish = require('./finder_publish');

const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('myAPI111', (url) => { console.log('myAPI111 in electron'); window.onloadcc(url); });
contextBridge.exposeInMainWorld('finderPost', async (goodsStr) => {
    const goods = JSON.parse(goodsStr);
    console.log('finderPost in electron', goods);

    if (!AuthLogin.getBrowserData().logined) {
        const { ipcRenderer } = require('electron');
        ipcRenderer.send('showBox', '请先登录！');
        return;
    }
    const { ipcRenderer } = require('electron');
    ipcRenderer.send('showBox', '处理中~');
    await FinderPublish.publish(goods.title, goods.imgs);
});


window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector);
        if (element) element.innerText = text;
    };

    for (const type of ['chrome', 'node', 'electron']) {
        replaceText(`${type}-version`, process.versions[type]);
    }

    console.log('DOMContentLoaded...............', window.onloaddd);
    window.onloadcc = async (url) => {
        console.log('onloadcccccccccccccc: ', url);
    };
    // window.onloadcc();
    // let count = 0;
    // setInterval(() => {
    //   console.log('...', count++);
    //   document.title = '视频号助手_' + count;
    //   let cat = storage.getItem(`myCat`);
    //   console.log('cat: ', cat);
    // }, 1000);
});

let image_maker = null;
let post_list = null;
window.onload = function () {
    image_maker = document.querySelector('#app');
    if (!image_maker) image_maker = document.querySelector('#container');
    let btn1 = document.createElement("div");
    btn1.id = "container-test-btn1";
    btn1.innerText = "登录";
    btn1.style = "box-sizing:border-box;line-height:40px;position:absolute;top:50px;left:10px;width:100px;height:40px;border-radius:10px;background-color:#abf;text-align:center;cursor: pointer;font-weight: 700;-webkit-user-select: none; z-index:999;";
    image_maker.appendChild(btn1);
    // ......都用的行内样式
    // image_maker.appendChild(background);
    btn1.onclick = async (e) => {
        //window.fsdshowpng();
        // console.log('btn1...');
        // AuthLogin.auth_login_code();
        // console.log('btoa...', btoa('123456789'));
        AuthLogin.demo();
        return;
    };

    let btn2 = document.createElement("div");
    btn2.innerText = "发布";
    btn2.style = "box-sizing:border-box;line-height:40px;position:absolute;top:100px;left:10px;width:100px;height:40px;border-radius:10px;background-color:#abf;text-align:center;cursor: pointer;font-weight: 700;-webkit-user-select: none; z-index:999;";
    image_maker.appendChild(btn2);
    btn2.onclick = async (e) => {
        // console.log('btn2...');
        FinderPublish.demo();
    };



    // window.onload111 = clearcanvas.onclick;
    // console.log('document: ', document, window);

    // let circleBtn = document.querySelector('#circle-choose-btn-001');
    // circleBtn.onclick = (e) => { console.log('circleBtn: ', e); };
    // circleBtn.onclick111111 = '1111111111111111111';

    AuthLogin.onPostList((list) => {
        showPostList(list);
    });
    FinderPublish.onPublishOk(() => {
        AuthLogin.getPostList();
    });
    // setInterval(() => {
    //     showPostList();
    // }, 3000);
};

function showPostList(listData) {
    console.log('showPostList, listData: ', listData);
    if (!post_list) post_list = document.createElement("div");
    post_list.innerHTML = "";
    let list = post_list;
    list.style = "box-sizing:border-box;line-height:36px;position:absolute;top:150px;left:10px;border-radius:10px;background-color:#abf;text-align:center;cursor: pointer;font-weight: 500;-webkit-user-select:none; z-index:999;padding:10px;";
    for (let index = 0; index < listData.length; index++) {
        const { objectId, desc } = listData[index];
        let item = document.createElement("div");
        item.style = "display:flex;";
        let left = document.createElement("div");
        left.innerHTML = `<span>${desc.description}</span>`;//`<span>${((index + 1) + '').padStart(2, "0") + '. ' + desc.description}</span>`;
        left.style = `max-width:300px; overflow: hidden;text-overflow:ellipsis;white-space: nowrap;`;
        let img = document.createElement("img");
        img.src = desc.media[0].url; //"https://xcimg.szwego.com/20201120/i1605845854_7347_2.jpg?imageMogr2/auto-orient/thumbnail/!320x320r/quality/100/format/jpg";
        img.style = 'margin-left:10px;width:30px;height:30px;';
        let right = document.createElement("button");
        right.dataset.objectId = objectId;
        right.innerText = "删除";
        right.style = 'margin-left:10px;padding:0 10px;height:30px;';
        right.onclick = (e) => {
            const { objectId } = e.target.dataset;
            console.log('onclick...', objectId);
            AuthLogin.deleteItem(objectId);
        };

        item.appendChild(left);
        item.appendChild(img);
        item.appendChild(right);

        list.appendChild(item);
    }

    // let last = document.createElement("button");
    // last.innerText = "全部删除";
    // last.style = 'padding:0 35px;height:30px;';
    // list.appendChild(last);

    image_maker.appendChild(list);
}


async function fetch_001() {
    const url = 'https://channels.weixin.qq.com/cgi-bin/mmfinderassistant-bin/post/post_list';
    const postData = {
        "pageSize": 20, "currentPage": 1,
        "timestamp": Date.now() + '',
        "_log_finder_id": "v2_060000231003b20faec8c4e4891ccad5c801ed36b077089617d1c1efe3738300b6cbac7ea487@finder",
        "rawKeyBuff": "CAESIKelOZR5Uea9wp/7pvOcbV80k/66Dr3+/owNkjaXSOBG", "scene": 1
    };
    const response = await fetch(url, {
        method: 'POST',
        mode: "cors",
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Accept-Encoding': 'gzip, deflate, br',
            'Content-Type': 'application/json;charset=UTF-8',
            'X-WECHAT-UIN': 'djJfMDYwMDAwMjMxMDAzYjIwZmFlYzhjNGU0ODkxY2NhZDVjODAxZWQzNmIwNzcwODk2MTdkMWMxZWZlMzczODMwMGI2Y2JhYzdlYTQ4N0BmaW5kZXI='
        },
        body: JSON.stringify(postData)
    });
    const res = await response.json();
    console.log('fetch_001 res: ', res);
}

async function fetch_002() {
    // storage.setItem(`myCat`, `Tom11111111111`);
    let cat = storage.getItem(`myCat`);
    console.log('cat: ', cat);

    const url = 'https://www.szwego.com/album/personal/all?&albumId=A201905291653236670027260&searchValue=&searchImg=&startDate=&endDate=&sourceId=&requestDataType=';
    const response = await fetch(url, {
        method: 'GET',
        mode: "cors",
    });
    const res = await response.json();
    console.log('fetch_002 res: ', res);

}


