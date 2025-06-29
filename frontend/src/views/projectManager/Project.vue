<template>
  <div class="project-manager-container">
    <div class="page-header">
      <h2>项目管理</h2>
      <p>配置项目的基本设置和参数</p>
    </div>

    <div class="content-section">
      <a-row :gutter="24">
        <!-- 左侧配置区域 -->
        <a-col :span="12">
          <div class="config-panel">
            <!-- Project Settings -->
            <a-card title="Project Settings" class="config-card">
              <a-form layout="vertical">
                <a-form-item label="Project Name">
                  <a-input v-model="projectSettings.projectName" placeholder="输入项目名称" />
                </a-form-item>

                <a-form-item label="Project Location">
                  <a-input v-model="projectSettings.projectLocation" placeholder="项目路径" />
                </a-form-item>

                <a-form-item label="Application Structure">
                  <a-select v-model="projectSettings.applicationStructure" placeholder="选择应用结构">
                    <a-select-option value="basic">基础结构</a-select-option>
                    <a-select-option value="advanced">高级结构</a-select-option>
                    <a-select-option value="custom">自定义结构</a-select-option>
                  </a-select>
                </a-form-item>

                <a-form-item label="Toolchain Folder Location">
                  <a-input v-model="projectSettings.toolchainFolderLocation" placeholder="工具链文件夹路径" />
                </a-form-item>

                <a-form-item label="Toolchain / IDE">
                  <a-select v-model="projectSettings.toolchain" placeholder="选择工具链/IDE">
                    <a-select-option value="keil">Keil MDK</a-select-option>
                    <a-select-option value="iar">IAR EWARM</a-select-option>
                    <a-select-option value="gcc">GCC</a-select-option>
                    <a-select-option value="stm32cubeide">STM32CubeIDE</a-select-option>
                  </a-select>
                </a-form-item>
              </a-form>
            </a-card>

            <!-- Linker Settings -->
            <a-card title="Linker Settings" class="config-card">
              <a-form layout="vertical">
                <a-form-item label="Minimum Heap Size">
                  <a-input-number
                    v-model="linkerSettings.minHeapSize"
                    :min="0"
                    :max="65536"
                    style="width: 100%"
                    placeholder="最小堆大小"
                  />
                  <span class="unit-text">bytes</span>
                </a-form-item>

                <a-form-item label="Minimum Stack Size">
                  <a-input-number
                    v-model="linkerSettings.minStackSize"
                    :min="0"
                    :max="65536"
                    style="width: 100%"
                    placeholder="最小栈大小"
                  />
                  <span class="unit-text">bytes</span>
                </a-form-item>
              </a-form>
            </a-card>

            <!-- Thread-safe Settings -->
            <a-card title="Thread-safe Settings" class="config-card">
              <a-form layout="vertical">
                <a-form-item label="Cortex-M3NS">
                  <a-switch v-model="threadSafeSettings.cortexM3NS" />
                </a-form-item>

                <a-form-item label="Enable multi-threaded support">
                  <a-switch v-model="threadSafeSettings.enableMultiThreaded" />
                </a-form-item>

                <a-form-item label="Thread-safe Locking Strategy">
                  <a-select v-model="threadSafeSettings.lockingStrategy" placeholder="选择锁定策略">
                    <a-select-option value="mutex">互斥锁</a-select-option>
                    <a-select-option value="semaphore">信号量</a-select-option>
                    <a-select-option value="critical">临界区</a-select-option>
                    <a-select-option value="none">无</a-select-option>
                  </a-select>
                </a-form-item>
              </a-form>
            </a-card>

            <!-- Mcu and Firmware Package -->
            <a-card title="Mcu and Firmware Package" class="config-card">
              <a-form layout="vertical">
                <a-form-item label="Mcu Reference">
                  <a-select v-model="mcuSettings.mcuReference" placeholder="选择MCU型号">
                    <a-select-option value="STM32F103C8T6">STM32F103C8T6</a-select-option>
                    <a-select-option value="STM32F103RCT6">STM32F103RCT6</a-select-option>
                    <a-select-option value="STM32F407VGT6">STM32F407VGT6</a-select-option>
                    <a-select-option value="STM32F429ZIT6">STM32F429ZIT6</a-select-option>
                  </a-select>
                </a-form-item>

                <a-form-item label="Firmware Package Name and Version">
                  <a-input v-model="mcuSettings.firmwarePackage" placeholder="固件包名称和版本" />
                </a-form-item>
              </a-form>
            </a-card>
          </div>
        </a-col>

        <!-- 右侧预览区域 -->
        <a-col :span="12">
          <div class="preview-panel">
            <a-card title="项目配置预览" class="preview-card">
              <div class="preview-content">
                <h3>项目信息</h3>
                <a-descriptions :column="1" bordered>
                  <a-descriptions-item label="项目名称">
                    {{ projectSettings.projectName || '未设置' }}
                  </a-descriptions-item>
                  <a-descriptions-item label="项目路径">
                    {{ projectSettings.projectLocation || '未设置' }}
                  </a-descriptions-item>
                  <a-descriptions-item label="工具链">
                    {{ getToolchainText(projectSettings.toolchain) }}
                  </a-descriptions-item>
                  <a-descriptions-item label="MCU型号">
                    {{ mcuSettings.mcuReference || '未选择' }}
                  </a-descriptions-item>
                </a-descriptions>

                <h3>内存配置</h3>
                <a-descriptions :column="1" bordered>
                  <a-descriptions-item label="最小堆大小">
                    {{ linkerSettings.minHeapSize || 0 }} bytes
                  </a-descriptions-item>
                  <a-descriptions-item label="最小栈大小">
                    {{ linkerSettings.minStackSize || 0 }} bytes
                  </a-descriptions-item>
                </a-descriptions>

                <h3>线程安全设置</h3>
                <a-descriptions :column="1" bordered>
                  <a-descriptions-item label="Cortex-M3NS">
                    {{ threadSafeSettings.cortexM3NS ? '启用' : '禁用' }}
                  </a-descriptions-item>
                  <a-descriptions-item label="多线程支持">
                    {{ threadSafeSettings.enableMultiThreaded ? '启用' : '禁用' }}
                  </a-descriptions-item>
                  <a-descriptions-item label="锁定策略">
                    {{ getLockingStrategyText(threadSafeSettings.lockingStrategy) }}
                  </a-descriptions-item>
                </a-descriptions>
              </div>
            </a-card>

            <!-- 操作按钮 -->
            <div class="action-buttons">
              <a-space>
                <a-button type="primary" @click="saveProjectSettings">保存配置</a-button>
                <a-button @click="resetProjectSettings">重置配置</a-button>
                <a-button @click="exportProjectConfig">导出配置</a-button>
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

