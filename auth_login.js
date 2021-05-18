
// let fs = require('fs');       //引入文件读取模块
let request = require('request');
let browserData = {
    'X-WECHAT-UIN': '0000000000',
    cookie: ''
};

function getHeaders() {
    return {
        'Accept': 'application/json, text/plain, */*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Content-Type': 'application/json;charset=UTF-8',
        'X-WECHAT-UIN': browserData['X-WECHAT-UIN'],
        'Host': 'channels.weixin.qq.com',
        'Origin': 'https://channels.weixin.qq.com',
        'Referer': 'https://channels.weixin.qq.com/login',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
        'Cookie': browserData.cookie,
    };
}

function http_post(url, postData) {
    const json = false;
    return new Promise((resolve, reject) => {
        request({
            url: url,
            method: "POST",
            json,
            gzip: true,
            headers: getHeaders(),
            body: json ? postData : JSON.stringify(postData)
        }, (error, response, body) => {
            console.log('body: ', error, response.statusCode, typeof body, body);
            console.log('response.toJSON headers: ', response.toJSON().headers);
            const headers = response.toJSON().headers;
            if (headers['set-cookie']) {
                browserData.cookie = '' + headers['set-cookie'];
                console.log('browserData.cookie: ', browserData.cookie);
            }
            if (!error) {
                resolve(json ? body : JSON.parse(body));
            } else {
                reject(error);
            }
        });
    });
}

function auth_login_code() {
    const url = `https://channels.weixin.qq.com/cgi-bin/mmfinderassistant-bin/auth/auth_login_code`;
    const postData = { "timestamp": Date.now() + "", "_log_finder_id": null, "rawKeyBuff": null, "scene": 1 };

    return http_post(url, postData);
}

function auth_login_status(token) {
    const timestamp = Date.now() + "";
    const url = `https://channels.weixin.qq.com/cgi-bin/mmfinderassistant-bin/auth/auth_login_status?token=${token}&timestamp=${timestamp}&scene=1`;
    const postData = { token, timestamp, "_log_finder_id": null, "rawKeyBuff": null, "scene": 1 };

    return http_post(url, postData);
}

function auth_finder_list() {
    const timestamp = Date.now() + "";
    const url = `https://channels.weixin.qq.com/cgi-bin/mmfinderassistant-bin/auth/auth_finder_list`;
    const postData = { timestamp, "_log_finder_id": null, "rawKeyBuff": null, "scene": 1 };

    return http_post(url, postData);
}

function auth_set_finder(finderUsername) {
    const timestamp = Date.now() + "";
    const url = `https://channels.weixin.qq.com/cgi-bin/mmfinderassistant-bin/auth/auth_set_finder`;
    const postData = { finderUsername, timestamp, "_log_finder_id": null, "rawKeyBuff": null, "scene": 1 };

    return http_post(url, postData);
}

function auth_wx(_log_finder_id, rawKeyBuff) {
    const timestamp = Date.now() + "";
    const url = `https://channels.weixin.qq.com/cgi-bin/mmfinderassistant-bin/auth/auth_wx`;
    const postData = { timestamp, _log_finder_id, rawKeyBuff, "scene": 1 };
    browserData['X-WECHAT-UIN'] = btoa(_log_finder_id);
    console.log('X-WECHAT-UIN: ', browserData['X-WECHAT-UIN']);
    return http_post(url, postData);
}

function auth_data(_log_finder_id, rawKeyBuff) {
    const timestamp = Date.now() + "";
    const url = `https://channels.weixin.qq.com/cgi-bin/mmfinderassistant-bin/auth/auth_data`;
    const postData = { timestamp, _log_finder_id, rawKeyBuff, "scene": 1 };

    return http_post(url, postData);
}

function helper_upload_params(_log_finder_id, rawKeyBuff) {
    const timestamp = Date.now() + "";
    const url = `https://channels.weixin.qq.com/cgi-bin/mmfinderassistant-bin/helper/helper_upload_params`;
    const postData = { timestamp, _log_finder_id, rawKeyBuff, "scene": 1 };

    return http_post(url, postData);
}



async function demo() {
    console.log('demo...');
    browserData.appType = 251;
    browserData.uin = 3958321800;
    browserData.authkey = "3043020101043c303a0201010201010204ebef328802032013bc0204a08b20650204126e216502031ee2b9020434dccdcb0204d6f8cdcb020460f1766a0204dbe1b4e70400";
    browserData.finderUsername = "v2_060000231003b20faec8c4e18118c0d4ce04e931b077ec90b2f9179fba0a4caa1abc7bb1e20b@finder";
    browserData.rawKeyBuff = "CAESIHaSLquf/+KoTJo8sZDZ+jgXvjX1Bs3MU3rswmtr3uWW";
    browserData.logined = true;
    let btn1 = document.querySelector('#container-test-btn1');
    btn1.innerText = "已登录";
    return;

    if (!browserData.token) {
        const { data: { token } } = await auth_login_code().catch(error => console.log(error));
        // const token = 'AQAAAHW_TIZA2HKi1KXUVw';
        console.log('token: ', token);
        if (!token) {
            return;
        }
        browserData.token = token;
        console.log(`open the below url in wechat browser:`);
        console.log(`https://channels.weixin.qq.com/mobile/confirm.html?token=${token}`);
    }
    const { data: { status, acctStatus } } = await auth_login_status(browserData.token).catch((error) => console.log(error));
    console.log('status, acctStatus: ', status, acctStatus);
    if (status == 4) { //expired
        //...to do
    } else if (status == 1 && acctStatus == 1) { //login done
        const { data: { finderList } } = await auth_finder_list().catch(error => console.log(error));
        console.log('finderList: ', finderList);
        if (finderList && finderList.length >= 1) {
            browserData.finder = finderList[0];
            const { finderUsername, uniqId } = browserData.finder;
            console.log('finderUsername, uniqId: ', finderUsername, uniqId);
            browserData.finderUsername = finderUsername;
            const { data: { rawKeyBuff } } = await auth_set_finder(finderUsername).catch(error => console.log(error));
            console.log('auth_set_finder, rawKeyBuff: ', rawKeyBuff);
            browserData.rawKeyBuff = rawKeyBuff;
            if (rawKeyBuff){
                {
                    const { data } = await auth_wx(finderUsername, rawKeyBuff).catch(error => console.log(error));
                    console.log('auth_wx, data: ', data);
                }
                {
                    const { data } = await auth_data(finderUsername, rawKeyBuff).catch(error => console.log(error));
                    console.log('auth_data, data: ', data);
                }
                {
                    const { data } = await helper_upload_params(finderUsername, rawKeyBuff).catch(error => console.log(error));
                    console.log('helper_upload_params, data: ', data);
                    const { appType, authKey, uin } = data;
                    browserData.appType = appType;
                    browserData.authkey = authKey;
                    browserData.uin = uin;
                    browserData.logined = true;
                    let btn1 = document.querySelector('#container-test-btn1');
                    btn1.innerText = "已登录";
                }


            }
        }

    } else {
        if (status == 5 && acctStatus == 1) { //scan code ok
            console.log('scan code ok, wait to confirm');
        }
        setTimeout(() => {
            demo();
        }, 3000);
    }


}

exports.browserData = browserData;
exports.getHeaders = getHeaders;
exports.demo = demo;
exports.auth_login_code = auth_login_code;
exports.auth_login_status = auth_login_status;
