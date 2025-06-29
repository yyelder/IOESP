<template>
  <div class="project-explorer">
    <div class="explorer-header">
      <h4>项目资源管理器</h4>
      <div class="explorer-actions">
        <a-button
          type="primary"
          size="small"
          @click="openProjectFolder"
          class="open-folder-btn"
        >
          <template #icon>
            <icon-font type="icon-folder" />
          </template>
          打开项目目录
        </a-button>
        <a-button
          type="primary"
          size="small"
          @click="openWithVSCode"
          :disabled="!projectPath"
        >
          <template #icon>
            <icon-font type="icon-code" />
          </template>
          用VSCode打开
        </a-button>
      </div>
    </div>

    <div class="explorer-content">
      <div v-if="!projectPath" class="no-project">
        <icon-font type="icon-folder-open" class="no-project-icon" />
        <p>请选择项目目录</p>
        <a-button type="primary" @click="openProjectFolder">选择目录</a-button>
      </div>

      <div v-else class="file-tree-container">
        <div class="project-path">
          <span class="path-label">项目路径：</span>
          <span class="path-value">{{ projectPath }}</span>
        </div>

        <a-tree
          v-model:expandedKeys="expandedKeys"
          v-model:selectedKeys="selectedKeys"
          :tree-data="projectTreeData"
          :show-line="true"
          @select="onFileSelect"
          class="file-tree"
        >
          <template #title="{ title, key, isLeaf }">
            <span class="file-tree-node">
              <icon-font
                :type="getFileIcon(key, isLeaf)"
                class="file-icon"
                :class="getFileIconClass(key)"
              />
              {{ title }}
            </span>
          </template>
        </a-tree>
      </div>
    </div>

    <div class="explorer-footer">
      <div class="file-info">
        <span v-if="selectedFile">{{ selectedFile.name }}</span>
        <span v-else>未选择文件</span>
      </div>
      <div class="file-count">
        <span>{{ getFileCount() }} 个文件</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import globalComponents from '@/components/global';

const { iconFont: IconFont } = globalComponents;

// 项目路径
const projectPath = ref('');

// 项目树数据
const projectTreeData = ref([]);

// 展开的键
const expandedKeys = ref([]);

// 选中的键
const selectedKeys = ref([]);

// 选中的文件
const selectedFile = ref(null);

// 文件图标映射
const fileIcons = {
  // 文件夹
  'folder': 'icon-folder',
  'folder-open': 'icon-folder-open',

  // 代码文件
  'c': 'icon-file-code',
  'h': 'icon-file-code',
  'cpp': 'icon-file-code',
  'cc': 'icon-file-code',
  'hpp': 'icon-file-code',
  'js': 'icon-file-code',
  'ts': 'icon-file-code',
  'py': 'icon-file-code',
  'java': 'icon-file-code',
  'go': 'icon-file-code',
  'rs': 'icon-file-code',
  'php': 'icon-file-code',

  // 配置文件
  'json': 'icon-file-text',
  'xml': 'icon-file-text',
  'yaml': 'icon-file-text',
  'yml': 'icon-file-text',
  'ini': 'icon-file-text',
  'conf': 'icon-file-text',

  // 文档文件
  'md': 'icon-file-text',
  'txt': 'icon-file-text',
  'pdf': 'icon-file-pdf',

  // 图片文件
  'png': 'icon-file-image',
  'jpg': 'icon-file-image',
  'jpeg': 'icon-file-image',
  'gif': 'icon-file-image',
  'svg': 'icon-file-image',

  // 其他
  'default': 'icon-file'
};

// 获取文件图标
function getFileIcon(key, isLeaf) {
  if (!isLeaf) {
    return expandedKeys.value.includes(key) ? 'icon-folder-open' : 'icon-folder';
  }

  const ext = key.split('.').pop().toLowerCase();
  return fileIcons[ext] || fileIcons.default;
}

// 获取文件图标样式类
function getFileIconClass(key) {
  const ext = key.split('.').pop().toLowerCase();
  return `icon-${ext}`;
}

