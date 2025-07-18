/*************************************************
 ** preload为预加载模块，该文件将会在程序启动时加载 **
 *************************************************/

const { logger } = require('ee-core/log');
const { trayService } = require('../service/os/tray');
const { menuService } = require('../service/os/menu');
const { securityService } = require('../service/os/security');
const { autoUpdaterService } = require('../service/os/auto_updater');
const { FileSystemService } = require('../service/os/file_system');
//const { crossService } = require('../service/cross');
const { sqlitedbService } = require('../service/database/sqlitedb');

function preload() {
  // 示例功能模块，可选择性使用和修改
  logger.info('[preload] load 5');
  trayService.create();
  menuService.create();
  securityService.create();
  autoUpdaterService.create();
  
  // 文件系统服务
  const fileSystemService = new FileSystemService();
  fileSystemService.create();

  // go server
  //crossService.createGoServer();

  // init sqlite db
  sqlitedbService.init();
}

/**
* 预加载模块入口
*/
module.exports = {
  preload
}