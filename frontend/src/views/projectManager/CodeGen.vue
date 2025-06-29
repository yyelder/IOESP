<template>
  <div class="code-gen-container">
    <div class="page-header">
      <h2>代码生成</h2>
      <p>配置代码生成选项和参数</p>
    </div>

    <div class="content-section">
      <a-row :gutter="24">
        <!-- 左侧配置区域 -->
        <a-col :span="12">
          <div class="config-panel">
            <!-- STM32Cube MCU packages and embedded software packs -->
            <a-card title="STM32Cube MCU packages and embedded software packs" class="config-card">
              <a-form layout="vertical">
                <a-form-item>
                  <a-radio-group v-model="stm32CubeSettings.libraryCopyMode">
                    <a-radio value="copy-all">
                      <strong>Copy all used libraries into the project folder</strong>
                      <div class="radio-description">将所有使用的库文件复制到项目文件夹中</div>
                    </a-radio>
                    <a-radio value="copy-necessary">
                      <strong>Copy only the necessary library files</strong>
                      <div class="radio-description">仅复制必要的库文件</div>
                    </a-radio>
                    <a-radio value="reference-only">
                      <strong>Add necessary library files as reference in the toolchain project configuration file</strong>
                      <div class="radio-description">在工具链项目配置文件中添加必要的库文件作为引用</div>
                    </a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-form>
            </a-card>

            <!-- Generated files -->
            <a-card title="Generated files" class="config-card">
              <a-form layout="vertical">
                <a-form-item>
                  <a-checkbox v-model="generatedFilesSettings.generatePeripheralFiles">
                    <strong>Generate peripheral initialization as a pair of '.c/.h' files per peripheral</strong>
                    <div class="checkbox-description">为每个外设生成一对'.c/.h'初始化文件</div>
                  </a-checkbox>
                </a-form-item>

                <a-form-item>
                  <a-checkbox v-model="generatedFilesSettings.backupPreviousFiles">
                    <strong>Backup previously generated files when re-generating</strong>
                    <div class="checkbox-description">重新生成时备份之前生成的文件</div>
                  </a-checkbox>
                </a-form-item>

                <a-form-item>
                  <a-checkbox v-model="generatedFilesSettings.keepUserCode">
                    <strong>Keep User Code when re-generating</strong>
                    <div class="checkbox-description">重新生成时保留用户代码</div>
                  </a-checkbox>
                </a-form-item>

                <a-form-item>
                  <a-checkbox v-model="generatedFilesSettings.deleteUnusedFiles">
                    <strong>Delete previously generated files when not re-generated</strong>
                    <div class="checkbox-description">删除不再重新生成的文件</div>
                  </a-checkbox>
                </a-form-item>
              </a-form>
            </a-card>

            <!-- HAL Settings -->
            <a-card title="HAL Settings" class="config-card">
              <a-form layout="vertical">
                <a-form-item>
                  <a-checkbox v-model="halSettings.setFreePinsAsAnalog">
                    <strong>Set all free pins as analog (to optimize the power consumption)</strong>
                    <div class="checkbox-description">将所有空闲引脚设置为模拟模式（优化功耗）</div>
                  </a-checkbox>
                </a-form-item>

                <a-form-item>
                  <a-checkbox v-model="halSettings.enableFullAssert">
                    <strong>Enable Full Assert</strong>
                    <div class="checkbox-description">启用完整断言</div>
                  </a-checkbox>
                </a-form-item>
              </a-form>
            </a-card>

            <!-- 高级选项 -->
            <a-card title="高级选项" class="config-card">
              <a-form layout="vertical">
                <a-form-item label="代码生成模板">
                  <a-select v-model="advancedSettings.codeTemplate" placeholder="选择代码生成模板">
                    <a-select-option value="basic">基础模板</a-select-option>
                    <a-select-option value="advanced">高级模板</a-select-option>
                    <a-select-option value="custom">自定义模板</a-select-option>
                  </a-select>
                </a-form-item>

                <a-form-item label="代码风格">
                  <a-select v-model="advancedSettings.codeStyle" placeholder="选择代码风格">
                    <a-select-option value="camelCase">驼峰命名</a-select-option>
                    <a-select-option value="snake_case">下划线命名</a-select-option>
                    <a-select-option value="PascalCase">帕斯卡命名</a-select-option>
                  </a-select>
                </a-form-item>

                <a-form-item label="注释语言">
                  <a-select v-model="advancedSettings.commentLanguage" placeholder="选择注释语言">
                    <a-select-option value="chinese">中文</a-select-option>
                    <a-select-option value="english">英文</a-select-option>
                    <a-select-option value="mixed">中英混合</a-select-option>
                  </a-select>
                </a-form-item>
              </a-form>
            </a-card>
          </div>
        </a-col>

        <!-- 右侧预览区域 -->
        <a-col :span="12">
          <div class="preview-panel">
            <a-card title="代码生成预览" class="preview-card">
              <div class="preview-content">
                <h3>库文件处理</h3>
                <a-descriptions :column="1" bordered>
                  <a-descriptions-item label="库文件复制模式">
                    {{ getLibraryCopyModeText(stm32CubeSettings.libraryCopyMode) }}
                  </a-descriptions-item>
                </a-descriptions>

                <h3>生成文件设置</h3>
                <a-descriptions :column="1" bordered>
                  <a-descriptions-item label="外设初始化文件">
                    {{ generatedFilesSettings.generatePeripheralFiles ? '生成' : '不生成' }}
                  </a-descriptions-item>
                  <a-descriptions-item label="备份之前文件">
                    {{ generatedFilesSettings.backupPreviousFiles ? '启用' : '禁用' }}
                  </a-descriptions-item>
                  <a-descriptions-item label="保留用户代码">
                    {{ generatedFilesSettings.keepUserCode ? '启用' : '禁用' }}
                  </a-descriptions-item>
                  <a-descriptions-item label="删除未使用文件">
                    {{ generatedFilesSettings.deleteUnusedFiles ? '启用' : '禁用' }}
                  </a-descriptions-item>
                </a-descriptions>

                <h3>HAL设置</h3>
                <a-descriptions :column="1" bordered>
                  <a-descriptions-item label="空闲引脚模拟模式">
                    {{ halSettings.setFreePinsAsAnalog ? '启用' : '禁用' }}
                  </a-descriptions-item>
                  <a-descriptions-item label="完整断言">
                    {{ halSettings.enableFullAssert ? '启用' : '禁用' }}
                  </a-descriptions-item>
                </a-descriptions>

                <h3>高级设置</h3>
                <a-descriptions :column="1" bordered>
                  <a-descriptions-item label="代码模板">
                    {{ getCodeTemplateText(advancedSettings.codeTemplate) }}
                  </a-descriptions-item>
                  <a-descriptions-item label="代码风格">
                    {{ getCodeStyleText(advancedSettings.codeStyle) }}
                  </a-descriptions-item>
                  <a-descriptions-item label="注释语言">
                    {{ getCommentLanguageText(advancedSettings.commentLanguage) }}
                  </a-descriptions-item>
                </a-descriptions>
              </div>
            </a-card>

            <!-- 生成的文件结构预览 -->
            <a-card title="生成的文件结构" class="preview-card">
              <a-tree
                :tree-data="fileStructureTree"
                :default-expand-all="true"
                size="small"
              >
                <template #title="{ title, isLeaf }">
                  <span :class="{ 'file-item': isLeaf, 'folder-item': !isLeaf }">
                    <icon-font :type="isLeaf ? 'icon-file' : 'icon-folder'" />
                    {{ title }}
                  </span>
                </template>
              </a-tree>
            </a-card>

            <!-- 操作按钮 -->
            <div class="action-buttons">
              <a-space>
                <a-button type="primary" @click="generateCode">生成代码</a-button>
                <a-button @click="previewCode">预览代码</a-button>
                <a-button @click="resetSettings">重置设置</a-button>
                <a-button @click="exportSettings">导出配置</a-button>
              </a-space>
            </div>
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import globalComponents from '@/components/global';

