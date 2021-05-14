// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const storage = require('electron-localstorage');

let fs = require('fs');       //引入文件读取模块
let request = require('request');

const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('myAPI111', (url) => { console.log('myAPI111 in electron'); window.onloadcc(url); });


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
        console.log('clearcanvas...');

        // helper_upload_params();
        const ret = await download(url);
        // const ret = await getMD5('./images/111.mp4');
        console.log('ret: ', ret);
        // 20350: thumb;
        // 20304: url
        let uploadRet = await upload('./images/' + ret, 20304);
        const { fileurl: img_url_20304 } = JSON.parse(uploadRet);
        console.log('20304 upload ret: ', uploadRet);
        console.log('img_url_20304: ', img_url_20304);
        uploadRet = await upload('./images/' + ret, 20350);
        const { fileurl: img_thumb_20350 } = JSON.parse(uploadRet);
        console.log('img_thumb_20350: ', img_thumb_20350);
        post_create('uid```' + guid2(), img_url_20304, img_thumb_20350);
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

window.onload = function () {
    let image_maker = document.querySelector('#app');
    if (!image_maker) image_maker = document.querySelector('#container');
    let clearcanvas = document.createElement("div");
    clearcanvas.innerText = "清空画板";
    clearcanvas.style = "box-sizing:border-box;line-height:40px;position:absolute;top:10px;left:10px;width:100px;height:40px;border-radius:20px;background-color:#abf;text-align:center;cursor: pointer;font-weight: 700;-webkit-user-select: none; z-index:999;";
    image_maker.appendChild(clearcanvas);
    // ......都用的行内样式
    // image_maker.appendChild(background);
    clearcanvas.onclick = async (e) => {
        //window.fsdshowpng();
        console.log('clearcanvas...');

        // helper_upload_params();
        const ret = await download('https://xcimg.szwego.com/20200815/i1597451354_227_0.jpg?imageMogr2/auto-orient/thumbnail/!320x320r/quality/100/format/jpg');
        // const ret = await getMD5('./images/111.mp4');
        console.log('ret: ', ret);
        // 20350: thumb;
        // 20304: url
        let uploadRet = await upload('./images/' + ret, 20304);
        const { fileurl: img_url_20304 } = JSON.parse(uploadRet);
        console.log('20304 upload ret: ', uploadRet);
        console.log('img_url_20304: ', img_url_20304);
        uploadRet = await upload('./images/' + ret, 20350);
        const { fileurl: img_thumb_20350 } = JSON.parse(uploadRet);
        console.log('img_thumb_20350: ', img_thumb_20350);
        post_create('uid```' + guid2(), img_url_20304, img_thumb_20350);
    };

    // window.onload111 = clearcanvas.onclick;
    // console.log('document: ', document, window);

    // let circleBtn = document.querySelector('#circle-choose-btn-001');
    // circleBtn.onclick = (e) => { console.log('circleBtn: ', e); };
    // circleBtn.onclick111111 = '1111111111111111111';
};

