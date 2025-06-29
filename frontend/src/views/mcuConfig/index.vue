<template>
  <div class="mcu-config-container">
    <!-- 导航标签栏 -->
    <div class="nav-tabs">
      <a-tabs
        :activeKey="activeTab"
        @update:activeKey="activeTab = $event"
        type="card"
        size="small"
        @change="handleTabChange"
      >
        <a-tab-pane key="detail" tab="详细信息">
          <div class="tab-content">
            <!-- 第一部分：单片机详细信息 -->
            <div class="detail-section">
              <div class="section-header">
                <h4>详细信息</h4>
              </div>
              <div class="detail-content">
                <div v-if="selectedMcu" class="mcu-details">
                  <div class="mcu-image">
                    <img :src="selectedMcu.image" :alt="selectedMcu.name" />
                  </div>
                  <div class="mcu-description">{{ selectedMcu.description }}</div>
                  <div class="mcu-specs">
                    <div class="spec-item">
                      <span class="spec-label">架构:</span>
                      <a-tag color="blue">{{ selectedMcu.architecture }}</a-tag>
                    </div>
                    <div class="spec-item">
                      <span class="spec-label">主频:</span>
                      <a-tag color="green">{{ selectedMcu.frequency }}</a-tag>
                    </div>
                    <div class="spec-item">
                      <span class="spec-label">Flash:</span>
                      <a-tag color="orange">{{ selectedMcu.flash }}</a-tag>
                    </div>
                  </div>
                </div>
                <div v-else class="no-mcu-selected">
                  <a-empty description="未选择单片机型号" />
                </div>
              </div>
            </div>
          </div>
        </a-tab-pane>

        <a-tab-pane key="config" tab="配置">
          <div class="tab-content">
            <!-- 第二部分：配置部分 -->
            <div class="config-section">
              <div class="section-header">
                <h4>配置</h4>
              </div>
              <div class="config-content">
                <a-collapse
                  :activeKey="activeCollapseKeys"
                  @update:activeKey="activeCollapseKeys = $event"
                  :accordion="false"
                  :bordered="false"
                  ghost
                >
                  <!-- 系统核心 -->
                  <a-collapse-panel key="system-core" header="系统核心">
                    <a-list
                      size="small"
                      :data-source="systemCoreList"
                      :split="false"
                      class="config-list"
                    >
                      <template #renderItem="{ item }">
                        <a-list-item
                          :class="{ 'highlighted': isItemSelected('system-core', item) }"
                          @click="toggleItem('system-core', item)"
                        >
                          <div class="list-item-content">
                            <div class="radio-wrapper">
                              <a-checkbox
                                :checked="isItemSelected('system-core', item)"
                                @change="toggleItem('system-core', item)"
                              />
                            </div>
                            <span class="item-text">{{ item }}</span>
                          </div>
                        </a-list-item>
                      </template>
                    </a-list>
                  </a-collapse-panel>

                  <!-- 模拟 -->
                  <a-collapse-panel key="analog" header="模拟">
                    <a-list
                      size="small"
                      :data-source="analogList"
                      :split="false"
                      class="config-list"
                    >
                      <template #renderItem="{ item }">
                        <a-list-item
                          :class="{ 'highlighted': isItemSelected('analog', item) }"
                          @click="toggleItem('analog', item)"
                        >
                          <div class="list-item-content">
                            <div class="radio-wrapper">
                              <a-checkbox
                                :checked="isItemSelected('analog', item)"
                                @change="toggleItem('analog', item)"
                              />
                            </div>
                            <span class="item-text">{{ item }}</span>
                          </div>
                        </a-list-item>
                      </template>
                    </a-list>
                  </a-collapse-panel>

                  <!-- 时钟 -->
                  <a-collapse-panel key="clock" header="时钟">
                    <a-list
                      size="small"
                      :data-source="clockList"
                      :split="false"
                      class="config-list"
                    >
                      <template #renderItem="{ item }">
                        <a-list-item
                          :class="{ 'highlighted': isItemSelected('clock', item) }"
                          @click="toggleItem('clock', item)"
                        >
                          <div class="list-item-content">
                            <div class="radio-wrapper">
                              <a-checkbox
                                :checked="isItemSelected('clock', item)"
                                @change="toggleItem('clock', item)"
                              />
                            </div>
                            <span class="item-text">{{ item }}</span>
                          </div>
                        </a-list-item>
                      </template>
                    </a-list>
                  </a-collapse-panel>

                  <!-- 通信 -->
                  <a-collapse-panel key="communication" header="通信">
                    <a-list
                      size="small"
                      :data-source="communicationList"
                      :split="false"
                      class="config-list"
                    >
                      <template #renderItem="{ item }">
                        <a-list-item
                          :class="{ 'highlighted': isItemSelected('communication', item) }"
                          @click="toggleItem('communication', item)"
                        >
                          <div class="list-item-content">
                            <div class="radio-wrapper">
                              <a-checkbox
                                :checked="isItemSelected('communication', item)"
                                @change="toggleItem('communication', item)"
                              />
                            </div>
                            <span class="item-text">{{ item }}</span>
                          </div>
                        </a-list-item>
                      </template>
                    </a-list>
                  </a-collapse-panel>

                  <!-- 计算 -->
                  <a-collapse-panel key="computation" header="计算">
                    <a-list
                      size="small"
                      :data-source="computationList"
                      :split="false"
                      class="config-list"
                    >
                      <template #renderItem="{ item }">
                        <a-list-item
                          :class="{ 'highlighted': isItemSelected('computation', item) }"
                          @click="toggleItem('computation', item)"
                        >
                          <div class="list-item-content">
                            <div class="radio-wrapper">
                              <a-checkbox
                                :checked="isItemSelected('computation', item)"
                                @change="toggleItem('computation', item)"
                              />
                            </div>
                            <span class="item-text">{{ item }}</span>
                          </div>
                        </a-list-item>
                      </template>
                    </a-list>
                  </a-collapse-panel>

                  <!-- 中间件和软件包 -->
                  <a-collapse-panel key="middleware" header="中间件和软件包">
                    <a-list
                      size="small"
                      :data-source="middlewareList"
                      :split="false"
                      class="config-list"
                    >
                      <template #renderItem="{ item }">
                        <a-list-item
                          :class="{ 'highlighted': isItemSelected('middleware', item) }"
                          @click="toggleItem('middleware', item)"
                        >
                          <div class="list-item-content">
                            <div class="radio-wrapper">
                              <a-checkbox
                                :checked="isItemSelected('middleware', item)"
                                @change="toggleItem('middleware', item)"
                              />
                            </div>
                            <span class="item-text">{{ item }}</span>
                          </div>
                        </a-list-item>
                      </template>
                    </a-list>
                  </a-collapse-panel>
                </a-collapse>
              </div>
            </div>
          </div>
        </a-tab-pane>

        <a-tab-pane key="file" tab="文件浏览">
          <div class="tab-content">
            <!-- 第三部分：文件浏览窗口 -->
            <div class="file-section">
              <div class="section-header">
                <h4>文件浏览</h4>
              </div>
              <div class="file-content">
                <div class="project-header">
                  <a-button
                    type="primary"
                    size="small"
                    @click="openProjectFolder"
                    class="open-folder-btn"
                  >
                    打开项目目录
                  </a-button>
                  <a-button
                    type="primary"
                    size="small"
                    @click="openWithVSCode"
                    :disabled="!projectPath"
                  >
                    用VSCode打开
                  </a-button>
                  <a-button
                    type="default"
                    size="small"
                    @click="testCodeEditor"
                  >
                    测试编辑器
                  </a-button>
                </div>

                <a-divider />

                <div class="project-tree">
                  <div v-if="projectTreeData.length === 0" class="empty-project">
                    <a-empty description="未打开项目目录">
                      <a-button type="primary" @click="openProjectFolder">
                        打开目录
                      </a-button>
                    </a-empty>
                  </div>
                  <div v-else>
                    <div v-if="isLoadingFile" class="loading-indicator">
                      <a-spin size="small" />
                      <span>正在加载文件...</span>
                    </div>
                    <a-tree
                      :tree-data="projectTreeData"
                      :expanded-keys="expandedKeys"
                      @expand="onExpand"
                      @select="onSelect"
                      class="file-tree"
                      :show-line="true"
                      :show-icon="false"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import globalComponents from '@/components/global';