// 打开项目目录
function openProjectFolder() {
  if (window.require) {
    const { ipcRenderer } = window.require('electron');
    ipcRenderer.invoke('open-folder-dialog').then((result) => {
      if (result.canceled) {
        console.log('用户取消了文件夹选择');
        return;
      }

      const selectedPath = result.filePaths[0];
      console.log('选择的项目目录:', selectedPath);
      projectPath.value = selectedPath;

      loadProjectStructure(selectedPath);
    }).catch((error) => {
      console.error('打开文件夹对话框失败:', error);
      loadMockProjectStructure();
    });
  } else {
    console.log('不在Electron环境中，使用模拟数据');
    loadMockProjectStructure();
  }
}

// 加载项目目录结构
function loadProjectStructure(folderPath) {
  if (window.require) {
    const { ipcRenderer } = window.require('electron');
    ipcRenderer.invoke('read-directory', folderPath).then((files) => {
      projectTreeData.value = buildTreeData(files, folderPath);
      expandedKeys.value = getDefaultExpandedKeys(projectTreeData.value);
    }).catch((error) => {
      console.error('读取目录失败:', error);
      loadMockProjectStructure();
    });
  } else {
    loadMockProjectStructure();
  }
}

// 构建树形数据
function buildTreeData(files, basePath) {
  const treeData = [];
  const pathMap = new Map();

  files.forEach(file => {
    const relativePath = file.replace(basePath, '').replace(/^[\\\/]/, '');
    const pathParts = relativePath.split(/[\\\/]/);

    let currentPath = '';
    let parentNode = null;

    for (let i = 0; i < pathParts.length; i++) {
      const part = pathParts[i];
      currentPath = currentPath ? `${currentPath}/${part}` : part;

      if (!pathMap.has(currentPath)) {
        const isLeaf = i === pathParts.length - 1;
        const node = {
          title: part,
          key: currentPath,
          isLeaf: isLeaf,
          children: isLeaf ? undefined : []
        };

        pathMap.set(currentPath, node);

        if (parentNode) {
          parentNode.children.push(node);
        } else {
          treeData.push(node);
        }
      }

      parentNode = pathMap.get(currentPath);
    }
  });

  return treeData;
}

// 获取默认展开的键
function getDefaultExpandedKeys(treeData) {
  const expandedKeys = [];

  function traverse(nodes, depth = 0) {
    if (depth < 2) {
      nodes.forEach(node => {
        if (!node.isLeaf) {
          expandedKeys.push(node.key);
          if (node.children) {
            traverse(node.children, depth + 1);
          }
        }
      });
    }
  }

  traverse(treeData);
  return expandedKeys;
}

// 加载模拟项目结构
function loadMockProjectStructure() {
  projectTreeData.value = [
    {
      title: 'src',
      key: 'src',
      children: [
        {
          title: 'main.c',
          key: 'src/main.c',
          isLeaf: true
        },
        {
          title: 'stm32f1xx_hal_msp.c',
          key: 'src/stm32f1xx_hal_msp.c',
          isLeaf: true
        },
        {
          title: 'system_stm32f1xx.c',
          key: 'src/system_stm32f1xx.c',
          isLeaf: true
        }
      ]
    },
    {
      title: 'inc',
      key: 'inc',
      children: [
        {
          title: 'main.h',
          key: 'inc/main.h',
          isLeaf: true
        },
        {
          title: 'stm32f1xx_hal_conf.h',
          key: 'inc/stm32f1xx_hal_conf.h',
          isLeaf: true
        }
      ]
    },
    {
      title: 'Drivers',
      key: 'Drivers',
      children: [
        {
          title: 'STM32F1xx_HAL_Driver',
          key: 'Drivers/STM32F1xx_HAL_Driver',
          children: [
            {
              title: 'Inc',
              key: 'Drivers/STM32F1xx_HAL_Driver/Inc',
              children: [
                {
                  title: 'stm32f1xx_hal.h',
                  key: 'Drivers/STM32F1xx_HAL_Driver/Inc/stm32f1xx_hal.h',
                  isLeaf: true
                }
              ]
            }
          ]
        }
      ]
    },
    {
      title: 'generated_code.c',
      key: 'generated_code.c',
      isLeaf: true
    }
  ];

  expandedKeys.value = ['src', 'inc', 'Drivers'];
  projectPath.value = '/mock/project/path';
}

