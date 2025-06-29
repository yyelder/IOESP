const { logger } = require('ee-core/log');
const { dialog } = require('electron');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * 文件系统服务
 */
class FileSystemService {
  constructor() {
    this.name = 'FileSystemService';
  }

  /**
   * 创建服务
   */
  create() {
    logger.info('[FileSystemService] create');
    this.registerIpcHandlers();
  }

  /**
   * 注册IPC处理程序
   */
  registerIpcHandlers() {
    const { ipcMain } = require('electron');

    // 打开文件夹选择对话框
    ipcMain.handle('open-folder-dialog', async (event) => {
      try {
        const result = await dialog.showOpenDialog({
          properties: ['openDirectory'],
          title: '选择项目目录'
        });
        return result;
      } catch (error) {
        logger.error('[FileSystemService] openFolderDialog error:', error);
        throw error;
      }
    });

    // 读取目录内容
    ipcMain.handle('read-directory', async (event, folderPath) => {
      try {
        const files = this.readDirectoryRecursive(folderPath);
        return files;
      } catch (error) {
        logger.error('[FileSystemService] readDirectory error:', error);
        throw error;
      }
    });

    // 用VSCode打开目录
    ipcMain.handle('open-with-vscode', async (event, folderPath) => {
      try {
        await this.openWithVSCode(folderPath);
        return { success: true };
      } catch (error) {
        logger.error('[FileSystemService] openWithVSCode error:', error);
        throw error;
      }
    });

    // 用系统默认方式打开文件夹
    ipcMain.handle('open-folder', async (event, folderPath) => {
      try {
        await this.openFolder(folderPath);
        return { success: true };
      } catch (error) {
        logger.error('[FileSystemService] openFolder error:', error);
        throw error;
      }
    });

    // 读取文件内容
    ipcMain.handle('read-file', async (event, filePath) => {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        return content;
      } catch (error) {
        logger.error('[FileSystemService] readFile error:', error);
        throw error;
      }
    });

    // 写入文件内容
    ipcMain.handle('write-file', async (event, filePath, content) => {
      try {
        fs.writeFileSync(filePath, content, 'utf8');
        return { success: true };
      } catch (error) {
        logger.error('[FileSystemService] writeFile error:', error);
        throw error;
      }
    });

    // 获取文件信息
    ipcMain.handle('get-file-info', async (event, filePath) => {
      try {
        const stat = fs.statSync(filePath);
        return {
          size: stat.size,
          isFile: stat.isFile(),
          isDirectory: stat.isDirectory(),
          modifiedTime: stat.mtime,
          createdTime: stat.birthtime
        };
      } catch (error) {
        logger.error('[FileSystemService] getFileInfo error:', error);
        throw error;
      }
    });
  }

  /**
   * 递归读取目录内容
   */
  readDirectoryRecursive(dirPath, files = []) {
    try {
      const items = fs.readdirSync(dirPath);
      
      for (const item of items) {
        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          // 递归读取子目录
          this.readDirectoryRecursive(fullPath, files);
        } else {
          // 添加文件
          files.push(fullPath);
        }
      }
      
      return files;
    } catch (error) {
      logger.error('[FileSystemService] readDirectoryRecursive error:', error);
      return files;
    }
  }

  /**
   * 用VSCode打开目录
   */
  async openWithVSCode(folderPath) {
    return new Promise((resolve, reject) => {
      // 检查VSCode是否安装
      const vscodeCommand = this.getVSCodeCommand();
      
      if (!vscodeCommand) {
        reject(new Error('VSCode未安装或未找到'));
        return;
      }

      const command = `"${vscodeCommand}" "${folderPath}"`;
      
      exec(command, (error, stdout, stderr) => {
        if (error) {
          logger.error('[FileSystemService] VSCode open error:', error);
          reject(error);
        } else {
          logger.info('[FileSystemService] VSCode opened successfully');
          resolve();
        }
      });
    });
  }

  /**
   * 获取VSCode命令路径
   */
  getVSCodeCommand() {
    const platform = process.platform;
    
    if (platform === 'win32') {
      // Windows
      const possiblePaths = [
        'C:\\Users\\%USERNAME%\\AppData\\Local\\Programs\\Microsoft VS Code\\Code.exe',
        'C:\\Program Files\\Microsoft VS Code\\Code.exe',
        'C:\\Program Files (x86)\\Microsoft VS Code\\Code.exe'
      ];
      
      for (const possiblePath of possiblePaths) {
        const expandedPath = possiblePath.replace('%USERNAME%', process.env.USERNAME);
        if (fs.existsSync(expandedPath)) {
          return expandedPath;
        }
      }
      
      // 尝试从PATH中查找
      return 'code';
    } else if (platform === 'darwin') {
      // macOS
      const possiblePaths = [
        '/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code',
        '/usr/local/bin/code'
      ];
      
      for (const possiblePath of possiblePaths) {
        if (fs.existsSync(possiblePath)) {
          return possiblePath;
        }
      }
      
      return 'code';
    } else {
      // Linux
      return 'code';
    }
  }

  /**
   * 用系统默认方式打开文件夹
   */
  async openFolder(folderPath) {
    return new Promise((resolve, reject) => {
      const platform = process.platform;
      let command;
      
      if (platform === 'win32') {
        command = `explorer "${folderPath}"`;
      } else if (platform === 'darwin') {
        command = `open "${folderPath}"`;
      } else {
        command = `xdg-open "${folderPath}"`;
      }
      
      exec(command, (error, stdout, stderr) => {
        if (error) {
          logger.error('[FileSystemService] openFolder error:', error);
          reject(error);
        } else {
          logger.info('[FileSystemService] folder opened successfully');
          resolve();
        }
      });
    });
  }
}

module.exports = {
  FileSystemService
}; 