const { iconFont: IconFont } = globalComponents;

const router = useRouter();

// 当前激活的标签页
const activeTab = ref('config');

// 选中的单片机信息
const selectedMcu = ref({
  name: 'STM32F103C8T6',
  image: '/images/mcu/stm32f103c8t6.png',
  description: '基于ARM Cortex-M3内核的32位微控制器，具有丰富的外设接口和强大的处理能力。',
  architecture: 'ARM Cortex-M3',
  frequency: '72MHz',
  flash: '64KB'
});

// 配置相关
const activeCollapseKeys = ref(['system-core']); // 默认展开系统核心
const selectedItems = ref({
  'system-core': [],
  'analog': [],
  'clock': [],
  'communication': [],
  'computation': [],
  'middleware': []
}); // 选中的项目（多选）
const expandedKeys = ref([]); // 展开的树节点
const projectTreeData = ref([]); // 项目目录树数据
const projectPath = ref(''); // 项目路径
const isLoadingFile = ref(false); // 文件加载状态

// 配置列表数据
const systemCoreList = ref(['DMA', 'GPIO', 'IWDG', 'NVIC', 'RCC', 'SYS', 'WWDG']);
const analogList = ref(['ADC1', 'ADC2']);
const clockList = ref(['RCC', 'TIM1', 'TIM2', 'TIM3']);
const communicationList = ref(['CAN', 'I2C1', 'I2C2', 'SPI1', 'SPI2', 'USART1', 'USART2', 'USB', 'BT', 'WIFI']);
const computationList = ref(['CRC']);
const middlewareList = ref(['FREERTOS', 'LVGL']);