// 用VSCode打开目录
function openWithVSCode() {
  if (!projectPath.value) {
    console.log('请先选择项目目录');
    return;
  }

  if (window.require) {
    const { ipcRenderer } = window.require('electron');
    ipcRenderer.invoke('open-with-vscode', projectPath.value).then(() => {
      console.log('VSCode打开成功');
    }).catch((error) => {
      console.error('VSCode打开失败:', error);
      ipcRenderer.invoke('open-folder', projectPath.value);
    });
  } else {
    console.log('用VSCode打开目录:', projectPath.value);
    alert(`请手动用VSCode打开目录: ${projectPath.value}`);
  }
}

// 文件选择事件
function onFileSelect(selectedKeys, info) {
  if (selectedKeys.length > 0) {
    const selectedKey = selectedKeys[0];
    const node = findNodeByKey(projectTreeData.value, selectedKey);

    if (node && node.isLeaf) {
      selectedFile.value = {
        name: node.title,
        path: selectedKey,
        key: selectedKey
      };

      // 触发文件选择事件
      emit('fileSelect', selectedFile.value);
    }
  } else {
    selectedFile.value = null;
  }
}

// 根据键查找节点
function findNodeByKey(nodes, key) {
  for (const node of nodes) {
    if (node.key === key) {
      return node;
    }
    if (node.children) {
      const found = findNodeByKey(node.children, key);
      if (found) return found;
    }
  }
  return null;
}

// 获取文件数量
function getFileCount() {
  let count = 0;

  function countFiles(nodes) {
    nodes.forEach(node => {
      if (node.isLeaf) {
        count++;
      } else if (node.children) {
        countFiles(node.children);
      }
    });
  }

  countFiles(projectTreeData.value);
  return count;
}

// 定义事件
const emit = defineEmits(['fileSelect']);

// 暴露方法给父组件
defineExpose({
  openProjectFolder,
  openWithVSCode,
  projectPath: computed(() => projectPath.value),
  selectedFile: computed(() => selectedFile.value)
});
</script>

<style lang="less" scoped>
.project-explorer {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.explorer-header {
  padding: 12px 16px;
  border-bottom: 1px solid #e8e8e8;

  h4 {
    margin: 0 0 12px 0;
    color: #1890ff;
    font-size: 14px;
    font-weight: 500;
  }

  .explorer-actions {
    display: flex;
    gap: 8px;

    .open-folder-btn {
      flex: 1;
    }
  }
}

.explorer-content {
  flex: 1;
  overflow: hidden;
}

.no-project {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;

  .no-project-icon {
    font-size: 48px;
    margin-bottom: 16px;
    color: #d9d9d9;
  }

  p {
    margin: 0 0 16px 0;
    font-size: 14px;
  }
}

.file-tree-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.project-path {
  padding: 8px 16px;
  background: #f8f9fa;
  border-bottom: 1px solid #e8e8e8;
  font-size: 12px;

  .path-label {
    color: #666;
    font-weight: 500;
  }

  .path-value {
    color: #333;
    word-break: break-all;
  }
}

.file-tree {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;

  .file-tree-node {
    display: flex;
    align-items: center;
    gap: 6px;

    .file-icon {
      font-size: 14px;
      color: #666;

      &.icon-folder,
      &.icon-folder-open {
        color: #faad14;
      }

      &.icon-file-code {
        color: #1890ff;
      }

      &.icon-file-text {
        color: #52c41a;
      }

      &.icon-file-pdf {
        color: #f5222d;
      }

      &.icon-file-image {
        color: #eb2f96;
      }
    }
  }
}

.explorer-footer {
  padding: 8px 16px;
  border-top: 1px solid #e8e8e8;
  background: #f8f9fa;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;

  .file-info {
    color: #333;
    font-weight: 500;
  }

  .file-count {
    color: #666;
  }
}

:deep(.ant-tree) {
  background: transparent;

  .ant-tree-node-content-wrapper {
    padding: 4px 8px;

    &:hover {
      background: #f0f8ff;
    }

    &.ant-tree-node-selected {
      background: #e6f7ff;
    }
  }

  .ant-tree-title {
    color: #333;
  }
}
</style>
