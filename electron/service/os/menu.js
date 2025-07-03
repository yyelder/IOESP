'use strict';

const { Menu, app: electronApp } = require('electron');
const { getMainWindow } = require('ee-core/electron');
const { logger } = require('ee-core/log');
const Store = require('electron-store');
const { ipcMain } = require('electron');

/**
 * 应用菜单服务
 * @class
 */
class MenuService {

  constructor() {
    this.mainWindow = null;
    this.isAlwaysOnTop = false;
    this.store = new Store();
    this.showWelcomePage = this.store.get('showWelcomePage', true);
  }

  /**
   * 创建应用菜单
   */
  create() {
    logger.info('[menu] load');

    this.mainWindow = getMainWindow();
    const self = this;
    
    // 创建菜单模板
    const template = [
      {
        label: '文件',
        submenu: [
          {
            label: '新建',
            accelerator: 'CmdOrCtrl+N',
            click: () => {
              logger.info('[menu] 新建文件');
            }
          },
          {
            label: '打开',
            accelerator: 'CmdOrCtrl+O',
            click: () => {
              logger.info('[menu] 打开文件');
            }
          },
          {
            label: '保存',
            accelerator: 'CmdOrCtrl+S',
            click: () => {
              logger.info('[menu] 保存文件');
            }
          },
          { type: 'separator' },
          {
            label: '退出',
            accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
            click: () => {
              electronApp.quit();
            }
          }
        ]
      },
      {
        label: '编辑',
        submenu: [
          {
            label: '撤销',
            accelerator: 'CmdOrCtrl+Z',
            role: 'undo'
          },
          {
            label: '重做',
            accelerator: 'Shift+CmdOrCtrl+Z',
            role: 'redo'
          },
          { type: 'separator' },
          {
            label: '剪切',
            accelerator: 'CmdOrCtrl+X',
            role: 'cut'
          },
          {
            label: '复制',
            accelerator: 'CmdOrCtrl+C',
            role: 'copy'
          },
          {
            label: '粘贴',
            accelerator: 'CmdOrCtrl+V',
            role: 'paste'
          },
          {
            label: '全选',
            accelerator: 'CmdOrCtrl+A',
            role: 'selectall'
          }
        ]
      },
      {
        label: '视图',
        submenu: [
          {
            label: '重新加载',
            accelerator: 'CmdOrCtrl+R',
            click: () => {
              this.mainWindow.reload();
            }
          },
          {
            label: '强制重新加载',
            accelerator: 'CmdOrCtrl+Shift+R',
            click: () => {
              this.mainWindow.webContents.reloadIgnoringCache();
            }
          },
          {
            label: '开发者工具',
            accelerator: 'F12',
            click: () => {
              this.mainWindow.webContents.toggleDevTools();
            }
          },
          { type: 'separator' },
          {
            label: '实际大小',
            accelerator: 'CmdOrCtrl+0',
            click: () => {
              this.mainWindow.webContents.setZoomLevel(0);
            }
          },
          {
            label: '放大',
            accelerator: 'CmdOrCtrl+Plus',
            click: () => {
              this.mainWindow.webContents.setZoomLevel(
                this.mainWindow.webContents.getZoomLevel() + 1
              );
            }
          },
          {
            label: '缩小',
            accelerator: 'CmdOrCtrl+-',
            click: () => {
              this.mainWindow.webContents.setZoomLevel(
                this.mainWindow.webContents.getZoomLevel() - 1
              );
            }
          },
          { type: 'separator' },
          {
            label: '显示欢迎页',
            type: 'checkbox',
            checked: this.showWelcomePage,
            click: (menuItem) => {
              self.toggleWelcomePage(menuItem);
            }
          },
          { type: 'separator' },
          {
            label: '置顶窗口',
            type: 'checkbox',
            checked: this.isAlwaysOnTop,
            click: (menuItem) => {
              this.toggleAlwaysOnTop(menuItem);
            }
          }
        ]
      },
      {
        label: '窗口',
        submenu: [
          {
            label: '最小化',
            accelerator: 'CmdOrCtrl+M',
            role: 'minimize'
          },
          {
            label: '关闭',
            accelerator: 'CmdOrCtrl+W',
            role: 'close'
          }
        ]
      },
      {
        label: '帮助',
        submenu: [
          {
            label: '关于',
            click: () => {
              logger.info('[menu] 关于');
            }
          }
        ]
      }
    ];

    // 在macOS上添加应用菜单
    if (process.platform === 'darwin') {
      template.unshift({
        label: electronApp.getName(),
        submenu: [
          {
            label: '关于 ' + electronApp.getName(),
            role: 'about'
          },
          { type: 'separator' },
          {
            label: '服务',
            role: 'services',
            submenu: []
          },
          { type: 'separator' },
          {
            label: '隐藏 ' + electronApp.getName(),
            accelerator: 'Cmd+H',
            role: 'hide'
          },
          {
            label: '隐藏其他',
            accelerator: 'Cmd+Alt+H',
            role: 'hideothers'
          },
          {
            label: '显示全部',
            role: 'unhide'
          },
          { type: 'separator' },
          {
            label: '退出',
            accelerator: 'Cmd+Q',
            click: () => {
              electronApp.quit();
            }
          }
        ]
      });
    }

    // 创建菜单
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    logger.info('[menu] 应用菜单已创建');
  }

  /**
   * 切换置顶状态
   */
  toggleAlwaysOnTop(menuItem) {
    this.isAlwaysOnTop = !this.isAlwaysOnTop;
    this.mainWindow.setAlwaysOnTop(this.isAlwaysOnTop);
    
    if (menuItem) {
      menuItem.checked = this.isAlwaysOnTop;
    }
    
    logger.info(`[menu] 窗口置顶状态: ${this.isAlwaysOnTop ? '开启' : '关闭'}`);
  }

  /**
   * 获取置顶状态
   */
  getAlwaysOnTopStatus() {
    return this.isAlwaysOnTop;
  }

  toggleWelcomePage(menuItem) {
    this.showWelcomePage = !this.showWelcomePage;
    this.store.set('showWelcomePage', this.showWelcomePage);
    if (menuItem) {
      menuItem.checked = this.showWelcomePage;
    }
    // 通知渲染进程
    if (this.mainWindow) {
      this.mainWindow.webContents.send('toggle-welcome-page', this.showWelcomePage);
    }
    logger.info(`[menu] 显示欢迎页: ${this.showWelcomePage ? '开启' : '关闭'}`);
  }

  getWelcomePageStatus() {
    return this.showWelcomePage;
  }
}

MenuService.toString = () => '[class MenuService]';

// 注册IPC事件，供渲染进程获取欢迎页状态
ipcMain.handle('get-welcome-page-status', (event) => {
  const menuService = require('./menu').menuService;
  return { showWelcomePage: menuService.getWelcomePageStatus() };
});

// 注册IPC事件，允许渲染进程主动设置欢迎页状态
ipcMain.handle('set-welcome-page-status', (event, status) => {
  const menuService = require('./menu').menuService;
  menuService.showWelcomePage = status;
  menuService.store.set('showWelcomePage', status);
  // 更新菜单勾选
  menuService.create();
  // 通知渲染进程
  if (menuService.mainWindow) {
    menuService.mainWindow.webContents.send('toggle-welcome-page', status);
  }
  return { showWelcomePage: status };
});

module.exports = {
  menuService: new MenuService()
}; 