async function helper_upload_params() {
    const url = 'https://channels.weixin.qq.com/cgi-bin/mmfinderassistant-bin/helper/helper_upload_params';
    const postData = { "timestamp": Date.now() + '', "_log_finder_id": "v2_060000231003b20faec8c4e4891ccad5c801ed36b077089617d1c1efe3738300b6cbac7ea487@finder", "rawKeyBuff": "CAESIKelOZR5Uea9wp/7pvOcbV80k/66Dr3+/owNkjaXSOBG", "scene": 1 };
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
    const { data: { appType,
        authKey,
        pictureFileType,
        thumbFileType,
        uin,
        videoFileType } } = res;
    console.log('helper_upload_params: ', {
        appType,
        authKey,
        pictureFileType,
        thumbFileType,
        uin,
        videoFileType
    });
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



async function post_create(description, img_url_20304, img_thumb_20350) {
    const finder_raw = localStorage.getItem('finder_raw'); //'CAESIAtR7cmv1aMsf7KjHz9o0woLe5PbOm7wtEwVi9U4kQh9'; //
    const finder_username = localStorage.getItem('finder_username');// 'v2_060000231003b20faec8c4e4891ccad5c801ed36b077089617d1c1efe3738300b6cbac7ea487@finder';//
    console.log('finder_raw: ', finder_raw, finder_username, document.cookie);
    // return;
    const url = 'https://channels.weixin.qq.com/cgi-bin/mmfinderassistant-bin/post/post_create';
    const md5sum = guid2();
    // const img_url_20304 = "https://wxapp.tc.qq.com/251/20304/stodownload?adaptivelytrans=0&bizid=1023&dotrans=0&encfilekey=RBfjicXSHKCOONJnTbRmmlD8cOQPXE48ibSVZeicjeiamS5a11jKy2ymibtYeia5o0qfkhbGgGj5Dnygv8zpfItLicialAVaiaN9w1fxmCyib3xLSKoKy4icoRBR3RQht5g0xERfyeNeiav7s1xiacohjxs6ZhaFQfJGU0p71zuQaBrcVb3AceZw&hy=SH&idx=1&m=0e3b4d8a10ff8687ce137fca3d6f8910&token=6xykWLEnztKKLTUQvHPfqmPa5ica02l5FVXniaicCA9MAtpfl93UWS1DOpAMDCr3xxB8kvyMliaJHicnjaUctfF1eMA";
    // const img_thumb_20350 = "https://wxapp.tc.qq.com/251/20350/stodownload?adaptivelytrans=0&bizid=1023&dotrans=0&encfilekey=RBfjicXSHKCOONJnTbRmmlD8cOQPXE48ibUA6YBNjJoUnr50ltcYSVyMuPILTFibia6EDoGjDdmdf99AlLEhF4TCMDuETcVrrHic3BT4HJyrTgUvbQzp6VKr4KpKKqlmgvCKX6W5v2jnwSicJSY7wv8M53hrzhVMwib0mvknEia0jB1jF4I&hy=SH&idx=1&m=f46628de6d25b1524492c195c25e1e94&token=6xykWLEnztKKLTUQvHPfqmPa5ica02l5FDoZL7jwc0dqIz5cwT4jPVfiaFPlIgHcQnrCGMK1OicS2YBrjtknzIrNA";
    const postData = {
        "objectType": 0, "longitude": 0, "latitude": 0, "feedLongitude": 0, "feedLatitude": 0, "originalFlag": 0, "topics": [],
        "isFullPost": 1,
        "objectDesc":
        {
            "description": description, "extReading": { "link": "", "title": "" }, "mediaType": 2,
            "location":
            {
                "latitude": 22.5333194732666, "longitude": 113.93041229248047, "city": "深圳市", "poiClassifyId": ""
            },
            "topic":
            {
                "finderTopicInfo": "<finder><version>1</version><valuecount>1</valuecount><style><at></at></style><value0><![CDATA[3333333333333]]></value0></finder>"
            },
            "mentionedUser": [],
            "media":
                [
                    {
                        "url": img_url_20304,
                        "fileSize": 136644,
                        "thumbUrl": img_thumb_20350, "mediaType": 2, "videoPlayLen": 0, "width": 828, "height": 966, "md5sum": md5sum,
                        "fullThumbUrl": img_thumb_20350, "fullUrl": img_url_20304, "fullWidth": 591.4285714285714, "fullHeight": 1280,
                        "fullMd5sum": md5sum, "fullFileSize": 136644, "fullBitrate": 0
                    }
                ]
        },
        "clientid": guid2(),
        "timestamp": Date.now() + '',
        "_log_finder_id": finder_username,
        "rawKeyBuff": finder_raw,
        "scene": 1
    };
    console.log('postData: ', postData);
    // postData["timestamp"] = Date.now() + '';
    // postData["clientid"] = "8d90442d-7d45-424c-b25a-f9ef187a9600";
    const { objectDesc: { media } } = postData;
    // console.log('media: ', media[0]);
    // media[0].fullMd5sum = '2b218b81-ff88-4f7b-a797-2d7839784567';
    // media[0].md5sum = '1b218b81-ff88-4f7b-a797-2d7839784567';
    // media[0].url = 'https://xcimg.szwego.com/20200815/i1597451354_227_0.jpg?imageMogr2/auto-orient/thumbnail/!320x320r/quality/100/format/jpg';
    // return;

    // const response = await fetch(url, {
    //     method: 'POST',
    //     mode: "cors",
    //     headers: {
    //         'Accept': 'application/json, text/plain, */*',
    //         'Accept-Encoding': 'gzip, deflate, br',
    //         'Content-Type': 'application/json;charset=UTF-8',
    //         'X-WECHAT-UIN': 'djJfMDYwMDAwMjMxMDAzYjIwZmFlYzhjNGU0ODkxY2NhZDVjODAxZWQzNmIwNzcwODk2MTdkMWMxZWZlMzczODMwMGI2Y2JhYzdlYTQ4N0BmaW5kZXI=',
    //         'Cookie': 'sessionid=AATVfYAEAAABAAAAAAAf%2BxIZNvc5P6aLFxGeYCAAAADzrBEppsryM1QLZ%2BdDmBLm9XwcA0exd%2BeEMM5e%2BlsrRx0s4T8JqSEr9to9r8%2Bdp%2FWhk7BrPwjl3cIdyHgAZyuJzlNyGWKI%2FNdKz77KpV83RN0NniBW4D8XfI2Y',
    //         'referer': 'https://channels.weixin.qq.com/',
    //         'Host': 'channels.weixin.qq.com',
    //         'sec-fetch-dest': 'empty',
    //         'sec-fetch-mode': 'cors',
    //         'sec-fetch-site': 'same-site',
    //         'user-agent': 'Chrome'
    //     },
    //     body: JSON.stringify(postData)
    // });

    request({
        url: url,
        method: "POST",
        // json: true,
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Accept-Encoding': 'gzip, deflate, br',
            'Content-Type': 'application/json;charset=UTF-8',
            'X-WECHAT-UIN': 'djJfMDYwMDAwMjMxMDAzYjIwZmFlYzhjNGU0ODkxY2NhZDVjODAxZWQzNmIwNzcwODk2MTdkMWMxZWZlMzczODMwMGI2Y2JhYzdlYTQ4N0BmaW5kZXI=',
            'Cookie': document.cookie, //'sessionid=AATVfYAEAAABAAAAAABvVDw3l0IfOvLRcz%2BeYCAAAADzrBEppsryM1QLZ%2BdDmBLm9XwcA0exd%2BeEMM5e%2BlsrR43prDAZsMIIbi%2FRZz5HhzKYo02557gwnQJ1jx9V1xT0syQEoAraSIqJrG4UrXTxb7kBOOTliLThzJpz', //这里会随时更新，必须填写正确
            'referer': 'https://channels.weixin.qq.com/',
            'Host': 'channels.weixin.qq.com',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-site',
            'user-agent': 'Chrome'
        },
        body: JSON.stringify(postData)
    }, function (error, response, body) {
        console.log('body: ', body);
        if (!error && response.statusCode == 200) {
        }
    });

    // const res = await response.json();
    // console.log('post_create res: ', res);
}