onMounted(() => {
  loadSelectedMcu();
  loadMockProjectStructure();
});

function loadSelectedMcu() {
  const mcuData = localStorage.getItem('selectedMicrocontroller');
  if (mcuData) {
    try {
      selectedMcu.value = JSON.parse(mcuData);
    } catch (error) {
      console.error('解析单片机数据失败:', error);
    }
  }
}

// 标签页切换事件
function handleTabChange(key) {
  activeTab.value = key;
  console.log('切换到标签页:', key);
}

// 检查项目是否被选中
function isItemSelected(group, item) {
  return selectedItems.value[group].includes(item);
}

// 切换项目选择状态
function toggleItem(group, item) {
  if (isItemSelected(group, item)) {
    selectedItems.value[group] = selectedItems.value[group].filter(i => i !== item);
  } else {
    selectedItems.value[group].push(item);
  }
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
      console.log('读取到的文件列表:', files);
      projectTreeData.value = buildTreeStructure(files, folderPath);
      expandedKeys.value = getDefaultExpandedKeys(projectTreeData.value);
      console.log('构建的树形数据:', projectTreeData.value);
    }).catch((error) => {
      console.error('读取目录失败:', error);
      loadMockProjectStructure();
    });
  } else {
    loadMockProjectStructure();
  }
}

