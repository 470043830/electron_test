const getFormDataStrByObj = (boundary, obj) => {
    let reqStr = '';

    for (let key in obj) {
        const row = `--${boundary}\r\nContent-Disposition: form-data; name="${key}"\r\n\r\n${obj[key]}\r\n`;

        reqStr += row;
    }
    reqStr += `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="finder_video_img.jpeg"\r\nContent-Type: image/jpeg\r\n\r\n`;
    // console.log('reqStr: \n', reqStr);
    return reqStr;
};

const getWxFormDataStrByObj = (boundary, obj) => {
    let reqStr = '';

    console.log('getWxFormDataStrByObj, obj: ', obj);
    for (let key in obj) {
        const row = `--${boundary}\r\nContent-Disposition: form-data; name="${key}"\r\n\r\n${obj[key]}\r\n`;

        reqStr += row;
    }
    reqStr += `--${boundary}\r\nContent-Disposition: form-data; name="filedata"; filename="blob"\r\nContent-Type: application/octet-stream\r\n\r\n`;
    // console.log('reqStr: \n', reqStr);
    return reqStr;
};

const getFormDataStr = (filename, token) => {
    const reqStr =
        `------WebKitFormBoundaryerPQxFnreAt09BSA
Content-Disposition: form-data; name="name"

${filename}
------WebKitFormBoundaryerPQxFnreAt09BSA
Content-Disposition: form-data; name="key"

${filename}
------WebKitFormBoundaryerPQxFnreAt09BSA
Content-Disposition: form-data; name="token"

${token}
------WebKitFormBoundaryerPQxFnreAt09BSA
Content-Disposition: form-data; name="file"; filename="${filename}"
Content-Type: image/jpeg\r\n\r\n`;

    return reqStr;
};



exports.getFormDataStr = getFormDataStr;
exports.getFormDataStrByObj = getFormDataStrByObj;
exports.getWxFormDataStrByObj = getWxFormDataStrByObj;