const { iconFont: IconFont } = globalComponents;

// STM32Cube设置
const stm32CubeSettings = reactive({
  libraryCopyMode: 'copy-necessary'
});

// 生成文件设置
const generatedFilesSettings = reactive({
  generatePeripheralFiles: true,
  backupPreviousFiles: true,
  keepUserCode: true,
  deleteUnusedFiles: false
});

// HAL设置
const halSettings = reactive({
  setFreePinsAsAnalog: true,
  enableFullAssert: false
});

// 高级设置
const advancedSettings = reactive({
  codeTemplate: 'basic',
  codeStyle: 'camelCase',
  commentLanguage: 'chinese'
});

// 文件结构树
const fileStructureTree = ref([
  {
    title: 'Inc',
    key: 'inc',
    children: [
      { title: 'main.h', key: 'main.h', isLeaf: true },
      { title: 'stm32f1xx_hal_conf.h', key: 'hal_conf.h', isLeaf: true },
      { title: 'stm32f1xx_it.h', key: 'it.h', isLeaf: true }
    ]
  },
  {
    title: 'Src',
    key: 'src',
    children: [
      { title: 'main.c', key: 'main.c', isLeaf: true },
      { title: 'stm32f1xx_hal_msp.c', key: 'hal_msp.c', isLeaf: true },
      { title: 'stm32f1xx_it.c', key: 'it.c', isLeaf: true },
      { title: 'system_stm32f1xx.c', key: 'system.c', isLeaf: true }
    ]
  },
  {
    title: 'Drivers',
    key: 'drivers',
    children: [
      { title: 'STM32F1xx_HAL_Driver', key: 'hal_driver' },
      { title: 'CMSIS', key: 'cmsis' }
    ]
  }
]);

