/**
 * Definition of communication channel between main process and rendering process
 * separator: "/" | "." ; (Please check the config file properties: channelSeparator)
 * format：controller/filename/method | controller.filename.method
 * Definition of communication channels between main process and rendering process
 */
const ipcApiRoute = {
  example: {
    test: 'controller/example/test',
  },
  framework: {
    checkForUpdater: 'controller/framework/checkForUpdater',
    downloadApp: 'controller/framework/downloadApp',
    jsondbOperation: 'controller/framework/jsondbOperation',
    sqlitedbOperation: 'controller/framework/sqlitedbOperation',
    uploadFile: 'controller/framework/uploadFile',
    checkHttpServer: 'controller/framework/checkHttpServer',
    doHttpRequest: 'controller/framework/doHttpRequest',
    doSocketRequest: 'controller/framework/doSocketRequest',
    ipcInvokeMsg: 'controller/framework/ipcInvokeMsg',
    ipcSendSyncMsg: 'controller/framework/ipcSendSyncMsg',
    ipcSendMsg: 'controller/framework/ipcSendMsg',
    startJavaServer: 'controller/framework/startJavaServer',
    closeJavaServer: 'controller/framework/closeJavaServer',
    someJob: 'controller/framework/someJob',
    timerJobProgress: 'controller/framework/timerJobProgress',
    createPool: 'controller/framework/createPool',
    createPoolNotice: 'controller/framework/createPoolNotice',
    someJobByPool: 'controller/framework/someJobByPool',
    hello: 'controller/framework/hello',
    openSoftware: 'controller/framework/openSoftware',
  },

  // os
  os: {
    messageShow: 'controller/os/messageShow',
    messageShowConfirm: 'controller/os/messageShowConfirm',
    selectFolder: 'controller/os/selectFolder',
    selectPic: 'controller/os/selectPic',
    openDirectory: 'controller/os/openDirectory',
    loadViewContent: 'controller/os/loadViewContent',
    removeViewContent: 'controller/os/removeViewContent',
    createWindow: 'controller/os/createWindow',
    getWCid: 'controller/os/getWCid',
    sendNotification: 'controller/os/sendNotification',
    initPowerMonitor: 'controller/os/initPowerMonitor',
    getScreen: 'controller/os/getScreen',
    autoLaunch: 'controller/os/autoLaunch',
    setTheme: 'controller/os/setTheme',
    getTheme: 'controller/os/getTheme',
    window1ToWindow2: 'controller/os/window1ToWindow2',
    window2ToWindow1: 'controller/os/window2ToWindow1',
    toggleAlwaysOnTop: 'controller/os/toggleAlwaysOnTop',
    getAlwaysOnTopStatus: 'controller/os/getAlwaysOnTopStatus',
  },

  // effect
  effect: {
    selectFile: 'controller/effect/selectFile',
    loginWindow: 'controller/effect/loginWindow',
    restoreWindow: 'controller/effect/restoreWindow',
  },

  // cross
  cross: {
    crossInfo: 'controller/cross/info',
    getCrossUrl: 'controller/cross/getUrl',
    killCrossServer: 'controller/cross/killServer',
    createCrossServer: 'controller/cross/createServer',
    requestApi: 'controller/cross/requestApi',
  }
}

/**
 * Customize Channel
 * Format: Custom (recommended to add a prefix)
 */
const specialIpcRoute = {
  appUpdater: 'custom/app/updater', // updater channel
}

export {
  ipcApiRoute,
  specialIpcRoute
}

