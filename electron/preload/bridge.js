/* 
 * 如果启用了上下文隔离，渲染进程无法使用electron的api，
 * 可通过contextBridge 导出api给渲染进程使用
 */

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: ipcRenderer,
})

// 文件系统API
contextBridge.exposeInMainWorld('electronAPI', {
  // 打开文件夹选择对话框
  openFolderDialog: () => ipcRenderer.invoke('open-folder-dialog'),
  
  // 读取目录内容
  readDirectory: (folderPath) => ipcRenderer.invoke('read-directory', folderPath),
  
  // 用VSCode打开目录
  openWithVSCode: (folderPath) => ipcRenderer.invoke('open-with-vscode', folderPath),
  
  // 用系统默认方式打开文件夹
  openFolder: (folderPath) => ipcRenderer.invoke('open-folder', folderPath),
  
  // 读取文件内容
  readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
  
  // 写入文件内容
  writeFile: (filePath, content) => ipcRenderer.invoke('write-file', filePath, content),

  // 获取文件信息
  getFileInfo: (filePath) => ipcRenderer.invoke('get-file-info', filePath),

  // 通用IPC调用方法
  invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
})