// 项目设置
const projectSettings = reactive({
  projectName: '',
  projectLocation: '',
  applicationStructure: 'basic',
  toolchainFolderLocation: '',
  toolchain: 'keil'
});

// 链接器设置
const linkerSettings = reactive({
  minHeapSize: 1024,
  minStackSize: 512
});

// 线程安全设置
const threadSafeSettings = reactive({
  cortexM3NS: false,
  enableMultiThreaded: false,
  lockingStrategy: 'none'
});

// MCU设置
const mcuSettings = reactive({
  mcuReference: 'STM32F103C8T6',
  firmwarePackage: 'STM32Cube_FW_F1_V1.8.5'
});

// 获取工具链文本
function getToolchainText(toolchain) {
  const toolchainMap = {
    'keil': 'Keil MDK',
    'iar': 'IAR EWARM',
    'gcc': 'GCC',
    'stm32cubeide': 'STM32CubeIDE'
  };
  return toolchainMap[toolchain] || '未选择';
}

// 获取锁定策略文本
function getLockingStrategyText(strategy) {
  const strategyMap = {
    'mutex': '互斥锁',
    'semaphore': '信号量',
    'critical': '临界区',
    'none': '无'
  };
  return strategyMap[strategy] || '未设置';
}

// 保存项目设置
function saveProjectSettings() {
  console.log('保存项目设置:', {
    projectSettings,
    linkerSettings,
    threadSafeSettings,
    mcuSettings
  });
}

// 重置项目设置
function resetProjectSettings() {
  Object.assign(projectSettings, {
    projectName: '',
    projectLocation: '',
    applicationStructure: 'basic',
    toolchainFolderLocation: '',
    toolchain: 'keil'
  });

  Object.assign(linkerSettings, {
    minHeapSize: 1024,
    minStackSize: 512
  });

  Object.assign(threadSafeSettings, {
    cortexM3NS: false,
    enableMultiThreaded: false,
    lockingStrategy: 'none'
  });

  Object.assign(mcuSettings, {
    mcuReference: 'STM32F103C8T6',
    firmwarePackage: 'STM32Cube_FW_F1_V1.8.5'
  });

  console.log('重置项目设置');
}

// 导出项目配置
function exportProjectConfig() {
  const config = {
    projectSettings,
    linkerSettings,
    threadSafeSettings,
    mcuSettings
  };

  const configStr = JSON.stringify(config, null, 2);
  const blob = new Blob([configStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'project-config.json';
  a.click();

  URL.revokeObjectURL(url);
  console.log('导出项目配置');
}
</script>

<style lang="less" scoped>
.project-manager-container {
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

.unit-text {
  margin-left: 8px;
  color: #666;
  font-size: 12px;
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