// 构建树形结构
function buildTreeStructure(files, basePath) {
  const treeData = [];
  const pathMap = new Map();

  // 过滤掉隐藏文件和系统文件
  const filteredFiles = files.filter(file => {
    const fileName = file.split(/[\\\/]/).pop();
    const hiddenPatterns = ['.git', '.vscode', '.idea', 'node_modules', 'Thumbs.db', '.DS_Store'];
    return !hiddenPatterns.some(pattern =>
      fileName.includes(pattern) || file.includes(pattern)
    );
  });

  filteredFiles.forEach(file => {
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
          children: isLeaf ? undefined : [],
          className: isLeaf ? 'file-node' : 'directory-node'
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
  // 默认全部关闭，返回空数组
  return [];
}

// 加载模拟项目结构
function loadMockProjectStructure() {
  projectTreeData.value = [
    {
      title: 'src',
      key: 'src',
      className: 'directory-node',
      children: [
        {
          title: 'main.c',
          key: 'src/main.c',
          isLeaf: true,
          className: 'file-node'
        },
        {
          title: 'stm32f1xx_hal_msp.c',
          key: 'src/stm32f1xx_hal_msp.c',
          isLeaf: true,
          className: 'file-node'
        },
        {
          title: 'system_stm32f1xx.c',
          key: 'src/system_stm32f1xx.c',
          isLeaf: true,
          className: 'file-node'
        }
      ]
    },
    {
      title: 'inc',
      key: 'inc',
      className: 'directory-node',
      children: [
        {
          title: 'main.h',
          key: 'inc/main.h',
          isLeaf: true,
          className: 'file-node'
        },
        {
          title: 'stm32f1xx_hal_conf.h',
          key: 'inc/stm32f1xx_hal_conf.h',
          isLeaf: true,
          className: 'file-node'
        }
      ]
    },
    {
      title: 'generated_code.c',
      key: 'generated_code.c',
      isLeaf: true,
      className: 'file-node'
    }
  ];

  expandedKeys.value = []; // 默认全部关闭
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

// 树节点展开事件
function onExpand(expandedKeysList) {
  console.log('展开的节点:', expandedKeysList);
  console.log('当前树数据:', projectTreeData.value);
  // 更新展开状态
  expandedKeys.value = expandedKeysList;
}

// 树节点选择事件
function onSelect(selectedKeys, info) {
  console.log('选中的节点:', selectedKeys, info);

  if (selectedKeys.length > 0) {
    const selectedKey = selectedKeys[0];
    const selectedNode = findNodeByKey(projectTreeData.value, selectedKey);

    if (selectedNode && selectedNode.isLeaf) {
      // 这是一个文件，读取文件内容
      // 构建完整的文件路径
      const filePath = buildFilePath(projectPath.value, selectedKey);
      console.log('准备读取文件:', filePath);
      loadFileContent(filePath, selectedNode.title);
    }
  }
}

// 构建文件路径
function buildFilePath(basePath, relativePath) {
  // 确保路径分隔符正确
  const normalizedBase = basePath.replace(/\\/g, '/');
  const normalizedRelative = relativePath.replace(/\\/g, '/');

  // 移除开头的斜杠
  const cleanRelative = normalizedRelative.startsWith('/')
    ? normalizedRelative.substring(1)
    : normalizedRelative;

  return `${normalizedBase}/${cleanRelative}`;
}

// 根据key查找节点
function findNodeByKey(nodes, key) {
  for (const node of nodes) {
    if (node.key === key) {
      return node;
    }
    if (node.children) {
      const found = findNodeByKey(node.children, key);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

// 加载文件内容
function loadFileContent(filePath, fileName) {
  isLoadingFile.value = true;

  if (window.require) {
    const { ipcRenderer } = window.require('electron');
    // 先检查文件大小
    checkFileSize(filePath).then((fileSize) => {
      if (fileSize > 10 * 1024 * 1024) { // 10MB限制
        sendFileToEditor(fileName, filePath, `# 文件过大\n\n文件名: ${fileName}\n文件大小: ${(fileSize / 1024 / 1024).toFixed(2)}MB\n\n*文件大小超过10MB限制，无法在编辑器中显示*`);
        isLoadingFile.value = false;
        return;
      }

      ipcRenderer.invoke('read-file', filePath).then((content) => {
        console.log('文件内容加载成功:', fileName);

        // 发送文件内容到右侧编辑器
        sendFileToEditor(fileName, filePath, content);
        isLoadingFile.value = false;
      }).catch((error) => {
        console.error('读取文件失败:', error);
        // 显示错误信息
        sendFileToEditor(fileName, filePath, `# 读取文件失败\n\n文件名: ${fileName}\n路径: ${filePath}\n\n错误信息: ${error.message || '未知错误'}`);
        isLoadingFile.value = false;
      });
    }).catch((error) => {
      console.error('检查文件大小失败:', error);
      sendFileToEditor(fileName, filePath, `# 文件访问失败\n\n文件名: ${fileName}\n路径: ${filePath}\n\n错误信息: ${error.message || '未知错误'}`);
      isLoadingFile.value = false;
    });
  } else {
    console.log('不在Electron环境中，无法读取文件');
    sendFileToEditor(fileName, filePath, `# 文件预览\n\n文件名: ${fileName}\n路径: ${filePath}\n\n*注意: 当前不在Electron环境中，无法读取实际文件内容*`);
    isLoadingFile.value = false;
  }
}

// 检查文件大小
function checkFileSize(filePath) {
  return new Promise((resolve, reject) => {
    if (window.require) {
      const { ipcRenderer } = window.require('electron');
      // 通过IPC调用获取文件信息
      ipcRenderer.invoke('get-file-info', filePath).then((fileInfo) => {
        resolve(fileInfo.size);
      }).catch((error) => {
        reject(error);
      });
    } else {
      // 在非Electron环境中，假设文件大小正常
      resolve(1024);
    }
  });
}

// 发送文件到右侧编辑器
function sendFileToEditor(fileName, filePath, content) {
  // 通过事件总线或localStorage发送文件信息到右侧编辑器
  const fileInfo = {
    name: fileName,
    path: filePath,
    content: content,
    timestamp: Date.now()
  };

  // 存储到localStorage，供右侧编辑器读取
  localStorage.setItem('currentFile', JSON.stringify(fileInfo));

  // 触发自定义事件，通知右侧编辑器
  window.dispatchEvent(new CustomEvent('fileSelected', {
    detail: fileInfo
  }));

  console.log('文件已发送到编辑器:', fileName);
}

// 测试代码编辑器
function testCodeEditor() {
  const testFile = {
    name: 'test.c',
    path: '/test/path/test.c',
    content: `#include <stdio.h>
#include <stdlib.h>

int main() {
    printf("Hello, World!\\n");

    // 这是一个测试文件
    int number = 42;
    printf("The answer is: %d\\n", number);

    return 0;
}`,
    timestamp: Date.now()
  };

  // 发送测试文件到编辑器
  sendFileToEditor(testFile.name, testFile.path, testFile.content);
  console.log('测试文件已发送到编辑器');
}
</script>

<style lang="less" scoped>
.mcu-config-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: transparent;
}

.nav-tabs {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  :deep(.ant-tabs) {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  :deep(.ant-tabs-content-holder) {
    flex: 1;
    overflow: hidden;
  }

  :deep(.ant-tabs-content) {
    height: 100%;
  }

  :deep(.ant-tabs-tabpane) {
    height: 100%;
    overflow: hidden;
  }

  :deep(.ant-tabs-nav) {
    margin: 0;
    background: #f8f9fa;
    border-bottom: 1px solid #e8e8e8;
    display: flex;
    justify-content: center;
    padding: 0 8px;
    min-height: 48px;
  }

  :deep(.ant-tabs-tab) {
    margin: 0 4px;
    padding: 10px 20px;
    font-size: 13px;
    font-weight: 500;
    color: #666;
    border-radius: 6px 6px 0 0;
    transition: all 0.3s ease;
    border: none;
    background: transparent;

    &:hover {
      color: #1890ff;
      background: rgba(24, 144, 255, 0.05);
    }

    &.ant-tabs-tab-active {
      color: #1890ff;
      background: #fff;
      border-bottom: 2px solid #1890ff;
      font-weight: 600;
    }
  }

  :deep(.ant-tabs-nav-list) {
    justify-content: center;
    width: auto;
    margin: 0 auto;
  }

  :deep(.ant-tabs-nav-wrap) {
    justify-content: center;
  }

  :deep(.ant-tabs-ink-bar) {
    display: none;
  }
}

.tab-content {
  height: 100%;
  overflow-y: auto;
  background: #fff;
}

.section-header {
  padding: 16px 20px;
  background: #fafbfc;
  border-bottom: 1px solid #f0f0f0;
  position: sticky;
  top: 0;
  z-index: 10;

  h4 {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    color: #262626;
    display: flex;
    align-items: center;
    gap: 8px;

    &::before {
      content: '';
      width: 3px;
      height: 16px;
      background: #1890ff;
      border-radius: 2px;
    }
  }
}

.detail-section {
  flex: 0 0 auto;
}

.detail-content {
  padding: 20px;
}

.mcu-details {
  .mcu-image {
    text-align: center;
    margin-bottom: 16px;

    img {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      max-height: 100px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
  }

  .mcu-description {
    color: #595959;
    line-height: 1.6;
    margin-bottom: 16px;
    font-size: 13px;
    text-align: justify;
  }

  .mcu-specs {
    .spec-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      padding: 8px 12px;
      background: #f8f9fa;
      border-radius: 6px;
      transition: all 0.3s ease;

      &:hover {
        background: #f0f8ff;
      }

      .spec-label {
        color: #595959;
        font-weight: 500;
        font-size: 13px;
      }

      :deep(.ant-tag) {
        margin: 0;
        font-size: 12px;
        padding: 2px 8px;
        border-radius: 4px;
      }
    }
  }
}

.no-mcu-selected {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;

  :deep(.ant-empty-description) {
    color: #8c8c8c;
    font-size: 14px;
  }
}

.config-section {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.config-content {
  flex: 1;
  overflow-y: auto;
  padding: 12px;

  :deep(.ant-collapse) {
    background: transparent;
    border: none;
  }

  :deep(.ant-collapse-item) {
    border: none;
    margin-bottom: 8px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  :deep(.ant-collapse-header) {
    padding: 10px 16px !important;
    background: #f8f9fa;
    font-size: 13px;
    font-weight: 600;
    color: #262626;
    border-bottom: 1px solid #f0f0f0;

    &:hover {
      background: #f0f8ff;
    }

    .ant-collapse-expand-icon {
      color: #1890ff;
      font-size: 12px;
    }
  }

  :deep(.ant-collapse-content) {
    border: none;
  }

  :deep(.ant-collapse-content-box) {
    padding: 6px 16px !important;
  }
}

.config-list {
  :deep(.ant-list-item) {
    padding: 4px 8px;
    cursor: pointer;
    border-radius: 6px;
    transition: all 0.3s ease;
    font-size: 13px;
    margin-bottom: 1px;
    border: 1px solid transparent;
    min-height: 28px;
    display: flex;
    align-items: center;
    justify-content: flex-start;

    &:hover {
      background: #f0f8ff;
      border-color: #d6e4ff;
    }

    &.highlighted {
      background: #1890ff;
      color: white;
      border-color: #1890ff;
      font-weight: 500;
      box-shadow: 0 2px 4px rgba(24, 144, 255, 0.3);
    }

    &:last-child {
      margin-bottom: 0;
    }

    .list-item-content {
      display: flex;
      align-items: center;
      gap: 0px;
      width: 100%;
      justify-content: flex-start;

      .radio-wrapper {
        flex-shrink: 0;
        margin-right: 4px;

        :deep(.ant-checkbox) {
          margin: 0;

          .ant-checkbox-inner {
            width: 14px;
            height: 14px;
            border-radius: 2px;

            &::after {
              width: 6px;
              height: 6px;
              border-radius: 1px;
            }
          }
        }
      }

      .item-text {
        flex: 1;
        line-height: 1.4;
        text-align: left;
        padding-left: 0;
        margin-left: 0;
      }
    }
  }
}

.file-section {
  flex: 0 0 auto;
}

.file-content {
  padding: 20px;
}

.project-header {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;

  .open-folder-btn {
    flex: 1;
    height: 36px;
    font-size: 13px;
    font-weight: 500;
  }
}

.project-tree {
  .empty-project {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    text-align: center;

    :deep(.ant-empty-description) {
      color: #8c8c8c;
      font-size: 14px;
    }
  }

  .file-tree {
    :deep(.ant-tree-node-content-wrapper) {
      padding: 6px 8px;
      border-radius: 4px;
      transition: all 0.3s ease;
      width: 100%;
      display: flex;
      align-items: center;

      &:hover {
        background: #f0f8ff;
      }
    }

    :deep(.ant-tree-treenode) {
      width: 100%;
    }

    :deep(.ant-tree-node-content-wrapper.ant-tree-node-selected) {
      background: #e6f7ff;
      border: 1px solid #91d5ff;
    }

    :deep(.ant-tree-switcher) {
      margin-right: 4px;
      color: #666;
    }

    :deep(.ant-tree-title) {
      color: #262626;
      font-size: 13px;
      text-align: left;
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    // 目录节点样式
    :deep(.ant-tree-treenode.directory-node) {
      .ant-tree-node-content-wrapper {
        background: #f5f5f5;
        border: 1px solid #e8e8e8;
        font-weight: 500;

        &:hover {
          background: #e6f7ff;
          border-color: #91d5ff;
        }
      }
    }

    // 文件节点样式
    :deep(.ant-tree-treenode.file-node) {
      .ant-tree-node-content-wrapper {
        background: #fff;
        border: 1px solid transparent;

        &:hover {
          background: #f8f9fa;
          border-color: #e8e8e8;
        }
      }
    }
  }
}

.loading-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;

  .ant-spin {
    margin-right: 8px;
  }

  span {
    font-size: 13px;
    font-weight: 500;
  }
}
</style>