// 获取库文件复制模式文本
function getLibraryCopyModeText(mode) {
  const modeMap = {
    'copy-all': '复制所有使用的库文件到项目文件夹',
    'copy-necessary': '仅复制必要的库文件',
    'reference-only': '在配置文件中添加库文件引用'
  };
  return modeMap[mode] || '未设置';
}

// 获取代码模板文本
function getCodeTemplateText(template) {
  const templateMap = {
    'basic': '基础模板',
    'advanced': '高级模板',
    'custom': '自定义模板'
  };
  return templateMap[template] || '未选择';
}

// 获取代码风格文本
function getCodeStyleText(style) {
  const styleMap = {
    'camelCase': '驼峰命名',
    'snake_case': '下划线命名',
    'PascalCase': '帕斯卡命名'
  };
  return styleMap[style] || '未选择';
}

// 获取注释语言文本
function getCommentLanguageText(language) {
  const languageMap = {
    'chinese': '中文',
    'english': '英文',
    'mixed': '中英混合'
  };
  return languageMap[language] || '未选择';
}

// 生成代码
function generateCode() {
  console.log('生成代码:', {
    stm32CubeSettings,
    generatedFilesSettings,
    halSettings,
    advancedSettings
  });
}

// 预览代码
function previewCode() {
  console.log('预览代码');
}

// 重置设置
function resetSettings() {
  Object.assign(stm32CubeSettings, {
    libraryCopyMode: 'copy-necessary'
  });

  Object.assign(generatedFilesSettings, {
    generatePeripheralFiles: true,
    backupPreviousFiles: true,
    keepUserCode: true,
    deleteUnusedFiles: false
  });

  Object.assign(halSettings, {
    setFreePinsAsAnalog: true,
    enableFullAssert: false
  });

  Object.assign(advancedSettings, {
    codeTemplate: 'basic',
    codeStyle: 'camelCase',
    commentLanguage: 'chinese'
  });

  console.log('重置代码生成设置');
}

// 导出设置
function exportSettings() {
  const config = {
    stm32CubeSettings,
    generatedFilesSettings,
    halSettings,
    advancedSettings
  };

  const configStr = JSON.stringify(config, null, 2);
  const blob = new Blob([configStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'code-gen-config.json';
  a.click();

  URL.revokeObjectURL(url);
  console.log('导出代码生成配置');
}
</script>

<style lang="less" scoped>
.code-gen-container {
  padding: 24px;
  height: 100vh;
  overflow: hidden;
  background: #fff;
}

.page-header {
  margin-bottom: 24px;

  h2 {
    margin: 0 0 8px 0;
    color: #1890ff;
  }

  p {
    margin: 0;
    color: #666;
  }
}

.content-section {
  height: calc(100vh - 120px);
  overflow-y: auto;
}

.config-panel {
  .config-card {
    margin-bottom: 16px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.preview-panel {
  height: 100%;
  display: flex;
  flex-direction: column;

  .preview-card {
    flex: 1;
    margin-bottom: 16px;

    .preview-content {
      h3 {
        margin: 16px 0 8px 0;
        color: #333;
        font-size: 14px;
        font-weight: bold;
      }

      h3:first-child {
        margin-top: 0;
      }
    }
  }

  .action-buttons {
    text-align: center;
    padding: 16px 0;
  }
}

.radio-description,
.checkbox-description {
  color: #666;
  font-size: 12px;
  margin-top: 4px;
  font-weight: normal;
}

.file-item,
.folder-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.file-item {
  color: #1890ff;
}

.folder-item {
  color: #52c41a;
}

// 滚动条样式
.content-section::-webkit-scrollbar {
  width: 6px;
}

.content-section::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.content-section::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.content-section::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
