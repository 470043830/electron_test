const request = require('request');
const fs = require('fs');       //引入文件读取模块

const http = require("https"); //require('http');
const crypto = require('crypto');
const sizeOf = require('image-size');
const FormData = require('./formData.js');
let AuthLogin = require('./auth_login');

const testAlbumImgs = [
    "https://xcimg.szwego.com/20201120/i1605845854_3794_0.jpg?imageMogr2/auto-orient/thumbnail/!320x320r/quality/100/format/jpg"
    , "https://xcimg.szwego.com/20201120/i1605845854_3408_1.jpg?imageMogr2/auto-orient/thumbnail/!320x320r/quality/100/format/jpg"
    , "https://xcimg.szwego.com/20201120/i1605845854_7347_2.jpg?imageMogr2/auto-orient/thumbnail/!320x320r/quality/100/format/jpg"
    , "https://xcimg.szwego.com/20201120/i1605845854_1903_3.jpg?imageMogr2/auto-orient/thumbnail/!320x320r/quality/100/format/jpg"
    , "https://xcimg.szwego.com/20201120/i1605845854_383_4.jpg?imageMogr2/auto-orient/thumbnail/!320x320r/quality/100/format/jpg"
    , "https://xcimg.szwego.com/20201120/i1605845854_41_5.jpg?imageMogr2/auto-orient/thumbnail/!320x320r/quality/100/format/jpg"
];

async function post_create(finder_username, finder_raw, description, imgData) {
    // const finder_raw = localStorage.getItem('finder_raw'); //'CAESIAtR7cmv1aMsf7KjHz9o0woLe5PbOm7wtEwVi9U4kQh9'; //
    // const finder_username = localStorage.getItem('finder_username');// 'v2_060000231003b20faec8c4e4891ccad5c801ed36b077089617d1c1efe3738300b6cbac7ea487@finder';//
    console.log('post_create: ', finder_username, finder_raw, description, imgData);
    // return;
    const url = 'https://channels.weixin.qq.com/cgi-bin/mmfinderassistant-bin/post/post_create';
    const md5sum = guid2();

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
                        "url": imgData.img_url_20304,
                        "fileSize": imgData.size,
                        "thumbUrl": imgData.img_thumb_20350, "mediaType": 2, "videoPlayLen": 0,
                        "width": imgData.width,
                        "height": imgData.height, "md5sum": md5sum,
                        "fullThumbUrl": imgData.img_thumb_20350, "fullUrl": imgData.img_url_20304,
                        "fullWidth": imgData.width, "fullHeight": imgData.height,
                        "fullMd5sum": md5sum, "fullFileSize": imgData.size, "fullBitrate": 0
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
    // const { objectDesc: { media } } = postData;

    // request({
    //     url: url,
    //     method: "POST",
    //     // json: true,
    //     headers: AuthLogin.getHeaders(),
    //     body: JSON.stringify(postData)
    // }, function (error, response, body) {
    //     console.log('body: ', body);
    //     if (!error && response.statusCode == 200) {
    //     }
    // });

    return AuthLogin.http_post(url, postData);

}





function guid2() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}


async function getWxUploadObj(filePath, filetype) {
    const { size } = fs.statSync(filePath);
    const md5 = await getMD5(filePath);
    if (!AuthLogin.getBrowserData().uin) {
        console.log('AuthLogin.getBrowserData().uin is ', AuthLogin.getBrowserData().uin);
        return null;
    }
    return {
        ver: 1,
        seq: Date.now(),
        weixinnum: AuthLogin.getBrowserData().uin,
        apptype: AuthLogin.getBrowserData().appType, //251,
        filetype: filetype, //20304,
        authkey: AuthLogin.getBrowserData().authkey,//'3043020101043c303a0201010201010204bebe17d902032013bc0204798b20650204126e216502031ee2b90204d7f8cdcb02049ff9cdcb020460ec330d0204fd88d4d10400',
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
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36'
            }
        };
        let reqStr = '';
        let wxUploadObj = await getWxUploadObj(filePath, filetype);
        if (!wxUploadObj) {
            reject('wxUploadObj is null');
            return;
        }
        reqStr = FormData.getWxFormDataStrByObj(boundaryKey, wxUploadObj);

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

let publishCallback = null;
function onPublishOk(callback) {
    publishCallback = callback;
}

async function publish(title, imgs) {
    console.log('publish...', title, imgs);

    const downloadRet = await download(imgs[0]);
    // const ret = await getMD5('./images/111.mp4');
    console.log('downloadRet: ', downloadRet);
    const imgPath = './images/' + downloadRet;

    const dimensions = sizeOf(imgPath);
    const { width, height } = dimensions;
    const { size } = fs.statSync(imgPath);
    console.log(imgPath, width, height, size);

    // 20350: thumb;
    // 20304: url
    let uploadRet = await upload(imgPath, 20304);
    const { fileurl: img_url_20304 } = JSON.parse(uploadRet);
    console.log('20304 upload ret: ', uploadRet);
    console.log('img_url_20304: ', img_url_20304);
    uploadRet = await upload(imgPath, 20350);
    const { fileurl: img_thumb_20350 } = JSON.parse(uploadRet);
    console.log('img_thumb_20350: ', img_thumb_20350);

    const postRet = await post_create(AuthLogin.getBrowserData().finderUsername, AuthLogin.getBrowserData().rawKeyBuff, title, { img_url_20304, img_thumb_20350, width, height, size });
    console.log('postRet: ', postRet);
    publishCallback && publishCallback();
}

let testImgIndex = 0;
async function demo() {
    console.log('demo...', testImgIndex, AuthLogin.getBrowserData());
    if (!AuthLogin.getBrowserData().logined) {
        const { ipcRenderer } = require('electron');
        ipcRenderer.send('showBox', '请先登录！');
        return;
    }

    if (testImgIndex >= testAlbumImgs.length) {
        testImgIndex = 0;
        publishCallback && publishCallback();
        return;
    }
    const ret = await publish('title_' + testImgIndex, [testAlbumImgs[testImgIndex]]);
    // testImgIndex++;
    testImgIndex = testAlbumImgs.length;
    setTimeout(() => {
        demo();
    }, 1000);
}

exports.demo = demo;
exports.publish = publish;
exports.onPublishOk = onPublishOk;