const http = require("https"); //require('http');
var crypto = require('crypto');
const FormData = require('./formData.js');

function guid2() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}


function getQiniuObj() {
    const filename = Date.now() + "_" + '_20200815_i1597451354_2157_1.jpg';
    const nameKey = "finder_video_" + filename;
    const token = `23WtVnKHrj37_NmValDCRH1JDiGncma4dzDeWl3H:T8d9eIcI5aIY_rorXsXcUjPpsz0=:eyJzY29wZSI6Imxvb2tib29rLXNlcnZlci1pbWciLCJyZXR1cm5Cb2R5Ijoie1wibmFtZVwiOiAkKGZuYW1lKSxcInNpemVcIjogXCIkKGZzaXplKVwiLFwid1wiOiBcIiQoaW1hZ2VJbmZvLndpZHRoKVwiLFwiaFwiOiBcIiQoaW1hZ2VJbmZvLmhlaWdodClcIixcImtleVwiOiQoa2V5KX0iLCJkZWFkbGluZSI6MTYyMDkwOTYxMX0=`;
    return {
        name: filename,
        key: nameKey,
        token
    };
}

async function getWxUploadObj(filePath, filetype) {
    const { size } = fs.statSync(filePath);
    const md5 = await getMD5(filePath);
    return {
        ver: 1,
        seq: Date.now(),
        weixinnum: 3200128985,
        apptype: 251,
        filetype: filetype, //20304,
        authkey: '3043020101043c303a0201010201010204bebe17d902032013bc0204798b20650204126e216502031ee2b90204d7f8cdcb02049ff9cdcb020460ec330d0204fd88d4d10400',
        hasthumb: 0,
        filekey: 'finder_video_img.jpeg',
        totalsize: size,
        fileuuid: guid2(), //'c7cd131f-106b-4f07-bd39-0893b42cad47',
        rangestart: 0,
        rangeend: size - 1,
        blockmd5: md5, //'854deed57f8aa6569f2c09a265592a8a', //'d3789af7aafa4b54b769bd8912862f2d'
    };
}

