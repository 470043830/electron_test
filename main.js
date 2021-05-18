// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');


// 在主进程中.
// const { ipcMain } = require('electron');
// ipcMain.on('asynchronous-message', (event, arg) => {
//     console.log(arg); // prints "ping"
//     event.reply('asynchronous-reply', 'pong111');
//     console.log('app: ', app);
// });

// ipcMain.on('synchronous-message', (event, arg) => {
//     console.log(arg); // prints "ping"
//     event.returnValue = 'pong222';
// })

ipcMain.on('showBox', (event, arg) => {
    console.log('showBox ', arg);
    const { dialog } = require('electron');
    dialog.showMessageBox({ type: 'info', title: "消息", message: '消息', detail: arg }, function (message) {
        console.log(message);
    });
})


function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 1680,
        height: 800,
        webPreferences: {
            webSecurity: false,
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            // contextIsolation: false
        }
    });

    // and load the index.html of the app.
    // mainWindow.loadFile('index.html')

    // const loadUrl = 'https://www.szwego.com/circle/index.html#/shop_detail/A201905291653236670027260'; //'https://channels.weixin.qq.com/login';  //'https://channels.weixin.qq.com/login';

    // const loadUrl = 'http://localhost:8082/static/index.html#/circle_form';
    // const loadUrl = 'https://channels.weixin.qq.com/login';
    const loadUrl = 'https://www.szwego.com/circle/index.html';
    mainWindow.loadURL(loadUrl, { userAgent: 'Chrome' });

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    //获取创建好的window对象发送消息
    // mainWindow.webContents.on('did-finish-load', function () {
    //     mainWindow.webContents.send('set-env', { //设置web环境变量
    //         __ELECTRON__: true,
    //         __DEV__: true,
    //         __PRO__: false,
    //         __SERVER__: false,
    //         windowLoaded: true
    //     });
    // });

    // setTimeout(() => {
    //     const { dialog } = require('electron');
    //     dialog.showMessageBox({ type: 'info', title: "显示消息", message: '消息', detail: '这是一个提示的消息片段' }, function (message) {
    //         console.log(message);
    //     });
    // }, 3000);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow();

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});;

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