function upload(filePath, filetype) {
    return new Promise(async (resolve, reject) => {
        let boundaryKey = '----WebKitFormBoundaryerPQxFnreAt09BSA'; // + new Date().getTime();    // 用于标识请求数据段
        let options = {
            host: 'finderpre.video.qq.com', //'upload.qiniup.com', // 远端服务器域名
            port: 443, // 远端服务器端口号
            method: 'POST',
            path: `/snsuploadbig`, // 上传服务路径
            headers: {
                'Content-Type': 'multipart/form-data; boundary=' + boundaryKey,
                'Connection': 'keep-alive',
                'referer': 'https://channels.weixin.qq.com/',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-site',
                'user-agent': 'Chrome'
            }
        };
        let req = http.request(options, (res) => {
            res.setEncoding('utf8');

            res.on('data', function (chunk) {
                // console.log('body: ' + chunk);
                resolve(chunk);
            });

            res.on('end', function () {
                console.log('res end.');
            });
        });

        let reqStr = '';
        reqStr = FormData.getWxFormDataStrByObj(boundaryKey, await getWxUploadObj(filePath, filetype));

        req.write(reqStr);

        // 创建一个读取操作的数据流
        let fileStream = fs.createReadStream(filePath);
        fileStream.pipe(req, { end: false });
        fileStream.on('end', function () {
            const endStr = `\r\n--${boundaryKey}\r\nContent-Disposition: form-data; name="forcetranscode"\r\n\r\n0\r\n--${boundaryKey}--`;
            req.end(endStr);
            // req.end('\r\n--' + boundaryKey + '--');
        });
    });




}


function getMD5(path) {
    return new Promise((resolve, reject) => {
        var md5sum = crypto.createHash('md5');
        var stream = fs.createReadStream(path);
        stream.on('data', function (chunk) {
            md5sum.update(chunk);
        });
        stream.on('end', function () {
            str = md5sum.digest('hex'); //.toUpperCase();
            // console.log('文件:' + path + ',MD5签名为:' + str + ', 耗时:' + (new Date().getTime() - start) / 1000.00 + "秒");
            resolve(str);
        });
    });
}

function download(url) {

    return new Promise((resolve, reject) => {
        // const url = 'https://xcimg.szwego.com/20200815/i1597451354_2157_1.jpg?imageMogr2/auto-orient/thumbnail/!320x320r/quality/100/format/jpg';
        const { pathname } = new URL(url);
        console.log('pathname: ', pathname);
        const path = './images';
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }
        const filename = pathname.replace(/\//g, '_');
        request({ url }).pipe(
            fs.createWriteStream(`./${path}/${filename}`).on('finish', err => {
                console.log('写入 finish: ', filename);
                resolve(filename);
            }).on('error', err => {
                console.log('写入 error: ', err);
                reject('error');
            })
        );

    });
}
